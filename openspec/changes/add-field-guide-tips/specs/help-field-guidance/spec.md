## ADDED Requirements

### Requirement: 配置页提供字段级常驻指引
系统 SHALL 在平台配置页的字段行上提供常驻的字段指引，指引内容按当前平台解析，且在字段已有取值时仍然可见。

#### Scenario: 平台配置了字段提示
- **WHEN** 用户打开某平台配置页，且该平台的 `fields` 为当前行配置了 `tip` 或 `link`
- **THEN** 系统 SHALL 在该行标签旁展示指引入口
- **AND** 悬停时 SHALL 展示 `tip` 文本
- **AND** 配置了 `link` 时 SHALL 同时展示可跳转的说明链接，链接文案取 `linkText`

#### Scenario: 字段已填写
- **WHEN** 用户已经为该字段填入取值
- **THEN** 系统 SHALL 仍然展示该字段的指引入口
- **AND** 指引内容 MUST NOT 依赖输入框为空才可见

#### Scenario: 平台未配置该字段提示
- **WHEN** 当前平台的 `fields` 未包含该行，或既无 `tip` 也无 `link`
- **THEN** 系统 MUST NOT 渲染指引入口
- **AND** 该行布局与未引入指引时保持一致

### Requirement: 指引按平台与实例 key 解析
系统 SHALL 以配置页所属平台的帮助 pageId 解析字段指引，并复用与页面摘要、常见问题、引导教程相同的解析链。

#### Scenario: 共用表单获取 pageId
- **WHEN** 平台配置页由设置桥接组件渲染
- **THEN** 系统 SHALL 由该桥接组件下发唯一的 pageId
- **AND** 指引入口与页面帮助入口 SHALL 使用同一个 pageId 值

#### Scenario: 动态实例账号
- **WHEN** 打开带实例后缀的账号配置页（如 `platform-config/github_Vuepress2-ig1w6`）
- **THEN** 系统 SHALL 沿既有回落链解析到该平台预置配置的 `fields`
- **AND** 解析结果 SHALL 与 `summary`/`faq`/`tour` 的回落行为一致

#### Scenario: 缺少 pageId 来源
- **WHEN** 指引组件在没有 pageId provider 的上下文中渲染
- **THEN** 系统 MUST NOT 渲染指引入口
- **AND** 宿主页面 MUST NOT 因此报错或改变布局

### Requirement: fields 键与配置属性对齐
系统 SHALL 以配置属性名作为平台 `fields` 的键，使指引与所描述的表单行为同一标识，并由测试约束其一致性。

#### Scenario: 键对应真实配置属性
- **WHEN** 校验某个已验证平台的帮助配置
- **THEN** 其 `fields` 的每个键 SHALL 能在该平台合并后的配置实例上取到同名属性
- **AND** 不存在的键 SHALL 使校验失败

#### Scenario: 与引导锚点分属两套命名空间
- **WHEN** 同一表单行同时具备引导步骤与字段提示
- **THEN** 引导步骤 SHALL 使用真实渲染锚点名（鉴权行为 `password`/`token`/`cookie` 三选一）
- **AND** 字段提示 SHALL 使用配置属性名（Token 型平台的鉴权值仍存于 `password`）
- **AND** 两套校验 MUST NOT 相互代替

### Requirement: V2 字段说明以 fields 为单一来源
系统 SHALL 让 V2 配置页的字段说明只来自平台 `fields`，输入框 placeholder 只承担示例与输入格式。

#### Scenario: 说明性文案落位
- **WHEN** 某字段的说明从 placeholder 移入该平台 `fields`
- **THEN** 该行 placeholder SHALL 改为示例值或输入格式
- **AND** 该字段的说明 SHALL 通过指引入口可见
- **AND** 同一段字段说明 MUST NOT 在 V2 表单内出现两份

#### Scenario: 保留 V1 文案
- **WHEN** V2 表单改用示例值 placeholder
- **THEN** 系统 MUST NOT 修改共享的 locales 提示串
- **AND** V1 界面的字段文案 SHALL 保持原样
