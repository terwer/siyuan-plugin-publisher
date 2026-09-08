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

### 用户第二轮：功能通过（「可以了」），只要视觉再淡一点
- 已按 `HelpButton` 的弱化先例定稿：14px + `--el-text-color-placeholder` + hover 主色 + tooltip `show-after 150ms`；宿主实测 `14x14`/`rgb(168,171,178)`、弹层正常。证据 `tmp/field-guide-vuepress2-quiet.png`。
- 呈现标准就此冻结，作为后续 21 站的统一口径；更强档（仅悬停才淡入）作为备选未启用。


### 用户第三轮：标准定稿 + 收工
- 「保持现在的全行 + 安静档」→ 呈现标准冻结，写入 `task_plan.md`「呈现标准」节与 change `tasks.md` 2.7，作为后续 21 站统一口径；两个更强档（悬停才淡入 / 只给易错字段挂）明确不采用。
- 指示「同步 hexo 的计划，不开始」→ 已查实并写入 `task_plan.md`「下一站开工清单：#6 Hexo」：现有 12 键无需改名、需补 9 键（`yamlLinkEnabled`/`blogid`/`imageStorePath`/`imageLinkPath`/`dynYamlCfg`/高级四项），每条文案依据都指到具体代码行；预期宿主 17→21 个 ⓘ。**未写任何代码、未构建、未开新平台。**
- 目标保持 paused 状态（等用户回来点头再 resume 开 #6）。

## 会话：2026-09-08（步骤 B：#6 Hexo）

### 环境
- 用户「拉取最新代码并继续」：`git pull --ff-only` 已是最新（本地 4 个提交即 HEAD），目标 resume 到 rev 4。
- 思源未运行（9222 与内核端口均无监听）→ 自行以 `C:\Program Files\SiYuan\SiYuan.exe --workspace="D:\Users\Administrator\Documents\mydocs\SiyuanWorkspace\test" --remote-debugging-port=9222` 拉起，3 秒后 9222 就绪；本次内核端口 **62677**（每次随机，勿记死）。
- 工作区核实：`test/data/plugins/siyuan-plugin-publisher -> .../siyuan-plugin-publisher/dist-v2`；`public` 工作区按规则不用于验证。

### 执行
- 按上轮清单改 `src/helpConfigs/pages/platform-config/common-github-hexo.ts`：新增 9 个 `fields` 键（`yamlLinkEnabled`/`blogid`/`imageStorePath`/`imageLinkPath`/`dynYamlCfg`/`defaultMsg`/`author`/`email`/`site`），并给 `previewPostUrl` 补「开启 YAML永久链接时 permalink 也按此规则生成」。
- 文案依据：`hexoYamlConverterAdaptor.ts:66-91`（`yamlLinkEnabled` → `permalink`，取自 `previewPostUrl`，支持 `[postid]/[yyyy]/[MM]/[dd]/[cats]`）、`:95-104`（`dynYamlCfg` 最后合并、同名覆盖）、`hexoConfig.ts:31/34/38/39/47/48`、`commonGithubConfig.ts:117`（默认 Bundled → 图片两行会渲染）。
- 质量：`pnpm vitest run` 65 文件 / 309 测试通过；`pnpm build:v2` 通过。
- 宿主复核（`github_Hexo`，无实例后缀）：基础 **17** 个 ⓘ、展开高级 **21** 个，与预测一致；`notSameLine=[]`；抽样 5 行（`yamlLinkEnabled`/`imageStorePath`/`site`/`blogid`/`dynYamlCfg`）tip 均为 Hexo 专属、`inPanel=true`、`fullyVisible=true`、与控件间距 4px（开关行 inline 紧贴）。证据 `tmp/field-guide-hexo-yamllink.png`。

### 停下等验收
- 未动其他平台、未加回归尺、未改 SOP/checklist。

## 会话：2026-09-08（#6 Hexo 验收通过 → #7 Hugo）

### 执行
- `github-hugo.ts` 补 9 键（同 Hexo 组），并**纠正一处错误表述**：Hugo 的 `yamlLinkEnabled` 写的是 `url` 且固定 `/post/<文章别名>.html`，**不读「文章预览规则」**（`hugoYamlConverterAdaptor.ts:37-38`）——原 `previewPostUrl` tip、faq、以及 `docs/draft/platforms/github-hugo.md` 第 33/46 行都写成「与预览规则一致」，已四处一并改准。
- `imageLinkPath` 文案按 `commonGithubApiAdaptor.ts:315-343` 的三分支口径写（Hugo 的 `images` → 引用为 `/images/<名>` 绝对路径；`./`、`../` 前缀则保留相对）。
- 质量：65 文件 / 309 测试通过；`build:v2` 通过。

### 宿主复核（Hugo）
- test 工作区**没有 Hugo 账号**（早前验证的临时账号已不在）→ 走「添加账号 → GITHUB → Hugo」在当前窗口打开配置页做渲染核验；**未点保存/验证**，返回列表后确认 `github_Hugo` 未落库，无需清理。
- 基础 **17** 个 ⓘ、展开高级 **21** 个；`notSameLine=[]`；抽样 tip 均为 Hugo 专属（`yamlLinkEnabled` 明确「固定值」、`blogid` 为 `content/post`、`imageLinkPath` 为 `static/images`→`/images/…`、`site` 为「不写作者字段」），`inPanel=true`、`fullyVisible=true`。
- 量测踩坑：一次探测把上一行未消失的弹层错记给 `site`；改为「先确认无可见 popper 再 hover」后复测通过（口径已写进 findings）。
- 证据：`tmp/field-guide-hugo-yamllink.png`。

### 停下等验收
- 未动 #8 Jekyll 及之后平台。

## 五问重启检查
| 问题 | 答案 |
|------|------|
| 我在哪里？ | 步骤 B：#6 Hexo ✅ 已验收，#7 Hugo 已完成并停下等验收 |
| 我要去哪里？ | 验收后：#8 Jekyll → #9 Quartz → #10 Vuepress → C 组 Common 族（含 `token`→`password`、`knowledgeSpace`→`blogid`）→ D 组 Cookie 族（含 `cookie`→`password`）→ E 组 MetaWeblog/WordPress/LocalSystem → F 收尾（两把回归尺 + SOP §3 + checklist 回写） |
| 目标是什么？ | `fields` 指引在配置页真实渲染、已验证 22 站全部回填、该点成为后续每站必过项 |
| 我学到了什么？ | 每站文案必须回到转换器读代码（Hexo 读 `previewPostUrl`、Hugo 硬编码 `url`，同族却不同）；探测 tip 前要等上一个弹层消失；缺账号可用「添加账号」开空表单核验且不落库 |
| 我做了什么？ | 试点三轮 + 标准冻结（`a77d5d4c`…`acfe4677`）→ Hexo（`bf11170e`）→ Hugo（本轮，待提交），全部推送、工作树干净 |

---
*每完成一个阶段或遇到错误时更新此文件*
