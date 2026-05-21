## 为什么做

插件已运行 **2 年以上**，V1 仍在用，但 **V2 是主战场**。MetaWeblog XML-RPC 已落地可扩展的传输层（`xmlrpcTransport` + `PluginFetchUtil`），Electron 宿主走 **`plugin-node-fetch`**，不再默认 `forwardProxy`。

带图发布（语雀网页版 / Halo / CSDN 等 **multipart**）仍是另一套烂摊子：

- 路由在 `FormDataUtils.resolveFormUploadTransport`
- 执行在 `webFormFetch` / `apiFormFetch` **各抄一遍**
- 命名误导（`FormDataUtils` 既造 Form 又管网络）
- 规范还写着 forwardProxy「主路径」，和真实插件优先行为矛盾

这不是「修下一个 checklist 行」的急活，而是 **V2 顶层架构债的一次性清算**：宁可现在短痛、破坏性改完，也不要再留双轨、垫片、deprecated 导出给未来平台埋雷。

## 顶层设计（一句话）

**所有对外 HTTP 发布能力，统一走「发布传输层」：`解析通道 → 执行通道 → 统一结果`；平台适配器只调基类方法，禁止自己写 `if (proxy/forward/cors)`。**

XML-RPC 已是先例；本变更把 **multipart** 纳入同一顶层，并抽出 **Web / API / XML / Form 共用** 的宿主能力与 URL 规则。V2 **允许 break change**，不为此保留技术债。

## 改什么

### 顶层（零债目标）

- 新增 **`publishTransport/`**（或等价目录）作为 **唯一扩展点**：
  - 共用类型：`PublishTransportContext`、`PublishTransportKind`
  - 共用规则：`publishTargetUtil`（loopback/私网、是否可走 forwardProxy）
  - 共用宿主门闸：`PluginFetchUtil`（`canUsePluginFetch` 等）
- **`formUploadTransport`**：`resolveFormUploadTransport` + `executeFormUpload` + 统一 JSON 出口
- **`xmlrpcTransport`**：对齐同一套 **解析优先级**（必要时从 `xmlrpcResponseUtil` 抽到 `publishTargetUtil`，XML 与 Form 不再互相 import 对方模块）
- **`FormDataHostUtil`**（由 `FormDataUtils` **重命名**）：**只**负责宿主 `FormData` / `Blob 构造**，删除一切传输逻辑
- **`BaseWebApi` / `BaseBlogApi`**：`webFormFetch` / `apiFormFetch` 瘦身为单行委托 `executeFormUpload`，**删除**内部重复分支
- **V2 break change**：不保留 `FormDataUtils` 兼容 re-export、不保留「先合模块、下版本再切调用方」的双轨期
- 结构化日志：`form-upload-transport => plugin-node-fetch | …`（与 XML-RPC 同级）
- 统一 multipart 失败诊断（阶段、通道、状态码、脱敏摘要）；Web 保留 `WebFormFetchOptions`，API 补齐同等字段

### 明确不做（避免上帝模块，但不留债）

- **本变更不**把 JSON `apiFetch` / `proxyFetch` 全部搬进同一文件（响应形态不同）
- **本变更要**在 `publishTransport/types` 预留 **`json-fetch`** 插槽与 `PublishTransportKind` 枚举位，后续 JSON 走同一顶层目录扩展，**禁止**再在 `useProxy` 里长新的平行 if 链
- **不删除** `forwardProxy` 实现本身，但在 Electron 插件宿主 **不得**作为默认路径；仅无 `canUsePluginFetch` 时回退

### 通道模型（Form，与 XML 同哲学）

| 通道 | 含义 |
|------|------|
| `plugin-node-fetch` | 插件宿主直连（`zhi-formdata-fetch` / 等价路径） |
| `siyuan-forward-proxy` | 思源 forwardProxy（base64 解包） |
| `cors-middleware` | 浏览器 cors 中间件路径（显式枚举，禁止散落在 adaptor） |

**解析优先级（硬规则，写入 spec）：**

1. `canUsePluginFetch` → **必定** `plugin-node-fetch`（`forceProxy` 无效）
2. loopback/私网目标 → **禁止** `siyuan-forward-proxy`
3. 其余按 `isUseSiyuanProxy` / `forceProxy` / 浏览器谓词 → forwardProxy 或 cors
4. 新平台 **只改** `resolveFormUploadTransport` / 顶层规则，**禁止**在 adaptor 加第四套 if

## 能力范围

### 新增能力

- **`publish-transport-framework`**：V2 发布传输顶层框架（共用上下文、通道枚举、解析优先级、扩展插槽）
- **`form-upload-transport`**：multipart 解析 + 执行 + 诊断 + 基类注入
- **`publish-host-fetch`**：`PluginFetchUtil` 规范（XML 与 Form 共用宿主门闸）

### 修改能力

- **`yuque-web-publishing`**：图片上传以 **插件直连为主路径**；forwardProxy 仅为回退；诊断必须带 `transport` 字段

## 影响面

| 区域 | 动作 |
|------|------|
| `src/utils/publishTransport/` | 新建顶层（types + target 规则） |
| `src/utils/formUploadTransport.ts` | 新建 |
| `src/utils/FormDataUtils.ts` | 重命名 → `FormDataHostUtil.ts`，删传输代码 |
| `src/utils/xmlrpcTransport.ts` / `xmlrpcResponseUtil.ts` | 抽共用 target 规则，对齐优先级 |
| `baseWebApi.ts` / `baseBlogApi.ts` | break：删重复分支，只委托 transport |
| 各平台 adaptor | 机械改 import；**禁止**保留旧 transport if |
| 测试 | `publishTransport` + `formUploadTransport` 单测；V2 `pnpm build:v2` + checklist #27/#28 Img |
| V1 | **不在此变更保护范围内**；V2 破坏性可接受；V1 若坏则靠版本/分支策略，不为此在 V2 代码里留垫片 |

## 成功标准（扩展性验收）

- 新增一个「带图 Web 平台」：只需 `getFormData` + `webFormFetch`，**零**传输 if 拷贝
- 新增一种宿主通道：只在 `publishTransport` 注册 handler + 扩展 `PublishTransportKind`，不改 10 个 adaptor
- 日志能一眼看出：`XML-RPC transport => …` 与 `form-upload-transport => …` 同一套语义
- 代码库中 **不存在** `FormDataUtils.resolveFormUploadTransport` 与 `webFormFetch` 内重复 transport 分支
