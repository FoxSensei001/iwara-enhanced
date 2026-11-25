// 构建时检查：站点增强（91 号及以后的文件，跑在站点自己的页面上）不许调挂在 ui.layer 上的界面函数：
// toast()、popover()、menu()、sheet()、hoverPanel()、infoTip()（都在 30-ui.js）。
//
// 为什么要查：toast() 往 ui.layer 里放提示，而 ui.layer 只在工作台或 Markdown 编辑器挂上之后才有；
// 普通的视频 / 论坛页面上它是 null，toast() 自己先抛异常——提示没出来，调用方的善后代码也跟着断掉。
// 2026-11-24 翻译失败时就是这样：按钮恢复成「翻译」，什么提示都没有，用户只看到「点了没反应」。
// 站点页面上的状态（加载中、失败、重试）放在触发它的那个按钮 / 元素上；要弹菜单就在功能文件里自己挂到 body 上
// （2026-11-25 翻译的语言菜单差点直接用 menu()，它同样依赖 ui.layer，见 98-translate.js 的 openMenu）。
// 确实保证了 ui.layer 存在的调用，在那一行末尾写 `// toast-ok`。
import fs from 'node:fs';
import path from 'node:path';

export function checkSiteToast(root) {
  const src = path.join(root, 'src');
  const issues = [];
  for (const f of fs.readdirSync(src).filter((x) => x.endsWith('.js') && x >= '91').sort()) {
    const lines = fs.readFileSync(path.join(src, f), 'utf8').split('\n');
    lines.forEach((line, i) => {
      const m = line.match(/(?:^|[^\w.$])(toast|popover|menu|sheet|hoverPanel|infoTip)\(/);
      if (m && !/\/\/\s*toast-ok\b/.test(line)) issues.push(`${f}:${i + 1} ${m[1]}()`);
    });
  }
  return issues;
}
