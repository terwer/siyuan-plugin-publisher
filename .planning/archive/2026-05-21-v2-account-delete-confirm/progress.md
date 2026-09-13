# 进度

## 2026-05-21
- 根因：账号列表删除用 `ElMessageBox` teleport 到 body，暗黑下浮层样式未在 `syp-floating.styl` 补强；删除按钮无 `.stop`。
- 方案：账号列表改为行内 `SypConfirmBar`（对齐 `V2PlatformCard`）；`syp-floating.styl` 补 P5 MessageBox 供偏好设置等仍用 `sypConfirm` 的场景。
- 已改：`V2AccountList.vue`、`V2AccountList.spec.ts`、`syp-floating.styl`。
