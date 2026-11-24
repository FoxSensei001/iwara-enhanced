// 悬停即开：头像菜单不用点，鼠标移上去就展开；菜单里的「创造」再悬停，侧边弹出创造页里的那组选项。
//
// 「创造」的选项不写死：悬停时在页面里用一个看不见的同源 iframe 打开 /create，等站点自己把选项渲染出来，
// 再把每一项的链接、图标、文字读出来。官方以后增删选项（或按角色不同）都会自动跟上；读到的结果缓存起来，
// 下次悬停立刻出现，并在后台悄悄刷新。读不到（没登录、超时、站点改版）就退回下面内置的一份。
//
// 站点结构（来自站点前端源码）：
// - 头像：.dropdown > .dropdown__toggle > .header__avatar；内容 .dropdown__content，只有 .dropdown--open 才显示，
//   打开靠 React 状态（点击切换），所以这里不去碰状态，只用样式在悬停时把内容显示出来。
// - 「创造」：.dropdown__content 里 a[href="/create"]；创造页的选项由角色决定：
//   user：video image post thread poll；officer 多 page rule；admin 再多 product；每项指向 /create/<type>。
// 触屏没有悬停：整段样式只在 (hover:hover) 下生效，点击打开的老办法照旧。

(() => {
  defineStrings(
    { hmLoading: '加载中…', hmVideo: '视频', hmImage: '图片', hmPost: '帖子', hmThread: '主题', hmPoll: '投票', hmPage: '页面', hmRule: '规则', hmProduct: '商品' },
    { hmLoading: 'Loading…', hmVideo: 'Video', hmImage: 'Image', hmPost: 'Post', hmThread: 'Thread', hmPoll: 'Poll', hmPage: 'Page', hmRule: 'Rule', hmProduct: 'Product' },
    { hmLoading: '読み込み中…', hmVideo: '動画', hmImage: '画像', hmPost: '投稿', hmThread: 'スレッド', hmPoll: '投票', hmPage: 'ページ', hmRule: 'ルール', hmProduct: '商品' },
  );
  // 图标：Font Awesome Free 6 Solid（CC BY 4.0，https://fontawesome.com/license/free），与站点菜单里的实心图标同一套
  const FA = {
    video: [576, 512, 'M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z'],
    image: [576, 512, 'M160 32c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H328 280 200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120z'],
    post: [512, 512, 'M96 96c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H80c-44.2 0-80-35.8-80-80V128c0-17.7 14.3-32 32-32s32 14.3 32 32V400c0 8.8 7.2 16 16 16s16-7.2 16-16V96zm64 24v80c0 13.3 10.7 24 24 24H296c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24H184c-13.3 0-24 10.7-24 24zm208-8c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H384c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H384c-8.8 0-16 7.2-16 16zM160 304c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z'],
    thread: [640, 512, 'M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z'],
    poll: [448, 512, 'M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm64 192c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm64-64c0-17.7 14.3-32 32-32s32 14.3 32 32V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V160zM320 288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32z'],
    page: [384, 512, 'M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z'],
    rule: [512, 512, 'M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z'],
    product: [448, 512, 'M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z'],
  };
  // 内置兜底：与创造页按角色给出的选项一致（user / officer / admin 逐级增加）
  const FALLBACK = {
    user: ['video', 'image', 'post', 'thread', 'poll'],
    officer: ['video', 'image', 'post', 'thread', 'poll', 'page', 'rule'],
    admin: ['video', 'image', 'post', 'thread', 'poll', 'page', 'rule', 'product'],
  };
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const svgOf = (name) => {
    const [w, hh, d] = FA[name];
    return `<svg viewBox="0 0 ${w} ${hh}" fill="currentColor" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
  };
  function fallbackItems() {
    const role = (env.user && env.user.role) || 'user';
    return (FALLBACK[role] || FALLBACK.user).map((type) => ({ href: '/create/' + type, label: t('hm' + cap(type)), icon: svgOf(type) }));
  }

  // ── 读取站点自己的创造页 ─────────────────────────────────────────
  const TTL = 6 * 3600 * 1000; // 缓存超过 6 小时才在后台重读
  const cacheKey = () => 'hmCreate:' + (localStorage.getItem('locale') || '');
  const FETCH_TIMEOUT = 20000;
  /** 在看不见的 iframe 里打开 /create，读出 [{href,label,icon}]；读不到就 reject。 */
  function readLive() {
    return new Promise((resolve, reject) => {
      const f = h('iframe', { src: '/create', tabindex: '-1', 'aria-hidden': 'true', title: '' });
      f.style.cssText = 'position:fixed;left:-9999px;top:0;width:1280px;height:800px;border:0;opacity:0;pointer-events:none';
      let done = false, timer = 0, poll = 0;
      const finish = (err, val) => {
        if (done) return; done = true; clearTimeout(timer); clearInterval(poll); f.remove();
        err ? reject(err) : resolve(val);
      };
      const read = () => {
        let doc; try { doc = f.contentDocument; } catch { return; }
        if (!doc) return;
        const links = [...doc.querySelectorAll('.page-create__selectType a[href^="/create/"]')];
        if (!links.length) return;
        const items = links.map((a) => {
          const svg = a.querySelector('svg');
          return { href: a.getAttribute('href'), label: (a.textContent || '').trim(), icon: svg ? svg.outerHTML : '' };
        }).filter((x) => x.href && x.label);
        if (items.length) finish(null, items);
      };
      timer = setTimeout(() => finish(new Error('timeout')), FETCH_TIMEOUT);
      poll = setInterval(read, 250);
      document.body.append(f);
    });
  }

  // ── 状态：所有已建出的弹层共用一份 ────────────────────────────────
  let status = 'idle', items = null, inflight = null;
  const flies = new Set();
  function renderFly(fly) {
    if (status === 'loading' || !items) {
      fly.replaceChildren(h('li.iwe-fly-loading', h('span.iwe-spin'), h('span', t('hmLoading'))));
      return;
    }
    fly.replaceChildren(...items.map((it) => {
      const icon = h('span.icon.ml-3');
      icon.innerHTML = it.icon || '';
      const a = h('a.userDropdownContent__link', { href: it.href }, icon, h('span.text.iwe-fly-label', it.label)) /* 站点菜单项是「图标在前、文字在后」，行内反向排列后图标在右 */;
      a.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault(); // 站点是单页应用：走它自己的路由，不整页刷新
        history.pushState({}, '', it.href);
        dispatchEvent(new PopStateEvent('popstate'));
        scrollTo(0, 0);
      });
      return h('li', a);
    }));
  }
  const renderAll = () => { for (const f of flies) { if (f.isConnected) renderFly(f); else flies.delete(f); } placeHovered(); }; // 选项数量变了，高度也变，在场的弹层重新定位

  /** 悬停时调用：有缓存立刻用，过期则后台刷新；没有缓存就显示「加载中」并去读。 */
  function ensureLoaded() {
    if (inflight || status === 'ready') return;
    const cached = store.get(cacheKey(), null);
    if (cached && Array.isArray(cached.items) && cached.items.length) {
      items = cached.items; status = 'ready'; renderAll();
      if (Date.now() - (cached.at || 0) > TTL) refresh();
      return;
    }
    status = 'loading'; renderAll();
    refresh();
  }
  function refresh() {
    if (inflight) return inflight;
    inflight = readLive().then((list) => {
      items = list; status = 'ready';
      store.set(cacheKey(), { at: Date.now(), items: list });
    }, () => {
      // 读不到：有旧数据就继续用旧的，没有就用内置的（不写缓存，下次悬停再试）
      if (!items) items = fallbackItems();
      status = 'ready';
    }).finally(() => { inflight = null; renderAll(); });
    return inflight;
  }

  /** 弹层用 fixed 定位（不被菜单的滚动容器裁掉）：贴在「创造」行的左边，顶端对齐该行，窗口矮时上移，保证整个都在可视区内 */
  function place(li) {
    const fly = li.querySelector(':scope > .iwe-create-fly');
    if (!fly) return;
    const r = li.getBoundingClientRect();
    const vh = innerHeight;
    fly.style.display = 'block'; fly.style.visibility = 'hidden';
    const ph = Math.min(fly.offsetHeight, vh - 16);
    fly.style.display = ''; fly.style.visibility = '';
    fly.style.top = Math.max(8, Math.min(r.top, vh - 8 - ph)) + 'px';
    fly.style.right = (document.documentElement.clientWidth - r.left) + 'px';
  }
  const placeHovered = () => { for (const li of document.querySelectorAll('li.iwe-has-fly:hover')) place(li); };
  addEventListener('resize', placeHovered);

  function buildFly() {
    const fly = h('ul.iwe-create-fly');
    flies.add(fly);
    renderFly(fly);
    return fly;
  }

  // ── 顶栏「创造」按钮：悬停弹出同一组选项，点击仍是进入创造页 ───────────────────
  // 弹层是 body 下的固定定位元素（不动站点的节点）；按钮和弹层之间用一个短延迟衔接，鼠标从按钮移进弹层不会断。
  function bindHeaderCreate(a) {
    // 外壳直接用站点头像菜单同一个 class（dropdown__content）：背景、圆角、行内边距、悬停底色、字号都由站点样式给，和头像菜单一致
    const list = h('ul');
    const pop = h('div.dropdown__content.iwe-create-pop', list);
    pop.__a = a; pop.__list = list;
    flies.add(list); renderFly(list);
    document.body.append(pop);
    let timer = 0;
    const fine = () => matchMedia('(hover:hover) and (pointer:fine)').matches;
    const show = () => {
      if (!fine()) return;
      clearTimeout(timer);
      ensureLoaded();
      const r = a.getBoundingClientRect();
      const w = Math.max(168, pop.offsetWidth || 168);
      pop.style.top = Math.round(r.bottom) + 'px';
      pop.style.left = Math.round(Math.min(Math.max(8, r.left + r.width / 2 - w / 2), document.documentElement.clientWidth - w - 8)) + 'px';
      pop.style.maxHeight = (innerHeight - r.bottom - 12) + 'px';
      pop.classList.add('show');
    };
    const hide = () => { clearTimeout(timer); timer = setTimeout(() => pop.classList.remove('show'), 160); };
    a.addEventListener('mouseenter', show);
    a.addEventListener('mouseleave', hide);
    pop.addEventListener('mouseenter', () => clearTimeout(timer));
    pop.addEventListener('mouseleave', hide);
    pop.addEventListener('click', () => { clearTimeout(timer); pop.classList.remove('show'); }); // 选了一项：立刻收起
    a.addEventListener('click', () => { clearTimeout(timer); pop.classList.remove('show'); }); // 点按钮本身进创造页：同样收起
    addEventListener('scroll', () => pop.classList.remove('show'), { passive: true });
  }

  site.register('hoverMenus', {
    css: `
/* 「创造」的选项列表（所有设备共用的外观）：文字靠左、图标靠右，与上一级菜单的行一致 */
.iwe-create-fly{margin:0;padding:0;list-style:none}
/* 菜单图标槽定宽居中：站点图标 div 固定 16px，但 svg 宽度各异（14~20px）会溢出，右对齐后各图标中心线参差；统一成 24px 槽 + 居中 */
.dropdown__content .userDropdownContent__link .icon{box-sizing:border-box;flex:none;width:24px;min-width:24px;margin-left:12px;display:inline-flex;align-items:center;justify-content:center}
.dropdown__content .userDropdownContent__link .icon svg{width:auto;height:1em;max-width:100%;overflow:visible}
/* 行的版式（图标在右、文字撑开）、内边距、悬停底色都沿用站点头像菜单的 .dropdown__content ul li a / .userDropdownContent__link；这里只管图标大小和加载行 */
.iwe-create-fly .icon,.iwe-create-pop .icon{display:inline-flex;align-items:center}
.iwe-create-fly .icon svg,.iwe-create-pop .icon svg{height:1em;width:auto}
.iwe-fly-loading{display:flex;align-items:center;gap:10px;padding:12px 16px;color:var(--text);opacity:.75;white-space:nowrap}
.iwe-spin{flex:none;width:16px;height:16px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:iwe-spin .7s linear infinite}
/* 顶栏「创造」按钮悬停时的下拉：出现（淡入 + 下移回位）和消失（淡出 + 上移）都带动画；退出完成后才 visibility:hidden。
   外观（背景 / 圆角 / 最小宽度）来自站点的 .dropdown__content，这里只改定位、显隐和滚动 */
.dropdown__content.iwe-create-pop{display:block;position:fixed;z-index:10000;top:64px;left:0;overscroll-behavior:contain;overflow-y:auto;scrollbar-width:thin;opacity:0;transform:translateY(-6px);visibility:hidden;pointer-events:none;transition:opacity .14s ease-in,transform .16s ease-in,visibility 0s linear .16s}
.dropdown__content.iwe-create-pop.show{opacity:1;transform:none;visibility:visible;pointer-events:auto;transition:opacity .16s ease-out,transform .24s cubic-bezier(.2,.9,.3,1.15),visibility 0s}
/* 手机 / 触屏 / 没有悬停的设备：点「创造」就在原地展开选项（带高度过渡），再点收起，不跳页面 */
.header .dropdown__content li.iwe-has-fly > .iwe-create-fly{display:block;position:static;overflow:hidden;max-height:0;opacity:0;background:rgba(128,128,128,.12);transition:max-height .22s ease,opacity .18s ease}
.header .dropdown__content li.iwe-has-fly.iwe-fly-open > .iwe-create-fly{max-height:min(60vh,480px);opacity:1;overflow-y:auto}
@media (hover:hover) and (pointer:fine){
  /* 头像菜单：悬停显示，位置与站点点击打开时一致（top:130%）。头像与菜单之间的空隙用 ::after 垫起来，鼠标穿过不会断；
     窗口矮时菜单自己可以上下滑（高度不超过窗口）；侧边弹层用 fixed 定位，不会被这个滚动容器裁掉 */
  .header .dropdown:has(.header__avatar):hover > .dropdown__content{display:block;top:130%;right:0;max-height:calc(100vh - 100px);max-height:calc(100dvh - 100px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
  .header .dropdown:has(.header__avatar):hover::after{content:'';position:absolute;top:100%;right:0;width:220px;height:calc(30% + 6px)}
  .header .dropdown:has(.header__avatar) > .dropdown__content ul{border-radius:5px}
  .header .dropdown:has(.header__avatar) > .dropdown__content ul li:first-child a{border-radius:5px 5px 0 0}
  .header .dropdown:has(.header__avatar) > .dropdown__content ul li:last-child a{border-radius:0 0 5px 5px}
  /* 电脑：「创造」悬停（或点击）时，选项向左侧弹出，顶端对齐这一行，和菜单之间不留缝 */
  .header .dropdown__content li.iwe-has-fly{position:relative}
  .header .dropdown__content li.iwe-has-fly > .iwe-create-fly{display:none;position:fixed;top:8px;right:0;max-height:calc(100vh - 16px);opacity:1;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;min-width:200px;background:var(--body-darker);border-radius:5px;z-index:10000;transition:none}
  .header .dropdown__content li.iwe-has-fly:hover > .iwe-create-fly{display:block;animation:iwe-fly-in .14s ease-out}
  .iwe-create-fly li:first-child a{border-radius:5px 5px 0 0}
  .iwe-create-fly li:last-child a{border-radius:0 0 5px 5px}
}
/* 触屏：头像菜单点开后是贴底的圆角面板（与侧栏的底部面板同款），不再挂在头像下面的小下拉；
   背后的压暗用超大 box-shadow 画，不是真元素——点暗处仍算「菜单之外」，站点自己的点外面关闭照常生效 */
@media not all and (hover:hover) and (pointer:fine){
  .header .dropdown:has(.header__avatar) > .dropdown__content{position:fixed;left:8px;right:8px;top:auto;bottom:calc(8px + env(safe-area-inset-bottom));width:auto;min-width:0;max-height:78dvh;overflow-y:auto;overscroll-behavior:contain;border-radius:14px;z-index:10040;box-shadow:0 0 0 100vmax rgba(0,0,0,.35),0 8px 40px rgba(0,0,0,.25)}
  .header .dropdown--open:has(.header__avatar) > .dropdown__content{animation:iwe-sheet-up .28s cubic-bezier(.22,1,.36,1)}
  .header .dropdown:has(.header__avatar) > .dropdown__content .userDropdownContent__link{min-height:44px}
  .header .dropdown:has(.header__avatar) > .dropdown__content ul{border-radius:0}
}
@keyframes iwe-sheet-up{from{opacity:0;transform:translateY(24px)}}
@keyframes iwe-spin{to{transform:rotate(360deg)}}
@keyframes iwe-fly-in{from{opacity:0;transform:translateX(6px)}}
@media (prefers-reduced-motion:reduce){.iwe-spin{animation-duration:2s}.iwe-create-fly{animation:none!important;transition:none!important}.iwe-create-pop,.iwe-create-pop.show{transform:none!important;transition:opacity .12s linear,visibility 0s linear .12s}.iwe-create-pop.show{transition:opacity .12s linear,visibility 0s}}
`,
    scan() {
      for (const pop of document.querySelectorAll('.iwe-create-pop')) if (!pop.__a.isConnected) { flies.delete(pop.__list); pop.remove(); } // 站点把按钮重渲染成新节点：旧的弹层清掉
      for (const a of document.querySelectorAll('.header a.header__link[href="/create"]')) {
        if (a.dataset.iweCreatePop) continue;
        a.dataset.iweCreatePop = '1';
        bindHeaderCreate(a);
      }
      for (const dd of document.querySelectorAll('.header .dropdown')) {
        if (dd.dataset.iweHover || !dd.querySelector('.header__avatar')) continue;
        dd.dataset.iweHover = '1';
        dd.addEventListener('mouseenter', ensureLoaded); // 鼠标一到头像就开始读，走到「创造」时多半已经好了
      }
      for (const a of document.querySelectorAll('.header .dropdown__content a[href="/create"]')) {
        const li = a.closest('li');
        if (!li || li.dataset.iweFly) continue;
        li.dataset.iweFly = '1';
        li.classList.add('iwe-has-fly');
        li.append(buildFly());
        li.addEventListener('mouseenter', () => { ensureLoaded(); place(li); });
        // 点「创造」不再跳转：电脑上选项已随悬停弹出（点击只是确保读取），手机 / 触屏上点一下展开、再点收起
        a.addEventListener('click', (e) => {
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return; // 中键 / 修饰键仍按老办法在新标签打开
          e.preventDefault(); e.stopPropagation(); // 站点的 Link 在冒泡到根节点后才处理，这里先拦下
          ensureLoaded();
          if (matchMedia('(hover:hover) and (pointer:fine)').matches) place(li);
          else li.classList.toggle('iwe-fly-open');
        }, true);
        const content = li.closest('.dropdown__content');
        if (content && !content.dataset.iweScroll) { content.dataset.iweScroll = '1'; content.addEventListener('scroll', placeHovered, { passive: true }); }
      }
    },
  });
})();
