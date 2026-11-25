// 搜索：顶栏搜索框（所有页面）+ 搜索页的搜索栏、类型标签、筛选条（排序、标签、作者、发布时间、时长、分级、精确匹配）。
//
// 地址栏是唯一事实源：/search?type=&query=&sort=。筛选条件编码在 query 的花括号里（buildQuery / parseQuery 互为反向），
// 关键词在前、花括号在后——引擎会静默丢掉花括号后面的文字。
// 跳转一律 pushState + popstate：站点搜索页对 type / query / sort 的任何变化都会重新请求（2026-11-24 实测），不整页刷新。
// 站点顶栏表单自带 onSubmit（按当前页面猜板块后站内跳转），所以在 document 捕获阶段拦下 submit，不让它跑；
// 以前这里拦了还 location.assign，于是先站内跳一次、紧接着整页刷新一次。
// 空关键词且没有筛选时站点不发请求、页面停在旧结果上，所以这种状态下只改本地，不跳转。
(() => {

defineStrings(
  {
    'search.types.videos': '视频',
    'search.types.images': '图片',
    'search.types.posts': '发布',
    'search.types.users': '用户',
    'search.types.playlists': '播放列表',
    'search.types.forum_threads': '论坛主题',
    'search.types.forum_posts': '论坛回复',
    'search.ph': '搜索{type}',
    'search.go': '搜索',
    'search.clear': '清空',
    'search.type': '搜索范围',
    'search.filters': '筛选',
    'search.filters.title': '筛选条件',
    'search.filters.in': '在「{type}」中',
    'search.reset': '重置',
    'search.close': '关闭',
    'search.done': '完成',
    'search.clearAll': '清除筛选',
    'search.clearOne': '清除',
    'search.any': '不限',
    'search.results': '{n} 个结果',
    'search.results.none': '没有结果',
    'search.recent': '最近搜索',
    'search.recent.clear': '清空',
    'search.recent.remove': '删除这条',
    'search.recent.empty': '还没有搜索记录。在任何页面按 / 都能直接开始搜索。',
    'search.sg.text': '搜索“{q}”',
    'search.sg.tags': '按标签找（比只搜文字更全）',
    'search.sg.tagAct': '按标签',
    'search.f.sort': '排序',
    'search.f.tags': '标签',
    'search.f.author': '作者',
    'search.f.date': '发布时间',
    'search.f.dur': '时长',
    'search.f.rating': '分级',
    'search.f.exact': '精确匹配',
    'search.sort.relevance': '相关度',
    'search.sort.date': '最新发布',
    'search.sort.views': '观看最多',
    'search.sort.likes': '点赞最多',
    'search.sort.needKw': '按相关度排序需要关键词',
    'search.tags.ph': '输入标签，中英日都能搜',
    'search.tags.hint': '回车 = 包含　Shift + 回车 = 排除',
    'search.tags.hintTouch': '点选 = 包含　点右侧「排除」= 排除',
    'search.tags.mode': '选了多个标签时',
    'search.tags.all': '全部都要有',
    'search.tags.any': '有一个就行',
    'search.tags.none': '没有匹配的标签',
    'search.tags.loading': '标签词库加载中…',
    'search.tags.exclude': '排除',
    'search.tags.excluded': '排除：{name}',
    'search.author.ph': '输入用户名或昵称',
    'search.author.hint': '可以加多位作者，满足其一即可',
    'search.author.searching': '正在查找…',
    'search.author.none': '没找到，回车按用户名「{q}」添加',
    'search.author.login': '登录后能联想用户；也可以直接回车按用户名添加',
    'search.date.1d': '24 小时内',
    'search.date.7d': '7 天内',
    'search.date.30d': '30 天内',
    'search.date.1y': '一年内',
    'search.date.custom': '自定义',
    'search.date.from': '开始日期',
    'search.date.to': '结束日期',
    'search.date.since': '{d} 起',
    'search.date.until': '截至 {d}',
    'search.dur.s1': '1 分钟内',
    'search.dur.s4': '1–4 分钟',
    'search.dur.mid': '4–20 分钟',
    'search.dur.long': '20 分钟以上',
    'search.rating.general': '全年龄',
    'search.rating.ecchi': '成人',
    'search.exact.hint': '给关键词加引号：只看完整包含这句话的结果，不拆词',
    'search.exact.hintKw': '只看完整包含“{q}”的结果',
    'search.exact.needKw': '先输入关键词',
  },
  {
    'search.types.videos': 'Videos',
    'search.types.images': 'Images',
    'search.types.posts': 'Posts',
    'search.types.users': 'Users',
    'search.types.playlists': 'Playlists',
    'search.types.forum_threads': 'Forum threads',
    'search.types.forum_posts': 'Forum replies',
    'search.ph': 'Search {type}',
    'search.go': 'Search',
    'search.clear': 'Clear',
    'search.type': 'Search in',
    'search.filters': 'Filters',
    'search.filters.title': 'Filters',
    'search.filters.in': 'in {type}',
    'search.reset': 'Reset',
    'search.close': 'Close',
    'search.done': 'Done',
    'search.clearAll': 'Clear filters',
    'search.clearOne': 'Clear',
    'search.any': 'Any',
    'search.results': '{n} results',
    'search.results.none': 'No results',
    'search.recent': 'Recent searches',
    'search.recent.clear': 'Clear',
    'search.recent.remove': 'Remove',
    'search.recent.empty': 'No searches yet. Press / on any page to start one.',
    'search.sg.text': 'Search “{q}”',
    'search.sg.tags': 'Find by tag (catches more than text)',
    'search.sg.tagAct': 'By tag',
    'search.f.sort': 'Sort',
    'search.f.tags': 'Tags',
    'search.f.author': 'Author',
    'search.f.date': 'Upload date',
    'search.f.dur': 'Duration',
    'search.f.rating': 'Rating',
    'search.f.exact': 'Exact match',
    'search.sort.relevance': 'Relevance',
    'search.sort.date': 'Newest',
    'search.sort.views': 'Most viewed',
    'search.sort.likes': 'Most liked',
    'search.sort.needKw': 'Relevance needs a keyword',
    'search.tags.ph': 'Type a tag in any language',
    'search.tags.hint': 'Enter = include · Shift + Enter = exclude',
    'search.tags.hintTouch': 'Tap = include · tap “Exclude” = exclude',
    'search.tags.mode': 'With several tags',
    'search.tags.all': 'Must have all',
    'search.tags.any': 'Any of them',
    'search.tags.none': 'No matching tags',
    'search.tags.loading': 'Loading tag list…',
    'search.tags.exclude': 'Exclude',
    'search.tags.excluded': 'Excluded: {name}',
    'search.author.ph': 'Username or display name',
    'search.author.hint': 'Add several authors to match any of them',
    'search.author.searching': 'Searching…',
    'search.author.none': 'Not found. Press Enter to add “{q}” as a username',
    'search.author.login': 'Sign in for suggestions, or press Enter to add a username',
    'search.date.1d': 'Past 24 hours',
    'search.date.7d': 'Past week',
    'search.date.30d': 'Past month',
    'search.date.1y': 'Past year',
    'search.date.custom': 'Custom',
    'search.date.from': 'From',
    'search.date.to': 'To',
    'search.date.since': 'Since {d}',
    'search.date.until': 'Until {d}',
    'search.dur.s1': 'Under 1 min',
    'search.dur.s4': '1–4 min',
    'search.dur.mid': '4–20 min',
    'search.dur.long': 'Over 20 min',
    'search.rating.general': 'General',
    'search.rating.ecchi': 'Ecchi',
    'search.exact.hint': 'Quote the keywords: only results containing the whole phrase',
    'search.exact.hintKw': 'Only results containing “{q}”',
    'search.exact.needKw': 'Type a keyword first',
  },
  {
    'search.types.videos': '動画',
    'search.types.images': '画像',
    'search.types.posts': '投稿',
    'search.types.users': 'ユーザー',
    'search.types.playlists': 'プレイリスト',
    'search.types.forum_threads': 'フォーラムのスレッド',
    'search.types.forum_posts': 'フォーラムの返信',
    'search.ph': '{type}を検索',
    'search.go': '検索',
    'search.clear': 'クリア',
    'search.type': '検索対象',
    'search.filters': '絞り込み',
    'search.filters.title': '絞り込み条件',
    'search.filters.in': '「{type}」内',
    'search.reset': 'リセット',
    'search.close': '閉じる',
    'search.done': '完了',
    'search.clearAll': '絞り込みを解除',
    'search.clearOne': '解除',
    'search.any': '指定なし',
    'search.results': '{n} 件の結果',
    'search.results.none': '結果がありません',
    'search.recent': '最近の検索',
    'search.recent.clear': 'クリア',
    'search.recent.remove': 'この履歴を削除',
    'search.recent.empty': '検索履歴はまだありません。どのページでも / を押すとすぐに検索できます。',
    'search.sg.text': '「{q}」を検索',
    'search.sg.tags': 'タグで探す（文字検索より網羅的）',
    'search.sg.tagAct': 'タグで探す',
    'search.f.sort': '並び替え',
    'search.f.tags': 'タグ',
    'search.f.author': '投稿者',
    'search.f.date': '投稿日',
    'search.f.dur': '長さ',
    'search.f.rating': '評価',
    'search.f.exact': '完全一致',
    'search.sort.relevance': '関連度',
    'search.sort.date': '新着',
    'search.sort.views': '再生数が多い順',
    'search.sort.likes': 'いいねが多い順',
    'search.sort.needKw': '関連度順にはキーワードが必要です',
    'search.tags.ph': 'タグを入力（日本語・英語・中国語に対応）',
    'search.tags.hint': 'Enter = 含める　Shift + Enter = 除外',
    'search.tags.hintTouch': 'タップ = 含める　右側の「除外」をタップ = 除外',
    'search.tags.mode': '複数のタグを選んだとき',
    'search.tags.all': 'すべて含む',
    'search.tags.any': 'いずれかを含む',
    'search.tags.none': '一致するタグがありません',
    'search.tags.loading': 'タグ辞書を読み込み中…',
    'search.tags.exclude': '除外',
    'search.tags.excluded': '除外：{name}',
    'search.author.ph': 'ユーザー名または表示名',
    'search.author.hint': '複数の投稿者を追加できます（いずれかに該当すれば表示）',
    'search.author.searching': '検索中…',
    'search.author.none': '見つかりません。Enter でユーザー名「{q}」として追加',
    'search.author.login': 'ログインすると候補が表示されます。Enter でユーザー名を直接追加することもできます',
    'search.date.1d': '24 時間以内',
    'search.date.7d': '7 日以内',
    'search.date.30d': '30 日以内',
    'search.date.1y': '1 年以内',
    'search.date.custom': 'カスタム',
    'search.date.from': '開始日',
    'search.date.to': '終了日',
    'search.date.since': '{d} 以降',
    'search.date.until': '{d} まで',
    'search.dur.s1': '1 分以内',
    'search.dur.s4': '1～4 分',
    'search.dur.mid': '4～20 分',
    'search.dur.long': '20 分以上',
    'search.rating.general': '一般',
    'search.rating.ecchi': 'エッチ',
    'search.exact.hint': 'キーワードを引用符で囲むと、そのフレーズ全体を含む結果だけを表示します',
    'search.exact.hintKw': '「{q}」をそのまま含む結果のみ',
    'search.exact.needKw': '先にキーワードを入力してください',
  }
);

Object.assign(ICONS, {
  sSliders: 'M4 6h8m4 0h4M4 12h2m4 0h10M4 18h10m4 0h2M14 4v4M8 10v4M16 16v4',
  sSort: 'M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3',
  sCalendar: 'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm-1 4h16M8 4v4m8-4v4',
  sHistory: 'M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4M12 8v4l3 2',
});

// ── 类型与字段 ───────────────────────────────────────────────────────
const TYPES = ['videos', 'images', 'posts', 'users', 'playlists', 'forum_threads', 'forum_posts'];
const TYPE_ICON = { videos: 'film', images: 'picture', posts: 'file', users: 'user', playlists: 'list', forum_threads: 'chat', forum_posts: 'quote' };
const MEDIA = ['videos', 'images'];
// 各类型能用的筛选（按引擎的字段表：用户没有 author，只有视频有 duration，只有视频 / 图片有 tags、rating）
const FIELDS = {
  videos: ['sort', 'tags', 'author', 'date', 'dur', 'rating', 'exact'],
  images: ['sort', 'tags', 'author', 'date', 'rating', 'exact'],
  users: ['sort', 'date', 'exact'],
};
const CHIP_ORDER = ['sort', 'tags', 'author', 'date', 'dur', 'rating', 'exact'];
const fieldsOf = (type) => FIELDS[type] || ['sort', 'author', 'date', 'exact'];
const has = (type, f) => fieldsOf(type).includes(f);
const sortOpts = (type) => (MEDIA.includes(type) ? ['relevance', 'date', 'views', 'likes'] : ['relevance', 'date']);
const typeName = (tp) => t('search.types.' + tp);
const typeFromPath = (p) => (/^\/images?(\/|$)/.test(p) ? 'images' : /^\/forum/.test(p) ? 'forum_threads' : /^\/posts?(\/|$)/.test(p) ? 'posts'
  : /^\/playlists?(\/|$)/.test(p) ? 'playlists' : 'videos');
const FDEF = {
  sort: { ic: 'sSort', label: 'search.f.sort' },
  tags: { ic: 'tag', label: 'search.f.tags' },
  author: { ic: 'at', label: 'search.f.author' },
  date: { ic: 'sCalendar', label: 'search.f.date' },
  dur: { ic: 'clock', label: 'search.f.dur' },
  rating: { ic: 'shield', label: 'search.f.rating' },
  exact: { ic: 'quote', label: 'search.f.exact' },
};

// ── 状态 ─────────────────────────────────────────────────────────────
const DAY = 86400;
const nowSec = () => Math.floor(Date.now() / 1000);
const DATE_PRESETS = [['1d', 1], ['7d', 7], ['30d', 30], ['1y', 365]];
// 「近 N 天」取整到小时：同一小时里重复搜不会因为秒数不同变成另一条地址
const presetFrom = (n) => Math.floor((nowSec() - n * DAY) / 3600) * 3600;
const DURS = { s1: [0, 60], s4: [60, 240], mid: [240, 1200], long: [1200, 0] };
const pad2 = (n) => String(n).padStart(2, '0');
const ymd = (sec) => { const d = new Date(sec * 1000); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const localMidnight = (s) => { const [y, m, d] = s.split('-').map(Number); return Math.floor(new Date(y, m - 1, d).getTime() / 1000); };

const blank = (type = 'videos') => ({ type, keyword: '', exact: false, tags: [], excludeTags: [], tagMode: 'all', authors: [], from: 0, to: 0, dur: '', rating: '', sort: '' });
function resetFilters(s) { Object.assign(s, { exact: false, tags: [], excludeTags: [], tagMode: 'all', authors: [], from: 0, to: 0, dur: '', rating: '', sort: '' }); }

/** 发布时间是哪一档：'' 不限 / 预设键 / 'custom'。离预设差两小时以内都算（地址是绝对时间，几分钟后再看也认得出来） */
function datePreset(s) {
  if (!s.from && !s.to) return '';
  if (s.to) return 'custom';
  const ago = nowSec() - s.from;
  const hit = DATE_PRESETS.find(([, n]) => Math.abs(ago - n * DAY) <= 2 * 3600);
  return hit ? hit[0] : 'custom';
}
function dateLabel(s) {
  const p = datePreset(s);
  if (!p) return null;
  if (p !== 'custom') return t('search.date.' + p);
  if (s.from && s.to) return `${ymd(s.from)} – ${ymd(s.to - DAY)}`;
  return s.from ? t('search.date.since', { d: ymd(s.from) }) : t('search.date.until', { d: ymd(s.to - DAY) });
}

/** 当前类型下生效的筛选（不含排序）。 */
function activeFilters(s) {
  const out = [];
  if (has(s.type, 'tags') && (s.tags.length || s.excludeTags.length)) out.push('tags');
  if (has(s.type, 'author') && s.authors.length) out.push('author');
  if (s.from || s.to) out.push('date');
  if (has(s.type, 'dur') && s.dur) out.push('dur');
  if (has(s.type, 'rating') && s.rating) out.push('rating');
  if (s.exact && s.keyword.trim()) out.push('exact');
  return out;
}

const userName = (u) => { const x = siteData.user(u); return x && x.name ? x.name : u; };
/** 条件的简短文字（chip 上、最近搜索里用）；没设返回 null。 */
function fieldValue(f, s) {
  switch (f) {
    case 'tags': {
      const all = [...s.tags.map((id) => '#' + tagDict.name(id)), ...s.excludeTags.map((id) => '−#' + tagDict.name(id))];
      return all.length ? all[0] + (all.length > 1 ? ` +${all.length - 1}` : '') : null;
    }
    case 'author': return s.authors.length ? '@' + userName(s.authors[0]) + (s.authors.length > 1 ? ` +${s.authors.length - 1}` : '') : null;
    case 'date': return dateLabel(s);
    case 'dur': return s.dur ? t('search.dur.' + s.dur) : null;
    case 'rating': return s.rating ? t('search.rating.' + s.rating) : null;
    case 'exact': return s.exact ? t('search.f.exact') : null;
    default: return null;
  }
}
function filterLabels(s) {
  const out = [];
  if (has(s.type, 'tags')) { s.tags.forEach((id) => out.push('#' + tagDict.name(id))); s.excludeTags.forEach((id) => out.push('−#' + tagDict.name(id))); }
  if (has(s.type, 'author')) s.authors.forEach((a) => out.push('@' + userName(a)));
  for (const f of ['date', 'dur', 'rating']) if (has(s.type, f) || f === 'date') { const v = fieldValue(f, s); if (v) out.push(v); }
  return out;
}

/** 实际用的排序：没选时有关键词按相关度、没有按最新（没有关键词时相关度没有意义）。 */
function effSort(s) {
  const kw = s.keyword.trim();
  let v = sortOpts(s.type).includes(s.sort) ? s.sort : '';
  if (!v || (v === 'relevance' && !kw)) v = kw ? 'relevance' : 'date';
  return v;
}

function buildQuery(s) {
  const parts = [];
  // 关键词里认不出的花括号原样保留，但要排在文字后面，精确匹配也只给文字加引号
  const raw = s.keyword.trim();
  const braces = raw.match(/\{[^{}]*\}/g) || [];
  const text = raw.replace(/\{[^{}]*\}/g, ' ').replace(/\s+/g, ' ').trim();
  if (text) parts.push(s.exact ? `"${text.replace(/"/g, '')}"` : text);
  parts.push(...braces);
  if (has(s.type, 'tags')) {
    if (s.tags.length > 1 && s.tagMode === 'any') parts.push(`{tags:[${s.tags.join(',')}]}`);
    else s.tags.forEach((id) => parts.push(`{tags:[${id}]}`)); // 每个标签一对花括号 = 全部都要有
    s.excludeTags.forEach((id) => parts.push(`{tags!=[${id}]}`));
  }
  if (has(s.type, 'author') && s.authors.length) parts.push(s.authors.length === 1 ? `{author:${s.authors[0]}}` : `{author:[${s.authors.join(',')}]}`);
  if (s.from) parts.push(`{date>=${s.from}}`);
  if (s.to) parts.push(`{date<${s.to}}`);
  if (has(s.type, 'dur') && DURS[s.dur]) { const [a, b] = DURS[s.dur]; if (a) parts.push(`{duration>=${a}}`); if (b) parts.push(`{duration<${b}}`); }
  if (has(s.type, 'rating') && s.rating) parts.push(`{rating:${s.rating}}`);
  return parts.join(' ');
}

// buildQuery 的反向：把 query 拆回关键词和各项条件。认不出的花括号原样留在关键词里，不丢。
function parseQuery(q) {
  const out = { keyword: '', exact: false, tags: [], excludeTags: [], tagMode: 'all', authors: [], from: 0, to: 0, dur: '', rating: '' };
  const groups = [], keep = [], durRaw = [];
  let dmin = 0, dmax = 0;
  const list = (x) => x.split(',').map((y) => y.trim()).filter(Boolean);
  const text = String(q || '').replace(/\{([^{}]*)\}/g, (all, body) => {
    const b = body.trim();
    let m;
    if ((m = b.match(/^tags\s*:\s*\[([^\]]*)\]$/)) || (m = b.match(/^tags\s*:\s*([^[\]]+)$/))) { groups.push(list(m[1])); return ' '; }
    if ((m = b.match(/^tags\s*!=\s*\[([^\]]*)\]$/)) || (m = b.match(/^tags\s*!=\s*([^[\]]+)$/))) { out.excludeTags.push(...list(m[1])); return ' '; }
    if ((m = b.match(/^author\s*:\s*\[([^\]]*)\]$/)) || (m = b.match(/^author\s*:\s*([^[\]]+)$/))) { out.authors.push(...list(m[1]).map((x) => x.replace(/^@/, ''))); return ' '; }
    if ((m = b.match(/^date\s*>=\s*(\d+)$/))) { out.from = +m[1]; return ' '; }
    if ((m = b.match(/^date\s*<\s*(\d+)$/))) { out.to = +m[1]; return ' '; }
    if ((m = b.match(/^duration\s*>=\s*(\d+)$/))) { dmin = +m[1]; durRaw.push(all); return ' '; }
    if ((m = b.match(/^duration\s*<\s*(\d+)$/))) { dmax = +m[1]; durRaw.push(all); return ' '; }
    if ((m = b.match(/^rating\s*:\s*(general|ecchi)$/))) { out.rating = m[1]; return ' '; }
    keep.push(all);
    return ' ';
  });
  // 一对花括号里有多个标签 = 有一个就行；其余（每个标签一对花括号）= 全部都要有
  if (groups.length === 1 && groups[0].length > 1) { out.tagMode = 'any'; out.tags = groups[0]; } else out.tags = [...new Set(groups.flat())];
  out.excludeTags = [...new Set(out.excludeTags)];
  out.authors = out.authors.filter((a, i) => out.authors.findIndex((b) => b.toLowerCase() === a.toLowerCase()) === i);
  if (durRaw.length) { const k = Object.keys(DURS).find((x) => DURS[x][0] === dmin && DURS[x][1] === dmax); if (k) out.dur = k; else keep.push(...durRaw); }
  let tx = text.replace(/\s+/g, ' ').trim();
  const qm = tx.match(/^"([^"]+)"$/);
  if (qm) { out.exact = true; tx = qm[1].trim(); }
  out.keyword = [tx, ...keep].filter(Boolean).join(' ');
  return out;
}

/** 输入框里的文字并进状态：手打的花括号条件（{author:x} 之类）也认，并进对应的筛选。 */
function absorb(s, text) {
  const p = parseQuery(text);
  s.keyword = p.keyword;
  if (p.exact) s.exact = true;
  for (const id of p.tags) if (!s.tags.includes(id)) s.tags.push(id);
  if (p.tagMode === 'any') s.tagMode = 'any';
  for (const id of p.excludeTags) if (!s.excludeTags.includes(id)) s.excludeTags.push(id);
  for (const a of p.authors) if (!s.authors.some((x) => x.toLowerCase() === a.toLowerCase())) s.authors.push(a);
  if (p.from) s.from = p.from;
  if (p.to) s.to = p.to;
  if (p.dur) s.dur = p.dur;
  if (p.rating) s.rating = p.rating;
}

const urlSig = (sp) => [sp.get('type') || 'videos', sp.get('query') || '', sp.get('sort') || ''].join('\n');
function stateFromUrl(sp) {
  const ty = sp.get('type');
  return { ...blank(TYPES.includes(ty) ? ty : 'videos'), ...parseQuery(sp.get('query') || ''), sort: sp.get('sort') || '' };
}
function paramsOf(s) {
  const sp = new URLSearchParams();
  sp.set('type', s.type);
  sp.set('query', buildQuery(s));
  sp.set('sort', effSort(s));
  return sp;
}
const isEmpty = (s) => !s.keyword.trim() && !activeFilters(s).length;

/** 跳到这次搜索（站内跳转，不刷新）。和当前地址一样就不再压一条历史。 */
function go(s, o = {}) {
  const sp = paramsOf(s);
  if (o.record) remember(s);
  if (!(location.pathname === '/search' && new URLSearchParams(location.search).toString() === sp.toString())) {
    history.pushState(null, '', '/search?' + sp.toString());
    dispatchEvent(new PopStateEvent('popstate'));
  }
  if (o.scroll) scrollTo({ top: 0 });
}

// ── 最近搜索（只存在本机）────────────────────────────────────────────
const RECENT_KEY = 'searchRecent', RECENT_MAX = 12;
const recentList = () => (store.get(RECENT_KEY, []) || []).filter((r) => r && TYPES.includes(r.type) && typeof r.q === 'string' && r.q.trim());
function remember(s) {
  const q = buildQuery(s);
  if (!q.trim()) return;
  const list = recentList().filter((r) => !(r.type === s.type && r.q === q));
  list.unshift({ type: s.type, q, sort: s.sort || '' });
  store.set(RECENT_KEY, list.slice(0, RECENT_MAX));
}
const forget = (r) => store.set(RECENT_KEY, recentList().filter((x) => !(x.type === r.type && x.q === r.q)));
const fromRecent = (r) => ({ ...blank(r.type), ...parseQuery(r.q), sort: r.sort || '' });

// ── 浮层：同一时刻只开一个（联想、类型菜单、筛选面板、chip 弹层）──────────────
// o: { width: 数字 | 'anchor', align: 'start' | 'end', rect()（定位用的矩形，默认锚点）, sheet（手机上改成底部抽屉）,
//      keep: [不算「外面」的元素], returnFocus, onClose, cls, role, label }
const pop = (() => {
  let cur = null, raf = 0;
  const narrow = () => matchMedia('(max-width: 600px)').matches;
  function place() {
    raf = 0;
    if (!cur || cur.sheet) return;
    if (!cur.anchor.isConnected) { close(true); return; }
    const { el, o } = cur;
    const a = o.rect ? o.rect() : cur.anchor.getBoundingClientRect();
    if (o.width === 'anchor') el.style.width = a.width + 'px';
    else if (o.width) el.style.width = Math.min(o.width, innerWidth - 16) + 'px';
    // 清掉 max-height 量自然高度时，里面可滚的区域会瞬间撑开、scrollTop 被夹回 0：先记下，量完还原
    const keep = [...el.querySelectorAll('*')].filter((n) => n.scrollTop > 0).map((n) => [n, n.scrollTop]);
    el.style.maxHeight = '';
    const w = el.offsetWidth, natural = el.offsetHeight;
    const below = innerHeight - a.bottom - 14, above = a.top - 14;
    const up = natural > below && above > below + 40;
    const room = Math.max(160, up ? above : below);
    el.style.maxHeight = room + 'px';
    const hgt = Math.min(natural, room);
    const left = Math.max(8, Math.min(o.align === 'end' ? a.right - w : a.left, innerWidth - w - 8));
    el.style.left = left + 'px';
    el.style.top = (up ? a.top - 6 - hgt : a.bottom + 6) + 'px';
    el.classList.toggle('up', up);
    for (const [n, y] of keep) n.scrollTop = y;
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(place); };
  // 浮层自己里面的滚动（筛选面板的 .body）不会挪动锚点，不用重新定位
  const onScroll = (e) => { if (cur && e.target instanceof Node && cur.el.contains(e.target)) return; schedule(); };
  // 手机上的底部抽屉：软键盘弹出时（iOS、新版安卓 Chrome 都不缩布局视口）抽屉会被键盘盖住，输入框看不见。
  // 按可视视口把抽屉底边抬到键盘上沿，最大高度也按可视视口算。
  function fitKeyboard(c) {
    const vv = window.visualViewport;
    if (!vv) return;
    const fit = () => {
      const kb = Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop));
      c.el.style.bottom = kb + 'px';
      c.el.style.setProperty('max-height', Math.round(Math.min(innerHeight * 0.86, vv.height - 12)) + 'px', 'important');
    };
    vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit);
    c.unfit = () => { vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit); };
    fit();
  }
  function open(anchor, content, o = {}) {
    close(true);
    const sheet = !!o.sheet && narrow();
    const el = h('div.iwe-pop' + (sheet ? '.sheet' : ''), { role: o.role || 'dialog', 'aria-label': o.label || null });
    if (o.cls) el.classList.add(...o.cls.split(' '));
    if (sheet) el.append(h('div.grab'));
    el.append(content);
    const scrim = sheet ? h('div.iwe-pop-scrim') : null;
    if (scrim) scrim.addEventListener('click', () => close());
    document.body.append(...(scrim ? [scrim, el] : [el]));
    cur = { el, scrim, anchor, o, sheet };
    if (sheet) fitKeyboard(cur);
    place();
    el.getBoundingClientRect(); // 先落定初始样式，再加 show，进场过渡才会播
    el.classList.add('show');
    if (scrim) scrim.classList.add('show');
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey);
    addEventListener('scroll', onScroll, true);
    addEventListener('resize', schedule);
    return cur;
  }
  function close(instant) {
    const c = cur;
    if (!c) return;
    cur = null;
    if (c.unfit) c.unfit();
    document.removeEventListener('pointerdown', onDown, true);
    document.removeEventListener('keydown', onKey);
    removeEventListener('scroll', onScroll, true);
    removeEventListener('resize', schedule);
    c.el.classList.remove('show');
    if (c.scrim) c.scrim.classList.remove('show');
    const kill = () => { c.el.remove(); if (c.scrim) c.scrim.remove(); };
    if (instant || reducedMotion()) kill(); else setTimeout(kill, 240);
    try { if (c.o.onClose) c.o.onClose(); } catch (e) { console.error('[iwe] search', e); }
  }
  function onDown(e) {
    const c = cur;
    if (!c) return;
    const tg = e.target;
    if (c.el.contains(tg) || c.anchor.contains(tg) || (c.o.keep || []).some((k) => k && k.contains(tg))) return;
    close();
  }
  // 冒泡阶段：输入框自己先处理 Esc（收起联想列表之类），处理了就 preventDefault，这里不再关浮层
  function onKey(e) {
    if (e.key !== 'Escape' || !cur || e.defaultPrevented) return;
    e.preventDefault();
    const back = cur.o.returnFocus;
    close();
    if (back && back.isConnected) back.focus({ preventScroll: true });
  }
  return { open, close, reposition: schedule, get cur() { return cur; }, isOn: (anchor) => !!cur && cur.anchor === anchor };
})();

const hoverDevice = () => matchMedia('(hover: hover)').matches;
function nudge(el) { el.classList.remove('iwe-sx-nudge'); void el.offsetWidth; el.classList.add('iwe-sx-nudge'); }

// ── 小积木 ───────────────────────────────────────────────────────────
/** 单选药丸：options = [[value, label, icon?]]；o.disabled(v) 置灰。 */
function pills(options, get, set, o = {}) {
  const btns = options.map(([v, label, ic]) => h('button.iwe-sx-pill', { type: 'button', role: 'radio', onclick: () => { if (!btns[options.findIndex((x) => x[0] === v)].disabled) { set(v); sync(); } } },
    ic ? icon(ic, 14) : null, h('span', label)));
  const el = h('div.iwe-sx-pills', { role: 'radiogroup' }, btns);
  function sync() {
    const cur = get();
    btns.forEach((b, i) => {
      const on = options[i][0] === cur;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', String(on));
      b.disabled = !!(o.disabled && o.disabled(options[i][0]));
    });
  }
  sync();
  el.__sync = sync;
  return el;
}

const avatarOf = (u) => (u && u.avatar && u.avatar.id ? `//i.iwara.tv/image/avatar/${u.avatar.id}/${String(u.avatar.name || u.avatar.id).replace(/\.[^.]+$/, '')}.jpg` : '/images/default-avatar.jpg');

/**
 * 「带联想的多选框」：已选的条目和输入框在同一个框里；候选列表在框下面（文档流里，不会被面板的滚动裁掉）。
 * cfg: { ph, label, items() → [{ key, text, cls, img, title }], remove(key), removeLast(), query(q, done) 拉候选,
 *        row(hit) → { main, sub, img }, pick(hit, shift), enterText(q) 没候选时回车, enterEmpty(), exclude? }
 */
function multiBox(cfg) {
  const input = h('input', { type: 'text', placeholder: cfg.ph, autocomplete: 'off', spellcheck: false, autocapitalize: 'off', enterkeyhint: 'done', 'aria-label': cfg.label });
  const box = h('div.iwe-sx-box', input);
  box.addEventListener('mousedown', (e) => { if (e.target === box) { e.preventDefault(); input.focus(); } });
  const lst = h('div.lst', { role: 'listbox' });
  const res = h('div.iwe-sx-res', h('div', lst));
  const chips = new Map();
  let hits = [], hi = 0, timer = 0, seq = 0;

  function renderChips() {
    const want = cfg.items();
    const keys = new Set(want.map((x) => x.key));
    for (const [k, el] of chips) {
      if (keys.has(k)) continue;
      chips.delete(k);
      el.classList.add('out');
      setTimeout(() => el.remove(), reducedMotion() ? 0 : 160);
    }
    for (const it of want) {
      if (chips.has(it.key)) continue;
      const chip = h('span.iwe-sx-chip' + (it.cls ? '.' + it.cls : ''), { title: it.title || it.text },
        it.img ? h('img', { src: it.img, alt: '', loading: 'lazy' }) : null,
        h('span', it.text),
        h('button', { type: 'button', 'aria-label': t('search.clearOne') + ' ' + it.text, onclick: (e) => { e.stopPropagation(); cfg.remove(it.key); renderChips(); input.focus(); } }, icon('x', 12)));
      chips.set(it.key, chip);
      box.insertBefore(chip, input);
    }
  }
  const hide = () => { res.classList.remove('show'); hits = []; };
  function setHi(i) {
    hi = i;
    [...lst.querySelectorAll('.it')].forEach((el, n) => { el.classList.toggle('hi', n === i); if (n === i) el.scrollIntoView({ block: 'nearest' }); });
  }
  function draw(list, emptyText) {
    hits = list;
    lst.replaceChildren();
    if (!list.length) lst.append(h('div.empty', emptyText));
    list.forEach((hit, n) => {
      const r = cfg.row(hit);
      const it = h('div.it', { role: 'option' },
        r.img ? h('img', { src: r.img, alt: '', loading: 'lazy' }) : null,
        h('span.nm', r.main), r.sub ? h('span.id', r.sub) : null,
        cfg.exclude ? h('button.ex', { type: 'button', onmousedown: (e) => e.preventDefault(), onclick: (e) => { e.stopPropagation(); choose(hit, true); } }, t('search.tags.exclude')) : null);
      it.onmousedown = (e) => e.preventDefault(); // 点候选时输入框不失焦
      it.onmousemove = () => { if (hi !== n) setHi(n); };
      it.onclick = () => choose(hit, false);
      lst.append(it);
    });
    res.classList.add('show');
    setHi(list.length ? 0 : -1);
  }
  function choose(hit, shift) { cfg.pick(hit, shift); input.value = ''; hide(); renderChips(); input.focus(); }
  function lookup() {
    const q = input.value.trim();
    if (!q) { hide(); return; }
    const my = ++seq;
    cfg.query(q, (list, emptyText) => { if (my === seq && input.value.trim() === q) draw(list, emptyText); });
  }
  input.oninput = () => { clearTimeout(timer); timer = setTimeout(lookup, cfg.delay || 120); };
  input.onfocus = () => { if (input.value.trim()) lookup(); };
  input.onblur = () => setTimeout(() => { if (document.activeElement !== input) hide(); }, 120);
  input.onkeydown = (e) => {
    if (e.isComposing || e.keyCode === 229) return; // 输入法选词中
    const open = res.classList.contains('show') && hits.length;
    if (e.key === 'ArrowDown' && open) { e.preventDefault(); setHi((hi + 1) % hits.length); }
    else if (e.key === 'ArrowUp' && open) { e.preventDefault(); setHi((hi - 1 + hits.length) % hits.length); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const q = input.value.trim();
      if (open && hits[hi]) choose(hits[hi], e.shiftKey);
      else if (q && cfg.enterText) { if (cfg.enterText(q)) { input.value = ''; hide(); renderChips(); } }
      else if (!q && cfg.enterEmpty) cfg.enterEmpty();
    } else if (e.key === 'Escape' && res.classList.contains('show')) { e.preventDefault(); hide(); }
    else if (e.key === 'Backspace' && !input.value) { if (cfg.removeLast()) renderChips(); }
  };
  renderChips();
  return { el: h('div.iwe-sx-sug', box, res), sync: renderChips, focus: () => input.focus({ preventScroll: true }) };
}

// ── 各项条件的编辑器：S() 取当前状态，changed(字段, { done }) 通知改动（done = 一次选完，chip 弹层可以收起）──
function editorFor(f, S, changed, o = {}) {
  if (f === 'sort') {
    const p = pills(sortOpts(S().type).map((v) => [v, t('search.sort.' + v)]), () => effSort(S()), (v) => { S().sort = v; changed('sort', { done: true }); },
      { disabled: (v) => v === 'relevance' && !S().keyword.trim() });
    const hint = h('div.iwe-sx-hint', t('search.sort.needKw'));
    const sync = () => { p.__sync(); hint.hidden = !!S().keyword.trim(); };
    sync();
    return { el: h('div', p, hint), sync };
  }
  if (f === 'tags') {
    const mode = pills([['all', t('search.tags.all')], ['any', t('search.tags.any')]], () => S().tagMode, (v) => { S().tagMode = v; changed('tags', {}); });
    const modeBox = h('div.iwe-sx-col', h('div', h('div.iwe-sx-cap', t('search.tags.mode')), mode));
    const mb = multiBox({
      ph: t('search.tags.ph'), label: t('search.f.tags'), exclude: true,
      items: () => [...S().tags.map((id) => ({ key: 'in:' + id, text: tagDict.name(id), title: `${tagDict.name(id)} · ${id}` })),
        ...S().excludeTags.map((id) => ({ key: 'ex:' + id, text: tagDict.name(id), cls: 'ex', title: t('search.tags.excluded', { name: tagDict.name(id) }) }))],
      remove: (key) => { const [k, id] = [key.slice(0, 2), key.slice(3)]; const s = S(); if (k === 'ex') s.excludeTags = s.excludeTags.filter((x) => x !== id); else s.tags = s.tags.filter((x) => x !== id); after(); },
      removeLast: () => { const s = S(); if (s.excludeTags.length) s.excludeTags.pop(); else if (s.tags.length) s.tags.pop(); else return false; after(); return true; },
      query: (q, done) => done(tagDict.search(q, 30).filter((id) => !S().tags.includes(id) && !S().excludeTags.includes(id)), tagDict.size ? t('search.tags.none') : t('search.tags.loading')),
      row: (id) => ({ main: tagDict.name(id), sub: id }),
      pick: (id, ex) => { const s = S(); if (s.tags.includes(id) || s.excludeTags.includes(id)) return; (ex ? s.excludeTags : s.tags).push(id); after(); },
      enterEmpty: o.enterEmpty,
    });
    function after() { modeBox.classList.toggle('open', S().tags.length >= 2); changed('tags', {}); }
    const sync = () => { mb.sync(); mode.__sync(); modeBox.classList.toggle('open', S().tags.length >= 2); };
    sync();
    return { el: h('div', mb.el, h('div.iwe-sx-hint', t(hoverDevice() ? 'search.tags.hint' : 'search.tags.hintTouch')), modeBox), sync, focus: mb.focus };
  }
  if (f === 'author') {
    const known = new Map(); // username（小写）→ 接口返回的用户，chip 上显示昵称和头像
    const find = (u) => known.get(u.toLowerCase()) || siteData.user(u);
    const mb = multiBox({
      ph: t('search.author.ph'), label: t('search.f.author'), delay: 220,
      items: () => S().authors.map((u) => { const x = find(u); return { key: u.toLowerCase(), text: x && x.name ? x.name : '@' + u, img: x ? avatarOf(x) : null, title: '@' + u }; }),
      remove: (key) => { S().authors = S().authors.filter((a) => a.toLowerCase() !== key); changed('author', {}); },
      removeLast: () => { if (!S().authors.length) return false; S().authors.pop(); changed('author', {}); return true; },
      query: (q, done) => {
        if (!localStorage.getItem('token')) { done([], t('search.author.login')); return; }
        done([], [h('span.iwe-sx-spin'), t('search.author.searching')]); // 这个接口常要 3–4 秒
        svc.searchUsers(q.replace(/^@/, '')).then((users) => {
          const taken = new Set(S().authors.map((a) => a.toLowerCase()));
          const ql = q.replace(/^@/, '').toLowerCase();
          const rank = (u) => (u.username.toLowerCase() === ql ? 0 : u.username.toLowerCase().startsWith(ql) || String(u.name || '').toLowerCase().startsWith(ql) ? 1 : 2);
          const list = users.filter((u) => u && u.username && u.status !== 'banned' && !taken.has(u.username.toLowerCase())).sort((a, b) => rank(a) - rank(b)).slice(0, 8);
          done(list, t('search.author.none', { q: q.replace(/^@/, '') }));
        });
      },
      row: (u) => ({ main: u.name || u.username, sub: '@' + u.username, img: avatarOf(u) }),
      pick: (u) => { known.set(u.username.toLowerCase(), u); add(u.username); },
      enterText: (q) => { const name = q.replace(/^@/, '').trim(); if (!/^[\w.-]+$/.test(name)) return false; add(name); return true; },
      enterEmpty: o.enterEmpty,
    });
    function add(name) { const s = S(); if (s.authors.some((a) => a.toLowerCase() === name.toLowerCase())) return; s.authors.push(name); changed('author', {}); }
    return { el: h('div', mb.el, h('div.iwe-sx-hint', t('search.author.hint'))), sync: mb.sync, focus: mb.focus };
  }
  if (f === 'date') {
    let mode = datePreset(S());
    const today = ymd(nowSec());
    const from = h('input', { type: 'date', max: today, 'aria-label': t('search.date.from') });
    const to = h('input', { type: 'date', max: today, 'aria-label': t('search.date.to') });
    const col = h('div.iwe-sx-col', h('div', h('div.iwe-sx-dates', from, h('span.dash', '–'), to)));
    const seg = pills([['', t('search.any')], ...DATE_PRESETS.map(([k]) => [k, t('search.date.' + k)]), ['custom', t('search.date.custom')]], () => mode, (v) => {
      mode = v;
      const s = S();
      if (!v) { s.from = s.to = 0; }
      else if (v !== 'custom') { s.from = presetFrom(DATE_PRESETS.find((x) => x[0] === v)[1]); s.to = 0; }
      fill();
      changed('date', { done: v !== 'custom' });
      if (v === 'custom' && hoverDevice()) setTimeout(() => from.focus({ preventScroll: true }), 60);
    });
    function fill() {
      const s = S();
      from.value = s.from ? ymd(s.from) : '';
      to.value = s.to ? ymd(s.to - DAY) : '';
      from.max = to.value || today;
      to.min = from.value || '';
      col.classList.toggle('open', mode === 'custom');
    }
    from.onchange = () => { const s = S(); s.from = from.value ? localMidnight(from.value) : 0; fill(); changed('date', {}); };
    to.onchange = () => { const s = S(); s.to = to.value ? localMidnight(to.value) + DAY : 0; fill(); changed('date', {}); }; // 结束日含当天：接口是「早于」，取次日零点
    const sync = () => { const p = datePreset(S()); if (!(mode === 'custom' && !p)) mode = p; seg.__sync(); fill(); };
    sync();
    return { el: h('div', seg, col), sync };
  }
  if (f === 'dur' || f === 'rating') {
    const opts = f === 'dur' ? Object.keys(DURS).map((k) => [k, t('search.dur.' + k)]) : [['general', t('search.rating.general')], ['ecchi', t('search.rating.ecchi')]];
    const p = pills([['', t('search.any')], ...opts], () => S()[f], (v) => { S()[f] = v; changed(f, { done: true }); });
    return { el: p, sync: p.__sync };
  }
  if (f === 'exact') {
    const sub = h('small');
    const sw = h('button.iwe-sx-switch', { type: 'button', role: 'switch', onclick: () => { S().exact = !S().exact; sync(); changed('exact', {}); } },
      h('span.tg'), h('span.tx', h('b', t('search.f.exact')), sub));
    function sync() {
      sw.setAttribute('aria-checked', String(!!S().exact));
      const kw = S().keyword.replace(/\{[^{}]*\}/g, ' ').replace(/"/g, '').trim();
      sub.textContent = kw ? t('search.exact.hintKw', { q: kw }) : t('search.exact.hint');
    }
    sync();
    return { el: sw, sync };
  }
  return { el: h('div'), sync() {} };
}

/** 顶栏的筛选面板：所有条件一屏列完，改完点搜索才生效（顶栏是「先写好再搜」）。 */
function filterPanel(S, ctl) {
  const s0 = S();
  const eds = [];
  const sections = fieldsOf(s0.type).map((f) => {
    const ed = editorFor(f, S, () => { ctl.onChange(); paintReset(); }, { enterEmpty: ctl.apply });
    eds.push(ed);
    return h('section.iwe-sx-sec', f === 'exact' ? null : h('div.lb', icon(FDEF[f].ic, 14), h('span', t(FDEF[f].label))), ed.el);
  });
  const reset = h('button.iwe-sx-btn', { type: 'button', onclick: () => { resetFilters(S()); eds.forEach((e) => e.sync()); ctl.onChange(); paintReset(); } }, t('search.reset'));
  const apply = h('button.iwe-sx-btn.primary', { type: 'button', onclick: ctl.apply }, icon('search', 15), h('span', t('search.go')));
  const body = h('div.body', sections);
  // 日期框里回车也直接搜（标签、作者框的回车各自处理）
  body.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.isComposing && e.target.type === 'date') { e.preventDefault(); ctl.apply(); } });
  const el = h('div.iwe-fp',
    h('header', h('h3', t('search.filters.title')), h('span.scope', icon(TYPE_ICON[s0.type], 13), h('span', t('search.filters.in', { type: typeName(s0.type) }))),
      h('button.x', { type: 'button', 'aria-label': t('search.close'), title: t('search.close'), onclick: () => pop.close() }, icon('x', 16))),
    body,
    h('footer', reset, apply));
  function paintReset() { reset.disabled = !activeFilters(S()).length && !S().sort && !S().exact; }
  paintReset();
  return { el, focusFirst: () => { if (!hoverDevice()) return; const i = body.querySelector('input'); if (i) i.focus({ preventScroll: true }); } };
}

/** 板块菜单（顶栏）。 */
function openTypeMenu(btn, cur, pick) {
  const items = TYPES.map((tp) => h('button.it', { type: 'button', role: 'option', 'aria-selected': String(tp === cur), onclick: () => { pop.close(true); pick(tp); } },
    icon(TYPE_ICON[tp], 16), h('span.lb', typeName(tp)), h('span.ck', icon('check', 14))));
  const menu = h('div.iwe-menu', { role: 'listbox', 'aria-label': t('search.type') }, items);
  menu.addEventListener('keydown', (e) => {
    const i = items.indexOf(document.activeElement);
    const to = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : null;
    if (to == null) return;
    e.preventDefault();
    items[(to + items.length) % items.length].focus();
  });
  btn.setAttribute('aria-expanded', 'true');
  pop.open(btn, menu, { width: 200, role: 'presentation', returnFocus: btn, onClose: () => btn.setAttribute('aria-expanded', 'false') });
  (items[TYPES.indexOf(cur)] || items[0]).focus({ preventScroll: true });
}

/**
 * 输入框通用行为（顶栏和搜索页共用）：清空钮、联想下拉（最近搜索 + 标签直达）、键盘上下选、回车搜。
 * f: { root, input, clear, state(), submit(), pickTag(id), pickRecent(r) }
 */
function wireField(f) {
  const sg = { open: false, box: null, rows: [], hi: -1 };
  const paintClear = () => f.root.classList.toggle('has-text', !!f.input.value);
  f.clear.addEventListener('mousedown', (e) => e.preventDefault());
  // 清空也发一次 input 事件：听输入框的地方（清空钮、联想、搜索页「精确匹配」变灰）都按「被清空了」处理
  f.clear.addEventListener('click', () => { f.input.value = ''; f.input.dispatchEvent(new Event('input', { bubbles: true })); f.input.focus(); });

  function setHi(i) {
    sg.hi = i;
    sg.rows.forEach((r, n) => { r.el.classList.toggle('hi', n === i); if (n === i) r.el.scrollIntoView({ block: 'nearest' }); });
  }
  function row(ic, main, sub, tail, act, extra) {
    const el = h('div.iwe-sg-row', { role: 'option' }, icon(ic, 15), h('span.main', main), sub ? h('span.sub', sub) : null, tail || null, extra || null);
    const r = { el, act };
    el.onmousedown = (e) => e.preventDefault();
    el.onmousemove = () => { const n = sg.rows.indexOf(r); if (sg.hi !== n) setHi(n); };
    el.onclick = () => act();
    return r;
  }
  function recentRow(r, removable) {
    const s = fromRecent(r);
    const labels = filterLabels(s);
    const main = s.keyword ? (s.exact ? `“${s.keyword}”` : s.keyword) : labels.shift() || '';
    const rm = removable ? h('button.rm', { type: 'button', 'aria-label': t('search.recent.remove'), title: t('search.recent.remove'),
      onmousedown: (e) => e.preventDefault(), onclick: (e) => { e.stopPropagation(); forget(r); render(); } }, icon('x', 13)) : null;
    return row(TYPE_ICON[r.type] || 'sHistory', main, [typeName(r.type), ...labels].join(' · '), null, () => f.pickRecent(r), rm);
  }
  function render() {
    if (!sg.open) return;
    const s = f.state();
    const q = f.input.value.trim();
    const nodes = [], rows = [];
    const sec = (text, btn) => nodes.push(h('div.sec', h('span', text), btn || null));
    const add = (r) => { rows.push(r); nodes.push(r.el); };
    if (q) {
      add(row('search', t('search.sg.text', { q }), null, h('kbd', '↵'), () => f.submit()));
      if (has(s.type, 'tags') && tagDict.size) {
        const ids = tagDict.search(q, 8).filter((id) => !s.tags.includes(id) && !s.excludeTags.includes(id)).slice(0, 5);
        if (ids.length) {
          sec(t('search.sg.tags'));
          ids.forEach((id) => add(row('tag', tagDict.name(id), id, h('span.act', t('search.sg.tagAct')), () => f.pickTag(id))));
        }
      }
      const ql = q.toLowerCase();
      const rec = recentList().filter((r) => r.q.toLowerCase().includes(ql) && r.q.trim() !== q).slice(0, 4);
      if (rec.length) { sec(t('search.recent')); rec.forEach((r) => add(recentRow(r, false))); }
    } else {
      const rec = recentList().slice(0, 8);
      if (rec.length) {
        sec(t('search.recent'), h('button', { type: 'button', onmousedown: (e) => e.preventDefault(), onclick: () => { store.set(RECENT_KEY, []); render(); } }, t('search.recent.clear')));
        rec.forEach((r) => add(recentRow(r, true)));
      } else nodes.push(h('div.empty', t('search.recent.empty')));
    }
    sg.box.replaceChildren(...nodes);
    sg.rows = rows;
    setHi(-1);
    pop.reposition();
  }
  function openSg() {
    if (sg.open) { render(); return; }
    // 顶栏的筛选面板开着时，在搜索框里改关键词不弹联想（不然面板会被换掉）
    if (pop.cur && pop.cur.o.noSuggest) return;
    sg.box = h('div.iwe-sg', { role: 'listbox' });
    sg.open = true;
    const c = pop.open(f.root, sg.box, { width: 'anchor', role: 'presentation', cls: 'iwe-pop-sg', onClose: () => { sg.open = false; sg.box = null; sg.rows = []; sg.hi = -1; f.root.classList.remove('sg-open'); } });
    sg.pop = c;
    f.root.classList.add('sg-open');
    render();
  }
  const closeSg = () => { if (sg.open && pop.cur === sg.pop) pop.close(); };

  f.input.addEventListener('focus', openSg);
  f.input.addEventListener('input', () => { paintClear(); if (sg.open) render(); else openSg(); });
  f.input.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== f.input) closeSg(); }, 0));
  f.input.addEventListener('keydown', (e) => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!sg.open) openSg(); else if (sg.rows.length) setHi(Math.min(sg.rows.length - 1, sg.hi + 1)); }
    else if (e.key === 'ArrowUp') { if (sg.open) { e.preventDefault(); setHi(Math.max(-1, sg.hi - 1)); } }
    else if (e.key === 'Enter') { e.preventDefault(); if (sg.open && sg.rows[sg.hi]) sg.rows[sg.hi].act(); else f.submit(); }
    else if (e.key === 'Escape') { if (sg.open) { e.preventDefault(); closeSg(); } else if (!f.input.value) f.input.blur(); }
    else if (e.key === 'Tab') closeSg();
  });
  return { paintClear, closeSg };
}

// ── 顶栏搜索框 ───────────────────────────────────────────────────────
function mountHeader(form, ctx) {
  const input = form.querySelector('input[name=query]');
  const submitBtn = form.querySelector('button[type=submit]');
  if (!input || !submitBtn) return;
  form.classList.add('iwe-hs');
  let S = blank(typeFromPath(ctx.path));
  let sig = null, typePicked = false;

  const typeIc = h('span.ti'), typeLb = h('span.tl');
  const typeBtn = h('button.iwe-hs-type', { type: 'button', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', title: t('search.type') }, typeIc, typeLb, icon('chevronDown', 12));
  const clear = h('button.iwe-sx-clear', { type: 'button', tabindex: -1, 'aria-label': t('search.clear'), title: t('search.clear') }, icon('x', 14));
  const badge = h('span.iwe-sx-badge');
  const filterBtn = h('button.iwe-hs-filter', { type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-label': t('search.filters'), title: t('search.filters') }, icon('sSliders', 17), badge);
  input.before(typeBtn);
  input.after(clear);
  submitBtn.before(filterBtn);
  submitBtn.setAttribute('aria-label', t('search.go'));
  submitBtn.title = t('search.go');
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('spellcheck', 'false');
  input.setAttribute('enterkeyhint', 'search');

  function paintType() { typeIc.replaceChildren(icon(TYPE_ICON[S.type], 15)); typeLb.textContent = typeName(S.type); input.placeholder = t('search.ph', { type: typeName(S.type) }); }
  function paintBadge() { const n = activeFilters(S).length; badge.textContent = n || ''; badge.classList.toggle('on', n > 0); filterBtn.classList.toggle('on', n > 0); }
  const setInput = (v) => { input.value = v; field.paintClear(); };

  function submit() {
    absorb(S, input.value);
    setInput(S.keyword);
    paintBadge();
    if (isEmpty(S)) { input.focus(); nudge(form); return; }
    pop.close(true);
    go(S, { record: true, scroll: true });
    input.blur();
  }
  form.__iweSubmit = submit;
  const field = wireField({
    root: form, input, clear, state: () => S, submit,
    pickTag: (id) => { S.keyword = ''; if (!S.tags.includes(id)) S.tags.push(id); setInput(''); paintBadge(); pop.close(true); go(S, { record: true, scroll: true }); input.blur(); },
    pickRecent: (r) => { S = fromRecent(r); setInput(S.keyword); paintType(); paintBadge(); pop.close(true); go(S, { record: true, scroll: true }); input.blur(); },
  });

  typeBtn.onclick = () => {
    if (pop.isOn(typeBtn)) { pop.close(); return; }
    openTypeMenu(typeBtn, S.type, (tp) => { S.type = tp; typePicked = true; paintType(); paintBadge(); input.focus(); });
  };
  filterBtn.onclick = () => {
    if (pop.isOn(filterBtn)) { pop.close(); return; }
    absorb(S, input.value);
    setInput(S.keyword);
    const panel = filterPanel(() => S, { onChange: paintBadge, apply: submit });
    filterBtn.setAttribute('aria-expanded', 'true');
    form.classList.add('open');
    pop.open(filterBtn, panel.el, {
      width: 420, align: 'end', rect: () => form.getBoundingClientRect(), sheet: true, noSuggest: true, label: t('search.filters.title'), returnFocus: filterBtn, keep: [form],
      onClose: () => { filterBtn.setAttribute('aria-expanded', 'false'); form.classList.remove('open'); },
    });
    panel.focusFirst();
  };

  // 搜索页上跟地址栏同步（关键词、板块、条件都按地址还原）；只在地址变了的时候同步，不打断正在输入。
  // 别的页面上：没输入过、没设条件、没手动选过板块时，板块跟着当前栏目走（看图片时默认搜图片）。
  form.__iweSync = (c) => {
    if (c.path !== '/search') {
      sig = null;
      if (c.routeChanged && !typePicked && !input.value && isEmpty(S) && S.type !== typeFromPath(c.path)) { S.type = typeFromPath(c.path); paintType(); paintBadge(); }
      return;
    }
    const ns = urlSig(c.search);
    if (ns === sig) return;
    sig = ns;
    S = stateFromUrl(c.search);
    typePicked = false;
    setInput(S.keyword);
    paintType();
    paintBadge();
    if (pop.isOn(filterBtn)) pop.close(true);
  };
  paintType();
  paintBadge();
  form.__iweSync(ctx);
}

// ── 搜索页：搜索栏 + 类型标签 + 筛选条（取代站点自己的那一块表单）──────────────────
// 筛选条上改什么都立刻生效（站内跳转、不刷新），每个条件一枚 chip：没设时显示条件名，设了显示值、带 × 一键清掉。
let hero = null;
let lastHeard = null; // 最近一次 /search 响应：{ type, query, count }，结果数从这里来
siteData.onApi((url, json) => {
  if (!json || typeof json.count !== 'number') return;
  let u;
  try { u = new URL(url); } catch { return; }
  if (u.pathname !== '/search') return;
  lastHeard = { type: u.searchParams.get('type') || 'videos', query: u.searchParams.get('query') || '', count: json.count };
  if (hero) hero.heard();
});

function buildHero() {
  let S = blank(), sig = null;
  const input = h('input.iwe-sp-input', { type: 'text', autocomplete: 'off', spellcheck: false, enterkeyhint: 'search', 'aria-label': t('search.go') });
  const clear = h('button.iwe-sx-clear', { type: 'button', tabindex: -1, 'aria-label': t('search.clear'), title: t('search.clear') }, icon('x', 15));
  const goBtn = h('button.iwe-sp-go', { type: 'submit' }, icon('search', 16), h('span', t('search.go')));
  const form = h('form.iwe-sp-field', { role: 'search' }, h('span.lead', icon('search', 18)), input, clear, goBtn);
  form.__iweSubmit = submit;

  const tabs = TYPES.map((tp) => h('button.iwe-sp-tab', { type: 'button', role: 'tab', 'aria-selected': 'false', onclick: () => pickType(tp) }, icon(TYPE_ICON[tp], 15), h('span', typeName(tp))));
  const ink = h('span.iwe-sp-ink');
  const tabBar = h('div.iwe-sp-tabs', { role: 'tablist', 'aria-label': t('search.type') }, tabs, ink);

  const chips = {};
  for (const f of CHIP_ORDER) chips[f] = makeChip(f);
  const clearAll = h('button.iwe-sp-clearall', { type: 'button', onclick: () => { const keep = { type: S.type, keyword: S.keyword, sort: S.sort }; resetFilters(S); Object.assign(S, keep); commit(); } },
    icon('x', 13), h('span', t('search.clearAll')));
  const countEl = h('span.iwe-sp-count', { 'aria-live': 'polite' });
  const pagerSlot = h('div.iwe-sp-pager'); // 92-pager.js 把「传统分页 / 瀑布流」开关放进来
  const bar = h('div.iwe-sp-bar', h('div.iwe-sp-chips', CHIP_ORDER.map((f) => chips[f].wrap), clearAll), h('div.iwe-sp-meta', countEl, pagerSlot));
  const root = h('div.iwe-sp', form, tabBar, bar);
  scrollFade(tabBar); scrollFade(bar.firstChild); // 手机上这两排横向滑动：边缘渐隐提示还有内容
  input.addEventListener('input', () => chips.exact.chip.classList.toggle('dim', !input.value.trim()));

  const field = wireField({
    root: form, input, clear, state: () => S, submit,
    pickTag: (id) => { S.keyword = ''; if (!S.tags.includes(id)) S.tags.push(id); input.value = ''; field.paintClear(); pop.close(true); commit({ record: true }); input.blur(); },
    pickRecent: (r) => { S = fromRecent(r); input.value = S.keyword; field.paintClear(); pop.close(true); commit({ record: true }); input.blur(); },
  });

  // 关键词以输入框为准：框里删掉了、改了但没按回车，接着点筛选 / 切板块，搜的也是框里现在的字。
  // （2026-11-25 以前关键词另存一份、只在回车时更新：清空输入框后改筛选，地址和顶栏里还是旧关键词）
  function readInput() {
    absorb(S, input.value);
    if (input.value !== S.keyword) input.value = S.keyword;
    field.paintClear();
  }
  function submit() {
    readInput();
    if (isEmpty(S)) { input.focus(); nudge(form); return; }
    pop.close(true);
    commit({ record: true });
    input.blur();
  }
  /** 按当前状态跳转并重画（自己发起的跳转先记下地址签名，scan 回来时就不会再按地址重建一遍）。 */
  function commit(o = {}) {
    readInput();
    paintAll();
    const sp = paramsOf(S);
    const ns = urlSig(sp);
    if (ns !== sig) { sig = ns; paintCount(null); }
    go(S, o);
    paintEmpty();
  }
  // query 为空时站点不发请求、列表停在上一次的结果上：这时把结果区藏起来（CSS 看 data-empty）
  const paintEmpty = () => root.toggleAttribute('data-empty', !new URLSearchParams(location.search).get('query'));
  function pickType(tp) {
    if (tp === S.type) return;
    S.type = tp;
    commit();
  }

  function makeChip(f) {
    const val = h('span.v');
    const cv = h('span.cv', icon('chevronDown', 12));
    const main = h('button.main', { type: 'button', 'aria-haspopup': f === 'exact' ? null : 'dialog', 'aria-expanded': f === 'exact' ? null : 'false' }, icon(FDEF[f].ic, 15), val, f === 'exact' ? null : cv);
    const x = h('button.x', { type: 'button', 'aria-label': t('search.clearOne') + ' ' + t(FDEF[f].label), title: t('search.clearOne') }, icon('x', 12));
    const chip = h('div.iwe-sp-chip', { 'data-f': f }, main, x);
    const wrap = h('div.iwe-sp-cw', chip);
    main.onclick = () => {
      if (f !== 'exact') { openChip(f, main); return; }
      readInput();
      if (!S.keyword.trim()) { input.focus(); nudge(form); return; }
      S.exact = !S.exact;
      commit();
    };
    x.onclick = () => { clearField(f); commit(); };
    return { wrap, chip, main, val, x };
  }
  function clearField(f) {
    if (f === 'tags') Object.assign(S, { tags: [], excludeTags: [], tagMode: 'all' });
    else if (f === 'author') S.authors = [];
    else if (f === 'date') S.from = S.to = 0;
    else if (f === 'dur' || f === 'rating') S[f] = '';
    else if (f === 'exact') S.exact = false;
  }
  function openChip(f, anchor) {
    if (pop.isOn(anchor)) { pop.close(); return; }
    const clr = h('button.clr', { type: 'button' }, t('search.clearOne'));
    const ed = editorFor(f, () => S, (ff, o = {}) => { commit(); paintClr(); if (o.done) pop.close(); }, { enterEmpty: () => pop.close() });
    clr.onclick = () => { clearField(f); commit(); ed.sync(); paintClr(); };
    function paintClr() { clr.classList.toggle('show', f !== 'sort' && fieldValue(f, S) != null); }
    paintClr();
    const body = h('div.iwe-cp',
      h('div.head', icon(FDEF[f].ic, 15), h('span', t(FDEF[f].label)), clr),
      h('div.bd', ed.el),
      h('button.iwe-sx-btn.primary.done', { type: 'button', onclick: () => pop.close() }, t('search.done')));
    anchor.setAttribute('aria-expanded', 'true');
    pop.open(anchor, body, { width: f === 'tags' || f === 'author' ? 360 : f === 'date' ? 340 : null, sheet: true, label: t(FDEF[f].label), returnFocus: anchor, cls: 'iwe-pop-cp',
      onClose: () => anchor.setAttribute('aria-expanded', 'false') });
    if (ed.focus && hoverDevice()) ed.focus();
  }

  function paintTabs() {
    tabs.forEach((b, i) => b.setAttribute('aria-selected', String(TYPES[i] === S.type)));
    input.placeholder = t('search.ph', { type: typeName(S.type) });
    paintInk();
  }
  function paintInk() {
    const b = tabs[TYPES.indexOf(S.type)];
    if (!b || !b.offsetWidth) return;
    ink.style.width = b.offsetWidth + 'px';
    ink.style.transform = `translateX(${b.offsetLeft}px)`;
    if (!ink.classList.contains('ready')) requestAnimationFrame(() => ink.classList.add('ready')); // 第一次直接落位，之后切换才滑过去
  }
  if (typeof ResizeObserver === 'function') new ResizeObserver(paintInk).observe(tabBar);
  function paintChips() {
    for (const f of CHIP_ORDER) {
      const c = chips[f];
      const ok = has(S.type, f);
      c.wrap.classList.toggle('gone', !ok);
      c.wrap.inert = !ok;
      const v = f === 'sort' ? t('search.sort.' + effSort(S)) : fieldValue(f, S);
      c.chip.classList.toggle('on', f !== 'sort' && v != null);
      c.val.textContent = v != null ? v : t(FDEF[f].label);
      if (f === 'exact') {
        c.main.setAttribute('aria-pressed', String(!!S.exact));
        c.chip.classList.toggle('dim', !S.keyword.trim());
        c.main.title = S.keyword.trim() ? t('search.exact.hint') : t('search.exact.needKw');
      } else c.main.title = t(FDEF[f].label);
    }
    clearAll.classList.toggle('show', activeFilters(S).length > 0);
    clearAll.inert = !activeFilters(S).length;
  }
  function paintAll() { paintTabs(); paintChips(); }
  function paintCount(n) {
    if (n == null) { countEl.classList.add('wait'); return; }
    countEl.classList.remove('wait');
    countEl.textContent = n ? t('search.results', { n: n.toLocaleString(uiLocale()) }) : t('search.results.none');
  }
  function heard() {
    const sp = new URLSearchParams(location.search);
    if (lastHeard && lastHeard.type === (sp.get('type') || 'videos') && lastHeard.query === (sp.get('query') || '')) paintCount(lastHeard.count);
  }

  function sync(c) {
    const ns = urlSig(c.search);
    if (ns === sig) return;
    sig = ns;
    S = stateFromUrl(c.search);
    input.value = S.keyword;
    field.paintClear();
    if (pop.cur && root.contains(pop.cur.anchor)) pop.close(true);
    paintAll();
    paintEmpty();
    countEl.textContent = '';
    paintCount(null);
    heard();
    // 从侧栏「查找」进来、还什么都没搜：直接把光标放进搜索框
    if (isEmpty(S) && hoverDevice() && !document.activeElement?.matches?.('input, textarea, [contenteditable]')) setTimeout(() => input.focus({ preventScroll: true }), 0);
  }
  return { root, sync, heard, paintInk };
}

function mountHero(ctx) {
  const siteForm = document.querySelector('section.content form.searchForm');
  if (!siteForm) return;
  if (!(hero && hero.root.isConnected && hero.root.nextElementSibling === siteForm)) {
    if (hero) hero.root.remove();
    hero = buildHero();
    siteForm.before(hero.root); // 站点表单只藏不删（CSS：.iwe-sp + form.searchForm），站点自己还要管它
  }
  hero.sync(ctx);
  hero.paintInk();
}

// ── 全局：拦提交、/ 快捷键 ───────────────────────────────────────────
document.addEventListener('submit', (e) => {
  const f = e.target;
  if (!f || typeof f.__iweSubmit !== 'function' || site.isOff('search')) return;
  e.preventDefault();
  e.stopImmediatePropagation(); // 不让站点顶栏表单自己的 onSubmit 再跳一次
  f.__iweSubmit();
}, true);
document.addEventListener('keydown', (e) => {
  if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented || site.isOff('search')) return;
  const a = document.activeElement;
  if (a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return;
  const target = [document.querySelector('.iwe-sp-input'), document.querySelector('.header__search.iwe-hs input[name=query]')].find((el) => el && el.offsetParent);
  if (!target) return;
  e.preventDefault();
  target.focus();
  target.select();
});

const CSS = `
/* ── 顶栏搜索框 ── */
.header__search.iwe-hs{height:40px;align-items:stretch;border-radius:10px;background:var(--body);box-shadow:inset 0 0 0 1px rgba(128,128,128,.2);transition:box-shadow .18s,opacity .2s,transform .26s cubic-bezier(.22,1,.36,1),visibility 0s}
/* 搜索页上收起（页面里有自己的搜索栏）：淡出后再 visibility:hidden，占位留着，顶栏两侧不跳 */
.header__search.iwe-hs.iwe-hs-away{opacity:0;transform:translateY(-4px) scale(.98);visibility:hidden;pointer-events:none;transition:box-shadow .18s,opacity .2s,transform .26s cubic-bezier(.22,1,.36,1),visibility 0s .26s}
.header__search.iwe-hs:hover{box-shadow:inset 0 0 0 1px rgba(128,128,128,.36)}
.header__search.iwe-hs:focus-within,.header__search.iwe-hs.open,.header__search.iwe-hs.sg-open{box-shadow:inset 0 0 0 1.5px var(--primary),0 0 0 4px var(--primary-faded)}
.header__search.iwe-hs input[name=query]{min-width:0;height:auto;padding:0 4px 0 10px;font:14px Roboto,Arial,sans-serif;color:var(--text)}
.header__search.iwe-hs input[name=query]::placeholder{color:var(--muted)}
.header__search.iwe-hs button{appearance:none;margin:0;border:0;font:inherit;cursor:pointer}
.header__search.iwe-hs .iwe-hs-type{position:relative;display:inline-flex;align-items:center;gap:6px;flex:none;padding:0 10px 0 12px;background:transparent;color:var(--text);font:13px Roboto,Arial,sans-serif;white-space:nowrap;transition:background .15s}
.header__search.iwe-hs .iwe-hs-type::after{content:'';position:absolute;right:0;top:10px;bottom:10px;width:1px;background:rgba(128,128,128,.32)}
.header__search.iwe-hs .iwe-hs-type:hover,.header__search.iwe-hs .iwe-hs-type[aria-expanded=true]{background:rgba(128,128,128,.12)}
.iwe-hs-type .ti{display:grid;opacity:.7}
.iwe-hs-type>.ic{opacity:.55;transition:transform .2s}
.iwe-hs-type[aria-expanded=true]>.ic{transform:rotate(180deg)}
.header__search.iwe-hs .iwe-hs-filter{position:relative;flex:none;align-self:center;display:grid;place-items:center;width:32px;height:32px;padding:0;border-radius:7px;background:transparent;color:var(--text);opacity:.7;transition:background .15s,opacity .15s,color .15s}
.header__search.iwe-hs .iwe-hs-filter:hover,.header__search.iwe-hs .iwe-hs-filter[aria-expanded=true]{background:rgba(128,128,128,.14);opacity:1}
.header__search.iwe-hs .iwe-hs-filter.on{color:var(--primary);opacity:1}
.header__search.iwe-hs button[type=submit]{flex:none;align-self:center;display:grid;place-items:center;width:32px;height:32px;margin:0 4px 0 2px;padding:0;border-radius:7px;background:var(--primary);color:#fff;transition:filter .15s,transform .1s}
.header__search.iwe-hs button[type=submit]:hover{background:var(--primary);filter:brightness(1.08)}
.header__search.iwe-hs button[type=submit]:active{transform:scale(.94)}
.header__search.iwe-hs button[type=submit] .icon{margin:0;color:#fff}
.header__search.iwe-hs button[type=submit] svg{width:14px;height:14px}
.header__search.iwe-hs button:focus-visible{outline:2px solid var(--primary);outline-offset:-2px}
.header__search.iwe-hs .iwe-sx-clear{padding:0;background:transparent}
.header__search.iwe-hs .iwe-sx-clear:hover{background:rgba(128,128,128,.16)}

/* 清空钮、角标、抖一下（顶栏与搜索页共用） */
.iwe-sx-clear{appearance:none;flex:none;align-self:center;display:grid;place-items:center;width:26px;height:26px;margin:0 2px;padding:0;border:0;border-radius:50%;background:transparent;color:var(--muted);cursor:pointer;opacity:0;transform:scale(.6);pointer-events:none;transition:opacity .15s,transform .2s cubic-bezier(.34,1.56,.64,1),background .15s}
.has-text>.iwe-sx-clear{opacity:1;transform:none;pointer-events:auto}
.iwe-sx-clear:hover{background:rgba(128,128,128,.16);color:var(--text)}
.iwe-sx-badge{position:absolute;top:0;right:0;min-width:15px;height:15px;padding:0 4px;border-radius:999px;background:var(--primary);color:#fff;font:600 10px/15px Arial,sans-serif;text-align:center;transform:scale(0);transition:transform .25s cubic-bezier(.34,1.56,.64,1);pointer-events:none}
.iwe-sx-badge.on{transform:scale(1)}
.iwe-sx-nudge{animation:iwe-sx-nudge .32s}
@keyframes iwe-sx-nudge{20%{transform:translateX(-4px)}45%{transform:translateX(4px)}70%{transform:translateX(-2px)}}

/* ── 浮层 ── */
.iwe-pop{position:fixed;top:0;left:0;z-index:10040;box-sizing:border-box;display:flex;flex-direction:column;min-width:180px;max-width:calc(100vw - 16px);background:#fff;color:var(--text);border:1px solid rgba(128,128,128,.22);border-radius:12px;box-shadow:0 14px 36px rgba(0,0,0,.14),0 2px 6px rgba(0,0,0,.06);font:13px/1.45 Roboto,Arial,sans-serif;overflow:hidden;opacity:0;transform:translateY(-6px) scale(.98);transform-origin:top center;transition:opacity .16s,transform .22s cubic-bezier(.22,1,.36,1)}
.iwe-pop.up{transform-origin:bottom center;transform:translateY(6px) scale(.98)}
.iwe-pop.show{opacity:1;transform:none}
body.dark .iwe-pop{background:var(--body-dark);border-color:rgba(255,255,255,.09);box-shadow:0 16px 40px rgba(0,0,0,.55)}
.iwe-pop *{box-sizing:border-box}
.iwe-pop.sheet{top:auto!important;left:0!important;right:0;bottom:0;width:auto!important;max-width:none;max-height:86dvh!important;border-radius:16px 16px 0 0;border-width:1px 0 0;padding-bottom:env(safe-area-inset-bottom);transform:translateY(100%);transition:transform .32s cubic-bezier(.22,1,.36,1),opacity .2s}
.iwe-pop.sheet.show{transform:none}
.iwe-pop .grab{flex:none;width:36px;height:4px;margin:8px auto 2px;border-radius:2px;background:rgba(128,128,128,.4)}
.iwe-pop-scrim{position:fixed;inset:0;z-index:10039;background:rgba(0,0,0,.36);opacity:0;transition:opacity .2s}
.iwe-pop-scrim.show{opacity:1}
/* 输入框的聚焦效果由外面那层框（:focus-within）负责，这里不再给输入框本身加描边，否则是两层框 */
.iwe-pop :focus-visible:not(input):not(textarea){outline:2px solid var(--primary);outline-offset:2px}
.iwe-pop input:focus-visible{outline:0}

/* 板块菜单 */
.iwe-menu{padding:6px;overflow-y:auto}
.iwe-menu .it{display:flex;align-items:center;gap:10px;width:100%;height:34px;padding:0 10px;border:0;border-radius:8px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.iwe-menu .it:hover,.iwe-menu .it:focus{background:rgba(128,128,128,.13);outline:0}
.iwe-menu .it>.ic{flex:none;opacity:.65}
.iwe-menu .it .lb{flex:1}
.iwe-menu .it .ck{display:grid;color:var(--primary);opacity:0}
.iwe-menu .it[aria-selected=true]{font-weight:600}
.iwe-menu .it[aria-selected=true] .ck{opacity:1}

/* 联想下拉 */
.iwe-sg{padding:6px;overflow-y:auto;overscroll-behavior:contain}
.iwe-sg .sec{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px 4px;color:var(--muted);font-size:12px}
.iwe-sg .sec button{appearance:none;padding:2px 6px;border:0;border-radius:5px;background:none;color:var(--muted);font:inherit;cursor:pointer}
.iwe-sg .sec button:hover{background:rgba(128,128,128,.14);color:var(--text)}
.iwe-sg .iwe-sg-row{display:flex;align-items:center;gap:10px;min-height:36px;padding:4px 6px 4px 10px;border-radius:8px;cursor:pointer}
.iwe-sg .iwe-sg-row.hi{background:rgba(128,128,128,.13)}
.iwe-sg .iwe-sg-row>.ic{flex:none;opacity:.55}
.iwe-sg .iwe-sg-row .main{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.iwe-sg .iwe-sg-row .sub{flex:1 1 0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted);font-size:12px}
.iwe-sg .iwe-sg-row kbd,.iwe-sg .iwe-sg-row .act{flex:none;margin-left:auto;padding:1px 6px;border-radius:4px;background:rgba(128,128,128,.14);color:var(--muted);font:11px/16px Roboto,Arial,sans-serif}
.iwe-sg .iwe-sg-row .act{opacity:0;transition:opacity .12s}
.iwe-sg .iwe-sg-row.hi .act{opacity:1}
.iwe-sg .iwe-sg-row .rm{appearance:none;flex:none;display:grid;place-items:center;width:24px;height:24px;margin-left:auto;padding:0;border:0;border-radius:6px;background:none;color:var(--muted);cursor:pointer;opacity:0;transition:opacity .12s,background .12s}
.iwe-sg .iwe-sg-row.hi .rm,.iwe-sg .iwe-sg-row:hover .rm{opacity:1}
.iwe-sg .iwe-sg-row .rm:hover{background:rgba(128,128,128,.18);color:var(--text)}
.iwe-sg .empty{padding:14px 12px;color:var(--muted);font-size:12.5px;line-height:1.6}
@media (hover:none){.iwe-sg .iwe-sg-row .rm{opacity:1}}

/* 顶栏筛选面板 */
.iwe-pop>.iwe-fp,.iwe-pop>.iwe-cp{flex:1 1 auto;min-height:0}
.iwe-fp{display:flex;flex-direction:column}
.iwe-fp header{flex:none;display:flex;align-items:center;gap:10px;padding:14px 12px 8px 16px}
.iwe-fp header h3{margin:0;font-size:15px;font-weight:600;line-height:1.2}
.iwe-fp header .scope{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 8px;border-radius:999px;background:rgba(128,128,128,.14);color:var(--muted);font-size:12px}
.iwe-fp header .x{appearance:none;margin-left:auto;display:grid;place-items:center;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:none;color:var(--muted);cursor:pointer}
.iwe-fp header .x:hover{background:rgba(128,128,128,.14);color:var(--text)}
.iwe-fp .body{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:0 16px 6px}
.iwe-fp footer{flex:none;display:flex;gap:8px;padding:12px 16px;border-top:1px solid rgba(128,128,128,.18)}
.iwe-fp footer .iwe-sx-btn{flex:1}
.iwe-fp footer .iwe-sx-btn.primary{flex:2}
.iwe-sx-sec{padding:12px 0}
.iwe-sx-sec+.iwe-sx-sec{border-top:1px solid rgba(128,128,128,.14)}
.iwe-sx-sec>.lb{display:flex;align-items:center;gap:6px;margin-bottom:8px;font-weight:600}
.iwe-sx-sec>.lb>.ic{opacity:.55}

/* chip 弹层 */
.iwe-cp{display:flex;flex-direction:column;max-width:400px}
.iwe-pop.sheet .iwe-cp{max-width:none}
.iwe-cp .head{flex:none;display:flex;align-items:center;gap:6px;padding:14px 12px 10px 16px;font-weight:600}
.iwe-cp .head>.ic{opacity:.55}
.iwe-cp .clr{appearance:none;margin-left:auto;padding:2px 8px;border:0;border-radius:6px;background:none;color:var(--muted);font:inherit;font-weight:400;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .15s}
.iwe-cp .clr.show{opacity:1;pointer-events:auto}
.iwe-cp .clr:hover{background:rgba(128,128,128,.14);color:var(--text)}
.iwe-cp .bd{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:4px 16px 16px}
.iwe-cp .done{display:none}
.iwe-pop.sheet .iwe-cp .done{display:flex;flex:none;margin:0 16px 16px}

/* 按钮、药丸、开关 */
.iwe-sx-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;padding:0 16px;border:0;border-radius:8px;background:var(--body-darker);color:var(--text);font:inherit;font-weight:500;cursor:pointer;transition:filter .15s,opacity .15s,transform .1s}
.iwe-sx-btn:hover:not(:disabled){filter:brightness(.95)}
body.dark .iwe-sx-btn:hover:not(:disabled){filter:brightness(1.2)}
.iwe-sx-btn:active:not(:disabled){transform:scale(.98)}
.iwe-sx-btn:disabled{opacity:.45;cursor:default}
.iwe-sx-btn.primary{background:var(--primary);color:#fff}
.iwe-sx-pills{display:flex;flex-wrap:wrap;gap:6px}
.iwe-sx-pill{appearance:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:0;border-radius:6px;background:var(--body-darker);color:var(--text);font:inherit;white-space:nowrap;cursor:pointer;transition:background .15s,opacity .15s}
.iwe-sx-pill:hover:not(.on):not(:disabled){background:var(--body)}
body:not(.dark) .iwe-pop .iwe-sx-pill:hover:not(.on):not(:disabled){background:var(--body-dark)}
.iwe-sx-pill.on{background:var(--primary-dark);font-weight:600;cursor:default}
.iwe-sx-pill:disabled{opacity:.4;cursor:not-allowed}
.iwe-sx-hint{margin-top:6px;color:var(--muted);font-size:12px}
.iwe-sx-hint[hidden]{display:none}
.iwe-sx-cap{margin-bottom:6px;color:var(--muted);font-size:12px}
.iwe-sx-switch{appearance:none;display:flex;align-items:flex-start;gap:10px;width:100%;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.iwe-sx-switch .tg{flex:none;position:relative;width:34px;height:20px;margin-top:1px;border-radius:999px;background:var(--body-darker);transition:background .2s}
.iwe-sx-switch .tg::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .22s cubic-bezier(.34,1.4,.64,1)}
.iwe-sx-switch[aria-checked=true] .tg{background:var(--primary)}
.iwe-sx-switch[aria-checked=true] .tg::after{transform:translateX(14px)}
.iwe-sx-switch b{display:block;font-weight:600}
.iwe-sx-switch small{display:block;margin-top:2px;color:var(--muted);font-size:12px}

/* 折叠区（多个标签时的匹配方式、自定义日期） */
.iwe-sx-col{display:grid;grid-template-rows:0fr;opacity:0;margin-top:0;transition:grid-template-rows .26s cubic-bezier(.22,1,.36,1),opacity .2s,margin-top .26s}
.iwe-sx-col.open{grid-template-rows:1fr;opacity:1;margin-top:10px}
.iwe-sx-col>div{min-height:0;overflow:hidden}
.iwe-sx-dates{display:flex;align-items:center;gap:8px;padding:2px}
.iwe-sx-dates input{flex:1;min-width:0;height:34px;padding:0 10px;border:0;border-radius:8px;background:var(--body);box-shadow:inset 0 0 0 1px rgba(128,128,128,.3);color:var(--text);font:inherit;font-variant-numeric:tabular-nums;color-scheme:light}
body.dark .iwe-sx-dates input{color-scheme:dark}
.iwe-sx-dates input:focus{outline:0;box-shadow:inset 0 0 0 1.5px var(--primary)}
.iwe-sx-dates .dash{color:var(--muted)}

/* 带联想的多选框（标签、作者） */
.iwe-sx-box{display:flex;flex-wrap:wrap;align-items:center;gap:6px;min-height:38px;padding:4px 6px;border-radius:8px;background:var(--body);box-shadow:inset 0 0 0 1px rgba(128,128,128,.3);cursor:text;transition:box-shadow .15s}
.iwe-sx-box:focus-within{box-shadow:inset 0 0 0 1.5px var(--primary),0 0 0 3px var(--primary-faded)}
.iwe-sx-box input{flex:1 1 120px;min-width:80px;height:28px;padding:0 6px;border:0;background:transparent;color:var(--text);font:inherit;outline:0}
.iwe-sx-box input::placeholder{color:var(--muted)}
.iwe-sx-chip{display:inline-flex;align-items:center;gap:2px;max-width:100%;height:26px;padding:0 3px 0 10px;border-radius:6px;background:var(--primary-dark);color:var(--text);font-size:12.5px;font-weight:500;animation:iwe-sx-in .22s cubic-bezier(.34,1.56,.64,1)}
.iwe-sx-chip>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.iwe-sx-chip>img{width:18px;height:18px;margin:0 2px 0 -6px;border-radius:50%;object-fit:cover}
.iwe-sx-chip.ex{background:transparent;box-shadow:inset 0 0 0 1px var(--error);color:var(--error)}
.iwe-sx-chip.ex>span{text-decoration:line-through}
.iwe-sx-chip.out{animation:iwe-sx-out .16s ease-in forwards}
.iwe-sx-chip button{appearance:none;display:grid;place-items:center;width:20px;height:20px;padding:0;border:0;border-radius:50%;background:none;color:inherit;opacity:.65;cursor:pointer;transition:opacity .15s,background .15s}
.iwe-sx-chip button:hover{opacity:1;background:rgba(128,128,128,.28)}
@keyframes iwe-sx-in{from{opacity:0;transform:scale(.8)}}
@keyframes iwe-sx-out{to{opacity:0;transform:scale(.8)}}
.iwe-sx-res{display:grid;grid-template-rows:0fr;transition:grid-template-rows .22s cubic-bezier(.22,1,.36,1)}
.iwe-sx-res.show{grid-template-rows:1fr}
.iwe-sx-res>div{min-height:0;overflow:hidden}
.iwe-sx-res .lst{margin-top:6px;max-height:232px;overflow-y:auto;overscroll-behavior:contain;padding:4px;border-radius:8px;background:var(--body);box-shadow:inset 0 0 0 1px rgba(128,128,128,.2)}
.iwe-sx-res .it{display:flex;align-items:center;gap:8px;min-height:34px;padding:4px 6px 4px 10px;border-radius:6px;cursor:pointer}
.iwe-sx-res .it.hi{background:rgba(128,128,128,.15)}
.iwe-sx-res .it>img{flex:none;width:22px;height:22px;border-radius:50%;object-fit:cover}
.iwe-sx-res .it .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
.iwe-sx-res .it .id{flex:none;max-width:42%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted);font:11px ui-monospace,monospace}
.iwe-sx-res .it .ex{appearance:none;flex:none;height:24px;padding:0 8px;border:0;border-radius:6px;background:rgba(128,128,128,.16);color:var(--text);font:inherit;font-size:12px;cursor:pointer;opacity:0;transition:opacity .12s,color .12s}
.iwe-sx-res .it.hi .ex,.iwe-sx-res .it:hover .ex,.iwe-sx-res .it .ex:focus-visible{opacity:1}
.iwe-sx-res .it .ex:hover{color:var(--error)}
.iwe-sx-res .empty{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;color:var(--muted);font-size:12px;text-align:center}
.iwe-sx-spin{flex:none;width:12px;height:12px;border-radius:50%;border:2px solid rgba(128,128,128,.3);border-top-color:var(--primary);animation:iwe-sx-spin .8s linear infinite}
@keyframes iwe-sx-spin{to{transform:rotate(360deg)}}
@media (hover:none){.iwe-sx-res .it .ex{opacity:1}}

/* ── 搜索页 ── */
.iwe-sp+form.searchForm{display:none!important}
.col-12:has(>.iwe-sp){margin-bottom:4px!important}
.col-12:has(>.iwe-sp[data-empty])~*,.container-fluid>.row:has(>.col-12>.iwe-sp[data-empty])~*{display:none!important}
.iwe-sp[data-empty] .iwe-sp-meta{display:none}
.col-12:has(>.iwe-sp)+.col-12>.row.mt-4{margin-top:0!important}
/* 结果卡片与视频 / 图片列表页同款：手机两列、平板三列、桌面四列（站点搜索页默认手机单列） */
.col-12:has(>.iwe-sp)+.col-12>.row>.col-12.col-sm-6.col-md-4.col-lg-3{flex:0 0 50%;max-width:50%;margin-top:16px}
@media (min-width:576px){.col-12:has(>.iwe-sp)+.col-12>.row>.col-12.col-sm-6.col-md-4.col-lg-3{flex-basis:33.3333%;max-width:33.3333%}}
@media (min-width:768px){.col-12:has(>.iwe-sp)+.col-12>.row>.col-12.col-sm-6.col-md-4.col-lg-3{flex-basis:25%;max-width:25%}}
.iwe-sp{color:var(--text);font:14px Roboto,Arial,sans-serif}
.iwe-sp *{box-sizing:border-box}
.iwe-sp-field{display:flex;align-items:center;height:52px;padding:0 6px 0 16px;border-radius:12px;background:var(--body-dark);box-shadow:inset 0 0 0 1px rgba(128,128,128,.16);transition:box-shadow .18s}
.iwe-sp-field:hover{box-shadow:inset 0 0 0 1px rgba(128,128,128,.3)}
.iwe-sp-field:focus-within,.iwe-sp-field.sg-open{box-shadow:inset 0 0 0 1.5px var(--primary),0 0 0 4px var(--primary-faded)}
.iwe-sp-field .lead{flex:none;display:grid;color:var(--muted)}
.iwe-sp-input{flex:1;min-width:0;height:100%;padding:0 10px;border:0;background:transparent;color:var(--text);font:17px Roboto,Arial,sans-serif;outline:0}
.iwe-sp-input::placeholder{color:var(--muted)}
.iwe-sp-go{appearance:none;flex:none;display:inline-flex;align-items:center;gap:6px;height:40px;margin-left:4px;padding:0 18px;border:0;border-radius:8px;background:var(--primary);color:#fff;font:600 14px Roboto,Arial,sans-serif;cursor:pointer;transition:filter .15s,transform .1s}
.iwe-sp-go:hover{filter:brightness(1.08)}
.iwe-sp-go:active{transform:scale(.97)}
.iwe-sp-go:focus-visible,.iwe-sp-tab:focus-visible,.iwe-sp-chip button:focus-visible,.iwe-sp-clearall:focus-visible{outline:2px solid var(--primary);outline-offset:2px}
.iwe-sp-tabs{position:relative;display:flex;gap:2px;margin-top:12px;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid rgba(128,128,128,.22)}
.iwe-sp-tabs::-webkit-scrollbar{display:none}
.iwe-sp-tab{appearance:none;flex:none;display:inline-flex;align-items:center;gap:6px;height:40px;padding:0 12px;border:0;background:none;color:var(--muted);font:inherit;cursor:pointer;transition:color .15s}
.iwe-sp-tab:hover{color:var(--text)}
.iwe-sp-tab[aria-selected=true]{color:var(--text);font-weight:600}
.iwe-sp-tab>.ic{opacity:.75}
.iwe-sp-ink{position:absolute;left:0;bottom:0;height:2px;border-radius:2px;background:var(--primary);pointer-events:none}
.iwe-sp-ink.ready{transition:transform .3s cubic-bezier(.22,1,.36,1),width .3s cubic-bezier(.22,1,.36,1)}
.iwe-sp-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;margin-top:12px}
.iwe-sp-chips{display:flex;flex-wrap:wrap;align-items:center;row-gap:8px;flex:1 1 auto;min-width:0}
.iwe-sp-cw{flex:none;display:grid;grid-template-columns:1fr;margin-right:8px;transition:grid-template-columns .26s cubic-bezier(.22,1,.36,1),opacity .2s,margin-right .26s}
.iwe-sp-cw.gone{grid-template-columns:0fr;opacity:0;margin-right:0}
.iwe-sp-cw>.iwe-sp-chip{min-width:0;overflow:hidden}
.iwe-sp-chip{display:inline-flex;align-items:center;height:32px;border-radius:8px;background:var(--body-dark);white-space:nowrap;box-shadow:inset 0 0 0 1px rgba(128,128,128,.14);transition:background .15s,box-shadow .15s,opacity .15s}
.iwe-sp-chip:hover{background:var(--body-darker)}
.iwe-sp-chip button{appearance:none;display:inline-flex;align-items:center;height:100%;margin:0;border:0;background:none;color:var(--text);font:13px Roboto,Arial,sans-serif;cursor:pointer}
.iwe-sp-chip .main{gap:6px;padding:0 10px;border-radius:8px}
.iwe-sp-chip .main>.ic{flex:none;opacity:.6;transition:color .15s,opacity .15s}
.iwe-sp-chip .v{max-width:180px;overflow:hidden;text-overflow:ellipsis}
.iwe-sp-chip .cv{display:grid;opacity:.5;transition:transform .2s}
.iwe-sp-chip .main[aria-expanded=true] .cv{transform:rotate(180deg)}
.iwe-sp-chip .x{display:none;width:24px;padding:0;margin-left:-6px;justify-content:center;border-radius:0 8px 8px 0;opacity:.6}
.iwe-sp-chip .x:hover{opacity:1}
.iwe-sp-chip.on{background:var(--primary-faded);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary) 55%,transparent)}
.iwe-sp-chip.on .main>.ic{color:var(--primary);opacity:1}
.iwe-sp-chip.on .v{font-weight:600}
.iwe-sp-chip.on:not([data-f=exact]) .cv{display:none}
.iwe-sp-chip.on:not([data-f=exact]):not([data-f=sort]) .x{display:inline-flex}
.iwe-sp-chip.dim{opacity:.55}
.iwe-sp-clearall{appearance:none;flex:none;white-space:nowrap;display:inline-flex;align-items:center;gap:4px;height:32px;padding:0 8px;border:0;border-radius:8px;background:none;color:var(--muted);font:13px Roboto,Arial,sans-serif;cursor:pointer;opacity:0;transform:translateX(-6px);pointer-events:none;transition:opacity .2s,transform .26s cubic-bezier(.22,1,.36,1),background .15s,color .15s}
.iwe-sp-clearall.show{opacity:1;transform:none;pointer-events:auto}
.iwe-sp-clearall:hover{background:rgba(128,128,128,.14);color:var(--text)}
.iwe-sp-meta{display:flex;align-items:center;gap:12px;flex:none;margin-left:auto}
.iwe-sp-count{color:var(--muted);font-size:13px;font-variant-numeric:tabular-nums;white-space:nowrap;transition:opacity .2s}
.iwe-sp-count.wait{opacity:.35}
.iwe-sp-pager:empty{display:none}
.iwe-sp-pager .iwe-pager-seg{display:inline-flex;width:auto}
.iwe-sp-pager .iwe-pager-seg button{flex:none;height:30px}
@media (max-width:600px){
  .iwe-sp-field{height:46px;padding-left:12px}
  .iwe-sp-input{font-size:16px}
  .iwe-sp-go{width:36px;height:36px;padding:0;justify-content:center}
  .iwe-sp-go span{display:none}
  .iwe-sp-tabs{margin:10px -15px 0;padding:0 9px}
  .iwe-sp-chips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 -15px;padding:0 15px}
  .iwe-sp-chips::-webkit-scrollbar{display:none}
  .iwe-sp-meta{width:100%;justify-content:space-between;margin-left:0}
  .iwe-sp-pager .iwe-pager-seg span{display:none}
}
@media (prefers-reduced-motion:reduce){.header__search.iwe-hs,.iwe-pop,.iwe-pop-scrim,.iwe-sx-col,.iwe-sx-res,.iwe-sx-chip,.iwe-sp-cw,.iwe-sp-ink,.iwe-sp-clearall,.iwe-sx-badge,.iwe-sx-clear{transition:none!important;animation:none!important}}
`;

site.register('search', {
  css: CSS,
  scan(ctx) {
    if (ctx.path === '/search') mountHero(ctx);
    else hero = null; // 搜索页已经卸掉，节点随站点一起没了
    const form = document.querySelector('.header__search');
    if (form) {
      if (form.__iweSync) form.__iweSync(ctx); else mountHeader(form, ctx);
      // 搜索页自己有一整条搜索栏：顶栏那个收起来，免得两个框各写各的关键词（2026-11-25 用户提议）
      const away = !!(hero && hero.root.isConnected);
      if (form.classList.contains('iwe-hs-away') !== away) {
        if (away && form.contains(document.activeElement)) document.activeElement.blur();
        form.classList.toggle('iwe-hs-away', away);
        form.inert = away;
      }
    }
    if (pop.cur && !pop.cur.anchor.isConnected) pop.close(true);
  },
});

})();
