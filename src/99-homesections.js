// 首页各分区（订阅 / 热门视频 / 热门图片 …）的整理：
// 1. 去掉每个分区外面那层灰色大容器卡片，让视频 / 图片卡片直接排在页面上；
// 2. 分区大标题变成超链接，点标题直接进对应列表（订阅 → /subscriptions，热门视频 → 热门排序……），悬停显示箭头；
// 3. 容器底部的「查看更多订阅」「最新视频 / 热门视频 / 人气视频」按钮收成简短的图标按钮（订阅 / 最新 / 热门 / 人气），
//    放在两处：标题行右侧、分区最后一行的右侧（看完卡片不用滚回去）；手机上标题行的按钮只留图标；
// 4. 公告标题（99-homenews.js 加的）也是超链接，进全部公告页，不再放按钮。
// 原来的按钮不删，只隐藏；新按钮 / 标题链接点击时转给原按钮点一下，保留站点自己的无刷新跳转（按住 ⌘ / Ctrl / Shift 点则照常新开页签）。
//
// 标题链接、图标按钮这两样给作者页复用（99-profile.js 的「最新视频 / 最新图片」），样式类名（iwe-home-h / -hl / -btns / -btn / -slot）也是共用的。

// 在本文件里赋值：{ buttons(items), linkHeading(heading, it), sectionPager(o) }，items / it = { label, href, orig? }；sectionPager 见下方说明
let iweHomeKit = null;

(() => {
  defineStrings(
    { homeNew: '最新', homeHot: '热门', homePop: '人气', homeSub: '订阅', homePager: '翻页' },
    { homeNew: 'New', homeHot: 'Hot', homePop: 'Top', homeSub: 'Feed', homePager: 'Pages' },
    { homeNew: '新着', homeHot: 'トレンド', homePop: '人気', homeSub: '購読', homePager: 'ページ送り' },
  );
  // 图标：Font Awesome Free 6 Solid（CC BY 4.0，https://fontawesome.com/license/free），与站点按钮 / 菜单里的实心图标同一套
  const FA = {
    clock: [512, 512, 'M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z'],
    flame: [448, 512, 'M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z'],
    heart: [512, 512, 'M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z'],
    bookmark: [384, 512, 'M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z'],
  };

  const ROOT = '.page-home section.content > .container-fluid';
  const svgEl = (name, n) => {
    const [w, hh, d] = FA[name];
    const tpl = document.createElement('template');
    tpl.innerHTML = `<svg viewBox="0 0 ${w} ${hh}" width="${n}" height="${n}" fill="currentColor" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
    return tpl.content.firstChild;
  };

  /** 站点按钮 → 简短文案 + 图标（按地址认：排序参数 trending / popularity / date，订阅，不带参数的列表当「最新」；认不出的用站点原文 + 箭头）。 */
  function describe(it) {
    const q = it.href.split('?')[1] || '';
    if (/sort=trending/.test(q)) return { label: t('homeHot'), icon: svgEl('flame', 14) };
    if (/sort=popularity/.test(q)) return { label: t('homePop'), icon: svgEl('heart', 14) };
    if (/sort=date/.test(q)) return { label: t('homeNew'), icon: svgEl('clock', 14) };
    if (/^\/subscriptions/.test(it.href)) return { label: t('homeSub'), icon: svgEl('bookmark', 12) };
    if (/^\/(videos|images)$/.test(it.href.split('?')[0]) && !q) return { label: t('homeNew'), icon: svgEl('clock', 14) };
    return { label: it.label, icon: icon('arrowRight', 13) };
  }

  // ── 跳转：转点站点原按钮；没有原按钮就改地址 + popstate（站点路由无刷新切过去）；带修饰键时交给浏览器（新开页签）──
  function go(e, it) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (it.orig && it.orig.isConnected) it.orig.click(); else { listNavigate(it.href); site.schedule(); }
  }

  /** 一组图标按钮（每个去处一个）。 */
  function buttons(items) {
    return h('div.iwe-home-btns', items.map((it) => {
      const d = describe(it);
      const a = h('a.iwe-home-btn', { href: it.href, title: d.label, 'aria-label': d.label }, d.icon, h('span.t', d.label));
      a.addEventListener('click', (e) => go(e, it));
      return a;
    }));
  }

  /** 标题变超链接：文字包进 <a>，点击转点 it.orig；悬停时尾部箭头滑出。 */
  function linkHeading(heading, it) {
    if (heading.querySelector(':scope > .iwe-home-hl')) return;
    const a = h('a.iwe-home-hl', { href: it.href });
    while (heading.firstChild && heading.firstChild.nodeType === 3) a.append(heading.firstChild);
    if (!a.textContent.trim()) return;
    a.append(icon('arrowRight', 18));
    a.addEventListener('click', (e) => go(e, it));
    heading.insertBefore(a, heading.firstChild);
  }

  iweHomeKit = { buttons, linkHeading, sectionPager };

  function setHeadAction(heading, el, sig) {
    heading.querySelectorAll(':scope > .iwe-home-slot').forEach((e) => e.remove());
    heading.__iweHome = sig;
    if (el) heading.append(h('div.iwe-home-slot', el));
  }
  /** 分区最后一行（卡片下面，靠右）。 */
  function setFoot(block, el) {
    let foot = block.nextElementSibling;
    if (!foot || !foot.hasAttribute('data-iwe-foot')) {
      foot = h('div.iwe-home-foot', { 'data-iwe-foot': '' });
      block.parentElement.insertBefore(foot, block.nextSibling);
    }
    foot.replaceChildren(...(el ? [el] : []));
    foot.classList.toggle('empty', !el);
  }

  // ── 分区分页：每个分区下面一条传统分页条（首页的热门视频 / 热门图片 / 订阅，作者页「关于」的最新视频 / 最新图片共用这一份）──
  // 第 1 页就是站点自己渲染的那批卡片；翻到别的页时，把它们藏起来，换成按接口结果克隆的卡片（克隆件来自 92-pager.js）。
  // 总页数不可信（带 user= 时 count 是「已加载 + 1」的哨兵），所以只按「这页取满了没有」判断有没有下一页。
  /**
   * o = { block: 分区容器（翻页时整块变淡）, listOf(): 卡片所在的那一行, mount(bar): 把分页条放到位,
   *       request(): 第一页的接口地址（URL；沿用站点自己那次请求的参数，翻页只改 page）}
   * 返回 { bar, reset() }：reset 把克隆件撤掉、原卡片还原、回到第 1 页（站点换了内容时用）。
   */
  function sectionPager(o) {
    const st = { page: 1, hasNext: true, busy: false };
    st.bar = h('nav.iwe-pager', { 'aria-label': t('homePager') });
    const clear = (list, n) => {
      list.querySelectorAll(':scope > [data-iwe-pager-card]').forEach((e) => e.remove());
      [...list.children].forEach((c) => (n > 1 ? c.setAttribute('data-iwe-home-orig', '') : c.removeAttribute('data-iwe-home-orig')));
    };
    async function go(n) {
      if (st.busy) return;
      const list = o.listOf();
      if (!list) return;
      st.busy = true; o.block.classList.add('iwe-home-busy');
      try {
        let rows = null, hasNext = null;
        if (n > 1) {
          const u = o.request();
          const limit = parseInt(u.searchParams.get('limit') || '12', 10) || 12;
          u.searchParams.set('page', String(n - 1));
          const json = await api.call(u.pathname + u.search, { auth: 'auto' });
          rows = iwePagerKit.items(json) || [];
          hasNext = rows.length >= limit;
        }
        clear(list, n);
        if (n > 1) for (const it of rows) { const c = iwePagerKit.buildCard(list, it); if (c) list.append(c); }
        st.page = n; st.hasNext = n > 1 ? hasNext : null;
        draw();
        if (o.onPage) o.onPage(n);
      } catch (e) {
        console.error('[iwe] section pager', e);
      } finally { st.busy = false; o.block.classList.remove('iwe-home-busy'); }
    }
    function draw() {
      iwePagerKit.fillBar(st.bar, { cur: st.page, total: null, hasNext: st.page === 1 ? true : st.hasNext, go, canWaterfall: false });
    }
    o.mount(st.bar);
    draw();
    return {
      bar: st.bar,
      reset() { const list = o.listOf(); if (list) clear(list, 1); st.page = 1; st.hasNext = true; draw(); },
    };
  }

  const seen = {}; // 首页：站点自己发过的请求，按种类记下来，翻页沿用它的筛选参数（rating 等）
  siteData.onApi((url) => {
    if (location.pathname !== '/') return;
    let u; try { u = new URL(url, location.href); } catch { return; }
    if (u.pathname !== '/videos' && u.pathname !== '/images') return;
    const kind = u.pathname.slice(1);
    if (u.searchParams.get('subscribed') === 'true') seen[kind + ':sub'] = u;
    else if (u.searchParams.get('sort') === 'trending') seen[kind + ':trending'] = u;
  });
  const listOfBlock = (block) => { const t0 = block.querySelector('.videoTeaser,.imageTeaser'); return t0 && t0.parentElement && t0.parentElement.parentElement; };

  function ensurePager(block, isSub) {
    if (typeof iwePagerKit === 'undefined' || !iwePagerKit) return;
    const list = listOfBlock(block);
    if (!list) return;
    const kind = list.querySelector('.imageTeaser') ? 'images' : 'videos';
    let foot = block.nextElementSibling;
    if (!foot || !foot.hasAttribute('data-iwe-foot')) { foot = h('div.iwe-home-foot', { 'data-iwe-foot': '' }); block.parentElement.insertBefore(foot, block.nextSibling); }
    if (foot.querySelector(':scope > .iwe-pager')) return;
    const key = kind + (isSub ? ':sub' : ':trending');
    sectionPager({
      block,
      listOf: () => listOfBlock(block),
      mount: (bar) => { foot.classList.remove('empty'); foot.classList.add('pg'); foot.replaceChildren(bar); },
      request: () => {
        const u = new URL('/' + kind, location.origin);
        const base = seen[key];
        if (base) for (const [k, v] of base.searchParams) u.searchParams.set(k, v);
        else { u.searchParams.set('rating', 'general'); u.searchParams.set('limit', '12'); if (isSub) u.searchParams.set('subscribed', 'true'); else u.searchParams.set('sort', 'trending'); }
        return u;
      },
    });
  }

  site.register('homeSections', {
    match: (path) => path === '/',
    css: `
/* 标题行：标题在左，按钮在右（窄屏也保持同一行，按钮不换行） */
.iwe-home-h{display:flex!important;align-items:center;justify-content:space-between;gap:12px;margin-top:20px!important;margin-bottom:12px!important}
.iwe-home-slot{flex:none;display:flex;align-items:center}
/* 标题超链接：用站点链接色 var(--primary)（浅色青绿、深色蓝，跟站点自己的链接一致），悬停下划线并滑出箭头 */
.iwe-home-h a.iwe-home-hl{display:inline-flex;align-items:center;gap:8px;color:var(--primary,#1abc9c)!important;text-decoration:none!important;min-width:0}
.iwe-home-h a.iwe-home-hl svg{flex:none;opacity:0;transform:translateX(-6px);transition:opacity .15s,transform .2s}
.iwe-home-h a.iwe-home-hl:hover{text-decoration:underline!important;text-underline-offset:4px;text-decoration-thickness:2px}
.iwe-home-h a.iwe-home-hl:hover svg,.iwe-home-h a.iwe-home-hl:focus-visible svg{opacity:1;transform:none}
.iwe-home-h a.iwe-home-hl:focus-visible{outline:2px solid var(--primary,#1abc9c);outline-offset:3px;border-radius:4px}
@media (hover:none){.iwe-home-h a.iwe-home-hl svg{display:none}}
/* 图标按钮：站点 ghost 按钮样式（1px 主色边框 + 主色字，悬停实心 + 白字）；主色用站点变量 var(--primary)，浅色青绿、深色蓝（用户 2026-11-24 要求跟暗色） */
.iwe-home-btns{display:flex;align-items:center;gap:8px}
.iwe-home-btns .iwe-home-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:32px;padding:0 12px;border:1px solid var(--primary,#1abc9c);border-radius:5px;background:transparent;color:var(--primary,#1abc9c)!important;font-size:13px;font-weight:500;line-height:1;font-family:inherit;text-decoration:none!important;white-space:nowrap;cursor:pointer;transition:none!important;-webkit-tap-highlight-color:transparent}
.iwe-home-btns .iwe-home-btn:hover{background:var(--primary,#1abc9c);color:#fff!important}
.iwe-home-btns .iwe-home-btn:not(:hover),.iwe-home-btns .iwe-home-btn:not(:hover) *{transition:none!important;animation:none!important}
.iwe-home-btns .iwe-home-btn:focus-visible{outline:2px solid var(--primary,#1abc9c);outline-offset:2px}
.iwe-home-btn svg{flex:none}
/* 分区最后一行：按钮靠右，往上贴近卡片（卡片行自带 24px 下边距） */
.iwe-home-foot{display:flex;justify-content:flex-end;margin:-8px 0 12px}
.iwe-home-foot.empty{display:none}
.iwe-home-foot.pg{display:block;margin:4px 0 12px}
.iwe-home-foot.pg .iwe-pager{margin:8px 0}
[data-iwe-home-orig]{display:none!important}
.iwe-home-busy{opacity:.55;transition:opacity .15s;pointer-events:none}
/* 去掉分区外层的灰色大容器：透明、无内边距、无阴影，卡片直接落在页面上 */
.iwe-home-flat{background:transparent!important;box-shadow:none!important;border:0!important;border-radius:0!important;padding:0!important;margin-bottom:0!important}
.iwe-home-flat>.block__content{padding:0}
.iwe-home-hide{display:none!important}
@media (pointer:coarse){.iwe-home-btns .iwe-home-btn{height:36px}}
/* 手机：标题行里的按钮只留图标（方形，好点），文字靠 aria-label / title；分区底部那一行仍带文字 */
@media (max-width:600px){
  .page-home .container-fluid>.iwe-home-h{font-size:22px;margin-top:16px!important;margin-bottom:10px!important}
  .iwe-home-slot .iwe-home-btn{width:36px;padding:0}
  .iwe-home-slot .iwe-home-btn .t{display:none}
}
@media (prefers-reduced-motion:reduce){.iwe-home-btn,.iwe-home-h a.iwe-home-hl svg{transition:none!important}}
`,
    scan() {
      const root = document.querySelector(ROOT);
      if (!root) return;

      // 站点自己的分区（订阅 / 热门视频 / 热门图片 …）：大标题后面紧跟一个 .block。
      // 标题不一定是根容器的直接子节点（订阅是单独的组件，外面多包了一层），所以在整个根容器里找；容器卡片里的标题不算
      root.querySelectorAll('.text--h2').forEach((heading) => {
        if (heading.closest('.block') || heading.hasAttribute('data-iwe-news-h')) return;
        const sib = heading.nextElementSibling;
        const block = sib && (sib.classList.contains('block') ? sib : sib.querySelector(':scope > .block'));
        if (!block) return;
        heading.classList.add('iwe-home-h');
        block.classList.add('iwe-home-flat');

        // 容器里的「更多」按钮：不属于视频 / 图片卡片的 a.button / button.button（有的是 <button>，没有 href）
        const btns = [...block.querySelectorAll('a.button,button.button')].filter((a) => !a.closest('.videoTeaser,.imageTeaser') && (a.tagName === 'BUTTON' || a.getAttribute('href')));
        ensurePager(block, !!(btns[0] && /^\/subscriptions/.test(btns[0].getAttribute('href') || '')) );
        const sig = btns.map((a) => (a.getAttribute('href') || '#') + '|' + a.textContent.trim()).join('\n');
        const foot = block.nextElementSibling;
        const footOk = foot && foot.hasAttribute('data-iwe-foot');
        if (heading.__iweHome === sig) return;
        btns.forEach((a) => {
          const row = a.closest('.row');
          // 整行只有按钮（没有卡片）就藏整行，否则只藏按钮所在的列
          (row && !row.querySelector('.videoTeaser,.imageTeaser') ? row : a.closest('[class*="col"]') || a).classList.add('iwe-home-hide');
        });
        const items = btns.map((a) => ({ label: a.textContent.trim(), href: a.getAttribute('href') || '#', orig: a }));
        // 标题指向「热门」那个去处（热门视频 / 热门图片）；只有一个去处（订阅）就指向它
        const main = items.find((it) => /sort=trending/.test(it.href)) || items[0];
        if (main) linkHeading(heading, main);
        setHeadAction(heading, items.length ? buttons(items) : null, sig);
      });

      // 公告标题（99-homenews.js 插的）：整个标题是「全部公告」的超链接，转点页脚里站点自己的公告链接；不放按钮
      const nh = root.querySelector('[data-iwe-news-h]');
      if (nh && nh.__iweHome !== 'news') {
        nh.classList.add('iwe-home-h');
        nh.__iweHome = 'news';
        linkHeading(nh, { label: nh.textContent.trim(), href: '/forum/announcements', orig: document.querySelector('a[href="/forum/announcements"]') });
      }
    },
  });
})();
