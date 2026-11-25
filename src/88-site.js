// 站点增强：在原版页面上就地做的改造（不接管页面）。每个功能是一个 site.register(...)。
//
// 约定：
// - scan(ctx) 会被反复调用（页面 DOM 变化、路由变化时，按帧合并），必须幂等：
//   处理过的节点打上 data-iwe-<功能名> 标记，下次跳过。
// - css 注入到 document.head（这些改造在站点自己的 DOM 里，不在工作台的 Shadow DOM 里）。
// - 工作台接管的页面（发布 / 编辑 / 内容管理）里，站点内容区是藏起来的；功能照常跑不影响。
// - 每个功能都能在设置里单独关掉（store 'siteOff' 里记关掉的名字）。

/** 追加文案（中文、英文、日文三份，键要一致；日文缺的键退回英文）。键名请带功能前缀，避免和别的功能撞名。 */
function defineStrings(zh, en, ja) { Object.assign(STR.zh, zh); Object.assign(STR.en, en); Object.assign(STR.ja, ja || {}); }

/**
 * 右栏整列钉在顶栏下面（订阅页、视频 / 图库列表页、作者页的右栏在用）。
 *
 * - 栏始终钉在顶栏下（top = TOP）；栏比视口高时，栏的最大高度 = 它在视口里实际能占的高度，栏内可以滚。
 * - 不切断滚动链（不写 overscroll-behavior:contain）：栏内滚到底 / 滚到顶后继续滚，带动的就是整个页面，
 *   不再是「怎么滑都和外面页面没关系」的独立小容器（用户 2026-11-24 两次反馈后定的：顶部钉住 + 滚到头带动页面）。
 * - 最大高度按栏当前的实际顶边算（页面在顶部时栏顶还在标题下面），栏底始终在视口里。
 *
 * 哪些情况算「要钉」由样式决定：要钉的媒体查询里同时写 position:sticky 和 --iwe-sticky:1，窄屏不写，这里就把内联样式清掉。
 * 同一个元素重复登记无副作用；元素离开文档后自动不再管。
 */
const stickySidebar = (() => {
  const TOP = 80, GAP = 16;
  const els = new Set();
  let queued = false;
  const wants = (el) => getComputedStyle(el).getPropertyValue('--iwe-sticky').trim() === '1';
  function update() {
    queued = false;
    for (const el of els) {
      if (!el.isConnected) { els.delete(el); continue; }
      if (!wants(el)) { el.style.removeProperty('max-height'); el.style.removeProperty('overflow-y'); continue; }
      const top = Math.max(TOP, el.getBoundingClientRect().top);
      el.style.maxHeight = Math.max(160, Math.floor(innerHeight - top - GAP)) + 'px';
      el.style.overflowY = 'auto';
    }
  }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  return (el) => { if (!els.has(el)) els.add(el); schedule(); };
})();

/**
 * 列表页改筛选参数后跳过去：改地址再发 popstate，站点路由按新参数重拉列表，不刷新页面。
 * 订阅页上站点自己拼的参数靠不住（会沿用旧参数），那里由 99-subfilter.js 在请求发出前按地址栏改写，所以这里一视同仁。
 */
function listNavigate(url) {
  const next = new URL(url, location.href);
  history.pushState(null, '', next.href);
  dispatchEvent(new PopStateEvent('popstate'));
}

/**
 * 横向滚动条（手机上的类型标签、筛选胶囊、作者页入口胶囊…）两端的渐隐：哪一侧还有藏着的内容就把那一侧淡出，
 * 让人看得出「还能往这边滑」；滑到头那一侧就不淡。样式见 iwe-site-tokens 里的 [data-iwe-fade]。
 * 同一个元素重复登记无副作用。
 */
const scrollFade = (() => {
  const seen = new WeakSet();
  const paint = (el) => {
    const max = el.scrollWidth - el.clientWidth;
    const v = max <= 1 ? '' : [el.scrollLeft > 1 && 'l', el.scrollLeft < max - 1 && 'r'].filter(Boolean).join(' ');
    if (v) el.setAttribute('data-iwe-fade', v); else el.removeAttribute('data-iwe-fade');
  };
  return (el) => {
    if (!el) return;
    if (!seen.has(el)) {
      seen.add(el);
      el.addEventListener('scroll', () => paint(el), { passive: true });
      new ResizeObserver(() => paint(el)).observe(el);
      new MutationObserver(() => paint(el)).observe(el, { childList: true, subtree: true });
    }
    paint(el);
  };
})();

/**
 * 列表的「顶部」：翻页、作者页切栏目后滚到这里，而不是整页顶端。
 * 作者页 = 头部（横幅 + 头像栏）下沿贴住顶栏的位置，列表正好从右栏钉住的高度开始（用户 2026-11-24 要求）；其余页面 = 0。
 */
function listTopY() {
  const hdr = document.querySelector('.page-profile__header');
  if (!hdr) return 0;
  const nav = document.querySelector('header.header');
  const navH = nav && getComputedStyle(nav).position === 'fixed' ? nav.offsetHeight : 0;
  return Math.max(0, Math.round(hdr.getBoundingClientRect().bottom + scrollY - navH));
}

/**
 * 换页 / 换栏目后滚到列表顶部：已经在它上面（还看得到头部）就留在原处，在它下面就回到它。
 * 站点路由随后会把页面滚回 0、新内容出来前高度会塌，所以接下来 1.8 秒内被拉上去就再压回来；
 * 用户自己滚动 / 触摸 / 按键立刻放手，不和用户抢。
 */
const scrollListTop = (() => {
  let hold = null, raf = 0;
  const stop = () => { hold = null; cancelAnimationFrame(raf); };
  const tick = () => {
    if (!hold) return;
    if (Date.now() > hold.until) { hold = null; return; }
    if (Math.abs(scrollY - hold.y) > 4 && document.documentElement.scrollHeight - innerHeight >= hold.y - 4) scrollTo({ top: hold.y, behavior: 'instant' });
    raf = requestAnimationFrame(tick);
  };
  for (const ev of ['wheel', 'touchstart', 'keydown']) addEventListener(ev, stop, { passive: true, capture: true });
  return () => {
    cancelAnimationFrame(raf);
    const y = Math.min(scrollY, listTopY());
    hold = { y, until: Date.now() + 1800 };
    scrollTo({ top: y, behavior: 'instant' });
    raf = requestAnimationFrame(tick);
  };
})();

/**
 * 站点自己请求回来的数据：页面加载列表、评论、帖子时，接口响应里本来就带着用户资料和原文。
 * 在这里旁听（包一层 fetch / XHR，只读响应副本），各功能直接查，省得再打一遍接口。
 * 少数功能会在 GET 请求发出前改参数（siteData.rewrite，例如首页热门改道、订阅页筛选），写请求一律不碰。
 * 脚本启动前已经发出的请求听不到，查不到时各功能自己再调接口兜底。
 *
 * siteData.user(idOrUsername) → 站点返回的 user 对象（含 premium、role 等）或 null
 * siteData.onApi(fn)          → fn(url, json) 每个 api.iwara.tv 的 JSON 响应都会回调；返回取消函数
 * siteData.onWrite(fn)        → fn(url, method, statusPromise) 每个 api.iwara.tv 的写请求（非 GET）发出时回调；状态 0 = 网络失败
 */
const siteData = (() => {
  const users = new Map();
  const listeners = new Set();
  // 站点自己的请求写的是不带协议的 `//api.iwara.tv/...`：两种都认，回调里统一给绝对地址
  const isApi = (u) => /^(https:)?\/\/api\.iwara\.tv\//.test(String(u || ''));
  const abs = (u) => (String(u).startsWith('//') ? 'https:' + u : String(u));
  /** 请求头里 Authorization: Bearer 后面的值（fetch 的 init.headers 或 Request 自带的 headers）；取不到返回 null */
  const bearerOf = (input, init) => { try { const m = /^Bearer\s+(.+)$/i.exec(new Headers((init && init.headers) || (input && input.headers) || undefined).get('Authorization') || ''); return m ? m[1] : null; } catch { return null; } };
  function walk(o, depth) {
    if (!o || typeof o !== 'object' || depth > 6) return;
    if (Array.isArray(o)) { for (const x of o) walk(x, depth + 1); return; }
    if (typeof o.username === 'string' && typeof o.id === 'string' && 'name' in o) {
      const prev = users.get(o.id);
      const merged = prev ? { ...prev, ...o } : o;
      users.set(o.id, merged); users.set(o.username.toLowerCase(), merged);
    }
    for (const k in o) if (o[k] && typeof o[k] === 'object') walk(o[k], depth + 1);
  }
  function feed(url, json) {
    try { walk(json, 0); } catch { /* 忽略 */ }
    for (const fn of listeners) { try { fn(url, json); } catch (e) { console.error('[iwe] onApi', e); } }
  }
  // 写请求（POST / PUT / DELETE …）的起止：fn(url, method, statusPromise)；状态 0 = 网络失败。登录 / 注册按钮的转圈靠它知道何时结束
  const writeListeners = new Set();
  const writes = (url, method, statusP) => { for (const fn of writeListeners) { try { fn(url, method, statusP); } catch (e) { console.error('[iwe] onWrite', e); } } };
  // fetch
  // 首页「热门视频 / 热门图片」：站点用的 /trending/{video|image} 接口会混进好几年前的老帖，和「热门」列表页（?sort=trending）口径不一致。
  // 这里把这两个请求改道到 /videos|/images?sort=trending（返回结构相同，站点原样渲染）。
  const TREND = /^((?:https:)?\/\/api\.iwara\.tv)\/trending\/(video|image)(\?|$)/;
  const trend = (u) => (TREND.test(u) && store.get('homeTrending', true) !== false
    ? u.replace(TREND, (m, host, k, q) => `${host}/${k}s?sort=trending${q === '?' ? '&' : ''}`) : u);
  // 各功能登记的 GET 改写：fn(URL) 原地改参数，返回 true 表示改过（见 siteData.rewrite）
  const rewriters = [];
  const retarget = (u) => {
    if (typeof u !== 'string' || !isApi(u)) return u;
    const out = trend(u);
    if (!rewriters.length) return out;
    const url = new URL(abs(out));
    let changed = false;
    for (const fn of rewriters) { try { if (fn(url)) changed = true; } catch (e) { console.error('[iwe] rewrite', e); } }
    return changed ? url.href : out;
  };
  const origFetch = window.fetch;
  window.fetch = function (input, init) {
    const method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    if (method === 'GET') { // 只改读请求
      if (typeof input === 'string') arguments[0] = input = retarget(input);
      else if (input && typeof input.url === 'string' && retarget(input.url) !== input.url) arguments[0] = input = new Request(retarget(input.url), input);
    }
    const p = origFetch.apply(this, arguments);
    const url = typeof input === 'string' ? input : input && input.url;
    if (method !== 'GET' && isApi(url)) writes(abs(url), method, p.then((r) => r.status, () => 0));
    // 站点自己换令牌被拒（刷新令牌过期 / 失效）：站点会按未登录显示，但不删 localStorage.token。我们跟着记成失效（见 api.signedIn）
    if (method === 'POST' && isApi(url) && /\/user\/token(\?|$)/.test(url)) {
      // 记下被拒的是哪一个：以这次请求实际带的令牌为准（别的标签页可能已经换了 localStorage 里的令牌）
      const rt = bearerOf(input, init) || localStorage.getItem('token'); // token-ok
      p.then((r) => { if (r.status === 401 || r.status === 403) { api.markDead(rt); site.schedule(); } }, () => {});
    }
    if (isApi(url)) p.then((r) => { if (r.ok && /json/.test(r.headers.get('content-type') || '')) r.clone().json().then((j) => feed(abs(url), j), () => {}); }, () => {});
    return p;
  };
  // XHR
  const XO = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, url) {
    if (typeof url === 'string' && String(m).toUpperCase() === 'GET') { const u2 = retarget(url); if (u2 !== url) { arguments[1] = url = u2; } }
    if (String(m).toUpperCase() !== 'GET' && isApi(url)) {
      const u3 = abs(url), mm = String(m).toUpperCase();
      const XS = this.send;
      this.send = function () { writes(u3, mm, new Promise((res) => { this.addEventListener('loadend', () => res(this.status)); })); return XS.apply(this, arguments); };
    }
    if (isApi(url)) this.addEventListener('load', () => {
      if (this.status >= 200 && this.status < 300 && (this.responseType === '' || this.responseType === 'text' || this.responseType === 'json')) {
        try { feed(abs(url), this.responseType === 'json' ? this.response : JSON.parse(this.responseText)); } catch { /* 不是 JSON */ }
      }
    });
    return XO.apply(this, arguments);
  };
  return {
    user: (key) => (key ? users.get(String(key)) || users.get(String(key).toLowerCase()) || null : null),
    remember: (json) => { try { walk(json, 0); } catch { /* 忽略 */ } },
    onApi(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    /** 登记一个 GET 请求改写：fn(URL) 在请求发出前原地改它的参数，改了返回 true。只在站点本来就要发的请求上改，不额外发请求 */
    rewrite(fn) { rewriters.push(fn); },
    onWrite(fn) { writeListeners.add(fn); return () => writeListeners.delete(fn); },
  };
})();

const site = (() => {
  const features = [];
  let queued = false, lastPath = null, started = false;
  const pendingCss = [];
  // 脚本在 document-start 就运行（为了尽早旁听站点请求），那时还没有 <head>：样式攒到 start() 再插
  const addCss = (id, css) => { const el = h('style', { id }, css); started ? document.head.append(el) : pendingCss.push(el); };
  const isOff = (name) => (store.get('siteOff', []) || []).includes(name);
  const isDark = () => document.body.classList.contains('dark');

  function ctx() {
    return { path: location.pathname, search: new URLSearchParams(location.search), routeChanged: lastPath !== location.pathname + location.search, dark: isDark() };
  }
  function run() {
    queued = false;
    const c = ctx();
    lastPath = location.pathname + location.search;
    for (const f of features) {
      if (isOff(f.name) || (f.match && !f.match(c.path, c.search))) { if (f.active && f.leave) { try { f.leave(); } catch (e) { console.error('[iwe]', f.name, e); } } f.active = false; continue; }
      f.active = true;
      try { f.scan(c); } catch (e) { console.error('[iwe]', f.name, e); }
    }
  }
  // 启动前不扫描：页面可能还没有 body、样式还没插（start() 末尾会扫一次）
  const schedule = () => { if (!started || queued) return; queued = true; requestAnimationFrame(run); };

  return {
    /**
     * name：功能名（英文短词，用于标记与开关）
     * match(path, search)：可选，只在匹配的页面跑
     * css：可选，全局样式字符串
     * scan(ctx)：幂等的改造函数；ctx = { path, search, routeChanged, dark }
     * leave()：可选，离开匹配页面时的清理
     */
    register(name, def) {
      const f = { name, ...def, active: false };
      features.push(f);
      if (def.css) addCss('iwe-css-' + name, def.css);
    },
    isOff,
    setOff(name, off) {
      const list = new Set(store.get('siteOff', []) || []);
      off ? list.add(name) : list.delete(name);
      store.set('siteOff', [...list]);
      location.reload();
    },
    schedule,
    start() {
      started = true;
      document.head.append(...pendingCss.splice(0));
      // 站点页面上的改造共用一套配色变量（与工作台同名同值）：挂在所有 iwe- 开头的类上，子元素继承。
      // 不挂 :root，免得和站点自己的同名变量打架
      document.head.append(h('style', { id: 'iwe-site-tokens' }, `[class^="iwe-"],[class*=" iwe-"]{--bg:#fafafa;--card:#fff;--sunk:#f4f4f5;--fg:#171717;--fg2:#666;--fg3:#8f8f8f;--line:#eaeaea;--line2:#d9d9d9;--inv:#fff;--blue:#0070f3;--red:#e5484d;--amber:#d97706;--green:#16a34a;--violet:#7c3aed;--shadow:0 1px 2px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.08);--ease:cubic-bezier(.22,1,.36,1)}
body.dark [class^="iwe-"],body.dark [class*=" iwe-"]{--bg:#0a0a0a;--card:#111;--sunk:#1a1a1a;--fg:#ededed;--fg2:#a1a1a1;--fg3:#6f6f6f;--line:#242424;--line2:#333;--inv:#0a0a0a;--blue:#3b9eff;--red:#ff6369;--amber:#f5a524;--green:#3dd68c;--violet:#a78bfa;--shadow:0 1px 2px rgba(0,0,0,.4),0 12px 32px rgba(0,0,0,.5)}`));
      document.head.append(h('style', { id: 'iwe-scroll-fade' }, `[data-iwe-fade=r]{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 32px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 32px),transparent)}
[data-iwe-fade=l]{-webkit-mask-image:linear-gradient(90deg,transparent,#000 32px);mask-image:linear-gradient(90deg,transparent,#000 32px)}
[data-iwe-fade="l r"]{-webkit-mask-image:linear-gradient(90deg,transparent,#000 32px,#000 calc(100% - 32px),transparent);mask-image:linear-gradient(90deg,transparent,#000 32px,#000 calc(100% - 32px),transparent)}`));
      // 站点没登录也要能用：界面语言先按站点自己的设置定
      if (!env.user) detectLang(localStorage.getItem('locale') || navigator.language);
      // 本地有刷新令牌不等于已登录（过期的站点不删）。站点自己换令牌常在脚本注入前就发出去了（实测第 136ms），上面的钩子听不到结果：
      // 这里自己换一次——成功就留着用（之后带登录的请求不用再换），被拒就记成失效并重扫（侧栏「订阅」等登录才有的东西撤掉）
      if (api.signedIn()) api.token().catch(() => { if (!api.signedIn()) schedule(); });
      tagDict.load().then(schedule);
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
      addEventListener('popstate', schedule);
      schedule();
    },
  };
})();

/**
 * 列表请求与地址栏同步（订阅页、视频 / 图库列表页在用）。
 *
 * 站点按地址栏参数拉列表的逻辑在好几个页面上靠不住（实测）：
 * - 整页打开时地址里的参数会被带进请求，之后改地址再 popstate，只有「站点自己算出的请求」变了才重拉——
 *   只改 rating、删掉某个参数时它算出来的请求不变，于是不发请求，列表停在旧条件上；
 * - 订阅页还会沿用打开时的旧参数、切 tab 时拿上一个地址的参数发请求、空的 tags= 原样发出导致 500。
 *
 * 做法：
 * 1. 改写：列表请求发出前，由登记的 rewrite(URL, 地址栏参数) 按当前地址栏重写筛选参数（地址栏是唯一事实源）；
 * 2. 看门狗：地址变化后 450ms 内没见到这个地址的列表请求，就往地址里临时塞 _r=<序号> 再 popstate 一次——
 *    站点会把地址里任意参数带进请求，算出的请求变了就会重拉；改写时去掉 _r，请求一发出即把地址栏还原。
 *    推的那次地址键不变，不会循环；每次地址变化最多推一次。浏览器前进 / 后退同样适用。
 *
 * listSync.register({ feature, api(pathname) → 接口路径 | null, accept?(URL) → 是否主列表请求, rewrite(URL, URLSearchParams) })
 * listSync.watch()：站点自己的路由跳转不发 popstate，功能在 scan 里调一下补看
 */
const listSync = (() => {
  const NUDGE = '_r';
  const routes = [];
  let lastReqKey = null, lastKey = null, timer = 0;
  const locKey = () => { const sp = new URLSearchParams(location.search); sp.delete(NUDGE); return location.pathname + '?' + sp.toString(); };
  const active = () => routes.find((r) => !site.isOff(r.feature) && r.api(location.pathname));
  function stripNudge() {
    const url = new URL(location.href);
    if (!url.searchParams.has(NUDGE)) return;
    url.searchParams.delete(NUDGE);
    history.replaceState(history.state, '', url.href);
  }
  siteData.rewrite((u) => {
    const r = active();
    if (!r || u.pathname !== r.api(location.pathname) || (r.accept && !r.accept(u))) return false;
    lastReqKey = locKey();
    const before = u.search;
    const sp = new URLSearchParams(location.search);
    u.searchParams.delete(NUDGE);
    if (sp.has(NUDGE)) { sp.delete(NUDGE); queueMicrotask(stripNudge); } // 站点已按带 _r 的地址算完请求，地址栏可以还原
    r.rewrite(u, sp);
    return u.search !== before;
  });
  function watch() {
    if (!active()) return;
    const key = locKey();
    if (key === lastKey) return;
    lastKey = key;
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (lastReqKey === key || lastKey !== key || !active()) return;
      const url = new URL(location.href);
      url.searchParams.set(NUDGE, String(Date.now() % 1e6));
      history.replaceState(history.state, '', url.href);
      dispatchEvent(new PopStateEvent('popstate'));
      setTimeout(stripNudge, 1500); // 兜底：这次也没发请求的话，地址栏也别一直挂着 _r
    }, 450);
  }
  addEventListener('popstate', () => setTimeout(watch, 0));
  return { register(r) { routes.push(r); }, watch };
})();
