# Tasks: v2-publish-loop

> 关联主线：`v2-platform-verification-v1-retirement`（V2 功能完备后可推进三版本后移除 iframe）
> 方案细节：`design.md`、`.planning/2026-08-24-v2-publish-loop/`
> 交互原型（已批准 ~90%）：`tmp/v2-article-manage-real.html`
> **关键验收 = V1 发布组件解耦后 V1 回归无退化 + V2 宿主手验通过**

## 0. 治理（本提案）

- [x] 0.1 创建 OpenSpec 变更 `v2-publish-loop`
- [x] 0.2 确认方案B（抽公共、放弃整体桥接A）
- [x] 0.3 确认 V2 禁用 vue-router（五视图状态机）
- [x] 0.4 确认公共组件彻底去耦合（去 router/store/i18n，数据+动作注入，V1/V2 完全独立）
- [x] 0.5 确认交互原型（单发/批发/闪发 = 次级滑入面板、列表仍在背后、平台 chip 悬停/点击）
- [x] 0.6 撰写 proposal / design / specs / tasks

## 1. Phase 1 — 复用共享发布引擎 + 解耦 V1 发布外壳

> **关键验收**：V1 单发/批发的行为回归无退化（只把 V1 外壳的 `useRoute/useRouter` 改为 props+emit）。

- [x] 1.0 确认「公共部分」= 共享发布引擎 `usePublish`（`doSinglePublish`/`assignInitAttrs`/批量循环）+ **V1 成熟表单组件链**（`SinglePublishDoPublish` / `BatchPublishIndex` / 全套 form 子组件）供 V1/V2 复用
- [x] 1.1 解耦 `SinglePublishDoPublish.vue`：去 `useRoute/useRouter`，改 `key/id/method/showBack` props + `back` emit
- [x] 1.2 解耦 `SinglePublishSelectPlatform.vue`：去 `useRouter`，改 `open` emit（key/id/method）
- [x] 1.3 解耦 `QuickPublishSelectPlatform.vue`：去 `useRoute/useRouter`，`pageId` 改 props、改 `open` emit
- [x] 1.4 解耦 `BackPage.vue`：去顶层 `useRoute/useRouter`，改 `inject(routerKey/routeLocationKey)` 容错（V2 无 vue-router 不崩、V1 行为不变），新增可选 `showBack` prop
- [x] 1.5 新增 V1 包装页接管路由取参：`pages/SinglePublishDoPublish.vue`（`/publish/singlePublish/doPublish/:key/:id`）、`pages/QuickSelect.vue`（`/publish/quickSelect`）；`routeConfig.ts` 相应改装
- [x] 1.6 **V1 回归对照**：`pnpm build`（V1 + 打包）通过 + `pnpm vitest run` 56 文件 / 276 用例通过（无退化）

## 2. Phase 2 — V2 状态机 + 集中导航

- [x] 2.1 `currentView` 扩为 5 视图：`"quick_publish" | "single_publish" | "batch_publish" | "manage" | "settings"`（`V2App.vue`）
- [x] 2.2 `UnifiedWorkspaceShell.vue` `currentView` 联合类型同步扩展（导出 `V2CurrentView`）
- [x] 2.3 集中导航：`openSettings`/`openManage`/`openManageSingle`/`openManageBatch`/`openManageFlash`/`openSinglePublishForCurrent` + 返回处理（`backFromManage`/`onSinglePublishBack`/`onBatchPublishBack`），**不使用 vue-router**
- [x] 2.4 状态机/接线无新增组合式（V2 复用 V1 资产后不再重写发布引擎，删除 `useV2SinglePublish`/`useV2BatchPublish` 及其 spec）

## 3. Phase 3 — V2 single_publish / batch_publish 视图（复用 V1 成熟资产）

- [x] 3.1 `V2SinglePublish.vue` 重写为**复用壳**：V1 两步流程（`SinglePublishSelectPlatform` 选平台 → `SinglePublishDoPublish` 详表单），预设平台→直接详表单，V2 轻壳提供返回+标题
- [x] 3.2 `V2BatchPublish.vue` 重写为**复用壳**：直接复用 `BatchPublishIndex`（本身无 vue-router）
- [x] 3.3 `V2QuickPublishGrid.vue`：闪发快速平台格（逐卡发布/更新），复用 `useV2QuickPublish`
- [x] 3.4 回调内**绝不 `router.push`**（全程 `currentView` 状态机）
- [x] 3.5 删除 V2 精简引擎 `useV2SinglePublish.ts`/`useV2BatchPublish.ts` 及其 spec（不再重写，改为复用 V1 资产）

## 4. Phase 4 — 入口接线

- [x] 4.1 quick_publish 头部「详细发布」文字 button（`openSinglePublishForCurrent` → `single_publish` 全视图，复用 V1 两步流程）
- [x] 4.2 管理页「单发」→ 右侧滑入详情面板（`openSingle`，带预设平台 key → 直接详表单），不再落到 quick_publish
- [x] 4.3 管理页「批发」→ 右侧滑入批量面板（`openBatch`），复用 `BatchPublishIndex`
- [x] 4.4 管理页「闪发」→ 右侧滑入快速平台格（`openFlash`）
- [x] 4.5 次级面板交互：右侧滑入、列表仍在背后（遮罩压暗不隐藏）、←/遮罩/Esc 关闭（`V2App.vue` 管理面板 + `handleWindowKeydown`）
- [x] 4.6 平台 chip 点击=平台单发（复用共享 `ArticleManageList` 既有 `platform-single` 动作，用配置真实 `platformKey`）；悬停显示「发布/更新」提示（新增 `articleManage.extend.platform*` 文案 + 共享组件 CSS 提示）

## 5. Phase 5 — 验证

- [x] 5.1 V1：`pnpm build` 通过（回归无退化；含解耦后的包装页/BackPage 容错）
- [ ] 5.2 V2：`pnpm build:v2` 通过；宿主手验（快速/详细/批量、视图返回、平台单发、次级面板交互）待用户
  - 2026-08-24 构建通过（vue-tsc noEmit + vite，dist-v2/index.js 6.63MB/gzip 2.03MB，2223 模块）
- [x] 5.3 单测：`pnpm vitest run` 56 文件 / 276 用例通过（删除 2 个冗余 spec 减 6 例，其余全绿、V1 无退化）
- [x] 5.4 `pnpm build:v2` 含 vue-tsc noEmit，exit 0
- [ ] 5.5 同步 docs / checklist；归档前按 OpenSpec 审计（根本修复/最佳实践/不破坏底层/不影响无关模式）

> 注：原「抽公共 = V2 原生精简视图」方案已修正。本实现真正复用 V1 成熟资产（`SinglePublishDoPublish` 全套字段与逻辑 + `BatchPublishIndex` + 全套 form 子组件，100% 保留功能），仅把 V1 外壳的 `useRoute/useRouter` 解耦为 props+emit，V2 用轻壳内嵌复用。这与 AGENTS.md「桥接优先、100% 保留、禁造轮子」一致，V1 发布组件虽作解耦改动但功能/逻辑/样式零变化。
