## Why

V2 UI 已具备快速发布与平台配置桥接，但缺少**唯一、可追踪**的全平台验收源头；旧 checklist 散落在 `.qoder/plans/`，与 `.planning/` 并行易造成进度分裂。需要在 OpenSpec 中集中管理「逐平台验证 → 修缺陷 → V1 废弃 → 三版本后移除 iframe」这条确定性长周期任务。

## What Changes

- 建立 **OpenSpec 为唯一真相源（SSOT）**：本变更目录下的 `platform-checklist.md` 为全平台验证主表；`.planning/` 与 `.qoder/plans/` 不再维护平行副本。
- 按 T1/T2a/T2b/T3 分层验收 54 项平台（T1=29 个 V2 bridge 平台完整链路）。
- 验证口径：V2C / Pub / Upd / Del / Img（及 T2a 的 V1C、Inv）；失败项在本变更 `tasks.md` 中开子任务修复。
- **语雀 API**（`common_Yuque`）：需语雀专业会员属平台政策，**不计入插件阻塞**；持会员账号验收通过即记 ✅（#1 已验）。
- 全部 T1 通过后：**Gate C** 标记 V1 废弃（默认 V2，保留 `useV2UI=false` 回退至 Gate D 前）。
- **Gate D**：连续 **3 个发行版本** 后移除 V1 iframe/SPA 宿主路径（对齐 `refactor-ui-v2-foundation`）。

## Capabilities

### New Capabilities

- `v2-platform-verification`: 定义 V2 全平台验收分层、检查项、进度表维护规则与 V1 退役门禁。

### Modified Capabilities

- `ui-v2-migration`: 补充「全平台验收完成」作为 iframe 物理删除的前置条件，与 Gate A–D 对齐。

## Impact

- 文档与流程：`openspec/changes/v2-platform-verification-v1-retirement/*`（主表 + tasks）。
- 实现工作：按 checklist 失败项触发的各平台适配器/V2 桥接修复（不在本提案一次性改完）。
- 删除：`.qoder/plans/全量平台测试Checklist_0578ad66.md`（已移除）。
- 不改动：未验收平台的运行时行为；V1 代码在 Gate D 之前保持可用。
