# Telegraph（common_Telegraph）调研发现

## 平台本质
- **Telegra.ph 不是 API 平台，是一个网站。** 无官方开放 API，适配器用「CORS 代理 / siyuan 代理 + 表单 POST」模拟浏览器行为打到 `https://telegra.ph/...`（`/check`、`/save`）。
- 两种登录模式：
  - **匿名（ANONYMOUS，默认）**：没有真实账号。`/check?page_id=0` 会**创建一个新的匿名会话**，返回 `save_hash` + 写入 `tph_uuid` cookie。适配器把 `password` 存为这个 `tph_uuid` 值，后续 `/save` 用 `Cookie: tph_uuid=<password>` 作为会话凭证。
  - **登录用户（LOGIN_USER）**：需手动填写 `Access Token`（`tph_token`）+ `save_hash`，会话 cookie = `tph_uuid=<password>; tph_token=<accessToken>`。

## 「投机取巧」高发点（重要）
1. **Del = 无实现且必然失败。** `deletePost()` 直接 `throw new Error("telegra.ph 暂不支持删除文章功能")`。Telegra.ph 公开页面无删除 API，适配器明确不支持。→ 六格里的「Del」**无法用 normal 方式通过**；若标 ✅ 属投机。需与用户对齐：是否视为「平台无删除能力 → N/A」，或接受「删除不支持」作为事实结论。
2. **Img = 无内置上传，完全依赖外部 PicGo 图床。**
   - `newMediaObject()` 整段被注释，注「已失效，上传功能无法实现」。
   - `bundledPicbedSupported = false`（无内置上传），`picgoPicbedSupported = true`（只能 PicGo）。
   - `telegraph.md` 不处理图片上传：`image` 节点直接把 markdown 里的图片 URL（`node.destination`）写入 `<img src=...>`，**原样引用于公网页面**。
   - **坑**：若文档图片是本地资产 URL（`127.0.0.1:53180/assets/...`），发布后 Telegra.ph 页面 `<img src=127.0.0.1:53180/...>` 公网不可访问 → 图片空白。必须先用 PicGo 把本地上传到**公网可达图床**（如阿里云 OSS），得到公网 URL 后再发布，telegraph.md 才引用该公网 URL。
   - => Img 若要**真正通过**，前提是有一个可用的 PicGo + 公网图床。若无，Img 无法真验。
3. **V2C 依赖外部公网 CORS 代理。** 匿名会话的 `/check` 默认走 `legacyProxyMiddleware = https://api.terwer.space/api/middleware`（公网代理）。若该公网代理不可用/被墙/限流，`/check` 失败 → V2C 失败。这是一个**运行期外部依赖**，非适配器缺陷。
4. **「查看」链接 = 拼 `home` 域名。** `getPreviewUrl` 返回 `/[postid]` 替换 path（无域名）；调用方 `usePublish.getPostPreviewUrl` 遇非绝对 URL 时用 `StrUtil.pathJoin(cfg.home, previewUrl)` 补域名 → `https://telegra.ph/<path>`，即 telegra.ph 文章地址（无需登录即可访问）。前提 `home` 正确填 `https://telegra.ph`。需实测确认 home 何值。

## 配置与字段
- `TelegraphConfig extends CommonBlogConfig`：
  - `home` = `telegraphUrl`（VITE_TELEGRAPH_URL，默认 `https://telegra.ph`）
  - `apiUrl` = `https://edit.telegra.ph`（注意与 home 不同）
  - `previewUrl = "/[postid]"`，`allowPreviewUrlChange = false`
  - `postType`（anonymous/user）、`accessToken`、`saveHash`、`forceReAuth`
- `useTelegraphApi`：`usernameEnabled=true`；`cateEnabled=false`；`tagEnabled=false`；`postType=ANONYMOUS`；`picgoPicbedSupported=true`；`bundledPicbedSupported=false`。
- 配置页 `TelegraphSetting.vue`：`登录模式`（匿名 / 登录用户）、`Access Token`（仅登录）、`Hash`（saveHash）、`刷新授权`。用户名/密码 label 来自 i18n（`setting.telegraph.username/password.label`）。

## V2C 判定
- 基类 `validatePublish()` 返回 `{canPublish:true}`（**不打网络**），Telegraph 未覆写。
- `useV2PublishValidation.validatePlatformPublish`：`canPublish = dynCfg.isAuth === true && validation.canPublish === true`。=> **V2C 是否通过取决于配置页「验证」是否成功设置 `isAuth`**（那一步会调 `getUsersBlogs` → `/check` 创建匿名会话）。adaptor 本身 `validatePublish` 恒 true。

## 已确认的网络/传输
- `/save`（newPost/editPost）用表单 `FormData`（`Data`=telegraph.md 渲染的 JSON 字符串 Blob、`title`、`author`、`save_hash`、`page_id`），走 `apiFormFetch`。
- `newPost` postid = JSON `{update_cookie, page_id, path, save_hash}`；`editPost` 用其中 `page_id` + `save_hash` 再次 `/save` 覆盖。
- `checkAuth()`（base）恒 `return true`。

## 待实测/待确认（写方案前不确定项）
- [x] host 下匿名 V2C（点「验证」）→ **实测失败**：`request to https://edit.telegra.ph/check failed, getaddrinfo ENOTFOUND edit.telegra.ph`。注意：请求直接打到 `apiUrl`（`edit.telegra.ph`），**未走公网 middleware**；宿主机 `edit.telegra.ph`/`telegra.ph` 均 DNS 解析失败（当前环境无代理/被墙）。`api.terwer.space/api/middleware` 可达但返回 **404**（路径疑失效）。→ 决策点 3 已获实证：**属外部网络依赖问题，非适配器逻辑错误**（当前无代理无法解析 telegra.ph 域名，V2C 必然失败）。
- [ ] newPost 是否真实产出一篇 telegra.ph 文章（是否因 cookie/代理失败）。
- [ ] 「查看」链接 `https://telegra.ph/<path>` 是否能打开。
- [ ] Img：配置「PicGo」+ 公网图床后，发布含本地图文档，文章 `<img>` 是否为公网 URL 且可访问；若只用本地资产图，文章图片是否空白（预期会空白，验证「投机」坑属实）。
- [ ] Upd：`editPost` 用 `page_id` 覆盖是否真更新同一篇。
- [ ] Del：确认 `deletePost` 必然抛错（无法删除）——作为结论。

---

## 七、请求模式矩阵（彻底理清）

### 7.0 前提结论（本次深挖已定论）
- **根因**：思源宿主内 `isInSiyuanOrSiyuanNewWin=true` → `isUseSiyuanProxy=false`；`canUsePluginFetch=true`（`win.require` 存在）→ `resolvePublishTransport` 优先返回 **`plugin-node-fetch`**。故 Telegraph `/check` 走插件直连 `https://edit.telegra.ph/check` → DNS 失败（被墙）。**未走任何 CORS 代理。**
- **新版可用 CORS 代理已实测通过**：`https://cors.terwer.space/`（见 7.5），正是 corsFetch 的 `corsProxyUrl` 落点。

### 7.1 三类通道（XML-RPC / multipart / JSON 共用 `resolvePublishTransport`）
| 通道 | 底层 | 谁发起 | 能否访问 loopback/私网 | 适用场景 | 不适用 |
|------|------|--------|------------------------|----------|--------|
| **plugin-node-fetch** | 插件宿主 bundled node-fetch（`win.require(libs/node-fetch-cjs)`） | 插件渲染进程 | ✅（Node 直达本机） | 内网/本地/同源/未被墙外网 | **被墙外网**（DNS/连接失败，如 telegra.ph）；无 CORS 概念 |
| **siyuan-forward-proxy** | 思源内核 `forwardProxy` API | 思源内核 | ✅（SafeDialer 兜底 SSRF；`--safe-mode` 拒绝） | 无直传能力 + `isUseSiyuanProxy‖forceProxy`；loopback/私网目标 | 思源宿主内 `isUseSiyuanProxy=false` 不触发（除非 forceProxy） |
| **middleware-fetch** | **远端 CORS 代理** | 远端代理服务器 | ❌（远端无法访问用户 localhost） | 浏览器跨域 + **被墙外网**（远端代访问） | 本地/私网目标 |

### 7.2 通道选择（`resolvePublishTransport(ctx)`）
```
if canUsePluginFetch            -> plugin-node-fetch
if shouldUseSiyuanForwardProxy  -> siyuan-forward-proxy   # = isUseSiyuanProxy || forceProxy
else                            -> middleware-fetch
```
> `middleware` 落点在插件内**不一致**：JSON/multipart 走 `corsFetch`（`corsProxyUrl`=corsAnywhereUrl，新版协议）；XML-RPC 走 `proxyFetch`→`CommonFetchClient`（`middlewareUrl`=middlewareUrl，旧协议 `/fetch` POST 包裹）。两者代理地址不同（`cors.terwer.space` vs `api.terwer.space/api/middleware`）。

### 7.3 middleware-fetch 的两种实现
- **`corsFetch`（useProxy，新版）**：`fetch(corsProxyUrl + "/" + url, {headers})`，把 Origin/Referer/Cookie 等不安全头塞进 `x-cors-headers`，响应解析 `cors-received-headers`（含 `Set-Cookie-Array`）。**走 `cfg.corsAnywhereUrl`。**
- **`CommonFetchClient.fetchCall`（旧版）**：`middlewareUrl + "/fetch"`，POST `{fetchParams:{apiUrl,fetchOptions}}`。**走 `cfg.middlewareUrl`**（默认 `api.terwer.space/api/middleware`→404）。

### 7.4 配置字段现状
- `BlogConfig.corsAnywhereUrl?: string`（zhi-blog-api 已有 SD 字段）——但 `commonBlogConfig` 中**被注释（默认空）**，全库无默认值。
- `BlogConfig.middlewareUrl?: string`——部分 web 平台配置，默认 `LEGENCY_SHARED_PROXT_MIDDLEWARE`。
- **`isCorsProxy` 不存在**（zhi-blog-api 无此字段，插件无此字段）——需新增。
- **`cors.terwer.space` 在插件源码零出现**——新版代理未接入。

### 7.5 `cors.terwer.space` 实测（验证方案根基，通过）
- 根路径 `GET https://cors.terwer.space/` → **200**。
- `GET https://cors.terwer.space/https://edit.telegra.ph/check`（无 x-cors-headers）→ `{"error":"Access denied"}`（需 x-cors-headers，代理本身通达）。
- `POST https://cors.terwer.space/https://edit.telegra.ph/check` + `x-cors-headers: {"origin":"https://telegra.ph","referer":"https://telegra.ph/","Content-Type":"text/plain"}` + body `page_id=0` → **成功**：`set-cookie: tph_uuid=JLF1RqPJEqZOjownIIkVMh8chLS9ocH5Yk7NIUwliv`；body `{"save_hash":"a4452f34c3d32dad3138970160e541ae30be","can_edit":false}`；`cors-received-headers` 含 `Set-Cookie-Array:["tph_uuid=…","tph_auth_alert=DELETED"]`。
- **结论**：`cors.terwer.space` + corsFetch 的协议完全匹配；匿名会话可创建，可自动填 Uuid/Hash → V2C 可通过。

---

## 八、安全边界（第一优先级）

1. **SSRF/目标可达性**：`middleware-fetch`（远端代理）**不能**访问 loopback/私网目标，**不得**用于本地/私网平台（远端代理无法到达，且把「哪个目标是本机」泄露给代理）。`isCorsProxy` 仅适用于**公网被墙、需远端代理**的平台（如 Telegraph，目标是公网 telegra.ph）。
2. **敏感头/凭证**：`corsFetch` 把 Origin/Referer/Cookie 塞进 `x-cors-headers` 发往远端代理 → **凭证（tph_uuid/save_hash 等）会经第三方代理**。cors.terwer.space 为作者自营（terwer.space），可信；但设计上必须**由平台适配器显式声明 isCorsProxy**（编码时决定），不得让用户随意开启，避免误把内网/敏感平台走远端代理。
3. **强制 cors 的适用范围**：`isCorsProxy=true` 时应**跳过 plugin-node-fetch 和 siyuan-forward-proxy，直接 middleware-fetch**；但仅对该平台生效（Telegraph），不影响其它平台既有通道。
4. **数据最小化**：Telegraph 匿名会话只用 tph_uuid（非用户真实账号），经代理风险面小；LOGIN_USER 模式的 accessToken 属更敏感凭证，走 cors.terwer.space 需谨慎（或仅匿名走 CORS 代理）。

---

## 九、Telegraph 方案（isCorsProxy）

**目标**：让 Telegraph 走 `corsFetch`（新版 `cors.terwer.space` 代理），绕过 plugin-node-fetch 直连的 DNS 失败。

### 需要改动
1. **`BlogConfig` 加 `isCorsProxy?: boolean`**（zhi-blog-api 框架层；或插件侧扩展）——用于声明"此平台需强制走远端 CORS 代理"。
2. **`resolvePublishTransport` 加 `isCorsProxy` 到 resolve context**：`if (isCorsProxy) return "middleware-fetch"`（置于 canUsePluginFetch 之前，强制走 cors）。
3. **`TelegraphConfig` 设 `corsAnywhereUrl = "https://cors.terwer.space/"` + `isCorsProxy = true`**。
4. **校验/发布走 cors**：`/check`(V2C)、`/save`(newPost/editPost)、`/upload` 均经 corsFetch。
5. UI/i18n：`isCorsProxy` 提示 + `corsAnywhereUrl` 说明（若暴露给用户）；措辞用「科学上网/网络代理」，禁违禁词。

### 安全默认
- `isCorsProxy` **默认受限于平台适配器显式设置**（Telegraph），不开放给用户全局开关（避免误用走远端代理 + 凭证外泄）。
- `cors.terwer.space` 为作者自营，可信；作为新版默认 CORS 代理。

### 待确认
- `isCorsProxy` 放 **zhi-blog-api 框架层**（发版）还是**插件侧扩展**（`TelegraphConfig` 自行声明 + 传输层感知）。
- 是否把 `cors.terwer.space` 设为全局默认 `corsAnywhereUrl`（影响其它需 CORS 代理的平台），还是仅 Telegraph 用。
- 是否需要在配置页暴露 `corsAnywhereUrl`/`isCorsProxy` 给用户（用户建议的方案 A「科学上网代理 URL 配置项」与之相关）。
