// 分页栏：把站点的分页栏换成「首页 / 上一页 / 页码 / 下一页 / 末页 / 跳页 / 第 X/Y 页」，
// 并提供「传统分页 / 瀑布流」两种模式（记在 store 'pagerMode'，切换不刷新页面）。
//
// 总页数从哪来：站点自己请求列表时，我们旁听响应（siteData.onApi）。响应里的 count 分两类：
// - 真实总数：/search（视频 15449 条、最后一页 482 正好 25 条，对得上）、/forum/<板块>（general 1325 条，
//   最后一页 41 有 13 条，对得上）。这类显示「第 X/Y 页」和末页按钮。
// - 哨兵：/videos、/images（含 tags=、user= 作者作品）。count 恒等于「page×limit + 本页条数 + 1」
//   （第 0 页 33、第 3 页 129），只说明后面还有没有，不是总数。这类只显示当前页、隐藏末页。
// 两类统一用「count > page×limit + 本页条数」判断还有没有下一页：哨兵正好多出 1，真实总数自然成立。
//
// 站点 URL 里的 page 从 0 开始（?page=2 是第 3 页）；界面上的页码一律从 1 开始。

// 给侧栏「最近」页复用的分页条（在本文件末尾赋值）；别的文件只通过它用分页条，不要再写第二份
let iwePagerKit = null;

(() => {

defineStrings(
  {
    pager_traditional: '传统分页',
    pager_waterfall: '瀑布流',
    pager_mode: '翻页方式',
    pager_prev: '上一页',
    pager_next: '下一页',
    pager_jump: '跳至页码',
    pager_go: '跳转',
    pager_pageN: '第 {n} 页',
    pager_loading: '加载中…',
    pager_noMore: '没有更多了',
    pager_failed: '加载失败，点击重试',
    pager_loaded: '已加载到第 {cur} 页',
    pager_loadedOf: '已加载到第 {cur}/{total} 页',
  },
  {
    pager_traditional: 'Pages',
    pager_waterfall: 'Infinite',
    pager_mode: 'Paging',
    pager_prev: 'Previous page',
    pager_next: 'Next page',
    pager_jump: 'Go to page',
    pager_go: 'Go',
    pager_pageN: 'Page {n}',
    pager_loading: 'Loading…',
    pager_noMore: 'No more items',
    pager_failed: 'Failed to load. Click to retry',
    pager_loaded: 'Loaded up to page {cur}',
    pager_loadedOf: 'Loaded up to page {cur} of {total}',
  },
  {
    pager_traditional: 'ページ分割',
    pager_waterfall: '無限スクロール',
    pager_mode: 'ページ送り',
    pager_prev: '前のページ',
    pager_next: '次のページ',
    pager_jump: 'ページへ移動',
    pager_go: '移動',
    pager_pageN: '{n} ページ目',
    pager_loading: '読み込み中…',
    pager_noMore: 'これ以上ありません',
    pager_failed: '読み込みに失敗しました。クリックで再試行',
    pager_loaded: '{cur} ページ目まで読み込み済み',
    pager_loadedOf: '{cur} / {total} ページ目まで読み込み済み',
  },
);

const SVG_NS = 'http://www.w3.org/2000/svg';
// 页码栏用的小图标（框架图标里没有合适的）：内联画
function svgIcon(d, size = 16) {
  const s = document.createElementNS(SVG_NS, 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', String(size)); s.setAttribute('height', String(size));
  s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '2');
  s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round');
  const p = document.createElementNS(SVG_NS, 'path'); p.setAttribute('d', d); s.append(p);
  return s;
}
const D_LEFT = 'M15 6l-6 6 6 6', D_RIGHT = 'M9 6l6 6-6 6';
const D_PAGES = 'M4 7h16M4 12h16M4 17h16', D_FLOW = 'M12 4v13m0 0l-5-5m5 5l5-5M5 21h14';

const mode = () => (store.get('pagerMode', 'pages') === 'waterfall' ? 'waterfall' : 'pages');
const urlPage = () => Math.max(0, parseInt(new URLSearchParams(location.search).get('page') || '0', 10) || 0);
const locKey = () => location.pathname + location.search;
const items = (json) => (json && (Array.isArray(json.results) ? json.results : Array.isArray(json.threads) ? json.threads : null));

// ── 旁听列表响应 ─────────────────────────────────────────────────────
// 最近听到的列表响应（新的在前）。只留少量，按「是否对得上当前页面」挑
let heard = [];
function hear(url, json) {
  if (!json || typeof json.count !== 'number' || typeof json.limit !== 'number' || !items(json)) return;
  let u; try { u = new URL(url, location.href); } catch { return; }
  heard = [{ u, json, own: ownFetch.has(u.href) }, ...heard.filter((x) => x.u.href !== u.href)].slice(0, 30);
  site.schedule();
}
siteData.onApi(hear);
// 瀑布流自己发的请求也会被旁听到；记下来，免得被当成「页面当前列表」
const ownFetch = new Set();

/** 这条列表接口是不是当前页面的主列表（侧栏的「最新帖子」之类不算）。 */
function matchesPage(u) {
  const path = location.pathname, sp = new URLSearchParams(location.search), ap = u.searchParams;
  let m;
  if (path === '/videos' || path === '/images') { if (u.pathname !== path || ap.has('user')) return false; }
  else if (path === '/search') { if (u.pathname !== '/search' || (ap.get('type') || 'videos') !== (sp.get('type') || 'videos') || (ap.get('query') || '') !== (sp.get('query') || '')) return false; }
  else if ((m = path.match(/^\/subscriptions\/(videos|images|posts)$/))) { // 订阅页：接口是 /videos?subscribed=true（页面地址里没有这个参数），每页条数也是站点自己带的
    if (u.pathname !== '/' + m[1] || ap.get('subscribed') !== 'true') return false;
    for (const [k, v] of sp) if (k !== 'page' && ap.has(k) && ap.get(k) !== v) return false;
    return true;
  }
  else if ((m = path.match(/^\/forum\/([^/]+)$/))) { if (u.pathname !== '/forum/' + m[1]) return false; }
  else if ((m = path.match(/^\/dashboard\/(donations|transactions)$/))) { if (u.pathname !== '/user/' + m[1]) return false; }
  else if ((m = path.match(/^\/profile\/([^/]+)\/(videos|images|posts)$/))) {
    if (u.pathname !== '/' + m[2] || !ap.has('user')) return false;
    const who = siteData.user(decodeURIComponent(m[1]));
    if (who && who.id !== ap.get('user')) return false;
  } else if (u.pathname !== path) return false;
  // 页面上有、接口上也有的参数（sort、tags、date…）必须一致：用户刚换了排序时别拿旧排序的数据
  for (const [k, v] of sp) if (k !== 'page' && ap.has(k) && ap.get(k) !== v) return false;
  // 页面没带 limit 而接口带了，多半是侧栏的小列表
  if (ap.has('limit') && !sp.has('limit')) return false;
  return true;
}
const SENTINEL_PATHS = ['/videos', '/images'];

/** 当前页面的分页信息：{ cur(1 起), total|null, hasNext|null, api(URL)|null } */
function info() {
  const page = urlPage();
  const cand = heard.filter((x) => !x.own && matchesPage(x.u));
  const exact = cand.find((x) => (parseInt(x.u.searchParams.get('page') || '0', 10) || 0) === page);
  const any = exact || cand[0];
  const res = { cur: page + 1, total: null, hasNext: null, api: any ? any.u : null };
  if (!any) return res;
  const { count, limit } = any.json;
  if (!SENTINEL_PATHS.includes(any.u.pathname) && limit > 0) res.total = Math.max(1, Math.ceil(count / limit));
  if (exact) res.hasNext = count > page * limit + items(exact.json).length;
  else if (res.total) res.hasNext = page + 1 < res.total;
  return res;
}

function goTo(n) {
  const sp = new URLSearchParams(location.search);
  sp.set('page', String(Math.max(0, n - 1)));
  history.pushState({}, '', location.pathname + '?' + sp.toString());
  dispatchEvent(new PopStateEvent('popstate'));
  scrollListTop(); // 作者页回到头部下面，其余页面回到顶端
}

// ── 分页条（传统分页 / 瀑布流状态行）──────────────────────────────────
// 这一块不依赖具体页面，侧栏「最近」页也用（见文件末尾的 iwePagerKit），不要在别处再写一份。
const SLOT = 36; // 一个页码按钮 32 + 间隙 4
const GAP = null;

/**
 * 页码列表：数字或 GAP（省略号）。slots 是放得下的格子数（含首页、末页、省略号）。
 * 总页数已知：首页 + 末页 + 当前页前后各 sib 个，省略处补 GAP，总格数恒定，翻页时按钮不乱跳。
 * 总页数未知（只知道还有没有下一页）：首页 + 当前页前后 + 一个「后面还有」的省略号。
 */
function pageItems(cur, total, hasNext, slots) {
  if (slots < 5) return [cur]; // 窄到放不下首/末页：只留当前页，靠上一页/下一页翻
  const sib = Math.floor((slots - 5) / 2);
  if (!total) {
    const lo = Math.max(1, cur - sib), hi = cur + (hasNext ? 1 : 0);
    const out = [];
    if (lo > 1) { out.push(1); if (lo > 2) out.push(lo === 3 ? 2 : GAP); }
    for (let i = lo; i <= hi; i++) out.push(i);
    if (hasNext) out.push(GAP);
    return out;
  }
  if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(Math.min(cur - sib, total - 2 * sib - 2), 3);
  const end = Math.min(Math.max(cur + sib, 2 * sib + 3), total - 2);
  const out = [1];
  out.push(start > 3 ? GAP : 2);
  for (let i = start; i <= end; i++) out.push(i);
  out.push(end < total - 2 ? GAP : total - 1);
  out.push(total);
  return out;
}

// 当前页高亮色：取站点自己的强调色（侧栏当前项 / 主按钮），随站点明暗走；取不到用框架的蓝
function siteAccent() {
  const el = document.querySelector('.menu a.active, .button--primary');
  const c = el && getComputedStyle(el).backgroundColor;
  return c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent' ? c : null;
}

function modeSwitch() {
  const m = mode();
  const opt = (v, d, label) => h('button' + (m === v ? '.on' : ''), { type: 'button', title: label, 'aria-pressed': String(m === v), onclick: () => kit.setMode(v) }, svgIcon(d, 14), h('span', label));
  return h('div.iwe-pager-seg', { role: 'group' }, opt('pages', D_PAGES, t('pager_traditional')), opt('waterfall', D_FLOW, t('pager_waterfall')));
}

/** 按条的实际宽度定版式：宽度够用才带文字、跳页；页码格子数跟着剩余宽度走，永远一行放得下。 */
function layoutOf(bar, withSeg) {
  const W = bar.clientWidth || (bar.parentElement && bar.parentElement.clientWidth) || 800;
  const roomy = W >= 640, jump = W >= 440;
  const fixed = (withSeg ? (roomy ? 170 : 66) : 0) + (jump ? 120 : 0) + 12 * ((withSeg ? 1 : 0) + (jump ? 1 : 0)) + 2 * SLOT;
  return { roomy, jump, slots: Math.max(1, Math.min(9, Math.floor((W - fixed) / SLOT))) };
}

/**
 * 画传统分页条。o = { cur(1 起), total|null, hasNext|null, go(n), canWaterfall }
 * 条的宽度变了（窗口缩放、侧栏展开）会自己按新宽度重画。
 */
function fillBar(bar, o) {
  const { cur, total, hasNext, go, canWaterfall } = o;
  bar.__iweFill = o;
  const lay = layoutOf(bar, canWaterfall);
  bar.__iweKey = lay.roomy + '|' + lay.jump + '|' + lay.slots;
  bar.classList.remove('wf'); bar.classList.toggle('compact', !lay.roomy);
  const acc = siteAccent();
  if (acc) bar.style.setProperty('--iwe-accent', acc);
  const noNext = hasNext === false || (total != null && cur >= total);
  const nums = pageItems(cur, total, hasNext, lay.slots).map((n) => (n == null ? h('span.iwe-pager-gap', '…')
    : h('button.iwe-pager-btn' + (n === cur ? '.on' : ''), { type: 'button', title: t('pager_pageN', { n }), 'aria-current': n === cur ? 'page' : null, disabled: n === cur, onclick: () => go(n) }, String(n))));
  const arrow = (label, d, target, disabled) => h('button.iwe-pager-btn.nav', { type: 'button', title: label, 'aria-label': label, disabled, onclick: () => go(target) }, svgIcon(d));
  let jump = null;
  if (lay.jump) {
    const input = h('input', { type: 'number', min: 1, max: total || null, placeholder: String(cur), 'aria-label': t('pager_jump'), title: t('pager_jump'),
      onkeydown: (e) => { if (e.key === 'Enter') submit(); } });
    const submit = () => {
      const n = parseInt(input.value, 10);
      if (n >= 1) go(total ? Math.min(n, total) : n);
    };
    jump = h('div.iwe-pager-jump', input, h('button.iwe-pager-btn.nav', { type: 'button', title: t('pager_go'), 'aria-label': t('pager_go'), onclick: submit }, svgIcon(D_RIGHT)));
  }
  bar.replaceChildren(...[
    canWaterfall ? modeSwitch() : null,
    h('div.iwe-pager-main', arrow(t('pager_prev'), D_LEFT, cur - 1, cur <= 1), ...nums, arrow(t('pager_next'), D_RIGHT, cur + 1, noNext)),
    jump,
  ].filter(Boolean));
  if (!bar.__iweRO && typeof ResizeObserver === 'function') {
    bar.__iweRO = new ResizeObserver(() => {
      if (!bar.isConnected || !bar.__iweFill || bar.classList.contains('wf')) return;
      const l = layoutOf(bar, bar.__iweFill.canWaterfall);
      if (l.roomy + '|' + l.jump + '|' + l.slots !== bar.__iweKey) fillBar(bar, bar.__iweFill);
    });
    bar.__iweRO.observe(bar);
  }
}

/** 瀑布流状态行：o = { loading, failed, done, text, retry }。 */
function fillMore(bar, o) {
  bar.__iweFill = null; bar.classList.add('wf');
  bar.replaceChildren(h('button.iwe-pager-more' + (o.failed ? '.fail' : ''), { type: 'button', disabled: !o.failed, onclick: o.retry },
    o.loading ? h('span.iwe-pager-spin') : null, o.text));
}

// ── 瀑布流 ───────────────────────────────────────────────────────────
// 追加的卡片是我们克隆出来的节点：站点重新渲染列表（换排序、翻页）时整体清掉、页码重置
const wf = { key: null, next: 0, loading: false, done: false, failed: false, total: null, cards: [], io: null };

function canWaterfall() {
  const p = location.pathname;
  if (p === '/videos' || p === '/images' || /^\/subscriptions\/(videos|images)$/.test(p)) return true;
  if (/^\/profile\/[^/]+\/(videos|images)\/?$/.test(p)) return true; // 作者页的视频 / 图片页
  if (p === '/search') return ['videos', 'images'].includes(new URLSearchParams(location.search).get('type') || 'videos');
  return false;
}

function resetWaterfall() {
  for (const c of wf.cards) c.remove();
  wf.cards = []; wf.key = null; wf.loading = false; wf.done = false; wf.failed = false; wf.total = null;
}

/** 主列表容器：分页栏往上找，前一个兄弟里放着卡片的那一层。 */
function listOf(pager) {
  let a = pager;
  for (let i = 0; i < 5 && a; i++, a = a.parentElement) {
    const prev = a.previousElementSibling;
    const teaser = prev && prev.querySelector('.videoTeaser, .imageTeaser');
    if (teaser) return teaser.parentElement.parentElement;
  }
  return null;
}

async function loadMore(bar) {
  if (wf.loading || wf.done) return;
  const inf = info();
  if (!inf.api) return;
  if (wf.key !== locKey()) { resetWaterfall(); wf.key = locKey(); wf.next = urlPage() + 1; }
  if (inf.hasNext === false && wf.next === urlPage() + 1) { wf.done = true; paint(bar); return; }
  wf.loading = true; wf.failed = false; paint(bar);
  const key = wf.key;
  const u = new URL(inf.api.href);
  u.searchParams.set('page', String(wf.next));
  ownFetch.add(u.href);
  try {
    const json = await api.call(u.pathname + u.search, { auth: !!localStorage.getItem('token') });
    if (wf.key !== key) return; // 等待期间列表已经换了
    const list = listOf(bar.__iweAnchor);
    const rows = items(json) || [];
    if (list) for (const it of rows) { const c = buildCard(list, it); if (c) { list.append(c); wf.cards.push(c); } }
    if (!SENTINEL_PATHS.includes(u.pathname) && json.limit > 0) wf.total = Math.ceil(json.count / json.limit);
    wf.done = !rows.length || !(json.count > wf.next * json.limit + rows.length);
    wf.next++;
  } catch (e) {
    console.error('[iwe] pager', e);
    if (wf.key === key) wf.failed = true;
  } finally {
    if (wf.key === key) wf.loading = false;
    paint(bar);
    // 一屏没填满时哨兵还在视口里，观察器不会再触发：主动再拉一页
    if (wf.key === key && !wf.done && !wf.failed) requestAnimationFrame(() => {
      const r = bar.getBoundingClientRect();
      if (r.top < innerHeight + 600 && bar.isConnected) loadMore(bar);
    });
  }
}

function paint(bar) {
  if (bar.__iweMode !== 'waterfall') return;
  const loaded = wf.key === locKey() ? wf.next : urlPage() + 1;
  const text = wf.failed ? t('pager_failed') : wf.loading ? t('pager_loading') : wf.done ? t('pager_noMore')
    : wf.total ? t('pager_loadedOf', { cur: loaded, total: wf.total }) : t('pager_loaded', { cur: loaded });
  fillMore(bar, { loading: wf.loading, failed: wf.failed, text, retry: () => loadMore(bar) });
}

function renderWaterfall(bar) {
  paint(bar);
  if (wf.io) wf.io.disconnect();
  wf.io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) loadMore(bar); }, { rootMargin: '600px 0px' });
  wf.io.observe(bar);
}

// ── 克隆卡片 ─────────────────────────────────────────────────────────
const fmtNum = (n) => {
  n = +n || 0;
  if (n < 1000) return String(n);
  if (n < 1e6) return (n / 1e3).toFixed(1) + 'K';
  return (n / 1e6).toFixed(1) + 'M';
};
const fmtDur = (s) => {
  s = Math.round(+s || 0);
  const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = String(s % 60).padStart(2, '0');
  return hh ? `${hh}:${String(mm).padStart(2, '0')}:${ss}` : `${mm}:${ss}`;
};
// 与站点卡片一致：30 天内显示「N 天前」之类的相对时间，更早的显示本地日期 YYYY-MM-DD
function fmtAgo(iso) {
  const t0 = new Date(iso);
  const d = (Date.now() - t0.getTime()) / 1000;
  if (!isFinite(d)) return '';
  if (d >= 30 * 86400) return `${t0.getFullYear()}-${String(t0.getMonth() + 1).padStart(2, '0')}-${String(t0.getDate()).padStart(2, '0')}`;
  let rtf;
  try { rtf = new Intl.RelativeTimeFormat(localStorage.getItem('locale') || navigator.language, { numeric: 'always' }); } catch { rtf = new Intl.RelativeTimeFormat('en'); }
  for (const [u, sec] of [['day', 86400], ['hour', 3600], ['minute', 60]]) if (d >= sec) return rtf.format(-Math.floor(d / sec), u);
  return rtf.format(-Math.max(1, Math.floor(d)), 'second');
}
// 站点只给 R-18 打角标，全年龄的不显示
const ratingText = (r) => (r === 'ecchi' ? 'R-18' : '');

/** 只替换元素里的文字节点（保留里面的图标）。 */
function setText(el, text, before) {
  if (!el) return;
  [...el.childNodes].filter((n) => n.nodeType === 3).forEach((n) => n.remove());
  before ? el.prepend(text + ' ') : el.append(' ' + text);
}

// 站点的缩略图一律是「原文件名换成 .jpg」
const jpgOf = (kind, f) => `//i.iwara.tv/image/${kind}/${f.id}/${String(f.name || f.id).replace(/\.[^.]+$/, '')}.jpg`;
function thumbOf(it, isImage) {
  if (isImage) return it.thumbnail && it.thumbnail.id ? jpgOf('thumbnail', it.thumbnail) : '';
  if (it.customThumbnail && it.customThumbnail.id) return jpgOf('thumbnail', it.customThumbnail);
  if (it.file && it.file.id) return `//i.iwara.tv/image/thumbnail/${it.file.id}/thumbnail-${String(it.thumbnail || 0).padStart(2, '0')}.jpg`;
  if (it.embedUrl) { const m = it.embedUrl.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/); if (m) return `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`; }
  return '';
}

/** 头像 / 用户名上的身份修饰类（--premium、--moderator…）：先去掉模板作者的，再按这一条的作者补上。 */
function badge(el, base, u) {
  for (const c of [...el.classList]) if (c.startsWith(base + '--')) el.classList.remove(c);
  if (u.premium) el.classList.add(base + '--premium');
  if (u.role && u.role !== 'user') el.classList.add(base + '--' + u.role);
}

function buildCard(list, it) {
  const isImage = !!list.querySelector('.imageTeaser');
  const T = isImage ? 'imageTeaser' : 'videoTeaser';
  // 克隆一张站点自己渲染的卡片做模板（选带齐了这一条需要的角标的那张）
  const own = [...list.children].filter((c) => !c.hasAttribute('data-iwe-pager-card') && c.querySelector('.' + T));
  if (!own.length) return null;
  const wantDur = !isImage && !!(it.file && it.file.duration);
  const wantGallery = isImage && it.numImages > 1;
  // 私有视频的卡片结构不一样（缩略图上是「私有视频」遮罩、标题前多一把锁），只能拿同类卡片当模板
  const wantPriv = !!it.private;
  const score = (c) => (!!c.querySelector('.duration') === wantDur) + (!!c.querySelector('.gallery') === wantGallery) + (!!c.querySelector('.hidden') === wantPriv) * 4;
  const tpl = own.reduce((best, c) => (score(c) > score(best) ? c : best), own[0]);
  const card = tpl.cloneNode(true);
  card.setAttribute('data-iwe-pager-card', '');
  // 别的增强功能在模板上留下的标记与节点不能带过来，否则它们会以为这张卡已经处理过
  card.querySelectorAll('[class^="iwe-"],[class*=" iwe-"]').forEach((e) => e.remove());
  for (const e of [card, ...card.querySelectorAll('*')]) for (const a of [...e.attributes]) if (a.name.startsWith('data-iwe-') && a.name !== 'data-iwe-pager-card') e.removeAttribute(a.name);

  const href = `/${isImage ? 'image' : 'video'}/${it.id}${it.slug ? '/' + it.slug : ''}`;
  const thumbA = card.querySelector(`.${T}__thumbnail`);
  if (thumbA) {
    thumbA.setAttribute('href', href);
    const img = thumbA.querySelector('img');
    if (img) { img.setAttribute('src', thumbOf(it, isImage)); img.removeAttribute('srcset'); }
    setText(thumbA.querySelector('.views .text'), fmtNum(it.numViews));
    setText(thumbA.querySelector('.likes .text'), fmtNum(it.numLikes));
    const dur = thumbA.querySelector('.duration');
    if (dur) wantDur ? setText(dur.querySelector('.text'), fmtDur(it.file.duration)) : dur.remove();
    const rt = thumbA.querySelector('.rating .text');
    if (rt) { const r = ratingText(it.rating); r ? (rt.textContent = r) : rt.closest('.rating').remove(); }
    const gal = thumbA.querySelector('.gallery');
    if (gal) wantGallery ? setText(gal.querySelector('.text'), String(it.numImages), true) : gal.remove();
  }
  const title = card.querySelector(`.${T}__title`);
  if (title) {
    title.setAttribute('href', href); title.setAttribute('title', it.title || '');
    const tx = title.querySelector('.text');
    if (tx) { [...tx.childNodes].filter((n) => n.nodeType === 3).forEach((n) => n.remove()); tx.append(it.title || ''); } else title.textContent = it.title || '';
  }
  const u = it.user || {};
  const prof = `/profile/${u.username || ''}`;
  const av = card.querySelector('a.avatar');
  if (av) {
    av.setAttribute('href', prof);
    const img = av.querySelector('img');
    if (img) img.setAttribute('src', u.avatar && u.avatar.id ? jpgOf('avatar', u.avatar) : '/images/default-avatar.jpg');
    badge(av, 'avatar', u);
  }
  const un = card.querySelector('a.username');
  if (un) { badge(un, 'username', u); un.setAttribute('href', prof); un.setAttribute('title', u.name || ''); const tx = un.querySelector('.text'); (tx || un).textContent = u.name || ''; }
  const when = card.querySelector('.byline > .text:not(a)');
  if (when) when.textContent = fmtAgo(it.createdAt);
  return card;
}

// 克隆卡片没有站点的点击处理：站内链接交给站点路由，不整页刷新
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('[data-iwe-pager-card] a[href^="/"]');
  if (!a) return;
  e.preventDefault();
  history.pushState({}, '', a.getAttribute('href'));
  dispatchEvent(new PopStateEvent('popstate'));
  scrollTo({ top: 0 });
}, true);

// ── 翻页方式开关放进侧边的筛选 / 菜单面板（桌面是右栏，手机是「过滤器」浮窗）──
// 有这样的面板就放进去，列表上方 / 分页条里不再放；没有面板的页面（论坛、作者页帖子…）仍用分页条里的开关。
const sideHosts = () => {
  const out = [];
  // 搜索页没有右栏：91-search.js 在筛选条右侧留了一个位置，开关放那里
  const slot = document.querySelector('.iwe-sp-pager');
  if (slot) return [{ el: slot, kind: 'slot' }];
  const modal = document.querySelector('.modal .modal__content__inner');
  if (modal) out.push({ el: modal, kind: 'modal' });
  const sub = document.querySelector('.page-subscriptions__menu');
  const subBlock = sub && sub.closest('.block');
  if (subBlock) out.push({ el: subBlock, kind: 'after' });
  // 作者页：右栏整栏已经钉住（99-profile.js），开关单独一张卡，贴在「筛选」卡下面，不再另外钉
  const pfFilter = document.querySelector('.iwe-pf-side > [data-iwe-subfilter="filter"]');
  if (pfFilter) out.push({ el: pfFilter, kind: 'next' });
  const col = document.querySelector('.iwe-filter-sticky') || (document.querySelector('.page .sortFilter') && document.querySelector('.page .sortFilter').closest('.col-lg-3 > .row'));
  if (col) out.push({ el: col, kind: 'col' });
  return out;
};
function placeSide() {
  const hosts = sideHosts();
  for (const { el, kind } of hosts) {
    if (kind === 'slot') {
      if (!el.querySelector('[data-iwe-pager-side]')) el.append(h('div.iwe-pager-side.slot', { 'data-iwe-pager-side': '', title: t('pager_mode') }, modeSwitch()));
      continue;
    }
    if (kind === 'next') {
      const n = el.nextElementSibling;
      if (!(n && n.hasAttribute('data-iwe-pager-side'))) el.after(h('div.block.block--padding.block--margin.iwe-pager-side', { 'data-iwe-pager-side': '' }, h('div.block__content', h('div.text.mb-2.text--bold', t('pager_mode')), modeSwitch())));
      continue;
    }
    if (kind === 'after') {
      // 订阅页：开关单独成一张卡，贴在菜单卡下面，跟着一起钉住（top = 菜单卡的 top + 高度 + 间距）
      let n = el.nextElementSibling;
      if (!(n && n.hasAttribute('data-iwe-pager-side'))) {
        n = h('div.block.block--padding.block--margin.iwe-pager-side.iwe-pager-after', { 'data-iwe-pager-side': '' }, h('div.block__content', h('div.text.mb-2.text--bold', t('pager_mode')), modeSwitch()));
        el.after(n);
      }
      n.style.setProperty('--iwe-after-top', `${80 + el.offsetHeight + 16}px`);
      continue;
    }
    if (el.querySelector(':scope > [data-iwe-pager-side], :scope > * > [data-iwe-pager-side]')) continue;
    const head = h('div.text.mb-2.text--bold', t('pager_mode'));
    const node = kind === 'col'
      ? h('div.block.block--padding.block--margin.iwe-pager-side', { 'data-iwe-pager-side': '' }, h('div.block__content', head, modeSwitch()))
      : h('div.iwe-pager-side.' + kind + (kind === 'modal' ? '.mt-4' : ''), { 'data-iwe-pager-side': '' }, head, modeSwitch());
    // 右栏里放在「排列方式」后面（标签区很长，放最后要在栏里滑到底才看得到）；其余追加到末尾
    if ((kind === 'col' || kind === 'modal') && el.firstElementChild) el.firstElementChild.after(node); else el.append(node);
  }
  return hosts.length > 0;
}

// ── 模式切换与扫描 ───────────────────────────────────────────────────
function onModeChange() {
  resetWaterfall();
  if (wf.io) { wf.io.disconnect(); wf.io = null; }
  for (const bar of document.querySelectorAll('.iwe-pager[data-iwe-pager-bar]')) bar.__iweSig = null;
  document.querySelectorAll('.iwe-pager-top[data-iwe-pager-top], [data-iwe-pager-side]').forEach((e) => e.remove());
  site.schedule();
}

// 分页条给别的功能复用（侧栏的「最近」页）：模式、切换钮、条的画法只此一份
const modeListeners = new Set();
const kit = {
  items,
  buildCard,
  // 卡片上用的格式化 / 地址小工具（卡片预览弹窗复用，别再写第二份）
  fmt: { num: fmtNum, dur: fmtDur, ago: fmtAgo, thumbOf, jpgOf, setText },
  mode,
  modeSwitch,
  fillBar,
  fillMore,
  setMode(m) { store.set('pagerMode', m); onModeChange(); for (const fn of modeListeners) { try { fn(m); } catch (e) { console.error('[iwe] pager', e); } } },
  onMode(fn) { modeListeners.add(fn); return () => modeListeners.delete(fn); },
};
iwePagerKit = kit;

addEventListener('resize', () => site.schedule());

/**
 * 接管范围（只换这一种分页栏）：主内容区里、由地址栏 ?page= 驱动的整页列表。
 * 路由白名单（都是站点用 useFilters 把页码放进地址栏 ?page= 的列表）：/videos /images /search /subscriptions[/类型]
 *   /forum/<板块> /forum/<板块>/<主题> /favorites/<类型> /profile/<人>/videos|images|posts /dashboard/donations|transactions。
 * 瀑布流只支持视频 / 图库（见 canWaterfall）；其余路由只换成统一的传统分页栏。
 * 其余页面上出现的 .pagination 一律保持站点原样，包括：
 *  - 视频 / 图库详情页右侧的「点赞」小列表（.pagination--compact，只有 240px 宽，页码是组件内部状态，改地址栏没用）；
 *  - 详情页、个人主页、帖子页的评论分页（同样是组件内部状态）；
 *  - 弹窗、侧栏里的分页。
 */
const LIST_ROUTE = new RegExp([
  '^/(videos|images|search|subscriptions)/?$',
  '^/subscriptions/[^/]+/?$',            // 订阅（按类型分的）
  '^/forum/[^/]+/?$',                    // 论坛板块（主题列表）
  '^/forum/[^/]+/[^/]+/?$',              // 论坛主题里的帖子（?page=N 驱动；站点用同一个 useFilters）
  '^/favorites/[^/]+/?$',                // 最爱
  '^/profile/[^/]+/(videos|images|posts)/?$',
  '^/dashboard/(donations|transactions)/?$',
].join('|'));
function takesOver(pg) {
  return LIST_ROUTE.test(location.pathname)
    && !pg.classList.contains('pagination--compact')
    && !!pg.closest('section.content')
    && !pg.closest('.likesList, .comments, [role="dialog"], .modal, .menu');
}

site.register('pager', {
  css: `
.iwe-pager-hidden{display:none!important}
.iwe-pager{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:nowrap;width:100%;min-width:0;margin:20px 0;color:var(--fg);font:14px/1 Roboto,Arial,sans-serif}
.iwe-pager.wf{justify-content:center}
.iwe-pager button,.iwe-pager input,.iwe-pager-top button{appearance:none;font:inherit;margin:0;box-sizing:border-box}
.iwe-pager-main{display:flex;flex:1 1 auto;min-width:0;align-items:center;justify-content:center;gap:4px}
.iwe-pager-btn{display:inline-grid;place-items:center;flex:none;min-width:32px;height:32px;padding:0 8px;border:0;border-radius:5px;background:rgba(128,128,128,.14);color:var(--fg);cursor:pointer;font-variant-numeric:tabular-nums;transition:background .15s var(--ease)}
.iwe-pager-btn.nav{padding:0;width:32px}
.iwe-pager-btn:hover:not(:disabled){background:rgba(128,128,128,.28)}
.iwe-pager-btn:disabled{opacity:.35;cursor:default}
.iwe-pager-btn.on,.iwe-pager-btn.on:hover:not(:disabled){background:var(--iwe-accent,var(--blue));color:#fff;font-weight:600;opacity:1}
.iwe-pager-btn:focus-visible,.iwe-pager-seg button:focus-visible,.iwe-pager-more:focus-visible{outline:2px solid var(--iwe-accent,var(--blue));outline-offset:2px}
.iwe-pager-gap{flex:none;width:20px;text-align:center;color:var(--fg3)}
.iwe-pager-jump{display:flex;flex:none;align-items:center;gap:4px}
.iwe-pager-jump input{width:56px;height:32px;padding:0 4px;border:0;border-radius:5px;background:transparent;box-shadow:inset 0 0 0 1px rgba(128,128,128,.4);color:inherit;text-align:center;outline:0;-moz-appearance:textfield;transition:box-shadow .15s var(--ease)}
.iwe-pager-jump input::placeholder{color:var(--fg3)}
.iwe-pager-jump input::-webkit-inner-spin-button,.iwe-pager-jump input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.iwe-pager-jump input:focus{box-shadow:inset 0 0 0 1.5px var(--iwe-accent,var(--blue))}
.iwe-pager-seg{display:inline-flex;flex:none;padding:2px;gap:2px;border-radius:7px;background:rgba(128,128,128,.14)}
.iwe-pager-seg button{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border:0;border-radius:5px;background:transparent;color:var(--fg2);cursor:pointer;white-space:nowrap;font-size:13px;line-height:1;transition:background .15s var(--ease),color .15s var(--ease)}
.iwe-pager-seg button:hover:not(.on){color:var(--fg)}
.iwe-pager-seg button.on{background:var(--card);color:var(--fg);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.iwe-pager-seg svg{flex:none}
.iwe-pager.compact .iwe-pager-seg button{padding:0 8px}
.iwe-pager.compact .iwe-pager-seg span{display:none}
.iwe-pager-side.block{width:100%;flex:0 0 100%}
.iwe-pager-side .iwe-pager-seg{display:flex;width:100%}
.iwe-pager-side .iwe-pager-seg button{flex:1;justify-content:center;height:34px}
@media (min-width:992px){.iwe-pager-after{position:sticky;top:var(--iwe-after-top,180px);z-index:2}}
.iwe-pager-top{display:flex;justify-content:flex-end;width:100%;margin:0 0 12px}
.iwe-pager-more{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 16px;border:0;background:transparent;color:var(--fg3);font-size:13px}
.iwe-pager-more.fail{color:var(--red);cursor:pointer;border-radius:5px;background:rgba(128,128,128,.14)}
.iwe-pager-spin{width:14px;height:14px;border-radius:50%;border:2px solid rgba(128,128,128,.35);border-top-color:var(--fg2);animation:iwe-pager-spin .8s linear infinite}
@keyframes iwe-pager-spin{to{transform:rotate(360deg)}}
`,
  scan() {
    // 站点重渲染换掉了原分页栏、或这一条已不在接管范围：留下的我们的栏跟着摘掉，原栏还给站点
    for (const bar of document.querySelectorAll('.iwe-pager[data-iwe-pager-bar]')) {
      const a = bar.__iweAnchor;
      if (!a || !a.isConnected || bar.previousElementSibling !== a || !takesOver(a)) { if (a && a.isConnected && !takesOver(a)) a.classList.remove('iwe-pager-hidden'); bar.remove(); }
    }
    if (wf.key && wf.key !== locKey()) resetWaterfall();
    const m = canWaterfall() ? mode() : 'pages';
    const side = canWaterfall() && placeSide(); // 开关在侧边面板里：分页条 / 列表上方不再放
    if (!side) document.querySelectorAll('[data-iwe-pager-side]').forEach((e) => e.remove());
    const inf = info();
    let any = false;
    for (const pg of document.querySelectorAll('.pagination')) {
      if (!pg.querySelector('.pagination__item') || !takesOver(pg)) continue;
      any = true;
      pg.classList.add('iwe-pager-hidden'); // 只藏不删：站点自己还要管它
      pg.setAttribute('data-iwe-pager', '');
      let bar = pg.nextElementSibling;
      if (!bar || !bar.hasAttribute('data-iwe-pager-bar')) { bar = h('nav.iwe-pager', { 'aria-label': t('pager_traditional'), 'data-iwe-pager-bar': '' }); bar.__iweAnchor = pg; pg.after(bar); }
      const w = Math.round(bar.clientWidth / 40);
      const sig = [m, locKey(), inf.total, inf.hasNext, env.lang, w, side].join('|');
      if (bar.__iweSig === sig) continue;
      bar.__iweSig = sig; bar.__iweMode = m;
      if (m === 'waterfall') {
        renderWaterfall(bar);
        const list = listOf(pg);
        if (!side && list && !(list.previousElementSibling && list.previousElementSibling.classList.contains('iwe-pager-top'))) {
          document.querySelectorAll('.iwe-pager-top[data-iwe-pager-top]').forEach((e) => e.remove());
          list.before(h('div.iwe-pager-top', { 'data-iwe-pager-top': '' }, modeSwitch()));
        }
      } else {
        fillBar(bar, { cur: inf.cur, total: inf.total, hasNext: inf.hasNext, go: goTo, canWaterfall: canWaterfall() && !side });
      }
    }
    if (m !== 'waterfall' || !any) document.querySelectorAll('.iwe-pager-top[data-iwe-pager-top]').forEach((e) => e.remove());
  },
  leave() {
    resetWaterfall();
    if (wf.io) { wf.io.disconnect(); wf.io = null; }
    document.querySelectorAll('.pagination.iwe-pager-hidden').forEach((e) => e.classList.remove('iwe-pager-hidden'));
    document.querySelectorAll('.iwe-pager[data-iwe-pager-bar], .iwe-pager-top[data-iwe-pager-top], [data-iwe-pager-side]').forEach((e) => e.remove());
  },
});

})();
