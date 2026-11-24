// 把用户脚本产物包成 Chromium / Firefox 通用的 MV3 扩展（content script 跑在页面主世界）。
// 用法：node build-extension.mjs [--build]   （--build 先跑 build.mjs 生成最新 user.js）
// 产物：extension/dist/（可直接「加载已解压的扩展」）和 extension/iwara-enhanced-ext.zip
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
if (process.argv.includes('--build')) execFileSync('node', [path.join(root, 'build.mjs')], { cwd: root, stdio: 'inherit' });

const userJs = fs.readFileSync(path.join(root, 'dist', 'iwara-enhanced.user.js'), 'utf8');
const m = userJs.match(/\/\/ @version\s+(\S+)/);
if (!m) throw new Error('user.js 里找不到 @version');
const body = userJs.replace(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\n*/, '');
if (body.length === userJs.length) throw new Error('没剥掉脚本头');

const out = path.join(root, 'extension', 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'iwara-enhanced.js'), body);
// manifest 的 version 只允许 1-4 段数字
fs.writeFileSync(path.join(out, 'manifest.json'),
  fs.readFileSync(path.join(root, 'extension', 'manifest.template.json'), 'utf8').replace('__VERSION__', m[1]));

const zip = path.join(root, 'extension', 'iwara-enhanced-ext.zip');
fs.rmSync(zip, { force: true });
execFileSync('zip', ['-qr', zip, '.'], { cwd: out });
console.log(`extension v${m[1]}  ${(body.length / 1024).toFixed(0)} KB → ${path.relative(process.cwd(), out)}, ${path.relative(process.cwd(), zip)}`);
