// 「回到顶部」按钮（几乎所有页面）：滚过一屏后从右下角弹出，点一下平滑回到顶部；回到顶部附近时淡出收起。
// 页面不够长、滚不到阈值的页面（登录、注册等）自然不会出现，所以不需要按路径筛。
// 出现与消失都带动画（淡入 + 上移 + 轻微回弹放大 / 淡出 + 下沉缩小），按下有按压反馈；系统设置了「减少动态效果」时只做淡入淡出、回顶也不滑动。

(() => {
  defineStrings({ totopLabel: '回到顶部' }, { totopLabel: 'Back to top' }, { totopLabel: 'ページ上部へ' });
  // 图标：Font Awesome Free 6 Solid arrow-up（CC BY 4.0，https://fontawesome.com/license/free），与站点菜单图标同一套
  const ARROW = [384, 512, 'M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z'];

  let btn = null, shown = false, ticking = false, bound = false;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const threshold = () => Math.max(480, innerHeight * 0.8);

  function build() {
    const tpl = document.createElement('template');
    tpl.innerHTML = `<svg viewBox="0 0 ${ARROW[0]} ${ARROW[1]}" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="${ARROW[2]}"/></svg>`;
    const b = h('button.iwe-totop', { type: 'button', title: t('totopLabel'), 'aria-label': t('totopLabel'), tabindex: '-1', onclick: () => scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }) }, tpl.content.firstChild);
    document.body.append(b);
    return b;
  }
  function set(on) {
    if (!btn) btn = build();
    if (on === shown) return;
    shown = on;
    btn.classList.toggle('show', on);
    btn.tabIndex = on ? 0 : -1; // 收起后不能再被 Tab 聚焦到
  }
  function update() {
    ticking = false;
    set(scrollY > threshold());
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  site.register('backToTop', {
    css: `
.iwe-totop{position:fixed;right:20px;bottom:24px;z-index:150;display:grid;place-items:center;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:var(--primary,#1ab394);color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.28);cursor:pointer;-webkit-tap-highlight-color:transparent;
  /* 收起：淡出 + 下沉 + 缩小（不回弹），动画结束后才 visibility:hidden，所以收起过程看得见 */
  opacity:0;transform:translateY(14px) scale(.8);visibility:hidden;pointer-events:none;
  transition:opacity .18s ease-in,transform .22s ease-in,visibility 0s linear .22s,background-color .15s}
/* 弹出：淡入 + 上移 + 轻微回弹放大 */
.iwe-totop.show{opacity:1;transform:none;visibility:visible;pointer-events:auto;transition:opacity .2s ease-out,transform .38s cubic-bezier(.34,1.56,.64,1),visibility 0s,background-color .15s}
.iwe-totop.show:hover{background:var(--primary-dark,#16967d);transform:translateY(-3px)}
.iwe-totop.show:active{transform:scale(.9);transition-duration:.08s}
.iwe-totop svg{transition:transform .25s ease}
.iwe-totop.show:hover svg{transform:translateY(-2px)}
.iwe-totop:focus-visible{outline:3px solid #fff;outline-offset:-5px;box-shadow:0 0 0 2px var(--primary,#1ab394),0 4px 14px rgba(0,0,0,.28)}
/* 窄屏：站点列表页底部有居中的「显示筛选」悬浮按钮，往上让开一段 */
@media (max-width:991px){.iwe-totop{right:14px;bottom:80px}}
@media (prefers-reduced-motion:reduce){.iwe-totop,.iwe-totop.show{transform:none!important;transition:opacity .15s linear,visibility 0s linear .15s}.iwe-totop.show{transition:opacity .15s linear,visibility 0s}.iwe-totop svg{transition:none!important}}
`,
    scan() {
      if (!bound) { bound = true; addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); }
      if (!btn) btn = build();
      update();
    },
  });
})();
