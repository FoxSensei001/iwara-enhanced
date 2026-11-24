// 构建时检查：界面文案的国际化（中文 / English / 日本語，和站点支持的语言一致）。
//
// 查两件事：
// 1. 写死在代码里的中日文字符串 / 模板字符串：界面文案一律放进 STR 或 defineStrings(zh, en, ja)，用 t(key) 取。
//    这些地方允许出现中日文：STR.zh / STR.ja、defineStrings 的第 1 个和第 3 个参数、正则字面量（匹配站点文字用）、
//    语言自称（中文 / 日本語 / 简体中文…）。其他确实不是界面文案的（比如拿站点中文标题做匹配），在那一行末尾写 `// i18n-ok`。
// 2. 三种语言的键是否齐：STR.zh / STR.en / STR.ja，以及每一处 defineStrings 的三个对象。
// 3. 同一个键在三种语言里的占位符（{n} 这类）是否一致。
import fs from 'node:fs';
import path from 'node:path';

const CJK = /[぀-ヿ㐀-鿿！-｠]/;
const SELF_NAMES = new Set(['中文', '日本語', '简体中文', '繁體中文', '简中', '繁中', '日文']);

function walk(node, visit, parent) {
  if (!node || typeof node.type !== 'string') return;
  if (visit(node, parent) === false) return;
  for (const k in node) {
    if (k === 'loc' || k === 'start' || k === 'end' || k === 'extra' || k === 'leadingComments' || k === 'trailingComments' || k === 'innerComments') continue;
    const v = node[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === 'string') walk(c, visit, node); }
    else if (v && typeof v.type === 'string') walk(v, visit, node);
  }
}

const keysOf = (obj) => new Set(obj.properties.filter((p) => p.type === 'ObjectProperty').map((p) => (p.key.type === 'Identifier' ? p.key.name : p.key.value)));
// 占位符：{n} {limit} 这类小写开头的才算（{Character} {キャラ} {角色} 是模板示例里的填空，各语言本来就不同）
const holes = (obj) => { const m = new Map(); for (const p of obj.properties) if (p.type === 'ObjectProperty' && p.value.type === 'StringLiteral') m.set(p.key.type === 'Identifier' ? p.key.name : p.key.value, [...new Set(p.value.value.match(/\{[a-z]\w*\}/g) || [])].sort().join(' ')); return m; };
function holesDiffer(f, line, en, other, lang, issues) {
  const he = holes(en), ho = holes(other);
  for (const [k, v] of he) if (ho.has(k) && ho.get(k) !== v) issues.push(`${f}:${line}  ${lang}.${k} 的占位符和 en 不一致：en「${v}」${lang}「${ho.get(k)}」`);
}
const propName = (p) => (p.key.type === 'Identifier' ? p.key.name : p.key.value);

export async function checkI18n(root) {
  let parse;
  try { ({ parse } = await import('@babel/parser')); } catch {
    return ['（没装 @babel/parser，跳过国际化检查；先 npm install）'];
  }
  const src = path.join(root, 'src');
  const issues = [];
  for (const f of fs.readdirSync(src).filter((x) => x.endsWith('.js')).sort()) {
    const code = fs.readFileSync(path.join(src, f), 'utf8');
    const lines = code.split('\n');
    let ast;
    try { ast = parse(code, { sourceType: 'script', errorRecovery: true, allowReturnOutsideFunction: true }); } catch (e) {
      issues.push(`${f}  解析失败：${e.message}`); continue;
    }
    const allowed = new Set(); // 允许出现中日文的子树根节点
    const missing = (where, a, b, la, lb) => {
      const miss = [...a].filter((k) => !b.has(k));
      if (miss.length) issues.push(`${f}:${where}  ${lb} 缺 ${miss.length} 个键（${la} 里有）：${miss.slice(0, 8).join(', ')}${miss.length > 8 ? ' …' : ''}`);
    };
    walk(ast.program, (n) => {
      if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 'defineStrings') {
        const [zh, en, ja] = n.arguments;
        if (zh) allowed.add(zh);
        if (ja) allowed.add(ja);
        const line = n.loc.start.line;
        if (!ja) { issues.push(`${f}:${line}  defineStrings 少了日文（第 3 个参数）`); }
        if (zh?.type === 'ObjectExpression' && en?.type === 'ObjectExpression') {
          const kz = keysOf(zh), ke = keysOf(en);
          missing(line, kz, ke, 'zh', 'en'); missing(line, ke, kz, 'en', 'zh');
          if (ja?.type === 'ObjectExpression') { const kj = keysOf(ja); missing(line, ke, kj, 'en', 'ja'); missing(line, kj, ke, 'ja', 'en'); holesDiffer(f, line, en, ja, 'ja', issues); }
          holesDiffer(f, line, en, zh, 'zh', issues);
        }
      }
      if (n.type === 'VariableDeclarator' && n.id.name === 'STR' && n.init?.type === 'ObjectExpression') {
        const by = {};
        for (const p of n.init.properties) { by[propName(p)] = p.value; if (propName(p) !== 'en') allowed.add(p.value); }
        const line = n.loc.start.line;
        for (const l of ['zh', 'ja']) {
          if (!by[l]) { issues.push(`${f}:${line}  STR 少了 ${l}`); continue; }
          missing(line, keysOf(by.en), keysOf(by[l]), 'en', l); missing(line, keysOf(by[l]), keysOf(by.en), l, 'en');
          holesDiffer(f, line, by.en, by[l], l, issues);
        }
      }
    });
    walk(ast.program, (n) => {
      if (allowed.has(n)) return false;
      if (n.type === 'RegExpLiteral') return false;
      let text = null;
      if (n.type === 'StringLiteral') text = n.value;
      else if (n.type === 'TemplateElement') text = n.value.cooked ?? n.value.raw;
      if (text != null && n.type === 'TemplateElement') text = text.replace(/\/\*[\s\S]*?\*\//g, ''); // 样式表里的注释
      if (text == null || !CJK.test(text) || SELF_NAMES.has(text.trim())) return;
      const line = n.loc.start.line;
      if (/\/\/\s*i18n-ok\b/.test(lines[line - 1] || '')) return;
      issues.push(`${f}:${line}  写死的文案：${JSON.stringify(text.length > 40 ? text.slice(0, 40) + '…' : text)}`);
    });
  }
  return issues;
}

// 单独运行：node tool/check-i18n.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const r = await checkI18n(root);
  console.log(r.join('\n') || '国际化检查通过');
  console.error(`共 ${r.length} 条`);
  process.exitCode = r.length ? 1 : 0;
}
