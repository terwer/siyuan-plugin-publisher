# Change: V2 发布闭环 — 详细发布 + 批量分发 + 五视图状态机导航

## Why

V2 采用「原生 DOM + 状态机」形态，**不使用 vue-router**，当前 `currentView` 仅有 3 个视图：

| 视图 | 职责 | 现状 |
|---|---|---|
| `quick_publish` | 当前文档的平台卡片（一键发布/更新/查看/删除/去配置） | ✅ |
| `manage` | 文章管理列表（闪发/单发/批发/查看/图床/平台单发） | ✅ |
| `settings` | 账号 / 图床 / 偏好配置 | ✅ |

这导致发布链路存在三个断点：

1. **没有「详细发布」视图**：管理页「单发/闪发」目前 `openManagePublish(pageId)` 后复用 `quick_publish`（一键）视图，无法进入「发布前配置（标题/正文/标签/分类/Slug）+ 预览」的详细单发。
2. **「批发」没有 UI**：`publishBatchToAll(pageId)` 直接后台批量，没有「选择 文档 × 平台 + 逐项进度/结果」承载。
3. **quick_publish 卡片无「详细发布」入口**：只有一键快速发布，缺少详细配置的次级入口。

用户已明确：V2「详细发布 / 批量分发暂时没做，这个页面很多无法连起来」。若不处理，quick_publish / manage / settings 三视图之间将**闭环不到**详细单发与批量分发。

根因（engineering）：v1 单发/批发的真正 UI 是组件（`SinglePublishSelectPlatform` / `SinglePublishDoPublish` / `BatchPublishIndex`），路由页只是薄壳；但三个外壳组件**顶层**依赖 `vue-router`（`useRoute`/`useRouter`）取导航参数。V2 已内置 element-plus + Pinia + 共享引擎 `usePublish` + `useVueI18n`，故只需把这三个外壳的 `useRoute/useRouter` 解耦为 props+emit，即可让 V2 在原生 DOM 中真正复用 V1 整套成熟表单（功能 100% 保留）。

目标：**把 V2 发布「环路」闭起来**——能进入详细发布（配置在前）与批量分发（选择+进度），各视图互相导航并正确返回；对齐 AGENTS.md「**功能 100% 保留**」（V1 单发/批量行为不退化），复用 V1 已验证逻辑、不重造轮子。

## What Changes

- **采用方案B：抽公共部分，分别桥接**（放弃方案A整体桥接）。**公共部分 = 共享发布引擎 `usePublish` + V1 成熟表单组件链**（`SinglePublishDoPublish` / `BatchPublishIndex` / 全套 form 子组件），V1 与 V2 复用同一引擎与同一套表单。
- **解耦 V1 外壳（去 vue-router，改 props+emit）**：`SinglePublishDoPublish`（`key/id/method/showBack` props + `back` emit）、`SinglePublishSelectPlatform`（`open` emit）、`QuickPublishSelectPlatform`（`pageId` props + `open` emit）；`BackPage` 改 `inject(routerKey/routeLocationKey)` 容错（V2 无 router 不崩、V1 不变）。V1 用包装页从 `useRoute` 取参传入 props 并接管 `@back` 导航，V1 行为不变。
- **V1 宿主接线（保持不变）**：`SinglePublish.vue` / `BatchPublish.vue` / 新增包装页仍用 V1 store + router + V1 i18n，V1 行为不退化。
- **V2 宿主接线**：新增 `single_publish` / `batch_publish` 视图（`currentView` 状态机）+ `V2SinglePublish.vue` / `V2BatchPublish.vue` / `V2QuickPublishGrid.vue`，V2 store + 状态机导航 + `useV2I18n` 连接；`V2SinglePublish`/`V2BatchPublish` 为**轻壳**，内嵌复用 V1 组件（**绝不 router.push**）。V2 不再重写精简引擎（删除 `useV2SinglePublish`/`useV2BatchPublish` 及其 spec）。
- **V2 五视图状态机**：`currentView: "quick_publish" | "single_publish" | "batch_publish" | "manage" | "settings"`；集中 view-router 管 push/pop 与返回来源（复用现有 `returnTarget`）。
- **V2 入口接线**：quick_publish 头部「详细发布」文字 button=次级入口；管理页「单发」→ `single_publish`（带预设平台 key）、「批发」→ `batch_publish`；管理页「闪发」→ 快速平台格。
- **交互模型（已批准原型）**：单发/批发/闪发均以**右侧滑入次级面板**展示，**管理列表仍在背后可见**（遮罩不隐藏列表）；展开行的平台 chip **悬停显示「发布/更新」、点击触发平台单发**；每步有状态条/toast 反馈；面板可 ←/遮罩/Esc 关闭。

## Capabilities

### New Capabilities

- `shared-publish-ui`: 规定公共发布部分 = 共享引擎 `usePublish` + V1 成熟表单组件链（解耦后无 vue-router 依赖，V1/V2 复用同实现，功能 100% 保留）。
- `v2-publish-loop`: 规定 V2 以五视图状态机导航（不使用 vue-router），`single_publish` / `batch_publish` 视图以轻壳内嵌复用 V1 组件，quick_publish 头部提供详细发布入口，管理页动作正确落到对应视图。

### Modified Capabilities

- 无。

## Impact

- 本仓库：`src/components/publish/*`（解耦 V1 外壳：`SinglePublishDoPublish`/`SinglePublishSelectPlatform`/`QuickPublishSelectPlatform`）、`src/components/common/BackPage.vue`（router 容错）、`src/pages/SinglePublish.vue` / `BatchPublish.vue`（薄壳接线）与新增 `src/pages/SinglePublishDoPublish.vue` / `QuickSelect.vue`（路由取参包装）、`src/routes/routeConfig.ts`（改装）、`src/components/v2/V2App.vue`（状态机+集中导航）、`src/components/v2/layout/UnifiedWorkspaceShell.vue`（currentView 联合类型扩展）、`src/components/v2/V2ArticleManage.vue`（单发/批发动作改写）、`src/components/v2/publish/V2SinglePublish.vue` / `V2BatchPublish.vue`（重写为复用壳）。
- 复用但**不修改**共用层：`src/composables/usePublish.ts`、`src/composables/v2/useV2QuickPublish.ts`、`src/composables/v2/useV2ArticleManage.ts`；V1 发布表单组件链虽作外壳解耦，但**逻辑/样式/功能零变化**。
- **不影响**发布传输层（XML-RPC/multipart/JSON）、平台适配器、平台配置存储格式与 `normalizePlatformKey()` 标准。
- **关键约束**：解耦 V1 外壳后，**V1 单发/批发的行为必须回归无退化**（平台选择、标签/分类/Slug 编辑、发布/更新/预览、结果回显逐项对照）。
- **V2 禁止使用 vue-router**：全程用 `currentView` 状态机导航。
