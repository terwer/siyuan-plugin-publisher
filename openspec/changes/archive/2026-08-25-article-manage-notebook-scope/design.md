## Context

当前仓库已确认的关键事实（详见 `.planning/2026-08-24-article-manage-notebook-scope/findings.md`）：

- **交付模型**：V1 是 SPA，`dist/` 含 `index.html`，思源 serve 插件静态目录，`/plugins/siyuan-plugin-publisher/#/路由` 可用。V2 是**原生 DOM**，`dist-v2/` **无** `index.html`，`/plugins/siyuan-plugin-publisher/#/路由` 不可用。→ **V2 桥接 V1 只能是组件级复用，不能 iframe URL**。
- **V2 承载**：`createV2VueApp` 用 vue + pinia + i18n + element-plus，**无 vue-router**（状态机 `currentView: quick_publish|settings`）。V2 面板 = 思源原生 `Menu` popover，Vue app 挂进宿主 DOM。
- **数据基础**：`blocks.box` = 块所属笔记本 id；`getRootBlocks` 的 SELECT 已带 `b.box as notebookId`，但 WHERE 无 notebook 条件。`kernelApi.lsNotebooks()` 已存在。
- **发布路径**：单发/批发/快发/V2 全部汇入 `usePublish.doSinglePublish`，是硬校验的统一挂点。
- **zhi**：源码在 `/Volumes/workspace/myproject/zhi-framework/zhi`（branch `dev`），`getRootBlocks` 等用字符串插值拼 SQL（已存在 keyword 注入隐患，非本次引入）。

## Goals / Non-Goals

**Goals:**

- 在数据层根治「文章管理列出所有笔记本全部文档」的问题：按选定笔记本集合在 SQL 层收敛。
- 为发布提供源笔记本硬隔离：未授权笔记本的源文档不可发布。
- 提供可被 V1/V2 共用的文章管理能力（列表/搜索/分页/已发布/展开/yaml/笔记本过滤），V2 不再另起皮肤。
- 保持向后兼容：未配置 `publishSourceNotebooks` 时行为与现状完全一致。

**Non-Goals:**

- 不重构发布传输层、平台适配器或平台配置存储格式。
- 不改变 V1/V2 各自的路由宿主机制（V1 仍是 SPA + router；V2 仍是无 router 的原生 DOM 状态机）。
- 不在此变更引入按平台覆盖的笔记本范围（将来可扩展，本期做全局单一集合）。
- 不在 `zhi-siyuan-api` 引入新的破坏性签名（只加可选尾参）。

## Decisions

### 1. 笔记本范围是全局单一集合，存笔记本 id

`publishSourceNotebooks: string[]` 存 `lsNotebooks()` 返回的 `id`（稳定），展示时解析 `name`。空数组 = 不限制（向后兼容）。理由：隔离公开/非公开内容的核心诉求是全局的，按平台覆盖留作后续扩展。

### 2. 数据层在 SQL 层过滤（根治），notebookIds 必须消毒

`getRootBlocks`/`getRootBlocksCount` 增加可选尾参 `notebookIds?: string[]`。当非空时追加 `AND b.box IN (...)`；每个 id 需通过白名单 `[A-Za-z0-9_-]` 校验后再插值，避免新增注入面。缺省/空不追加 WHERE，保留 LIMIT/OFFSET/别名/排序。理由：客户端过滤仍全量拉取，不解决「笔记过多」；SQL 过滤才是根治且与平台列表口感一致。

### 3. 发布硬校验只在 doSinglePublish 做一次

`doSinglePublish` 开头用 `kernelApi.getBlockByID(id).box` 取源文档笔记本，若 `publishSourceNotebooks` 非空且 `box` 不在集合内则抛清晰错误。`box` 缺失视为「未限定」放行并 log（避免误拦）。理由：所有发布入口都汇入该函数，一处覆盖全部路径（V2 快发也走它）。

### 4. V2 桥接 = 共用层抽象，不是 iframe 也不是重写

把文章列表抽成无 router 依赖的共用组件 `ArticleManageList.vue` + 组合式函数 `useArticleManage.ts`：负责数据获取（含 notebookIds）、分页、搜索、已发布、展开行、yaml 徽标、笔记本过滤；所有导航动作（quick/single/batch/view/picgo）以事件抛出，**不含 router/iframe**。

- V1 `Admin.vue` 薄封装：贴共用组件，动作实现为 router 跳转 + DrawerBoxBridge iframe（V1 静默期过渡用）。
- V2 管理视图薄封装：贴共享组件，**全部动作以 V2 原生实现**——闪发/单发进入 V2 指定文档的发布流程、批发复用 V2 批量发布流、查看打开预览链接、图床打开图床工具。

**V2 必须是全量可用的替代品（V1 终将退休），严禁「请在 V1 流程处理」的兜底。** V2 需为「发布指定文档」扩展快速/单发流程（当前 V2 快发仅针对当前文档，管理页需按行指定 pageId 发布）。

### 5. V2 入口 = 房子图标（gear 左侧）

`V2App.vue` 头部动作区在 gear 左侧新增房子图标，点击进入「管理」视图（内嵌共用组件），返回回 `quick_publish`。

### 6. 挂件模式同样应用笔记本过滤（不留脏路径）

`getSubdocs`/`getSubdocCount` 也增加可选尾参 `notebookIds`，挂件模式按当前文档树收敛之余，再按授权笔记本集合过滤，Browser 与 Widget 两种模式**行为一致**。不允许存在「笔记本过滤只生效于根文档列表、挂件子文档却不过滤」的脏路径。

## Risks / Trade-offs

- **R1 共用组件抽取导致 V1 回归** → 抽取后 V1 单测 + 宿主逐项对照（搜索/分页/已发布/展开/动作/挂件 vs 浏览器模式）。
- **R2 V2 管理动作与 V1 iframe 行为不一致** → 明确定义 V2 原生动作行为，缺支持项给友好提示。
- **R3 SQL 注入** → notebookIds 白名单消毒。
- **R4 新增尾参破坏现有调用** → 可选尾参缺省/空不追加 WHERE，zhi 单测覆盖。
- **R5 硬校验误伤「随处发布」用户** → 仅非空集合才拦截；`box` 缺失放行。
- **R6 V2 面板尺寸/滚动/暗黑** → 管理视图内撑满 + 自有滚动 + 宿主手验。

## Migration Plan

1. 修改 `zhi-siyuan-api`（本人在 zhi 仓库），提交可选尾参 + 消毒 + 单测；**由维护者发包**。
2. 本仓库 bump 新版本。
3. 添加配置模型 + 归一化；落地共享笔记本选择组合式函数/组件。
4. 抽取共用文章管理组件与组合式函数；`Admin.vue` 改为薄封装。
5. 实现发布硬校验。
6. 实现 V2 房子图标 + 管理视图 + 偏好配置项。
7. 单测 + V1/V2 宿主手验 + docs/checklist，与平台验证同步。

## Open Questions

以下按「长期闭环」已定默认值，待用户确认后即视为锁定：

- **V2 管理动作全量原生**：闪发/单发 → 进入 V2「发布指定文档」流程（需让 V2 快发按 pageId 而非仅当前文档）；批发 → 复用 `usePublish` 批量流，V2 原生承载；查看 → 打开预览链接；图床 → 打开图床工具。**无任何「去 V1」兜底。**
- **挂件一致性**：`getSubdocs`/`getSubdocCount` **必须**增加 `notebookIds`，浏览器与挂件模式共用同一过滤，不留脏路径。
- **V2 快发扩展**：V2 的 `useV2QuickPublish` 需支持「传入 pageId」的发布流程供管理页逐行调用（当前仅当前文档）。
