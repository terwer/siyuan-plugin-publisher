# SiYuan Publisher 🚀

> 一个插件化的思源笔记发布工具，轻松将笔记发布到多个平台。

[English](./README.md)

## ✨ 特性

- 🔌 **插件系统** - 通过强大的插件架构扩展功能
- 🎯 **多平台发布** - 通过统一的界面发布到各个平台
- 🎨 **现代化界面** - 基于 Vue 3 构建，提供流畅的用户体验
- 🛡️ **类型安全** - 使用 TypeScript 实现，提供更好的开发体验
- 📦 **模块化设计** - 高度模块化的架构，便于维护
- 🔄 **热重载** - 开发时即时反馈
- 📱 **响应式** - 在不同设备上无缝工作

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建依赖包（不包含主应用）
pnpm build --filter=\!@siyuan-publisher/main-app

# 启动开发服务器
pnpm dev -F @siyuan-publisher/main-app
```

## 项目结构

这是一个使用 pnpm workspaces 的 monorepo 项目。项目结构如下：

```
packages/
  ├── core/           # 核心功能和接口
  ├── ui/             # 共享 UI 组件
  ├── plugin-system/  # 插件系统实现
  ├── platform-adapters/ # 平台特定适配器
  └── main-app/       # 主应用程序
```

## 开发

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 开发流程

1. 安装依赖：
```bash
pnpm install
```

2. 构建依赖包：
```bash
# 构建所有依赖包（不包含主应用）
pnpm build --filter=\!@siyuan-publisher/main-app

# 或者构建特定依赖包
pnpm build -F @siyuan-publisher/core
pnpm build -F @siyuan-publisher/ui
pnpm build -F @siyuan-publisher/plugin-system
pnpm build -F @siyuan-publisher/platform-adapters
```

3. 启动开发服务器：
```bash
pnpm dev -F @siyuan-publisher/main-app
```

### 可用脚本

```bash
# 构建所有包（包含主应用）
pnpm build

# 仅构建依赖包（不包含主应用）
pnpm build --filter=\!@siyuan-publisher/main-app

# 构建特定包
pnpm build -F @siyuan-publisher/core
pnpm build -F @siyuan-publisher/ui
pnpm build -F @siyuan-publisher/plugin-system
pnpm build -F @siyuan-publisher/platform-adapters
pnpm build -F @siyuan-publisher/main-app

# 运行测试
pnpm test

# 运行代码检查
pnpm lint
```

## 许可证

MIT