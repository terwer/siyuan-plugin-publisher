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
- [ ] host 下匿名 V2C（点「验证」）是否能真实创建 telegra.ph 会话（取决公网 middleware 可达性）。
- [ ] newPost 是否真实产出一篇 telegra.ph 文章（是否因 cookie/代理失败）。
- [ ] 「查看」链接 `https://telegra.ph/<path>` 是否能打开。
- [ ] Img：配置「PicGo」+ 公网图床后，发布含本地图文档，文章 `<img>` 是否为公网 URL 且可访问；若只用本地资产图，文章图片是否空白（预期会空白，验证「投机」坑属实）。
- [ ] Upd：`editPost` 用 `page_id` 覆盖是否真更新同一篇。
- [ ] Del：确认 `deletePost` 必然抛错（无法删除）——作为结论。
