# Progress — V2 发布闭环（v2-publish-loop）

## 2026-08-24（会话）
- 用户反馈：V2 「详细发布 / 批量分发」暂未做，页面很多连不起来；要先把规划写出来慢慢讨论。
- 核对现状：`currentView` 仅 quick_publish / manage / settings 三视图，无 single_publish / batch_publish。
- 定位断点：① 管理页「单发」落到 quick_publish（非详细发布）；② `publishBatchToAll` 后台直跑无 UI；③ quick_publish 卡片无「详细发布」入口。
- 核查 V1：单发/批发真正 UI 是 `SinglePublishSelectPlatform` / `BatchPublishIndex` 组件（路由页只是薄壳传 id），但组件内部依赖 vue-router + V1 store + V1 i18n。
- 决策（用户逐条拍板）：
  - 桥接优先、100% 保留 → 抽公共部分分别桥接 → **禁止造轮子**。
  - 走**方案B**（抽公共，放弃整体桥接A）。
  - **V2 禁止使用 vue-router**（导航走 `currentView` 状态机）。
  - **把包袱全去掉**：公共组件去 router/store/i18n 依赖，V1/V2 **完全独立**、各自接线、**最大复用**；保优质方案不留伤疤。
  - Q3：一键快速=主、详细发布=次级入口。
  - Q4：V2 复用去耦合后的 `BatchPublishIndex`（确认）。
- 产出：`task_plan.md`（已定稿，含 5 阶段 + 验收）+ `findings.md`（§A 桥接基建 / §B 依赖阻断）+ 本 `progress.md`。
- 活动计划切换：`.active_plan` → `2026-08-24-v2-publish-loop`。
- 交互原型迭代（`tmp/v2-article-manage-real.html`，基于**真实 V2 文章管理 UI** 复刻）：
  - 纠正语义：**闪发=快速平台格**、**单发=详细编辑模式**（对照 V1 `SinglePublishDoPublish`：编辑模式/标题(AI)/正文/知识空间/Slug/标签，发布更新）、**批发=批量+结果**。
  - 关键交互：点「单发/批发/闪发」**右侧滑入次级面板，管理列表仍在背后**（解决 B/C/D 消失）；展开行→平台 chip **悬停显示「发布/更新」+ 点击反馈**；每步有状态条/toast。
  - 用户反馈：**~90%通过**；闪发曾与批发底部按钮重叠（已去「一键发布全部已选」，改为逐卡发布/更新并美化卡格）。
  - **用户确认：原型中单发/批发为占位，真实实现走复用组件**（方案B：抽公共组件给 V1/V2 各自接线）。
- **未动任何代码**；关键验收 = Phase 1 抽取后 V1 回归无退化；待用户确认后进入实现。

## 2026-08-24（实现会话，用户确认「立即实施」）
- 用户确认 OpenSpec 提案 + 原型（~90%），要求立即实施并同步进度。
- **实施取向**：公共部分 = 共享发布引擎 `usePublish`（V1/V2 共用）；V2 用原生视图 + 次级滑入面板承载，**未改动 V1 组件**（消除 V1 回归风险）。原因：V1 `SinglePublishSelectPlatform`/`BatchPublishIndex`/`SinglePublishDoPublish` 是 element-plus + vue-router + Pinia 强耦合，无法在 V2 原生壳中复用而不拖入 element-plus（违背「思源原生 UI 优先 + 包袱全去」）。
- **Phase 2（状态机）**：`currentView` 扩为 5 视图（`V2CurrentView`，导出到 `UnifiedWorkspaceShell`）；集中导航 `openSettings`/`openManage`/`openManage*`/`openSinglePublishForCurrent`，不用 vue-router。
- **Phase 3（原生视图）**：
  - `useV2SinglePublish.ts`：复用 `usePublish.doSinglePublish`/`initPublishMethods`/`getPostPreviewUrl`。
  - `useV2BatchPublish.ts`：复用 `usePublish` 逐平台批量循环（同 V1 BatchPublishIndex 逻辑）。
  - `V2SinglePublish.vue`：平台选择 + 标题/正文/Slug/标签/分类 + 预览/发布更新。
  - `V2BatchPublish.vue`：平台多选 + 逐平台进度/结果。
  - `V2QuickPublishGrid.vue`：闪发快速平台格（复用 `useV2QuickPublish`）。
- **Phase 4（接线）**：quick 卡片「详细发布」次级入口；管理页「单发→单发面板」「批发→批量面板」「闪发→快速格」，右侧滑入（列表仍在背后、遮罩不隐藏、←/遮罩/Esc 关闭，`handleWindowKeydown`）；平台 chip 点击=平台单发（复用共享列表 `platform-single`）。
- 新增 i18n key（`v2.panel.singlePublish`/`batchPublish`、`v2.singlePublish.*`、`v2.batchPublish.*`）到 `siyuan/i18n/{zh_CN,en_US}.json`。
- **验证**：`pnpm build`（V1）✅、`pnpm build:v2`（含 vue-tsc noEmit）✅、`pnpm vitest run` 56 文件 / 276 用例 ✅。dist-v2 已重建（2108 模块）。
- 待办：V2 宿主手验（单发/批量/闪发、视图返回、面板交互）；2.4 视图切换单测；5.5 归档审计。

> 注：OpenSpec `shared-publish-ui` 的「抽取可复用 Vue 组件」条目，因 V1 表单 element-plus 强耦合无法在 V2 原生壳复用，已按引擎复用落地并在 tasks.md 记录为后续评估项（未勾选）。

## 2026-08-24（实现会话 2）
- **平台 chip 悬停提示**：共享 `ArticleManageList.vue` 平台 chip 加「发布/更新」悬停提示（`article-manage-extend__platform-hint`），纯展示增强，V1/V2 共用；文案加到 `src/locales/{zh_CN,en_US}.ts`（`articleManage.extend.platformPublish/Update`）。
- **单测**：新增 `useV2BatchPublish.spec.ts`（3 例：平台加载与默认全选、选择切换、批量结果与部分失败）。要点：须在**挂载前**覆盖 `store.getSetting`（否则组合式捕获旧引用）。
- 全量测试 **57 文件 / 279 用例通过**；`pnpm build`（V1）+ `pnpm build:v2`（含 vue-tsc noEmit）均通过（dist-v2/index.js 6.46MB / gzip 1.98MB）。
- 更新 `openspec/changes/v2-publish-loop/tasks.md`（2.4 / 4.6 / 5.3 勾选）。

## 2026-08-24（实现会话 3）
- 新增 `useV2SinglePublish.spec.ts`（3 例：平台加载与预设平台选择、发布成功回显已发布、发布失败保留错误），补齐单发路径单测覆盖。
- 全量测试 **58 文件 / 282 用例通过**。
- 宿主冒烟：devtools 仅连接思源笔记编辑界面（插件面板未打开），V2 面板的宿主手验需在宿主内点插件入口（属人工门禁，tasks 5.2 待用户）。

## 2026-08-24（UX 反馈迭代）
- 用户反馈「详细发布」按钮在快速发布内容区（`syp-quick-shell__actions`）易与快速发布的平台卡片混淆。
- 按用户确认改法：把「详细发布」入口从**快速发布内容区移除**，改为**头部右侧文字 icon 按钮**（钢笔图标 + 文字「详细发布」），位置在房子图标**左边**（即 `[详细发布][🏠][⚙][✕]`），仅**快速发布视图且有文档**时显示；入口语义仍为「进入详细发布模式」，返回仍到快速发布。
- 改动：`V2App.vue` 新增 `isQuickPublishView` computed；头部 `syp-header-actions` 最前加 `syp-btn-text-entry` 文字按钮（`openSinglePublishForCurrent`）；删除内容区 `syp-quick-shell__actions`/`__detail-btn` 及其样式。
- 验证：`pnpm build:v2`（vue-tsc noEmit + vite，dist-v2 6.46MB/gzip 1.98MB）✅；`pnpm vitest run` **58 文件 / 282 用例**✅；`makeLink:v2` 软链确认仍指向 dist-v2（宿主刷新即生效）。

## 2026-08-24（UX 反馈迭代 2）
- 用户：①「详细发布」icon 与文字挨太近没空格；②「文章管理」「设置」图标也加上文字（右侧区域足够）。
- 改动（`V2App.vue`）：头部 `syp-header-actions` 三个 icon 按钮（详细发布/文章管理/设置）统一为 `syp-btn-text-entry`（icon+文字），`gap` 调为 7px；去掉 hover 下划线（避免三个按钮样式不一致）。三个按钮的 `SypTooltip content` 置空（visible 文字已替代 tooltip，`tooltipContent` 为空自动 disabled）。`articleManage`/`openSettings` 文案复用现有 `v2.app.action.openManage`=「文章管理」`v2.app.action.openSettings`=「设置」。
- 验证：`pnpm build:v2`（vue-tsc noEmit + vite，dist-v2 6.46MB/gzip 1.98MB）✅。

## 2026-08-24（桥接复用修正：V2 正式复用 V1 成熟资产）
- **用户批评（关键转折）**：之前 V2「详细发布/批发」为代理重写的**精简原生表单**，未桥接 V1，丢失了多版本沉淀的成熟功能（编辑模式/AI 标题/知识空间/Slug/标签别名/摘要/分类/发布时间/发布状态/强制删除/同步回思源/预览等）。**不可取**，须真正复用 V1 资产（桥接优先、100% 保留、禁造轮子）。
- **复核推翻旧理由**：V2 构建早已内置 element-plus（`vite.v2.config.ts` 的 `ElementPlusResolver`）+ Pinia + `usePublish`/`usePublishConfig`/`usePublishSettingStore`/`usePreferenceSettingStore`/`useVueI18n`；V1 表单子组件链**完全不依赖 vue-router**。此前「复用会拖入 element-plus / 无法解耦」的判断站不住脚。真正障碍仅 3 个外壳组件的 `useRoute/useRouter`。
- **解耦 V1 外壳（改 props+emit，V1 功能 100% 不变）**：
  - `SinglePublishDoPublish.vue`：去 `useRoute/useRouter`，改 `key/id/method/showBack` props + `back` emit。
  - `SinglePublishSelectPlatform.vue`：去 `useRouter`，改 `open` emit（key/id/method）。
  - `QuickPublishSelectPlatform.vue`：去 `useRoute/useRouter`，`pageId` 改 props、改 `open` emit。
  - `BackPage.vue`：去顶层 `useRoute/useRouter`，改用 `inject(routerKey/routeLocationKey)` 容错（V2 无 vue-router 不崩，V1 行为不变），新增可选 `showBack` prop。
- **新增 V1 包装页**（路由取参传 props，接管导航）：`pages/SinglePublishDoPublish.vue`（`/publish/singlePublish/doPublish/:key/:id`）、`pages/QuickSelect.vue`（`/publish/quickSelect`）；`routeConfig.ts` 相应改装。
- **V2 复用壳**（重写 `V2SinglePublish.vue` / `V2BatchPublish.vue`）：
  - 单发=V1 两步流程（`SinglePublishSelectPlatform` 选平台 → `SinglePublishDoPublish` 详表单），预设平台→直接详表单；V2 轻壳提供返回+标题。
  - 批发=直接复用 `BatchPublishIndex`（本身无 vue-router）。
- **删除**：`useV2SinglePublish.ts` / `useV2BatchPublish.ts` 及其 spec（V2 不再重写引擎，改为复用 V1 资产）；`V2SinglePublish.vue`/`V2BatchPublish.vue` 原精简实现全部替换。
- 新增 i18n key `v2.singlePublish.selectPlatform.title`（zh_CN/en_US）。
- **验证**：`pnpm build:v2`（vue-tsc noEmit + vite，2223 模块，index.js 6.63MB/gzip 2.03MB）✅；`pnpm build`（V1 + 打包）✅；`pnpm vitest run` **56 文件 / 276 用例**✅（删除 2 个精简引擎 spec 减 6 例，其余全绿，V1 回归无退化）。
- 注：openspec `design.md`/`proposal.md` 中「V2 原生精简视图、非抽取复用」的描述已过时，需在归档审计前更新为「复用 V1 资产」。

## 2026-08-24（思源 AI 配置重构适配 + V1/V2 共用 AI 设置组件）
- **用户反馈 Bug**：思源笔记 AI 配置被重构（旧的 `config.ai.openAI` 已移除），插件读不到 → `useChatGPT` 报「OpenAI missing required apiKey」。用户要求修复读取逻辑，并让 V1/V2 **完全复用**一套 AI 设置组件，V2 设置加一个同级 AI tab。
- **根因**：`win.siyuan.config.ai` 现为 `{ mcp, embedding, rerank, agent:{modelId,temperature,maxCompletionTokens}, editing:{...}, imageGeneration, providers:[{id,displayName,enabled,apiKey,baseURL,protocol,models:[{id,enabled,name}]}] }`；凭据在 `providers[]`，`agent.modelId` 引用当前模型。
- **改动 1（模型/类型，`publishPreferenceCfg.ts`）**：新增 `SiyuanAiModel` / `SiyuanAiProvider` 类型；`PublishPreferenceCfg` 加 `experimentalSisyuanAiActiveModelId`（记录用户选择，避免多次调用覆盖）。
- **改动 2（store，`usePreferenceSettingStore.ts`）**：`getSisyuanAiProviders()` 读启用 provider+启用模型；`getPublishPreferenceSetting` 兼容旧 `config.ai.openAI`，否则据 `agent.modelId`（无则第一个启用 provider/model）回填 `experimentalAICode/BaseUrl/ApiModel` 并置 `experimentalUseSiyuanNoteAIConfig=true`；若默认模型的 provider 无 apiKey，回退到第一个带密钥的启用 provider（宿主实测 agent.modelId 指向无密钥 provider，故此回退必要）；无启用 provider 则置 false；`selectSisyuanAiModel(modelId)` 回填；`prefConfig` 改为模块级单例（V1/V2 共用同一引用）。
- **改动 3（共用组件，`AiSetting.vue`）**：升级为 V1/V2 共用组件——思源模式（`useSiyuanCfg`）时顶部显示按 provider 分组的 `el-select`（`el-option-group`）模型选择器，切换即回填 apiKey/baseURL/model，并显示当前 baseURL；手填项在思源模式禁用。V1 `GeneralSetting.vue` 仍 `<ai-setting />`（未改，自动复用）。
- **改动 4（V2 AI tab）**：`V2SettingsSection`（`useV2Settings.ts` + `UnifiedWorkspaceShell.vue`）扩为 `"account"|"picbed"|"preference"|"ai"`；`navItems` 加 `ai`；`V2App.vue` 引入 `AiSetting`、`changeSettingsSection` 类型加 `"ai"`、渲染 `ai` section（`syp-settings-page` 头 + `<AiSetting/>`）。
- **改动 5（i18n，`siyuan/i18n/{zh_CN,en_US}.json`）**：新增 `v2.nav.ai`、`v2.ai.eyebrow/title/desc`。
- **验证**：新增 `usePreferenceSettingStore.spec.ts`（5 例：读启用 provider 并按 agent.modelId 回填、agent.modelId 缺失回退首个、无启用 provider 不启用思源配置、`selectSisyuanAiModel` 回填、未知模型返回 false）✅；`pnpm build:v2`（vue-tsc noEmit + vite，dist-v2）✅；`pnpm vitest run` 全量（57+ 文件）✅（仅 element-plus 弃用警告）。V1 与 V2 共用同一 `src`，`vue-tsc` 全量通过，无 V1 回归风险。

## 2026-08-24（单发编辑回填：摘要 + 知乎专栏）
- **摘要**：单发表单「摘要」绑定 `mergedPost.shortDesc`（同步 `mt_excerpt`），但 `doInitSinglePage` 编辑分支未对其回退；web 平台 getPost 不返回摘要时为空。补 `StrUtil.isEmptyString` 回退到 siyuanPost；标题由 `a || b` 改为 `isEmptyString` 判空回退。
- **知乎专栏（用户纠正方向）**：专栏是**配置存进去的、编辑时只读**（`allowKnowledgeSpaceChange=false`），不是文档持久化数据。核实：web 平台 yaml 仅存 categories（zhi-blog-api `PostUtil.toYamlObj/fromYaml` 不处理 cate_slugs），zhihu 专栏 = 知识空间单选（`cate_slugs`），配置默认值在 `cfg.blogid`（`zhihuWebAdaptor` 用 `post.cate_slugs?.[0] ?? cfg.blogid`）。
  - `doInitSinglePage` 编辑分支：`cate_slugs` 为空且 `cfg.knowledgeSpaceEnabled` 时回退到 `cfg.blogid`（配置默认专栏）。
  - `SingleKnowledgeSpace.initPage`：即便分类列表为空也回退 `cateSlugs[0] ?? cfg.blogid`（只读配置值始终显示）。
- **验证**：`usePublish.spec.ts` 8 例过（含摘要回退、配置专栏回退各 1 例）；`pnpm build:v2`（vue-tsc noEmit + vite）✅。
