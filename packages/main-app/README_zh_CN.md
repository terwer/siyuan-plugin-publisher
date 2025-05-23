# @siyuan-publisher/main-app

思源笔记发布工具的主应用。

[English](./README.md)

## 特性

- 现代化的 Vue 3 应用
- 响应式设计
- 插件管理界面
- 平台配置
- 内容发布工作流

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```
src/
  ├── components/     # 可复用组件
  ├── views/         # 页面组件
  ├── composables/   # Vue 组合式函数
  ├── assets/        # 静态资源
  ├── App.vue        # 根组件
  └── main.ts        # 应用入口
```

## 构建

应用使用 Vite 构建。构建过程包括：

1. 编译 TypeScript
2. 打包 Vue 组件
3. 处理资源文件
4. 生成生产构建

## 开发

开发服务器包含：

- 热模块替换 (HMR)
- TypeScript 支持
- Vue DevTools 集成
- 错误覆盖层

## 许可证

MIT 