## 1. Element Plus 暗色基础

- [x] 1.1 在 `siyuan/v2/createV2App.ts` 增加 `element-plus/dist/index.css` 与 `element-plus/theme-chalk/dark/css-vars.css` import（与 `src/main.ts` 对齐）
- [x] 1.2 在 `siyuan/v2/v2Host.ts` 的 `show()` 中，对 `mountPoint` 执行 `classList.toggle("dark", data-theme-mode === "dark")`；`close()` 时无需保留（节点已移除）
- [x] 1.3 **Q1 已确认（产品）**：思源无 `html.dark`；暗黑唯一信号为 `data-theme-mode="dark"`；EP 仅依赖 `mountPoint.dark`

## 2. `.syp-v2` 与思源变量桥接

- [x] 2.1 更新 `src/assets/v2/base.styl`：`.syp-v2` 根、` .syp-card`、`.syp-input`、`.syp-btn-secondary`、平台列表/面板壳层等高频选择器改用 `var(--b3-theme-*)` / `var(--b3-border-color)` 并保留 `$syp-*` fallback
- [x] 2.2 检查 `base.styl` 内其余明显 `#fff` / `$syp-bg-primary` 大块背景（如 settings 区、message-box），按 b3 变量补齐；`variables.styl` 中卡片渐变/chip/icon 已桥接
- [ ] 2.3 思源**浅色**下打开 V2，确认与改前观感一致（回归）— **待你在思源中目测**

## 3. 发布状态条（全量 `--b3-theme-*`，无 Ant Design 平行色板）

- [x] 3.1 `V2App.vue`：`.syp-publish-status` 各 `is-*` 改用 `--b3-theme-primary/success/warning/error` + `color-mix`
- [x] 3.2 修正 `__detail-btn` / `__warning` / `__error` 近白底为 `--b3-theme-surface*`
- [ ] 3.3 暗黑下走一遍状态机 — **待你在思源暗黑中目测**

## 4. 条件加固

- [x] 4.1 **取消**：禁止改动宿主 `documentElement`（产品确认）
- [ ] 4.2 `ElMessage` `appendTo` — 仅当实测 Toast 仍发白时再做（当前未改）

## 5. 验收

- [ ] 5.1 桌面思源浅色 + 暗黑各打开快速发布与设置 — **待你验收**
- [x] 5.2 design **Q1–Q3** 已写入 `design.md`「已决事项」
- [ ] 5.3 移动端 fullscreen（可选）
