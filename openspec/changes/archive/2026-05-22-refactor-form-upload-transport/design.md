# 设计说明：multipart formUploadClient facade

## 1. 背景

XML-RPC 已验证「插件宿主优先、loopback 禁 forwardProxy」规则。multipart 原先把 resolve/execute 暴露在基类，使用层心智过重；语雀等适配器还 **预设** `transport: "siyuan-forward-proxy"`，在 `build-formdata` 阶段误导排障。

本设计改为 **facade 单入口**，与「模块化但未统一抽象」的上一版划界。

---

## 2. 目标与非目标

### 2.1 目标

1. **使用层极简**：基类/平台只认 `webFormFetch` → 内部 `formUploadClient.postJson`
2. **传输细节内聚**：resolve、handler、`getFormDataFetch` 懒加载均在 `formUploadClient.ts`
3. **通道命名统一**：对外仅 `plugin-node-fetch` | `siyuan-forward-proxy` | `middleware-fetch`
4. **诊断诚实**：未解析前不假装 forwardProxy；由 facade 写入真实 transport
5. **V2 break change**：无垫片、无双轨

### 2.2 非目标

- 不实现 JSON 统一 facade（仅 `PublishTransportKind` 预留）
- 不为 V1 在主干留兼容层

---

## 3. 架构

```text
平台 adaptor
  → FormDataHostUtil.getFormData()     // 仅构造
  → BaseWebApi.webFormFetch()          // 一行
       → formUploadClient.postJson()  // 唯一 multipart 契约
            ├─ (internal) resolveFormUploadTransport
            ├─ (internal) runFormUploadTransport
            │     ├─ plugin-node-fetch  → 懒加载 getFormDataFetch
            │     ├─ siyuan-forward-proxy → 基类注入的 forwardProxyFormPost
            │     └─ middleware-fetch   → 基类注入的 middlewareFormPost (corsFetch)
            └─ PluginFetchUtil / publishTargetUtil / resolveRules

xmlrpcTransport（并列，非本 change 合并）
```

### 3.1 使用层禁止事项

- 禁止 `resolveFormUploadTransport` / `executeFormUpload` 出现在基类或 adaptor
- 禁止在 `postJson` 之前调用 `FormDataHostUtil.getFormDataFetch`
- 禁止 adaptor 默认 `diagnostic.transport = "siyuan-forward-proxy"`

### 3.2 维护者扩展新通道

1. 扩展 `FormUploadTransport` / `PublishTransportKind`
2. 修改 `formUploadClient` 内部 resolve + `runFormUploadTransport` 分支
3. 不改各平台 adaptor（除非新增平台业务，仍只调 `webFormFetch`）

---

## 4. 关键决策

### D1. 单入口 `postJson`

```typescript
createFormUploadClient(deps).postJson({
  url, headers, formData, forceProxy?, diagnostic?
}) → Promise<Record<string, unknown>>
```

`deps` 在基类 **构造时** 注入一次：`forwardProxyFormPost`、`middlewareFormPost`、`isInSiyuanOrSiyuanNewWin` 等。基类 **不** 每次请求拼 handler 对象。

### D2. internal resolve（非公开 API）

```text
1. canUsePluginFetch → plugin-node-fetch
2. loopback/private + !canUsePluginFetch → middleware-fetch（禁止 forwardProxy，禁止假 plugin 路径）
3. shouldUseSiyuanForwardProxy → siyuan-forward-proxy
4. default → middleware-fetch
```

已删除 `useCorsMiddlewarePath`（历史基类守卫恒真，无意义）。

### D3. 通道命名

| 对外 | 实现 |
|------|------|
| `middleware-fetch` | 基类 `corsFetch` / 浏览器可执行回退 |
| ~~cors-middleware~~ | 不再出现在类型、日志、spec |

### D4. 诊断生命周期（语雀为例）

| 阶段 | `transport` |
|------|-------------|
| `build-formdata` | 不设或 `"unresolved"` |
| `web-form-fetch` 进入 `postJson` 前 | 不设默认 forwardProxy |
| 网络执行中 | facade 写入 `plugin-node-fetch` 等 |
| 失败合并 | 保留 facade 已写入的 transport |

### D5. 与 XML-RPC 关系

共用 `publishTargetUtil`、`resolveRules.shouldUseSiyuanForwardProxy`；**不**共用 execute 实现（响应形态不同）。

---

## 5. 实施状态

| 项 | 状态 |
|----|------|
| `formUploadClient.ts` | 已落地 |
| 基类仅 `postJson` | 已落地 |
| OpenSpec 与代码对齐 | 本任务 |
| 语雀诊断默认值 | 本任务 |
| #27/#28 V2 Img 手验 | 待用户 |

---

## 6. 验收清单

- [ ] `webFormFetch` / `apiFormFetch` 仅含 `formUploadClient.postJson`
- [ ] 语雀 `newMediaObject` 初始 diagnostic 无默认 `siyuan-forward-proxy`
- [ ] `openspec validate --strict`
- [ ] vitest 指定套件全绿 + `pnpm build:v2`
- [ ] #27/#28 手验后 archive

---

## 7. 已关闭问题

- ~~`cors-middleware` vs `middleware-fetch`~~ → 统一为 **`middleware-fetch`**
