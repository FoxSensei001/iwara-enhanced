// README screenshots: the real iwara.tv rendered twice — as the site ships it and with Iwara Enhanced —
// on the same made-up data (see lib.mjs), then laid out as a designed comparison card. English UI only.
//
//   1. Start a separate Chrome (Cloudflare blocks headless browsers; this profile is never signed in):
//        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --user-data-dir=/tmp/iwe-shots \
//          --remote-debugging-port=9333 --no-first-run https://www.iwara.tv/
//   2. node build.mjs                       (the screenshots inject dist/iwara-enhanced.user.js)
//   3. PW=$(npm root -g)/playwright node docs/screenshots/capture.mjs [scene ...]   → docs/images/<scene>.png
//      COMPOSE_ONLY=1 re-lays out the last raw shots without touching the site.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, preparePage, ensureDir, sleep, fakeLine, resetPersonas } from './lib.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright');
const CDP = process.env.CDP || 'http://localhost:9333';
const OUT = ensureDir(path.join(ROOT, 'docs', 'images'));
const RAW = ensureDir(path.join(ROOT, 'docs', 'screenshots', '.raw'));
const USERSCRIPT = path.join(ROOT, 'dist', 'iwara-enhanced.user.js');
const W = 1440, H = 900, DPR = 2;
const LANG = 'en';

const VIDEO = '3gPLZhMFdmIUnQ';
const THREAD = 'feedback/c7ae3e2a-bd1d-4aa5-8d65-f3b9f12e09c9';
const PROFILE = 'linuxdx';

// forum thread: give the made-up posts the structures the script renders (quote header, signature)
function forumMutate(p, json) {
  if (!p.startsWith('/forum/' + THREAD) || !Array.isArray(json.results)) return json;
  const posts = json.results;
  const at = (i) => posts[i] && posts[i].user;
  if (posts[1] && at(0)) posts[1].body = `Reply #0: @${at(0).username}\n---\n${fakeLine('q1', LANG)} ${fakeLine('q2', LANG)}`;
  if (posts[2]) posts[2].body = `${fakeLine('q3', LANG)}\n\n---  \nSent from my phone`;
  if (posts[3] && at(1)) posts[3].body = `Reply #1: @${at(1).username}\n---\n${fakeLine('q4', LANG)}`;
  return json;
}
const tourDone = { fn: () => { try { localStorage.setItem('iwe:tourDone', '"0.1.0"'); } catch {} } };

/**
 * Scenes.
 *   layout  'split'  one viewport, original | enhanced cut diagonally (same page, same data)
 *           'duo'    two crops, the enhanced one overlapping the original
 *           'single' enhanced only (UI that has no counterpart on the site)
 *   title / sub / url: text on the card;  notes: [selector, label] marked on the enhanced render
 *   cut: where the diagonal crosses the top / bottom edge (fraction of the width)
 */
const SCENES = {
  list: {
    url: '/videos', layout: 'split', cut: [0.47, 0.36],
    title: 'Lists you can actually steer', sub: 'Sort, rating, paging and tag filters live beside the grid; every card gets a quick preview.',
    notes: [['.iwe-hs', 'Search any section'], ['.iwe-filter-sticky', 'Rating, paging & tag filters'], ['.iwe-pv-more >> nth=3', 'Quick preview']],
  },
  home: {
    url: '/', layout: 'duo', clip: { x: 74, y: 64, width: W - 74, height: H - 64 },
    title: 'A home page that gets to the point', sub: 'Site news folds into one line; each section switches New / Hot / Top and pages in place.',
    notes: [['.iwe-news-on', 'Compact site news'], ['.iwe-home-h >> nth=1', 'Sort without leaving'], ['.iwe-home-foot', 'Page each section']],
  },
  profile: {
    url: '/profile/' + PROFILE, layout: 'duo', clip: { x: 74, y: 64, width: W - 74, height: H - 64 },
    title: 'Creator pages, organised', sub: 'About text in a card, sortable latest uploads with paging, and a sidebar that follows you.',
    notes: [['.iwe-pf-about', 'About, in a card'], ['.iwe-pf-sec .iwe-home-h', 'Sort & page uploads'], ['.iwe-pf-side', 'Sticky sidebar']],
  },
  subs: {
    url: '/subscriptions/videos', layout: 'split', login: true, cut: [0.6, 0.48],
    title: 'Filter what you follow', sub: 'Sort, rating, month and tags — scoped to the creators you subscribe to, without reloading.',
    notes: [['.iwe-sf-col', 'Subscription filters']],
  },
  forum: {
    url: '/forum/' + THREAD, layout: 'duo', mutate: forumMutate, wait: 11000,
    clip: { around: { before: 'text=/^Reply #0/', after: '.iwe-quote' }, x: 160, width: 1200, above: 96, below: 400 },
    title: 'Threads that read like conversations', sub: 'Quotes show who and which post, with a jump link; signatures shrink to a quiet footnote.',
    notes: [['.iwe-quote', 'Quote with jump-to-post'], ['.iwe-sig', 'Signature as a footnote']],
  },
  studio: {
    url: '/create/video', layout: 'split', login: true, wait: 9000, init: tourDone, cut: [0.36, 0.3],
    title: 'A creator studio in four steps', sub: 'Upload → Content → Tags → Publish. Fill the form while the file uploads; drafts survive a refresh.',
    notes: [],
  },
  search: {
    url: '/videos', layout: 'single', clip: { x: 300, y: 0, width: 860, height: 700 },
    title: 'Search that knows what you want', sub: 'Pick a section, then add tags (all / any / exclude), authors, dates and length — the query previews live.',
    prep: async (p) => {
      await p.locator('.iwe-hs input:visible').first().click();
      await p.keyboard.type('dance');
      await p.click('.iwe-hs-filter');
      await sleep(1200);
    },
  },
  cardpreview: {
    url: '/videos', layout: 'single', clip: { x: 150, y: 250, width: 1140, height: 540 },
    title: 'Peek before you click', sub: 'The ⋯ on any card opens a preview: big cover, stats, tags in your language, like and copy link.',
    prep: async (p) => { await p.locator('.iwe-pv-more').nth(1).click(); await sleep(2500); },
  },
  comment: {
    url: '/video/' + VIDEO, layout: 'duo', login: true,
    title: 'Write comments, not Markdown', sub: 'A live editor with a character budget, and the rules line folds into a remembered “I agree” switch.',
    prep: async (p, mode) => {
      await p.evaluate(() => document.querySelector('.markdownField').scrollIntoView({ block: 'center' }));
      await sleep(800);
      if (mode === 'after') await p.locator('.iwe-mdf-host .ProseMirror, .ProseMirror').first().click().catch((e) => console.warn('  editor', e.message));
      else await p.locator('.markdownField textarea').first().click();
      await p.keyboard.type(mode === 'after' ? 'Love the ' : 'Love the **lighting** in this one!');
      if (mode === 'after') { await p.keyboard.press('Meta+b'); await p.keyboard.type('lighting'); await p.keyboard.press('Meta+b'); await p.keyboard.type(' in this one!'); }
      await sleep(800);
      await p.evaluate(() => document.querySelector('.markdownField').scrollIntoView({ block: 'center' }));
      await sleep(500);
    },
    clip: 'form-of-field',
  },
  pager: {
    url: '/videos', layout: 'duo',
    title: 'Jump to any page', sub: 'A real pager under every list — or switch to infinite scroll, and it’s remembered.',
    clip: { around: { before: '.pagination', after: '.iwe-pager' }, x: 150, width: 920, above: 250, below: 70 },
  },
};

async function shoot(ctx, name, sc, mode, cache) {
  const p = await ctx.newPage();
  const cdp = await preparePage(p, { lang: LANG, enhanced: mode === 'after', userscript: USERSCRIPT, cache, login: !!sc.login, mutate: sc.mutate, init: sc.init });
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: false });
  p.on('pageerror', (e) => { if (!/Failed to fetch/.test(e.message)) console.warn(`  [${name}/${mode}] pageerror: ${e.message.slice(0, 160)}`); });
  await p.bringToFront();
  let file, clip;
  const notes = [];
  try {
    await p.goto('https://www.iwara.tv' + sc.url, { waitUntil: 'domcontentloaded' });
    await sleep(sc.wait || 6500);
    if (sc.prep) await sc.prep(p, mode);
    clip = sc.clip || { x: 0, y: 0, width: W, height: H };
    if (clip.around) {
      const sel = typeof clip.around === 'string' ? clip.around : clip.around[mode];
      const loc = p.locator(sel).first();
      await loc.evaluate((el) => el.scrollIntoView({ block: 'center' }), null, { timeout: 10000 });
      await sleep(1200);
      const r = await loc.boundingBox();
      clip = { x: clip.x, width: clip.width, y: Math.max(0, r.y - clip.above), height: clip.above + r.height + clip.below };
    }
    if (clip === 'form-of-field') {
      clip = await p.evaluate(() => {
        const f = document.querySelector('.markdownField');
        const box = (f.closest('form') || f.parentElement).getBoundingClientRect();
        return { x: Math.max(0, box.x - 24), y: Math.max(0, box.y - 56), width: Math.min(innerWidth, box.width + 48), height: Math.min(innerHeight, box.height + 80) };
      });
    }
    if (mode === 'after') {
      for (const [sel, label] of sc.notes || []) {
        const box = await p.locator(sel).first().boundingBox({ timeout: 1500 }).catch(() => null);
        if (!box) { console.warn(`  [${name}] note not found: ${sel}`); continue; }
        const x = Math.max(box.x, clip.x), y = Math.max(box.y, clip.y);
        const r = { x: x - clip.x, y: y - clip.y, w: Math.min(box.x + box.width, clip.x + clip.width) - x, h: Math.min(box.y + box.height, clip.y + clip.height) - y };
        if (r.w > 4 && r.h > 4) notes.push({ ...r, label });
      }
    }
    file = path.join(RAW, `${name}.${mode}.png`);
    await p.screenshot({ path: file, clip });
  } finally { await p.close().catch(() => {}); }
  const shot = { file, w: clip.width, h: clip.height, notes };
  fs.writeFileSync(file.replace(/\.png$/, '.json'), JSON.stringify(shot));
  return shot;
}

// ---------- layout ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const dataUrl = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const CARD_W = 1600;

const CSS = `
*{margin:0;box-sizing:border-box}
body{width:${CARD_W}px;font-family:-apple-system,"SF Pro Display","SF Pro Text","Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased;color:#e8eef0;
  background:#0c1416;}
.card{position:relative;overflow:hidden;padding:64px 72px 72px;
  background:radial-gradient(1200px 520px at 85% -10%,rgba(26,188,156,.28),transparent 60%),radial-gradient(900px 600px at -10% 110%,rgba(91,110,255,.20),transparent 60%),linear-gradient(160deg,#0f1b1e,#0b1113 60%,#0d1418);}
.card:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:40px 40px;mask-image:linear-gradient(180deg,#000,transparent 55%);pointer-events:none}
.head{position:relative;display:flex;gap:48px;align-items:flex-end;margin-bottom:40px}
.head .txt{flex:1;min-width:0}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font:600 15px/1 ui-monospace,"SF Mono",Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:#4fe0c2;margin-bottom:18px}
.eyebrow:before{content:"";width:22px;height:2px;background:#4fe0c2;border-radius:2px}
h1{font-size:50px;line-height:1.08;font-weight:750;letter-spacing:-.02em;color:#fff}
.sub{margin-top:16px;font-size:21px;line-height:1.5;color:#9fb1b6;max-width:880px}
.legend{list-style:none;display:flex;flex-direction:column;gap:12px;padding:0;min-width:300px}
.legend li{display:flex;align-items:center;gap:12px;font-size:17px;font-weight:550;color:#d7e3e6}
.num{flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#1abc9c;color:#04201a;font:800 15px/1 -apple-system,system-ui;box-shadow:0 0 0 4px rgba(26,188,156,.22)}
.win{position:relative;border-radius:16px;overflow:hidden;background:#1b2326;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 30px 80px rgba(0,0,0,.55),0 8px 24px rgba(0,0,0,.35)}
.bar{height:44px;display:flex;align-items:center;gap:8px;padding:0 16px;background:#20292c;border-bottom:1px solid rgba(255,255,255,.06)}
.bar i{width:12px;height:12px;border-radius:50%;background:#ff5f57}.bar i:nth-child(2){background:#febc2e}.bar i:nth-child(3){background:#28c840}
.url{margin-left:18px;flex:1;max-width:520px;height:28px;border-radius:8px;background:#141b1d;color:#8da0a5;font:500 14px/28px -apple-system,system-ui;padding:0 14px;display:flex;gap:8px;align-items:center}
.url b{color:#d5e1e4;font-weight:500}
.stage{position:relative}
.stage img{display:block;width:100%}
.layer{position:absolute;inset:0}
.chip{position:absolute;bottom:20px;z-index:5;padding:8px 14px;border-radius:999px;font:700 13px/1 -apple-system,system-ui;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(8px)}
.chip.o{left:18px;background:rgba(20,26,28,.78);color:#cfd8db;box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.chip.e{right:18px;background:#1abc9c;color:#04201a;box-shadow:0 6px 18px rgba(26,188,156,.45)}
.ring{position:absolute;border-radius:12px;box-shadow:0 0 0 3px #1abc9c,0 0 0 9px rgba(26,188,156,.22),0 0 40px rgba(26,188,156,.35);z-index:4}
.ring .num{position:absolute;left:-14px;top:-14px}
.cap{position:absolute;bottom:18px;z-index:5;padding:7px 12px;border-radius:8px;font:600 13px/1 -apple-system,system-ui;background:rgba(12,18,20,.82);color:#cfe0e3;box-shadow:0 0 0 1px rgba(255,255,255,.1)}
.duo{position:relative}
.duo .back{width:74%;filter:saturate(.5) brightness(.8)}
.duo .front{position:relative;z-index:2;width:74%;margin-left:auto;margin-top:-56px}
.pill{margin-left:auto;padding:7px 13px;border-radius:999px;font:700 12px/1 -apple-system,system-ui;letter-spacing:.12em;text-transform:uppercase}
.pill.o{background:#2c3639;color:#c3ced1}.pill.e{background:#1abc9c;color:#04201a;box-shadow:0 4px 14px rgba(26,188,156,.4)}
.tag{display:inline-flex;align-items:center;gap:8px;margin:0 0 12px;font:700 13px/1 -apple-system,system-ui;letter-spacing:.14em;text-transform:uppercase}
.tag.o{color:#8a9ca1}.tag.e{color:#4fe0c2}
.arrow{position:absolute;left:calc(26% - 96px);top:calc(50% - 32px);z-index:6;width:64px;height:64px;border-radius:50%;background:#1abc9c;display:grid;place-items:center;box-shadow:0 10px 30px rgba(26,188,156,.5),0 0 0 8px rgba(26,188,156,.16)}
`;

function frame(url, inner, badge = '') {
  return `<div class="win"><div class="bar"><i></i><i></i><i></i><div class="url">🔒 <span>www.<b>iwara.tv</b>${esc(url === '/' ? '' : url.replace(/\/[0-9a-f-]{20,}$/, '/…'))}</span></div>${badge}</div><div class="stage">${inner}</div></div>`;
}
function rings(shot, scale, offset = 0) {
  return shot.notes.map((n, i) => `<div class="ring" style="left:${n.x * scale}px;top:${n.y * scale + offset}px;width:${n.w * scale}px;height:${n.h * scale}px"><span class="num">${i + 1}</span></div>`).join('');
}
function legend(shot) {
  if (!shot || !shot.notes.length) return '';
  return `<ul class="legend">${shot.notes.map((n, i) => `<li><span class="num">${i + 1}</span>${esc(n.label)}</li>`).join('')}</ul>`;
}

function sceneHtml(name, sc, shots) {
  const inner = CARD_W - 144;
  const A = shots.after, B = shots.before;
  let body = '';
  if (sc.layout === 'split') {
    const s = inner / A.w, h = A.h * s;
    const [t, b] = sc.cut || [0.5, 0.4];
    const poly = `polygon(0 0,${t * 100}% 0,${b * 100}% 100%,0 100%)`;
    body = frame(sc.url, `<img src="${dataUrl(A.file)}">
      <div class="layer" style="clip-path:${poly}"><img src="${dataUrl(B.file)}"></div>
      <svg class="layer" viewBox="0 0 ${inner} ${h}" style="z-index:3"><line x1="${t * inner}" y1="0" x2="${b * inner}" y2="${h}" stroke="#fff" stroke-width="3"/><g transform="translate(${((t + b) / 2) * inner},${h / 2})"><circle r="26" fill="#fff"/><path d="M-6-8l-8 8 8 8M6-8l8 8-8 8" fill="none" stroke="#0c1416" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
      ${rings(A, s)}<span class="chip o">Original</span><span class="chip e">Iwara Enhanced</span>`);
  } else if (sc.layout === 'single') {
    const s = inner / A.w;
    body = frame(sc.url, `<img src="${dataUrl(A.file)}">${rings(A, s)}<span class="chip e">Iwara Enhanced</span>`);
  } else {
    body = `<div class="duo"><div class="back">${frame(sc.url, `<img src="${dataUrl(B.file)}">`, '<span class="pill o">Original</span>')}</div>
      <div class="arrow"><svg width="28" height="28" viewBox="0 0 24 24"><path d="M12 5v13M6 13l6 6 6-6" fill="none" stroke="#04201a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="front">${frame(sc.url, `<img src="${dataUrl(A.file)}">${rings(A, (inner * 0.74) / A.w)}`, '<span class="pill e">Iwara Enhanced</span>')}</div></div>`;
  }
  return `<!doctype html><meta charset="utf-8"><style>${CSS}</style><body><div class="card">
    <div class="head"><div class="txt"><div class="eyebrow">Iwara Enhanced</div><h1>${esc(sc.title)}</h1><p class="sub">${esc(sc.sub)}</p></div>${legend(A)}</div>
    ${body}</div></body>`;
}

async function compose(ctx, name, sc, shots) {
  const p = await ctx.newPage();
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: CARD_W, height: 1000, deviceScaleFactor: 1.5, mobile: false });
  await p.setContent(sceneHtml(name, sc, shots));
  await p.evaluate(() => document.fonts.ready);
  const box = await p.evaluate(() => { const r = document.querySelector('.card').getBoundingClientRect(); return { x: 0, y: 0, width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
  const out = path.join(OUT, `${name}.png`);
  await p.screenshot({ path: out, clip: box, fullPage: true });
  await p.close();
  return out;
}

const browser = await chromium.connectOverCDP(CDP);
const ctx = browser.contexts()[0];
const only = process.argv.slice(2);
for (const [name, sc] of Object.entries(SCENES)) {
  if (only.length && !only.includes(name)) continue;
  const cache = new Map(); // both renders of a scene see identical data
  resetPersonas();
  const shots = {};
  try {
    for (const mode of sc.layout === 'single' ? ['after'] : ['before', 'after']) {
      const prev = path.join(RAW, `${name}.${mode}.json`);
      shots[mode] = process.env.COMPOSE_ONLY && fs.existsSync(prev) ? JSON.parse(fs.readFileSync(prev, 'utf8')) : await shoot(ctx, name, sc, mode, cache);
    }
    console.log(path.relative(ROOT, await compose(ctx, name, sc, shots)));
  } catch (e) {
    console.error(`${name}: ${e.message}`);
  }
}
process.exit(0);
