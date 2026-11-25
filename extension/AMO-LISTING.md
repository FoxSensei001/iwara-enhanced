# AMO 商品页文案

在 AMO 开发者中心提交时，照下面的字段填。默认语言用英语，中文和日语在商品页的「添加语言」里另填。插件功能改了，这里也要跟着改。

上传和审核步骤见 [README.md](README.md) 的「发版步骤」，审核备注在同一文件末尾。

## 固定字段

| 字段 | 填什么 |
| --- | --- |
| Name | Iwara Enhanced |
| Add-on URL | `iwara-enhanced` |
| Categories | Photos, Music & Videos；Search Tools |
| Support website | `https://github.com/FoxSensei001/iwara-enhanced/issues` |
| Homepage | `https://foxsensei001.github.io/iwara-enhanced/`（manifest 里的 `homepage_url` 会被自动填进来，要手动改成这个） |
| License | MIT License |
| This add-on is experimental | 不勾 |
| Requires payment | 不勾 |
| Tags | 只能从 AMO 给的列表里勾：`search`、`translate` |

截图要求：不要出现任何成人内容（AMO 商品页面向所有人）。用下载页的演示窗口截，那里的视频、作者、评论都是编的；尺寸 1280×800。0.1.0 上传的 5 张：高级搜索（筛选面板展开）、创作工作台第 2 步、订阅页筛选、卡片预览、评论翻译，英文界面、浅色主题，缩略图上的 R-18 角标隐藏。

图标：在「图像」里上传 `extension/icons/icon-128.png`，否则商品页显示 AMO 的默认图标。

## Summary（≤ 250 字符）

- **English**：Makes the official Iwara site (iwara.tv / iwara.ai) easier to use: a step-by-step creator studio, advanced search, a real pager, tag filters, card previews and one-click translation of comments. Unofficial; runs only on Iwara.
- **简体中文**：让 Iwara 官方网站（iwara.tv / iwara.ai）用起来更顺手：分步创作工作台、高级搜索、真正的分页、标签筛选、卡片预览、评论一键翻译。非官方，只在 Iwara 上运行。
- **日本語**：Iwara 公式サイト（iwara.tv / iwara.ai）をもっと使いやすく：ステップ式の投稿スタジオ、詳細検索、ページ番号ナビ、タグ絞り込み、カードプレビュー、コメントのワンクリック翻訳。非公式で、Iwara 上でのみ動作します。

## Description

### English

Iwara Enhanced adds the things creators and viewers keep reaching for on the official Iwara site. The original pages keep working as before; nothing is removed, ads included.

**For creators**
- A step-by-step studio for uploading and editing videos and images: Upload → Content → Tags → Publish. A video starts uploading as soon as you pick it.
- A live Markdown editor in every comment, reply and forum box, with a character counter.

**For viewers**
- Advanced search: several tags (all / any), excluded tags, authors, exact phrases, dates, video length and rating, with a preview of the query.
- A classic pager that jumps to any page, or infinite scroll if you prefer.
- Subscription and creator pages get sort, rating, year / month and tag filters that switch without reloading.
- A "⋯" on every card opens a preview: large cover, full title, stats, description and tags, with like and copy link.
- Tags show in your language; comments, posts, titles and descriptions get a Translate button.

Try the features on the download page before installing: https://foxsensei001.github.io/iwara-enhanced/

**Privacy**: settings stay in the site's own storage. Nothing is sent to the developer. Only when you click Translate is that piece of text sent to Google Translate.

Unofficial community project, not affiliated with Iwara. Please follow Iwara's site rules.

### 简体中文

Iwara Enhanced 给 Iwara 官方网站补上创作者和观众常用的功能。原来的页面照常可用，不删任何东西，包括广告。

**给创作者**
- 视频、图片的上传和编辑变成分步工作台：上传 → 内容 → 标签 → 发布，视频选好就开始上传。
- 评论、回复、论坛的输入框都换成实时预览的 Markdown 编辑器，带字数统计。

**给观众**
- 高级搜索：多个标签（全部 / 任一）、排除标签、作者、精确短语、日期、视频时长、分级，并实时显示生成的搜索条件。
- 列表页加上能跳到任意页的分页器，也可以改成无限滚动。
- 订阅页和作者主页可以按排序、分级、年月、标签筛选，切换不用刷新。
- 每张卡片的「⋯」打开预览：大封面、完整标题、数据、简介和标签，还能点赞、复制链接。
- 标签显示成你的语言；评论、帖子、标题和简介都有「翻译」按钮。

安装前可以先在下载页试用这些功能：https://foxsensei001.github.io/iwara-enhanced/

**隐私**：设置只存在网站自己的存储里，不向开发者发送任何数据。只有你点「翻译」时，那一段文字会发给谷歌翻译。

非官方社区项目，与 Iwara 无关。请遵守 Iwara 的站点规则。

### 日本語

Iwara Enhanced は、Iwara 公式サイトにクリエイターと視聴者がよく欲しくなる機能を追加します。元のページはそのまま使え、広告を含め何も削除しません。

**クリエイター向け**
- 動画・画像の投稿と編集をステップ式のスタジオに：アップロード → 内容 → タグ → 公開。動画は選んだ瞬間からアップロードが始まります。
- コメント・返信・フォーラムの入力欄をライブプレビュー付きの Markdown エディターに。文字数カウンター付き。

**視聴者向け**
- 詳細検索：複数タグ（すべて / いずれか）、除外タグ、作者、完全一致のフレーズ、日付、動画の長さ、レーティング。組み立てた条件をその場で表示します。
- 任意のページに移動できるページ番号ナビ。無限スクロールにも切り替えられます。
- 購読ページと作者ページで、並び順・レーティング・年月・タグで絞り込み。再読み込みなしで切り替わります。
- カードの「⋯」でプレビュー：大きなカバー、タイトル全文、統計、説明、タグ。いいねやリンクのコピーも可能。
- タグを自分の言語で表示。コメント・投稿・タイトル・説明に「翻訳」ボタン。

インストール前にダウンロードページで各機能を試せます：https://foxsensei001.github.io/iwara-enhanced/

**プライバシー**：設定はサイト自身のストレージにのみ保存され、開発者には何も送信しません。「翻訳」を押したときだけ、そのテキストが Google 翻訳に送られます。

非公式のコミュニティプロジェクトで、Iwara とは関係ありません。Iwara のサイトルールを守ってご利用ください。

## Privacy Policy（英文，填进 AMO 的隐私政策栏）

Iwara Enhanced does not collect, store or send any personal data to its developer, and contains no analytics.

- Settings are kept in the browser storage of iwara.tv / iwara.ai, on your device only.
- When you click a Translate button, only that one block of text (a comment, post, title, description or bio) is sent to Google Translate (translate.googleapis.com) to get the translation. This only happens on your click. Google's privacy policy applies to that request.
- The add-on talks to the Iwara site only through the site's own pages and API, using your existing login, in the same way the site itself does.
