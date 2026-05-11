# v2-web-cookie-authorization Specification

## Purpose

定义 V2 网页 Cookie 平台在配置页中的自动读取、手动编辑、metadata 校验、授权状态写回、敏感信息保护，以及与账号列表/快速发布/V1 旧授权流程的兼容行为。

## Requirements

### Requirement: V2 配置页提供网页 Cookie 授权操作区
系统 SHALL 在 V2 网页平台配置页的 Cookie 输入区域附近提供 Cookie 授权操作区，用于自动读取 Cookie、展示授权状态和保留手动编辑路径。

#### Scenario: Electron 环境展示自动读取入口
- **WHEN** 用户在思源 Electron 环境打开已接入 V2 bridge 的网页 Cookie 平台配置页
- **THEN** 系统 SHALL 在 Cookie 输入区域附近展示“自动读取 Cookie”入口
- **AND** 系统 SHALL 保持 Cookie 文本框可手动编辑
- **AND** 系统 SHALL 使用国际化文案展示简短说明和状态

#### Scenario: 非 Electron 环境展示手动路径
- **WHEN** 用户在不支持 Electron Cookie 读取的环境打开网页 Cookie 平台配置页
- **THEN** 系统 SHALL 不提供可点击的自动读取动作
- **AND** 系统 SHALL 提示用户手动粘贴或修正 Cookie
- **AND** 系统 SHALL 保持 Cookie 文本框可手动编辑

#### Scenario: 非网页 Cookie 平台不展示操作区
- **WHEN** 用户打开 API 授权平台或非 Cookie 密码类型平台配置页
- **THEN** 系统 SHALL 不展示 V2 网页 Cookie 授权操作区

### Requirement: 自动读取 Cookie 后验证并写回授权状态
系统 SHALL 在用户触发自动读取 Cookie 后复用平台 WebAdaptor 的 Cookie 构造和 metadata 校验能力，并根据校验结果写回配置与授权状态。

#### Scenario: 自动读取成功并通过验证
- **WHEN** Electron 环境成功读取到目标平台域名 Cookie 且 `getMetaData()` 返回有效登录态
- **THEN** 系统 SHALL 将构造后的 Cookie 写入当前平台配置的 `password` 字段
- **AND** 系统 SHALL 将 metadata 写入当前平台配置
- **AND** 系统 SHALL 将对应 `DynamicConfig.isAuth` 写为 `true`
- **AND** 系统 SHALL 保存 `DYNAMIC_CONFIG_KEY` 和平台配置
- **AND** 系统 SHALL 展示读取并验证成功的用户反馈

#### Scenario: 自动读取不到目标 Cookie
- **WHEN** Electron 环境未读取到目标平台域名 Cookie
- **THEN** 系统 SHALL 保持 Cookie 文本框可编辑
- **AND** 系统 SHALL 不将 `DynamicConfig.isAuth` 写为 `true`
- **AND** 系统 SHALL 提示用户先完成平台登录后重试或手动粘贴 Cookie

#### Scenario: Cookie 读取成功但验证失败
- **WHEN** 系统读取到 Cookie 但 `getMetaData()` 校验失败
- **THEN** 系统 SHALL 不将 `DynamicConfig.isAuth` 写为 `true`
- **AND** 系统 SHALL 保留用户可编辑 Cookie 内容
- **AND** 系统 SHALL 展示可执行的失败提示

### Requirement: 自动授权不得泄露敏感信息
系统 SHALL 在 Cookie 自动读取、验证、失败提示和测试日志中保护敏感信息。

#### Scenario: 日志记录 Cookie 读取结果
- **WHEN** 系统记录 Cookie 自动读取结果
- **THEN** 系统 SHALL 只记录平台 key、是否读取成功、Cookie 数量或脱敏后的 Cookie 概览
- **AND** 系统 MUST NOT 输出原始 Cookie、Authorization、ctoken、token、csrf 或 ticket

#### Scenario: 用户看到授权失败信息
- **WHEN** Cookie 自动读取或验证失败
- **THEN** 系统 SHALL 展示面向用户的可执行提示
- **AND** 系统 MUST NOT 在提示中包含原始请求头、Cookie 字符串或内部调试 token

### Requirement: V2 自动授权状态刷新不污染快速发布和账号列表
系统 SHALL 在自动读取 Cookie 后刷新相关 V2 状态，但不得把配置页说明文案带到账号列表或快速发布卡片。

#### Scenario: 授权成功后刷新 V2 状态
- **WHEN** 用户在 V2 配置页自动读取 Cookie 并验证成功
- **THEN** 返回账号列表后对应账号 SHALL 显示已授权状态
- **AND** 返回快速发布后对应平台 SHALL 可直接发布

#### Scenario: 快速发布保持直达体验
- **WHEN** 用户查看 V2 快速发布平台卡片
- **THEN** 系统 SHALL 不展示平台描述或 Cookie 授权说明
- **AND** 未授权平台 SHALL 只保留必要的配置入口提示

#### Scenario: 账号列表保持管理体验
- **WHEN** 用户查看 V2 账号列表
- **THEN** 系统 SHALL 不展示平台描述或 Cookie 授权长说明
- **AND** 系统 SHALL 只展示平台身份、授权状态、启停和管理动作

### Requirement: 旧版授权流程保持兼容
系统 SHALL 在新增 V2 Cookie 自动读取能力后保持 V1 平台设置列表中的网页授权和验证流程可用。

#### Scenario: V1 用户使用旧授权入口
- **WHEN** 用户在旧版平台设置列表点击网页平台授权或验证
- **THEN** 系统 SHALL 保持既有授权和验证行为可用
- **AND** 系统 SHALL 不要求用户迁移到 V2 才能完成 Cookie 授权

#### Scenario: 共享授权逻辑更新后 V1 配置格式不变
- **WHEN** 共享 Cookie 授权逻辑写回配置
- **THEN** 系统 SHALL 继续使用现有平台配置字段保存 Cookie 和 metadata
- **AND** 系统 SHALL 不改变历史配置 JSON 结构
