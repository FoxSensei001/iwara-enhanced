// 托管目录首页（index.html）：由 latest.json 生成的下载页，Vercel / Geist 风格。
// - 字体（Geist，SIL OFL）、截图、图标都和页面放在同一目录（extension/page/），不连任何第三方，没有统计、没有 Cookie
// - 中文 / English / 日本語写在同一页，用 data-l 切换；语言默认按浏览器的语言偏好列表匹配，手动选过才记住
// - 推荐装法：油猴脚本（各浏览器、手机）和 Firefox 版（上架后），两者都会自动更新；Chrome 手动加载只作备选
// - 安装引导每步一句话，配照真实界面画的示意图（要点的地方高亮），按访客的浏览器 / 系统显示对应的步骤
// - 不开脚本时显示中文和桌面 Chrome 的步骤，所有链接照常可用
// 截图来自 docs/images/*.png，裁掉外层标题、只留浏览器窗口，转成 jpg（重新生成见 extension/README.md）。
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
// 一段文字的三种语言（参数是已经安全的 HTML 片段）
const L = (zh, en, ja) => `<span data-l="zh">${zh}</span><span data-l="en">${en}</span><span data-l="ja">${ja}</span>`;

const P = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z"/>',
  auto: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
  script: '<path d="M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2"/>',
  firefox: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0-6.4 15.4M15.5 6.5C13 6 10 8 10.5 11s4 3.5 5.5 1.5"/>',
  chrome: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8.5h8.2M9 13.8 4.9 6.6M15 13.8l-4 7.1"/>',
  spark: '<path d="m12 3 1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8Z"/><path d="m19 15 .7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  filter: '<path d="M3 5h18l-7 8.5V19l-4 2v-7.5Z"/>',
  pages: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 15h2M11 15h2M15 15h2M7 9h10"/>',
  lang: '<path d="M4 5h8M8 3v2M11 5c-1 4-3.6 7-7 8M6 9c1.4 2 3.4 3.4 6 4M13 21l4-9 4 9M14.5 18h5"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  side: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M5.5 8h1M5.5 11h1"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>',
  reload: '<path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.6M20 4v4.6h-4.6"/>',
};
const ico = (name, size = 16, sw = 1.6, cls = '') => `<svg class="i${cls ? ' ' + cls : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;

// 截图：图片文件、宽高（防跳动）、标题与说明
const SHOTS = [
  { id: 'studio', file: 'shot-studio.jpg', w: 1456, h: 955, icon: 'spark',
    t: L('创作工作台', 'Creator studio', 'クリエイタースタジオ'),
    d: L('上传 → 内容 → 标签 → 发布，四步走完。边传边填，刷新也不丢草稿。', 'Upload → Content → Tags → Publish. Fill it in while it uploads; drafts survive a refresh.', 'アップロード → 内容 → タグ → 公開。アップロード中に入力でき、再読み込みしても下書きは残ります。') },
  { id: 'search', file: 'shot-search.jpg', w: 1456, h: 1231, icon: 'search',
    t: L('高级搜索', 'Advanced search', '詳細検索'),
    d: L('多个标签（全部 / 任一 / 排除）、作者、日期、时长一起筛，实时预览。', 'Combine tags (all / any / exclude), authors, dates and length, with a live preview.', 'タグ（すべて / いずれか / 除外）、作者、日付、長さを組み合わせ、その場でプレビュー。') },
  { id: 'preview', file: 'shot-cardpreview.jpg', w: 1456, h: 735, icon: 'eye',
    t: L('卡片预览', 'Card preview', 'カードプレビュー'),
    d: L('点卡片上的「⋯」直接预览封面、统计和标签，不用离开列表。', 'The “⋯” on any card previews the cover, stats and tags without leaving the list.', 'カードの「⋯」でカバー・統計・タグを一覧のままプレビュー。') },
  { id: 'subs', file: 'shot-subs.jpg', w: 1456, h: 955, icon: 'filter',
    t: L('订阅筛选', 'Subscription filters', '購読フィルター'),
    d: L('订阅页加上排序、分级、年月和标签筛选，切换不刷新。', 'Sort, rating, year / month and tag filters on Subscriptions, without reloading.', '購読ページで並べ替え・レーティング・年月・タグを絞り込み。再読み込みなし。') },
];

const MORE = [
  ['pages', L('经典翻页 / 无限滚动', 'Pager or infinite scroll', 'ページ送り / 無限スクロール'), L('跳到任意页，或改成无限滚动，选择会被记住。', 'Jump to any page, or switch to infinite scroll; it’s remembered.', '任意のページへ、または無限スクロールに。選択は記憶されます。')],
  ['tag', L('标签翻译与过滤', 'Tag translation & filters', 'タグ翻訳とフィルター'), L('标签显示成你的语言，列表能按多个标签过滤。', 'Tags in your language; filter lists by several tags.', 'タグを母国語で表示し、複数タグで絞り込み。')],
  ['lang', L('原地翻译', 'In-place translation', 'その場で翻訳'), L('评论、帖子、标题一键翻译，再点换回原文。', 'Translate comments, posts and titles in place; click again for the original.', 'コメントや投稿、タイトルをその場で翻訳。もう一度で原文に。')],
  ['pen', L('所见即所得编辑器', 'Live editor everywhere', 'どこでもライブエディター'), L('站内所有 Markdown 输入框换成同一个编辑器。', 'Every Markdown box on the site gets the same live editor.', 'サイト内の Markdown 入力欄をすべて同じエディターに。')],
  ['user', L('更好的作者页', 'Better creator pages', '見やすいクリエイターページ'), L('简介进卡片，作品可排序翻页，侧栏跟随。', 'Bio in a card, sortable uploads with paging, a sidebar that follows.', '自己紹介はカードに、作品は並べ替え・ページ送り、サイドバーは追従。')],
  ['side', L('侧栏快捷开关', 'Sidebar switches', 'サイドバーのスイッチ'), L('语言、分级、主题变成侧栏底部的图标开关。', 'Language, rating and theme become icon switches.', '言語・レーティング・テーマをアイコンで切り替え。')],
];

const FAQ = [
  [L('会自动更新吗？', 'Does it update itself?', '自動で更新されますか？'),
    L('油猴脚本由脚本管理器定期检查更新，Firefox 版由 Firefox 自动更新，都不用管。只有 Chrome 手动加载的扩展需要你自己覆盖新版（有新版时它会提示）。',
      'Yes. The userscript is updated by your script manager, and the Firefox add-on by Firefox. Only the manually loaded Chrome extension needs you to unzip new versions over it (it tells you when one is out).',
      'はい。ユーザースクリプトはスクリプト管理が、Firefox 版は Firefox が自動で更新します。手動で読み込んだ Chrome 拡張機能だけは、新しい版を上書きする必要があります（出たときにお知らせします）。')],
  [L('为什么 Chrome 应用商店里没有？', 'Why isn’t it on the Chrome Web Store?', 'なぜ Chrome ウェブストアにないのですか？'),
    L('Chrome 应用商店不收录面向这类网站的扩展。在 Chrome 上推荐用油猴脚本，功能一样，还能自动更新。',
      'The Chrome Web Store doesn’t accept extensions for sites like this. On Chrome, use the userscript: same features, and it updates itself.',
      'Chrome ウェブストアはこの種のサイト向けの拡張機能を受け付けません。Chrome ではユーザースクリプトがおすすめです。機能は同じで、自動更新されます。')],
  [L('会收集我的数据吗？', 'Does it collect my data?', 'データを収集しますか？'),
    L('不会，也不上报任何东西。对外请求只有：从 jsDelivr 下载标签词库；你点「翻译」时把那段文字发给谷歌翻译。其余都只发往 Iwara 自己的服务器。',
      'No, and nothing is sent to the developer. The only outside requests: the tag dictionary from jsDelivr, and the text you choose to translate, sent to Google Translate. Everything else goes to Iwara’s own servers.',
      'いいえ。開発者には何も送りません。外部へのリクエストは jsDelivr からのタグ辞書の取得と、「翻訳」を押した文章の Google 翻訳への送信だけです。それ以外は Iwara のサーバーにだけ送られます。')],
  [L('脚本和扩展能一起用吗？', 'Can I use the script and an extension together?', 'スクリプトと拡張機能を併用できますか？'),
    L('只启用一种。两个都开时只有先加载的那个生效。', 'Enable just one; if both are on, only the one that loads first runs.', 'どちらか 1 つだけ有効に。両方オンだと先に読み込まれた方だけが動きます。')],
  [L('设置会丢吗？', 'Will I lose my settings?', '設定は消えますか？'),
    L('不会。设置和模板存在网站自己的本地存储里，升级、换装法都在。iwara.tv 和 iwara.ai 各存各的。',
      'No. Settings and templates live in the site’s own storage, so updates and switching install methods keep them. iwara.tv and iwara.ai are stored separately.',
      'いいえ。設定とテンプレートはサイト側に保存されるので、更新や導入方法の変更でも残ります。iwara.tv と iwara.ai は別々です。')],
  [L('这是官方出品吗？', 'Is this official?', '公式のものですか？'),
    L('不是。这是社区做的非官方项目，与 Iwara 没有关联。请遵守网站规则。', 'No. It’s an unofficial community project, not affiliated with Iwara. Please follow the site’s rules.', 'いいえ。コミュニティによる非公式プロジェクトで、Iwara とは関係ありません。サイトのルールを守ってご利用ください。')],
];

// ── 照真实界面画的示意图（纯装饰，aria-hidden）。文字用各浏览器 / 扩展自己的界面用语 ──
const bar = (url) => `<div class="m-bar"><i></i><i></i><i></i><span class="m-url">${url}</span></div>`;
const tog = (on, hl) => `<span class="m-tog${on ? ' on' : ''}${hl ? ' hl' : ''}"></span>`;
const tmIcon = '<span class="m-tm"><i></i><i></i></span>';
const MOCK = {
  // 脚本管理器官网
  store: () => `<div class="mock" aria-hidden="true">${bar('tampermonkey.net')}
    <div class="m-body m-row">${tmIcon}<div class="m-grow"><b>Tampermonkey</b><small>${L('用户脚本管理器', 'Userscript manager', 'ユーザースクリプト管理')}</small></div><span class="m-btn pri hl">${L('获取', 'Get', '入手')}</span></div></div>`,
  // Chrome / Edge 的扩展详情页
  allow: () => `<div class="mock" aria-hidden="true">${bar('chrome://extensions/?id=…')}
    <div class="m-body m-list">
      <div class="m-row">${tmIcon}<b class="m-grow">Tampermonkey</b></div>
      <div class="m-row m-line"><span class="m-grow">${L('开启', 'On', 'オン')}</span>${tog(true)}</div>
      <div class="m-row m-line hl-row"><span class="m-grow"><b>${L('允许用户脚本', 'Allow User Scripts', 'ユーザー スクリプトを許可')}</b></span>${tog(true)}</div>
      <div class="m-row m-line m-dim"><span class="m-grow">${L('网站访问权限', 'Site access', 'サイトへのアクセス')}</span><span class="m-sel"></span></div>
    </div></div>`,
  // Tampermonkey 的安装确认页
  tminstall: (v) => `<div class="mock" aria-hidden="true">${bar('Tampermonkey')}
    <div class="m-body"><div class="m-tmhead">${tmIcon}<b>Tampermonkey</b><small>${L('用户脚本安装', 'Userscript installation', 'ユーザースクリプトのインストール')}</small></div>
      <div class="m-row m-gap"><img src="icon.png" alt="" width="28" height="28"><div class="m-grow"><b>Iwara Enhanced</b><small>v${v}</small></div></div>
      <div class="m-row m-btns"><span class="m-btn pri hl">${L('安装', 'Install', 'インストール')}</span><span class="m-btn">${L('取消', 'Cancel', 'キャンセル')}</span></div>
    </div></div>`,
  // AMO 商品页
  amo: () => `<div class="mock" aria-hidden="true">${bar('addons.mozilla.org')}
    <div class="m-body m-row"><img src="icon.png" alt="" width="36" height="36"><div class="m-grow"><b>Iwara Enhanced</b><small>${L('扩展', 'Extension', '拡張機能')}</small></div><span class="m-btn ff hl">${L('添加到 Firefox', 'Add to Firefox', 'Firefox へ追加')}</span></div></div>`,
  // Firefox 的添加确认弹窗
  ffprompt: () => `<div class="mock m-pop" aria-hidden="true"><div class="m-body">
    <div class="m-row m-gap"><img src="icon.png" alt="" width="24" height="24"><b class="m-wrapt">${L('添加 Iwara Enhanced？', 'Add Iwara Enhanced?', 'Iwara Enhanced を追加しますか？')}</b></div>
    <ul class="m-ul"><li>${L('访问您在 iwara.tv 和 iwara.ai 上的数据', 'Access your data for iwara.tv and iwara.ai', 'iwara.tv と iwara.ai のデータへのアクセス')}</li><li>${L('网站内容（仅在您点「翻译」时）', 'Website content (only when you translate)', 'ウェブサイトのコンテンツ（翻訳時のみ）')}</li></ul>
    <div class="m-row m-btns m-end"><span class="m-btn">${L('取消', 'Cancel', 'キャンセル')}</span><span class="m-btn ff hl">${L('添加', 'Add', '追加')}</span></div>
  </div></div>`,
  // about:addons 里的条目
  ffdone: (v) => `<div class="mock" aria-hidden="true">${bar('about:addons')}
    <div class="m-body m-row"><img src="icon.png" alt="" width="28" height="28"><div class="m-grow"><b>Iwara Enhanced</b><small>v${v} · ${L('自动更新', 'Updates automatically', '自動更新')}</small></div>${tog(true)}</div></div>`,
  // 解压出来的文件夹（zip 里文件在根目录，系统解压时按 zip 名建文件夹）
  folder: (v) => `<div class="mock" aria-hidden="true">${bar(L('下载', 'Downloads', 'ダウンロード'))}
    <div class="m-body m-list m-files">
      <div class="m-row hl-row">${ico('folder', 15)}<b>iwara-enhanced-chromium-${v}</b></div>
      <div class="m-row m-sub">${ico('folder', 14)}icons</div>
      <div class="m-row m-sub">${ico('file', 14)}iwara-enhanced.js</div>
      <div class="m-row m-sub">${ico('file', 14)}manifest.json</div>
    </div></div>`,
  // chrome://extensions 顶栏：开发者模式
  devmode: () => `<div class="mock" aria-hidden="true">${bar('chrome://extensions')}
    <div class="m-body m-row"><b class="m-grow">${L('扩展程序', 'Extensions', '拡張機能')}</b><span class="m-small">${L('开发者模式', 'Developer mode', 'デベロッパー モード')}</span>${tog(true, true)}</div></div>`,
  // 加载已解压的扩展程序
  unpacked: () => `<div class="mock" aria-hidden="true">${bar('chrome://extensions')}
    <div class="m-body m-row m-wrap"><span class="m-btn out hl">${L('加载已解压的扩展程序', 'Load unpacked', 'パッケージ化されていない拡張機能を読み込む')}</span><span class="m-btn out m-dimbtn">${L('打包扩展程序', 'Pack extension', '拡張機能をパッケージ化')}</span><span class="m-btn out m-dimbtn">${L('更新', 'Update', '更新')}</span></div></div>`,
  // 扩展卡片：刷新按钮
  card: (v) => `<div class="mock" aria-hidden="true">${bar('chrome://extensions')}
    <div class="m-body"><div class="m-row m-gap"><img src="icon.png" alt="" width="28" height="28"><div class="m-grow"><b>Iwara Enhanced</b><small>${v}</small></div></div>
      <div class="m-row m-btns"><span class="m-btn out">${L('详情', 'Details', '詳細')}</span><span class="m-btn out">${L('移除', 'Remove', '削除')}</span><span class="m-grow"></span><span class="m-ic hl">${ico('reload', 15, 2)}</span>${tog(true)}</div>
    </div></div>`,
};

const step = (n, title, text, mock, action = '', cls = '') => `
          <li class="g-step${cls}">
            <div class="g-head"><span class="g-n">${n}</span><b>${title}</b></div>
            <p class="g-text">${text}</p>
            ${action ? `<div class="g-act">${action}</div>` : ''}
            ${mock}
          </li>`;

export function releasePage(latest, { repoUrl = '', baseUrl = '' } = {}) {
  const ff = latest.firefox;
  const ffReady = ff.channel === 'unlisted' || !!ff.listing;
  const ffHref = ff.channel === 'unlisted' ? ff.xpi : ff.listing;
  const v = esc(latest.version);
  const abs = (f) => (baseUrl ? `${esc(baseUrl)}/${f}` : f);
  const check = `<span class="ck">${ico('check', 15, 2)}</span>`;

  const scriptSteps = [
    step('1', L('装脚本管理器', 'Get a script manager', 'スクリプト管理を入れる'),
      `<span class="for-desktop">${L('推荐 Tampermonkey，也可以用 Violentmonkey。', 'Tampermonkey is recommended; Violentmonkey works too.', 'Tampermonkey がおすすめ。Violentmonkey でも動きます。')}</span><span class="for-android">${L('Android：在 Firefox 里装 Tampermonkey。', 'Android: add Tampermonkey to Firefox.', 'Android：Firefox に Tampermonkey を追加。')}</span><span class="for-ios">${L('iPhone / iPad：给 Safari 装 Userscripts。', 'iPhone / iPad: add Userscripts to Safari.', 'iPhone / iPad：Safari に Userscripts を追加。')}</span>`,
      MOCK.store(),
      `<a class="btn sm for-noios" href="https://www.tampermonkey.net/" rel="noopener">${L('打开 Tampermonkey 官网', 'Open tampermonkey.net', 'tampermonkey.net を開く')}${ico('ext', 13)}</a><a class="btn sm for-ios" href="https://github.com/quoid/userscripts" rel="noopener">${L('了解 Userscripts', 'About Userscripts', 'Userscripts について')}${ico('ext', 13)}</a>`),
    step('2', L('允许用户脚本', 'Allow user scripts', 'ユーザー スクリプトを許可'),
      L('Chrome / Edge 要在 Tampermonkey 的「详情」里打开这个开关。', 'In Chrome / Edge, turn this on in Tampermonkey’s Details.', 'Chrome / Edge では Tampermonkey の「詳細」でオンにします。'),
      MOCK.allow(), '', ' for-chromium'),
    step('<span class="for-chromium">3</span><span class="for-nochromium">2</span>', L('安装本脚本', 'Install this script', 'このスクリプトを入れる'),
      L('点下面的按钮，在打开的页面点「安装」。', 'Click below, then “Install” on the page that opens.', '下のボタンを押し、開いたページで「インストール」。'),
      MOCK.tminstall(v),
      `<a class="btn primary sm" href="${esc(latest.userscript.install)}">${L('安装脚本', 'Install script', 'スクリプトを入れる')}${ico('arrow', 13)}</a>`),
  ].join('');

  const firefoxSteps = [
    step('1', L('打开附加组件页面', 'Open the add-on page', 'アドオンページを開く'),
      L('点「添加到 Firefox」。', 'Click “Add to Firefox”.', '「Firefox へ追加」を押します。'),
      MOCK.amo(),
      ffReady ? `<a class="btn primary sm" href="${esc(ffHref)}" rel="noopener">${ff.channel === 'unlisted' ? L('安装 Firefox 版', 'Install for Firefox', 'Firefox 版を入れる') : L('前往 Firefox 附加组件', 'Go to Firefox Add-ons', 'Firefox アドオンへ')}${ico('arrow', 13)}</a>` : ''),
    step('2', L('确认添加', 'Confirm', '追加を確認'), L('弹窗里点「添加」。', 'Click “Add” in the prompt.', '表示された確認で「追加」。'), MOCK.ffprompt()),
    step('3', L('完成', 'Done', '完了'), L('以后由 Firefox 自动更新。', 'Firefox keeps it up to date from now on.', '以後は Firefox が自動で更新します。'), MOCK.ffdone(v)),
  ].join('');

  const chromiumSteps = [
    step('1', L('下载并解压', 'Download and unzip', 'ダウンロードして展開'),
      L('得到的文件夹放在不会被删掉的地方。', 'Keep the folder somewhere you won’t delete.', 'できたフォルダーは消さない場所に置きます。'),
      MOCK.folder(v),
      `<a class="btn primary sm" href="${esc(latest.chromium.zip)}">${ico('down', 13)}${L('下载 .zip', 'Download .zip', '.zip を入手')}</a>`),
    step('2', L('打开开发者模式', 'Turn on Developer mode', 'デベロッパー モードをオン'),
      `${L('打开', 'Open', '')} <code>chrome://extensions</code> ${L('页面，再打开右上角的开关。', 'and flip the switch at the top right.', 'を開き、右上のスイッチをオン。')}`, MOCK.devmode()),
    step('3', L('加载扩展', 'Load it', '読み込む'),
      L('点「加载已解压的扩展程序」，选刚才的文件夹。', 'Click “Load unpacked” and pick that folder.', '「パッケージ化されていない拡張機能を読み込む」でフォルダーを選択。'), MOCK.unpacked()),
    step('4', L('以后更新', 'Updating', '更新するとき'),
      L('有新版会提示；解压覆盖后点刷新。', 'You’ll be told when one is out; unzip over the folder and click reload.', 'お知らせが出たら上書き展開して再読み込み。'), MOCK.card(v)),
  ].join('');

  return `<!doctype html>
<html lang="zh-CN" data-lang="zh" data-device="desktop" data-os="desktop" data-browser="chromium" data-ff-ready="${ffReady ? 1 : 0}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="referrer" content="no-referrer">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<title>Iwara Enhanced — 让 Iwara 用起来更顺手</title>
<meta name="description" content="Iwara Enhanced ${v}: a creator studio, advanced search, card previews, subscription filters and more for the official Iwara site.">
<meta property="og:type" content="website">
<meta property="og:title" content="Iwara Enhanced ${v}">
<meta property="og:description" content="Makes the official Iwara site more convenient: creator studio, search, previews, filters and more.">
<meta property="og:image" content="${abs('shot-studio.jpg')}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="favicon.png">
<link rel="apple-touch-icon" href="icon.png">
<link rel="preload" href="Geist-Variable.woff2" as="font" type="font/woff2" crossorigin>
<script>
  // 先定主题和语言，避免闪一下。语言：手动选过的 → 浏览器语言偏好列表里第一个支持的 → 英文
  (function () {
    var d = document.documentElement, t = null, l = null;
    try { t = localStorage.getItem('iwe-theme'); l = localStorage.getItem('iwe-lang'); } catch (e) {}
    if (t === 'light' || t === 'dark') d.dataset.theme = t;
    if (l !== 'zh' && l !== 'en' && l !== 'ja') {
      l = 'en';
      var list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']);
      for (var i = 0; i < list.length; i++) {
        var c = String(list[i]).toLowerCase().slice(0, 2);
        if (c === 'zh' || c === 'ja' || c === 'en') { l = c; break; }
      }
    }
    d.dataset.lang = l; d.lang = l === 'zh' ? 'zh-CN' : l; d.classList.add('js');
  })();
</script>
<style>
  @font-face { font-family: "Geist"; src: url(Geist-Variable.woff2) format("woff2"); font-weight: 100 900; font-display: swap; }
  @font-face { font-family: "Geist Mono"; src: url(GeistMono-Variable.woff2) format("woff2"); font-weight: 100 900; font-display: swap; }

  :root {
    --sans: "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
    --mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    --r: 12px; --ease: cubic-bezier(.2,.8,.2,1); --hdr: 64px;
    --bg: #000; --bg-1: #0a0a0a; --bg-2: #141414; --bg-3: #1c1c1c; --line: #1f1f1f; --line-2: #2e2e2e; --line-3: #454545;
    --fg: #ededed; --fg-2: #a1a1a1; --fg-3: #707070; --inv: #ededed; --inv-fg: #0a0a0a;
    --grid: rgba(255,255,255,.06); --glow: rgba(120,119,198,.26); --spot: rgba(255,255,255,.06);
    --ok: #45d483; --wait: #f5a524; --info: #52a8ff; --shadow: 0 0 0 1px rgba(255,255,255,.06), 0 24px 80px -24px rgba(0,0,0,.9);
    --cr: #8ab4f8; --cr-fg: #0b1a33; --ffb: #00ddff; --ffb-fg: #0a1a20; --hl: #52a8ff; --menu: #0f0f0f;
  }
  :root[data-theme="light"] {
    --bg: #fff; --bg-1: #fafafa; --bg-2: #f2f2f2; --bg-3: #ebebeb; --line: #ebebeb; --line-2: #e0e0e0; --line-3: #c9c9c9;
    --fg: #171717; --fg-2: #5e5e5e; --fg-3: #8f8f8f; --inv: #171717; --inv-fg: #fff;
    --grid: rgba(0,0,0,.055); --glow: rgba(120,119,198,.2); --spot: rgba(0,0,0,.035);
    --ok: #1a9e55; --wait: #b26b00; --info: #0068d6; --shadow: 0 0 0 1px rgba(0,0,0,.06), 0 24px 60px -28px rgba(0,0,0,.35);
    --cr: #1a73e8; --cr-fg: #fff; --ffb: #0061e0; --ffb-fg: #fff; --hl: #0068d6; --menu: #fff;
  }
  @media (prefers-color-scheme: light) {
    :root:not([data-theme="dark"]) {
      --bg: #fff; --bg-1: #fafafa; --bg-2: #f2f2f2; --bg-3: #ebebeb; --line: #ebebeb; --line-2: #e0e0e0; --line-3: #c9c9c9;
      --fg: #171717; --fg-2: #5e5e5e; --fg-3: #8f8f8f; --inv: #171717; --inv-fg: #fff;
      --grid: rgba(0,0,0,.055); --glow: rgba(120,119,198,.2); --spot: rgba(0,0,0,.035);
      --ok: #1a9e55; --wait: #b26b00; --info: #0068d6; --shadow: 0 0 0 1px rgba(0,0,0,.06), 0 24px 60px -28px rgba(0,0,0,.35);
      --cr: #1a73e8; --cr-fg: #fff; --ffb: #0061e0; --ffb-fg: #fff; --hl: #0068d6; --menu: #fff;
    }
  }

  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; scroll-padding-top: calc(var(--hdr) + 16px); }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.6 var(--sans); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; overflow-x: hidden; }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; height: auto; }
  svg.i { display: block; flex: none; }
  button { font: inherit; color: inherit; }
  ::selection { background: var(--fg); color: var(--bg); }
  [data-l] { display: none; }
  [data-lang="zh"] [data-l="zh"], [data-lang="en"] [data-l="en"], [data-lang="ja"] [data-l="ja"] { display: inline; }
  .wrap { width: 100%; max-width: 1140px; margin: 0 auto; padding: 0 24px; }
  :focus-visible { outline: 2px solid var(--info); outline-offset: 2px; border-radius: 6px; }
  [data-lang="zh"] :is(h1, h2, .lead, .sub, .caption, .detect, .feat), [data-lang="ja"] :is(h1, h2, .lead, .sub, .caption, .detect, .feat) { word-break: keep-all; overflow-wrap: anywhere; line-break: strict; }
  .g-text, .notice { line-break: strict; }

  /* 按访客环境显示的片段（不开脚本时按桌面 Chrome） */
  .for-android, .for-ios, .for-nochromium { display: none !important; }
  [data-os="android"] .for-android, [data-os="ios"] .for-ios { display: inline !important; }
  [data-os="android"] .for-desktop, [data-os="ios"] .for-desktop, [data-os="ios"] .for-noios { display: none !important; }
  [data-os="ios"] a.for-ios { display: inline-flex !important; }
  [data-browser]:not([data-browser="chromium"]) .for-chromium { display: none !important; }
  [data-browser]:not([data-browser="chromium"]) .for-nochromium { display: inline !important; }
  /* 手机上扩展版都装不了，只留油猴脚本 */
  [data-device="mobile"] .methods, [data-device="mobile"] #p-firefox, [data-device="mobile"] #p-chromium { display: none !important; }

  /* ── header ── */
  header.top { position: sticky; top: 0; z-index: 40; border-bottom: 1px solid transparent; transition: border-color .2s, background .2s; }
  header.top.scrolled { border-bottom-color: var(--line); background: color-mix(in srgb, var(--bg) 78%, transparent); backdrop-filter: saturate(180%) blur(12px); -webkit-backdrop-filter: saturate(180%) blur(12px); }
  .bar { height: var(--hdr); display: flex; align-items: center; gap: 4px; }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 600; letter-spacing: -.015em; line-height: 1; margin-right: 8px; white-space: nowrap; }
  .brand img { width: 26px; height: 26px; border-radius: 7px; box-shadow: 0 0 0 1px var(--line-2); }
  .ver { display: inline-flex; align-items: center; height: 22px; font: 12px/1 var(--mono); color: var(--fg-2); border: 1px solid var(--line-2); border-radius: 999px; padding: 0 8px; }
  nav.links { display: flex; align-items: center; gap: 2px; margin-left: 12px; }
  nav.links a { display: inline-flex; align-items: center; height: 32px; font-size: 14px; line-height: 1; color: var(--fg-2); padding: 0 10px; border-radius: 8px; transition: color .15s, background .15s; }
  nav.links a:hover { color: var(--fg); background: var(--bg-2); }
  .grow-x { flex: 1; }
  .tool { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 34px; min-width: 34px; padding: 0 8px; border-radius: 8px; border: 0; background: none; color: var(--fg-2); cursor: pointer; font-size: 13px; line-height: 1; vertical-align: middle; transition: color .15s, background .15s; }
  .tool:hover, .tool[aria-expanded="true"] { color: var(--fg); background: var(--bg-2); }
  .tool .ic { display: grid; place-items: center; }
  .tool .chev { opacity: .6; margin-left: -2px; }

  /* dropdown */
  .dd { position: relative; display: flex; }
  .menu { position: absolute; right: 0; top: calc(100% + 8px); z-index: 60; min-width: 200px; padding: 6px; border-radius: 12px; border: 1px solid var(--line-2); background: var(--menu);
    box-shadow: 0 16px 40px -12px rgba(0,0,0,.45), 0 4px 12px -4px rgba(0,0,0,.2); transform-origin: top right; animation: pop .14s var(--ease); }
  .menu[hidden] { display: none; }
  @keyframes pop { from { opacity: 0; transform: scale(.96) translateY(-4px); } }
  .menu .mi { width: 100%; display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border: 0; border-radius: 8px; background: none; color: var(--fg-2); font-size: 14px; line-height: 1; text-align: left; cursor: pointer; }
  .menu .mi:hover, .menu .mi:focus-visible { background: var(--bg-2); color: var(--fg); outline: none; }
  .menu .mi .sp { width: 16px; flex: none; }
  .menu .mi .ck { margin-left: auto; opacity: 0; color: var(--fg); }
  .menu .mi[aria-checked="true"] { color: var(--fg); }
  .menu .mi[aria-checked="true"] .ck { opacity: 1; }
  .menu .sep { height: 1px; margin: 6px 4px; background: var(--line); }
  .menu .hint { font: 11px/1 var(--mono); color: var(--fg-3); margin-left: auto; }
  .menu .hint + .ck { margin-left: 8px; }
  .menu .mi[aria-checked="true"] .hint { display: none; }
  .menu .mi[aria-checked="true"] .hint + .ck { margin-left: auto; }

  /* ── buttons ── */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 42px; padding: 0 18px; border-radius: 10px; font-weight: 500; font-size: 14px; line-height: 1; white-space: nowrap;
    border: 1px solid var(--line-2); background: var(--bg); color: var(--fg); cursor: pointer; transition: background .15s, border-color .15s, transform .15s var(--ease); }
  .btn:hover { background: var(--bg-2); border-color: var(--line-3); }
  .btn:active { transform: scale(.98); }
  .btn.primary { background: var(--inv); color: var(--inv-fg); border-color: var(--inv); }
  .btn.primary:hover { background: color-mix(in srgb, var(--inv) 86%, var(--bg)); }
  .btn.lg { height: 48px; padding: 0 22px; font-size: 15px; border-radius: 12px; }
  .btn.sm { height: 36px; padding: 0 14px; font-size: 13px; border-radius: 9px; gap: 6px; }
  .btn-hdr { height: 34px; padding: 0 12px; font-size: 13px; margin-left: 6px; }

  /* ── hero ── */
  .hero { position: relative; isolation: isolate; padding: 72px 0 0; overflow-x: clip; }
  .hero::before { content: ""; position: absolute; inset: calc(var(--hdr) * -1) 0 0; z-index: -2; pointer-events: none;
    background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
    background-size: 64px 64px; background-position: center -1px;
    -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 18%, #000 20%, transparent 72%); mask-image: radial-gradient(ellipse 60% 50% at 50% 18%, #000 20%, transparent 72%); }
  .hero::after { content: ""; position: absolute; z-index: -1; left: 50%; top: 300px; width: min(1100px, 100%); height: 520px; transform: translateX(-50%); pointer-events: none;
    background: radial-gradient(closest-side, var(--glow), transparent); filter: blur(20px); }
  .hero-txt { text-align: center; }
  .badge-link { display: inline-flex; align-items: center; gap: 10px; height: 32px; padding: 0 6px 0 12px; border-radius: 999px; border: 1px solid var(--line-2); background: color-mix(in srgb, var(--bg) 70%, transparent);
    font-size: 13px; line-height: 1; color: var(--fg-2); transition: border-color .15s, color .15s; }
  .badge-link:hover { border-color: var(--line-3); color: var(--fg); }
  .badge-link .pill { font: 12px/1 var(--mono); color: var(--fg); background: var(--bg-2); border-radius: 999px; padding: 5px 8px; display: inline-flex; gap: 4px; align-items: center; }
  h1 { margin: 26px auto 0; max-width: 13em; font-size: clamp(40px, 7vw, 74px); line-height: 1.02; font-weight: 650; letter-spacing: -.05em; text-wrap: balance;
    background: linear-gradient(180deg, var(--fg) 30%, color-mix(in srgb, var(--fg) 62%, var(--bg))); -webkit-background-clip: text; background-clip: text; color: transparent; padding-bottom: .06em; }
  [data-lang="zh"] h1, [data-lang="ja"] h1 { letter-spacing: -.03em; line-height: 1.1; }
  .lead { margin: 22px auto 0; max-width: 34em; color: var(--fg-2); font-size: 18px; line-height: 1.6; text-wrap: pretty; }
  .cta { margin-top: 34px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .detect { margin: 16px auto 0; min-height: 22px; font-size: 13px; color: var(--fg-3); display: flex; gap: 8px; justify-content: center; align-items: center; }

  /* ── showcase：宽屏左边功能列表 + 右边截图；窄屏截图上方一排标签 ── */
  .showcase { margin-top: 64px; }
  .chips { display: none; }
  .sc-grid { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 28px; align-items: start; }
  .feats { display: flex; flex-direction: column; gap: 6px; }
  .feat { position: relative; display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; padding: 14px 16px; border: 1px solid transparent; border-radius: 12px; background: none; color: var(--fg-2); text-align: left; cursor: pointer; overflow: hidden; transition: background .2s, border-color .2s, color .2s; }
  .feat .fi { grid-row: span 2; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 9px; border: 1px solid var(--line-2); background: var(--bg-1); color: var(--fg-2); transition: color .2s, border-color .2s; }
  .feat b { font-weight: 600; color: var(--fg); font-size: 15px; letter-spacing: -.01em; line-height: 1.4; }
  .feat .fd { font-size: 13.5px; line-height: 1.5; color: var(--fg-3); }
  .feat:hover { background: var(--bg-1); }
  .feat[aria-selected="true"] { background: var(--bg-1); border-color: var(--line-2); }
  .feat[aria-selected="true"] .fi { color: var(--fg); border-color: var(--line-3); }
  .feat[aria-selected="true"] .fd { color: var(--fg-2); }
  .feat .fbar { position: absolute; left: 16px; right: 16px; bottom: 0; height: 2px; overflow: hidden; border-radius: 2px; }
  .feat .fbar i { display: block; height: 100%; width: 0; background: var(--fg-3); }
  .auto .feat[aria-selected="true"] .fbar i { animation: prog 6s linear forwards; }
  @keyframes prog { from { width: 0; } to { width: 100%; } }
  .stage { position: relative; border-radius: 16px; padding: 7px; background: linear-gradient(180deg, var(--line-2), var(--line) 40%, transparent); box-shadow: var(--shadow); }
  .frames { position: relative; border-radius: 10px; overflow: hidden; background: #1a1a1a; aspect-ratio: 1456 / 955; }
  .frame { position: absolute; inset: 0; opacity: 0; transition: opacity .45s var(--ease), transform .6s var(--ease); transform: scale(1.012); }
  .frame.on { opacity: 1; transform: none; }
  .frame:not(.on) { pointer-events: none; }
  .frame a { display: block; height: 100%; cursor: zoom-in; }
  .frame img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
  .sc-prog { display: none; }
  .caption, .zoom-hint { display: none; }
  html:not(.js) .frame:first-child { opacity: 1; }

  /* ── sections ── */
  section.block { padding: 112px 0 0; }
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; font: 12px/1 var(--mono); color: var(--fg-3); text-transform: uppercase; letter-spacing: .1em; }
  .eyebrow::before { content: ""; width: 14px; height: 1px; background: var(--fg-3); }
  h2 { margin: 14px 0 0; font-size: clamp(28px, 4vw, 40px); line-height: 1.12; font-weight: 650; letter-spacing: -.04em; text-wrap: balance; }
  [data-lang="zh"] h2, [data-lang="ja"] h2 { letter-spacing: -.02em; }
  .sub { margin: 12px 0 0; color: var(--fg-2); font-size: 16px; max-width: 38em; text-wrap: pretty; }

  /* bento */
  .bento { margin-top: 40px; display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; background: var(--line); gap: 1px; }
  .cell { position: relative; background: var(--bg); padding: 26px 28px; }
  .cell .gl { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 9px; border: 1px solid var(--line-2); background: var(--bg-1); color: var(--fg); }
  .cell h3 { margin: 16px 0 0; font-size: 16px; font-weight: 600; letter-spacing: -.015em; }
  .cell p { margin: 4px 0 0; font-size: 14px; color: var(--fg-2); }
  .spot { isolation: isolate; }
  .spot::before { content: ""; position: absolute; inset: 0; z-index: -1; opacity: 0; transition: opacity .3s; pointer-events: none;
    background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), var(--spot), transparent 60%); }
  @media (hover: hover) { .spot:hover::before { opacity: 1; } }

  /* ── install guide ── */
  .methods { margin-top: 36px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .method { position: relative; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 2px 12px; padding: 16px 18px; border-radius: 14px; border: 1px solid var(--line); background: var(--bg-1); text-align: left; cursor: pointer; color: var(--fg); transition: border-color .2s, background .2s, box-shadow .2s; }
  .method:hover { border-color: var(--line-2); }
  .method[aria-selected="true"] { border-color: var(--fg-3); background: var(--bg); box-shadow: 0 0 0 1px var(--fg-3); }
  .method .mg { grid-row: span 2; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 10px; border: 1px solid var(--line-2); background: var(--bg); }
  .method b { font-size: 16px; font-weight: 600; letter-spacing: -.015em; line-height: 1.3; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .method small { display: flex; align-items: center; gap: 7px; font: 12px/1.4 var(--mono); color: var(--fg-3); }
  .rec { display: none; height: 20px; padding: 0 8px; align-items: center; border-radius: 999px; font: 500 11.5px/1 var(--sans); letter-spacing: 0; background: var(--inv); color: var(--inv-fg); }
  .method.is-rec .rec { display: inline-flex; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--fg-3); flex: none; }
  .dot.ok { background: var(--ok); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ok) 22%, transparent); }
  .dot.wait { background: var(--wait); box-shadow: 0 0 0 3px color-mix(in srgb, var(--wait) 22%, transparent); }

  .mpanel { margin-top: 20px; }
  .mpanel[hidden] { display: none; }
  html:not(.js) .mpanel[hidden] { display: block; margin-top: 48px; }
  .notice { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 12px 12px 12px 16px; margin-bottom: 16px; border-radius: 12px; border: 1px dashed var(--line-3); color: var(--fg-2); font-size: 14px; }
  .notice > span:nth-child(2) { flex: 1 1 18em; }
  ol.guide { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
  .g-step { display: flex; flex-direction: column; gap: 10px; padding: 20px; border-radius: 14px; border: 1px solid var(--line); background: var(--bg-1); min-width: 0; }
  .g-head { display: flex; align-items: center; gap: 10px; }
  .g-head b { font-size: 15.5px; font-weight: 600; letter-spacing: -.01em; line-height: 1.3; }
  .g-n { width: 24px; height: 24px; flex: none; display: grid; place-items: center; border-radius: 50%; font: 600 12px/1 var(--mono); background: var(--inv); color: var(--inv-fg); }
  .g-text { margin: 0; font-size: 14px; color: var(--fg-2); min-height: 3.2em; }
  .g-act { display: flex; gap: 8px; flex-wrap: wrap; }
  .g-step .mock { margin-top: auto; }
  code { font: 12.5px/1.4 var(--mono); background: var(--bg-2); border: 1px solid var(--line); border-radius: 6px; padding: 1px 5px; white-space: nowrap; }
  .g-foot { margin: 16px 0 0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 13px; color: var(--fg-3); }
  .hash { display: inline-flex; align-items: center; gap: 8px; max-width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 2px 2px 2px 10px; background: var(--bg); }
  .hash .k { font: 11px/1 var(--mono); color: var(--fg-3); }
  .hash code { border: 0; padding: 0; background: none; color: var(--fg-2); overflow: hidden; text-overflow: ellipsis; max-width: 22em; min-width: 0; }
  .copy { flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 6px; border: 0; background: none; color: var(--fg-2); cursor: pointer; }
  .copy:hover { color: var(--fg); background: var(--bg-2); }
  .copy .ok-ic { display: none; } .copy.done .ok-ic { display: grid; color: var(--ok); } .copy.done .cp-ic { display: none; }

  /* 示意图：照真实界面的布局和用语画，颜色跟随页面深浅色 */
  .mock { border: 1px solid var(--line-2); border-radius: 10px; background: var(--bg); overflow: hidden; font-size: 12.5px; line-height: 1.35; color: var(--fg); user-select: none; -webkit-user-select: none; }
  .m-bar { display: flex; align-items: center; gap: 5px; height: 26px; padding: 0 9px; border-bottom: 1px solid var(--line); background: var(--bg-2); }
  .m-bar > i { width: 7px; height: 7px; border-radius: 50%; background: var(--line-3); flex: none; }
  .m-url { margin-left: 6px; flex: 1; min-width: 0; height: 16px; padding: 0 8px; border-radius: 5px; background: var(--bg); color: var(--fg-3); font: 10.5px/16px var(--mono); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .m-body { padding: 12px; }
  .m-row { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .m-row img { border-radius: 6px; flex: none; }
  .m-wrap { flex-wrap: wrap; gap: 8px; }
  .m-gap { margin-bottom: 10px; }
  .m-grow { flex: 1; min-width: 0; }
  .m-grow b, .m-row > b { display: block; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .m-row > b.m-wrapt { white-space: normal; }
  .m-grow small { display: block; color: var(--fg-3); font-size: 11px; }
  .m-small { color: var(--fg-2); font-size: 11.5px; white-space: nowrap; }
  .m-list { display: flex; flex-direction: column; padding: 4px 12px; }
  .m-list > .m-row:first-child { padding: 8px 0; }
  .m-line { border-top: 1px solid var(--line); padding: 8px 0; }
  .m-dim { opacity: .55; }
  .m-sel { width: 54px; height: 16px; border-radius: 4px; background: var(--bg-3); }
  .m-btn { display: inline-flex; align-items: center; height: 26px; padding: 0 12px; border-radius: 6px; font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; background: var(--bg-3); color: var(--fg); }
  .m-btn.pri { background: var(--cr); color: var(--cr-fg); }
  .m-btn.ff { background: var(--ffb); color: var(--ffb-fg); }
  .m-btn.out { background: none; border: 1px solid var(--line-2); color: var(--cr); font-weight: 500; }
  .m-btn.m-dimbtn { opacity: .5; }
  .m-btns { gap: 8px; margin-top: 2px; }
  .m-end { justify-content: flex-end; }
  .m-tog { position: relative; flex: none; width: 28px; height: 14px; border-radius: 999px; background: var(--line-3); }
  .m-tog::after { content: ""; position: absolute; top: -2px; left: -2px; width: 18px; height: 18px; border-radius: 50%; background: var(--fg-3); box-shadow: 0 1px 3px rgba(0,0,0,.3); }
  .m-tog.on { background: color-mix(in srgb, var(--cr) 45%, transparent); }
  .m-tog.on::after { left: 12px; background: var(--cr); }
  .m-ic { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; color: var(--fg-2); flex: none; }
  .m-tm { flex: none; width: 28px; height: 28px; border-radius: 7px; background: #1d1d1d; display: flex; align-items: flex-end; justify-content: center; gap: 4px; padding-bottom: 7px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); }
  .m-tm i { width: 7px; height: 7px; border-radius: 50%; background: #fff; }
  .m-tmhead { display: flex; align-items: center; gap: 8px; margin: -12px -12px 12px; padding: 8px 12px; background: #1d1d1d; color: #eee; }
  .m-tmhead .m-tm { width: 20px; height: 20px; padding-bottom: 5px; gap: 3px; box-shadow: none; }
  .m-tmhead .m-tm i { width: 5px; height: 5px; }
  .m-tmhead small { margin-left: auto; color: #999; font-size: 11px; }
  .m-pop { box-shadow: 0 12px 30px -12px rgba(0,0,0,.5); }
  .m-ul { margin: 0 0 12px; padding: 0 0 0 16px; color: var(--fg-2); font-size: 11.5px; }
  .m-ul li + li { margin-top: 3px; }
  .m-files .m-row { padding: 5px 0; gap: 8px; color: var(--fg-2); font: 11.5px/1.3 var(--mono); }
  .m-files .m-row b { color: var(--fg); font-family: var(--sans); }
  .m-files .m-sub { padding-left: 22px; }
  .hl { position: relative; box-shadow: 0 0 0 2px var(--hl), 0 0 0 6px color-mix(in srgb, var(--hl) 25%, transparent); animation: ring 2.2s var(--ease) infinite; }
  .m-line.hl-row { padding: 8px 6px !important; border-top-color: transparent; }
  .m-line.hl-row + .m-line { border-top-color: transparent; }
  .hl-row { margin: 0 -6px; padding: 5px 6px !important; border-radius: 6px; background: color-mix(in srgb, var(--hl) 14%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--hl) 50%, transparent); }
  @keyframes ring { 0%, 100% { box-shadow: 0 0 0 2px var(--hl), 0 0 0 4px color-mix(in srgb, var(--hl) 30%, transparent); } 50% { box-shadow: 0 0 0 2px var(--hl), 0 0 0 8px color-mix(in srgb, var(--hl) 8%, transparent); } }

  /* faq */
  .faq-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 48px; align-items: start; }
  @media (min-width: 1024px) { .faq-grid > div:first-child { position: sticky; top: calc(var(--hdr) + 40px); } }
  .faq { border-top: 1px solid var(--line); }
  .faq details { border-bottom: 1px solid var(--line); }
  .faq summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 4px; font-size: 16px; font-weight: 500; letter-spacing: -.01em; }
  .faq summary::-webkit-details-marker { display: none; }
  .faq summary svg { color: var(--fg-3); transition: transform .25s var(--ease); }
  .faq details[open] summary svg { transform: rotate(180deg); }
  .faq .a { padding: 0 4px 22px; color: var(--fg-2); max-width: 46em; }

  /* footer */
  footer { margin-top: 120px; border-top: 1px solid var(--line); padding: 32px 0 calc(40px + env(safe-area-inset-bottom)); color: var(--fg-3); font-size: 13px; }
  footer .wrap { display: flex; gap: 12px 24px; justify-content: space-between; align-items: center; flex-wrap: wrap; }
  footer .row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  footer img { width: 20px; height: 20px; border-radius: 5px; }
  footer a:hover { color: var(--fg); }

  .dock { display: none; }
  .js .rv { opacity: 0; transform: translateY(14px); transition: opacity .7s var(--ease), transform .7s var(--ease); }
  .js .rv.in { opacity: 1; transform: none; }

  /* ── 中等宽度 ── */
  @media (max-width: 1023px) {
    .sc-grid { display: block; }
    .feats { display: none; }
    .chips { display: flex; gap: 4px; padding: 4px; margin: 0 auto 18px; width: max-content; max-width: 100%; border: 1px solid var(--line); border-radius: 12px; background: var(--bg-1); overflow-x: auto; scrollbar-width: none; }
    .chips::-webkit-scrollbar { display: none; }
    .chip-t { flex: none; display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; border-radius: 8px; border: 0; background: none; color: var(--fg-2); font-size: 14px; line-height: 1; cursor: pointer; white-space: nowrap; }
    .chip-t[aria-selected="true"] { color: var(--fg); background: var(--bg-2); box-shadow: 0 0 0 1px var(--line-2); }
    .sc-prog { display: block; position: absolute; left: 18px; right: 18px; bottom: 2px; height: 2px; border-radius: 2px; overflow: hidden; }
    .sc-prog i { display: block; height: 100%; width: 0; background: var(--fg-3); }
    .auto .sc-prog.run i { animation: prog 6s linear forwards; }
    .caption { display: grid; margin: 16px auto 0; max-width: 40em; text-align: center; color: var(--fg-2); font-size: 15px; }
    .caption > div { grid-area: 1 / 1; visibility: hidden; }
    .caption > div.on { visibility: visible; }
    .caption b { color: var(--fg); font-weight: 600; }
    nav.links { display: none; }
    .bento { grid-template-columns: repeat(2, 1fr); }
    .methods { grid-template-columns: 1fr; }
    .faq-grid { grid-template-columns: 1fr; gap: 0; }
  }
  /* 暂停放在媒体查询后面，保证优先级 */
  .showcase.auto.paused .feat .fbar i, .showcase.auto.paused .sc-prog.run i { animation-play-state: paused; }
  @media (max-width: 640px) {
    :root { --hdr: 56px; }
    .wrap { padding: 0 16px; }
    .ver, .tool .lbl, .btn-hdr, .tool .chev { display: none; }
    .brand { margin-right: 0; }
    .hero { padding-top: 44px; }
    h1 { font-size: clamp(36px, 11vw, 48px); }
    .lead { font-size: 16px; margin-top: 18px; }
    .cta { margin-top: 28px; flex-direction: column; align-items: stretch; }
    .showcase { margin-top: 44px; }
    .chips { width: auto; max-width: none; margin: 0 -16px 14px; border-radius: 0; border-width: 1px 0; padding: 6px 12px; }
    .chip-t { height: 38px; }
    .stage { padding: 5px; border-radius: 12px; }
    .frames { border-radius: 8px; }
    .caption { font-size: 14px; text-align: left; }
    .zoom-hint { display: block; margin: 8px 0 0; font: 12px/1.4 var(--mono); color: var(--fg-3); }
    section.block { padding-top: 80px; }
    .bento { grid-template-columns: 1fr; }
    .cell { padding: 18px 18px 20px; display: grid; grid-template-columns: auto 1fr; column-gap: 14px; }
    .cell .gl { grid-row: span 2; }
    .cell h3 { margin: 4px 0 0; }
    .method { padding: 14px; }
    ol.guide { grid-template-columns: 1fr; }
    .g-step { padding: 16px; }
    .g-text { min-height: 0; }
    .g-act .btn { flex: 1; height: 44px; }
    .faq summary { padding: 18px 2px; font-size: 15px; min-height: 56px; }
    .menu { position: fixed; left: auto; right: 12px; top: calc(var(--hdr) + 6px); }
    footer { margin-top: 88px; padding-bottom: calc(96px + env(safe-area-inset-bottom)); }
    footer .wrap { flex-direction: column; align-items: flex-start; }
    .dock { display: flex; position: fixed; z-index: 50; left: 12px; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); padding: 8px; border-radius: 16px;
      border: 1px solid var(--line-2); background: color-mix(in srgb, var(--bg-1) 85%, transparent); backdrop-filter: saturate(180%) blur(16px); -webkit-backdrop-filter: saturate(180%) blur(16px);
      box-shadow: 0 10px 40px -10px rgba(0,0,0,.5); transform: translateY(140%); transition: transform .35s var(--ease); }
    .dock.show { transform: none; }
    .dock .btn { flex: 1; height: 46px; }
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { transition: none !important; animation: none !important; }
    .js .rv { opacity: 1; transform: none; }
  }
</style>
</head>
<body>
<header class="top" id="hdr">
  <div class="wrap bar">
    <a class="brand" href="#top" aria-label="Iwara Enhanced"><img src="icon.png" alt="" width="26" height="26">Iwara Enhanced</a>
    <span class="ver">v${v}</span>
    <nav class="links" aria-label="Sections">
      <a href="#features">${L('功能', 'Features', '機能')}</a>
      <a href="#install">${L('安装', 'Install', '導入')}</a>
      <a href="#faq">${L('常见问题', 'FAQ', 'よくある質問')}</a>
    </nav>
    <span class="grow-x"></span>
    <div class="dd" id="dd-lang">
      <button class="tool" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Language">${ico('globe', 17)}<span class="lbl" id="lang-lbl">中文</span>${ico('chev', 13, 1.8, 'chev')}</button>
      <div class="menu" role="menu" hidden>
        <button class="mi" type="button" role="menuitemradio" data-val="auto" aria-checked="false">${ico('auto', 16)}${L('自动', 'Automatic', '自動')}<span class="hint">${L('跟随浏览器', 'browser', 'ブラウザ')}</span>${check}</button>
        <div class="sep" role="separator"></div>
        <button class="mi" type="button" role="menuitemradio" data-val="zh" aria-checked="false" lang="zh-CN"><span class="sp"></span>中文${check}</button>
        <button class="mi" type="button" role="menuitemradio" data-val="en" aria-checked="false" lang="en"><span class="sp"></span>English${check}</button>
        <button class="mi" type="button" role="menuitemradio" data-val="ja" aria-checked="false" lang="ja"><span class="sp"></span>日本語${check}</button>
      </div>
    </div>
    <div class="dd" id="dd-theme">
      <button class="tool" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Theme"><span class="ic" id="theme-ic">${ico('monitor', 17)}</span>${ico('chev', 13, 1.8, 'chev')}</button>
      <div class="menu" role="menu" hidden>
        <button class="mi" type="button" role="menuitemradio" data-val="system" aria-checked="false">${ico('monitor', 16)}${L('跟随系统', 'System', 'システム')}${check}</button>
        <button class="mi" type="button" role="menuitemradio" data-val="light" aria-checked="false">${ico('sun', 16)}${L('浅色', 'Light', 'ライト')}${check}</button>
        <button class="mi" type="button" role="menuitemradio" data-val="dark" aria-checked="false">${ico('moon', 16)}${L('深色', 'Dark', 'ダーク')}${check}</button>
      </div>
    </div>
    ${repoUrl ? `<a class="tool" href="${esc(repoUrl)}" rel="noopener" aria-label="GitHub">${ico('github', 17)}</a>` : ''}
    <a class="btn primary btn-hdr" href="#install">${L('安装', 'Install', '導入')}</a>
  </div>
</header>

<main id="top">
  <section class="hero">
    <div class="wrap">
      <div class="hero-txt">
        <a class="badge-link rv" href="#install"><span>${L('新版本已发布', 'New release', '新バージョン公開')}</span><span class="pill">v${v} ${ico('arrow', 12, 2)}</span></a>
        <h1 class="rv">${L('让 Iwara 用起来<br>更顺手', 'Iwara, made<br>more convenient', 'Iwara を、<br>もっと快適に')}</h1>
        <p class="lead rv">${L(
          '创作工作台、高级搜索、卡片预览、订阅筛选、原地翻译……直接加在官方网站上，原来的页面照常可用。',
          'A creator studio, advanced search, card previews, subscription filters, in-place translation and more — right on the official site, which keeps working as before.',
          'クリエイタースタジオ、詳細検索、カードプレビュー、購読フィルター、その場翻訳など。公式サイトにそのまま追加し、元のページもいつも通り使えます。')}</p>
        <div class="cta rv">
          <a class="btn primary lg" href="#install" id="hero-cta">${L('开始安装', 'Get started', 'インストール')}${ico('arrow', 15)}</a>
          <a class="btn lg" href="#features">${L('看看有什么', 'See what’s inside', '機能を見る')}</a>
        </div>
        <p class="detect rv" id="detect" aria-live="polite"></p>
      </div>

      <div class="showcase rv" id="features">
        <div class="chips" role="tablist" aria-label="Screenshots">
          ${SHOTS.map((s, i) => `<button class="chip-t" type="button" role="tab" id="ct-${s.id}" aria-controls="frm-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${ico(s.icon, 15)}${s.t}</button>`).join('')}
        </div>
        <div class="sc-grid">
          <div class="feats" role="tablist" aria-orientation="vertical" aria-label="Screenshots">
            ${SHOTS.map((s, i) => `<button class="feat" type="button" role="tab" id="ft-${s.id}" aria-controls="frm-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="fi">${ico(s.icon, 16)}</span><b>${s.t}</b><span class="fd">${s.d}</span><span class="fbar"><i></i></span></button>`).join('')}
          </div>
          <div class="stage">
            <div class="frames">
              ${SHOTS.map((s, i) => `<div class="frame${i === 0 ? ' on' : ''}" id="frm-${s.id}" role="tabpanel" aria-labelledby="ft-${s.id}"><a href="${s.file}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="${s.file}" width="${s.w}" height="${s.h}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></a></div>`).join('')}
            </div>
            <span class="sc-prog"><i></i></span>
          </div>
        </div>
        <div class="caption">
          ${SHOTS.map((s, i) => `<div${i === 0 ? ' class="on"' : ''}><b>${s.t}</b> — ${s.d}</div>`).join('')}
        </div>
        <p class="zoom-hint">${L('点截图看大图 · 左右滑动切换', 'Tap for full size · swipe to switch', 'タップで拡大・スワイプで切り替え')}</p>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="eyebrow rv">${L('还有更多', 'And more', 'ほかにも')}</div>
      <h2 class="rv">${L('每天都会用到的小改进', 'Small things you’ll use every day', '毎日使う小さな改善')}</h2>
      <div class="bento rv">
        ${MORE.map(([ic, t, d]) => `<div class="cell spot"><span class="gl">${ico(ic, 17)}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="block" id="install">
    <div class="wrap">
      <div class="eyebrow rv">${L('安装', 'Install', '導入')}</div>
      <h2 class="rv">${L('两分钟装好', 'Up and running in two minutes', '2 分で導入')}</h2>
      <p class="sub rv">${L('推荐油猴脚本或 Firefox 版，装好以后都会自动更新。', 'Use the userscript or the Firefox add-on — both keep themselves up to date.', 'ユーザースクリプトか Firefox 版がおすすめ。どちらも自動で更新されます。')}</p>

      <div class="methods rv" role="tablist" aria-label="Install method">
        <button class="method is-rec" type="button" role="tab" id="m-script" aria-controls="p-script" aria-selected="true" data-m="script">
          <span class="mg">${ico('script', 18)}</span><b>${L('油猴脚本', 'Userscript', 'ユーザースクリプト')}<span class="rec">${L('推荐', 'Recommended', 'おすすめ')}</span></b>
          <small><i class="dot ok"></i>${L('自动更新 · 电脑和手机', 'Auto-updates · desktop & mobile', '自動更新・PC とスマホ')}</small>
        </button>
        <button class="method${ffReady ? ' is-rec' : ''}" type="button" role="tab" id="m-firefox" aria-controls="p-firefox" aria-selected="false" data-m="firefox">
          <span class="mg">${ico('firefox', 18)}</span><b>${L('Firefox 版', 'Firefox add-on', 'Firefox 版')}<span class="rec">${L('推荐', 'Recommended', 'おすすめ')}</span></b>
          <small>${ffReady ? `<i class="dot ok"></i>${L('自动更新 · 不用脚本管理器', 'Auto-updates · no manager needed', '自動更新・管理ツール不要')}` : `<i class="dot wait"></i>${L('审核中，即将上架', 'In review, coming soon', '審査中・まもなく公開')}`}</small>
        </button>
        <button class="method" type="button" role="tab" id="m-chromium" aria-controls="p-chromium" aria-selected="false" data-m="chromium">
          <span class="mg">${ico('chrome', 18)}</span><b>${L('Chrome 手动安装', 'Chrome, by hand', 'Chrome 手動導入')}</b>
          <small><i class="dot"></i>${L('有新版会提示，需手动更新', 'Notifies you; update by hand', '更新は手動（通知あり）')}</small>
        </button>
      </div>

      <div class="mpanel" id="p-script" role="tabpanel" aria-labelledby="m-script">
        <ol class="guide">${scriptSteps}
        </ol>
        <p class="g-foot"><i class="dot ok"></i>${L('装好后由脚本管理器自动检查更新。', 'Your script manager checks for updates automatically.', 'スクリプト管理が自動で更新を確認します。')}</p>
      </div>

      <div class="mpanel" id="p-firefox" role="tabpanel" aria-labelledby="m-firefox" hidden>
        ${ffReady ? '' : `<div class="notice"><i class="dot wait"></i><span>${L('Firefox 版还在 Mozilla 审核中。现在可以先用油猴脚本，同样会自动更新。', 'The Firefox add-on is still in review at Mozilla. Use the userscript meanwhile — it updates itself too.', 'Firefox 版は Mozilla で審査中です。それまではユーザースクリプトをどうぞ（自動更新されます）。')}</span><button class="btn sm" type="button" data-goto="script">${L('改用油猴脚本', 'Use the userscript', 'スクリプト版にする')}${ico('arrow', 13)}</button></div>`}
        <ol class="guide">${firefoxSteps}
        </ol>
      </div>

      <div class="mpanel" id="p-chromium" role="tabpanel" aria-labelledby="m-chromium" hidden>
        <div class="notice"><i class="dot"></i><span>${L('应用商店不收录，只能手动加载，以后也要手动更新。想省事请用油猴脚本。', 'Not in the store, so it’s loaded — and updated — by hand. The userscript is less work.', 'ストア非掲載のため、読み込みも更新も手動です。手間を省くならスクリプト版を。')}</span><button class="btn sm" type="button" data-goto="script">${L('改用油猴脚本', 'Use the userscript', 'スクリプト版にする')}${ico('arrow', 13)}</button></div>
        <ol class="guide">${chromiumSteps}
        </ol>
        <div class="g-foot">
          <span>Chrome ${esc(latest.chromium.minVersion)}+ · Edge · Brave</span>
          <span class="hash"><span class="k">SHA-256</span><code id="sha" title="${esc(latest.chromium.sha256)}">${esc(latest.chromium.sha256)}</code><button class="copy" type="button" data-copy="sha" aria-label="Copy SHA-256"><span class="cp-ic">${ico('copy', 14)}</span><span class="ok-ic">${ico('check', 14, 2)}</span></button></span>
        </div>
      </div>
    </div>
  </section>

  <section class="block" id="faq">
    <div class="wrap faq-grid">
      <div>
        <div class="eyebrow rv">FAQ</div>
        <h2 class="rv">${L('常见问题', 'Questions', 'よくある質問')}</h2>
        ${repoUrl ? `<p class="sub rv">${L('没找到答案？到 <a href="' + esc(repoUrl) + '/issues" rel="noopener" style="text-decoration:underline;text-underline-offset:3px">GitHub</a> 提问。', 'Not answered here? Ask on <a href="' + esc(repoUrl) + '/issues" rel="noopener" style="text-decoration:underline;text-underline-offset:3px">GitHub</a>.', '見つからなければ <a href="' + esc(repoUrl) + '/issues" rel="noopener" style="text-decoration:underline;text-underline-offset:3px">GitHub</a> へ。')}</p>` : ''}
      </div>
      <div class="faq rv">
        ${FAQ.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}${ico('chev', 18)}</summary><div class="a">${a}</div></details>`).join('')}
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <div class="row"><img src="icon.png" alt="" width="20" height="20"><span>Iwara Enhanced v${v} · ${esc(latest.date)} · MIT</span></div>
    <div class="row">
      <span>${L('非官方项目，与 Iwara 无关联', 'Unofficial, not affiliated with Iwara', '非公式・Iwara とは無関係')}</span>
      <span aria-hidden="true">·</span>
      <span>${L('本页无 Cookie、无统计', 'No cookies, no analytics', 'Cookie・解析なし')}</span>
      ${repoUrl ? `<span aria-hidden="true">·</span><a href="${esc(repoUrl)}" rel="noopener">GitHub</a>` : ''}
    </div>
  </div>
</footer>

<div class="dock" id="dock" aria-hidden="true">
  <a class="btn primary" id="dock-main" href="#install" tabindex="-1">${L('开始安装', 'Get started', 'インストール')}${ico('arrow', 15)}</a>
</div>

<script>
(() => {
  const d = document.documentElement, $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const store = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
  const read = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 下拉菜单：点外面 / Esc 关闭，上下键移动 ──
  const menus = [];
  const dropdown = (root, onPick) => {
    const btn = $('button.tool', root), menu = $('.menu', root), items = $$('.mi', menu);
    const close = (focus) => { if (menu.hidden) return; menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (focus) btn.focus(); };
    const open = () => {
      menus.forEach((c) => c !== close && c());
      menu.hidden = false; btn.setAttribute('aria-expanded', 'true');
      (items.find((i) => i.getAttribute('aria-checked') === 'true') || items[0]).focus();
    };
    menus.push(close);
    btn.addEventListener('click', (e) => { e.stopPropagation(); menu.hidden ? open() : close(); });
    btn.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' && menu.hidden) { e.preventDefault(); open(); } });
    menu.addEventListener('click', (e) => e.stopPropagation());
    items.forEach((it, i) => {
      it.addEventListener('click', () => { onPick(it.dataset.val); close(true); });
      it.addEventListener('keydown', (e) => {
        const k = { ArrowDown: 1, ArrowUp: -1 }[e.key];
        if (k) { e.preventDefault(); items[(i + k + items.length) % items.length].focus(); }
        else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
        else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
        else if (e.key === 'Tab') close();
      });
    });
    return items;
  };
  document.addEventListener('click', () => menus.forEach((c) => c()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') menus.forEach((c) => c(true)); });

  // ── 语言：没手动选过就跟随浏览器的语言偏好列表 ──
  const NAMES = { zh: '中文', en: 'English', ja: '日本語' };
  const TITLES = { zh: '让 Iwara 用起来更顺手', en: 'Iwara, made more convenient', ja: 'Iwara をもっと快適に' };
  const browserLang = () => {
    const list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (const x of list) { const c = String(x).toLowerCase().slice(0, 2); if (c === 'zh' || c === 'ja' || c === 'en') return c; }
    return 'en';
  };
  let applyLang = () => {};
  const langItems = dropdown($('#dd-lang'), (val) => { store('iwe-lang', val === 'auto' ? null : val); applyLang(); });
  applyLang = () => {
    const saved = read('iwe-lang'), manual = !!NAMES[saved], l = manual ? saved : browserLang();
    d.dataset.lang = l; d.lang = l === 'zh' ? 'zh-CN' : l; document.title = 'Iwara Enhanced — ' + TITLES[l];
    $('#lang-lbl').textContent = NAMES[l];
    langItems.forEach((it) => it.setAttribute('aria-checked', String(manual ? it.dataset.val === saved : it.dataset.val === 'auto')));
  };
  applyLang();
  addEventListener('languagechange', applyLang);

  // ── 主题：跟随系统 / 浅色 / 深色 ──
  const ICONS = { system: ${JSON.stringify(ico('monitor', 17))}, light: ${JSON.stringify(ico('sun', 17))}, dark: ${JSON.stringify(ico('moon', 17))} };
  let applyTheme = () => {};
  const themeItems = dropdown($('#dd-theme'), (val) => { store('iwe-theme', val === 'system' ? null : val); applyTheme(); });
  applyTheme = () => {
    const t = read('iwe-theme'), cur = t === 'light' || t === 'dark' ? t : 'system';
    if (cur === 'system') delete d.dataset.theme; else d.dataset.theme = cur;
    $('#theme-ic').innerHTML = ICONS[cur];
    themeItems.forEach((it) => it.setAttribute('aria-checked', String(it.dataset.val === cur)));
  };
  applyTheme();

  // ── 顶栏滚动后加边框 ──
  const hdr = $('#hdr');
  const onScroll = () => hdr.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ── 截图展示。切换时只滚动标签条自己，不动页面 ──
  const sc = $('.showcase'), chipsBar = $('.chips'), feats = $$('.feat'), chips = $$('.chip-t'), frames = $$('.frame'), caps = $$('.caption > div'), prog = $('.sc-prog');
  const N = frames.length;
  let cur = 0;
  const replay = (el) => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; };
  const show = (i, focusSet) => {
    cur = (i + N) % N;
    [feats, chips].forEach((set) => set.forEach((t, k) => { t.setAttribute('aria-selected', String(k === cur)); t.tabIndex = k === cur ? 0 : -1; }));
    frames.forEach((f, k) => { f.classList.toggle('on', k === cur); f.setAttribute('aria-labelledby', (chipsBar.offsetParent ? 'ct-' : 'ft-') + f.id.slice(4)); });
    caps.forEach((c, k) => c.classList.toggle('on', k === cur));
    const chip = chips[cur];
    if (chipsBar.offsetParent && chipsBar.scrollWidth > chipsBar.clientWidth) {
      chipsBar.scrollTo({ left: chip.offsetLeft - (chipsBar.clientWidth - chip.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    }
    if (focusSet) focusSet[cur].focus({ preventScroll: true });
    replay($('i', prog)); replay($('.fbar i', feats[cur]));
  };
  const stopAuto = () => sc.classList.remove('auto');
  [[feats, 'ArrowDown', 'ArrowUp'], [chips, 'ArrowRight', 'ArrowLeft']].forEach(([set, nextKey, prevKey]) => set.forEach((t, i) => {
    t.addEventListener('click', () => { stopAuto(); show(i); });
    t.addEventListener('keydown', (e) => {
      const to = e.key === nextKey ? cur + 1 : e.key === prevKey ? cur - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? N - 1 : null;
      if (to !== null) { e.preventDefault(); stopAuto(); show(to, set); }
    });
  }));
  // 自动轮播：进度条走完切下一张。鼠标停在上面、键盘焦点在里面、滚出视口时暂停；用户一操作就停
  if (!reduce) {
    prog.classList.add('run');
    sc.classList.add('auto', 'paused');
    sc.addEventListener('animationend', (e) => { if (e.animationName === 'prog' && sc.classList.contains('auto')) show(cur + 1); });
    let inView = false, hover = false, focus = false;
    const paint = () => sc.classList.toggle('paused', !inView || hover || focus);
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; paint(); }, { threshold: .35 }).observe($('.stage'));
    sc.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = true; paint(); } });
    sc.addEventListener('pointerleave', () => { hover = false; paint(); });
    sc.addEventListener('focusin', () => { focus = true; paint(); });
    sc.addEventListener('focusout', () => { focus = false; paint(); });
  }
  // 手机上左右滑动截图
  let sx = null, sy = null;
  const stage = $('.stage');
  stage.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { stopAuto(); show(cur + (dx < 0 ? 1 : -1)); }
  });

  // ── 访客环境：决定推荐哪种装法、显示哪些步骤 ──
  const ua = navigator.userAgent, iPadOS = ua.includes('Macintosh') && navigator.maxTouchPoints > 1;
  const os = /Android/i.test(ua) ? 'android' : (/iPhone|iPad|iPod/i.test(ua) || iPadOS) ? 'ios' : 'desktop';
  const firefox = ua.includes('Firefox/') || ua.includes('FxiOS');
  const chromium = !firefox && (ua.includes('Chrome/') || ua.includes('Chromium/') || ua.includes('Edg/'));
  d.dataset.device = os === 'desktop' ? 'desktop' : 'mobile';
  d.dataset.os = os;
  d.dataset.browser = os !== 'desktop' ? os : firefox ? 'firefox' : chromium ? 'chromium' : 'other';
  const ffReady = d.dataset.ffReady === '1';
  const rec = os === 'desktop' && firefox && ffReady ? 'firefox' : 'script';
  const NAME = os === 'ios' ? 'iPhone / iPad' : os === 'android' ? 'Android'
    : firefox ? 'Firefox' : ua.includes('Edg/') ? 'Edge' : ua.includes('OPR/') ? 'Opera' : chromium ? 'Chrome' : ua.includes('Safari/') ? 'Safari' : '';
  const span = (t) => '<span data-l="zh">' + t[0] + '</span><span data-l="en">' + t[1] + '</span><span data-l="ja">' + t[2] + '</span>';
  if (NAME) {
    const what = rec === 'firefox' ? ['Firefox 版', 'the Firefox add-on', 'Firefox 版'] : ['油猴脚本', 'the userscript', 'ユーザースクリプト'];
    $('#detect').innerHTML = '<i class="dot ok"></i>' + span([
      '检测到 ' + NAME + '，推荐' + what[0] + '，装好后自动更新',
      NAME + ' detected — we suggest ' + what[1] + ', which updates itself',
      NAME + ' を検出：' + what[2] + 'がおすすめ（自動更新）']);
  }

  // ── 安装方式切换 ──
  const methods = $$('.method');
  const panels = { script: $('#p-script'), firefox: $('#p-firefox'), chromium: $('#p-chromium') };
  const pick = (m, focus) => {
    methods.forEach((b) => { const on = b.dataset.m === m; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    Object.entries(panels).forEach(([k, p]) => { p.hidden = k !== m; });
  };
  methods.forEach((b, i) => {
    b.addEventListener('click', () => pick(b.dataset.m));
    b.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); pick(methods[(i + k + methods.length) % methods.length].dataset.m, true); }
    });
  });
  $$('[data-goto]').forEach((b) => b.addEventListener('click', () => { pick(b.dataset.goto); $('#install').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }));
  pick(rec);

  // ── 手机底部安装栏：首屏按钮滚出后出现，到了安装区收起 ──
  const dock = $('#dock'), dockBtn = $('#dock-main'), seen = { hero: true, install: false };
  const paintDock = () => { const on = !seen.hero && !seen.install; dock.classList.toggle('show', on); dock.setAttribute('aria-hidden', String(!on)); dockBtn.tabIndex = on ? 0 : -1; };
  new IntersectionObserver(([e]) => { seen.hero = e.isIntersecting; paintDock(); }).observe($('#hero-cta'));
  new IntersectionObserver(([e]) => { seen.install = e.isIntersecting; paintDock(); }, { rootMargin: '0px 0px -30% 0px' }).observe($('#install'));

  // ── 进入视口时淡入 ──
  const rio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach((el) => rio.observe(el));

  // ── 卡片聚光灯（只在有鼠标的设备上） ──
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.spot').forEach((el) => el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));
  }

  // ── 复制校验值 ──
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#' + b.dataset.copy).textContent.trim()); b.classList.add('done'); setTimeout(() => b.classList.remove('done'), 1500); } catch (e) {}
  }));
})();
</script>
</body>
</html>
`;
}
