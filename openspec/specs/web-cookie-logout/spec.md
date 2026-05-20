# web-cookie-logout Specification

## Purpose

定义网页 Cookie 授权平台的统一退出/清除授权能力、语雀网页版真实退出请求，以及退出流程中的敏感信息保护。

## Requirements

### Requirement: 网页 Cookie 平台支持统一退出能力
系统 SHALL 为网页 Cookie 授权平台提供统一退出/清除授权能力，优先执行平台适配器提供的动作化退出，并在成功后清理本地授权状态。

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
- **THEN** 系统 SHALL 保留打开退出 URL 的兼容行为
- **AND** 系统 SHALL 向用户展示需要重新验证授权状态的提示

#### Scenario: 平台没有可用退出方式
- **WHEN** 用户对网页 Cookie 平台触发退出/清除授权
- **AND** 当前平台既没有动作化退出能力，也没有可用退出 URL
- **THEN** 系统 SHALL 返回明确失败状态
- **AND** 系统 MUST NOT 使用 mock、占位 URL 或猜测的请求参数继续执行

### Requirement: 语雀网页版使用真实退出请求
系统 SHALL 对语雀网页版执行真实退出请求，而不是打开 `https://www.yuque.com/logout`。

#### Scenario: 语雀 Cookie 和登录信息完整
- **WHEN** 用户对语雀网页版触发退出/清除授权
- **AND** 当前保存的 Cookie 包含 `yuque_ctoken`
- **AND** 系统可从 metadata 或 `/api/mine` 获得当前登录名
- **THEN** 系统 SHALL 发送 `DELETE` 请求到 `https://www.yuque.com/api/accounts/logout`
- **AND** 请求 SHALL 携带当前保存的 Cookie
- **AND** 请求 SHALL 携带由 `yuque_ctoken` 派生的 `x-csrf-token`
- **AND** 请求 SHALL 携带当前登录名作为 `x-login`
- **AND** 请求 SHALL 携带 AJAX 语义所需的请求头
- **AND** 请求成功后系统 SHALL 清空本地 Cookie 并将授权状态写为未授权

#### Scenario: 语雀缺少 CSRF token
- **WHEN** 用户对语雀网页版触发退出/清除授权
- **AND** 当前保存的 Cookie 不包含 `yuque_ctoken`
- **THEN** 系统 SHALL 返回可执行的失败提示，要求用户重新登录或重新读取 Cookie
- **AND** 系统 MUST NOT 伪造 `x-csrf-token`
- **AND** 系统 MUST NOT 使用 `https://www.yuque.com/logout` 作为替代退出方式

#### Scenario: 语雀缺少登录名
- **WHEN** 用户对语雀网页版触发退出/清除授权
- **AND** metadata 中没有登录名
- **THEN** 系统 SHALL 尝试通过现有语雀 metadata 请求获取登录名
- **AND** 如果仍无法获取登录名，系统 SHALL 返回明确失败状态
- **AND** 系统 MUST NOT 伪造 `x-login`

### Requirement: 退出流程保护敏感信息
系统 SHALL 在退出请求、日志、错误提示和测试中保护网页 Cookie 授权敏感信息。

#### Scenario: 记录退出结果
- **WHEN** 系统记录网页 Cookie 平台退出结果
- **THEN** 系统 SHALL 只记录平台 key、退出状态、是否使用动作化退出或 URL fallback 等非敏感信息
- **AND** 系统 MUST NOT 输出原始 Cookie、Authorization、ctoken、token、csrf 或 ticket

#### Scenario: 退出失败提示
- **WHEN** 网页 Cookie 平台退出失败
- **THEN** 系统 SHALL 展示面向用户的可执行提示
- **AND** 系统 MUST NOT 在提示中包含原始请求头、Cookie 字符串或内部调试 token
