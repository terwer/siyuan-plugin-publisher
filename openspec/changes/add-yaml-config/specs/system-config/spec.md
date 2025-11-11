## ADDED Requirements

### Requirement: YAML 配置项支持
系统 SHALL 在本地系统模式中提供 YAML 类型的配置项功能，允许用户为不同平台定义 YAML 元数据规则。

#### Scenario: 创建 YAML 配置
- **WHEN** 用户在设置页面选择平台并添加 YAML 配置
- **THEN** 系统应保存该平台的 YAML 规则配置
- **AND** 配置应包含平台标识和对应的 YAML 模板

### Requirement: 平台特定 YAML 规则
系统 SHALL 支持为每个发布平台定义独立的 YAML 规则，确保生成的 YAML 符合各平台的格式要求。

#### Scenario: 配置多平台 YAML 规则
- **WHEN** 用户为 WordPress 和 GitHub 分别配置不同的 YAML 规则
- **THEN** 系统应正确保存两套独立的配置
- **AND** 在发布时应根据目标平台应用对应的 YAML 规则

### Requirement: YAML 适配器集成
系统 SHALL 利用现有的适配器架构实现 YAML 配置的处理，确保与各平台的发布逻辑无缝集成。

#### Scenario: 使用适配器处理 YAML
- **WHEN** 系统调用适配器发布内容
- **THEN** 适配器应根据配置生成对应的 YAML 元数据
- **AND** 将 YAML 与文章内容合并后发布

### Requirement: YAML 语法验证
系统 SHALL 提供 YAML 配置的语法验证功能，帮助用户避免配置错误。

#### Scenario: 验证 YAML 配置
- **WHEN** 用户输入无效的 YAML 配置
- **THEN** 系统应显示错误提示
- **AND** 高亮显示错误位置并提供修复建议

### Requirement: YAML 变量替换
系统 SHALL 支持在 YAML 模板中使用变量，自动替换为文章的实际信息（如标题、标签、日期等）。

#### Scenario: 使用变量生成 YAML
- **WHEN** YAML 模板包含 `{{title}}` 和 `{{date}}` 等变量
- **THEN** 系统应在生成时将变量替换为文章的实际内容
- **AND** 生成的 YAML 应包含正确的文章元数据