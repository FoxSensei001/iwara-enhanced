// Chromium 版扩展的更新检查（后台 service worker）。只进 Chromium 包，Firefox 包靠 updates.json 由浏览器自己更新。
// 隐私：每天最多一次、对固定地址发一个不带 Cookie、不带 Referer、没有任何查询参数的 GET（只读回一个 JSON），
// 不上报版本号、不上报任何用户或页面信息；比较版本在本地做。
// 下面两个地址的占位符由 build-extension.mjs 在打包时替换成 release.config.json 里的地址。
const LATEST_URL = '__LATEST_URL__';
const DOWNLOAD_PAGE = '__DOWNLOAD_PAGE__';
const ALARM = 'iwe-update-check';
const MIN_GAP = 20 * 3600e3; // 两次检查至少隔 20 小时

const current = () => chrome.runtime.getManifest().version;
// 版本号是 1–4 段数字（manifest 的规定），逐段比
function newer(a, b) {
  const pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0, y = pb[i] || 0;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    if (x !== y) return x > y;
  }
  return false;
}
const httpsOr = (u, fallback) => (typeof u === 'string' && /^https:\/\//.test(u) ? u : fallback);

async function paint() {
  const { update } = await chrome.storage.local.get('update');
  if (update && !newer(update.version, current())) {
    await chrome.storage.local.remove('update'); // 已经装上新版了
    return paint();
  }
  await chrome.action.setBadgeText({ text: update ? 'NEW' : '' });
  if (update) await chrome.action.setBadgeBackgroundColor({ color: '#d43f6a' });
  await chrome.action.setTitle({ title: update ? `Iwara Enhanced ${current()} → ${update.version}` : `Iwara Enhanced ${current()}` });
}

async function check(force = false) {
  const { lastCheck = 0 } = await chrome.storage.local.get('lastCheck');
  if (!force && Date.now() - lastCheck < MIN_GAP) return paint();
  await chrome.storage.local.set({ lastCheck: Date.now() });
  let info;
  try {
    const r = await fetch(LATEST_URL, { cache: 'no-cache', credentials: 'omit', referrerPolicy: 'no-referrer' });
    if (!r.ok) return paint();
    info = await r.json();
  } catch {
    return paint(); // 离线、托管挂了：安静地等下次
  }
  if (info && typeof info.version === 'string' && newer(info.version, current())) {
    const url = httpsOr(info.downloadPage, '') || httpsOr(info.chromium?.zip, DOWNLOAD_PAGE);
    await chrome.storage.local.set({ update: { version: info.version, url } });
  } else {
    await chrome.storage.local.remove('update');
  }
  return paint();
}

async function ensureAlarm() {
  if (!(await chrome.alarms.get(ALARM))) chrome.alarms.create(ALARM, { delayInMinutes: 1, periodInMinutes: 12 * 60 });
}

chrome.runtime.onInstalled.addListener(() => { ensureAlarm(); check(true); });
chrome.runtime.onStartup.addListener(() => { ensureAlarm(); check(); });
chrome.alarms.onAlarm.addListener((a) => { if (a.name === ALARM) check(); });
chrome.action.onClicked.addListener(async () => {
  const { update } = await chrome.storage.local.get('update');
  chrome.tabs.create({ url: update?.url || DOWNLOAD_PAGE });
});
