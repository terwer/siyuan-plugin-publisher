## ADDED Requirements

### Requirement: YAML 类型配置支持
系统 SHALL 在本地系统模式中提供 FsYamlType 配置项，允许用户选择使用的 YAML 生成类型。
枚举值为 FsYamlType.Hexo="hexo"、FsYamlType.Hugo="hugo"等需要兼容所有的可能。

#### Scenario: 配置 YAML 类型
- **WHEN** 用户在设置页面选择 YAML 类型
- **THEN** 系统应保存该配置
- **AND** 在发布时应根据配置选择对应的 YAML 适配器

### Requirement: 动态 YAML 适配器选择
系统 SHALL 根据配置的 FsYamlType 动态选择合适的 YAML 适配器。

#### Scenario: 使用 Hexo YAML 适配器
- **WHEN** 用户设置 FsYamlType 为 FsYamlType.Hexo
- **THEN** 系统应使用 HexoYamlConvertAdaptor 生成 YAML
- **AND** 生成的 YAML 应符合 Hexo 平台的格式要求

### Requirement: 向后兼容性
系统 SHALL 确保与现有的 yamlLinkEnabled 功能兼容。

#### Scenario: 启用 yamlLinkEnabled
- **WHEN** 用户设置 FsYamlType 并启用 yamlLinkEnabled
- **THEN** 系统应同时应用 YAML 适配器和链接配置
- **AND** 生成的 YAML 应包含正确的 permalink 字段

### Requirement: 配置界面支持
系统 SHALL 在设置页面提供 YAML 类型选择的界面元素。

#### Scenario: 用户选择 YAML 类型
- **WHEN** 用户在设置界面选择 YAML 类型
- **THEN** 系统应保存该选择并在下次使用时生效

### Requirement: YAML 变量替换
系统 SHALL 支持在 YAML 模板中使用变量，自动替换为文章的实际信息（如标题、标签、日期等）。

#### Scenario: 使用变量生成 YAML
- **WHEN** YAML 模板包含 `{{title}}` 和 `{{date}}` 等变量
- **THEN** 系统应在生成时将变量替换为文章的实际内容
- **AND** 生成的 YAML 应包含正确的文章元数据