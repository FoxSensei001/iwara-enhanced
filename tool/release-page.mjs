// 托管目录首页（index.html）：由 latest.json 生成的下载页，Vercel / Geist 风格。
// - 字体（Geist，SIL OFL）、截图、图标都和页面放在同一目录（extension/page/），不连任何第三方，没有统计、没有 Cookie
// - 中文 / English / 日本語写在同一页，用 data-l 切换；不开脚本时显示中文，所有链接照常可用
// - 脚本只做增强：按设备和浏览器推荐装法、切换主题和语言、截图标签页、手机底部安装栏、复制校验值
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
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z"/>',
  script: '<path d="M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2"/>',
  firefox: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0-6.4 15.4M15.5 6.5C13 6 10 8 10.5 11s4 3.5 5.5 1.5"/>',
  chrome: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8.5h8.2M9 13.8 4.9 6.6M15 13.8l-4 7.1"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
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
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
};
const ico = (name, size = 16, sw = 1.6) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;

// 截图标签页：图片文件、宽高（防跳动）、地址栏、标题与说明
const SHOTS = [
  { id: 'studio', file: 'shot-studio.jpg', w: 1456, h: 955, icon: 'spark',
    t: L('创作工作台', 'Creator studio', 'クリエイタースタジオ'),
    d: L('上传 → 内容 → 标签 → 发布，四步走完。上传时就能填表，刷新也不丢草稿。', 'Upload → Content → Tags → Publish. Fill the form while it uploads; drafts survive a refresh.', 'アップロード → 内容 → タグ → 公開の 4 ステップ。アップロード中に入力でき、再読み込みしても下書きは残ります。') },
  { id: 'search', file: 'shot-search.jpg', w: 1456, h: 1231, icon: 'search',
    t: L('高级搜索', 'Advanced search', '詳細検索'),
    d: L('先选分区，再组合多个标签（全部 / 任一 / 排除）、作者、日期和时长，实时预览查询。', 'Pick a section, then combine tags (all / any / exclude), authors, dates and length, with a live query preview.', 'セクションを選び、タグ（すべて / いずれか / 除外）、作者、日付、長さを組み合わせ。クエリはその場でプレビュー。') },
  { id: 'preview', file: 'shot-cardpreview.jpg', w: 1456, h: 735, icon: 'eye',
    t: L('卡片预览', 'Card preview', 'カードプレビュー'),
    d: L('点卡片上的「⋯」就能预览：大封面、统计、母语标签，不用离开列表。', 'The “⋯” on any card opens a preview — big cover, stats, tags in your language — without leaving the list.', 'カードの「⋯」でプレビュー。大きなカバー、統計、母国語のタグを一覧から離れずに確認。') },
  { id: 'subs', file: 'shot-subs.jpg', w: 1456, h: 955, icon: 'filter',
    t: L('订阅筛选', 'Subscription filters', '購読フィルター'),
    d: L('订阅页右侧加上排序、分级、年月和标签筛选，切换不刷新页面。', 'Sort, rating, year / month and tag filters on Subscriptions, switching without a reload.', '購読ページに並べ替え・レーティング・年月・タグの絞り込み。切り替えても再読み込みなし。') },
];

const MORE = [
  ['pages', L('经典翻页 / 无限滚动', 'Pager or infinite scroll', 'ページ送り / 無限スクロール'), L('列表页可跳到任意页，也能改成无限滚动，选择会被记住。', 'Jump to any page, or switch lists to infinite scroll; your choice is remembered.', '任意のページへ移動、または無限スクロールに。選択は記憶されます。')],
  ['tag', L('标签翻译与过滤', 'Tag translation & filters', 'タグ翻訳とフィルター'), L('标签显示成你的语言，列表可以按多个标签同时过滤。', 'Tags show in your language; filter lists by several tags at once.', 'タグを母国語で表示し、複数タグで一覧を絞り込み。')],
  ['lang', L('原地翻译', 'In-place translation', 'その場で翻訳'), L('评论、帖子、标题和简介一键翻译，再点一次换回原文。', 'Translate comments, posts, titles and descriptions in place; click again for the original.', 'コメントや投稿、タイトル、説明をその場で翻訳。もう一度押すと原文に。')],
  ['pen', L('所见即所得编辑器', 'Live editor everywhere', 'どこでもライブエディター'), L('站内所有 Markdown 输入框都换成同一个实时编辑器，显示字数上限。', 'Every Markdown box on the site gets the same live editor, with its character limit.', 'サイト内の Markdown 入力欄すべてを同じライブエディターに。文字数上限も表示。')],
  ['user', L('更好的作者页', 'Better creator pages', '見やすいクリエイターページ'), L('简介放进卡片，最新作品可排序翻页，侧栏跟随滚动。', 'Bio in a card, sortable and pageable latest uploads, a sidebar that follows you.', '自己紹介はカードに、最新作品は並べ替え・ページ送り可能、サイドバーは追従。')],
  ['side', L('侧栏快捷开关', 'Sidebar switches', 'サイドバーのスイッチ'), L('语言、分级、主题变成侧栏底部的图标开关，主题支持跟随系统。', 'Language, rating and theme become icon switches; theme can follow the system.', '言語・レーティング・テーマをアイコンで切り替え。テーマはシステム連動も。')],
];

const FAQ = [
  [L('为什么 Chrome 应用商店里没有？', 'Why isn’t it on the Chrome Web Store?', 'なぜ Chrome ウェブストアにないのですか？'),
    L('Chrome 应用商店不收录面向这类网站的扩展，所以 Chromium 系浏览器只能手动加载。功能和商店安装完全一样，有新版时扩展会提示你。也可以改用油猴脚本，它会自动更新。',
      'The Chrome Web Store doesn’t accept extensions for sites like this, so Chromium browsers load it manually. It works the same as a store install and tells you when an update is out. The userscript, which updates itself, is another option.',
      'Chrome ウェブストアはこの種のサイト向けの拡張機能を受け付けないため、Chromium 系では手動で読み込みます。機能はストア版と同じで、新しいバージョンが出ると通知します。自動更新されるユーザースクリプトも選べます。')],
  [L('会收集我的数据吗？', 'Does it collect my data?', 'データを収集しますか？'),
    L('不会，也不上报任何东西给开发者。对外请求只有三种：从 jsDelivr 下载标签词库；你点「翻译」时把那一段文字发给谷歌翻译；Chromium 扩展每天读一次本站的版本文件，不带任何参数。其余请求都只发往 Iwara 自己的服务器。',
      'No, and nothing is ever sent to the developer. The only outside requests: downloading the tag dictionary from jsDelivr; sending a text to Google Translate when you click Translate; and, in the Chromium extension, reading this site’s version file once a day with no parameters. Everything else goes to Iwara’s own servers.',
      'いいえ。開発者に何かを送ることもありません。外部へのリクエストは、jsDelivr からのタグ辞書の取得、「翻訳」を押したときにその文章を Google 翻訳へ送ること、Chromium 版が 1 日 1 回パラメーターなしでこのサイトのバージョンファイルを読むことだけです。それ以外は Iwara 自身のサーバーにだけ送られます。')],
  [L('能在手机上用吗？', 'Does it work on phones?', 'スマホで使えますか？'),
    L('可以用油猴脚本：Android 上用 Firefox 装 Violentmonkey 或 Tampermonkey；iPhone / iPad 上给 Safari 装一个支持用户脚本的扩展（例如 Userscripts）。然后点「安装脚本」即可。',
      'Yes, with the userscript: on Android, use Firefox with Violentmonkey or Tampermonkey; on iPhone / iPad, add a userscript extension to Safari (for example Userscripts). Then tap “Install script”.',
      'ユーザースクリプトで使えます。Android は Firefox に Violentmonkey か Tampermonkey、iPhone / iPad は Safari にユーザースクリプト対応の拡張機能（例：Userscripts）を入れて、「スクリプトを入れる」をタップ。')],
  [L('油猴脚本和扩展能一起用吗？', 'Can I use the userscript and the extension together?', 'スクリプトと拡張機能を併用できますか？'),
    L('只启用其中一种。同时开着时只有先加载的那个生效，装扩展前请先停用油猴脚本。',
      'Enable just one. If both are on, only the one that loads first runs — disable the userscript before installing the extension.',
      'どちらか 1 つだけ有効にしてください。両方オンだと先に読み込まれた方だけが動きます。拡張機能を入れる前にスクリプトを無効に。')],
  [L('设置和模板存在哪里？会丢吗？', 'Where are my settings and templates kept?', '設定やテンプレートはどこに保存されますか？'),
    L('都存在网站自己的本地存储里，升级、换装法都不会丢。iwara.tv 和 iwara.ai 各存各的，模板可以在模板面板里导出 / 导入。',
      'In the site’s own local storage, so updating or switching install methods keeps them. iwara.tv and iwara.ai are stored separately; templates can be exported / imported from the template panel.',
      'サイト自身のローカルストレージに保存されるので、更新や導入方法の変更でも消えません。iwara.tv と iwara.ai は別々に保存されます。テンプレートはパネルから書き出し / 読み込みできます。')],
  [L('这是官方出品吗？', 'Is this official?', '公式のものですか？'),
    L('不是。这是社区做的非官方项目，与 Iwara 没有关联。请遵守网站规则。',
      'No. It’s an unofficial community project, not affiliated with Iwara. Please follow the site’s rules.',
      'いいえ。コミュニティによる非公式プロジェクトで、Iwara とは関係ありません。サイトのルールを守ってご利用ください。')],
];

export function releasePage(latest, { repoUrl = '', baseUrl = '' } = {}) {
  const ff = latest.firefox;
  const ffReady = ff.channel === 'unlisted' || !!ff.listing;
  const ffHref = ff.channel === 'unlisted' ? ff.xpi : ff.listing;
  const v = esc(latest.version);
  const abs = (f) => (baseUrl ? `${esc(baseUrl)}/${f}` : f);

  const chip = (kind, text) => `<span class="chip"><i class="dot ${kind}"></i>${text}</span>`;
  const autoChip = chip('ok', L('自动更新', 'Auto-updates', '自動更新'));

  const cards = `
        <article class="card spot" data-card="script">
          <span class="rec-badge">${L('推荐给你', 'Recommended for you', 'おすすめ')}</span>
          <div class="card-top"><span class="glyph">${ico('script', 18)}</span>${autoChip}</div>
          <h3>${L('油猴脚本', 'Userscript', 'ユーザースクリプト')}</h3>
          <p>${L('装了 Tampermonkey、Violentmonkey 等脚本管理器的浏览器都能用，手机也行。', 'Works in any browser with a userscript manager such as Tampermonkey or Violentmonkey — phones included.', 'Tampermonkey や Violentmonkey などのスクリプト管理があればどのブラウザでも。スマホでも使えます。')}</p>
          <div class="card-foot">
            <a class="btn primary block" href="${esc(latest.userscript.install)}" data-act="script">${L('安装脚本', 'Install script', 'スクリプトを入れる')}${ico('arrow', 14)}</a>
            <span class="note">${L('由脚本管理器检查更新', 'Your script manager keeps it updated', 'スクリプト管理側で自動更新')}</span>
          </div>
        </article>
        <article class="card spot" data-card="firefox">
          <span class="rec-badge">${L('推荐给你', 'Recommended for you', 'おすすめ')}</span>
          <div class="card-top"><span class="glyph">${ico('firefox', 18)}</span>${ffReady ? autoChip : chip('wait', L('审核中', 'In review', '審査中'))}</div>
          <h3>Firefox</h3>
          <p>${L('经 Mozilla 审核的扩展，由 Firefox 自动更新，不需要脚本管理器。', 'A Mozilla-reviewed add-on that Firefox keeps up to date. No script manager needed.', 'Mozilla の審査を経た拡張機能。Firefox が自動更新し、スクリプト管理は不要です。')}</p>
          <div class="card-foot">
            ${ffReady
              ? `<a class="btn primary block" href="${esc(ffHref)}" rel="noopener" data-act="firefox">${ff.channel === 'unlisted' ? L('安装扩展', 'Install add-on', 'アドオンを入れる') : L('前往 Firefox 附加组件', 'Get it on Firefox Add-ons', 'Firefox アドオンで入手')}${ico('arrow', 14)}</a>`
              : `<span class="btn block disabled" aria-disabled="true">${L('正在等待上架', 'Coming to Firefox Add-ons', 'Firefox アドオンに公開予定')}</span>`}
            <span class="note">Firefox ${esc(ff.minVersion)}+ · ${ffReady ? L('桌面版', 'Desktop', 'デスクトップ版') : L('上架前可先用油猴脚本', 'Use the userscript meanwhile', '公開までスクリプト版をどうぞ')}</span>
          </div>
        </article>
        <article class="card spot" data-card="chromium">
          <span class="rec-badge">${L('推荐给你', 'Recommended for you', 'おすすめ')}</span>
          <div class="card-top"><span class="glyph">${ico('chrome', 18)}</span>${chip('info', L('有新版会提示', 'Notifies on update', '更新を通知'))}</div>
          <h3>Chrome · Edge · Brave</h3>
          <p>${L('应用商店不收录，需要手动加载一次。有新版时扩展会在页面上提示你。', 'Not in the stores, so you load it once by hand. It tells you on the page when an update is out.', 'ストア非掲載のため一度だけ手動で読み込みます。新しいバージョンはページ上でお知らせ。')}</p>
          <div class="card-foot">
            <div class="btn-row">
              <a class="btn primary grow" href="${esc(latest.chromium.zip)}" data-act="chromium">${ico('down', 15)}${L('下载 .zip', 'Download .zip', '.zip を入手')}</a>
              <a class="btn" href="#chromium">${L('步骤', 'Steps', '手順')}</a>
            </div>
            <span class="note">Chrome ${esc(latest.chromium.minVersion)}+ · ${L('桌面版', 'Desktop', 'デスクトップ版')}</span>
          </div>
        </article>`;

  return `<!doctype html>
<html lang="zh-CN" data-lang="zh" data-ff-ready="${ffReady ? 1 : 0}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="referrer" content="no-referrer">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<title>Iwara Enhanced — 让 Iwara 用起来更顺手</title>
<meta name="description" content="Iwara Enhanced ${v}: a creator studio, advanced search, card previews, subscription filters and more for the official Iwara site. Userscript, Firefox and Chromium.">
<meta property="og:type" content="website">
<meta property="og:title" content="Iwara Enhanced ${v}">
<meta property="og:description" content="Makes the official Iwara site more convenient: creator studio, search, previews, filters and more.">
<meta property="og:image" content="${abs('shot-studio.jpg')}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="favicon.png">
<link rel="apple-touch-icon" href="icon.png">
<link rel="preload" href="Geist-Variable.woff2" as="font" type="font/woff2" crossorigin>
<script>
  // 先定主题和语言，避免闪一下
  (function () {
    var d = document.documentElement, t = null, l = null;
    try { t = localStorage.getItem('iwe-theme'); l = localStorage.getItem('iwe-lang'); } catch (e) {}
    if (t === 'light' || t === 'dark') d.dataset.theme = t;
    var n = (navigator.language || '').toLowerCase();
    l = /^(zh|en|ja)$/.test(l || '') ? l : n.indexOf('zh') === 0 ? 'zh' : n.indexOf('ja') === 0 ? 'ja' : 'en';
    d.dataset.lang = l; d.lang = l === 'zh' ? 'zh-CN' : l; d.classList.add('js');
  })();
</script>
<style>
  @font-face { font-family: "Geist"; src: url(Geist-Variable.woff2) format("woff2"); font-weight: 100 900; font-display: swap; }
  @font-face { font-family: "Geist Mono"; src: url(GeistMono-Variable.woff2) format("woff2"); font-weight: 100 900; font-display: swap; }

  :root {
    --sans: "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
    --mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    --r: 12px; --ease: cubic-bezier(.2,.8,.2,1);
    --bg: #000; --bg-1: #0a0a0a; --bg-2: #111; --line: #1f1f1f; --line-2: #2e2e2e; --line-3: #454545;
    --fg: #ededed; --fg-2: #a1a1a1; --fg-3: #707070; --inv: #ededed; --inv-fg: #0a0a0a;
    --grid: rgba(255,255,255,.06); --glow: rgba(120,119,198,.28); --spot: rgba(255,255,255,.06);
    --ok: #45d483; --wait: #f5a524; --info: #52a8ff; --shadow: 0 0 0 1px rgba(255,255,255,.06), 0 24px 80px -24px rgba(0,0,0,.9);
  }
  :root[data-theme="light"] {
    --bg: #fff; --bg-1: #fafafa; --bg-2: #f2f2f2; --line: #ebebeb; --line-2: #e0e0e0; --line-3: #c9c9c9;
    --fg: #171717; --fg-2: #5e5e5e; --fg-3: #8f8f8f; --inv: #171717; --inv-fg: #fff;
    --grid: rgba(0,0,0,.055); --glow: rgba(120,119,198,.22); --spot: rgba(0,0,0,.035);
    --ok: #1a9e55; --wait: #b26b00; --info: #0068d6; --shadow: 0 0 0 1px rgba(0,0,0,.06), 0 24px 60px -28px rgba(0,0,0,.35);
  }
  @media (prefers-color-scheme: light) {
    :root:not([data-theme="dark"]) {
      --bg: #fff; --bg-1: #fafafa; --bg-2: #f2f2f2; --line: #ebebeb; --line-2: #e0e0e0; --line-3: #c9c9c9;
      --fg: #171717; --fg-2: #5e5e5e; --fg-3: #8f8f8f; --inv: #171717; --inv-fg: #fff;
      --grid: rgba(0,0,0,.055); --glow: rgba(120,119,198,.22); --spot: rgba(0,0,0,.035);
      --ok: #1a9e55; --wait: #b26b00; --info: #0068d6; --shadow: 0 0 0 1px rgba(0,0,0,.06), 0 24px 60px -28px rgba(0,0,0,.35);
    }
  }

  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; scroll-padding-top: 80px; }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.6 var(--sans); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; overflow-x: hidden; }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; height: auto; }
  button { font: inherit; color: inherit; }
  ::selection { background: var(--fg); color: var(--bg); }
  [data-l] { display: none; }
  [data-lang="zh"] [data-l="zh"], [data-lang="en"] [data-l="en"], [data-lang="ja"] [data-l="ja"] { display: inline; }
  .wrap { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 24px; }
  .mono { font-family: var(--mono); }
  :focus-visible { outline: 2px solid var(--info); outline-offset: 2px; border-radius: 6px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  /* ── header ── */
  header.top { position: sticky; top: 0; z-index: 40; border-bottom: 1px solid transparent; transition: border-color .2s, background .2s; }
  header.top.scrolled { border-bottom-color: var(--line); background: color-mix(in srgb, var(--bg) 78%, transparent); backdrop-filter: saturate(180%) blur(12px); -webkit-backdrop-filter: saturate(180%) blur(12px); }
  .bar { height: 64px; display: flex; align-items: center; gap: 6px; }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 600; letter-spacing: -.015em; margin-right: 10px; white-space: nowrap; }
  .brand img { width: 26px; height: 26px; border-radius: 7px; box-shadow: 0 0 0 1px var(--line-2); }
  .ver { font: 12px/1 var(--mono); color: var(--fg-2); border: 1px solid var(--line-2); border-radius: 999px; padding: 4px 8px; }
  nav.links { display: flex; gap: 2px; margin-left: 12px; }
  nav.links a { font-size: 14px; color: var(--fg-2); padding: 7px 10px; border-radius: 8px; transition: color .15s, background .15s; }
  nav.links a:hover { color: var(--fg); background: var(--bg-2); }
  .grow-x { flex: 1; }
  .tool { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 36px; min-width: 36px; padding: 0 9px; border-radius: 8px; border: 0; background: none; color: var(--fg-2); cursor: pointer; transition: color .15s, background .15s; }
  .tool:hover { color: var(--fg); background: var(--bg-2); }
  .tool .lbl { font-size: 13px; }
  .tool select { position: absolute; inset: 0; opacity: 0; cursor: pointer; font-size: 16px; }
  .theme-ic { display: none; } [data-theme-ic="system"] .ic-system, [data-theme-ic="light"] .ic-light, [data-theme-ic="dark"] .ic-dark { display: block; }
  .btn-sm { height: 34px; padding: 0 12px; font-size: 13px; }

  /* ── buttons ── */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 42px; padding: 0 18px; border-radius: 10px; font-weight: 500; font-size: 14px; line-height: 1; white-space: nowrap;
    border: 1px solid var(--line-2); background: var(--bg); color: var(--fg); cursor: pointer; transition: background .15s, border-color .15s, transform .15s var(--ease), box-shadow .15s; }
  .btn:hover { background: var(--bg-2); border-color: var(--line-3); }
  .btn:active { transform: scale(.98); }
  .btn.primary { background: var(--inv); color: var(--inv-fg); border-color: var(--inv); }
  .btn.primary:hover { background: color-mix(in srgb, var(--inv) 86%, var(--bg)); }
  .btn.block { width: 100%; }
  .btn.grow { flex: 1; }
  .btn.lg { height: 48px; padding: 0 22px; font-size: 15px; border-radius: 12px; }
  .btn.disabled { color: var(--fg-3); border-style: dashed; cursor: default; background: transparent; }
  .btn.disabled:active { transform: none; }
  .btn-row { display: flex; gap: 8px; }

  /* ── hero ── */
  .hero { position: relative; isolation: isolate; padding: 72px 0 0; text-align: center; }
  .hero::before { content: ""; position: absolute; inset: -64px 0 0; z-index: -2; pointer-events: none;
    background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
    background-size: 64px 64px; background-position: center -1px;
    -webkit-mask-image: radial-gradient(ellipse 60% 55% at 50% 20%, #000 20%, transparent 72%); mask-image: radial-gradient(ellipse 60% 55% at 50% 20%, #000 20%, transparent 72%); }
  .hero::after { content: ""; position: absolute; z-index: -1; left: 50%; top: 260px; width: min(1100px, 120vw); height: 520px; transform: translateX(-50%); pointer-events: none;
    background: radial-gradient(closest-side, var(--glow), transparent); filter: blur(20px); }
  .badge-link { display: inline-flex; align-items: center; gap: 10px; height: 32px; padding: 0 6px 0 12px; border-radius: 999px; border: 1px solid var(--line-2); background: color-mix(in srgb, var(--bg) 70%, transparent);
    font-size: 13px; color: var(--fg-2); transition: border-color .15s, color .15s; backdrop-filter: blur(6px); }
  .badge-link:hover { border-color: var(--line-3); color: var(--fg); }
  .badge-link .pill { font: 12px/1 var(--mono); color: var(--fg); background: var(--bg-2); border-radius: 999px; padding: 5px 8px; display: inline-flex; gap: 4px; align-items: center; }
  h1 { margin: 26px auto 0; max-width: 13em; font-size: clamp(40px, 7.2vw, 76px); line-height: 1.02; font-weight: 650; letter-spacing: -.05em; text-wrap: balance;
    background: linear-gradient(180deg, var(--fg) 30%, color-mix(in srgb, var(--fg) 62%, var(--bg))); -webkit-background-clip: text; background-clip: text; color: transparent; padding-bottom: .06em; }
  [data-lang="zh"] h1, [data-lang="ja"] h1 { letter-spacing: -.03em; line-height: 1.1; }
  /* 中日文只在标点、空格处换行，避免把词拆开（「官方网 / 站」） */
  [data-lang="zh"] :is(h1, h2, .lead, .sub, .caption, .detect), [data-lang="ja"] :is(h1, h2, .lead, .sub, .caption, .detect) { word-break: keep-all; overflow-wrap: anywhere; line-break: strict; }
  .lead { margin: 22px auto 0; max-width: 34em; color: var(--fg-2); font-size: 18px; line-height: 1.6; text-wrap: pretty; }
  .cta { margin-top: 34px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .detect { margin: 16px auto 0; min-height: 22px; font-size: 13px; color: var(--fg-3); display: flex; gap: 8px; justify-content: center; align-items: center; }
  .detect .dot { flex: none; }

  /* ── showcase ── */
  .showcase { margin-top: 64px; }
  .tabs { display: flex; justify-content: center; gap: 4px; padding: 4px; margin: 0 auto 20px; width: max-content; max-width: 100%; border: 1px solid var(--line); border-radius: 12px; background: var(--bg-1); overflow-x: auto; scrollbar-width: none; }
  .tabs::-webkit-scrollbar { display: none; }
  .tab { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; border-radius: 8px; border: 0; background: none; color: var(--fg-2); font-size: 14px; cursor: pointer; white-space: nowrap; transition: color .15s, background .15s; }
  .tab:hover { color: var(--fg); }
  .tab[aria-selected="true"] { color: var(--fg); background: var(--bg-2); box-shadow: 0 0 0 1px var(--line-2); }
  .stage { position: relative; border-radius: 16px; padding: 8px; background: linear-gradient(180deg, var(--line-2), var(--line) 40%, transparent); box-shadow: var(--shadow); }
  .frames { position: relative; border-radius: 10px; overflow: hidden; background: #1a1a1a; aspect-ratio: 1456 / 955; }
  .frame { position: absolute; inset: 0; opacity: 0; transition: opacity .45s var(--ease), transform .6s var(--ease); transform: scale(1.012); }
  .frame.on { opacity: 1; transform: none; }
  .frame a { display: block; height: 100%; cursor: zoom-in; }
  .frame:not(.on) { pointer-events: none; }
  .frame img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
  .zoom-hint { display: none; }
  .caption { margin: 18px auto 0; max-width: 40em; text-align: center; color: var(--fg-2); font-size: 15px; min-height: 3.2em; }
  .caption b { color: var(--fg); font-weight: 600; }
  .caption > div { display: none; } .caption > div.on { display: block; }
  html:not(.js) .frame:first-child, html:not(.js) .caption > div:first-child { opacity: 1; display: block; }

  /* ── sections ── */
  section.block { padding: 112px 0 0; }
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; font: 12px/1 var(--mono); color: var(--fg-3); text-transform: uppercase; letter-spacing: .1em; }
  .eyebrow::before { content: ""; width: 14px; height: 1px; background: var(--fg-3); }
  h2 { margin: 14px 0 0; font-size: clamp(28px, 4vw, 40px); line-height: 1.12; font-weight: 650; letter-spacing: -.04em; text-wrap: balance; }
  [data-lang="zh"] h2, [data-lang="ja"] h2 { letter-spacing: -.02em; }
  .sub { margin: 12px 0 0; color: var(--fg-2); font-size: 16px; max-width: 38em; text-wrap: pretty; }
  .head-row { display: flex; align-items: end; justify-content: space-between; gap: 24px; flex-wrap: wrap; }

  /* bento */
  .bento { margin-top: 40px; display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; background: var(--line); gap: 1px; }
  .cell { position: relative; background: var(--bg); padding: 28px; min-height: 172px; }
  .cell .gl { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 9px; border: 1px solid var(--line-2); background: var(--bg-1); color: var(--fg); }
  .cell h3 { margin: 18px 0 0; font-size: 16px; font-weight: 600; letter-spacing: -.015em; }
  .cell p { margin: 6px 0 0; font-size: 14px; color: var(--fg-2); }

  /* spotlight */
  .spot { position: relative; isolation: isolate; }
  .spot::before { content: ""; position: absolute; inset: 0; z-index: -1; opacity: 0; transition: opacity .3s; border-radius: inherit; pointer-events: none;
    background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), var(--spot), transparent 60%); }
  @media (hover: hover) { .spot:hover::before { opacity: 1; } }

  /* install cards */
  .mobile-tip { display: none; margin-top: 32px; gap: 14px; align-items: flex-start; padding: 16px 18px; border: 1px solid var(--line-2); border-radius: var(--r); background: var(--bg-1); font-size: 14px; color: var(--fg-2); }
  .mobile-tip b { color: var(--fg); font-weight: 600; display: block; margin-bottom: 2px; }
  .mobile-tip .gl { flex: none; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 9px; border: 1px solid var(--line-2); color: var(--fg); background: var(--bg); }
  [data-device="mobile"] .mobile-tip { display: flex; }
  .mt-ios, .mt-android { display: none; } [data-os="ios"] .mt-ios, [data-os="android"] .mt-android, [data-os="other"] .mt-android { display: inline; }
  .cards { margin-top: 32px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .card { border: 1px solid var(--line); border-radius: 14px; background: var(--bg-1); padding: 24px; display: flex; flex-direction: column; gap: 12px; transition: border-color .2s, transform .2s var(--ease), box-shadow .2s; }
  .card:hover { border-color: var(--line-2); }
  .card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .glyph { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--line-2); background: var(--bg); }
  .card h3 { margin: 6px 0 0; font-size: 19px; font-weight: 600; letter-spacing: -.02em; }
  .card p { margin: 0; color: var(--fg-2); font-size: 14px; }
  .card-foot { margin-top: auto; padding-top: 10px; display: flex; flex-direction: column; gap: 10px; }
  .note { font: 12px/1.5 var(--mono); color: var(--fg-3); }
  .chip { display: inline-flex; align-items: center; gap: 7px; height: 24px; padding: 0 9px; font: 12px/1 var(--mono); color: var(--fg-2); border: 1px solid var(--line-2); border-radius: 999px; white-space: nowrap; background: var(--bg); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--fg-3); }
  .dot.ok { background: var(--ok); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ok) 22%, transparent); }
  .dot.wait { background: var(--wait); box-shadow: 0 0 0 3px color-mix(in srgb, var(--wait) 22%, transparent); }
  .dot.info { background: var(--info); box-shadow: 0 0 0 3px color-mix(in srgb, var(--info) 22%, transparent); }
  .rec-badge { display: none; position: absolute; top: -11px; left: 20px; height: 22px; padding: 0 9px; align-items: center; border-radius: 999px; font-size: 12px; font-weight: 500; background: var(--inv); color: var(--inv-fg); }
  .card.rec { border-color: var(--fg-3); box-shadow: 0 0 0 1px var(--fg-3), 0 20px 50px -30px var(--glow); background: var(--bg); }
  .card.rec .rec-badge { display: inline-flex; }

  /* chromium steps */
  .panel { margin-top: 40px; border: 1px solid var(--line); border-radius: 16px; background: var(--bg-1); display: grid; grid-template-columns: .9fr 1.1fr; overflow: hidden; }
  .panel > div { padding: 36px; }
  .panel > div + div { border-left: 1px solid var(--line); background: var(--bg); }
  ol.steps { list-style: none; margin: 0; padding: 0; counter-reset: s; }
  ol.steps li { position: relative; padding: 0 0 28px 48px; counter-increment: s; }
  ol.steps li:last-child { padding-bottom: 0; }
  ol.steps li::before { content: counter(s); position: absolute; left: 0; top: -2px; width: 30px; height: 30px; display: grid; place-items: center; font: 500 13px/1 var(--mono); border: 1px solid var(--line-2); border-radius: 50%; background: var(--bg-1); }
  ol.steps li:not(:last-child)::after { content: ""; position: absolute; left: 15px; top: 34px; bottom: 4px; width: 1px; background: linear-gradient(var(--line-2), var(--line)); }
  ol.steps b { display: block; font-weight: 600; letter-spacing: -.01em; }
  ol.steps p { margin: 4px 0 0; color: var(--fg-2); font-size: 14px; }
  code { font: 12.5px/1.4 var(--mono); background: var(--bg-2); border: 1px solid var(--line); border-radius: 6px; padding: 2px 6px; white-space: nowrap; }
  .hash { margin-top: 24px; display: flex; align-items: center; gap: 10px; border: 1px solid var(--line); border-radius: 10px; padding: 6px 6px 6px 12px; background: var(--bg); }
  .hash .k { font: 11px/1 var(--mono); color: var(--fg-3); letter-spacing: .04em; }
  .hash code { border: 0; padding: 0; background: none; color: var(--fg-2); overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; }
  .copy { flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 7px; border: 0; background: none; color: var(--fg-2); cursor: pointer; }
  .copy:hover { color: var(--fg); background: var(--bg-2); }
  .copy .ok-ic { display: none; } .copy.done .ok-ic { display: block; color: var(--ok); } .copy.done .cp-ic { display: none; }
  .facts { margin: 24px 0 0; padding: 0; list-style: none; display: grid; gap: 10px; font-size: 14px; color: var(--fg-2); }
  .facts li { display: flex; gap: 10px; align-items: flex-start; } .facts svg { flex: none; margin-top: 3px; color: var(--ok); }

  /* faq */
  .faq { margin-top: 40px; border-top: 1px solid var(--line); }
  .faq details { border-bottom: 1px solid var(--line); }
  .faq summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; font-size: 16px; font-weight: 500; letter-spacing: -.01em; }
  .faq summary::-webkit-details-marker { display: none; }
  .faq summary svg { flex: none; color: var(--fg-3); transition: transform .25s var(--ease); }
  .faq details[open] summary svg { transform: rotate(180deg); }
  .faq summary:hover { color: var(--fg); } .faq summary:hover svg { color: var(--fg); }
  .faq .a { padding: 0 4px 24px; color: var(--fg-2); max-width: 46em; }
  .faq-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 48px; align-items: start; }
  @media (min-width: 961px) { .faq-grid > div:first-child { position: sticky; top: 104px; } }

  /* footer */
  footer { margin-top: 120px; border-top: 1px solid var(--line); padding: 32px 0 calc(40px + env(safe-area-inset-bottom)); color: var(--fg-3); font-size: 13px; }
  footer .wrap { display: flex; gap: 12px 24px; justify-content: space-between; align-items: center; flex-wrap: wrap; }
  footer .left { display: flex; gap: 10px; align-items: center; }
  footer img { width: 20px; height: 20px; border-radius: 5px; opacity: .9; }
  footer a:hover { color: var(--fg); }

  /* mobile install dock */
  .dock { display: none; }

  /* reveal */
  .js .rv { opacity: 0; transform: translateY(14px); transition: opacity .7s var(--ease), transform .7s var(--ease); }
  .js .rv.in { opacity: 1; transform: none; }

  /* ── responsive ── */
  @media (max-width: 960px) {
    nav.links { display: none; }
    .bento { grid-template-columns: repeat(2, 1fr); }
    .cards { grid-template-columns: 1fr; gap: 20px; max-width: 560px; }
    .panel { grid-template-columns: 1fr; }
    .panel > div + div { border-left: 0; border-top: 1px solid var(--line); }
    .faq-grid { grid-template-columns: 1fr; gap: 0; }
    .card.rec { order: -1; }
  }
  @media (max-width: 640px) {
    body { font-size: 15px; }
    .wrap { padding: 0 16px; }
    .bar { height: 56px; }
    .ver, .tool .lbl, .hdr-install { display: none; }
    .bar { gap: 2px; }
    .brand { margin-right: 0; }
    .hero { padding-top: 44px; }
    h1 { font-size: clamp(36px, 11vw, 48px); }
    .lead { font-size: 16px; margin-top: 18px; }
    .cta { margin-top: 28px; flex-direction: column; align-items: stretch; }
    .cta .btn { width: 100%; }
    .showcase { margin-top: 44px; }
    .tabs { justify-content: flex-start; width: auto; max-width: none; margin: 0 -16px 14px; border-radius: 0; border-width: 1px 0; padding: 6px 12px; scroll-snap-type: x mandatory; }
    .tab { scroll-snap-align: center; height: 38px; }
    .stage { padding: 5px; border-radius: 12px; margin: 0 -4px; }
    .frames { border-radius: 8px; }
    .caption { font-size: 14px; text-align: left; }
    .zoom-hint { display: block; margin: 8px 0 0; font: 12px/1.4 var(--mono); color: var(--fg-3); }
    section.block { padding-top: 80px; }
    .bento { grid-template-columns: 1fr; }
    .cell { padding: 20px 20px 22px; min-height: 0; display: grid; grid-template-columns: auto 1fr; column-gap: 14px; }
    .cell .gl { grid-row: span 2; }
    .cell h3 { margin: 4px 0 0; }
    .card { padding: 20px; }
    .card .btn { height: 46px; }
    .panel > div { padding: 24px 20px; }
    .faq summary { padding: 18px 2px; font-size: 15px; min-height: 56px; }
    footer { margin-top: 88px; padding-bottom: calc(96px + env(safe-area-inset-bottom)); }
    footer .wrap { flex-direction: column; align-items: flex-start; }
    .dock { display: flex; position: fixed; z-index: 50; left: 12px; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); gap: 8px; padding: 8px; border-radius: 16px;
      border: 1px solid var(--line-2); background: color-mix(in srgb, var(--bg-1) 85%, transparent); backdrop-filter: saturate(180%) blur(16px); -webkit-backdrop-filter: saturate(180%) blur(16px);
      box-shadow: 0 10px 40px -10px rgba(0,0,0,.5); transform: translateY(140%); transition: transform .35s var(--ease); }
    .dock.show { transform: none; }
    .dock .btn { height: 46px; }
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
    <label class="tool" title="Language">
      ${ico('globe', 17)}<span class="lbl" data-lang-label>中文</span>
      <select id="lang" aria-label="Language"><option value="zh">中文</option><option value="en">English</option><option value="ja">日本語</option></select>
    </label>
    <button class="tool" id="theme" type="button" aria-label="Theme" data-theme-ic="system">
      <span class="theme-ic ic-system">${ico('monitor', 17)}</span><span class="theme-ic ic-light">${ico('sun', 17)}</span><span class="theme-ic ic-dark">${ico('moon', 17)}</span>
    </button>
    ${repoUrl ? `<a class="tool" href="${esc(repoUrl)}" rel="noopener" aria-label="GitHub">${ico('github', 17)}</a>` : ''}
    <a class="btn primary btn-sm hdr-install" href="#install" style="margin-left:6px">${L('安装', 'Install', '導入')}</a>
  </div>
</header>

<main id="top">
  <section class="hero">
    <div class="wrap">
      <a class="badge-link rv" href="#install"><span>${L('新版本已发布', 'New release', '新バージョン公開')}</span><span class="pill">v${v} ${ico('arrow', 12, 2)}</span></a>
      <h1 class="rv">${L('让 Iwara 用起来<br>更顺手', 'Iwara, made<br>more convenient', 'Iwara を、<br>もっと快適に')}</h1>
      <p class="lead rv">${L(
        '创作工作台、高级搜索、卡片预览、订阅筛选、原地翻译……直接加在官方网站上，原来的页面照常可用。',
        'A creator studio, advanced search, card previews, subscription filters, in-place translation and more — added right on the official site, which keeps working as before.',
        'クリエイタースタジオ、詳細検索、カードプレビュー、購読フィルター、その場翻訳など。公式サイトにそのまま追加し、元のページもいつも通り使えます。')}</p>
      <div class="cta rv">
        <a class="btn primary lg" href="#install" id="hero-cta">${L('免费安装', 'Install for free', '無料で導入')}${ico('arrow', 15)}</a>
        <a class="btn lg" href="#features">${L('看看有什么', 'See what’s inside', '機能を見る')}</a>
      </div>
      <p class="detect rv" id="detect" aria-live="polite"></p>

      <div class="showcase rv" id="features">
        <div class="tabs" role="tablist" aria-label="Screenshots">
          ${SHOTS.map((s, i) => `<button class="tab" type="button" role="tab" id="tab-${s.id}" aria-controls="frm-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">${ico(s.icon, 15)}${s.t}</button>`).join('')}
        </div>
        <div class="stage">
          <div class="frames">
            ${SHOTS.map((s, i) => `<div class="frame${i === 0 ? ' on' : ''}" id="frm-${s.id}" role="tabpanel" aria-labelledby="tab-${s.id}"><a href="${s.file}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="${s.file}" width="${s.w}" height="${s.h}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></a></div>`).join('')}
          </div>
        </div>
        <div class="caption">
          ${SHOTS.map((s, i) => `<div${i === 0 ? ' class="on"' : ''}><b>${s.t}</b> — ${s.d}</div>`).join('')}
          <p class="zoom-hint">${L('点截图查看大图 · 左右滑动切换', 'Tap a screenshot for full size · swipe to switch', 'タップで拡大・スワイプで切り替え')}</p>
        </div>
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
      <div class="head-row">
        <div>
          <div class="eyebrow rv">${L('安装', 'Install', '導入')}</div>
          <h2 class="rv">${L('选一种装法，功能完全一样', 'Pick one way to install — same features', '導入方法を 1 つ選ぶだけ。機能は同じ')}</h2>
          <p class="sub rv">${L('只启用其中一种：装扩展前，先停用油猴脚本。', 'Enable just one: disable the userscript before installing an extension.', 'どれか 1 つだけ有効に。拡張機能を入れる前にスクリプトを無効にしてください。')}</p>
        </div>
      </div>
      <div class="mobile-tip rv">
        <span class="gl">${ico('phone', 17)}</span>
        <div><b>${L('在手机上？用油猴脚本', 'On a phone? Use the userscript', 'スマホなら、ユーザースクリプトで')}</b>
          <span class="mt-android">${L('Android：用 Firefox 装 Violentmonkey 或 Tampermonkey，再回来点「安装脚本」。', 'Android: install Violentmonkey or Tampermonkey in Firefox, then come back and tap “Install script”.', 'Android：Firefox に Violentmonkey か Tampermonkey を入れてから「スクリプトを入れる」をタップ。')}</span>
          <span class="mt-ios">${L('iPhone / iPad：给 Safari 装一个支持用户脚本的扩展（例如 Userscripts），再回来点「安装脚本」。', 'iPhone / iPad: add a userscript extension to Safari (for example Userscripts), then tap “Install script”.', 'iPhone / iPad：Safari にユーザースクリプト対応の拡張機能（例：Userscripts）を入れてから「スクリプトを入れる」をタップ。')}</span>
        </div>
      </div>
      <div class="cards rv">${cards}
      </div>
    </div>
  </section>

  <section class="block" id="chromium">
    <div class="wrap">
      <div class="eyebrow rv">Chrome · Edge · Brave</div>
      <h2 class="rv">${L('手动加载，一分钟搞定', 'Load it by hand in a minute', '手動で読み込み、1 分で完了')}</h2>
      <div class="panel rv">
        <div>
          <p class="sub" style="margin:0">${L('应用商店不收录这个扩展，所以需要开一次开发者模式。之后有新版时，扩展会在 iwara 页面上提示你。', 'The stores don’t list this extension, so you turn on Developer mode once. After that, the extension tells you on iwara when an update is out.', 'ストアに掲載されていないため、一度だけデベロッパーモードを使います。その後は新しいバージョンが出ると iwara 上でお知らせします。')}</p>
          <ul class="facts">
            <li>${ico('check', 15, 2)}<span>${L('设置保存在网站里，覆盖升级不会丢', 'Settings live on the site, so updates keep them', '設定はサイト側に保存され、更新しても消えません')}</span></li>
            <li>${ico('check', 15, 2)}<span>${L('只申请 iwara 站点权限，外加两项无提示的权限', 'Only iwara site access, plus two silent permissions', 'iwara のサイト権限のみ（通知なしの権限 2 つを含む）')}</span></li>
            <li>${ico('check', 15, 2)}<span>${L('每天最多查一次版本，不带任何参数', 'Checks for updates at most once a day, with no parameters', 'バージョン確認は 1 日 1 回まで、パラメーターなし')}</span></li>
          </ul>
          <div class="hash">
            <span class="k">SHA-256</span>
            <code id="sha" title="${esc(latest.chromium.sha256)}">${esc(latest.chromium.sha256)}</code>
            <button class="copy" type="button" data-copy="sha" aria-label="Copy SHA-256"><span class="cp-ic">${ico('copy', 15)}</span><span class="ok-ic">${ico('check', 15, 2)}</span></button>
          </div>
          <div class="btn-row" style="margin-top:16px">
            <a class="btn primary grow" href="${esc(latest.chromium.zip)}">${ico('down', 15)}${L('下载 .zip', 'Download .zip', '.zip を入手')}</a>
          </div>
        </div>
        <div>
          <ol class="steps">
            <li><b>${L('解压到一个固定的文件夹', 'Unzip into a folder you keep', '決まったフォルダーに展開')}</b>
              <p>${L('别放在「下载」里随手删掉；以后的更新也解压到这里覆盖。', 'Not somewhere you’ll clean out — future updates unzip over it.', '消してしまわない場所に。今後の更新もここに上書きします。')}</p></li>
            <li><b>${L('打开扩展管理页', 'Open the extensions page', '拡張機能ページを開く')}</b>
              <p><code>chrome://extensions</code> · <code>edge://extensions</code><br>${L('打开「开发者模式」开关。', 'Turn on “Developer mode”.', '「デベロッパーモード」をオンに。')}</p></li>
            <li><b>${L('加载已解压的扩展程序', 'Click “Load unpacked”', '「パッケージ化されていない拡張機能を読み込む」')}</b>
              <p>${L('选刚才的文件夹，再刷新已经打开的 iwara 页面。', 'Pick that folder, then reload any open iwara tabs.', 'そのフォルダーを選び、開いている iwara を再読み込み。')}</p></li>
            <li><b>${L('以后更新', 'Updating later', '今後の更新')}</b>
              <p>${L('下载新的 zip 解压覆盖，在扩展卡片上点刷新按钮。', 'Unzip the new zip over the folder, then hit reload on the extension’s card.', '新しい zip を上書き展開し、拡張機能カードの再読み込みを押します。')}</p></li>
          </ol>
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
    <div class="left"><img src="icon.png" alt="" width="20" height="20"><span>Iwara Enhanced v${v} · ${esc(latest.date)} · MIT</span></div>
    <div class="left">
      <span>${L('非官方项目，与 Iwara 无关联', 'Unofficial, not affiliated with Iwara', '非公式・Iwara とは無関係')}</span>
      <span aria-hidden="true">·</span>
      <span>${L('本页无 Cookie、无统计', 'No cookies, no analytics', 'Cookie・解析なし')}</span>
      ${repoUrl ? `<span aria-hidden="true">·</span><a href="${esc(repoUrl)}" rel="noopener">GitHub</a>` : ''}
    </div>
  </div>
</footer>

<div class="dock" id="dock" aria-hidden="true">
  <a class="btn primary grow" id="dock-main" href="#install">${L('安装', 'Install', '導入')}</a>
  <a class="btn" href="#install">${L('全部方式', 'All options', 'すべての方法')}</a>
</div>

<script>
(() => {
  const d = document.documentElement, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = (k, v) => { try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };

  // 语言
  const NAMES = { zh: '中文', en: 'English', ja: '日本語' };
  const TITLES = { zh: '让 Iwara 用起来更顺手', en: 'Iwara, made more convenient', ja: 'Iwara をもっと快適に' };
  const setLang = (l) => { d.dataset.lang = l; d.lang = l === 'zh' ? 'zh-CN' : l; $('#lang').value = l; $('[data-lang-label]').textContent = NAMES[l]; document.title = 'Iwara Enhanced — ' + TITLES[l]; };
  setLang(d.dataset.lang);
  $('#lang').addEventListener('change', (e) => { setLang(e.target.value); store('iwe-lang', e.target.value); });

  // 主题：跟随系统 → 浅色 → 深色
  const themeBtn = $('#theme'), ORDER = ['system', 'light', 'dark'];
  const paintTheme = () => { const t = d.dataset.theme || 'system'; themeBtn.dataset.themeIc = t; themeBtn.setAttribute('aria-label', 'Theme: ' + t); };
  paintTheme();
  themeBtn.addEventListener('click', () => {
    const next = ORDER[(ORDER.indexOf(d.dataset.theme || 'system') + 1) % 3];
    if (next === 'system') { delete d.dataset.theme; store('iwe-theme'); } else { d.dataset.theme = next; store('iwe-theme', next); }
    paintTheme();
  });

  // 顶栏滚动后加边框
  const hdr = $('#hdr');
  const onScroll = () => hdr.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // 截图标签页（方向键切换，自动轮播到用户第一次操作为止）
  const tabs = $$('.tab'), frames = $$('.frame'), caps = $$('.caption > div');
  let cur = 0, timer = null;
  const show = (i, focus) => {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === cur)); t.tabIndex = k === cur ? 0 : -1; });
    frames.forEach((f, k) => f.classList.toggle('on', k === cur));
    caps.forEach((c, k) => c.classList.toggle('on', k === cur));
    if (focus) tabs[cur].focus();
    tabs[cur].scrollIntoView({ block: 'nearest', inline: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const stop = () => { clearInterval(timer); timer = null; };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { stop(); show(i); });
    t.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); stop(); show(cur + k, true); }
      if (e.key === 'Home') { e.preventDefault(); stop(); show(0, true); }
      if (e.key === 'End') { e.preventDefault(); stop(); show(tabs.length - 1, true); }
    });
  });
  const stage = $('.stage');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && timer === null && !stage.dataset.touched) timer = setInterval(() => show(cur + 1), 5000);
      else if (!e.isIntersecting) stop();
    }, { threshold: .4 });
    io.observe(stage);
    ['pointerdown', 'keydown'].forEach((ev) => $('.showcase').addEventListener(ev, () => { stage.dataset.touched = 1; stop(); }, { once: true }));
  }
  // 手机上左右滑动截图切换
  let sx = null;
  stage.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40) { stop(); show(cur + (dx < 0 ? 1 : -1)); } });

  // 按设备和浏览器推荐装法
  const ua = navigator.userAgent, iPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  const os = /Android/i.test(ua) ? 'android' : /iPhone|iPad|iPod/i.test(ua) || iPadOS ? 'ios' : 'desktop';
  const mobile = os !== 'desktop';
  const firefox = /Firefox\\/|FxiOS/.test(ua), chromium = !firefox && (/Chrome\\/|Chromium\\/|Edg\\//.test(ua) || !!window.chrome);
  const ffReady = d.dataset.ffReady === '1';
  d.dataset.device = mobile ? 'mobile' : 'desktop';
  d.dataset.os = mobile ? os : 'other';
  const rec = mobile ? 'script' : firefox ? (ffReady ? 'firefox' : 'script') : chromium ? 'chromium' : 'script';
  const BROWSER = mobile ? (os === 'ios' ? 'iPhone / iPad' : 'Android')
    : firefox ? 'Firefox' : /Edg\\//.test(ua) ? 'Edge' : /OPR\\//.test(ua) ? 'Opera' : chromium ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : '';
  const LABEL = {
    script: ['安装油猴脚本', 'Install the userscript', 'スクリプトを入れる'],
    firefox: ['安装 Firefox 版', 'Get the Firefox add-on', 'Firefox 版を入手'],
    chromium: ['下载 Chrome 扩展', 'Download for Chrome', 'Chrome 版を入手'],
  }[rec];
  const span = (t) => '<span data-l="zh">' + t[0] + '</span><span data-l="en">' + t[1] + '</span><span data-l="ja">' + t[2] + '</span>';
  $$('[data-card]').forEach((c) => c.classList.toggle('rec', c.dataset.card === rec));
  const act = $('[data-act="' + rec + '"]');
  if (BROWSER) {
    $('#detect').innerHTML = '<i class="dot ok"></i>' + span([
      '检测到 ' + BROWSER + '，为你推荐：' + LABEL[0],
      BROWSER + ' detected — we suggest: ' + LABEL[1].charAt(0).toLowerCase() + LABEL[1].slice(1),
      BROWSER + ' を検出：おすすめは「' + LABEL[2] + '」']);
  }
  const arrow = ${JSON.stringify(ico('arrow', 15))};
  if (act) {
    const heroCta = $('#hero-cta');
    heroCta.innerHTML = span(LABEL) + arrow;
    heroCta.href = act.getAttribute('href');
    if (act.hasAttribute('rel')) heroCta.rel = act.getAttribute('rel');
    const dm = $('#dock-main'); dm.innerHTML = span(LABEL); dm.href = act.getAttribute('href');
  }

  // 手机底部安装栏：首屏按钮滚出去后出现，到了安装区收起
  const dock = $('#dock'), heroCta = $('#hero-cta'), install = $('#install'), seen = { hero: true, install: false };
  const paintDock = () => { const on = !seen.hero && !seen.install; dock.classList.toggle('show', on); dock.setAttribute('aria-hidden', String(!on)); };
  new IntersectionObserver((es) => { es.forEach((e) => { seen[e.target === heroCta ? 'hero' : 'install'] = e.isIntersecting; }); paintDock(); }).observe(heroCta);
  new IntersectionObserver((es) => { es.forEach((e) => { seen.install = e.isIntersecting; }); paintDock(); }, { rootMargin: '0px 0px -30% 0px' }).observe(install);

  // 进入视口时淡入
  const rio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach((el) => rio.observe(el));

  // 卡片聚光灯（只在有鼠标的设备上）
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.spot').forEach((el) => el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));
  }

  // 复制校验值
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#' + b.dataset.copy).textContent.trim()); b.classList.add('done'); setTimeout(() => b.classList.remove('done'), 1500); } catch (e) {}
  }));
})();
</script>
</body>
</html>
`;
}
