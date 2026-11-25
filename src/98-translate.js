// 翻译：用谷歌翻译把评论、论坛帖子、动态、视频 / 图片的标题和简介「原地」换成界面语言，再点一次换回原文。
//
// 怎么换（不改站点的节点）：
// - 正文里的 <p>、<li>、标题这些块归站点（React）管，不能改内容、不能挪。做法是给原块打上 data-iwe-tr-src 藏起来，
//   在它前面插一份我们自己的译文块（同标签、同 class、同上下外边距，看起来就是原文换了字）；换回原文 = 删掉译文块、去掉标记。
//   以前的做法是在正文末尾追加一个白底框：站点把长正文折叠在 200px 里（.showMore--closed 的 overflow:hidden），追加在末尾的译文正好被裁掉，看起来就是「点了没反应」。
// - 块里的链接、加粗、表情图、行内代码保留：送去翻译的是带编号占位的 HTML（<a i=3>…</a>、<img i=4>），
//   译文回来后按编号把原来的元素克隆回去。返回内容里的标签和属性一概不采信，只认编号。
// - 每一行（<br> 分开的）单独送一段：整段送的话，谷歌会把没有标点的几行并成一句、把换行吃掉（日文评论实测）。
// - 原文之后变了（站内换了视频、评论被编辑），译文作废、自动换回原文；不会出现「标题是新视频、译文是上一个视频」。
//
// 按钮放在各自的操作区，不往正文里塞：评论在「回复」旁边；论坛帖子在楼层号旁边（一楼连帖子标题一起译）；
// 视频 / 图片详情在「赞 / 分享」那一排（标题和简介一起译）；动态在作者那一行；作者页简介在「简介」标题右侧；
// 首页公告在公告浮窗的标题栏；视频 / 图库卡片的预览弹窗在底部动作行（标题和简介一起译）。
// 别处的 .markdown（评论框预览之类）不加按钮。已经是界面语言、只有表情 / 链接的内容不显示按钮。
// 译文块被站点 / 弹窗重画掉、而原文一个字没变（点个赞整块重画）：照缓存直接再换上，不用再点一次。
// 失败、加载中都直接显示在按钮上（站点页面上不一定有 toast 的容器，以前失败时连提示都没有）。
// 按钮是分段的（和应用里的翻译胶囊一样）：左边翻译 / 显示原文，右边箭头弹出语言菜单，选了就记住、并立刻把这一条译成那种语言；
// 没选过时跟随界面语言。站点页面上没有 ui.layer，菜单是这里自己挂在 body 上的。

(() => {

defineStrings({
  tr_btn: '翻译',
  tr_loading: '翻译中…',
  tr_original: '显示原文',
  tr_retry: '翻译失败，重试',
  tr_same: '已经是{lang}',
  tr_pick: '选择翻译语言',
  tr_from: '由谷歌翻译自{lang}',
  tr_failed: '翻译失败：{reason}',
  tr_err_timeout: '谷歌翻译响应超时',
  tr_err_network: '连不上谷歌翻译',
}, {
  tr_btn: 'Translate',
  tr_loading: 'Translating…',
  tr_original: 'Show original',
  tr_retry: 'Failed, retry',
  tr_same: 'Already in {lang}',
  tr_pick: 'Choose translation language',
  tr_from: 'Translated from {lang} by Google',
  tr_failed: 'Translation failed: {reason}',
  tr_err_timeout: 'Google Translate timed out',
  tr_err_network: 'Could not reach Google Translate',
}, {
  tr_btn: '翻訳',
  tr_loading: '翻訳中…',
  tr_original: '原文を表示',
  tr_retry: '翻訳失敗・再試行',
  tr_same: 'すでに{lang}です',
  tr_pick: '翻訳先の言語を選択',
  tr_from: '{lang}から Google で翻訳',
  tr_failed: '翻訳に失敗しました：{reason}',
  tr_err_timeout: 'Google 翻訳の応答がタイムアウトしました',
  tr_err_network: 'Google 翻訳に接続できません',
});

const OUT = 'data-iwe-tr-out'; // 我们插的译文块
const SRC = 'data-iwe-tr-src'; // 被译文顶替、藏起来的原块
const SLOT = 'data-iwe-tr-slot'; // 我们插的按钮外壳

// ── 目标语言、粗判语言 ─────────────────────────────────────────────

// 可选的目标语言：和应用（CommonConstants.translationSorts）同一份清单、同样用各语言的自称
const LANGS = [
  ['zh-CN', '简体中文'], ['zh-TW', '繁體中文'], ['en', 'English'], ['ja', '日本語'], ['ko', '한국어'], ['vi', 'Tiếng Việt'],
  ['th', 'ภาษาไทย'], ['id', 'Bahasa Indonesia'], ['ms', 'Bahasa Melayu'], ['fr', 'Français'], ['de', 'Deutsch'], ['es', 'Español'],
  ['it', 'Italiano'], ['pt', 'Português'], ['ru', 'Русский'],
];
const TL_KEY = 'translateTo'; // 用户在箭头菜单里选过的语言；没选过跟随界面语言
const selfName = (code) => (LANGS.find((l) => l[0] === code) || [code, code])[1];
/** 谷歌翻译的目标语言：选过的那个，否则界面语言（zh-CN / zh-TW / en / ja） */
function target() {
  const v = store.get(TL_KEY, '');
  return LANGS.some((l) => l[0] === v) ? v : env.lang === 'ja' ? 'ja' : env.lang === 'en' ? 'en' : uiLocale();
}
const base = (l) => String(l || '').toLowerCase().split(/[-_]/)[0];
/** 同一种语言（中文分简繁：zh-TW 和 zh-CN 不算同一种，谷歌能互相转换） */
const sameLang = (a, b) => base(a) === base(b) && (base(a) !== 'zh' || /tw|hk|hant/i.test(a) === /tw|hk|hant/i.test(b));
function langName(code) {
  try { return new Intl.DisplayNames([uiLocale()], { type: 'language' }).of(code) || code; } catch { return code; }
}

// 链接、@用户名不算「要翻译的字」
const NOISE = /\bhttps?:\/\/\S+|\bwww\.\S+|@[\w.-]+/gi;
const hasLetters = (s) => /\p{L}/u.test(String(s || '').replace(NOISE, ' '));
const EN_WORDS = new Set(('the a an and or but is are was were be been am i you he she it we they me my your his her its our their this that these those '
  + 'to of in on for with at by from as not no so if do does did have has had will would can could just very what when where how all more most like '
  + 'love thanks thank thx ty please pls plz great good nice cool wow lol omg cute hot sexy amazing awesome perfect beautiful best yes yeah ok okay god damn haha lmao').split(' '));

/**
 * 粗判：这段文字是不是已经是目标语言（只看文字体系，拿不准就当「不是」，宁可多给一个按钮）。
 * withEnglish：目标是英文时，再按常见英文词判一下是不是英文（只给「要不要显示按钮」用；逐行送译时拉丁字母一律送，谷歌自己会原样返回英文）。
 */
/** 数字：假名、汉字各算一个，拉丁字母按词算 */
function measure(text) {
  const s = String(text || '').replace(NOISE, ' ');
  const n = (re) => (s.match(re) || []).length;
  const kana = n(/[぀-ヿㇰ-ㇿｦ-ﾟ]/g);
  const han = n(/\p{Script=Han}/gu);
  const words = s.toLowerCase().match(/\p{Script=Latin}+/gu) || [];
  const other = n(/\p{L}/gu) - kana - han - words.join('').length;
  return { kana, han, words, units: kana + han + words.length + Math.max(0, other) };
}

function isTarget(text, tl, withEnglish) {
  const { kana, han, words, units } = measure(text);
  if (!units) return true; // 没有可译的字：纯表情、数字、链接
  const b = base(tl);
  if (b === 'zh') return han / units >= 0.5 && kana <= han * 0.1;
  if (b === 'ja') return kana > 0 && (kana + han) / units >= 0.5;
  const script = { ko: /\p{Script=Hangul}/gu, th: /\p{Script=Thai}/gu, ru: /\p{Script=Cyrillic}/gu }[b];
  if (script) return (String(text || '').match(script) || []).length / units >= 0.5;
  if (b === 'en' && withEnglish) {
    if (words.length / units < 0.8) return false;
    const hits = words.filter((w) => EN_WORDS.has(w)).length;
    return words.length <= 2 ? hits > 0 : hits / words.length >= 0.2;
  }
  return false;
}

/**
 * 这一组要不要给翻译按钮：只要有字就给。以前按文字体系粗判「已经是界面语言就不给」，结果中文评论（繁体、粤语、夹着外语的）
 * 都没有按钮；现在一律给，点了由谷歌判断，真的已经是目标语言就提示「已经是 XX」。
 */
function wants(roots) {
  return hasLetters(roots.map((r) => r.textContent).join('\n'));
}

// ── 把块拆成要送去翻译的片段 ───────────────────────────────────────

const BLOCK = 'p,div,li,ul,ol,blockquote,h1,h2,h3,h4,h5,h6,table,thead,tbody,tfoot,tr,td,th,dl,dt,dd,pre,hr,section,details,summary,figure,figcaption';
// 不翻译、原样保留的东西：代码块、分隔线、站点的链接预览卡、我们的引用条、表单控件、标了不翻译的
const SKIP = `pre,hr,script,style,textarea,input,select,button,video,iframe,svg,.markdown__image,.iwe-quote,[${OUT}],[${SLOT}],.notranslate,[translate=no]`;
// 会被翻译里面文字的行内元素；其他行内元素（图片、行内代码…）整个当一个占位原样搬回去
const PAIRED = new Set(['A', 'B', 'STRONG', 'EM', 'I', 'U', 'S', 'DEL', 'INS', 'MARK', 'SMALL', 'SUB', 'SUP', 'SPAN', 'ABBR', 'Q', 'CITE']);
const URLISH = /^\s*(https?:\/\/|www\.|@)\S*\s*$/i;

/** 译文的单位：没有下级块的块（段落、列表项、标题、单元格）。容器往里找；段落 / 标题里嵌了块的，整个当一块、嵌的块原样保留。 */
function blocksOf(root) {
  if (!root.classList.contains('markdown')) return hasLetters(root.textContent) ? [root] : []; // 标题这类：自己就是一块
  const out = [];
  (function walk(el) {
    for (const c of el.children) {
      if (c.matches(SKIP) || !c.matches(BLOCK)) continue;
      if (c.querySelector(BLOCK) && !c.matches('p,h1,h2,h3,h4,h5,h6')) walk(c);
      else if (hasLetters(c.textContent)) out.push(c);
    }
  })(root);
  return out;
}

function isAtom(el) {
  if (!PAIRED.has(el.tagName) || el.matches(SKIP)) return true;
  if (!hasLetters(el.textContent) || URLISH.test(el.textContent)) return true; // 裸链接、@用户名、纯数字
  for (const d of el.querySelectorAll('*')) if (!PAIRED.has(d.tagName) && d.tagName !== 'BR') return true; // 里面有图标、图片
  return false;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * 节点 → 带编号占位的 HTML；map 记下每个编号对应的原元素。
 * 原样保留的元素：有字的（行内代码、裸链接、@用户名）连字一起送、标 notranslate（谷歌认这个标记，不译里面的字，
 * 句子还能读通——实测只送一个空占位时「二つ目は [代码] で作る」会被译成病句）；没字的（表情图）送空的 <img>。
 */
function encode(nodes, map) {
  let s = '';
  for (const n of nodes) {
    if (n.nodeType === 3) s += esc(n.nodeValue);
    else if (n.nodeType !== 1) continue;
    else if (n.tagName === 'BR') s += '<br>';
    else if (isAtom(n)) {
      const i = map.push({ el: n, atom: true }) - 1;
      const text = n.textContent.trim();
      s += text ? `<span class="notranslate" i=${i}>${esc(text)}</span>` : `<img i=${i}>`;
    } else {
      const i = map.push({ el: n }) - 1;
      const tag = n.tagName === 'A' ? 'a' : 'b';
      s += `<${tag} i=${i}>${encode(n.childNodes, map)}</${tag}>`;
    }
  }
  return s;
}

/** 一行太长（单段超过接口上限）时退成纯文本，按句读切开 */
function splitLong(text, max) {
  const out = [];
  let rest = text;
  while (rest.length > max) {
    let cut = -1;
    for (let i = max; i > max / 2; i--) if (/[\s.!?;:。！？；，、]/.test(rest[i - 1])) { cut = i; break; }
    if (cut < 0) cut = max;
    out.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) out.push(rest);
  return out;
}

const MAX_Q = 4000;

/** 一个块 → 若干行；要翻译的行带上要送出的片段 qs（已经是目标语言、没有字的行原样保留） */
function prepare(block, tl, force) {
  const map = [], lines = [];
  let cur = [];
  const push = () => {
    const nodes = cur;
    cur = [];
    const start = map.length;
    const text = nodes.map((n) => n.textContent).join('');
    let qs = null, plain = false;
    if (hasLetters(text) && (force || !isTarget(text, tl, false))) {
      const html = encode(nodes, map).trim();
      if (html.length <= MAX_Q) qs = [html];
      else { qs = splitLong(text.trim(), MAX_Q).map(esc); plain = true; }
    }
    lines.push({ nodes, start, end: map.length, qs, plain, qi: -1 });
  };
  // 保留换行的块（预览弹窗的简介是带 \n 的纯文字）：\n 也算换行，不然送出去的一整段会被并成一句
  const keepNl = /^(pre|break-spaces)/.test(getComputedStyle(block).whiteSpace);
  for (const n of block.childNodes) {
    if (n.nodeType === 1 && n.tagName === 'BR') push();
    else if (keepNl && n.nodeType === 3 && n.nodeValue.includes('\n')) n.nodeValue.split('\n').forEach((x, i) => { if (i) push(); if (x) cur.push(document.createTextNode(x)); });
    else cur.push(n);
  }
  push();
  return { block, map, lines, text: block.textContent };
}

// ── 把译文拼回 DOM ────────────────────────────────────────────────

const parser = new DOMParser();
// 译文里克隆出来的链接 → 原来的链接：点击转给原链接，站点自己的站内跳转照常生效
const linkOrig = new WeakMap();

function cloneDeep(orig) {
  const c = orig.cloneNode(true);
  if (orig.nodeType === 1) {
    const a = orig.matches('a') ? [orig, ...orig.querySelectorAll('a')] : [...orig.querySelectorAll('a')];
    const b = c.matches('a') ? [c, ...c.querySelectorAll('a')] : [...c.querySelectorAll('a')];
    a.forEach((x, i) => b[i] && linkOrig.set(b[i], x));
  }
  return c;
}

/** 译文 HTML → 片段。解析结果只拿来读：文字照抄，带编号的换成原元素的克隆，别的标签只取里面的文字 */
function decode(html, map, used) {
  const body = parser.parseFromString('<!doctype html><body>' + html, 'text/html').body;
  const frag = document.createDocumentFragment();
  (function walk(src, dst) {
    for (const n of src.childNodes) {
      if (n.nodeType === 3) { dst.append(n.nodeValue); continue; }
      if (n.nodeType !== 1) continue;
      if (n.tagName === 'BR') { dst.append(document.createElement('br')); continue; }
      const i = n.hasAttribute('i') ? Number(n.getAttribute('i')) : -1;
      const m = map[i];
      if (m && !used.has(i)) {
        used.add(i);
        if (m.atom) { dst.append(cloneDeep(m.el)); continue; }
        const c = m.el.cloneNode(false);
        if (m.el.tagName === 'A') linkOrig.set(c, m.el);
        walk(n, c);
        dst.append(c);
      } else walk(n, dst);
    }
  })(body, frag);
  return frag;
}

/** 一个块的译文块：同标签、同属性（class、style…），加上标记和语言 */
function render(p, res, tl) {
  const { block, map, lines } = p;
  const out = document.createElement(block.tagName);
  for (const a of block.attributes) if (a.name !== 'id' && !a.name.startsWith('data-iwe-')) out.setAttribute(a.name, a.value);
  out.setAttribute(OUT, '');
  out.setAttribute('lang', tl);
  if (block.tagName === 'A') linkOrig.set(out, block); // 整块就是链接（预览弹窗的标题）
  const used = new Set();
  lines.forEach((ln, k) => {
    if (k) out.append(document.createElement('br'));
    if (!ln.qs) { for (const n of ln.nodes) out.append(cloneDeep(n)); return; }
    const html = ln.qs.map((_, j) => res[ln.qi + j].text).join('');
    out.append(decode(html, map, used));
    // 谷歌偶尔会把占位吃掉：表情、链接这些不能丢，补在行尾
    if (!ln.plain) for (let i = ln.start; i < ln.end; i++) if (map[i].atom && !used.has(i)) { used.add(i); out.append(' ', cloneDeep(map[i].el)); }
  });
  // 原块的上下外边距照抄：:first-child / :last-child 这类规则在插了译文块之后会落到别的元素上
  const cs = getComputedStyle(block);
  out.style.marginTop = cs.marginTop;
  out.style.marginBottom = cs.marginBottom;
  return out;
}

// ── 谷歌翻译接口（批量、缓存）─────────────────────────────────────

// format=html：占位标签原样保留；POST + 多个 q：一次请求译多段，返回 [[译文, 检测到的源语言], …]
const API = 'https://translate.googleapis.com/translate_a/t?client=gtx&sl=auto&dt=t&format=html&tl=';
const cache = new Map();
const CACHE_MAX = 3000;

async function request(qs, tl) {
  const body = new URLSearchParams();
  for (const q of qs) body.append('q', q);
  const r = await fetch(API + encodeURIComponent(tl), { method: 'POST', body, credentials: 'omit', signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const data = await r.json();
  let list = Array.isArray(data) ? data : [];
  if (qs.length === 1 && typeof list[0] === 'string') list = [list];
  if (list.length !== qs.length) throw new Error('unexpected response');
  return list.map((x) => (Array.isArray(x) ? { text: String(x[0] ?? ''), lang: String(x[1] ?? '') } : { text: String(x ?? ''), lang: '' }));
}

async function translateAll(qs, tl) {
  const res = new Array(qs.length);
  const todo = [];
  qs.forEach((q, i) => { const hit = cache.get(tl + '\n' + q); if (hit) res[i] = hit; else todo.push(i); });
  // 每次请求不超过约 4000 字、50 段
  const packs = [];
  let cur = [], size = 0;
  for (const i of todo) {
    if (cur.length && (size + qs[i].length > MAX_Q || cur.length >= 50)) { packs.push(cur); cur = []; size = 0; }
    cur.push(i);
    size += qs[i].length;
  }
  if (cur.length) packs.push(cur);
  let next = 0;
  const worker = async () => {
    while (next < packs.length) {
      const pack = packs[next++];
      const send = () => request(pack.map((i) => qs[i]), tl);
      let out;
      try { out = await send(); } catch { await sleep(700); out = await send(); } // 偶发超时 / 429 重试一次
      pack.forEach((i, k) => {
        res[i] = out[k];
        if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
        cache.set(tl + '\n' + qs[i], out[k]);
      });
    }
  };
  await Promise.all(Array.from({ length: Math.min(3, packs.length) }, worker));
  return res;
}

const reasonOf = (e) => (e && e.name === 'TimeoutError' ? t('tr_err_timeout') : e && e.name === 'TypeError' ? t('tr_err_network') : String((e && e.message) || e));

// ── 一组内容（一条评论、一个帖子、一个视频的标题 + 简介）的状态与按钮 ─────

const groups = new WeakMap(); // 宿主元素 → 组

// 分段按钮：左段翻译 / 显示原文，右段箭头弹出语言菜单。三种外观：
// solid：站点自己的实心钮（详情页「赞 / 分享」那一排），两段拼成一个分体按钮；
// link：一枚浅底胶囊（评论、论坛、动态、简介、公告这些文字操作区）；
// icon：预览弹窗动作行里的图标钮（文字放进 title / aria-label）。
// 外壳 span.iwe-tr-btn 是「按钮」整体：各处的挂载、显隐、间距都对它。
function makeButton(kind, onClick, onMenu) {
  const ic = h('span.iwe-tr-ic');
  const label = h('span.iwe-tr-label');
  const chev = h('span.iwe-tr-chev', icon('chevronDown', kind === 'icon' ? 14 : 12));
  let main, more;
  if (kind === 'solid') {
    main = h('button.button.button--primary.button--solid.iwe-tr-main', { type: 'button' }, h('div.text.text--small.iwe-tr-inner', ic, label));
    more = h('button.button.button--primary.button--solid.iwe-tr-more', { type: 'button' }, chev);
  } else if (kind === 'icon') {
    main = h('button.iwe-pv-act.iwe-tr-main', { type: 'button' }, ic);
    more = h('button.iwe-pv-act.iwe-tr-more', { type: 'button' }, chev);
  } else {
    main = h('button.iwe-tr-main', { type: 'button' }, ic, label);
    more = h('button.iwe-tr-more', { type: 'button' }, chev);
  }
  more.setAttribute('aria-haspopup', 'menu');
  more.setAttribute('aria-expanded', 'false');
  more.setAttribute('aria-label', t('tr_pick'));
  more.title = t('tr_pick');
  const btn = h('span.iwe-tr-btn.iwe-tr-split', { 'data-kind': kind, role: 'group' }, main, more);
  main.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); onClick(); });
  more.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); onMenu(more); });
  return { btn, main, more, ic, label, iconOnly: kind === 'icon' };
}

function paint(g) {
  const { btn, main, ic, label, iconOnly } = g.ui;
  const s = g.state;
  ic.replaceChildren(s === 'loading' ? h('span.iwe-tr-spin') : icon(s === 'error' ? 'warn' : 'translate', iconOnly ? 18 : 14));
  label.textContent = s === 'same' ? t('tr_same', { lang: selfName(g.tl) }) : t({ loading: 'tr_loading', on: 'tr_original', error: 'tr_retry' }[s] || 'tr_btn');
  btn.dataset.state = s;
  const tip = s === 'on' ? t('tr_from', { lang: langName(g.from) }) : s === 'error' ? t('tr_failed', { reason: g.err }) : '';
  if (iconOnly) main.setAttribute('aria-label', label.textContent);
  main.title = iconOnly ? [label.textContent, tip].filter(Boolean).join('\n') : tip;
  main.setAttribute('aria-busy', String(s === 'loading'));
  main.setAttribute('aria-pressed', String(s === 'on'));
  main.disabled = s === 'same';
}

function setState(g, s) { g.state = s; paint(g); }

function restore(g) {
  if (g.watch) { g.watch.disconnect(); g.watch = null; }
  for (const p of g.pairs) { p.out.remove(); p.src.removeAttribute(SRC); }
  g.pairs = [];
  setState(g, 'idle');
}

/** 换上译文之后原文变了 / 被站点重画掉了：译文作废 */
const stale = (g) => g.pairs.some((p) => !p.src.isConnected || !p.out.isConnected || p.src.textContent !== p.text);

async function toggle(g, quiet) {
  if (g.state === 'loading' || g.state === 'same') return;
  if (g.state === 'on') { restore(g); return; }
  const tl = (g.tl = target());
  const blocks = g.ctx.roots(g.host).flatMap(blocksOf);
  let preps = blocks.map((b) => prepare(b, tl)).filter((p) => p.lines.some((ln) => ln.qs));
  // 粗判认为都已经是目标语言（比如中文评论）：别信它，全部送去让谷歌判断
  if (!preps.length) preps = blocks.map((b) => prepare(b, tl, true)).filter((p) => p.lines.some((ln) => ln.qs));
  const qs = [];
  for (const p of preps) for (const ln of p.lines) if (ln.qs) { ln.qi = qs.length; qs.push(...ln.qs); }
  if (!qs.length) { same(g); return; }
  setState(g, 'loading');
  const run = (g.run = {});
  try {
    const res = await translateAll(qs, tl);
    if (g.run !== run) return;
    if (preps.some((p) => !p.block.isConnected || p.block.textContent !== p.text)) { setState(g, 'idle'); return; } // 等待期间原文变了
    const langs = res.map((r) => r.lang).filter((l) => l && !sameLang(l, tl));
    if (!langs.length && res.every((r) => r.lang)) { same(g); return; } // 谷歌说全都已经是目标语言
    const count = new Map();
    for (const l of langs) count.set(l, (count.get(l) || 0) + 1);
    g.from = [...count].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const outs = preps.map((p) => render(p, res, tl));
    g.pairs = preps.map((p, i) => {
      p.block.before(outs[i]);
      p.block.setAttribute(SRC, '');
      return { src: p.block, out: outs[i], text: p.text };
    });
    // 站点只改原文里的字（同一个文字节点换值）时不会触发整站的扫描（那边只听增删节点）：盯住藏起来的原文，一变就去核对
    g.watch = new MutationObserver(() => site.schedule());
    for (const p of g.pairs) g.watch.observe(p.src, { characterData: true, childList: true, subtree: true });
    if (!quiet && !reducedMotion()) for (const o of outs) o.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
    setState(g, 'on');
  } catch (e) {
    if (g.run !== run) return;
    console.error('[iwe translate]', e);
    g.err = reasonOf(e);
    setState(g, 'error');
  }
}

/** 已经是界面语言：按钮上说一声，过一会儿收起来（内容变了再重新判断） */
function same(g) {
  setState(g, 'same');
  setTimeout(() => { if (g.state === 'same') { g.need = false; g.ui.btn.hidden = true; } }, 2400);
}

// ── 语言菜单（分段按钮的右段）────────────────────────────────────

/** 在菜单里选了语言：记住，并把这一条译成它（已经是这种语言的译文就不动） */
function pick(g, code) {
  store.set(TL_KEY, code);
  if (g.state === 'on' && g.tl === code) return;
  if (g.state === 'on') restore(g);
  else if (g.state !== 'idle') { g.run = null; setState(g, 'idle'); } // 翻译中 / 失败 / 已是目标语言：作废，按新语言重来
  toggle(g);
}

let menu = null; // { el, anchor, g, raf }
// 预览弹窗、公告浮窗也在窗口捕获阶段听键盘（Esc 关自己）：菜单开着时它们先让开，见 99-cardpreview.js / 99-homenews.js
function closeMenu(focusBack) {
  const m = menu;
  if (!m) return;
  menu = null;
  removeEventListener('pointerdown', onMenuDown, true);
  removeEventListener('keydown', onMenuKey, true);
  removeEventListener('scroll', onMenuMove, true);
  removeEventListener('resize', onMenuMove);
  cancelAnimationFrame(m.raf);
  m.anchor.setAttribute('aria-expanded', 'false');
  m.el.classList.remove('open');
  if (reducedMotion()) m.el.remove(); else setTimeout(() => m.el.remove(), 160);
  if (focusBack && m.anchor.isConnected) m.anchor.focus({ preventScroll: true });
}
function placeMenu() {
  const m = menu;
  if (!m) return;
  m.raf = 0;
  if (!m.anchor.isConnected || m.anchor.closest('[hidden]')) { closeMenu(false); return; }
  const r = (m.anchor.closest('.iwe-tr-split') || m.anchor).getBoundingClientRect();
  const el = m.el;
  el.style.maxHeight = '';
  const w = el.offsetWidth, natural = el.offsetHeight;
  const below = innerHeight - r.bottom - 12, above = r.top - 12;
  const up = natural > below && above > below;
  const room = Math.max(140, up ? above : below);
  const hh = Math.min(natural, room);
  el.style.maxHeight = room + 'px';
  el.style.left = Math.max(8, Math.min(r.right - w, innerWidth - w - 8)) + 'px';
  el.style.top = (up ? r.top - 6 - hh : r.bottom + 6) + 'px';
  el.classList.toggle('up', up);
}
const onMenuMove = (e) => { if (menu && !(e && e.target instanceof Node && menu.el.contains(e.target)) && !menu.raf) menu.raf = requestAnimationFrame(placeMenu); };
function onMenuDown(e) {
  if (!menu) return;
  const path = e.composedPath();
  if (!path.includes(menu.el) && !path.includes(menu.anchor)) closeMenu(false);
}
function onMenuKey(e) {
  if (!menu) return;
  const opts = [...menu.el.querySelectorAll('.iwe-tr-opt')];
  const i = opts.indexOf(document.activeElement);
  const go = (n) => { e.preventDefault(); opts[(n + opts.length) % opts.length].focus(); };
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeMenu(true); }
  else if (e.key === 'ArrowDown') go(i + 1);
  else if (e.key === 'ArrowUp') go(i < 0 ? opts.length - 1 : i - 1);
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(opts.length - 1);
  else if (e.key === 'Tab') { e.preventDefault(); closeMenu(true); } // 焦点回到箭头，不跑出预览弹窗 / 公告浮窗
}
function openMenu(g, anchor) {
  if (menu && menu.anchor === anchor) { closeMenu(true); return; }
  closeMenu(false);
  const cur = target();
  const opts = LANGS.map(([code, name]) => h('button.iwe-tr-opt', {
    type: 'button', role: 'menuitemradio', 'aria-checked': String(code === cur), lang: code, tabindex: '-1',
    onclick: (e) => { e.stopPropagation(); closeMenu(true); pick(g, code); },
  }, h('span', name), code === cur ? icon('check', 14) : null));
  const el = h('div.iwe-tr-menu', { role: 'menu', 'aria-label': t('tr_pick') }, h('div.iwe-tr-mhead', t('tr_pick')), h('div.iwe-tr-mlist', opts));
  document.body.append(el);
  menu = { el, anchor, g, raf: 0 };
  anchor.setAttribute('aria-expanded', 'true');
  placeMenu();
  el.getBoundingClientRect(); // 先落定初始样式，进场过渡才会播
  el.classList.add('open');
  const sel = opts.find((o) => o.getAttribute('aria-checked') === 'true') || opts[0];
  sel.focus({ preventScroll: true });
  sel.scrollIntoView({ block: 'nearest' });
  addEventListener('pointerdown', onMenuDown, true);
  addEventListener('keydown', onMenuKey, true);
  addEventListener('scroll', onMenuMove, true);
  addEventListener('resize', onMenuMove);
}

// ── 哪些地方有按钮、按钮放哪 ─────────────────────────────────────

const notOut = `:not([${OUT}])`;
const slot = (btn) => h('span', { [SLOT]: '' }, btn);
/** 按钮要搬走时，把它原来的外壳（我们插的那个 span / div）一起拿掉 */
const unslot = (btn) => { const p = btn.parentElement; if (p && p.hasAttribute(SLOT)) { p.after(btn); p.remove(); } };
const NEWS = '.page-home .container-fluid > .row.justify-content-center > .block > .block__content > .markdown'; // 同 99-homenews.js
const CONTEXTS = [
  { // 评论（视频、图片、动态、作者页留言板）：按钮在「回复」左边
    hosts: () => document.querySelectorAll('.comment'),
    style: 'link',
    roots: (c) => [...c.querySelectorAll('.markdown')].filter((m) => m.closest('.comment') === c && !m.closest('.markdownField')).slice(0, 1),
    mount(c, btn) {
      const top = c.querySelector(':scope > .comment__right > .comment__right__top');
      if (!top) return;
      const acts = top.querySelector(':scope > .comment__actions');
      if (acts) acts.prepend(btn);
      else top.append(h('div.comment__actions', { [SLOT]: '' }, btn)); // 没登录时站点不画操作区
    },
  },
  { // 论坛帖子：按钮在楼层号左边；一楼连帖子标题一起译
    hosts: () => document.querySelectorAll('.forumPost'),
    style: 'link',
    roots(post) {
      const floor = post.querySelector(':scope > .forumPost__header > a');
      const title = floor && floor.textContent.trim() === '#0' ? post.closest('section.content')?.querySelector('.text--h1' + notOut) : null;
      return [title, post.querySelector('.forumPost__right .markdown')].filter(Boolean);
    },
    mount(post, btn) {
      const hd = post.querySelector(':scope > .forumPost__header');
      if (!hd) return;
      const floor = hd.querySelector(':scope > a');
      if (floor) floor.before(slot(btn)); else hd.append(slot(btn));
    },
  },
  { // 视频 / 图片详情：按钮在「赞 / 分享」那一排，标题和简介一起译
    hosts: () => document.querySelectorAll('.page-video__details, .page-image__details'),
    style: 'solid',
    roots: (d) => [d.querySelector(':scope > .text--h1' + notOut), d.querySelector(':scope > .showMore .markdown')].filter(Boolean),
    mount(d, btn) {
      const acts = document.querySelector(d.classList.contains('page-video__details') ? '.page-video__actions' : '.page-image__actions');
      if (acts) acts.append(btn);
    },
  },
  { // 动态：按钮在作者那一行（「关注」左边），标题和正文一起译
    hosts: () => document.querySelectorAll('.page-post__body'),
    style: 'link',
    roots: (b) => [b.parentElement.querySelector(':scope > .page-post__title' + notOut), b.classList.contains('markdown') ? b : b.querySelector('.markdown')].filter(Boolean),
    mount(b, btn) {
      const au = b.parentElement.querySelector(':scope > .page-post__author');
      if (!au) return;
      const right = au.querySelector(':scope > .page-post__author__right');
      if (right) right.prepend(btn); else au.append(slot(btn));
    },
  },
  { // 作者页「关于」里的简介：按钮在「简介」标题右侧（作者页增强关掉时没有这个标题，放在简介下面）
    hosts: () => document.querySelectorAll('.page-profile__content > div > .row > .col-12 > .showMore'),
    style: 'link',
    recheck: true,
    roots: (s) => [s.querySelector('.markdown')].filter(Boolean),
    // 那个标题是作者页增强插的，可能比这里晚一拍出现：每轮都核对，标题出来了就把按钮挪进去
    mount(s, btn) {
      const hd = s.parentElement.previousElementSibling;
      if (hd && hd.hasAttribute('data-iwe-pf-h')) {
        if (btn.parentElement && btn.parentElement.parentElement === hd) return;
        const old = btn.parentElement && btn.parentElement.hasAttribute(SLOT) ? btn.parentElement : null;
        hd.append(slot(btn));
        if (old) old.remove();
      } else if (!btn.isConnected) s.after(h('div.iwe-tr-row', { [SLOT]: '' }, btn));
    },
  },
  { // 首页公告：按钮在公告浮窗的标题栏（「Esc」左边）；首页公告收成一行卡片时正文藏着，不出按钮；那个增强关掉时放在公告下面
    hosts: () => document.querySelectorAll(`${NEWS}, .iwe-news-body > .markdown`),
    style: 'link',
    recheck: true,
    roots: (md) => [md],
    mount(md, btn) {
      const bar = md.closest('.iwe-news-panel')?.querySelector('.iwe-news-head .r');
      if (bar) { if (btn.parentElement !== bar) { unslot(btn); bar.prepend(btn); } return; }
      if (md.closest('.iwe-news-on')) { unslot(btn); btn.remove(); return; }
      if (!btn.isConnected) md.after(h('div.iwe-tr-row', { [SLOT]: '' }, btn));
    },
  },
  { // 视频 / 图库卡片的预览弹窗：按钮在底部动作行（点赞、复制链接那一排），标题和简介一起译；简介还在加载时先不出
    hosts: () => [...document.querySelectorAll('.iwe-pv-panel')].filter((p) => !p.querySelector('.iwe-pv-skel')),
    style: 'icon',
    roots: (p) => [p.querySelector('.iwe-pv-title' + notOut), p.querySelector('.iwe-pv-desc' + notOut)].filter(Boolean),
    mount(p, btn) { const acts = p.querySelector('.iwe-pv-acts'); if (acts) acts.append(btn); },
  },
];

function group(ctx, host) {
  let g = groups.get(host);
  if (!g) {
    g = { ctx, host, state: 'idle', pairs: [], key: null, need: false, from: '', err: '', tl: '' };
    g.ui = makeButton(ctx.style, () => toggle(g), (anchor) => openMenu(g, anchor));
    paint(g);
    groups.set(host, g);
  }
  return g;
}

// 译文里克隆的链接：普通左键点击转给藏起来的原链接（站内链接走站点自己的路由；新标签打开这类照常用克隆的 href）
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest(`[${OUT}] a, a[${OUT}]`);
  const orig = a && linkOrig.get(a);
  if (!orig || !orig.isConnected) return;
  e.preventDefault();
  orig.click();
}, true);

site.register('translate', {
  css: `
[${SRC}]{display:none!important}
.iwe-tr-btn[hidden],[${SLOT}]:has(>.iwe-tr-btn[hidden]){display:none!important}
.iwe-tr-split{display:inline-flex;align-items:stretch;vertical-align:middle;white-space:nowrap}
.iwe-tr-split>button{margin:0}
.iwe-tr-inner{display:flex;align-items:center;gap:4px}
.iwe-tr-ic{display:inline-flex;align-items:center;justify-content:center;width:13px;height:13px;flex:none}
.iwe-tr-ic svg{display:block;width:100%;height:100%}
.iwe-tr-inner>.iwe-tr-ic{width:12px;height:12px}
.iwe-tr-chev{display:inline-flex;transition:transform .2s cubic-bezier(.22,1,.36,1)}
.iwe-tr-chev svg{display:block}
.iwe-tr-more[aria-expanded=true] .iwe-tr-chev{transform:rotate(180deg)}
.iwe-tr-spin{display:block;width:11px;height:11px;border-radius:50%;border:1.6px solid currentColor;border-right-color:transparent;animation:iwe-tr-spin .7s linear infinite}
@keyframes iwe-tr-spin{to{transform:rotate(360deg)}}
.iwe-tr-btn[data-state=loading]>.iwe-tr-main{cursor:progress}
.iwe-tr-btn[data-state=same]>.iwe-tr-main{opacity:.55;cursor:default}
/* 实心：站点的实心钮两段拼起来，中间一道浅色分隔 */
.iwe-tr-split[data-kind=solid]>.iwe-tr-main{border-top-right-radius:0;border-bottom-right-radius:0}
.iwe-tr-split[data-kind=solid]>.iwe-tr-more{display:inline-flex;align-items:center;justify-content:center;padding:0 8px;border-top-left-radius:0;border-bottom-left-radius:0;box-shadow:inset 1px 0 0 rgba(255,255,255,.32)}
.iwe-tr-split[data-kind=solid][data-state=error]>button{background-color:var(--danger,#e5484d)}
/* 文字：一枚浅底胶囊，主题色字，右段箭头前一道细分隔 */
.iwe-tr-split[data-kind=link]{height:22px;border-radius:999px;background:rgba(128,128,128,.13);color:var(--primary,#1abc9c);font-size:12.5px;line-height:1}
.iwe-tr-split[data-kind=link]>button{appearance:none;display:inline-flex;align-items:center;border:0;background:none;color:inherit;font:inherit;cursor:pointer;transition:background .15s}
.iwe-tr-split[data-kind=link]>button:hover:not(:disabled){background:rgba(128,128,128,.16)}
.iwe-tr-split[data-kind=link]>button:focus-visible{outline:2px solid var(--primary,#1abc9c);outline-offset:-2px}
.iwe-tr-split[data-kind=link]>.iwe-tr-main{gap:4px;padding:0 7px 0 9px;border-radius:999px 0 0 999px}
.iwe-tr-split[data-kind=link]>.iwe-tr-more{position:relative;justify-content:center;width:22px;padding:0 2px 0 0;border-radius:0 999px 999px 0}
.iwe-tr-split[data-kind=link]>.iwe-tr-more::before{content:'';position:absolute;left:0;top:6px;bottom:6px;width:1px;background:currentColor;opacity:.28}
.iwe-tr-split[data-kind=link][data-state=error]{color:var(--danger,#e5484d)}
/* 图标：预览弹窗动作行，翻译图标 + 窄一点的箭头 */
.iwe-tr-split[data-kind=icon]>.iwe-tr-main{min-width:34px;padding:0 4px 0 9px;border-top-right-radius:0;border-bottom-right-radius:0}
.iwe-tr-split[data-kind=icon]>.iwe-tr-more{min-width:24px;padding:0 7px 0 3px;border-top-left-radius:0;border-bottom-left-radius:0;color:var(--cp-fg2,inherit)}
.iwe-tr-split[data-kind=icon]>.iwe-tr-main>.iwe-tr-ic{width:18px;height:18px}
.iwe-tr-split[data-kind=icon] .iwe-tr-spin{width:15px;height:15px;border-width:2px}
.iwe-tr-split[data-kind=icon][data-state=on]>.iwe-tr-main{color:var(--primary,#1abc9c)}
.iwe-tr-split[data-kind=icon][data-state=error]>.iwe-tr-main{color:var(--danger,#e5484d)}
/* 各处的位置 */
.comment__actions>.iwe-tr-btn{margin-right:12px}
.forumPost__header>[${SLOT}]{display:inline-flex;align-items:center;margin-left:auto;margin-right:12px}
.page-post__author>[${SLOT}],.page-post__author__right>.iwe-tr-btn{margin-right:12px}
[data-iwe-pf-h]:has(>[${SLOT}]){display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
[data-iwe-pf-h]>[${SLOT}]{padding-bottom:6px}
.iwe-tr-row{display:flex;justify-content:flex-end;margin-top:6px}
.iwe-news-head .iwe-tr-btn{margin-right:6px;font-weight:500}
/* 语言菜单 */
.iwe-tr-menu{position:fixed;top:0;left:0;z-index:100050;box-sizing:border-box;display:flex;flex-direction:column;min-width:200px;max-width:calc(100vw - 16px);padding:6px;background:#fff;color:var(--text,#222);border:1px solid rgba(128,128,128,.22);border-radius:12px;box-shadow:0 14px 36px rgba(0,0,0,.14),0 2px 6px rgba(0,0,0,.06);font:13px/1.45 Roboto,Arial,sans-serif;opacity:0;transform:translateY(-4px) scale(.98);transform-origin:top right;transition:opacity .14s ease,transform .2s cubic-bezier(.22,1,.36,1)}
.iwe-tr-menu.up{transform:translateY(4px) scale(.98);transform-origin:bottom right}
.iwe-tr-menu.open{opacity:1;transform:none}
body.dark .iwe-tr-menu{background:var(--body-dark,#24272d);border-color:rgba(255,255,255,.09);box-shadow:0 16px 40px rgba(0,0,0,.55)}
.iwe-tr-mhead{flex:none;padding:6px 10px 6px;color:var(--muted,#888);font-size:12px}
.iwe-tr-mlist{min-height:0;overflow-y:auto;overscroll-behavior:contain}
.iwe-tr-opt{appearance:none;display:flex;align-items:center;justify-content:space-between;gap:12px;box-sizing:border-box;width:100%;min-height:34px;margin:0;padding:4px 10px;border:0;border-radius:8px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.iwe-tr-opt:hover,.iwe-tr-opt:focus{background:rgba(128,128,128,.13);outline:0}
.iwe-tr-opt[aria-checked=true]{color:var(--primary,#1abc9c);font-weight:600}
.iwe-tr-opt>svg{flex:none}
@media (pointer:coarse){.iwe-tr-opt{min-height:42px}}
@media (prefers-reduced-motion:reduce){.iwe-tr-menu,.iwe-tr-chev{transition:none}}
@media (prefers-reduced-motion:reduce){.iwe-tr-spin{animation-duration:1.6s}}
`,

  scan() {
    const tl = target();
    for (const ctx of CONTEXTS) {
      for (const host of ctx.hosts()) {
        const g = group(ctx, host);
        let again = false;
        if (g.state === 'on' && stale(g)) { restore(g); again = true; }
        if (g.state !== 'on' && g.state !== 'loading') {
          const key = tl + '\u0000' + ctx.roots(host).map((r) => r.textContent).join('\n'); // 换了目标语言也要重新判断
          if (key !== g.key) {
            again = false; // 原文真的变了：译文作废，等用户再点
            g.key = key;
            g.need = wants(ctx.roots(host));
            if (g.state !== 'idle') setState(g, 'idle');
          }
        }
        if (again && g.need) toggle(g, true); // 只是被重画了、字没变：照缓存换回译文
        const show = g.need || g.state === 'on' || g.state === 'loading' || g.state === 'error';
        g.ui.btn.hidden = !show;
        if (show && (ctx.recheck || !g.ui.btn.isConnected)) ctx.mount(host, g.ui.btn);
      }
    }
  },
});

})();
