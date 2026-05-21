## ADDED Requirements

### Requirement: Multipart 上传 SHALL 使用专用 formUploadTransport 层

所有 multipart 表单上传（Web `webFormFetch` 与 API `apiFormFetch`）SHALL 经 `resolveFormUploadTransport` 与 `executeFormUpload` 完成。平台适配器 MUST NOT 内嵌传输选择 if 链。

#### Scenario: Web 适配器上传图片

- **WHEN** Web 适配器以构造好的 `FormData` 调用 `webFormFetch`
- **THEN** 系统 SHALL 先 `resolve` 再 `execute`，且仅执行一次网络请求
- **AND** 日志 SHALL 包含 `form-upload-transport => <通道名>`

#### Scenario: API 适配器上传图片

- **WHEN** API 适配器调用 `apiFormFetch`
- **THEN** SHALL 与 Web 使用同一套 resolve → execute 管线

### Requirement: 插件宿主 SHALL 优先 plugin-node-fetch

当 `PluginFetchUtil.canUsePluginFetch` 为 true（思源 Electron 插件宿主且 `win.require` 可用），系统 SHALL 解析为 `plugin-node-fetch`，且 MUST NOT 对该请求使用思源 `forwardProxy`，即使 `forceProxy` 为 true。

#### Scenario: V2 Electron 上传公网 HTTPS 图片

- **GIVEN** `canUsePluginFetch` 为 true
- **WHEN** multipart 上传执行
- **THEN** 通道 SHALL 为 `plugin-node-fetch`
- **AND** 日志 MUST NOT 对该请求显示 `siyuan-forward-proxy`

### Requirement: 本机与私网目标 SHALL 禁止 forwardProxy

目标 URL 属于 loopback 或私网（`publishTargetUtil.isLoopbackOrLocalTargetUrl`）时，系统 MUST NOT 选择 `siyuan-forward-proxy`，与 XML-RPC 规则一致。

#### Scenario: 上传到 localhost 开发环境

- **GIVEN** 目标为 `http://127.0.0.1` 或 `http://localhost` 或私网 IP
- **WHEN** 解析 multipart 通道
- **THEN** MUST NOT 选择 `siyuan-forward-proxy`

### Requirement: forwardProxy SHALL 仅为回退通道

无插件直连能力且满足既有代理谓词时，系统 MAY 使用 `siyuan-forward-proxy` 及既有 base64 解包逻辑。本变更 MUST NOT 删除 forwardProxy 实现。

#### Scenario: 外部浏览器且无 canUsePluginFetch

- **GIVEN** `canUsePluginFetch` 为 false
- **AND** `isUseSiyuanProxy` 或 `forceProxy` 为 true
- **AND** 目标非 loopback/私网
- **WHEN** multipart 上传
- **THEN** 通道 SHALL 为 `siyuan-forward-proxy`

### Requirement: executeFormUpload SHALL 返回统一 JSON 契约

`executeFormUpload` SHALL 返回 `{ json, transport, diagnostic? }`。各通道特有解析（base64、文本预览）SHALL 留在注入的 handler 内，不得在各平台适配器重复解析。

#### Scenario: 语雀式 JSON 成功响应

- **WHEN** `plugin-node-fetch` 返回 HTTP 200 JSON
- **THEN** 返回对象的 `json` 字段 SHALL 可直接用于业务逻辑
- **AND** `transport` SHALL 为 `plugin-node-fetch`

### Requirement: FormData 构造 SHALL 与传输彻底分离

`FormDataHostUtil`（由原 `FormDataUtils` 重命名）SHALL 仅提供宿主 `FormData`/`Blob` 构造，并将 `canUsePluginFormFetch` 委托给 `PluginFetchUtil`。传输 resolve/execute MUST NOT 位于 Form 构造模块。

#### Scenario: 新增带图 Web 平台

- **WHEN** 实现 `newMediaObject`
- **THEN** 开发者 SHALL 只组合 `getFormData` + `webFormFetch`
- **AND** MUST NOT 从其他适配器拷贝 transport if 代码

### Requirement: Multipart 失败 SHALL 可诊断且可脱敏

Web 路径 SHALL 继续支持 `WebFormFetchOptions` 诊断增强；API 路径 SHALL 提供同等字段（阶段、通道、状态、脱敏响应摘要）。错误与日志 MUST NOT 输出 Cookie、Authorization、ctoken 或明文 token。

#### Scenario: V2 语雀图片上传失败

- **WHEN** 上传失败
- **THEN** V2 错误详情 SHALL 含失败阶段、resolved transport、脱敏响应摘要
