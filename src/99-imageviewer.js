// 图片详情页（/image/xxx）的大图浏览：照 LoveIwara 应用的图库查看器做。
// 点站点轮播里的图（或右上角「展开」）→ 黑底全屏查看器：
//   · 翻页：左右边缘点击（宽 >600 取 20%，否则 25%；首张 / 末张不循环）、左右滑动、← → PageUp PageDown Home End、滚轮；
//   · 缩放：Ctrl+滚轮 / 触控板捏合（含 Safari 的 gesture 事件）/ 双指 / 双击 / ↑ ↓ 0 键；放大后拖动或触控板双指滑动平移，缩放牌（右下）点一下复位；
//   · 下拉 / 上滑关闭（没放大时）：位移 >160px 或速度 >900px/s 关闭，否则 180ms 弹回；背景随位移淡出、画面缩到 0.88；
//   · 点中部切换界面显隐，4 秒后自动收起；底部缩略图条（当前图居中，点哪张跳哪张）；
//   · 加载中显示进度（图片：已下 / 总大小；视频：已缓冲百分比），垫一张模糊小图，25 秒没数据报失败；
//   · 前后各 3 张预加载（当前这张出图后再发）；标清（large）/ 原画（original）可切；加载失败有重试 / 新标签打开 / 复制链接。
// 画质：顶栏「标清 | 原画」两段开关（或按 Q），选择记在本机，下次打开沿用。
// 视频（webm / mp4）：带控制条自动播放、循环，音量与静音记住；Space 播放/暂停，J/L 快退/快进 10 秒，M 静音；动图 webp / gif 浏览器自己会动。
// 鼠标：单击图片放大 / 还原，单击图外的黑边关闭；触屏照应用（边缘点击翻页、中部切换界面、双击缩放）。
// 图片列表来自站点自己请求的 /image/{id} 响应（旁听），没听到就调接口。可在设置里单独关掉（功能名 imageViewer）。

// 给别的功能复用（作者页的横幅 / 头像）：iweImageViewer.openUrls([{ url, thumb? }], 起始下标)，直接按地址看图（没有标清 / 原画之分）
let iweImageViewer = null;

(() => {
  defineStrings(
    { ivClose: '关闭', ivStd: '标清', ivOrig: '原画', ivQuality: '切换画质', ivOpen: '新标签打开原图', ivRetry: '重试', ivCopy: '复制链接', ivFail: '图片加载失败', ivReset: '还原缩放' },
    { ivClose: 'Close', ivStd: 'Std', ivOrig: 'Orig', ivQuality: 'Switch quality', ivOpen: 'Open original', ivRetry: 'Retry', ivCopy: 'Copy link', ivFail: 'Failed to load image', ivReset: 'Reset zoom' },
    { ivClose: '閉じる', ivStd: '標準', ivOrig: '原画', ivQuality: '画質を切り替え', ivOpen: '元の画像を開く', ivRetry: '再試行', ivCopy: 'リンクをコピー', ivFail: '画像を読み込めませんでした', ivReset: '拡大率をリセット' },
  );

  const IMG = 'https://i.iwara.tv/image';
  const MAX = 6, MIN = 0.5, PRELOAD = 3, HIDE_MS = 4000, STALL_MS = 25000; // STALL_MS：这么久一个字节都没来就当失败，给重试
  const cache = new Map(); // imageId → files[]
  siteData.onApi((url, json) => {
    const m = /\/image\/([A-Za-z0-9]+)(?:\?|$)/.exec(url);
    if (m && json && Array.isArray(json.files)) cache.set(m[1], json.files);
  });

  const pageId = () => { const m = /^\/image\/([A-Za-z0-9]+)/.exec(location.pathname); return m && m[1]; };
  const svg = (d, s = 22) => { const tpl = document.createElement('template'); tpl.innerHTML = `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`; return tpl.content.firstChild; };
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 文件 → 地址。gif 没有 large，回落原图；large 的扩展名站点统一是 .jpg
  // 视频（webm / mp4）：i.iwara.tv 对「路径以视频后缀结尾」的请求回 Cloudflare 挑战页，要走 files.iwara.tv；
  // image/large 对视频回的是静态封面 JPEG（不是片源），所以视频只有原文件可播，封面用 large + .jpg。
  // gif 没有 large；webp 可能是动图，large 可能被转成静图——一律取原文件，保证会动。
  const FILES = 'https://files.iwara.tv/image';
  const isVideo = (f) => /^video\//.test(f.mime || '') || f.type === 'video';
  // f.direct：直接给的地址（作者页横幅 / 头像等，不是图库文件），原样显示
  const hasLarge = (f) => !f.direct && !isVideo(f) && f.mime !== 'image/gif' && f.mime !== 'image/webp';
  const posterOf = (f) => f.thumb || f.direct || `${IMG}/large/${f.id}/${f.id}.jpg`;
  const urlOf = (f, q) => {
    if (f.direct) return f.direct;
    if (isVideo(f)) return `${FILES}/original/${f.id}/${f.name}`;
    return q === 'original' || !hasLarge(f) ? `${IMG}/original/${f.id}/${f.name}` : posterOf(f);
  };
  const store_v = () => store.get('ivVideo', { volume: 1, muted: false });

  let st = null; // 打开时的全部状态，关闭即丢

  async function filesFor(id) {
    if (cache.has(id)) return cache.get(id);
    const r = await api.call(`/image/${id}`);
    const files = (r && r.files) || [];
    cache.set(id, files);
    return files;
  }

  // ── 界面显隐（4 秒自动收起）──
  function showChrome() { if (!st) return; st.box.classList.remove('hide'); clearTimeout(st.hideT); st.hideT = setTimeout(() => st && st.box.classList.add('hide'), HIDE_MS); }
  function toggleChrome() { if (!st) return; if (st.box.classList.contains('hide')) showChrome(); else { clearTimeout(st.hideT); st.box.classList.add('hide'); } }
  const postponeHide = () => { if (st && !st.box.classList.contains('hide')) showChrome(); };

  // ── 缩放 / 位移 ──
  // 画面实际占的大小（图片是 object-fit:contain，元素框比画面大）：按原始尺寸算，拿不到再退回元素框
  function contentSize() {
    const s = st, vw = s.stage.clientWidth, vh = s.stage.clientHeight;
    const nw = s.isVid ? s.vid.videoWidth : s.img.naturalWidth, nh = s.isVid ? s.vid.videoHeight : s.img.naturalHeight;
    if (!nw || !nh) return [s.img.offsetWidth || vw, s.img.offsetHeight || vh];
    const fit = Math.min(vw / nw, vh / nh);
    return [nw * fit, nh * fit];
  }
  function clamp() {
    const s = st, vw = s.stage.clientWidth, vh = s.stage.clientHeight;
    const [cw, ch] = contentSize();
    const w = cw * s.scale, h2 = ch * s.scale;
    const mx = Math.max(0, (w - vw) / 2), my = Math.max(0, (h2 - vh) / 2);
    s.tx = Math.min(mx, Math.max(-mx, s.tx)); s.ty = Math.min(my, Math.max(-my, s.ty));
  }
  function apply(animate) {
    const s = st; if (!s) return;
    clamp();
    s.zoom.style.transition = animate && !reduced() ? 'transform .22s cubic-bezier(.22,1,.36,1)' : 'none';
    s.zoom.style.transform = `translate(${s.tx}px,${s.ty + s.pullY}px) scale(${s.scale * s.pullS})`;
    s.stage.classList.toggle('zoomed', s.scale > 1.01);
    const show = Math.abs(s.scale - 1) > 0.02;
    s.chip.hidden = !show;
    if (show) s.chipTxt.textContent = s.scale.toFixed(1) + '×';
  }
  const rel = (e) => { const r = st.stage.getBoundingClientRect(); return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2]; };
  function zoomAt(ns, cx, cy, animate) {
    const s = st;
    ns = Math.min(MAX, Math.max(MIN, ns));
    const k = ns / s.scale;
    s.tx = cx - (cx - s.tx) * k; s.ty = cy - (cy - s.ty) * k; s.scale = ns;
    if (Math.abs(s.scale - 1) < 0.001) { s.scale = 1; s.tx = s.ty = 0; }
    apply(animate);
  }
  function resetZoom(animate) { if (!st) return; st.scale = 1; st.tx = st.ty = 0; apply(animate); }

  // ── 翻页 ──
  function go(i, anim = true) {
    const s = st; if (!s) return;
    if (i < 0 || i >= s.files.length || i === s.idx) return;
    s.idx = i;
    paint(anim);
  }
  function paint(anim = false) {
    const s = st, f = s.files[s.idx];
    s.scale = 1; s.tx = s.ty = 0; s.pullY = 0; s.pullS = 1;
    apply(false);
    s.err.hidden = true; s.spin.hidden = false; s.pct.textContent = ''; s.ph.hidden = true;
    if (s.abort) { s.abort.abort(); s.abort = null; }
    s.img.classList.remove('in');
    const url = urlOf(f, s.q) + (s.retry ? (urlOf(f, s.q).includes('?') ? '&' : '?') + 'r=' + s.retry : '');
    s.cur = url;
    const fail = () => { if (st && st.cur === url) { s.spin.hidden = true; s.pct.textContent = ''; s.err.hidden = false; s.errUrl.textContent = urlOf(f, s.q); } };
    // 视频页：用 <video>（带原生控制条、自动播放、循环）；其余用 <img>（动图 webp / gif 浏览器自己会动）
    s.vid.pause(); s.vid.removeAttribute('src'); s.vid.load();
    s.isVid = isVideo(f);
    s.img.hidden = s.isVid; s.vid.hidden = !s.isVid;
    s.stage.classList.toggle('video', s.isVid);
    if (s.isVid) {
      const v = store_v();
      s.vid.volume = Math.min(1, Math.max(0, v.volume)); s.vid.muted = !!v.muted; // 音量 / 静音记住，下次接着用
      s.vid.poster = posterOf(f);
      s.vid.onloadeddata = () => { if (st && st.cur === url) { s.spin.hidden = true; s.pct.textContent = ''; schedulePreload(); } };
      // 视频（webm / mp4）首帧前显示已缓冲多少；拿不到时长就只转圈
      s.vid.onprogress = () => {
        if (!st || st.cur !== url || s.spin.hidden) return;
        const v = s.vid, b = v.buffered, d = v.duration;
        if (b.length && d && isFinite(d)) s.pct.textContent = `${Math.min(100, Math.floor(b.end(b.length - 1) * 100 / d))}%`;
      };
      s.vid.onerror = fail;
      s.vid.src = url;
      const pr = s.vid.play(); if (pr && pr.catch) pr.catch(() => { /* 被自动播放策略拦了：控制条上手动点播放 */ });
    } else {
      s.img.onload = () => { if (st && st.cur === url) { s.spin.hidden = true; s.pct.textContent = ''; s.ph.hidden = true; s.img.classList.add('in'); schedulePreload(); } };
      s.img.onerror = fail;
      // 等待期间：先摆一张已经有的小图当底（站点页上那张 large），再用流式下载显示进度；
      // 下载本身失败（跨域 / 被拦）就退回直接给 <img> 地址
      const poster = f.direct ? '' : posterOf(f);
      s.ph.hidden = !poster || poster === urlOf(f, s.q);
      if (!s.ph.hidden) s.ph.src = poster;
      streamImage(s, url, fail);
    }
    s.count.textContent = `${s.idx + 1}/${s.files.length}`;
    s.prev.hidden = s.idx === 0; s.next.hidden = s.idx === s.files.length - 1;
    s.strip.querySelectorAll('.iwe-iv-th').forEach((el, i) => el.classList.toggle('on', i === s.idx));
    centerThumb(anim);
    postponeHide();
    // 预加载等当前这张出图后再发：手机慢网下前后 6 张同时下，正在看的这张反而最慢
    clearTimeout(s.preT);
  }
  // 流式下载：显示 已下载 / 总大小，卡住 STALL_MS 就报失败；拿到整张再交给 <img>
  function streamImage(s, url, fail) {
    const ctl = new AbortController(); s.abort = ctl;
    let stalled = false, stall;
    const bump = () => { clearTimeout(stall); stall = setTimeout(() => { stalled = true; ctl.abort(); }, STALL_MS); };
    const mb = (n) => (n / 1048576).toFixed(1);
    bump();
    fetch(url, { signal: ctl.signal }).then(async (r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const total = +r.headers.get('content-length') || 0;
      const rd = r.body.getReader();
      let got = 0;
      for (;;) {
        const { done, value } = await rd.read();
        if (done) break;
        got += value.length; bump();
        if (st === s && s.cur === url) s.pct.textContent = total ? `${Math.floor(got * 100 / total)}%  ${mb(got)} / ${mb(total)} MB` : `${mb(got)} MB`;
      }
      clearTimeout(stall);
      if (st !== s || s.cur !== url) return;
      // ⛔ 不能用 blob: 地址：站点 CSP 是 default-src 'self' https://*.iwara.tv * data:，`*` 不含 blob:，
      // <img> 会被拦成「加载失败」（2026-11-24 踩过）。下完的字节已进 HTTP 缓存（max-age=28800），
      // 直接给原地址，实测零传输、几十毫秒出图。
      s.img.src = url;
    }).catch(() => {
      clearTimeout(stall);
      if (st !== s || s.cur !== url) return;
      if (stalled) fail(); else s.img.src = url;
    });
  }
  function schedulePreload() { const s = st; if (!s) return; clearTimeout(s.preT); s.preT = setTimeout(preload, 250); }
  function preload() {
    const s = st; if (!s) return;
    for (let d = -PRELOAD; d <= PRELOAD; d++) {
      const f = s.files[s.idx + d];
      if (!f || d === 0 || isVideo(f)) continue;
      const u = urlOf(f, s.q);
      if (s.pre.has(u)) continue;
      s.pre.add(u);
      const im = new Image(); im.onerror = () => s.pre.delete(u); im.src = u;
    }
  }
  function centerThumb(anim) {
    const s = st, el = s.strip.children[s.idx]; if (!el) return;
    const x = el.offsetLeft + el.offsetWidth / 2 - s.strip.clientWidth / 2;
    s.strip.scrollTo({ left: x, behavior: anim && !reduced() ? 'smooth' : 'auto' });
  }
  function setQuality(q) {
    const s = st; if (!s || s.q === q) return;
    s.q = q; store.set('ivQuality', q); s.pre.clear(); s.retry = 0;
    s.qBtn.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.q === q));
    s.openA.href = urlOf(s.files[s.idx], 'original');
    paint(false);
  }

  // ── 关闭（同步站点轮播的位置）──
  function close() {
    const s = st; if (!s) return;
    st = null;
    if (s.abort) s.abort.abort();
    removeEventListener('keydown', s.onKey, true);
    clearTimeout(s.hideT); clearTimeout(s.preT);
    try { s.vid.pause(); s.vid.removeAttribute('src'); s.vid.load(); } catch { /* 忽略 */ }
    unlockScroll();
    // 站点轮播停在哪张，就让它也翻到哪张：点它的上一张 / 下一张按钮补差
    const diff = s.idx - s.startIdx;
    const btn = document.querySelector(diff > 0 ? '.slideshow__next' : '.slideshow__prev');
    if (btn) for (let i = 0; i < Math.abs(diff); i++) btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    s.box.classList.remove('open');
    setTimeout(() => s.box.remove(), reduced() ? 0 : 200);
  }

  // ── 手势 ──
  const ptrs = new Map();
  let g = null, lastTap = { t: 0, x: 0, y: 0 }, tapT = 0;
  function onDown(e) {
    if (e.button > 0 || e.target.closest('.iwe-iv-ui') || e.target === st.vid) return; // 视频本体交给原生控制条
    st.stage.setPointerCapture(e.pointerId);
    e.preventDefault();
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: Date.now() });
    const s = st;
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      const [cx, cy] = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      g = { type: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y) || 1, s: s.scale, cx, cy, tx: s.tx, ty: s.ty };
    } else if (ptrs.size === 1) g = { type: 'pan', tx: s.tx, ty: s.ty, sx: e.clientX, sy: e.clientY, moved: false, axis: null, last: [e.clientY, Date.now()], vy: 0 };
  }
  function onMove(e) {
    const p = ptrs.get(e.pointerId), s = st;
    if (!p || !g || !s) return;
    p.x = e.clientX; p.y = e.clientY;
    if (g.type === 'pinch' && ptrs.size >= 2) {
      const [a, b] = [...ptrs.values()];
      const ns = Math.min(MAX, Math.max(MIN, g.s * (Math.hypot(a.x - b.x, a.y - b.y) / g.d)));
      const k = ns / g.s;
      const [mx, my] = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      s.scale = ns; s.tx = g.cx - (g.cx - g.tx) * k + (mx - g.cx); s.ty = g.cy - (g.cy - g.ty) * k + (my - g.cy);
      apply(false); postponeHide();
      return;
    }
    if (g.type !== 'pan') return;
    const dx = e.clientX - g.sx, dy = e.clientY - g.sy;
    if (!g.moved && Math.hypot(dx, dy) > 6) { g.moved = true; g.axis = Math.abs(dy) > Math.abs(dx) ? 'v' : 'h'; }
    if (!g.moved) return;
    if (s.scale > 1.01) { s.tx = g.tx + dx; s.ty = g.ty + dy; apply(false); return; }
    if (g.axis === 'v') { // 没放大：竖向拖 = 下拉 / 上滑关闭，只有画面和背景动，界面不动
      const now = Date.now(); g.vy = (e.clientY - g.last[0]) / Math.max(1, now - g.last[1]) * 1000; g.last = [e.clientY, now];
      const prog = Math.min(1, Math.abs(dy) / 200), ease = 1 - Math.pow(1 - prog, 3);
      s.pullY = dy; s.pullS = 1 - prog * 0.12;
      s.box.style.setProperty('--iv-bg', String(1 - ease * 0.92));
      s.box.classList.add('pulling'); clearTimeout(s.hideT); s.box.classList.add('hide');
      apply(false);
    }
  }
  function onUp(e) {
    const p = ptrs.get(e.pointerId), s = st;
    ptrs.delete(e.pointerId);
    if (!p || !g || !s) return;
    if (g.type === 'pinch') {
      if (ptrs.size === 1) { const r = [...ptrs.values()][0]; g = { type: 'pan', tx: s.tx, ty: s.ty, sx: r.x, sy: r.y, moved: true, axis: null, last: [r.y, Date.now()], vy: 0 }; } else if (!ptrs.size) g = null;
      return;
    }
    const dx = e.clientX - p.sx, dy = e.clientY - p.sy, moved = g.moved, axis = g.axis, vy = g.vy;
    g = null;
    if (s.pullY) { // 下拉关闭：位移 >160 或速度 >900px/s；否则弹回
      if (Math.abs(s.pullY) > 160 || Math.abs(vy) > 900) { s.box.style.setProperty('--iv-bg', '0.08'); close(); return; }
      s.pullY = 0; s.pullS = 1; s.box.style.setProperty('--iv-bg', '1'); s.box.classList.remove('pulling');
      apply(true); showChrome(); return;
    }
    if (!moved && Date.now() - p.t < 350) return tap(e);
    if (moved && s.scale <= 1.01 && axis === 'h' && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(s.idx + (dx < 0 ? 1 : -1));
  }
  // 点按：双击缩放；单击（等 250ms 确认不是双击）：边缘翻页 / 中部切换界面
  // 点击是否落在图片本体上（图按 contain 铺在舞台里，四周的黑边 / 阴影不算）
  function onMedia(e) {
    const s = st, el = s.isVid ? s.vid : s.img;
    const nw = s.isVid ? s.vid.videoWidth : s.img.naturalWidth, nh = s.isVid ? s.vid.videoHeight : s.img.naturalHeight;
    if (!nw || !nh) return true;
    const r = s.stage.getBoundingClientRect(), fit = Math.min(r.width / nw, r.height / nh) * s.scale;
    const cx = r.left + r.width / 2 + s.tx, cy = r.top + r.height / 2 + s.ty;
    return Math.abs(e.clientX - cx) <= nw * fit / 2 && Math.abs(e.clientY - cy) <= nh * fit / 2 && !!el;
  }
  function tap(e) {
    const s = st, now = Date.now();
    if (e.pointerType === 'mouse') { // 鼠标：点图 = 放大 / 还原（光标是放大镜）；点图外的黑边 / 阴影 = 关闭
      if (!onMedia(e)) { close(); return; }
      if (s.scale > 1.01) resetZoom(true); else { const [cx, cy] = rel(e); zoomAt(2.5, cx, cy, true); }
      return;
    }
    if (now - lastTap.t < 280 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 30) {
      lastTap = { t: 0, x: 0, y: 0 }; clearTimeout(tapT);
      if (s.scale > 1.01) resetZoom(true); else { const [cx, cy] = rel(e); zoomAt(2.5, cx, cy, true); }
      return;
    }
    lastTap = { t: now, x: e.clientX, y: e.clientY };
    clearTimeout(tapT);
    tapT = setTimeout(() => {
      if (!st) return;
      const w = innerWidth, edge = w * (w > 600 ? 0.2 : 0.25);
      if (e.clientX <= edge && st.idx > 0) go(st.idx - 1);
      else if (e.clientX >= w - edge && st.idx < st.files.length - 1) go(st.idx + 1);
      else toggleChrome();
    }, 250);
  }
  // 滚轮 / 触控板：
  //   · 捏合（Chrome / Edge / Firefox 里是带 ctrlKey 的 wheel）→ 以指尖为中心缩放；
  //   · 放大时双指滑动 → 平移画面（跟手，1:1）；
  //   · 没放大时双指滑动 / 鼠标滚轮 → 翻页，一次手势只翻一页（触控板的惯性会连发几十个事件）。
  // 一次手势 = 事件之间间隔不超过 200ms 的一串；手势里缩放 / 平移过，就不再拿它翻页（捏回 1× 时手指还在滑，不能顺手翻走）。
  const GESTURE_GAP = 200, FLIP_AT = 40;
  let gest = { last: 0, acc: 0, used: false };
  const px = (e, v) => v * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? st.stage.clientHeight : 1);
  function onWheel(e) {
    if (!st || e.target.closest('.iwe-iv-ui')) return;
    e.preventDefault();
    const now = Date.now();
    if (now - gest.last > GESTURE_GAP) gest = { last: now, acc: 0, used: false };
    gest.last = now;
    if (e.ctrlKey) {
      const [cx, cy] = rel(e);
      zoomAt(st.scale * Math.exp(-px(e, e.deltaY) * 0.012), cx, cy, false);
      gest.used = true; postponeHide(); return;
    }
    if (st.scale > 1.01 && !st.isVid) {
      st.tx -= px(e, e.deltaX); st.ty -= px(e, e.deltaY);
      apply(false);
      gest.used = true; postponeHide(); return;
    }
    if (gest.used) return;
    const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    gest.acc += px(e, d);
    if (Math.abs(gest.acc) < FLIP_AT) return;
    gest.used = true;
    go(st.idx + (gest.acc > 0 ? 1 : -1));
  }
  // Safari（macOS）的触控板捏合不发 ctrl+wheel，发 gesturestart / gesturechange（e.scale 是相对手势开始时的倍数）
  let gestBase = 1;
  function onGesture(e) {
    if (!st) return;
    e.preventDefault();
    if (e.type === 'gesturestart') { gestBase = st.scale; return; }
    const [cx, cy] = rel(e);
    zoomAt(gestBase * e.scale, cx, cy, false);
    gest = { last: Date.now(), acc: 0, used: true };
    postponeHide();
  }
  function onKey(e) {
    const s = st; if (!s) return;
    const k = e.key;
    if (k === 'Escape') close();
    else if (k === 'ArrowRight' || k === 'PageDown') go(s.idx + 1);
    else if (k === 'ArrowLeft' || k === 'PageUp') go(s.idx - 1);
    else if (k === 'Home') go(0);
    else if (k === 'End') go(s.files.length - 1);
    else if (k === 'ArrowUp' || k === '=' || k === '+') zoomAt(s.scale + 0.2, 0, 0, true);
    else if (k === 'ArrowDown' || k === '-' || k === '_') zoomAt(s.scale - 0.2, 0, 0, true);
    else if (k === '0') resetZoom(true);
    else if (k === ' ' && s.isVid) { s.vid.paused ? s.vid.play() : s.vid.pause(); }
    else if ((k === 'j' || k === 'J') && s.isVid) s.vid.currentTime = Math.max(0, s.vid.currentTime - 10);
    else if ((k === 'l' || k === 'L') && s.isVid) s.vid.currentTime = s.vid.currentTime + 10;
    else if ((k === 'm' || k === 'M') && s.isVid) s.vid.muted = !s.vid.muted;
    else if ((k === 'q' || k === 'Q') && s.qBtn) setQuality(s.q === 'original' ? 'large' : 'original');
    else return;
    e.preventDefault(); e.stopPropagation(); postponeHide();
  }

  // ── 构建 ──
  function thumbs(files) {
    return files.map((f, i) => {
      const ar = f.width && f.height ? f.width / f.height : 3 / 4;
      const w = Math.round(Math.min(104, Math.max(30, 58 * ar)));
      const im = h('img', { src: posterOf(f), loading: 'lazy', alt: '', draggable: 'false' });
      return h('button.iwe-iv-th', { type: 'button', style: `width:${isVideo(f) ? 103 : w}px`, onclick: () => go(i, false) }, im, isVideo(f) ? h('span.iwe-iv-play', svg('M8 5v14l11-7z', 14)) : null);
    });
  }
  function open(files, at) {
    if (st) close();
    const q = store.get('ivQuality', 'large') === 'original' ? 'original' : 'large';
    const s = st = { files, idx: -1, startIdx: at, q, scale: 1, tx: 0, ty: 0, pullY: 0, pullS: 1, retry: 0, pre: new Set(), cur: '' };
    s.img = h('img.iwe-iv-img', { draggable: 'false', alt: '' });
    s.vid = h('video.iwe-iv-vid', { controls: true, loop: true, playsinline: true, preload: 'auto', hidden: true });
    s.vid.addEventListener('volumechange', () => { if (st) store.set('ivVideo', { volume: s.vid.volume, muted: s.vid.muted }); });
    s.ph = h('img.iwe-iv-ph', { draggable: 'false', alt: '', hidden: true });
    s.zoom = h('div.iwe-iv-zoom', s.ph, s.img, s.vid);
    s.spin = h('div.iwe-iv-spin');
    s.pct = h('div.iwe-iv-pct');
    s.errUrl = h('div.iwe-iv-errurl');
    s.err = h('div.iwe-iv-err.iwe-iv-ui', { hidden: true },
      h('div.iwe-iv-errt', t('ivFail')), s.errUrl,
      h('div.iwe-iv-erra',
        h('button', { type: 'button', onclick: () => { s.retry++; paint(false); } }, t('ivRetry')),
        h('button', { type: 'button', onclick: () => { try { navigator.clipboard.writeText(urlOf(s.files[s.idx], s.q)); } catch { /* 忽略 */ } } }, t('ivCopy'))));
    s.stage = h('div.iwe-iv-stage', s.zoom, s.spin, s.pct, s.err);
    const closeBtn = h('button.iwe-iv-btn', { type: 'button', title: t('ivClose'), 'aria-label': t('ivClose'), onclick: close }, svg('M18 6L6 18M6 6l12 12'));
    s.count = h('span.iwe-iv-count');
    const anyLarge = files.some(hasLarge);
    // 画质：标清 / 原画两段开关（选择记在本机，下次打开沿用）；整本都是 gif 时两档相同，不显示
    s.qBtn = anyLarge ? h('div.iwe-iv-seg', { role: 'group', title: t('ivQuality'), 'aria-label': t('ivQuality') },
      h('button' + (q === 'large' ? '.on' : ''), { type: 'button', 'data-q': 'large', onclick: () => setQuality('large') }, t('ivStd')),
      h('button' + (q === 'original' ? '.on' : ''), { type: 'button', 'data-q': 'original', onclick: () => setQuality('original') }, t('ivOrig'))) : null;
    s.openA = h('a.iwe-iv-btn', { href: urlOf(files[Math.max(0, at)], 'original'), target: '_blank', rel: 'noopener', title: t('ivOpen'), 'aria-label': t('ivOpen') }, svg('M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5', 20));
    const top = h('div.iwe-iv-top.iwe-iv-ui', closeBtn, h('div.iwe-iv-pill', s.qBtn, s.openA, s.count));
    s.prev = h('button.iwe-iv-nav.prev.iwe-iv-ui', { type: 'button', onclick: () => go(s.idx - 1) }, svg('M15 18l-6-6 6-6', 26));
    s.next = h('button.iwe-iv-nav.next.iwe-iv-ui', { type: 'button', onclick: () => go(s.idx + 1) }, svg('M9 18l6-6-6-6', 26));
    s.chipTxt = h('span');
    s.chip = h('button.iwe-iv-chip.iwe-iv-ui', { type: 'button', hidden: true, title: t('ivReset'), 'aria-label': t('ivReset'), onclick: () => resetZoom(true) }, svg('M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5', 16), s.chipTxt);
    s.strip = h('div.iwe-iv-strip', thumbs(files));
    const bottom = files.length > 1 ? h('div.iwe-iv-bottom.iwe-iv-ui', s.strip) : null;
    s.box = h('div.iwe-iv', { role: 'dialog', 'aria-modal': 'true' }, s.stage, top, s.prev, s.next, s.chip, bottom);
    if (files.length < 2) { s.prev.hidden = true; s.next.hidden = true; }
    s.stage.addEventListener('dragstart', (e) => e.preventDefault());
    s.stage.addEventListener('pointerdown', onDown);
    s.stage.addEventListener('pointermove', onMove);
    s.stage.addEventListener('pointerup', onUp);
    s.stage.addEventListener('pointercancel', onUp);
    s.box.addEventListener('wheel', onWheel, { passive: false });
    for (const ev of ['gesturestart', 'gesturechange']) s.box.addEventListener(ev, onGesture, { passive: false });
    s.box.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' && !g) showChrome(); });
    s.onKey = onKey;
    addEventListener('keydown', onKey, true);
    document.body.append(s.box);
    lockScroll();
    s.idx = Math.min(files.length - 1, Math.max(0, at));
    paint(false);
    showChrome();
    requestAnimationFrame(() => st && st.box.classList.add('open'));
  }

  // 站点轮播当前第几张：从「1/6」进度文字读
  const startIndex = () => {
    const el = document.querySelector('.slideshow__progress');
    const m = el && /(\d+)\s*\/\s*(\d+)/.exec(el.textContent);
    return m ? Math.max(0, +m[1] - 1) : 0;
  };
  async function onClick(e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || st) return;
    const t0 = e.target.closest && e.target.closest('.slideshow__current, .slideshow__expand');
    if (!t0 || !pageId()) return;
    e.preventDefault(); e.stopPropagation();
    try {
      const all = await filesFor(pageId());
      const files = all.filter((f) => f && f.id && f.name);
      if (!files.length) return;
      // 站点进度的下标是按完整清单数的：把它映射到只含图片的列表里
      let at = startIndex();
      const cur = all[at];
      if (cur) at = Math.max(0, files.findIndex((f) => f.id === cur.id));
      open(files, at);
    } catch (err) { console.error('[iwe] imageViewer', err); }
  }

  iweImageViewer = {
    openUrls(items, at = 0) {
      const files = items.filter((it) => it && it.url).map((it, i) => ({ id: 'u' + i, direct: it.url, thumb: it.thumb, width: it.width, height: it.height }));
      if (files.length) open(files, Math.min(files.length - 1, Math.max(0, at)));
    },
    // 图库文件（接口给的 files[]）：标清 / 原画、视频文件都照图片详情页的规矩来（卡片预览弹窗在用）
    openFiles(files, at = 0) {
      if (files && files.length) open(files, Math.min(files.length - 1, Math.max(0, at)));
    },
    isOpen: () => !!st,
  };

  let bound = false;
  site.register('imageViewer', {
    match: (path) => /^\/image\//.test(path),
    css: `
.slideshow__current img,.slideshow__expand{cursor:zoom-in}
.iwe-iv{--iv-bg:1;position:fixed;inset:0;z-index:100000;color:#fff;font:500 13px/1.4 system-ui,-apple-system,sans-serif;opacity:0;transition:opacity .3s ease;user-select:none;-webkit-user-select:none}
.iwe-iv::before{content:"";position:absolute;inset:0;background:#000;opacity:var(--iv-bg);transition:opacity .18s ease}
.iwe-iv.pulling::before{transition:none}
.iwe-iv.open{opacity:1}
.iwe-iv-stage{position:absolute;inset:0;overflow:hidden;touch-action:none;display:flex;align-items:center;justify-content:center;cursor:zoom-in}
.iwe-iv-stage.zoomed{cursor:grab}.iwe-iv-stage.zoomed:active{cursor:grabbing}
.iwe-iv-zoom{display:flex;align-items:center;justify-content:center;width:100%;height:100%;will-change:transform}
.iwe-iv-img{width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity .2s ease;-webkit-user-drag:none}
.iwe-iv-img.in{opacity:1}
.iwe-iv-ph{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:blur(2px);opacity:.7;pointer-events:none}
.iwe-iv-ph[hidden]{display:none}
.iwe-iv-pct{position:absolute;left:50%;top:50%;margin-top:44px;transform:translateX(-50%);padding:3px 10px;border-radius:12px;background:rgba(0,0,0,.55);color:#fff;font-size:12px;white-space:nowrap;pointer-events:none}
.iwe-iv-pct:empty{display:none}
.iwe-iv-vid{width:100%;height:100%;object-fit:contain;background:#000}
.iwe-iv-img[hidden],.iwe-iv-vid[hidden]{display:none}
.iwe-iv-stage.video{cursor:default}
.iwe-iv-play{position:absolute;right:4px;bottom:4px;display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,.6);color:#fff}
.iwe-iv-spin{position:absolute;left:50%;top:50%;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;border:3px solid rgba(255,255,255,.25);border-top-color:#fff;animation:iwe-iv-spin .8s linear infinite;pointer-events:none}
.iwe-iv-spin[hidden],.iwe-iv-err[hidden],.iwe-iv-chip[hidden],.iwe-iv-nav[hidden]{display:none}
@keyframes iwe-iv-spin{to{transform:rotate(360deg)}}
.iwe-iv-err{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(420px,calc(100% - 32px));padding:16px;border-radius:12px;background:rgba(229,72,77,.12);border:1px solid rgba(229,72,77,.35);text-align:center}
.iwe-iv-errt{font-weight:700;font-size:15px;margin-bottom:6px}
.iwe-iv-errurl{opacity:.6;font-size:12px;word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.iwe-iv-erra{display:flex;gap:8px;justify-content:center;margin-top:12px}
.iwe-iv-erra button{height:34px;padding:0 14px;border:0;border-radius:8px;background:rgba(255,255,255,.16);color:#fff;font:inherit;cursor:pointer}
.iwe-iv-erra button:hover{background:rgba(255,255,255,.28)}
/* 界面（顶栏 / 缩略图条 / 翻页钮 / 缩放牌）：深色玻璃，4 秒无操作收起 */
.iwe-iv-ui{transition:opacity .25s ease,transform .3s cubic-bezier(.22,1,.36,1)}
.iwe-iv-top{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:12px 12px 0;pointer-events:none}
.iwe-iv-top>*{pointer-events:auto}
.iwe-iv-btn,.iwe-iv-pill,.iwe-iv-nav,.iwe-iv-chip{background:rgba(24,24,24,.62);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.14)}
.iwe-iv-btn{display:grid;place-items:center;width:40px;height:40px;padding:0;border-radius:50%;color:#fff;cursor:pointer;text-decoration:none}
.iwe-iv-btn:hover,.iwe-iv-nav:hover,.iwe-iv-chip:hover{background:rgba(70,70,70,.8)}
.iwe-iv-pill{display:flex;align-items:center;gap:6px;height:40px;padding:0 6px 0 6px;border-radius:999px}
.iwe-iv-pill .iwe-iv-btn{width:32px;height:32px;border:0;background:transparent}
.iwe-iv-seg{display:inline-flex;padding:2px;border-radius:999px;background:rgba(255,255,255,.14)}
.iwe-iv-seg button{height:28px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:rgba(255,255,255,.8);font:700 12.5px/1 system-ui;cursor:pointer;transition:background .2s,color .2s}
.iwe-iv-seg button.on{background:#fff;color:#000}
.iwe-iv-count{padding:0 8px;font:700 14px/1 system-ui;font-variant-numeric:tabular-nums}
.iwe-iv-nav{position:absolute;top:50%;margin-top:-24px;display:grid;place-items:center;width:48px;height:48px;padding:0;border-radius:50%;color:#fff;cursor:pointer}
.iwe-iv-nav.prev{left:16px}.iwe-iv-nav.next{right:16px}
.iwe-iv-chip{position:absolute;right:20px;bottom:98px;display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 11px;border-radius:999px;color:#fff;font:700 13px/1 system-ui;cursor:pointer}
.iwe-iv-bottom{position:absolute;left:0;right:0;bottom:0;height:74px;padding:8px 0 calc(8px + env(safe-area-inset-bottom));background:linear-gradient(transparent,rgba(0,0,0,.55))}
.iwe-iv-strip{display:flex;align-items:center;gap:6px;height:100%;overflow-x:auto;scrollbar-width:none;padding:0 50%}
.iwe-iv-strip::-webkit-scrollbar{display:none}
.iwe-iv-th{flex:none;position:relative;height:58px;padding:0;border:0;border-radius:6px;background:#2a2a2a;overflow:hidden;cursor:pointer;transform:scale(.84);outline:2px solid transparent;outline-offset:-2px;transition:transform .25s cubic-bezier(.22,1,.36,1),outline-color .25s}
.iwe-iv-th.on{transform:none;outline-color:rgba(255,255,255,.95)}
.iwe-iv-th img{width:100%;height:100%;object-fit:cover;display:block}
.iwe-iv.hide .iwe-iv-top{opacity:0;transform:translateY(-16px);pointer-events:none}
.iwe-iv.hide .iwe-iv-top>*{pointer-events:none}
.iwe-iv.hide .iwe-iv-bottom{opacity:0;transform:translateY(102%);pointer-events:none}
.iwe-iv.hide .iwe-iv-nav{opacity:0;pointer-events:none}
.iwe-iv.hide .iwe-iv-chip{transform:translateY(80px)}
@media (hover:none){.iwe-iv-nav{display:none}}
@media (max-width:600px){.iwe-iv-chip{right:12px}}
@media (prefers-reduced-motion:reduce){.iwe-iv,.iwe-iv-img,.iwe-iv-ui,.iwe-iv-th{transition:none}.iwe-iv-spin{animation-duration:2s}}
`,
    scan() {
      if (!bound) { bound = true; document.addEventListener('click', onClick, true); }
    },
    leave() { if (st) close(); },
  });
})();
