// 首页顶部的站点公告：原版是一个整页高的大块（大图 + 多段文字），把首页内容整个挤到屏幕外。
// 这里收成一行卡片：左边缩略图，中间标题 + 一行摘要，右边「查看全部」；点卡片在浮窗里看完整内容。
// 原来的 .markdown 节点不复制：打开浮窗时把它搬进去，关闭时搬回原处（站点自己的链接、看图都照常可用；翻译钮在浮窗标题栏，见 98-translate.js）。

(() => {
  defineStrings(
    { newsMore: '查看全部', newsClose: '关闭', newsLabel: '公告' },
    { newsMore: 'View all', newsClose: 'Close', newsLabel: 'Site news' },
    { newsMore: 'すべて見る', newsClose: '閉じる', newsLabel: 'お知らせ' },
  );

  const SEL = '.page-home .container-fluid > .row.justify-content-center > .block > .block__content > .markdown';
  let dlg = null, home = null, onKey = null;

  function close() {
    if (!dlg) return;
    const d = dlg; dlg = null;
    removeEventListener('keydown', onKey, true);
    unlockScroll();
    // 把内容搬回原处（站点页面已被重新渲染时 home 已脱离文档，就不搬了）
    if (home && home.parent.isConnected) home.parent.append(home.el);
    home = null;
    d.classList.remove('open');
    setTimeout(() => d.remove(), 200);
  }

  function open(md) {
    if (dlg) return;
    home = { el: md, parent: md.parentElement };
    const body = h('div.iwe-news-body', md);
    const closeBtn = h('button.iwe-news-x', { type: 'button', title: t('newsClose'), 'aria-label': t('newsClose'), onclick: close }, icon('x', 18));
    const panel = h('div.iwe-news-panel', { role: 'dialog', 'aria-modal': 'true', 'aria-label': t('newsLabel') },
      h('div.iwe-news-head', h('span', t('newsLabel')), h('div.r', h('kbd.iwe-news-kbd', 'Esc'), closeBtn)), body);
    dlg = h('div.iwe-news-dlg', panel);
    // 手机底部抽屉：在标题条上往下拖超过 90px 关闭，否则弹回
    const head = panel.querySelector('.iwe-news-head');
    let y0 = null, dy = 0;
    head.addEventListener('touchstart', (e) => { if (matchMedia('(max-width:600px)').matches) { y0 = e.touches[0].clientY; dy = 0; panel.style.transition = 'none'; } }, { passive: true });
    head.addEventListener('touchmove', (e) => { if (y0 == null) return; dy = Math.max(0, e.touches[0].clientY - y0); panel.style.transform = `translateY(${dy}px)`; }, { passive: true });
    head.addEventListener('touchend', () => {
      if (y0 == null) return;
      y0 = null; panel.style.transition = '';
      if (dy > 90) close(); else panel.style.transform = '';
    });
    dlg.addEventListener('pointerdown', (e) => { if (e.target === dlg) close(); });
    onKey = (e) => {
      if (e.key !== 'Escape' || document.querySelector('.iwe-mdi, .iwe-tr-menu.open')) return; // 看大图 / 开着翻译的语言菜单时 Esc 只关那一层
      e.preventDefault(); e.stopPropagation(); close();
    };
    addEventListener('keydown', onKey, true);
    document.body.append(dlg);
    lockScroll();
    requestAnimationFrame(() => dlg && dlg.classList.add('open'));
  }

  const clean = (s) => s.replace(/\s+/g, ' ').trim();
  function build(block, md) {
    const img = md.querySelector('img');
    // 翻译开着时原文块还在（藏着、带 data-iwe-tr-src），只取看得见的那一份：卡片上的摘要跟着译文走
    const shown = (sel) => [...md.querySelectorAll(sel)].filter((e) => !e.closest('[data-iwe-tr-src]'));
    const titles = shown('.text--h1,.text--h2,.text--h3,h1,h2,h3').map((e) => clean(e.textContent)).filter(Boolean);
    const paras = shown('p').map((p) => clean(p.textContent)).filter(Boolean);
    const title = titles.join(' · ') || paras[0] || t('newsLabel');
    const summary = (titles.length ? paras : paras.slice(1)).join('  ');
    const thumb = h('div.iwe-news-thumb', img ? h('img', { src: img.currentSrc || img.src, alt: '', loading: 'lazy', draggable: false }) : icon('file', 22));
    const card = h('div.iwe-news-card', { role: 'button', tabindex: 0, 'aria-label': t('newsMore') },
      thumb,
      h('div.iwe-news-text', h('div.iwe-news-title', h('span', title)), summary && h('div.iwe-news-sum', summary)));
    card.addEventListener('click', () => open(md));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(md); } });
    return card;
  }

  site.register('homeNews', {
    match: (path) => path === '/',
    css: `
/* 外层沿用站点容器卡片的底色 / 圆角 / 阴影，宽度撑满（站点把这一行居中收窄了，和下面的分区对不齐）；内部按钮用站点按钮色 var(--primary,#1abc9c) */
.iwe-news-on{margin-bottom:16px!important;padding:0!important;overflow:hidden;flex:0 0 100%;width:100%;max-width:100%}
.row:has(>.iwe-news-on){margin-left:0;margin-right:0}
.iwe-news-on>.block__content>.markdown{display:none}
.iwe-news-card{display:flex;align-items:center;gap:16px;padding:12px 16px 12px 12px;cursor:pointer;-webkit-tap-highlight-color:transparent;font-family:Inter,"Geist",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
.iwe-news-card:hover{background:rgba(128,128,128,.08)}
.iwe-news-card:focus-visible{outline:2px solid var(--primary,#1abc9c);outline-offset:-2px}
.iwe-news-thumb{flex:none;display:grid;place-items:center;width:112px;height:63px;border-radius:8px;overflow:hidden;background:var(--sunk);border:1px solid var(--line);color:var(--fg3)}
.iwe-news-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.iwe-news-text{flex:1;min-width:0}
.iwe-news-title{display:flex;align-items:center;gap:8px;min-width:0;font-size:14px;font-weight:600;line-height:20px;letter-spacing:-.01em;color:inherit}
.iwe-news-title>span:last-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.iwe-news-sum{margin-top:4px;font-size:13px;line-height:20px;color:inherit;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iwe-news-more{flex:none;display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:5px;border:1px solid var(--primary,#1abc9c);background:transparent;color:var(--primary,#1abc9c);font-size:13px;font-weight:500;transition:background .15s,color .15s}
.iwe-news-card:hover .iwe-news-more{background:var(--primary,#1abc9c);color:#fff}
.iwe-news-more svg{transition:transform .15s}
.iwe-news-card:hover .iwe-news-more svg{transform:translateX(2px)}
@media (max-width:600px){
  .iwe-news-card{gap:12px;padding:10px 12px 10px 10px;min-height:64px}
  .iwe-news-thumb{width:80px;height:46px;border-radius:6px}
    .iwe-news-more{width:32px;padding:0;justify-content:center;border-radius:50%}
  .iwe-news-more .t{display:none}
}

.iwe-news-dlg{position:fixed;inset:0;z-index:99000;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:rgba(0,0,0,.4);opacity:0;transition:opacity .18s ease;font-family:Inter,"Geist",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
.iwe-news-dlg.open{opacity:1}
.iwe-news-panel{display:flex;flex-direction:column;width:min(720px,100%);max-height:100%;border-radius:12px;background:var(--card);color:var(--fg);border:1px solid var(--line);box-shadow:0 0 0 1px rgba(0,0,0,.02),0 8px 40px rgba(0,0,0,.18);transform:translateY(8px) scale(.985);transition:transform .28s cubic-bezier(.22,1,.36,1)}
.iwe-news-dlg.open .iwe-news-panel{transform:none}
.iwe-news-head{flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 12px 12px 20px;border-bottom:1px solid var(--line);font-size:14px;font-weight:600;letter-spacing:-.01em}
.iwe-news-head .r{display:flex;align-items:center;gap:8px}
.iwe-news-kbd{display:inline-flex;align-items:center;height:20px;padding:0 6px;border-radius:5px;border:1px solid var(--line2);background:var(--sunk);color:var(--fg2);font:500 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace}
@media (hover:none){.iwe-news-kbd{display:none}}
.iwe-news-x{appearance:none;display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--fg2);cursor:pointer;transition:background .15s,color .15s}
.iwe-news-x:hover{background:var(--sunk);color:var(--fg)}
.iwe-news-body{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:20px;font-size:14px;line-height:1.65}
.iwe-news-body .markdown{display:block!important;color:var(--fg)}
.iwe-news-body .markdown img{display:block;max-width:100%;height:auto;border-radius:8px;border:1px solid var(--line)}
.iwe-news-body .markdown .text--h3,.iwe-news-body .markdown .text--h2{margin:20px 0 6px;font-size:16px;font-weight:600;letter-spacing:-.01em;color:var(--fg)}
.iwe-news-body .markdown>p:first-child+.text{margin-top:16px}
.iwe-news-body .markdown a{color:var(--blue)}
/* 手机：底部抽屉，贴底全宽、顶部圆角、顶上有拖动条，可下滑关闭；按钮放大到好点的尺寸 */
@media (max-width:600px){
  .iwe-news-dlg{align-items:flex-end;padding:0}
  .iwe-news-panel{width:100%;max-height:88dvh;border-radius:16px 16px 0 0;border-bottom:0;transform:translateY(100%);transition:transform .32s cubic-bezier(.22,1,.36,1)}
  .iwe-news-dlg.open .iwe-news-panel{transform:none}
  .iwe-news-head{position:relative;padding:18px max(8px,env(safe-area-inset-right)) 10px max(16px,env(safe-area-inset-left));touch-action:none}
  .iwe-news-head::before{content:"";position:absolute;top:7px;left:50%;width:36px;height:4px;margin-left:-18px;border-radius:2px;background:var(--line2)}
  .iwe-news-x{width:40px;height:40px}
  .iwe-news-body{padding:16px max(16px,env(safe-area-inset-right)) calc(20px + env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))}
}
@media (prefers-reduced-motion:reduce){.iwe-news-dlg,.iwe-news-panel{transition:none}}
`,
    scan() {
      if (dlg) return; // 浮窗开着时，内容已搬走，别重建
      const md = document.querySelector(SEL);
      if (!md) return;
      const block = md.closest('.block');
      if (!block) return;
      // 大标题：用站点自己的标题样式（和「Trending videos / 订阅」同一套 class），插在公告行的上方
      // 只有一个：没登录 / 非会员时站点会在标题和公告行之间再插一行广告，这时把已有的标题挪回公告行正上方，不能再插一个（否则出现两个「公告」，上面那个顶着广告）
      const row = block.closest('.row');
      if (row) {
        const hd = document.querySelector('[data-iwe-news-h]') || h('div.text.mt-2.mb-2.text--h2.text--bold', { 'data-iwe-news-h': '' }, t('newsLabel'));
        if (row.previousElementSibling !== hd) row.parentElement.insertBefore(hd, row);
      }
      const sig = md.textContent.length + ':' + (md.querySelector('img') || {}).src;
      if (block.__iweNews === sig) return;
      block.__iweNews = sig;
      block.querySelectorAll(':scope > .iwe-news-card').forEach((e) => e.remove());
      block.classList.add('iwe-news-on');
      block.insertBefore(build(block, md), block.firstChild);
    },
    leave() { close(); document.querySelectorAll('[data-iwe-news-h]').forEach((e) => e.remove()); },
  });
})();
