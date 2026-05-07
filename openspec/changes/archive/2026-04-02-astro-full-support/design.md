# 全方位 Astro 平台支持设计

## 架构设计

### 1. 平台类型定义
根据项目架构，需要在以下位置添加 Astro 支持：

- **GitHub 平台**：`SubPlatformType.Github_Astro = "Astro"`
- **GitLab 平台**：`SubPlatformType.Gitlab_Astro = "Gitlabastro"`
- **本地文件系统**：`FsYamlType.Astro = "astro"`

### 2. 文件结构规划
```
src/adaptors/api/
├── astro/                    # GitHub Astro 适配器
│   ├── astroApiAdaptor.ts
│   ├── astroConfig.ts
│   ├── astroPlaceholder.ts
│   ├── astroYamlConverterAdaptor.ts
│   └── useAstroApi.ts
└── gitlab-astro/            # GitLab Astro 适配器
    ├── gitlabastroApiAdaptor.ts
    ├── gitlabastroConfig.ts
    ├── gitlabastroPlaceholder.ts
    ├── gitlabastroYamlConverterAdaptor.ts
    └── useGitlabastroApi.ts
```

### 3. Astro Frontmatter 格式规范
```yaml
---
title: 'First post'
description: 'Lorem ipsum dolor sit amet'
pubDate: '2022-07-08T00:00:00.000Z'
heroImage: '../../assets/blog-placeholder-3.jpg'
draft: false
---
```

**字段映射规则：**
- `title` → Post.title
- `description` → Post.shortDesc
- `pubDate` → Post.dateCreated（ISO 8601 格式）
- `heroImage` → 图片路径（支持相对路径）
- `draft` → 发布状态控制

### 4. 适配器实现策略
每个平台的适配器都需要实现完整的四件套：
1. **API 适配器**：继承相应的基类（BaseBlogApi 或 CommonGitlabApiAdaptor）
2. **配置类**：继承相应的基类配置（CommonBlogConfig 或对应的 GitLab 配置）
3. **占位符类**：提供用户界面的提示文本
4. **使用函数**：提供统一的初始化入口

### 5. 集成方式
- **枚举扩展**：在 `SubPlatformType` 和 `FsYamlType` 中添加 Astro 相关枚举值
- **平台注册**：在 `src/platforms/pre.ts` 中注册新的平台选项
- **适配器注册**：在 `src/adaptors/index.ts` 中注册新的适配器
- **前端集成**：在配置页面中添加 Astro 选项

## 兼容性考虑

### GitHub/GitLab 发布
- 完全兼容现有的 Git 平台发布逻辑
- 支持通过 Git 将生成的 Astro 文件推送到仓库
- 保持与现有 Hexo、Hugo 等平台的一致性

### 本地文件系统
- 与 LocalSystem 适配器无缝集成
- 支持本地预览和构建
- YAML 适配器可独立使用

### 现有平台
- 不影响现有平台的适配器
- 遵循相同的接口和实现模式
- 保持代码结构的一致性

## 技术细节

### 日期格式处理
- pubDate 使用 ISO 8601 格式：`2022-07-08T00:00:00.000Z`
- 支持时区信息
- 与 Astro 官方文档保持一致

### 图片路径处理
- heroImage 路径支持相对路径格式
- 自动处理图片资源路径转换
- 与现有的图片上传逻辑集成

### 错误处理
- 继承现有的错误处理机制
- 提供详细的调试日志
- 保持与现有适配器的一致性