# @siyuan-publisher/main-app

思源发布者主应用程序。

[English](./README.md)

## 特性

- 现代化的 Vue 3 应用
- 响应式设计
- 插件管理界面
- 平台配置
- 内容发布工作流
- 双构建模式：SPA 和思源插件

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器（SPA 模式）
pnpm dev

# 构建生产版本（SPA 模式）
pnpm build

# 开发模式（思源插件模式，带监听）
pnpm dev:siyuan

# 构建思源插件版本
pnpm build:siyuan

# 预览生产构建（SPA 模式）
pnpm preview
```

## 构建模式

### SPA 模式（默认）
默认构建模式创建标准的单页应用程序（SPA）构建。此模式适用于：
- 开发和测试
- 独立 Web 应用部署
- 与其他 Web 平台集成

### 思源插件模式
插件模式专门为思源插件集成创建构建。此模式：
- 生成 CommonJS 格式输出
- 包含必要的插件文件（README、LICENSE、图标等）
- 支持浏览器环境中的 Node.js polyfills
- 支持开发时的监听模式

插件模式使用单独的 Vite 配置文件（`vite.siyuan.config.ts`）来处理插件特定的构建需求。

## 项目结构

```
src/
  ├── components/     # 可复用组件
  ├── views/         # 页面组件
  ├── composables/   # Vue 组合式函数
  ├── assets/        # 静态资源
  ├── App.vue        # 根组件
  ├── index.ts       # 插件入口（思源插件模式）
  └── main.ts        # 应用入口（SPA 模式）
```

## 构建

应用程序使用 Vite 构建。构建过程：

1. 编译 TypeScript
2. 打包 Vue 组件
3. 处理资源文件
4. 生成生产构建

### 构建配置
- SPA 模式：
  - ES 模块输出
  - 手动代码分割
  - Terser 压缩
  - 启用源码映射

- 插件模式：
  - CommonJS 输出
  - Node.js polyfills
  - 静态文件复制
  - 基于监听模式的条件压缩
  - 插件兼容的自定义文件命名

## 开发

开发服务器包含：

- 热模块替换（HMR）
- TypeScript 支持
- Vue DevTools 集成
- 错误覆盖层

## 许可证

MIT 