# 暗黑模式主题对齐（面板整体跟随思源主题）

## 问题（作者实测）

暗黑模式下插件面板**半深半浅**：顶部条跟随主题变深，内容区仍是浅色 —— 一眼就是坏的。

根因：插件 UI 是两套并存的口径。
- 一部分写 `var(--b3-theme-x, $syp-y)`（主题变量 + 浅色回退）→ 跟随主题；
- 另一部分**直接用硬编码浅色**（`#ffffff` / `#1f2329` / `#fbfdff` / `#f0f6ff` / `#edf1f7` …），或直接用 `$syp-*` 令牌，而 `variables.styl` 里的这些令牌本身是**硬编码浅色**。

审计结果：`src/ui/**` 中**独立硬编码 hex 共 108 处、涉及 13 个文件**（另有 34 处是 `var()` 回退，主题安全）。

| 文件 | 处数 | 性质 |
| --- | --- | --- |
| `settings/PicBedSettings.vue` | 58 | 整页自定义浅色皮肤（文字/卡片/按钮全硬编码） |
| `assets/base.styl` | 16 | 设置侧栏 `.syp-shell__nav` 浅色渐变、`.syp-shell__nav-item` 配色 |
| `settings/AccountList.vue` | 6 | 小按钮配色 |
| `components/App.vue` | 4 | 设置切换提示条 |
| 其余 9 个文件 | 24 | 多为强调按钮上的白字（两模式都成立）与深色 tooltip（刻意） |

## 目标

面板在任何主题下都有一致观感：**以思源主题变量为准，浅色值只作为回退**。
强调色（蓝 `$syp-primary`、危险红）保持固定值 —— 作者部分主题的 `--b3-theme-primary` 近黑，
用作强调底会导致「黑块」（这是上一次高亮变黑的直接原因），故强调色不用主题 primary。

## 改动清单

1. `assets/variables.styl`：`$syp-bg-*` / `$syp-text-*` / `$syp-border-*` / `$syp-status-*` 全部改为
   `var(--b3-…, <原浅色>)` 形式。**改这一处即修复所有直接使用这些令牌的调用点**，
   且原有的 `var(--b3-x, $syp-y)` 写法仍然成立（嵌套回退是合法 CSS）。
2. `assets/base.styl`：设置侧栏与导航项配色改用主题令牌。
3. `PicBedSettings.vue`、`AccountList.vue`、`App.vue`、`AiSetting.vue`、`CommonBlogSetting.vue`：
   逐处替换为语义令牌。
4. 顺带修 `--b3-theme-surface-lights`（该变量在思源主题里不存在，属拼写错误，一直落在回退值上）。
5. 新增守卫测试 `src/ui/assets/themeParity.spec.ts`：
   - 冻结「语义色令牌必须是主题优先」；
   - 扫描 `src/ui/**` 的独立硬编码 hex，落在一份**带理由的允许清单**之外即失败（防回归）。

## 允许清单（两模式都成立，刻意保留）

- 强调底上的白字（`color #fff` 配 `$syp-primary` / `$syp-action-danger` 底）；
- 深色 tooltip（`#303133` 底 + `#fff` 字）；
- 关于页品牌渐变（`#e03e2f → #f1c0b6`）；
- `SourceMode.vue` 里已有的 `html.dark` 覆盖段。

## 验收

- `npx vitest run`（含新增守卫测试）全绿；`pnpm build` 通过。
- 作者在**暗黑模式**下确认：顶部条、设置侧栏、账号列表/图床设置页、卡片与状态标签全部跟随主题，无浅色残留；
  并在**浅色模式**下确认观感与改造前一致（浅色值为回退，已保持不变）。
