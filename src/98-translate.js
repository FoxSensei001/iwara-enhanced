// 翻译功能：用谷歌翻译把评论、论坛帖子、视频/图片的标题简介等内容译成用户界面语言

(() => {

defineStrings({
  translate_btn: '翻译',
  translate_back: '显示原文',
  translate_failed: '翻译失败，请稍后重试',
  translate_loading: '翻译中...',
}, {
  translate_btn: 'Translate',
  translate_back: 'Show original',
  translate_failed: 'Translation failed, please try again later',
  translate_loading: 'Translating...',
}, {
  translate_btn: '翻訳',
  translate_back: '原文を表示',
  translate_failed: '翻訳に失敗しました。しばらくしてからもう一度お試しください',
  translate_loading: '翻訳中...',
});

site.register('translate', {
  css: `
    .iwe-translate-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      font-size: 12px;
      color: var(--fg);
      background: none;
      border: 1px solid var(--line);
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.2s;
      margin-left: 8px;
      vertical-align: middle;
    }
    .iwe-translate-btn:hover {
      color: var(--fg2);
      border-color: var(--fg);
      background: var(--sunk);
    }
    .iwe-translate-btn.loading {
      opacity: 0.6;
      cursor: wait;
    }
    .iwe-translate-result {
      margin-top: 8px;
      padding: 8px;
      background: var(--card);
      border-left: 3px solid var(--blue);
      border-radius: 3px;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
    }
  `,

  scan(ctx) {
    const targetLang = getTargetLanguage();

    // 视频/图片简介、评论等：所有 .markdown 元素
    document.querySelectorAll('.markdown:not([data-iwe-translate])').forEach(el => {
      el.dataset.iweTranslate = '';
      const originalText = el.innerText.trim();
      if (!originalText || shouldSkipTranslate(originalText, targetLang)) return;

      // 按钮放在 markdown 容器右上角
      const btn = createTranslateButton(originalText, targetLang, el);
      btn.style.cssText = 'float: right; margin: -4px 0 8px 8px;';
      el.prepend(btn);
    });
  },
});

// ── 辅助函数 ───────────────────────────────────────────────────

/** 获取目标翻译语言（映射到谷歌翻译的语言代码） */
function getTargetLanguage() {
  const locale = (env.lang || localStorage.getItem('locale') || navigator.language || 'en').toLowerCase();

  // 映射到谷歌翻译的目标语言代码
  if (locale.startsWith('zh')) {
    // 繁体用 zh-TW，简体用 zh-CN
    if (/zh-(tw|hk|mo)|hant/i.test(locale)) return 'zh-TW';
    return 'zh-CN';
  }

  // 其他语言取前两位（en, ja, ko, de, es, fr, ru, th, vi, id 等）
  return locale.split(/[-_]/)[0];
}

/** 判断是否应该跳过翻译（已经是目标语言，或文本太短） */
function shouldSkipTranslate(text, targetLang) {
  if (text.length < 3) return true; // 太短没必要翻

  // 简单语言检测：如果原文已经主要是目标语言，就不显示翻译按钮

  // 日文检测（优先）：有假名就算日文
  const kana = (text.match(/[぀-ゟ゠-ヿ]/g) || []).length;
  if (kana > 0 && targetLang === 'ja') {
    return true; // 有假名且目标语言是日文，跳过
  }

  // 中文检测：排除日文后，才检查汉字占比
  if (targetLang.startsWith('zh')) {
    // 如果有假名，说明是日文不是中文
    if (kana > 0) return false;
    const chineseChars = (text.match(/[一-鿿]/g) || []).length;
    if (chineseChars / text.length > 0.3) return true; // 超过 30% 汉字且无假名，可能是中文
  }

  // 韩文检测
  if (targetLang === 'ko') {
    const koreanChars = (text.match(/[가-힯]/g) || []).length;
    if (koreanChars / text.length > 0.3) return true;
  }

  // 英文检测：如果大部分是 ASCII 字母，可能已经是英文
  if (targetLang === 'en') {
    const asciiLetters = (text.match(/[a-zA-Z]/g) || []).length;
    if (asciiLetters / text.length > 0.5) return true;
  }

  return false;
}

// 翻译缓存：{ "原文#目标语言": "译文" }
const translateCache = new Map();

/** 创建翻译按钮 */
function createTranslateButton(originalText, targetLang, contentContainer) {
  const cacheKey = `${originalText}#${targetLang}`;
  let translatedText = null;
  let isTranslating = false;
  let resultEl = null;

  const btn = h('button', { class: 'iwe-translate-btn', type: 'button' }, t('translate_btn'));

  btn.onclick = async () => {
    if (isTranslating) return;

    // 如果已经显示译文，切回原文
    if (resultEl) {
      resultEl.remove();
      resultEl = null;
      btn.textContent = t('translate_btn');
      return;
    }

    // 如果缓存里有译文，直接显示
    if (translateCache.has(cacheKey)) {
      showTranslation(translateCache.get(cacheKey));
      return;
    }

    // 发起翻译请求
    isTranslating = true;
    btn.classList.add('loading');
    btn.textContent = t('translate_loading');

    try {
      const translated = await translateWithGoogle(originalText, targetLang);
      translateCache.set(cacheKey, translated);
      translatedText = translated;
      showTranslation(translated);
    } catch (err) {
      console.error('[iwe translate]', err);
      toast(t('translate_failed'), 'error');
    } finally {
      isTranslating = false;
      btn.classList.remove('loading');
      if (!resultEl) {
        btn.textContent = t('translate_btn');
      }
    }
  };

  function showTranslation(text) {
    resultEl = h('div', { class: 'iwe-translate-result' }, text);
    contentContainer.append(resultEl);
    btn.textContent = t('translate_back');
  }

  return btn;
}

/** 调用谷歌翻译接口（分段 + 重试） */
async function translateWithGoogle(text, targetLang) {
  const maxChunkChars = 4500;
  const chunks = splitTextForGoogle(text, maxChunkChars);

  // 单段直接翻译
  if (chunks.length === 1) {
    return await googleTranslateSingle(chunks[0], targetLang);
  }

  // 多段串行翻译（避免并发过高）
  const results = [];
  for (const chunk of chunks) {
    const translated = await googleTranslateSingle(chunk, targetLang);
    results.push(translated);
  }

  return results.join('');
}

/** 单段谷歌翻译，带重试。主路径用 fetch（站点 CSP 允许），GM 作兜底 */
async function googleTranslateSingle(text, targetLang) {
  const maxRetries = 2;
  let attempt = 0;

  const url = new URL('https://translate.googleapis.com/translate_a/t');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'auto');
  url.searchParams.set('tl', targetLang);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  const hasGM = typeof GM_xmlhttpRequest !== 'undefined';

  while (true) {
    try {
      let data;

      if (!hasGM) {
        // 主路径：fetch（站点 CSP 允许连接 translate.googleapis.com）
        const response = await fetch(url.toString(), {
          method: 'GET',
          signal: AbortSignal.timeout(20000), // 20 秒超时
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        data = await response.json();
      } else {
        // 兜底：GM_xmlhttpRequest（某些特殊环境下 fetch 可能失败）
        data = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: url.toString(),
            timeout: 20000,
            onload: (response) => {
              if (response.status >= 200 && response.status < 300) {
                try {
                  resolve(JSON.parse(response.responseText));
                } catch (e) {
                  reject(new Error('Failed to parse response'));
                }
              } else {
                reject(new Error(`HTTP ${response.status}`));
              }
            },
            onerror: (err) => reject(new Error('Network error')),
            ontimeout: () => reject(new Error('Request timeout')),
          });
        });
      }

      const translated = parseGoogleResponse(data);

      if (!translated) {
        throw new Error('Empty translation response');
      }

      return translated;
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) {
        throw err;
      }
      // 线性退避
      await new Promise(resolve => setTimeout(resolve, 200 * attempt));
    }
  }
}

/** 解析谷歌翻译响应 */
function parseGoogleResponse(data) {
  try {
    if (Array.isArray(data) && data.length > 0) {
      const first = data[0];

      // 典型结构：[[["译文","原文", ...], ["片段2", ...], ...], ...]
      if (Array.isArray(first)) {
        const parts = [];
        for (const item of first) {
          if (Array.isArray(item) && item.length > 0 && typeof item[0] === 'string') {
            parts.push(item[0]);
          }
        }
        const text = parts.join('');
        if (text) return text;
      }

      // 退化结构：data[0][0] 直接是字符串
      if (Array.isArray(data[0]) && data[0].length > 0 && typeof data[0][0] === 'string') {
        return data[0][0];
      }
    }
  } catch (e) {
    console.error('[iwe translate parse]', e);
  }
  return '';
}

/** 将文本切分为适合谷歌翻译的片段，尽量在自然边界处断开 */
function splitTextForGoogle(text, maxChunkChars) {
  if (text.length <= maxChunkChars) {
    return [text];
  }

  const boundaries = new Set([
    '\n', '\r', '。', '！', '？', '；', '，', '、', // i18n-ok 断句边界
    '.', '!', '?', ';', ':', ' ',
  ]);

  const chunks = [];
  let index = 0;

  while (index < text.length) {
    const remaining = text.length - index;
    let take = remaining <= maxChunkChars ? remaining : maxChunkChars;

    let slice = text.substring(index, index + take);
    if (remaining > maxChunkChars) {
      // 在边界处切分
      let cut = -1;
      for (let i = slice.length - 1; i >= 0; i--) {
        if (boundaries.has(slice[i])) {
          cut = i + 1; // 包含边界字符
          break;
        }
      }
      if (cut <= 0) {
        // 找不到自然边界，硬切
        cut = slice.length;
      }
      slice = slice.substring(0, cut);
      take = slice.length;
    }

    chunks.push(slice);
    index += take;
  }

  return chunks;
}

})();
