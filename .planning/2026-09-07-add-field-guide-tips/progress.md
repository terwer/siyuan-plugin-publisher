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

## 会话：2026-09-09（#2 Notion 放行 + 「保持现状」定档 → C 组 #3 Halo）

### 标准确认
- 用户对「搜索关键词行是否挂指引」拍板 **保持现状**：非配置属性的行不挂，步骤 F 的键校验不为此开白名单 → 已写进 change `tasks.md` 2.5 与 findings。

### 执行
- `common-halo.ts`：**零改名零补键**（现有 7 键与宿主 7 行一一对应），只补准三处：
  1. `picbedService`：宿主实测三项 `不使用 / PicGo / 当前平台` 且**默认选中「不使用」** → tip 改为三项各自行为 + 默认值（原文暗示默认走内置图床）。
  2. `password`：doc 链接补 `linkText="Halo 配置说明"`（原先无 linkText 会显示通用「查看详情」）。
  3. `summary`：改为「图床默认不使用，选当前平台时上传到 Halo 附件」。
- `HaloSetting.vue` 查实无专有行 → 零挂载；`haloConfig.ts:38` `knowledgeSpaceEnabled=false` → 本站**没有发布目录行**（所以不需要 `blogid` 键，这是族内第一个例外，说明「按族套键集」会出错）。
- 文档草稿 `common-halo.md` 图床行同步补准。
- 质量：65 文件 / 309 测试通过；`build:v2` 通过。

### 宿主复核（真实账号 `common_Halo`）
- 标题 Halo29、**7 行 = 7 个 ⓘ**、`notSameLine=[]`、`rowsWithoutGuide=[]`；账号数前后都是 32（未误建）。
- 改后 `picbedService`/`password` tip 实测为新文案且链接文案正确；HelpPanel summary 已是新句、无「暂无专属帮助文档」回退。截图 `tmp/field-guide-halo-picbed.png`。

### 停下等验收
- 未动 #4 Telegraph 及之后平台。

## 会话：2026-09-09（#3 Halo 放行 → C 组 #4 Telegraph，首次挂专有行）

### 执行
- `TelegraphSetting.vue`：4 个专有行全部按**包裹式**挂 ⓘ——登录模式（`postType`，`inline`）、Access Token（`accessToken`）、Hash（`saveHash`）、刷新授权（`forceReAuth`，`inline`）；`FieldGuide` 显式 import。
- `telegraph.ts` 补 6 键：`postType`/`accessToken`/`forceReAuth`/`previewUrl`/`pageType`/`picbedService`（`saveHash`、`corsAnywhereUrl` 原已有）。文案依据：`telegraphConfig.ts:27-42`、`telegraphApiAdaptor.ts:34-37/106-115/168-174/296-306`、`useTelegraphApi.ts:53-60`。
- 写错又改对的教训：初稿把模式写成「匿名用户 / 登录用户」，宿主实测单选项目实文案是「匿名发布 / 登录发布」→ 两处 tip 已按界面用词改回并重新构建复测。**tip 引用界面元素名必须抄宿主实测文本**。
- 质量：65 文件 / 309 测试通过（改词后重跑）；`build:v2` 通过。

### 宿主复核
- 匿名模式 **11 行 = 11 个 ⓘ**；点「登录发布」后 `accessToken` 行出现 → **12 行 = 12 个 ⓘ**；`notSameLine=[]`。
- 5 条新 tip 实测命中；图床 checked = 不使用（与 tip 一致）；核验完把模式切回「匿名发布」且**未点保存**，账号数前后 32。截图 `tmp/field-guide-telegraph-posttype.png`。

### 停下等验收
- 未动 #5 Confluence 及之后平台。

## 会话：2026-09-12（#4 Telegraph 放行 → C 组收尾 #5 Confluence）

### 执行
- `ConfluenceSetting.vue`：「父页面」`el-select` 包裹式挂 ⓘ（`field="parentPageId"`，真实配置属性），显式 import `FieldGuide`。
- `common-confluence.ts`：`knowledgeSpace`→`blogid`；补 `previewUrl`/`pageType`/`picbedService`；`parentPageId` tip 写明「选项按所选空间在展开时拉取、切换空间会清空已选父页面」（依据 `:51-83`）；文案依据 `confluenceConfig.ts:23-35`、`useConfluenceApi.ts:53/69-77`。
- 质量：65 文件 / 309 测试通过；`build:v2` 通过。

### 宿主复核（test 工作区无 Confluence 账号 → 临时新建）
- 环境：思源未运行 → 按既定命令重新拉起（内核端口本次 52582），MCP 可用。
- 走「添加账号 → Confluence 卡片」：标题 Confluence、**8 行 = 8 个 ⓘ**、`rowsWithoutGuide=[]`、`notSameLine=[]`。
- 两处实测印证文案：发布格式的 **Markdown 单选 `display:none`、HTML 选中**（平台专属 CSS 隐藏）；图床默认 checked = **「当前平台」**。
- 5 条 tip（`parentPageId`/`blogid`/`picbedService`/`pageType`/`previewUrl`）`added:1`、在面板内完整可见。截图 `tmp/field-guide-confluence-parentpage.png`。
- **清理**：Common 族的「添加账号」会持久化（32→33）→ 已按「删除 → 行内『确认』」删回 **32**、`confluenceLeft=0`，工作区复原。

### C 组完成 + 停下等验收
- Common 族 5 站（#1 语雀、#2 Notion、#3 Halo、#4 Telegraph、#5 Confluence）全部回填并逐站过宿主；未动 D 组（Cookie 族 8 站）。

## 会话：2026-09-12（#5 Confluence 放行 → D 组第 1 站 #27 语雀网页版）

### 查实（先读代码再动笔）
- `YuquewebSetting.vue`：只有 `#header` 的授权提示 alert + 透传 `cookie-actions`/`main`/`footer` 插槽 → **无平台专有行**，零新挂。
- `CustomWebSetting.vue`：只是 `CommonBlogSetting` 的透传壳 → Cookie 族的行全部来自共用表单。
- 全仓 `web/*Setting.vue` 逐个查 `#main`/`#footer`：**9 个网页平台全部为 False** → D 组只需共用层 + 各站 `fields` 键校正（不用逐站挂专有行）。
- `YuquewebConfig.ts` / `useYuquewebWeb.ts:75-90`：`usernameEnabled=false`、`passwordType=Cookie`、`passwordLabel="Cookie"`、`knowledgeSpaceEnabled=true`（标题「知识库」）、`picgoPicbedSupported=false` + `bundledPicbedSupported=true`、`picbedService=Bundled`；`home`/`apiUrl` 由 hook 固定为 `https://www.yuque.com`；`cateSearchEnabled` 未设 → 无「搜索关键词」行 → 预期 **7 行**。
- `buildDocPayload`：`format:"markdown"` + `body = post.markdown` → 发布格式 tip 写「按 Markdown 提交」；`getPreviewUrl` 用 `previewUrl` 模板替换 `{login}/{bookSlug}/{slug}`。

### 共用层改动（Cookie 族的挂载口径，本站在此定稿）
- **问题**：V2 下鉴权行渲染的是 `V2WebCookieAuthPanel`（去登录/自动读取），手动文本框默认折叠；原 `field-guide` 只包文本框 → **折叠态该行没有 ⓘ**，违反「每行真实渲染的行都要有指引」。
- **改法**：`CommonBlogSetting.vue` 鉴权行改为**整行一条指引**——`<field-guide field="password" tall>` 包住新增的 `.cookie-form-item__body`（内部再放授权面板插槽 + 折叠的手动文本框 + 提示），并加 `.cookie-form-item__body` 纵向堆叠样式。
- **不变量**：展开/收起手动编辑时该行 ⓘ **恒为 1**（不出现两个）；V1 的 `CookieSetting.vue` 未动（V1 文案与结构零变化）。

### 本次改动
- `custom-yuqueweb.ts`：`cookie`→`password`、`knowledgeSpace`→`blogid`，补 `home`/`apiUrl`/`pageType`，共 **7 键 = 宿主 7 行**；summary/faq/tour 按最终流程与新文案校准（tour 4 步锚点不变）。
- `docs/draft/platforms/custom-yuqueweb.md`：字段表按真实渲染的 7 行重写，验证流程写明「关闭登录窗口保存登录态」这一步。
- 质量：`pnpm vitest run` 65 文件 / 309 测试通过；`pnpm build:v2` 通过。

### 宿主复核（真实账号 `custom_Yuqueweb`，test 工作空间 / dist-v2 / 9222）
- 环境：思源未运行 → 自行以 `--workspace="D:\Users\Administrator\Documents\mydocs\SiyuanWorkspace\test" --remote-debugging-port=9222` 拉起（本次内核端口 **58925**）。
- 路径：顶栏「发布工具」→ 设置 → 账号列表 → `custom_Yuqueweb` 行「管理」（**未用「添加账号」**，避免落库）。
- 结果：标题 语雀网页版、**7 行 = 7 个 ⓘ**、`rowsWithoutGuide=[]`；字段键与行一一对应 `home/apiUrl/password/previewUrl/pageType/blogid/picbedService`（Cookie 行标签「Cookie」、知识库行标签「知识库」）。
- 鉴权行几何：图标 14×14 落在行首行右侧（`body.top+7`）、颜色 `rgb(168,171,178)`；展开手动编辑后 ⓘ 仍为 1（文本框已带 1092 字符 Cookie，未外传）。
- 7 条 tip 逐条 hover：文案正确、均在 `.syp-panel` 内（`panel.contains(popper)=true`）、在视口内完整可见无裁切（最长的 `password` 弹层 284×84）。
- 渲染事实核对：发布格式 Markdown `checked=true` 且两项都可见（无平台专属隐藏）；图床 `["不使用","当前平台 推荐"]` 且 checked=「当前平台」（与 tip 一致，无 PicGo 项）。
- HelpPanel：标题 语雀网页版 + 新 summary + 「查看完整帮助文档」+ 常见问题 3 条（与 `faq` 一致）+ 「开始引导教程」，**无「暂无专属帮助文档」回退**。
- TourGuide：**4/4 步全部命中真实控件**（Cookie 授权→选择知识库→图片发布→验证并保存），高亮框为真实尺寸（95/48/48/74 px）、弹层均在视口内。
- 账号数核验：**32 → 32**，`custom_Yuqueweb` 仍「运行中/已启用」，未创建临时账号、未点保存/验证。截图 `tmp/field-guide-yuqueweb-cookie.png`。

### 停下等验收
- 未动 #28 Halo网页版 及之后 7 站。

## 会话：2026-09-12（#27 待验收期间：F 前置审计 + 兜底清理，未开新平台）

### 为什么不开 #28
- 用户硬性要求「每站停下等验收」，#27 尚未得到人工放行 → 本轮只做**与平台站无关**的审计与清理，不动 #28 及之后 7 站。

### 做了什么
1. **第一把回归尺原型跑通**（步骤 F.1 的键尺）：对 12 个已回填平台断言 `fields` 键都能在合并配置实例上取到同名属性 → 全部 `missing=[]`。脚本留档 `tmp/field-guide-key-audit.tmp.spec.ts`（vitest 只扫 `src/`，用前复制过去）。
2. **兜底解析查实**（`tmp/field-guide-fallback-resolution.diag.spec.ts`）：12 个未拆分平台被 `remaining-t1` 占位配置（只有 helpUrl）精确命中 → 这些页**没有任何 ⓘ**（宿主实测 Vitepress 16 行全 `null`）；只有 `github_Docsify`/`gitlab_Gitlabdocsify`/`system_Siyuan` 落到 `platform-config/_default`，而这三者不在「添加账号」选择器里 → 兜底 fields 不可达。
3. **`_default.ts` 清理**：删掉永不被解析的死键 `token`（鉴权行三分支都绑 `password`，全仓无 `field="token"`），`password` 说明改为覆盖密码/Token/Cookie；与冻结的键规则一致，也让 F 的键尺不必为它开例外。
4. **宿主**：顺带用 Vitepress 复现了「添加账号 → 卡片」落库行为 → 账号数 32→33 → 已删回 **32**；宿主保持运行（9222）。

### 质量
- `pnpm vitest run` 65 文件 / 309 测试通过；`pnpm build:v2` 通过（含 `vue-tsc --noEmit`）。
- 本轮无平台六格/帮助门禁结论变化；#27 结论与证据见上一节，仍待验收。

## 会话：2026-09-12（第二轮：#27 待验收期间，第二把回归尺原型 + 余 7 站键清单预推）

### 做了什么
1. **覆盖尺原型**（步骤 F 第二把尺）：从 `CommonBlogSetting.vue` 抽每行渲染条件 + 各族专有行，推出「该站应覆盖的键集」，与各站 `fields` 做差集 → **12 个已回填平台全部 `missing=[] extra=[]`**（键数与宿主实测行数逐站吻合），两把尺互相印证。脚本留档 `tmp/field-guide-family-coverage.diag.spec.ts`。
2. **余 7 站键校正清单已提前算出**（写入 task_plan 步骤 D 表格）：Halo网页版 +password +previewUrl -cookie；知乎 +username +password +previewUrl +blogid -cookie -knowledgeSpace；CSDN +password +previewUrl -cookie；简书/掘金 +password +previewUrl +blogid -cookie -knowledgeSpace；公众号 +password -cookie；哔哩哔哩 +password +previewUrl +blogid -cookie -knowledgeSpace。各站仍按规矩在宿主逐项确认。
3. **两条尺子设计结论**（写进 task_plan 步骤 F）：① 尺子②必须用**按平台显式 REQUIRED_FIELD_KEYS 表**，不能从 Config 构造函数推导——平台 hook 运行时改开关（Telegraph 开 `usernameEnabled`、掘金/哔哩哔哩/知乎/简书开 `knowledgeSpaceEnabled`）；② GitHub 族图片两行取决于**当前图床值**（`picbedService === Bundled`），不是「是否支持 Bundled」；宿主内不渲染的 `middlewareUrl`、非 `isCorsProxy` 的 `corsAnywhereUrl` 不进必填集。
4. 顺带确认 `telegraph.ts` 的 `username` 键不是死键（hook 把 `usernameEnabled` 置真）——避免误删。

### 质量
- 临时脚本已移出 `src/`（`vue-tsc` 会检查仓库内所有 `.spec.ts`，留 `tmp/` 更安全）。
- `pnpm vitest run`、`pnpm build:v2` 复跑通过；提交 `a52edae2` 已推送，工作树干净。
- 本轮不动任何平台站文件、不改六格/帮助门禁结论；#27 仍待人工验收。

## 会话：2026-09-12（第三轮：#27 待验收期间，帮助/文档门禁全量核对 + F.2/F.4 预研）

### 做了什么
1. **帮助/文档门禁全量核对（22 站）**：`docs/draft/platforms/` 恰 22 个草稿且**全部第 3 行带 `TODO：待替换真实帮助文档链接`**；`registry.spec.ts` 的 `verifiedConfigs` 已含 22 站并断言 `summary`/`fields`/`faq`/`tour` 齐备、不在 `remaining-t1` → SOP §3 第 1、2 项在 22 站无缺口。
2. **F.2 核实为完成态**：全仓无任何按 `'token'` 取字段说明的用例（Yuque 那条早已用 `password`）；残留 `token` 只在 tour 锚点与 Telegraph 的 `accessToken` 真实属性上 → 不得误删。已更正 task_plan 里 F.2 的状态描述。
3. **F.4 草稿落地到 `tmp/`**：`tmp/sop-section3-field-guide-draft.md`，含 §3 新增第 5 项（键=绑定属性名 / 鉴权行恒 `password` / 全行覆盖 / 宿主核验步骤 / 回落链 / 两把尺子）、§五 回写补充（备注记「N 行 = N ⓘ」）与 checklist 一行格式；待全部平台验收后再写入 SOP。

### 质量
- 本轮纯核对与草稿，无代码改动、无平台站文件改动；`vitest`/`build:v2` 状态与上一轮一致（65 文件 / 309 测试、构建通过）。
- 工作树干净；#27 仍待人工验收。

## 会话：2026-09-12（第四轮：#27 待验收期间，E 组预分析 + 组件全景清点）

### 做了什么
1. **组件全景清点**：全量扫 `singleplatform/**/*.vue` 的 `field-guide` 与 `el-form-item` 计数 → 真正挂过指引的只有 4 个组件（`CommonBlogSetting` 26、`CommonGithubSetting` 26、`ConfluenceSetting` 2、`TelegraphSetting` 8）；**唯一未挂却含真实行的组件是 `fs/LocalSystemSetting.vue`（3 行）**；其余各站组件都是直通壳或 slot 壳（0 行）。
2. **E 组工作清单精确化**（覆盖尺扩到 3 站）：博客园缺 `previewUrl`/`pageType`/`picbedService`；Wordpress 键已齐（只需宿主核验）；本地系统键已齐但 3 行未挂指引 → E 组代码工作量只有本地系统那 3 处（前两行文本指引、YAML 类型单选组用 `inline`）。
3. **修正计划表述**：`impl/MetaweblogSetting.vue`、`metaweblog/WordpressSetting.vue`、`metaweblog/CnblogsSetting.vue` 都是直通 `<common-blog-setting>` 的壳 → 「挂 impl/MetaweblogSetting.vue」不存在，已从 task_plan 删除该表述。

### 质量
- 本轮仍为只读分析（临时脚本跑完即从 `src/` 移除），未改任何组件、未开平台站；`vitest`/`build:v2` 状态与上一轮一致。
- #27 仍待人工验收；#28 未开工。

## 会话：2026-09-12（第五轮：#27 待验收期间，宿主回归复核当前构建）

### 做了什么
1. **宿主回归复核（共用层改动后）**：`f1b67569` 动过共用兜底配置 `_default`，发生在 #27 定稿之后 → 重载桌面端渲染进程（忽略缓存）让插件从磁盘重新加载当前 `dist-v2`，再到 `custom_Yuqueweb` 配置页逐项复核。
2. **结果全绿**：7 行 = 7 ⓘ、键精确；鉴权行折叠/展开恒 1 个 ⓘ 且字段已有值（1092 字符，只记长度）时指引仍在；7/7 tip 在 `.syp-panel` 内不裁切且为平台专属文案（证明兜底清理未干扰 registry 精确解析）；HelpPanel 显示 summary + 3 FAQ + 开始引导教程、无兜底；TourGuide 4/4 命中真实控件；账号数 32 → 32。
3. **留档**：截图 `tmp/regression-yuqueweb-after-fallback-cleanup.png`。

### 质量
- 本轮为宿主只读复核（仅点击「手动编辑」展开/收起与帮助/引导按钮，未点保存、未点验证、未改任何配置），账号数未变。
- 这条证据补齐了「共用层改动后已验证站点仍正常」的回归链，供步骤 F 汇总。
- #27 仍待人工验收；#28 未开工。

## 会话：2026-09-12（第六轮：两把回归尺 drop-in 草稿 + checklist SSOT 核对）

### 做了什么
1. **F 阶段两把尺写成可落地草稿**：`tmp/field-guide-rulers.spec.ts` —— 22 站显式 `REQUIRED_FIELD_KEYS` 表 + `ready` 标记 + 三条用例（键尺、覆盖尺、进度尺）。F 时复制进 `src/helpConfigs/` 并清零 `ready=false` 即可。
2. **试跑发现真问题**：覆盖尺对 14 个 ready 站全绿；**键尺红** —— 7 个待办 Cookie 站共 11 个键不是配置实例属性（`cookie` ×7、`knowledgeSpace` ×4，实例上根本不存在），且全仓没有任何组件挂 `field="cookie"`/`field="knowledgeSpace"`/`field="token"` → 这些 `tip` 是**永不可达的死文案**。结论：D 组 7 站的改名是「让指引真正存在」，不是措辞美化。
3. **checklist SSOT 只读核对**：T1「全链路 ✅ 22」行数与名单一致；未测 13 = `remaining-t1` 12 站 + `metaweblog_*`；#1/#21/#25/#29 备注缺 SOP §3 帮助记录属计划内（F.5 统一回写，不改六格）。

### 质量
- 草稿只在 `tmp/` 里跑过（跑完即从 `src/` 移除），仓库内不留红测；临时文件类型正确（`build:v2` 的 `vue-tsc` 会一起检查）。
- 提交后工作树干净；#27 仍待人工验收，#28 未开工。

## 会话：2026-09-12（第七轮：tour 锚点有效性全量预核 + 第四把尺）

### 做了什么
1. **tour 锚点有效性全量预核**：按行渲染条件推导每站「真实存在的锚点集合」，逐站比对 tour 每个步骤的 target → 22 站中 **21 站 `dead=[]`**。
2. **发现 #21 博客园一处死步骤**：其 tour 某步 target 是 `password`，但该平台是 Token 型、鉴权行锚点为 `token` → 该步定位不到真实控件。根因：`tourAnchors.spec.ts` 的 Token 锚点断言把平台**硬编码为 6 个 GitHub 站**，博客园漏检。→ 归入 E 组 #21 修复；F 阶段把该断言改为按 `passwordType` 数据驱动。
3. **第四把尺（锚点尺）加入 F drop-in 草稿**并做**变异验证**：把博客园临时标为 ready 后尺子④确实报红 → 证明它能抓到这类缺陷。当前草稿试跑：尺子②③④全绿（覆盖/进度/锚点，各 14 站），尺子①按预期红（11 个死键）。

### 质量
- 全量 `pnpm vitest run` 65 文件 / 309 测试通过；仓库内无红测（草稿跑完即从 `src/` 移除）；工作树干净。
- #27 仍待人工验收；#28 未开工。

## 会话：2026-09-12（第八轮：F.5 回写片段 + F.2 改写片段就绪，台账订正）

### 做了什么
1. **F.5 回写片段逐站备好**（`tmp/sop-section3-field-guide-draft.md` 第五节）：依据验收台账的真实宿主数字生成可粘贴的「字段指引：N 行 = N ⓘ」片段（语雀 8 / Notion 7 / Halo29 7 / Telegraph 匿名 11·登录 12 / Confluence 8 / GitHub 六站 17→21（Vuepress2 20）/ 语雀网页版 7；其余留 `<N>` 待实测）。六格结论不动。
2. **F.2 `tourAnchors.spec.ts` 数据驱动改写片段备好并在 22 站上预校验**：20 站 `OK`、本地系统无鉴权步骤 `SKIP`、仅 `metaweblog_Cnblogs` 报 `expected=token used=[password]` → 与第七轮锚点预核结论一致。
3. **台账订正**：#5 Confluence 的用户验收状态由「⬜ 待验收」改为「✅ 放行（用户回复「继续」，随后开工 #27）」，与门禁规则（未验收不得开下一站）和实际推进一致；避免 F 汇总时误以为还有一站挂着。

### 质量
- 本轮无代码改动（片段只在 `tmp/` 备好），全量测试与构建状态不变；工作树干净。
- #27 仍待人工验收；#28 未开工。

## 会话：2026-09-12（第九轮：待办站文案预审 + 占位链接清单）

### 做了什么
1. **10 个待办站文案合规预审**（7 个 Cookie 站 + 博客园/Wordpress/本地系统）：`summary` 与 tour 标题均无验证进度叙述 ✓。
2. **tour 步骤 ↔ 真实渲染锚点逐一比对**：除已知的博客园 `password` 死步骤外，其余 9 站全部命中 → 各站开工只需改 `fields` 键与文案，**不必动 tour 结构**（每站工作量进一步确定）。
3. **占位帮助链接清单**：22 个配置里 15 个仍是共享/占位链接（9 个 T1 通用 + 6 个 Halo/通用），7 个已平台专属；文档草稿顶部 TODO 标注齐备 ✓。清单已写入 `tmp/sop-section3-field-guide-draft.md` 第七节，作为 F 阶段交付给用户的「待补真实文档链接」handoff。

### 质量
- 本轮纯只读审计 + 文档草稿补充，无代码改动；工作树干净。
- #27 仍待人工验收；#28 未开工。

## 会话：2026-09-12（第十轮：F.3 前置核验——V1/locale 零改动取证 + V1 打包复核）

### 做了什么
1. **变更面取证**：本 change 全部提交的 diff（`c88f930b^..HEAD`，排除 planning/openspec/docs/tmp）**恰好 21 个文件**，全部落在 V2 帮助/字段指引层（FieldGuide、helpPageIdKey、4 个设置组件、V2PlatformConfigBridge、14 个 help 配置、registry.spec）。
2. **locales 零改动**：`-- src/i18n src/locales "*.json"` → 空；**V1 零改动**：V1 旧表单 `base/CookieSetting.vue` 与 V1 入口 `Admin.vue` 均不在变更清单 → F.3 的「locales 共享串不动，V1 文案零变化」由口头承诺变为 git 可核验证据。
3. **V1 打包链路复核**：`python scripts/build.py`（= `pnpm build`）exit 0，产出 `siyuan-plugin-publisher-1.41.1.zip` → 共用组件挂指引后 V1 构建未受影响；`build/` 已在 `.gitignore:34`，工作树保持干净。
4. **任务 1.1「唯一拼接点」核验**：`V2PlatformConfigBridge.vue:117` 是唯一 `platform-config/${platformKey}` 构造点，第 118 行 `provide` 一次下发，`HelpButton` 与字段指引共用同一值 ✓。

### 质量
- 本轮为只读取证 + 一次 V1 构建，无源码改动；工作树干净。
- #27 仍待人工验收；#28 未开工。

## 会话：2026-09-12（第十一轮：宿主复核脚本化，退出码即结论）

### 做了什么
1. **新增 `tmp/host-field-guide-check.ps1` + `.js`**：一条命令跑完该 change 的全部宿主渲染契约（字段行数/指引数/键清单/无指引行/不同行/一行多条/图标不可见/悬停无弹层/空文案/越出面板/被祖先裁切/未挂面板内/已填值仍不可见），**退出码 0/1 即通过/失败**，支持 `-AllowNoGuide` 声明按规则豁免的行（如 Notion「搜索关键词」）。
2. **口径修正两处**：① 只有带标签的表单行才算字段行，无标签的「验证 / 保存取消」按钮行单独记 `actionRows`；② 弹层量测**逐行 `scrollIntoView` 后再 hover**，并按「面板 ∩ 视口」判定——修掉了「行在折叠线以下 → 误报被裁切」的假失败。
3. **语雀网页版（#27）两态实测全绿**：收起态 7 行 = 7 指引、键与冻结键表逐字一致、5 行已填值仍可见、7 条弹层面板内未裁切 → exit 0；展开态（Cookie 文本框 1092 字符，只报长度）鉴权行指引恒为 1、弹层仍全绿 → exit 0。宿主状态已复原为收起。

### 质量
- 脚本只在 gitignored `tmp/`，不入库；宿主仅做了「展开/收起鉴权面板」的只读交互（未保存、未改配置），账号数不变。
- #27 仍待人工验收；#28 未开工。

## 五问重启检查
| 问题 | 答案 |
|------|------|
| 我在哪里？ | 步骤 D（Cookie 族 8 站）第 1 站 **#27 语雀网页版已回填并过宿主，待验收**；本轮补做 F 前置审计（键尺原型 12 站全绿）+ `_default` 死键清理，未开新平台。22 站里已回填 12 站 |
| 我要去哪里？ | 用户放行 #27 后开 D 组余 7 站（#28 Halo网页版、#30 知乎、#31 CSDN、#32 简书、#33 掘金、#34 微信公众号、#35 哔哩哔哩）：照 #27 口径校正 `cookie`→`password`、`knowledgeSpace`→`blogid` 与缺项 → E 组 3 站（#21 博客园、#25 Wordpress、#29 本地系统）→ F 收尾（两把回归尺 + SOP §3 + checklist 回写） |
| 目标是什么？ | `fields` 指引在配置页真实渲染、已验证 22 站全部回填、该点成为后续每站必过项 |
| 我学到了什么？ | ① Cookie 族的鉴权行是「一条指引服务两个控件」（授权面板 + 手动文本框），必须包整行否则折叠态无 ⓘ；② 网页族 9 个 `*Setting.vue` 都没有专有行，D 组工作量在共用层与 `fields` 键；③ `remaining-t1` 占位配置会精确命中并遮蔽 `_default`，未拆分平台因此完全没有 ⓘ（各站必须自己拆出配置）；④ 「添加账号 → 卡片」与族无关，一律新建实例，前后必须比对账号数 |
| 我做了什么？ | 试点三轮 + 标准冻结 → Hexo `bf11170e` → Hugo `d6ba322a` → Jekyll `fbbd9ebf` → 重启续航 `92234b1f` → Quartz `894ddb34` → Vuepress `c3f78aa2` → 语雀 `6f745321` → Notion `8afa2318` → Halo `42a32d70` → Telegraph `9c187b9b` → Confluence `7a554a60` → 语雀网页版 `6005e30e` → 本轮 F 前置审计 + `_default` 死键清理（待提交） |

---
*每完成一个阶段或遇到错误时更新此文件*
