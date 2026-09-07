# Change: 全方位支持 Astro 平台

## Why
Astro 是一个现代化的静态站点生成器，具有出色的性能和开发体验。当前系统缺少对 Astro 平台的完整支持。用户需要能够：
1. 通过 GitHub 发布到 Astro 项目
2. 通过 GitLab 发布到 Astro 项目
3. 在本地文件系统中使用 Astro YAML 格式

通过添加完整的 Astro 支持，用户可以将思源笔记内容无缝发布到 Astro 项目，享受其现代化的构建性能和开发体验。

## What Changes
- **GitHub Astro 支持**：添加 `github_Astro` 子平台类型
- **GitLab Astro 支持**：添加 `gitlab_Gitlabastro` 子平台类型
- **本地系统 Astro YAML 适配器**：在 FsYamlType 中添加 Astro 类型
- **完整的适配器实现**：为每个平台创建完整的 API 适配器、配置类、占位符类和使用函数
- **前端集成**：在平台选择界面中添加 Astro 选项
- **文档更新**：更新相关文档和平台列表

## Impact
- 涉及代码：多个目录和文件的新增与修改
- 不影响现有功能，属于功能扩展
- 用户可以通过配置选择完整的 Astro 平台支持
- 代码结构保持一致性，遵循现有适配器模式
- 支持全方位的 Astro 平台集成（GitHub、GitLab、本地文件系统）