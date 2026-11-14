## 1. 文档与方案批准

- [X] 1.1 批准新界面执行文档的统一工作壳模型
- [X] 1.2 批准本 OpenSpec 全生命周期方案
- [X] 1.3 明确里程碑必须顺序推进，禁止越级实现
- [X] 1.4 明确"思源原生 UI 优先"是新界面最高优先级规则
- [X] 1.5 明确批量分发、文章管理仪表盘和详细发布模式采用渐进策略：优先桥接，评估后决定是否原生重写

## 2. Milestone 0：入口与治理基座

- [x] 2.1 统一顶栏主入口行为
- [x] 2.2 统一偏好配置读取通道
- [x] 2.3 建立 `PluginHost`
- [x] 2.4 建立初始化失败自动回退旧界面的机制
- [x] 2.5 编写 M0 smoke 验收清单
- [x] 2.6 明确新界面主路径禁止新增 iframe 依赖
- [x] 2.7 复用现有 `vite.config.ts` 构建链集成界面组件，不新增独立构建入口
- [X] 2.8 验证 M0 通过后才允许进入 M1

## 3. Milestone 1：样式系统与统一工作壳骨架

- [x] 3.1 统一界面样式入口
- [x] 3.2 建立设计令牌
- [x] 3.3 建立 `UnifiedWorkspaceShell` 的导航区和主内容区骨架，品牌视觉区由 `App.vue` 独立管理，详情区预留未实现
- [x] 3.4 验证界面样式不污染旧界面
- [x] 3.5 验证 M1 通过后才允许进入 M2

## 4. Milestone 2：快速发布主界面

- [x] 4.1 在统一工作壳中实现主界面态
- [x] 4.2 展示当前文档上下文
- [x] 4.3 展示真实已配置平台列表
- [x] 4.4 实现空状态
- [x] 4.5 实现从主界面态进入设置展开态
- [x] 4.6 验证 M2 通过后才允许进入 M3

## 5. Milestone 3：发布动作闭环

- [x] 5.1 接入单平台发布
- [x] 5.2 接入发布状态反馈
- [x] 5.3 接入失败重试
- [x] 5.4 验证主路径发布闭环稳定
- [x] 5.5 验证 M3 通过后才允许进入 M4

## 6. Milestone 4：设置展开态第一阶段

- [x] 6.1 实现账号设置列表
- [x] 6.2 实现平台选择流程
- [x] 6.3 实现图床设置内容区
- [x] 6.4 实现偏好设置内容区
- [x] 6.5 桥接平台配置（当前已覆盖 26 个桥接子类型，外加 `Fs_LocalSystem` 条件桥接）
- [x] 6.6 账号列表删除功能接入（`AccountList` 已绑定删除确认与 `settings.phase4DeleteDraft`，删除后同步刷新快速发布列表）
- [x] 6.7 验证 M4 通过后才允许进入 M5

## 7. Milestone 5：批量分发桥接

> 交付主体：`publish-loop`（Phase 3/4，2026-08；已随 `2.0.0` 发行）。

- [x] 7.1 在宿主中添加批量分发入口（菜单或按钮）—— 管理页「批发」→ 右侧滑入批量面板（`App.vue` `openBatch`），与「单发」「闪发」并列
- [x] 7.2 桥接现有 `BatchPublishIndex.vue` 组件到新界面 —— `src/ui/components/bridge/publish/BatchPublishIndex.vue`，由轻壳 `src/ui/components/publish/BatchPublish.vue` 内嵌
- [x] 7.3 验证桥接后的批量发布功能（多平台选择、合并/覆盖模式）—— 复用既有全部字段与逻辑，未重写
- [x] 7.4 验证桥接后的批量删除功能 —— 多平台文章删除保留（`多平台文章删除成功`；系统内置平台跳过，与既有语义一致）
- [x] 7.5 确保桥接实现不影响旧界面批量分发功能 —— 共存期约束：解耦只把 `useRoute/useRouter` 改为 props+emit；旧界面已于 `2.0.0` 整体移除，该约束随之终止
- [x] 7.6 验证 M5 通过后才允许进入 M6 —— 门禁通过（M6 已进入并交付）

## 8. Milestone 6：设置展开态第二阶段

- [x] 8.1 扩展更多平台配置桥接 —— 收口为 **35 项**：`SUPPORTED_BRIDGE_SUBTYPES` = `BRIDGE_COMPONENTS` 34 项 + `Fs_LocalSystem`（Electron 条件桥接），与 `platform-checklist.md` 宿主实测「添加账号 → 选择平台 35 项」逐项吻合；T2b/T3 未注册项确认不暴露
- [x] 8.2 稳定高频设置路径 —— 设置 6 分区（account / picbed / preference / repair / ai / about）随 `2.0.0` 宿主手验通过
- [x] 8.3 梳理发布态、设置态与桥接态当前使用的历史 i18n key（新增 `v2.*` key 已全部在 `siyuan/i18n/*` 中完成）
- [x] 8.4 将新界面当前所需历史 key 镜像到 `siyuan/i18n/*`（已完成，`zh_CN.json` / `en_US.json` 已补齐当前桥接组件所需历史 key 与平台分组 key）
- [x] 8.5 为旧界面共存期建立桥接 i18n 兼容层（已实现宿主 i18n 优先、历史 `src/locales/*` 兜底的兼容层，确保旧界面/新界面共存）
- [x] 8.6 评估哪些旧设置能力仍需保留（基于 `design.md` 8.1 SPA 退役标准分类评估）—— 结论：旧界面已整体移除（`platform-verification` 4.6）；旧界面可达面普查（27 条 SPA 路由）中唯一缺口 `/setting/siyuan` 由通用壳的「思源连接配置」承接，其余能力在界面均有对应
- [x] 8.7 评估批量分发是否需要原生重写（基于用户反馈、性能、维护成本评估）—— 结论：**不重写**，复用既有 `BatchPublishIndex`（`publish-loop` 决策，符合 AGENTS.md「桥接优先、100% 保留、禁造轮子」）
- [x] 8.8 验证 M6 通过后才允许进入 M7 —— 门禁通过（M7 已进入并交付）
- [ ] 8.9 新界面环境适配守卫点清单梳理（将现有零散的 `isElectron` 检查收敛为统一适配策略文档，确保 `EnvUtil.isSiyuanElectron()` 为唯一守卫入口）—— **未产出独立文档**；事实入口已统一：`EnvUtil.isSiyuanElectron()`（`src/utils/EnvUtil.ts:27`）是唯一宿主环境守卫，调用点集中在 `useSettings.ts`、`platforms/pre.ts`、`useWebCookieAuthorization.ts`、`PlatformConfigBridge.vue`、`widgetUtils.ts`；不另立文档以免与代码漂移

## 9. Milestone 7：文章管理仪表盘桥接

> 交付主体：`article-manage-notebook-scope`（2026-08-25 归档）+ `publish-loop`（Phase 4，已随 `2.0.0` 发行）。

- [x] 9.1 在宿主中添加文章管理仪表盘入口（菜单或按钮）—— 界面头部导航「文章管理」（`src/ui/components/layout/AppHeaderNav.vue` → `manage` 视图）
- [x] 9.2 桥接现有 `Admin.vue` 组件到新界面 —— 现行 `src/ui/components/ArticleManage.vue`（原生壳）+ 复用共享列表 `src/ui/components/bridge/common/ArticleManageList.vue`（旧 `Admin.vue` 与现行界面用的本就是同一个共享列表组件，旧文件随 SPA 于 `2.0.0` 删除）
- [x] 9.3 验证桥接后的文章列表功能（列表展示、分页）—— `ArticleManageList` 含分页（`el-pagination`）与展开行
- [x] 9.4 验证桥接后的文章搜索功能 —— 关键字搜索（`articleManage.search.placeholder` / `setKeyword`）
- [x] 9.5 验证桥接后的平台筛选功能 —— 事实口径：筛选为**笔记本筛选 + 关键字搜索**，平台以「平台列 + chip」呈现（chip 点击=平台单发）；无独立平台筛选器，且旧 `Admin.vue` 复用同一共享列表、同样只有 `platform-single` 分发，故不构成功能退化
- [x] 9.6 确保桥接实现不影响旧界面文章管理功能 —— 共存期约束；旧界面已于 `2.0.0` 移除，约束终止
- [x] 9.7 验证 M7 通过后才允许进入 M8 —— 门禁通过（M8 已进入并交付）

## 10. Milestone 8：详细发布模式整合

> 交付主体：`publish-loop`（Phase 3/4，已随 `2.0.0` 发行）。

- [x] 10.1 在新界面快速发布页面（PlatformCard）添加"详细设置"入口按钮 —— 快速发布头部「详细发布」→ `single_publish` 全视图（`openSinglePublishForCurrent`）；管理页「单发」→ 滑入详情面板
- [x] 10.2 尝试桥接现有详细模式组件（PublishDescription、PublishTags、PublishCategories、PublishStatus、PublishTime）—— 直接复用 `SinglePublishDoPublish` 全套 form 子组件（含 `PublishTime` / `PublishStatus` 等）
- [x] 10.3 评估桥接可行性（组件依赖、样式兼容性、状态管理）—— 结论：**可行**，逐组件复用，不做原生重写（`publish-loop/design.md`）
- [x] 10.4 若桥接可行，实现详细设置面板桥接方案 —— 已实现：`src/ui/components/publish/SinglePublish.vue` 轻壳（复用两步流程）
- [x] 10.5 若桥接不可行，记录原因并实现原生详细设置面板 —— 不适用（桥接可行）
- [x] 10.6 实现详细设置面板展开/收起交互 —— 由 `single_publish` 视图与管理页滑入面板承接（← / 遮罩 / Esc 关闭）
- [x] 10.7 实现详细设置字段编辑（别名、摘要、标签、分类、发布状态、发布时间）—— 既有表单字段 100% 保留
- [x] 10.8 实现设置完成后的发布流程（先设置，后发布）—— 详表单直接承载发布 / 更新动作（共享 `usePublish.doSinglePublish`）
- [x] 10.9 验证详细设置不影响快速发布默认行为 —— 快速发布卡仍以一键发布 / 更新为主动作，详细发布为次级入口
- [x] 10.10 输出桥接或原生实现的技术决策文档 —— `openspec/changes/publish-loop/design.md`（方案 B：抽公共复用、放弃整体桥接）
- [x] 10.11 验证 M8 通过后才允许进入 M9 —— 门禁通过（M9 进入并收口）

## 11. Milestone 9：收敛与稳定发布

> 收敛主体：`platform-verification` Gate C/D（已随 `2.0.0` 发行执行）。

- [x] 11.1 输出旧界面收敛清单 —— `platform-verification` 4.6.1 旧界面可达面普查（27 条 SPA 路由逐条归类：16 条有对应 / 11 条开发测试用 / 1 条缺口 `/setting/siyuan` 由通用壳连接配置承接）+ 4.3 删除清单
- [x] 11.2 输出稳定发布策略 —— `2.0.0` 已发行（2026-09-23）：插件 lib 唯一出口 `vite.config.ts` → `dist/`，发行包 42 项 / 17.90 MB（不含 SPA），四个 web 产物同一通用壳
- [x] 11.3 确认回退路径长期可用 —— 结论修正：`2.0.0` 起**不再提供旧界面回退**（发行说明明确「no way back」），仅在设置-关于保留 `1.41.1` 下载提示，该提示于 `2.3.0` 移除；本条按实际口径终止
- [x] 11.4 制定后续废弃旧入口的判据 —— 已执行：Gate C（标记废弃）+ Gate D（物理移除），硬前置「迁移面未在当前界面可用并通过宿主手验前不得删除」
- [x] 11.5 输出 iframe 退役标准框架（已补充到 `design.md` 8.1 章节，包含安全移除/必须移除/保留条件、转换边界、判定清单、进度指标、五阶段路线图）
- [x] 11.6 基于退役标准输出具体文件级移除清单与版本替换表 —— `platform-verification` 4.3.1（宿主/旧 invoke 文件清单）、4.6.5（SPA 入口、壳、27 条路由、pages/layouts/workers/仅 SPA 可达组件）与 4.1（版本替换：`2.0.0` 移除旧界面遗产、`2.3.0` 移除下载提示）
- [x] 11.7 评估批量分发是否需要原生重写（基于用户反馈、性能、维护成本评估）—— 同 8.7：不重写，复用 `BatchPublishIndex`
- [x] 11.8 评估文章管理仪表盘是否需要原生重写（基于用户反馈、性能、维护成本评估）—— 结论：不重写，现行 `ArticleManage.vue`（原生壳）+ 共享 `ArticleManageList` 即为最终形态
- [x] 11.9 总结详细发布模式技术方案（桥接或原生实现）—— 桥接（复用既有实现），记录于 `publish-loop/design.md`
- [x] 11.10 若 M6/M9 评估决定原生重写批量分发或文章管理仪表盘，则在此阶段完成重写并退役桥接实现 —— 条件不成立（8.7 / 11.7 / 11.8 均判定不重写）

## 12. 全程约束

> 以下为贯穿程序的约束条款，随程序在 `2.0.0` 收口而结束；逐条以事实核对（非交付物）。

- [x] 12.1 任一里程碑未通过时，不开始下一里程碑实现 —— M0–M8 顺序推进，门禁逐级记录
- [x] 12.2 全程保持配置格式兼容 —— `2.0.0` 发行说明：平台账号与已发布链接全部保留、无需重新配置
- [x] 12.3 全程优先桥接，不盲目重写全部旧表单 —— 平台配置 35 项桥接、批量分发与文章管理复用共享组件、详细发布复用 `SinglePublishDoPublish`
- [x] 12.4 不再为新增 iframe 页面实现 —— 主路径无新增 iframe；`2.0.0` 已移除插件侧 iframe 宿主
- [x] 12.5 只要思源原生 UI 可用，就优先复用，不重复造通用组件 —— 界面基于 Element Plus 与宿主样式体系，未新造通用组件层
- [x] 12.6 原生界面只允许使用宿主 i18n 作为单一真相源 —— `siyuan/i18n/*`（`zh_CN.json` / `en_US.json`）为单一真相源
- [x] 12.7 旧界面未退役前，不允许因桥接组件 i18n 改造导致旧界面不可用 —— 共存期由宿主 i18n 优先、历史 `src/locales/*` 兜底的兼容层保障；旧界面于 `2.0.0` 移除后该约束终止
- [x] 12.8 SPA 代码移除必须满足 `design.md` 8.1.3 安全移除条件（功能等价、数据兼容、调用链替换、稳定性验证、回退可行）—— 逐条对照见 `platform-verification` 4.6.1（功能等价：27 路由逐条归类）、4.6.3（数据兼容：连接配置与账号读取实测）、4.2（调用链替换：`PluginHost` 入口）、4.4（稳定性：构建 + 单测 + 宿主手验）；回退一行按用户当日口径改为「不提供回退」并保留 `1.41.1` 下载提示
- [x] 12.9 任何 SPA 页面退役前必须通过 8.1.7 功能完全迁移判定清单的 8 项检查 —— 判定清单见 `design.md` 8.1.7（实列 9 项），应用结果即 `platform-verification` 4.6.1 的逐路由对照与 4.6.2–4.6.5 的迁移/删除记录
- [x] 12.10 批量分发、文章管理仪表盘和详细发布模式在 M5/M7/M8 优先尝试桥接，在 M6/M9 评估是否需要原生重写，遵循渐进原则 —— 三者均先桥接，评估结论均为不重写

## 归档审计结论（2026-09-24）

- **交付版本**：`2.0.0`（2026-09-23 发行，`CHANGELOG.md` 标注 BREAKING：旧界面移除、统一工作壳与 iframe → 原生 DOM 迁移完成）。
- **根本修复（非 mock）**：M0–M4 由本变更直接交付；M5 / M7 / M8 由 `publish-loop` 与 `article-manage-notebook-scope` 以真实实现交付（非桥接占位）；M6 / M9 的收敛由 `platform-verification` Gate C/D 实际执行。
- **最佳实践**：桥接优先、复用既有成熟表单链与共享 `usePublish`；宿主 i18n 单一真相源；SPA 退役走「安全移除条件 + 功能完全迁移判定」标准而非直接删除。
- **不破坏底层设计**：发布引擎、传输层、平台适配器契约与配置格式未被本程序改写；账号与已发布链接在 `2.0.0` 全量保留。
- **不影响无关模式**：2026-09-24 复跑 `pnpm vitest run` = **72 文件 / 394 用例全绿**；`pnpm lint`（vue-tsc --noEmit）exit 0；`pnpm build`（vue-tsc noEmit + vite）在 `2.0.0` 发行链中通过。
- **遗留未交付项**：仅 8.9（环境适配策略文档）未产出，已如实标注；其目标（`EnvUtil.isSiyuanElectron()` 为唯一守卫入口）在代码中已成立。
- **归档动作**：本变更 delta 合并至 `openspec/specs/ui-migration/spec.md`（`platform-verification` 的 `ui-migration` MODIFIED delta 以该 spec 为基线）。

