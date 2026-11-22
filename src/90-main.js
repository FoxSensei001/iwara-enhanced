// 入口：盯着站内路由，在发布 / 编辑 / 内容管理这几页把原内容藏起来，换上工作台。
// 只藏不删：原页面的节点一个都不动，随时能切回去。

const HOST_ID = 'iwe-host';

function matchRoute(path) {
  let m;
  if ((m = path.match(/^\/create\/(video|image)\/?$/))) return { view: 'wizard', kind: m[1] };
  if ((m = path.match(/^\/(video|image)\/([^/]+)(?:\/[^/]+)?\/edit\/?$/))) return { view: 'wizard', kind: m[1], editId: m[2] };
  if ((m = path.match(/^\/account\/content\/(video|image)s\/?$/))) return { view: 'manage', kind: m[1] };
  return null;
}

const studio = (() => {
  // gen：每次挂载加一。sync() 里有 await，期间可能又被触发一次（站点刷新时会重渲染内容区）；
  // 旧的那次醒来时路由 key 跟新的一样，只比 key 会让两次都把界面插进去——必须比代次。
  let host = null, appEl = null, cleanup = null, currentKey = null, booted = null, backPill = null, retryAt = 0, gen = 0;
  const off = () => sessionStorage.getItem(NS + 'off') === '1';

  function ensureGlobalStyle() {
    if (document.getElementById('iwe-global')) return;
    document.head.append(h('style', { id: 'iwe-global' }, `section.content.iwe-on>:not(#${HOST_ID}){display:none!important}section.content.iwe-on{padding:0!important;margin-bottom:0!important;display:block!important}#${HOST_ID}{display:block;width:100%}.page.iwe-page>footer.footer{display:none!important}
#iwe-back{position:fixed;right:20px;bottom:20px;z-index:99999;height:36px;padding:0 14px;border-radius:999px;border:1px solid rgba(128,128,128,.4);background:#111;color:#fff;font:500 13px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25)}`));
  }

  function mountHost(section) {
    host = h('div', { id: HOST_ID });
    const root = host.attachShadow({ mode: 'open' });
    appEl = h('div.app');
    ui.layer = h('div.layer');
    appEl.append(ui.layer);
    root.append(h('style', STYLE.join('\n')), appEl);
    ui.root = root;
    installTips(appEl);
    section.append(host);
    section.classList.add('iwe-on');
    section.closest('.page') && section.closest('.page').classList.add('iwe-page');
    theme();
  }
  function theme() {
    if (!appEl) return;
    appEl.dataset.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    // 站点左侧菜单是浮在内容上的：给它让出位置
    const side = document.querySelector('.page > .menu');
    const r = side && getComputedStyle(side).position === 'fixed' ? side.getBoundingClientRect() : null;
    const pad = r && r.width < innerWidth * 0.5 && r.right > 0 ? Math.round(r.right) : 0;
    if (appEl.dataset.pad !== String(pad)) { appEl.dataset.pad = pad; appEl.style.paddingLeft = pad + 'px'; }
    // 站点顶栏也是固定浮着的：有的页面（发布页）站点自己留了顶部空间，有的（内容管理页）没留，内容会压在顶栏底下。
    // 按顶栏底边和我们在文档里的起点算差多少补多少
    const hdr = document.querySelector('header.header, .page > header, header');
    const hb = hdr && getComputedStyle(hdr).position === 'fixed' ? hdr.getBoundingClientRect().bottom : 0;
    const padTop = host ? Math.max(0, Math.round(hb - (host.getBoundingClientRect().top + scrollY))) : 0;
    if (appEl.dataset.padTop !== String(padTop)) { appEl.dataset.padTop = padTop; appEl.style.paddingTop = padTop + 'px'; }
  }
  function unmount() {
    gen++; // 让还在 await 的那次 sync 醒来后作废
    if (cleanup) { try { cleanup(); } catch { /* 忽略 */ } cleanup = null; }
    document.querySelectorAll('.iwe-on').forEach((el) => el.classList.remove('iwe-on'));
    document.querySelectorAll('.iwe-page').forEach((el) => el.classList.remove('iwe-page'));
    if (host) host.remove();
    host = appEl = null;
    currentKey = null;
  }

  const app = {
    go(path) {
      // 离开工作台的链接（站外，或站内不归工作台管的页面，比如帖子）一律新开页签
      if (/^https?:/.test(path) || !matchRoute(new URL(path, location.origin).pathname)) { openTab(path); return; }
      history.pushState({}, '', path);
      dispatchEvent(new PopStateEvent('popstate'));
      scrollTo(0, 0);
      sync();
    },
    reload() { currentKey = null; sync(); },
    /** 右上角「…」菜单；extra 是当前页面自己的条目，放在最前面。 */
    menu(anchor, extra = []) {
      menu(anchor, [
        ...extra,
        extra.length && '-',
        { icon: 'swap', label: t('original'), onclick: () => { sessionStorage.setItem(NS + 'off', '1'); sync(); } },
      ]);
    },
  };

  async function sync() {
    ensureGlobalStyle();
    const route = matchRoute(location.pathname);
    const key = route ? JSON.stringify(route) : null;
    // 「原版页面」开着时：不接管，只留一个回来的按钮
    if (route && off()) {
      if (host) unmount();
      if (!backPill) { backPill = h('button', { id: 'iwe-back', onclick: () => { sessionStorage.removeItem(NS + 'off'); sync(); } }, '← ' + t('backToStudio')); document.body.append(backPill); }
      return;
    }
    if (backPill) { backPill.remove(); backPill = null; }
    if (!route) { if (host) unmount(); return; }
    if (!localStorage.getItem('token')) return; // 未登录：交给原页面处理
    const section = document.querySelector('section.content');
    if (!section) return;
    if (key === currentKey && host && host.isConnected && section.contains(host)) return;
    unmount();
    currentKey = key;
    const my = ++gen;
    mountHost(section);
    try {
      await (booted || (booted = svc.boot()));
    } catch (e) {
      booted = null;
      retryAt = Date.now() + 5000; // 取用户信息失败：过几秒再试，别连着打接口
      if (my === gen) unmount();
      return;
    }
    if (my !== gen || !appEl) return;
    const stageEl = h('div');
    appEl.insertBefore(stageEl, ui.layer);
    const mounted = route.view === 'manage' ? await mountManage(stageEl, { kind: route.kind, app }) : await mountWizard(stageEl, { kind: route.kind, editId: route.editId, app });
    if (my !== gen) { mounted && mounted(); return; }
    cleanup = mounted;
    if (route.view === 'wizard' && !route.editId && !store.get('tourDone')) {
      setTimeout(() => my === gen && showTour({ onTry: () => cleanup && cleanup.applyTemplate && cleanup.applyTemplate(templates.samples()[0]) }), 500);
    }
  }

  function start() {
    let last = location.pathname;
    const tick = () => {
      const section = document.querySelector('section.content');
      const lost = currentKey && (!host || !host.isConnected || !section || !section.contains(host));
      // 脚本启动时站点可能还没把页面渲染出来（没有内容区可挂）：只要该接管而还没接管，就一直重试
      const pending = !currentKey && !off() && Date.now() >= retryAt && section && matchRoute(location.pathname) && localStorage.getItem('token');
      if (location.pathname !== last || lost || pending) { last = location.pathname; if (lost) currentKey = null; sync(); }
      theme();
    };
    addEventListener('popstate', () => setTimeout(tick, 0));
    setInterval(tick, 300);
    sync();
  }
  return { start, app };
})();

studio.start();
