# V2 账号列表删除确认弹层修复

## 目标
修复 V2 发布设置 → 账号列表点击「删除」后确认弹层**样式穿透/透明**与**点击冒泡**问题。

## 根因假设（待验证）
1. `ElMessageBox` teleport 到 `body`，暗黑宿主下 `--b3-theme-surface` 未生效 → 对话框背景透明。
2. `syp-v2-message-box` 样式仅在 `base.styl`，未像 Tooltip/ElMessage 一样在 `syp-floating.styl` 做 `html.dark` 全局补强。
3. 删除按钮未 `@click.stop`，事件穿透到列表行/开关。

## 约束
- 先更新本规划再改代码。
- 优先**样式 + 冒泡**最小修复；若 MessageBox 在思源 Menu 内仍异常，再评估改为行内 `SypConfirmBar`（与快速发布卡片删除一致）。
- 不改动博客园 picbed 任务（另一计划目录）。

## 阶段
- [x] 阶段 1：`findings.md` 记录截图现象与 DOM/样式链
- [x] 阶段 2：`syp-floating.styl` 补齐 MessageBox + overlay 暗黑/z-index
- [x] 阶段 3：`V2AccountList` 改行内 `SypConfirmBar` + `.stop` 防冒泡
- [x] 阶段 4：`V2AccountList.spec.ts` 通过；待思源 V2 手验删除流程
