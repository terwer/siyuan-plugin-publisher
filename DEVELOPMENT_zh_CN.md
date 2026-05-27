[English](DEVELOPMENT.md)

# 开发指南

## 环境准备

```bash
brew install n
n 22
brew install corepack
corepack enable pnpm
corepack use pnpm@10.22.0

pnpm install
```

## V2 开发（主力模式）

V2 输出到 `dist-v2/`，通过 `vite.config.v2.ts` 构建。

**启动开发服务**

```bash
# 终端 1：启动思源开发者服务
pnpm serve

# 终端 2：V2 监听构建
pnpm dev:v2

# 创建符号链接到思源插件目录（仅首次或 dist-v2 目录变更后执行）
pnpm makeLink:v2
```

**构建**

```bash
pnpm build:v2
```

## 帮助系统

### 架构概览

帮助系统基于 pageId 驱动的注册中心（HelpRegistry），任何页面接入帮助只需传入 `pageId` 即可获得：
- 页面专属帮助面板（HelpPanel）：显示概述、文档链接、FAQ、引导教程入口
- 可视化步骤引导（TourGuide）：高亮页面元素 + 说明卡片
- 字段级提示（FieldGuide）：表单项旁的内联帮助

### 核心文件

```
src/
├── types/IPageHelpConfig.ts        # 类型定义
├── helpConfigs/
│   ├── registry.ts                 # HelpRegistry 单例（三级 fallback）
│   └── pages/
│       ├── _default.ts             # 全局兜底配置
│       ├── quick-publish.ts        # 快速发布页
│       └── platform-config/
│           ├── _default.ts          # 平台配置通用默认
│           └── metaweblog-cnblogs.ts # 博客园专属（含 tour 示例）
└── components/common/help/
    ├── HelpButton.vue              # 帮助按钮（? 图标），触发 HelpPanel
    ├── HelpPanel.vue               # 帮助面板 popover
    ├── TourGuide.vue               # 步骤引导 overlay
    └── FieldGuide.vue              # 字段级提示
```

### Registry 查询链路（3 级 fallback）

1. **精确匹配** — `pageId` 完全一致
2. **目录级 `_default`** — 如 `platform-config/_default` 匹配 `platform-config/xxx`
3. **全局 `_default`** — 兜底配置

### 添加新页面 / 新平台的帮助

只需两步：

**第一步 — 写配置文件**

在 `src/helpConfigs/pages/<namespace>/<pageId>.ts` 创建：

```ts
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const myPageConfig: PageHelpConfig = {
  pageId: "platform-config/my_platform",
  helpUrl: "https://example.com/docs",
  summary: "一句话描述平台用途。",
  fields: {
    apiUrl: { tip: "API 地址的填写说明" },
    username: { tip: "用户名的填写说明" },
  },
  faq: [
    { q: "常见问题1？", a: "解答1。" },
    { q: "常见问题2？", a: "解答2。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='field1']",
      title: "步骤1标题",
      content: "步骤1说明文字。",
      placement: "bottom",
    },
    // ...更多步骤
  ],
}
```

**第二步 — 注册到 Registry**

在 `src/helpConfigs/init.ts` 中 import 并注册：

```ts
import { helpRegistry } from "./registry"
import { myPageConfig } from "./pages/platform-config/my_platform"

helpRegistry.register(myPageConfig)
```

### 添加 Tour 引导步骤

Tour 步骤通过 `data-syp-tour` 属性锚定目标元素。在目标表单组件上添加：

```html
<el-form-item data-syp-tour="apiUrl">...</el-form-item>
```

然后在 tour 配置中引用 `"[data-syp-tour='apiUrl']"` 即可。

**注意：** Tour 查询限制在 `.syp-v2` 容器内（不污染全局 DOM），所有帮助 UI 必须渲染在插件宿主容器范围内。

### 国际化

帮助系统相关文本的 i18n key 命名空间为 `v2.help.*`，参见 `src/locales/zh_CN.ts` 和 `src/locales/en_US.ts`。

## V1 开发（已废弃，仅维护参考）

V1 输出到 `dist/`，通过旧 `scripts/build.py` / `scripts/dev.py` 构建。

```bash
pnpm dev -p siyuan
pnpm makeLink -p siyuan
pnpm build
```

## 打包

```bash
pnpm package
```

产出物结构

```
├── build
  ├── package.zip
  ├── package-widget.zip
  ├── siyuan-plugin-publisher-1.23.5.zip
  ├── siyuan-publisher-nginx-1.23.5
  ├── sy-post-publisher-chrome-1.23.5.zip
  ├── sy-post-publisher-firefox-1.23.5.zip
  └── sy-post-publisher-widget-1.23.5.zip
```

## 同步到旧版 widget 仓库

```bash
pnpm syncWidgetRepo
```