## 用户偏好（已学习）

- 助手回复使用**简体中文**；Git 提交说明使用**英文**。
- V2 宿主开发/验证：使用 `pnpm dev:v2` 与 `pnpm makeLink:v2`；不要建议用 `pnpm dev -p siyuan` 做 V2 验证或开发。
- 不要用「提交未使用/孤儿文件」来清 diff；应删除文件并清理引用。
- 非琐碎代码改动前需有 `.planning/` 或 OpenSpec 规划；禁止无计划的全局大改。
- OpenSpec archive 前做严格审计（真修复 vs mock、最佳实践、设计完整性、无关模式）；任一不通过则禁止 archive。
- 博客/平台配置校验必须走 `BlogAdaptor` / `api.checkAuth()`，禁止绕过、直接调适配器。
- 禁止在 `useProxy` 与平台适配器里临时堆传输 if 链。V2 发布 HTTP：
  - XML-RPC → `xmlrpcTransport`
  - multipart → **仅** `createFormUploadClient(...).postJson(...)`（`formUploadClient.ts`）；基类不得拼装 resolve/execute/handlers
  - FormData 构造 → **仅** `FormDataHostUtil`
  - V2 允许 break change；禁止 deprecated 再导出、双轨垫片
- V2 平台验证：优先高频平台；通过/失败仍记入 OpenSpec checklist SSOT。

## 工作区事实（已学习）

- **V2 宿主**：`pnpm dev:v2`（watch）、`pnpm makeLink:v2`（软链到思源）；产物在 `dist-v2/`。
- **V1**：`pnpm dev -p siyuan`、`pnpm makeLink -p siyuan`；产物在 `dist/`。该链路**不会**启动 V2 的 Vite 配置。
- `PicbedServiceTypeEnum.None` 表示用户明确选择「无图床」；在 `getPicbedServiceType` 等全局逻辑里**不要**把 `None` 当成未设置。
- MetaWeblog 类平台（如博客园）应在平台 `*Config` 构造函数里默认图床为 `Bundled`（参考 `YuquewebConfig`），不要用全局 `usePicgoBridge` 覆盖。
- Agent Skills：项目 `.cursor/skills/` 或 `.claude/skills/`；全局 `~/.cursor/skills/` 或 `~/.claude/skills/`；本仓库 OpenSpec 技能在 `.claude/skills/`。自定义技能**不要**放在 `~/.cursor/skills-cursor/`。
- V2 平台配置校验失败须通过 `SypErrorDetailsPanel`（及行内摘要）展示 `errorMessage`，不要只靠通用 alert 或 `ElMessage`。
- **MetaWeblog XML-RPC**（插件/Electron 宿主）：`PluginFetchUtil.canUsePluginFetch` 为真时用 bundled `plugin-node-fetch`（`PluginFetchUtil.postText`），**不要**走思源 `forwardProxy`；本机/回环目标永不走 forwardProxy。
- **multipart 图片上传**：同上规则，经 `formUploadClient`；日志示例：`[form-upload-transport] transport => plugin-node-fetch`。
- 语雀等 Web 带图：`build-formdata` 阶段**不要**预设 `diagnostic.transport = "siyuan-forward-proxy"`；transport 由 `formUploadClient` 解析后写入。
- V2 平台验证 SSOT：`openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`。
- 依赖 `zhi-blog-api@^1.79.0`（或更新），保证 `BlogAdaptor.checkAuth()` **返回**结果而不是把适配器结果当异常抛出。

## 发布传输架构（V2，简要）

```text
平台适配器 → FormDataHostUtil.getFormData()
           → BaseWebApi.webFormFetch / BaseBlogApi.apiFormFetch
           → formUploadClient.postJson()   ← multipart 唯一对外入口

XML-RPC：proxyXmlrpc → xmlrpcTransport（与 multipart 共用 publishTransport 规则，实现分离）
```

通道对外命名：`plugin-node-fetch` | `siyuan-forward-proxy` | `middleware-fetch`（无 `cors-middleware` 对外名）。
