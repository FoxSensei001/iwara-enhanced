// Markdown 里的图片（帖子、简介、评论、站点页面如 /page/premium）：
// 1. 站点默认把图片折成「URL 文字 + Click to display」按钮，这里自动替你点开；
// 2. 展开后的图加圆角；
// 3. 点图弹出大图查看器：同一块 Markdown 里的图可以左右切换（按钮 / ← → / 左右滑动）；
//    可缩放：滚轮 / 触控板捏合 / 双指捏合 / 鼠标单击 / 触屏双击/ +-0 键 / 左上角按钮，放大后拖动平移；Esc 或点空白处关闭。
// 链接里的图（<a><img></a>）不接管，保持点击跳转。可在设置里单独关掉（功能名 mdImages）。

(() => {
  defineStrings(
    { mdiClose: '关闭', mdiPrev: '上一张', mdiNext: '下一张', mdiZoomIn: '放大', mdiZoomOut: '缩小', mdiReset: '还原' },
    { mdiClose: 'Close', mdiPrev: 'Previous', mdiNext: 'Next', mdiZoomIn: 'Zoom in', mdiZoomOut: 'Zoom out', mdiReset: 'Reset' },
    { mdiClose: '閉じる', mdiPrev: '前へ', mdiNext: '次へ', mdiZoomIn: '拡大', mdiZoomOut: '縮小', mdiReset: 'リセット' },
  );

  let box = null, stage = null, zoomEl = null, imgEl = null, countEl = null, prevBtn = null, nextBtn = null, pctEl = null;
  let group = [], idx = 0;
  let scale = 1, tx = 0, ty = 0;
  const MAX = 8;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const svg = (d) => { const tpl = document.createElement('template'); tpl.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`; return tpl.content.firstChild; };
  const ptrs = new Map(); // 按着的手指 / 鼠标：id → {x, y}
  let g = null; // 当前手势：{ type:'pan'|'pinch', ... }
  let lastTap = { t: 0, x: 0, y: 0 };

  // 位移的边界：放大后的图比舞台小的那一边居中，比舞台大的那一边不许拖出空白
  function clamp() {
    const vw = stage.clientWidth, vh = stage.clientHeight;
    const w = imgEl.offsetWidth * scale, h2 = imgEl.offsetHeight * scale;
    const mx = Math.max(0, (w - vw) / 2), my = Math.max(0, (h2 - vh) / 2);
    tx = Math.min(mx, Math.max(-mx, tx)); ty = Math.min(my, Math.max(-my, ty));
  }
  function apply(animate) {
    clamp();
    zoomEl.style.transition = animate && !reduced() ? 'transform .22s var(--ease)' : 'none';
    zoomEl.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    stage.classList.toggle('zoomed', scale > 1.001);
    pctEl.textContent = Math.round(scale * 100) + '%';
  }
  // 以舞台坐标 (cx, cy)（相对舞台中心）为不动点缩放到 ns
  function zoomAt(ns, cx, cy, animate) {
    ns = Math.min(MAX, Math.max(1, ns));
    const k = ns / scale;
    tx = cx - (cx - tx) * k; ty = cy - (cy - ty) * k;
    scale = ns;
    if (scale <= 1.001) { scale = 1; tx = ty = 0; }
    apply(animate);
  }
  const rel = (e) => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2]; };
  function resetZoom(animate) { scale = 1; tx = ty = 0; if (zoomEl) apply(animate); }
  function zoomBy(f) { zoomAt(scale * f, 0, 0, true); }

  function show(i) {
    idx = (i + group.length) % group.length;
    const src = group[idx].currentSrc || group[idx].src;
    imgEl.classList.remove('in');
    resetZoom(false);
    imgEl.src = src;
    imgEl.alt = group[idx].alt || '';
    countEl.textContent = group.length > 1 ? `${idx + 1} / ${group.length}` : '';
    const multi = group.length > 1;
    prevBtn.style.display = nextBtn.style.display = multi ? '' : 'none';
    requestAnimationFrame(() => imgEl.classList.add('in'));
  }
  function close() {
    if (!box) return;
    const b = box; box = null;
    removeEventListener('keydown', onKey, true);
    unlockScroll();
    ptrs.clear(); g = null;
    b.classList.remove('open');
    setTimeout(() => b.remove(), reduced() ? 0 : 180);
  }
  function onKey(e) {
    const k = e.key;
    if (k === 'Escape') close();
    else if (k === 'ArrowLeft') show(idx - 1);
    else if (k === 'ArrowRight') show(idx + 1);
    else if (k === '+' || k === '=') zoomBy(1.4);
    else if (k === '-' || k === '_') zoomBy(1 / 1.4);
    else if (k === '0') resetZoom(true);
    else return;
    e.preventDefault(); e.stopPropagation();
  }

  // ── 手势（鼠标 / 触摸 / 触控笔统一走 pointer 事件）──
  function onDown(e) {
    if (e.button > 0) return;
    e.preventDefault(); // 否则浏览器会把图当成原生拖拽（发 pointercancel），放大后拖不动
    stage.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: Date.now(), onImg: e.target === imgEl });
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      const [cx, cy] = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      g = { type: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y) || 1, s: scale, cx, cy, tx, ty, moved: true };
    } else if (ptrs.size === 1) {
      g = { type: 'pan', tx, ty, sx: e.clientX, sy: e.clientY, moved: false };
    }
  }
  function onMove(e) {
    const p = ptrs.get(e.pointerId);
    if (!p || !g) return;
    p.x = e.clientX; p.y = e.clientY;
    if (g.type === 'pinch' && ptrs.size >= 2) {
      const [a, b] = [...ptrs.values()];
      const ns = Math.min(MAX, Math.max(1, g.s * (Math.hypot(a.x - b.x, a.y - b.y) / g.d)));
      const k = ns / g.s;
      // 以起始两指中点为不动点缩放，再跟着两指中点平移
      const [mx, my] = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      scale = ns; tx = g.cx - (g.cx - g.tx) * k + (mx - g.cx); ty = g.cy - (g.cy - g.ty) * k + (my - g.cy);
      apply(false);
    } else if (g.type === 'pan') {
      const dx = e.clientX - g.sx, dy = e.clientY - g.sy;
      if (!g.moved && Math.hypot(dx, dy) > 6) g.moved = true;
      if (scale > 1.001 && g.moved) { tx = g.tx + dx; ty = g.ty + dy; apply(false); }
    }
  }
  function onUp(e) {
    const p = ptrs.get(e.pointerId);
    ptrs.delete(e.pointerId);
    if (!p || !g) return;
    if (g.type === 'pinch') {
      if (scale < 1.05) resetZoom(true);
      // 剩一根手指继续拖：重新起一个拖动手势，避免跳变
      if (ptrs.size === 1) { const r = [...ptrs.values()][0]; g = { type: 'pan', tx, ty, sx: r.x, sy: r.y, moved: true }; } else if (!ptrs.size) g = null;
      return;
    }
    const wasTap = !g.moved && Date.now() - p.t < 350;
    const dx = e.clientX - p.sx;
    g = null;
    if (wasTap && e.pointerType === 'mouse') {
      // 鼠标：单击图片直接放大 / 还原（光标是放大镜，点了就该有反应）；点图外空白关闭
      if (!p.onImg) close();
      else if (scale > 1.001) resetZoom(true);
      else zoomAt(2.5, ...rel(e), true);
    } else if (wasTap) {
      const now = Date.now();
      if (now - lastTap.t < 320 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 30) {
        lastTap = { t: 0, x: 0, y: 0 };
        const [cx, cy] = rel(e);
        if (scale > 1.001) resetZoom(true); else zoomAt(2.5, cx, cy, true);
      } else {
        lastTap = { t: now, x: e.clientX, y: e.clientY };
        // 点在图外的空白处：关闭（延迟一拍，给双击留出判断时间——空白处不参与双击，直接关）
        if (!p.onImg) close();
      }
    } else if (e.pointerType !== 'mouse' && scale <= 1.001 && Math.abs(dx) > 50 && group.length > 1 && Math.abs(dx) > Math.abs(e.clientY - p.sy)) {
      show(idx + (dx < 0 ? 1 : -1)); // 触摸：没放大时左右滑动换图
    }
  }
  function onWheel(e) {
    e.preventDefault();
    // 触控板双指捏合会带 ctrlKey，deltaY 很小；普通滚轮每格约 100
    const f = Math.exp((-e.deltaY * (e.ctrlKey ? 0.012 : 0.0015)));
    const [cx, cy] = rel(e);
    zoomAt(scale * f, cx, cy, false);
  }

  function open(list, at) {
    if (box) close();
    group = list; scale = 1; tx = ty = 0;
    imgEl = h('img.iwe-mdi-img', { draggable: 'false' });
    zoomEl = h('div.iwe-mdi-zoom', imgEl);
    stage = h('div.iwe-mdi-stage', zoomEl);
    countEl = h('div.iwe-mdi-count');
    pctEl = h('span.iwe-mdi-pct');
    prevBtn = h('button.iwe-mdi-nav.prev', { type: 'button', title: t('mdiPrev'), 'aria-label': t('mdiPrev'), onclick: (e) => { e.stopPropagation(); show(idx - 1); } }, svg('M15 18l-6-6 6-6'));
    nextBtn = h('button.iwe-mdi-nav.next', { type: 'button', title: t('mdiNext'), 'aria-label': t('mdiNext'), onclick: (e) => { e.stopPropagation(); show(idx + 1); } }, svg('M9 18l6-6-6-6'));
    const closeBtn = h('button.iwe-mdi-close', { type: 'button', title: t('mdiClose'), 'aria-label': t('mdiClose'), onclick: close }, svg('M18 6L6 18M6 6l12 12'));
    const bar = h('div.iwe-mdi-bar',
      h('button', { type: 'button', title: t('mdiZoomOut'), 'aria-label': t('mdiZoomOut'), onclick: () => zoomBy(1 / 1.4) }, svg('M5 12h14')),
      h('button.pct', { type: 'button', title: t('mdiReset'), 'aria-label': t('mdiReset'), onclick: () => resetZoom(true) }, pctEl),
      h('button', { type: 'button', title: t('mdiZoomIn'), 'aria-label': t('mdiZoomIn'), onclick: () => zoomBy(1.4) }, svg('M12 5v14M5 12h14')));
    box = h('div.iwe-mdi', { role: 'dialog', 'aria-modal': 'true' }, stage, prevBtn, nextBtn, closeBtn, bar, countEl);
    stage.addEventListener('dragstart', (e) => e.preventDefault());
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    stage.addEventListener('wheel', onWheel, { passive: false });
    document.body.append(box);
    lockScroll();
    addEventListener('keydown', onKey, true);
    show(at);
    requestAnimationFrame(() => box && box.classList.add('open'));
  }

  // 同一块 Markdown 里的图，按文档顺序；已展开且加载出来的才算
  function collect(img) {
    const root = img.closest('.markdown') || img.parentElement;
    return [...root.querySelectorAll('img')].filter((x) => !x.closest('a') && x.naturalWidth > 0);
  }
  function onClick(e) {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.closest('.markdown') || img.closest('a') || img.closest('.iwe-mdi')) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const list = collect(img);
    const at = list.indexOf(img);
    if (at < 0) return;
    e.preventDefault(); e.stopPropagation();
    open(list, at);
  }

  let bound = false;
  site.register('mdImages', {
    css: `
.markdown img:not(.iwe-mdi-img){border-radius:10px;max-width:100%;height:auto;cursor:zoom-in;transition:filter .15s}
.markdown a img:not(.iwe-mdi-img){cursor:pointer}
.markdown img:not(.iwe-mdi-img):hover{filter:brightness(1.04)}
.iwe-mdi{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.82);backdrop-filter:blur(6px);opacity:0;transition:opacity .18s ease}
.iwe-mdi.open{opacity:1}
.iwe-mdi-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:56px 72px;overflow:hidden;touch-action:none;cursor:zoom-in}
.iwe-mdi-stage.zoomed{cursor:grab}.iwe-mdi-stage.zoomed:active{cursor:grabbing}
.iwe-mdi-zoom{display:flex;align-items:center;justify-content:center;max-width:100%;max-height:100%;will-change:transform}
.iwe-mdi-img{-webkit-user-drag:none;user-select:none;max-width:100%;max-height:calc(100vh - 112px);object-fit:contain;border-radius:12px;box-shadow:0 12px 48px rgba(0,0,0,.5);user-select:none;opacity:0;transform:scale(.97);transition:opacity .2s ease,transform .25s var(--ease)}
.iwe-mdi-img.in{opacity:1;transform:none}
.iwe-mdi button{position:absolute;display:grid;place-items:center;width:40px;height:40px;padding:0;border:1px solid rgba(255,255,255,.18);border-radius:50%;background:rgba(20,20,20,.7);color:#fff;cursor:pointer;transition:background .15s,transform .15s}
.iwe-mdi button:hover{background:rgba(60,60,60,.9)}
.iwe-mdi button:active{transform:scale(.92)}
.iwe-mdi-close{top:16px;right:16px}
.iwe-mdi-nav{top:50%;margin-top:-20px}
.iwe-mdi-nav.prev{left:16px}.iwe-mdi-nav.next{right:16px}
.iwe-mdi-bar{position:absolute;top:16px;left:16px;display:flex;gap:6px}
.iwe-mdi-bar button{position:static!important;width:40px;height:40px}
.iwe-mdi-bar .pct{width:auto;min-width:56px;padding:0 10px;border-radius:999px;font:500 13px/1 system-ui,sans-serif}
.iwe-mdi-count{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);padding:4px 12px;border-radius:999px;background:rgba(20,20,20,.7);color:#fff;font:500 13px/1.4 system-ui,sans-serif;pointer-events:none}
.iwe-mdi-count:empty{display:none}
@media (max-width:640px){.iwe-mdi-stage{padding:56px 8px}.iwe-mdi-bar{top:auto;bottom:12px;left:50%;transform:translateX(-50%)}.iwe-mdi-count{bottom:64px}.iwe-mdi-nav{top:auto;bottom:12px;margin:0}.iwe-mdi-nav.prev{left:16px}.iwe-mdi-nav.next{right:16px}}
@media (prefers-reduced-motion:reduce){.iwe-mdi,.iwe-mdi-img{transition:none}}
`,
    scan() {
      if (!bound) { bound = true; document.addEventListener('click', onClick, true); }
      // 自动展开：站点的 Vue 处理器要真实的 click 事件；点开后该节点被换成 <img>，不会重复点
      document.querySelectorAll('.markdown__image button:not([data-iwe-mdimg])').forEach((b) => {
        b.setAttribute('data-iwe-mdimg', '1');
        b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });
    },
  });
})();
