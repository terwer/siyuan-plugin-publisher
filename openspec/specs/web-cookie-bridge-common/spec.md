# web-cookie-bridge-common Specification

## Purpose

定义 V2 Bridge 中所有已启用网页 Cookie 平台共享的授权操作区接入、slot 透传、能力判定和防重复实现要求，确保新增网页 Cookie 平台默认复用同一 `V2WebCookieAuthPanel` 与 `useWebCookieAuthorization` 流程。
## Requirements
### Requirement: 所有启用的网页 Cookie 平台 SHALL 接入 V2 Bridge 共用 Cookie 授权操作区
系统 SHALL 为 `pre.customCfg` 中已启用、`authMode` 为网页授权且配置密码类型为 Cookie 的平台，在 V2 Bridge 配置页展示同一个 Cookie 授权操作区。该能力 MUST 通过共用 slot/面板/composable 接入，不得为 CSDN、知乎或其他网页平台复制一套授权 UI。

#### Scenario: 用户打开 CSDN V2 配置页
- **WHEN** 用户在 V2 账号设置中选择或编辑 CSDN 网页平台
- **THEN** 系统 SHALL 在 CSDN Cookie 字段附近展示 V2 Web Cookie 授权操作区
- **AND** 系统 SHALL 保持 Cookie 文本框可手动展开和编辑
- **AND** 系统 MUST NOT 渲染 CSDN 专属的重复授权面板

#### Scenario: 用户打开知乎 V2 配置页
- **WHEN** 用户在 V2 账号设置中选择或编辑知乎网页平台
- **THEN** 系统 SHALL 在知乎 Cookie 字段附近展示 V2 Web Cookie 授权操作区
- **AND** 系统 SHALL 复用与语雀网页版相同的自动读取、手动编辑和状态反馈入口
- **AND** 系统 MUST NOT 要求知乎使用独立于共用 Web Cookie 授权流程的新实现

#### Scenario: 新增已启用网页 Cookie preset
- **WHEN** 代码中新增一个启用状态的 `pre.customCfg` 网页 Cookie 平台
- **THEN** V2 Bridge selector SHALL 能选择该平台
- **AND** 该平台配置页 SHALL 通过共用 Cookie slot 展示 V2 Web Cookie 授权操作区
- **AND** 自动化测试 SHALL 因该平台缺少 bridge component 或 slot 透传而失败

### Requirement: Web Setting 组件 SHALL 只透传共用 Cookie actions slot
所有网页平台 Setting 组件 SHALL 将 `cookie-actions` slot 原样透传给 `CustomWebSetting` / `CommonBlogSetting`。平台组件 MAY 设置平台 placeholder、header 提示和校验开关，但 MUST NOT 内联 V2 Cookie 授权 UI 或复制授权状态写回逻辑。

#### Scenario: 平台 Setting 接收 V2 cookie-actions slot
- **WHEN** V2 Bridge 挂载任一已启用网页 Cookie 平台 Setting 组件并提供 `cookie-actions` slot
- **THEN** 该 Setting 组件 SHALL 将 `cfg`、`dynCfg`、`setting`、`dynamicConfigArray`、手动编辑展开状态和切换方法原样传给外层 slot
- **AND** `CommonBlogSetting` SHALL 继续作为 Cookie 字段状态来源

#### Scenario: V1 旧设置页未提供 cookie-actions slot
- **WHEN** 用户在 V1/旧设置入口打开同一网页平台配置页
- **THEN** 系统 SHALL 显示原有 Cookie 文本框和校验/保存入口
- **AND** 系统 SHALL NOT 渲染 V2 Web Cookie 授权操作区
- **AND** V1 配置格式 SHALL 保持不变

### Requirement: 共用能力 SHALL 使用平台能力契约判定而不是 subtype 白名单
系统 SHALL 使用 `authMode=WEBSITE` 与 `PasswordType_Cookie` 等平台能力契约判定是否展示和执行 Web Cookie 授权。除统一退出能力中确有平台协议差异外，V2 Bridge、V2WebCookieAuthPanel 和 slot 透传层 MUST NOT 使用语雀、CSDN、知乎等 subtype 白名单决定是否启用共用授权 UI。

#### Scenario: 平台满足网页 Cookie 契约
- **WHEN** 某平台 `dynCfg.authMode` 为 `WEBSITE` 且 `cfg.passwordType` 为 `PasswordType_Cookie`
- **THEN** V2 Web Cookie 授权操作区 SHALL 展示
- **AND** 自动读取 SHALL 调用统一 `useWebCookieAuthorization` 流程

#### Scenario: 平台不满足网页 Cookie 契约
- **WHEN** 某平台是 API token、密码或非网页授权平台
- **THEN** V2 Web Cookie 授权操作区 SHALL 不展示
- **AND** 系统 SHALL 保持该平台原有配置校验行为
