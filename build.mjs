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
  .sort()
  .map((f) => `// ── ${f} ${'─'.repeat(Math.max(4, 60 - f.length))}\n${fs.readFileSync(path.join(src, f), 'utf8').trimEnd()}`);

const out = `${header}\n\n(function () {\n'use strict';\nif (window.__iweLoaded) return;\nwindow.__iweLoaded = true;\n\n// ── vendor: Milkdown (MIT) ───────────────────────────────────────\n${vendor.outputFiles[0].text.trimEnd()}\n\n${parts.join('\n\n')}\n})();\n`;
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const target = path.join(root, 'dist', 'iwara-enhanced.user.js');
fs.writeFileSync(target, out);
console.log(`${path.relative(process.cwd(), target)}  ${(out.length / 1024).toFixed(1)} KB`);
