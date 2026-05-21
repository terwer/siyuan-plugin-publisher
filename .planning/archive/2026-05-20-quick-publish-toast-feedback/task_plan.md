# 快速发布 Toast 反馈

## 目标

V2 快速发布在成功/失败/警告时除页面状态条外，增加 Element Plus Toast，避免用户误以为「没反应」。

## 判断标准

- **共性 UX**：发布/更新/删除的即时反馈 → V2 快速发布 composable 层，可复用现有 `v2.publish.*` 文案
- **不碰**：各平台 adaptor、公共 `usePublish` 业务逻辑

## 阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| 1 | 探索：`useV2QuickPublish` 仅写 `publishState`，无 ElMessage | complete |
| 2 | 新增 `useV2QuickPublishToast.ts`，终态弹出 success/warning/error | complete |
| 3 | 在 `publishToPlatform` / `deletePlatform` / `previewPlatform` 终态调用 | complete |
| 4 | 单测 + 更新 `progress.md` | complete |

## 终态映射

| status | toast |
|--------|-------|
| success | success（按 lastAction 区分发布/更新/删除） |
| success_with_warnings | warning |
| failed | error（含简短 errMsg） |
| preview_ready | info（可选，打开预览时） |
