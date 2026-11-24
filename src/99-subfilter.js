// 订阅页（/subscriptions/videos、/subscriptions/images）右栏的「筛选」卡：排序 / 评级 / 年月 / 标签 + 已保存筛选。
// 原版订阅页只有一份按发布时间倒序的列表，没有任何筛选入口。
//
// 接口实测（api.iwara.tv /videos、/images，subscribed=true）：
// - sort / date / tags / rating 都生效，并且叠加在关注集合上（筛完仍只有关注的作者）；不带 sort 时等同 sort=date。
// - tags 是「同时包含」；不存在的标签、非法日期（2024-13）、空的 tags= 都是 500，所以取值只能来自选项和词库。
// - 站点自己按地址拼参数、决定重不重拉都靠不住，所以列表请求发出前按「当前地址栏」重写筛选参数，
//   站点不重拉时推它一把——都在 88-site.js 的 listSync 里。改筛选只需改地址 + popstate，不刷新页面。
// - 视频 / 图像两个 tab 共用一套筛选：菜单里互切时带上当前筛选。
// - 评级默认「全部」（用户要求，2026-11-24）：地址栏没写 rating 就按 all 发，不跟站点侧栏的评级开关。
//
// 排序项顺序：「最新」排第一，因为它就是默认项；其余跟热门列表一致。
// 帖子（/subscriptions/posts）的接口不吃这些参数，不出现。
//
// 文件末尾另有视频 / 图库列表页（/videos、/images）的「评级」卡：原版那里只有侧栏的全站评级开关，
// 地址里的 rating 只在整页打开时生效、之后改了站点不重拉（同样交给 listSync）。
// 那里的默认评级跟站点侧栏开关（localStorage 'rating'），与原版列表一致。
//
// 卡片外壳、分段按钮、年月下拉给作者页的视频 / 图片标签页复用（99-profile.js），样式类名（iwe-sf-*）也是共用的。

// 在本文件里赋值：{ makeCard, seg, dateRow, section, setParam, SORTS, SORT_ICONS }
let iweSubFilterKit = null;

(() => {

defineStrings({
  subfilter_title: '筛选',
  subfilter_sort: '排序',
  subfilter_rating: '评级',
  subfilter_date: '发布时间',
  subfilter_tags: '标签',
  subfilter_anyYear: '不限年份',
  subfilter_anyMonth: '全年',
  subfilter_month: '{n} 月',
  subfilter_active: '{n} 项生效',
  'subfilter.sort.date': '最新',
  'subfilter.sort.trending': '趋势',
  'subfilter.sort.popularity': '人气',
  'subfilter.sort.likes': '点赞',
  'subfilter.sort.views': '观看',
  'subfilter.rating.all': '全部',
  'subfilter.rating.general': '全年龄',
  'subfilter.rating.ecchi': '成人',
}, {
  subfilter_title: 'Filters',
  subfilter_sort: 'Sort',
  subfilter_rating: 'Rating',
  subfilter_date: 'Published',
  subfilter_tags: 'Tags',
  subfilter_anyYear: 'Any year',
  subfilter_anyMonth: 'Whole year',
  subfilter_month: 'Month {n}',
  subfilter_active: '{n} active',
  'subfilter.sort.date': 'Latest',
  'subfilter.sort.trending': 'Trending',
  'subfilter.sort.popularity': 'Popular',
  'subfilter.sort.likes': 'Likes',
  'subfilter.sort.views': 'Views',
  'subfilter.rating.all': 'All',
  'subfilter.rating.general': 'General',
  'subfilter.rating.ecchi': 'Ecchi',
}, {
  subfilter_title: '絞り込み',
  subfilter_sort: '並び替え',
  subfilter_rating: '評価',
  subfilter_date: '投稿日',
  subfilter_tags: 'タグ',
  subfilter_anyYear: '年を指定しない',
  subfilter_anyMonth: '通年',
  subfilter_month: '{n} 月',
  subfilter_active: '{n} 件適用中',
  'subfilter.sort.date': '新着',
  'subfilter.sort.trending': 'トレンド',
  'subfilter.sort.popularity': '人気',
  'subfilter.sort.likes': 'いいね',
  'subfilter.sort.views': '再生数',
  'subfilter.rating.all': 'すべて',
  'subfilter.rating.general': '一般',
  'subfilter.rating.ecchi': 'エッチ',
});

const ROUTE = /^\/subscriptions\/(videos|images)$/;
const SORTS = ['date', 'trending', 'popularity', 'likes', 'views'];
const RATINGS = ['all', 'general', 'ecchi'];
const FIRST_YEAR = 2010;

const params = () => new URLSearchParams(location.search);
const DEFAULT_RATING = 'all';
const FILTER_KEYS = ['sort', 'date', 'tags', 'rating'];

// 订阅列表请求发出前：筛选参数一律按当前地址栏重写（站点带的旧值、空值全部丢掉）。帖子 tab 的接口不吃这些参数，统统去掉。
// 改写与「站点不重拉时推一把」都在 88-site.js 的 listSync 里
listSync.register({
  feature: 'subFilter',
  api: (path) => { const m = path.match(/^\/subscriptions\/(videos|images|posts)$/); return m ? '/' + m[1] : null; },
  accept: (u) => u.searchParams.get('subscribed') === 'true',
  rewrite(u, sp) {
    for (const k of FILTER_KEYS) u.searchParams.delete(k);
    if (u.pathname === '/posts') return;
    const sort = sp.get('sort'), date = sp.get('date'), tags = sp.get('tags'), rating = sp.get('rating');
    u.searchParams.set('rating', RATINGS.includes(rating) ? rating : DEFAULT_RATING);
    if (SORTS.includes(sort)) u.searchParams.set('sort', sort);
    if (date && /^\d{4}(-\d{2})?$/.test(date)) u.searchParams.set('date', date);
    if (tags) u.searchParams.set('tags', tags);
  },
});
const curSort = () => (SORTS.includes(params().get('sort')) ? params().get('sort') : 'date');
const curRating = () => { const r = params().get('rating'); return RATINGS.includes(r) ? r : DEFAULT_RATING; };

/** 改一个参数并回到第一页。排序、评级换回默认项也显式写值，地址里看得出当前选的是什么。 */
function setParam(key, value) {
  const url = new URL(location.href);
  if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
  url.searchParams.delete('page');
  listNavigate(url);
}

/** 筛选卡里生效的项数（排序不是「最新」、评级不是「全部」、选了日期各算一项；标签在自己的卡里） */
function activeCount() {
  return (curSort() !== 'date' ? 1 : 0) + (curRating() !== DEFAULT_RATING ? 1 : 0) + (params().get('date') ? 1 : 0);
}

/** 筛选卡的重置：排序、评级、日期回默认，标签不动 */
function resetFilters() {
  const url = new URL(location.href);
  for (const k of ['sort', 'rating', 'date', 'page']) url.searchParams.delete(k);
  listNavigate(url);
}

const SORT_ICONS = { date: 'clock', trending: 'trendUp', popularity: 'star', likes: 'heart', views: 'eye' };
const RATING_ICONS = { all: 'layers', general: 'shield', ecchi: 'flame' };

function seg(options, value, labelOf, iconOf, onPick) {
  return h('div.iwe-sf-seg', { role: 'radiogroup' }, options.map((v) => h('button' + (v === value ? '.on' : ''), {
    type: 'button', role: 'radio', 'aria-checked': String(v === value),
    onclick: () => { if (v !== value) onPick(v); },
  }, icon(iconOf[v], 15), h('span', labelOf(v)))));
}

function dateRow() {
  const [y = '', m = ''] = (params().get('date') || '').split('-');
  const now = new Date().getFullYear();
  const yearSel = h('select.iwe-sf-select', { 'aria-label': t('subfilter_date'), onchange: () => setParam('date', yearSel.value) },
    h('option', { value: '' }, t('subfilter_anyYear')),
    Array.from({ length: now - FIRST_YEAR + 1 }, (_, i) => String(now - i)).map((v) => h('option', { value: v, selected: v === y }, v)));
  const monthSel = h('select.iwe-sf-select', { 'aria-label': t('subfilter_date'), disabled: !y, onchange: () => setParam('date', monthSel.value ? `${y}-${monthSel.value}` : y) },
    h('option', { value: '' }, t('subfilter_anyMonth')),
    Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((v) => h('option', { value: v, selected: v === m }, t('subfilter_month', { n: +v }))));
  return h('div.iwe-sf-date', yearSel, monthSel);
}

const filterQuery = () => { const sp = params(); sp.delete('page'); return sp.toString(); };

// 菜单链接：视频 / 图像带上当前筛选，帖子不带。站点的路由链接只认它自己的路径、不带参数，
// 所以当前地址有筛选时拦下点击，自己改地址（新标签页打开等修饰键点击不管，走改过的 href）
function menuTarget(a) {
  const m = (a.getAttribute('href') || '').match(/^\/subscriptions\/(videos|images|posts)/);
  if (!m) return null;
  const q = m[1] === 'posts' ? '' : filterQuery();
  return '/subscriptions/' + m[1] + (q ? '?' + q : '');
}
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('.page-subscriptions__menu a[href]');
  if (!a || !ROUTE.test(location.pathname) || site.isOff('subFilter') || !filterQuery()) return;
  const to = menuTarget(a);
  if (!to) return;
  e.preventDefault(); e.stopPropagation();
  listNavigate(to);
  scrollTo({ top: 0 });
}, true);

const section = (label, ...kids) => h('div.iwe-sf-sec', h('div.iwe-sf-label', label), ...kids);

/**
 * 一张右栏卡片：标题行与站点「按标签过滤」「按日期过滤」同一套结构（.block--header / .block__header），右上角是重置钮。
 * 窄屏上卡片默认收起，点标题行展开（宽屏标题行不可点）。
 */
function makeCard(kind, title, onReset) {
  const badge = h('span.iwe-sf-badge', { hidden: true });
  const reset = iweTagFilterKit.resetButton((e) => { e.stopPropagation(); onReset(); });
  const header = h('div.block__header.iwe-has-reset.iwe-sf-hd', {
    onclick: () => { const open = card.classList.toggle('open'); header.setAttribute('aria-expanded', String(open)); },
    'aria-expanded': 'false',
  }, h('div.text.text--h3.text--bold', title), badge, h('span.iwe-sf-chev', icon('chevronDown', 16)), reset);
  const body = h('div.block__content.iwe-sf-body');
  const card = h('div.block.block--padding.block--margin.block--header.iwe-sf', { 'data-iwe-subfilter': kind }, header, body);
  return { card, body, badge, reset };
}

iweSubFilterKit = { makeCard, seg, dateRow, section, setParam, SORTS, SORT_ICONS };

// 两张卡常驻：筛选卡只在参数变化时重画内容；标签卡里是增强版标签筛选的实例（有输入框，绝不能跟着重画）
let filterCard = null, tagCard = null, tagInst = null, sig = null;

function build(col) {
  filterCard = makeCard('filter', t('subfilter_title'), resetFilters);
  tagCard = makeCard('tags', t('subfilter_tags'), () => {
    const url = new URL(location.href);
    url.searchParams.delete('tags'); url.searchParams.delete('page');
    listNavigate(url);
  });
  col.append(filterCard.card, tagCard.card);
  tagInst = iweTagFilterKit.mount(tagCard.body);
  sig = null;
}

function paint() {
  const n = activeCount();
  filterCard.badge.textContent = n ? t('subfilter_active', { n }) : '';
  filterCard.badge.hidden = !n;
  filterCard.reset.classList.toggle('show', n > 0);
  filterCard.reset.tabIndex = n ? 0 : -1;
  const tagCount = (params().get('tags') || '').split(',').filter(Boolean).length;
  tagCard.badge.textContent = tagCount ? t('subfilter_active', { n: tagCount }) : '';
  tagCard.badge.hidden = !tagCount;
  tagCard.reset.classList.toggle('show', tagCount > 0);
  tagCard.reset.tabIndex = tagCount ? 0 : -1;
  // replaceChildren 会把 null 当成文字 "null" 插进去：用 add()，它会跳过空项
  add(clear(filterCard.body), [
    section(t('subfilter_sort'), seg(SORTS, curSort(), (v) => t('subfilter.sort.' + v), SORT_ICONS, (v) => setParam('sort', v))),
    section(t('subfilter_rating'), seg(RATINGS, curRating(), (v) => t('subfilter.rating.' + v), RATING_ICONS, (v) => setParam('rating', v))),
    section(t('subfilter_date'), dateRow()),
  ]);
}

site.register('subFilter', {
  match: (path) => ROUTE.test(path),
  css: `
/* 站点的 .block__header 是居中的竖排；我们的标题行要横排：标题 + 角标靠左，重置钮在右上角 */
.iwe-sf .iwe-sf-hd{display:flex;flex-direction:row;justify-content:flex-start;align-items:center;gap:8px;padding-right:34px}
.iwe-sf-badge{padding:2px 8px;border-radius:10px;background:var(--primary-dark);color:var(--text);font-size:.75rem;white-space:nowrap}
.iwe-sf-badge[hidden]{display:none}
.iwe-sf-chev{display:none;margin-left:auto;transition:transform .2s var(--ease)}
.iwe-sf.open .iwe-sf-chev{transform:rotate(180deg)}
.iwe-sf-sec{margin-bottom:14px}
.iwe-sf-sec:last-child{margin-bottom:0}
.iwe-sf-label{margin-bottom:8px;font-size:.8rem;font-weight:700;color:var(--text);opacity:.65}
.iwe-sf-seg{display:flex;flex-wrap:wrap;gap:6px}
.iwe-sf-seg button{appearance:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 11px 0 9px;border:0;border-radius:5px;background:var(--body-darker);color:var(--text);font:inherit;font-size:.85rem;cursor:pointer;transition:background .15s}
.iwe-sf-seg button:hover:not(.on){background:var(--body)}
.iwe-sf-seg button.on{background:var(--primary-dark);font-weight:600;cursor:default}
.iwe-sf-seg .ic{flex:none;opacity:.7}
.iwe-sf-seg button.on .ic{opacity:1}
.iwe-sf-seg button:focus-visible,.iwe-sf-select:focus-visible{outline:2px solid var(--primary);outline-offset:2px}
.iwe-sf-date{display:flex;gap:8px}
.iwe-sf-select{appearance:none;-webkit-appearance:none;flex:1;min-width:0;height:34px;padding:0 30px 0 10px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5 6 8l3.5-3.5' fill='none' stroke='%23888' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:12px;border:1px solid rgba(128,128,128,.4);border-radius:5px;background-color:var(--body);color:var(--text);font:inherit;font-size:.85rem;cursor:pointer}
.iwe-sf-select:disabled{opacity:.45;cursor:default}
/* 栏里卡片之间的间距：站点默认 30px，收紧到 16px（与视频 / 图库页右栏一致） */
.iwe-sf-col>.block.block--margin{margin-bottom:16px}
/* 宽屏：整列钉在顶栏下，比视口高时栏内可滚、滚到头带动页面（88-site.js 的 stickySidebar）；栏里原来各自钉住的卡片改回普通排布 */
@media (min-width:992px){
  .iwe-sf-col{position:sticky;top:80px;--iwe-sticky:1;align-self:flex-start;scrollbar-width:thin}
  .iwe-sf-col>.block{position:static!important}
}
/* 窄屏：右栏在列表上方，两张卡默认收起，点标题行展开 */
@media (max-width:991.98px){
  .iwe-sf-hd{cursor:pointer}
  .iwe-sf:not(.open) .iwe-sf-hd{margin-bottom:0}
  .iwe-sf-chev{display:inline-flex}
  .iwe-sf:not(.open) .iwe-sf-body{display:none}
}
@media (prefers-reduced-motion:reduce){.iwe-sf-chev{transition:none}}
`,
  scan() {
    const menu = document.querySelector('.page-subscriptions__menu');
    const menuBlock = menu && menu.closest('.block');
    if (!menuBlock || !menuBlock.parentElement || !iweTagFilterKit) return;
    const col = menuBlock.parentElement;
    if (!filterCard || !filterCard.card.isConnected || filterCard.card.parentElement !== col || !tagCard.card.isConnected) {
      if (filterCard) { filterCard.card.remove(); tagCard.card.remove(); }
      build(col);
    }
    col.classList.add('iwe-sf-col');
    stickySidebar(col); // 钉在顶栏下；比视口高时栏内可滚，滚到头带动页面
    // 翻页方式那张卡会插在菜单卡后面；筛选卡、标签卡（最长）始终放最后
    if (col.lastElementChild !== tagCard.card || tagCard.card.previousElementSibling !== filterCard.card) col.append(filterCard.card, tagCard.card);
    listSync.watch(); // 站点自己的路由跳转（菜单链接）不发 popstate，靠 scan 补看一眼
    const next = [location.search, env.lang].join('|');
    if (next !== sig) { sig = next; paint(); }
    if (tagInst) tagInst.sync();
    // 悬停 / 中键打开时看到的地址与点击后去的一致
    for (const a of menu.querySelectorAll('a[href]')) {
      const to = menuTarget(a);
      if (to && a.getAttribute('href') !== to) a.setAttribute('href', to);
    }
  },
  leave() {
    if (filterCard) { filterCard.card.remove(); tagCard.card.remove(); }
    filterCard = tagCard = tagInst = null; sig = null;
    document.querySelectorAll('.iwe-sf-col').forEach((e) => e.classList.remove('iwe-sf-col'));
  },
});

// ── 视频 / 图库列表页的「评级」卡 ────────────────────────────────────

const LIST_ROUTE = /^\/(videos|images)$/;
/** 站点自己的评级设置（侧栏开关写在 localStorage 'rating'） */
const siteRating = () => { try { const r = localStorage.getItem('rating'); return RATINGS.includes(r) ? r : 'all'; } catch { return 'all'; } };
const listRating = (sp = params()) => (RATINGS.includes(sp.get('rating')) ? sp.get('rating') : siteRating());

// 列表请求的 rating 按地址栏写（没写就用站点设置）；其他参数站点自己处理得对，不碰。
// 只改主列表：带 user= 的是作者作品、带 subscribed 的是订阅，都不是这一页的列表
listSync.register({
  feature: 'ratingFilter',
  api: (path) => (LIST_ROUTE.test(path) ? path : null),
  accept: (u) => !u.searchParams.has('user') && !u.searchParams.has('subscribed') && !u.searchParams.has('exclude'),
  rewrite(u, sp) { u.searchParams.set('rating', listRating(sp)); },
});

function ratingCard(inModal) {
  const reset = iweTagFilterKit.resetButton(() => setParam('rating', ''));
  const body = h('div.block__content');
  // 手机「过滤器」浮窗：不带卡片，跟「翻页方式」「按标签过滤」一样直接铺在浮窗内边距里
  const card = inModal
    ? h('div.mt-4.iwe-rf', { 'data-iwe-ratingfilter': '' },
      h('div.iwe-has-reset', h('div.text.mb-2.text--bold', t('subfilter_rating'))), body)
    : h('div.block.col-12.block--padding.block--margin.block--header.iwe-rf', { 'data-iwe-ratingfilter': '' },
      h('div.block__header.iwe-has-reset', h('div.text.text--h3.text--bold', t('subfilter_rating'))), body);
  card.firstElementChild.append(reset);
  let sig = null;
  card.__paint = () => {
    const next = [location.search, siteRating(), env.lang].join('|');
    if (next === sig) return;
    sig = next;
    add(clear(body), seg(RATINGS, listRating(), (v) => t('subfilter.rating.' + v), RATING_ICONS, (v) => setParam('rating', v)));
    const show = listRating() !== siteRating();
    reset.classList.toggle('show', show);
    reset.tabIndex = show ? 0 : -1;
  };
  return card;
}

site.register('ratingFilter', {
  match: (path) => LIST_ROUTE.test(path),
  scan() {
    if (!iweTagFilterKit) return;
    listSync.watch();
    // 桌面右栏和手机「过滤器」浮窗里各有一份「排列方式」：评级卡紧跟在它后面
    for (const sort of document.querySelectorAll('.page .sortFilter, .modal .sortFilter')) {
      const anchor = sort.closest('.block') || sort;
      let card = anchor.nextElementSibling;
      if (!(card && card.hasAttribute('data-iwe-ratingfilter'))) {
        card = anchor.parentElement.querySelector(':scope > [data-iwe-ratingfilter]') || ratingCard(!!sort.closest('.modal'));
        anchor.after(card);
      }
      card.__paint();
    }
  },
  leave() { document.querySelectorAll('[data-iwe-ratingfilter]').forEach((e) => e.remove()); },
});

})();
