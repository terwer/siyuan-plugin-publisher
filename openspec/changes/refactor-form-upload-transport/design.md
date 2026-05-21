# 设计说明：V2 发布传输顶层（零技术债）

## 1. 背景

### 1.1 已验证先例（XML-RPC，2026-05-21）

博客园 #21、WordPress #25 日志示例：

```text
XML-RPC transport => plugin-node-fetch https://…
```

调用链：

```text
proxyXmlrpc
  → resolveXmlrpcTransport
  → executeXmlrpcTransport
  → normalizeXmlrpcResponseText（仅响应侧）
  → 反序列化
```

硬规则：

1. **`canUsePluginFetch`** → 永远 `plugin-node-fetch`，Electron 里 **不用** `forwardProxy`
2. **loopback/私网** → 禁止 `forwardProxy`（内核会拦 `[::1]` 等）
3. 仅在外部浏览器且无插件 fetch 时，才 `forwardProxy`

你对这套的评价是：**最大化宿主能力，而不是默认代理**。multipart 必须同一哲学，且上升到 **共用顶层**，避免 XML 一套、Form 另一套、JSON 将来第三套。

### 1.2 现状痛点

| 问题 | 现状 | 若不顶层化 |
|------|------|------------|
| 执行重复 | `webFormFetch` / `apiFormFetch` 各一套分支 | 每加一个平台抄一遍 |
| 路由孤立 | `resolve` 在 FormDataUtils | 与 xmlrpc 规则漂移 |
| 命名债 | `FormDataUtils` 名不副实 | 新人继续往 Utils 塞逻辑 |
| 规范债 | 语雀 spec 写 forwardProxy 主路径 | 与实现相反，误导后续改 spec |
| 扩展债 | `useProxy` 里 if 越来越多 | V2 平台越多越难测 |

语雀 #27 能过，是因为修了 resolve；**execute 仍未结构化对齐 XML-RPC**，这是典型「半拉子架构债」。

---

## 2. 目标与非目标

### 2.1 目标（按优先级）

1. **最大扩展性**：新平台、新通道、新宿主能力 → 只动 `publishTransport` + 对应 `*Transport` 模块
2. **V2 零遗留债**：break change 可接受；**禁止** deprecated re-export、双轨并行、 adaptor 内 transport if
3. **与 XML-RPC 结构对称**：`resolve` → `execute` → 统一出口类型
4. **插件宿主优先**：Electron V2 默认 `plugin-node-fetch`
5. **可测**：resolve 纯函数 + execute 注入 handler mock

### 2.2 非目标（本变更不实现，但须留插槽）

- 不本 PR 合并 JSON `apiFetch` 进同一 execute 文件（响应不是 JSON 一种形态）
- 不替换 `zhi-formdata-fetch` 库本身（只作为 `plugin-node-fetch` 的 handler 实现）
- 不为 V1 在 V2 主干里保留兼容层（V1 用户慢，**不绑架** V2 架构）

---

## 3. 顶层架构（你要的「长远」）

```text
┌─────────────────────────────────────────────────────────┐
│              publishTransport/（顶层，唯一扩展点）          │
│  types.ts        PublishTransportContext, Kind, Result   │
│  publishTargetUtil.ts   loopback / 私网 / URL 安全        │
│  resolveRules.ts  plugin-first、forwardProxy 谓词（共用）  │
└───────────────────────────┬─────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
  xmlrpcTransport    formUploadTransport   （预留 jsonFetchTransport）
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                    PluginFetchUtil（宿主门闸）
                            │
                    平台 adaptor（只调基类，无 if 链）
```

### 3.1 扩展新平台（规范流程）

```text
1. adaptor.newMediaObject / 等价方法
2. FormDataHostUtil.getFormData()
3. BaseWebApi.webFormFetch() → executeFormUpload()  // 内部已无分支
4. 业务解析 json 字段
```

**禁止**：在 `YuquewebAdaptor` 等文件里写 `if (forceProxy) forwardProxy(...)`。

### 3.2 扩展新通道（例如将来 HTTP/3 插件通道）

```text
1. PublishTransportKind 加枚举值
2. formUploadTransport 注册 handler
3. resolveRules 加一条优先级（写进 spec + 单测）
4. 不改各平台 adaptor
```

### 3.3 扩展 JSON（后续变更，本设计预留）

- 在 `PublishTransportKind` 增加 `json-fetch` / `json-plugin-fetch` 等
- 新建 `jsonFetchTransport.ts`，**禁止**在 `useProxy.proxyFetch` 再抄第四套 resolve

---

## 4. 关键决策

### D1. 目录与命名（break change，一次清干净）

| 旧 | 新 | 说明 |
|----|-----|------|
| `FormDataUtils` | `FormDataHostUtil` | 只造 FormData/Blob |
| `resolveFormUploadTransport` 在 Utils | `formUploadTransport.ts` | 路由+执行归位 |
| `isLoopbackOrLocalTargetUrl` 挂在 xmlrpc 专用 util | `publishTargetUtil.ts` | XML/Form/未来 JSON 共用 |
| 无 | `publishTransport/types.ts` | 顶层类型与插槽 |

**不做的债**：`export { resolve... } from './FormDataUtils'` 兼容一层。

### D2. Form 三通道 + 解析顺序（与 XML 共用 resolveRules 精神）

```typescript
type FormUploadTransport =
  | "plugin-node-fetch"
  | "siyuan-forward-proxy"
  | "cors-middleware";
```

```text
1. canUsePluginFetch → plugin-node-fetch     // forceProxy 无效
2. isLoopbackOrLocalTargetUrl → 禁止 forwardProxy
3. isUseSiyuanProxy || forceProxy → siyuan-forward-proxy（且非 2）
4. 浏览器 cors 谓词 → cors-middleware
5. 其余 → 按设备回退（写入 spec，单测锁死）
```

### D3. executeFormUpload 契约

**入参**：`url, formData, headers, forceProxy, options?`  
**注入 handler**（来自 `useProxy` / 基类，不在 transport 模块里硬编码 SiYuan API）：

```text
pluginNodeFetch(moduleBase, url, headers, formData) → string
siyuanForwardProxy(...) → 解码后 JSON
corsMiddleware(...) → unknown → 统一 json 出口
```

**出参**：

```typescript
{
  json: Record<string, unknown>;
  transport: FormUploadTransport;
  diagnostic?: PublishTransportDiagnostic; // Web/API 共用形状
}
```

不为 Form 做「类 XML 文本 normalize」—— JSON/base64 留在各 handler 内，避免过度抽象。

### D4. 基类 break change

- `webFormFetch` / `apiFormFetch` **签名可保持不变**（减少 adaptor 改动量），但 **实现必须只剩** `executeFormUpload` 委托
- 删除基类内所有 `if (transport === …)` 重复块
- `useProxy` 只提供 handler 实现，**不再**承担 Form 路由决策

### D5. 日志（运维与 checklist 取证）

```text
[INFO] [form-upload-transport] transport => plugin-node-fetch <url>
[INFO] [use-proxy] XML-RPC transport => plugin-node-fetch <url>
```

未来 JSON：`[json-fetch-transport] transport => …`

### D6. V2 与 V1 立场（你已明确）

| | V2 | V1 |
|---|-----|-----|
| break change | **允许** | 不保证本变更兼容 |
| 双轨/垫片 | **禁止** | 若仍需 V1，用 tag/分支，不在主干留 if |
| 验收 | `pnpm build:v2` + platform-checklist Img | 非阻塞 |

---

## 5. 与「方案 A 完整」的对应关系

你之前选的 **方案 A** = `formUploadTransport` + 窄化 Form 构造 + 共享 `PluginFetchUtil`。

本设计 **升级为方案 A+**：

- 方案 A：只拉平 Form
- **方案 A+（本提案）**：抽出 **`publishTransport` 顶层**，XML 对齐共用规则，JSON 留枚举插槽，**一次删债**而不是「先 Form 再将来补顶层」

这样避免典型债务：**「Form 修好了，JSON 又长成第二棵 if 树」**。

---

## 6. 实施节奏（可多个 PR，但每个 PR 都是「删旧」）

| 阶段 | 交付 | 原则 |
|------|------|------|
| **S0** | 本 OpenSpec 你确认 | 顶层设计冻结 |
| **S1** | `publishTransport/` + `publishTargetUtil` + xmlrpc 改 import | 无行为变更或仅搬文件 |
| **S2** | `formUploadTransport` + 单测 | 模块可测 |
| **S3** | `apiFormFetch` 切换 + **删除**旧分支 | 同一 PR 不保留死代码 |
| **S4** | `webFormFetch` 切换 + 诊断 + **删除**旧分支 | 复验 #27/#28 Img |
| **S5** | `FormDataUtils` → `FormDataHostUtil`，全库改 import，**无** re-export | break rename |
| **S6** | `AGENTS.md` + spec 归档 + checklist 备注 | 文档债清零 |

**明确反对的节奏**（旧提案里的债）：

- ❌ P1 合入「零运行时切换」模块——那是双轨，你不需要
- ❌ P4「可选重命名」——必须重命名
- ❌ 「保留一个版本的 deprecated 导出」——禁止

---

## 7. 风险（接受短痛）

| 风险 | 态度 |
|------|------|
| #27 语雀带图回归 | S4 必须复验；失败则修 handler，不回滚架构 |
| 大范围 import 改名 | 机械替换，CI 兜底 |
| xmlrpc 抽共用 util 误伤 | S1 单测 + #21/#25 快速冒烟 |
| PR 体积大 | 宁可一个 PR 大，不要三个 PR 双轨 |

---

## 8. 架构验收清单（合入前自检）

- [ ] 全库无 `FormDataUtils.resolveFormUploadTransport`
- [ ] `webFormFetch` / `apiFormFetch` 内无 transport 分支（除 delegate 一行）
- [ ] adaptor 目录 grep `forwardProxy` + `FormData` 无新增平台级组合
- [ ] `publishTransport/types` 含 JSON 预留枚举或注释插槽
- [ ] `openspec validate --strict` 通过
- [ ] V2 build 绿 + 语雀/Haloweb Img 日志含 `form-upload-transport => plugin-node-fetch`

---

## 9. 待你拍板（仅 1 项）

- `cors-middleware` 与历史名 `middleware-fetch` 是否统一为一个枚举值？**建议**：spec 只保留 `cors-middleware`，代码里删掉 `middleware-fetch` 别名，避免两套日志语义。
