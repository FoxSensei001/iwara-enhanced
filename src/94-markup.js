// 应用用户发出的评论/论坛帖子中的特殊结构渲染：表情、论坛引用、小尾巴。
// 只做渲染，不改发送侧（不加表情选择器、不改输入框）。

(() => {

defineStrings({
  markupEmojiAlt: '表情',
}, {
  markupEmojiAlt: 'Emoji',
}, {
  markupEmojiAlt: '絵文字',
});

// ---- 配置 ----
const EMOJI_SIZE_MAP = {
  'icon-i': 'icon',
  'text-i': 'small',
  'mid-i': 'mid',
  'large-i': 'large',
  'xl-i': 'xl',
};

// ---- 表情 ----
// 只认 alt：作者写 ![emo](图片地址) 或 ![emo:large-i](图片地址) 就是在声明「这是表情」，图片放在哪个站都一样
// （评论里确有放在论坛图床上的表情图，按图床域名过滤会让它们以原图大小撑满整行）。
function getEmojiSize(img) {
  const alt = img.dataset.iweAlt || img.alt || '';
  if (alt === 'emo') return 'mid';
  if (alt.startsWith('emo:')) {
    const suffix = alt.slice(4);
    return EMOJI_SIZE_MAP[suffix] || 'mid';
  }
  return null;
}

function transformEmoji(img) {
  const size = getEmojiSize(img);
  if (!size) return;
  // 站点重渲染可能把同一个 img 的 alt 改回原值：先记下作者写的原始 alt，免得第二次扫描认不出来
  if (!img.dataset.iweAlt) img.dataset.iweAlt = img.alt;
  img.classList.add('iwe-emo', size);
  img.alt = t('markupEmojiAlt');
}

// ---- 论坛引用 ----
const QUOTE_PATTERN = /^\s*Reply\s*#(\d+)\s*[:：]?\s*@(\S+)/i;

function parseQuoteFromBlockquote(blockquote) {
  const text = blockquote.textContent || '';
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  if (!lines.length) return null;

  const match = lines[0].match(QUOTE_PATTERN);
  if (!match) return null;

  return {
    floor: parseInt(match[1], 10),
    username: match[2],
    excerpt: lines.slice(1).join(' ').trim() || null,
  };
}

function parseQuoteFromH2(h2) {
  const text = h2.textContent || '';
  const match = text.match(QUOTE_PATTERN);
  if (!match) return null;

  return {
    floor: parseInt(match[1], 10),
    username: match[2],
    excerpt: null,
  };
}

// 构造引用条（不负责放到哪里）
async function buildQuote(quote) {
  // 查用户资料
  let profile = siteData.user(quote.username);
  if (!profile) {
    try {
      const data = await api.call('/profile/' + encodeURIComponent(quote.username), { auth: 'auto' });
      profile = data?.user || { name: quote.username, username: quote.username };
    } catch {
      profile = { name: quote.username, username: quote.username };
    }
  }

  const container = h('div.iwe-quote');

  // 头像
  const avatar = h('div.iwe-quote-av');
  // 头像文件名是 <文件名去扩展名>.jpg，不是固定的 avatar.jpg：走统一的 thumbUrl
  const avatarUrl = thumbUrl.avatar(profile);
  if (avatarUrl) avatar.style.backgroundImage = `url(${avatarUrl})`;
  container.append(avatar);

  // 昵称与用户名
  const names = h('div');
  const displayName = profile.name !== quote.username ? profile.name : quote.username;
  names.append(h('span.iwe-quote-name', displayName));
  if (profile.name !== quote.username) {
    names.append(' ', h('span.iwe-quote-user', '@' + quote.username));
  }
  container.append(names);

  // 楼层号链接
  const floorEl = h('span.iwe-quote-floor', '#' + quote.floor);

  // 判断是否在论坛主题页
  const isForumThread = /^\/forum\/[^/]+\/[a-f0-9-]+/.test(location.pathname);
  if (isForumThread) {
    // 论坛页：尝试跳到对应楼层
    const link = h('a.iwe-quote-link', {
      href: location.pathname + '#post-' + quote.floor, // 新标签打开时也能自己翻到那一页
      onclick: (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        jumpToFloor(quote.floor);
      },
    });
    link.append(floorEl);
    container.append(link);
  } else {
    // 其他页面：跳到用户页
    const link = h('a.iwe-quote-link', { href: `/profile/${quote.username}` });
    link.append(floorEl);
    container.append(link);
  }

  return container;
}

async function transformQuote(element, quote) {
  const container = await buildQuote(quote);
  if (element.isConnected) element.replaceWith(container);
}

// 站点把「Reply #N: @x」后紧跟的 --- 当 setext 标题时，标题不是 <h2> 而是 <div class="text text--h2">
const QUOTE_HEAD_SEL = 'h2, .text--h2';

// 站点另一种渲染：「Reply #N: @x」与正文在同一个段落里，@x 被渲染成资料页链接，--- 留在下一行开头：
// <p>Reply #1: <a href="/profile/x">@x</a>\n---正文</p>
// 命中则返回 { quote, rest }：rest 是去掉引用头与 --- 之后剩下的段落内容；不是这种结构返回 null
function parseQuoteFromParagraph(p) {
  const head = p.firstChild, link = head && head.nextSibling, tail = link && link.nextSibling;
  if (!head || head.nodeType !== 3 || !link || link.nodeName !== 'A' || !tail || tail.nodeType !== 3) return null;
  const m = head.nodeValue.match(/^\s*Reply\s*#(\d+)\s*[:：]?\s*$/i);
  const href = link.getAttribute('href') || '';
  const u = href.match(/^\/profile\/([^/?#]+)/);
  if (!m || !u || !/^\s*\n---/.test(tail.nodeValue)) return null;
  return { quote: { floor: parseInt(m[1], 10), username: decodeURIComponent(u[1]), excerpt: null }, nodes: [head, link], tail };
}

// ── 论坛楼层（#post-N）──────────────────────────────────────────────
// 站点每条帖子的头部有个「#N」链接，指向 #post-N，但帖子节点本身没有 id="post-N"，浏览器和站点路由都找不到目标，
// 点了没反应；楼层又按页分（每页 limit 条，楼号 replyNum 从 0 起），目标常常根本不在当前页。以前我们的引用条用
// `.comment` 当选择器（论坛帖子根本不是 .comment）并且把楼号当成本页第几条，所以也是坏的。
// 修法：给每条帖子补上 id；楼号 → 页码 = floor(楼号 / limit)，不在当前页就先翻页再滚过去；带 #post-N 的地址打开时同样处理。
const THREAD_PATH = /^\/forum\/([^/]+)\/([^/]+)(?:\/[^/]+)?\/?$/; // 末尾可带标题 slug
let threadMeta = null; // { key: '<板块>/<主题 id>', limit }
siteData.onApi((url, json) => {
  try {
    const m = new URL(url).pathname.match(/^\/forum\/([^/]+)\/([^/]+)$/);
    if (m && json && typeof json.limit === 'number' && json.limit > 0) threadMeta = { key: m[1] + '/' + m[2], limit: json.limit };
  } catch { /* 忽略 */ }
});
async function threadLimit() {
  const m = location.pathname.match(THREAD_PATH);
  if (!m) return 0;
  const key = m[1] + '/' + m[2];
  if (threadMeta && threadMeta.key === key) return threadMeta.limit;
  try {
    const j = await api.call(`/forum/${key}?page=0`, { auth: 'auto' });
    if (j && j.limit > 0) { threadMeta = { key, limit: j.limit }; return j.limit; }
  } catch { /* 拿不到就不翻页 */ }
  return 0;
}
const floorNum = (a) => { const m = (a.getAttribute('href') || '').match(/#post-(\d+)$/); return m ? parseInt(m[1], 10) : null; };
/** 给页面上的帖子补 id="post-N"（N 取自头部的「#N」链接）；返回本页的楼号列表。 */
function tagFloors() {
  const nums = [];
  for (const post of document.querySelectorAll('.forumPost')) {
    const a = post.querySelector('.forumPost__header a[href*="#post-"]');
    const n = a ? floorNum(a) : null;
    if (n == null) continue;
    nums.push(n);
    if (post.id !== 'post-' + n) post.id = 'post-' + n;
  }
  return nums;
}
function waitFor(fn, ms) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    (function tick() {
      const v = fn();
      if (v) return resolve(v);
      if (Date.now() - t0 > ms) return resolve(null);
      setTimeout(tick, 100);
    })();
  });
}
function revealFloor(el) {
  el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  el.classList.remove('iwe-floor-hit'); void el.offsetWidth; // 重新触发动画
  el.classList.add('iwe-floor-hit');
  setTimeout(() => el.classList.remove('iwe-floor-hit'), 2000);
}
let floorHandled = null; // 已经按这个地址处理过的 #post-N，免得每次扫描都重来
/** 跳到第 floor 楼：在本页就直接滚，不在就先翻到所在页。返回是否成功。 */
async function jumpToFloor(floor) {
  const hash = '#post-' + floor;
  await waitFor(() => document.querySelector('.forumPost'), 8000);
  tagFloors();
  let el = document.getElementById('post-' + floor);
  for (let tries = 0; !el && tries < 3; tries++) {
    const limit = await threadLimit();
    if (!limit) return false;
    const cur = Math.max(0, parseInt(new URLSearchParams(location.search).get('page') || '0', 10) || 0);
    const nums = tagFloors();
    // 第一次按楼号 / limit 算；翻过页还不在，就按本页实际的楼号范围往前 / 后挪一页（楼号并不总是正好整除）
    let page = tries === 0 ? Math.floor(floor / limit) : (nums.length && floor < Math.min(...nums) ? cur - 1 : floor > Math.max(...nums) ? cur + 1 : cur);
    page = Math.max(0, page);
    if (page === cur && tries > 0) break;
    if (page !== cur) {
      const href = location.pathname + (page ? '?page=' + page : '') + hash;
      floorHandled = href;
      history.pushState({}, '', href);
      dispatchEvent(new PopStateEvent('popstate'));
      el = await waitFor(() => { tagFloors(); return document.getElementById('post-' + floor); }, 8000);
    } else break;
  }
  if (!el) return false;
  if (location.hash !== hash) history.replaceState(history.state, '', location.pathname + location.search + hash);
  revealFloor(el);
  return true;
}

site.register('forumFloors', {
  match: (p) => THREAD_PATH.test(p),
  css: `
.forumPost{scroll-margin-top:84px}
.forumPost.iwe-floor-hit{animation:iwe-floor-flash 1.9s ease-out}
@keyframes iwe-floor-flash{0%,18%{background-color:rgba(26,179,148,.30);box-shadow:0 0 0 3px rgba(26,179,148,.55)}100%{background-color:transparent;box-shadow:0 0 0 3px rgba(26,179,148,0)}}
@media (prefers-reduced-motion:reduce){.forumPost.iwe-floor-hit{animation:none;outline:2px solid var(--primary,#1ab394)}}
`,
  scan() {
    tagFloors();
    const m = location.hash.match(/^#post-(\d+)$/);
    if (m && floorHandled !== location.pathname + location.search + location.hash) {
      floorHandled = location.pathname + location.search + location.hash;
      jumpToFloor(parseInt(m[1], 10));
    }
  },
});
// 点站点头部的「#N」：站点的路由会把它当普通跳转处理（没有目标就什么也不发生）。这里在它之前接管
document.addEventListener('click', (e) => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const a = e.target.closest && e.target.closest('.forumPost__header a[href*="#post-"]');
  const n = a ? floorNum(a) : null;
  if (n == null) return;
  e.preventDefault(); e.stopPropagation();
  floorHandled = location.pathname + location.search + '#post-' + n;
  jumpToFloor(n);
}, true);

// ---- 小尾巴 ----
// 页面上只有渲染后的文字、认不出哪条 hr 是小尾巴记号：用 siteData.onApi 拿到的原文来认。
// 原文里最后一条分隔线若带「行尾至少两个空格」（`---  `），它之后就是小尾巴。
// 比对只用分隔线「之前」的正文开头：小尾巴里的链接在页面上会被渲染成带标题的卡片，文字对不上原文，不能拿来比。
const sigBodies = new Set(); // 带小尾巴记号的原文，其「分隔线之前」正文的指纹

const THEMATIC = /^ {0,3}(?:-{3,}|\*{3,}|_{3,})[ \t]*$/;

// 原文是 markdown，页面上是渲染后的文字：两边都去掉图片、链接地址、标点空白，只留字母数字比较开头一段
function fingerprint(text, isSource) {
  let s = String(text || '');
  if (isSource) s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  return s.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 40);
}

/** 原文里的小尾巴记号：返回「分隔线之前的正文」，没有则 null */
function bodyBeforeSignature(body) {
  const lines = body.split('\n');
  let last = -1;
  for (let i = 0; i < lines.length; i++) if (THEMATIC.test(lines[i])) last = i;
  if (last < 0 || !/[ \t]{2,}$/.test(lines[last].replace(/\r$/, ''))) return null;
  return lines.slice(0, last).join('\n');
}

// 监听 API 响应：评论、帖子列表
siteData.onApi((url, json) => {
  const items = (json && (json.results || json.comments)) || [];
  if (!Array.isArray(items)) return;
  let added = false;
  for (const item of items) {
    if (!item || typeof item.body !== 'string') continue;
    const pre = bodyBeforeSignature(item.body);
    const key = pre == null ? '' : fingerprint(pre, true);
    if (key) { sigBodies.add(key); added = true; }
  }
  // 站点多半已经把正文画出来了：通知扫描补一遍
  if (added) site.schedule();
});

// 站点渲染正文时，我们对响应副本的解析可能还没完成（原文还没收进来）：没对上不立刻放弃，限时内每次扫描再试
const sigFirstSeen = new WeakMap();
const SIG_RETRY_MS = 6000;

/** 返回 true 表示已有定论（改造完 / 确定没有小尾巴），false 表示原文可能还没到、稍后再试 */
function transformSignature(markdown) {
  const hrs = [...markdown.querySelectorAll('hr')].filter((hr) => !hr.closest('.iwe-sig'));
  if (!hrs.length) return true;
  const lastHr = hrs[hrs.length - 1];
  // 只处理正文这一层的 hr（嵌在引用、列表里的不是小尾巴）
  if (lastHr.parentElement !== markdown) return true;

  // 分隔线之前的页面文字（跳过我们自己插的译文块、引用条；被译文顶替藏起来的原文照算）
  let before = '';
  for (let n = markdown.firstChild; n && n !== lastHr; n = n.nextSibling) {
    if (n.nodeType === 1 && n.matches('[data-iwe-tr-out], .iwe-quote')) continue;
    before += n.textContent || '';
  }
  if (!sigBodies.has(fingerprint(before, false))) {
    if (!sigFirstSeen.has(markdown)) sigFirstSeen.set(markdown, Date.now());
    return Date.now() - sigFirstSeen.get(markdown) > SIG_RETRY_MS;
  }

  const afterNodes = [];
  for (let n = lastHr.nextSibling; n; n = n.nextSibling) afterNodes.push(n);
  if (!afterNodes.length) return true;

  const container = h('div.iwe-sig');
  afterNodes.forEach((n) => container.append(n));
  lastHr.replaceWith(container);
  return true;
}

// ---- 扫描 ----
// 表情每轮扫描都过一遍：站点重渲染评论时会补进新的 img 节点，只在第一次扫描时处理会漏掉
function scanEmoji(markdown) {
  markdown.querySelectorAll('img').forEach(img => {
    // 标记记的是图片地址：同一个 img 节点被换成另一张图时，地址变了就重新判断
    if (img.dataset.iweEmoji !== img.src) {
      if (img.classList.contains('iwe-emo')) img.classList.remove('iwe-emo', ...Object.values(EMOJI_SIZE_MAP));
      delete img.dataset.iweAlt;
      transformEmoji(img);
      img.dataset.iweEmoji = img.src;
    }
  });
}

async function scanMarkdown(markdown) {
  // 1. 表情
  scanEmoji(markdown);

  // 2. 小尾巴（要在引用改写之前做：引用条会改掉正文开头的文字，原文对不上）
  if (!markdown.dataset.iweSig && transformSignature(markdown)) markdown.dataset.iweSig = '1';

  // 3. 引用（blockquote）
  const quotes = [...markdown.querySelectorAll('blockquote')];
  for (const q of quotes) {
    if (!q.dataset.iweQuote) {
      const quote = parseQuoteFromBlockquote(q);
      if (quote) {
        q.dataset.iweQuote = '1';
        await transformQuote(q, quote);
      }
    }
  }

  // 3b. 引用（同一段落里的写法）
  for (const p of markdown.querySelectorAll('p:not([data-iwe-quote])')) {
    const hit = parseQuoteFromParagraph(p);
    if (!hit) continue;
    p.dataset.iweQuote = '1';
    // 先同步改掉段落内容（防止异步等待期间被重复处理），再把引用条插到段落前
    hit.nodes.forEach((n) => n.remove());
    hit.tail.nodeValue = hit.tail.nodeValue.replace(/^\s*\n---[ \t]*/, '');
    const bar = await buildQuote(hit.quote);
    if (p.isConnected) p.before(bar);
    if (!p.textContent.trim() && !p.querySelector('img,a')) p.remove();
  }

  // 4. 引用（setext 标题写法）
  const h2s = [...markdown.querySelectorAll(QUOTE_HEAD_SEL)];
  for (const h2 of h2s) {
    if (!h2.dataset.iweQuote) {
      const quote = parseQuoteFromH2(h2);
      if (quote) {
        h2.dataset.iweQuote = '1';
        await transformQuote(h2, quote);
      }
    }
  }
}

site.register('markup', {
  css: `
/* 表情 */
.iwe-emo{display:inline-block;vertical-align:-.25em;border-radius:4px;object-fit:contain}
.iwe-emo.icon{width:16px;height:16px;margin:0 2px 0 0}
.iwe-emo.small{width:24px;height:24px;margin:1px}
.iwe-emo.mid{width:40px;height:40px;margin:2px}
.iwe-emo.large{width:56px;height:56px;margin:3px 4px}
.iwe-emo.xl{width:72px;height:72px;margin:4px 6px}

/* 引用条 */
.iwe-quote{display:flex;align-items:center;gap:8px;padding:6px 10px;margin:8px 0;border-left:3px solid var(--line2);background:color-mix(in srgb,var(--line2) 10%,transparent);border-radius:4px;font-size:13px}
.iwe-quote-av{width:24px;height:24px;border-radius:50%;background:var(--sunk) center/cover;flex:none}
.iwe-quote-name{font-weight:500;color:var(--fg)}
.iwe-quote-user{color:var(--fg3);font-size:12px}
.iwe-quote-floor{margin-left:auto;color:var(--fg3);font-size:12px}
.iwe-quote-link{color:inherit;text-decoration:none;cursor:pointer}
.iwe-quote-link:hover .iwe-quote-floor{color:var(--blue)}

/* 小尾巴 */
.iwe-sig{margin-top:12px;padding-left:9px;border-left:2px solid var(--line2);font-size:11px;color:var(--fg3);line-height:1.6}
.iwe-sig hr{border-color:var(--line2);opacity:0.45}
.iwe-sig a{color:var(--fg3)}
.iwe-sig a:hover{color:var(--blue)}
.iwe-sig p{margin:0.3em 0}
`,
  scan() {
    const markdowns = [...document.querySelectorAll('.markdown')];
    markdowns.forEach(md => {
      // 小尾巴原文可能晚到：已扫过但还没定论的，在时限内补试
      if (md.dataset.iweMarkup) scanEmoji(md);
      if (md.dataset.iweMarkup && !md.dataset.iweSig) { if (transformSignature(md)) md.dataset.iweSig = '1'; return; }
      if (!md.dataset.iweMarkup) {
        md.dataset.iweMarkup = '1';
        scanMarkdown(md).catch(e => console.error('[iwe:markup]', e));
      }
    });
  },
});

})();
