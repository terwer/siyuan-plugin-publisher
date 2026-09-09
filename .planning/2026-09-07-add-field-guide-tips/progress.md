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

## 会话：2026-09-09（#7 Hugo 放行 → #8 Jekyll）

### 执行
- `github-jekyll.ts` 补同 9 键，并**再纠正两处错误表述**（都在 help + `docs/draft/platforms/github-jekyll.md` 同步改）：
  1. `permalink` 是**无条件写入**（`jekyllYamlConverterAdaptor.ts:68`），`yamlLinkEnabled` 只决定取值来源（开启→按「文章预览规则」且仅 `[postid]` 生效，日期/分类占位符那段是注释代码；关闭→固定 `/post/<文章别名>.html`）。原文说「关闭时交给 Jekyll 默认 permalink」不成立。
  2. `dynYamlCfg` **留空**才自动写 `layout: post` + `published: true`；**一旦填写就只合并用户键**，需自带这两项（`:87-97`）。
- 质量：65 文件 / 309 测试通过；`build:v2` 通过。

### 宿主与工具
- 思源未运行 → 重新以 `--workspace=<test> --remote-debugging-port=9222` 拉起（内核端口本次 59072）。
- **chrome-devtools MCP 已从本会话工具表消失**（宿主关闭后掉线；恢复需重启 DSH Web，会打断会话，未擅自做）→ 改用 PowerShell `ClientWebSocket` 直连 CDP 的自研通道：`tmp/cdp-eval.ps1`（`Runtime.evaluate`）+ `tmp/cdp-shot.ps1`（`Page.captureScreenshot`），响应路径为 `$result.result.result.value`。
- 宿主实测（真实账号 `github_Jekyll`，值已填）：标题 Jekyll、基础 **17** ⓘ、展开高级 **21** ⓘ、`notSameLine=[]`；hover 差集口径复核 4 条 tip 为 Jekyll 专属、`inPanel=true`、`fullyVisible=true`；截图 `tmp/field-guide-jekyll-yamllink.png`（弹层内容「Jekyll 始终把 permalink 写入 Front Matter…」已在页面内确认可见）。
- 量测口径修正：先前写的「等可见 popper 归零再 hover」**不可靠**（EP 隐藏后 `getComputedStyle` 仍判可见，弹层累积 1→2→3，导致 `site` 一度错读 `blogid` 文案）。改为 hover 前后**文本差集**，并另用 `helpRegistry.getField` 在 vitest 里把 **21 个键逐条**核验全绿（临时 spec 跑完即删，未入库）。

### 停下等验收
- 未动 #9 Quartz 及之后平台。

### 用户授权自行重启（本会话末尾）
- 「你自己重启并继续验证」→ 已把恢复步骤写进 `task_plan.md`「重启后第一步」；用 WMI `Win32_Process.Create` 以**脱离本进程树**的方式调度 `restart-dsh-web.ps1`（延时约 40 秒），避免被 DSH 一起带走导致重启不发生。
- 重启会中断本会话；SiYuan（9222）与仓库状态不受影响，`fbbd9ebf` 已推送、工作树干净。
- 若重启后 MCP 仍不可用：继续用 `tmp/cdp-eval.ps1` / `tmp/cdp-shot.ps1` 的 CDP 直连通道核验，不必再卡住。

## 会话：2026-09-09（重启恢复 → #9 Quartz，含一次跨站修正）

### 恢复
- 用户「已重启」→ `get_goal` 后 `update_goal resume`（rev 10、active）；`list_pages` 确认 chrome-devtools MCP 已恢复；9222 与 SiYuan 未受影响（内核端口 59072）。
- 按用户「重启并继续验证」的口径把 #8 Jekyll 记为 ✅ 放行（台账已注明依据）。

### 执行（#9 Quartz）
- `github-quartz.ts` 补同 9 键 + 改准 `previewPostUrl`。Quartz 与同族两站都不同：`permalink` **仅开关开启时写**（`quartzYamlConverterAdaptor.ts:59-86`），且 `[postid]/[yyyy]/[MM]/[mm]/[dd]/[cats]` 全部生效；`dynYamlCfg` 留空写的是 `enableToc` + `enableBackLinks`（`:89-98`），不是 Jekyll 的 `layout`/`published` → 证实「dynYamlCfg 的实写字段必须逐站读」。
- **跨站修正**：查实 `allowKnowledgeSpaceChange` 只被 `SinglePublishDoPublish.vue:447` 消费，设置页发布目录 `el-select` 从不禁用（宿主实测 `is-disabled=false`、`input.disabled=false`）→ 前五站 `blogid` 的「只读」表述统一改准（Vuepress2/Hexo/Hugo/Jekyll/Quartz），并在 Jekyll 上复测新文案渲染正确。
- 质量：65 文件 / 309 测试通过；`build:v2` 通过。

### 宿主复核
- `github_Quartz` 账号是「未启用」，行上是「去授权」不是「管理」→ 首次定位误开了 `fs_LocalSystem` 表单（已记为操作要点）。改走「添加账号 → Quartz 卡片」开临时表单：标题 Quartz、基础 **17** ⓘ、展开 **21** ⓘ、`notSameLine=[]`；**未保存**，返回列表后账号数仍 32、`github_Quartz` 仍「未启用」，未落库。
- tip 复核 5 条（`yamlLinkEnabled`/`dynYamlCfg`/`blogid`/`imageLinkPath`/`site`）全部 `visible:1 / added:1`、文案为 Quartz 专属、`inPanel` + `fullyVisible`。截图 `tmp/field-guide-quartz-dynyaml.png`。
- 口径补充：`getComputedStyle` 过滤会把 EP 弹层全滤掉（`added:0`），要用 `style.display !== 'none'`；归属靠 hover 前后文本差集。

### 停下等验收
- 未动 #10 Vuepress 及之后平台。

## 会话：2026-09-09（#9 Quartz 放行 → #10 Vuepress，GitHub 族收尾）

### 执行
- `github-vuepress.ts` 补同 9 键 + 改准 `previewPostUrl`；文档草稿 `github-vuepress.md` L34 的「permalink 与文章预览规则一致」改准，并补全该站 front matter 实际字段清单。
- 该站两处**族内独有**事实（都来自 `vuepressYamlConverterAdaptor.ts`）：
  1. `:88-92` `permalink` 仅当 `yamlLinkEnabled && wp_slug` 时写，取值**硬编码** `/post/<文章别名>.html`。
  2. `:94-114` **只有 Vuepress 把 `author` 写进文章头**（`{ name: cfg.author ?? "terwer", link: cfg.site }`，`site` 留空回退 `home + "/" + username`）→ `author`/`site` 的 tip 在本站写「影响文章 Front Matter」，其余五站写「仅作 commit/账号信息」。
  3. `:121-131` `dynYamlCfg` 留空不补任何字段，且合并晚于 `author` → 同名键会覆盖 `author`（tip 已写明）。
- 质量：65 文件 / 309 测试通过；`build:v2` 通过。

### 宿主复核（真实账号 `github_Vuepress`，无需临时开表单）
- 精确匹配 key 元素（避免 `github_Vuepress2` 干扰）→ 行内有「管理」，直接进：标题 Vuepress、基础 **17** ⓘ、展开高级 **21** ⓘ、`notSameLine=[]`。
- 6 条 tip 复核（`author`/`site`/`yamlLinkEnabled`/`dynYamlCfg`/`blogid`/`imageLinkPath`）全部 `visible:1 / added:1`、文案为 Vuepress 专属、`inPanel` + `fullyVisible`。截图 `tmp/field-guide-vuepress-author-site.png`。
- **GitHub 族 6 站（#6 Hexo、#7 Hugo、#8 Jekyll、#9 Quartz、#10 Vuepress、#11 Vuepress2）全部回填并逐站过宿主**；族内差异与方法固化进 `task_plan.md`，#6 Hexo 的旧开工清单已替换为 #1 语雀的「先查实再动笔」清单。

### 停下等验收
- 未动 C 组（Common 族 5 站）及之后平台。

## 会话：2026-09-09（#10 Vuepress 放行 → C 组 #1 语雀）

### 执行
- `common-yuque.ts`：`token`→`password`、`knowledgeSpace`→`blogid`（键=配置属性名），补 `previewUrl`/`pageType`，`password` tip 补上「需对目标知识库有写权限 + API 发布要求专业会员」。
- **改准一处事实错误**：原 tip 与 `docs/draft/platforms/common-yuque.md` L26 写「语雀使用内置图片链路」，实际 `useYuqueApi.ts:68-69` 是 `picgoPicbedSupported=true`、`bundledPicbedSupported=false` → 只有「不使用 / PicGo」两项，无内置图床；`BlogConfig` 默认 `picbedService=None`。tip 与草稿都按实测重写。
- `registry.spec.ts:103-104` 随改名同步（`'token'` → `'password'`）。
- `YuqueSetting.vue` 查实**无平台专有行**（只有会员提示 + 共用表单）→ 本站零挂载，共用层已覆盖。
- 质量：65 文件 / 309 测试通过；`build:v2` 通过。

### 宿主复核
- 8 行全部出现 ⓘ 且 `notSameLine=[]`：`home/apiUrl/username/password/previewUrl/pageType/blogid/picbedService`；鉴权行标签是「鉴权token」但键解析为 `password` ✓，知识库行标签「知识库」解析为 `blogid` ✓。
- 5 条 tip `added:1` 文案准确，`password` 的「前往生成 Token」链接在弹层内正常渲染；图床选项实测 `["不使用","PicGo 强烈推荐"]`。截图 `tmp/field-guide-yuque-picbed.png`。
- **踩到并纠正的副作用**：语雀走「添加账号 → 卡片」会**直接落库**一个空账号（`common_Yuque-1ma2ix`，账号数 32→33），与 GitHub 族（Hugo/Quartz 不落库）不同 → 已按行内「删除 → 确认」删回 32 行、只剩原 `common_Yuque`。规矩写进 findings。

### 停下等验收
- 未动 #2 Notion 及之后平台。

## 会话：2026-09-09（#1 语雀 放行 → C 组 #2 Notion）

### 执行
- `common-notion.ts`：`token`→`password`、`knowledgeSpace`→`blogid`；`picbedService` tip 改准（只有 不使用/PicGo，补「选不使用则按原地址引用，需公网可访问」）；`blogid` 说明「文章作为所选根页面的子页面创建、已发布不可换根页面」；`previewUrl`/`pageType` 措辞收敛为契约描述。文档草稿 `common-notion.md` 的 根页面/图床 两行同步。
- `NotionSetting.vue` 查实无专有行 → 零挂载。
- 质量：65 文件 / 309 测试通过；`build:v2` 通过。

### 宿主复核（真实账号 `common_Notion`，两个 Notion 账号都是未启用态）
- 澄清一个按钮语义：`V2AccountList.vue:106-108` 的「管理 / 去授权」是**同一个 `configure` 按钮**，只是文案按 `isAuth` 变 → 未授权账号也能直接进配置页，**不需要**启用账号或新建账号（修正上一站记下的判断，也更安全）。
- 结果：标题 Notion、**7** 个 ⓘ、`notSameLine=[]`；唯一无 ⓘ 的是「搜索关键词」行（`cateSearchEnabled=true` 会渲染，但绑 `formData.ksKeyword` 非配置属性，按 change 2.5 规则不挂，属标准内显式例外）。
- 5 条 tip `added:1` 文案准确（含「前往创建 Token」链接渲染）；图床选项实测 `["不使用","PicGo 强烈推荐"]`；账号数核验前后都是 **32**（未误建）。截图 `tmp/field-guide-notion-rootpage.png`。

### 停下等验收
- 未动 #3 Halo 及之后平台。

## 五问重启检查
| 问题 | 答案 |
|------|------|
| 我在哪里？ | 步骤 C 进行中：#1 语雀 ✅ 放行、#2 Notion 已完成待验收（GitHub 族 6 站已全通过） |
| 我要去哪里？ | 验收后：#3 Halo → #4 Telegraph → #5 Confluence → D 组 Cookie 族 8 站（`cookie`→`password`、`knowledgeSpace`→`blogid`）→ E 组 3 站 → F 收尾（两把回归尺 + SOP §3 + checklist 回写） |
| 目标是什么？ | `fields` 指引在配置页真实渲染、已验证 22 站全部回填、该点成为后续每站必过项 |
| 我学到了什么？ | 「管理/去授权」是同一个 configure 按钮，未授权账号也能进配置页（别再新建账号冒险）；行标签 ≠ 键名，一切以绑定的配置属性为准；「搜索关键词」这类非属性行是标准内的不挂例外，要挂得先改标准 |
| 我做了什么？ | 试点三轮 + 标准冻结 → Hexo `bf11170e` → Hugo `d6ba322a` → Jekyll `fbbd9ebf` → 重启续航 `92234b1f` → Quartz `894ddb34` → Vuepress `c3f78aa2` → 语雀 `6f745321` → Notion（本轮，待提交） |

---
*每完成一个阶段或遇到错误时更新此文件*
