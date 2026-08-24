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

### 【开工】Phase 1 zhi 已实现（用户授权「立即开工」）

- 用户拍板开工：`article-manage-notebook-scope 立即开工，需要非常谨慎，长远架构，100% 切合 V2 哲学`。
- 重要纠错：**改 zhi 前未先 pull 导致代码落后**（本地 `dev` 落后 `origin/dev` 21 个提交，origin 已升到 2.36.0）。已核查：落后的提交**未**改动 `siyuanKernelApi.ts`/`siYuanApiAdaptor.ts`（HEAD 与 origin/dev 二者相同）→ 我的特性改动基础一致、无冲突；落后的提交只升了 `package.json`→2.36.0 与 `CHANGELOG`。
- 处理（用户拍板）：`git reset --hard origin/dev`（快进分支到 2.36.0，丢弃已过时的 2.35.5 版本号 WIP 与无关 zhi-blog-api WIP），再把我的特性改动从 `/tmp/zhi-backup` 重新应用到新基线。
- 结果：zhi 工作区 = origin/dev(2.36.0) + 我的 notebookIds 改动 + 单测 + changeset，全部**未提交**（提交/push/发版交给你）。
- 实现文件：`siyuanKernelApi.ts`（新增 `buildNotebookIdsWhere` 白名单消毒 + 四个方法加 `notebookIds?` 尾参）、`siYuanApiAdaptor.ts`（`getRecentPosts/getRecentPostsCount` 透传）、新单测 `siyuanKernelApi.notebookFilter.spec.ts`（12 用例）、changeset `.changeset/notebook-publish-source.md`（minor）。
- 验证：目标单测 12/12 通过；`tsc --noEmit` exit 0；`vite build` exit 0。
- 下一步依赖：等你发布 zhi-siyuan-api（含 notebookIds 的新版本，如 2.37.0）后再启动插件侧 Phase 2-5（`blogApi.getRecentPosts(..., notebookIds)` 需新签名才能 typecheck）。

### 【解锁】zhi 2.37.0 已发布，插件侧 Typecheck 通过
- 你已发布 zhi-siyuan-api 2.37.0（含 notebookIds 特性）；本仓库 `package.json` 已升 `zhi-siyuan-api` → `^2.37.0` 并 `pnpm install` 拉取。
- `pnpm lint`（vue-tsc）exit 0 → Phase 2-5 可落地。

### Phase 2 配置模型（完成）
- `src/models/publishPreferenceCfg.ts`：加 `publishSourceNotebooks?: string[]`（构造函数默认 `[]`）。
- `siyuan/store/preferenceConfigManager.ts`：`normalizePreferenceConfig` 归一化为非空字符串数组，否则 `[]`。
- 新增 `src/composables/useNotebookOptions.ts`：`NotebookOption{id,name,icon}`；`isSystemOrUserGuideNotebook`/`shouldExcludeNotebook`（过滤关闭与系统/用户指南笔记本）；`useNotebookOptions()` 调 `kernelApi.lsNotebooks()`（兼容 `res.notebooks`/`res.data.notebooks`），按名称排序。
- 单测：`preferenceConfigManager.spec.ts`（+2 用例）、`useNotebookOptions.spec.ts`（5 用例），通过。

### Phase 3 共用层文章管理（完成）
- 新增 `src/composables/useArticleManage.ts`：`ArticleManageRow`、`ArticleManageActionType`、`ArticleManageAction`；`useArticleManage()` 状态（list/widget、pageId、keyword、showPublished、currentPage、pageSize、total、rows、selectedNotebookIds、notebookOptions、dynamicConfigArray）。
- 数据：挂件模式 `kernelApi.getSubdocCount/getSubdocs(pageId, page-1, size, keyword, showPublished, notebookIds)`；浏览器 `blogApi.getRecentPostsCount/getRecentPosts(..., keyword, showPublished, notebookIds)`；行构建镜像旧 Admin.vue；yaml 展开用 `getBlockAttrs`+`getDynCfgByKey`。
- `setNotebooks(ids)`：持久化 `pref.value.publishSourceNotebooks = [...ids]` 并 reload（Phase 3.3）。
- 新增 `src/components/common/ArticleManageList.vue`：无 router，动作以事件抛出；笔记本多选（el-select multiple）、搜索、已发布、展开行、yaml 徽标、分页、挂件空态；用 `useVueI18n`。

### Phase 4 V1 接入（完成，4.3 已补齐）
- `src/pages/Admin.vue` 改薄封装：贴 `<ArticleManageList :enableView :enablePicgo @action>` + el-drawer/DrawerBoxBridge；`handleAction` 映射 quick/single/batch/view/picgo/platform-single/widget-empty 至 router 跳转/抽屉。
- `src/components/common/DrawerBoxBridge.vue` 保留 iframe 抽屉（V1 静默期）。
- i18n：`src/locales/zh_CN.ts`/`en_US.ts` 加 `articleManage.*` 扁平键。
- 4.3 `src/components/set/preference/PreferenceSetting.vue`：加「发布源笔记本」el-select multiple，绑定 `publishPreferenceSettingForm.publishSourceNotebooks`，onMounted 加载笔记本选项。
- i18n：`preference.setting.publishSourceNotebooks.*` 已加入 `src/locales/*.ts` 与 `siyuan/i18n/*.json`。

### Phase 5 发布硬校验（完成）
- `src/composables/usePublish.ts`：新增 `assertNotebookAllowed(id)`，`doSinglePublish` try 开头调用；仅 `publishSourceNotebooks` 非空才拦截；`kernelApi.getBlockByID(id).box` 不在集合则抛清晰错误；`box` 缺失放行+log。所有发布入口（Single/Batch/Quick/V2）均汇入 `doSinglePublish`，一处覆盖。

### Phase 6 V2 接入（完成，全量原生）
- 6.1/6.8 `V2App.vue`：`currentView` 加 `"manage"`；头部 gear 左侧加房子图标（`~icons/lucide/house`）→ `openManage`；管理视图返回按钮 → `backFromManage`（回 quick_publish）；`panelTitle` 管理分支；body `v-else-if="isManageView"` 渲染 `<V2ArticleManage @open-publish>`。
- 6.2 新增 `src/components/v2/V2ArticleManage.vue`：内嵌 `ArticleManageList`（`enableView`/`enablePicgo` 经 `PluginUtils.preCheckBlogPlugin/preCheckPicgoPlugin`），动作经 `useV2ArticleManage` 原生落地。
- 6.3 `useV2QuickPublish.init(overridePageId?)`：传入时覆盖当前文档 id（管理页按行发布）；缺省仍取 `WidgetPageUtils.getPageId()`（向后兼容，既有单测通过）。
- 6.4 管理页 quick/single/widget-empty → `open-publish(pageId)` → V2App `openManagePublish` 切 quick_publish 并 `init(pageId)`。
- 6.5 新增 `src/composables/v2/useV2ArticleManage.ts`：`publishBatchToAll(pageId)` 遍历启用+已授权平台，`getPublishCfg`+`assignInitAttrs`+`doSinglePublish` 原生批量；成功/部分失败 toast+`pushErrMsg`。
- 6.6 `viewArticle(pageId)` → `openPathOrUrl` 打开 `${apiUrl}/plugins/siyuan-blog/app/#/post/<id>`。
- 6.7 `openPicgo(pageId)` → `openPathOrUrl` 打开 `${apiUrl}/plugins/siyuan-plugin-picgo/#/?pageId=<id>`。
- 6.9 `V2PreferenceSettings.vue`：加「发布源笔记本」组（`PreferenceItem.kind: "notebooks"`）渲染 el-select multiple，绑定 `preferenceForm.publishSourceNotebooks`，onMounted 加载笔记本选项；`handleNotebooksChange`/`getNotebooksText`。
- 6.10 `useV2QuickPublish.publishToPlatform` → `doSinglePublish`，自动受 `assertNotebookAllowed` 保护。
- i18n：`siyuan/i18n/zh_CN.json`/`en_US.json` 加 `v2.app.action.openManage`、`v2.app.back.manage`、`v2.app.panel.manage`、`v2.articleManage.*`、`v2.preference.group.notebook.*`、`v2.preference.item.publishSourceNotebooks.*`（useV2I18n 不回退 TS，必须在 JSON）。
- 单测：`useV2ArticleManage.spec.ts`（6 用例）；`V2PreferenceSettings.spec.ts` mock `useNotebookOptions` 后通过；`useV2QuickPublish.spec.ts` 通过。

### Phase 7 测试与验收（进行中）
- `pnpm lint`（vue-tsc）exit 0；`useV2QuickPublish` + `useNotebookOptions` + `preferenceConfigManager` + `V2PreferenceSettings` + `useV2ArticleManage` 单测通过。
- 剩余：V1/V2 构建、宿主手验、docs/checklist 同步、OpenSpec 归档审计。

