# Task Plan — V2 发布闭环：详细发布 + 批量分发 + 统一视图导航（状态机，无 vue-router；代号 v2-publish-loop）

> 状态：**设计讨论稿**（用户：先把规划写出来，慢慢讨论）。**未动任何代码。**

## 背景：V2 当前环路是断的

V2 应用是「原生 DOM + 状态机」，无 vue-router。当前 `currentView` 仅 3 个视图：

| 视图 | 职责 | 现状 |
|---|---|---|
| `quick_publish` | 当前文档的平台卡片（一键 发布/更新/查看/删除/去配置） | ✅ |
| `manage` | 文章管理列表（闪发/单发/批发/查看/图床/平台单发） | ✅ |
| `settings` | 账号 / 图床 / 偏好配置 | ✅ |

**三个断点：**
1. **没有「详细发布」视图**。管理页「单发/闪发」→ `openManagePublish(pageId)` → `quickPublish.init(pageId)` → 仍落到「一键」quick_publish，进不去「发布前配置（标签/分类/slug…）+ 预览」的详细单发。
2. **「批发」没有 UI**。`publishBatchToAll(pageId)` 直接后台跑批量，没有「选择 文档×平台 + 逐项进度/结果」。
3. **quick_publish 卡片无「详细发布」入口**，只有一键快速发布。

→ 结果：quick_publish、manage、settings 三视图之间**闭环不到**详细单发与批量分发，这就是「这个页面很多无法连起来」的根因。

## 目标

把 V2 的发布「环路」闭起来：能进入**详细发布**（配置在前）与**批量分发**（选择+进度），且各视图可互相导航并**正确返回**。对齐 AGENTS.md：**功能 100% 保留**（V1 的单发/批量行为不退化），复用 V1 已验证逻辑，不重造。

## 实现原则（用户底线，最优先）
1. **桥接优先，100% 保留**：能用桥接就桥接，直接用 V1 已验证实现，行为与 V1 完全一致。
2. **抽公共部分，分别桥接**：若整体桥接不干净（依赖多、冲突大），则把「可复用公共部分」拆出来桥接。
3. **禁止造轮子**：不重写 V1 已有的发布 UI/逻辑；复用 `usePublish` 等共用层。
4. **V2 禁止使用 vue-router**（用户明确）：V2 全程用 `currentView` 状态机导航，不引入 vue-router。
5. **把包袱全去掉，V1/V2 完全独立**：抽出的公共部分**彻底解耦**（去 router / store / i18n 依赖），V1 与 V2 各自独立接线，互不牵连。
6. **最大复用 + 高内聚低耦合 + 大胆重构小心求证**：公共部分内聚、与外部分离；宁可方案优质（慢一点），不留技术债/伤疤。

> ## 已定决策（2026-08-24）
> - 采用**方案B**：抽公共部分、分别桥接（放弃方案A整体桥接）。
> - **V2 禁止使用 vue-router**，导航一律走 `currentView` 状态机。
> - **公共部分彻底去耦合**：把 router/store/i18n 全部剥掉，抽象出「纯展示+行为」的公共发布组件，数据与动作通过 props/事件/inject 注入；**V1、V2 完全独立**。
> - 理由：V1 发布组件依赖 router + V1 store + V1 i18n，在 V2 原生 DOM 里整体桥接要补上下文，太脆且留下双轨；彻底去耦合 + 最大复用，才是优质方案。

## 既有桥接基建（可复用，findings §A）
- `src/components/v2/settings/V2PlatformConfigBridge.vue`：`getV2BridgeComponent(subtype)` 动态挂载 **V1 Setting 组件**到 V2 `.syp-panel`，用 `provide()` 桥接 `validated/saved/cookie-authorized` 事件。
- `src/components/v2/settings/bridge/bridgeRegistry.ts`：`SubPlatformType → V1 Setting 组件` 映射表。
- **结论**：V2 已经有「动态挂载 V1 组件 + provide 桥接事件」的标准做法，可直接套用到发布视图。

## 关键事实（阻断项，findings §B）
- V1 单发/批发的**真正 UI** 是组件（`SinglePublishSelectPlatform` / `BatchPublishIndex`），路由页只是薄壳传 `id` prop → 组件本身**可脱离 router 页单独存在**。
- 但这两个组件内部**依赖**：`vue-router`(`useRouter`)、V1 store（`usePublishSettingStore`/`usePreferenceSettingStore`）、V1 i18n（`useVueI18n`）。
- V2 是无 router 原生 DOM、V2 store、`useV2I18n` → **整体桥接需为 V1 组件补齐 router/store/i18n 上下文**，这是能否「100% 桥接」的关键难点。

## 设计方向（方案B：抽公共部分，彻底去耦合）

### B1. 抽出「纯展示 + 行为」公共发布组件（公共部分，彻底解耦）
- 目标：从 `SinglePublishSelectPlatform` / `BatchPublishIndex` 抽出**不依赖 router / store / i18n** 的公共组件，令 V1 与 V2 **完全独立**地复用同一份实现。
- 公共组件只接收「数据 + 动作回调」（全部注入/emit）：
  - 入参：`pageId`、`enabledConfigArray`（平台列表）、`postInfo`/`postMeta`、发布状态。
  - 动作：`onPublish(key)` / `onUpdate(key)` / `onPreview(key)` / `onNavigate(...)` 等回调，由宿主决定具体实现。
  - i18n：用注入的翻译函数 / props（不硬绑 `useVueI18n` 或 `useV2I18n`）。
- **V1 宿主**：路由页/`Admin.vue` 用 V1 store + router + V1 i18n 连接这些回调。
- **V2 宿主**：`single_publish`/`batch_publish` 视图用 V2 store + `currentView` 状态机 + `useV2I18n` 连接这些回调（回调内调 `usePublish.doSinglePublish` / `batchPublish`，绝不 router.push）。

### B2. V2 原生视图承载公共部分
- 新增 `single_publish` / `batch_publish` 视图（`currentView` 状态机），内部：
  - 挂载 B1 的公共组件，`:id="pageId"`。
  - 提供 V2 的 store/i18n + 动作回调（**调用 `usePublish.doSinglePublish` / `batchPublish`，绝不 router.push**）。
  - 平台特有部分：沿用现有 `bridgeRegistry`（`SubPlatformType → V1 Setting 组件`）。

### B3. 状态机与导航（V2 无 router）
```ts
currentView: "quick_publish" | "single_publish" | "batch_publish" | "manage" | "settings"
```
- 集中 view-router：push/pop + 返回来源记录（复用 `returnTarget`），内部就是状态机切换，**不使用 vue-router**。
- 管理页「单发」→ single_publish；「批发」→ batch_publish；quick_publish 卡片加「详细发布」入口。

## 待讨论问题（已全部定稿）
| # | 问题 | 已定决策 |
|---|---|---|
| Q1 | 去耦合范围 | **把包袱全去**（去 router / V1 store / V1 i18n） |
| Q2 | 公共部分边界 | 发布「平台选择 + 发布表单 + 行为」抽成公共组件；平台特有留各 `*Setting`；V1/V2 各自注入 |
| Q3 | 「详细发布」入口 | **一键快速=主；详细发布=次级入口** |
| Q4 | batch_publish 承载 | **确认**：V2 复用去耦合后的 `BatchPublishIndex` |

## 设计共识（已定）
1. 公共发布组件（去耦合，纯展示+行为），V1/V2 完全独立、各自接线、最大复用。
2. V2 不引入 vue-router，导航一律走 `currentView` 状态机（5 视图）。
3. 发布动作复用共用层 `usePublish`（`doSinglePublish` / `batchPublish`）；平台特有走 `bridgeRegistry`。
4. 卡片入口：一键快速=主、详细发布=次级；管理页「单发→single_publish」「批发→batch_publish」。

## 阶段（定稿方案，待用户确认后开工）
### Phase 1 — 抽取公共发布组件（去耦合，小心求证）
- 从 `SinglePublishSelectPlatform` / `BatchPublishIndex` 抽出公共组件：无 router/store/i18n 依赖，数据 + 动作回调注入。
- V1 侧接入：`SinglePublish.vue` / `BatchPublish.vue` 改为薄壳接线（V1 store + router + V1 i18n）。
- **验收（V1 回归，关键）**：平台选择、标签/分类/slug 编辑、发布/更新/预览、结果回显逐项对照；V1 单测 + 宿主手验无退化。

### Phase 2 — V2 状态机 + 集中导航
- `currentView` 扩为 5 视图（`quick_publish | single_publish | batch_publish | manage | settings`）+ `UnifiedWorkspaceShell` 联合类型扩展。
- 集中导航 push/pop + 返回来源（复用 `returnTarget`），**不使用 vue-router**。

### Phase 3 — V2 single_publish / batch_publish 视图
- 挂载公共组件，`:id` 传入；V2 store + `useV2I18n` + 动作回调（`usePublish.doSinglePublish` / `batchPublish`）。
- 平台特有部分用 `bridgeRegistry` 桥接。

### Phase 4 — 入口接线
- quick_publish 卡片：一键快速=主、详细发布=次级入口。
- 管理页「单发」→ single_publish、「批发」→ batch_publish。

### Phase 5 — 验证
- V1：构建 + 宿主手验（单发/批量逐项，确认无退化）。
- V2：构建 + 宿主手验（快速/详细/批量、视图返回、平台单发）。
- 单测覆盖公共组件与视图切换；docs/checklist 同步。

## 关键产物（预计，先不写）
- **公共发布组件**（从 `SinglePublishSelectPlatform` / `BatchPublishIndex` 抽出，彻底去耦合）：`src/components/publish/*` 复用层，接收数据+动作回调。
- `src/pages/SinglePublish.vue` / `BatchPublish.vue`（V1 改为薄壳接线）
- `src/components/v2/V2App.vue`（状态机 + 集中导航）
- 新增 `src/components/v2/publish/V2SinglePublish.vue`、`V2BatchPublish.vue`
- `src/components/v2/layout/UnifiedWorkspaceShell.vue`（currentView 联合类型扩展）
- `src/components/v2/V2ArticleManage.vue`（单发/批发动作改写）
- 复用 `src/composables/usePublish.ts`、`src/composables/v2/useV2QuickPublish.ts`、`src/composables/v2/useV2ArticleManage.ts`

## 状态
- 2026-08-24：设计讨论稿 **已定稿**（方案B + 包袱全去 + V1/V2 完全独立 + V2 禁 vue-router）。
- Q1-Q4 全部确定；阶段化方案见上，**关键验收 = Phase 1 抽取后 V1 回归无退化**。
- **未动代码**；待用户确认后可进入 Phase 1 实现。
