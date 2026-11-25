// 构建时检查：「是否已登录」只许用 api.signedIn()，读公开数据用 api.call(..., { auth: 'auto' })；别的文件不许自己读 localStorage.token。
//
// 为什么要查：localStorage.token 是刷新令牌，过期 / 失效后站点按未登录显示页面，却不会把它删掉。
// 2026-11-25 AI 站上就是这样（令牌 9 月就过期了）：插件按「本地有 token」当成已登录，翻页先拿它去换令牌、拿到 403，整次请求报错；
// 侧栏还多出一个只有登录才有的「订阅」。20-api.js 里记着哪个令牌被拒过，只有那里的判断是准的。
// 确实需要读原值的行（例如记下被拒的是哪一个），在行末写 `// token-ok`。
import fs from 'node:fs';
import path from 'node:path';

export function checkLoginState(root) {
  const src = path.join(root, 'src');
  const issues = [];
  for (const f of fs.readdirSync(src).filter((x) => x.endsWith('.js') && x !== '20-api.js').sort()) {
    fs.readFileSync(path.join(src, f), 'utf8').split('\n').forEach((line, i) => {
      if (/getItem\(\s*['"`]token['"`]\s*\)/.test(line) && !/\/\/\s*token-ok\b/.test(line)) issues.push(`${f}:${i + 1}`);
    });
  }
  return issues;
}
