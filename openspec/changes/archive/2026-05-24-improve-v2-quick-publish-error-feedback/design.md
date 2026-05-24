## Context

V2 快速发布已经把发布失败和配置验证失败统一交给宿主内 `SypErrorDetailsPanel` 展示真实诊断，但快速发布失败仍存在两个共用层问题：一是 `useV2QuickPublishToast` 对 failed 终态继续弹全局 toast，和页面状态卡重复；二是 `useV2QuickPublish` 直接把 `result.errMsg` 作为摘要，导致 `main.opt.failure=>Error: {"code":400,"traceId":"...","msg":"标题过短"}` 这类远端业务错误无法在页面内直接读懂。

当前 CSDN “标题过短”错误证明发布链路已进入真实平台业务校验，不应通过 CSDN 专修或自动扩标题掩盖；正确边界是快速发布共用反馈层解析摘要、详情保留原文。

## Goals / Non-Goals

**Goals:**

- 快速发布失败不再产生全局 toast，页面内状态卡成为唯一失败入口。
- 在 `useV2QuickPublish` 共用层生成“短摘要 + 脱敏详情”：短摘要面向用户，详情面向排障。
- 支持从常见错误包装中提取业务字段：裸 JSON、`Error: <json>`、`main.opt.failure=>...`、嵌套 `error.message` 等。
- `V2App` 页面内失败描述直接拼出平台名、动作和摘要。
- 保持成功、图片警告、预览 ready 的 toast 行为不变。

**Non-Goals:**

- 不改变平台业务校验规则，例如不自动扩充标题长度。
- 不修改 CSDN/知乎/语雀等平台适配器的发布实现。
- 不改变 `usePublish` 返回结构或传输层错误封装。
- 不改变配置验证错误详情行为，除非复用同一脱敏工具自然受益。

## Decisions

### Decision 1: 摘要提取放在 V2 快速发布共用层

在 `src/composables/v2/` 增加纯函数工具，输入任意错误文本或对象，输出 `{ summary, details }`。`summary` 用于 `publishState.errMsg`，`details` 用于 `publishState.errDetails`。

理由：问题跨平台存在，且 V2 快速发布已经是所有平台发布终态汇聚点；放在平台适配器会形成 CSDN/知乎/语雀多套补丁。

替代方案：在 CSDN adaptor 捕获 `msg`。拒绝，因为知乎、微信公众号、掘金等平台都会遇到同类 JSON/堆栈包装。

### Decision 2: 优先提取业务字段，提取失败才回退原文摘要

提取优先级：`msg` → `message` → `error.message` → 字符串型 `error`。解析来源包括完整 JSON、`Error: <json>` 后缀、`=>` 后缀内 JSON、以及首个平衡 JSON 对象片段。提取不到时，去掉常见噪音前缀并截取第一行作为摘要。

理由：平台返回的用户可理解原因通常在 `msg/message`，traceId、code 和堆栈对终端用户不是摘要。

替代方案：直接显示 `errDetails` 第一行。拒绝，因为第一行可能是 `Error: { ... }` 或包含 traceId，仍然混乱。

### Decision 3: 失败 toast 构建直接返回 null

`buildV2QuickPublishToast` 对 `status === "failed"` 返回 `null`，`notifyV2QuickPublishResult` 保持“payload 为空即不弹”的既有行为。终态集合可以保留 failed，关键是 `toastKeyFor`/构建结果不产生 error payload。

理由：失败需要可复制详情和上下文，不适合短暂全局 toast；页面状态卡已经承担提醒。

替代方案：保留 toast 但改成友好摘要。拒绝，仍会与页面状态卡重复，并打断用户。

### Decision 4: 页面描述拼接短摘要，不把详情挤进状态卡

`V2App` 的 `publishDescription` 在 failed 状态下，如果 `publishState.errMsg` 存在，就返回 `{platform} 发布失败：{summary}` / `{platform} 更新失败：{summary}` / `{platform} 删除失败：{summary}`。错误卡内标题也显示短摘要，按钮继续打开详情面板。

理由：用户应在页面上直接看到失败原因；详情面板只用于复制 traceId/堆栈/响应体。

替代方案：只在错误卡标题显示摘要，描述仍“请查看错误详情”。拒绝，主信息仍不够显眼。

## Risks / Trade-offs

- [Risk] 某些平台响应体不是 JSON 或包含非标准字段。→ Mitigation：提取失败时回退脱敏后的第一行摘要，不影响原详情。
- [Risk] JSON 片段里含 Cookie/token 字段。→ Mitigation：摘要和详情都先走 `sanitizeSensitiveForLog`，对象字段也脱敏。
- [Risk] 截取平衡 JSON 对象实现过复杂。→ Mitigation：纯函数单测覆盖常见包装；失败时回退，不阻断发布流程。
- [Risk] 失败 toast 消失后用户可能漏看失败。→ Mitigation：快速发布状态卡 `role=status` 保留，失败卡高亮且目标平台卡标记失败。

## Migration Plan

1. 新增共用错误文本工具和单元测试。
2. 改 `useV2QuickPublish` 的发布、预览、删除失败分支，统一写入短摘要和脱敏详情。
3. 改 `useV2QuickPublishToast`，failed 不再产生 payload，并更新测试。
4. 改 `V2App` 失败描述/错误卡摘要展示和 i18n 文案。
5. 运行聚焦测试、`pnpm lint`、`pnpm build:v2`。

## Open Questions

- 是否后续要把同一摘要提取工具用于 V2 平台配置验证失败？本变更先聚焦快速发布失败，避免扩大影响面。
