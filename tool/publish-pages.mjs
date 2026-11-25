// 把 extension/release/ 里这次发版的文件提交到 gh-pages 分支（GitHub Pages 从这个分支的根目录发布）。
// 只在本地提交，不推送；推送命令最后打印出来，由你自己执行。
// 用法：npm run build:ext && node tool/publish-pages.mjs
// gh-pages 的工作目录放在 extension/.pages/（git worktree，已在 extension/.gitignore 里忽略）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'extension', 'release');
const dir = path.join(root, 'extension', '.pages');
const BRANCH = 'gh-pages';
const git = (args, cwd = root) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const has = (ref) => { try { git(['rev-parse', '--verify', '--quiet', ref]); return true; } catch { return false; } };

const latestFile = path.join(src, 'latest.json');
if (!fs.existsSync(latestFile)) throw new Error('extension/release/latest.json 不存在：先在 release.config.json 填好 baseUrl，再跑 npm run build:ext');
const latest = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
const { version } = latest;

// 要上传的文件：公开上架时 Firefox 的包由 AMO 分发，不放到托管目录；源码包只交给 AMO 审核
const listed = latest.firefox.channel === 'listed';
const wanted = fs.readdirSync(src).filter((f) => {
  if (f.startsWith('iwara-enhanced-source-')) return false;
  if (f.startsWith('iwara-enhanced-firefox-')) return false; // 未签名的包，装不上
  if (listed && (f.endsWith('.xpi') || f === 'updates.json')) return false;
  return true;
});
if (!listed && !wanted.includes(`iwara-enhanced-${version}.xpi`)) {
  throw new Error(`自分发模式下缺签名后的 iwara-enhanced-${version}.xpi（updates.json 指向它），先签名放进 extension/release/`);
}

if (!fs.existsSync(path.join(dir, '.git'))) {
  if (has(BRANCH)) git(['worktree', 'add', dir, BRANCH]);
  else if (has(`origin/${BRANCH}`)) git(['worktree', 'add', '-b', BRANCH, dir, `origin/${BRANCH}`]);
  else git(['worktree', 'add', '--orphan', '-b', BRANCH, dir]); // 第一次发版：全新的空分支，和源码历史无关
}
if (git(['symbolic-ref', '--short', 'HEAD'], dir) !== BRANCH) throw new Error(`${path.relative(root, dir)} 不在 ${BRANCH} 分支上`);

// 覆盖同名文件；旧版本的 zip / xpi 留着，已经发出去的链接不会失效
for (const f of wanted) fs.copyFileSync(path.join(src, f), path.join(dir, f));
fs.writeFileSync(path.join(dir, '.nojekyll'), ''); // 原样发布，不经 Jekyll 处理

git(['add', '-A'], dir);
if (!git(['status', '--porcelain'], dir)) {
  console.log(`${BRANCH} 已经是 v${version} 的内容，没有可提交的改动`);
} else {
  git(['commit', '-q', '-m', `release v${version}`], dir);
  console.log(`已提交到本地 ${BRANCH}：release v${version}（${wanted.length} 个文件）`);
}
console.log(`检查无误后推送：git push origin ${BRANCH}`);
