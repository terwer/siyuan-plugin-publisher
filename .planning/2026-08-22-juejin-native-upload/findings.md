# 掘金原生图片上传 — 研究发现

> 只放外部/发现内容（网页、API 响应、探测结果）。更新时机：任何发现后。

## 2026-08-22

- （已确认）掘金适配器无原生 uploadFile，仅依赖 PicGo 图床；`picgoPicbedSupported=true`、`bundledPicbedSupported=false`。
- （已确认）掘金 API 域 `api.juejin.cn`；`/content_api/v1/article_draft/create`、`/article/publish` 可用。
- （已确认）发表文章后 URL 形如 `https://juejin.cn/post/<article_id>`。

## 2026-08-22 下午（chrome-devtools MCP 独立浏览器实测，登录态抓包）— 原生上传链路完整确认 ✅

**结论：掘金编辑器原生图片上传 = 字节 veImageX（ByteDance ImageX）+ TOS 对象存储，
STS 临时凭证 + AWS SigV4 签名。此前「无原生上传/端点猜不出来」的判断是错的——
端点不在前端 bundle 静态字符串里，而是运行时走 `api.juejin.cn/imagex/*` 动态网关。**

### 实测方式
- chrome-devtools MCP 独立浏览器（非 9222 模式）登录掘金 → 新建草稿
  `/editor/drafts/<id>` → 工具栏 `button.medium-editor-action-uploadImage`
  （data-action=uploadImage，MediumEditor 富文本工具栏，聚焦后动态出现）→ upload_file 喂入
  1×1 PNG（69B, base64 iVBORw0KGgo...AAAAElFTkSuQmCC）→ DevTools Network 抓全链路。
- 草稿创建：页面内 `POST /content_api/v1/article_draft/create` 返回 `data.id`（数字串）；
  直接访问 `/editor/drafts/new.v3` 会报 `json: invalid use of ,string struct tag...int64`。

### 五步链路（全部实测 200）

1. **取 STS 令牌**（cookie 鉴权）
   `GET https://api.juejin.cn/imagex/v2/gen_token?aid=2608&uuid=<tea_web_id>&client=web`
   → `data.token = { AccessKeyId, SecretAccessKey, SessionToken(STS2...), ExpiredTime, CurrentTime }`
   - STS Policy 只授权 `ImageX:ApplyImageUpload` + `ImageX:CommitImageUpload`，
     Resource `trn:ImageX:*::*:ServiceId/73owjymdk6`；有效期 ~2h（ExpiredTime-CurrentTime≈7200s）。
   - `uuid` = 字节 tea SDK 的 web_id（cookie `__tea_cookie_tokens_2608.web_id`），追踪用途。

2. **申请上传**（SigV4 签名）
   `GET https://imagex.bytedanceapi.com/?Action=ApplyImageUpload&Version=2018-08-01&ServiceId=73owjymdk6`
   Headers:
   - `Authorization: AWS4-HMAC-SHA256 Credential=<AK>/<yyyymmdd>/cn-north-1/imagex/aws4_request,
     SignedHeaders=x-amz-date;x-amz-security-token, Signature=<hex>`
   - `x-amz-date: <yyyymmddThhmmssZ>`、`x-amz-security-token: <SessionToken>`
   → `Result.UploadAddress`：
     - `StoreInfos[0].StoreUri` = `tos-cn-i-73owjymdk6/<32hexkey>`
     - `StoreInfos[0].Auth` = `SpaceKey/73owjymdk6/1/:version:v2:<HS256 JWT>`（含 oidKey/fileType/expire）
     - `UploadHosts` = `["tos-lf-x.snssdk.com"]`
     - `SessionKey` = base64(JSON)，Commit 时原样回传

3. **二进制直传 TOS**
   `POST https://tos-lf-x.snssdk.com/<StoreUri>`
   Headers: `Authorization: <上步 Auth JWT>`、`Content-Type: application/octet-stream`、
   `Content-CRC32: <crc32 hex 小写8位>`（实测 69B PNG = 2134481d）、
   `content-disposition: attachment; filename="undefined"`（官方就发 undefined）、`x-storage-u:` 空
   Body: **原始字节**（非 multipart！）
   → `{"payload":{"hash":"<crc32>","key":"<32hex>"}}`

4. **提交**
   `POST https://imagex.bytedanceapi.com/?Action=CommitImageUpload&Version=2018-08-01
     &SessionKey=<base64>&ServiceId=73owjymdk6`，**空 body（content-length:0）**，
   同样的 SigV4 签名头
   → `Result.Results[0].{Uri, UriStatus:2000}`；PluginResult 含宽高/md5/format。

5. **换最终 URL**（cookie 鉴权）
   `GET https://api.juejin.cn/imagex/v2/get_img_url?aid=2608&uuid=<web_id>
     &uri=<urlencoded StoreUri>&img_type=private`
   → `data.main_url` = `https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/<32hex>
     ~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:<base64alt>:q75.awebp?policy=<b64{vm:3,uid}> 
     &rk3s=e9ecf3d6&x-orig-authkey=<40hex>&x-orig-expires=<ts,+24h>&x-orig-sign=<sig>`

### 编辑器行为
- 上传完成后 `<img src="main_url">` **直接把私有签名 URL 插进正文**（24h 有效签名参数）。
- img 无 data-* 属性标记 storeUri。
- tplv 模板里的 base64 段是 alt 文本（默认「请输入文章标题」相关串）。

### 插件实现要点（V2 Img 格）
- 仅需 cookie（现有 `custom_Juejin.password`）即可走通全部五步；无需 PicGo。
- 需在 Node 侧实现：CRC32（TOS 头用）+ AWS SigV4（HMAC-SHA256 链：
  kSecret="AWS4"+SK → date → cn-north-1 → imagex → aws4_request；
  payload hash 用空体 SHA256 e3b0c442...b855；query 参数按字母序 canonical 化——
  浏览器发的顺序是 Action,Version,ServiceId 未排序也通过，说明服务端会重排/宽松，
  但复现时按标准字母序最稳）。
- uuid 参数可复用任意稳定 web_id（纯追踪字段）。

## 2026-08-22 傍晚（程序化复现 + 发布验证）— 机制级根因全部钉死 ✅

### 程序化复现成功（页面上下文，自实现 CRC32+SigV4，零依赖 SDK）
五步全绿：gen_token → Apply(自算 SigV4 200) → TOS 裸字节直传(200,
payload.hash=crc32 回显一致) → Commit(UriStatus=2000) → get_img_url(err 0 出图)。
→ **插件 Node 侧可行性证明成立。**

### 机制探针结论（每条都有实测证据）
| 探针 | 结果 | 根因解读 |
|---|---|---|
| 随机 uuid 调 gen_token | err 0 正常发 token | uuid 是 tea 追踪 web_id，服务端不校验 |
| TOS 直传去掉 Content-CRC32 | HTTP 400 MismatchChecksum(4007) | CRC32 **强制**，完整性校验是 TOS 边缘硬约束 |
| 同一 STS token 二次 Apply | 成功 | token 可缓存复用至 ExpiredTime(~2h) |
| article_draft/detail 用 {id} | err 3 | 参数名必须是 **{draft_id}**；响应嵌套 data.article_draft |
| 最小 update 不带 pics[] | err 0 | pics[] 可省略，服务端自行派生 |

### ⭐ 存储契约（最重要发现）
编辑器保存时客户端自己发送的 mark_content/html_content 里图片就是**裸 StoreUri**：
```
mark: ![](tos-cn-i-73owjymdk6/<32hex>)
html: <img src="tos-cn-i-73owjymdk6/<32hex>">
```
- 持久层只存裸 URI；**无域名、无签名、无 tplv 模板**。
- **读时动态重签**：同一草稿隔 11s 两次 detail，x-orig-sign/expires 全变，
  expires ≈ 当前时刻+7天（写死时长），rk3s 从上传时的 e9ecf3d6 变为读取态 f64ab15b。
- 上传时 get_img_url 给的 24h 签名 URL 只是编辑器预览用，不入库。
- **插件应向 mark_content 插入裸 URI**，渲染/发布由掘金解析（草稿 detail 已实测把我们的裸 URI 重签成可访问 URL）。

### 发布链路补充（Img 探针整篇走通）
- update 补 category/tag/brief 后 `article/publish {draft_id}` err 0，
  article_id=7676436966323683328。
- brief_content 为空会 publish 报「参数错误」(err 2)——与 V1 已知坑同根因；
  分类缺失报 err 1002「至少添加一个分类」。
- 新文章初始 status:0 / verify_status:0 / **audit_status:1(审核中)**：
  公开 /post/<id> 404、query_list 里可见但 rtime 空。旧文对照组 audit_status:2/status:1
  才对外可见。**审核排队与上传机制无关**，等待自动放行即可。
- 列表接口是 `POST /content_api/v1/article/query_list`
  body `{user_id, sort_type:2, cursor:"0"}`（我的文章页实际调用）；
  `article_draft/list` 路由已不存在（官方页面调用也返回「请求路由不存在」）。
- is_markdown 注意：我们最小 update 未设 → 文章 is_markdown:0；插件现有 Pub/Upd 链路
  已验证的形态为准，Img 只需往既有 mark_content 插裸 URI，不改其余契约。

### 待清理
- 探针文章 7676436966323683328 + 草稿 7676405390204813327（等审核放行后删，或问用户）。

## 2026-08-22 晚 — 插件实现落地 + 宿主全链路 ✅（真根因只有一个）

### 实现清单
- `src/utils/cryptoUtils.ts`：+`sha256Hex` / `hmacSha256Raw`（WebCrypto，原始字节链）/ `bytesToHex`
- `src/vendors/byteimagex/imagexClient.ts`（新）：CRC32 表 + SigV4 + 三步直传，
  deps 注入 requestJson 通道；正文契约返回裸 StoreUri
- `src/adaptors/web/juejin/juejinWebAdaptor.ts`：+uploadFile（gen_token→五步→get_img_url 预览）
- `src/utils/rawHeaderFetch.ts`（新）：大小写保真通道（undici 引擎，见下）
- `juejinConfig.ts` / `useJuejinWeb.ts`：默认图床改 Bundled（对齐 zhihu/csdn/jianshu 先例）
- `webPicbedDefaults.spec.ts`：+掘金断言（5/5 绿）；build:v2 通过

### ⭐ 真根因（一行）：SigV4 的 amzDate 带了冒号
`20260822T15:59:43Z` ❌ → 必须 `20260822T155943Z` ✅（ISO 串需 `.replace(/[-:]|\.\d{3}/g,"")`）。
带冒号 → 服务端头校验直接 100024 InvalidAuthorization，**与传输层完全无关**。

### 排查弯路存档（全部已证伪，防再绕）
1. 头名大小写（X-Amz-Date vs x-amz-date）：无关——小写化不影响正确签名
2. 通道选择（forceProxy/middleware/node:https/undici）：无关
3. TLS 指纹/BoringSSL vs OpenSSL：无关
4. Origin/Referer 白名单：无关
5. IPv4/IPv6：无 AAAA
6. STS 单次消费：否（同 token 多次 Apply 均可）
7. 「node24-undici 能过」是幸存者偏差：只有官方转录脚本恰好日期剥离正确

### 附带产出（保留，降级为可选能力）
- `public/libs/undici/dist/index.cjs`（esbuild 打包 + node:timers shim；
  Electron renderer 下 undici fetch() 因 WebStream 层挂死，request() 正常 91ms 往返）
- rawHeaderFetch 引擎链：undici.request → node:https → 回退 webFetch facade。
  对掘金非必需，但对未来「头名大小写敏感」平台仍有价值

### 宿主验证证据链（GUI 全程操作）
- 配置页切「当前平台 推荐」→ picbedService=bundled 持久化
- 编辑器 Ctrl+V 贴图 → 资产 image-*.png 自动创建
- 发布面板「更新」→ 更新成功且无图片未同步警告
- 草稿 detail：两图均 `![](tos-cn-i-73owjymdk6/<32hex>)`，零签名 URL
- 文章 7676404118950395938 audit=2 公开，匿名页含 tos-cn-i 图引

### 遗留清理
- 删探针文/草稿：article 7676436966323683328、drafts 7676405390204813327、7676405390205222927
- 杀临时 Chrome（9223 jj_sig_truth）；%TEMP%\jj_*.{js,json,png} 可清

## 2026-08-22 深夜 — 回归复现：文章页图片显示「相对链接」❌（pushback 推翻「存裸 URI 契约」）

用户报告（已删全部旧文后重新从零验证）：上传/发布**均不报错**，但掘金**文章页**图片呈现「相对链接」，
即 `img src` 是无协议/无域名的裸 StoreUri，浏览器按相对路径解析 → 404 不显示。

### 复现证据（V2 宿主 GUI 真实发布，draft 7676498957653164032 / article 7676498957653180416）
- 控制台：`article_draft/create` 与 `article/publish` 均 err 0；mark_content 内图片为
  `![cat](tos-cn-i-73owjymdk6/de74f1c43bf54ceb9b5ee3458210e08a)`（裸 URI，**上传链路 OK**）。
- `imagex/v2/get_img_url` 对同一 StoreUri 返回**完整签名 URL**：
  `https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/...~tplv-...&x-orig-sign=...`
  → **图片资源有效且可重签**，问题不在上传。
- `article_draft/detail`（draft_id）读回 mark_content → **仍是裸 URI 未被重签**（与 2026-08-22 傍晚
  结论「草稿 detail 会把裸 URI 重签」**相反**，该旧结论不可靠）。
- ⭐ **命中根因**：`GET juejin.cn/spost/7676498957653180416`（带作者 cookie，200）返回 SSR HTML：
  ```html
  <img src="tos-cn-i-73owjymdk6/de74f1c43bf54ceb9b5ee3458210e08a" alt="cat" loading="lazy">
  ```
  掘金文章页 SSR **原样输出裸 StoreUri、没有重签** → 浏览器按相对路径 → 图片挂。

### 结论（推翻先前「编辑保存即存裸 URI 契约」）
先前 findings「编辑器保存 mark_content 为裸 StoreUri + 读时重签」在**文章页 SSR 场景不成立**：
掘金 SSR 对 mark_content 里的 `![](tos-cn-i-...)` **不做重签**，因此纯裸 URI 必然渲染成相对链接。
官方**编辑器**行为（upload 后把 `main_url` 完整签名 URL 插入正文，findings 实证）才是可渲染形态。
→ 插件 `uploadFile` 应**返回并让发布链路嵌完整可访问 URL**（对齐官方编辑器），而非嵌裸 StoreUri。
⚠️ 未决：get_img_url 返回的 main_url 是 24h 签名（x-orig-expires≈+24h），而文章页需长期可访问。
   需用官方编辑器对照确认「正文库内存的是带何种签名/域名的 URL、如何避免过期」。

## 2026-08-22 深夜（续）— 官方编辑器对照 + 修复验证 ✅

### 官方编辑器对照（chrome-devtools 独立浏览器，已登录 terwer，draft 7676501851563212815）
在新版 Markdown 编辑器中以 paste 事件上传 64x64 PNG：
- 编辑器插入正文的 markdown 是**完整签名 URL**：
  `![official-test.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/…~tplv-…&rk3s=…&x-orig-sign=…)`。
- `article_draft/detail` 读回 mark_content：仍是**完整签名 URL**，且服务端**读取时动态重签**
  （x-orig-expires 由插入时的 ~+24h 变为读取时的 ~+7d；rk3s/sign 均变化）。
- **结论**：掘金官方正文库存的不是裸 StoreUri，而是带签名的完整 URL；「读时重签」作用于完整 URL。
  裸 StoreUri 服务端不识别、不重签 → 文章页 SSR 原样输出 → 相对链接。
- 即先前「编辑保存即存裸 URI」是对「编辑器展示/预览形态」的误读；**持久化取完整 URL**。

### 修复
`juejinWebAdaptor.uploadFile`：`url` 由 `result.storeUri`（裸）改为 `get_img_url.main_url`（完整签名 URL）；
`preview_url` 同步；取不到 `main_url` 时显式 throw（避免静默写坏图）。

### 宿主验证（9222 直连，reload 后「更新」）
- console：`mark_content` 图片已是完整签名 URL（`61a90eaba2fc432caaf3ba6834d73073~tplv-…`），「文章更新成功」。
- 抓 `juejin.cn/spost/7676498957653180416`：`<img src="https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/61a90eaba2fc432caaf3ba6834d73073~tplv-…">`，
  **bare-storeUri-img count=0 / full-https-img count=1** → 「相对链接」修复确认。
- build:v2 通过；webPicbedDefaults.spec 5/5 绿。


