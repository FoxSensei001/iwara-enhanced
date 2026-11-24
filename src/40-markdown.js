// 简介编辑器：所见即所得的 Markdown 编辑。内核是开源的 Milkdown（ProseMirror + remark），
// 由 build.mjs 用 esbuild 打进脚本（全局 MK，见 vendor/milkdown.js）。
// 输入规则：打 `## `、`> `、`- `、`**字**` 当场变样式。
// 回车 = 新段落（Markdown 里空一行）；Shift+回车 = 段内换行，输出成行尾两个空格——站点只认这种换行。

const SLOT_RE = /\{([^{}\n]{1,24})\}/g;

/**
 * 占位符 P（如 {角色}）被改成了 X，取出这次真正输入的部分：去掉和 P 相同的开头与结尾。
 * 手机上点进填空后，系统会把光标重新落到手指点的位置（常在 {…} 中间），输入就插进占位符里，
 * 得到 {角cvawd色}；按「还没改过的占位符整格作废」的规则，这里还原出 cvawd。
 */
function slotEdit(P, X) {
  let a = 0;
  while (a < P.length && a < X.length && P[a] === X[a]) a++;
  let b = 0;
  while (b < P.length - a && b < X.length - a && P[P.length - 1 - b] === X[X.length - 1 - b]) b++;
  return X.slice(a, X.length - b);
}

const md = {
  slots: (text) => [...String(text || '').matchAll(SLOT_RE)].map((m) => m[1]),
  /**
   * 编辑器吐出的 Markdown 收个尾：裸链接别包尖括号（站点按原文显示链接），去掉末尾空行；
   * 单独成行的 `<br />` 删掉（代码块里的不动）——那是空段落被导出的样子（编辑器已关掉这条规则，这里兜底旧草稿）。
   * 站点把它原样显示成「<br />」：用户 2026-11-24 发出的评论末尾就带着一行，标题后面编辑器自动补的空段落导出来的。
   */
  tidy: (text) => {
    let fence = false;
    const lines = String(text || '').replace(/<(https?:\/\/[^\s<>]+)>/g, '$1').split('\n').filter((ln) => {
      if (/^\s*(```|~~~)/.test(ln)) fence = !fence;
      return fence || !/^\s*<br\s*\/?>\s*$/i.test(ln);
    });
    // 删掉 `<br />` 后留下的连续空行收成一个（代码块里的空行不动）
    fence = false;
    return lines.filter((ln, i) => { if (/^\s*(```|~~~)/.test(ln)) fence = !fence; return fence || ln.trim() || (i > 0 && lines[i - 1].trim()); }).join('\n').trimEnd();
  },
};

STYLE.push(`
.md{border:1px solid var(--line2);border-radius:12px;background:var(--card);transition:border-color .15s,box-shadow .15s}
.md:focus-within{border-color:var(--fg);box-shadow:0 0 0 3px color-mix(in srgb,var(--fg) 9%,transparent)}
.md{display:flex;flex-direction:column}
.md-foot{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-height:30px;padding:0 10px 8px;margin-top:-10px}
.md-foot .count{font-size:12px;color:var(--fg3)}
.mdfmt{margin-right:auto;display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 8px 0 6px;margin-left:-6px;border:0;border-radius:6px;background:none;color:var(--fg3);font:inherit;font-size:12px;cursor:pointer;transition:color .15s,background .15s}
.mdfmt:hover{color:var(--fg);background:var(--sunk)}
.md-doc{cursor:text}
.md-doc .ProseMirror{position:relative;outline:0;min-height:240px;padding:14px 18px 18px;font-size:15px;line-height:1.7;word-wrap:break-word;white-space:pre-wrap;white-space:break-spaces;font-variant-ligatures:none}
.md-doc .ProseMirror>:first-child{margin-top:0}
.md-doc .ProseMirror pre{white-space:pre-wrap}
.md-doc .ProseMirror li{position:relative}
.md-doc .ProseMirror li>p{margin:0}
.md-doc .ProseMirror-hideselection *::selection{background:transparent}
.md-doc .ProseMirror-selectednode{outline:2px solid var(--blue);outline-offset:2px}
.md-doc img.ProseMirror-separator{display:inline!important;border:none!important;margin:0!important}
.md-doc .ProseMirror .ph::before{content:attr(data-ph);float:left;height:0;pointer-events:none;color:var(--fg3)}
.prose p{margin:.45em 0}.prose h1,.prose h2,.prose h3,.prose h4,.prose h5,.prose h6{margin:.7em 0 .3em;line-height:1.3;letter-spacing:-.02em}
.prose h1{font-size:1.6em}.prose h2{font-size:1.35em}.prose h3{font-size:1.15em}.prose h4,.prose h5,.prose h6{font-size:1em}
.prose ul,.prose ol{margin:.45em 0;padding-left:1.4em}.prose li{margin:.15em 0}
.prose blockquote{margin:.5em 0;padding:.1em 0 .1em 14px;border-left:3px solid var(--line2);color:var(--fg2)}
.prose hr{border:0;border-top:1px solid var(--line2);margin:1em 0}
.prose code{font:.88em "Geist Mono",ui-monospace,Menlo,monospace;background:var(--sunk);border:1px solid var(--line);border-radius:5px;padding:.1em .35em}
.prose pre{margin:.5em 0;padding:12px 14px;background:var(--sunk);border:1px solid var(--line);border-radius:10px;overflow:auto}
.prose pre code{background:none;border:0;padding:0}
.prose img{max-width:100%;max-height:420px;border-radius:10px;display:block;margin:.4em 0;border:1px solid var(--line)}
.prose a{color:var(--blue);text-decoration:none}.prose a:hover{text-decoration:underline}
.prose table{border-collapse:collapse;margin:.5em 0}.prose th,.prose td{border:1px solid var(--line2);padding:4px 10px}
.slot-edit{border-radius:5px;background:color-mix(in srgb,var(--amber) 16%,transparent);box-shadow:0 0 0 1.5px var(--amber);color:var(--fg)}
.slot-edit.empty{display:inline-block;min-width:1.6em;height:1.25em;vertical-align:-.25em;margin:0 1px}
.slot-tip{position:fixed;padding:3px 8px;border-radius:6px;background:var(--amber);color:#fff;font-size:12px;font-weight:600;white-space:nowrap;pointer-events:none!important;opacity:0;transform:translateY(4px) scale(.92);transition:opacity .14s,transform .3s var(--spring)}
.slot-tip::after{content:"";position:absolute;left:50%;bottom:-4px;width:8px;height:8px;margin-left:-4px;background:inherit;transform:rotate(45deg);border-radius:1px}
.slot-tip.in{opacity:1;transform:none}
.slot{padding:0 3px;border-radius:5px;outline:1px dashed color-mix(in srgb,var(--violet) 60%,transparent);background:color-mix(in srgb,var(--violet) 10%,transparent);color:var(--violet)}
.md-doc .mention{color:var(--blue);font-weight:500;border-radius:4px;transition:background .15s}
/* 站内链接：前面一个类型小图标；正在换作品名时网址闪一闪 */
.md-doc .lk-ic{display:inline-flex;vertical-align:-2px;margin:0 3px 0 1px;color:var(--blue);user-select:none}
.md-doc .lk-wait{color:var(--fg3)!important;background:linear-gradient(90deg,transparent 0,color-mix(in srgb,var(--blue) 18%,transparent) 50%,transparent 100%) 0 0/200% 100%;animation:lkwait 1.1s linear infinite;border-radius:4px}
@keyframes lkwait{from{background-position:150% 0}to{background-position:-50% 0}}
.md-doc .mention:hover{background:color-mix(in srgb,var(--blue) 10%,transparent)}
.md-doc .mention-chip{color:var(--blue);font-weight:500;border-radius:4px;padding:0 1px;cursor:default;user-select:none}
.md-doc .mention-raw{font-size:0;letter-spacing:0}
.mbox{min-width:220px}
.smk-tip{padding:0 12px 8px;font-size:11.5px;color:var(--fg3);max-width:240px}
.keep .md-doc .ProseMirror{min-height:110px;font-size:14px}
.mstate{display:flex;align-items:center;gap:8px;height:34px;padding:0 10px;font-size:13px;color:var(--fg3)}
.mlist{transition:opacity .15s}.mlist.stale{opacity:.5}
.who{display:flex;align-items:center;gap:10px}
.who .av{width:24px;height:24px;border-radius:50%;background:var(--sunk) center/cover;display:grid;place-items:center;font-size:11px;font-weight:600;color:var(--fg2);flex:none}
.who small{color:var(--fg3);font-size:12px}
`);

/** 填空位的常驻提示：挂在编辑区上方，写着这里原来要填什么。标题和简介共用这套样子。 */
function slotTip() {
  const el = h('div.slot-tip');
  let shown = false;
  return {
    show(rect, label) {
      if (!el.isConnected) ui.layer.append(el);
      if (el.textContent !== label) el.textContent = label;
      const w = el.offsetWidth, hh = el.offsetHeight;
      el.style.left = clamp((rect.left + rect.right) / 2 - w / 2, 6, innerWidth - w - 6) + 'px';
      el.style.top = Math.max(6, rect.top - hh - 8) + 'px';
      if (!shown) { shown = true; requestAnimationFrame(() => el.classList.add('in')); }
    },
    hide() { shown = false; el.classList.remove('in'); },
    remove() { el.remove(); },
  };
}

/** 选中文字后浮出的「设为填空」：先是一个按钮，点了变成起名输入框，回车把选中的字换成 {名字}。
 *  anchor 只需要 getBoundingClientRect；按钮不抢焦点，选区保持不动。 */
function slotMakerPop(anchor, picked, guess, onApply, onClose) {
  const box = h('div');
  const pop = popover(anchor, box, { onClose });
  const ask = () => {
    pop.asking = true;
    const input = h('input', { value: guess || picked.trim(), placeholder: t('slotName'), maxLength: 24, onkeydown: (e) => {
      if (e.key !== 'Enter' || e.isComposing || !input.value.trim()) return;
      e.preventDefault();
      const name = input.value.trim().replace(/[{}]/g, '');
      pop.close();
      onApply(name);
    } });
    clear(box).append(h('div.field', { style: { border: 0, boxShadow: 'none', width: '240px' } }, icon('sparkle'), input), h('div.smk-tip', t('slotNameTip')));
    pop.replace();
    setTimeout(() => { input.focus(); input.select(); }, 30);
  };
  box.append(h('button.item', { type: 'button', onpointerdown: (e) => e.preventDefault(), onclick: ask }, icon('sparkle'), h('span.grow', t('makeSlot')), h('span.kbd', '↵')));
  pop.ask = ask;
  return pop;
}
/** 原生输入框里某个字符位置的屏幕坐标（量同字体的隐藏文字宽度）。 */
function inputCaretRect(input, pos) {
  const cs = getComputedStyle(input);
  const span = h('span', { style: { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre', font: cs.font, letterSpacing: cs.letterSpacing } }, input.value.slice(0, pos));
  ui.layer.append(span);
  const w = span.offsetWidth;
  span.remove();
  const r = input.getBoundingClientRect();
  const x = r.left + parseFloat(cs.paddingLeft) + w - input.scrollLeft;
  return { left: x, right: x + 1, top: r.top, bottom: r.bottom, width: 1, height: r.height };
}
const okSlotText = (s) => !!s.trim() && s.length <= 24 && !/[{}\n]/.test(s);

/** 文档里已经输完的 @用户名（光标还贴在末尾、正在输入的那个不算；代码里的不算）。 */
const MENTION_RE = /(?<![\w@/.])@([A-Za-z0-9_.-]{2,40})/g;
function findMentions(state, withCaret = false) {
  const out = [];
  const { empty, from: caret } = state.selection;
  state.doc.descendants((node, pos, parent) => {
    if (!node.isText || (parent && parent.type.spec.code) || node.marks.some((m) => m.type.name === 'inlineCode' || m.type.name === 'link')) return;
    for (const m of node.text.matchAll(MENTION_RE)) {
      const name = m[1].replace(/[.-]+$/, '');
      const from = pos + m.index, to = from + 1 + name.length;
      if (!withCaret && empty && caret === to) continue;
      out.push({ from, to, name });
    }
  });
  return out;
}
// @用户名 显示成昵称：昵称和站内链接的作品名共用一份缓存（键是个人页网址，走同一个轻量接口）
const profileHref = (name) => 'https://www.iwara.tv/profile/' + name;
function mentionNick(name) { const e = linkTitles.get(profileHref(name)); return e && e.state === 'ok' ? e.title : null; }
/** 显示成昵称的 @提及：原文还是 @用户名（站点只认这个），编辑区里藏起来、前面放一个昵称块，整块进退、整块删。 */
const findChips = (state) => findMentions(state, true).filter((m) => mentionNick(m.name));

/** 在文档里找所有 {填空}，返回 [{from,to}]（ProseMirror 位置）。 */
function findSlots(doc) {
  const out = [];
  doc.descendants((node, pos) => {
    if (!node.isText) return;
    for (const m of node.text.matchAll(SLOT_RE)) out.push({ from: pos + m.index, to: pos + m.index + m[0].length });
  });
  return out;
}

// ── 链接 ──
// 站内链接（视频 / 图片 / 用户 / 播放列表 / 论坛帖）用站点的轻量接口换成作品名，和 App 里正文的显示一致。
const IWARA_LINK_RE = /^https?:\/\/(?:www\.)?iwara\.tv\/(video|image|profile|playlist|forum)\/([^/\s?#]+)(?:\/([^/\s?#]+))?/i;
const LINK_TYPE_ICON = { video: 'film', image: 'picture', profile: 'user', playlist: 'list', forum: 'chat' };
function iwaraLink(href) {
  const m = String(href || '').match(IWARA_LINK_RE);
  if (!m) return null;
  const type = m[1].toLowerCase();
  const id = type === 'forum' ? m[3] : m[2];
  return id ? { type, id } : null;
}
/** href → { state: 'loading' | 'ok' | 'fail', title } */
const linkTitles = new Map();
function fetchLinkTitle(href, done) {
  const info = iwaraLink(href);
  if (!info) return;
  const hit = linkTitles.get(href);
  if (hit) { if (hit.state !== 'loading') done(hit); else (hit.waiters || (hit.waiters = [])).push(done); return; }
  const entry = { state: 'loading', waiters: [done] };
  linkTitles.set(href, entry);
  api.call(`/light/${info.type}/${encodeURIComponent(info.id)}`, { auth: false })
    .then((d) => { const title = String((info.type === 'profile' ? d && d.name : d && d.title) || '').replace(/[[\]()]/g, '').trim(); Object.assign(entry, title ? { state: 'ok', title } : { state: 'fail' }); })
    .catch(() => { entry.state = 'fail'; })
    .finally(() => { const ws = entry.waiters || []; entry.waiters = null; ws.forEach((fn) => fn(entry)); });
}
/** 文档里所有链接段（同一 href 相邻的文本合成一段）。 */
function findLinks(doc) {
  const out = [];
  doc.descendants((node, pos) => {
    if (!node.isText) return;
    const mk = node.marks.find((m) => m.type.name === 'link');
    if (!mk) return;
    const last = out[out.length - 1];
    if (last && last.to === pos && last.href === mk.attrs.href) { last.to += node.nodeSize; last.text += node.text; }
    else out.push({ from: pos, to: pos + node.nodeSize, href: mk.attrs.href, text: node.text });
  });
  return out;
}
/** 链接（转换出来的、或者光标停在它末尾接着打字）后面紧挨着文字/数字时，补一个空格，不然看着像连成了一个词。标点不补。 */
const WORDY = /^[\p{L}\p{N}]/u;
function spaceAfter(tr, end) {
  const $e = tr.doc.resolve(end);
  const next = $e.parent.textBetween($e.parentOffset, Math.min($e.parentOffset + 1, $e.parent.content.size), null, '\ufffc');
  if (WORDY.test(next)) tr.insert(end, tr.doc.type.schema.text(' '));
}
const MD_LINK_RE = /\[([^[\]\n]+)\]\(((?:https?:\/\/|\/)[^\s()]+)\)/g;
const BARE_URL_RE = /(^|[^\w(\[/"'=])(https?:\/\/[^\s<>()[\]]+)/g;

/** slotMaker：传 { guess(text) } 时，选中一小段文字会浮出「设为填空」（模板编辑用）。 */
/** help：传了就在左下角放「格式」入口，点开站点官方的格式说明（帮助窗口的格式页）。 */
/** onSlot：填空状态（进入 / 离开 / 内容变化）可能变了时调用，手机上的填空条靠它刷新。 */
/**
 * slots：认不认 `{名字}` 填空（发布页 / 模板要；站点上的评论、发帖框不要，那里的花括号就是普通文字）。
 * scrollMargin：光标滚进视口时上下各让出多少（工作台有吸顶头和吸底步骤栏；站点页面只有顶栏）。
 * limit：字数一直显示成「已输入 / 上限」（站点上有上限提示的输入框要；默认只在有字时显示字数）。快到上限变琥珀、超出变红。
 */
function mdEditor({ value = '', placeholder = '', maxLength = 50000, onChange, slotMaker = null, clearLabel = null, help = false, onSlot = null, slots = true, scrollMargin = { top: 84, bottom: 112 }, limit = false }) {
  const slotsOf = (doc) => (slots ? findSlots(doc) : []);
  let ed = null, view = null, destroyed = false, current = md.tidy(value), mentionPop = null;
  let quiet = false; // set() 整篇替换时不做链接转换：打开已有简介不该被改写
  const fresh = new Set(); // 这次编辑里新写进来的站内链接：只有它们会换成作品名
  const queue = [];
  const run = (fn) => (view ? fn(view) : queue.push(fn));

  const mount = h('div.md-doc');
  const count = h('span.count.mono');
  // 一键清空（发布页的简介用）：有内容才出现，撤销写回原文
  const clr = clearLabel && clearBtn(clearLabel, { read: () => api.value, write: (v) => { api.set(v); api.focus(); } });
  const emit = (text) => {
    text = md.tidy(text);
    if (clr) clr.show(!!text.trim());
    const n = text.length;
    count.textContent = limit ? `${n.toLocaleString()} / ${maxLength.toLocaleString()}` : n ? String(n) : '';
    count.style.color = n > maxLength ? 'var(--red)' : limit && n >= maxLength * 0.9 ? 'var(--amber)' : '';
    if (text === current) return;
    current = text;
    onChange && onChange(text);
  };
  emit(current);

  // 不放格式工具栏：Markdown 照打就会变样式（见文件头），按钮只会让简介越写越花
  const fmtBtn = help && h('button.mdfmt', { type: 'button', onpointerdown: (e) => e.preventDefault(), onclick: () => showHelp({ at: 'format', onClose: () => api.focus() }) }, icon('help', 13), h('span', t('mdFormat')));
  const foot = h('div.md-foot', fmtBtn, count, clr && clr.el);
  const el = h('div.md', mount, foot);
  // 点编辑区下方空白处：光标放到末尾
  mount.addEventListener('pointerdown', (e) => { if (e.target === mount) { e.preventDefault(); api.focus(); } });

  /** 整块删除的单位：昵称块，和文字不是网址本身的站内链接（作品名、或者 `[视频1](…)` 里自己写的字）。 */
  const atoms = (state) => [...findChips(state), ...findLinks(state.doc).filter((l) => l.text !== l.href && iwaraLink(l.href))];
  // ── @ 联想：光标前是 @xxx 就查用户，浮层贴着光标 ──
  const caretAnchor = (v) => ({
    getBoundingClientRect() { const c = v.coordsAtPos(v.state.selection.from); return { left: c.left, right: c.left + 1, top: c.top, bottom: c.bottom, width: 1, height: c.bottom - c.top }; },
  });
  const mentionQuery = (v) => {
    const { $from, empty } = v.state.selection;
    if (!empty || $from.parent.type.spec.code) return null;
    const before = $from.parent.textBetween(0, $from.parentOffset, null, '￼');
    const m = before.match(/(?:^|[^\w@/.])@([\w.-]{1,30})$/);
    return m ? m[1] : null;
  };
  // 浮层一出现就挂着：先显示「搜索用户」转圈，请求回来再换成结果；同一个查询不重复发。
  let mention = null; // { q, users, cur, loading, box, pop, v }
  function closeMention() { if (mentionPop) { const p = mentionPop; mentionPop = null; mention = null; p.close(); } }
  function pickMention(u) {
    const v = mention && mention.v;
    if (!v) return;
    const query = mentionQuery(v);
    if (query == null) return closeMention();
    const to = v.state.selection.from;
    closeMention();
    linkTitles.set(profileHref(u.username), { state: 'ok', title: String(u.name || u.username).replace(/[[\]()]/g, '').trim() || u.username });
    v.dispatch(v.state.tr.insertText('@' + u.username + ' ', to - query.length - 1, to));
    v.focus();
  }
  function drawMention() {
    const m = mention;
    if (!m) return;
    const rows = m.users.slice(0, 7).map((u, i) => h('button.item' + (i === m.cur ? '.cur' : ''), { type: 'button', onpointerdown: (e) => { e.preventDefault(); pickMention(u); } },
      h('div.who', h('div.av', { style: thumbUrl.avatar(u) ? { backgroundImage: `url(${thumbUrl.avatar(u)})` } : null }, thumbUrl.avatar(u) ? '' : u.name.slice(0, 1).toUpperCase()), h('span', u.name), h('small', '@' + u.username))));
    clear(m.box);
    add(m.box, [
      // 第一次查、手里还没有结果：摆三行用户的骨架（头像 + 名字 + @id）
      m.loading && !rows.length && h('div', { 'aria-label': t('searchingUsers') }, [96, 72, 84].map((w) => h('div.skrow', skel(24, 24, true), skel(w, 10), skel(w * 0.6, 8)))),
      !m.loading && !rows.length && h('div.mstate', t('noResult')),
      h('div.mlist' + (m.loading && rows.length ? '.stale' : ''), rows),
    ]);
    m.pop.replace();
  }
  function showMention(v, q) {
    if (!mention) {
      const box = h('div.mbox');
      mention = { q: null, users: [], cur: 0, loading: false, box, v };
      mentionPop = mention.pop = popover(caretAnchor(v), box, { onClose: () => { mentionPop = null; mention = null; } });
      mentionPop.onKey = (e) => {
        const m = mention;
        if (!m || !m.users.length) return false;
        const n = Math.min(7, m.users.length);
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { m.cur = (m.cur + (e.key === 'ArrowDown' ? 1 : -1) + n) % n; drawMention(); return true; }
        if (e.key === 'Enter' || e.key === 'Tab') { pickMention(m.users[m.cur]); return true; }
        return false; // Esc 由浮层自己关
      };
    }
    mention.v = v;
    if (mention.q === q) { mention.pop.replace(); return; }
    mention.q = q;
    mention.loading = true;
    drawMention();
    lookup(q);
  }
  const lookup = debounce(async (q) => {
    const users = (await svc.searchUsers(q)).filter((u) => u.status !== 'banned');
    if (destroyed || !mention || mention.q !== q) return; // 期间又改了查询：作废
    const ql = q.toLowerCase();
    const rank = (u) => (u.username.toLowerCase() === ql ? 0 : u.username.toLowerCase().startsWith(ql) || u.name.toLowerCase().startsWith(ql) ? 1 : 2);
    users.sort((a, b) => rank(a) - rank(b));
    Object.assign(mention, { users, cur: 0, loading: false });
    drawMention();
  }, 260);

  // ── 链接转换 ──
  // 打出 `[文字](网址)`（打完右括号那一刻）→ 变成链接；打出裸网址、后面接着打了空格或别的字 → 变成链接。
  // 链接文字就是网址本身的站内链接 → 换成作品名（只换这次新写进来的，旧简介不动）。
  function convertLinks(trs, oldState, state) {
    if (quiet || !trs.some((tr) => tr.docChanged) || trs.some((tr) => tr.getMeta('iwe-link'))) return null;
    const ranges = [];
    trs.forEach((tr, i) => {
      tr.steps.forEach((step, j) => step.getMap().forEach((a, b, from, to) => {
        let f = from, e = to;
        for (let k = j + 1; k < tr.steps.length; k++) { f = tr.steps[k].getMap().map(f, -1); e = tr.steps[k].getMap().map(e, 1); }
        for (let k = i + 1; k < trs.length; k++) { f = trs[k].mapping.map(f, -1); e = trs[k].mapping.map(e, 1); }
        ranges.push([f, e]);
      }));
    });
    const size = state.doc.content.size, head = state.selection.head;
    const linkType = state.schema.marks.link;
    const edits = [];
    const seen = new Set();
    for (const [f, e] of ranges) {
      state.doc.nodesBetween(Math.max(0, Math.min(f, size)), Math.max(0, Math.min(e, size)), (node, pos) => {
        if (!node.isTextblock) return true;
        if (node.type.spec.code || seen.has(pos)) return false;
        seen.add(pos);
        const end = pos + 1 + node.content.size;
        node.forEach((child, offset) => {
          if (!child.isText) return;
          const at = pos + 1 + offset;
          const mk = child.marks.find((m) => m.type === linkType);
          if (mk) { if (child.text === mk.attrs.href && iwaraLink(mk.attrs.href)) fresh.add(mk.attrs.href); return; }
          if (child.marks.some((m) => m.type.name === 'inlineCode')) return;
          const taken = [];
          for (const m of child.text.matchAll(MD_LINK_RE)) {
            if (m.index > 0 && child.text[m.index - 1] === '!') continue; // 图片语法留给编辑器自己
            taken.push([m.index, m.index + m[0].length]);
            edits.push({ from: at + m.index, to: at + m.index + m[0].length, text: m[1], href: m[2], marks: child.marks });
          }
          for (const m of child.text.matchAll(BARE_URL_RE)) {
            const s0 = m.index + m[1].length;
            const rawEnd = s0 + m[2].length;
            // 网址后面接了空白才算打完；停在段尾时，要等光标离开它
            if (rawEnd < child.text.length ? !/\s/.test(child.text[rawEnd]) : at + rawEnd === end ? head === at + rawEnd : true) continue;
            const url = m[2].replace(/[.,;:!?。，；：！？、」』）]+$/, '');
            const e0 = s0 + url.length;
            if (taken.some(([a, b]) => s0 < b && e0 > a)) continue;
            edits.push({ from: at + s0, to: at + e0, text: url, href: url, marks: child.marks });
          }
        });
        return false;
      });
    }
    if (!edits.length) return null;
    const tr = state.tr.setMeta('iwe-link', true);
    edits.sort((a, b) => b.from - a.from);
    for (const x of edits) {
      tr.replaceWith(x.from, x.to, state.schema.text(x.text, linkType.create({ href: x.href }).addToSet(x.marks)));
      spaceAfter(tr, x.from + x.text.length);
      if (x.text === x.href && iwaraLink(x.href)) fresh.add(x.href);
    }
    tr.setStoredMarks(tr.selection.$from.marks().filter((m) => m.type !== linkType)); // 接着打的字不算进链接
    return tr;
  }
  /** 新写进来的站内链接去要作品名；回来后把「文字 = 网址」的那几段换成作品名。 */
  function resolveTitles(v) {
    for (const href of fresh) {
      fetchLinkTitle(href, (res) => {
        if (destroyed || !view || res.state !== 'ok') { fresh.delete(href); if (view && !destroyed) view.dispatch(view.state.tr.setMeta('iwe-link', true)); return; }
        const st = view.state;
        const hits = findLinks(st.doc).filter((l) => l.href === href && l.text === href).sort((a, b) => b.from - a.from);
        fresh.delete(href);
        const tr = st.tr.setMeta('iwe-link', true);
        for (const l of hits) {
          const marks = st.doc.resolve(l.from + 1).marks();
          tr.replaceWith(l.from, l.to, st.schema.text(res.title, marks.length ? marks : [st.schema.marks.link.create({ href })]));
          spaceAfter(tr, l.from + res.title.length);
        }
        view.dispatch(tr);
      });
    }
  }

  // ── 选中文字 → 设为填空（只在模板编辑里开）──
  let makerPop = null, makerKey = '';
  function updateMaker(v) {
    if (!slotMaker || (makerPop && makerPop.asking)) return;
    const { from, to, empty, $from, $to } = v.state.selection;
    const text = empty ? '' : v.state.doc.textBetween(from, to, '\n');
    const ok = !empty && v.hasFocus() && $from.sameParent($to) && okSlotText(text);
    const key = ok ? from + ':' + to : '';
    if (key === makerKey) return;
    makerKey = key;
    if (makerPop) { const p = makerPop; makerPop = null; p.close(); }
    if (!ok) return;
    const anchor = { getBoundingClientRect() { const a = v.coordsAtPos(from), b = v.coordsAtPos(to); return { left: a.left, right: b.right, top: Math.min(a.top, b.top), bottom: Math.max(a.bottom, b.bottom), width: b.right - a.left, height: b.bottom - a.top }; } };
    const pop = slotMakerPop(anchor, text, slotMaker.guess && slotMaker.guess(text), (name) => { v.dispatch(v.state.tr.insertText(`{${name}}`, from, to)); v.focus(); }, () => { if (makerPop === pop) { makerPop = null; makerKey = ''; } });
    makerPop = pop;
  }

  // ── 填空位 ──
  // 点一下 / Tab 跳到填空位：这段变成橙色编辑区（选中原文，直接打字替换），上方一直挂着原来要填什么。
  // 回车、→、↑、↓、Esc 视为填完；编辑区空着时按退格也视为填完。光标停在填空位后面按退格：整个删掉。
  const slotKey = new MK.PluginKey('iwe-slot');
  const tip = slotTip();
  function activate(v, slot) {
    const label = v.state.doc.textBetween(slot.from + 1, slot.to - 1);
    // p：这一格还是原样的占位符。第一次输入整格替换（见 view.update 里的修正），不管光标落在格子里哪儿
    v.dispatch(v.state.tr.setSelection(MK.TextSelection.create(v.state.doc, slot.from, slot.to)).setMeta(slotKey, { from: slot.from, to: slot.to, label, p: true }).scrollIntoView());
    v.focus();
    // 触屏：点按之后系统还会再摆一次光标，把整格选中盖掉；稍后补选一次（补不上也有上面的整格替换兜底）
    if (matchMedia('(hover:none)').matches) setTimeout(() => {
      if (destroyed || !view || v.composing) return;
      const a = slotKey.getState(v.state);
      if (a && a.p && a.from === slot.from && (v.state.selection.from !== a.from || v.state.selection.to !== a.to)) v.dispatch(v.state.tr.setSelection(MK.TextSelection.create(v.state.doc, a.from, a.to)));
    }, 80);
  }
  function finish(v, toEnd) {
    const act = slotKey.getState(v.state);
    if (!act) return;
    const tr = v.state.tr.setMeta(slotKey, null);
    if (toEnd) tr.setSelection(MK.TextSelection.create(v.state.doc, act.to));
    v.dispatch(tr);
  }
  /** 还没改过的占位符被输入改动了（光标落在 {…} 中间打的字）：整格换成这次输入的内容。输入法组字期间不动，组完再修。 */
  function fixPending(v) {
    if (destroyed || !view || v.composing) return;
    const sa = slotKey.getState(v.state);
    if (!sa || !sa.p) return;
    const P = `{${sa.label}}`, X = v.state.doc.textBetween(sa.from, sa.to);
    if (X === P) return;
    const ins = slotEdit(P, X);
    const tr = ins ? v.state.tr.insertText(ins, sa.from, sa.to) : v.state.tr.delete(sa.from, sa.to);
    tr.setSelection(MK.TextSelection.create(tr.doc, sa.from + ins.length)).setMeta(slotKey, { from: sa.from, to: sa.from + ins.length, label: sa.label, p: false });
    v.dispatch(tr);
  }
  /**
   * 触屏：系统按手指落点摆光标，点击回调要么不来、要么被随后的摆光标盖掉。不靠点击，改看结果——
   * 光标落进某个填空里面：进入这一格并整格选中；还没改过的这一格，光标在里面挪到哪都吸回整格选中。
   */
  function touchSnap(v) {
    if (destroyed || !view || v.composing || !v.hasFocus() || !matchMedia('(hover:none)').matches) return;
    const { from, to, empty } = v.state.selection;
    const a = slotKey.getState(v.state);
    if (a && a.p) {
      if (from >= a.from && to <= a.to && (from !== a.from || to !== a.to)) v.dispatch(v.state.tr.setSelection(MK.TextSelection.create(v.state.doc, a.from, a.to)));
      return;
    }
    if (!empty) return;
    const slot = slotsOf(v.state.doc).find((x) => from >= x.from && from < x.to); // 点在左边缘也算
    if (slot && !(a && a.from === slot.from)) activate(v, slot);
  }
  const helper = MK.$prose(() => new MK.Plugin({
    key: slotKey,
    appendTransaction: convertLinks,
    state: {
      init: () => null,
      apply(tr, act) {
        const meta = tr.getMeta(slotKey);
        if (meta !== undefined) return meta;
        if (!act) return null;
        // 编辑区两端向外吸附：在边上打字，字算进编辑区
        const from = tr.mapping.map(act.from, -1), to = Math.max(from, tr.mapping.map(act.to, 1));
        const sel = tr.selection;
        if (sel.from < from || sel.to > to) return null; // 光标离开编辑区：结束
        return { from, to, label: act.label, p: act.p };
      },
    },
    view: (v0) => {
      const place = (v) => {
        const act = slotKey.getState(v.state);
        if (!act || !v.hasFocus()) { tip.hide(); return; }
        const a = v.coordsAtPos(act.from), b = v.coordsAtPos(act.to);
        tip.show({ left: a.left, right: Math.max(a.left, b.right), top: Math.min(a.top, b.top) }, act.label);
      };
      const onScroll = () => place(v0);
      addEventListener('scroll', onScroll, true);
      const onBlur = () => tip.hide();
      v0.dom.addEventListener('blur', onBlur);
      // 组字结束时 ProseMirror 未必再发事务，update 不一定会跑：自己补查一次
      const onCompEnd = () => setTimeout(() => fixPending(v0), 30);
      v0.dom.addEventListener('compositionend', onCompEnd);
      return {
        update(v) {
          // 不在 update 里同步 dispatch（会打乱其他插件视图的这一轮更新），放到微任务里
          const sa = slotKey.getState(v.state);
          if (sa && sa.p) Promise.resolve().then(() => fixPending(v));
          Promise.resolve().then(() => touchSnap(v));
          const q = mentionQuery(v);
          if (q && !mentionNick(q)) showMention(v, q); else closeMention();
          place(v); updateMaker(v); if (fresh.size) resolveTitles(v);
          if (onSlot) onSlot();
          for (const m of findMentions(v.state)) {
            if (linkTitles.has(profileHref(m.name))) continue;
            fetchLinkTitle(profileHref(m.name), (res) => { if (res.state === 'ok' && view && !destroyed) view.dispatch(view.state.tr.setMeta('iwe-link', true)); });
          }
        },
        destroy() { removeEventListener('scroll', onScroll, true); v0.dom.removeEventListener('blur', onBlur); v0.dom.removeEventListener('compositionend', onCompEnd); tip.hide(); },
      };
    },
    props: {
      // 光标停在链接末尾打字：字不并进链接（不然 `[dd](…)` 后面打的话都会变成链接文字）
      handleTextInput(v, from, to, text) {
        const lk = v.state.schema.marks.link, $f = v.state.doc.resolve(from);
        if (from !== to || !lk.isInSet($f.marks()) || ($f.nodeAfter && lk.isInSet($f.nodeAfter.marks))) return false;
        const t2 = WORDY.test(text) ? ' ' + text : text; // 紧贴链接打字：先隔一个空格
        v.dispatch(v.state.tr.insertText(t2, from, to).removeMark(from, from + t2.length, lk));
        return true;
      },
      // 粘贴单独一条网址：自己插，不交给 Milkdown（它按 Markdown 解析，粘在一段中间会把这段拆成两段；还会先把网址变成链接，
      // `[文字](` 后面贴的就再也凑不成 `[文字](网址)`）。走 DOM 事件这一层，因为 Milkdown 的剪贴板插件排在前面，handlePaste 轮不到。
      handleDOMEvents: { paste: (v, e) => {
        const txt = (e.clipboardData && e.clipboardData.getData('text/plain')) || '';
        if (!/^\s*https?:\/\/\S+\s*$/.test(txt)) return false;
        const { from, to, $from } = v.state.selection;
        if ($from.parent.type.spec.code) return false;
        e.preventDefault();
        const url = txt.trim(), lk = v.state.schema.marks.link;
        const tr = v.state.tr.insertText(url, from, to).removeMark(from, from + url.length, lk);
        // `[文字](` 后面：先按原文放着，打出右括号再整体变成链接
        if (!/\($/.test($from.parent.textBetween(0, $from.parentOffset, null, '\ufffc'))) {
          tr.addMark(from, from + url.length, lk.create({ href: url })).setMeta('iwe-link', true);
          if (iwaraLink(url)) fresh.add(url); else spaceAfter(tr, from + url.length);
          tr.setStoredMarks(tr.selection.$from.marks().filter((m) => m.type !== lk));
        }
        v.dispatch(tr.scrollIntoView());
        return true;
      } },
      handleKeyDown(v, e) {
        if (mentionPop && mentionPop.onKey(e)) { e.preventDefault(); return true; }
        if (e.isComposing) return false;
        if (makerPop && !makerPop.asking && e.key === 'Enter') { e.preventDefault(); makerPop.ask(); return true; }
        const act = slotKey.getState(v.state);
        const { from, to, empty } = v.state.selection;
        if (e.key === 'Tab' && !e.shiftKey) {
          const all = slotsOf(v.state.doc);
          const next = all.find((s) => s.from >= (act ? act.to : to)) || all.find((s) => s.from !== from);
          if (next) { e.preventDefault(); activate(v, next); return true; }
          // 已经是最后一格：这一格算填完，光标停在它后面，不让 Tab 把焦点带到别的控件上
          if (act) { e.preventDefault(); finish(v, true); return true; }
          return false;
        }
        if (act) {
          if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'Escape') { e.preventDefault(); finish(v, true); return true; }
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { finish(v, false); return false; }
          if (e.key === 'Backspace' && act.from === act.to) { e.preventDefault(); finish(v, false); return true; }
          return false;
        }
        if (e.key === 'Backspace' && empty) {
          const slot = slotsOf(v.state.doc).find((s) => s.to === from);
          if (slot) { e.preventDefault(); v.dispatch(v.state.tr.delete(slot.from, slot.to)); return true; }
        }
        // 转换过的东西是一整块：显示成昵称的 @提及、显示成作品名 / 自定文字的站内链接，退格 / Delete 一下删整块，不会一个字一个字地删
        if ((e.key === 'Backspace' || e.key === 'Delete') && empty && !e.altKey && !e.metaKey) {
          const back = e.key === 'Backspace';
          const atom = atoms(v.state).find((x) => (back ? x.to === from : x.from === from));
          if (atom) { e.preventDefault(); v.dispatch(v.state.tr.delete(atom.from, atom.to).scrollIntoView()); return true; }
        }
        // 昵称块里藏着的原文不让光标走进去
        if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && empty && !e.shiftKey && !e.altKey && !e.metaKey) {
          const left = e.key === 'ArrowLeft';
          const chip = findChips(v.state).find((m) => (left ? from > m.from && from <= m.to : from >= m.from && from < m.to));
          if (chip) { e.preventDefault(); v.dispatch(v.state.tr.setSelection(MK.TextSelection.create(v.state.doc, left ? chip.from : chip.to))); return true; }
        }
        return false;
      },
      handleClick(v, pos, e) {
        if (e.metaKey || e.ctrlKey) {
          const m = findMentions(v.state).find((x) => pos >= x.from && pos <= x.to);
          if (m) { window.open('https://www.iwara.tv/profile/' + m.name, '_blank', 'noopener'); return true; }
          const l = findLinks(v.state.doc).find((x) => pos >= x.from && pos <= x.to);
          if (l && /^https?:/.test(l.href)) { window.open(l.href, '_blank', 'noopener'); return true; }
        }
        const chip = findChips(v.state).find((m) => pos > m.from && pos < m.to);
        if (chip) { v.dispatch(v.state.tr.setSelection(MK.TextSelection.create(v.state.doc, chip.to))); return true; }
        const slot = slotsOf(v.state.doc).find((s) => pos >= s.from && pos < s.to);
        if (!slot) return false;
        const act = slotKey.getState(v.state);
        if (act && act.from === slot.from) return false;
        activate(v, slot);
        return true;
      },
      decorations(state) {
        const act = slotKey.getState(state);
        const chips = findChips(state);
        const decos = findMentions(state).filter((m) => !chips.some((c) => c.from === m.from)).map((m) => MK.Decoration.inline(m.from, m.to, { class: 'mention' }));
        for (const c of chips) {
          const nick = mentionNick(c.name);
          decos.push(MK.Decoration.widget(c.from, () => h('span.mention-chip', { contentEditable: 'false', title: '@' + c.name }, '@' + nick), { side: 1, key: 'mn:' + c.name + ':' + nick }));
          decos.push(MK.Decoration.inline(c.from, c.to, { class: 'mention-raw' }));
        }
        for (const l of findLinks(state.doc)) {
          const info = iwaraLink(l.href);
          if (!info) continue;
          const loading = fresh.has(l.href) && l.text === l.href;
          decos.push(MK.Decoration.widget(l.from, () => h('span.lk-ic', { title: '' }, icon(LINK_TYPE_ICON[info.type], 13)), { side: -1, key: 'lk:' + info.type + (loading ? ':w' : '') }));
          if (loading) decos.push(MK.Decoration.inline(l.from, l.to, { class: 'lk-wait' }));
        }
        decos.push(...slotsOf(state.doc).filter((s) => !act || s.to <= act.from || s.from >= act.to).map((s) => MK.Decoration.inline(s.from, s.to, { class: 'slot' })));
        if (act) decos.push(act.from < act.to ? MK.Decoration.inline(act.from, act.to, { class: 'slot-edit' }) : MK.Decoration.widget(act.from, () => h('span.slot-edit.empty'), { side: 1 }));
        const first = state.doc.firstChild;
        if (placeholder && state.doc.childCount === 1 && first && first.type.name === 'paragraph' && !first.content.size) {
          decos.push(MK.Decoration.node(0, first.nodeSize, { class: 'ph', 'data-ph': placeholder }));
        }
        return MK.DecorationSet.create(state.doc, decos);
      },
    },
  }));

  MK.Editor.make()
    .config((ctx) => {
      ctx.set(MK.rootCtx, mount);
      ctx.set(MK.defaultValueCtx, current);
      ctx.update(MK.editorViewOptionsCtx, (o) => ({ ...o, attributes: { class: 'prose', spellcheck: 'false' },
        // 页面顶上有站点的固定头、底下有吸底的步骤栏：光标滚进视口时要让开它们，不然换行换到底栏后面就看不见了
        scrollMargin: { ...scrollMargin, left: 5, right: 5 }, scrollThreshold: { ...scrollMargin, left: 0, right: 0 } }));
      ctx.update(MK.remarkStringifyOptionsCtx, (o) => ({ ...o, bullet: '-', handlers: { ...(o.handlers || {}), break: () => '  \n' } }));
      ctx.get(MK.listenerCtx).markdownUpdated((_, text) => emit(text));
    })
        // 空段落别导出成 `<br />`（站点会原样显示这串字）：装配前把这条规则从 commonmark 里滤掉，空段落直接丢掉。
    // 不用 editor.remove()：它是异步的（返回 Promise），接在链上会断掉 .create()
    .use(MK.commonmark.filter((p) => ![].concat(MK.remarkPreserveEmptyLinePlugin).includes(p))).use(MK.gfm).use(MK.history).use(MK.listener).use(MK.clipboard).use(MK.trailing).use(helper)
    .create()
    .then((editor) => {
      if (destroyed) { editor.destroy(); return; }
      ed = editor;
      view = ed.ctx.get(MK.editorViewCtx);
      queue.splice(0).forEach((fn) => fn(view));
    });

  const api = {
    el,
    get value() { if (ed) emit(ed.action(MK.getMarkdown())); return current; },
    set(v) { run(() => { quiet = true; try { ed.action(MK.replaceAll(v)); } finally { quiet = false; } emit(ed.action(MK.getMarkdown())); }); },
    focus() { run((v) => { v.dispatch(v.state.tr.setSelection(MK.TextSelection.atEnd(v.state.doc))); v.focus(); }); },
    /** 进入第一个填空位；没有填空（或编辑器还没起来）返回 false。 */
    focusFirstSlot() {
      if (!view) return false;
      const first = slotsOf(view.state.doc)[0];
      if (first) activate(view, first);
      return !!first;
    },
    /** 还没填的填空位个数（正在填、还没改动的那一格也算）。 */
    slotCount: () => (view ? slotsOf(view.state.doc).length : 0),
    /** 正在填的那一格：{ label, pending }，pending = 还是原来的 {名字} 没改；没有在填返回 null。 */
    activeSlot() {
      if (view) fixPending(view);
      const a = view && slotKey.getState(view.state);
      if (!a) return null;
      return { label: a.label, pending: /^\{[^{}\n]{1,24}\}$/.test(view.state.doc.textBetween(a.from, a.to)) };
    },
    /** 跳到当前这格（或光标）后面的下一个填空，不回绕；没有返回 false。 */
    nextSlot() {
      if (!view) return false;
      fixPending(view);
      const a = slotKey.getState(view.state);
      const next = slotsOf(view.state.doc).find((x) => x.from >= (a ? a.to : view.state.selection.to));
      if (next) activate(view, next);
      return !!next;
    },
    /** 这一格算填完，光标停在它后面。 */
    finishSlot() { if (view) { fixPending(view); finish(view, true); } },
    /** 整格删掉（不需要的空），光标留在原处。 */
    clearSlot() {
      const a = view && slotKey.getState(view.state);
      if (a) view.dispatch(view.state.tr.delete(a.from, a.to).setMeta(slotKey, null));
    },
    blur() { if (view) view.dom.blur(); },
    /** 把还在防抖里的修改立刻交出去。 */
    commit() { if (ed) emit(ed.action(MK.getMarkdown())); },
    destroy() { api.commit(); destroyed = true; closeMention(); tip.remove(); if (makerPop) makerPop.close(); if (ed) ed.destroy(); ed = view = null; },
  };
  return api;
}
