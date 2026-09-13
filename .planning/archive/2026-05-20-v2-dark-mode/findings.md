# Findings — V2 暗黑模式

## share-pro（参考项目）做法

| 点 | 实现 |
|----|------|
| 宿主 | `new Menu()` + `menu.element` 内 `div.share-pro-menu-content`，Svelte 挂到 Menu（与 publisher `V2Host` 同构） |
| 根节点 | `<div id="share">` |
| 默认色 | Stylus/Svelte 里大量 **`var(--b3-theme-surface)`、`var(--b3-theme-on-surface)`** 等思源主题变量 |
| 暗色特例 | `html[data-theme-mode="dark"] #share { ... }` 覆盖少数硬编码浅色（如 error-banner） |
| **没有** | `useDark`、`html.dark`、iframe 内独立主题切换 |

结论：**不自己造主题**，读宿主 `html` 的 `data-theme-mode`，用思源 `--b3-*` 变量即可自动随暗黑切换。

## publisher V1（iframe SPA，将废弃）

| 点 | 实现 |
|----|------|
| 入口 | `src/main.ts` 全页 `#app` |
| 暗黑 | `@vueuse/core` **`useDark()`** → 给 **`html`** 加 **`dark`** 类 |
| 样式 | `style.dark.css` 里 **`html.dark ...`** + `element-plus/theme-chalk/dark/css-vars.css` |
| 切换 | `DefaultFooter.vue` 手动「暗黑模式」链接 |

仅在 **iframe 独立文档** 内有效；V2 Menu 挂在思源页面里，改 iframe 内 `html.dark` **无效**。

## publisher V2（当前问题）

| 点 | 现状 |
|----|------|
| 宿主 | `V2Host` → `publisher-v2-menu-content` → `.syp-v2`（`V2App.vue`） |
| 变量 | `src/assets/v2/variables.styl` **写死浅色**（`$syp-bg-primary: #FFFFFF` 等） |
| 检索 | 仓库内 **无** `data-theme-mode`、**无** `--b3-theme-*` |
| Element Plus | V2 `createV2App` **未** 引入 `dark/css-vars.css`；Popper 挂 `body` 时可能仍偏亮 |

根因：V2 用自建浅色 token，**断开**思源主题管道。

## 最小最优方案（Element Plus + 自定义 V2 各一层）

V2 与桥接里的 **CommonBlogSetting 等仍用 Element Plus**；自定义壳用 **`.syp-v2` + stylus**。两层分开处理，改动面最小。

### ① Element Plus（与 V1 SPA 同套机制，但作用在宿主页）

| 步骤 | 改动 | 说明 |
|------|------|------|
| 1 | 在 `createV2App.ts` 增加两行 import | `element-plus/dist/index.css` + `theme-chalk/dark/css-vars.css`（与 `src/main.ts` 一致，只打进 V2 包） |
| 2 | 依赖思源已给的 **`html.dark`** | EP 暗色变量挂在 `html.dark` 上；思源暗黑时通常与 `data-theme-mode="dark"` 同时存在 |
| 3 | 若实测 Message/表单仍发白 | 仅在 `V2Host.show()` 时：宿主为 dark 且 `html` 无 `dark` 类则临时 `classList.add('dark')`，`close()` 时若由本插件添加则移除（**仅面板打开期间**，避免改 V1 iframe） |

**不要**：在 V2 里接 `useDark()` / 页脚手动切换（那是 iframe 内独立文档用的）。

**可选加固**：`ElMessage` / `MessageBox` 传 `appendTo: mountPoint`（仅当 body 级弹层仍不跟暗黑时再改，约 2 处）。

### ② 自定义 `.syp-v2` 区域（对齐 share-pro，不重写 variables.styl）

只在 **`base.styl` 根层 + 若干块级容器** 把写死的白底改成思源变量（约 10～15 处选择器），品牌色 `$syp-primary` / 按钮色保留。

```stylus
// 示例：根与卡片跟随宿主
.syp-v2
  color var(--b3-theme-on-background, $syp-text-primary)

.syp-v2 .syp-card,
.syp-v2 .syp-publish-status,
.syp-v2 .syp-platform-card
  background var(--b3-theme-surface, $syp-bg-primary)
  border-color var(--b3-border-color, $syp-border-primary)
  color var(--b3-theme-on-surface, $syp-text-primary)
```

特例（如 Ant Design 式 alert 色条）保留现有写法，或像 share-pro 一样加：

`html[data-theme-mode="dark"] .syp-v2 .syp-publish-status.is-success { ... }`（仅当 b3 变量不够时）。

**不必**：给整份 `variables.styl` 做暗色副本；**不必** `id="publisher-v2"`（有 `.syp-v2` 足够）。

### ③ V2Host 一行（可选，给 Menu 内 EP 子树）

```typescript
mountPoint.classList.toggle("dark", document.documentElement.getAttribute("data-theme-mode") === "dark")
```

与 EP 的 `.dark` 变量作用域一致，且不影响 iframe 内 V1。

### 改动量预估

| 文件 | 约行数 |
|------|--------|
| `siyuan/v2/createV2App.ts` | +2 import |
| `siyuan/v2/v2Host.ts` | +1～15（classList + 可选 Observer/close 清理） |
| `src/assets/v2/base.styl` | +15～30（b3 变量桥接） |
| 可选 `useV2QuickPublishToast.ts` | `appendTo` |

### 不建议

- 复用 V1 `useDark` + `style.dark.css`（仅 iframe 有效）
- 全量替换 `variables.styl` 为暗色表
- 为暗黑单独做 V2 主题切换按钮

## 与 checklist 关系

全平台验证表仍在 OpenSpec `v2-platform-verification-v1-retirement`；暗黑为 **横切能力**，建议单独 OpenSpec 变更实现后再验 UI。
