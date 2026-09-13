# publish-host-fetch Specification

## Purpose

定义思源 Electron 插件宿主内直连网络能力的统一门闸与最小 API 表面，确保 XML-RPC、multipart 及后续传输 facade 复用同一宿主检测与执行能力。
## Requirements
### Requirement: 插件宿主网络能力 SHALL 由 PluginFetchUtil 单点提供

`PluginFetchUtil` SHALL 作为思源插件 Electron 宿主内直连网络的门闸。`xmlrpcTransport` 与 **`formUploadClient`（内部）** MUST 查询 `canUsePluginFetch`，MUST NOT 在基类或适配器重复 `win.require` 检测。

#### Scenario: 同一会话内 XML-RPC 与 multipart

- **GIVEN** V2 在思源 Electron 中加载插件
- **WHEN** 用户校验 MetaWeblog 并上传网页版图片
- **THEN** 两类操作 MAY 均走 `plugin-node-fetch`
- **AND** 均 MUST NOT 仅因 `forceProxy` 默认走 `forwardProxy`

### Requirement: PluginFetchUtil 表面 SHALL 保持最小且可扩展

`PluginFetchUtil` SHALL 提供 `canUsePluginFetch`、`getPluginNodeFetch`、`postText` 等。multipart 的 `zhi-formdata-fetch` SHALL 由 **`formUploadClient` 在 plugin-node-fetch 分支内懒加载**，不得在基类每次 `webFormFetch` 前调用 `getFormDataFetch`。

#### Scenario: 未来新增宿主通道

- **WHEN** 增加新的发布传输
- **THEN** 实现 SHALL 扩展 facade 内部解析与执行
- **AND** SHALL 复用 `PluginFetchUtil` 做宿主检测

