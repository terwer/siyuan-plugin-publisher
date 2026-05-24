## MODIFIED Requirements

### Requirement: 网页 Cookie 平台支持统一退出能力
系统 SHALL 为所有网页 Cookie 授权平台提供统一退出/清除授权能力，优先执行平台适配器提供的动作化退出，并在成功后清理本地授权状态。V2 UI 层 SHALL 只调用统一退出能力，不得为语雀、CSDN、知乎或其他网页平台复制退出流程。

#### Scenario: 平台提供动作化退出
- **WHEN** 用户对已授权的网页 Cookie 平台触发退出/清除授权
- **AND** 当前平台 WebAdaptor 提供 `logoutWebAuth()` 能力
- **THEN** 系统 SHALL 调用该适配器退出动作
- **AND** 系统 SHALL 在退出成功后清空当前平台配置的 Cookie 字段
- **AND** 系统 SHALL 将对应 `DynamicConfig.isAuth` 写为 `false`
- **AND** 系统 SHALL 保存平台配置和 `DYNAMIC_CONFIG_KEY`

#### Scenario: 平台仅支持退出 URL fallback
- **WHEN** 用户对网页 Cookie 平台触发退出/清除授权
- **AND** 当前平台没有动作化退出能力但存在可用 `logoutUrl`
- **THEN** 系统 SHALL 通过统一退出能力保留打开退出 URL 的兼容行为
- **AND** 系统 SHALL 向用户展示需要重新验证授权状态的提示
- **AND** V2 UI MUST NOT 自行按平台打开退出 URL

#### Scenario: 平台没有可用退出方式
- **WHEN** 用户对网页 Cookie 平台触发退出/清除授权
- **AND** 当前平台既没有动作化退出能力，也没有可用退出 URL
- **THEN** 系统 SHALL 返回明确失败状态
- **AND** 系统 MUST NOT 使用 mock、占位 URL 或猜测的请求参数继续执行

#### Scenario: CSDN 和知乎使用统一退出入口
- **WHEN** 用户在 CSDN 或知乎 V2 配置页触发退出/清除授权
- **THEN** V2 UI SHALL 调用统一网页 Cookie 退出能力
- **AND** 统一能力 SHALL 基于平台 WebAdaptor 能力和 `logoutUrl` 决定动作化退出或 URL fallback
- **AND** 系统 MUST NOT 在 CSDN 或知乎 Setting 组件内实现专属退出流程
