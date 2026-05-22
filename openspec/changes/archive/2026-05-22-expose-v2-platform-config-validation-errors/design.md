## Context

V2 账号配置使用 `V2PlatformConfigBridge` 动态挂载 V1 平台设置组件（`CommonBlogSetting`、Cookie 表单等）。V1 表单在 `valiConf` 失败时会：

1. 调用 `ElMessage.error` 显示 `setting.blog.vali.error=>${errMsg}`
2. 通过 `emitValidated({ ok, apiStatus, errorMessage, cfg, dynCfg })` 上报结果

桥接层 `provide(V2_PLATFORM_CONFIG_ACTION_BRIDGE_KEY)` 的 `onValidated` 直接 `emit("validated", result)`，但 **TypeScript 类型与 `V2App.handleConfigValidated` 仅消费 `ok`**，未驱动 `SypErrorDetailsPanel`。用户看到的主要是 V1 表单项下的泛化黄色 `el-alert`（`setting.blog.vali.tip.metaweblog`），与真实 `errorMessage` 脱节。

项目已有：

- `SypErrorDetailsPanel`（`V2App` 快速发布失败已接入）
- `v2-hosted-error-details` 规范（宿主内、脱敏、可复制）
- `sensitiveLogSanitizer` / 类似工具（发布链路已用）

## Goals / Non-Goals

**Goals:**

- 定义稳定的 `V2PlatformConfigValidationResult` 契约（`ok`, `apiStatus`, `errorMessage`, 可选 `errorDetails`）。
- 验证失败时，V2 宿主在 `.syp-v2` 内展示友好摘要 +「查看详情」（`SypErrorDetailsPanel`），详情可复制、脱敏。
- 桥接层在配置区显示内联失败摘要（可选「查看详情」入口），不依赖 `document.body` 上的 Element Plus 全局 Toast 作为唯一反馈。
- 失败时保持配置页；`completeConfigIfPublishReady` 仅在 `ok === true` 且 `validatePublish` 通过时推进。
- 单测覆盖事件载荷与详情展示触发。

**Non-Goals:**

- 不修复各平台 adaptor 的具体验证 bug（如博客园 `indexOf`）；仅改善错误暴露。
- 不重写 V1 表单 UI；桥接模式保留。
- 不改动 `validatePublish` 平台规则实现。

## Decisions

### 1. 错误展示归 `V2App` 统一调度（推荐）

**选择：** `V2PlatformConfigBridge` 完整转发 `errorMessage`；`V2App.handleConfigValidated` 在 `!result.ok` 时设置 `errorDetailsState` 并打开 `SypErrorDetailsPanel`（与快速发布共用组件）。

**理由：** `SypErrorDetailsPanel` 已在 `V2App` 根级挂载，符合 `v2-hosted-error-details`；避免 Bridge 与 App 各挂一套面板。

**备选：** Bridge 内嵌独立详情面板 — 重复逻辑，层级易冲突。

### 2. 内联摘要 + 详情面板双层反馈

**选择：** 桥接表单下方增加 V2 风格失败条（友好一句 +「查看详情」按钮）；详情面板展示完整脱敏诊断。

**理由：** 用户无需先找 Toast；与快速发布「状态卡片 + 查看详情」模式一致。

**备选：** 仅 Toast — 在思源宿主内易丢失、不可复制，用户已明确反对。

### 3. V1 `ElMessage` 在 V2 桥接模式下降级

**选择：** 当 `inject(V2_PLATFORM_CONFIG_ACTION_BRIDGE_KEY)` 存在时，`CommonBlogSetting.valiConf` **不**再调用 `ElMessage.error`（或仅 debug 日志），避免与 V2 面板重复且可能挂载错位。

**理由：** 减少三重提示（Toast + 黄条 + 无详情）；主反馈走 V2。

### 4. 脱敏复用发布链路工具

**选择：** 详情文本经 `sanitizeSensitiveForLog` 或等价函数处理后再写入 `errorDetailsState.details`。

**理由：** 与 `v2-hosted-error-details` 一致；配置验证错误常含 token、密码字段片段。

### 5. 类型契约放在 `platformConfigActionBridge.ts`

**选择：** 导出 `V2PlatformConfigValidationResult` 接口，Bridge / 表单 / `V2App` 共用。

**理由：** 防止再次「只传 ok」的回归。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 部分桥接表单未传 `errorMessage` | 契约文档 + 单测；回退显示 `v2.platformConfig.validation.failedGeneric` |
| 抑制 `ElMessage` 后 V1 独立设置页体验变化 | 仅在 `v2ActionBridge` 注入时抑制 |
| 错误详情过长撑破布局 | `SypErrorDetailsPanel` 已有内部滚动 |
| Cookie 表单验证路径不一致 | 统一经 `emitValidated` / `onValidated` 扩展同一契约 |

## Migration Plan

1. 扩展类型与 Bridge 转发（无行为破坏）。
2. `V2App` 消费失败详情并展示面板。
3. Bridge 内联摘要 UI + i18n 键。
4. V1 表单 V2 模式下抑制重复 Toast。
5. 单测 + 思源手验（博客园验证失败场景）。

回滚：恢复 `handleConfigValidated` 仅处理 `ok`、移除内联条即可，无数据迁移。

## Open Questions

- Cookie 授权类桥接表单是否共用同一 `validated` 契约（建议是，本变更一并类型化）。
- 是否在配置页常驻「最近一条验证错误」直到下次验证成功（建议：是，避免用户滚动后丢失）。
