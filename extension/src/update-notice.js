// Chromium 版扩展：有新版时在 iwara 页面角落提示一次（隔离世界的 content script，页面脚本看不到它）。
// 只读本地存储里后台检查写下的结果，自己不发任何请求。用户点「下载」或「这个版本不再提示」后，这个版本不再出现。
(async () => {
  if (window.top !== window) return;
  const { update, dismissed } = await chrome.storage.local.get(['update', 'dismissed']);
  if (!update || dismissed === update.version || !/^https:\/\//.test(update.url || '')) return;
  const cur = chrome.runtime.getManifest().version;
  const pa = update.version.split('.').map(Number), pb = cur.split('.').map(Number);
  let isNewer = false;
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) { isNewer = (pa[i] || 0) > (pb[i] || 0); break; }
  }
  if (!isNewer) return;

  const lang = (document.documentElement.lang || navigator.language || 'en').toLowerCase();
  const S = lang.startsWith('zh')
    ? { msg: `Iwara 增强有新版本 ${update.version}（当前 ${cur}）`, get: '下载', later: '这个版本不再提示' }
    : lang.startsWith('ja')
      ? { msg: `Iwara 拡張の新しいバージョン ${update.version} があります（現在 ${cur}）`, get: 'ダウンロード', later: 'このバージョンは通知しない' }
      : { msg: `Iwara Enhanced ${update.version} is available (you have ${cur})`, get: 'Download', later: "Don't remind me for this version" };

  const dismiss = () => { chrome.storage.local.set({ dismissed: update.version }); host.remove(); };
  const host = document.createElement('div');
  const root = host.attachShadow({ mode: 'closed' });
  const style = document.createElement('style');
  style.textContent = `
    .box{position:fixed;left:16px;bottom:16px;z-index:2147483646;max-width:min(360px,calc(100vw - 32px));
      font:13px/1.45 system-ui,sans-serif;color:#fff;background:#222;border-radius:10px;padding:12px 14px;
      box-shadow:0 6px 24px rgba(0,0,0,.35);display:flex;flex-direction:column;gap:8px}
    .row{display:flex;gap:8px;flex-wrap:wrap}
    a,button{font:inherit;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;text-decoration:none}
    a{background:#d43f6a;color:#fff} button{background:#444;color:#ddd}`;
  const box = document.createElement('div');
  box.className = 'box';
  box.setAttribute('role', 'status');
  const text = document.createElement('div');
  text.textContent = S.msg;
  const row = document.createElement('div');
  row.className = 'row';
  const get = document.createElement('a');
  get.href = update.url;
  get.target = '_blank';
  get.rel = 'noopener noreferrer';
  get.textContent = S.get;
  get.addEventListener('click', dismiss);
  const later = document.createElement('button');
  later.type = 'button';
  later.textContent = S.later;
  later.addEventListener('click', dismiss);
  row.append(get, later);
  box.append(text, row);
  root.append(style, box);
  (document.body || document.documentElement).append(host);
})();
