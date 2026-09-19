## Context

- V2 入口：`V2Host`、快速发布（`useV2QuickPublish`）、设置桥接（`bridgeRegistry.ts` + `SUPPORTED_V2_BRIDGE_SUBTYPES`）。
- V1 仍为 iframe SPA + `useV2UI` 回退；收敛条件见 `openspec/changes/refactor-ui-v2-foundation/specs/ui-v2-migration/spec.md`。
- 旧 checklist 曾位于 `.qoder/plans/`（已删除）；平行 `.planning/` 副本停用，避免双源。

## Goals / Non-Goals

**Goals**

- 以 `platform-checklist.md` 为 SSOT，逐平台记录 V2C/Pub/Upd/Del/Img。
- 失败项在 `tasks.md` 登记并拆为可交付修复（可新开子变更或在本变更追加任务）。
- T1 全部 ✅ 后执行 Gate C（V1 废弃声明），Gate D 在 3 个版本后删 iframe。

**Non-Goals**

- 本变更不一次性实现所有平台修复。
- 不把「需第三方会员」记为插件 ⛔ 阻塞（语雀 API 已明确）。
- 不在 Gate D 之前删除 V1 代码。

## Decisions

### 1. OpenSpec 为唯一真相源

| 用途 | 位置 |
|------|------|
| 主表 / 打勾 | `platform-checklist.md`（本目录） |
| 为什么做 / 能力边界 | `proposal.md` + `specs/v2-platform-verification/spec.md` |
| 流程与门禁 | `design.md`（本文件）+ checklist Gate A–D |
| 可执行任务 | `tasks.md` |
| 会话笔记 | 可选 `verification-log-YYYY-MM-DD.md`（本目录，非 SSOT） |

`.planning/` 仅保留跳转说明，**禁止**再维护第二份 checklist。

### 2. 验收分层

- **T1（35）**：`SUPPORTED_V2_BRIDGE_SUBTYPES` 内平台，必须 V2 全链路；CSDN、知乎等已桥接网页 Cookie 平台纳入本层。
- **T2a（0）**：原仅 V1 网页平台已进入 V2 Bridge 后迁入 T1；V1 回退路径保留至 Gate D，但 Inv 不再作为这些平台的预期。
- **T2b/T3**：可见性/占位/孤儿，不做完整发布链。

### 3. 语雀 API 口径

- `common_Yuque`：专业会员为语雀政策；持会员验收通过 → 记 ✅，不进入「当前阻塞」。
- 无会员失败：产品提示（`YuqueSetting` / `yuqueApiError`），不挡 Gate A。

### 4. 修复与归档节奏

1. 在 checklist 标 `❌` / `🟡`。
2. 在 `tasks.md` 增加修复任务；复杂项可 `openspec new change <fix-xxx>` 独立提案。
3. 修复后更新 checklist → ✅，必要时写 `verification-log-*.md`。
4. T1 全 ✅ → Gate C → 三个 release → Gate D → 归档本变更并更新 `openspec/specs/`。

## Risks / Trade-offs

- **长周期表漂移** → 仅改 OpenSpec 内 `platform-checklist.md`；`pre.ts` 变更时同步核对 T1 列表。
- **Gate D 过早** → 必须满足 Gate A + 三版本缓冲 + `ui-v2-migration` 等价性检查。

## Migration Plan

1. 删除 `.qoder/plans/全量平台测试Checklist_0578ad66.md`（已完成）。
2. `.planning/2026-05-20-v2-platform-verification/` 改为指向本变更的 README。
3. 按 T1 顺序验收；优先 #27 语雀网页版、高频平台。
4. Gate C：README / 偏好文案「V1 已废弃」。
5. Gate D：移除 iframe 路由与相关宿主（单独 PR，引用本变更 Gate 记录）。
