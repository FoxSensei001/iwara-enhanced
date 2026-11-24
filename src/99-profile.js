// 作者页（/profile/<人> 及其各标签页）的整理，沿用首页、订阅页已经定下的做法：
//
// 1. 头部：@用户名那一行后面加「粉丝 / 关注」人数（点了进对应标签页；手机上站点把这两张卡藏了，这里是唯一能看到人数的地方）。
//    站点中文文案有几处词不达意，按原文逐字匹配后改掉（其他语言不动）：
//    好友按钮「好友」（其实是「加好友」这个动作）→「加好友」、「待办」（已发出申请、等对方通过）→「已申请」；横幅上「在线的」→「在线」。
//    手机上头像 250px → 112px。
// 2. 「关于」页：简介收进一张卡片、加「简介」标题；「最新视频 / 最新图片」标题变超链接，标题行右侧放 最新 / 热门 / 人气 三个按钮
//    （直接进视频 / 图片页的对应排序），底部居中的「观看更多视频」按钮藏掉——和首页分区同一套（iweHomeKit）。
//    英文漏翻的「Comments」→「评论」，后面跟条数。
// 3. 右栏：宽屏整列钉在顶栏下，比视口高时栏内可滚、滚到头带动页面（stickySidebar）；卡片间距 30px → 16px；
//    「关注中 / 粉丝」卡的标题变超链接，卡底的「查看全部」去掉（与首页去掉底部按钮一致）。
// 4. 视频 / 图片页：右栏导航下面加「筛选」卡（排序 + 发布时间）和「标签」卡，与订阅页同一套（iweSubFilterKit、iweTagFilterKit）；
//    站点列表上方那排只有图标、没有文字的排序钮与筛选卡重复，藏掉。
//    接口实测（2026-11-24）：带 user= 时 sort / date / tags 都生效、rating 被忽略（所以不放评级）；
//    站点会把地址栏里的任意参数原样带进列表请求，但删掉的参数会沿用旧值——交给 listSync 按地址栏改写，地址栏是唯一事实源。
// 5. 关注中 / 粉丝页：英文漏翻的「Following / Followers」标题 → 中文 + 人数；用户卡片加底色、悬停加深。
// 6. 空结果（播放列表等）：一行斜体小字 → 上方加图标的空状态（文案仍用站点原文）。
// 7. 手机：右栏的入口（两列网格，占四行）→ 一行可横向滑动的胶囊标签，当前项自动滑进视野。
//
// 改站点 React 节点里的文字时只改文本节点的值（站点文案不变时 React 不会去碰它），不替换节点。

(() => {
  defineStrings({
    pf_about: '简介',
    pf_comments: '评论',
    pf_followers: '粉丝',
    pf_following: '关注',
    pf_followingTitle: '关注中',
    pf_friendAdd: '加好友',
    pf_friendPending: '已申请',
    pf_friendPendingTip: '已发出好友申请，等待对方通过',
    pf_online: '在线',
  }, {
    pf_about: 'About',
    pf_comments: 'Comments',
    pf_followers: 'Followers',
    pf_following: 'Following',
    pf_followingTitle: 'Following',
    pf_friendAdd: 'Add friend',
    pf_friendPending: 'Requested',
    pf_friendPendingTip: 'Friend request sent, waiting for them to accept',
    pf_online: 'Online',
  }, {
    pf_about: '紹介',
    pf_comments: 'コメント',
    pf_followers: 'フォロワー',
    pf_following: 'フォロー中',
    pf_followingTitle: 'フォロー中',
    pf_friendAdd: 'フレンド追加',
    pf_friendPending: '申請済み',
    pf_friendPendingTip: 'フレンド申請を送信済みです。相手の承認待ちです',
    pf_online: 'オンライン',
  });

  const ROUTE = /^\/profile\/([^/]+)(?:\/([^/]+))?\/?$/;
  const LIST_TAB = /^\/profile\/[^/]+\/(videos|images)$/;
  const SORTS = ['date', 'trending', 'popularity', 'likes', 'views'];
  const route = () => { const m = location.pathname.match(ROUTE); return m ? { username: decodeURIComponent(m[1]), tab: m[2] || '' } : null; };
  const base = (username) => '/profile/' + encodeURIComponent(username);
  const plain = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  // 人数写法跟站点一致（右栏里是 13.2K 这种）
  const compact = (n) => { try { return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n); } catch { return String(n); } };

  // ── 人数：旁听站点自己的请求（右栏的关注中 / 粉丝、评论列表都会带 count），没听到再自己补一次 ──
  const counts = new Map(); // userId 或 username → { followers, following, comments }
  const setCount = (key, kind, n) => {
    const c = counts.get(key) || {};
    if (c[kind] === n) return;
    c[kind] = n; counts.set(key, c);
    site.schedule();
  };
  siteData.onApi((url, json) => {
    if (!json || typeof json.count !== 'number') return;
    let u; try { u = new URL(url); } catch { return; }
    let m = u.pathname.match(/^\/user\/([^/]+)\/(followers|following)$/);
    if (m) { setCount(m[1], m[2], json.count); return; }
    m = u.pathname.match(/^\/(?:user|profile)\/([^/]+)\/comments$/);
    if (m && !u.searchParams.get('parent')) setCount(m[1], 'comments', json.count);
  });
  const userOf = (username) => siteData.user(username);
  function countOf(username, kind) {
    const u = userOf(username);
    const c = (u && counts.get(u.id)) || counts.get(username) || {};
    return typeof c[kind] === 'number' ? c[kind] : null;
  }
  const asked = new Set();
  /** 页面加载早于脚本、或站点没发这两个请求时（手机上右栏卡片也照发，一般用不上）：自己各要一条，只要 count */
  function backfill(username) {
    const u = userOf(username);
    // 作者资料（含 id）也没听到：要一次 /profile/<人>，回来的数据经 siteData 旁听记下，下一轮 scan 再补人数
    if (!u) { if (!asked.has('p:' + username)) { asked.add('p:' + username); api.call('/profile/' + encodeURIComponent(username), { auth: false }).then(site.schedule, () => {}); } return; }
    if (asked.has(u.id)) return;
    asked.add(u.id);
    setTimeout(() => {
      for (const kind of ['followers', 'following']) {
        if (countOf(username, kind) == null) api.call(`/user/${u.id}/${kind}?limit=1`, { auth: false }).catch(() => {});
      }
    }, 2000);
  }

  // ── 站点文案修正（逐字匹配，命中才改；改的是文本节点的值）──
  function retext(el, map, title) {
    if (!el) return;
    const tn = [...el.childNodes].find((n) => n.nodeType === 3 && n.nodeValue.trim());
    if (!tn) return;
    const want = map[tn.nodeValue.trim()];
    if (want && tn.nodeValue !== want) tn.nodeValue = want;
    if (title) { const tip = title[tn.nodeValue.trim()]; if (tip) el.closest('button,a')?.setAttribute('title', tip); else el.closest('button,a')?.removeAttribute('title'); }
  }
  function fixTexts() {
    // 只修中文界面里那几处（其他语言原文是对的）
    if (env.lang === 'zh') {
      retext(document.querySelector('.page-profile__header .friendButton .text'),
        { 好友: t('pf_friendAdd'), 待办: t('pf_friendPending') }, { [t('pf_friendPending')]: t('pf_friendPendingTip') });
      retext(document.querySelector('.page-profile__header__right .online'), { 在线的: t('pf_online') });
    }
  }

  // ── 头部：@用户名后面的「粉丝 · 关注」──
  function headerStats(r) {
    const mid = document.querySelector('.page-profile__header__middle');
    if (!mid) return;
    let box = mid.querySelector(':scope > .iwe-pf-stats');
    const fol = countOf(r.username, 'followers'), fing = countOf(r.username, 'following');
    if (fol == null && fing == null) { if (box) box.remove(); return; }
    const sig = [r.username, fol, fing, env.lang].join('|');
    if (!box) box = h('div.iwe-pf-stats');
    if (box.__sig !== sig) {
      box.__sig = sig;
      const link = (kind, n, label) => {
        const a = h('a.iwe-pf-stat', { href: base(r.username) + '/' + kind }, h('b', n == null ? '–' : compact(n)), ' ', label);
        a.addEventListener('click', (e) => { if (plain(e)) { e.preventDefault(); listNavigate(a.getAttribute('href')); } });
        return a;
      };
      box.replaceChildren(link('followers', fol, t('pf_followers')), h('span.iwe-pf-dot', '·'), link('following', fing, t('pf_following')));
    }
    // 放在最后：93-user.js 会把身份徽章追加到这里，统计行始终在徽章之后单独一行
    if (mid.lastElementChild !== box) mid.append(box);
  }

  // ── 「关于」页：简介卡片、分区标题、评论标题 ──
  function overview(r) {
    const content = document.querySelector('.page-profile__content');
    if (!content) return;
    // 简介（站点的 .showMore 包着 markdown）：.showMore 本身做成卡片，所在那一列前面插一个大标题
    const about = content.querySelector(':scope > div > .row > .col-12 > .showMore');
    if (about) {
      about.classList.add('iwe-pf-about');
      const col = about.parentElement;
      if (!col.previousElementSibling || !col.previousElementSibling.hasAttribute('data-iwe-pf-h')) {
        col.before(h('div.col-12', { 'data-iwe-pf-h': '' }, h('div.text.text--h2.text--bold.iwe-home-h', t('pf_about'))));
      }
    }
    // 换了作者、新作者没有简介时，站点可能复用那一行只拿掉简介：插的标题跟着拿掉
    for (const hd of content.querySelectorAll('[data-iwe-pf-h]')) {
      if (!(hd.nextElementSibling && hd.nextElementSibling.querySelector(':scope > .showMore'))) hd.remove();
    }
    // 最新视频 / 最新图片：标题行 = 超链接标题 + 最新 / 热门 / 人气；藏掉底部的「观看更多」
    if (iweHomeKit) {
      for (const more of content.querySelectorAll('.page-profile__viewMore')) {
        const a = more.querySelector('a[href]');
        const m = a && a.getAttribute('href').match(/\/(videos|images)$/);
        const heading = more.parentElement && more.parentElement.querySelector(':scope > .col-12 > .text--h2');
        if (!m || !heading) continue;
        more.classList.add('iwe-pf-hide');
        heading.parentElement.classList.add('iwe-pf-sec');
        sectionPagerFor(more, m[1], r);
        // 站点重写标题文字时会把我们包的链接和按钮一起冲掉：标记对得上、按钮也还在才跳过
        const key = a.getAttribute('href') + '|' + env.lang;
        if (heading.__iwePf === key && heading.querySelector(':scope > .iwe-home-slot')) continue;
        heading.__iwePf = key;
        heading.classList.add('iwe-home-h');
        const href = base(r.username) + '/' + m[1];
        iweHomeKit.linkHeading(heading, { label: heading.textContent.trim(), href, orig: a });
        heading.querySelectorAll(':scope > .iwe-home-slot').forEach((e) => e.remove());
        heading.append(h('div.iwe-home-slot', iweHomeKit.buttons(['date', 'trending', 'popularity'].map((s) => ({ label: s, href: `${href}?sort=${s}` })))));
      }
    }
  }

  // ── 头部的横幅和头像：点击用看图器放大（99-imageviewer.js）──
  // 页面上显示的是裁过的缩略图（横幅 1500×430），放大时看原图：文件名来自站点自己请求的 /profile/<名> 响应（旁听），
  // 没听到就退回页面上那张。横幅和头像放在同一组里，可以左右切换。
  const headerFiles = new Map(); // username（小写）→ { header, avatar }
  siteData.onApi((url, json) => {
    let u; try { u = new URL(url, location.href); } catch { return; }
    const m = u.pathname.match(/^\/profile\/([^/]+)$/);
    if (m && json && json.user) headerFiles.set(decodeURIComponent(m[1]).toLowerCase(), { header: json.header || null, avatar: json.user.avatar || null });
  });
  const origUrl = (f) => (f && f.id && f.name ? `https://i.iwara.tv/image/original/${f.id}/${f.name}` : null);
  const abs = (src) => { try { return new URL(src, location.href).href; } catch { return null; } };
  document.addEventListener('click', (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || site.isOff('profilePage') || !iweImageViewer) return;
    const hd = e.target.closest && e.target.closest('.page-profile__header');
    if (!hd) return;
    const bgImg = hd.querySelector('.page-profile__header__background img');
    const avImg = hd.querySelector('.avatar img');
    const onBg = e.target.closest('.page-profile__header__background');
    const onAv = avImg && e.target.closest('.avatar');
    if (!onBg && !onAv) return;
    const m = location.pathname.match(/^\/profile\/([^/]+)/);
    const files = (m && headerFiles.get(decodeURIComponent(m[1]).toLowerCase())) || {};
    const items = [];
    if (bgImg) items.push({ url: origUrl(files.header) || abs(bgImg.getAttribute('src')), thumb: abs(bgImg.getAttribute('src')) });
    if (avImg) items.push({ url: origUrl(files.avatar) || abs(avImg.getAttribute('src')), thumb: abs(avImg.getAttribute('src')) });
    e.preventDefault(); e.stopPropagation();
    iweImageViewer.openUrls(items, onAv && bgImg ? 1 : 0);
  }, true);

  // ── 「关于」页的最新视频 / 最新图片：分区底下一条分页条，原地翻页，不用点进列表页（同首页，共用 iweHomeKit.sectionPager）──
  // 站点那次请求是 /videos|/images?user=<id>&limit=8（不带 sort = 按最新）：记下来，翻页沿用它的参数只改 page
  const overviewReq = {};
  siteData.onApi((url) => {
    if (!/^\/profile\/[^/]+\/?$/.test(location.pathname)) return;
    let u; try { u = new URL(url, location.href); } catch { return; }
    if ((u.pathname === '/videos' || u.pathname === '/images') && u.searchParams.get('user') && !u.searchParams.get('page')) overviewReq[u.pathname.slice(1) + ':' + u.searchParams.get('user')] = u;
  });
  function sectionPagerFor(more, kind, r) {
    if (!iweHomeKit.sectionPager || typeof iwePagerKit === 'undefined' || !iwePagerKit) return;
    const sec = more.parentElement;
    const who = siteData.user(r.username);
    if (!sec || !who) return;
    const key = kind + ':' + who.id;
    const cur = sec.__iwePfPager;
    if (cur && cur.key === key && cur.foot.isConnected) return;
    if (cur) { cur.pager.reset(); cur.foot.remove(); } // 换了作者：站点复用这一块，克隆件和翻页状态都作废
    const listOf = () => { const t0 = sec.querySelector('.videoTeaser,.imageTeaser'); return t0 && t0.parentElement && t0.parentElement.parentElement; };
    if (!listOf()) return; // 这位作者没有这类作品：不放分页条
    const foot = h('div.iwe-pf-pg');
    more.before(foot);
    const pager = iweHomeKit.sectionPager({
      block: sec,
      listOf,
      mount: (bar) => foot.replaceChildren(bar),
      request: () => {
        const base = overviewReq[key];
        const u = new URL('/' + kind, location.origin);
        if (base) for (const [k, v] of base.searchParams) u.searchParams.set(k, v);
        else { u.searchParams.set('user', who.id); u.searchParams.set('limit', '8'); }
        return u;
      },
      // 翻页后分区标题若已滚出视野，滚回标题（避免最后一页卡片变少时停在空白里）
      onPage: () => { const hd = sec.querySelector('.text--h2'); const y = hd && hd.getBoundingClientRect().top; if (hd && y < 64) scrollTo({ top: y + scrollY - 80, behavior: reducedMotion() ? 'auto' : 'smooth' }); }, // 64 = 固定顶栏高
    });
    sec.__iwePfPager = { key, foot, pager };
  }

  // 评论区标题（站点中文界面里也是英文「Comments」）：改成「评论」，后面跟条数
  function commentsHeading(r) {
    const hd = document.querySelector('.page-profile__content .comments > .text--h2');
    if (!hd) return;
    retext(hd, { Comments: t('pf_comments') });
    setCountBadge(hd, countOf(r.username, 'comments'));
  }
  function setCountBadge(el, n) {
    let b = el.querySelector(':scope > .iwe-pf-count');
    if (n == null) { if (b) b.remove(); return; }
    if (!b) { b = h('span.iwe-pf-count'); el.append(b); }
    const txt = compact(n);
    if (b.textContent !== txt) b.textContent = txt;
  }

  // ── 关注中 / 粉丝页：标题汉化 + 人数 ──
  function peopleHeading(r) {
    if (r.tab !== 'followers' && r.tab !== 'following') return;
    const hd = document.querySelector('.page-profile__content > div > .text--h2');
    if (!hd) return;
    retext(hd, { Followers: t('pf_followers'), Following: t('pf_followingTitle') });
    setCountBadge(hd, countOf(r.username, r.tab));
  }

  // ── 右栏：钉住、卡片标题变链接 ──
  function sidebar(r) {
    const side = document.querySelector('.page-profile__sidebar');
    if (!side) return null;
    side.classList.add('iwe-pf-side');
    stickySidebar(side);
    for (const kind of ['following', 'followers']) {
      const block = side.querySelector(`.sidebar__${kind}`);
      // 两张卡的标题行站点都用 .sidebar__following__header（粉丝卡也是），按「卡片内容的第一行」找
      const head = block && block.querySelector(':scope > .block__content > [class*="__header"]');
      const title = head && head.querySelector(':scope > .text--bold');
      if (!title) continue;
      const all = [...block.querySelectorAll('.block__content > a[href]')].find((a) => !a.classList.contains('avatar'));
      if (all) all.classList.add('iwe-pf-hide');
      if (title.querySelector(':scope > .iwe-pf-blockhl')) continue;
      const a = h('a.iwe-pf-blockhl', { href: base(r.username) + '/' + kind });
      while (title.firstChild) a.append(title.firstChild);
      a.append(icon('arrowRight', 14));
      a.addEventListener('click', (e) => {
        if (!plain(e)) return;
        e.preventDefault();
        if (all && all.isConnected) all.click(); else listNavigate(a.getAttribute('href'));
      });
      title.append(a);
    }
    return side;
  }

  // ── 视频 / 图片页的筛选卡 + 标签卡 ──
  listSync.register({
    feature: 'profilePage',
    api: (path) => { const m = path.match(LIST_TAB); return m ? '/' + m[1] : null; },
    accept: (u) => u.searchParams.has('user'),
    rewrite(u, sp) {
      for (const k of ['sort', 'date', 'tags']) u.searchParams.delete(k);
      const sort = sp.get('sort'), date = sp.get('date'), tags = sp.get('tags');
      u.searchParams.set('sort', SORTS.includes(sort) ? sort : 'date');
      if (date && /^\d{4}(-\d{2})?$/.test(date)) u.searchParams.set('date', date);
      if (tags) u.searchParams.set('tags', tags);
    },
  });
  let fc = null, tc = null, tagInst = null, fsig = null;
  function dropFilters() {
    if (fc) { fc.card.remove(); tc.card.remove(); }
    fc = tc = tagInst = null; fsig = null;
  }
  function paintFilters() {
    const kit = iweSubFilterKit;
    const sp = new URLSearchParams(location.search);
    const sort = SORTS.includes(sp.get('sort')) ? sp.get('sort') : 'date';
    const n = (sort !== 'date' ? 1 : 0) + (sp.get('date') ? 1 : 0);
    const tagN = (sp.get('tags') || '').split(',').filter(Boolean).length;
    for (const [card, k] of [[fc, n], [tc, tagN]]) {
      card.badge.textContent = k ? t('subfilter_active', { n: k }) : '';
      card.badge.hidden = !k;
      card.reset.classList.toggle('show', k > 0);
      card.reset.tabIndex = k ? 0 : -1;
    }
    add(clear(fc.body), [
      kit.section(t('subfilter_sort'), kit.seg(SORTS, sort, (v) => t('subfilter.sort.' + v), kit.SORT_ICONS, (v) => kit.setParam('sort', v))),
      kit.section(t('subfilter_date'), kit.dateRow()),
    ]);
  }
  function filters(side) {
    const kit = iweSubFilterKit;
    const links = side && side.querySelector(':scope > .sidebar__links');
    if (!LIST_TAB.test(location.pathname) || !links || !kit || !iweTagFilterKit) { dropFilters(); return; }
    if (!fc || !fc.card.isConnected || fc.card.parentElement !== side) {
      dropFilters();
      fc = kit.makeCard('filter', t('subfilter_title'), () => {
        const url = new URL(location.href);
        for (const k of ['sort', 'date', 'page']) url.searchParams.delete(k);
        listNavigate(url);
      });
      tc = kit.makeCard('tags', t('subfilter_tags'), () => {
        const url = new URL(location.href);
        url.searchParams.delete('tags'); url.searchParams.delete('page');
        listNavigate(url);
      });
      links.after(fc.card, tc.card);
      tagInst = iweTagFilterKit.mount(tc.body);
    }
    // 「筛选」与「标签」之间允许夹一张「翻页方式」卡（92-pager.js 放的）
    let mid = fc.card.nextElementSibling;
    if (mid && mid.hasAttribute('data-iwe-pager-side')) mid = mid.nextElementSibling;
    if (links.nextElementSibling !== fc.card || mid !== tc.card) {
      side.querySelectorAll(':scope > [data-iwe-pager-side]').forEach((e) => e.remove()); // 顺序乱了就整理，翻页卡交给分页模块重放
      links.after(fc.card, tc.card);
    }
    // 站点在列表上方自带一排只有图标的排序钮（sortFilter--compact），与筛选卡里的排序重复：筛选卡在就藏掉它
    for (const s of document.querySelectorAll('.page-profile__content .sortFilter')) s.classList.add('iwe-pf-hide');
    listSync.watch(); // 站点自己的路由跳转（右栏链接）不发 popstate，靠 scan 补看一眼
    const next = [location.pathname, location.search, env.lang].join('|');
    if (next !== fsig) { fsig = next; paintFilters(); }
    if (tagInst) tagInst.sync();
  }

  // ── 手机：横排胶囊标签里，当前项滑进视野 ──
  let lastActive = null;
  function revealActiveTab() {
    scrollFade(document.querySelector('.page-profile .sidebar__links ul')); // 横滑胶囊两端渐隐（宽屏不溢出就不淡）
    const a = document.querySelector('.page-profile .sidebar__links a.active');
    if (!a || a === lastActive || innerWidth >= 768) return;
    lastActive = a;
    const ul = a.closest('ul');
    if (ul && ul.scrollWidth > ul.clientWidth) ul.scrollTo({ left: Math.max(0, a.parentElement.offsetLeft - 16), behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  site.register('profilePage', {
    match: (path) => ROUTE.test(path),
    css: `
/* 头部：@用户名下一行的「粉丝 · 关注」 */
.iwe-pf-stats{display:flex;align-items:center;gap:8px;margin-top:4px;font-size:13px;line-height:20px}
.iwe-pf-stats .iwe-pf-stat{color:inherit!important;opacity:.75;text-decoration:none!important;white-space:nowrap}
.iwe-pf-stats .iwe-pf-stat b{font-weight:700;opacity:1}
.iwe-pf-stats .iwe-pf-stat:hover{opacity:1;color:var(--primary,#1abc9c)!important}
.iwe-pf-stats .iwe-pf-stat:focus-visible{outline:2px solid var(--primary,#1abc9c);outline-offset:2px;border-radius:3px}
.iwe-pf-dot{opacity:.4}
/* 区块标题后面的条数（评论、粉丝页等） */
.iwe-pf-count{margin-left:10px;font-size:.6em;font-weight:600;opacity:.5;vertical-align:middle}
/* 「关于」页：简介卡片（底色沿用站点容器卡片） */
.page-profile__content .iwe-pf-about{background:var(--body-alt,#ededed);border-radius:8px;padding:16px 18px 12px;box-shadow:0 1px 3px rgba(0,0,0,.1);margin-bottom:0}
/* 站点的「展示更多」是绝对定位、压在块的下边沿上；放回卡片里，排在正文下面 */
.page-profile__content .iwe-pf-about>.showMore__button{position:static!important;transform:none!important;display:flex;justify-content:center;margin-top:8px}
.page-profile__content [data-iwe-pf-h] .iwe-home-h{margin-top:24px!important}
/* 分区：第一个标题紧贴头部下面；标题与卡片之间只留标题自己的下边距 */
.page-profile__content .iwe-pf-sec>.iwe-home-h{margin-top:4px!important}
.page-profile__content .iwe-pf-sec>.row.mt-4{margin-top:0!important}
.iwe-pf-hide{display:none!important}
/* 横幅、头像可点击放大 */
.page-profile__header__background,.page-profile__header .avatar{cursor:zoom-in}
/* 「关于」页分区底下的分页条（卡片行自带 24px 下边距，往上收一点） */
.iwe-pf-pg{width:100%;margin:-12px 0 8px;padding:0 15px}
.iwe-pf-pg .iwe-pager{margin:8px 0}
/* 右栏：卡片间距 30px → 16px；宽屏整列钉在顶栏下，比视口高时栏内可滚、滚到头带动页面（88-site.js 的 stickySidebar） */
.page-profile .iwe-pf-side>.block.block--margin{margin-bottom:16px}
@media (min-width:768px){
  .page-profile .iwe-pf-side{position:sticky;top:80px;--iwe-sticky:1;scrollbar-width:thin;margin:0 -6px;padding:0 6px 4px}
}
/* 「关注中 / 粉丝」卡标题：超链接（站点链接色 var(--primary)，深浅色跟站点走）+ 悬停滑出箭头 */
.iwe-pf-blockhl{display:inline-flex;align-items:center;gap:6px;color:var(--primary,#1abc9c)!important;text-decoration:none!important}
.iwe-pf-blockhl svg{flex:none;opacity:0;transform:translateX(-4px);transition:opacity .15s,transform .2s}
.iwe-pf-blockhl:hover{text-decoration:underline!important;text-underline-offset:3px}
.iwe-pf-blockhl:hover svg,.iwe-pf-blockhl:focus-visible svg{opacity:1;transform:none}
.iwe-pf-blockhl:focus-visible{outline:2px solid var(--primary,#1abc9c);outline-offset:2px;border-radius:3px}
/* 关注中 / 粉丝页：用户卡片 */
.page-profile__content .userTeaser{display:flex;align-items:center;margin-bottom:12px;padding:10px 12px;border-radius:10px;background:var(--body-alt,#ededed);text-decoration:none!important;transition:background .15s}
.page-profile__content .userTeaser:hover{background:var(--body-darker,#dedede)}
.page-profile__content .userTeaser:focus-visible{outline:2px solid var(--primary,#1abc9c);outline-offset:2px}
.page-profile__content .userTeaser__right{min-width:0}
/* 空结果：图标 + 站点原文（筛到没结果时原文「没有结果」比「还没有内容」准确，文案不换） */
.page-profile__noResults{display:flex;flex-direction:column;align-items:center;gap:12px;padding:56px 16px;font-style:normal!important;font-size:14px}
.page-profile__noResults::before{content:"";width:44px;height:44px;opacity:.35;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 13.5 6.2 5.8A2.5 2.5 0 0 1 8.6 4h6.8a2.5 2.5 0 0 1 2.4 1.8L20 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.5Z'/%3E%3Cpath d='M4 13.5h4.5l1.5 2.5h4l1.5-2.5H20'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 13.5 6.2 5.8A2.5 2.5 0 0 1 8.6 4h6.8a2.5 2.5 0 0 1 2.4 1.8L20 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.5Z'/%3E%3Cpath d='M4 13.5h4.5l1.5 2.5h4l1.5-2.5H20'/%3E%3C/svg%3E") center/contain no-repeat}
/* 手机 */
@media (max-width:767.98px){
  /* 横幅：站点在 ≤575px 的屏上把它设成 1.2:1（390 宽给 322px 高），横幅原图是 1500×430，被裁成近似正方形；
     改成 2.4:1 的宽条，能看到更多原图。头像 250px → 112px，压住横幅一半 */
  .page-profile .page-profile__header__background{aspect-ratio:2.4/1!important;height:auto!important}
  .page-profile .page-profile__header__background img{height:100%!important;object-fit:cover}
  .page-profile__header__avatar{height:auto!important;margin-top:-56px!important}
  .page-profile__header__avatar .avatar{width:112px!important;height:112px!important;margin:0 auto}
  .iwe-pf-stats{justify-content:center}
  /* 右栏入口：两列网格 → 一行横向滑动的胶囊 */
  .page-profile .sidebar__links{margin:16px 0 8px!important;background:transparent!important;box-shadow:none!important;border-radius:0!important}
  .page-profile .sidebar__links>.block__content{padding:0!important}
  .page-profile .sidebar__links ul{display:flex;gap:8px;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:none;padding:2px 0 6px;margin:0}
  .page-profile .sidebar__links ul::-webkit-scrollbar{display:none}
  .page-profile .sidebar__links li{display:block!important;flex:none;width:auto!important}
  .page-profile .sidebar__links li a{height:36px!important;padding:0 14px 0 12px!important;border-radius:18px!important;background:var(--body-alt,#ededed);white-space:nowrap;-webkit-tap-highlight-color:transparent}
  .page-profile .sidebar__links li a.active{background:var(--primary,#1abc9c)}
  .page-profile .sidebar__links li a .icon{margin-right:6px}
  .page-profile__content .iwe-pf-about{margin:0 15px;padding:14px 14px 10px}
}
@media (prefers-reduced-motion:reduce){.iwe-pf-blockhl svg,.page-profile__content .userTeaser{transition:none}}
`,
    scan() {
      const r = route();
      if (!r) return;
      fixTexts();
      headerStats(r);
      backfill(r.username);
      const side = sidebar(r);
      if (r.tab === '') { overview(r); commentsHeading(r); }
      peopleHeading(r);
      filters(side);
      revealActiveTab();
    },
    leave() {
      dropFilters();
      lastActive = null;
    },
  });
})();
