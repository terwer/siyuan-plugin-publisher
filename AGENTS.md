## 核心设计原则（必须牢记）

### 0. 插件宿主容器约束（最高优先级）

- **V2 插件挂载在思源宿主 DOM 的 popup/面板区域内**，不是独立网页，不是整个浏览器窗口。
- 所有 UI 锚定在 `.syp-panel` 容器内。弹窗用 `position: absolute` 的 popover 卡片而非 `el-drawer`。
- `el-dialog` 必须设置 `:append-to-body="false"`。
- `.syp-panel` 已有 `position: relative`，可作为 `position: absolute` 弹窗的定位容器。

### 1. 大胆重构，小心求证

- **大胆**：以业界当前最佳实践为准，架构上不必保守；宁可一次把抽象立对（如 `formUploadClient.postJson`、`jsonFetchClient.fetch` 单入口），不留双轨和垫片债。
- **小心求证**：每次改动以单测、构建、V2 宿主手验、checklist 为证据链。
- **全局触发**：规则与行为统一在**共用层**落地（`publishTransport`、`formUploadClient`、`xmlrpcTransport`、基类）；改一处，全链路一致。
- **功能 100% 保留**：用户可见行为、平台契约、诊断语义不能悄悄退化；重构的是结构，不是砍能力。
- **优化目标排序**：**最大扩展性** > **可用性/用户体验** > **维护成本**；V2 允许结构性 break change，但不牺牲上述行为保留。

### 2. 高内聚、低耦合

- **对外接口简单**：使用层只认少量入口（如 `webFormFetch`、`postJson`、`getFormData`），不必理解 resolve/handler/`PluginFetchUtil` 组合。
- **对内高内聚**：传输解析、执行、懒加载、`win.require` 检测集中在 facade/transport 模块内部。
- **低耦合**：平台适配器不依赖具体通道实现；XML、multipart、JSON 共用 `publishTransport` 规则、分离实现。

---

## 用户偏好（已学习）

- 助手回复使用**简体中文**；Git 提交说明使用**英文**。
- V2 宿主开发/验证：使用 `pnpm dev:v2` 与 `pnpm makeLink:v2`。
- 清 diff 时直接删除文件并清理引用。
- 非琐碎代码改动前写 `.planning/` 或 OpenSpec 规划。
- OpenSpec archive 前严格审计：**根本修复**（非 mock）、**最佳实践**、**不破坏底层设计**、**不影响无关模式**，四项全部达标才 archive。
- 博客/平台配置校验走 `BlogAdaptor` / `api.checkAuth()`。
- V2 发布 HTTP 通道规范：
  - XML-RPC → `xmlrpcTransport`
  - multipart → `createFormUploadClient(...).postJson(...)`（`formUploadClient.ts`）
  - JSON/API → `createJsonFetchClient(...).fetch(...)`（`jsonFetchClient.ts`）；`BaseWebApi.webFetch` / `BaseBlogApi.apiFetch` 仅委托 facade
  - FormData 构造 → `FormDataHostUtil`
  - V2 允许 break change，直接重构到位
- V2 平台验证：**高频优先**（当前批次 #21→#25→#3→#28，可与 `tasks.md` 表号不同）；每站五格 **V2C / Pub / Upd / Del / Img**；通过/失败均记入 checklist SSOT。

## Hermes / Agent 项目隔离

- 本仓库固定 profile 名称 `siyuan-plugin-publisher`，启动时显式指定：
  ```bash
  hermes -p siyuan-plugin-publisher
  ```

## 工作区事实（已学习）

- **V2 宿主**：`pnpm dev:v2`（watch）、`pnpm makeLink:v2`（软链到思源）；产物在 `dist-v2/`。
- **V1**：`pnpm dev -p siyuan`、`pnpm makeLink -p siyuan`；产物在 `dist/`。该链路**不会**启动 V2 的 Vite 配置。
- `PicbedServiceTypeEnum.None` 是用户明确选择「无图床」，视为有效值，不是未设置。
- MetaWeblog 类平台（如博客园）在平台 `*Config` 构造函数里设图床为 `Bundled`（参考 `YuquewebConfig`）。
- Agent Skills：项目 `.cursor/skills/` 或 `.claude/skills/`；全局 `~/.cursor/skills/` 或 `~/.claude/skills/`。
- V2 平台配置校验失败通过 `SypErrorDetailsPanel`（及行内摘要）展示 `errorMessage`。
- **发布传输**（XML-RPC / multipart / JSON）：插件宿主优先 `plugin-node-fetch`；本机/回环不走 forwardProxy；multipart 经 `formUploadClient`、JSON 经 `jsonFetchClient`；语雀 Web 不在请求前预设 transport（由 facade 解析后写入 diagnostic）；日志：`[form-upload-transport]`、`[json-fetch-transport]`。
- V2 平台验证 SSOT：`openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`。
- **Halo**：`common_Halo`（API）与 `custom_Haloweb`（网页 Cookie）是两套适配器，须分别验收。
- **`refactor-form-upload-transport`**：归档前须在 V2 宿主手验 checklist **#27、#28 的 Img**（见 checklist 修订记录）。
- 依赖 `zhi-blog-api@^1.79.0`（或更新），保证 `BlogAdaptor.checkAuth()` **返回**结果而不是把适配器结果当异常抛出。

## 发布传输架构（V2，简要）

```text
multipart：平台适配器 → FormDataHostUtil → webFormFetch/apiFormFetch → formUploadClient.postJson()
JSON/API：平台适配器 → webFetch/apiFetch → jsonFetchClient.fetch()
XML-RPC：proxyXmlrpc → xmlrpcTransport

三者共用 publishTransport/resolveTransport 规则，实现分离。
```

通道对外命名：`plugin-node-fetch` | `siyuan-forward-proxy` | `middleware-fetch`（无 `cors-middleware` 对外名）。
