## XML-RPC 传输架构（2026-05-21 重构）

与 `FormDataUtils.resolveFormUploadTransport` 对齐的三层：

| 层 | 模块 | 职责 |
|----|------|------|
| 选型 | `xmlrpcTransport.resolveXmlrpcTransport` | 只决定走哪条通道 |
| 执行 | `xmlrpcTransport.executeXmlrpcTransport` | 注入 handler，统一出口为 XML 字符串 |
| 响应 | `xmlrpcResponseUtil.normalizeXmlrpcResponseText` | 仅处理包装对象/base64，不掺路由逻辑 |
| 直传能力 | `PluginFetchUtil` | 与 multipart 共用 node-fetch 路径 |

### 通道优先级

1. `plugin-node-fetch` — `canUsePluginFetch`（win.require）
2. `siyuan-forward-proxy` — 无直传 + 需代理 + 非回环
3. `middleware-fetch` — 浏览器 CORS 回退

`useProxy.proxyXmlrpc` 仅组装 handler，不再内联 if/EnvUtil/临时函数。
