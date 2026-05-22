# form-upload-transport Specification

## Purpose

定义 V2 multipart/form-data 图片上传的统一 facade、传输优先级、宿主能力边界与诊断要求，确保 Web/API 适配器只使用简洁单入口而不重复拼装传输分支。
## Requirements
### Requirement: Multipart 上传 SHALL 经 formUploadClient facade 单入口

所有 multipart 表单上传（Web `webFormFetch` 与 API `apiFormFetch`）SHALL 仅通过 `createFormUploadClient(...).postJson(...)` 完成。`resolveFormUploadTransport` 与执行逻辑 SHALL 为 facade **内部实现**，不得作为基类或平台适配器的公开调用契约。平台适配器 MUST NOT 内嵌传输选择 if 链，MUST NOT 在每次请求手动拼装 handler。

#### Scenario: Web 适配器上传图片

- **WHEN** Web 适配器以构造好的 `FormData` 调用 `webFormFetch`
- **THEN** `BaseWebApi` SHALL 仅委托 `formUploadClient.postJson`
- **AND** 日志 SHALL 包含 `[form-upload-transport] transport => <通道名>`
- **AND** 基类实现 MUST NOT 出现 `resolveFormUploadTransport`、`executeFormUpload` 或 handler 对象字面量

#### Scenario: API 适配器上传图片

- **WHEN** API 适配器调用 `apiFormFetch`
- **THEN** `BaseBlogApi` SHALL 仅委托 `formUploadClient.postJson`
- **AND** 与 Web 共用同一 facade 实现

### Requirement: 插件宿主 SHALL 优先 plugin-node-fetch

当 `PluginFetchUtil.canUsePluginFetch` 为 true，facade 内部解析 SHALL 选择 `plugin-node-fetch`，且 MUST NOT 对该请求使用思源 `forwardProxy`，即使 `forceProxy` 为 true。

#### Scenario: V2 Electron 上传公网 HTTPS 图片

- **GIVEN** `canUsePluginFetch` 为 true
- **WHEN** `postJson` 执行
- **THEN** 通道 SHALL 为 `plugin-node-fetch`
- **AND** 日志 MUST NOT 对该请求显示 `siyuan-forward-proxy`

### Requirement: 本机与私网目标 SHALL 禁止 forwardProxy

loopback/私网目标（`publishTargetUtil.isLoopbackOrLocalTargetUrl`）时，facade MUST NOT 选择 `siyuan-forward-proxy`。无 `canUsePluginFetch` 时 MUST NOT 返回 `plugin-node-fetch`，SHALL 选择可执行的 `middleware-fetch`。

#### Scenario: 上传到 localhost 且无插件 fetch

- **GIVEN** 目标为 loopback/私网且 `canUsePluginFetch` 为 false
- **WHEN** facade 解析通道
- **THEN** 通道 SHALL 为 `middleware-fetch`
- **AND** MUST NOT 为 `plugin-node-fetch` 或 `siyuan-forward-proxy`

### Requirement: forwardProxy SHALL 仅为回退通道

无插件直连且满足共用 `shouldUseSiyuanForwardProxy` 时，facade MAY 使用 `siyuan-forward-proxy`。本变更 MUST NOT 删除 forwardProxy 实现。

#### Scenario: 外部浏览器且无 canUsePluginFetch

- **GIVEN** `canUsePluginFetch` 为 false
- **AND** 代理谓词满足且目标非 loopback/私网
- **WHEN** `postJson` 执行
- **THEN** 通道 SHALL 为 `siyuan-forward-proxy`

### Requirement: postJson SHALL 返回业务 JSON 且懒加载插件 fetch

`postJson` SHALL 返回解析后的 JSON 对象。`FormDataHostUtil.getFormDataFetch` SHALL 仅在 facade 选定 `plugin-node-fetch` 并执行该分支时调用；forwardProxy 与 middleware 路径 MUST NOT 调用 `getFormDataFetch`。

#### Scenario: forwardProxy 路径不触碰 win.require

- **GIVEN** 解析结果为 `siyuan-forward-proxy`
- **WHEN** `postJson` 执行网络请求
- **THEN** `getFormDataFetch` MUST NOT 被调用

### Requirement: FormData 构造 SHALL 与传输彻底分离

`FormDataHostUtil` SHALL 仅提供宿主 `FormData`/`Blob` 构造。传输 MUST 仅经 `formUploadClient` facade。

#### Scenario: 新增带图 Web 平台

- **WHEN** 实现 `newMediaObject`
- **THEN** 开发者 SHALL 只组合 `getFormData` + `webFormFetch`
- **AND** MUST NOT 拷贝 transport 分支或调用 `getFormDataFetch`

### Requirement: Multipart 诊断 SHALL 反映真实解析通道

Web 路径 SHALL 支持经 `postJson` 传入的 `diagnostic`。在通道由 facade 解析之前，适配器 MUST NOT 默认 `transport: "siyuan-forward-proxy"`；未选定时 SHALL 省略 transport 或使用 `"unresolved"`。facade 执行网络 I/O 时 SHALL 写入真实 transport。

#### Scenario: 语雀 build-formdata 阶段失败

- **WHEN** 语雀图片上传在构造 FormData 阶段失败且尚未调用 `postJson`
- **THEN** 错误 diagnostic MUST NOT 显示 `siyuan-forward-proxy` 为已选定通道
- **AND** `stage` MAY 为 `build-formdata`

#### Scenario: V2 语雀网络阶段失败

- **WHEN** `postJson` 失败后展示详情
- **THEN** diagnostic SHALL 含 facade 写入的真实 transport 与脱敏响应摘要

