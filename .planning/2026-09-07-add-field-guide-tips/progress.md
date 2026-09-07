# 进度日志：字段级指引接线与回填

## 会话：2026-09-07（立项与规划）

### 背景（本会话此前已完成并推送）
- `94dc6d26` / `376934d8`：18 份 help 配置 + 22 篇文档草稿的文案口径归一（验证进度类叙述移出用户可见产物），SOP §3 增补第 4 条「文案口径」与 tour 锚点要求。
- `458ac47a` / `e4a3f592`：GitHub 族 YAML 永久链接能力位 `yamlLinkSupported`（Vuepress2/Vitepress/Astro/Docsify 撤下无效开关），新增 `yamlLinkCapability.spec.ts`；全量 309 测试 + `build:v2` + 宿主复核通过。
- `c88f930b`：`add-field-guide-tips` OpenSpec change 立项（`openspec validate --strict` 通过）。

### 本次执行
- 用户否决「延后接线」，要求现在实现并回填已验证平台，且后续验证必须通过该点 → 建立本计划目录并设为 active。
- 完成评估取证（详见 findings.md 第 1–7 条）：`fields` 零呈现、说明挤在 placeholder、`fields` 键与 tour 锚点分属两套命名空间、`label-width="96px"` 布局约束、pageId 来源已存在、宿主 popper 风险、回归可钉死形式。
- 制定阶段 0–5，阶段 0 为**宿主弹层去风险**，未定稿前不铺开挂载。

### 用户修正工作方式（关键）
用户要求：**每完成一个平台 tips 就停下找他验收，通过后才继续；共用层（指导）必须先与一个平台宿主对齐定稿，不要一次性铺开全部**。→ 已把该门禁写入 goal objective（rev 2）与本计划「工作方式」，并把阶段改造成步骤 A–F（A 共用层+试点，B–E 按族分平台，F 收尾）。

### 步骤 A 执行（共用层 + 试点 #11 Vuepress2）
- 新增 `helpPageIdKey.ts`（`InjectionKey<ComputedRef<string>>`）；`V2PlatformConfigBridge.vue` 抽出 `helpPageId` 并 `provide`，`HelpButton` 改用它（消除第二处拼接）。
- `FieldGuide.vue`：`pageId` 改为可选 + `inject` 兜底；组件根改 fragment（无 tip 时不留空 div）；`el-tooltip` 加 `:teleported="false"`；图标带 `data-syp-field-guide="<field>"` 便于宿主与测试断言。
- 挂载：`CommonBlogSetting.vue` 12 处（home/apiUrl/username/三条鉴权行同键 `password`/previewUrl/pageType/`blogid`/picbedService/middlewareUrl/两处 corsAnywhereUrl），`CommonGithubSetting.vue` 12 处（含 `yamlLinkEnabled` 随能力位、`defaultMsg`/`author`/`email`/`site` 高级四项、`imageStorePath`/`imageLinkPath`）；检索关键词行（绑 `formData.ksKeyword`）与验证行按规则不挂。
- 试点配置 `github-vuepress2.ts` 补 8 个缺项 tip；`defaultMsg`/`author`/`email` 语义按 `zhi-github-middleware` 与 `commonGithubApiAdaptor.ts:39-41` 写（commit message 与提交作者/邮箱），`site` 对 Vuepress2 明确「不写入文章 Front Matter」，`blogid` 说明只读并随 `defaultPath` 同步。
- 质量：`pnpm vitest run` 65 文件 / 309 测试通过；`pnpm build:v2` 通过。
- 宿主证据（9222 / test 工作空间，`github_Vuepress2-ig1w6`）：20 行全部出现 ⓘ（16 基础 + 4 折叠高级），字段均已填值仍可见；弹层 `panel.contains(popper)=true`（未传送 body），逐行滚入视区后完整可见无裁切；抽样 5 行 tip 文案与 Vuepress2 一致；HelpPanel 未受影响（专属 summary 正常、无回退提示）。截图 `tmp/field-guide-vuepress2-token-tip.png`。

### 错误
- 首次宿主复核 `iconCount=0`：页面仍跑旧 bundle → 重载 Electron 页面后正常（改 `dist-v2` 后必须 reload 才生效）。

### 用户看图验收：不通过（`a77d5d4c` 试点）
1. svg 样式错误看不清；2. tips 必须与控件同行，禁止换行。→ 停在步骤 A 修标准，不进入任何新平台。

### 返工（同一天）
- 同行：`FieldGuide` 由兄弟节点改为**包裹控件**（`el-form-item__content` 默认 `flex-wrap:wrap` + 控件宽 100% 是换行根因），新增 `inline`（开关/单选组紧贴控件）与 `tall`（文本域贴首行）两个变体；`CommonBlogSetting` 13 处、`CommonGithubSetting` 13 处全部改成包裹式。
- 图标：删掉手写 path，改用官方 `InfoFilled`（该版本无描边版 `Information`），16px、`--el-text-color-regular`、hover 主色、`cursor: help`。
- 复测（9222 宿主，`github_Vuepress2-ig1w6`，已展开折叠高级）：20 行 `allSameLine=true`、`bad=[]`、`gap=4px`、`svgPx=16x16`、`color=rgb(96,98,102)`；抽样 6 行（home/password/pageType/picbedService/dynYamlCfg/blogid）tip 文案均为该平台专属，`tipInPanel=true`、`tipVisible=true`。
- 质量：`pnpm vitest run` 65 文件 / 309 测试通过；`pnpm build:v2` 通过。
- 证据截图：`tmp/field-guide-vuepress2-fixed-top.png`、`tmp/field-guide-vuepress2-fixed-bottom.png`。

### 下一步
**再次停下等用户对步骤 A 的验收**（呈现标准已按两点意见改定）。通过后按 B（#6 Hexo → #7 Hugo → #8 Jekyll → #9 Quartz → #10 Vuepress）逐站推进，每站一停。


## 五问重启检查
| 问题 | 答案 |
|------|------|
| 我在哪里？ | 阶段 0（去风险），计划 `.planning/2026-09-07-add-field-guide-tips/`，active_plan 指向本目录 |
| 我要去哪里？ | 阶段 1 铺开共用表单挂载 → 阶段 2 键校准与 22 站回填 → 阶段 3 文案单一来源 → 阶段 4 宿主逐族核验 → 阶段 5 SOP/checklist 固化与提交 |
| 目标是什么？ | `fields` 指引在配置页真实渲染、已验证 22 站全部回填、该点成为后续每站必过项 |
| 我学到了什么？ | 见 findings.md（两套命名空间、ⓘ 挂控件列尾部、pageId 复用 bridge 的 provide 先例、弹层须宿主定稿） |
| 我做了什么？ | 立项 + 取证 + 阶段计划；上一环节两项修复已提交推送（`94dc6d26`…`c88f930b`） |

---
*每完成一个阶段或遇到错误时更新此文件*
