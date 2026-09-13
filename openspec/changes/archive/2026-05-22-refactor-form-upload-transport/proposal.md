## 为什么做

插件已运行 **2 年以上**，V1 仍在用，但 **V2 是主战场**。MetaWeblog XML-RPC 已落地传输层（`xmlrpcTransport` + `PluginFetchUtil`）。带图发布（语雀网页版 / Halo / CSDN 等 **multipart**）曾分散在 `FormDataUtils`、`webFormFetch` / `apiFormFetch` 重复分支中，且诊断默认值误导为 `forwardProxy` 主路径。

本变更是 **V2 顶层架构债的一次性清算**：对外只暴露 **`createFormUploadClient(...).postJson(...)`** 单入口；解析与执行封装在 facade 内部，使用层（基类、平台适配器）无需理解 resolve / handler / `PluginFetchUtil` 组合。

## 顶层设计（一句话）

**multipart 上传唯一对外契约：`formUploadClient.postJson`。** 基类 `webFormFetch` / `apiFormFetch` 仅一行委托；平台适配器只调基类 + `FormDataHostUtil.getFormData`。传输通道由 facade 内部解析并写入日志/诊断，禁止 adaptor 拼 handler 或预设 `siyuan-forward-proxy`。

## 改什么

### 对外入口（使用层心智）

```text
BaseWebApi.webFormFetch / BaseBlogApi.apiFormFetch
  → formUploadClient.postJson({ url, headers, formData, forceProxy, diagnostic? })
  → 返回 json
```

- **`createFormUploadClient`**：唯一对外工厂；`postJson` 为唯一上传方法
- **`resolveFormUploadTransport`**：**internal**（仅 `formUploadClient` 与单测 `__test` 导出），**不是**使用层 API
- **无** `executeFormUpload` 公开契约；执行逻辑为 facade 私有实现
- **`FormDataHostUtil`**：仅 `FormData` / `Blob 构造`；`getFormDataFetch` 仅在 facade 选定 `plugin-node-fetch` 后懒加载

### 顶层支撑（维护者扩展点）

- **`publishTransport/`**：共用类型、`publishTargetUtil`、`resolveRules`（XML 与 multipart 共用 loopback / plugin-first 规则）
- **`xmlrpcTransport`**：与 multipart 同哲学，独立 facade 形态
- **通道枚举（对外日志统一）**：`plugin-node-fetch` | `siyuan-forward-proxy` | `middleware-fetch`（**无** `cors-middleware` 对外名）

### 解析优先级（写入 spec，由 facade 内部实现）

1. `canUsePluginFetch` → **必定** `plugin-node-fetch`（`forceProxy` 无效）
2. loopback/私网 → **禁止** `siyuan-forward-proxy`；无插件时 → `middleware-fetch`
3. 公网且无插件、满足代理谓词 → `siyuan-forward-proxy`
4. 其余无插件场景 → `middleware-fetch`

### 诊断

- 平台适配器（如语雀）在 **通道未解析前** 不得默认 `transport: "siyuan-forward-proxy"`；未选定时用空或 `"unresolved"`
- `formUploadClient` 执行网络 I/O 时写入真实 `transport` 到 `diagnostic`

### 明确不做

- 不合并 JSON `apiFetch` 进本 change（`publishTransport/types` 预留 JSON 插槽）
- 不恢复 `FormDataUtils`、不添加 deprecated re-export
- 不在 adaptor 新增 forwardProxy + FormData 组合 if

## 能力范围

### 新增能力

- **`publish-transport-framework`**：V2 发布传输顶层与扩展插槽
- **`form-upload-transport`**：multipart **facade** 契约（`formUploadClient.postJson`）
- **`publish-host-fetch`**：`PluginFetchUtil` 宿主门闸（由 facade 内部使用）

### 修改能力

- **`yuque-web-publishing`**：插件优先；诊断 transport 由 facade 解析后写入；预设不误报 forwardProxy

## 影响面

| 区域 | 动作 |
|------|------|
| `src/utils/formUploadClient.ts` | 单入口 facade |
| `src/utils/publishTransport/` | 共用规则 |
| `FormDataHostUtil.ts` | 仅构造 FormData |
| `baseWebApi.ts` / `baseBlogApi.ts` | 仅 `formUploadClient.postJson` |
| `YuquewebWebAdaptor.ts` | 诊断默认值修正 |
| 测试 | `formUploadClient.spec` + `baseFormUploadFacade.spec` + `YuquewebWebAdaptor.spec` |

## 成功标准

- 基类 `webFormFetch` / `apiFormFetch` 源码中 **仅** 出现 `formUploadClient.postJson`，无 resolve/execute/handler 拼装
- 语雀 `build-formdata` 阶段失败 **不** 默认显示 `siyuan-forward-proxy`
- V2 Electron 带图上传日志：`[form-upload-transport] transport => plugin-node-fetch`
- `openspec validate --strict` 通过；#27/#28 Img 手验通过后方可 archive
