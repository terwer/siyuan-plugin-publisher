# Progress — 文章管理按笔记本隔离（issue #2044）

## 2026-08-24

### 会话初始化
- 读取用户需求（issue #2044）与约束：v1/v2 全兼容、考虑 v2 未来文章管理形态、方案第一、可维护长远。
- 加载 planning-with-files-zh 技能；确立「探索必须固化到 findings.md」。

### 探索记录
- 定位文章管理 = V1 `/` 路由 `Admin.vue`（routeConfig.ts L50-52，topbar.ts L94-97）。
- 确认两种模式：挂件（`getSubdocs` 子文档树，天然收敛）vs 独立 tab（`getRootBlocks` 全量所有笔记本 ← 问题场景）。
- 数据链路：`blogApi.getRecentPosts/count` → `SiyuanKernelApi.getRootBlocks/count`；`zhi-siyuan-api` 为 published dependency。
- 关键 SQL：`blocks b` 中 `b.box as notebookId` 已存在 → 可按 `b.box = '<notebookId>'` / `IN(...)` 过滤。
- 笔记本列表：`kernelApi.lsNotebooks()` 已有，无需新增内核调用。
- V2 无文章管理页（仅 quick_publish + settings）；`WidgetPageUtils.getPageId()` 取当前文档。
- 偏好模型 `PublishPreferenceCfg` + `normalizePreferenceConfig` 为 v1/v2 共享层；v1 UI `PreferenceSetting.vue`、v2 UI `V2PreferenceSettings.vue`（`PreferenceKey` union）。
- 发布入口 `usePublish.ts`：`doSinglePublish/doSingleDelete/doInitSinglePage`；`getPost`→`getBlockByID` 含 `box`，可做发布时源笔记本校验。

### 待决策（写入 findings §9）
配置粒度 / 作用范围 / 多选 / 空值语义 / 是否作用于挂件 / zhi-siyuan-api 改动方式。

### 决策已对齐（2026-08-24，用户拍板）
- 配置粒度：全局单一集合（`publishSourceNotebooks: string[]`，空=不限制，向后兼容）。
- 作用范围：列表过滤 + 发布时硬校验（未授权笔记本禁止发布）。
- 数据层：bump zhi-siyuan-api，SQL 层 `b.box IN (...)` 过滤（根治）。

### 发布路径确认
- 所有发布入口统一汇入 `usePublish.doSinglePublish`（SinglePublishDoPublish / BatchPublishIndex / QuickPublish worker / V2 quick publish）。
- 因此硬校验在 `doSinglePublish` 开头做一次，覆盖全部路径。

### zhi 仓库
- 本工作区无 zhi 源码；`zhi-siyuan-api` 为 published 依赖（v2.36.0）。
- Phase 1 需先在 terwer/zhi 仓库改动 `libs/zhi-siyuan-api` 并发版，再 bump 本仓库。
- 兜底：插件侧 `kernelApi.sql()` 自建 notebook 过滤查询。

### zhi 改动契约已产出
- 详见 `zhi-api-change.md`：`getRootBlocks`/`getRootBlocksCount`/`getRecentPosts`/`getRecentPostsCount` 增加可选尾参 `notebookIds?: string[]`，SQL 追加 `AND b.box IN (...)`；空/缺省行为不变（向后兼容）；保留 LIMIT/OFFSET 关系。
- 待 terwer 在 zhi 仓库实施并发布，之后本仓库 bump。

### 用户纠错：V2 交付模型
- 用户指出：V2 无 serve，V1 路由不可用 → 我此前「iframe 桥接 V1 SPA」方案**不成立**。
- 已核实：V1 `dist/` 有 `index.html`（路由可用）；V2 `dist-v2/` 无 `index.html`（路由不可用）。
- 修正：「桥接」= **组件级复用**（共用层抽象），非 URL/iframe。

### 最终决策闭环（2026-08-24）
- 配置：全局单一集合 `publishSourceNotebooks: string[]`（空=不限制）。
- 作用范围：列表过滤 + 发布时硬校验。
- 数据层：SQL `b.box IN (...)`（我改 zhi，用户发包）。
- V2 桥接：**共用层抽象**（文章列表抽成无 router 依赖共用组件 + `useArticleManage`；V1 Admin.vue 与 V2 管理视图各薄封装）。
- V2 入口：房子图标（gear 左侧）→ 面板「管理」视图。
- 节奏：自底向上先 zhi；同步开工；先计划零风险。

### OpenSpec 提案已生成并通过校验（2026-08-24）
- 变更：`openspec/changes/article-manage-notebook-scope/`
  - `.openspec.yaml`、`proposal.md`、`design.md`、`tasks.md`
  - `specs/notebook-scoped-publish-source/spec.md`（笔记本隔离）
  - `specs/v2-shared-article-management/spec.md`（V2 复用/管理视图）
- `openspec validate article-manage-notebook-scope` → **valid**；`openspec list` 显示 4/32 tasks。

### 用户硬性更正（2026-08-24）
- **V2 全量行为**：V1 只是静默期、将彻底退休；V2 必须是完整替代品，**禁止「请在 V1 流程处理」**，所有管理动作（闪发/单发/批发/查看/图床）都 V2 原生实现。
- **挂件一致性**：`getSubdocs`/`getSubdocCount` **必须**加 `notebookIds`，浏览器与挂件共用过滤，**不留脏路径**，闭环长期而非短期求快。
- 已同步修订 OpenSpec proposal/design/specs/tasks 与 `.planning` 文档；`openspec validate` 仍 valid。

### 下一步
- 等用户审阅修订后的 OpenSpec 提案定稿；授权后启动 Phase 1（zhi）。用户强调「还是不要着急实现」。
