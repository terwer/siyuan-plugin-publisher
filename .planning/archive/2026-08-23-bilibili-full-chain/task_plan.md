# 任务计划：B站（custom_Bilibili）V2 全链路验证

> 目标：推进 `siyuan-plugin-publisher` V2 平台验证；完成 #35 哔哩哔哩（`custom_Bilibili`）
> 全链路六格（V2C/Pub/Upd/Del/Img/查看）+ 帮助引导与文档，并回写 checklist SSOT。
> 开始时间：2026-08-24（今日休息，次日续作）。属于上一会话交付的交接任务。
> SSOT：`openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`

## 全局准则（AGENTS.md / SOP）
- 每站六格：V2C / Pub / Upd / Del / Img / 查看；通过/失败都写回 SSOT。
- 帮助引导与文档（SOP 第三节）与六格同等计入：help 配置 + 文档草稿 + 宿主 HelpPanel/TourGuide 验证。
- Cookie 授权平台 V2C 标准流程（勿颠倒）：去授权 → 平台账号登录 → **关闭登录窗口（触发 cookie 落盘）** →
  点「2 自动读取 Cookie」 → **检查并填写其余必要字段（最易漏）** → 点「验证」过 `validatePublish`。
- 验证在 Electron 宿主（9222 仅探索）；改动要通用并走上游（`zhi-framework/zhi`）；禁写法律风险表述。
- 讨论用中文，commit 用英文。

## 阶段

### 阶段 0 — 前置（已完成）
- [x] `pnpm build:v2` 通过（vue-tsc + vite），`pnpm makeLink:v2` 已软链到思源 test 工作区。
- [x] #34 微信公众号「查看」由用户复验通过；checklist #34 备注已更新为最终根因并 commit（`eefe8e2e`）。

### 阶段 1 — V2C：Cookie 授权（⭐ 需用户登录 B 站）✅ 已完成
- [x] 打开 V2 面板 → 设置/账号设置 → 哔哩哔哩 → 点「去授权/去登录」。
- [x] 用户在插件弹出的 B 站登录窗完成登录（扫码/账号）。
- [x] **关闭登录窗口**（触发 cookie 落盘）。
- [x] 点「2 自动读取 Cookie」读入该账号。
- [x] 检查其余填报字段：B 站文集（`custom_Bilibili.blogid=898693` 远方的灯塔，运行时 `knowledgeSpaceEnabled=true`）。
- [x] 点「验证」→ `validatePublish` 通过 → 账号「运行中/已授权」。

### 阶段 2 — Pub / Upd / Del ✅ 已完成
- [x] Pub：快速发布 → 选哔哩哔哩 → 发布，「发布成功」，平台侧可见。
- [x] Upd：更新已发布文档，「更新成功」。
- [x] Del：删除发布记录，平台侧已删除/取消。

### 阶段 3 — Img（带图）✅ 已完成（含修复）
- [x] 用含图片文档发布，验证 `uploadFile` 原生上传 → 文章内图 URL 已换 B 站地址（Bundled 默认图床）。
- [x] 记录上传到的图床 URL 作为证据（`i0.hdslb.com/bfs/new_dyn/...jpg`，HTTP 200 / image/jpeg）。
- [x] **修复**：`bilibiliMdUtil.processParagraphNode` 图片段 `para_type` 写死 1 → 改 `hasPic ? 2 : 1`，正文图段 `para_type=2` 不再空白（commit `8d4f9781`）。

### 阶段 4 — 查看 ✅ 已完成
- [x] 点「查看文章」→ `https://www.bilibili.com/opus/<dynId>` 正常打开内容（公开链接，HTTP 200）。

### 阶段 5 — 帮助引导与文档（SOP 第三节）✅ 本轮完成
- [x] 新增 `src/helpConfigs/pages/platform-config/custom-bilibili.ts`（helpUrl+summary+fields+faq+tour，
      target 用 `[data-syp-tour='xxx']`）。
- [x] 注册进 `src/helpConfigs/pages/index.ts`；从 `remaining-t1.ts` 移出；纳入 `registry.spec.ts` `verifiedConfigs`。
- [x] 新增 `docs/draft/platforms/custom-bilibili.md`（占位 helpUrl 顶部标 `TODO：待替换真实帮助文档链接`）。
- [x] `registry.spec.ts` 18/18 通过，`pnpm build:v2` 通过。
- [x] Electron 宿主验证该平台配置页 HelpPanel / TourGuide 正常展示（5 步含「文集」，summary 含「可选择文集」）。

### 阶段 6 — 回写 SSOT ✅ 已完成
- [x] 更新 checklist #35 行六格 + 备注（日期、通道、关键现象）。
- [x] 更新「T1 小结」计数（全链路 ✅ 11 → 12）。
- [x] 「修订记录」追加两行（六格全链路 + 「文集」生效）。
- [x] `en` commit（`8d4f9781` 图片修复 + `5f0194fd` 文集生效 + `8f64ffb2` 修订记录）。

### 阶段 7 — 「文集」字段生效（本轮补充）✅ 已完成
- [x] 调研发现 `addPost`/`editPost` 硬编码 `list_id:0`，所选文集无效。
- [x] 修复：`list_id = post.cate_slugs?.[0] ?? cfg.blogid ?? 0`（与掘金/知乎一致）。
- [x] 宿主发布复验：新文章 `list.id=898693`（远方的灯塔），文集真正生效。
- [x] help 配置补 `knowledgeSpace` tip + tour「文集」步骤（4→5 步）。

## 输出/交付
- checklist SSOT 更新 + en commit。
- 若发现 bug：单独 OpenSpec/`.planning` 修复，不在本 SOP 顺手改；修复前敏感研究先备份 `tmp/`（不提交）。
