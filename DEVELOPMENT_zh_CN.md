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

## Hermes Agent 项目级 Profile

目标：这个仓库要像 Claude/Codex 的项目隔离一样使用：进入项目目录，直接运行 `hermes`，自动使用本项目独立的 Hermes 状态。不要靠全局 sticky profile 切换。

### 当前 profile

- Profile 名称：`siyuan-plugin-publisher`
- Profile Home：`~/.hermes/profiles/siyuan-plugin-publisher`
- 项目环境文件：`.envrc`

本仓库提交的 `.envrc` 内容为：

```bash
export HERMES_PROFILE="siyuan-plugin-publisher"
export HERMES_HOME="$HOME/.hermes/profiles/$HERMES_PROFILE"
```

真正起隔离作用的是 `HERMES_HOME`：Hermes 会从这个目录读取 `config.yaml`、`.env`、skills、memory、sessions、cron 等状态。`HERMES_PROFILE` 只是可读标记。

### 每台机器只配置一次

只在你已经使用的 shell profile 里配置一次 direnv hook。之后任何项目只要有自己的 `.envrc`，都复用同一套工作流。

macOS / 本机 zsh：

```bash
# ~/my_profile.sh，这个文件由 ~/.zshrc 自动 source
if command -v direnv >/dev/null 2>&1; then
  eval "$(direnv hook zsh)"
fi
```

Windows 的 WSL2 或 Git Bash：

```bash
# ~/.bashrc、~/.zshrc，或你自己自动 source 的 my_profile.sh
if command -v direnv >/dev/null 2>&1; then
  eval "$(direnv hook bash)"   # 如果用 zsh，就把 bash 改成 zsh
fi
```

Windows PowerShell：

```powershell
# 只需要加一次到 $PROFILE
Invoke-Expression "$(direnv hook pwsh)"
```

这套配置是通用的。不要为每个项目创建 `hermes-syp` 这种专用 alias/function；换项目后不可复用。

### 本仓库只配置一次

```bash
# 如果 profile 不存在，先创建本项目独立 profile。
# --clone 会把当前 default 的 config/.env/SOUL.md/skills 复制一份作为起点。
hermes profile create siyuan-plugin-publisher --clone

# 信任本仓库的 .envrc。
cd /Volumes/workspace/mydocs/siyuan-plugins/siyuan-plugin-publisher
direnv allow
```

如果希望完全干净，不继承 default profile，可以改用：

```bash
hermes profile create siyuan-plugin-publisher
```

### 日常使用

```bash
cd /Volumes/workspace/mydocs/siyuan-plugins/siyuan-plugin-publisher
hermes
```

预期行为：direnv 自动加载 `.envrc`，所以 `hermes` 不需要额外参数就会使用 `~/.hermes/profiles/siyuan-plugin-publisher`。

### 验证

```bash
cd /Volumes/workspace/mydocs/siyuan-plugins/siyuan-plugin-publisher

echo "$HERMES_PROFILE"
echo "$HERMES_HOME"
hermes config path
```

macOS/Linux/WSL/Git Bash 上期望输出：

```text
siyuan-plugin-publisher
/Users/terwer/.hermes/profiles/siyuan-plugin-publisher
/Users/terwer/.hermes/profiles/siyuan-plugin-publisher/config.yaml
```

Windows PowerShell 中 `$HOME` 是 Windows 用户目录，所以完整路径会不同，但必须以这个结尾：

```text
.hermes\profiles\siyuan-plugin-publisher\config.yaml
```

如果输出仍然指向 `~/.hermes/config.yaml`，说明当前 shell 没有加载 direnv。改完 shell profile 后重新打开终端，再 `cd` 回仓库。

### 使用注意

- 不要用 `hermes profile use siyuan-plugin-publisher` 作为本项目隔离方案；它会修改全局 sticky default profile，离开目录后仍然污染其他项目。
- 不要指望在已经启动的 Hermes 会话里执行 `direnv allow` 就能切换当前 Hermes 的 profile；必须从已经加载 direnv 环境的 shell 里重新启动 Hermes。
- 飞书/Lark gateway 是后台服务，不会跟随某个终端的当前目录自动切换 profile；这里的配置只影响在本仓库终端里启动的 Hermes 命令。
- 密钥和凭据放到 profile 自己的 `.env`：`~/.hermes/profiles/siyuan-plugin-publisher/.env`，不要提交到仓库。

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