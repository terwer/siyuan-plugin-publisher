# publish-transport-framework Specification

## Purpose

定义 V2 发布网络传输的顶层组织原则、共享解析规则与扩展边界，防止 XML-RPC、multipart、JSON 在平台适配器或 useProxy 中形成彼此平行的传输选择树。
## Requirements
### Requirement: V2 对外 HTTP 发布 SHALL 经统一发布传输顶层扩展

系统 SHALL 在 `publishTransport` 集中定义共用类型、URL 规则与解析优先级。XML-RPC 使用 `xmlrpcTransport`；multipart 使用 **`formUploadClient` facade**（内部封装传输层）。平台适配器与 `useProxy` MUST NOT 新增平行 transport if 链。

#### Scenario: 维护者为 V2 新增 Web 带图平台

- **WHEN** 实现新的 Web 适配器图片上传
- **THEN** 适配器 SHALL 仅调用 `FormDataHostUtil.getFormData` 与基类 `webFormFetch`
- **AND** SHALL NOT 复制 forwardProxy / plugin-node-fetch / middleware 分支代码

#### Scenario: 维护者为 V2 新增传输通道类型

- **WHEN** 需要增加新的 multipart 网络通道
- **THEN** 变更 SHALL 扩展内部解析与 `formUploadClient` 执行分支
- **AND** SHALL NOT 修改 10+ 平台适配器中的路由逻辑

### Requirement: V2 重构 SHALL NOT 为兼容性保留技术债垫片

V2 主干 MUST NOT 保留：deprecated re-export、`FormDataUtils` 垫片、基类内双轨 `webFormFetch` 实现。

#### Scenario: 审查 BaseWebApi.webFormFetch

- **WHEN** 审查 `BaseWebApi.webFormFetch` 实现
- **THEN** 实现 SHALL 仅委托 `formUploadClient.postJson`
- **AND** MUST NOT 出现 `resolveFormUploadTransport`、`executeFormUpload` 或 per-request handler 拼装

#### Scenario: FormDataHostUtil 重命名

- **WHEN** `FormDataHostUtil` 合入
- **THEN** 全库 import SHALL 指向新模块
- **AND** MUST NOT 从 `FormDataUtils` 再 export 传输函数

### Requirement: 传输解析优先级 SHALL 在顶层单点定义

plugin-first、代理条件判定（`isUseSiyuanProxy || forceProxy` 时 loopback/私网目标亦可走 forwardProxy）等规则 SHALL 在 `publishTransport/resolveRules` 定义，由 `xmlrpcTransport` 与 **`formUploadClient` 内部** 共同遵守。

#### Scenario: Electron 插件宿主同时发 XML-RPC 与 multipart

- **GIVEN** V2 在思源 Electron 中运行且 `canUsePluginFetch` 为 true
- **WHEN** 同一会话内校验 MetaWeblog 并上传语雀图片
- **THEN** 两类请求 MAY 均解析为 `plugin-node-fetch`
- **AND** 均 MUST NOT 仅因 `forceProxy` 而走 `forwardProxy`

### Requirement: JSON 发布传输 SHALL 预留顶层扩展插槽

`PublishTransportKind` SHALL 为后续 JSON 迁移预留扩展位。本变更不实现 JSON facade，禁止在 `useProxy` 再长第三套独立 resolve 树。

#### Scenario: 后续迁移 JSON apiFetch

- **WHEN** 维护者启动 JSON 传输统一
- **THEN** 新实现 SHALL 位于 `publishTransport` 子模块
- **AND** SHALL 复用 `PluginFetchUtil` 与 `publishTargetUtil`

