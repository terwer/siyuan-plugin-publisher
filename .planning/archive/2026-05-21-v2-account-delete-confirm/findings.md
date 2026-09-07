# 发现

## 2026-05-21 用户反馈
- 场景：V2 发布设置 → 账号列表 → 点击「删除」（如博客园）
- 现象：确认层背景透明，底层列表文字透出；点击可能误触下层开关/按钮（冒泡）
- 实现：`V2AccountList.vue` → `sypConfirm()` → `ElMessageBox`（`SypMessageBox.ts`）
- 对比：`V2PlatformCard` 删除使用行内 `SypConfirmBar` + `@click.stop`，无全局 MessageBox

## 样式链
- `base.styl` 有 `.syp-v2-message-box` / `.syp-v2-message-box-modal`
- `syp-floating.styl` 已处理 Tooltip、ElMessage 的 `html.dark`，**未**处理 MessageBox
- `v2FloatingUi.ts` 注释：浮层走 body，靠 `syp-floating.styl` 着色

## 冒泡链
- `V2App.vue` 根节点 `.syp-v2` 带 `@click.stop` 等（仅作用于宿主内）
- `V2AccountList` 删除按钮 `@click="handleDelete"` **无** `.stop`
