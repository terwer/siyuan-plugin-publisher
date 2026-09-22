## Context

- 平台入口：`PluginHost`、快速发布（`useQuickPublish`）、设置桥接（`bridgeRegistry.ts` + `SUPPORTED_V2_BRIDGE_SUBTYPES`）。
- 旧界面仍为 iframe SPA + 「旧界面开关」回退；收敛条件见 `openspec/changes/refactor-ui-foundation/specs/ui-migration/spec.md`。
- 旧 checklist 曾位于 `.qoder/plans/`（已删除）；平行 `.planning/` 副本停用，避免双源。

## Goals / Non-Goals

**Goals**

- 以 `platform-checklist.md` 为 SSOT，逐平台记录 Cfg/Pub/Upd/Del/Img。
- 失败项在 `tasks.md` 登记并拆为可交付修复（可新开子变更或在本变更追加任务）。
- T1 全部 ✅ 后执行 Gate C（旧界面废弃声明），Gate D 在 3 个版本后删 iframe。

**Non-Goals**

- 本变更不一次性实现所有平台修复。
- 不把「需第三方会员」记为插件 ⛔ 阻塞（语雀 API 已明确）。
- 不在 Gate D 之前删除旧界面代码。

## Decisions

### 1. OpenSpec 为唯一真相源

| 用途 | 位置 |
|------|------|
| 主表 / 打勾 | `platform-checklist.md`（本目录） |
| 为什么做 / 能力边界 | `proposal.md` + `specs/platform-verification/spec.md` |
| 流程与门禁 | `design.md`（本文件）+ checklist Gate A–D |
| 可执行任务 | `tasks.md` |
| 会话笔记 | 可选 `verification-log-YYYY-MM-DD.md`（本目录，非 SSOT） |

`.planning/` 仅保留跳转说明，**禁止**再维护第二份 checklist。

### 2. 验收分层

- **T1（35）**：`SUPPORTED_V2_BRIDGE_SUBTYPES` 内平台，必须全链路；CSDN、知乎等已桥接网页 Cookie 平台纳入本层。
- **T2a（0）**：原仅旧界面提供的网页平台已桥接入界面后迁入 T1；旧界面回退路径保留至 Gate D，但 Inv 不再作为这些平台的预期。
- **T2b/T3**：可见性/占位/孤儿，不做完整发布链。

### 3. 语雀 API 口径

- `common_Yuque`：专业会员为语雀政策；持会员验收通过 → 记 ✅，不进入「当前阻塞」。
- 无会员失败：产品提示（`YuqueSetting` / `yuqueApiError`），不挡 Gate A。

### 4. 修复与归档节奏

1. 在 checklist 标 `❌` / `🟡`。
2. 在 `tasks.md` 增加修复任务；复杂项可 `openspec new change <fix-xxx>` 独立提案。
3. 修复后更新 checklist → ✅，必要时写 `verification-log-*.md`。
4. T1 全 ✅ → Gate C → **Gate C 与 Gate D 同落 `2.3.0`** → 归档本变更并更新 `openspec/specs/`。

### 5. 版本口径（2026-09-20 用户确认，含一次更正）

- **`2.0.0` = 旧界面彻底移除**：所有旧界面遗产在该版本清零——iframe 宿主、旧 invoke、旧菜单、「旧界面开关」及其提示、旧界面 SPA 在插件侧的全部入口。**顶栏旧菜单无需保留；文档菜单保留**（已迁到当前界面）。
- **唯一允许的例外 = 桥接**：界面复用着 `src/ui/components/publish/**`、`src/ui/components/bridge/common/ArticleManageList.vue`、`src/ui/components/set/publish/singleplatform/**`、`siyuan/utils/widgetPageUtils.ts`，这些属于当前界面的组成部分，**保留**。
- **`2.0.0` 需补一条「下载 1.41.1」提示**：用户确需旧界面时的唯一去处。**`2.3.0` 移除该提示**（`V1_LAST_VERSION`/`V1_LAST_RELEASE_URL` 随之删除）。
- **更正记录**：此前曾把「Gate C 生效版本」记为 `2.3.0`，并据此认为「旧界面在 2.3.0 才移除」。用户澄清：**`2.0.0` 都还没发版**，`2.3.0` 是更晚的版本；`2.0.0` 即彻底移除旧界面，`2.3.0` 只负责删掉那条下载提示。原「三版本缓冲」的说法不再适用。
- **浏览器扩展必须一并迁到 2.0**：扩展当前以旧界面 SPA 作为弹窗 UI，属「旧界面遗产」，须迁移后才能满足「1.0 代码零残留」。

### 6. 旧界面移除的功能去处（2026-09-20 用户确认：全部迁到当前界面）

普查发现旧界面并非只藏在旧界面开关关闭时分支后面——**文档块菜单（`click-editortitleicon`）在当前界面下依然可达，且直接调旧界面的 iframe**。故移除前必须先把下列入口迁到当前界面，否则属功能退化：

| 现有入口 | 现状 | 迁移目标 |
|----------|------|----------|
| 文档块菜单 →「快速发布」 | `siyuan/index.ts:161-166` → `MenuUtils.getQuickMenus` → `widgetInvoke.showPublisherQuickPublishDialog` → iframe `/workers/quickPublish/:key/:id` | 快速发布面板，且 `PluginHost` 需支持**指定文档 id**（当前 `ShowPluginHostOptions` 只有 `anchorElement` / `initialView`，`V2InitialView` 只有 `quick_publish` \| `settings`） |
| 文档块菜单 →「AI聊天」 | `siyuan/index.ts:167-174` → `widgetInvoke.showPublisherAiChatDialog` → iframe `/ai/chat` | 新增 **AI 聊天视图**（移植 `src/pages/AiChat.vue`：聊天、上下文模式、Prompt 管理） |
| 顶栏旧菜单 →「关于作者」 | `widgetInvoke.showPublisherAboutDialog` → iframe `/about` | 新增 **关于视图**（移植 `src/pages/About.vue`：版本、slogan、作者链接、第三方库列表） |
| 顶栏旧菜单 →「图床 → 独立 PicGo 插件」 | `pluginInvoke.showPicbedDialog` / `showPicbedSettingDialog` → 外部插件 `siyuan-plugin-picgo` 的 UI | **直接删除**（当前界面已有无头 PicGo 设置；该入口代码注释本身已标注 legacy） |
| 顶栏旧菜单 →「常规设置 / 发布设置 / 文章管理 / 批量分发 / 一键发布」 | `widgetInvoke.*` → iframe 各页 | 当前界面已有对应视图（`settings` / `manage` / `batch_publish` / `quick_publish`），仅需重接入口 |

**执行结果（2026-09-20 落地，提交 `d9688b9b` 迁移 + `176fb662` 删除）**：五处入口全部迁移并宿主手验通过。两点补充事实：

- **顶栏旧菜单在当前界面下本就不可达**（「旧界面开关」为真时点顶栏直接开面板），因此该菜单的条目对现行界面用户不构成可达功能；其中「关于作者」「AI 聊天」仍按用户要求补齐了视图，「扩展功能 → 当前文档ID（复制）/ 发布预览（依赖外部 siyuan-blog 插件）」与「图床 → 独立 PicGo 插件」随菜单一并移除，未在当前界面重建。
- **文档块菜单的「一次点击即发布」被保留**：`PluginHost` 新增 `autoPublishPlatformKey`，面板打开后直接对该平台执行发布（实测完成「本地系统」更新），未退化成「先开面板再点一次」。
- **AI 聊天内置的 4 条 Prompt 保持可编辑**：旧界面的预置项 `isSys` 就是 `false`（其只读分支从未被命中），移植时按真实行为保留，未借机改成只读。

### 7. 挂件 / 扩展 / nginx / vercel 产物（2026-09-20 用户确认：先不动构建链）

`vite.v1.app.config.ts` **不只是 iframe SPA 的入口**：挂件（`widgetBuild` → `widget` + `widget.json`）、浏览器扩展（`extBuild` → `src/extensions`）、`nginxBuild`、`vercelBuild` **四个产物都由它构建**。

- **挂件必须保留**（用户明确要求）：`widget.json` 与挂件构建链不动。
- **浏览器扩展必须迁到 2.0**（用户明确要求）：扩展的弹窗 UI 当前就是旧界面 SPA（`manifest.json` 的 `default_popup: index.html`，`background.js` 提供 `fetchChromeXmlrpc` / `fetchChromeJson` 两条 CORS 旁路）；它属于「旧界面遗产」，须迁移后才满足「1.0 代码零残留」。
- **`nginx` / `vercel` 部署**：同源 SPA 产物，随扩展迁移一并处理。
- 因此 `vite.v1.app.config.ts`、`src/pages/**`、`src/routes/**`、`src/bootstrap.ts` 的最终去留，取决于扩展迁移的完成情况；迁移完成前**不要删**。


### 8. 删除面（Gate D 执行清单）

**删除**：`siyuan/iframeDialog.ts`、`siyuan/invoke/pluginInvoke.ts`、`siyuan/utils/menuUtils.ts`、`siyuan/topbar.ts` 的 `showLegacyMenu`/`addMenu`、`src/routes/routeConfig.ts`、`src/bootstrap.ts`、`iframeResize` 指令、`src/pages/**` 中旧界面 SPA 专用页面、旧界面 SPA 构建入口、「旧界面开关」行与关闭提示、`preferenceConfigManager` 的 「旧界面开关」归一化、`PreferenceSetting.vue` 的对应开关、相关 i18n 词条与 `helpConfigs` 字段说明。

**保留**：复用的共享表单组件（见决策 5）与 `zhi-blog-api` 适配器层。

## Risks / Trade-offs

- **长周期表漂移** → 仅改 OpenSpec 内 `platform-checklist.md`；`pre.ts` 变更时同步核对 T1 列表。
- ~~**Gate D 过早** → 必须满足 Gate A + 三版本缓冲~~ → 2026-09-20 用户决定取消缓冲，Gate C/D 同落 `2.3.0`；**改为要求「迁移先于删除」**：上表五个入口全部在当前界面可用并通过宿主手验后，才允许执行删除面。

## Migration Plan

1. 删除 `.qoder/plans/全量平台测试Checklist_0578ad66.md`（已完成）。
2. `.planning/2026-05-20-platform-verification/` 改为指向本变更的 README。
3. 按 T1 顺序验收；优先 #27 语雀网页版、高频平台。
4. Gate C：README / 偏好文案「旧界面已废弃」。
5. **Gate D（`2.3.0`）**：先补齐当前界面的 AI 聊天 / 关于视图与「指定文档」的快速发布，重接文档块菜单与顶栏入口；**迁移手验通过后**再删除 iframe/SPA 路由与宿主、「旧界面开关」及其提示（单独 PR，引用本变更 Gate 记录）。
