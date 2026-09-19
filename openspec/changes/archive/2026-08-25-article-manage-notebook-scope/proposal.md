## Why

用户反馈（#2044）：当笔记过多时，「文章管理」无法有效管理，希望能**只从特定笔记本进行博客发布**，以隔离公开内容与非公开内容。现状：

- 文章管理独立页（V1 `/` → `Admin.vue`）在浏览器/插件模式下走 `getRootBlocks`，把**所有笔记本的全部根文档**一次性列出，笔记一多即失控。
- 各项发布（单发/批发/快发）无源笔记本约束，公开/非公开内容无法隔离。
- V2 目前无文章管理入口，且**不提供 V1 SPA serve**（`dist-v2` 无 `index.html`），无法通过 iframe 复用 V1 页面。

这是一个跨 V1/V2 的**根源性架构变化**：既要用**数据层笔记本过滤**根治列表失控，又要为 V2 建立**不两张皮**的文章管理形态。因此以标准 OpenSpec 提案固化，先对齐再实施。

## What Changes

- **数据层**：`zhi-siyuan-api` 的 `getRootBlocks`/`getRootBlocksCount`/`getSubdocs`/`getSubdocCount` 增加可选尾参 `notebookIds?: string[]`，SQL 层 `AND b.box IN (...)` 直接过滤（根治）；`getRecentPosts`/`getRecentPostsCount` 透传。缺省/空值不追加条件，行为向后兼容。**浏览器与挂件两种模式共用同一过滤，不留脏路径。**
- **配置**：`PublishPreferenceCfg` 增加全局单一集合 `publishSourceNotebooks: string[]`（笔记本 id 多选；空=不限制，零行为回退）。
- **发布隔离**：`usePublish.doSinglePublish` 开头硬校验源文档 `box` ∈ 授权集合，越权抛出清晰错误；覆盖全部发布路径（单发/批发/快发/V2）。
- **共用层文章管理**：把文章列表/搜索/分页/已发布/展开/yaml/笔记本过滤抽成**无 router 依赖**共用组件 `ArticleManageList.vue` + `useArticleManage.ts`（动作以事件抛出）。
- **V2 形态（全量原生）**：V1 `Admin.vue` 与 V2 管理视图各自薄封装共用组件；V2 头部新增**房子图标（gear 左侧）**进入「管理」视图，**全部动作（闪发/单发/批发/查看/图床）都以 V2 原生实现**，禁止「去 V1 处理」类兜底（V1 终将退休，V2 为完整替代品）。

## Capabilities

### New Capabilities

- `notebook-scoped-publish-source`: 规定发布来源可被笔记本集合限定，文章管理列表在 SQL 层按笔记本收敛，发布时可对未授权笔记本的源文档予以拦截。
- `v2-shared-article-management`: 规定 V2 文章管理复用 V1 共用层组件（不两张皮），并通过房子图标进入管理视图。

### Modified Capabilities

- 无。

## Impact

- **跨仓库**：`zhi-siyuan-api`（`terwer/zhi` `libs/zhi-siyuan-api`）新增可选尾参，由维护者发包后本仓库 bump。
- 本仓库：`src/models/publishPreferenceCfg.ts`、`siyuan/store/preferenceConfigManager.ts`、新增共用组件/组合式函数、`src/pages/Admin.vue`（薄封装）、`src/composables/usePublish.ts`、`src/components/v2/V2App.vue`、`src/components/v2/settings/V2PreferenceSettings.vue`、`src/components/set/preference/PreferenceSetting.vue`。
- 不影响发布传输层（XML-RPC/multipart/JSON）、平台适配器与平台配置存储格式。
- 未配置 `publishSourceNotebooks` 的用户**零行为回退**。
