# astro-yaml Specification

## Purpose

定义本地系统模式下 Astro Frontmatter YAML 的生成、解析与适配器选择行为。

## Requirements

### Requirement: Astro YAML 适配器支持
系统 SHALL 提供 Astro 平台的 YAML 适配器，支持标准的 Astro Frontmatter 格式。

#### Scenario: 用户在本地系统模式中选择 Astro YAML 类型
- **WHEN** 用户配置本地系统发布模式并选择 FsYamlType 为 Astro
- **THEN** 系统应生成符合 Astro Frontmatter 格式的 YAML
- **AND** 生成的 Frontmatter 包含 title、description、pubDate、heroImage 等标准字段

#### Scenario: 系统支持 Astro Frontmatter 到 Post 对象的转换
- **WHEN** 系统读取包含 Astro Frontmatter 的 Markdown 文件
- **THEN** 系统应正确提取 title、description、pubDate、heroImage 等字段
- **AND** 将字段值映射到 Post 对象的对应属性

#### Scenario: 日期格式兼容性
- **WHEN** 用户使用 Astro YAML 适配器
- **THEN** 系统应使用 ISO 8601 格式处理发布日期和更新时间
- **AND** 支持时区信息

### Requirement: FsYamlType 枚举扩展
系统 SHALL 在 FsYamlType 枚举中添加 Astro 类型支持。

#### Scenario: FsYamlType 枚举扩展
- **WHEN** 添加 Astro 枚举值到 FsYamlType
- **THEN** 枚举定义应保持现有格式和注释规范
- **AND** 不影响现有枚举值的功能

### Requirement: FsUtils 适配器选择逻辑
系统 SHALL 在 FsUtils 中添加 Astro 适配器选择支持。

#### Scenario: FsUtils 适配器选择逻辑
- **WHEN** 添加 Astro 适配器支持
- **THEN** 应在 switch 语句中添加 Astro 分支
- **AND** 使用延迟导入避免循环依赖
