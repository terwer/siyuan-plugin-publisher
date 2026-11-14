# 进度

## 已完成

### 1. 共用层：语义色令牌改为主题优先（改这一处，全链路跟随主题）

`src/ui/assets/variables.styl`：

| 令牌 | 现在 | 说明 |
| --- | --- | --- |
| `$syp-bg-primary/secondary/tertiary` | `var(--b3-theme-background/surface/surface-light, <原值>)` | 面板/卡片底色 |
| `$syp-text-primary/secondary/tertiary/disabled` | `var(--b3-theme-on-background/on-surface/on-surface-light, <原值>)` | 全部文字 |
| `$syp-border-primary/secondary` | `var(--b3-border-color, <原值>)` | 全部边框 |
| `$syp-status-*-bg/-border` | `var(--b3-card-{info,success,warning,error}-background, <原值>)` | 状态底 |
| `$syp-success/warning/error` | `var(--b3-theme-{success,warning,error}, <原值>)` | 状态色 |

原有的 `var(--b3-x, $syp-y)` 写法仍然成立（嵌套回退是合法 CSS），所以**无需改调用点即可整体跟随主题**。
强调色（`$syp-primary` 蓝、`$syp-action-danger` 红）保持固定值：作者部分主题的
`--b3-theme-primary` 近黑，用作强调底会变黑块（上次高亮变黑的直接原因）。

### 2. 逐处清理硬编码浅色

审计基线：`src/ui/**` 独立硬编码 hex **108 处 / 13 文件** → 清理后剩 **9 处允许清单**（均为刻意）。

- `assets/base.styl`：设置侧栏 `.syp-shell__nav` 浅色渐变、`.syp-shell__nav-item` hover/active 配色 → 主题令牌；
  el-button 主色/危险色改用 `$syp-primary` / `$syp-action-danger` 令牌。
- `settings/PicBedSettings.vue`（**58 处**）：整页换成语义令牌；浅蓝底与浅红底改为**半透明色**（`rgba(64,128,255,.10)` 等），
  半透明在深浅两种主题上都成立。
- `settings/AccountList.vue`、`components/App.vue`（设置切换提示条）、`bridge/set/preference/AiSetting.vue`、
  `bridge/set/publish/singleplatform/base/CommonBlogSetting.vue`、`bridge/common/ArticleManageList.vue`：逐处替换。
- `bridge/publish/form/SourceMode.vue`：改用令牌并**删除已冗余的 `html.dark` 覆盖段**（原写法是旧式手写暗黑兼容）。
- 顺带修 `--b3-theme-surface-lights`（思源无此变量，属拼写错误，一直落在回退值上）→ `--b3-theme-surface-light`，3 处。
- 补 4 个文件的 `@import variables.styl`（原先未导入，直接用 `$syp-*` 会编译失败）。

### 3. 守卫测试（防回归）

`src/ui/assets/themeParity.spec.ts`，3 个用例：

1. 语义色令牌必须主题优先（`$syp-{bg,text,border,status}-*` 值里必须出现 `var(--b3-…`）；
2. `src/ui/**` 不得出现允许清单之外的独立硬编码 hex（注释、`var(--x, #hex)` 回退均不算）；
3. 允许清单不得腐化（清单里的色必须仍真实存在）。

**反向对照（关键）**：往 `base.styl` 塞一行 `color #123456` → 用例失败并精确报出
`assets/base.styl: #123456`；移除后恢复全绿。**证实守卫不是空转。**

> 踩坑：本仓库 vitest 环境读不到源码文件 —— `node:fs` 被 `vite-plugin-node-polyfills` 打桩、
> `.styl` 的 `?raw` / `?inline` 均返回空串、动态 import 逃逸也被拦。
> 因此改为在 `vitest.config.ts` 的 Node 侧读盘，用 `define` 注入 `__SYP_UI_SOURCES__`。

## 验证证据

| 项 | 结果 |
| --- | --- |
| `npx vitest run` | 74 文件 / **405 用例全通过**（含新增守卫 3 例） |
| 守卫反向对照 | 注入 `#123456` → 精确报错；移除 → 全绿 |
| `pnpm build`（`vue-tsc --noEmit` + 打包） | 通过，产物已重建 |
| 产物核验 `dist/index.css` | `#fbfdff / #f0f6ff / #eef3fb / #d8e7ff / #edf1f7 / #e8edf5 / #9aa4b2 / #4f6f9f` **全部归零**；`#1f2329` 仅作为 `var(--b3-theme-on-background,#1f2329)` 回退出现 |

## 发现（与本次修复无关，但影响发布流程）

`scripts/build.py` 用 `os.system("pnpm pluginBuild")` 调 vite，**vite 构建失败的退出码不会向上传递**：
本次我先写错 `SourceMode.vue` 的 `@import` 路径，vite 报错、build.py 仍继续打包旧 `dist/` 并以 0 退出 ——
即「构建失败但打包成功」。发布前请以产物内容（如 `dist/index.css` 时间戳/内容）为准，不要只看退出码。

## 待作者手验

1. **暗黑模式**：顶部条、设置侧栏、账号列表、图床设置页、卡片/状态标签全部跟随主题，无浅色残留。
2. **浅色模式**：观感与改造前一致（浅色值仅作回退，未改变）。
3. 若发现某处对比度仍不佳（例如暗色下的浅蓝强调底），告诉我具体位置，我按位置再调。
