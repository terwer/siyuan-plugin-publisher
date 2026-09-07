# Findings

## 现状

- `useV2QuickPublish.ts`：`setPublishState` 更新 `publishState`，**无** `ElMessage`
- `V2App.vue`：顶部 `syp-publish-status` 展示 `publishTitle` / `publishDescription`；`idle` 时为文档级提示，易被忽略
- `V2App.vue` 仅在账号排序等设置操作用 `ElMessage`，快速发布主流程未用
- 旧版 `usePublish.ts` 对部分操作有 `ElMessage.success/error`

## 根因

用户点击平台卡片后，反馈依赖页面顶部状态区；卡片在下方、状态条样式不醒目时，成功/失败都像「没发生任何事」。

## 方案

在 composable 终态（success / success_with_warnings / failed）调用独立 toast 模块，文案复用 `v2.publish.title.*` + 平台名，错误 toast 附带截断后的 `errMsg`。
