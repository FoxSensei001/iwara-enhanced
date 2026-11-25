const API = 'https://api.iwara.tv';
const FILES = 'https://files.iwara.tv';
const IMG = 'https://i.iwara.tv/image';
const STAFF = ['janitor', 'moderator', 'officer', 'admin'];
const MB = 1048576;

class ApiError extends Error {
  constructor(status, data) {
    super((data && data.message) || `HTTP ${status}`);
    this.status = status;
    this.data = data || {};
  }
  /** 服务端按字段给的错误：{ tags: 'errors.categoryRequired' } */
  get fields() {
    const out = {};
    for (const e of this.data.errors || []) out[e.field] = e.message;
    return out;
  }
  /**
   * 给人看的错误说明。服务端错误体有三种形状：
   * - 接口：{ message:'errors.validationError', errors:[{ field, message, values? }] }，values 是文案里的占位数字（如 tagLimit 的 limit）
   * - 接口：{ message:'errors.tooManyRequests' } 之类，没有 errors
   * - 上传：{ message, reason:'fileTooLarge'|'invalidMime'|'unknown', data }
   */
  get text() {
    const e0 = (this.data.errors || [])[0];
    if (e0) {
      const lbl = t('fld_' + e0.field);
      return (lbl !== 'fld_' + e0.field ? lbl + sepColon() : '') + srvText(e0.message, e0.values);
    }
    if (this.status === 0) return t('errNetwork');
    if (this.status === 401) return t('errLogin');
    return srvText(this.data.reason || this.data.message || this.message);
  }
}
/** 'errors.tagLimit' / 'error.serverError' / 'form.videoField.error.fileTooLarge' / 'fileTooLarge' → 本地化文案；没收录的原样返回。 */
function srvText(key, values) {
  const k = 'srv_' + String(key || '').replace(/^(errors?|form\.(video|image)Field\.error)\./, '');
  const s = t(k, values);
  return s === k ? String(key || '') : s;
}

const api = (() => {
  let access = null;
  let accessExp = 0;
  let pending = null;

  async function token() {
    if (access && Date.now() < accessExp) return access;
    if (pending) return pending;
    const refresh = localStorage.getItem('token');
    if (!refresh) throw new ApiError(401, { message: 'login' });
    pending = (async () => {
      const r = await fetch(API + '/user/token', { method: 'POST', headers: { Authorization: 'Bearer ' + refresh, 'X-Site': location.hostname } });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.accessToken) throw new ApiError(r.status || 401, { message: 'login' });
      access = j.accessToken;
      try {
        accessExp = JSON.parse(atob(access.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000 - 60000;
      } catch {
        accessExp = Date.now() + 10 * 60000;
      }
      return access;
    })();
    try { return await pending; } finally { pending = null; }
  }

  async function call(path, { method = 'GET', body, host = API, auth = true } = {}) {
    // 与当前页面域名一致：主站（www.iwara.tv / iwara.tv）和 AI 站（www.iwara.ai / iwara.ai）是同一套前端、同一个 api.iwara.tv，
    // 只靠这个头区分站点（站点自己的请求封装也是：发往 api.iwara.tv 的一律带，发往 files.iwara.tv 的上传不带）
    const headers = { 'X-Site': location.hostname };
    if (auth) headers.Authorization = 'Bearer ' + (await token());
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (host !== API) delete headers['X-Site'];
    const r = await fetch(host + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store' });
    const data = r.status === 204 ? null : await r.json().catch(() => null);
    if (!r.ok) throw new ApiError(r.status, data);
    return data;
  }

  /** XHR 上传，带进度与取消。返回 { promise, abort }。 */
  function upload(kind, file, onProgress) {
    const xhr = new XMLHttpRequest();
    const promise = (async () => {
      const tk = await token();
      return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('file', file);
        xhr.open('POST', `${FILES}/upload/${kind}`);
        xhr.setRequestHeader('Authorization', 'Bearer ' + tk);
        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total, e.loaded);
        xhr.onload = () => {
          let data = null;
          try { data = JSON.parse(xhr.responseText); } catch { /* 非 JSON */ }
          xhr.status === 201 ? resolve(data) : reject(new ApiError(xhr.status, data));
        };
        xhr.onerror = () => reject(new ApiError(0, { message: 'network' }));
        xhr.onabort = () => reject(new ApiError(-1, { message: 'aborted' }));
        xhr.send(form);
      });
    })();
    return { promise, abort: () => xhr.abort() };
  }

  return { call, upload, token };
})();

// ── 业务接口 ─────────────────────────────────────────────────────────────
const svc = {
  config: null,
  async boot() {
    const [me, config] = await Promise.all([api.call('/user'), api.call('/config').catch(() => null)]);
    env.user = me.user;
    // 跟站点当前显示的语言走（站点切语言写的是 localStorage.locale），站点增强那边也是同一个来源；没有再用账号设置
    detectLang(localStorage.getItem('locale') || me.user.locale);
    svc.config = config || { categories: [], blacklist: [] };
    return me.user;
  },
  get isPremium() { const u = env.user || {}; return !!(u.premium || STAFF.includes(u.role)); },
  /** 视频大小上限（字节），取自站点规则；读不到返回 null（不在本地拦）。 */
  get sizeLimit() { const r = siteRules.video(); const mbv = r && (svc.isPremium ? r.premiumMB || r.sizeMB : r.sizeMB); return mbv ? mbv * MB : null; },
  get isStaff() { return STAFF.includes((env.user || {}).role); },
  get canCustomThumb() { return !!(env.user && (env.user.premium || svc.isStaff)); },

  /** 发布冷却：按类型分开算，GET /user/{video|image}/cooldown → { limited, remaining(秒) }。 */
  async cooldown(kind = 'video') {
    try { return await api.call(`/user/${kind}/cooldown`); } catch { return { limited: false, remaining: 0 }; }
  },

  uploadVideo(file, onProgress) { return api.upload('video', file, onProgress); },
  uploadImage(file, onProgress) { return api.upload('image', file, onProgress); },

  /** 轮询服务端处理进度，直到 completed / failed。onState({status, elapsed}) */
  async waitProcessed(id, key, onState, isCancelled) {
    const started = Date.now();
    for (;;) {
      if (isCancelled()) return null;
      let s = null;
      try { s = await api.call(`/upload/video/${id}/${key}`, { host: FILES, auth: false }); } catch (e) { if (e.status >= 400 && e.status < 500) throw e; }
      if (s) {
        // 处理进度：{ state: 'waiting' | 'active' | 'completed' | 'failed', progress, data }；status 留作兼容
        const st = s.state || s.status;
        if (st === 'completed') return s.data;
        if (st === 'failed') throw new ApiError(422, { message: 'process' });
        onState({ status: st, elapsed: (Date.now() - started) / 1000 });
      }
      await sleep(1000);
    }
  },

  async create(kind, payload) {
    return api.call(kind === 'video' ? '/videos' : '/images', { method: 'POST', body: payload });
  },
  async update(kind, id, payload) {
    const res = await api.call(`/${kind}/${id}`, { method: 'PUT', body: payload });
    // 详情接口有服务端缓存，保存后一段时间内读到的还是旧值：把这次的结果记下来，下次编辑以它为准。
    store.set('fresh:' + id, { at: Date.now(), data: res });
    return res;
  },
  /** 取详情用于编辑预填：本地记着更新的一份就用本地的。 */
  async detail(kind, id) {
    const remote = await api.call(`/${kind}/${id}`);
    const local = store.get('fresh:' + id);
    if (local && local.data && new Date(local.data.updatedAt || 0) > new Date(remote.updatedAt || 0)) return local.data;
    return remote;
  },
  remove(kind, id) { return api.call(`/${kind}/${id}`, { method: 'DELETE' }); },

  /** 我的作品：管理列表（实时、字段少）+ 公开列表（带封面和标签）按 id 合并。 */
  async myContent(kind, page = 0) {
    const uidv = env.user.id;
    const [list, rich] = await Promise.all([
      api.call(`/user/${uidv}/content/${kind}s?page=${page}`),
      api.call(`/${kind}s?user=${uidv}&sort=date&rating=all&limit=32&page=${page}`).catch(() => ({ results: [] })),
    ]);
    const byId = new Map(rich.results.map((r) => [r.id, r]));
    return { count: list.count, limit: list.limit, results: list.results.map((r) => ({ ...(byId.get(r.id) || {}), ...r, __rich: byId.has(r.id) })) };
  },
  myRecent(kind = 'video', limit = 32) {
    return api.call(`/${kind}s?user=${env.user.id}&sort=date&rating=all&limit=${limit}`).then((r) => r.results, () => []);
  },
  searchUsers: (q) => api.call('/autocomplete/users?query=' + encodeURIComponent(q)).then((r) => r.results || [], () => []),
  searchTags: (q) => api.call('/autocomplete/tags?query=' + encodeURIComponent(q)).then((r) => r.results || [], () => []),
};

const thumbUrl = {
  video(v, index) {
    if (!v) return null;
    if (v.customThumbnail) return thumbUrl.file(v.customThumbnail);
    if (!v.file) return null;
    return `${IMG}/thumbnail/${v.file.id}/thumbnail-${String(index ?? v.thumbnail ?? 0).padStart(2, '0')}.jpg`;
  },
  // 站点除 original 以外的尺寸一律是 jpg：x.png 的缩略图地址是 /thumbnail/{id}/x.jpg
  file: (f, size = 'thumbnail') => (f ? `${IMG}/${size}/${f.id}/${size === 'original' ? f.name : f.name.replace(/\.[^.]+$/, '') + '.jpg'}` : null),
  avatar: (u) => (u && u.avatar ? thumbUrl.file(u.avatar, 'avatar') : null),
};
