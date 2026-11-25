// 下载页「可以直接点的演示」：照插件真实界面用 HTML 搭的迷你 Iwara 窗口，替代截图轮播。
// - 五个功能各一个演示：高级搜索、创作工作台、订阅筛选、卡片预览、原地翻译
// - 每个演示都能切「原版 / 增强后」对比；还有新手指引式的分步提示，可以自己点，也可以点「演示给我看」让光标操作一遍
// - 视频、作者、评论都是编的；界面文字取自插件源码里的三语文案（src/91-search.js、10-core.js、99-subfilter.js、
//   99-cardpreview.js、98-translate.js、97-tagfilter.js、99-sidenav.js），插件改了文案这里要跟着改
// - 运行时代码写成普通函数 demoRuntime，构建时用 toString() 内联进页面：里面不能引用本文件的变量，数据都从参数传进去
const Q = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  bell: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15ZM10 20.5a2 2 0 0 0 4 0"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  ban: '<circle cx="12" cy="12" r="8"/><path d="m6.5 6.5 11 11"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/>',
  chat: '<path d="M4.5 5.5h15v10h-9l-4.5 4v-4h-1.5Z"/>',
  cal: '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M9 3.5v4M15 3.5v4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1-1"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  upload: '<path d="M12 16V4.5M7 9.5l5-5 5 5M5 20h14"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  bookmark: '<path d="M7 4h10v16l-5-4-5 4Z"/>',
  cdown: '<path d="m6 9 6 6 6-6"/>',
  cright: '<path d="m9 6 6 6-6 6"/>',
  cleft: '<path d="m15 6-6 6 6 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/>',
  post: '<path d="M7 3h7l5 5v13H7Z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  lines: '<path d="M5 7h14M5 12h14M5 17h14"/>',
  down: '<path d="M12 4v14M6 12l6 6 6-6"/>',
  shield: '<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6Z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5ZM3 13l9 5 9-5"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  lang: '<path d="M4 5h8M8 3v2M11 5c-1 4-3.6 7-7 8M6 9c1.4 2 3.4 3.4 6 4M13 21l4-9 4 9M14.5 18h5"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6M4 4v4.6h4.6"/>',
  home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4Z"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.3 10.8 7.4-3.6M8.3 13.2l7.4 3.6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  play: '<path d="M8 5.5v13l10.5-6.5Z" fill="currentColor"/>',
  dots: '<circle cx="5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
};
const q = (n, s = 14, sw = 1.8) => `<svg class="q" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Q[n]}</svg>`;
const LOGO = '<svg class="q" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5 22.5 12 12 22.5 1.5 12Z" fill="currentColor"/><path d="M10 8.3v7.4l5.6-3.7Z" fill="var(--iw-hd)"/></svg>';

// 标签：[原名, 中文, 日文, 别名]。顺序就是「热门标签」的顺序
const TAGS = {
  dance: ['dance', '舞蹈', 'ダンス', ['跳舞', 'dancing', 'おどり']],
  music: ['music', '音乐', '音楽', []],
  mmd: ['MMD', 'MMD', 'MMD', ['mikumikudance']],
  original: ['original character', '原创角色', 'オリジナルキャラクター', ['oc', '原创', 'オリキャラ']],
  animation: ['animation', '动画', 'アニメーション', ['アニメ']],
  blender: ['Blender', 'Blender', 'Blender', []],
  cute: ['cute', '可爱', 'かわいい', ['可愛い']],
  vocaloid: ['vocaloid', '虚拟歌手', 'ボーカロイド', ['ボカロ']],
  horror: ['horror', '恐怖', 'ホラー', []],
  swimsuit: ['swimsuit', '泳装', '水着', []],
  uniform: ['school uniform', '校服', '制服', []],
};

// 编的视频。days = 发布了几天；r = 分级（g 全年龄 / e 成人）
const VIDS = [
  { t: 'Hoodie Groove Test', a: 'Mirai', h: [340, 20], d: '1:03', sec: 63, views: 75, likes: 2, com: 3, days: 0.018, r: 'g', tags: ['dance', 'original'],
    desc: ['试一下新卫衣的物理效果。', 'Testing the new hoodie physics.', '新しいパーカーの物理演算テスト。'] },
  { t: 'Rainy Night Walk', a: 'Rin', h: [170, 205], d: '3:10', sec: 190, views: 3, likes: 0, com: 0, days: 0.02, r: 'g', tags: ['animation', 'music'],
    desc: ['雨夜散步，全程一镜到底。', 'A walk in the rain, one continuous shot.', '雨の夜の散歩、ワンカットで。'] },
  { t: 'Beach Day Short', a: 'Eclipse Lab', h: [350, 25], d: '0:53', sec: 53, views: 4, likes: 0, com: 1, days: 0.4, r: 'e', tags: ['swimsuit', 'cute'],
    desc: ['海边小短片。', 'A short day at the beach.', '海辺のショートムービー。'] },
  { t: 'Ponytail Swing', a: 'Saffron', h: [270, 295], d: '5:20', sec: 320, views: 177, likes: 7, com: 5, days: 2, r: 'g', tags: ['dance', 'mmd'],
    desc: ['马尾辫摆动测试，配了新的舞步。', 'Ponytail swing test with new moves.', 'ポニーテールの揺れテスト、新しい振り付けで。'] },
  { t: 'Long Take One-shot', a: 'Lilac Loop', h: [25, 12], d: '12:54', sec: 774, views: 6, likes: 0, com: 0, days: 5, r: 'g', tags: ['blender', 'animation'],
    desc: ['一个长镜头拍完整段。', 'The whole piece in one long take.', '全編ロングテイク。'] },
  { t: 'Camera Path Showcase', a: 'Amber Arc', h: [250, 268], d: '1:33', sec: 93, views: 44, likes: 1, com: 2, days: 12, r: 'g', tags: ['blender', 'original'],
    desc: ['镜头路径的分享和讲解。', 'Sharing and explaining the camera path.', 'カメラパスの紹介と解説。'] },
  { t: 'Choreography Breakdown', a: 'Taiga', h: [122, 145], d: '3:33', sec: 213, views: 54, likes: 4, com: 2, days: 0.6, r: 'g', tags: ['dance', 'music'],
    desc: ['把整段舞拆开慢放讲解。', 'The routine broken down in slow motion.', '振り付けをスローで分解解説。'] },
  { t: 'Rooftop Session', a: 'Echo Park', h: [188, 200], d: '3:25', sec: 205, views: 110, likes: 12, com: 4, days: 40, r: 'g', tags: ['music', 'vocaloid'],
    desc: ['天台上的一场小演出。', 'A small show on the rooftop.', '屋上での小さなライブ。'] },
  { t: 'Halloween Party Mix', a: 'Kaede', h: [28, 280], d: '1:25', sec: 85, views: 83, likes: 3, com: 1, days: 26, r: 'e', tags: ['dance', 'horror'],
    desc: ['万圣节派对混剪。', 'A Halloween party mix.', 'ハロウィンパーティーのミックス。'] },
  { t: 'Twin Tails Jump', a: 'Nekomata', h: [228, 252], d: '1:14', sec: 74, views: 256, likes: 9, com: 6, days: 3, r: 'g', tags: ['dance', 'cute', 'mmd'],
    desc: ['双马尾跳跃动作合集。', 'A set of twin-tail jumps.', 'ツインテールのジャンプ集。'] },
  { t: 'Vocal Cover Live', a: 'Peach Fizz', h: [42, 18], d: '5:19', sec: 319, views: 167, likes: 12, com: 3, days: 120, r: 'e', tags: ['vocaloid', 'music'],
    desc: ['翻唱现场版。', 'A live vocal cover.', '歌ってみたライブ版。'] },
  { t: 'Gym Warm-up', a: 'Violet Hour', h: [12, 34], d: '3:19', sec: 199, views: 113, likes: 3, com: 0, days: 400, r: 'g', tags: ['dance', 'uniform'],
    desc: ['上课前的热身操。', 'A warm-up before class.', '授業前のウォームアップ。'] },
];

export function buildDemos({ L, esc, today }) {
  const now = today instanceof Date && !isNaN(today) ? today : new Date();
  VIDS.forEach((v, i) => {
    v.id = 'v' + i; v.i = i;
    const dt = new Date(now.getTime() - v.days * 864e5);
    v.y = dt.getUTCFullYear(); v.m = dt.getUTCMonth() + 1;
  });
  const tn = (id) => L(TAGS[id][1], TAGS[id][0], TAGS[id][2]);
  const ago = (days) => {
    if (days < 1 / 24) { const n = Math.max(1, Math.round(days * 1440)); return L(`${n} 分钟前`, `${n} min. ago`, `${n} 分前`); }
    if (days < 1) { const n = Math.round(days * 24); return L(`${n} 小时前`, `${n} hr. ago`, `${n} 時間前`); }
    if (days < 30) { const n = Math.round(days); return L(`${n} 天前`, `${n} days ago`, `${n} 日前`); }
    if (days < 365) { const n = Math.round(days / 30); return L(`${n} 个月前`, `${n} mo. ago`, `${n} か月前`); }
    const n = Math.round(days / 365); return L(`${n} 年前`, `${n} yr. ago`, `${n} 年前`);
  };
  const card = (v, { more = false } = {}) => `<div class="iw-card" data-v="${v.id}">
    <div class="iw-th" style="--a:${v.h[0]};--b:${v.h[1]}"><span class="st l">${q('eye', 10, 2.4)}${v.views}</span><span class="st r">${q('heart', 10, 2.4)}${v.likes}</span>${v.r === 'e' ? '<span class="st e">R-18</span>' : ''}<span class="st d">${q('clock', 10, 2.4)}${v.d}</span></div>
    <b class="t">${esc(v.t)}</b>
    <div class="iw-by"><i class="iw-av" style="--a:${v.h[0]}"></i><span><em>${esc(v.a)}</em><small>${ago(v.days)}</small></span>${more ? `<button class="iw-more" type="button" data-act="more" aria-label="Preview">${q('dots', 15)}</button>` : ''}</div>
  </div>`;
  const chip = (act, val, label, on = false, cls = 'iw-chip') => `<button class="${cls}" type="button" data-act="${act}" data-val="${val}" aria-pressed="${on}">${label}</button>`;
  const rail = `<nav class="iw-rail" aria-hidden="true">${['home', 'search', 'share', 'star', 'video', 'image', 'chat', 'gear'].map((n) => q(n, 17)).join('')}</nav>`;
  const hd = (center = `<div class="iw-sb iw-sb-s"><span>${L('搜索', 'Search', '検索')}</span>${q('search', 14)}</div>`) =>
    `<header class="iw-hd">${q('menu', 18)}<span class="iw-logo">${LOGO}<b>Iwara</b></span>${center}<span class="iw-ics">${q('bell', 16)}${q('mail', 16)}<i class="iw-me"></i></span></header>`;
  const note = (text) => `<p class="v-note">${q('ban', 14)}<span>${text}</span></p>`;
  const ph = (zh, en, ja) => `data-ph="${esc([zh, en, ja].join('|'))}" placeholder="${esc(zh)}"`;
  const opt = (val, zh, en, ja) => `<option value="${val}" data-t="${esc([zh, en, ja].join('|'))}">${esc(zh)}</option>`;
  const lbl = (zh, en, ja) => `<label class="iw-lb">${L(zh, en, ja)}</label>`;

  // ── 1. 高级搜索 ──
  const DATES = [['any', L('不限', 'Any', '指定なし')], ['d1', L('24 小时内', 'Past 24 hours', '24 時間以内')], ['d7', L('7 天内', 'Past week', '7 日以内')], ['d30', L('30 天内', 'Past month', '30 日以内')], ['y1', L('一年内', 'Past year', '1 年以内')]];
  const DURS = [['any', L('不限', 'Any', '指定なし')], ['s1', L('1 分钟内', 'Under 1 min', '1 分以内')], ['s4', L('1–4 分钟', '1–4 min', '1〜4 分')], ['mid', L('4–20 分钟', '4–20 min', '4〜20 分')], ['long', L('20 分钟以上', 'Over 20 min', '20 分以上')]];
  const search = `
  <div class="dm on" id="dm-search" data-url="/search?type=videos|/search?query=dance">
    <div class="v v-a">
      ${hd(`<div class="iw-sb"><span class="sb-type">${q('video', 14)}<span>${L('视频', 'Videos', '動画')}</span>${q('cdown', 12)}</span><span class="sb-q">${L('搜索视频', 'Search Videos', '動画を検索')}</span><button class="sb-ic sb-flt" type="button" data-act="filters" aria-pressed="false" aria-label="Filters">${q('sliders', 15)}<b class="flt-n" hidden></b></button><span class="sb-go">${q('search', 15, 2.2)}</span></div>`)}
      <div class="iw-row">${rail}
        <div class="iw-scroll sr">
          <div class="sr-head"><b class="sr-count"></b><div class="sr-sum"></div></div>
          <div class="iw-grid">${VIDS.map((v) => card(v)).join('')}</div>
          <p class="sr-empty" hidden>${L('没有结果', 'No results', '結果がありません')}</p>
        </div>
        <aside class="sp" aria-label="Filters">
          <div class="sp-hd"><b>${L('筛选条件', 'Filters', '絞り込み条件')}</b><span class="sp-in">${q('video', 12)}${L('在「视频」中', 'in Videos', '「動画」内')}</span><button class="sb-ic" type="button" data-act="close" aria-label="Close">${q('x', 14)}</button></div>
          <div class="sp-sec"><div class="iw-h">${q('trend', 13)}${L('排序', 'Sort', '並び替え')}</div><div class="iw-chips">${chip('sort', 'rel', L('相关度', 'Relevance', '関連度'), true)}${chip('sort', 'date', L('最新发布', 'Newest', '新着'))}${chip('sort', 'views', L('观看最多', 'Most viewed', '再生数が多い順'))}${chip('sort', 'likes', L('点赞最多', 'Most liked', 'いいねが多い順'))}</div></div>
          <div class="sp-sec"><div class="iw-h">${q('tag', 13)}${L('标签', 'Tags', 'タグ')}</div>
            <div class="tk-list"></div>
            <input class="iw-in tg-in" type="text" ${ph('输入标签，中英日都能搜', 'Type a tag in any language', 'タグを入力（日本語・英語・中国語に対応）')} autocomplete="off" spellcheck="false" aria-label="Tags">
            <p class="iw-hint">${L('回车 = 包含　Shift + 回车 = 排除', 'Enter = include · Shift + Enter = exclude', 'Enter = 含める　Shift + Enter = 除外')}</p>
            <div class="sg-list"></div>
            <div class="iw-h sm">${L('选了多个标签时', 'With several tags', '複数のタグを選んだとき')}</div>
            <div class="iw-seg">${chip('mode', 'all', L('全部都要有', 'Must have all', 'すべて含む'), true, '')}${chip('mode', 'any', L('有一个就行', 'Any of them', 'いずれかを含む'), false, '')}</div>
          </div>
          <div class="sp-sec"><div class="iw-h">${q('cal', 13)}${L('发布时间', 'Upload date', '投稿日')}</div><div class="iw-chips">${DATES.map(([v, l], i) => chip('date', v, l, i === 0)).join('')}</div></div>
          <div class="sp-sec"><div class="iw-h">${q('clock', 13)}${L('时长', 'Duration', '長さ')}</div><div class="iw-chips">${DURS.map(([v, l], i) => chip('dur', v, l, i === 0)).join('')}</div></div>
          <div class="sp-foot"><button class="iw-btn pri" type="button" data-act="close"><span class="sp-res"></span></button></div>
        </aside>
      </div>
    </div>
    <div class="v v-b">
      ${hd(`<div class="iw-sb"><span class="sb-q on">dance</span><span class="sb-go">${q('search', 15, 2.2)}</span></div>`)}
      <div class="iw-row">${rail}
        <div class="iw-scroll">
          <div class="ob-tabs">${[L('视频', 'Videos', '動画'), L('图像', 'Images', '画像'), L('帖子', 'Posts', '投稿'), L('用户', 'Users', 'ユーザー')].map((l, i) => `<span${i ? '' : ' class="on"'}>${l}</span>`).join('')}</div>
          <div class="iw-grid">${VIDS.slice(0, 8).map((v) => card(v)).join('')}</div>
        </div>
      </div>
      ${note(L('<b>原版</b>只有一个关键词框，不能按标签、作者、时长组合筛选。', '<b>Original:</b> one keyword box — no combining tags, authors or length.', '<b>元のサイト</b>はキーワード欄だけ。タグ・投稿者・長さを組み合わせられません。'))}
    </div>
  </div>`;

  // ── 2. 创作工作台 ──
  const STEPS = [L('上传', 'Upload', 'アップロード'), L('内容', 'Content', '内容'), L('标签', 'Tags', 'タグ'), L('发布', 'Publish', '公開')];
  const studio = `
  <div class="dm" id="dm-studio" data-url="/create/video|/upload/video">
    <div class="v v-a">
      ${hd()}
      <div class="iw-row">${rail}
        <div class="iw-scroll wz">
          <div class="st-top"><span class="iw-seg sm"><button type="button" aria-pressed="true" tabindex="-1">${q('video', 13)}${L('视频', 'Video', '動画')}</button><button type="button" aria-pressed="false" tabindex="-1">${q('image', 13)}${L('图片', 'Image', '画像')}</button></span><span class="st-draft" hidden>${q('check', 13, 2.2)}${L('草稿已自动保存', 'Draft saved', '下書きを保存しました')}</span><span class="iw-btn ghost sm">${q('bookmark', 13)}${L('模板', 'Templates', 'テンプレート')}</span></div>
          <ol class="st-steps">${STEPS.map((l, i) => `<li><button type="button" data-act="go" data-val="${i + 1}"><i><span>${i + 1}</span>${q('check', 12, 2.6)}</i><span class="st-l">${l}</span></button></li>`).join('')}</ol>
          <div class="st-strip" hidden>${q('file', 13)}<span class="st-fn">hoodie_groove_take3.mp4</span><span class="st-bar"><i></i></span><b class="st-pct">0%</b><small class="st-msg"></small></div>
          <section class="st-pane" data-step="1">
            <button class="st-drop" type="button" data-act="pick"><span class="st-up">${q('upload', 18)}</span><b>${L('拖入视频，或点击选择', 'Drop a video, or click to choose', '動画をドロップ、またはクリックして選択')}</b></button>
            <div class="st-file" hidden><span class="st-fi">${q('video', 18)}</span><span class="st-fm"><b>hoodie_groove_take3.mp4</b><small>248 MB · 1920×1080 · 1:03</small><span class="st-bar"><i></i></span></span><b class="st-pct">0%</b></div>
            <ul class="st-req"><li>MP4 · H.264 · AAC</li><li>≤ 600 MB</li><li>≥ 960×720</li><li>≥ 20 s</li></ul>
          </section>
          <section class="st-pane" data-step="2" hidden>
            ${lbl('标题', 'Title', 'タイトル')}<input class="iw-in st-title" type="text" value="Hoodie Groove Test" spellcheck="false" aria-label="Title">
            ${lbl('简介', 'Description', '説明')}
            <div class="st-ed"><div class="st-tb"><b>B</b><i>I</i>${q('link', 13)}${q('lines', 13)}${q('image', 13)}</div><div class="st-edc">${L('<b>第 3 次</b>拍摄，换了新的灯光。', '<b>Take 3</b>, with new lighting.', '<b>3 回目</b>の撮影、照明を変えました。')}<span class="st-caret"></span></div></div>
          </section>
          <section class="st-pane" data-step="3" hidden>
            ${lbl('标签', 'Tags', 'タグ')}
            <div class="tk-list"></div>
            <input class="iw-in tg-in" type="text" ${ph('输入标签，中英日都能搜', 'Type a tag in any language', 'タグを入力（日本語・英語・中国語に対応）')} autocomplete="off" spellcheck="false" aria-label="Tags">
            <div class="sg-list"></div>
            ${lbl('分级', 'Rating', 'レーティング')}
            <div class="iw-seg">${chip('rating', 'g', L('全年龄', 'General', '一般'), true, '')}${chip('rating', 'e', L('成人', 'Ecchi', 'エッチ'), false, '')}</div>
          </section>
          <section class="st-pane" data-step="4" hidden>
            <ul class="st-chk">
              <li data-k="file"><i></i><span>${L('文件', 'File', 'ファイル')}</span><small class="st-chk-file"></small></li>
              <li data-k="title" class="ok"><i></i><span>${L('标题', 'Title', 'タイトル')}</span><small>Hoodie Groove Test</small></li>
              <li data-k="tags"><i></i><span>${L('标签', 'Tags', 'タグ')}</span><small class="st-chk-tags"></small></li>
            </ul>
            <button class="iw-btn pri st-pub" type="button" data-act="publish">${L('发布', 'Publish', '公開')}</button>
            <p class="st-wait">${L('文件传完就能发布', 'Publishing unlocks when the upload finishes', 'アップロードが終わると公開できます')}</p>
            <div class="st-done" hidden>${q('check', 18, 2.4)}<b>${L('已发布', 'Published', '公開しました')}</b></div>
          </section>
          <div class="st-nav"><button class="iw-btn ghost" type="button" data-act="back">${L('上一步', 'Back', '戻る')}</button><button class="iw-btn dark" type="button" data-act="next">${L('下一步', 'Next', '次へ')}${q('arrow', 13)}</button></div>
        </div>
      </div>
    </div>
    <div class="v v-b">
      ${hd()}
      <div class="iw-row">${rail}
        <div class="iw-scroll ob">
          <h3 class="iw-h1">${L('上传新视频', 'Upload new Video', '新しい動画をアップロード')}</h3>
          <div class="ob-card"><label>${L('标题', 'Title', 'タイトル')}</label><span class="ob-in"></span><label>${L('简介', 'Description', '説明')}</label><span class="ob-in tall"></span></div>
          <div class="ob-card"><div class="ob-tabs sm"><span class="on">${L('上传', 'Upload', 'アップロード')}</span><span>${L('嵌入', 'Embed', '埋め込み')}</span></div><span class="ob-in tall"></span></div>
          <div class="ob-card"><label>${L('标签', 'Tags', 'タグ')}</label><span class="ob-in"></span><label>${L('创作者信息', 'Creator Information', 'クリエイター情報')}</label><span class="ob-in"></span></div>
          <span class="iw-btn pri dis">${L('保存', 'Save', '保存')}</span>
        </div>
      </div>
      ${note(L('<b>原版</b>是一整页长表单：文件传完才能提交，刷新就全没了。', '<b>Original:</b> one long form — you wait for the upload, and a refresh loses everything.', '<b>元のサイト</b>は長いフォーム 1 枚。アップロード完了まで送信できず、再読み込みで全部消えます。'))}
    </div>
  </div>`;

  // ── 3. 订阅筛选 ──
  const SORTS = [['date', 'clock', L('最新', 'Latest', '新着')], ['trending', 'trend', L('趋势', 'Trending', 'トレンド')], ['popularity', 'star', L('人气', 'Popular', '人気')], ['likes', 'heart', L('点赞', 'Likes', 'いいね')], ['views', 'eye', L('观看', 'Views', '再生数')]];
  const RATINGS = [['all', 'layers', L('全部', 'All', 'すべて')], ['general', 'shield', L('全年龄', 'General', '一般')], ['ecchi', 'heart', L('成人', 'Ecchi', 'エッチ')]];
  const years = [...new Set(VIDS.map((v) => v.y))].sort((a, b) => b - a);
  const tagCount = Object.keys(TAGS).map((id) => [id, VIDS.filter((v) => v.tags.includes(id)).length]).filter(([, n]) => n);
  const subs = `
  <div class="dm" id="dm-subs" data-url="/subscriptions/videos|/subscriptions/videos">
    <div class="v v-a">
      ${hd()}
      <div class="iw-row">${rail}
        <div class="iw-scroll sub">
          <div class="sub-main">
            <h3 class="iw-h1">${L('订阅', 'Subscriptions', '購読')}</h3>
            <div class="iw-grid">${VIDS.map((v) => card(v)).join('')}</div>
            <p class="sr-empty" hidden>${L('没有结果', 'No results', '結果がありません')}</p>
            <div class="pg"><span class="pg-b">${q('cleft', 14)}</span><span class="pg-b on">1</span><span class="pg-b">2</span><span class="pg-b">3</span><span class="pg-d">…</span><span class="pg-b">9</span><span class="pg-b">${q('cright', 14)}</span><span class="pg-j">${L('跳至页码', 'Go to page', 'ページへ移動')}<span class="pg-in">1</span><span class="pg-go">${L('跳转', 'Go', '移動')}</span></span></div>
            <div class="pg-inf" hidden><span class="spin"></span><span>${L('已加载到第 2 页 · 没有更多了', 'Loaded up to page 2 · No more items', '2 ページ目まで読み込み済み・これ以上ありません')}</span></div>
          </div>
          <aside class="sub-side">
            <div class="sd-blk sd-nav"><span class="on">${q('video', 15)}${L('视频', 'Videos', '動画')}</span><span>${q('image', 15)}${L('图像', 'Images', '画像')}</span><span>${q('post', 15)}${L('帖子', 'Posts', '投稿')}</span></div>
            <div class="sd-blk"><b class="sd-h">${L('翻页方式', 'Paging', 'ページ送り')}</b><div class="iw-seg">${chip('mode', 'pages', q('lines', 13) + L('传统分页', 'Pages', 'ページ分割'), true, '')}${chip('mode', 'inf', q('down', 13) + L('瀑布流', 'Infinite', '無限スクロール'), false, '')}</div></div>
            <div class="sd-blk"><div class="sd-hrow"><b class="sd-h">${L('筛选', 'Filters', '絞り込み')}</b><span class="sd-cnt"></span></div>
              <small class="sd-l">${L('排序', 'Sort', '並び替え')}</small><div class="iw-chips sm">${SORTS.map(([v, ic, l], i) => chip('sort', v, q(ic, 12) + l, i === 0)).join('')}</div>
              <small class="sd-l">${L('评级', 'Rating', '評価')}</small><div class="iw-chips sm">${RATINGS.map(([v, ic, l], i) => chip('rating', v, q(ic, 12) + l, i === 0)).join('')}</div>
              <small class="sd-l">${L('发布时间', 'Published', '公開日')}</small>
              <div class="sd-dates"><select class="iw-sel" data-act="y" aria-label="Year">${opt('any', '不限年份', 'Any year', '年を指定しない')}${years.map((y) => `<option value="${y}">${y}</option>`).join('')}</select><select class="iw-sel" data-act="m" aria-label="Month">${opt('any', '全年', 'Whole year', '通年')}${Array.from({ length: 12 }, (_, i) => opt(String(i + 1), `${i + 1} 月`, `Month ${i + 1}`, `${i + 1} 月`)).join('')}</select></div>
            </div>
            <div class="sd-blk"><b class="sd-h">${L('标签', 'Tags', 'タグ')}</b>
              <div class="sd-tags">${tagCount.map(([id, n]) => `<button class="sd-tag" type="button" data-act="tag" data-val="${id}" aria-pressed="false">${q('tag', 12)}<span>${tn(id)}</span><small>${n}</small></button>`).join('')}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
    <div class="v v-b">
      ${hd()}
      <div class="iw-row">${rail}
        <div class="iw-scroll sub">
          <div class="sub-main"><h3 class="iw-h1">${L('订阅', 'Subscriptions', '購読')}</h3><div class="iw-grid">${VIDS.slice(0, 8).map((v) => card(v)).join('')}</div>
            <div class="pg"><span class="pg-b">${q('cleft', 14)}</span><span class="pg-b on">1</span><span class="pg-b">2</span><span class="pg-b">${q('cright', 14)}</span></div></div>
          <aside class="sub-side"><div class="sd-blk sd-nav"><span class="on">${q('video', 15)}${L('视频', 'Videos', '動画')}</span><span>${q('image', 15)}${L('图像', 'Images', '画像')}</span><span>${q('post', 15)}${L('帖子', 'Posts', '投稿')}</span></div></aside>
        </div>
      </div>
      ${note(L('<b>原版</b>订阅页只能按时间往下翻，没有排序和筛选。', '<b>Original:</b> Subscriptions is newest-first only — no sorting, no filters.', '<b>元のサイト</b>の購読ページは新着順のみ。並べ替えも絞り込みもできません。'))}
    </div>
  </div>`;

  // ── 4. 卡片预览 ──
  const preview = `
  <div class="dm" id="dm-preview" data-url="/videos|/videos">
    <div class="v v-a">
      ${hd()}
      <div class="iw-row">${rail}
        <div class="iw-scroll"><h3 class="iw-h1">${L('视频', 'Videos', '動画')}</h3><div class="iw-grid">${VIDS.slice(0, 8).map((v) => card(v, { more: true })).join('')}</div></div>
      </div>
      <div class="pv" hidden>
        <div class="pv-bd" data-act="close"></div>
        <div class="pv-box" role="dialog" aria-label="Preview">
          <div class="pv-cov iw-th"><button class="pv-x" type="button" data-act="close" aria-label="Close">${q('x', 16, 2.2)}</button><span class="st d pv-dur"></span></div>
          <div class="pv-info">
            <b class="pv-t"></b>
            <div class="pv-au"><i class="iw-av"></i><span><b class="pv-a"></b><small class="pv-h"></small></span>${q('cright', 16)}</div>
            <div class="pv-stats"></div>
            <p class="pv-d"></p>
            <div class="pv-tags"></div>
            <div class="pv-act"><span class="pv-grp"><button type="button" class="pv-like" data-act="like" aria-pressed="false">${q('heart', 15)}<b class="pv-ln"></b></button><button type="button" class="pv-copy" data-act="copy" aria-label="Copy link">${q('link', 15)}<span class="pv-tip">${L('已复制', 'Copied', 'コピーしました')}</span></button><button type="button" tabindex="-1" aria-label="Open in new tab">${q('ext', 15)}</button></span><span class="iw-btn pri">${L('打开', 'Open', '開く')}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="v v-b">
      ${hd()}
      <div class="iw-row">${rail}
        <div class="iw-scroll"><h3 class="iw-h1">${L('视频', 'Videos', '動画')}</h3><div class="iw-grid">${VIDS.slice(0, 8).map((v) => card(v)).join('')}</div></div>
      </div>
      ${note(L('<b>原版</b>要点进视频页才能看简介和标签，看完再返回列表。', '<b>Original:</b> open the video page to see its details, then come back to the list.', '<b>元のサイト</b>は動画ページを開かないと詳細が見られず、一覧に戻る必要があります。'))}
    </div>
  </div>`;

  // ── 5. 原地翻译 ──
  const LN = { zh: ['中文', 'Chinese', '中国語'], en: ['英语', 'English', '英語'], ja: ['日语', 'Japanese', '日本語'] };
  const COMMENTS = [
    { id: 'c1', a: 'Haru', h: 330, src: 'ja', ago: ago(0.1), likes: 4,
      text: 'カメラの設定を教えてもらえますか？照明がすごく綺麗です！',
      tr: { zh: '能分享一下相机设置吗？灯光太好看了！', en: 'Could you share your camera settings? The lighting looks amazing!' } },
    { id: 'c2', a: 'Taiga', h: 140, src: 'en', ago: ago(0.3), likes: 2,
      text: 'The transition at 0:42 is so smooth — how long did the mocap take?',
      tr: { zh: '0:42 那段转场太顺了——动捕花了多久？', ja: '0:42 のトランジションがすごく滑らか！モーキャプにどれくらいかかりましたか？' } },
    { id: 'c3', a: 'Lin', h: 200, src: 'zh', ago: ago(1.5), likes: 1,
      text: '第二段的舞步是参考哪个版本的？',
      tr: { en: 'Which version is the second part’s choreography based on?', ja: '2 番目のパートの振り付けは、どのバージョンを参考にしていますか？' } },
  ];
  const trOut = (c) => L(...['zh', 'en', 'ja'].map((to, k) => to === c.src
    ? `<em class="cm-same">${[`已经是${LN[to][0]}`, `Already in ${LN[to][1]}`, `すでに${LN[to][2]}です`][k]}</em>`
    : `${esc(c.tr[to])}<small class="cm-meta">${[`由谷歌翻译自${LN[c.src][0]}`, `Translated from ${LN[c.src][1]} by Google`, `${LN[c.src][2]}から Google で翻訳`][k]}</small>`));
  const vtags = ['dance', 'original', 'blender'];
  const translate = `
  <div class="dm" id="dm-translate" data-url="/video/k2Hp9xQ/hoodie-groove-test|/video/k2Hp9xQ/hoodie-groove-test">
    <div class="v v-a">
      ${hd()}
      <div class="iw-row">${rail}
        <div class="iw-scroll tr">
          <div class="tr-player iw-th" style="--a:340;--b:20"><span class="tr-play">${q('play', 22)}</span></div>
          <h3 class="iw-h1">Hoodie Groove Test</h3>
          <div class="tr-tags"><span class="tr-tl">${vtags.map((id) => `<span class="tr-tag"><span class="nm-o">${esc(TAGS[id][0])}</span><span class="nm-t">${tn(id)}</span></span>`).join('')}</span>
            <span class="iw-seg xs">${chip('tv', 'orig', L('原名', 'Original', '原名'), true, '')}${chip('tv', 'tr', L('译名', 'Translated', '翻訳'), false, '')}</span></div>
          <h4 class="tr-ch">${L('评论', 'Comments', 'コメント')} · ${COMMENTS.length}</h4>
          ${COMMENTS.map((c) => `<div class="cm" data-c="${c.id}" data-src="${c.src}"><i class="iw-av" style="--a:${c.h}"></i><div class="cm-b"><div class="cm-hd"><b>${c.a}</b><small>${c.ago}</small></div><p class="cm-o" lang="${c.src}">${esc(c.text)}</p><p class="cm-t">${trOut(c)}</p><div class="cm-ft"><button class="cm-tr" type="button" data-act="tr">${q('lang', 13)}<span class="cm-a">${L('翻译', 'Translate', '翻訳')}</span><span class="cm-b2">${L('显示原文', 'Show original', '原文を表示')}</span><span class="cm-c">${L('翻译中…', 'Translating…', '翻訳中…')}</span></button><span>${q('heart', 13)}${c.likes}</span><span>${L('回复', 'Reply', '返信')}</span></div></div></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="v v-b">
      ${hd()}
      <div class="iw-row">${rail}
        <div class="iw-scroll tr">
          <div class="tr-player iw-th" style="--a:340;--b:20"><span class="tr-play">${q('play', 22)}</span></div>
          <h3 class="iw-h1">Hoodie Groove Test</h3>
          <div class="tr-tags"><span class="tr-tl">${vtags.map((id) => `<span class="tr-tag">${esc(TAGS[id][0])}</span>`).join('')}</span></div>
          <h4 class="tr-ch">${L('评论', 'Comments', 'コメント')} · ${COMMENTS.length}</h4>
          ${COMMENTS.map((c) => `<div class="cm"><i class="iw-av" style="--a:${c.h}"></i><div class="cm-b"><div class="cm-hd"><b>${c.a}</b><small>${c.ago}</small></div><p class="cm-o" lang="${c.src}">${esc(c.text)}</p><div class="cm-ft"><span>${q('heart', 13)}${c.likes}</span><span>${L('回复', 'Reply', '返信')}</span></div></div></div>`).join('')}
        </div>
      </div>
      ${note(L('<b>原版</b>评论和标签只有原文。', '<b>Original:</b> comments and tags only in their original language.', '<b>元のサイト</b>のコメントとタグは原文のみ。'))}
    </div>
  </div>`;

  // 左侧列表 / 窄屏标签的条目
  const list = [
    { id: 'search', icon: 'search', t: L('高级搜索', 'Advanced search', '詳細検索'),
      d: L('多个标签（包含 / 排除）、日期、时长一起筛，结果实时预览。', 'Combine tags (include / exclude), dates and length, with live results.', 'タグ（含める / 除外）・日付・長さを組み合わせ、結果をその場で確認。') },
    { id: 'studio', icon: 'spark', t: L('创作工作台', 'Creator studio', 'クリエイタースタジオ'),
      d: L('上传 → 内容 → 标签 → 发布。边传边填，标签中英日都能搜。', 'Upload → Content → Tags → Publish. Fill it in while it uploads; tags in any language.', 'アップロード → 内容 → タグ → 公開。アップロード中に入力、タグはどの言語でも。') },
    { id: 'subs', icon: 'filter', t: L('订阅筛选', 'Subscription filters', '購読フィルター'),
      d: L('订阅页加上排序、分级、年月和标签筛选，切换不刷新。', 'Sort, rating, year / month and tag filters on Subscriptions, without reloading.', '購読ページに並べ替え・レーティング・年月・タグの絞り込み。再読み込みなし。') },
    { id: 'preview', icon: 'eye', t: L('卡片预览', 'Card preview', 'カードプレビュー'),
      d: L('点卡片上的「⋯」直接看简介、统计和标签，不用离开列表。', 'The “⋯” on a card shows details, stats and tags without leaving the list.', 'カードの「⋯」で詳細・統計・タグを確認。一覧から離れません。') },
    { id: 'translate', icon: 'lang', t: L('原地翻译', 'In-place translation', 'その場で翻訳'),
      d: L('评论、简介一键翻译成你的语言，标签显示译名。', 'Comments and descriptions translated in place; tags in your language.', 'コメントや説明をその場で翻訳、タグも翻訳名で。') },
  ];

  const html = `
<div class="dw" id="dw" data-ab="after">
  <div class="dw-bar">
    <span class="dw-dots" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="dw-url">${q('lock', 11, 2)}<span>www.iwara.tv</span><b id="dw-path"></b></span>
    <span class="dw-ab" role="radiogroup" aria-label="Compare">
      <button type="button" role="radio" data-ab="before" aria-checked="false">${L('原版', 'Original', '元のサイト')}</button>
      <button type="button" role="radio" data-ab="after" aria-checked="true">${L('增强后', 'Enhanced', '拡張後')}</button>
    </span>
    <button class="dw-re" type="button" data-re aria-label="Restart">${q('reset', 15)}</button>
  </div>
  <div class="dw-body">${search}${studio}${subs}${preview}${translate}
    <div class="co" hidden></div>
    <div class="cur" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 3.5 18.5 12l-6 1.3-3.2 5.7Z"/></svg></div>
  </div>
</div>`;

  const T = (zh, en, ja) => L(zh, en, ja);
  const data = {
    order: list.map((x) => x.id),
    tags: TAGS,
    vids: Object.fromEntries(VIDS.map((v) => [v.id, { i: v.i, sec: v.sec, views: v.views, likes: v.likes, com: v.com, days: v.days, r: v.r, y: v.y, m: v.m, tags: v.tags }])),
    pv: Object.fromEntries(VIDS.slice(0, 8).map((v) => [v.id, { t: esc(v.t), a: esc(v.a), h: v.h, d: v.d, ago: ago(v.days), desc: L(...v.desc) }])),
    typeDance: { zh: '舞', en: 'dan', ja: 'ダン' },
    ic: { plus: q('plus', 12, 2.2), x: q('x', 11, 2.4), ban: q('ban', 12, 2), reset: q('reset', 13, 2), arrow: q('arrow', 13, 2), play: q('play', 11), eye: q('eye', 13), heart: q('heart', 13), chat: q('chat', 13), clock: q('clock', 13), cal: q('cal', 13) },
    t: {
      results: T('{n} 个结果', '{n} results', '{n} 件の結果'), none: T('没有结果', 'No results', '結果がありません'),
      showN: T('查看 {n} 个结果', 'Show {n} results', '{n} 件の結果を見る'), popular: T('热门标签', 'Popular tags', '人気のタグ'),
      noTags: T('没有匹配的标签', 'No matching tags', '一致するタグがありません'), exclude: T('排除', 'Exclude', '除外'),
      date: Object.fromEntries(DATES), dur: Object.fromEntries(DURS),
      upMsg: T('上传中，可以继续填写', 'Uploading — keep filling in', 'アップロード中・入力を続けられます'), upDone: T('上传完成', 'Upload complete', 'アップロード完了'),
      uploading: T('上传中 {n}%', 'Uploading {n}%', 'アップロード中 {n}%'), noTagsYet: T('还没加', 'None yet', 'まだありません'),
      play: T('演示给我看', 'Show me', 'やってみせて'), playing: T('演示中…', 'Playing…', '再生中…'), stop: T('停止', 'Stop', '停止'),
      done: T('完成', 'Done', '完了'), again: T('再来一遍', 'Again', 'もう一度'), next: T('下一个功能', 'Next feature', '次の機能'), first: T('回到第一个', 'Back to the first', '最初に戻る'),
    },
    co: {
      search: [
        T('点「筛选」，把标签、时间、时长组合起来搜', 'Click “Filters” to combine tags, dates and length', '「絞り込み」でタグ・日付・長さを組み合わせ'),
        T('输入「舞」——中文、英文、日文都能找到同一个标签', 'Type “dan” — English, Chinese or Japanese all find the same tag', '「ダン」と入力。日本語・英語・中国語どれでも同じタグに'),
        T('不想看的标签，点它旁边的「排除」', 'Don’t want a tag? Hit “Exclude” next to it', '見たくないタグは横の「除外」'),
        T('再限定时长——结果实时更新，不用重新搜索', 'Narrow the length — results update instantly', '長さも指定。結果はすぐ更新されます'),
        T('点这里看结果：条件已经拼成一个搜索', 'Tap to see the results — the filters became one search', 'タップして結果へ。条件は 1 つの検索にまとまっています'),
      ],
      studio: [
        T('点这里选一个视频，上传马上开始', 'Pick a video — the upload starts right away', 'ここで動画を選ぶと、すぐアップロード開始'),
        T('不用等上传完，直接跳到「标签」', 'No need to wait — jump straight to “Tags”', 'アップロードを待たずに「タグ」へ'),
        T('输入「舞」，中英日都能搜到标签', 'Type “dan” — tags are found in any language', '「ダン」と入力。どの言語でもタグが見つかります'),
        T('到「发布」核对一遍', 'Head to “Publish” to check', '「公開」で確認'),
        T('文件传完就能发布。草稿一直自动保存，刷新也不丢', 'Publish once the file is up. Drafts save themselves, even across a refresh', 'アップロードが終われば公開。下書きは自動保存、再読み込みしても消えません'),
      ],
      subs: [
        T('按点赞排序，页面不刷新', 'Sort by likes — no reload', 'いいね順に。再読み込みなし'),
        T('只看全年龄', 'General only', '一般のみ'),
        T('点一个标签，只看带它的', 'Pick a tag to see only those', 'タグを選んで絞り込み'),
        T('翻页方式也能换成瀑布流', 'Switch paging to infinite scroll', 'ページ送りを無限スクロールに'),
      ],
      preview: [
        T('点卡片右下角的「⋯」', 'Click the “⋯” at the bottom right of a card', 'カード右下の「⋯」をクリック'),
        T('不进视频页也能点赞、复制链接', 'Like or copy the link without opening the page', 'ページを開かずにいいね・リンクのコピー'),
        T('关掉，还在列表原来的位置', 'Close it — you’re right where you were', '閉じても一覧の同じ位置のまま'),
      ],
      translate: [
        T('点「翻译」，评论就地变成你的语言', 'Click “Translate” — the comment switches to your language in place', '「翻訳」でコメントをその場で翻訳'),
        T('标签也能显示译名', 'Tags can show translated names too', 'タグも翻訳名で表示できます'),
      ],
    },
    end: {
      search: T('原版只能搜一个关键词。现在标签、日期、时长都能组合，结果实时刷新。', 'The original takes one keyword. Now tags, dates and length combine, with live results.', '元はキーワード 1 つだけ。今はタグ・日付・長さを組み合わせ、結果もすぐ更新。'),
      studio: T('原版是一整页长表单。现在分四步，边传边填，步骤之间随便跳。', 'The original is one long form. Now it’s four steps you can jump between, filled in while the file uploads.', '元は長いフォーム 1 枚。今は 4 ステップで、アップロード中に入力でき、自由に行き来できます。'),
      subs: T('原版订阅页只能按时间往下翻。现在能排序，按分级、年月、标签筛选，还能换翻页方式。', 'The original is newest-first only. Now you can sort, filter by rating, date and tags, and pick how pages load.', '元は新着順のみ。今は並べ替え、レーティング・年月・タグで絞り込み、ページ送りも選べます。'),
      preview: T('原版要点进视频页才能看详情，看完再返回列表。', 'The original makes you open the video page and come back.', '元は動画ページを開いてから一覧に戻る必要がありました。'),
      translate: T('再点一次换回原文。只有你点「翻译」时，那段文字才会发给谷歌翻译。', 'Click again for the original. Text is sent to Google Translate only when you click.', 'もう一度押すと原文に。テキストは「翻訳」を押したときだけ Google 翻訳に送られます。'),
    },
  };
  const js = `const DEMO = (${demoRuntime.toString()})(${JSON.stringify(data).replace(/<\//g, '<\\/')});`;
  return { html, css: CSS, js, list };
}

// ────────────────────────────────────────────────────────────────────────────
// 运行时（在浏览器里执行）。只能用参数 D 和浏览器自己的东西。
function demoRuntime(D) {
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const Lr = (zh, en, ja) => `<span data-l="zh">${zh}</span><span data-l="en">${en}</span><span data-l="ja">${ja}</span>`;
  const lang = () => html.dataset.lang || 'en';
  const W = $('#dw'), body = $('.dw-body', W), co = $('.co', W), cur = $('.cur', W), path = $('#dw-path', W);
  const V = D.vids, TG = D.tags, ic = D.ic, t = D.t;
  const tagL = (id) => Lr(TG[id][1], TG[id][0], TG[id][2]);
  const tagHit = (id, s) => [TG[id][0], TG[id][1], TG[id][2], ...TG[id][3]].some((k) => k.toLowerCase().includes(s));
  const fill = (s, n) => s.split('{n}').join(n);
  const narrow = () => body.clientWidth <= 620;

  // 输入框占位符、下拉选项跟着页面语言
  const localize = () => {
    const k = { zh: 0, en: 1, ja: 2 }[lang()] ?? 1;
    $$('[data-ph]', W).forEach((el) => { el.placeholder = el.dataset.ph.split('|')[k]; });
    $$('option[data-t]', W).forEach((el) => { el.textContent = el.dataset.t.split('|')[k]; });
  };

  // 卡片重排时平滑移动
  const flip = (box, mutate) => {
    if (reduce) return mutate();
    const kids = [...box.children], first = new Map(kids.map((k) => [k, k.hidden ? null : k.getBoundingClientRect()]));
    mutate();
    kids.forEach((k) => {
      if (k.hidden) return;
      const a = first.get(k), b = k.getBoundingClientRect();
      if (!a) { k.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' }); return; }
      const dx = a.left - b.left, dy = a.top - b.top;
      if (dx || dy) k.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  };
  // 只滚动演示窗口里的滚动区，不动页面
  const reveal = (el) => {
    let sc = el.parentElement;
    while (sc && sc !== body && !(sc.scrollHeight > sc.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
    if (!sc || sc === body) return;
    const r = el.getBoundingClientRect(), s = sc.getBoundingClientRect();
    if (r.top < s.top + 12) sc.scrollTop += r.top - s.top - 12;
    else if (r.bottom > s.bottom - 12) sc.scrollTop += r.bottom - s.bottom + 12 + Math.min(80, s.height / 4);
  };

  // 标签候选：中英日和别名都能匹配
  const sugRows = (box, taken, withEx) => {
    const s = $('.tg-in', box).value.trim().toLowerCase();
    let ids = Object.keys(TG).filter((id) => !taken.includes(id));
    if (s) ids = ids.filter((id) => tagHit(id, s));
    ids = ids.slice(0, 6);
    $('.sg-list', box).innerHTML = (s ? '' : `<div class="sg-h">${t.popular}</div>`) + (ids.length ? ids.map((id) => `<div class="sg" data-tag="${id}"><button type="button" class="sg-in" data-act="inc">${ic.plus}<span>${tagL(id)}</span><small>${Lr(TG[id][0], '', TG[id][0])}</small></button>${withEx ? `<button type="button" class="sg-ex" data-act="exc">${t.exclude}</button>` : ''}</div>`).join('') : `<p class="sg-none">${t.noTags}</p>`);
  };
  const tok = (kind, id) => `<span class="tk ${kind}">${kind === 'exc' ? ic.ban : ''}<span>${tagL(id)}</span><button type="button" data-act="rm" data-val="${kind}:${id}" aria-label="Remove">${ic.x}</button></span>`;
  const typeIn = async (input, text, alive) => {
    input.value = '';
    for (const ch of text) { if (!alive()) return; input.value += ch; input.dispatchEvent(new Event('input', { bubbles: true })); await sleep(170); }
  };
  const pressed = (root, acts, st) => $$(acts.map((a) => `[data-act=${a}]`).join(','), root).forEach((b) => b.setAttribute('aria-pressed', String(st[b.dataset.act] === b.dataset.val)));

  // ── 高级搜索 ──
  const mkSearch = () => {
    const A = $('#dm-search .v-a'), root = $('#dm-search'), grid = $('.iw-grid', A), cards = $$('.iw-card', grid), input = $('.tg-in', A);
    const init = () => ({ open: false, inc: [], exc: [], mode: 'all', date: 'any', dur: 'any', sort: 'rel' });
    let st = init();
    const DAYS = { d1: 1, d7: 7, d30: 30, y1: 365 }, DUR = { s1: [0, 60], s4: [60, 240], mid: [240, 1200], long: [1200, 1e9] };
    const SORT = { rel: (a, b) => a.i - b.i, date: (a, b) => a.days - b.days, views: (a, b) => b.views - a.views, likes: (a, b) => b.likes - a.likes };
    const ok = (v) => {
      if (st.inc.length && !(st.mode === 'all' ? st.inc.every((x) => v.tags.includes(x)) : st.inc.some((x) => v.tags.includes(x)))) return false;
      if (st.exc.some((x) => v.tags.includes(x))) return false;
      if (st.date !== 'any' && v.days > DAYS[st.date]) return false;
      if (st.dur !== 'any' && !(v.sec >= DUR[st.dur][0] && v.sec < DUR[st.dur][1])) return false;
      return true;
    };
    const sum = (val, pre, label) => `<button type="button" class="sm-c" data-act="rm" data-val="${val}">${pre}${label}${ic.x}</button>`;
    const render = (anim) => {
      const apply = () => {
        const hits = cards.map((c) => [c, V[c.dataset.v]]).filter(([, v]) => ok(v)).sort((a, b) => SORT[st.sort](a[1], b[1]));
        cards.forEach((c) => { c.hidden = true; });
        hits.forEach(([c], k) => { c.hidden = false; c.style.order = k; });
        $('.sr-count', A).innerHTML = fill(hits.length ? t.results : t.none, hits.length);
        $('.sp-res', A).innerHTML = fill(t.showN, hits.length);
        $('.sr-empty', A).hidden = !!hits.length;
      };
      anim ? flip(grid, apply) : apply();
      root.classList.toggle('open', st.open);
      $('[data-act=filters]', A).setAttribute('aria-pressed', String(st.open));
      pressed(A, ['sort', 'mode', 'date', 'dur'], st);
      $('.tk-list', A).innerHTML = st.inc.map((id) => tok('inc', id)).join('') + st.exc.map((id) => tok('exc', id)).join('');
      $('.sr-sum', A).innerHTML = [...st.inc.map((id) => sum('inc:' + id, '+ ', tagL(id))), ...st.exc.map((id) => sum('exc:' + id, '− ', tagL(id))),
        st.date !== 'any' ? sum('date', '', t.date[st.date]) : '', st.dur !== 'any' ? sum('dur', '', t.dur[st.dur]) : ''].join('');
      const n = st.inc.length + st.exc.length + (st.date !== 'any') + (st.dur !== 'any') + (st.sort !== 'rel');
      const badge = $('.flt-n', A); badge.hidden = !n; badge.textContent = n;
      sugRows(A, [...st.inc, ...st.exc], true);
    };
    A.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const act = b.dataset.act, val = b.dataset.val;
      if (act === 'filters') st.open = !st.open;
      else if (act === 'close') st.open = false;
      else if (act === 'sort' || act === 'mode' || act === 'date' || act === 'dur') st[act] = val;
      else if (act === 'inc' || act === 'exc') { st[act].push(b.closest('.sg').dataset.tag); input.value = ''; }
      else if (act === 'rm') { const [k, id] = val.split(':'); if (id) st[k] = st[k].filter((x) => x !== id); else st[k] = 'any'; }
      else return;
      render(true);
    });
    input.addEventListener('input', () => sugRows(A, [...st.inc, ...st.exc], true));
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return; // 输入法选字时的回车不算
      e.preventDefault();
      const first = $('.sg', A); if (!first) return;
      (e.shiftKey ? st.exc : st.inc).push(first.dataset.tag); input.value = ''; render(true); paint();
    });
    render(false);
    return {
      id: 'search',
      reset: () => { st = init(); input.value = ''; $('.iw-scroll', A).scrollTop = 0; $('.sp', A).scrollTop = 0; render(false); },
      steps: [
        { el: () => $('[data-act=filters]', A), done: () => st.open, t: D.co.search[0] },
        { el: () => input, pos: 'left', done: () => st.inc.includes('dance'), t: D.co.search[1],
          act: async (go, alive) => { await go(input); await typeIn(input, D.typeDance[lang()] || 'dan', alive); await sleep(400); return $('.sg[data-tag=dance] .sg-in', A); } },
        { el: () => $('.sg[data-tag=mmd] .sg-ex', A), pos: 'left', done: () => st.exc.includes('mmd'), t: D.co.search[2] },
        { el: () => $('[data-act=dur][data-val=s4]', A), pos: 'left', done: () => st.dur === 's4', t: D.co.search[3] },
        { el: () => $('.sp-foot .iw-btn', A), only: narrow, pos: 'above', done: () => !st.open, t: D.co.search[4] },
      ],
    };
  };

  // ── 创作工作台 ──
  const mkStudio = () => {
    const A = $('#dm-studio .v-a'), input = $('.tg-in', A);
    const init = () => ({ step: 1, up: 0, tags: [], rating: 'g', pub: false });
    let st = init(), timer = null;
    const tick = () => { st.up = Math.min(100, st.up + 4); if (st.up >= 100) { clearInterval(timer); timer = null; } render(); };
    const render = () => {
      const started = st.up > 0, doneUp = st.up >= 100;
      const ok = [started, true, st.tags.length > 0, st.pub];
      $$('.st-steps li', A).forEach((li, k) => { li.classList.toggle('on', k + 1 === st.step); li.classList.toggle('ok', ok[k] && k + 1 !== st.step); });
      $$('.st-pane', A).forEach((p) => { p.hidden = +p.dataset.step !== st.step; });
      $('.st-drop', A).hidden = started; $('.st-file', A).hidden = !started;
      $$('.st-bar i', A).forEach((i) => { i.style.width = st.up + '%'; });
      $$('.st-pct', A).forEach((e) => { e.textContent = st.up + '%'; });
      $('.st-strip', A).hidden = !started || st.step === 1;
      $('.st-strip', A).classList.toggle('ok', doneUp);
      $('.st-msg', A).innerHTML = doneUp ? t.upDone : t.upMsg;
      $('.st-draft', A).hidden = !started;
      $('.tk-list', A).innerHTML = st.tags.map((id) => tok('inc', id)).join('');
      pressed(A, ['rating'], st);
      const f = $('[data-k=file]', A); f.className = doneUp ? 'ok' : started ? 'wait' : '';
      $('.st-chk-file', A).innerHTML = doneUp ? 'hoodie_groove_take3.mp4' : started ? fill(t.uploading, st.up) : '—';
      $('[data-k=tags]', A).className = st.tags.length ? 'ok' : '';
      $('.st-chk-tags', A).innerHTML = st.tags.length ? st.tags.map(tagL).join('、') : t.noTagsYet;
      const pub = $('.st-pub', A); pub.disabled = !doneUp; pub.hidden = st.pub;
      $('.st-wait', A).hidden = doneUp || st.pub;
      $('.st-done', A).hidden = !st.pub;
      $('[data-act=back]', A).disabled = st.step === 1;
      $('[data-act=next]', A).disabled = st.step === 4;
    };
    A.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const act = b.dataset.act;
      if (act === 'pick') { if (!st.up) { st.up = 1; timer = setInterval(tick, 220); } }
      else if (act === 'go') st.step = +b.dataset.val;
      else if (act === 'next') st.step = Math.min(4, st.step + 1);
      else if (act === 'back') st.step = Math.max(1, st.step - 1);
      else if (act === 'inc') { st.tags.push(b.closest('.sg').dataset.tag); input.value = ''; }
      else if (act === 'rm') { const id = b.dataset.val.split(':')[1]; st.tags = st.tags.filter((x) => x !== id); }
      else if (act === 'rating') st.rating = b.dataset.val;
      else if (act === 'publish') { if (st.up >= 100) st.pub = true; }
      else return;
      render(); sugRows(A, st.tags, false);
    });
    input.addEventListener('input', () => sugRows(A, st.tags, false));
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return; // 输入法选字时的回车不算
      e.preventDefault();
      const first = $('.sg', A); if (!first) return;
      st.tags.push(first.dataset.tag); input.value = ''; render(); sugRows(A, st.tags, false); paint();
    });
    render(); sugRows(A, st.tags, false);
    const stepBtn = (n) => $(`.st-steps li:nth-child(${n}) button`, A);
    return {
      id: 'studio',
      reset: () => { clearInterval(timer); timer = null; st = init(); input.value = ''; render(); sugRows(A, st.tags, false); },
      steps: [
        { el: () => $('.st-drop', A), done: () => st.up > 0, t: D.co.studio[0] },
        { el: () => stepBtn(3), done: () => st.step === 3, t: D.co.studio[1] },
        { el: () => input, pos: 'above', done: () => st.tags.includes('dance'), t: D.co.studio[2],
          act: async (go, alive) => { await go(input); await typeIn(input, D.typeDance[lang()] || 'dan', alive); await sleep(400); return $('.sg[data-tag=dance] .sg-in', A); } },
        { el: () => stepBtn(4), done: () => st.step === 4, t: D.co.studio[3] },
        { el: () => $('.st-pub', A), done: () => st.pub, t: D.co.studio[4], wait: async (alive) => { while (alive() && st.up < 100) await sleep(200); } },
      ],
    };
  };

  // ── 订阅筛选 ──
  const mkSubs = () => {
    const A = $('#dm-subs .v-a'), grid = $('.iw-grid', A), cards = $$('.iw-card', grid);
    const init = () => ({ sort: 'date', rating: 'all', y: 'any', m: 'any', tags: [], mode: 'pages' });
    let st = init();
    const pop = (v) => v.views + v.likes * 20;
    const SORT = { date: (a, b) => a.days - b.days, trending: (a, b) => b.likes / (b.days + 1) - a.likes / (a.days + 1), popularity: (a, b) => pop(b) - pop(a), likes: (a, b) => b.likes - a.likes || b.views - a.views, views: (a, b) => b.views - a.views };
    const ok = (v) => (st.rating === 'all' || v.r === (st.rating === 'general' ? 'g' : 'e'))
      && (st.y === 'any' || String(v.y) === st.y) && (st.m === 'any' || String(v.m) === st.m) && st.tags.every((x) => v.tags.includes(x));
    const render = (anim) => {
      const apply = () => {
        const hits = cards.map((c) => [c, V[c.dataset.v]]).filter(([, v]) => ok(v)).sort((a, b) => SORT[st.sort](a[1], b[1]));
        const shown = st.mode === 'pages' ? hits.slice(0, 8) : hits;
        cards.forEach((c) => { c.hidden = true; });
        shown.forEach(([c], k) => { c.hidden = false; c.style.order = k; });
        $('.sr-empty', A).hidden = !!hits.length;
        const cnt = $('.sd-cnt', A); cnt.innerHTML = fill(hits.length ? t.results : t.none, hits.length);
        if (anim && !reduce) cnt.animate([{ transform: 'scale(1.15)' }, { transform: 'none' }], { duration: 300, easing: 'ease-out' });
      };
      anim ? flip(grid, apply) : apply();
      pressed(A, ['sort', 'rating', 'mode'], st);
      $$('[data-act=tag]', A).forEach((b) => b.setAttribute('aria-pressed', String(st.tags.includes(b.dataset.val))));
      $('.pg', A).hidden = st.mode !== 'pages';
      $('.pg-inf', A).hidden = st.mode === 'pages';
    };
    A.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b || b.tagName === 'SELECT') return;
      const act = b.dataset.act, val = b.dataset.val;
      if (act === 'sort' || act === 'rating' || act === 'mode') st[act] = val;
      else if (act === 'tag') st.tags = st.tags.includes(val) ? st.tags.filter((x) => x !== val) : [...st.tags, val];
      else return;
      render(true);
    });
    $$('select', A).forEach((s) => s.addEventListener('change', () => { st[s.dataset.act] = s.value; render(true); paint(); }));
    render(false);
    return {
      id: 'subs',
      reset: () => { st = init(); $$('select', A).forEach((s) => { s.value = 'any'; }); $('.iw-scroll', A).scrollTop = 0; render(false); },
      steps: [
        { el: () => $('[data-act=sort][data-val=likes]', A), pos: 'left', done: () => st.sort === 'likes', t: D.co.subs[0] },
        { el: () => $('[data-act=rating][data-val=general]', A), pos: 'left', done: () => st.rating === 'general', t: D.co.subs[1] },
        { el: () => $('[data-act=tag][data-val=dance]', A), pos: 'left', done: () => st.tags.includes('dance'), t: D.co.subs[2] },
        { el: () => $('[data-act=mode][data-val=inf]', A), pos: 'left', done: () => st.mode === 'inf', t: D.co.subs[3] },
      ],
    };
  };

  // ── 卡片预览 ──
  const mkPreview = () => {
    const A = $('#dm-preview .v-a'), pv = $('.pv', A);
    const init = () => ({ open: null, liked: false, copied: false });
    let st = init(), tipT = null;
    const stat = (i, n) => `<span>${i}${n}</span>`;
    const openPv = (id) => {
      const v = V[id], p = D.pv[id];
      st.open = id; st.liked = false;
      const cov = $('.pv-cov', A); cov.style.setProperty('--a', p.h[0]); cov.style.setProperty('--b', p.h[1]);
      $('.pv-au .iw-av', A).style.setProperty('--a', p.h[0]);
      $('.pv-dur', A).innerHTML = ic.clock + p.d;
      $('.pv-t', A).innerHTML = p.t; $('.pv-a', A).innerHTML = p.a; $('.pv-h', A).textContent = '@' + p.a.toLowerCase().replace(/[^a-z0-9]+/g, '');
      $('.pv-stats', A).innerHTML = stat(ic.eye, v.views) + stat(ic.heart, v.likes) + stat(ic.chat, v.com) + stat(ic.clock, p.d) + stat(ic.cal, p.ago);
      $('.pv-d', A).innerHTML = p.desc;
      $('.pv-tags', A).innerHTML = v.tags.map((x) => `<span>${tagL(x)}</span>`).join('');
    };
    const render = () => {
      pv.hidden = !st.open;
      if (!st.open) return;
      const v = V[st.open];
      $('.pv-like', A).setAttribute('aria-pressed', String(st.liked));
      $('.pv-ln', A).textContent = v.likes + (st.liked ? 1 : 0);
    };
    A.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const act = b.dataset.act;
      if (act === 'more') openPv(b.closest('.iw-card').dataset.v);
      else if (act === 'close') st.open = null;
      else if (act === 'like') st.liked = !st.liked;
      else if (act === 'copy') { st.copied = true; const c = $('.pv-copy', A); c.classList.add('done'); clearTimeout(tipT); tipT = setTimeout(() => c.classList.remove('done'), 1400); }
      else return;
      render();
    });
    render();
    return {
      id: 'preview',
      reset: () => { st = init(); render(); },
      steps: [
        { el: () => $('.iw-card [data-act=more]', A), done: () => !!st.open, t: D.co.preview[0] },
        { el: () => $('.pv-like', A), done: () => st.liked, t: D.co.preview[1] },
        { el: () => $('.pv-x', A), done: () => !st.open && st.liked, t: D.co.preview[2] },
      ],
    };
  };

  // ── 原地翻译 ──
  const mkTranslate = () => {
    const A = $('#dm-translate .v-a');
    const init = () => ({ tr: {}, tv: 'orig' });
    let st = init();
    const render = () => {
      $$('.cm', A).forEach((c) => { c.dataset.s = st.tr[c.dataset.c] || ''; });
      pressed(A, ['tv'], st);
      $('.tr-tags', A).dataset.tv = st.tv;
    };
    A.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      if (b.dataset.act === 'tr') {
        const id = b.closest('.cm').dataset.c;
        if (st.tr[id] === 'done') delete st.tr[id];
        else if (st.tr[id] !== 'ing') { st.tr[id] = 'ing'; setTimeout(() => { if (st.tr[id] === 'ing') { st.tr[id] = 'done'; render(); paint(); } }, reduce ? 0 : 650); }
      } else if (b.dataset.act === 'tv') st.tv = b.dataset.val;
      else return;
      render();
    });
    render();
    const foreign = () => $$('.cm', A).find((c) => c.dataset.src !== lang()) || $('.cm', A);
    return {
      id: 'translate',
      reset: () => { st = init(); render(); },
      steps: [
        { el: () => $('.cm-tr', foreign()), done: () => st.tr[foreign().dataset.c] === 'done', t: D.co.translate[0] },
        { el: () => $('[data-act=tv][data-val=tr]', A), done: () => st.tv === 'tr', t: D.co.translate[1] },
      ],
    };
  };

  // ── 指引气泡和演示光标 ──
  const demos = {};
  [mkSearch(), mkStudio(), mkSubs(), mkPreview(), mkTranslate()].forEach((m) => { m.passed = new Set(); demos[m.id] = m; });
  let active = demos[D.order[0]], ab = 'after', playing = false, hot = null, interacted = false, cx = null;
  const dismissed = new Set();
  // 只在窄窗口才有的步骤（only）在宽窗口里不算；走过的步骤记住，之后状态变回去也不倒退
  const live = (m) => m.steps.filter((s) => !s.only || s.only());
  const stepIdx = (m) => { const ls = live(m); let i = 0; while (i < ls.length && (m.passed.has(ls[i]) || ls[i].done())) { m.passed.add(ls[i]); i++; } return i; };
  const setUrl = () => { path.textContent = active.url[ab === 'after' ? 0 : 1]; };
  Object.values(demos).forEach((m) => { m.url = $('#dm-' + m.id).dataset.url.split('|'); });

  const place = (target, pos) => {
    const br = body.getBoundingClientRect(), bw = co.offsetWidth, bh = co.offsetHeight, ar = $('.co-ar', co);
    let top, left, side = '';
    if (target) {
      const r = target.getBoundingClientRect();
      const cxr = r.left - br.left + r.width / 2, cyr = r.top - br.top + r.height / 2;
      const below = r.bottom - br.top + 12, above = r.top - br.top - bh - 12, lx = r.left - br.left - bw - 14;
      if (pos === 'left' && lx >= 8) { side = 'left'; left = lx; top = Math.min(Math.max(cyr - bh / 2, 8), br.height - bh - 8); }
      else if (pos === 'above' && above >= 8) { side = 'above'; top = above; }
      else if (below + bh <= br.height - 8) { side = 'below'; top = below; }
      else if (above >= 8) { side = 'above'; top = above; }
      else { top = br.height - bh - 10; }
      if (side !== 'left') left = Math.min(Math.max(cxr - bw / 2, 8), br.width - bw - 8);
      ar.style.left = side === 'left' ? '' : Math.min(Math.max(cxr - left, 16), bw - 16) + 'px';
      ar.style.top = side === 'left' ? Math.min(Math.max(cyr - top, 16), bh - 16) + 'px' : '';
    } else { top = br.height - bh - 14; left = br.width < 560 ? (br.width - bw) / 2 : br.width - bw - 14; }
    co.dataset.side = side;
    co.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  };
  const paint = () => {
    if (hot) { hot.classList.remove('co-hot'); hot = null; }
    if (ab !== 'after' || dismissed.has(active.id)) { co.hidden = true; return; }
    const ls = live(active), n = ls.length, i = stepIdx(active), end = i >= n;
    const ids = D.order, last = ids.indexOf(active.id) === ids.length - 1;
    co.hidden = false;
    co.classList.toggle('end', end);
    const top = `<div class="co-top"><span class="co-n">${end ? t.done : `${i + 1} / ${n}`}</span><button class="co-x" type="button" data-co="x" aria-label="Close">${ic.x}</button></div>`;
    co.innerHTML = top + (end
      ? `<p class="co-t">${D.end[active.id]}</p><div class="co-act"><button type="button" class="co-b" data-co="again">${ic.reset}${t.again}</button><button type="button" class="co-b pri" data-co="next">${last ? t.first : t.next}${ic.arrow}</button></div>`
      : `<p class="co-t">${ls[i].t}</p><div class="co-act">${playing ? `<span class="co-live"><i></i>${t.playing}</span><button type="button" class="co-b" data-co="stop">${t.stop}</button>` : `<button type="button" class="co-b pri" data-co="play">${ic.play}${t.play}</button>`}</div>`) + '<i class="co-ar"></i>';
    let target = end ? null : ls[i].el();
    if (target && !target.getClientRects().length) target = null;
    if (target) { reveal(target); target.classList.add('co-hot'); hot = target; }
    place(target, end ? '' : ls[i].pos);
  };
  const go = async (el) => {
    reveal(el);
    const br = body.getBoundingClientRect(), r = el.getBoundingClientRect();
    const x = r.left - br.left + Math.min(r.width / 2, 48), y = r.top - br.top + r.height / 2;
    if (cx === null) { cur.style.transition = 'none'; cur.style.transform = `translate(${br.width * 0.55}px, ${br.height - 24}px)`; void cur.offsetWidth; cur.style.transition = ''; }
    cur.classList.add('show');
    cur.style.transform = `translate(${x}px, ${y}px)`; cx = x;
    await sleep(reduce ? 0 : 720);
  };
  const tap = async () => { cur.classList.remove('tap'); void cur.offsetWidth; cur.classList.add('tap'); await sleep(140); };
  const play = async () => {
    if (playing) return;
    playing = true; interacted = true;
    const m = active, alive = () => playing && m === active && ab === 'after';
    paint();
    try {
      for (let guard = 0; guard < 16 && alive(); guard++) {
        const i = stepIdx(m), ls = live(m); if (i >= ls.length) break;
        const s = ls[i];
        if (s.wait) { await s.wait(alive); if (!alive()) break; }
        const el = s.act ? await s.act(go, alive) : s.el();
        if (!alive()) break;
        if (el) { await go(el); if (!alive()) break; await tap(); el.click(); }
        await sleep(850);
        paint();
      }
    } finally { playing = false; cur.classList.remove('show'); cx = null; paint(); }
  };
  const stop = () => { playing = false; };
  const show = (id) => {
    if (!demos[id]) return;
    stop(); active = demos[id];
    $$('.dm', W).forEach((el) => el.classList.toggle('on', el.id === 'dm-' + id));
    setUrl(); paint();
  };
  const setAB = (v) => {
    stop(); ab = v; W.dataset.ab = v;
    $$('.dw-ab button', W).forEach((b) => b.setAttribute('aria-checked', String(b.dataset.ab === v)));
    setUrl(); paint();
  };

  co.addEventListener('click', (e) => {
    const b = e.target.closest('[data-co]'); if (!b) return;
    e.stopPropagation();
    const k = b.dataset.co;
    if (k === 'play') play();
    else if (k === 'stop') stop();
    else if (k === 'x') { stop(); dismissed.add(active.id); paint(); }
    else if (k === 'again') { active.reset(); active.passed.clear(); paint(); }
    else if (k === 'next') { const ids = D.order; W.dispatchEvent(new CustomEvent('demo:nav', { detail: ids[(ids.indexOf(active.id) + 1) % ids.length] })); }
  });
  $$('.dw-ab button', W).forEach((b) => b.addEventListener('click', () => { interacted = true; setAB(b.dataset.ab); }));
  $('[data-re]', W).addEventListener('click', () => { stop(); interacted = true; active.reset(); active.passed.clear(); dismissed.delete(active.id); if (ab !== 'after') setAB('after'); else paint(); });
  body.addEventListener('click', () => setTimeout(paint, 0));
  W.addEventListener('pointerdown', (e) => { if (e.isTrusted && !e.target.closest('.co')) { interacted = true; stop(); } }, true);
  body.addEventListener('scroll', () => { if (hot) place(hot, live(active)[stepIdx(active)]?.pos); }, true);
  new ResizeObserver(() => paint()).observe(body);
  new MutationObserver(() => { localize(); paint(); }).observe(html, { attributes: true, attributeFilter: ['data-lang'] });
  localize();
  setUrl();
  paint();
  // 第一次滚到演示窗口时自动演示一遍（用户已经动过、或者偏好减少动画时不播）
  if (!reduce) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setTimeout(() => { if (!interacted && !playing) play(); }, 900);
    }, { threshold: 0.6 });
    io.observe(W);
  }
  return { show, stop, el: W };
}

const CSS = `
  /* ── 演示窗口 ── */
  .dw { position: relative; border-radius: 14px; overflow: hidden; border: 1px solid var(--line-2); background: var(--iw-bg); box-shadow: var(--shadow); color: var(--iw-tx); font: 13px/1.45 var(--sans); text-align: left; }
  .dw button { font: inherit; color: inherit; }
  .dw [hidden] { display: none !important; }
  .dw svg.q { display: block; flex: none; }
  .dw-bar { height: 44px; display: flex; align-items: center; gap: 8px; padding: 0 8px 0 14px; background: var(--bg-1); border-bottom: 1px solid var(--line); color: var(--fg); }
  .dw-dots { display: flex; gap: 6px; margin-right: 6px; }
  .dw-dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--line-3); }
  .dw-url { flex: 1; min-width: 0; height: 28px; display: flex; align-items: center; gap: 6px; padding: 0 10px; border-radius: 8px; background: var(--bg); border: 1px solid var(--line); color: var(--fg-3); font: 12px/1 var(--mono); white-space: nowrap; overflow: hidden; }
  .dw-url > span { color: var(--fg-2); }
  .dw-url b { font-weight: 400; overflow: hidden; text-overflow: ellipsis; margin-left: -6px; }
  .dw-ab { display: flex; padding: 3px; border-radius: 9px; background: var(--bg); border: 1px solid var(--line-2); flex: none; }
  .dw-ab button { height: 26px; padding: 0 11px; border: 0; border-radius: 6px; background: none; color: var(--fg-3); font-size: 12.5px; line-height: 1; cursor: pointer; white-space: nowrap; transition: background .2s, color .2s; }
  .dw-ab button:hover { color: var(--fg); }
  .dw-ab button[aria-checked="true"] { background: var(--bg-3); color: var(--fg); }
  .dw-ab button[data-ab="after"][aria-checked="true"] { background: var(--iw-ac); color: #fff; }
  .dw-re { flex: none; width: 32px; height: 32px; display: grid; place-items: center; border: 0; border-radius: 8px; background: none; color: var(--fg-3); cursor: pointer; }
  .dw-re:hover { color: var(--fg); background: var(--bg-2); }
  .dw-body { position: relative; height: 560px; overflow: hidden; container-type: inline-size; }
  .dm { position: absolute; inset: 0; display: none; }
  .dm.on { display: block; animation: dmIn .35s var(--ease); }
  @keyframes dmIn { from { opacity: 0; } }
  .v { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .dw[data-ab="before"] .v-a, .dw[data-ab="after"] .v-b { display: none; }
  .dw[data-ab="before"] .v-b { animation: dmIn .3s var(--ease); }

  /* ── 迷你 Iwara ── */
  .iw-hd { flex: none; height: 50px; display: flex; align-items: center; gap: 12px; padding: 0 14px; background: var(--iw-hd); border-bottom: 1px solid var(--iw-line); color: var(--iw-tx); }
  .iw-logo { display: flex; align-items: center; gap: 7px; font-size: 16px; letter-spacing: -.01em; }
  .iw-logo b { font-weight: 600; }
  .iw-sb { flex: 1; max-width: 460px; height: 34px; margin: 0 auto; display: flex; align-items: center; gap: 2px; padding: 0 3px 0 0; border-radius: 8px; background: var(--iw-card); border: 1px solid var(--iw-line); min-width: 0; }
  .iw-sb-s { justify-content: space-between; padding: 0 10px; color: var(--iw-dim); max-width: 380px; }
  .sb-type { display: flex; align-items: center; gap: 5px; height: 100%; padding: 0 10px; border-right: 1px solid var(--iw-line); color: var(--iw-tx); font-size: 12.5px; white-space: nowrap; }
  .sb-q { flex: 1; min-width: 0; padding: 0 10px; color: var(--iw-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sb-q.on { color: var(--iw-tx); }
  .sb-ic { position: relative; width: 28px; height: 28px; display: grid; place-items: center; border: 0; border-radius: 6px; background: none; color: var(--iw-dim); cursor: pointer; flex: none; }
  .sb-ic:hover, .sb-ic[aria-pressed="true"] { background: var(--iw-chip); color: var(--iw-tx); }
  .flt-n { position: absolute; top: -3px; right: -3px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px; background: var(--iw-ac); color: #fff; font: 600 10px/16px var(--sans); text-align: center; }
  .sb-go { width: 30px; height: 28px; display: grid; place-items: center; border-radius: 6px; background: var(--iw-ac); color: #fff; flex: none; }
  .iw-ics { display: flex; align-items: center; gap: 14px; color: var(--iw-dim); margin-left: auto; }
  .iw-me { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #5ad1c0, #2b8a7e); box-shadow: 0 0 0 2px var(--iw-hd), 0 0 0 3px color-mix(in srgb, #e85d9a 60%, transparent); }
  .iw-row { flex: 1; min-height: 0; display: flex; position: relative; }
  .iw-rail { flex: none; width: 52px; display: flex; flex-direction: column; align-items: center; gap: 16px; padding-top: 16px; background: var(--iw-hd); border-right: 1px solid var(--iw-line); color: var(--iw-dim); }
  .iw-rail svg:nth-child(4) { color: #e85d9a; }
  .iw-scroll { flex: 1; min-width: 0; overflow: auto; padding: 16px 18px 72px; scrollbar-width: thin; }
  .iw-h1 { margin: 2px 0 14px; font-size: 20px; font-weight: 650; letter-spacing: -.02em; }
  .iw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px 12px; }
  .iw-card { min-width: 0; }
  .iw-card[hidden] { display: none; }
  .iw-th { position: relative; aspect-ratio: 16 / 10; border-radius: 6px; overflow: hidden; background: linear-gradient(160deg, hsl(var(--a) 50% 55%), hsl(var(--b) 45% 30%)); }
  .iw-th::before { content: ""; position: absolute; inset: 42% -10% 0; background: hsl(var(--b) 42% 22% / .8); clip-path: polygon(0 62%, 28% 14%, 50% 50%, 72% 0, 100% 46%, 100% 100%, 0 100%); }
  .iw-th::after { content: ""; position: absolute; width: 24%; aspect-ratio: 1; border-radius: 50%; right: 16%; top: 14%; background: rgba(255,255,255,.3); }
  .st { position: absolute; z-index: 1; top: 5px; display: flex; align-items: center; gap: 3px; padding: 1px 5px; border-radius: 3px; background: rgba(0,0,0,.72); color: #fff; font: 600 10px/1.5 var(--sans); }
  .st.l { left: 5px; } .st.r { right: 5px; } .st.d { top: auto; bottom: 5px; right: 5px; } .st.e { top: auto; bottom: 5px; left: 5px; background: #d63a4a; }
  .iw-card .t { display: block; margin-top: 6px; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .iw-by { display: flex; align-items: center; gap: 7px; margin-top: 4px; }
  .iw-av { flex: none; width: 22px; height: 22px; border-radius: 50%; background: radial-gradient(circle at 50% 38%, rgba(255,255,255,.85) 0 22%, transparent 23%), radial-gradient(circle at 50% 110%, rgba(255,255,255,.85) 0 42%, transparent 43%), hsl(var(--a) 45% 52%); }
  .iw-by > span { flex: 1; min-width: 0; line-height: 1.25; }
  .iw-by em { display: block; font-style: normal; color: var(--iw-ac); font-size: 11.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .iw-by small { color: var(--iw-dim); font-size: 11px; }
  .iw-more { flex: none; width: 26px; height: 26px; display: grid; place-items: center; border: 0; border-radius: 6px; background: var(--iw-chip); color: var(--iw-tx); cursor: pointer; }
  .iw-more:hover { background: var(--iw-ac); color: #fff; }
  .iw-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .iw-chip { display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 11px; border: 0; border-radius: 6px; background: var(--iw-chip); color: var(--iw-tx); font-size: 12.5px; line-height: 1; cursor: pointer; white-space: nowrap; transition: background .15s, color .15s; }
  .iw-chips.sm .iw-chip { height: 26px; padding: 0 9px; font-size: 12px; }
  .iw-chip:hover { background: color-mix(in srgb, var(--iw-ac) 18%, var(--iw-chip)); }
  .iw-chip[aria-pressed="true"] { background: var(--iw-ac); color: #fff; }
  .iw-seg { display: flex; padding: 3px; gap: 2px; border-radius: 8px; background: var(--iw-chip); }
  .iw-seg > button { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 5px; height: 28px; padding: 0 10px; border: 0; border-radius: 6px; background: none; color: var(--iw-dim); font-size: 12.5px; line-height: 1; cursor: pointer; white-space: nowrap; }
  .iw-seg > button[aria-pressed="true"] { background: var(--iw-card); color: var(--iw-tx); font-weight: 600; box-shadow: 0 1px 2px rgba(0,0,0,.12); }
  .iw-seg.sm { display: inline-flex; } .iw-seg.sm > button { height: 26px; font-size: 12px; }
  .iw-seg.xs { display: inline-flex; } .iw-seg.xs > button { height: 22px; padding: 0 8px; font-size: 11.5px; }
  .iw-h { display: flex; align-items: center; gap: 6px; margin: 0 0 8px; font-size: 12.5px; font-weight: 600; color: var(--iw-tx); }
  .iw-h svg { color: var(--iw-dim); }
  .iw-h.sm { margin-top: 12px; font-weight: 400; color: var(--iw-dim); font-size: 12px; }
  .iw-lb { display: block; margin: 14px 0 6px; font-size: 12.5px; font-weight: 600; }
  .iw-lb:first-child { margin-top: 0; }
  .iw-in { display: block; width: 100%; height: 34px; padding: 0 11px; border-radius: 7px; border: 1px solid var(--iw-line); background: var(--iw-bg); color: var(--iw-tx); font: 13px/1 var(--sans); outline: none; }
  .iw-in:focus { border-color: var(--iw-ac); box-shadow: 0 0 0 3px color-mix(in srgb, var(--iw-ac) 22%, transparent); }
  .iw-hint { margin: 6px 0 0; font-size: 11.5px; color: var(--iw-dim); }
  .iw-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 34px; padding: 0 16px; border: 0; border-radius: 7px; font-size: 13px; font-weight: 600; line-height: 1; cursor: pointer; white-space: nowrap; }
  .iw-btn.pri { background: var(--iw-ac); color: #fff; }
  .iw-btn.dark { background: var(--iw-tx); color: var(--iw-bg); }
  .iw-btn.ghost { background: var(--iw-card); color: var(--iw-tx); border: 1px solid var(--iw-line); font-weight: 500; }
  .iw-btn.sm { height: 28px; padding: 0 10px; font-size: 12px; }
  .iw-btn:disabled, .iw-btn.dis { opacity: .45; cursor: default; }
  .iw-sel { height: 30px; padding: 0 8px; border-radius: 6px; border: 1px solid var(--iw-line); background: var(--iw-card); color: var(--iw-tx); font: 12px var(--sans); min-width: 0; flex: 1; }
  .sr-empty { margin: 30px 0; text-align: center; color: var(--iw-dim); }
  .v-note { position: absolute; z-index: 5; left: 14px; right: 14px; bottom: 14px; margin: 0 auto; width: max-content; max-width: calc(100% - 28px); display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 10px; background: rgba(18,18,18,.9); color: #eee; font-size: 12.5px; line-height: 1.45; box-shadow: 0 8px 24px -8px rgba(0,0,0,.5); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
  .v-note svg { color: #f5a524; }
  .v-note b { color: #fff; margin-right: 2px; }
  .ob-tabs { display: flex; gap: 4px; margin-bottom: 14px; border-bottom: 1px solid var(--iw-line); }
  .ob-tabs > span { padding: 8px 12px; color: var(--iw-dim); font-size: 13px; border-bottom: 2px solid transparent; margin-bottom: -1px; }
  .ob-tabs > span.on { color: var(--iw-tx); border-color: var(--iw-ac); font-weight: 600; }
  .ob-tabs.sm { margin-bottom: 10px; }

  /* 搜索 */
  .sr-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; min-height: 30px; margin-bottom: 12px; }
  .sr-count { font-size: 13px; font-weight: 600; }
  .sr-sum { display: flex; flex-wrap: wrap; gap: 6px; }
  .sm-c { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 6px 0 9px; border: 1px solid var(--iw-line); border-radius: 999px; background: var(--iw-card); font-size: 11.5px; line-height: 1; cursor: pointer; animation: dmIn .25s; }
  .sm-c svg { opacity: .6; }
  .sp { flex: none; width: 310px; display: none; overflow: auto; padding: 14px 16px 60px; background: var(--iw-card); border-left: 1px solid var(--iw-line); scrollbar-width: thin; }
  #dm-search.open .sp { display: block; animation: spIn .25s var(--ease); }
  @keyframes spIn { from { opacity: 0; transform: translateX(16px); } }
  .sp-hd { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
  .sp-hd b { font-size: 15px; }
  .sp-in { display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 999px; background: var(--iw-chip); color: var(--iw-dim); font-size: 11.5px; margin-right: auto; }
  .sp-sec { padding: 12px 0; border-top: 1px solid var(--iw-line); }
  .sp-foot { display: none; }
  .tk-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .tk-list:not(:empty) { margin-bottom: 8px; }
  .tk { display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 4px 0 9px; border-radius: 6px; font-size: 12px; animation: dmIn .25s; background: color-mix(in srgb, var(--iw-ac) 16%, transparent); color: var(--iw-ac2); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--iw-ac) 55%, transparent); }
  .tk.exc { background: color-mix(in srgb, var(--iw-bad) 14%, transparent); color: var(--iw-bad); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--iw-bad) 50%, transparent); }
  .tk.exc > span { text-decoration: line-through; }
  .tk button { width: 20px; height: 20px; display: grid; place-items: center; border: 0; border-radius: 4px; background: none; color: inherit; cursor: pointer; }
  .sg-list { margin-top: 8px; display: flex; flex-direction: column; gap: 2px; }
  .sg-h { font-size: 11px; color: var(--iw-dim); margin: 2px 0 4px; }
  .sg { display: flex; align-items: center; gap: 4px; border-radius: 6px; }
  .sg:hover { background: var(--iw-chip); }
  .sg-in { flex: 1; min-width: 0; display: flex; align-items: center; gap: 7px; height: 30px; padding: 0 8px; border: 0; border-radius: 6px; background: none; cursor: pointer; text-align: left; font-size: 12.5px; }
  .sg-in svg { color: var(--iw-ac); }
  .sg-in small { color: var(--iw-dim); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sg-ex { flex: none; height: 24px; padding: 0 8px; margin-right: 3px; border: 1px solid var(--iw-line); border-radius: 5px; background: var(--iw-card); color: var(--iw-dim); font-size: 11.5px; cursor: pointer; }
  .sg-ex:hover { color: var(--iw-bad); border-color: var(--iw-bad); }
  .sg-none { margin: 4px 0; color: var(--iw-dim); font-size: 12px; }

  /* 创作工作台 */
  .iw-scroll.wz > * { max-width: 720px; }
  .st-top { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
  .st-draft { display: inline-flex; align-items: center; gap: 5px; margin-left: auto; color: var(--iw-ac2); font-size: 12px; animation: dmIn .3s; }
  .st-draft + .iw-btn, .st-draft[hidden] + .iw-btn { margin-left: auto; }
  .st-draft:not([hidden]) + .iw-btn { margin-left: 0; }
  .st-steps { list-style: none; margin: 0 0 16px; padding: 0; display: flex; align-items: center; }
  .st-steps li { flex: 1; display: flex; align-items: center; }
  .st-steps li + li::before { content: ""; flex: 1; height: 1px; margin: 0 10px; background: var(--iw-line); }
  .st-steps button { display: flex; align-items: center; gap: 7px; padding: 4px 6px 4px 4px; border: 0; border-radius: 999px; background: none; color: var(--iw-dim); cursor: pointer; font-size: 12.5px; white-space: nowrap; }
  .st-steps button:hover { background: var(--iw-chip); }
  .st-steps i { position: relative; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--iw-line); font: 600 11px/1 var(--sans); background: var(--iw-card); }
  .st-steps i svg.q { display: none; }
  .st-steps li.on button { color: var(--iw-tx); font-weight: 600; }
  .st-steps li.on i { background: var(--iw-ac); border-color: var(--iw-ac); color: #fff; }
  .st-steps li.ok i { border-color: var(--iw-ac); color: var(--iw-ac); }
  .st-steps li.ok i span { display: none; } .st-steps li.ok i svg.q { display: block; }
  .st-strip { display: flex; align-items: center; gap: 8px; margin: -4px 0 14px; padding: 8px 12px; border-radius: 8px; background: var(--iw-card); border: 1px solid var(--iw-line); font-size: 12px; animation: dmIn .3s; }
  .st-strip .st-fn { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 30%; }
  .st-strip .st-bar { flex: 1; min-width: 40px; }
  .st-strip small { color: var(--iw-dim); white-space: nowrap; }
  .st-strip.ok small { color: var(--iw-ac2); }
  .st-bar { display: block; height: 5px; border-radius: 3px; background: var(--iw-chip); overflow: hidden; }
  .st-bar i { display: block; height: 100%; width: 0; background: var(--iw-ac); transition: width .22s linear; }
  .st-pct { font: 600 11.5px/1 var(--mono); min-width: 34px; text-align: right; }
  .st-pane { min-height: 260px; animation: dmIn .3s; }
  .st-drop { width: 100%; height: 170px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; border: 1.5px dashed var(--iw-line); border-radius: 10px; background: var(--iw-card); cursor: pointer; font-size: 13px; }
  .st-drop:hover { border-color: var(--iw-ac); }
  .st-up { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 10px; border: 1px solid var(--iw-line); background: var(--iw-bg); }
  .st-file { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 10px; background: var(--iw-card); border: 1px solid var(--iw-line); animation: dmIn .3s; }
  .st-fi { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 8px; background: color-mix(in srgb, var(--iw-ac) 16%, transparent); color: var(--iw-ac); flex: none; }
  .st-fm { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .st-fm b { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .st-fm small { color: var(--iw-dim); font-size: 11.5px; }
  .st-req { list-style: none; margin: 12px 0 0; padding: 0; border: 1px solid var(--iw-line); border-radius: 8px; background: var(--iw-card); color: var(--iw-dim); font-size: 12px; }
  .st-req li { padding: 8px 12px; } .st-req li + li { border-top: 1px solid var(--iw-line); }
  .st-ed { border: 1px solid var(--iw-line); border-radius: 8px; background: var(--iw-bg); overflow: hidden; }
  .st-tb { display: flex; align-items: center; gap: 14px; padding: 7px 10px; border-bottom: 1px solid var(--iw-line); color: var(--iw-dim); font: 600 13px/1 Georgia, serif; }
  .st-tb i { font-style: italic; }
  .st-edc { padding: 10px 12px; min-height: 80px; font-size: 13px; }
  .st-caret { display: inline-block; width: 1.5px; height: 1.1em; margin-left: 1px; vertical-align: -2px; background: var(--iw-ac); animation: blink 1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  .st-chk { list-style: none; margin: 0 0 16px; padding: 0; border: 1px solid var(--iw-line); border-radius: 8px; background: var(--iw-card); }
  .st-chk li { display: flex; align-items: center; gap: 10px; padding: 10px 12px; font-size: 13px; }
  .st-chk li + li { border-top: 1px solid var(--iw-line); }
  .st-chk li > i { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--iw-line); flex: none; }
  .st-chk li.ok > i { border-color: var(--iw-ac); background: var(--iw-ac) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 12.5 4 4L18 8'/%3E%3C/svg%3E") center / 12px no-repeat; }
  .st-chk li.wait > i { border-color: var(--iw-ac); border-right-color: transparent; animation: spin .8s linear infinite; }
  .st-chk small { margin-left: auto; color: var(--iw-dim); font-size: 12px; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .st-wait { margin: 8px 0 0; color: var(--iw-dim); font-size: 12px; }
  .st-done { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; border-radius: 8px; background: color-mix(in srgb, var(--iw-ac) 16%, transparent); color: var(--iw-ac2); animation: dmIn .3s; width: max-content; }
  .st-nav { display: flex; justify-content: space-between; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--iw-line); }
  .ob-card { padding: 14px 16px; margin-bottom: 12px; border-radius: 8px; background: var(--iw-card); border: 1px solid var(--iw-line); }
  .ob-card label { display: block; margin: 10px 0 6px; font-weight: 600; font-size: 12.5px; }
  .ob-card label:first-child { margin-top: 0; }
  .ob-in { display: block; height: 32px; border-radius: 6px; background: var(--iw-chip); }
  .ob-in.tall { height: 80px; }
  .ob { max-width: 560px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* 订阅 */
  .iw-scroll.sub { display: flex; gap: 18px; align-items: flex-start; }
  .sub-main { flex: 1; min-width: 0; }
  .sub-side { flex: none; width: 214px; display: flex; flex-direction: column; gap: 12px; position: sticky; top: 0; }
  .sd-blk { padding: 12px; border-radius: 8px; background: var(--iw-card); border: 1px solid var(--iw-line); }
  .sd-nav { display: flex; flex-direction: column; gap: 2px; padding: 6px; }
  .sd-nav > span { display: flex; align-items: center; gap: 9px; height: 32px; padding: 0 10px; border-radius: 6px; color: var(--iw-tx); font-size: 13px; }
  .sd-nav > span.on { background: var(--iw-ac); color: #fff; }
  .sd-h { display: block; font-size: 13.5px; margin-bottom: 8px; }
  .sd-hrow { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
  .sd-cnt { display: inline-block; font-size: 11.5px; font-weight: 600; color: var(--iw-ac2); white-space: nowrap; }
  .sd-l { display: block; margin: 10px 0 6px; color: var(--iw-dim); font-size: 11.5px; }
  .sd-dates { display: flex; gap: 6px; }
  .sd-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .sd-tag { display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 8px; border: 1px solid var(--iw-line); border-radius: 6px; background: none; font-size: 12px; cursor: pointer; }
  .sd-tag svg { color: var(--iw-dim); }
  .sd-tag small { color: var(--iw-dim); font-size: 10.5px; }
  .sd-tag[aria-pressed="true"] { background: var(--iw-ac); border-color: var(--iw-ac); color: #fff; }
  .sd-tag[aria-pressed="true"] svg, .sd-tag[aria-pressed="true"] small { color: #fff; }
  .pg { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px; margin: 20px 0 4px; font-size: 12.5px; }
  .pg-b { min-width: 30px; height: 30px; display: grid; place-items: center; padding: 0 6px; border-radius: 6px; background: var(--iw-card); border: 1px solid var(--iw-line); }
  .pg-b.on { background: var(--iw-ac); border-color: var(--iw-ac); color: #fff; font-weight: 600; }
  .pg-d { color: var(--iw-dim); }
  .pg-j { display: inline-flex; align-items: center; gap: 6px; margin-left: 10px; color: var(--iw-dim); }
  .pg-in { width: 40px; height: 30px; display: grid; place-items: center; border-radius: 6px; border: 1px solid var(--iw-line); background: var(--iw-bg); color: var(--iw-tx); }
  .pg-go { height: 30px; display: grid; place-items: center; padding: 0 10px; border-radius: 6px; background: var(--iw-chip); color: var(--iw-tx); }
  .pg-inf { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 20px 0 4px; color: var(--iw-dim); font-size: 12px; }
  .spin { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--iw-line); border-top-color: var(--iw-ac); animation: spin .8s linear infinite; }

  /* 卡片预览 */
  .pv { position: absolute; inset: 0; z-index: 4; display: grid; place-items: center; padding: 20px; }
  .pv[hidden] { display: none; }
  .pv-bd { position: absolute; inset: 0; background: color-mix(in srgb, var(--iw-bg) 40%, transparent); -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px); animation: dmIn .2s; }
  .pv-box { position: relative; width: min(680px, 100%); display: grid; grid-template-columns: 1.15fr 1fr; border-radius: 14px; overflow: hidden; background: var(--iw-card); box-shadow: 0 24px 60px -16px rgba(0,0,0,.55), 0 0 0 1px var(--iw-line); animation: pvIn .3s var(--ease); }
  @keyframes pvIn { from { opacity: 0; transform: scale(.96) translateY(6px); } }
  .pv-cov { aspect-ratio: auto; min-height: 230px; border-radius: 0; }
  .pv-x { position: absolute; z-index: 2; top: 10px; right: 10px; width: 34px; height: 34px; display: grid; place-items: center; border: 0; border-radius: 50%; background: rgba(10,30,50,.7); color: #fff; cursor: pointer; }
  .pv-info { display: flex; flex-direction: column; gap: 10px; padding: 18px; min-width: 0; }
  .pv-t { font-size: 16px; font-weight: 600; }
  .pv-au { display: flex; align-items: center; gap: 9px; color: var(--iw-dim); }
  .pv-au .iw-av { width: 32px; height: 32px; }
  .pv-au > span { flex: 1; min-width: 0; line-height: 1.25; }
  .pv-au b { display: block; color: var(--iw-tx); font-weight: 500; }
  .pv-au small { font-size: 11.5px; }
  .pv-stats { display: flex; flex-wrap: wrap; gap: 5px; }
  .pv-stats > span { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 7px; border-radius: 6px; background: var(--iw-chip); color: var(--iw-dim); font-size: 11.5px; }
  .pv-d { margin: 0; color: var(--iw-dim); font-size: 12.5px; }
  .pv-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .pv-tags > span { height: 26px; display: inline-flex; align-items: center; padding: 0 10px; border-radius: 999px; border: 1px solid var(--iw-line); font-size: 12px; }
  .pv-act { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .pv-grp { display: flex; gap: 2px; padding: 3px; border-radius: 9px; background: var(--iw-chip); }
  .pv-grp button { position: relative; height: 30px; min-width: 32px; display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 0 8px; border: 0; border-radius: 6px; background: none; color: var(--iw-tx); cursor: pointer; font-size: 12.5px; }
  .pv-grp button:hover { background: var(--iw-card); }
  .pv-like[aria-pressed="true"] { color: #e5484d; }
  .pv-like[aria-pressed="true"] svg { fill: currentColor; }
  .pv-grp button:last-child { color: var(--iw-ac); }
  .pv-tip { position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); padding: 4px 8px; border-radius: 6px; background: var(--iw-tx); color: var(--iw-bg); font-size: 11px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .2s; }
  .pv-copy.done .pv-tip { opacity: 1; }

  /* 翻译 */
  .iw-scroll.tr { max-width: 720px; }
  .tr-player { aspect-ratio: 16 / 7; border-radius: 8px; display: grid; place-items: center; margin-bottom: 14px; }
  .tr-play { position: relative; z-index: 1; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 50%; background: rgba(0,0,0,.55); color: #fff; }
  .tr-tags { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: -4px 0 18px; }
  .tr-tl { display: flex; flex-wrap: wrap; gap: 6px; margin-right: auto; }
  .tr-tag { height: 26px; display: inline-flex; align-items: center; padding: 0 10px; border-radius: 999px; background: var(--iw-chip); font-size: 12px; }
  .tr-tags .nm-t, .tr-tags[data-tv="tr"] .nm-o { display: none; }
  .tr-tags[data-tv="tr"] .nm-t { display: inline; }
  .tr-ch { margin: 0 0 12px; font-size: 14px; }
  .cm { display: flex; gap: 10px; padding: 12px 0; border-top: 1px solid var(--iw-line); }
  .cm > .iw-av { width: 32px; height: 32px; }
  .cm-b { flex: 1; min-width: 0; }
  .cm-hd { display: flex; align-items: baseline; gap: 8px; }
  .cm-hd small { color: var(--iw-dim); font-size: 11.5px; }
  .cm-o, .cm-t { margin: 4px 0 6px; font-size: 13px; }
  .cm-t { display: none; }
  .cm[data-s="done"] .cm-o { display: none; }
  .cm[data-s="done"] .cm-t { display: block; animation: dmIn .35s; }
  .cm[data-s="ing"] .cm-o { color: transparent; background: linear-gradient(90deg, var(--iw-chip) 0 40%, color-mix(in srgb, var(--iw-chip) 40%, var(--iw-card)) 50%, var(--iw-chip) 60% 100%) 0 0 / 300% 100%; border-radius: 4px; animation: shimmer 1s linear infinite; }
  @keyframes shimmer { to { background-position: -150% 0; } }
  .cm-meta { display: block; margin-top: 3px; color: var(--iw-dim); font-size: 11px; }
  .cm-same { font-style: normal; color: var(--iw-dim); }
  .cm-ft { display: flex; align-items: center; gap: 14px; color: var(--iw-dim); font-size: 12px; }
  .cm-ft > span { display: inline-flex; align-items: center; gap: 4px; }
  .cm-tr { display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 9px; border: 1px solid var(--iw-line); border-radius: 6px; background: var(--iw-card); color: var(--iw-ac2); font-size: 12px; cursor: pointer; }
  .cm-tr .cm-b2, .cm-tr .cm-c { display: none; }
  .cm[data-s="done"] .cm-tr .cm-a, .cm[data-s="ing"] .cm-tr .cm-a { display: none; }
  .cm[data-s="done"] .cm-tr .cm-b2, .cm[data-s="ing"] .cm-tr .cm-c { display: inline; }

  /* 指引气泡、光标 */
  .co { position: absolute; z-index: 30; top: 0; left: 0; width: 256px; padding: 12px 12px 12px 14px; border-radius: 12px; background: var(--menu); color: var(--fg); border: 1px solid var(--line-2); box-shadow: 0 16px 40px -12px rgba(0,0,0,.5), 0 2px 8px -2px rgba(0,0,0,.2); font: 13px/1.5 var(--sans); transition: transform .35s var(--ease); }
  .co[hidden] { display: none; }
  .co-top { display: flex; align-items: center; justify-content: space-between; margin: -2px -4px 4px 0; }
  .co-n { font: 11px/1 var(--mono); color: var(--fg-3); letter-spacing: .04em; }
  .co-x { width: 24px; height: 24px; display: grid; place-items: center; border: 0; border-radius: 6px; background: none; color: var(--fg-3); cursor: pointer; }
  .co-x:hover { color: var(--fg); background: var(--bg-2); }
  .co-t { margin: 0; font-size: 13.5px; line-height: 1.5; color: var(--fg); }
  .co-act { display: flex; align-items: center; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
  .co-b { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 11px; border-radius: 8px; border: 1px solid var(--line-2); background: var(--bg); color: var(--fg); font-size: 12.5px; line-height: 1; cursor: pointer; }
  .co-b:hover { border-color: var(--line-3); }
  .co-b.pri { background: var(--inv); color: var(--inv-fg); border-color: var(--inv); }
  .co-live { display: inline-flex; align-items: center; gap: 7px; color: var(--fg-2); font-size: 12.5px; margin-right: auto; }
  .co-live i { width: 7px; height: 7px; border-radius: 50%; background: var(--hl); animation: ring 1.4s infinite; }
  .co-ar { position: absolute; width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px; background: var(--menu); border: 1px solid var(--line-2); transform: rotate(45deg); }
  .co[data-side=""] .co-ar { display: none; }
  .co[data-side="below"] .co-ar { top: 0; border-right: 0; border-bottom: 0; }
  .co[data-side="above"] .co-ar { top: 100%; border-left: 0; border-top: 0; }
  .co[data-side="left"] .co-ar { left: 100%; border-left: 0; border-bottom: 0; }
  .co-hot { outline: 2px solid var(--hl) !important; outline-offset: 2px; animation: hot 1.6s var(--ease) infinite; }
  @keyframes hot { 50% { outline-offset: 5px; outline-color: color-mix(in srgb, var(--hl) 35%, transparent); } }
  .cur { position: absolute; z-index: 40; top: 0; left: 0; width: 22px; height: 22px; margin: -3px 0 0 -4px; pointer-events: none; opacity: 0; transition: transform .7s cubic-bezier(.45,.05,.25,1), opacity .25s; filter: drop-shadow(0 2px 3px rgba(0,0,0,.35)); }
  .cur.show { opacity: 1; }
  .cur path { fill: #fff; stroke: #111; stroke-width: 1.5; stroke-linejoin: round; }
  .cur::after { content: ""; position: absolute; left: -7px; top: -7px; width: 20px; height: 20px; border-radius: 50%; background: var(--hl); opacity: 0; }
  .cur.tap::after { animation: tap .45s ease-out; }
  @keyframes tap { from { opacity: .55; transform: scale(.3); } to { opacity: 0; transform: scale(1.9); } }

  /* 窄窗口：侧栏、面板改成上下排或盖在上面 */
  @container (max-width: 760px) {
    .iw-rail { display: none; }
    .iw-ics > svg.q { display: none; }
    .sub-side { width: 190px; }
  }
  @container (max-width: 620px) {
    .iw-hd { gap: 10px; padding: 0 10px; }
    .iw-logo b { display: none; }
    .iw-scroll { padding: 12px 12px 72px; }
    .iw-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 10px; }
    .sb-type > span { display: none; }
    .sp { position: absolute; inset: 0; width: auto; z-index: 3; border-left: 0; padding-bottom: 76px; }
    .sp-foot { display: block; position: sticky; bottom: -60px; margin: 12px -16px 0; padding: 12px 16px; background: var(--iw-card); border-top: 1px solid var(--iw-line); }
    .sp-foot .iw-btn { width: 100%; }
    .iw-scroll.sub { flex-direction: column-reverse; gap: 12px; }
    .sub-side { position: static; width: 100%; }
    .sd-nav { flex-direction: row; } .sd-nav > span { flex: 1; justify-content: center; padding: 0 6px; }
    .st-steps .st-l { display: none; } .st-steps li.on .st-l { display: inline; }
    .st-steps li + li::before { margin: 0 6px; }
    .st-strip small { display: none; }
    .pv { padding: 12px; align-items: end; }
    .pv-box { grid-template-columns: 1fr; max-height: 100%; overflow: auto; }
    .pv-cov { min-height: 150px; aspect-ratio: 16 / 8; }
    .v-note { left: 10px; right: 10px; bottom: 10px; max-width: calc(100% - 20px); }
    .pg-j { display: none; }
  }
`;
