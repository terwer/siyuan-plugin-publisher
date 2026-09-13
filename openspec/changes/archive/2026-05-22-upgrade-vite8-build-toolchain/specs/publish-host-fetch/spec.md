## MODIFIED Requirements

### Requirement: Host fetch transport selection
publish host fetch layer MUST 根据 host capability 和 target URL safety，为 API、XML-RPC、JSON、multipart/form-data requests 选择正确 transport。在 SiYuan Electron/plugin host 中，direct plugin fetch 可用时 MUST 继续作为 preferred transport；local 或 loopback targets MUST NOT 经由 SiYuan `forwardProxy` 路由。

#### Scenario: XML-RPC uses plugin fetch in Electron host
- **WHEN** `PluginFetchUtil.canUsePluginFetch` 为 true，且 V2 plugin host 发起 XML-RPC request
- **THEN** request 会通过 bundled plugin/node fetch path 执行，并向调用方返回 normalized XML text

#### Scenario: Loopback XML-RPC avoids forwardProxy
- **WHEN** XML-RPC endpoint 是 local 或 loopback，例如 `127.0.0.1`、`localhost` 或 private local development URLs
- **THEN** transport selection MUST NOT 选择 SiYuan `forwardProxy`

#### Scenario: Multipart upload uses plugin fetch when available
- **WHEN** Electron/plugin host 请求 multipart/form-data upload，且 direct plugin fetch 可用
- **THEN** upload 使用 plugin/node fetch path，而不是 ad-hoc browser fetch 或 forwardProxy routing

#### Scenario: Browser fallback remains available
- **WHEN** plugin/node fetch 不可用，且 target 可安全使用 browser middleware execution
- **THEN** transport layer 可以根据现有 transport resolver rules 回退到 middleware/browser fetch

#### Scenario: Vite 8 build preserves transport behavior
- **WHEN** 项目使用 Vite 8 build，且 V2 plugin 已在 SiYuan 中加载
- **THEN** XML-RPC、JSON fetch、multipart/form-data transport tests 和 manual publish flows 保持升级前相同的 selection order 与 loopback safety behavior
