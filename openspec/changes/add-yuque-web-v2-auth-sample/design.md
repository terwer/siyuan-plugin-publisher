## Context

本变更的背景是两条线叠加：

1. 语雀 API 授权在实测中配置阶段即可能返回 `429 Too Many Requests`，导致全量回归中语雀 API 平台基本不可用。
2. V2 需要一个足够简单、真实可用的网页授权平台作为样板，用来沉淀“Cookie 授权 + 网页内部接口 + V2 配置桥接 + 发布闭环 + 用户化错误”的实现标准。

本设计参考现有 Halo 网页版：

- `src/adaptors/web/haloweb/HalowebConfig.ts`
- `src/adaptors/web/haloweb/useHalowebWeb.ts`
- `src/adaptors/web/haloweb/HalowebWebAdaptor.ts`
- `src/components/set/publish/singleplatform/web/HalowebSetting.vue`
- `src/components/v2/settings/bridge/bridgeRegistry.ts`

但语雀网页版不能照抄 Halo 的内容结构。Halo 有稳定 Console API；语雀 Web 编辑器默认使用 Lake/ASL，但通过真实接口验证，`POST /api/docs` 支持 `format: "markdown"`，这更适合发布工具的长期维护。

## Evidence

通过用户本地已登录 Chrome DevTools 抓取到的语雀 Web 行为如下，所有敏感字段输出时已脱敏：

### 用户与知识库

- 当前登录用户路径：`https://www.yuque.com/dashboard`
- 测试知识库页面：`https://www.yuque.com/terwer/note`
- 用户 login：`terwer`
- bookSlug：`note`
- bookId：`25033491`
- bookName：`学习笔记`

关键接口：

```http
GET /api/mine
GET /api/books/25033491/overview
GET /api/docs?book_id=25033491
GET /api/docs/{docSlug}?book_id=25033491&include_contributors=true&include_like=true&include_hits=true&merge_dynamic_data=false
```

### 新建文档（网页默认 Lake）

点击语雀网页“新建文档”时实测请求：

```http
POST /api/docs
Content-Type: application/json
```

```json
{
  "book_id": 25033491,
  "type": "Doc",
  "format": "lake",
  "title": "无标题文档",
  "slug": "ruglinmovff9wmvq",
  "body_draft_asl": null,
  "status": 0,
  "insert_to_catalog": true,
  "action": "prependChild"
}
```

响应包含：

```json
{
  "data": {
    "id": 268840766,
    "title": "无标题文档",
    "slug": "ruglinmovff9wmvq",
    "book_id": 25033491,
    "format": "lake"
  }
}
```

### 保存/更新文档（网页 Lake 编辑器）

在网页编辑器修改标题和正文并点击“更新”时，实测链路：

```http
PUT /api/docs/268840766/lock
POST /api/docs/268840766/unlock?ctoken=<redacted>&uuid=<dynamic>
PUT /api/docs/268840766/meta
PUT /api/docs/268840766/content
POST /api/docs/268840766/unlock?ctoken=<redacted>&uuid=<dynamic>
```

标题更新：

```json
{"title":"语雀网页版 V2 CDP 测试 - 可删除"}
```

内容更新（Lake 编辑器路径）：

```json
{
  "format": "lake",
  "body_asl": "<!doctype lake>...",
  "draft_version": 0,
  "sync_dynamic_data": false,
  "created_by": "online",
  "body_html": "<div class=\"lake-content\">...</div>",
  "_without_draft_version": 1,
  "save_type": "user",
  "edit_type": "Lake",
  "target_uuid": null
}
```

结论：Lake 编辑器链路可以作为理解网页行为的证据，但不适合作为发布工具首期内容生成方案，因为 ASL/签名片段属于语雀编辑器内部格式，维护成本和兼容风险高。

### 删除文档

实测可用删除接口：

```http
DELETE /api/docs/268840766
```

响应 `200`，返回被删除文档数据。随后读取原 slug：

```http
GET /api/docs/ruglinmovff9wmvq?book_id=25033491
```

返回：

```json
{"status":404,"message":"Not Found"}
```

### Markdown 格式证据

通过 Web 同源上下文验证：

```http
POST /api/docs
Content-Type: application/json
```

```json
{
  "book_id": 25033491,
  "type": "Doc",
  "format": "markdown",
  "title": "语雀网页版 Markdown 接口测试 - 可删除",
  "slug": "publisher-v2-md-test-...",
  "body": "# 一级标题\n\n这是通过网页版 /api/docs format=markdown 创建的测试正文...",
  "status": 0,
  "insert_to_catalog": true,
  "action": "prependChild"
}
```

列表接口随后返回该文档：

```json
{
  "id": 268846480,
  "title": "语雀网页版 Markdown 接口测试 - 可删除",
  "slug": "publisher-v2-md-test-...",
  "book_id": 25033491,
  "format": "markdown",
  "status": 0
}
```

结论：语雀 Web `/api/docs` 支持 Markdown 格式。首期应走 Markdown 主路径，而不是生成 Lake ASL。

### 图片证据当前状态

已有编辑页抓到图片转存失败示例：

```http
GET /api/filetransfer/images?url=assets%2F...
```

返回 `422 url invalid`。这只能证明语雀会尝试转存不合法相对图片，不能作为 `newMediaObject` 的最终上传接口证据。实施阶段必须继续通过真实网页上传/粘贴图片抓到上传接口后再实现图片上传。

## Goals / Non-Goals

**Goals:**

- 新增语雀网页版作为 V2 网页授权最小样板。
- 与现有语雀 API 平台并存，避免破坏旧用户配置。
- 复用现有网页授权基类、设置组件、发布主链路、V2 桥接机制。
- 支持 Cookie 登录态校验、知识库选择、新建、更新、删除、预览。
- 内容主路径使用 Markdown 格式，避免 Lake/ASL 私有格式维护风险。
- 图片上传必须通过真实 Web 接口证据实现，并接入 `newMediaObject`，不另写 Markdown 图片解析器。
- 错误提示必须面向用户，可执行、可理解、无敏感信息。

**Non-Goals:**

- 不替换或删除现有 `common_Yuque` API 平台。
- 不在首期支持语雀所有高级能力，例如协同编辑、目录拖拽、模板、画板、表格数据库、评论。
- 不引入 Lake ASL 生成器作为首期主方案。
- 不新增一套 V2 专用平台配置系统。
- 不新增一套发布链路外的图片识别/替换逻辑。
- 不绕过语雀登录、验证码或权限模型。

## Decisions

### 1. 平台形态：新增 `custom_Yuqueweb`

新增网页授权子平台，建议命名：

- `PRE_CUSTOM_YUQUEWEB = "custom_Yuqueweb"`
- `SubPlatformType.Custom_Yuqueweb = "Yuqueweb"`
- 平台显示名：`语雀网页版`
- `PlatformType.Custom`
- `AuthMode.WEBSITE`
- `authUrl = "https://www.yuque.com/login"`
- `domain = "yuque.com"`

理由：

- 语雀网页版和语雀 API 的授权方式、接口、错误模式都不同。
- 用独立平台避免混淆 token 与 Cookie。
- 与 Halo 网页版形态一致，便于用户理解“API 版”和“网页版”的区别。

替代方案：把现有 `common_Yuque` 改造成自动 fallback 到 Web。否定原因：会混合 token/Cookie 配置，破坏已有稳定用户，且不利于 V2 样板沉淀。

### 2. 配置模型：继承 `CommonWebConfig`

新增 `YuquewebConfig extends CommonWebConfig`，关键默认值：

- `home = "https://www.yuque.com"`
- `apiUrl = "https://www.yuque.com"`
- `passwordType = PasswordType.PasswordType_Cookie`
- `usernameEnabled = false` 或仅作为可选 login 展示字段
- `showTokenTip = false`
- `cateEnabled = true`
- `categoryType = CategoryTypeEnum.CategoryType_Single`
- `knowledgeSpaceEnabled = true`
- `allowCateChange = true`
- `previewUrl = "/{login}/{bookSlug}/{slug}"`
- `pageType = PageTypeEnum.Markdown`

Cookie 存储沿用 `cfg.password`，不新增 secret 存储格式。

### 3. 内容格式：首期使用 Markdown

主路径使用：

```http
POST /api/docs
PUT /api/docs/{id}/meta
PUT /api/docs/{id}/content 或 PUT /api/docs/{id}
```

其中新建优先按实测接口：

```json
{
  "book_id": "<bookId>",
  "type": "Doc",
  "format": "markdown",
  "title": "<title>",
  "slug": "<slug>",
  "body": "<markdown>",
  "status": 0,
  "insert_to_catalog": true,
  "action": "prependChild"
}
```

更新接口需要实施阶段在 Markdown 文档上继续抓证据确认，优先验证：

1. `PUT /api/docs/{id}` 是否可直接更新 `title/slug/body/format`。
2. `PUT /api/docs/{id}/meta` + `PUT /api/docs/{id}/content` 是否支持 `format: "markdown"` + `body`。

实施要求：如果更新接口证据不足，不允许猜测合入；必须继续用 CDP 在 Markdown 测试文档上抓取真实保存请求。

### 4. postid 元信息：使用 JSON

语雀网页版返回的绑定 id 不应只保存数字 docId。建议新增 `YuquewebPostMeta`：

```ts
class YuquewebPostMeta {
  id: string
  slug: string
  bookId: string
  bookSlug: string
  login: string
  format: "markdown"
  url?: string
}
```

序列化为 JSON 字符串作为 postid，类似 Halo Web 的 `HalowebPostMeta`。

理由：

- 更新/删除需要 doc id。
- 预览需要 login、bookSlug、docSlug。
- 知识库切换或后续扩展需要 bookId/bookSlug。
- JSON 格式比拼接字符串可维护。

### 5. 知识库发现：先用真实可验证接口，禁止 mock

候选接口：

- `GET /api/mine`
- `GET /api/mine/common_used`
- `GET /api/mine/user_books?user_type=Group&offset=0&limit=...`
- 从已知知识库页面验证的 `GET /api/books/{bookId}/overview`
- `GET /api/docs?book_id={bookId}`

实施策略：

1. `getMetaData()` 用 `/api/mine` 校验登录态并提取 login/displayName/avatar。
2. `getUsersBlogs()` 必须基于真实返回的知识库列表接口。
3. 如果某个列表接口只返回组织或只返回最近使用，不得静默伪造完整知识库列表；应清晰记录接口范围，并在 UI 文案里说明。
4. `UserBlog.blogid` 建议保存 JSON 或稳定组合值，至少能还原 `bookId/bookSlug/login`。

### 6. 图片上传：必须走 `newMediaObject`，不得私写解析

发布工具已有图片处理主链路会识别 Markdown 图片并调用平台 `newMediaObject`。语雀网页版只应实现上传单张图片并返回 `Attachment.url`。

禁止：

- 在语雀网页版适配器里重写 Markdown 图片正则。
- 在删除、更新或发布中单独扫描 Markdown 图片并替换。
- 用与发布主链路不一致的图片发现规则。

实施阶段必须补抓真实上传证据。可能路径包括：

- 网页编辑器粘贴图片。
- 网页编辑器工具栏上传本地图片。
- 素材库上传。

只有确认接口、字段、响应 URL 后，才能实现 `newMediaObject`。

### 7. 错误处理：适配器内集中映射

新增私有请求封装 `yuquewebFetch()` / `yuquewebFormFetch()`，负责：

- 自动加 `Cookie: cfg.password`。
- JSON body 序列化。
- 解析 `status/message/data`。
- 将 401/403/404/429/422 等转换为用户化错误。
- 日志中敏感字段脱敏。

建议错误映射：

- 401/403：`语雀登录已失效或没有权限，请重新登录语雀后重新获取 Cookie。`
- 404：`语雀文档不存在或当前账号无权访问。`
- 429：`语雀请求过于频繁，请稍后重试。`
- 422 图片：`语雀无法处理该图片地址，请确认图片已上传或改用本地图片重新发布。`
- 网络失败：`无法连接语雀，请检查网络或稍后重试。`

### 8. V2 桥接：复用已有桥接注册

新增设置组件后，将其注册到：

- `SingleSettingIndex.vue`
- `src/components/v2/settings/bridge/bridgeRegistry.ts`

V2 不新增独立配置表单，不绕开现有保存逻辑。

## Proposed Files

新增：

- `src/adaptors/web/yuqueweb/YuquewebConfig.ts`
- `src/adaptors/web/yuqueweb/YuquewebWebPlaceholder.ts`
- `src/adaptors/web/yuqueweb/YuquewebPostMeta.ts`
- `src/adaptors/web/yuqueweb/YuquewebWebAdaptor.ts`
- `src/adaptors/web/yuqueweb/useYuquewebWeb.ts`
- `src/components/set/publish/singleplatform/web/YuquewebSetting.vue`

修改：

- `src/platforms/PreConstants.ts`
- `src/platforms/pre.ts`
- `src/platforms/dynamicConfig.ts`
- `src/adaptors/index.ts`
- `src/components/set/publish/singleplatform/SingleSettingIndex.vue`
- `src/components/v2/settings/bridge/bridgeRegistry.ts`
- `src/locales/zh_CN.ts`
- `src/locales/en_US.ts`
- `siyuan/i18n/zh_CN.json`
- `siyuan/i18n/en_US.json`
- 相关测试/清单文档

## Migration Plan

1. 仅新增平台，不迁移旧配置。
2. 先完成注册、配置表单、登录态校验和知识库读取。
3. 再完成 Markdown 新建/更新/删除/预览闭环。
4. 补抓并实现图片上传。
5. 接入 V2 桥接并做人工全链路测试。
6. 若语雀 Web 接口变化导致平台不可用，可禁用 `custom_Yuqueweb` 预置入口或给出用户化提示；不影响 `common_Yuque`。

## Risks / Trade-offs

- [Risk] 语雀 Web 内部接口非公开，可能变化 → Mitigation：隔离在 `YuquewebWebAdaptor`，不污染 base，不替换 API 平台。
- [Risk] Markdown 更新接口尚需补证据 → Mitigation：任务中将 Markdown 更新抓包列为实现前置门禁。
- [Risk] 图片上传接口尚未确认 → Mitigation：图片任务阻塞到真实上传证据完成，不允许猜测实现。
- [Risk] Cookie 过期导致用户困惑 → Mitigation：配置页提供明确“重新登录并读取 Cookie”文案。
- [Risk] 429 仍可能存在 → Mitigation：错误文案明确限流原因，避免误判为配置错误；不把网页版宣传为完全规避限流。
- [Risk] V1/V2 桥接互相影响 → Mitigation：复用现有桥接注册和持久化结构，新增平台独立 key。

## Open Questions

- Markdown 更新最终接口需要在 Markdown 文档编辑页继续确认：是 `PUT /api/docs/{id}` 还是 `/meta + /content`。
- 知识库全量列表接口需要继续确认哪一个最稳定覆盖个人和组织知识库。
- 图片上传接口需要继续通过网页上传/粘贴图片抓包确认。
