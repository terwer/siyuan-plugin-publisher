# Findings — 文章管理按笔记本隔离（issue #2044）

> 本文档固化探索结论，是方案的依据。外部内容一律只进入本文档，不写入 task_plan.md。
> 会话/日期：2026-08-24 ｜ 分支：`feature/ui-2.0`

## 0. 需求（issue #2044，jiashun-wang）

> 当笔记太多的时候，文章管理功能不能很好的起到管理作用，希望能设置成只从特定的笔记本进行博客发布，
> 这样也有利于公开内容和非公开内容的隔离。

- **核心诉求**：文章管理列表在笔记过多时难以管理 → 需要「按笔记本限定」发布来源。
- **隐含价值**：公开/非公开内容隔离（public notebook vs private notebook）。
- **用户明确约束**：
  - 必须 **v1/v2 全兼容**。
  - 必须考虑 **v2 形态下文章管理如何无缝接入**。
  - **方案是第一优先级**；不着急根治；**可维护、长远**优先。
  - 允许先开 plan 讨论再修复。

## 1. 文章管理 = V1 的 `/` 路由 → `Admin.vue`

- `src/routes/routeConfig.ts` L50-52：`{ path: "/", component: Admin }`，注释「文章管理」。
- 访问入口：顶栏菜单 `siyuan/topbar.ts` L94-97 → `showArticleManageMenu` → 打开 tab `/`。
- 组件：`src/pages/Admin.vue`。

## 2. Admin.vue 的两种数据模式（关键分叉）

`reloadTableData()`（Admin.vue L215-325）：

| 模式 | 判断 | 数据源 | 问题 |
|------|------|--------|------|
| 挂件模式 | `isInSiyuanWidget()` 且 pageId 非空 | `kernelApi.getSubdocs(pageId, page, size, state, showPublished)` + `getSubdocCount` | 天然限定在当前文档的**子文档树**，已基本按笔记本/层级收敛 |
| 浏览器/插件独立 tab（非挂件） | 否则 | `blogApi.getRecentPosts(size, offset, state, showPublished)` + `getRecentPostsCount` | **列出全部根文档，跨全部笔记本** ← 问题场景 |

- 用户遇到「笔记太多」绝大多数是**独立 tab / 浏览器模式**（`getRootBlocks` 全量列出所有 doc）。
- 搜索结果关键字在 `state`，仅对 `content`/`tag` LIKE。

## 3. 数据源链路（zhi-siyuan-api 外部包）

- `blogApi = new SiYuanApiAdaptor(config)`、`kernelApi = new SiyuanKernelApi(config)`（`useSiyuanApi.ts`）。
- `package: node_modules/zhi-siyuan-api`（v2.36.0），**published dependency**（pnpm 符号链接到 `.pnpm/`），**非 workspace 包**。
  - 修改其方法签名（如 `getRootBlocks`）需要 **bump zhi-siyuan-api 版本**（源在 `terwer/zhi` 仓库）。
- `getRecentPostsCount` → `kernelApi.getRootBlocksCount(keyword, showPublished)`
- `getRecentPosts` → `kernelApi.getRootBlocks(limit, offset, keyword, showPublished)`
- `getSubdocCount` / `getSubdocs` 都在 `SiyuanKernelApi` 内，用 SQL `path LIKE '%/<id>%'` 收敛子文档。

## 4. 内核 SQL 关键事实（能否按笔记本过滤的核心依据）

来自 `node_modules/zhi-siyuan-api/dist/index.js`：

`getRootBlocks` 的 SELECT（L31105 附近）：
```sql
SELECT DISTINCT
  b.root_id as docId,
  b.content as docTitle,
  b.updated as modifiedTime,
  b.box as notebookId     -- ★ 已经有 notebookId（= 笔记本 id）
FROM blocks b
LEFT JOIN attributes a ON b.root_id = a.root_id
WHERE b.id = b.root_id
  AND b.type = 'd'
  AND (b.content LIKE '%<kw>%' OR b.tag LIKE '%<kw>%')
  [AND a.name LIKE 'custom-%-yaml']   -- showPublished 时
ORDER BY b.updated DESC, b.created DESC
LIMIT <n> OFFSET <offset*n>
```

`getRootBlocksCount` 类似结构，无 notebook 过滤。

- `blocks.box` = 块所属**笔记本 id**（思源内核数据模型字段）。根文档在每个笔记本下唯一。
- **结论：按笔记本过滤是可行的**，在 WHERE 中追加 `AND b.box = '<notebookId>'`（单），或 `AND b.box IN ('id1','id2')`（多）。

## 5. 笔记本列表能力

- `kernelApi.lsNotebooks()` → `/api/notebook/lsNotebooks`，已存在于 zhi-siyuan-api（L31232）。
- 现有用法：`SiYuanApiAdaptor.getCategories`（L62910）用 `lsNotebooks()` 取笔记本，过滤已关闭的 + `思源笔记用户指南/SiYuan User Guide`，映射为「分类」（category）。→ **笔记本已作为「分类」暴露给平台**。
- 因此 UI 层可拿到「笔记本 id + 名称」列表，无需新增内核调用（直接复用 `lsNotebooks`）。

## 6. V2 形态（关键约束）

- V2 主容器：`src/components/v2/V2App.vue`（宿主 DOM 的 popup/面板，锚定 `.syp-panel`，AGENTS.md 0 约束）。
- **V2 目前没有文章管理页**：V2 只有「快速发布（单个文档）」+「设置」。`currentView: "quick_publish" | "settings"`。
- V2 快速发布取当前文档：`WidgetPageUtils.getPageId()`（`useV2QuickPublish.ts` L127），发布单个文档。
- **结论**：V2 的文章管理是「未来形态」。`无缝接入` 意味着：**配置项与数据层过滤要落在共享层**（`PublishPreferenceCfg` + 数据查询），使未来 V2 的文章管理直接复用同一套机制；现阶段在 V2 侧先提供配置项与作用域语义，暂不实现 V2 专属文章管理页。

## 7. 偏好设置（v1/v2 共享的核心）

- 模型：`src/models/publishPreferenceCfg.ts` → `class PublishPreferenceCfg extends PreferenceConfig`（来自 `zhi-blog-api`）。
- V1 存储：`siyuan/store/preferenceConfigManager.ts` → `/data/storage/syp/publish-preference-cfg.json`，`normalizePreferenceConfig` 做默认值归一化（`Utils.emptyBooleanOrDefault`）。
- V1 UI：`src/components/set/preference/PreferenceSetting.vue`（`el-form-item` per option）。
- V2 UI：`src/components/v2/settings/V2PreferenceSettings.vue` → `PreferenceKey` 联合类型 + `groups`（title/description/items）；`pluginOnly` 控制是否仅插件环境显示；toggle 通过 `preferenceForm.value[key] = nextValue` 写 store。
- `useSiyuanApi.ts` 把 `pref.value.fixTitle/keepTitle/...` 拷入 `siyuanConfig.preferenceConfig` → 平台/内核层读取偏好。
- **结论**：新增配置项若放 `PublishPreferenceCfg`，v1/v2 能自动共用同一份持久化数据；只需在两侧 UI 各加一个控件。

## 8. 发布流程公共入口（未来做「发布源约束」时的挂点）

- `src/composables/usePublish.ts`：
  - `doSinglePublish(key, id, publishCfg, doc)`（L71）
  - `doSingleDelete(key, id, publishCfg)`（L244）
  - `doInitSinglePage`（L473）内部 `blogApi.getPost(id)`（L500）
- `getPost` → `kernelApi.getBlockByID(rootId)`（含 `box` 字段）→ 可判定源文档所属笔记本。
- 因此**发布时校验源笔记本**也具备数据基础（`getBlockByID` 返回块对象，含 `box`）。

## 9. 待决策的设计分歧点（写进方案，与用户对齐）

1. **配置粒度**：全局单一「发布源笔记本集合」 vs 按每个平台账号各自限定 vs 全局默认+按平台覆盖。
2. **作用范围**：仅过滤「文章管理列表」；还是同时「发布时约束」（非授权笔记本的文档禁止发布）。
3. **多选 vs 单选**：允许多个笔记本（推荐 IN）还是只允许一个。
4. **空值语义**：未配置 = 允许全部（向后兼容，推荐） vs 必须显式选择。
5. **是否同时作用于挂件模式子文档列表**（`getSubdocs`）。
6. **zhi-siyuan-api 改动方式**：bump 版本改内核 SQL（根治，推荐） vs 插件侧在拿到列表后再过滤（不根治，列表仍全量拉取）。

## 10. 其他已确认事实

- V2 构建/验证三命令：`pnpm dev:v2` / `pnpm build:v2` / `pnpm makeLink:v2`；产物 `dist-v2/`。
- V1：`pnpm dev` / `pnpm makeLink`；产物 `dist/`。
- 依赖 `zhi-blog-api@^1.79.0` 及以上；`zhi-siyuan-api@^2.36.0`。
- AGENTS.md 原则：**全局触发**（规则落地在共用层，改一处全链路一致）、**功能 100% 保留**、**最大扩展性 > 可用性 > 维护成本**。

## 11. 用户新方向（2026-08-24，已确认）

- **zhi 可跨项目修改**：允许在 `/Volumes/workspace/myproject/zhi-framework/zhi`（branch `dev`）改动 `zhi-siyuan-api`；**发包必须由用户自己做**。
- **V2 文章管理形态**：最大程度**桥接 V1 页面**，不「两张皮」；路由不能共用，但页面可桥接。
  - V2 文章管理 = **房子（home）图标，位于设置（gear）图标左侧**。
  - 不推迟；发布平台验证与文章管理**同步开工**。
- **仍在计划阶段，不着急实施**：底子完全无疑问、零风险才动手。

## 12. zhi 源码改动点已核实（真实源码，非编译产物）

仓库：`/Volumes/workspace/myproject/zhi-framework/zhi`
文件：
- `libs/zhi-siyuan-api/src/lib/kernel/siyuanKernelApi.ts`
- `libs/zhi-siyuan-api/src/lib/adaptor/siYuanApiAdaptor.ts`

关键方法（签名皆为真实源码）：

| 方法 | 签名 | SQL | 改动 |
|---|---|---|---|
| `getRootBlocks` | `(page, pagesize, keyword, isPublished?)` | `b.box as notebookId` 已带出；WHERE 无 notebook 条件 | 加尾参 `notebookIds?: string[]` → WHERE 追加 `AND b.box IN (...)` |
| `getRootBlocksCount` | `(keyword, isPublished?)` | 同上 | 同上（count 与 list 两个分支都要加） |
| `getSubdocs` | `(docId, page, pagesize, keyword, isPublished?)` | `path LIKE '%/<docId>%'` | 可选加尾参 `notebookIds?`（挂件模式一致性，本期可选） |
| `getSubdocCount` | `(docId, isPublished?)` | 同上 | 可选 |
| `getRecentPosts` | `(numOfPosts, page?, keyword?, isPublished?)` | 调 `getRootBlocks(pg, numOfPosts, k, isPublished)` | 加尾参 `notebookIds?` 透传 |
| `getRecentPostsCount` | `(keyword?, isPublished?)` | 调 `getRootBlocksCount(keyword, isPublished)` | 加尾参 `notebookIds?` 透传 |

- 注意：现有代码把 `keyword` 直接字符串插值进 SQL（**已有 SQL 注入隐患**，非本次引入）。新增 `notebookIds` 时必须**做消毒**（白名单 `[A-Za-z0-9_-]`，或先校验每个 id 只含允许字符再拼）。
- 注：`getRecentPosts` 用 `siyuanPost.root_id`，而 SELECT 别名为 `docId`；这是既有行为，**不改动**。只追加 WHERE 条件（不动列别名/LIMIT/OFFSET/排序）。

## 13. V2 宿主与桥接机制（已核实 + 用户纠错后修正）

### 交付模型（地基，已确认）
- **V1 `dist/`**：含 `index.html` + `entry.index.js` + 宿主 `index.js` + assets。思源 serve 插件静态目录 → `/plugins/siyuan-plugin-publisher/#/路由` **可用**。V1 页面走 iframe URL（`widgetInvoke.showPage` → `showIframeDialog`，URL=`/plugins/siyuan-plugin-publisher/#<route>`）。
- **V2 `dist-v2/`**：**无 `index.html`**（仅宿主 `index.js` + `index.css` + 静态资源）。→ **V2 部署下 `/plugins/siyuan-plugin-publisher/#/路由` 完全不可用**。
- **用户纠正**：V2 没有 serve，V1 路由不可用 → **iframe 桥接 V1 SPA 的方案不成立**。

### V2 应用承载（已核实）
- `siyuan/v2/createV2App.ts`：`createApp(V2App)` + pinia + i18n（`legacy:false, locale:"plugin"`）+ `element-plus/dist/index.css`。
- **V2 无 vue-router**：用状态机 `currentView: "quick_publish" | "settings"` + settings 的 `section/accountView` 分页。
- V2 面板 = 思源原生 `Menu` popover，Vue app 挂进宿主 DOM `mountPoint`（`.publisher-v2-menu-content`）。

### 因此「桥接 V1 页面」= 组件级复用（非 URL/iframe）
把 V1 页面 .vue 组件直接内嵌进 V2 应用。需处理 `Admin.vue` 的硬依赖：
- `useRouter`（V1 有，V2 无）：`Admin.vue` 仅一处 `router.push`（挂件无子文档 → 跳 singlePublish）。V2 需提供路由桩或改造成无 router 依赖。
- V1 `useVueI18n`（全量 `src/locales`） vs V2 `useV2I18n`（`plugin`+fallback resolve）：消息目录需能解析命中的 key。
- 动作区 iframe URL（闪发/单发/批发/查看 → `/plugins/siyuan-plugin-publisher/#/...`）：**V2 无 serve 下同样失效**，需改为 V2 原生行为。
- element-plus：V1/V2 都引入，可行（注意样式隔离）。

### 结论（骨架方向，待与用户确认机制）
- V2 文章管理 = 房子图标（gear 左侧）→ 面板内「管理」视图 → **内嵌组件级复用的文章列表**（非独立皮肤）。
- 推荐做法：把文章列表/搜索/分页/笔记本过滤抽成**共用层、无 router 依赖**组件 + `useArticleManage` 组合式函数；V1 `Admin.vue` 与 V2 管理视图各自薄封装（V1 用 router/iframe 动作，V2 用原生动作）。==「共用层」原则。==

## 14. 风险清单（需全部消除后才实施）

| # | 风险 | 消除手段 |
|---|---|---|
| R1 | V2 Menu popover 内嵌 iframe 的尺寸/裁剪/滚动/性能 | 面板内 iframe 撑满并自有滚动容器；`overflow:visible` 已在 host 设好；**需 V2 宿主手验**（尺寸、滚动、暗黑主题）。V1 端 iframe 范式已验证。 |
| R2 | V2 面板修改的笔记本配置与桥接 V1 页状态不一致 | 统一读写共享持久层（`publish-preference-cfg.json`），V1 页 onMounted 拉取；无需跨帧消息。 |
| R3 | SQL 注入（notebookIds） | 白名单消毒 `[A-Za-z0-9_-]`；仅接受 `lsNotebooks()` 来源的 id。 |
| R4 | 新增可选尾参破坏现有调用 | `notebookIds` 缺省/`[]` → 不追加 WHERE，行为不变；zhi 侧单测覆盖空与非空。 |
| R5 | 发布硬校验误伤「随处发布」用户 | 仅当 `publishSourceNotebooks` 非空才校验；默认空 = 不限制（零回退）；提示清晰。 |
| R6 | `getBlockByID(id).box` 缺失致误拦 | box 缺失视为「未限定」放行并 log；避免误拦。 |
| R7 | 挂件模式 subdocs 与 notebook 过滤不一致 | **硬性要求**：`getSubdocs`/`getSubdocCount` 加 `notebookIds`，浏览器与挂件共用同一过滤，不留脏路径。 |
| R8 | V2 面板内嵌 iframe 后 V1 页 `isInSiyuanWidget()` 为 false | 预期行为：走 `getRecentPosts`（全量列表 + notebook 过滤），正是管理页所需。 |
| R9 | element-plus 与 V2 自定义样式冲突 | iframe 完全隔离 V1 SPA（独立样式/路由/依赖），不与 V2 样式冲突。（注：V2 原生 DOM 下改用共用组件，element-plus 与 V2 均引入，需保证样式隔离。） |
| R10 | V2 管理动作非全量、依赖 V1 兜底 | **硬性要求**：V2 全量原生实现闪发/单发/批发/查看/图床，**禁止「去 V1 处理」**；含扩展 V2 快发支持按 pageId 发布。 |

## 15. 用户对齐后仍待确认的点

- 房子图标点击后的面板形态：**V2 面板内切到「管理」视图并 iframe V1 管理页**（推荐，单面板内切换） vs **另开弹层/全屏**。
- 管理视图在 V2 导航里如何流转（返回/关闭后回 quick_publish）。
