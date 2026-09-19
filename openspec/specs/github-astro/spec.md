# github-astro Specification

## Purpose

定义将思源笔记内容发布到 GitHub 上 Astro 项目的平台支持与适配器行为。

## Requirements

### Requirement: GitHub Astro 平台支持
系统 SHALL 提供完整的 GitHub Astro 平台支持，允许用户将思源笔记内容发布到 GitHub 上的 Astro 项目。

#### Scenario: 用户配置 GitHub Astro 平台
- **WHEN** 用户在平台选择界面选择 GitHub Astro 平台
- **THEN** 系统应显示相应的配置表单
- **AND** 配置表单应包含 GitHub 仓库、分支、认证令牌等必要字段

#### Scenario: 用户发布内容到 GitHub Astro
- **WHEN** 用户使用 GitHub Astro 平台发布文章
- **THEN** 系统应生成符合 Astro Frontmatter 格式的 Markdown 文件
- **AND** 文件应推送到指定的 GitHub 仓库和分支
- **AND** Frontmatter 应包含 title、description、pubDate、heroImage 等标准字段

### Requirement: GitHub Astro 适配器实现
系统 SHALL 实现完整的 GitHub Astro 适配器四件套（API 适配器、配置类、占位符类、YAML 转换器）。

#### Scenario: GitHub Astro 适配器注册
- **WHEN** 系统启动时加载适配器
- **THEN** GitHub Astro 适配器应被正确注册
- **AND** 可以通过平台 key "github_Astro" 访问

#### Scenario: GitHub Astro 配置管理
- **WHEN** 用户保存 GitHub Astro 平台配置
- **THEN** 配置应被正确序列化和反序列化
- **AND** 包含所有必要的 GitHub 和 Astro 特定配置项
