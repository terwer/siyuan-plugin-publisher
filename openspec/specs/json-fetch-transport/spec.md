# json-fetch-transport Specification

## Purpose

定义 V2 JSON/API 发布请求的统一 facade、传输解析优先级、宿主直连与回退边界，确保平台适配器只调用简洁入口，不在 `useProxy` 或业务层新增平行传输分支。
## Requirements
### Requirement: JSON 发布请求 SHALL 经统一 JSON 传输 facade

V2 JSON/API 发布请求 SHALL 经 `publishTransport` 下的统一 JSON 传输 facade 执行。平台适配器 MUST NOT 直接拼装 `PluginFetchUtil`、思源 `forwardProxy`、middleware fallback 的传输选择分支。

#### Scenario: 平台适配器发起 JSON 请求

- **WHEN** V2 平台适配器需要发起 JSON/API 请求
- **THEN** 适配器 SHALL 调用基类或统一 facade 暴露的单入口方法
- **AND** 适配器 MUST NOT 内嵌 plugin / forwardProxy / middleware 的选择 if 链

### Requirement: JSON 传输 SHALL 复用 publishTransport 共用规则

JSON 传输解析 SHALL 复用 `publishTransport/resolveRules` 与 `publishTargetUtil` 的共用规则，包括 plugin-first 与 loopback/private 禁用 `siyuan-forward-proxy`。

#### Scenario: Electron 插件宿主发起 JSON 请求

- **GIVEN** V2 在思源 Electron 插件宿主中运行且 `PluginFetchUtil.canUsePluginFetch` 为 true
- **WHEN** JSON facade 执行请求
- **THEN** 传输 SHALL 优先使用插件宿主直连能力
- **AND** MUST NOT 仅因 `forceProxy` 而走 `siyuan-forward-proxy`

#### Scenario: loopback 或私网 JSON 目标

- **GIVEN** JSON 请求目标为 loopback 或私网地址
- **WHEN** 插件宿主直连不可用
- **THEN** 传输 MUST NOT 选择 `siyuan-forward-proxy`
- **AND** SHALL 选择可执行的本地/middleware 回退路径

### Requirement: useProxy SHALL NOT 增长第四套传输解析树

迁移 JSON 传输时，`useProxy` SHALL 保持为底层执行能力提供者，而不是新增或扩展独立的 transport resolver。新增规则 MUST 落在 `publishTransport` 子模块。

#### Scenario: 审查 useProxy 变更

- **WHEN** 审查 JSON 传输迁移的代码差异
- **THEN** `useProxy` MUST NOT 新增平行于 XML-RPC 与 multipart 的第四套传输选择 if 树
- **AND** 新的传输优先级 MUST 可在 `publishTransport` 下单点审查

