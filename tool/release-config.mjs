// 读发版托管设置（release.config.json）。build.mjs 写油猴更新地址、build-extension.mjs 写扩展更新地址都从这里取，
// 保证同一次发版的 latest.json / updates.json / @updateURL 指向同一个目录。
// baseUrl：托管目录的 HTTPS 地址（不带结尾斜杠），里面平铺 extension/release/ 下的所有文件。留空 = 关掉一切更新地址。
import fs from 'node:fs';
import path from 'node:path';

export function loadReleaseConfig(root) {
  const file = path.join(root, 'release.config.json');
  const cfg = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const baseUrl = String(process.env.IWE_RELEASE_BASE_URL ?? cfg.baseUrl ?? '').trim().replace(/\/+$/, '');
  if (baseUrl && !/^https:\/\/[^/\s]+/.test(baseUrl)) throw new Error(`release.config.json 的 baseUrl 必须是 https:// 地址：${baseUrl}`);
  const downloadPage = String(cfg.downloadPage ?? '').trim();
  if (downloadPage && !/^https:\/\//.test(downloadPage)) throw new Error(`release.config.json 的 downloadPage 必须是 https:// 地址：${downloadPage}`);
  const firefoxChannel = process.env.IWE_FIREFOX_CHANNEL || cfg.firefoxChannel || 'listed';
  if (!['unlisted', 'listed'].includes(firefoxChannel)) throw new Error(`firefoxChannel 只能是 unlisted 或 listed：${firefoxChannel}`);
  const firefoxListingUrl = String(cfg.firefoxListingUrl ?? '').trim(); // AMO 上架后的商品页，下载页和 latest.json 用
  if (firefoxListingUrl && !/^https:\/\//.test(firefoxListingUrl)) throw new Error(`firefoxListingUrl 必须是 https:// 地址：${firefoxListingUrl}`);
  const repoUrl = String(cfg.repoUrl ?? '').trim(); // 下载页上的源码链接，可留空
  if (repoUrl && !/^https:\/\//.test(repoUrl)) throw new Error(`repoUrl 必须是 https:// 地址：${repoUrl}`);
  return {
    baseUrl,
    firefoxListingUrl,
    repoUrl,
    firefoxChannel,
    downloadPage: downloadPage || (baseUrl ? `${baseUrl}/` : ''),
    url: (name) => (baseUrl ? `${baseUrl}/${name}` : ''),
  };
}
