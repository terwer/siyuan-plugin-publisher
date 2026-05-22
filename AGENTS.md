## 核心设计原则（必须牢记）

### 1. 大胆重构，小心求证

- **大胆**：以业界当前最佳实践为准，架构上不必保守；宁可一次把抽象立对（如 `formUploadClient.postJson`、`jsonFetchClient.fetch` 单入口），不留双轨和垫片债。
- **小心求证**：每次改动必须有证据链——单测、构建、V2 宿主手验、checklist；禁止 mock/占位糊弄通过。
- **全局触发**：规则与行为改在**共用层**落地（`publishTransport`、`formUploadClient`、`xmlrpcTransport`、基类），禁止在多个适配器各打补丁；改一处，全链路一致。
- **功能 100% 保留**：用户可见行为、平台契约、诊断语义不能悄悄退化；重构的是结构，不是砍能力。
- **优化目标排序**：**最大扩展性** > **可用性/用户体验** > **维护成本**；V2 允许结构性 break change，但不牺牲上述行为保留。

### 2. 高内聚、低耦合

- **对外接口简单**：使用层只认少量入口（如 `webFormFetch`、`postJson`、`getFormData`），不必理解 resolve/handler/`PluginFetchUtil` 组合。
- **对内高内聚**：传输解析、执行、懒加载、`win.require` 检测集中在 facade/transport 模块内部。
- **低耦合**：平台适配器不依赖具体通道实现；XML、multipart、JSON 共用 `publishTransport` 规则、分离实现；不在 `useProxy` 再长平行 if 树。

---

## 用户偏好（已学习）

- 助手回复使用**简体中文**；Git 提交说明使用**英文**。
- V2 宿主开发/验证：使用 `pnpm dev:v2` 与 `pnpm makeLink:v2`；不要建议用 `pnpm dev -p siyuan` 做 V2 验证或开发。
- 不要用「提交未使用/孤儿文件」来清 diff；应删除文件并清理引用。
- 非琐碎代码改动前需有 `.planning/` 或 OpenSpec 规划；禁止无计划的全局大改。
- OpenSpec archive 前严格审计：**根本修复**（非 mock）、**最佳实践**、**不破坏底层设计**、**不影响无关模式**；第三方交付代码同样适用；任一不达标禁止 archive。
- 博客/平台配置校验必须走 `BlogAdaptor` / `api.checkAuth()`，禁止绕过、直接调适配器。
- 禁止在 `useProxy` 与平台适配器里临时堆传输 if 链。V2 发布 HTTP：
  - XML-RPC → `xmlrpcTransport`
  - multipart → **仅** `createFormUploadClient(...).postJson(...)`（`formUploadClient.ts`）；基类不得拼装 resolve/execute/handlers
  - JSON/API → **仅** `createJsonFetchClient(...).fetch(...)`（`jsonFetchClient.ts`）；`BaseWebApi.webFetch` / `BaseBlogApi.apiFetch` 仅委托 facade
  - FormData 构造 → **仅** `FormDataHostUtil`
  - V2 允许 break change；禁止 deprecated 再导出、双轨垫片
- V2 平台验证：**高频优先**（当前批次 #21→#25→#3→#28，可与 `tasks.md` 表号不同）；每站五格 **V2C / Pub / Upd / Del / Img**；通过/失败均记入 checklist SSOT。

## 工作区事实（已学习）

- **V2 宿主**：`pnpm dev:v2`（watch）、`pnpm makeLink:v2`（软链到思源）；产物在 `dist-v2/`。
- **V1**：`pnpm dev -p siyuan`、`pnpm makeLink -p siyuan`；产物在 `dist/`。该链路**不会**启动 V2 的 Vite 配置。
- `PicbedServiceTypeEnum.None` 表示用户明确选择「无图床」；在 `getPicbedServiceType` 等全局逻辑里**不要**把 `None` 当成未设置。
- MetaWeblog 类平台（如博客园）应在平台 `*Config` 构造函数里默认图床为 `Bundled`（参考 `YuquewebConfig`），不要用全局 `usePicgoBridge` 覆盖。
- Agent Skills：项目 `.cursor/skills/` 或 `.claude/skills/`；全局 `~/.cursor/skills/` 或 `~/.claude/skills/`；本仓库 OpenSpec 技能在 `.claude/skills/`。自定义技能**不要**放在 `~/.cursor/skills-cursor/`。
- V2 平台配置校验失败须通过 `SypErrorDetailsPanel`（及行内摘要）展示 `errorMessage`，不要只靠通用 alert 或 `ElMessage`。
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
