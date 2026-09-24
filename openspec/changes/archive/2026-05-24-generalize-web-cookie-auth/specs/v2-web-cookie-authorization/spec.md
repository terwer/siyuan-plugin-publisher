## MODIFIED Requirements

### Requirement: V2 配置页提供网页 Cookie 授权操作区
系统 SHALL 在所有已启用的 V2 网页 Cookie 平台配置页的 Cookie 输入区域附近提供同一个 Cookie 授权操作区，用于自动读取 Cookie、展示授权状态和保留手动编辑路径。该能力 MUST 覆盖 `pre.customCfg` 中已启用的网页 Cookie preset，包括但不限于语雀网页版、Halo 网页版、知乎、CSDN、微信公众号、简书、掘金和 Bilibili。

#### Scenario: Electron 环境展示自动读取入口
- **WHEN** 用户在思源 Electron 环境打开任一已启用并接入 V2 bridge 的网页 Cookie 平台配置页
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

#### Scenario: CSDN 和知乎共享授权操作区
- **WHEN** 用户打开 CSDN 或知乎 V2 配置页
- **THEN** 系统 SHALL 展示与语雀网页版相同的 V2 网页 Cookie 授权操作区
- **AND** 系统 SHALL 通过统一 `useWebCookieAuthorization` 执行自动读取和校验
- **AND** 系统 MUST NOT 使用 CSDN 或知乎专属复制版授权面板

### Requirement: 自动读取 Cookie 后验证并写回授权状态
系统 SHALL 在用户触发自动读取 Cookie 后复用当前平台 WebAdaptor 的 Cookie 构造和 metadata 校验能力，并根据校验结果写回配置与授权状态。该流程 SHALL 对所有网页 Cookie 平台一致：V2 UI 不得按平台分叉；平台差异 SHALL 留在 WebAdaptor 的 `buildCookie()`、`getMetaData()`、`updateCfg()` 和配置字段中。

#### Scenario: 自动读取成功并通过验证
- **WHEN** Electron 环境成功读取到目标平台域名 Cookie 且当前平台 `getMetaData()` 返回有效登录态
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
- **WHEN** 系统读取到 Cookie 但当前平台 `getMetaData()` 校验失败
- **THEN** 系统 SHALL 不将 `DynamicConfig.isAuth` 写为 `true`
- **AND** 系统 SHALL 保留用户可编辑 Cookie 内容
- **AND** 系统 SHALL 展示可执行的失败提示

#### Scenario: CSDN 使用现有 WebAdaptor 校验
- **WHEN** 用户在 CSDN V2 配置页触发自动读取 Cookie
- **THEN** 系统 SHALL 使用 CSDN WebAdaptor 构造 Cookie 并调用其 metadata 校验能力
- **AND** 成功时 SHALL 写回 CSDN 平台配置和授权状态
- **AND** 系统 MUST NOT 新增独立于 WebAdaptor 的 CSDN 授权校验实现

#### Scenario: 知乎使用现有 WebAdaptor 校验
- **WHEN** 用户在知乎 V2 配置页触发自动读取 Cookie
- **THEN** 系统 SHALL 使用知乎 WebAdaptor 构造 Cookie 并调用其 metadata 校验能力
- **AND** 成功时 SHALL 写回知乎平台配置和授权状态
- **AND** 系统 MUST NOT 新增独立于 WebAdaptor 的知乎授权校验实现
