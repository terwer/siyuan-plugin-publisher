# Task Plan — 文章管理按笔记本隔离 + V2 共用层管理视图（issue #2044）【最终定稿】

## 目标

1. **按笔记本限定发布来源**（issue #2044）：笔记过多时可管理、公开/非公开内容隔离。
2. **V2 文章管理形态**：不两张皮，共用层抽象，V2 头部**房子图标（gear 左侧）**进入管理视图。

## 已确认决策（全部闭环）

| 维度 | 决策 |
|---|---|
| 配置 | 全局单一集合 `publishSourceNotebooks: string[]`（笔记本 id 多选；空=不限制，向后兼容） |
| 作用范围 | 列表过滤 + 发布时硬校验（未授权笔记本禁止发布） |
| 数据层 | zhi SQL `b.box IN (...)` 过滤（根治）；**我改 zhi**（`/Volumes/workspace/myproject/zhi-framework/zhi`），**用户发包** |
| 挂件一致性 | `getSubdocs`/`getSubdocCount` **必须**加 `notebookIds`；浏览器与挂件共用同一过滤，**不留脏路径** |
| V2 桥接 | **共用层抽象**：文章列表/搜索/分页/笔记本过滤抽成无 router 依赖共用组件 + `useArticleManage` 组合式函数；V1 `Admin.vue` 与 V2 管理视图各自薄封装 |
| V2 入口 | 房子图标（gear 左侧）→ 面板「管理」视图 |
| V2 能力 | **全量原生行为**（闪发/单发/批发/查看/图床），**禁止「去 V1 处理」**；V2 为完整替代品（V1 终将退休） |
| 节奏 | 自底向上**先 zhi**；发布平台验证与文章管理同步；先计划、零风险才动 |

## 关键事实（findings）

- V1 `dist/` 有 `index.html`（V1 路由可用）；V2 `dist-v2/` **无** `index.html`（V1 路由不可用）→ 只能**组件级复用**。
- V2 应用：vue + pinia + i18n + element-plus，**无 vue-router**（状态机 `currentView`）。
- `blocks.box` 已是 notebookId；`getRootBlocks/getRootBlocksCount` 加尾参 `notebookIds` 即过滤。
- 发布全路径汇入 `usePublish.doSinglePublish` → 硬校验一处生效。

## 阶段

### Phase 1 — 数据层：zhi（我改，用户发包）
- `siyuanKernelApi.getRootBlocks/getRootBlocksCount` 加可选尾参 `notebookIds?: string[]` → `AND b.box IN (...)`，**白名单消毒**。
- `siYuanApiAdaptor.getRecentPosts/getRecentPostsCount` 透传。
- 可选：`getSubdocs/getSubdocCount` 加参（挂件一致性）。
- 向后兼容：缺省/空不追加 WHERE；保留 LIMIT/OFFSET/别名/排序。单测：空/非空/多。**用户发包 → bump 本仓库。**

### Phase 2 — 配置模型（共用层）
- `PublishPreferenceCfg.publishSourceNotebooks?: string[]`（默认 `[]`）；`normalizePreferenceConfig` 归一化。
- 共享「笔记本选择」组合式函数/组件（`lsNotebooks()`，过滤系统内置/用户指南），v1/v2 共用。

### Phase 3 — 共用层：文章管理组件 + 组合式函数（无 router 依赖）
- 新增 `src/components/common/ArticleManageList.vue`（或 `publish/`）+ `src/composables/useArticleManage.ts`：
  - 数据：`getRecentPosts/count(.., notebookIds)`；分页；搜索关键字；已发布筛选；展开行；yaml 徽标。
  - 笔记本过滤：顶部多选，初值取偏好，变更持久化 + 刷新。
  - 动作以 `@` 事件抛出（`quick/single/batch/view/picgo`），**不含 router/iframe**。
- `Admin.vue` 改为薄封装：贴共用组件，动作实现为 router 跳转 + DrawerBoxBridge iframe。

### Phase 4 — V2 实现（全量原生，禁止向 V1 兜底）
- `V2App.vue` 头部：gear 左侧加房子图标。
- 新增「管理」视图：内嵌共用组件 `ArticleManageList`，**全部动作以 V2 原生实现**：
  - 闪发/单发 → 扩展 `useV2QuickPublish` 支持按指定 pageId 发布，供管理页逐行调用。
  - 批发 → V2 复用 `usePublish` 批量流，原生承载。
  - 查看 → V2 打开预览链接。
  - 图床 → V2 打开图床工具。
- 返回/关闭逻辑：管理视图 → quick_publish。
- `V2PreferenceSettings.vue`：加「发布源笔记本」配置项。
- V2 单发/快发走 `doSinglePublish` → 自动受硬校验。

### Phase 5 — 发布硬校验（共用层）
- `usePublish.doSinglePublish` 开头用 `kernelApi.getBlockByID(id).box` 校验 ∈ 授权集合，越权抛清晰错误。仅当 `publishSourceNotebooks` 非空才拦截；`box` 缺失放行 + log。

### Phase 6 — 验证（与平台验证同步）
- 单测：配置归一化、SQL 消毒、共用组件分页/过滤、发布校验、V2 视图切换。
- V1：构建 + 宿主手验（列表过滤、越权报错、未配置零回退、共用组件行为与旧版一致）。
- V2：构建 + 宿主手验（房子图标、管理视图渲染、过滤、越权拦截）。
- 同步 docs / checklist。

## 关键产物
- `zhi-siyuan-api`（我改，用户发包）
- `src/models/publishPreferenceCfg.ts`、`siyuan/store/preferenceConfigManager.ts`
- 新增 `ArticleManageList.vue` + `useArticleManage.ts`（共用层）
- `src/pages/Admin.vue`（薄封装）、`src/components/set/preference/PreferenceSetting.vue`
- `src/components/v2/V2App.vue`（房子图标+管理视图）、`src/components/v2/settings/V2PreferenceSettings.vue`
- `src/composables/usePublish.ts`（硬校验）

## 风险清单（findings §14，全部可消除）
R1-R9 均已列出消除手段；新增：
- R10 共用组件抽取导致 V1 行为回归 → 抽取后 V1 单测 + 宿主逐项对照（搜索/分页/已发布/展开/动作/挂件 vs 浏览器模式）。
- R11 V2 管理视图动作（闪发/单发/批发/查看/图床）全量原生实现 → 逐动作定义 V2 原生行为（含「按指定 pageId 发布」扩展），**禁止任何「去 V1」兜底**；V1 仅静默期过渡。

## 待授权
- 用户确认方案定稿后，按「自底向上：先 zhi」启动 Phase 1。

## 状态（2026-08-24）
- **Phase 1（zhi）已实现并验证**（用户授权「立即开工」）。基线已拉齐到 origin/dev(2.36.0)，我的改动 + 单测 + changeset 留在 zhi 工作区**未提交**；提交/push/发版由用户负责。已发布 zhi-siyuan-api 2.37.0。
- **Phase 2-6 已完成**：配置模型 + 归一化；共享笔记本选择；共用层 `ArticleManageList.vue` + `useArticleManage.ts`；V1 `Admin.vue` 薄封装 + `PreferenceSetting.vue` 配置项；发布硬校验 `assertNotebookAllowed`；V2 房子图标 + 管理视图 + 原生动作（quick/single/batch/view/picgo）+ `V2PreferenceSettings.vue` 配置项。`pnpm lint` exit 0；单测 56 文件 / 274 用例通过。
- **待办（Phase 7）**：V1 `pnpm build`、V2 `pnpm build:v2` + 宿主手验（房子图标/管理视图/过滤/越权拦截）；docs/checklist 同步；OpenSpec 归档审计。**需用户先在 V1/V2 宿主自测后再继续。**
