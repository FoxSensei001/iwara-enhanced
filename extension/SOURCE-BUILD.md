# Building Iwara Enhanced from source (for add-on reviewers)

The extension's only script, `iwara-enhanced.js`, is generated from the files in `src/` plus the
Milkdown editor (npm package `@milkdown/kit`, MIT), which esbuild bundles and minifies. Everything
else in the package (`manifest.json`, `icons/`) is copied as is.

## Requirements

- Any OS with a POSIX shell and the `zip` command (built and tested on macOS; Linux works the same)
- Node.js 20 or later (developed with Node 22), with npm
- No other tools; all dependencies come from npm via `package-lock.json`

## Steps

```sh
npm ci
node build-extension.mjs --build
```

`--build` first runs `build.mjs` (concatenates `src/*.js`, bundles `vendor/milkdown.js` with esbuild,
writes `dist/iwara-enhanced.user.js`), then `build-extension.mjs` strips the userscript header and
writes the Firefox package to `extension/dist-firefox/`.

Compare `extension/dist-firefox/iwara-enhanced.js` with `iwara-enhanced.js` in the submitted package;
they are identical. `manifest.json` also matches, if `release.config.json` is the same as in this
source package (it holds the self-hosting update URL, or nothing).

## What the code does

- One content script, injected at `document_start` into the page's own JavaScript world
  (`"world": "MAIN"`) on `iwara.tv` and `iwara.ai` only. It behaves the same as the userscript
  version (`@grant none`). It needs the page's world because it reads and patches the site's own
  single-page-app state and calls the site's API with the user's existing session.
- No extension APIs and no background script in the Firefox build. No remote code: nothing is
  `eval`ed and no scripts are loaded from the network.
- Network requests: the Iwara site and its API (as the site itself does); a static tag-name dictionary
  (JSON, no user data) from cdn.jsdelivr.net; and, only when the user clicks a "Translate" button, the text
  of that one comment / title / description is sent to Google Translate (translate.googleapis.com).
  That last one is why the manifest declares `data_collection_permissions.required: ["websiteContent"]`.
  No analytics, no identifiers, nothing is sent to the developer.
