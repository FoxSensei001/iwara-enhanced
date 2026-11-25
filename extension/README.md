# 浏览器扩展版与发版手册

同一份源码，另一种装法：把用户脚本产物包成 MV3 扩展，content script 跑在页面主世界（`world: MAIN`，`document_start`），行为与油猴版（`@grant none`）一致。

```bash
cd userscripts/iwara-enhanced
npm run build:ext        # 先构建 user.js，再生成下面所有产物
```

| 产物 | 用途 |
| --- | --- |
| `extension/dist/`、`extension/iwara-enhanced-ext.zip` | Chromium 版（Chrome 111+ / Edge / Brave）：`chrome://extensions` → 开发者模式 → 加载已解压的扩展 → 选 `extension/dist` |
| `extension/dist-firefox/` | Firefox 版（140+）：调试用 `about:debugging` → 临时载入 → 选其中的 `manifest.json`；长期安装需要 AMO 签名 |
| `extension/release/` | 一次发版要上传的全部文件（见下文），每次构建重新生成，已签名的 `.xpi` 会保留 |

- 版本号只改 `src/00-header.txt` 的 `@version`（1–4 段数字、每段 ≤ 65535、不带前导 0），扩展 manifest、`latest.json`、`updates.json` 都从这里取。
- 与油猴版同时启用会重复注入（有 `__iweLoaded` 防重，但只有先到的那个生效），装扩展前请先停用油猴脚本。
- 设置都存在站点自己的 `localStorage` 里，换装法、覆盖升级都不会丢。

## 怎么拿到更新（三条渠道共用一次发版产物）

| 装法 | 更新方式 |
| --- | --- |
| 油猴脚本 | 脚本头带 `@updateURL`（`iwara-enhanced.meta.js`）/ `@downloadURL`（`iwara-enhanced.user.js`），由油猴按自己的周期检查 |
| Firefox · AMO 公开上架（`firefoxChannel: "listed"`，默认） | AMO 审核通过后由 Firefox 自动更新；manifest 里**不能**有 `update_url` |
| Firefox · 自分发（`firefoxChannel: "unlisted"`） | AMO 只签名、不公开；manifest 写入 `update_url` → 托管目录的 `updates.json`，Firefox 自动更新 |
| Chromium 系 | 非商店安装没法静默自更新（Windows / macOS 的 Chrome 会拦截商店以外的 CRX，只有企业策略能放行），所以只做提示：后台每天最多查一次 `latest.json`，有新版时工具栏图标显示 `NEW`，并在 iwara 页面左下角提示一次，附下载链接。用户下载 zip，解压覆盖原来的目录，再在 `chrome://extensions` 点刷新。目录不变，扩展 ID 就不变 |

托管地址写在仓库根的 `release.config.json`：

```json
{ "baseUrl": "https://foxsensei001.github.io/iwara-enhanced", "downloadPage": "", "firefoxChannel": "listed", "firefoxListingUrl": "" }
```

托管方式：本仓库的 `gh-pages` 分支，内容只有发版文件，和源码历史无关。GitHub Pages 从这个分支的根目录发布，`baseUrl` 就是 Pages 地址。首页 `index.html` 是构建时用 `latest.json` 生成的下载页。`firefoxListingUrl` 填 AMO 上架后的商品页地址，下载页和 `latest.json` 会带上它。`repoUrl` 是下载页上的源码链接。

下载页由 `tool/release-page.mjs` 生成，用到的素材放在 `extension/page/`，构建时会一起复制进 `extension/release/`：
- Geist 字体（来自 npm 上的 `geist` 包，SIL OFL，许可证随字体一起发布）。
- 截图 `shot-*.jpg`：用 `docs/images/` 里的同名图裁成只剩浏览器窗口（裁掉上方标题，下边留 72px），再转成 JPEG（质量 80）。换截图时照这个规则重新导出。

页面不连任何第三方，也没有统计。推荐油猴脚本和 Firefox 版（都会自动更新），Chrome 手动加载只作备选；手机上只显示油猴脚本。安装引导每步一句话，配一张照真实界面画的示意图，按访客的浏览器和系统显示对应的步骤。语言默认跟随浏览器的语言偏好、主题默认跟随系统，都可以在顶栏的下拉菜单里改。改了浏览器、扩展的界面用语时，示意图里的文字（`tool/release-page.mjs` 的 `MOCK`）要跟着改。

- `baseUrl` 留空（默认）时：不写 `@updateURL`，不写 `update_url`，Chromium 版不带后台检查，也不生成 `latest.json` / `updates.json`。临时试验可以用环境变量 `IWE_RELEASE_BASE_URL`、`IWE_FIREFOX_CHANNEL` 覆盖。
- `downloadPage` 可选，填一个给人看的下载页（例如 Releases 页面）；留空时用 `baseUrl/`。
- 托管目录要求：HTTPS，每个文件的地址固定不变，响应带 `Access-Control-Allow-Origin`（Chromium 版的检查走跨域 fetch，不申请任何站点权限）。GitHub Pages 和 `raw.githubusercontent.com` 都满足；Releases 的 `latest/download/` 会重定向到 CDN，不保证带 CORS 头，不推荐放 `latest.json`。
- 改了 `baseUrl` 一定要带 `--build` 重新构建，否则构建会报 `@updateURL` 不一致。

### latest.json

```json
{
  "schema": 1, "name": "Iwara Enhanced", "version": "0.2.0", "date": "2026-12-01",
  "downloadPage": "https://…/",
  "userscript": { "install": "https://…/iwara-enhanced.user.js", "meta": "https://…/iwara-enhanced.meta.js" },
  "chromium": { "zip": "https://…/iwara-enhanced-chromium-0.2.0.zip", "sha256": "…", "minVersion": "111" },
  "firefox": { "channel": "unlisted", "id": "iwara-enhanced@loveiwara", "xpi": "https://…/iwara-enhanced-0.2.0.xpi", "updates": "https://…/updates.json", "minVersion": "140.0" }
}
```

`updates.json` 是 Mozilla 规定的格式（`addons.<id>.updates[]`，含 `version` / `update_link`），只在自分发时生成，只列当前这一个版本：Firefox 只会装比已装版本更高的那个。

## 发版步骤

1. 改 `src/00-header.txt` 的 `@version`。
2. `npm run build:ext`：构建自带的检查必须全过，最后一行确认版本号。
3. 校验 Firefox 包：`npx web-ext@8 lint --source-dir extension/dist-firefox`（自分发时加 `--self-hosted`，否则 `update_url` 会报错）。现状是 0 errors、18 warnings，都是已知项（见下面「给审核的说明」）。
4. Firefox（二选一）：
   - **公开上架**：在 AMO 开发者中心提交新版本，上传 `extension/release/iwara-enhanced-firefox-<版本>.zip`。问到是否用了打包 / 压缩工具时选「是」，并上传 `iwara-enhanced-source-<版本>.zip`；审核备注贴下面那段说明。也可以用命令行提交：`npx web-ext@8 sign --channel listed --source-dir extension/dist-firefox --upload-source-code extension/release/iwara-enhanced-source-<版本>.zip --api-key … --api-secret …`（首次提交还要加 `--amo-metadata`）。
   - **自分发**：`npx web-ext@8 sign --channel unlisted --source-dir extension/dist-firefox --artifacts-dir extension/release --upload-source-code extension/release/iwara-enhanced-source-<版本>.zip --api-key … --api-secret …`，再把签好的 xpi 改名为 `iwara-enhanced-<版本>.xpi`，放进 `extension/release/`。不放的话，`updates.json` 指向的文件不存在。
   - API 密钥在 AMO 账号的「管理 API 密钥」页面申请，只放在本机的环境变量里，不要写进仓库。
5. `npm run publish:pages`：把 `extension/release/` 里该公开的文件提交到本地的 `gh-pages` 分支，工作目录是 `extension/.pages/`。
   - 未签名的 Firefox 包和源码包不会放上去；公开上架时 xpi 和 `updates.json` 也不放。
   - 同名文件直接覆盖，旧版本的 zip / xpi 保留。
   - 这一步不推送。检查无误后自己执行 `git push origin gh-pages`。
   - 第一次推送后，到仓库 Settings → Pages 里把来源设为 `gh-pages` 分支的 `/ (root)`，以后不用再设。
6. 自查：浏览器打开 `<baseUrl>/latest.json`，确认版本号是新的；在油猴里点「检查更新」看能否拉到。Chromium 版的检查不会立刻发生（每天最多一次）；想马上试，可以在 `chrome://extensions` 里刷新扩展，安装或刷新时会强制查一次。

## 权限与隐私

- 两个版本都不申请 `host_permissions`：`content_scripts.matches` 里的四个 iwara 地址就是全部站点权限，安装时浏览器显示「读取和更改 iwara.tv / iwara.ai 上的数据」。主世界脚本不能用扩展 API，也不需要。
- Chromium 版配了 `baseUrl` 才多出 `alarms`（定时）和 `storage`（记下检查结果）两项，安装时都不会弹提示。检查请求是对固定地址的一次 GET：不带 Cookie、不带 Referer、没有查询参数，不上报版本号和任何用户信息，版本比较在本地做。托管方能看到的只有浏览器默认带的 IP 和 UA。
- Firefox 版没有后台脚本，不自己检查更新。`data_collection_permissions.required` 声明为 `websiteContent`：用户点「翻译」时，那一段评论 / 标题 / 简介会发给谷歌翻译，按 Mozilla 的定义算传输网页内容，不能写 `none`（构建会检查这一项）。
- 最低版本 Firefox 140：这个数据声明从 140 起才有内置的同意界面（`world: MAIN` 本身 128 就支持）。如果想照顾 128–139，可以把 `strict_min_version` 改回 128，代价是 lint 多出 `KEY_FIREFOX_UNSUPPORTED_BY_MIN_VERSION` 警告。另外，Mozilla 对旧版 Firefox 上传输数据的扩展有额外要求，需要自己核对。

## 给审核的说明（提交 AMO 时贴进 reviewer notes）

> The only script, `iwara-enhanced.js`, is built from the attached source package (`npm ci && node build-extension.mjs --build`, see `extension/SOURCE-BUILD.md`). It runs in the page's MAIN world on iwara.tv / iwara.ai only, because it works with the site's own single-page app and API session; it uses no extension APIs and loads no remote code. The `Function("return this")` warning comes from lodash inside the bundled Milkdown editor (`@milkdown/kit`, MIT). Of the 17 `innerHTML` warnings, 4 are inside the bundled Milkdown/ProseMirror code; the other 13 only insert SVG icon markup — either built into the add-on, or copied from the site's own menu / button icons on the same page — never user-written or remote content. Data: only when the user clicks a Translate button is that one text block sent to Google Translate, hence `websiteContent`; nothing is sent to the developer.
