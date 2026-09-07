## Why

V2 Cookie 自动授权当前会把“登录/授权有效”和“已经满足发布条件”混在一起。最明显的问题是语雀 Web：Cookie 验证可以成功，但用户还没有选择可写知识库；这时如果直接启用账号或回到快速发布，快速发布严格来说必然无法发布，用户会以为已经配置完成却卡在下一步。

这次变更要让 V2 消费 `zhi-blog-api` 新增的 `validatePublish(): Promise<PublishValidationResult>`，把授权校验和发布前置校验分开。平台自己的发布规则必须由平台 API/adaptor 自己判断，V2 UI 只消费统一结果，不能靠 `emit` 携带平台规则，也不能在通用 UI 里写语雀知识库这类特判。

## What Changes

- 更新并消费新版 `zhi-blog-api` 的 `validatePublish(): Promise<PublishValidationResult>` SPI。
- 将 Cookie/登录授权成功与发布前置条件通过分成两个独立关卡。
- Cookie 自动授权成功后只刷新账号状态和元数据，不再仅凭授权成功启用账号，也不再仅凭授权成功跳回快速发布。
- V2 在“验证完成”或“保存完成”后统一调用 `validatePublish()`，只有 `isAuth === true` 且 `canPublish === true` 才完成账号配置流程。
- 平台发布规则保留在 API/adaptor 中；V2App、桥接组件、通用表单事件不携带也不解析平台规则。
- 为语雀 Web 增加 `validatePublish()`，要求选择完整的可发布知识库目标。
- 为 V2 表单增加“保存完成”的动作事件，让用户选择完知识库并保存后，也能通过统一校验完成流程。

## Capabilities

### New Capabilities
- `v2-validate-publish-gate`: 定义 V2 如何在启用账号、回到快速发布、允许发布前消费平台 API 的 `validatePublish()`。

### Modified Capabilities
- 无。

## Impact

- 依赖已经发布并导出 `PublishValidationResult` 与 `validatePublish()` 的新版 `zhi-blog-api`。
- 影响 V2 账号配置流程、Cookie 自动授权流程、快速发布可用性判断和发布前兜底校验。
- `CommonBlogSetting` 只新增动作通知；平台发布规则仍在 API/adaptor 代码中。
- `YuquewebWebAdaptor` 需要新增语雀知识库完整性校验。
- 需要补充 V2 跳转/启用逻辑、快速发布兜底、语雀 Web 发布校验相关测试。
