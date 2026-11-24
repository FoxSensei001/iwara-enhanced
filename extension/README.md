# 浏览器扩展版（Chromium / Firefox 通用）

同一份源码，另一种装法：把用户脚本产物包成 MV3 扩展，content script 跑在页面主世界（`world: MAIN`，`document_start`），行为与油猴版（`@grant none`）一致。

```bash
cd userscripts/iwara-enhanced
npm run build:ext        # 先构建 user.js，再生成 extension/dist/ 与 extension/iwara-enhanced-ext.zip
```

- Chrome / Edge / Brave：`chrome://extensions` → 开发者模式 → 加载已解压的扩展 → 选 `extension/dist`。要求 Chrome 111+。
- Firefox：`about:debugging` → 此 Firefox → 临时载入附加组件 → 选 `extension/dist/manifest.json`。要求 Firefox 128+。长期安装需要 AMO 签名。
- 版本号取自 `src/00-header.txt` 的 `@version`；`extension/dist/` 与 zip 是生成物，不入库。
- 与油猴版同时启用会重复注入（有 `__iweLoaded` 防重，但只有先到的那个生效），装扩展前请先停用油猴脚本。
