# 进度

## 已完成

1. `src/ui/composables/useHeaderNav.ts`（新）：入口集合/顺序唯一来源
   - `HEADER_NAV_KEYS`：`quick_publish / single_publish / batch_publish / manage / settings`（恒定顺序）
   - `buildHeaderNavEntries()`：任何视图都返回同样 5 项；仅「详细发布/批量分发」在无文档时 `disabled` + 原因
   - `resolveHeaderNavAction()`：点击 → `navigate | reset | none`（不可用不动、不在该视图前往、已在该入口回根状态）
2. `src/ui/components/layout/AppHeaderNav.vue`（新）：纯展示组件，`v-for` 常驻渲染，内部零条件渲染；
   当前项蓝色实心高亮 + `aria-current="page"`；不可用项留在原位（`aria-disabled` + 悬浮说明 + `is-disabled`）。
   样式用 `:deep()` 落到 SypTooltip 渲染的按钮上（见 findings）。
3. `src/ui/components/App.vue`：顶部动作条替换为 `<AppHeaderNav>`；删除「返回发布」「返回账号列表/快速发布」两个会变身的按钮；
   删除随之失效的 `settingsBackTitle`、`backFromManage`；标题收紧为可截断（窄面板下让位给导航）。
4. 返回能力下沉到内容区：
   - `PlatformSelect.vue`、`PlatformConfigBridge.vue` 增加页内返回按钮（`emit("back")`），
     由 `App.vue` 的 `handleAccountFlowBack()` 处理（从快速发布卡片「配置」进来的仍回快速发布）。
   - `base.styl` 新增共用样式 `.syp-settings-page__head` / `.syp-settings-page__back`。
5. i18n 双语新增 `app.nav.label`、`app.nav.needDocument`。
6. 测试：
   - `useHeaderNav.spec.ts`（9 例）：集合/顺序恒定、恰好一项激活、仅无文档禁用两项、动作解析、双语文案存在。
   - `AppHeaderNav.spec.ts`（5 例，jsdom 真实渲染）：任何视图下 5 个入口与文案顺序完全一致、
     恰好一项 `is-active` + `aria-current="page"`、**不存在任何「返回」类入口**、无文档时两项留在原位且禁用、点击上报 `(key, disabled)`。
   - `PlatformSelect.spec.ts`：首个按钮断言改为 `.syp-platform-select-item`（原 `find("button")` 会被页内返回按钮抢走），并新增页内返回用例。

## 验证证据

| 项 | 结果 |
| --- | --- |
| `npx vitest run`（全量） | 73 文件 / **402 用例全通过** |
| 本次归档前复跑（2026-09-24） | 全量 `npx vitest run` = **74 文件 / 405 用例全绿**（含 `useHeaderNav.spec.ts` 9 例、`AppHeaderNav.spec.ts` 5 例、`PlatformSelect.spec.ts` 2 例） |
| `pnpm build`（`vue-tsc --noEmit` + 打包） | 通过（`build/package.zip`、`build/siyuan-plugin-publisher-2.0.0.zip` 重建） |
| 宿主手验 | **作者确认通过（2026-09-24）**：5 个入口个数/顺序/位置全程不变、当前项高亮跟随、无文档时两项置灰、账号子流程由页内返回退出 |

## 作者手验清单（已确认）

1. 依次点击 5 个入口：顶部按钮的**个数、顺序、位置**全程不变，仅高亮跟随移动。
2. 无文档打开面板时：「详细发布 / 批量分发」仍在原位、置灰、悬浮给出原因，不可点。
3. 账号子流程：设置 → 账号设置 → 新增账号（选平台）/ 某账号配置页，页内返回能退到账号列表；
   从快速发布卡片「配置」进入的配置页，页内返回回到快速发布。

## 归档（2026-09-24）

- 计划完成并归档至 `.planning/archive/2026-09-24-stable-header-nav/`；`.planning/.active_plan` 改指仍在进行的 `2026-09-24-dark-mode-theme-parity`。
- 实现文件：`src/ui/composables/useHeaderNav.ts`、`src/ui/components/layout/AppHeaderNav.vue`、对应两个 spec，以及 `App.vue` / `PlatformSelect.vue` / `PlatformConfigBridge.vue` / `base.styl` / `siyuan/i18n/*` 的改动。

