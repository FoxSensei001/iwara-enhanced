// Shared helpers for the README screenshots: a page on the real iwara.tv whose API responses are
// rewritten into made-up data (titles, names, bodies, tags) and whose images are swapped for
// generated placeholders. Nothing is ever sent to the site except the original read-only requests.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, '..', '..');

// ---------- deterministic picks ----------
export function hash(s) {
  let h = 2166136261;
  for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const pick = (arr, key, salt = '') => arr[hash(salt + key) % arr.length];

// ---------- personas ----------
const HANDLES = [
  'Mochi Studio', 'PixelFox', 'Lumen Works', 'Kiri', 'Orbit Seven', 'Hanabi Lab', 'Nekomata', 'Blue Lantern',
  'Sakura Drift', 'Tofu Motion', 'Aster', 'Night Owl 3D', 'Cobalt', 'Yuzu', 'Paper Crane', 'Moonlit Tea',
  'Ember', 'Kumo', 'Velvet Frame', 'Ripple', 'Tanuki Cut', 'Iris', 'Sora Atelier', 'Maple Byte',
  'Hoshi', 'Quartz', 'Lotus Render', 'Taiga', 'Neon Koi', 'Fern', 'Polaris', 'Umi Works',
  'Rin', 'Glacier', 'Komorebi', 'Saffron', 'Echo Park', 'Mint Leaf', 'Jade Rabbit', 'Cinder',
  'Akari', 'Bramble', 'Calico', 'Dango', 'Eclipse Lab', 'Fuyu', 'Gekko', 'Haze', 'Ink & Ivy', 'Juniper',
  'Kaede', 'Lilac Loop', 'Mirai', 'Nori', 'Opal', 'Peach Fizz', 'Raven Rig', 'Shiro', 'Tsubaki', 'Violet Hour',
  'Wisteria', 'Yoru', 'Zephyr', 'Amber Arc', 'Biscuit', 'Clover', 'Dusk Motion', 'Hikari', 'Momo', 'Sable',
];
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const realByFake = new Map(); // fake username -> real username (so links/requests still resolve)
const fakeByReal = new Map();
export function persona(user) {
  const real = user.username;
  if (fakeByReal.has(real)) return fakeByReal.get(real);
  let i = hash('u' + (user.id || real)) % HANDLES.length, k = 0;
  while (realByFake.has(slugify(HANDLES[i])) && k++ < HANDLES.length) i = (i + 1) % HANDLES.length;
  const base = k >= HANDLES.length ? HANDLES[i] + ' ' + realByFake.size : HANDLES[i];
  const username = slugify(base);
  const p = { name: base, username };
  realByFake.set(username, real);
  fakeByReal.set(real, p);
  return p;
}
export const realUsername = (u) => realByFake.get(u) || u;
export function resetPersonas() { realByFake.clear(); fakeByReal.clear(); titleIdx.clear(); usedTitle.clear(); }

// ---------- titles & text ----------
const TITLES = [
  ['Sunset Dance Practice', '夕阳下的舞蹈练习', '夕焼けのダンス練習'],
  ['Rainy Night Walk', '雨夜散步', '雨の夜の散歩'],
  ['Summer Festival Loop', '夏日祭循环', '夏祭りループ'],
  ['Idol Stage Rehearsal', '偶像舞台彩排', 'アイドルステージのリハーサル'],
  ['Cat Ears Cover', '猫耳翻跳', '猫耳カバー'],
  ['Morning Stretch Routine', '晨间伸展', '朝のストレッチ'],
  ['Beach Day Short', '海边的一天', '海辺の一日'],
  ['Neon City Chase', '霓虹城市追逐', 'ネオンシティ・チェイス'],
  ['Winter Snow Duet', '冬日雪中双人舞', '冬の雪デュエット'],
  ['Kimono Spin', '和服转圈', '着物スピン'],
  ['Hoodie Groove Test', '卫衣律动测试', 'パーカーでグルーヴ'],
  ['Halloween Party Mix', '万圣节派对混剪', 'ハロウィンパーティーMIX'],
  ['Christmas Lights', '圣诞灯光', 'クリスマスライト'],
  ['Twin Tails Jump', '双马尾跳跃', 'ツインテールジャンプ'],
  ['Maid Café Opening', '女仆咖啡开场', 'メイドカフェのオープニング'],
  ['Studio Lighting Study', '棚拍布光研究', 'スタジオライティング研究'],
  ['Camera Path Showcase', '运镜展示', 'カメラワーク・ショーケース'],
  ['Choreography Breakdown', '编舞分解', '振り付け解説'],
  ['Vocal Cover Live', '翻唱现场', '歌ってみたライブ'],
  ['Glasses Day', '眼镜日', 'メガネの日'],
  ['Ponytail Swing', '马尾甩动', 'ポニーテールスイング'],
  ['Gym Warm-up', '健身房热身', 'ジムのウォームアップ'],
  ['School Festival Stage', '校园祭舞台', '学園祭ステージ'],
  ['Night Sky Timelapse', '夜空延时', '夜空タイムラプス'],
  ['Short Hair Remix', '短发混剪', 'ショートヘアRemix'],
  ['Witch Hat Waltz', '魔女帽华尔兹', '魔女帽子のワルツ'],
  ['Collab Compilation Vol.2', '合作合集 第二弹', 'コラボまとめ Vol.2'],
  ['Long Take One-shot', '一镜到底', 'ワンカット長回し'],
  ['Rooftop Session', '天台小场', '屋上セッション'],
  ['Spring Breeze', '春风', '春風'],
];
const LINES = [
  ['Thanks for watching! Feedback is always welcome.', '感谢观看，欢迎留言反馈。', 'ご視聴ありがとうございます。感想お待ちしています。'],
  ['Motion and camera by me, model credits in the description.', '动作和运镜是我做的，模型来源写在简介里。', 'モーションとカメラは自作、モデルのクレジットは説明欄にあります。'],
  ['The lighting looks great this time.', '这次的打光好看。', '今回のライティングすごく良いですね。'],
  ['Could you share the camera settings?', '能分享一下镜头参数吗？', 'カメラの設定を教えてもらえますか？'],
  ['Part two is coming next week.', '第二部分下周发。', '後編は来週公開予定です。'],
  ['Loved the transition at 0:42.', '0:42 的转场太喜欢了。', '0:42 の切り替えが最高でした。'],
  ['Rendered in 4K, uploaded in 1080p.', '4K 渲染，1080p 上传。', '4K でレンダリング、1080p でアップしました。'],
  ['This is my first upload here, be gentle :)', '第一次在这里发视频，请多关照 :)', 'ここでの初投稿です。よろしくお願いします :)'],
];
export const L = { en: 0, zh: 1, ja: 2 };
const titleIdx = new Map(); const usedTitle = new Set();
export function fakeTitle(key, lang) {
  if (!titleIdx.has(key)) {
    let i = hash('t' + key) % TITLES.length;
    for (let k = 0; usedTitle.has(i) && k < TITLES.length; k++) i = (i + 1) % TITLES.length;
    if (usedTitle.size >= TITLES.length - 1) usedTitle.clear();
    usedTitle.add(i); titleIdx.set(key, i);
  }
  return TITLES[titleIdx.get(key)][L[lang]];
}
export const fakeLine = (key, lang, salt = '') => pick(LINES, key, 'l' + salt)[L[lang]];

// tags that exist in the dictionary and are safe to show
const SAFE_TAGS = ['dance', 'genshin_impact', 'hatsune_miku', 'vocaloid', 'original_character', 'cosplay', 'kpop', 'blender',
  'koikatsu', 'honkai_star_rail', 'blue_archive', 'school_uniform', 'kimono', 'maid', 'ponytail', 'twintails', 'idol',
  'cat_ears', 'short_hair', 'long_hair', 'beach', 'night', 'singing', 'vtuber', 'glasses', 'hoodie', 'dress', 'winter',
  'christmas', 'halloween', 'summer', 'gym', 'cute', 'witch', 'collab', 'tutorial'];
function fakeTags(tags, key) {
  const out = [], seen = new Set();
  tags.forEach((t, i) => {
    if (t.type === 'category') { out.push(t); return; }
    if (i > 9) return; // keep lists short
    let id = SAFE_TAGS[hash(key + ':' + i) % SAFE_TAGS.length];
    for (let k = 0; seen.has(id) && k < SAFE_TAGS.length; k++) id = SAFE_TAGS[(SAFE_TAGS.indexOf(id) + 1) % SAFE_TAGS.length];
    seen.add(id);
    out.push({ ...t, id, sensitive: false });
  });
  return out;
}

const isUser = (o) => o && typeof o.username === 'string' && 'name' in o;
const looksLikeContentId = (id) => typeof id === 'string' && id.length >= 10 && !/^[a-z_]+$/.test(id);

/** Rewrite one API JSON payload in place. `custom(obj)` can override per scene. */
export function anonymize(json, lang, url) {
  const p = new URL(url).pathname;
  if (/^\/(config|page\/|forum$|user\/token)/.test(p)) return json;
  const walk = (o, parentKey) => {
    if (Array.isArray(o)) { o.forEach((x) => walk(x, parentKey)); return; }
    if (!o || typeof o !== 'object') return;
    if (isUser(o)) {
      const f = persona(o);
      o.name = f.name; o.username = f.username;
      delete o.email;
      if (!o.avatar && o.id) o.avatar = { id: 'fake-' + o.id, type: 'image', path: '2026/01/01', name: 'fake-' + o.id + '.jpg', mime: 'image/jpeg', width: 400, height: 400 };
    }
    const key = o.id || '';
    if (typeof o.title === 'string' && looksLikeContentId(key)) o.title = fakeTitle(key, lang);
    if (typeof o.slug === 'string' && looksLikeContentId(key)) o.slug = slugify(fakeTitle(key, 'en'));
    if (typeof o.body === 'string' && o.body) o.body = fakeLine(key || o.body, lang) + (o.body.length > 140 ? '\n\n' + fakeLine(key + 'b', lang, 'x') : '');
    if (typeof o.description === 'string' && o.description) o.description = fakeLine(key, lang);
    if (Array.isArray(o.tags)) o.tags = fakeTags(o.tags, key);
    if ((o.rating === 'ecchi' || o.rating === 'general') && looksLikeContentId(key)) o.rating = hash('r' + key) % 10 < 3 ? 'ecchi' : 'general';
    for (const [k, v] of Object.entries(o)) if (v && typeof v === 'object' && k !== 'tags') walk(v, k);
  };
  walk(json);
  // profile endpoints keep the user object one level down
  return json;
}

// ---------- placeholder images ----------
const HUES = [210, 340, 150, 30, 270, 190, 10, 90, 250, 120];
export function placeholderSvg(url) {
  const h = hash(url), a = HUES[h % HUES.length], b = (a + 40 + (h >> 4) % 60) % 360;
  const avatar = /avatar/i.test(url);
  if (avatar) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${a} 55% 62%)"/><stop offset="1" stop-color="hsl(${b} 60% 40%)"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><circle cx="50" cy="40" r="18" fill="#fff" fill-opacity=".85"/><path d="M18 100c4-22 18-32 32-32s28 10 32 32z" fill="#fff" fill-opacity=".85"/></svg>`;
  }
  const cx = 30 + (h >> 3) % 100, cy = 20 + (h >> 7) % 30, r = 10 + (h >> 11) % 14, px = 50 + (h >> 13) % 60;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90" width="640" height="360" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${a} 50% 45%)"/><stop offset="1" stop-color="hsl(${b} 55% 22%)"/></linearGradient></defs><rect width="160" height="90" fill="url(#g)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" fill-opacity=".35"/><path d="M0 90 L${px - 30} 52 L${px} 70 L${px + 35} 40 L160 78 L160 90Z" fill="#000" fill-opacity=".28"/></svg>`;
}

// hide things that only get in the way of a screenshot (identical in both "before" and "after")
const SHOT_CSS = `
div:has(> .adultWarning){display:none!important}
.vjs-error-display,.vjs-loading-spinner{display:none!important}
.video-js.vjs-error .vjs-poster{display:block!important}
.video-js{aspect-ratio:16/9;height:auto!important}
.video-js.vjs-error .vjs-big-play-button{display:block!important}
html,body{scrollbar-width:none}
`;

// ---------- fake session (never sent to the site) ----------
const b64u = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
export const ME = { id: '00000000-0000-4000-8000-00000000demo', username: 'demo_creator', name: 'Demo Creator' };
function fakeJwt(type) { return b64u({ alg: 'HS256', typ: 'JWT' }) + '.' + b64u({ id: ME.id, type, role: 'user', premium: true, iss: 'iwara', iat: 1764000000, exp: 4102444800 }) + '.c2lnbmF0dXJl'; }
export function fakeMe() {
  const user = { id: ME.id, name: ME.name, username: ME.username, status: 'active', role: 'user', followedBy: false, following: false, friend: false,
    premium: true, creatorProgram: false, locale: null, seenAt: new Date().toISOString(),
    avatar: { id: 'demo-avatar', type: 'image', path: '2026/01/01', name: 'demo-avatar.png', mime: 'image/png' },
    wura: 1280, balance: 1280, createdAt: '2021-05-01T00:00:00.000Z', updatedAt: '2026-11-01T00:00:00.000Z', email: 'demo@example.com', emailVerified: true };
  realByFake.set(ME.username, ME.username); fakeByReal.set(ME.username, { name: ME.name, username: ME.username });
  return { user, wura: 1280, balance: 1280, profile: { body: '' }, tagBlacklist: [], preferences: {}, notifications: {} };
}

const AD_HTML = `<!doctype html><body style="margin:0;height:100vh;display:grid;place-items:center;background:repeating-linear-gradient(45deg,#8881 0 10px,#8882 10px 20px);font:600 12px system-ui;color:#8889;letter-spacing:.2em">AD</body>`;

/**
 * Wire a page: language, optional userscript, and response rewriting through the CDP Fetch domain
 * (the browser still makes every request itself, so Cloudflare sees a normal browser).
 * opts: { lang, enhanced, userscript, cache, mutate(pathname, json, lang), init: {fn, arg} }
 */
export async function preparePage(page, opts) {
  const { lang } = opts;
  await page.addInitScript(([l]) => {
    try { localStorage.setItem('locale', l); } catch {}
  }, [lang]);
  await page.addInitScript(([css, login]) => {
    try { if (login) localStorage.setItem('token', login); else localStorage.removeItem('token'); } catch {}
    const add = () => { const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).append(st); };
    if (document.documentElement) add(); else document.addEventListener('DOMContentLoaded', add);
  }, [SHOT_CSS, opts.login ? fakeJwt('refresh_token') : null]);
  if (opts.init) await page.addInitScript(opts.init.fn, opts.init.arg);
  if (opts.enhanced) await page.addInitScript({ path: opts.userscript });

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Fetch.enable', { patterns: [
    { urlPattern: '*', requestStage: 'Request' },
    { urlPattern: 'https://api.iwara.tv/*', requestStage: 'Response' },
  ] });
  const b64 = (s) => Buffer.from(s).toString('base64');
  const hdrs = (o) => Object.entries(o).map(([name, value]) => ({ name, value: String(value) }));
  const rewrite = (realUrl, raw, ctype) => {
    if (!/json/.test(ctype || '')) return raw;
    try {
      let json = anonymize(JSON.parse(raw), lang, realUrl);
      if (opts.mutate) json = opts.mutate(new URL(realUrl).pathname, json, lang) || json;
      return JSON.stringify(json);
    } catch { return raw; }
  };
  cdp.on('Fetch.requestPaused', async (ev) => {
    const { requestId, request, resourceType, responseStatusCode } = ev;
    const u = new URL(request.url);
    const host = u.hostname;
    const go = (m, p) => cdp.send(m, { requestId, ...p }).catch(() => {});
    try {
      if (host === 'api.iwara.tv') {
        if (responseStatusCode != null) { // response stage
          const ctype = (ev.responseHeaders || []).find((h) => /content-type/i.test(h.name))?.value || '';
          const { body, base64Encoded } = await cdp.send('Fetch.getResponseBody', { requestId });
          const raw = base64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body;
          const headers = Object.fromEntries((ev.responseHeaders || []).filter((h) => !/content-length|content-encoding/i.test(h.name)).map((h) => [h.name, h.value]));
          if (request.method === 'GET' && responseStatusCode < 400) opts.cache.set(request.url, { status: responseStatusCode, headers, raw, ctype });
          return go('Fetch.fulfillRequest', { responseCode: responseStatusCode, responseHeaders: hdrs(headers), body: b64(rewrite(request.url, raw, ctype)) });
        }
        if (request.method === 'OPTIONS') return go('Fetch.continueRequest');
        if (opts.login) {
          const json = (o) => go('Fetch.fulfillRequest', { responseCode: 200, responseHeaders: hdrs({ 'content-type': 'application/json', 'access-control-allow-origin': '*' }), body: b64(JSON.stringify(o)) });
          if (u.pathname === '/user/token') return json({ accessToken: fakeJwt('access_token') });
          if (u.pathname === '/user') return json(opts.mutate?.('/user', fakeMe(), lang) || fakeMe());
          if (/^\/user\/[a-z]+\/cooldown$/.test(u.pathname)) return json({ limited: false, remaining: 0 });
          if (u.pathname === '/user/counts') return json({ notifications: 0, messages: 0, friendRequests: 0 });
          if (opts.fakeApi) { const r = opts.fakeApi(u, lang); if (r !== undefined) return json(r); }
        }
        if (request.method !== 'GET') return go('Fetch.failRequest', { errorReason: 'BlockedByClient' }); // never write anything
        const p = u.pathname.replace(/^\/profile\/([^/]+)/, (_, n) => '/profile/' + encodeURIComponent(realUsername(decodeURIComponent(n))));
        const realUrl = u.origin + p + u.search;
        const hit = opts.cache.get(realUrl);
        if (hit) return go('Fetch.fulfillRequest', { responseCode: hit.status, responseHeaders: hdrs(hit.headers), body: b64(rewrite(realUrl, hit.raw, hit.ctype)) });
        let fwd = realUrl;
        if (opts.login) fwd = fwd.replace(/([?&])subscribed=true&?/, '$1').replace(/[?&]$/, '');
        const cont = {};
        if (fwd !== request.url) cont.url = fwd;
        // the fake session never reaches the site: drop our made-up token from forwarded requests
        if (opts.login) cont.headers = Object.entries(request.headers).filter(([k]) => !/^authorization$/i.test(k)).map(([name, value]) => ({ name, value }));
        return go('Fetch.continueRequest', cont);
      }
      if (host === 'www.iwara.tv' || host === 'iwara.tv') {
        if (resourceType === 'Document' && u.pathname.startsWith('/profile/')) {
          const seg = u.pathname.split('/');
          const real = realUsername(decodeURIComponent(seg[2]));
          if (real !== seg[2]) { seg[2] = real; return go('Fetch.continueRequest', { url: u.origin + seg.join('/') + u.search }); }
        }
        if (resourceType === 'Image' && /\/(images|uploads)\//.test(u.pathname) === false) return go('Fetch.continueRequest');
        return go('Fetch.continueRequest');
      }
      if (resourceType === 'Image' || resourceType === 'Media') {
        if (/iwara\.tv$/.test(host)) return go('Fetch.fulfillRequest', { responseCode: 200, responseHeaders: hdrs({ 'content-type': 'image/svg+xml', 'access-control-allow-origin': '*' }), body: b64(placeholderSvg(request.url)) });
        return go('Fetch.failRequest', { errorReason: 'BlockedByClient' });
      }
      if (resourceType === 'Document') return go('Fetch.fulfillRequest', { responseCode: 200, responseHeaders: hdrs({ 'content-type': 'text/html' }), body: b64(AD_HTML) });
      if (/jsdelivr\.net$|cloudflare\.com$|challenges\.cloudflare/.test(host)) return go('Fetch.continueRequest');
      if (/iwara\.tv$/.test(host) && host !== 'service.iwara.tv') return go('Fetch.continueRequest');
      return go('Fetch.failRequest', { errorReason: 'BlockedByClient' });
    } catch (e) {
      return go('Fetch.continueRequest');
    }
  });
  return cdp;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); return d; }
