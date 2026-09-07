# V2 发布闭环设计

## 1. 背景

V2 应用是「原生 DOM + 状态机」，无 vue-router。当前只有 `quick_publish` / `manage` / `settings` 三个视图，无法进入详细发布与批量分发，用户反馈「这个页面很多无法连起来」。

V1 的「单发 / 批发」真正 UI 是组件（`SinglePublishSelectPlatform` / `SinglePublishDoPublish` / `BatchPublishIndex`），路由页只是薄壳传 `id`/`key`。这三者内部依赖 `vue-router`（仅顶层取导航参数）、V1 store（`usePublishSettingStore`/`usePreferenceSettingStore`）、V1 i18n（`useVueI18n`），而 V2 已内置 element-plus + Pinia + 共享引擎 `usePublish`，故只需把三个外壳的 `useRoute/useRouter` 解耦为 props+emit，即可在 V2 原生 DOM 中真正复用整套成熟表单。

## 2. 目标

在**不使用 vue-router** 的前提下，把 V2 发布环路闭起来：

- 进入**详细发布**（配置在前：标题/正文/标签/分类/Slug + 预览）
- 进入**批量分发**（选择 文档×平台 + 逐项进度/结果）
- 各视图可互相导航并**正确返回**
- **功能 100% 保留**（V1 单发/批量行为不退化）
- 复用 V1 已验证逻辑，**不重造轮子**

## 3. 已定决策

| 决策项 | 结论 |
|---|---|
| 整体策略 | **方案B**：抽公共部分，分别桥接（放弃方案A整体桥接） |
| V2 导航 | **禁止使用 vue-router**，导航一律走 `currentView` 状态机 |
| 公共组件 | **把包袱全去**：去 `router` / `store` / `i18n` 依赖，抽「纯展示+行为」，数据与动作全部注入 |
| V1/V2 关系 | **完全独立**，各自接线、最大复用、高内聚低耦合 |
| 一键 vs 详细 | **一键快速=主、详细发布=次级入口** |
| 批发承载 | V2 **复用去耦合后的 `BatchPublishIndex`**（确认） |

## 4. 方案B：抽公共部分（共享发布引擎 + 解耦 V1 外壳），桥接优先

> **公共部分 = 共享发布引擎 `usePublish`（`doSinglePublish` / `initPublishMethods` / `getPostPreviewUrl` + 批量循环）+ V1 成熟表单组件链（`SinglePublishDoPublish` / `BatchPublishIndex` / 全套 form 子组件）**。V1 与 V2 共用同一引擎与同一套表单。
>
> **为什么能直接复用 V1 组件**：V2 构建早已内置 element-plus（`vite.v2.config.ts` 的 `ElementPlusResolver`）+ Pinia + `usePublish`/`usePublishConfig`/`usePublishSettingStore`/`usePreferenceSettingStore`；V1 表单子组件链**不依赖 vue-router**。真正需要解耦的仅顶层外壳的 `useRoute/useRouter`（改 props+emit），故不存在「拖入 element-plus / 无法解耦」问题。

### 4.1 共享发布引擎（`usePublish`）

V1 与 V2 发布动线均复用 `usePublish`：

- 单发/批量/快发/详细发布统一走 `doSinglePublish`（自动受「发布源笔记本」硬校验保护，issue #2044）。
- 文章预处理（slug / YAML 属性 / 摘要标签分类合并）复用 `initPublishMethods`。
- 预览链接复用 `getPostPreviewUrl`。

该引擎不依赖 vue-router，i18n 经注入翻译函数解析，可在 V1/V2 两套运行时中调用。

### 4.2 V1 外壳解耦（去 vue-router，改 props+emit）

- `SinglePublishDoPublish.vue`：`key/id/method/showBack` 改 props，`back` emit；V1 包装页 `pages/SinglePublishDoPublish.vue` 从 `useRoute` 取参传入，`@back` 接管导航。
- `SinglePublishSelectPlatform.vue`：`open` emit（key/id/method）；V1 包装页 `pages/SinglePublish.vue` 监听后 `router.push`。
- `QuickPublishSelectPlatform.vue`：`pageId` 改 props、`open` emit；V1 包装页 `pages/QuickSelect.vue` 监听后 `router.push`。
- `BackPage.vue`：顶层 `useRoute/useRouter` 改为 `inject(routerKey/routeLocationKey)` 容错（V2 无 vue-router 不崩、V1 行为不变），新增可选 `showBack` prop。

### 4.3 V2 复用壳视图（复用 V1 组件）

新增 `single_publish` / `batch_publish` 视图，内部以**轻壳**内嵌复用 V1 组件（绝不 `router.push`）：

- `V2SinglePublish.vue`（复用壳）：V1 两步流程——首步 `SinglePublishSelectPlatform`（选平台），点击进 `SinglePublishDoPublish`（详表单）；若预设平台则直达详表单。V2 轻壳提供返回 + 标题。
- `V2BatchPublish.vue`（复用壳）：直接内嵌 `BatchPublishIndex`。
- `V2QuickPublishGrid.vue`：闪发快速平台格，复用 `useV2QuickPublish.init(pageId)`。
- 不再重写精简引擎：删除 `useV2SinglePublish.ts` / `useV2BatchPublish.ts` 及其 spec。

## 5. 五视图状态机（V2 无 router）

```ts
currentView: "quick_publish" | "single_publish" | "batch_publish" | "manage" | "settings"
```

- 集中 `view-router`：`push(view)` / `pop()` + 返回来源记录（复用现有 `returnTarget`）。
- 内部就是状态机切换，**不使用 vue-router**。
- `UnifiedWorkspaceShell.vue` 的 `currentView` 联合类型同步扩展为 5 视图。

## 6. 交互模型（已批准原型）

> 原型 `tmp/v2-article-manage-real.html`（基于真实 V2 文章管理 UI 复刻），用户确认 ~90% 通过；**原型中单发/批发为占位，真实实现走复用组件**（方案B）。

### 6.1 列表与次级面板

- 管理页**列表仍在背后可见**：点「单发/批发/闪发」时，右侧**滑入次级面板**，遮罩只压暗列表（**不隐藏**）。
- 面板头部：`←` 返回 + 标题（如「单发（详细编辑） · <标题>」）。
- 关闭：`←` / 点遮罩 / `Esc`。

### 6.2 三种动作语义（已最终定稿）

| 动作 | 面板形态 | 关键行为 |
|---|---|---|
| **闪发** | 快速平台格（**逐卡** 发布/更新） | 每张卡一个平台，含「已发布→更新 / 未发布→发布」按钮；底部提示文字「点击上方平台卡即可「发布 / 更新」」 |
| **单发** | **详细编辑表单**（对照 V1 `SinglePublishDoPublish`） | 编辑模式（普通/源码/复杂）、标题(AI)、正文(Markdown/HTML)、知识空间/专栏、Slug、标签别名；底部「预览」「发布 / 更新」 |
| **批发** | 批量多选 + 逐平台结果 | 逐平台勾选（含授权状态），底部「开始批量发布」「取消」；发布过程显示逐平台进度/结果（成功/失败/发布中） |

### 6.3 平台 chip 与反馈

- 展开行 → 平台 chip：**悬停显示「发布/更新」**，**点击=平台单发**。
- 每步有**状态条**（顶部「⏳ 发布中…」）与 **toast** 反馈（成功/失败）。

## 7. 技术架构

### 7.1 复用基石

- `usePublish`（`doSinglePublish(key, id, publishCfg, doc)`）：所有发布动作的共用层。
- V1 成熟表单组件链（`SinglePublishDoPublish` / `BatchPublishIndex` / form 子组件）：V1/V2 共用，V2 以轻壳内嵌复用。
- `useV2QuickPublish` / `useV2ArticleManage`：V2 UI 状态。
- `bridgeRegistry` + `V2PlatformConfigBridge`：平台特有表单桥接（已定标准做法）。

### 7.2 宿主容器约束

- UI 锚定 `.syp-panel`；弹窗用 `position:absolute` 的 popover 卡片，**不用 `el-drawer`**（次级面板用 absolute 滑入）。
- `el-dialog` 必须 `:append-to-body="false"`。

### 7.3 去耦合边界

- 公共组件**不得** import `vue-router`（V1/V2 均在运行时外提供 `useRoute/useRouter` 需经包装页注入或 `inject` 容错）。
- 数据/动作/翻译由宿主经 props/事件/inject 注入；V1 store/i18n 经 `useVueI18n`/`usePublishSettingStore` 在 V2 已内置运行时可用。

## 8. 关键验收（Phase 1，最重要）

- 解耦 V1 外壳（去 vue-router 改 props+emit）后，**V1 单发/批发的行为回归无退化**：平台选择、标签/分类/Slug 编辑、发布/更新/预览、结果回显，逐项对照 V1 现状。
- V2 以轻壳内嵌复用 V1 组件，**功能 100% 保留**（编辑模式/AI/知识空间/Slug/标签别名/摘要/分类/发布时间/状态/强制删除/同步回思源/预览）。

## 9. 风险

- **R1**：新增视图破坏现有 quick_publish / manage 的导航与返回 → 集中 view-router 统一管理 push/pop/返回来源。
- **R2**：解耦 V1 外壳导致 V1 路由取参/返回退化 → V1 用包装页从 `useRoute` 取参传入 props + `@back` 接管导航，并回归手验。
- **R3**：`BackPage` 在 V2（无 vue-router）崩溃 → 改用 `inject(routerKey/routeLocationKey)` 容错，V2 无 router 时不崩、V1 行为不变。
- **R4**：公共组件去耦合不彻底，残留 store/router 引用 → 单测 + grep 约束，禁止引入上述依赖。
