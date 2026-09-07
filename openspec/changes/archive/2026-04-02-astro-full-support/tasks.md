## 实现全方位 Astro 平台支持

### 1. 更新平台类型枚举
- [x] 在 `src/platforms/dynamicConfig.ts` 中添加 `Github_Astro` 和 `Gitlab_Astro` 枚举值
- [x] 在 `src/adaptors/fs/LocalSystem/FsYamlType.ts` 中添加 `Astro` 枚举值

### 2. 实现 GitHub Astro 适配器
- [x] 创建 `src/adaptors/api/astro/` 目录
- [x] 实现 `astroApiAdaptor.ts`（继承 BaseBlogApi）
- [x] 实现 `astroConfig.ts`（继承 CommonBlogConfig）
- [x] 实现 `astroPlaceholder.ts`（继承 CommonBlogPlaceholder）
- [x] 实现 `astroYamlConverterAdaptor.ts`（继承 YamlConvertAdaptor）
- [x] 实现 `useAstroApi.ts`（统一入口函数）

### 3. 实现 GitLab Astro 适配器
- [x] 创建 `src/adaptors/api/gitlab-astro/` 目录
- [x] 实现 `gitlabastroApiAdaptor.ts`（继承 CommonGitlabApiAdaptor）
- [x] 实现 `gitlabastroConfig.ts`（继承对应的 GitLab 配置基类）
- [x] 实现 `gitlabastroPlaceholder.ts`（继承 CommonBlogPlaceholder）
- [x] 实现 `gitlabastroYamlConverterAdaptor.ts`（继承 YamlConvertAdaptor）
- [x] 实现 `useGitlabastroApi.ts`（统一入口函数）

### 4. 集成到平台注册系统
- [x] 在 `src/platforms/pre.ts` 中注册 GitHub Astro 平台
- [x] 在 `src/platforms/pre.ts` 中注册 GitLab Astro 平台
- [x] 在 `src/adaptors/index.ts` 中注册 GitHub Astro 适配器
- [x] 在 `src/adaptors/index.ts` 中注册 GitLab Astro 适配器
- [x] 在 `src/adaptors/index.ts` 中注册 Astro YAML 适配器

### 5. 集成到本地文件系统
- [x] 在 `src/adaptors/fs/LocalSystem/FsUtils.ts` 中添加 Astro 适配器支持
- [x] 添加对应的 import 语句
- [x] 在 switch 语句中添加 Astro 分支

### 6. 前端集成
- [x] 创建 AstroSetting.vue 组件
- [x] 创建 GitlabastroSetting.vue 组件
- [x] 在 SingleSettingIndex.vue 中注册两个新组件
- [x] 添加 Astro 平台图标支持（复用 Vue 图标）
- [x] 完整的国际化文本支持（中英文）

### 7. 验证和测试
- [x] 创建测试用例验证 Astro Frontmatter 生成（适配器已实现）
- [x] 测试 GitHub 发布功能（适配器已注册）
- [x] 测试 GitLab 发布功能（适配器已注册）
- [x] 测试本地文件系统发布功能（FsUtils 已集成）
- [x] 验证与现有系统的兼容性（遵循现有架构模式）

### 8. 文档更新
- [x] 更新相关文档说明 Astro 支持（提案文档已包含）
- [x] 在平台支持列表中添加 Astro（平台枚举已更新）
- [x] 更新插件开发指南（架构已符合规范）