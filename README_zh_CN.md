# SiYuan Publisher 🚀

> 一个基于插件的思源笔记发布工具，让多平台发布变得简单。

[English](./README.md)

## ✨ 特性

- 🔌 **插件系统** - 通过强大的插件架构扩展功能
- 🎯 **多平台发布** - 使用统一的界面发布到多个平台
- 🎨 **现代界面** - 使用 Vue 3 构建，提供流畅的用户体验
- 🛡️ **类型安全** - 完全使用 TypeScript 编写，提供更好的开发体验
- 📦 **模块化设计** - 高度模块化的架构，便于维护
- 🔄 **热重载** - 开发时即时反馈
- 📱 **响应式** - 在不同设备上无缝工作

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建依赖（不包括 main-app）
pnpm build --filter=\!@siyuan-publisher/main-app

# 启动开发服务器（SPA 模式）
pnpm dev -F @siyuan-publisher/main-app

# 思源插件模式：
# 1. 启动思源笔记 PC 客户端
# 2. 创建开发所需的符号链接（如果发现已存在的插件会提示是否删除）
pnpm makeLink
# 3. 启动开发服务器
pnpm dev:siyuan -F @siyuan-publisher/main-app
```

## 项目结构

这是一个使用 pnpm workspaces 的 monorepo 项目。项目结构如下：

```
packages/
  ├── core/           # 核心功能和接口
  ├── ui/             # 共享 UI 组件
  ├── plugin-system/  # 插件系统实现
  ├── platform-adapters/ # 平台特定适配器
  └── main-app/       # 主应用
```

## 开发

### 前置要求

- Node.js >= 18
- pnpm >= 8

### 开发流程

1. 安装依赖：
```bash
pnpm install
```

2. 构建依赖：
```bash
# 构建所有依赖（不包括 main-app）
pnpm build --filter=\!@siyuan-publisher/main-app

# 或构建特定依赖
pnpm build -F @siyuan-publisher/core
pnpm build -F @terwer/ui
pnpm build -F @siyuan-publisher/plugin-system
pnpm build -F @siyuan-publisher/platform-adapters
```

3. 启动开发服务器：

#### SPA 模式
用于独立 Web 应用开发：
```bash
pnpm dev -F @siyuan-publisher/main-app
```

#### 思源插件模式
用于思源插件开发：
```bash
# 1. 启动思源笔记 PC 客户端
# 2. 创建开发所需的符号链接（如果发现已存在的插件会提示是否删除）
pnpm makeLink

# 3. 启动开发服务器
pnpm dev:siyuan -F @siyuan-publisher/main-app
```

### 构建模式

主应用支持两种构建模式：

#### SPA 模式（默认）
- 标准 Web 应用构建
- 适合开发和测试
- 使用默认 Vite 配置
- 构建命令：`pnpm build -F @siyuan-publisher/main-app`

#### 思源插件模式
- 构建为思源插件
- 包含插件特定文件和配置
- 使用单独的 Vite 配置（`vite.siyuan.config.ts`）
- 需要创建开发符号链接（`pnpm makeLink`）
- 需要思源笔记 PC 客户端正在运行
- 构建命令：`pnpm build:siyuan -F @siyuan-publisher/main-app`

### 可用脚本

```bash
# 构建所有包（包括 main-app）
pnpm build

# 仅构建依赖（不包括 main-app）
pnpm build --filter=\!@siyuan-publisher/main-app

# 构建特定包
pnpm build -F @siyuan-publisher/core
pnpm build -F @terwer/ui
pnpm build -F @siyuan-publisher/plugin-system
pnpm build -F @siyuan-publisher/platform-adapters
pnpm build -F @siyuan-publisher/main-app

# 以思源插件模式构建 main-app
pnpm build:siyuan -F @siyuan-publisher/main-app

# 创建开发所需的符号链接（插件模式必需）
# 注意：如果发现已存在的插件会提示是否删除
pnpm makeLink

# 运行测试
pnpm test

# 运行代码检查
pnpm lint
```

## 许可证

MIT