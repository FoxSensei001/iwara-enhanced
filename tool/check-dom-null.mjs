// 构建时检查：原生 DOM 插入方法（append / prepend / replaceChildren / before / after / replaceWith）
// 的参数里别出现「可能是空值」的写法。
//
// 为什么要查：这些方法会把 null / undefined / false 转成文字插进去。我们自己的 h() / add() 会跳过空值，
// 原生方法不会——`sec.append(head, ok ? x : null, list)` 在 ok 为假时，页面上就多出一行 "null"。
// 2026-11-23 标签卡出过 "nullnullnull"，2026-11-24 又在「已保存标签组合」下面冒出一个 "null"，
// 两次都是同一个原因，只在出事的那一处补过滤不够，所以改成构建时整体查。
//
// 报这些写法（参数本身，或 `...[ ]` 展开的数组里的元素）：
//   cond ? x : null / undefined / false      a && b      a || null      [a, b]（数组会被转成 "a,b"）
// 要插可能为空的东西，用 add(el, [...])（跳过空值），或者先 .filter(Boolean) 再展开。
import fs from 'node:fs';
import path from 'node:path';

const INSERT = new Set(['append', 'prepend', 'replaceChildren', 'before', 'after', 'replaceWith']);

const isEmptyLit = (n) => n && (n.type === 'NullLiteral'
  || (n.type === 'Identifier' && n.name === 'undefined')
  || (n.type === 'BooleanLiteral' && n.value === false));

function why(arg) {
  if (!arg) return null;
  if (arg.type === 'ConditionalExpression' && (isEmptyLit(arg.consequent) || isEmptyLit(arg.alternate))) return '条件表达式有一支是空值';
  if (arg.type === 'LogicalExpression' && arg.operator === '&&') return '`&&` 为假时插进去的是 false';
  if (arg.type === 'LogicalExpression' && isEmptyLit(arg.right)) return '兜底值是空值';
  if (arg.type === 'ArrayExpression') return '数组会被转成逗号连接的文字';
  if (arg.type === 'SpreadElement' && arg.argument.type === 'ArrayExpression') {
    for (const el of arg.argument.elements) { const r = el && why(el.type === 'ArrayExpression' ? null : el); if (r) return '展开的数组里：' + r; }
  }
  return null;
}

function walk(node, visit) {
  if (!node || typeof node.type !== 'string') return;
  visit(node);
  for (const k in node) {
    if (k === 'loc' || k === 'start' || k === 'end' || k === 'extra') continue;
    const v = node[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === 'string') walk(c, visit); }
    else if (v && typeof v.type === 'string') walk(v, visit);
  }
}

export async function checkDomNull(root) {
  let parse;
  try { ({ parse } = await import('@babel/parser')); } catch {
    return ['（没装 @babel/parser，跳过空值插入检查；先 npm install）'];
  }
  const src = path.join(root, 'src');
  const issues = [];
  for (const f of fs.readdirSync(src).filter((x) => x.endsWith('.js')).sort()) {
    const code = fs.readFileSync(path.join(src, f), 'utf8');
    let ast;
    try { ast = parse(code, { sourceType: 'script', errorRecovery: true, allowReturnOutsideFunction: true }); } catch (e) {
      issues.push(`${f}  解析失败：${e.message}`); continue;
    }
    walk(ast.program, (n) => {
      if (n.type !== 'CallExpression' || n.callee.type !== 'MemberExpression' || n.callee.computed) return;
      if (!INSERT.has(n.callee.property.name)) return;
      for (const a of n.arguments) {
        const r = why(a);
        if (r) issues.push(`${f}:${a.loc.start.line}  .${n.callee.property.name}(…)  ${r}`);
      }
    });
  }
  return issues;
}
