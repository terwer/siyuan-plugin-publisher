## ADDED Requirements

### Requirement: V2 配置页提供网页 Cookie 退出/清除授权入口
系统 SHALL 在 V2 网页 Cookie 授权操作区提供退出/清除授权入口，并复用统一网页 Cookie 退出能力。

#### Scenario: 已授权平台展示退出入口
- **WHEN** 用户在 V2 配置页打开已授权的网页 Cookie 平台
- **THEN** 系统 SHALL 在 Cookie 授权操作区展示退出/清除授权入口
- **AND** 该入口 SHALL 与自动读取 Cookie 和手动编辑路径共同展示

#### Scenario: 用户在 V2 触发退出
- **WHEN** 用户点击 V2 网页 Cookie 授权操作区的退出/清除授权入口并确认
- **THEN** 系统 SHALL 调用统一网页 Cookie 退出能力
- **AND** 退出成功后系统 SHALL 清空当前配置表单中的 Cookie 值
- **AND** 系统 SHALL 将对应平台授权状态刷新为未授权
- **AND** 系统 SHALL 展示退出或清除授权成功的用户反馈

#### Scenario: V2 退出失败
- **WHEN** 用户在 V2 触发退出/清除授权但平台退出失败
- **THEN** 系统 SHALL 保留当前可编辑配置
- **AND** 系统 SHALL 展示可执行的失败提示
- **AND** 系统 MUST NOT 在界面中展示原始 Cookie、CSRF token 或请求头敏感值

### Requirement: V1 与 V2 共享退出状态写回语义
系统 SHALL 让 V1 旧设置列表和 V2 配置页使用一致的网页 Cookie 退出状态写回语义。

#### Scenario: V1 验证失败后触发退出
- **WHEN** V1 旧设置列表中的网页 Cookie 平台验证失败并提示用户退出/重新授权
- **THEN** 系统 SHALL 调用统一网页 Cookie 退出能力
- **AND** 对语雀网页版 SHALL 执行动作化退出请求而不是打开失效退出 URL
- **AND** 退出成功后 SHALL 清空本地 Cookie 并写回未授权状态

#### Scenario: V1 和 V2 状态保持一致
- **WHEN** 用户在 V1 或 V2 任一入口完成网页 Cookie 平台退出/清除授权
- **THEN** 另一个入口再次打开时 SHALL 看到未授权状态
- **AND** 快速发布入口 SHALL 不再把该平台视为已授权可直接发布
