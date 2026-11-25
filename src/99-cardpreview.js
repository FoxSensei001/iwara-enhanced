// 视频 / 图库卡片右下角的「⋯」：点开一张预览卡片，不离开列表就能凑近看一眼（照 LoveIwara 应用的卡片预览弹窗）。
//
// 卡片：作者那一行最右边加一枚 ⋯（悬停设备上平时半透明、指到卡片才亮；触屏常亮）。克隆出来的分页卡片同样有。
// 弹窗里有：
//   · 封面：视频是大封面（时长 / R-18 角标），封面上轮播这条视频自己的那组缩略图（large 尺寸、原比例，不拉伸）；图库是翻页器——一张一张横滑（触屏滑动、触控板横扫、悬停箭头、← →），
//     右下角「第几张 / 共几张」，点某一张直接用大图查看器从这张开始看；
//   · 完整标题（点了进详情页）、作者（点了进主页）、统计（R-18 / 私有 / 播放 / 点赞 / 评论 / 时长 / 张数 / 发布时间）、
//     简介（长了折起来，可展开）、标签（点了去对应列表）；
//   · 底部一行动作：点赞（乐观更新，失败回滚，顺手改掉卡片上的点赞数）、复制链接、新标签打开、「打开」。
// 版式：
//   · 宽屏（≥ 860px）：左封面右信息，封面贴满左侧整条，右栏滚动，动作行浮在右栏底部；
//   · 中等宽度：居中卡片，封面在上；
//   · 手机（< 600px）：底部弹层，顶上一条把手，往下拖（或在内容顶端继续下拉）关闭，动作行让出底部安全区。
// 打开时从卡片的位置放大出来，关上缩回卡片（卡片已经不在视野里就原地淡出）；系统要求减少动效时只淡入淡出。
// 数据：先用站点列表请求里旁听到的那一条（标题、封面、作者、统计当场就有），同时拉一次详情补上简介、标签、点赞状态与图库文件。
// 可在设置里单独关掉（功能名 cardPreview）。

(() => {
  defineStrings(
    {
      cpMore: '预览与更多', cpClose: '关闭', cpOpen: '打开', cpNewTab: '新标签打开', cpCopy: '复制链接', cpCopied: '已复制',
      cpLike: '点赞', cpUnlike: '取消点赞', cpLogin: '登录后才能点赞', cpLikeFail: '操作失败，请重试', cpFail: '详情加载失败', cpRetry: '重试',
      cpPrivate: '私有', cpExpand: '展开', cpCollapse: '收起', cpNoTitle: '（无标题）', cpPrev: '上一张', cpNext: '下一张', cpViewImage: '查看大图',
      cpUnknown: '未知用户', cpExternal: '外链视频',
    },
    {
      cpMore: 'Preview & more', cpClose: 'Close', cpOpen: 'Open', cpNewTab: 'Open in new tab', cpCopy: 'Copy link', cpCopied: 'Copied',
      cpLike: 'Like', cpUnlike: 'Unlike', cpLogin: 'Log in to like', cpLikeFail: 'Failed, please retry', cpFail: 'Failed to load details', cpRetry: 'Retry',
      cpPrivate: 'Private', cpExpand: 'Show more', cpCollapse: 'Show less', cpNoTitle: '(Untitled)', cpPrev: 'Previous', cpNext: 'Next', cpViewImage: 'View image',
      cpUnknown: 'Unknown user', cpExternal: 'External',
    },
    {
      cpMore: 'プレビューとその他', cpClose: '閉じる', cpOpen: '開く', cpNewTab: '新しいタブで開く', cpCopy: 'リンクをコピー', cpCopied: 'コピーしました',
      cpLike: 'いいね', cpUnlike: 'いいねを取り消す', cpLogin: 'ログインするといいねできます', cpLikeFail: '失敗しました。もう一度お試しください', cpFail: '詳細を読み込めませんでした', cpRetry: '再試行',
      cpPrivate: '非公開', cpExpand: 'もっと見る', cpCollapse: '折りたたむ', cpNoTitle: '（無題）', cpPrev: '前へ', cpNext: '次へ', cpViewImage: '大きい画像を見る',
      cpUnknown: '不明なユーザー', cpExternal: '外部動画',
    },
  );

  const CARD = '.videoTeaser:not(.videoTeaser--wide), .imageTeaser';
  const IMG = 'https://i.iwara.tv/image';
  const ANIM_MS = 380;

  // ── 旁听：列表里的每一条、详情接口的返回 ───────────────────────────
  const items = new Map(); // `${kind}:${id}` → 列表里的那一条
  const details = new Map(); // `${kind}:${id}` → 详情
  siteData.onApi((url, json) => {
    if (!json || typeof json !== 'object') return;
    const m = /\/(video|image)\/([A-Za-z0-9]+)(?:\?|$)/.exec(url);
    if (m && json.id === m[2]) { details.set(m[1] + ':' + m[2], json); return; }
    if (Array.isArray(json.results)) {
      for (const it of json.results) {
        if (!it || typeof it.id !== 'string') continue;
        const kind = it.file || it.embedUrl !== undefined ? 'video' : 'numImages' in it ? 'image' : null;
        if (kind) items.set(kind + ':' + it.id, it);
      }
    }
  });

  // ── 小工具 ─────────────────────────────────────────────────────────
  const SVG = {
    more: '<circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/>',
    x: '<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>',
    heartOn: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" fill="currentColor" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    chat: '<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4.5 3.5V17H6a2 2 0 0 1-2-2V6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    clock: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    cal: '<path d="M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm-1 4h16M8 4v4m8-4v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    pics: '<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm0 10 4.5-4.5a1.5 1.5 0 0 1 2 0L16 17m-2-3 1.5-1.5a1.5 1.5 0 0 1 2 0L20 15M15 8.5h.01" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    lock: '<path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    ext: '<path d="M14 5h5v5m0-5-8 8M11 6H6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    right: '<path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    left: '<path d="m15 6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    play: '<path d="M8 5.8v12.4a.6.6 0 0 0 .9.5l9.8-6.2a.6.6 0 0 0 0-1L8.9 5.3a.6.6 0 0 0-.9.5Z" fill="currentColor"/>',
  };
  const ico = (name, size = 16) => {
    const tpl = document.createElement('template');
    tpl.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" aria-hidden="true" focusable="false">${SVG[name]}</svg>`;
    return tpl.content.firstChild;
  };
  // 数字 / 时长 / 相对时间 / 缩略图地址：与分页卡片同一套（92-pager.js 的 iwePagerKit.fmt）
  const F = () => iwePagerKit.fmt;
  const fmtNum = (n) => F().num(n), fmtDur = (x) => F().dur(x), fmtAgo = (x) => F().ago(x);
  const thumbOf = (it, isImg) => F().thumbOf(it, isImg), jpgOf = (k, f) => F().jpgOf(k, f), setText = (el, tx) => F().setText(el, tx);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const abs = (u) => (u && u.startsWith('//') ? 'https:' + u : u || '');
  const loggedIn = () => !!localStorage.getItem('token');
  const fullDate = (iso) => { const d = new Date(iso); return isFinite(d) ? d.toLocaleString(localStorage.getItem('locale') || navigator.language, { dateStyle: 'medium', timeStyle: 'short' }) : ''; };
  // 标签名：走词库（50-tags.js 的 tagDict）译成界面语言，与「按标签过滤」的「显示原名」设置一致；没有译名就用原 id
  const tagName = (id) => {
    if (store.get('tagfilterShowOriginal', false) === true) return id;
    try { return tagDict.name(id) || id; } catch { return id; }
  };

  function refOf(card) {
    const a = card.querySelector('a[href^="/video/"], a[href^="/image/"]');
    const m = a && /^\/(video|image)\/([A-Za-z0-9]+)/.exec(a.getAttribute('href'));
    return m ? { kind: m[1], id: m[2], href: a.getAttribute('href') } : null;
  }
  // 卡片上现成的那一份（列表请求没旁听到时兜底）：标题、封面、作者
  function seedFromCard(card) {
    const T = card.classList.contains('imageTeaser') ? 'imageTeaser' : 'videoTeaser';
    const title = card.querySelector(`.${T}__title`);
    const img = card.querySelector(`.${T}__thumbnail img`);
    const av = card.querySelector('a.avatar img');
    const un = card.querySelector('a.username');
    const num = (sel) => { const e = card.querySelector(sel); return e ? e.textContent.trim() : ''; };
    return {
      title: title ? (title.getAttribute('title') || title.textContent.trim()) : '',
      thumb: img ? abs(img.currentSrc || img.getAttribute('src')) : '',
      avatar: av ? abs(av.getAttribute('src')) : '',
      userName: un ? (un.getAttribute('title') || un.textContent.trim()) : '',
      userHref: un ? un.getAttribute('href') : '',
      views: num('.views .text'), likes: num('.likes .text'), duration: num('.duration .text'),
      r18: !!card.querySelector('.rating'),
    };
  }
  const coverOf = (it, kind) => {
    if (!it) return '';
    const raw = thumbOf(it, kind === 'image');
    return abs(raw);
  };
  const avatarOf = (u) => (u && u.avatar && u.avatar.id ? abs(jpgOf('avatar', u.avatar)) : '/images/default-avatar.jpg');
  const largeOf = (f) => `${IMG}/large/${f.id}/${f.id}.jpg`;

  // ── 卡片上的 ⋯ ────────────────────────────────────────────────────
  function mountButton(card) {
    const bottom = card.querySelector(':scope > .videoTeaser__content > .videoTeaser__bottom, :scope > .imageTeaser__bottom');
    if (!bottom || bottom.querySelector(':scope > .iwe-pv-more')) return;
    bottom.classList.add('iwe-pv-host');
    bottom.append(h('button.iwe-pv-more', {
      type: 'button', title: t('cpMore'), 'aria-label': t('cpMore'), 'aria-haspopup': 'dialog',
      onclick: (e) => { e.preventDefault(); e.stopPropagation(); open(card, e.currentTarget); },
    }, ico('more', 18)));
  }

  // ── 弹窗 ───────────────────────────────────────────────────────────
  let cur = null; // 当前打开的那一只：{ root, panel, close, ... }

  function layoutOf() {
    const w = innerWidth;
    return w < 600 ? 'sheet' : w >= 860 ? 'wide' : 'narrow';
  }

  function open(card, trigger) {
    const ref = refOf(card);
    if (!ref) return;
    if (cur) cur.close(true);
    const key = ref.kind + ':' + ref.id;
    const seed = seedFromCard(card);
    const s = {
      ref, card, trigger, key, seed, layout: layoutOf(),
      item: details.get(key) || items.get(key) || null,
      detail: details.get(key) || null, loading: false, failed: false,
      liked: null, likeCount: null, likeBusy: false, galleryAt: 0, closed: false,
    };
    cur = s;

    s.cover = h('div.iwe-pv-cover');
    s.body = h('div.iwe-pv-body');
    s.bar = h('div.iwe-pv-bar');
    s.scroll = h('div.iwe-pv-scroll', s.layout === 'wide' ? null : s.cover, s.body, s.bar);
    s.panel = h('div.iwe-pv-panel', { role: 'dialog', 'aria-modal': 'true', 'aria-label': seed.title || t('cpMore'), tabindex: '-1', 'data-layout': s.layout, 'data-kind': ref.kind },
      s.layout === 'sheet' ? h('div.iwe-pv-grab', h('span')) : null,
      s.layout === 'wide' ? s.cover : null,
      s.scroll);
    s.closeBtn = h('button.iwe-pv-x', { type: 'button', title: t('cpClose'), 'aria-label': t('cpClose'), onclick: () => close() }, ico('x', 18));
    s.panel.append(s.closeBtn);
    s.root = h('div.iwe-pv', { 'data-layout': s.layout }, h('div.iwe-pv-scrim', { onclick: () => close() }), s.panel);

    const close = s.close = (instant) => {
      if (s.closed) return;
      s.closed = true;
      removeEventListener('keydown', onKey, true);
      removeEventListener('resize', onResize);
      if (s.ro) s.ro.disconnect();
      stopSlides(s);
      unlockScroll();
      if (cur === s) cur = null;
      const done = () => s.root.remove();
      if (instant || reduced()) { s.root.classList.remove('in'); setTimeout(done, instant ? 0 : 200); }
      else animateOut(s).then(done);
      if (!instant && s.trigger && s.trigger.isConnected) s.trigger.focus({ preventScroll: true });
    };
    const onKey = (e) => {
      if (s.closed || (iweImageViewer && iweImageViewer.isOpen && iweImageViewer.isOpen())) return;
      if (document.querySelector('.iwe-tr-menu.open')) return; // 翻译的语言菜单开着：键盘归它（Esc 只关菜单），见 98-translate.js
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (s.pager && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !/INPUT|TEXTAREA/.test((e.target && e.target.tagName) || '')) {
        e.preventDefault(); s.pager.go(s.galleryAt + (e.key === 'ArrowLeft' ? -1 : 1));
      } else if (e.key === 'Tab') trapFocus(e, s.panel);
    };
    // 跨过断点就换版式（转屏、拖窗口）：重开一次最省事，状态都在缓存里
    const onResize = debounce(() => { if (!s.closed && layoutOf() !== s.layout) { const c = s.card, tr = s.trigger; close(true); if (c.isConnected) open(c, tr); } }, 150);

    renderCover(s); renderBody(s); renderBar(s);
    document.body.append(s.root);
    lockScroll();
    addEventListener('keydown', onKey, true);
    addEventListener('resize', onResize);
    if (s.layout === 'sheet') bindSheetDrag(s);
    animateIn(s);
    s.panel.focus({ preventScroll: true });
    if (!s.detail) loadDetail(s);
    else { applyDetail(s); }
  }

  function trapFocus(e, panel) {
    const f = [...panel.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  async function loadDetail(s) {
    s.loading = true; s.failed = false; syncProgress(s); renderBody(s); renderBar(s);
    const path = `/${s.ref.kind}/${s.ref.id}`;
    try {
      let d;
      try { d = await api.call(path, { auth: loggedIn() }); }
      catch (e) { if (e && e.status === 401) d = await api.call(path, { auth: false }); else throw e; }
      details.set(s.key, d);
      if (s.closed) return;
      s.detail = d;
      applyDetail(s);
    } catch (err) {
      console.error('[iwe] cardPreview', err);
      if (s.closed) return;
      s.loading = false; s.failed = true; syncProgress(s); renderBody(s); renderBar(s);
    }
  }
  function applyDetail(s) {
    s.loading = false; s.failed = false;
    s.item = s.detail;
    if (s.liked === null) { s.liked = !!s.detail.liked; s.likeCount = +s.detail.numLikes || 0; }
    if (s.ref.kind === 'image' && Array.isArray(s.detail.files) && s.detail.files.length && !s.pager) renderCover(s);
    else if (s.ref.kind === 'video' && s.coverKey !== coverKeyOf(s.item)) renderCover(s);
    else { syncProgress(s); ensureAnimated(s); }
    renderBody(s); renderBar(s);
  }

  // ── 视频封面：按视频真实比例的「画框」──
  // 站点的 thumbnail 尺寸（卡片上那张）和动图预览 preview.webp 一律是 220×160——不是裁的，是整帧压扁进去的
  // （1920×1080、竖屏 1080×2340 都一样，2026-11-24 实测），放进封面不是变形就是放大发糊。
  // 所以封面里放一只按视频宽高比算出来的画框（在封面里等比放进去，竖屏两边是模糊的封面），
  // 画框里只放 large（870 宽、保持原比例）；那张压扁的小图只当糊掉的底。
  function frameOf(it) {
    const f = it && it.file, c = it && it.customThumbnail;
    if (f && f.width && f.height) return f.width / f.height;
    if (c && c.width && c.height) return c.width / c.height;
    return 16 / 9;
  }
  function largeCoverOf(it) {
    if (!it) return '';
    const c = it.customThumbnail;
    if (c && c.id) return `${IMG}/large/${c.id}/${String(c.name || c.id).replace(/\.[^.]+$/, '')}.jpg`;
    if (it.file && it.file.id) return `${IMG}/large/${it.file.id}/thumbnail-${String(it.thumbnail || 0).padStart(2, '0')}.jpg`;
    return '';
  }
  // 封面换不换：主图地址 + 画框比例都没变就不重摆（拉到详情后常常完全一样，重摆会闪）
  const coverKeyOf = (it) => (it && it.embedUrl ? abs(coverOf(it, 'video')) : largeCoverOf(it)) + '|' + frameOf(it);
  function fitFrame(s) {
    const fr = s.frame, box = s.cover;
    if (!fr || !box.isConnected) return;
    const W = box.clientWidth, H = box.clientHeight, ar = s.frameAr || 16 / 9;
    if (!W || !H) return;
    const w = W / H > ar ? H * ar : W;
    fr.style.width = w + 'px'; fr.style.height = w / ar + 'px';
  }
  function buildVideoCover(s, a) {
    const it = s.item;
    stopSlides(s);
    s.frameAr = frameOf(it);
    const small = s.seed.thumb || abs(coverOf(it, 'video'));
    const large = largeCoverOf(it);
    const ext = it && it.embedUrl ? abs(coverOf(it, 'video')) : '';
    // 竖屏 / 非 16:9 时两边的底：同一张封面放大糊掉
    a.append(h('img.iwe-pv-backdrop', { src: small || ext, alt: '', draggable: 'false', 'aria-hidden': 'true' }));
    const fr = s.frame = h('div.iwe-pv-frame');
    // 画框里只放保持原比例的 large：卡片上那张 220×160 是压扁的，摆进画框就得拉伸，只拿它当糊掉的底。
    // large 到手前先看见糊底，到手后淡入（缓存里有的一帧就到）
    const main = ext || large;
    if (main) {
      const img = h('img.iwe-pv-img', { alt: '', draggable: 'false', decoding: 'async' });
      img.addEventListener('load', () => { img.classList.add('in'); a.querySelector('.iwe-pv-backdrop').src = main; }, { once: true });
      img.addEventListener('error', () => img.remove(), { once: true });
      img.src = main;
      fr.append(img);
    }
    a.append(fr);
    s.coverKey = coverKeyOf(it);
    if (!s.ro) { s.ro = new ResizeObserver(() => fitFrame(s)); }
    s.ro.disconnect(); s.ro.observe(s.cover);
    fitFrame(s);
    s.animUrl = null;
    ensureAnimated(s);
  }

  // 动态预览：轮播这条视频自己的那组缩略图（站点每条视频生成 numThumbnails 张，large 尺寸 870 宽、保持原比例），
  // 照应用里 AnimatedPreview 的做法。不用站点的 preview.webp——那是压扁进 220×160 的小动图，放大到封面尺寸
  // 怎么摆都是拉伸 + 发糊（用户 2026-11-24：「尽量不要拉伸，不好看」）。
  // 帧一张接一张地预载（不一次性打出十几个请求），只轮到已经到手的帧；交叉淡入，1.1 秒一帧。
  // 站外视频、不到 2 张缩略图、系统要求减少动效时不轮播，留静态封面。
  const SLIDE_MS = 1100;
  function stopSlides(s) { clearInterval(s.slideT); clearTimeout(s.slideStart); s.slideT = s.slideStart = null; s.slideGen = (s.slideGen || 0) + 1; }
  function ensureAnimated(s) {
    const it = s.item;
    if (s.ref.kind !== 'video' || !s.frame || !it || it.embedUrl || !it.file || !it.file.id || reduced()) return;
    const n = Math.min(+it.file.numThumbnails || 0, 24);
    if (n < 2) return;
    const key = it.file.id + ':' + n + ':' + (it.thumbnail || 0);
    if (s.animUrl === key) return;
    s.animUrl = key;
    stopSlides(s);
    const gen = s.slideGen, fr = s.frame;
    const start = (+it.thumbnail || 0) % n;
    const pad = (i) => String(i).padStart(2, '0');
    // 第 0 帧就是封面本身（设了自定义封面的，封面之后接着放视频自己的缩略图）
    const custom = !!(it.customThumbnail && it.customThumbnail.id);
    const order = [];
    for (let k = custom ? 0 : 1; k < n; k++) order.push((start + k) % n);
    const frames = [fr.querySelector('.iwe-pv-img')].filter(Boolean);
    let cur = 0;
    const loadNext = (k) => {
      if (k >= order.length || s.closed || s.slideGen !== gen) return;
      const img = h('img.iwe-pv-slide', { alt: '', draggable: 'false', decoding: 'async' });
      img.addEventListener('load', () => { if (s.slideGen !== gen) return; frames.push(img); kick(); loadNext(k + 1); }, { once: true });
      img.addEventListener('error', () => { img.remove(); loadNext(k + 1); }, { once: true });
      img.src = `${IMG}/large/${it.file.id}/thumbnail-${pad(order[k])}.jpg`;
      fr.append(img);
    };
    const step = () => {
      if (s.closed || s.slideGen !== gen || frames.length < 2) return;
      const prev = frames[cur];
      cur = (cur + 1) % frames.length;
      const next = frames[cur];
      // 封面那张（.iwe-pv-img）垫在最底下常亮，轮播帧在它上面淡入淡出
      if (next.classList.contains('iwe-pv-slide')) { fr.append(next); requestAnimationFrame(() => next.classList.add('in')); }
      if (prev !== next && prev.classList.contains('iwe-pv-slide')) setTimeout(() => prev.classList.remove('in'), next.classList.contains('iwe-pv-slide') ? 400 : 0);
    };
    // 先让人看清封面，再开始动
    const kick = () => { if (!s.slideT && !s.slideStart) s.slideStart = setTimeout(() => { s.slideStart = null; if (s.slideGen === gen) s.slideT = setInterval(step, SLIDE_MS); }, 700); };
    loadNext(0);
  }

  // ── 封面 ──
  function renderCover(s) {
    const { ref, seed } = s;
    const it = s.item;
    const files = ref.kind === 'image' && s.detail && Array.isArray(s.detail.files) ? s.detail.files : null;
    clear(s.cover);
    s.pager = null;
    if (files && files.length) {
      s.cover.classList.add('pager');
      buildPager(s, files);
    } else {
      s.cover.classList.remove('pager');
      const a = s.animLink = h('a.iwe-pv-coverlink', { href: ref.href, 'aria-label': t('cpOpen'), onclick: (e) => go(e, s, ref.href) });
      s.frame = null;
      if (ref.kind === 'video') {
        buildVideoCover(s, a);
        a.append(h('span.iwe-pv-play', ico('play', 22)));
      } else {
        // 图库还没拿到文件列表：先摆封面（完整显示，不裁），文件到了换成翻页器
        const src = coverOf(it, ref.kind) || seed.thumb;
        a.append(h('img.iwe-pv-backdrop', { src, alt: '', draggable: 'false', 'aria-hidden': 'true' }), h('img.iwe-pv-img.in.contain', { src, alt: '', draggable: 'false', decoding: 'async' }));
      }
      s.cover.append(a);
    }
    // 角标：时长 / 张数 / R-18
    const dur = ref.kind === 'video' && it && it.file && it.file.duration ? fmtDur(it.file.duration) : seed.duration;
    const r18 = it ? it.rating === 'ecchi' : seed.r18;
    if (r18) s.cover.append(h('span.iwe-pv-tag.r18', 'R-18'));
    if (ref.kind === 'video' && dur) s.cover.append(h('span.iwe-pv-tag.dur', ico('clock', 12), dur));
    if (ref.kind === 'image' && !s.pager && it && it.numImages > 1) s.cover.append(h('span.iwe-pv-tag.dur', ico('pics', 12), String(it.numImages)));
    syncProgress(s);
  }
  // 详情还在路上：封面下沿走一条细进度条
  function syncProgress(s) {
    const want = s.loading || (!s.detail && !s.failed);
    const el = s.cover.querySelector(':scope > .iwe-pv-progress');
    if (want && !el) s.cover.append(h('span.iwe-pv-progress'));
    else if (!want && el) el.remove();
  }

  function buildPager(s, files) {
    const track = h('div.iwe-pv-track', { tabindex: '-1' });
    const count = h('span.iwe-pv-tag.dur.count');
    files.forEach((f, i) => {
      const img = h('img', { src: i < 2 ? largeOf(f) : '', 'data-src': largeOf(f), alt: '', draggable: 'false', decoding: 'async' });
      // 加载态：没到手之前转圈；失败自动重试一次，再失败给个提示，不再一片空白
      const slide = h('button.iwe-pv-page' + (i < 2 ? '.loading' : ''), { type: 'button', 'aria-label': `${t('cpViewImage')} ${i + 1}/${files.length}`,
        onclick: () => { if (iweImageViewer && iweImageViewer.openFiles) iweImageViewer.openFiles(files, i); } }, img);
      img.addEventListener('load', () => slide.classList.remove('loading', 'bad'));
      img.addEventListener('error', () => {
        if (!img.getAttribute('src')) return;
        if (!img._r) { img._r = 1; setTimeout(() => { img.src = largeOf(f) + '?r=1'; }, 1200); return; }
        slide.classList.remove('loading'); slide.classList.add('bad');
      });
      track.append(slide);
    });
    const prev = h('button.iwe-pv-nav.prev', { type: 'button', title: t('cpPrev'), 'aria-label': t('cpPrev'), onclick: () => pager.go(s.galleryAt - 1) }, ico('left', 20));
    const next = h('button.iwe-pv-nav.next', { type: 'button', title: t('cpNext'), 'aria-label': t('cpNext'), onclick: () => pager.go(s.galleryAt + 1) }, ico('right', 20));
    const paint = () => {
      count.replaceChildren(ico('pics', 12), `${s.galleryAt + 1} / ${files.length}`);
      prev.disabled = s.galleryAt <= 0; next.disabled = s.galleryAt >= files.length - 1;
      // 当前张前后各一张提前加载
      for (let j = s.galleryAt - 1; j <= s.galleryAt + 2; j++) { const im = track.children[j] && track.children[j].firstChild; if (im && !im.getAttribute('src')) { track.children[j].classList.add('loading'); im.src = im.dataset.src; } }
    };
    const pager = s.pager = {
      go(i) { i = Math.max(0, Math.min(files.length - 1, i)); track.scrollTo({ left: i * track.clientWidth, behavior: reduced() ? 'auto' : 'smooth' }); },
    };
    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      if (i !== s.galleryAt) { s.galleryAt = i; paint(); }
    }, { passive: true });
    add(s.cover, [track, files.length > 1 && prev, files.length > 1 && next, count]);
    paint();
  }

  // ── 详情 ──
  function chip(iconName, text, cls = '', title = '') {
    return h('span.iwe-pv-chip' + (cls ? '.' + cls : ''), title ? { title } : null, iconName ? ico(iconName, 14) : null, h('span', text));
  }
  function renderBody(s) {
    const { ref, seed } = s;
    const it = s.item;
    const u = (it && it.user) || null;
    clear(s.body);

    const title = (it && it.title) || seed.title || t('cpNoTitle');
    s.body.append(h('a.iwe-pv-title', { href: ref.href, onclick: (e) => go(e, s, ref.href) }, title));

    const prof = u ? `/profile/${u.username}` : seed.userHref;
    const name = u ? u.name : seed.userName;
    const authorKids = [
      h('img.iwe-pv-av', { src: u ? avatarOf(u) : seed.avatar || '/images/default-avatar.jpg', alt: '' }),
      h('span.iwe-pv-who', h('b', name || t('cpUnknown')), u && u.username ? h('small', '@' + u.username) : null),
      ico('right', 18),
    ];
    s.body.append(prof ? h('a.iwe-pv-author', { href: prof, onclick: (e) => go(e, s, prof) }, ...authorKids) : h('div.iwe-pv-author', ...authorKids));

    // 统计：状态在前（「这条是什么」），数字在后
    const stats = h('div.iwe-pv-stats');
    if (it) {
      if (it.rating === 'ecchi') stats.append(chip(null, 'R-18', 'r18'));
      if (it.private) stats.append(chip('lock', t('cpPrivate')));
      if (ref.kind === 'video' && it.embedUrl) stats.append(chip('link', t('cpExternal')));
      stats.append(chip('eye', fmtNum(it.numViews)));
      const lc = s.likeCount !== null ? s.likeCount : it.numLikes;
      stats.append(chip(s.liked ? 'heartOn' : 'heart', fmtNum(lc), s.liked ? 'liked' : ''));
      stats.append(chip('chat', fmtNum(it.numComments)));
      if (ref.kind === 'video' && it.file && it.file.duration) stats.append(chip('clock', fmtDur(it.file.duration)));
      if (ref.kind === 'image' && it.numImages) stats.append(chip('pics', String(it.numImages)));
      if (it.createdAt) stats.append(chip('cal', fmtAgo(it.createdAt), '', fullDate(it.createdAt)));
    } else {
      if (seed.r18) stats.append(chip(null, 'R-18', 'r18'));
      if (seed.views) stats.append(chip('eye', seed.views));
      if (seed.likes) stats.append(chip('heart', seed.likes));
      if (seed.duration) stats.append(chip('clock', seed.duration));
    }
    s.body.append(stats);

    if (s.failed) {
      s.body.append(h('div.iwe-pv-err', h('span', t('cpFail')), h('button', { type: 'button', onclick: () => loadDetail(s) }, t('cpRetry'))));
    } else if (!s.detail) {
      // 骨架：简介两行 + 一排标签
      s.body.append(h('div.iwe-pv-skel', h('i', { style: { width: '92%' } }), h('i', { style: { width: '64%' } }),
        h('div', h('i'), h('i'), h('i'))));
    } else {
      const text = String(s.detail.body || '').trim();
      if (text) {
        const desc = h('div.iwe-pv-desc', text);
        const box = h('div.iwe-pv-descbox', desc);
        s.body.append(box);
        requestAnimationFrame(() => {
          if (desc.scrollHeight > desc.clientHeight + 2) {
            const more = h('button.iwe-pv-expand', { type: 'button', onclick: () => {
              const on = box.classList.toggle('open');
              more.textContent = on ? t('cpCollapse') : t('cpExpand');
            } }, t('cpExpand'));
            box.append(more);
          }
        });
      }
      const tags = Array.isArray(s.detail.tags) ? s.detail.tags : [];
      if (tags.length) {
        s.body.append(h('div.iwe-pv-tags', ...tags.map((tg) => {
          const href = `/${ref.kind}s?tags=${encodeURIComponent(tg.id)}`;
          const label = tagName(tg.id);
          return h('a.iwe-pv-tagchip', { href, title: label !== tg.id ? tg.id : null, 'data-tag': tg.id, onclick: (e) => go(e, s, href) }, label);
        })));
      }
    }
  }

  // ── 动作行 ──
  function renderBar(s) {
    const { ref } = s;
    clear(s.bar);
    const liked = !!s.liked;
    const likeBtn = h('button.iwe-pv-act' + (liked ? '.on' : ''), {
      type: 'button', title: liked ? t('cpUnlike') : t('cpLike'), 'aria-label': liked ? t('cpUnlike') : t('cpLike'), 'aria-pressed': String(liked),
      disabled: !s.detail || s.likeBusy, onclick: () => toggleLike(s, likeBtn),
    }, ico(liked ? 'heartOn' : 'heart', 18), s.likeCount !== null ? h('span', fmtNum(s.likeCount)) : null);
    const url = location.origin + ref.href;
    const copyBtn = h('button.iwe-pv-act', { type: 'button', title: t('cpCopy'), 'aria-label': t('cpCopy'), onclick: async () => {
      try { await navigator.clipboard.writeText(url); } catch { /* 忽略 */ }
      copyBtn.replaceChildren(ico('check', 18)); copyBtn.classList.add('ok'); copyBtn.title = t('cpCopied');
      setTimeout(() => { if (copyBtn.isConnected) { copyBtn.replaceChildren(ico('link', 18)); copyBtn.classList.remove('ok'); copyBtn.title = t('cpCopy'); } }, 1400);
    } }, ico('link', 18));
    const tabBtn = h('a.iwe-pv-act', { href: ref.href, target: '_blank', rel: 'noopener', title: t('cpNewTab'), 'aria-label': t('cpNewTab') }, ico('ext', 18));
    const openBtn = h('a.iwe-pv-open', { href: ref.href, onclick: (e) => go(e, s, ref.href) }, t('cpOpen'));
    s.bar.append(h('div.iwe-pv-acts', likeBtn, copyBtn, tabBtn), openBtn);
    s.likeBtn = likeBtn;
  }

  async function toggleLike(s, btn) {
    if (s.likeBusy || !s.detail) return;
    if (!loggedIn()) { flashTip(btn, t('cpLogin')); return; }
    const want = !s.liked;
    s.likeBusy = true;
    const before = [s.liked, s.likeCount];
    s.liked = want; s.likeCount = Math.max(0, (s.likeCount || 0) + (want ? 1 : -1));
    renderBar(s); renderBody(s);
    try {
      await api.call(`/${s.ref.kind}/${s.ref.id}/like`, { method: want ? 'POST' : 'DELETE' });
      s.detail.liked = want; s.detail.numLikes = s.likeCount;
      const li = items.get(s.key); if (li) { li.liked = want; li.numLikes = s.likeCount; }
      // 卡片封面上的点赞数跟着改
      if (s.card.isConnected) setText(s.card.querySelector('.likes .text'), fmtNum(s.likeCount));
    } catch (err) {
      console.error('[iwe] cardPreview like', err);
      [s.liked, s.likeCount] = before;
      if (!s.closed) { renderBar(s); renderBody(s); flashTip(s.likeBtn, t('cpLikeFail')); }
    } finally {
      s.likeBusy = false;
      if (!s.closed) renderBar(s);
    }
  }
  function flashTip(anchor, text) {
    if (!anchor || !anchor.isConnected) return;
    const tip = h('span.iwe-pv-flash', text);
    anchor.closest('.iwe-pv-bar').append(tip);
    const a = anchor.getBoundingClientRect(), b = anchor.closest('.iwe-pv-bar').getBoundingClientRect();
    tip.style.left = Math.max(8, a.left - b.left) + 'px';
    setTimeout(() => tip.classList.add('out'), 1600);
    setTimeout(() => tip.remove(), 1900);
  }

  // 去别的页面：先收起弹窗（不飞回卡片），站内地址交给站点路由，带修饰键的照浏览器默认（新标签等）
  function go(e, s, href) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    s.trigger = null;
    s.close(true);
    listNavigate(href);
    scrollTo(0, 0);
  }

  // ── 出入场 ──
  // 宽 / 中：从卡片的位置放大出来（等比缩放 + 位移，不拉伸文字）；手机底部弹层：从底下滑上来
  function cardRect(s) {
    const r = s.card.isConnected ? s.card.getBoundingClientRect() : null;
    return r && r.width && r.bottom > 0 && r.top < innerHeight ? r : null;
  }
  function flyFrom(s) {
    const c = cardRect(s);
    const p = s.panel.getBoundingClientRect();
    if (!c || !p.width) return null;
    const k = Math.max(0.2, Math.min(1, c.width / p.width));
    const dx = c.left + c.width / 2 - (p.left + p.width / 2);
    const dy = c.top + c.height / 2 - (p.top + p.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${k})`;
  }
  function animateIn(s) {
    const { root, panel } = s;
    requestAnimationFrame(() => root.classList.add('in'));
    if (reduced()) return;
    if (s.layout === 'sheet') {
      panel.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      return;
    }
    const from = flyFrom(s) || 'translateY(16px) scale(.96)';
    panel.animate([{ transform: from, opacity: 0, borderRadius: '10px' }, { opacity: 1, offset: 0.35 }, { transform: 'none', opacity: 1 }],
      { duration: ANIM_MS + 40, easing: 'cubic-bezier(.2,.9,.25,1)' });
  }
  function animateOut(s) {
    const { root, panel } = s;
    root.classList.remove('in');
    let a;
    if (s.layout === 'sheet') {
      const cur0 = getComputedStyle(panel).transform;
      a = panel.animate([{ transform: cur0 === 'none' ? 'none' : cur0 }, { transform: 'translateY(100%)' }], { duration: 260, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
    } else {
      const to = flyFrom(s);
      a = to
        ? panel.animate([{ transform: 'none', opacity: 1 }, { opacity: 1, offset: 0.6 }, { transform: to, opacity: 0 }], { duration: 300, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' })
        : panel.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.96)', opacity: 0 }], { duration: 180, easing: 'ease', fill: 'forwards' });
    }
    return a.finished.catch(() => {});
  }

  // 手机：把手 / 封面上往下拖，或内容滚到顶以后继续下拉 → 跟手下移，过门槛（或甩得快）就关
  function bindSheetDrag(s) {
    const { panel, scroll } = s;
    let y0 = 0, x0 = 0, t0 = 0, dy = 0, mode = 0; // mode：0 未定 1 拖弹层 -1 交给内容（滚动 / 横滑）
    panel.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) { mode = -1; return; }
      y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; t0 = performance.now(); dy = 0;
      mode = scroll.scrollTop > 0 && !e.target.closest('.iwe-pv-grab') ? -1 : 0;
    }, { passive: true });
    panel.addEventListener('touchmove', (e) => {
      if (mode === -1 || s.closed) return;
      const ny = e.touches[0].clientY - y0, nx = e.touches[0].clientX - x0;
      if (mode === 0) {
        if (Math.abs(ny) < 6 && Math.abs(nx) < 6) return;
        mode = ny > 0 && Math.abs(ny) > Math.abs(nx) ? 1 : -1;
        if (mode === -1) return;
        panel.classList.add('drag');
      }
      dy = Math.max(0, ny);
      e.preventDefault();
      panel.style.transform = `translateY(${dy}px)`;
      s.root.style.setProperty('--cp-dim', String(Math.max(0, 1 - dy / (panel.offsetHeight || 1))));
    }, { passive: false });
    const end = () => {
      if (mode !== 1) { mode = 0; return; }
      mode = 0;
      panel.classList.remove('drag');
      const v = dy / Math.max(1, performance.now() - t0);
      if (dy > 120 || (v > 0.6 && dy > 30)) { s.close(); return; }
      panel.style.transform = '';
      s.root.style.removeProperty('--cp-dim');
    };
    panel.addEventListener('touchend', end);
    panel.addEventListener('touchcancel', end);
  }

  site.register('cardPreview', {
    css: `
.iwe-pv-host{position:relative}
.iwe-pv-host>.byline{min-width:0;flex:1 1 auto}
.iwe-pv-more{flex:none;display:grid;place-items:center;width:30px;height:30px;margin:0 -6px 0 auto;padding:0;border:0;border-radius:50%;background:transparent;color:var(--muted,#848484);cursor:pointer;transition:background .15s,color .15s,opacity .15s,transform .2s cubic-bezier(.22,1,.36,1)}
.iwe-pv-more:hover{background:rgba(128,128,128,.16);color:var(--text,#444)}
.iwe-pv-more:active{transform:scale(.88)}
.iwe-pv-more:focus-visible{outline:2px solid var(--primary,#1abc9c);outline-offset:1px;opacity:1}
@media (hover:hover) and (pointer:fine){.iwe-pv-more{opacity:.5}.videoTeaser:hover .iwe-pv-more,.imageTeaser:hover .iwe-pv-more{opacity:1}}
@media (hover:none),(pointer:coarse){.iwe-pv-more{width:36px;height:36px;margin-right:-9px}}

.iwe-pv{--cp-bg:#fff;--cp-fg:var(--text,#444);--cp-fg2:var(--muted,#848484);--cp-sunk:rgba(0,0,0,.045);--cp-line:rgba(0,0,0,.08);--cp-dim:1;
  position:fixed;inset:0;z-index:99990;display:grid;place-items:center;padding:24px;font-size:14px;line-height:1.5;color:var(--cp-fg)}
body.dark .iwe-pv{--cp-bg:#2c313a;--cp-sunk:rgba(255,255,255,.06);--cp-line:rgba(255,255,255,.09)}
.iwe-pv-scrim{position:absolute;inset:0;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .28s ease}
.iwe-pv.in .iwe-pv-scrim{opacity:var(--cp-dim)}
.iwe-pv-panel{--pw:min(560px,calc(100vw - 48px));--cover-h:calc(var(--pw) * 9 / 16);position:relative;display:flex;flex-direction:column;width:var(--pw);height:min(calc(var(--cover-h) + 380px),86vh);background:var(--cp-bg);border-radius:18px;overflow:hidden;outline:0;
  box-shadow:0 2px 6px rgba(0,0,0,.08),0 24px 64px rgba(0,0,0,.28);transform-origin:50% 50%;will-change:transform}
.iwe-pv-scroll{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin}

/* 宽屏：左封面贴满整条，右栏滚动 */
/* 高度开局就定死：内容（简介、标签）加载出来只在里面滚，卡片不会被撑高 */
.iwe-pv[data-layout=wide] .iwe-pv-panel{--pw:min(980px,calc(100vw - 48px));height:min(calc(var(--pw) * .55 * 9 / 16),86vh);flex-direction:row}
.iwe-pv[data-layout=wide] .iwe-pv-cover{flex:0 0 55%;aspect-ratio:auto;align-self:stretch}
.iwe-pv[data-layout=wide] .iwe-pv-body{flex:1 0 auto;padding:22px 24px 8px}
/* 手机：底部弹层 */
.iwe-pv[data-layout=sheet]{place-items:end stretch;padding:0}
.iwe-pv[data-layout=sheet] .iwe-pv-panel{--pw:100vw;width:100%;height:min(calc(var(--cover-h) + 330px),92vh);height:min(calc(var(--cover-h) + 330px),92dvh);border-radius:20px 20px 0 0}
.iwe-pv-panel.drag{transition:none!important}
.iwe-pv[data-layout=sheet] .iwe-pv-panel:not(.drag){transition:transform .25s cubic-bezier(.22,1,.36,1)}
.iwe-pv-grab{position:absolute;top:0;left:0;right:0;z-index:3;height:22px;display:flex;justify-content:center;padding-top:8px;touch-action:none}
.iwe-pv-grab span{width:38px;height:5px;border-radius:3px;background:rgba(255,255,255,.85);box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 4px rgba(0,0,0,.25)}

/* 封面 */
.iwe-pv-cover{position:relative;flex:none;aspect-ratio:16/9;background:#111;overflow:hidden}
/* 图库在窄版式里封面是 4:3（翻页器要摆竖图），开局就按 4:3 占位，文件到了换翻页器也不跳 */
.iwe-pv-panel[data-kind=image]:not([data-layout=wide]){--cover-h:min(calc(var(--pw) * 3 / 4),56vh)}
.iwe-pv-panel[data-kind=image]:not([data-layout=wide]) .iwe-pv-cover{aspect-ratio:auto;height:var(--cover-h);width:100%}
.iwe-pv-coverlink{position:absolute;inset:0;display:block}
.iwe-pv-backdrop{position:absolute;inset:-24px;width:calc(100% + 48px);height:calc(100% + 48px);object-fit:cover;filter:blur(22px) brightness(.6) saturate(1.2);-webkit-user-drag:none}
.iwe-pv-frame{position:absolute;left:50%;top:50%;width:100%;height:100%;transform:translate(-50%,-50%);overflow:hidden}
/* 画框里只放保持原比例的 large 图；cover 只裁掉自定义封面与视频比例不一致的那一点，不拉伸 */
.iwe-pv-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;opacity:0;transition:opacity .25s ease;-webkit-user-drag:none}
.iwe-pv-img.in{opacity:1}.iwe-pv-img.contain{object-fit:contain}
.iwe-pv-slide{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .45s ease;-webkit-user-drag:none}
.iwe-pv-slide.in{opacity:1}
.iwe-pv-play{position:absolute;left:50%;top:50%;display:grid;place-items:center;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;color:#fff;background:rgba(0,0,0,.42);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  opacity:0;transform:scale(.85);transition:opacity .2s,transform .3s cubic-bezier(.22,1,.36,1);pointer-events:none}
.iwe-pv-coverlink:hover .iwe-pv-play,.iwe-pv-coverlink:focus-visible .iwe-pv-play{opacity:1;transform:none}
@media (hover:none){.iwe-pv-play{opacity:.9;transform:none;width:48px;height:48px;margin:-24px 0 0 -24px}}
.iwe-pv-tag{position:absolute;z-index:2;display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 8px;font-size:12px;font-weight:600;color:#fff;background:rgba(0,0,0,.6);pointer-events:none}
.iwe-pv-tag.r18{left:0;bottom:0;background:#e5484d;border-radius:0 8px 0 0}
.iwe-pv-tag.dur{right:0;bottom:0;border-radius:8px 0 0 0;font-variant-numeric:tabular-nums}
.iwe-pv-progress{position:absolute;left:0;right:0;bottom:0;z-index:3;height:3px;overflow:hidden;background:rgba(255,255,255,.15)}
.iwe-pv-progress::after{content:"";position:absolute;inset:0;width:40%;background:var(--primary,#1abc9c);animation:iwe-pv-bar 1.1s ease-in-out infinite}
@keyframes iwe-pv-bar{from{transform:translateX(-100%)}to{transform:translateX(250%)}}
.iwe-pv-x{position:absolute;top:10px;right:10px;z-index:4;display:grid;place-items:center;width:34px;height:34px;padding:0;border:0;border-radius:50%;color:#fff;background:rgba(0,0,0,.42);
  -webkit-backdrop-filter:blur(10px) saturate(1.4);backdrop-filter:blur(10px) saturate(1.4);cursor:pointer;transition:background .15s,transform .2s cubic-bezier(.22,1,.36,1)}
.iwe-pv-x:hover{background:rgba(0,0,0,.6)}.iwe-pv-x:active{transform:scale(.9)}
.iwe-pv-x:focus-visible{outline:2px solid #fff;outline-offset:1px}
.iwe-pv[data-layout=sheet] .iwe-pv-x{top:14px}
.iwe-pv[data-layout=wide] .iwe-pv-x{right:auto;left:calc(55% - 44px)}
/* 图库翻页器 */
.iwe-pv-track{position:absolute;inset:0;display:flex;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;outline:0}
.iwe-pv-track::-webkit-scrollbar{display:none}
/* 图库翻页器的一格。⛔ 别叫 iwe-pv-slide：那是视频封面轮播帧的类名（opacity:0 等 .in），撞名会让整个翻页器隐形 */
.iwe-pv-page{flex:0 0 100%;height:100%;padding:0;border:0;background:none;scroll-snap-align:center;scroll-snap-stop:always;cursor:zoom-in}
.iwe-pv-page img{width:100%;height:100%;object-fit:contain;display:block;-webkit-user-drag:none}
.iwe-pv-page{position:relative}
.iwe-pv-page.loading::after{content:'';position:absolute;left:50%;top:50%;width:28px;height:28px;margin:-14px 0 0 -14px;border-radius:50%;border:3px solid rgba(255,255,255,.25);border-top-color:#fff;animation:iwe-pv-spin .8s linear infinite;pointer-events:none}
.iwe-pv-page.bad::after{content:'!';position:absolute;left:50%;top:50%;width:28px;height:28px;margin:-14px 0 0 -14px;border-radius:50%;background:rgba(229,72,77,.8);color:#fff;font:700 16px/28px sans-serif;text-align:center;pointer-events:none}
@keyframes iwe-pv-spin{to{transform:rotate(360deg)}}
.iwe-pv-nav{position:absolute;top:50%;z-index:3;display:grid;place-items:center;width:38px;height:38px;margin-top:-19px;padding:0;border:0;border-radius:50%;color:#fff;background:rgba(0,0,0,.42);
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);cursor:pointer;opacity:0;transition:opacity .2s,background .15s}
.iwe-pv-nav.prev{left:10px}.iwe-pv-nav.next{right:10px}
.iwe-pv-cover:hover .iwe-pv-nav:not(:disabled),.iwe-pv-nav:focus-visible{opacity:1}
.iwe-pv-nav:hover{background:rgba(0,0,0,.62)}
.iwe-pv-nav:disabled{opacity:0!important;pointer-events:none}
@media (hover:none){.iwe-pv-nav{display:none}}

/* 详情 */
.iwe-pv-body{flex:1 0 auto;padding:16px 20px 6px;display:flex;flex-direction:column;gap:12px}
.iwe-pv-title{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;margin:0 -6px;padding:2px 6px;border-radius:8px;font-size:18px;line-height:1.35;font-weight:700;color:var(--cp-fg)!important;text-decoration:none!important;word-break:break-word;transition:background .15s}
.iwe-pv-title:hover{background:var(--cp-sunk)}
.iwe-pv-author{display:flex;align-items:center;gap:10px;margin:0 -8px;padding:6px 8px;border-radius:10px;color:var(--cp-fg)!important;text-decoration:none!important;transition:background .15s}
a.iwe-pv-author:hover{background:var(--cp-sunk)}
.iwe-pv-author>svg{flex:none;color:var(--cp-fg2)}
.iwe-pv-av{flex:none;width:36px;height:36px;border-radius:50%;object-fit:cover;background:var(--cp-sunk)}
.iwe-pv-who{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25}
.iwe-pv-who b{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.iwe-pv-who small{font-size:12px;color:var(--cp-fg2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.iwe-pv-stats{display:flex;flex-wrap:wrap;gap:6px}
.iwe-pv-chip{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 9px;border-radius:7px;background:var(--cp-sunk);color:var(--cp-fg2);font-size:12.5px;font-weight:500;font-variant-numeric:tabular-nums;white-space:nowrap}
.iwe-pv-chip.r18{background:rgba(229,72,77,.14);color:#e5484d;font-weight:700}
.iwe-pv-chip.liked{color:#ec4899;background:rgba(236,72,153,.12)}
.iwe-pv-descbox{position:relative}
.iwe-pv-desc{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden;white-space:pre-wrap;word-break:break-word;font-size:13.5px;line-height:1.6;color:var(--cp-fg2)}
.iwe-pv-descbox.open .iwe-pv-desc{display:block;-webkit-line-clamp:unset}
.iwe-pv-expand{margin-top:2px;padding:2px 0;border:0;background:none;color:var(--primary,#1abc9c);font-size:13px;font-weight:600;cursor:pointer}
.iwe-pv-tags{display:flex;flex-wrap:wrap;gap:6px}
.iwe-pv-tagchip{display:inline-flex;align-items:center;height:28px;padding:0 11px;border-radius:999px;border:1px solid var(--cp-line);color:var(--cp-fg)!important;font-size:12.5px;text-decoration:none!important;transition:background .15s,border-color .15s,color .15s}
.iwe-pv-tagchip:hover{border-color:var(--primary,#1abc9c);color:var(--primary,#1abc9c)!important}
.iwe-pv-err{display:flex;align-items:center;gap:10px;font-size:13px;color:#e5484d}
.iwe-pv-err button{height:28px;padding:0 12px;border:1px solid var(--cp-line);border-radius:7px;background:none;color:var(--cp-fg);cursor:pointer}
.iwe-pv-skel{display:flex;flex-direction:column;gap:8px}
.iwe-pv-skel i,.iwe-pv-skel div i{display:block;height:12px;border-radius:6px;background:linear-gradient(100deg,var(--cp-sunk) 40%,var(--cp-line) 50%,var(--cp-sunk) 60%) 0/300% 100%;animation:iwe-pv-sh 1.4s linear infinite}
.iwe-pv-skel div{display:flex;gap:6px;margin-top:6px}.iwe-pv-skel div i{width:64px;height:28px;border-radius:999px}
@keyframes iwe-pv-sh{to{background-position:-150% 0}}

/* 动作行：浮在内容底部，下面的内容滚到它身后自然淡掉 */
.iwe-pv-bar{position:sticky;bottom:0;z-index:2;display:flex;align-items:center;gap:10px;margin-top:auto;padding:22px 20px 16px;
  background:linear-gradient(to bottom,transparent,var(--cp-bg) 20px)}
.iwe-pv[data-layout=wide] .iwe-pv-bar{padding:22px 24px 18px}
.iwe-pv[data-layout=sheet] .iwe-pv-bar{padding-bottom:max(14px,env(safe-area-inset-bottom))}
.iwe-pv-acts{display:flex;align-items:center;gap:2px;padding:3px;border-radius:12px;background:var(--cp-sunk)}
.iwe-pv-act{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:38px;height:38px;padding:0 9px;border:0;border-radius:9px;background:none;color:var(--cp-fg);font-size:13px;font-weight:600;font-variant-numeric:tabular-nums;cursor:pointer;text-decoration:none!important;transition:background .15s,color .15s,transform .2s cubic-bezier(.22,1,.36,1)}
.iwe-pv-act:hover{background:var(--cp-bg);color:var(--cp-fg)}
.iwe-pv-act:active{transform:scale(.9)}
.iwe-pv-act:disabled{opacity:.45;cursor:default;transform:none}
.iwe-pv-act.on{color:#ec4899}
.iwe-pv-act.on svg{animation:iwe-pv-pop .35s cubic-bezier(.3,1.6,.5,1)}
.iwe-pv-act.ok{color:var(--primary,#1abc9c)}
@keyframes iwe-pv-pop{from{transform:scale(.5)}}
.iwe-pv-act:focus-visible,.iwe-pv-open:focus-visible,.iwe-pv-tagchip:focus-visible,.iwe-pv-author:focus-visible,.iwe-pv-title:focus-visible,.iwe-pv-slide:focus-visible,.iwe-pv-page:focus-visible{outline:2px solid var(--primary,#1abc9c);outline-offset:1px}
.iwe-pv-open{flex:1;display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 22px;border-radius:12px;background:var(--primary,#1abc9c);color:var(--primary-text,#fff)!important;font-size:14.5px;font-weight:700;text-decoration:none!important;transition:filter .15s,transform .2s cubic-bezier(.22,1,.36,1)}
.iwe-pv-open:hover{filter:brightness(1.07)}.iwe-pv-open:active{transform:scale(.97)}
@media (min-width:600px){.iwe-pv-open{flex:0 0 auto;margin-left:auto;min-width:120px}}
.iwe-pv-flash{position:absolute;bottom:calc(100% - 14px);padding:5px 9px;border-radius:7px;background:#222;color:#fff;font-size:12px;font-weight:500;white-space:nowrap;pointer-events:none;animation:iwe-pv-fl .2s ease;transition:opacity .25s}
.iwe-pv-flash.out{opacity:0}
@keyframes iwe-pv-fl{from{opacity:0;transform:translateY(4px)}}
@media (prefers-reduced-motion:reduce){.iwe-pv *{animation:none!important}}
`,
    scan() {
      for (const card of document.querySelectorAll(CARD)) mountButton(card);
    },
    leave() {
      if (cur) cur.close(true);
      document.querySelectorAll('.iwe-pv-more').forEach((e) => e.remove());
      document.querySelectorAll('.iwe-pv-host').forEach((e) => e.classList.remove('iwe-pv-host'));
    },
  });
})();
