## Context

**第一性原理（约束推导）**

| 事实 | 推论 |
|------|------|
| V2 运行在思源页面内的 `Menu.element` 子树 | 主题信号只能来自**宿主** `document.documentElement`，不能来自 iframe 内 `html` |
| 思源已维护 `--b3-theme-*` 并随 `data-theme-mode` 切换 | 插件 UI 应**消费**这些变量，而非维护平行色板 |
| V2 同时使用 Element Plus（设置桥接等）与自定义 `.syp-v2` | 两层机制不同：EP 依赖 `html.dark` + `dark/css-vars.css`；自定义层依赖 `--b3-*` + 少量暗黑覆盖 |
| V1 将废弃 | 禁止把 V1 的 `useDark` / `style.dark.css` 当作 V2 方案；仅可复用 EP 的 **import 清单** |

**现状（代码事实，非猜测）**

- `createV2App.ts`：无 Element Plus 全局样式 import。
- `variables.styl`：`$syp-bg-primary: #FFFFFF` 等写死浅色。
- `base.styl` / `V2App.vue`：无 `--b3-theme-*`、`data-theme-mode` 引用。
- `V2App.vue`：`.syp-publish-status` 已采用 Ant Design Alert 色板（浅底 + 1px 边框），浅色模式下已验收。
- `src/main.ts`：已 import EP 明/暗 CSS（仅作用于 iframe `#app`）。

**参考实现（同团队插件）**

- `siyuan-plugin-share-pro`：`var(--b3-theme-surface)` 为默认；`html[data-theme-mode="dark"] #share { ... }` 仅覆盖少数硬编码浅色（如 error-banner 半透明红）。

## Goals / Non-Goals

**Goals:**

1. 思源暗黑开启时，V2 面板背景、卡片、输入框、正文与思源笔记区**视觉一体**（以色温、对比度接近宿主为准）。
2. Element Plus 表单项、按钮、Message/MessageBox 在暗黑下可读、不发白。
3. 发布状态条（success / warning / error / info）在暗黑下仍清晰区分，**保留现有 Ant Design 式结构与色相**，通过暗黑覆盖降低刺眼度（半透明底 + 调高文字对比），而非换成另一套组件库。
4. 改动面小：不复制 `variables.styl`；新页面样式默认继承 b3 桥接规则。
5. 浅色模式零回归：所有 `var(--b3-*, $syp-*)` 必须带 stylus 回退到现有 `$syp-*`。

**Non-Goals:**

- V2 内独立「暗黑模式」开关。
- 改造思源全局 `html` 主题（除**实测证明必要**且**面板生命周期内可逆**的 `html.dark` 兜底）。
- V1 iframe SPA 暗黑逻辑迁移或删除。
- 为每个平台适配器单独写暗黑样式。

## Decisions

### D1 — 暗黑判定源：`data-theme-mode` 优先

- **选择**：`isHostDark = document.documentElement.getAttribute("data-theme-mode") === "dark"`。
- **理由**：与 share-pro、思源官方主题一致；不依赖插件自建状态。
- **拒绝**：V1 `useDark()`（只影响 iframe 文档）。

### D2 — 双层样式策略

**层 A — Element Plus**

1. 在 `createV2VueApp` 模块顶层增加与 `src/main.ts` 相同的两行 CSS import。
2. `V2Host.show()` 内对 `mountPoint`：`classList.toggle("dark", isHostDark)`，使 Menu 子树内 EP 变量生效。
3. **不猜测**宿主是否总有 `html.dark`：实现阶段第一步只做 mountPoint + import；在 `tasks.md` 1.3 由人工在思源暗黑下验收 EP 组件。若 Message 仍白底，再执行任务 4.x（`html.dark` 临时兜底或 `appendTo`）。

**层 B — `.syp-v2` 自定义**

1. **默认（明/暗通用）**：在 `base.styl` 根与高频容器把 `background` / `color` / `border-color` 改为：
   - `var(--b3-theme-surface, $syp-bg-primary)`
   - `var(--b3-theme-on-surface, $syp-text-primary)` / `var(--b3-theme-on-background, ...)`
   - `var(--b3-border-color, $syp-border-primary)`
   - 次要面：`var(--b3-theme-surface-light, $syp-bg-secondary)`、`var(--b3-theme-background, ...)`
2. **品牌与操作色保留**：`$syp-primary`、`$syp-action-primary` 等按钮/链接色不改，避免失去产品识别度；hover 可用 `color-mix(in srgb, var(--b3-theme-primary) 14%, transparent)`（与 share-pro `ShareSetting` 一致）仅在需要处引入。
3. **语义状态条（Ant Design 保留 + 暗黑微调）**：`V2App.vue` 内现有 `$syp-alert-*` 浅色值在亮色模式保持不变；新增同级选择器：

   ```stylus
   html[data-theme-mode="dark"] .syp-v2
     .syp-publish-status.is-success
       background color-mix(in srgb, var(--b3-theme-surface) 88%, #389e0d)
       border-color color-mix(in srgb, var(--b3-border-color) 50%, #389e0d)
       // 文字色略提亮，保证 WCAG 对比（具体色值实现时以肉眼+思源暗黑背景为准）
   ```

   对 `is-failed` / `is-success_with_warnings` / `is-publishing` 同理；**warning/error 内嵌块**（`__warning` / `__error`）将 `rgba(255,255,255,0.86)` 等硬编码白底改为 `var(--b3-theme-surface-light)` 或半透明语义色（对齐 share-pro `error-banner` 的 `rgba(245,34,45,0.15)` 思路）。

4. **不改动** `variables.styl` 文件结构（避免双份 token 维护）。

### D3 — 配色美观与「融为一体」

- **中性面**：几乎全部来自 `--b3-theme-*`，保证与思源皮肤（经典/仿宋等）同步变色。
- **语义面**：沿用现有 Ant Design 色相（蓝 info、绿 success、橙 warning、红 error），暗黑下用 `color-mix` / 半透明底降低亮度，避免大面积 `#fffbe6` 类浅黄块。
- **禁止**：在无 `--b3-*` 回退时写死新的 `#1e1e1e` 全套暗色表（会与思源皮肤漂移）。

### D4 — 生命周期与副作用

- `V2Host.close()` 必须撤销本插件在 `show()` 中添加的临时 `html.dark`（若启用 D2 兜底）。
- 不向 `document.documentElement` 持久写入主题属性。

### D5 — 测试与文档

- 手工验收矩阵写入 `tasks.md` §5（桌面暗黑 / 浅色各 1 次；移动端若可得再加 1 次）。
- 不添加依赖「思源 DOM 结构未文档化字段」的单元测试；可选 styl 快照仅测回退 token 存在。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 宿主仅有 `data-theme-mode` 而无 `html.dark`，EP Popper 挂 `body` 仍亮 | 分阶段：先 mountPoint.dark + import；实测后再 `appendTo` 或临时 `html.dark` |
| `color-mix` 在极旧 Chromium 不支持 | 思源桌面版 Chromium 通常足够新；若不支持则回退到 share-pro 式 `rgba(...)` 字面量（实现时二选一，不提前写死数值） |
| 桥接 `CommonBlogSetting` 内 EP 与 `.syp-v2` 嵌套导致遗漏选择器 | 任务按「壳层 → 卡片 → 表单 → 状态条 → Toast」顺序验收 |
| 浅色回归 | 所有 CSS 变量带 `$syp-*` fallback |

## Migration Plan

1. 合并本变更实现 PR。
2. 开发者在思源 **设置 → 外观 → 暗黑** 下打开 V2 快速发布与设置桥接，按 `tasks.md` 勾选。
3. 无数据迁移；无配置项。
4. 回滚：revert 4 个文件即可恢复浅色行为。

## Open Questions（实现前须确认，禁止 mock）

以下项**不能**在 apply 阶段凭假设写死逻辑；若评审时无法确认，由实现者在对应 task 打勾前向产品负责人确认：

1. **Q1**：当前主力测试的思源版本（如 3.1.x）在暗黑下，`document.documentElement` 是否**同时**存在 `class="dark"` 与 `data-theme-mode="dark"`？（决定是否需要 `html.dark` 临时兜底 task）
2. **Q2**：移动端 `Menu.fullscreen` 下 EP/Message 是否仍挂 `body`？（决定 `appendTo` 是否纳入必做而非可选）
3. **Q3**：状态条暗黑下是否接受「Ant Design 色相 + b3 底」的混合风格，还是要求完全使用 `--b3-theme-error` 等思源语义色？（默认提案为前者，与现有 V2 快速发布 UI 一致）
