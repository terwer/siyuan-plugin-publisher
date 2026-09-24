# 插件开发

发布工具是一个思源插件。这份文档面向想读源码、改行为或接新平台的开发者。

## 从这里开始

- [插件开发手册](/dev/plugin-development) —— 目录结构、构建命令、平台接入流程

## 快速了解

| 主题 | 位置 |
|---|---|
| 插件源码 | `src/` |
| 界面代码 | `src/ui/`（`components/` 原生实现，`components/bridge/` 复用的共享表单） |
| 宿主运行时 | `siyuan/host/` |
| 四个 web 产物（扩展 / 挂件 / nginx / vercel） | `src/webapp/` + `vite.webapp.config.ts` |
| 平台适配器 | `src/adaptors/` |
| 帮助与引导配置 | `src/helpConfigs/` |

## 构建命令

```bash
pnpm dev        # 调试 / watch
pnpm build      # 类型检查 + 构建并打包插件
pnpm makeLink   # 软链到思源工作区
pnpm docs:dev   # 本地预览本文件站
pnpm docs:build # 构建本文件站
```

::: tip 本文件站本身
这个站点由 VitePress 构建，部署在 GitHub Pages 上。发布工具本身支持发布到 VitePress —— 也就是说，这份文档可以用插件自己来发。
:::