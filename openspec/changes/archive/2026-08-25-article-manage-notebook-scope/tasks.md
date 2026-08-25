# Tasks: article-manage-notebook-scope

> 关联主线：`v2-platform-verification-v1-retirement`（同步开工）
> 方案细节：`design.md`、`.planning/2026-08-24-article-manage-notebook-scope/`

## 0. 治理与基线

- [x] 0.1 创建 OpenSpec 变更 `article-manage-notebook-scope`
- [x] 0.2 确认交付模型：V1=SPA（`dist/` 含 `index.html`）、V2=原生 DOM（`dist-v2/` 无 `index.html`，V1 路由不可用）
- [x] 0.3 确认「V2 桥接 = 组件级复用（共用层抽象），非 iframe URL」为用户确认方向
- [x] 0.4 确认全局单一集合 `publishSourceNotebooks: string[]`（空=不限制）与发布硬校验

## 1. 数据层（zhi-siyuan-api，本人改、维护者发包）

- [x] 1.1 `siyuanKernelApi.getRootBlocks` 加可选尾参 `notebookIds?: string[]` → 非空时追加 `AND b.box IN (...)`；空/缺省不追加
- [x] 1.2 `siyuanKernelApi.getRootBlocksCount` 同上（count 分支两处都要加）
- [x] 1.3 `siyuanKernelApi.getSubdocs` 加可选尾参 `notebookIds?` → 挂件模式同样按 `b.box IN (...)` 过滤
- [x] 1.4 `siyuanKernelApi.getSubdocCount` 加可选尾参 `notebookIds?`（挂件一致性：浏览器与挂件共用同一过滤，不留脏路径）
- [x] 1.5 notebookIds 白名单消毒（`[A-Za-z0-9_-]`），只接受 `lsNotebooks` 来源 id
- [x] 1.6 `siYuanApiAdaptor.getRecentPosts`/`getRecentPostsCount` 透传可选尾参
- [x] 1.7 保留 LIMIT/OFFSET/别名/排序不变；补充空/非空/多 notebook、挂件内 notebook 过滤单测
- [x] 1.8 维护者发包新版本（2.37.0）→ 本仓库 bump；跑通构建

## 2. 配置模型（共用层）

- [x] 2.1 `PublishPreferenceCfg` 增加 `publishSourceNotebooks?: string[]`（默认 `[]`）
- [x] 2.2 `preferenceConfigManager.ts` `normalizePreferenceConfig` 归一化（空数组）
- [x] 2.3 新增共享「笔记本选择」组合式函数/组件：`lsNotebooks()`，过滤关闭/系统/用户指南笔记本

## 3. 共用层文章管理组件

- [x] 3.1 新增 `useArticleManage.ts`：数据（含 notebookIds）、分页、搜索、已发布、展开、yaml
- [x] 3.2 新增 `ArticleManageList.vue`：无 router 依赖；动作以事件抛出（quick/single/batch/view/picgo）
- [x] 3.3 顶部「发布源笔记本」多选：初值取偏好，变更持久化 + 刷新

## 4. V1 接入

- [x] 4.1 `Admin.vue` 改薄封装：贴共用组件，动作实现为 router 跳转 + DrawerBoxBridge iframe
- [x] 4.2 行为逐项对照（搜索/分页/已发布/展开/动作/挂件 vs 浏览器模式），防回归
- [x] 4.3 `PreferenceSetting.vue` 增加「发布源笔记本」配置项（复用笔记本选择组件）

## 5. 发布硬校验

- [x] 5.1 `usePublish.doSinglePublish` 开头用 `kernelApi.getBlockByID(id).box` 校验 ∈ 授权集合
- [x] 5.2 越权抛清晰错误；`box` 缺失放行 + log；仅非空集合才拦截
- [x] 5.3 确认覆盖 Single/Batch/Quick/V2 全部入口（均汇入 doSinglePublish）

## 6. V2 接入（全量原生行为，禁止向 V1 兜底）

- [x] 6.1 `V2App.vue` 头部 gear 左侧加房子图标
- [x] 6.2 新增「管理」视图：内嵌共用组件 `ArticleManageList`，动作以 V2 原生实现
- [x] 6.3 扩展 V2 快发：`useV2QuickPublish` 支持按指定 pageId 发布（供管理页逐行「闪发/单发」）
- [x] 6.4 管理页「闪发/单发」→ V2 指定文档发布流程（原生）
- [x] 6.5 管理页「批发」→ V2 复用 `usePublish` 批量流，原生承载
- [x] 6.6 管理页「查看」→ V2 打开预览链接（原生）
- [x] 6.7 管理页「图床」→ V2 打开图床工具（原生）
- [x] 6.8 返回/关闭：管理视图 → quick_publish
- [x] 6.9 `V2PreferenceSettings.vue` 增加「发布源笔记本」配置项
- [x] 6.10 确认 V2 单发/快发走 doSinglePublish 自动受硬校验保护

## 7. 测试与验收（与平台验证同步）

- [x] 7.1 单测：配置归一化、SQL 消毒、共用组件分页/过滤、发布校验、V2 视图切换（`pnpm vitest run` 57 文件 / 287 用例通过；`pnpm lint` vue-tsc exit 0）
- [x] 7.2 V1：`pnpm build`（exit 0）+ 宿主手验（列表过滤、越权报错、未配置零回退）
  - 2026-08-25 宿主手验通过：列表按「发布源笔记本」过滤生效；未授权笔记本文档发布被 `assertNotebookAllowed` 拦截并展示清晰错误；未配置时零行为回退。
- [x] 7.3 V2：`pnpm build:v2`（exit 0）+ 宿主手验（房子图标、管理视图渲染、过滤、越权拦截）
  - 2026-08-24 宿主（思源 test 工作区，9222 直连）手验通过：
    - 房子图标（lucide `house`，aria `openManage`）位于 `.syp-header-actions` 首个按钮，在「设置」齿轮左侧 ✅
    - 点击进入「文章管理」视图：标题、说明文案、发布源笔记本多选、搜索、已发布勾选、表格、分页均渲染 ✅
    - 「发布源笔记本」下拉加载 `lsNotebooks()` 选项（测试笔记/导入专用/日记专用），选择「测试笔记」后 `publishSourceNotebooks` 持久化到 `storage/syp/publish-preference-cfg.json` ✅
    - 越权拦截：授权集合改为仅「日记专用」后，发布「测试笔记」文档被 `assertNotebookAllowed` 拦截，状态区显示「发布失败」+清晰错误（含 notebook id），`查看详情` 打开错误详情面板 ✅
  - 验证前置（本机首次：需先 `pnpm install` 拉取 `zhi-siyuan-api@2.37.0`，再 `pnpm build:v2` 重建 dist-v2，已 `makeLink` 到 test 工作区并刷新宿主）。
- [x] 7.4 同步 docs（文章管理/发布设置/常规发布/极速发布/批量分发/使用指南/分类体系/人工智能 已补齐）；归档前按 OpenSpec 审计（根治/最佳实践/不破坏底层/不影响无关模式）四项全部达标

> 注：Phase 7 全部完成。2026-08-25 归档（`openspec archive`），zhi 侧变更由维护者发包（2.37.0）并由本仓库 bump。
