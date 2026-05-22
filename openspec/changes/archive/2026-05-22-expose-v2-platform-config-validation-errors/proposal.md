## Why

V2 账号「发布设置」通过 `V2PlatformConfigBridge` 桥接 V1 平台表单（如博客园 MetaWeblog）。验证失败时，底层表单虽在 `emitValidated` 中携带 `errorMessage`，但桥接层只向上传递 `{ ok, apiStatus }`，宿主 `V2App` 也仅根据 `ok` 决定是否完成配置，**不在 V2 面板内展示可复制的真实诊断**。用户只能看到泛化的黄色「配置错误」提示，无法把具体错误（如 `TypeError: i2.indexOf is not a function`）反馈给开发者，排障体验极差。项目已有 `SypErrorDetailsPanel` 与 `v2-hosted-error-details` 规范，应复用到配置验证场景。

## What Changes

- 扩展桥接验证事件契约：`validated` / `onValidated` 必须向上传递 `errorMessage`（及可选 `errorDetails`），失败时不得吞掉底层错误。
- 在 `V2PlatformConfigBridge` 或 `V2App` 配置流程中，验证失败时在 `.syp-v2` 内展示**友好摘要 + 可查看/复制的脱敏详情**（复用 `SypErrorDetailsPanel`），而非仅依赖 V1 `ElMessage` 或静态黄色 alert。
- 验证失败时保持配置页打开，并同步 `validatePublish` 的 `reason`（若适用），与既有 `v2-validate-publish-gate` 行为一致。
- 为桥接路径补充单测：失败事件携带错误文本、V2 展示详情入口、敏感字段脱敏。
- 不改变各平台 adaptor 的验证逻辑本身（如博客园 XML-RPC）；本变更只改善错误**暴露与呈现**。

## Capabilities

### New Capabilities

- `v2-platform-config-validation-feedback`: 定义 V2 桥接平台配置页在 API/授权验证失败时，向宿主传递完整错误并在 V2 内展示可复制诊断的能力。

### Modified Capabilities

- `v2-hosted-error-details`: 将「宿主内错误详情」从仅覆盖快速发布失败，扩展到**平台配置验证失败**场景，复用同一套脱敏、紧凑、可复制交互。

## Impact

- `src/components/v2/settings/V2PlatformConfigBridge.vue` — 接收并展示验证错误、扩展 emit 载荷。
- `src/components/v2/settings/bridge/platformConfigActionBridge.ts` — 类型化 `onValidated` 结果。
- `src/components/v2/V2App.vue` — `handleConfigValidated` 失败时打开 `SypErrorDetailsPanel` 或等价状态。
- `src/components/set/publish/singleplatform/base/CommonBlogSetting.vue`（及同类桥接表单）— 确保 `emitValidated` 的 `errorMessage` 稳定可用；V2 模式下可考虑抑制重复的全局 `ElMessage`。
- `src/composables/v2/useV2PublishValidation.ts` — 与验证失败 `reason` 对齐（若需合并展示）。
- 测试：`V2PlatformConfigBridge.spec.ts`、配置验证错误展示相关单测。
- 人工验收：博客园等 MetaWeblog 平台在 V2 配置页点击「验证」，失败时必须能看到可复制详情。
