# Findings — V2 发布闭环（v2-publish-loop）

## 代码事实（已核对）

### 状态机与视图
- `src/components/v2/V2App.vue:260`：`const currentView = ref<"quick_publish" | "settings" | "manage">(props.initialView ?? "quick_publish")`。
- `src/components/v2/layout/UnifiedWorkspaceShell.vue:31`：`currentView?: "quick_publish" | "settings" | "manage"`。
- 即当前**只有 3 个视图**，无 single_publish / batch_publish。

### 管理页动作（`src/components/v2/V2ArticleManage.vue:50-92`）
- `quick` / `single` → `emit("openPublish", pageId)`。
- `batch` → `await publishBatchToAll(pageId)`（**后台直跑，无 UI**）。
- `view` → `viewArticle(pageId)`。
- `picgo` → `openPicgo(pageId)`。
- `platform-single` → `publishToSinglePlatform(platformKey, pageId)`。
- `widget-empty` → 取当前页 id → `emit("openPublish", ...)`。

### 管理页单发如何落到快速（断点 1）
- `V2App.vue:445` `openManagePublish(pageId)`：`await quickPublish.init(pageId); currentView.value = "quick_publish"`。
- ⇒ 单发**没有**进入「详细发布」，而是复用 quick_publish（一键）视图。

### quick_publish 卡片
- `V2App.vue:161-178` 平台卡 `V2PlatformCard`，事件：`@primary`(一键发布/更新) / `@preview`(查看) / `@delete`(删除) / `@configure`(去配置)。
- 无「详细发布」事件（断点 3）。

### 统一发布逻辑（复用基石）
- `src/composables/usePublish.ts:105` `doSinglePublish(key, id, publishCfg, doc)` → `:118` 开头的 `assertNotebookAllowed(id)` 硬校验 + 后续真实发布。
- V2 可视作共用层 `usePublish` 的 UI 壳；新增视图应复用而非重造。

## 参考（V1 对应流）
- V1 `src/pages/Admin.vue:109-111`：`single` → `goToPublisherDrawer("单个发布", "/publish/singlePublish?id=...")`（V1 有路由可跳）。
- V1 `Admin.vue:127-131`：`platform-single` → `goToPublisherDrawer(..., "/publish/singlePublish/doPublish/<platformKey>/<postid>?method=edit")`。
- V2 无 vue-router，**不能**直接复用 V1 的路由跳转，只能在「共用层发布逻辑 + V2 原生视图」上重建 UI。

## 约束
- **AGENTS.md**：功能 100% 保留；V1 单发/批量行为不退化；V2 允许 break change，结构立对、不留双轨。
- **V2 宿主容器**：UI 锚定 `.syp-panel`，弹窗用 `position:absolute` popover 卡片，`el-dialog` 必须 `:append-to-body="false"`。
- **V2 禁止使用 vue-router**（用户明确）：导航一律走 `currentView` 状态机；去耦合时 `router.push` 一律替换为注入回调/emit。
- **渠道**：multipart→`formUploadClient`、JSON→`jsonFetchClient`、XML-RPC→`xmlrpcTransport`，共同用 `publishTransport` 规则。
- **非琐碎改动先规划**（本计划即为此）；OpenSpec 归档前需「根本修复/最佳实践/不破坏底层/不影响无关模式」四达标。

## 风险/关注
- R1：新增视图破坏现有 quick_publish / manage 的路由与返回 → 集中 view-router 统一管理 push/pop/返回来源。
- R2：详细发布字段与 V1 不一致导致行为退化 → 优先桥接保留 V1 行为（Q1）。
- R3：批量分发无界面依赖 → 明确「进度/结果」承载与取消策略（Q5）。

## §A 桥接基建（可复用）
- `src/components/v2/settings/V2PlatformConfigBridge.vue`：`getV2BridgeComponent(state.subtype, {electron})` 动态挂载 V1 组件；`provide(V2_PLATFORM_CONFIG_ACTION_BRIDGE_KEY, {...})` 桥接 `validated/saved`；`<Suspense>` 包裹。
- `src/components/v2/settings/bridge/bridgeRegistry.ts`：`SubPlatformType → V1 Setting 组件` 映射（`BRIDGE_COMPONENTS`）+ `getV2BridgeComponent()` + `SUPPORTED_V2_BRIDGE_SUBTYPES`。
- 结论：V2 已有「动态挂载 V1 组件 + provide 桥接事件」标准做法，可扩展到发布视图。

## §B V1 单发/批发组件的依赖（阻断项）
- `src/pages/SinglePublish.vue`：薄壳 `useRoute().query.id` + `<single-publish-select-platform :id>`。
- `src/components/publish/SinglePublishSelectPlatform.vue` 导入：`useRouter()`(vue-router)、`useVueI18n`、`usePublishSettingStore`/`usePreferenceSettingStore`(Pinia)、`usePublish`、`PublisherAppInstance`、`useSiyuanApi`。
  - 即：**依赖 vue-router + V1 store + V1 i18n**，非纯组件。
- `src/pages/BatchPublish.vue`：薄壳 `<batch-publish-index :id>`；对应 `src/components/publish/BatchPublishIndex.vue`。
- 结论：**整体桥接需为 V1 组件补齐 router/store/i18n 上下文**；已定改走方案B。
- 方案B深化：**包袱全去**——抽「纯展示+行为」公共发布组件，去 router/store/i18n 依赖，数据+动作全部 props/事件/inject 注入；**V1/V2 完全独立**，各自接线（V1=store+router+i18n；V2=V2 store+currentView 状态机+useV2I18n），最大复用、高内聚低耦合。
