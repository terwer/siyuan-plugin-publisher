# Design: publisher-help-system

## 核心理念

**按 `pageId` 注册，不按 `platformKey`。** 任何页面只需传 `pageId`，帮助系统自动匹配配置，与页面是"平台配置"还是"快速发布"还是"仪表盘"完全无关。

## 1. 配置系统

### 目录结构

```
src/helpConfigs/
  registry.ts              # HelpRegistry — 统一入口
  pages/
    quick-publish.ts       # 快速发布页
    platform-select.ts     # 平台选择页
    account-list.ts        # 账号管理列表
    preference-general.ts  # 偏好-通用
    preference-picbed.ts   # 偏好-图床
    preference-ai.ts       # 偏好-AI
    ai-chat.ts             # AI 聊天
    about.ts               # 关于
    batch-publish.ts       # 批量发布（未来）
    dashboard.ts           # 仪表盘（未来）
    platform-config/       # 平台配置（按平台分组）
      metaweblog-cnblogs.ts
      wordpress-wordpress.ts
      common-yuque.ts
      common-halo.ts
      custom-yuqueweb.ts
      custom-haloweb.ts
      github-hexo.ts       # 静态站点共享通用 fields
      # ... 35 个平台
  common-
    fields.ts              # 通用字段描述（apiUrl, username, password 等共享定义）
    faqs.ts                # 通用 FAQ
```

### 类型系统

```ts
// src/types/IPageHelpConfig.ts

/** 字段帮助 */
interface FieldHelp {
  label?: string
  placeholder?: string
  tip?: string            // Popover 提示
  link?: string           // 详细文档链接
  linkText?: string
}

/** 可视化引导步骤 */
interface TourStep {
  target: string          // CSS 选择器
  title: string
  content: string
  placement?: "top" | "bottom" | "left" | "right" | "auto"
}

/** 单个页面的帮助配置 — 核心类型 */
interface PageHelpConfig {
  /** 页面唯一标识 */
  pageId: string
  /** 完整帮助文档 URL（兜底） */
  helpUrl?: string
  /** 页面简介（HelpPanel 顶部） */
  summary?: string
  /** 字段级帮助 */
  fields?: Record<string, FieldHelp>
  /** 步骤引导 */
  tour?: TourStep[]
  /** 常见问题 */
  faq?: Array<{ q: string; a: string }>
}

/**
 * 参数化 pageId：
 * "platform-config/metaweblog_Cnblogs" → 查 platform-config 子注册表
 */
type PageId = string  // 支持 / 分隔命名空间
```

### HelpRegistry 设计

```ts
class HelpRegistry {
  private pageConfigs: Map<string, PageHelpConfig>

  constructor() {
    // 编译期收集所有 page configs（静态 import）
    this.loadAll()
  }

  /** 按 pageId 查询 */
  get(pageId: string): PageHelpConfig | undefined
  getField(pageId: string, fieldName: string): FieldHelp | undefined
  getTour(pageId: string): TourStep[] | undefined

  /** Fallback 链 */
  getHelpUrl(pageId: string): string
  // "platform-config/metaweblog_Cnblogs" 不存在
  //   → "platform-config/*" 不存在
  //   → 全局默认：https://siyuan.wiki/s/...
}
```

## 2. 组件设计

### HelpPanel（通用帮助抽屉）

```
┌──────────────────────────────────┐
│ 📖 <pageTitle> 帮助               │
│ ──────────────────────────────── │
│ <summary>                        │
│ ──────────────────────────────── │
│ 🔗 查看完整帮助文档 →              │
│ ──────────────────────────────── │
│ 📝 常见问题                       │
│   Q: <faq.q>                     │
│   A: <faq.a>                     │
│ ──────────────────────────────── │
│ 🚀 开始引导教程                    │  ← 仅 tour 非空时显示
└──────────────────────────────────┘
```

Props：
- `pageId: string` — 必传
- `pageTitle?: string` — 面板标题，默认取 summary 第一行

### FieldGuide（字段内联提示）

```html
<FieldGuide page-id="quick-publish" field="targetPlatform">
  <el-form-item>...</el-form-item>
</FieldGuide>
```

- 包裹任意表单字段
- 从 Registry 读 `fields[field]`
- 无配置 → 不渲染 `?` 图标（零打扰）

### TourGuide（步骤引导 overlay）

- 自研实现，基于 Vue 3 Teleport + Element Plus
- 按 pageId 从 Registry 取 tour steps
- localStorage 记录 `tour:completed:<pageId>` 状态
- 每页独立跟踪，平台配置页用 `pageId = "platform-config/<key>"` 区分

## 3. 接入方式

任何页面接入只需要两步：

### 步骤 1：创建配置文件

```ts
// src/helpConfigs/pages/quick-publish.ts
export const quickPublishHelp: PageHelpConfig = {
  pageId: "quick-publish",
  helpUrl: "https://siyuan.wiki/s/...",
  summary: "选择目标平台，填写文章信息，一键发布。",
  fields: {
    targetPlatform: { tip: "选择要发布的平台", link: "..." },
    title: { tip: "文章标题，可留空使用文档标题" },
    tags: { tip: "逗号分隔，部分平台支持多标签" },
  },
  tour: [
    { target: ".syp-select-platform", title: "选择平台", content: "..." },
    { target: ".syp-publish-btn", title: "点击发布", content: "..." },
  ],
  faq: [
    { q: "发布失败怎么办？", a: "查看错误详情..." },
  ],
}
```

### 步骤 2：页面接入

```html
<!-- 任何 .vue 页面 -->
<HelpButton page-id="quick-publish" />

<!-- 或完整 HelpPanel -->
<HelpPanel page-id="quick-publish" page-title="快速发布" />

<!-- 字段级 -->
<FieldGuide page-id="quick-publish" field="title">
  <el-input v-model="form.title" />
</FieldGuide>

<!-- 引导 -->
<TourGuide page-id="quick-publish" />
```

**不需要改任何已有组件架构，纯叠加。**

## 4. 平台配置的 pageId 约定

```
页面：V2PlatformConfigBridge.vue
pageId = "platform-config/" + platformKey
```

例如博客园 → `platform-config/metaweblog_Cnblogs`，配置文件在 `src/helpConfigs/pages/platform-config/metaweblog-cnblogs.ts`。

Registry 内部解析逻辑：
```
get("platform-config/metaweblog_Cnblogs")
  → 查 pages/platform-config/metaweblog-cnblogs.ts ✅
  → 不存在则查 pages/platform-config/_default.ts（通用平台配置帮助）
  → 兜底全局 helpUrl
```

## 5. 文件结构总览

```
src/
  helpConfigs/
    registry.ts                       # HelpRegistry
    pages/
      _default.ts                     # 全局兜底
      quick-publish.ts
      platform-select.ts
      account-list.ts
      preference-general.ts
      preference-picbed.ts
      preference-ai.ts
      ai-chat.ts
      about.ts
      platform-config/
        _default.ts                   # 平台配置通用帮助
        metaweblog-cnblogs.ts
        wordpress-wordpress.ts
        common-yuque.ts
        ...
  components/
    common/
      help/
        HelpPanel.vue                 # 帮助抽屉
        HelpButton.vue                # ? 按钮（触发 HelpPanel）
        FieldGuide.vue                # 字段内联提示
        TourGuide.vue                 # 步骤引导 overlay
        TourGuideStep.vue             # 单步渲染
  types/
    IPageHelpConfig.ts
```

## 6. 与现有代码的关系

| 现有 | 迁移 |
|------|------|
| `src/platforms/help.ts` | 删除，内容迁到 `platform-config/*.ts` |
| `BackPage.vue` `onHelp()` | 改为调用 `HelpRegistry.getHelpUrl(pageId)` |
| `PublishSettingTips.vue` | 保留 V1 专用，V2 不再引用 |
| `V2PlatformConfigBridge.vue` | 加一行 `<HelpButton :page-id="'platform-config/' + platformKey" />` |