// 构建时检查：站点页面上我们自己建的元素，别用和站点 CSS 同名的类。
//
// 为什么要查：功能的样式都挂在带 iwe- 前缀的父级下面，这只能防「我们的样式误伤站点」，
// 防不了「站点样式套到我们的元素上」。2026-11-24 搜索联想下拉的每一行用了 class="row"，
// 正好是站点 Bootstrap 的 .row（margin: 0 -15px），行被往两边拉出去，内容贴着弹层边框。
//
// 查什么：src/ 里 88 号及以后的文件（跑在站点页面上；更早的是工作台，在 Shadow DOM 里，站点样式进不去）
// 中 h('tag.a.b') 的类名，凡是不带 iwe- 前缀、又出现在站点 CSS 里的，报出来。
// 故意借用站点样式的不报：Bootstrap 工具类、text / block / col 系列、icon、username、breadcrumbs、站点按钮（button / button--*，
// 照着站点的「回复」「分享」按钮搭，要的就是同一套颜色和深浅色），
// 以及同一个元素上还带着站点 BEM 类名（含 __）的——那是在照着站点组件搭。
//
// 站点类名快照：tool/site-classes.txt。站点 CSS 按路由拆包加载，取快照前要在同一个标签页里站内走一遍
// 首页、视频、图片、视频详情、论坛、帖子、个人主页、订阅、搜索，再遍历 document.styleSheets 取类名（不含 iwe- 开头的）。
// 站点改版后重新取一份。
import fs from 'node:fs';
import path from 'node:path';

const BORROW = /^(text(--[\w-]+)?|block(--[\w-]+|__[\w-]+)?|col(-[\w-]+)?|container(-fluid)?|row|d-[\w-]+|[mp][trblxy]?-(n?\d|auto)|[mp][trblxy]?-(sm|md|lg|xl)-n?\d|icon|username|breadcrumbs|button(--[\w-]+)?|menu__[\w-]+|dropdown__[\w-]+|userDropdownContent__[\w-]+)$/;
// row 单独出现不算借用：只有和站点 BEM 类名一起出现才放过（见下面）
const BORROW_ALONE_NOT_OK = new Set(['row']);

export function checkSiteClasses(root) {
  const snap = path.join(root, 'tool', 'site-classes.txt');
  if (!fs.existsSync(snap)) return [];
  const site = new Set(fs.readFileSync(snap, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean));
  const src = path.join(root, 'src');
  const issues = [];
  for (const f of fs.readdirSync(src).filter((x) => x.endsWith('.js') && x >= '88').sort()) {
    const lines = fs.readFileSync(path.join(src, f), 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const m of line.matchAll(/\bh\(\s*['"`]([a-zA-Z0-9]*)((?:\.[\w-]+)+)['"`]/g)) {
        const cls = m[2].slice(1).split('.');
        // 站点 CSS 按路由拆包，快照未必有这个 BEM 类名，所以只看形状（含 __）不看快照
        const mimicsSite = cls.some((c) => !c.startsWith('iwe-') && c.includes('__'));
        for (const c of cls) {
          if (c.startsWith('iwe-') || !site.has(c)) continue;
          if (mimicsSite) continue;
          if (BORROW.test(c) && !BORROW_ALONE_NOT_OK.has(c)) continue;
          issues.push(`${f}:${i + 1}  .${c}`);
        }
      }
    });
  }
  return issues;
}
