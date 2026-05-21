## ADDED Requirements

### Requirement: V2 对外 HTTP 发布 SHALL 经统一发布传输顶层扩展

系统 SHALL 在 `publishTransport`（或等价顶层目录）集中定义：传输上下文、通道枚举、URL/宿主共用解析规则。XML-RPC、multipart 及后续 JSON 发布 MUST 复用该顶层的宿主门闸与 loopback 规则，MUST NOT 在平台适配器或 `useProxy` 中新增平行的 transport 选择 if 链。

#### Scenario: 维护者为 V2 新增 Web 带图平台

- **WHEN** 实现新的 Web 适配器图片上传
- **THEN** 适配器 SHALL 仅调用 `getFormData` 与基类 `webFormFetch`
- **AND** SHALL NOT 复制 `forwardProxy` / `plugin-node-fetch` / cors 分支代码

#### Scenario: 维护者为 V2 新增传输通道类型

- **WHEN** 需要增加新的宿主网络通道（例如未来插件 HTTP/2）
- **THEN** 变更 SHALL 扩展 `PublishTransportKind` 并在对应 `*Transport` 模块注册 handler
- **AND** SHALL NOT 修改 10+ 平台适配器文件中的路由逻辑

### Requirement: V2 重构 SHALL NOT 为兼容性保留技术债垫片

对本变更涉及的 Form 传输与 `FormDataUtils` 重命名，V2 主干代码 MUST NOT 保留：deprecated re-export、双轨并行实现（新旧 `webFormFetch` 分支共存）、或「先合模块下版本再切调用方」的过渡层。

#### Scenario: 合入 formUploadTransport 后代码审查

- **WHEN** 审查 `BaseWebApi.webFormFetch` 实现
- **THEN** 实现 SHALL 仅委托 `executeFormUpload`
- **AND** MUST NOT 存在已注释或未删除的旧 transport 分支块

#### Scenario: FormDataUtils 重命名

- **WHEN** `FormDataHostUtil` 合入
- **THEN** 全库 import SHALL 指向新模块名
- **AND** MUST NOT 从旧路径 `FormDataUtils` 再 export 传输函数

### Requirement: 传输解析优先级 SHALL 在顶层单点定义

插件宿主 `canUsePluginFetch` 优先、loopback/私网禁止 forwardProxy、`forceProxy` 不得覆盖插件直连——这些规则 SHALL 在共用 `resolveRules` / `publishTargetUtil` 中定义，并由 `xmlrpcTransport` 与 `formUploadTransport` 共同遵守。

#### Scenario: Electron 插件宿主同时发 XML-RPC 与 multipart

- **GIVEN** V2 在思源 Electron 中运行且 `canUsePluginFetch` 为 true
- **WHEN** 同一会话内校验 MetaWeblog 并上传语雀图片
- **THEN** 两类请求 MAY 均解析为 `plugin-node-fetch`
- **AND** 均 MUST NOT 仅因 `forceProxy` 而走 `forwardProxy`

### Requirement: JSON 发布传输 SHALL 预留顶层扩展插槽

`PublishTransportKind`（或等价枚举）SHALL 为后续 JSON `apiFetch` 迁移预留扩展位。本变更不实现 JSON 统一 execute，但 MUST 在类型层文档化插槽，禁止未来在 `useProxy` 再长第三套独立 resolve 树。

#### Scenario: 后续变更迁移 JSON apiFetch

- **WHEN** 维护者启动 JSON 传输统一
- **THEN** 新实现 SHALL 位于 `publishTransport` 子模块（如 `jsonFetchTransport`）
- **AND** SHALL 复用 `PluginFetchUtil` 与 `publishTargetUtil`
