## Why

V2 发布面板通过思源 `Menu` 挂在**宿主页 DOM** 内，而非 V1 iframe 独立文档。思源开启暗黑后，宿主 `html` 已有 `data-theme-mode="dark"` 与 `--b3-theme-*` 变量，但 V2 仍使用 `variables.styl` 写死的浅色 token，且 `createV2App` 未引入 Element Plus 暗色 CSS 变量，导致面板、表单、Toast 在暗黑下明显偏亮、与笔记界面割裂。

本变更在 V2 全平台验收（横切 UI）之前补齐暗黑适配，使 V2 与思源主题**同源**、观感统一，且不引入 V1 的 `useDark` / 独立主题切换。

## What Changes

- **宿主主题管道**：`data-theme-mode="dark"` 为**唯一**暗黑判定源；不新增 V2 内主题开关；**不修改** `document.documentElement`。
- **Element Plus 层**：在 `createV2App.ts` 引入 EP 明/暗 CSS；在 `mountPoint` 上同步 `dark` 类（思源无 `html.dark`，EP 仅认挂载点子树）。
- **自定义 `.syp-v2` 层**：`base.styl`、`V2App.vue` 及主要 V2 子组件**全量**改用 `var(--b3-theme-*)` / `var(--b3-border-color)`，保留 `$syp-*` 作浅色回退；发布状态条使用思源语义色（primary/success/warning/error），不再维护 Ant Design 平行色板。
- **条件加固**：仅当实测 `ElMessage` 仍发白时增加 `appendTo: mountPoint`（task 4.2）。
- **明确不做**：V2 内 `useDark()`、页脚手动暗黑切换、复制整份 `variables.styl` 暗色表、改动 V1 iframe `style.dark.css` 路径。

## Capabilities

### New Capabilities

- `v2-host-dark-theme`: V2 Menu 宿主挂载场景下，跟随思源明暗主题的 Element Plus 与 `.syp-v2` 双层样式要求及验收场景。

### Modified Capabilities

- （无）不修改 `openspec/specs/` 下既有平台/桥接能力的需求契约；仅 UI 呈现层横切。

## Impact

| 区域 | 文件（预估） |
|------|----------------|
| V2 入口样式 | `siyuan/v2/createV2App.ts` |
| 宿主同步 | `siyuan/v2/v2Host.ts` |
| 自定义壳 | `src/assets/v2/base.styl` |
| 状态条语义色 | `src/components/v2/V2App.vue`（scoped 内 `.syp-publish-status` 暗黑块） |
| 可选 Toast | `src/composables/v2/useV2QuickPublishToast.ts`、`V2App.vue`、`V2WebCookieAuthPanel.vue` 等 `ElMessage` 调用点 |
| 参考（只读） | `siyuan-plugin-share-pro` → `ShareUI.svelte`；V1 `src/main.ts`（EP import 对齐） |

与 `v2-platform-verification-v1-retirement` 独立；暗黑合并后建议在思源暗黑下抽测 1～2 个平台 UI，不替代 T1 功能验收。
