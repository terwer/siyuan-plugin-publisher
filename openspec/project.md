# Project Context

## Purpose
发布工具是一个思源笔记(siyuan-note)的插件，用于将思源笔记中的文章发布到多个平台，如 WordPress、博客园、语雀等。项目定位为免费、开源的内容发布工具，旨在简化用户将笔记发布到各种平台的流程。

## Tech Stack
- Vue 3.3.4+：前端框架
- Vite 4.2+：构建工具
- TypeScript 5.0+：编程语言
- Python：构建脚本
- siyuan-note 2.9.0+：宿主环境
- 支持多平台：windows, linux, darwin, docker, android, ios
- 支持多前端：desktop, desktop-window, mobile, browser-desktop, browser-mobile

## Project Conventions

### Code Style
- 使用 TypeScript 进行开发
- 遵循 Vue 3 的 Composition API 最佳实践
- 使用 eslint 和 prettier 进行代码风格检查和格式化
- 支持中英文国际化，主要语言文件位于 locales 目录

### Architecture Patterns
- 适配器模式：为不同的发布平台提供统一的接口，便于扩展新平台
- 模块化设计：按功能和平台类型划分模块，如 adaptors、components、utils 等
- 支持三种主要的适配器类型：API授权、网页授权、文件系统

### Testing Strategy
- 包含单元测试，如 common/pageUtils.spec.ts
- 支持不同平台的测试验证

### Git Workflow
- 使用 GitHub Actions 进行 CI/CD
- 使用 release-please 进行版本管理和更新日志生成

## Domain Context
- 平台类型：支持多种发布平台类型，包括 Common、Metaweblog、WordPress、Github、Gitlab、Custom、System、Fs 等
- 认证方式：支持 API 授权、网页授权、文件系统访问等多种认证方式
- 分类体系：支持单选分类（如知乎、B站）和多选分类（如 WordPress、博客园）
- 发布设置：包括发布设置和偏好设置两大类别

## Important Constraints
- 某些类库需要动态引用，不能直接构建，如 fetch-blob、formdata-polyfill
- 图片上传逻辑需要根据不同平台的要求进行适配
- 需要兼容思源笔记的多种运行环境和前端类型

## External Dependencies
- 第三方框架：turbo、Vue、Vite、TypeScript
- 宿主环境：siyuan-note
- 平台API：各发布平台的开放API或网页接口
