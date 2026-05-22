## Context

`refactor-form-upload-transport` 已完成 XML-RPC 与 multipart 的顶层传输规则对齐：插件宿主优先、loopback/private 禁 forwardProxy、使用层只接触 facade。JSON/API 请求仍在 `apiFetch` / `webFetch` / `useProxy` 链路中承载较多传输分支，后续扩展容易重新变成第四套 if 树。

## Goals / Non-Goals

**Goals:**
- 为 JSON/API 发布请求建立与 XML-RPC、multipart 一致的 `publishTransport` 顶层抽象。
- 对使用层暴露唯一、简洁、通用的 JSON 请求入口。
- 将传输解析、诊断、fallback 规则集中到 JSON facade 内部。
- 分阶段迁移高频平台，保留可回归验证证据。

**Non-Goals:**
- 不在本设计中改造 multipart；multipart 继续由 `formUploadClient.postJson` 负责。
- 不为了兼容保留新的 deprecated facade 或双轨 API。
- 不一次性重写所有平台业务逻辑。

## Decisions

1. **JSON facade 与 transport resolver 同属 `publishTransport` 体系**
   - 方案：新增 `jsonFetchTransport`/`jsonFetchClient` 一类模块，内部 resolve + execute，对外只暴露一个 JSON 请求入口。
   - 理由：避免在 `BaseWebApi` / `BaseBlogApi` 或平台适配器中重复理解 plugin/forwardProxy/middleware 组合。

2. **`useProxy` 降级为执行依赖，不再承载新增 resolver**
   - 方案：保留现有 `proxyFetch` / `corsFetch` 能力作为 handler/deps 注入，但优先级判断在 `publishTransport`。
   - 理由：防止 `useProxy` 成为 JSON、XML、multipart 之外的第四套传输 if 树。

3. **先迁移高频/高风险平台，再扩大覆盖**
   - 方案：优先覆盖语雀网页版、MetaWeblog/博客园相关 JSON 辅助请求，以及 V2 配置验证链路中高频平台。
   - 理由：JSON 请求平台跨度大，分阶段更利于定位回归。

## Risks / Trade-offs

- [Risk] JSON 请求行为覆盖平台多，统一入口可能改变某些边缘 content-type/encoding 行为 → Mitigation：保留自动化测试 + V2 平台 checklist 分阶段手验。
- [Risk] facade 名称和边界设计不当会重复 multipart 早期复杂度 → Mitigation：基类仅委托 facade，禁止 adaptor 拼 resolver/handlers，添加 raw-source guard 测试。
- [Risk] 诊断字段与现有错误展示不兼容 → Mitigation：先复用 `PublishTransportDiagnostic` 字段，再按平台补充扩展字段。
