# 项目上下文

## 项目目的
发布工具（Publisher）是一个思源笔记(siyuan-note)的插件，用于将思源笔记中的文章发布到多个平台，如 WordPress、博客园、语雀、知乎、CSDN、B站、小红书等。项目定位为免费、开源的内容发布工具，旨在简化用户将笔记发布到各种平台的流程。

## 技术栈
- Vue 3.5.17：前端框架
- Vite 5.4.18：构建工具
- TypeScript 5.6.2：编程语言
- Python：构建脚本
- siyuan-note 2.9.0+：宿主环境
- 支持多平台：windows, linux, darwin, docker, android, ios
- 支持多前端：desktop, desktop-window, mobile, browser-desktop, browser-mobile

## 重要开发说明
**注意：必须使用 pnpm 进行开发和构建，并且必须使用 `pnpm dev -p siyuan` 命令来启动思源笔记插件的开发环境。**

**特别强调：禁止使用 require 导入内部模块，必须使用 ES Module 的 import/export 语法。这是项目的强制要求，以确保代码的一致性和可维护性。**

**重要提醒：大部分情况下禁止使用动态导入（dynamic import），除非有特殊说明和充分理由。在绝大多数场景下，必须使用显式的头部 ESM import 语句进行模块导入。**

## 项目约定

### 代码风格
- 使用 TypeScript 进行开发
- 遵循 Vue 3 的 Composition API 最佳实践
- 使用 eslint 和 prettier 进行代码风格检查和格式化
- 支持中英文国际化，主要语言文件位于 locales 目录
- 代码遵循 GPL v3 开源许可证

### 架构模式
- 适配器模式：为不同的发布平台提供统一的接口，便于扩展新平台
- 模块化设计：按功能和平台类型划分模块，如 adaptors、components、utils 等
- 支持三种主要的适配器类型：API授权、网页授权、文件系统
- 使用 Pinia 进行状态管理
- 使用 Vue Router 进行路由管理

### 测试策略
- 包含单元测试，如 common/pageUtils.spec.ts
- 支持不同平台的测试验证
- 使用 Vitest 进行测试

### Git 工作流
- 使用 GitHub Actions 进行 CI/CD
- 使用 release-please 进行版本管理和更新日志生成

## 领域上下文
- 平台类型：支持多种发布平台类型，包括 Common、Metaweblog、WordPress、Github、Gitlab、Custom、System、Fs 等
- 认证方式：支持 API 授权、网页授权、文件系统访问等多种认证方式
- 分类体系：支持单选分类（如知乎、B站）和多选分类（如 WordPress、博客园）
- 发布设置：包括发布设置和偏好设置两大类别
- YAML 配置：支持动态 YAML 适配器选择，包括 Hexo、Hugo、Jekyll、Vuepress、Vitepress 等平台的 YAML 格式

## 重要约束
- 某些类库需要动态引用，不能直接构建，如 fetch-blob、formdata-polyfill
- 图片上传逻辑需要根据不同平台的要求进行适配
- 需要兼容思源笔记的多种运行环境和前端类型

## 外部依赖
- 第三方框架：turbo、Vue、Vite、TypeScript
- 宿主环境：siyuan-note
- 平台API：各发布平台的开放API或网页接口
- UI组件库：Element Plus 2.11.5
- 状态管理：Pinia 3.0.3
- 国际化：vue-i18n 11.1.7

## 核心功能
- ✅ **一键发布**：初始设置后，可一键发布文章
- ✅ **多平台支持**：通过统一的博客API为多个平台提供内置适配器
- ✅ **动态平台添加**：用户可以添加自定义平台
- ✅ **图片托管**：集成PicGO（需要单独的插件），支持S3、MinIO、水印等功能
- ✅ **AI集成**：包含基于当前文档上下文的AI聊天功能
- ✅ **智能内容处理**：自动生成标题、摘要、标签、别名和分类
- ✅ **文章绑定**：将已发布的文章链接回思源笔记进行管理
- ✅ **主题适配**：支持深色和浅色模式
- ✅ **多语言界面**：支持中文和英文
- ✅ **灵活视图**：支持简单、详细和源代码发布模式
- ✅ **部署选项**：可作为思源插件（推荐）、Chrome扩展或自托管使用

## 支持的平台
- WordPress
- Cnblogs (博客园)
- Yuque (语雀)
- Notion
- Hexo
- Zhihu (知乎)
- Confluence
- Bilibili (哔哩哔哩)
- Xiaohongshu (小红书)
- Evernote
- Docsify
- Douban (豆瓣)
- Flowus
- Xlog
- Halo
- Telegraph
- Quartz
- Hugo
- Jekyll
- Vuepress
- Vitepress
- Typecho
- CSDN
- Jianshu (简书)
- Juejin (掘金)
- Wechat (微信公众号)
- Gitlab 系列平台

## 项目结构
```
├── common/                  # 通用工具类
├── openspec/                # 项目规范文档
│   ├── changes/             # 变更提案
│   └── project.md           # 项目上下文文档
├── public/libs/             # 外部库文件
├── scripts/                 # 构建和开发脚本
├── siyuan/                  # 思源笔记集成模块
│   ├── api/                 # 内核API封装
│   ├── i18n/                # 国际化文件
│   ├── invoke/              # 插件调用工具
│   ├── store/               # 本地存储配置
│   └── utils/               # 工具函数
├── src/                     # 主要源代码
│   ├── adaptors/            # 平台适配器
│   │   ├── api/             # API授权适配器
│   │   ├── fs/              # 文件系统适配器
│   │   └── web/             # 网页授权适配器
│   ├── ai/                  # AI相关常量和提示
│   ├── assets/              # 静态资源
│   ├── components/          # Vue组件
│   ├── composables/         # Vue组合式函数
│   ├── extensions/          # 浏览器扩展
│   ├── layouts/             # 页面布局
│   ├── locales/             # 语言包
│   ├── models/              # 数据模型
│   ├── pages/               # 页面组件
│   ├── platforms/           # 平台元数据和配置
│   ├── routes/              # 路由配置
│   ├── stores/              # 状态存储
│   ├── types/               # TypeScript类型定义
│   ├── utils/               # 工具函数
│   ├── vendors/             # 第三方供应商集成
│   ├── workers/             # 后台工作线程
│   └── App.vue              # 主应用组件
├── index.html               # 入口HTML文件
├── package.json             # 项目配置文件
├── plugin.json              # 插件配置文件
├── widget.json              # 挂件配置文件
├── tsconfig.json            # TypeScript配置
├── vite.config.ts           # Vite配置
└── syp.config.ts            # 应用配置文件
```

## 关键架构组件

### 1. 平台适配器
平台适配器是项目的核心架构，采用适配器模式为不同的发布平台提供统一的接口：
- `adaptors/api/` - API授权适配器（如WordPress、Metaweblog等）
- `adaptors/fs/` - 文件系统适配器（如本地文件系统、FTP等）
- `adaptors/web/` - 网页授权适配器（如知乎、CSDN等）

### 2. YAML 配置系统
支持动态 YAML 适配器选择，允许用户根据目标平台选择合适的 YAML 格式：
- FsYamlType 枚举定义了支持的 YAML 类型（Hexo、Hugo、Jekyll、Vuepress等）
- FsUtils 工具类根据配置动态选择对应的 YAML 适配器
- 每个平台都有对应的 YAML 转换适配器实现

### 3. 配置管理
- 使用 Pinia 进行全局状态管理
- 平台配置存储在 JSON 文件中
- 支持动态平台配置和用户偏好设置

### 4. AI 集成
- 内置 AI 功能，支持自动生成标题、摘要、标签和分类
- 支持多种 AI 模型和自定义 API 配置
- 提供 AI 提示模板管理

### 5. 国际化
- 支持中英文界面
- 使用 vue-i18n 进行国际化管理
- 语言文件位于 siyuan/i18n/ 目录

## 开发指南

### 1. 代码组织
- 按功能模块组织代码，保持高内聚低耦合
- 使用 TypeScript 提供类型安全
- 遵循 Composition API 最佳实践

### 2. 平台扩展
- 新平台应继承对应的基类配置
- 实现统一的 API 接口
- 提供对应的 YAML 转换适配器（如需要）

### 3. 配置管理
- 平台配置应继承 CommonBlogConfig 基类
- 使用 JSON 格式存储配置Core Features
- 支持动态配置更新

### 4. 错误处理
- 统一错误处理机制
- 提供用户友好的错误提示
- 记录详细的错误日志