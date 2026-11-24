// 页脚重做：站点页脚是三大列（链接 / 公告 / 最近的论坛帖子），每个页面底部占大半屏，而且内容区还没长出来时它们会先顶到最上面闪一下。
// 这里改成两张并排的小卡 + 一条底栏：
//   · 左卡「链接」：每个链接是一枚小胶囊（高级会员 / Wura 保留站点自己的颜色），自动换行；
//   · 右卡「最近的论坛帖子」：只列最新 4 条，标题单行省略、时间靠右，整行可点；
//   · 底栏：版权 / 版本号靠左，「公告」靠右——点开在弹层里看完整公告（原来占整列的那块内容，打开时搬进去，关闭时搬回，站点自己的链接 / 翻译钮照常可用）。
// 手机上两张卡上下排。
// 内容区还没长出来（高度不足）时页脚先隐藏，长出来再淡入；页面本来就很短的（登录页等）1.5 秒后兜底显示。
// 可在设置里单独关掉（功能名 footerCompact）。

(() => {
  defineStrings(
    { ftNews: '公告', ftClose: '关闭' },
    { ftNews: 'News', ftClose: 'Close' },
    { ftNews: 'お知らせ', ftClose: '閉じる' },
  );

  const horn = () => { const tpl = document.createElement('template'); tpl.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1ZM15.500 9a4 4 0 0 1 0 6M18.500 6.500a8 8 0 0 1 0 11"/></svg>'; return tpl.content.firstChild; };
  const READY_H = 260;
  let lastPath = '', fallback = 0, dlg = null, home = null, onKey = null;
  const setReady = (on) => document.documentElement.classList.toggle('iwe-ft-ready', on);

  function closeNews() {
    if (!dlg) return;
    const d = dlg; dlg = null;
    removeEventListener('keydown', onKey, true);
    unlockScroll();
    if (home && home.parent.isConnected) home.parent.append(home.el); // 页脚被站点重绘掉了就不搬了
    home = null;
    d.classList.remove('open');
    setTimeout(() => d.remove(), 200);
  }
  function openNews(md) {
    if (dlg || !md) return;
    home = { el: md, parent: md.parentElement };
    const x = h('button.iwe-ftd-x', { type: 'button', 'aria-label': t('ftClose'), title: t('ftClose'), onclick: closeNews }, icon('x', 18));
    const panel = h('div.iwe-ftd-panel', { role: 'dialog', 'aria-modal': 'true', 'aria-label': t('ftNews') },
      h('div.iwe-ftd-head', h('span', t('ftNews')), x), h('div.iwe-ftd-body', md));
    dlg = h('div.iwe-ftd', panel);
    dlg.addEventListener('pointerdown', (e) => { if (e.target === dlg) closeNews(); });
    onKey = (e) => { if (e.key === 'Escape' && !document.querySelector('.iwe-mdi')) { e.preventDefault(); e.stopPropagation(); closeNews(); } };
    addEventListener('keydown', onKey, true);
    document.body.append(dlg);
    lockScroll();
    requestAnimationFrame(() => dlg && dlg.classList.add('open'));
  }

  function apply() {
    const ft = document.querySelector('footer.footer');
    if (!ft) return;
    const row = ft.querySelector('.container-fluid > .row');
    const line = row && row.querySelector(':scope > .col-12.mt-4');
    if (line && !line.querySelector('.iwe-ft-news')) {
      line.append(h('button.iwe-ft-news', { type: 'button', onclick: () => openNews(ft.querySelector('.container-fluid > .row > .col-lg-6 .markdown')) }, horn(), h('span', t('ftNews'))));
    }
    // 内容长出来之前不显示页脚
    const content = document.querySelector('section.content');
    const tall = content && content.getBoundingClientRect().height >= READY_H;
    if (location.pathname !== lastPath) { lastPath = location.pathname; setReady(false); clearTimeout(fallback); fallback = 0; }
    if (tall) { clearTimeout(fallback); fallback = 0; setReady(true); }
    else if (!document.documentElement.classList.contains('iwe-ft-ready') && !fallback) fallback = setTimeout(() => { fallback = 0; setReady(true); }, 1500);
  }

  site.register('footerCompact', {
    css: `
html:not(.iwe-ft-ready) footer.footer{opacity:0;pointer-events:none}
footer.footer{transition:opacity .25s ease;padding-top:24px!important;padding-bottom:20px!important}
/* 网格：两张卡并排，底栏通栏；站点原来的三列（含整列公告）改由我们排版 */
footer.footer .container-fluid>.row{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:16px;margin:0}
footer.footer .container-fluid>.row>div{width:auto;max-width:none;flex:none;padding:0;margin:0}
footer.footer .container-fluid>.row>.col-lg-6{display:none}
footer.footer .container-fluid>.row>.col-12.mt-4{grid-column:1/-1;margin:0!important}
footer.footer .container-fluid>.row>div>.block{height:100%;margin:0;padding:16px 18px;box-sizing:border-box}
/* 卡片标题：图标 + 粗体小标题，同一行、同一基线 */
footer.footer .block__content{display:block}
footer.footer .block__content>.icon{display:inline-flex;vertical-align:middle;margin-right:8px!important;color:var(--primary,#1abc9c)}
footer.footer .block__content>.text--bold{display:inline-block;vertical-align:middle;margin:0!important;font-size:15px;font-weight:700;line-height:20px}
footer.footer .block__content>ul{margin:12px 0 0;padding:0;list-style:none}
/* 链接：小胶囊 */
footer.footer .container-fluid>.row>div:first-child .block__content>ul{display:flex;flex-wrap:wrap;gap:8px}
footer.footer .container-fluid>.row>div:first-child .block__content>ul>li{margin:0;padding:0}
footer.footer .container-fluid>.row>div:first-child .block__content>ul a{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;background:rgba(128,128,128,.12);font-size:13px;line-height:1;text-decoration:none;transition:background .15s}
footer.footer .container-fluid>.row>div:first-child .block__content>ul a:hover{background:rgba(128,128,128,.24)}
footer.footer .container-fluid>.row>div:first-child .block__content>ul a .icon{display:inline-flex;align-items:center;margin:0}
footer.footer .container-fluid>.row>div:first-child .block__content>ul a .icon svg{height:13px;width:auto}
footer.footer .container-fluid>.row>div:first-child .block__content>ul a .text{margin:0;font-size:13px}
/* 论坛帖子：最新 4 条，一行一个 */
footer.footer .footer__threads li:nth-child(n+5){display:none}
footer.footer .footer__threads{margin-top:8px!important}
footer.footer .footer__threads li{margin:0;padding:0}
footer.footer .footer__threads a{display:flex;align-items:center;justify-content:space-between;gap:12px;height:34px;margin:0 -8px;padding:0 8px;border-radius:6px;text-decoration:none;transition:background .15s}
footer.footer .footer__threads a:hover{background:rgba(128,128,128,.14)}
footer.footer .footer__threads a>.text{margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px}
footer.footer .footer__threads a>.text--muted{flex:none;font-size:12px}
/* 底栏 */
footer.footer .container-fluid>.row>.col-12.mt-4{display:flex;align-items:center;gap:8px;min-height:32px}
footer.footer .container-fluid>.row>.col-12.mt-4>a{margin-right:auto;display:flex;align-items:center} /* 链接本身是 16px 字号的块，里面 11px 的「ver.」会沉到基线：改成 flex 让它和「© Iwara」同高居中 */
/* 暗色主题的页脚底色（用户 2026-11-24 指定） */
body.dark footer.footer{background-color:#282c34!important}
.iwe-ft-news{appearance:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:0;border-radius:999px;background:rgba(128,128,128,.12);color:var(--primary,#1abc9c);font:inherit;font-size:13px;cursor:pointer;transition:background .15s}
.iwe-ft-news:hover{background:rgba(128,128,128,.24)}
@media (max-width:991px){
  /* 页脚外层 16px + container-fluid 自带内边距叠在一起，卡片比上面的内容卡片多缩进一截：手机上只留一层 12px，与内容卡片左右对齐 */
  footer.footer{padding-left:12px!important;padding-right:12px!important}
  footer.footer .container-fluid{padding-left:0!important;padding-right:0!important}
  footer.footer .container-fluid>.row{grid-template-columns:minmax(0,1fr)}
}
/* 公告弹层：电脑居中小窗，手机贴底抽屉 */
.iwe-ftd{position:fixed;inset:0;z-index:99000;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:rgba(0,0,0,.4);opacity:0;transition:opacity .18s ease}
.iwe-ftd.open{opacity:1}
.iwe-ftd-panel{display:flex;flex-direction:column;width:min(720px,100%);max-height:100%;border-radius:12px;background:var(--body-dark,var(--body));color:var(--text);box-shadow:0 8px 40px rgba(0,0,0,.3);transform:translateY(8px) scale(.985);transition:transform .28s cubic-bezier(.22,1,.36,1)}
.iwe-ftd.open .iwe-ftd-panel{transform:none}
.iwe-ftd-head{flex:none;display:flex;align-items:center;justify-content:space-between;padding:12px 12px 12px 20px;border-bottom:1px solid rgba(128,128,128,.25);font-weight:700}
.iwe-ftd-x{appearance:none;display:grid;place-items:center;width:36px;height:36px;padding:0;border:0;border-radius:8px;background:transparent;color:inherit;cursor:pointer}
.iwe-ftd-x:hover{background:rgba(128,128,128,.2)}
.iwe-ftd-body{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:20px}
.iwe-ftd-body .markdown img{max-width:100%;height:auto;border-radius:8px}
@media (max-width:600px){
  .iwe-ftd{align-items:flex-end;padding:0}
  .iwe-ftd-panel{width:100%;max-height:86dvh;border-radius:16px 16px 0 0;transform:translateY(100%);transition:transform .32s cubic-bezier(.22,1,.36,1)}
  .iwe-ftd-body{padding-bottom:calc(20px + env(safe-area-inset-bottom))}
}
@media (prefers-reduced-motion:reduce){footer.footer,.iwe-ftd,.iwe-ftd-panel{transition:none}}
`,
    scan: apply,
    leave() { setReady(true); clearTimeout(fallback); fallback = 0; closeNews(); },
  });
})();
