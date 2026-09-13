# Progress

## 2026-05-20

- 完成代码探索，确认 V2 快速发布缺 Toast
- 实现 `useV2QuickPublishToast.ts`，接入 `useV2QuickPublish` 终态反馈
- 单测：`useV2QuickPublishToast.spec.ts`，并断言 composable 会调用 notify
- 强化 `V2App` 顶部 `syp-publish-status`：idle 虚线灰底弱化，终态左侧色条 + 圆点 + 阴影对比
