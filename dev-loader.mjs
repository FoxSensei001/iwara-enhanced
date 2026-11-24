// 生成本地开发用的「壳脚本」：它 @require 本机的构建产物，所以构建一次、刷新页面就是最新版，不用再重新导入。
// 壳里含本机绝对路径，只写进 dev/（已忽略，不入库）。
// 用法：npm run dev        → 生成壳脚本 + 监听 src/ vendor/，一改就自动重建
//       首次：在 Chrome 扩展管理页给 Tampermonkey 打开「允许访问文件网址」，再把 dev/ 里的壳脚本装进去（见输出提示）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const built = path.join(root, 'dist', 'iwara-enhanced.user.js');
const header = fs.readFileSync(path.join(root, 'src', '00-header.txt'), 'utf8');
const pick = (re) => (header.match(re) || [])[0];
const matches = header.match(/^\/\/ @match .*$/gm) || [];
const stub = [
  '// ==UserScript==',
  '// @name         Iwara Enhanced (dev loader)',
  '// @namespace    iwara-enhanced-dev',
  '// @version      0.0.0-dev',
  '// @description  Local dev loader: requires the locally built script, so a rebuild + page refresh is enough.',
  ...matches,
  `// ${pick(/@run-at .*/) ? pick(/@run-at .*/) : '@run-at       document-start'}`,
  '// @noframes',
  '// @grant        none',
  `// @require      ${pathToFileURL(built).href}`,
  '// ==/UserScript==',
  '',
].join('\n');

const dir = path.join(root, 'dev');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, 'iwara-enhanced.dev.user.js');
fs.writeFileSync(file, stub);
console.log(`dev loader → ${path.relative(process.cwd(), file)}`);
