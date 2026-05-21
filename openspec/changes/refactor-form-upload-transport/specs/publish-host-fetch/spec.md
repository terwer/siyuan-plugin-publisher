## ADDED Requirements

### Requirement: 插件宿主网络能力 SHALL 由 PluginFetchUtil 单点提供

`PluginFetchUtil` SHALL 作为思源插件 Electron 宿主内直连网络的唯一门闸。`xmlrpcTransport` 与 `formUploadTransport` MUST 在解析通道前查询 `canUsePluginFetch`，MUST NOT 各自复制 `win.require` 检测逻辑。

#### Scenario: 同一会话内 XML-RPC 与 multipart

- **GIVEN** V2 在思源 Electron 中加载插件
- **WHEN** 用户校验 MetaWeblog 并上传网页版图片
- **THEN** 两类操作 MAY 均走 `plugin-node-fetch`
- **AND** 均 MUST NOT 仅因 `forceProxy` 默认走 `forwardProxy`

### Requirement: PluginFetchUtil 表面 SHALL 保持最小且可扩展

`PluginFetchUtil` SHALL 至少提供：`canUsePluginFetch`、`getPluginNodeFetch`（或等价模块加载）、非 multipart 的 `postText`。multipart SHALL 由 `formUploadTransport` 注入的 handler 调用 `zhi-formdata-fetch` 或等价路径，不得在 20 处重复 `win.require`。

#### Scenario: 未来新增宿主通道

- **WHEN** 增加第四种发布传输
- **THEN** 实现 SHALL 扩展 `*Transport` 与 `PublishTransportKind`
- **AND** SHALL 复用 `PluginFetchUtil` 做宿主检测
