## ADDED Requirements

### Requirement: V2 separates authorization from publish validation
V2 SHALL 将授权成功和发布前置校验成功视为两个独立状态。

#### Scenario: Cookie authorization succeeds
- **WHEN** Cookie 自动授权成功，并且平台登录状态已验证
- **THEN** V2 SHALL 刷新账号状态和快速发布状态
- **AND** V2 SHALL NOT 仅因为 Cookie 授权成功就回到快速发布
- **AND** V2 SHALL NOT 仅因为 Cookie 授权成功就启用账号

#### Scenario: Authorization succeeds but publish validation fails
- **WHEN** 某个平台已经授权，但 `validatePublish()` 返回 `canPublish: false`
- **THEN** V2 SHALL 在用户点击验证或保存后继续停留在配置流程
- **AND** V2 SHALL 在有 `reason` 时展示该原因
- **AND** 快速发布 SHALL NOT 将该平台视为可发布

### Requirement: V2 gates account completion through validatePublish
V2 SHALL 在启用账号或从配置流程返回快速发布前调用平台 API 的 `validatePublish()`。

#### Scenario: Validate action completes and publish validation passes
- **WHEN** 用户点击平台验证，并且授权校验成功
- **AND** `validatePublish()` 返回 `canPublish: true`
- **THEN** V2 SHALL 启用该账号
- **AND** V2 SHALL 完成账号配置流程
- **AND** 如果原始返回目标是快速发布，V2 SHALL 回到快速发布

#### Scenario: Save action completes and publish validation passes
- **WHEN** 用户在选择必要发布配置后点击保存
- **AND** 平台已经处于授权状态
- **AND** `validatePublish()` 返回 `canPublish: true`
- **THEN** V2 SHALL 启用该账号
- **AND** V2 SHALL 完成账号配置流程
- **AND** 如果原始返回目标是快速发布，V2 SHALL 回到快速发布

#### Scenario: Publish validation fails
- **WHEN** 验证或保存动作完成
- **AND** `validatePublish()` 返回 `canPublish: false`
- **THEN** V2 SHALL 保持该账号不可用于快速发布
- **AND** V2 SHALL 保持配置页面打开
- **AND** V2 SHALL 展示平台返回的 `reason`，没有 reason 时展示通用的配置未完成提示

### Requirement: Platform publish rules live in API adaptors
V2 UI 组件 SHALL NOT 实现平台特定的发布前置规则，例如语雀知识库解析。

#### Scenario: Platform has custom publish prerequisites
- **WHEN** 某个平台需要知识库、分类、空间、目录、组织或类似发布目标
- **THEN** 该平台的 API/adaptor SHALL 在自己的 `validatePublish()` 中实现规则
- **AND** V2 UI SHALL 只消费 `canPublish` 和 `reason`

#### Scenario: UI action event is emitted
- **WHEN** 表单发出验证完成或保存完成事件
- **THEN** 该事件 SHALL 只表示一个用户动作已经完成
- **AND** 该事件 MUST NOT 成为平台特定发布规则的来源

### Requirement: Yuque web validates selected knowledge base before publishing
语雀 Web SHALL 实现 `validatePublish()`，在选择完整的可发布知识库目标前阻止发布。

#### Scenario: No Yuque knowledge base selected
- **WHEN** 语雀 Web 配置中没有选中的发布目标
- **THEN** `validatePublish()` SHALL 返回 `canPublish: false`
- **AND** `reason` SHALL 提示用户选择可发布的语雀知识库

#### Scenario: Incomplete Yuque knowledge-base metadata
- **WHEN** 语雀 Web 配置中的目标值缺少 `bookId`、`bookSlug` 或 `login`
- **THEN** `validatePublish()` SHALL 返回 `canPublish: false`
- **AND** 语雀 Web SHALL NOT 被视为发布就绪

#### Scenario: Complete Yuque knowledge-base metadata
- **WHEN** 语雀 Web 配置中的目标值包含 `bookId`、`bookSlug` 和 `login`
- **THEN** `validatePublish()` SHALL 返回 `canPublish: true`
