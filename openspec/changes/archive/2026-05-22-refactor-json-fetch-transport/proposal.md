## Why

XML-RPC 与 multipart 已进入 `publishTransport` 顶层规则，但 JSON/API 发布请求仍主要散落在 `useProxy`、`apiFetch`、`webFetch` 及平台适配器调用约定中。后续如果继续在 `useProxy` 增长平行 if 树，会重新制造与本次 multipart 重构相同的使用层心智负担。

## What Changes

- 新增 JSON 发布传输的独立重构 change，作为 `refactor-form-upload-transport` 的后续工作承接项。
- 将 JSON/API fetch 的传输解析迁入 `publishTransport` 子模块，复用 plugin-first、loopback/private 禁 forwardProxy 等共用规则。
- 为 JSON 请求提供简洁 facade/统一入口，避免平台适配器直接拼装 `PluginFetchUtil`、`forwardProxy`、middleware 分支。
- 保持本 change 仅为后续功能设计与跟踪，不在 multipart 归档中混入 JSON 代码改造。

## Capabilities

### New Capabilities
- `json-fetch-transport`: V2 JSON/API 发布请求的统一传输 facade 与顶层解析规则。

### Modified Capabilities
- `yuque-web-publishing`: 后续语雀网页版 JSON 请求应接入统一 JSON 传输诊断，不再依赖散落在 `webFetch` 的独立分支语义。

## Impact

- 影响范围：`src/composables/useProxy.ts`、`BaseWebApi.webFetch`、`BaseBlogApi.apiFetch`、JSON/API 平台适配器调用链、传输诊断与相关测试。
- 预期收益：JSON、XML-RPC、multipart 三类发布网络通道共享同一顶层规则，降低使用层心智并防止 `useProxy` 继续膨胀。
- 风险：JSON 请求覆盖平台多，必须分阶段迁移并保留现有行为验证证据。
