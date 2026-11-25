// 把用户脚本产物包成 MV3 扩展（content script 跑在页面主世界），分 Chromium / Firefox 两份，并生成一次发版要托管的全部文件。
// 用法：node build-extension.mjs [--build]   （--build 先跑 build.mjs 生成最新 user.js）
// 产物：
//   extension/dist/            Chromium 版（可直接「加载已解压的扩展」）；extension/iwara-enhanced-ext.zip 是它的压缩包
//   extension/dist-firefox/    Firefox 版（签名前的目录）
//   extension/release/         一次发版要传到托管目录的文件（latest.json、updates.json、user.js、各平台包、源码包），见 extension/README.md
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { loadReleaseConfig } from './tool/release-config.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
if (process.argv.includes('--build')) {
  execFileSync('node', [path.join(root, 'build.mjs')], { cwd: root, stdio: 'inherit' });
}
const release = loadReleaseConfig(root);
const ext = path.join(root, 'extension');
const rel = (p) => path.relative(process.cwd(), p);

const userJs = fs.readFileSync(path.join(root, 'dist', 'iwara-enhanced.user.js'), 'utf8');
const m = userJs.match(/\/\/ @version\s+(\S+)/);
if (!m) throw new Error('user.js 里找不到 @version');
const version = m[1];
// manifest 的 version：1-4 段十进制数，非零段不许前导 0（Firefox），每段 ≤ 65535（Chrome）
const segs = version.split('.');
if (segs.length > 4 || !segs.every((x) => /^(0|[1-9]\d*)$/.test(x) && +x <= 65535)) throw new Error(`@version ${version} 不能当扩展版本号（1-4 段数字、每段 ≤ 65535、不带前导 0）`);
const headerBlock = userJs.match(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\n*/);
if (!headerBlock) throw new Error('没找到脚本头');
const body = userJs.slice(headerBlock[0].length);
if (release.baseUrl && !userJs.includes(`@updateURL    ${release.url('iwara-enhanced.meta.js')}`)) {
  throw new Error('user.js 的 @updateURL 和 release.config.json 不一致：改完配置要带 --build 重新构建');
}

const template = JSON.parse(fs.readFileSync(path.join(ext, 'manifest.template.json'), 'utf8').replace('__VERSION__', version));
const gecko = template.browser_specific_settings?.gecko;
if (!gecko?.id) throw new Error('manifest.template.json 缺 browser_specific_settings.gecko.id');
const dcp = gecko.data_collection_permissions?.required;
if (!Array.isArray(dcp)) throw new Error('manifest.template.json 缺 data_collection_permissions（AMO 现在要求新扩展必须声明）');
// 翻译会把用户点选的那一段页面文字发给谷歌翻译：按 Mozilla 的定义属于传输 websiteContent，不能写 none
if (fs.readdirSync(path.join(root, 'src')).some((f) => f.endsWith('.js') && fs.readFileSync(path.join(root, 'src', f), 'utf8').includes('translate.googleapis.com')) && !dcp.includes('websiteContent')) {
  throw new Error('src 里有发往谷歌翻译的请求，data_collection_permissions.required 必须含 websiteContent');
}
if (gecko.update_url) throw new Error('update_url 别写在模板里，由 release.config.json 的 baseUrl 生成');

function writeTarget(dir, manifest, extraFiles = {}) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'iwara-enhanced.js'), body);
  fs.writeFileSync(path.join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  if (fs.existsSync(path.join(ext, 'icons'))) fs.cpSync(path.join(ext, 'icons'), path.join(dir, 'icons'), { recursive: true });
  for (const [name, text] of Object.entries(extraFiles)) fs.writeFileSync(path.join(dir, name), text);
}
function zipDir(dir, zipFile) {
  fs.rmSync(zipFile, { force: true });
  execFileSync('zip', ['-qrX', zipFile, '.'], { cwd: dir });
}
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

// ── Chromium：不认 browser_specific_settings；配了托管地址才带上「每天查一次 latest.json」的后台和页面提示 ──
const chromium = structuredClone(template);
delete chromium.browser_specific_settings;
const chromiumExtra = {};
if (release.baseUrl) {
  chromium.permissions = ['alarms', 'storage']; // 两个都不会在安装时弹权限提示；查更新的请求不需要 host 权限（托管端返回 CORS 头）
  chromium.background = { service_worker: 'update-check.js' };
  chromium.action = { default_title: 'Iwara Enhanced' };
  if (chromium.icons) chromium.action.default_icon = { 16: chromium.icons[16], 32: chromium.icons[32] };
  chromium.content_scripts.push({ matches: chromium.content_scripts[0].matches, js: ['update-notice.js'], run_at: 'document_idle' });
  chromiumExtra['update-check.js'] = fs.readFileSync(path.join(ext, 'src', 'update-check.js'), 'utf8')
    .replaceAll('__LATEST_URL__', release.url('latest.json'))
    .replaceAll('__DOWNLOAD_PAGE__', release.downloadPage);
  if (/__[A-Z_]+__/.test(chromiumExtra['update-check.js'])) throw new Error('update-check.js 里还有没替换的占位符');
  chromiumExtra['update-notice.js'] = fs.readFileSync(path.join(ext, 'src', 'update-notice.js'), 'utf8');
}
const chromiumDir = path.join(ext, 'dist');
writeTarget(chromiumDir, chromium, chromiumExtra);
zipDir(chromiumDir, path.join(ext, 'iwara-enhanced-ext.zip'));

// ── Firefox：自分发（unlisted）时写 update_url，浏览器按 updates.json 自动更新；公开上架（listed）不许有 update_url ──
const firefox = structuredClone(template);
delete firefox.minimum_chrome_version;
if (release.baseUrl && release.firefoxChannel === 'unlisted') firefox.browser_specific_settings.gecko.update_url = release.url('updates.json');
const firefoxDir = path.join(ext, 'dist-firefox');
writeTarget(firefoxDir, firefox);

// ── 发版目录：清掉上一次生成的文件，保留已签名的 .xpi ──
const out = path.join(ext, 'release');
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) if (!f.endsWith('.xpi')) fs.rmSync(path.join(out, f), { recursive: true, force: true });

const files = {
  chromiumZip: `iwara-enhanced-chromium-${version}.zip`,
  firefoxZip: `iwara-enhanced-firefox-${version}.zip`, // 未签名，拿去签名 / 上传 AMO
  xpi: `iwara-enhanced-${version}.xpi`, // 签名后由你放进来（见 README）
  source: `iwara-enhanced-source-${version}.zip`,
};
zipDir(chromiumDir, path.join(out, files.chromiumZip));
zipDir(firefoxDir, path.join(out, files.firefoxZip));
fs.writeFileSync(path.join(out, 'iwara-enhanced.user.js'), userJs);
fs.writeFileSync(path.join(out, 'iwara-enhanced.meta.js'), headerBlock[0].trimEnd() + '\n'); // 油猴只拉这个小文件比版本号

// 源码包：AMO 审核要能从源码重建出一模一样的 iwara-enhanced.js（Milkdown 是 esbuild 压缩打包进去的）
const sourceList = ['LICENSE', 'package.json', 'package-lock.json', 'build.mjs', 'build-extension.mjs', 'release.config.json',
  'src', 'vendor', 'tool', 'extension/manifest.template.json', 'extension/src', 'extension/SOURCE-BUILD.md'];
for (const p of sourceList) if (!fs.existsSync(path.join(root, p))) throw new Error(`源码包缺 ${p}`);
if (fs.existsSync(path.join(ext, 'icons'))) sourceList.push('extension/icons');
execFileSync('zip', ['-qrX', path.join(out, files.source), ...sourceList, '-x', '*.DS_Store'], { cwd: root });

if (release.baseUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const latest = {
    schema: 1,
    name: 'Iwara Enhanced',
    version,
    date: today,
    downloadPage: release.downloadPage,
    userscript: { install: release.url('iwara-enhanced.user.js'), meta: release.url('iwara-enhanced.meta.js') },
    chromium: { zip: release.url(files.chromiumZip), sha256: sha256(path.join(out, files.chromiumZip)), minVersion: chromium.minimum_chrome_version },
    firefox: release.firefoxChannel === 'unlisted'
      ? { channel: 'unlisted', id: gecko.id, xpi: release.url(files.xpi), updates: release.url('updates.json'), minVersion: gecko.strict_min_version }
      : { channel: 'listed', id: gecko.id, listing: release.firefoxListingUrl || undefined, minVersion: gecko.strict_min_version },
  };
  fs.writeFileSync(path.join(out, 'latest.json'), `${JSON.stringify(latest, null, 2)}\n`);
  // 托管目录的首页：给人看的下载页（downloadPage 默认就指向这里）
  const { releasePage } = await import('./tool/release-page.mjs');
  fs.writeFileSync(path.join(out, 'index.html'), releasePage(latest));
  if (release.firefoxChannel === 'unlisted') {
    const updates = { addons: { [gecko.id]: { updates: [{
      version,
      update_link: release.url(files.xpi),
      applications: { gecko: { strict_min_version: gecko.strict_min_version } },
    }] } } };
    fs.writeFileSync(path.join(out, 'updates.json'), `${JSON.stringify(updates, null, 2)}\n`);
  }
}

console.log(`extension v${version}  ${(body.length / 1024).toFixed(0)} KB → ${rel(chromiumDir)}, ${rel(firefoxDir)}, ${rel(out)}/`);
if (!release.baseUrl) {
  console.log('  release.config.json 的 baseUrl 为空：没写油猴 @updateURL、Firefox update_url，Chromium 版不检查更新，也没生成 latest.json / updates.json');
} else if (release.firefoxChannel === 'unlisted' && !fs.existsSync(path.join(out, files.xpi))) {
  console.log(`  还差签名后的 ${files.xpi}：签好放进 ${rel(out)}/ 再一起上传（步骤见 extension/README.md）`);
}
