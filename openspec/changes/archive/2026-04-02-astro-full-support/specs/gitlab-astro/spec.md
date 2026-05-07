## ADDED Requirements

### Requirement: GitLab Astro 平台支持
系统 SHALL 提供完整的 GitLab Astro 平台支持，允许用户将思源笔记内容发布到 GitLab 上的 Astro 项目。

#### Scenario: 用户配置 GitLab Astro 平台
- **WHEN** 用户在平台选择界面选择 GitLab Astro 平台
- **THEN** 系统应显示相应的配置表单
- **AND** 配置表单应包含 GitLab 仓库、分支、认证令牌等必要字段

#### Scenario: 用户发布内容到 GitLab Astro
- **WHEN** 用户使用 GitLab Astro 平台发布文章
- **THEN** 系统应生成符合 Astro Frontmatter 格式的 Markdown 文件
- **AND** 文件应推送到指定的 GitLab 仓库和分支
- **AND** Frontmatter 应包含 title、description、pubDate、heroImage 等标准字段

### Requirement: GitLab Astro 适配器实现
系统 SHALL 实现完整的 GitLab Astro 适配器四件套（API 适配器、配置类、占位符类、YAML 转换器）。

#### Scenario: GitLab Astro 适配器注册
- **WHEN** 系统启动时加载适配器
- **THEN** GitLab Astro 适配器应被正确注册
- **AND** 可以通过平台 key "gitlab_Gitlabastro" 访问

#### Scenario: GitLab Astro 配置管理
- **WHEN** 用户保存 GitLab Astro 平台配置
- **THEN** 配置应被正确序列化和反序列化
- **AND** 包含所有必要的 GitLab 和 Astro 特定配置项