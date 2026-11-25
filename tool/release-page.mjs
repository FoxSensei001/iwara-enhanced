// 托管目录首页（index.html）：同一份 latest.json 生成的下载页，中英两种文字并排。
// 纯静态，没有脚本、没有外部资源、没有统计。
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function releasePage(latest) {
  const ff = latest.firefox;
  const firefoxBlock = ff.channel === 'unlisted'
    ? `<p><a class="btn" href="${esc(ff.xpi)}">安装 Firefox 版 / Install for Firefox</a></p>
       <p>Firefox ${esc(ff.minVersion)}+。装好后由 Firefox 自动更新。<br>Updates install automatically.</p>`
    : ff.listing
      ? `<p><a class="btn" href="${esc(ff.listing)}">到 Firefox 附加组件页面安装 / Get it on Firefox Add-ons</a></p>
         <p>Firefox ${esc(ff.minVersion)}+。由 Firefox 自动更新。<br>Updates install automatically.</p>`
      : `<p>Firefox 版正在等待 Mozilla 审核，上架后这里会放链接。<br>The Firefox version is awaiting review on addons.mozilla.org.</p>`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>Iwara Enhanced ${esc(latest.version)}</title>
<style>
  :root { color-scheme: light dark; --bg:#fafafa; --fg:#1d1d1f; --muted:#666; --card:#fff; --line:#e4e4e7; --accent:#d43f6a; }
  @media (prefers-color-scheme: dark) { :root { --bg:#141416; --fg:#ececef; --muted:#a1a1aa; --card:#1d1d21; --line:#2e2e33; } }
  body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.6 system-ui, sans-serif; }
  main { max-width:720px; margin:0 auto; padding:32px 16px 48px; }
  h1 { margin:0 0 4px; font-size:26px; } .sub { color:var(--muted); margin:0 0 24px; }
  section { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:16px 20px; margin:0 0 16px; }
  h2 { margin:0 0 8px; font-size:17px; } p, ol { margin:8px 0; } ol { padding-left:20px; }
  .btn { display:inline-block; background:var(--accent); color:#fff; text-decoration:none; padding:7px 14px; border-radius:8px; }
  code { font-size:13px; word-break:break-all; } small { color:var(--muted); }
</style>
</head>
<body>
<main>
  <h1>Iwara Enhanced</h1>
  <p class="sub">当前版本 / Latest ${esc(latest.version)} · ${esc(latest.date)}</p>

  <section>
    <h2>油猴脚本 / Userscript</h2>
    <p><a class="btn" href="${esc(latest.userscript.install)}">安装脚本 / Install</a></p>
    <p>需要 Tampermonkey 或 Violentmonkey 等脚本管理器，装好后由脚本管理器自动更新。<br>Requires a userscript manager; it keeps the script up to date.</p>
  </section>

  <section>
    <h2>Firefox</h2>
    ${firefoxBlock}
  </section>

  <section>
    <h2>Chrome / Edge / Brave</h2>
    <p><a class="btn" href="${esc(latest.chromium.zip)}">下载扩展 / Download (.zip)</a></p>
    <ol>
      <li>解压到一个固定的文件夹（以后更新也解压到这里覆盖）。<br>Unzip into a folder you keep (unzip updates over it).</li>
      <li>打开 <code>chrome://extensions</code>（Edge：<code>edge://extensions</code>），打开「开发者模式」。<br>Open the extensions page and turn on Developer mode.</li>
      <li>首次：点「加载已解压的扩展程序」，选这个文件夹；更新：解压覆盖后点扩展卡片上的刷新按钮。<br>First time: “Load unpacked” and pick the folder. Updates: unzip over it, then click reload.</li>
    </ol>
    <p>有新版时，扩展会在 iwara 页面上提示一次。设置保存在站点里，覆盖升级不会丢。<br>The extension shows a one-time notice on iwara when a new version is out. Settings are kept.</p>
    <p><small>Chrome ${esc(latest.chromium.minVersion)}+ · SHA-256 <code>${esc(latest.chromium.sha256)}</code></small></p>
  </section>

  <p><small>同时只启用一种：装扩展前先停用油猴脚本。/ Use only one: disable the userscript before installing the extension.</small></p>
</main>
</body>
</html>
`;
}
