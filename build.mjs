// 把 src/ 下的分段按文件名顺序拼成一个可直接安装的用户脚本。
// 第三方编辑器内核（vendor/milkdown.js）先用 esbuild 打成 IIFE（全局 MK），放在最前面。
// 用法：npm install && node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');
const header = fs.readFileSync(path.join(src, '00-header.txt'), 'utf8').trimEnd();
const vendor = await build({
  entryPoints: [path.join(root, 'vendor', 'milkdown.js')],
  bundle: true, format: 'iife', globalName: 'MK', minify: true, write: false, target: 'es2020', legalComments: 'inline',
});
const parts = fs
  .readdirSync(src)
  .filter((f) => f.endsWith('.js'))
  // 开发时只带一个功能文件单独构建：IWE_ONLY=91-search.js node build.mjs → dist/dev-91-search.user.js
  // （91 及以后的功能文件只留指定的那个，免得别人写到一半的文件把你的构建弄坏）
  .filter((f) => !process.env.IWE_ONLY || f < '91' || process.env.IWE_ONLY.split(',').includes(f))
  .sort()
  .map((f) => `// ── ${f} ${'─'.repeat(Math.max(4, 60 - f.length))}\n${fs.readFileSync(path.join(src, f), 'utf8').trimEnd()}`);

const out = `${header}\n\n(function () {\n'use strict';\nif (window.__iweLoaded) return;\nwindow.__iweLoaded = true;\n\n// ── vendor: Milkdown (MIT) ───────────────────────────────────────\n// 脚本在 document-start 运行，那时页面还没有 body，编辑器内核一加载就会读页面样式：包成函数，DOM 就绪后再初始化\nlet MK = null;\nfunction initVendor() { if (!MK) MK = (function () {\n${vendor.outputFiles[0].text.trimEnd()}\nreturn MK;\n})(); }\n\n${parts.join('\n\n')}\n})();\n`;
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const target = path.join(root, 'dist', process.env.IWE_ONLY ? `dev-${process.env.IWE_ONLY.split(',')[0].replace(/\.js$/, '')}.user.js` : 'iwara-enhanced.user.js');
fs.writeFileSync(target, out);
console.log(`${path.relative(process.cwd(), target)}  ${(out.length / 1024).toFixed(1)} KB`);

// 站点页面上我们建的元素，别用和站点 CSS 同名的类（详见 tool/check-site-classes.mjs）。产物照常写出，只报错、返回非 0
const { checkSiteClasses } = await import('./tool/check-site-classes.mjs');
const clash = checkSiteClasses(root);
if (clash.length) {
  console.error(`\n⚠ 这些类名和站点 CSS 同名，站点的样式会套到我们的元素上（改成 iwe- 开头的名字）：\n  ${clash.join('\n  ')}\n`);
  process.exitCode = 1;
}

// 原生 append / replaceChildren 等会把 null 当文字插进页面（详见 tool/check-dom-null.mjs）
const { checkDomNull } = await import('./tool/check-dom-null.mjs');
const nulls = await checkDomNull(root);
if (nulls.length) {
  console.error(`\n⚠ 这些插入调用的参数可能是空值，页面上会多出 "null" / "false" 字样（改用 add(el, [...]) 或先 filter(Boolean)）：\n  ${nulls.join('\n  ')}\n`);
  process.exitCode = 1;
}

// 站点页面上 ui.layer 可能不存在，toast() / menu() 这类函数会自己抛异常、什么都不显示（详见 tool/check-site-toast.mjs）
const { checkSiteToast } = await import('./tool/check-site-toast.mjs');
const toasts = checkSiteToast(root);
if (toasts.length) {
  console.error(`\n⚠ 站点增强里调了挂在 ui.layer 上的界面函数（站点页面上没有这一层，会抛异常且什么都不显示；状态放在按钮上，菜单自己挂到 body 上）：\n  ${toasts.join('\n  ')}\n`);
  process.exitCode = 1;
}

// 界面文案三种语言（中文 / English / 日本語）齐不齐、有没有写死的中日文（详见 tool/check-i18n.mjs）
const { checkI18n } = await import('./tool/check-i18n.mjs');
const i18n = await checkI18n(root);
if (i18n.length) {
  console.error(`\n⚠ 国际化检查（文案放进 STR / defineStrings(zh, en, ja)，用 t(key) 取）：\n  ${i18n.join('\n  ')}\n`);
  process.exitCode = 1;
}
