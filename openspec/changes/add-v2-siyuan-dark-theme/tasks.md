## 1. Element Plus 暗色基础

- [ ] 1.1 在 `siyuan/v2/createV2App.ts` 增加 `element-plus/dist/index.css` 与 `element-plus/theme-chalk/dark/css-vars.css` import（与 `src/main.ts` 对齐）
- [ ] 1.2 在 `siyuan/v2/v2Host.ts` 的 `show()` 中，对 `mountPoint` 执行 `classList.toggle("dark", data-theme-mode === "dark")`；`close()` 时无需保留（节点已移除）
- [ ] 1.3 **人工验收 Q1**：在思源暗黑下打开 V2 设置桥接，确认 EP 输入框/按钮不发白；记录是否存在 `html.dark`（写入 PR 说明或勾选备注，再决定 4.x）

## 2. `.syp-v2` 与思源变量桥接

- [ ] 2.1 更新 `src/assets/v2/base.styl`：`.syp-v2` 根、` .syp-card`、`.syp-input`、`.syp-btn-secondary`、平台列表/面板壳层等高频选择器改用 `var(--b3-theme-*)` / `var(--b3-border-color)` 并保留 `$syp-*` fallback
- [ ] 2.2 检查 `base.styl` 内其余明显 `#fff` / `$syp-bg-primary` 大块背景（如 `.syp-platform-card`、header 区），按 design D2 补齐 b3 变量
- [ ] 2.3 思源**浅色**下打开 V2，确认与改前观感一致（回归）

## 3. 发布状态条暗黑覆盖（Ant Design 结构保留）

- [ ] 3.1 在 `src/components/v2/V2App.vue` 的 scoped stylus 中增加 `html[data-theme-mode="dark"] .syp-v2` 下 `.syp-publish-status` 各 `is-*` 状态的背景/边框/文字覆盖（`color-mix` 或 share-pro 式 `rgba` 语义半透明）
- [ ] 3.2 修正暗黑下 `.syp-publish-status__detail-btn` 等仍使用近白底的选择器，改为 `var(--b3-theme-surface-light)` 或语义半透明底
- [ ] 3.3 暗黑下走一遍：idle → publishing → success → success_with_warnings → failed，肉眼确认色相可区分、不刺眼

## 4. 条件加固（仅当 1.3 / Toast 验收失败时执行）

- [ ] 4.1 若 Q1 确认宿主暗黑无 `html.dark` 且 EP 仍亮：在 `V2Host.show/close` 实现可逆的 `document.documentElement.classList` 临时 `dark`（仅本插件添加时移除）
- [ ] 4.2 若 Q2 确认 Message 挂 body 仍亮：为 `useV2QuickPublishToast.ts` 及 V2 内其余 `ElMessage`/`ElMessageBox` 传入 `appendTo: mountPoint`（需 `V2Host` 向 app provide 或回调暴露 mount 节点）

## 5. 验收与 Open Questions 闭环

- [ ] 5.1 桌面思源：浅色 + 暗黑各打开一次「快速发布」与「平台设置」面板，截图或口头确认与笔记区一体
- [ ] 5.2 在 PR / 本 task 备注回答 design.md **Q1–Q3**（禁止留空猜测；无法测则标明阻塞并 @ 产品确认）
- [ ] 5.3 （可选）若移动端可测：fullscreen Menu 下重复 5.1
