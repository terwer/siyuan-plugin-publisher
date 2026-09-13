# 任务计划：字段级指引接线与全平台回填（add-field-guide-tips）

## 目标
实现 OpenSpec change `openspec/changes/add-field-guide-tips/`：让平台 help 的 `fields` 提示在配置页**真实渲染且填值后仍可见**，并回填到已验证的 22 个平台。

## 工作方式（用户 2026-09-07 明确要求，最高优先）
1. **每完成一个平台的字段指引就停下**，给出宿主证据（表单截图 + 弹层定位与内容），**等用户验收通过后才做下一个平台**。
2. **共用层改动必须先在试点平台上与真实表单对齐定稿**，未定稿不得铺开。
3. 不做一次性大批量；每个增量小、可验证、可回退。

## 当前步骤
- 步骤 A/B（GitHub 族 6 站）完成并逐站放行；步骤 C（Common 族 5 站：#1 语雀、#2 Notion、#3 Halo、#4 Telegraph、#5 Confluence）完成并逐站放行。
- 步骤 D（Cookie 族 8 站）第 1 站 **#27 语雀网页版已回填 + 宿主复核完成，待验收**（2026-09-12，commit 待提交）。
- 22 站里已回填 **12 站**（GitHub 6 + Common 5 + Cookie 1）。

## 重启后第一步（会话恢复时照此执行）
1. `update_goal` 先 `get_goal` 再 `resume`（重启后目标会被解除武装，当前 rev 9、phase paused）。
2. 确认宿主在跑：`Get-NetTCPConnection -LocalPort 9222 -State Listen`；不在则 `C:\Program Files\SiYuan\SiYuan.exe --workspace="D:\Users\Administrator\Documents\mydocs\SiyuanWorkspace\test" --remote-debugging-port=9222`（内核端口每次随机，用 `/json/list` 读）。
3. 确认 #8 Jekyll 的验收状态：用户若已点头则记 ✅ 进台账，直接开 **#9 Quartz**；未点头则先补证据等验收。
4. #9 Quartz 开工口径（照 Jekyll 的办法，不照抄文案）：读 `quartzYamlConverterAdaptor.ts` 的 permalink 段与 `dynYamlCfg` 段 + `quartzConfig.ts` 默认值 → 补 9 键（`yamlLinkEnabled`/`blogid`/`imageStorePath`/`imageLinkPath`/`dynYamlCfg`/`defaultMsg`/`author`/`email`/`site`）→ vitest + build:v2 → 宿主（真实账号 `github_Quartz`）量 17/21 个 ⓘ 与 `notSameLine` → 截图 → 停下等验收。
5. MCP 若已恢复优先用 MCP；未恢复则继续用 `tmp/cdp-eval.ps1` / `tmp/cdp-shot.ps1`（CDP 直连，已验证可用）。

## 验收台账
| 步骤 | 平台 | 共用层挂载 | fields 键改名/补全 | 宿主证据 | 用户验收 |
|---|---|---|---|---|---|
| A | #11 Vuepress2（试点） | CommonBlogSetting + CommonGithubSetting（**包裹式同行**，26 处） | 补 `blogid`/`imageStorePath`/`imageLinkPath`/`dynYamlCfg`/高级四项 | 20 行同行、官方 InfoFilled 14px 安静档、弹层在面板内完整可见 | ✅ 已验收（标准已冻结）；`blogid` 文案在 #9 一并修正 |
| B | #6 Hexo | 复用 A | 补 9 键（`yamlLinkEnabled`/`blogid`/`imageStorePath`/`imageLinkPath`/`dynYamlCfg`/高级四项），无需改名 | 基础 17 → 展开 21 个 ⓘ，`notSameLine=[]`，5 条 tip 均为 Hexo 专属且在面板内完整可见 | ✅ 已验收；`blogid` 文案在 #9 一并修正 |
| B | #7 Hugo | 复用 A | 补同 9 键；**并纠正错误表述**：Hugo 写的是 `url` 且固定 `/post/<文章别名>.html`，不读「文章预览规则」（`hugoYamlConverterAdaptor.ts:37-38`） | 基础 17 → 展开 21 个 ⓘ，`notSameLine=[]`；5 条 tip 复核为 Hugo 专属、面板内完整可见 | ✅ 放行（用户回复「继续」）；`blogid` 文案在 #9 一并修正 |
| B | #8 Jekyll | 复用 A | 补同 9 键；**再纠正两处**：Jekyll 的 `permalink` 无条件写入（`:68`），开关只改取值来源；`dynYamlCfg` 非空会顶替 `layout`/`published` 默认值 | 基础 17 → 展开 21 个 ⓘ，`notSameLine=[]`；4 条 tip 宿主实测 + 21 键 registry 解析全绿；截图 `tmp/field-guide-jekyll-yamllink.png` | ✅ 放行（用户「重启并继续验证」）；`blogid` 文案在 #9 一并修正 |
| B | #9 Quartz | 复用 A | 补同 9 键；`dynYamlCfg` 留空写的是 `enableToc`/`enableBackLinks`（非 Jekyll 那两项）；**跨站修正**：`allowKnowledgeSpaceChange` 只作用于快速发布页，设置页发布目录并非只读 → 五站 `blogid` 文案全部改准 | 基础 17 → 展开 21 个 ⓘ，`notSameLine=[]`；5 条 tip 宿主实测 `added:1/visible:1` 且文案为 Quartz 专属；Jekyll 修正后文案已复测渲染；截图 `tmp/field-guide-quartz-dynyaml.png` | ✅ 放行（用户回复「继续」） |
| B | #10 Vuepress | 复用 A | 补同 9 键；**本平台独有**：转换器会写 `author: {name, link}`（`vuepressYamlConverterAdaptor.ts:94-114`），故 `author`/`site` 真实影响文章头；`dynYamlCfg` 留空不补任何字段；`permalink` 硬编码不读预览规则（文档草稿 L34 同步改准） | 真实账号 `github_Vuepress`：基础 17 → 展开 21 个 ⓘ，`notSameLine=[]`；6 条 tip `added:1/visible:1` 且为 Vuepress 专属；截图 `tmp/field-guide-vuepress-author-site.png` | ✅ 放行（用户回复「继续」） |
| C | #1 语雀 | **无需新挂**（`YuqueSetting.vue` 只有会员提示 + 共用表单） | `token`→`password`、`knowledgeSpace`→`blogid`；补 `previewUrl`/`pageType`；**改准两处**：图床只有 不使用/PicGo（`useYuqueApi.ts:68-69`，无内置图床）、知识库行键为 `blogid`；`registry.spec.ts` 同步改键 | 8 行全部有 ⓘ 且 `notSameLine=[]`（home/apiUrl/username/**password**（行标签仍是「鉴权token」）/previewUrl/pageType/**blogid**（行标签「知识库」）/picbedService）；5 条 tip `added:1` 文案准确含 Token 链接；实测图床选项 = `["不使用","PicGo 强烈推荐"]`；截图 `tmp/field-guide-yuque-picbed.png` | ✅ 放行（用户回复「继续」） |
| C | #2 Notion | **无需新挂**（`NotionSetting.vue` 只有共用表单） | `token`→`password`、`knowledgeSpace`→`blogid`；`picbedService` 改准（只有 不使用/PicGo，无内置图床）+ 补「选不使用则按原地址引用」；`blogid` 说明子页面创建与不可换根页面；文档草稿两行同步 | 7 行全部有 ⓘ、`notSameLine=[]`；唯一无 ⓘ 的是「搜索关键词」行（绑 `ksKeyword`，按规则不挂）；5 条 tip `added:1` 文案准确含 Token 链接；图床选项实测 `["不使用","PicGo 强烈推荐"]`；账号数不变（32）；截图 `tmp/field-guide-notion-rootpage.png` | ✅ 放行；「搜索关键词」行**保持不挂**（用户 2026-09-09 确认「保持现状」），此例外已写进 change 2.5 |
| C | #3 Halo | **无需新挂**（`HaloSetting.vue` 只有 2.9 提示 alert + 共用表单） | 现有 7 键与渲染行**完全对应，零改名零补键**；只补准：`picbedService` 三项与默认「不使用」（实测 checked=不使用）、`password` 链接给明确 `linkText`、summary 不再暗示默认走内置图床；文档草稿图床行同步 | 标题 Halo29、7 行 = 7 个 ⓘ、`notSameLine=[]`、`rowsWithoutGuide=[]`；改后 tip 与 HelpPanel summary 均实测为新文案、无「暂无专属帮助文档」回退；账号数不变（32）；截图 `tmp/field-guide-halo-picbed.png` | ✅ 放行（用户回复「继续」） |
| C | #4 Telegraph | **首次挂专有行**：`TelegraphSetting.vue` 4 行全部包裹式挂载（登录模式 `inline`、Access Token、Hash、刷新授权 `inline`） | 补 6 键：`postType`/`accessToken`/`forceReAuth`/`previewUrl`/`pageType`/`picbedService`（`saveHash`/`corsAnywhereUrl` 原已有）；文案含切模式清空、代理前缀、平台无图片上传接口 | 匿名 **11 行 = 11 个 ⓘ**、切「登录发布」变 **12 行 = 12 个**（`accessToken` 随行出现），`notSameLine=[]`；5 条新 tip 实测命中；图床实测 checked=不使用；账号数不变（32）、模式已切回匿名且未保存；截图 `tmp/field-guide-telegraph-posttype.png` | ✅ 放行（用户「开始」） |
| C | #5 Confluence | **挂专有行**：`ConfluenceSetting.vue` 的「父页面」`el-select` 包裹式挂 ⓘ | `knowledgeSpace`→`blogid`；补 `previewUrl`/`pageType`/`picbedService`；`parentPageId` tip 写明「按所选空间按需拉取、切换空间会清空」；文档草稿相关行同步 | test 工作区**无 Confluence 账号** → 走「添加账号 → Confluence 卡片」核验：标题 Confluence、**8 行 = 8 个 ⓘ**、`rowsWithoutGuide=[]`、`notSameLine=[]`；实测「发布格式」Markdown 单选 `display:none`、HTML 选中（与 tip 一致）、图床默认 checked=「当前平台」（与 tip 一致）；5 条 tip `added:1` 均命中且在面板内完整可见；**核验后删除该临时账号**（33→32 复原）；截图 `tmp/field-guide-confluence-parentpage.png` | ⬜ 待验收 |
| D | #27 语雀网页版 | **共用层补挂**：`CommonBlogSetting.vue` 鉴权行改为「整行一条指引」（`field="password"` 包住授权面板 + 手动文本框）；`YuquewebSetting.vue` 查实无专有行 → 零新挂 | `cookie`→`password`、`knowledgeSpace`→`blogid`，补 `home`/`apiUrl`/`pageType`（共 7 键） | 真实账号 `custom_Yuqueweb`：7 行 = 7 个 ⓘ、`rowsWithoutGuide=[]`；鉴权行展开/收起 ⓘ 恒为 1（无重复）；7 条 tip `added` 均命中且弹层在 `.syp-panel` 内完整可见；HelpPanel（新 summary + 完整文档 + FAQ3）+ TourGuide 4/4 命中真实控件；账号数 32→32（未误建）；截图 `tmp/field-guide-yuqueweb-cookie.png` | ⬜ 待验收 |
| D | #28 Halo网页版 | 同上 | `cookie`→`password` | | ⬜ |
| D | #30 知乎 | 同上 | `cookie`→`password`、`knowledgeSpace`→`blogid` | | ⬜ |
| D | #31 CSDN | 同上 | `cookie`→`password` | | ⬜ |
| D | #32 简书 | 同上 | `cookie`→`password`、`knowledgeSpace`→`blogid` | | ⬜ |
| D | #33 掘金 | 同上 | `cookie`→`password`、`knowledgeSpace`→`blogid` | | ⬜ |
| D | #34 微信公众号 | 同上 | `cookie`→`password` | | ⬜ |
| D | #35 哔哩哔哩 | 同上 | `cookie`→`password`、`knowledgeSpace`→`blogid` | | ⬜ |
| E | #21 博客园 | impl/MetaweblogSetting | 现仅 4 键，按真实行补齐 | | ⬜ |
| E | #25 Wordpress | impl/MetaweblogSetting | 按真实行补齐 | | ⬜ |
| E | #29 本地系统 | fs/LocalSystemSetting | 核对 `pageType`/`picbedService` 是否渲染 | | ⬜ |
| F | 收尾 | — | 两把回归尺 + SOP §3 + checklist 回写 + 提交 | | ⬜ |

## 各步骤

### 步骤 A：共用层 + 试点 #11 Vuepress2（已完成，待验收）
- [x] A.1 `FieldGuide.vue` 改为 `inject` pageId（prop 可覆盖）；无 provider 时只渲染 slot、不渲染图标、不留空占位（组件改为 fragment 根，避免多余 flex 子项产生空隙）。
- [x] A.2 新增 `src/components/common/help/helpPageIdKey.ts` 注入键（单一来源）。
- [x] A.3 `V2PlatformConfigBridge.vue` 抽出 `helpPageId` 计算属性，`HelpButton` 与 `provide` 共用同一个值。
- [x] A.4 `CommonBlogSetting.vue`（12 处）与 `CommonGithubSetting.vue`（12 处）按映射表挂 ⓘ（控件列尾部）。
- [x] A.5 试点 #11：`github-vuepress2.ts` 补齐真实渲染行的 tip（`blogid`/`imageStorePath`/`imageLinkPath`/`dynYamlCfg`/`defaultMsg`/`author`/`email`/`site`）。
- [x] A.6 全量 `pnpm vitest run`（65 文件 / 309 测试）+ `pnpm build:v2` 通过。
- [x] A.7 宿主复核：20 行（含折叠高级 4 行）全部出现 ⓘ；`:teleported="false"` 使 popper 留在 `.syp-panel` 内（`panel.contains(popper)=true`），逐行滚入视区后弹层完整可见无裁切；字段已填值仍可见；`github_Vuepress2-ig1w6` 实例 key 经回落链解析正确；HelpPanel 未受 bridge 改动影响（仍显专属 summary、无「暂无专属帮助文档」回退）。
- [x] A.8 停下提交宿主证据（`tmp/field-guide-vuepress2-token-tip.png` + 上述测量），**等用户验收**。
- **状态：** complete（待验收）

### 步骤 B：GitHub 族其余 5 站（每站一停）
- [ ] 逐站补 `yamlLinkEnabled` tip（仅受支持平台渲染该行）与该族缺项，逐站宿主复核 + 等验收。
- **状态：** pending

### 步骤 C：Common 族 5 站（每站一停）
- [x] 挂 `commonblog/*Setting.vue` 专有行（Yuque/Notion/Halo 无专有行；Telegraph 4 行、Confluence 父页面 1 行）；执行 `token`→`password`、`knowledgeSpace`→`blogid` 改名；逐站宿主复核 + 等验收。
- **状态：** complete（5/5 放行）

### 步骤 D：Custom Web Cookie 族 8 站（每站一停）
- [x] #27 语雀网页版：共用层鉴权行「整行一条指引」+ 7 键校正 + 宿主复核（待验收）。
- [ ] 余 7 站（#28 Halo网页版、#30 知乎、#31 CSDN、#32 简书、#33 掘金、#34 微信公众号、#35 哔哩哔哩）：逐站校正 `cookie`→`password`、`knowledgeSpace`→`blogid` 与缺项，宿主复核 + 等验收。
- **状态：** in progress（1/8）
- **余 7 站的键校正清单（2026-09-12 用覆盖尺原型预推，各站仍需宿主确认）：**

| 站 | 需新增键 | 需删旧键 |
| --- | --- | --- |
| #28 Halo网页版 | `password`、`previewUrl` | `cookie` |
| #30 知乎 | `username`、`password`、`previewUrl`、`blogid` | `cookie`、`knowledgeSpace` |
| #31 CSDN | `password`、`previewUrl` | `cookie` |
| #32 简书 | `password`、`previewUrl`、`blogid` | `cookie`、`knowledgeSpace` |
| #33 掘金 | `password`、`previewUrl`、`blogid` | `cookie`、`knowledgeSpace` |
| #34 微信公众号 | `password` | `cookie` |
| #35 哔哩哔哩 | `password`、`previewUrl`、`blogid` | `cookie`、`knowledgeSpace` |

  推导依据：各平台 `useXxxWeb.ts` 的运行时开关（`knowledgeSpaceEnabled`：知乎/简书/掘金/哔哩哔哩为 true，CSDN/公众号/Halo网页版为 false）+ `CommonBlogSetting` 行渲染条件。脚本 `tmp/field-guide-family-coverage.diag.spec.ts`。

### 步骤 E：MetaWeblog / Wordpress / 本地系统 3 站（每站一停）
- [ ] 逐站宿主复核 + 等验收。**2026-09-12 覆盖尺预推结果（各站仍需宿主确认）：**
  - **组件挂载：只有 `fs/LocalSystemSetting.vue` 需要改**——它的 `#main` 有 3 行且都没有 `field-guide`：存储路径 `storePath`（文本）、媒体存储路径 `imageStorePath`（文本）、YAML 类型 `fsYamlType`（单选组，用 `inline`）。`impl/MetaweblogSetting.vue` 与 `metaweblog/WordpressSetting.vue`/`CnblogsSetting.vue` **都是直通壳**（`<common-blog-setting>`），行与指引全部来自已改造的共用表单 → **无需再挂**（原计划里「挂 `impl/MetaweblogSetting.vue`」这项可以删掉）。
  - **#21 博客园**：`fields` 现 4 键，缺 `previewUrl`、`pageType`、`picbedService`（`knowledgeSpaceEnabled=false`、鉴权为 Token 型 → 键名仍是 `password`）；**另有 tour 死步骤**：某步 target 为 `password`，但该平台鉴权行渲染的锚点是 `token` → 一并改为 `token`。
  - **#25 Wordpress**：`fields` 现 7 键，**已齐**（`missing=[]`），E 组只做宿主核验。
  - **#29 本地系统**：`fields` 现 5 键（`storePath`/`imageStorePath`/`fsYamlType`/`pageType`/`picbedService`）**已齐**、`passwordType=None`（无鉴权行，不需要 `password` 键）；缺的是那 3 行的**指引挂载**（见上）。
- **状态：** pending（预分析完成，未开工）

### 步骤 F：回归尺与标准固化
- [ ] F.1 新增两把尺：① 每站 `fields` 键必须能在合并后配置实例上取到同名属性；② 按族 `REQUIRED_FIELD_KEYS` 全覆盖。
  - **drop-in 草稿已就绪**：`tmp/field-guide-rulers.spec.ts`（22 站键表 + `ready` 标记 + 键尺/覆盖尺/进度尺三条用例）。F 阶段复制进 `src/helpConfigs/` 并把 `ready=false` 清零。
  - 原型已跑：覆盖尺对 14 个 ready 站全绿；**键尺红**——7 个待办 Cookie 站有 11 个键（`cookie` ×7、`knowledgeSpace` ×4）不是配置实例属性，且全仓无组件挂这些 `field` 名 → 旧 tip 永不可达。
  - **尺子②的设计要点（2026-09-12 查实）**：必须用**按平台显式 REQUIRED_FIELD_KEYS 表**，不能从 Config 构造函数推导渲染行——平台 hook 会运行时改开关（`useTelegraphApi.ts:53` 开 `usernameEnabled`、`useBilibiliWeb.ts` 开 `knowledgeSpaceEnabled` 等）；且 GitHub 族图片两行取决于**当前图床值**（`picbedService === Bundled`）。宿主内不渲染的 `middlewareUrl` 与非 `isCorsProxy` 的 `corsAnywhereUrl` 不纳入必填集。
- [ ] F.2 同步 `registry.spec.ts` 中按 `'token'` 取 tip 的用例。
  - **2026-09-12 核实：已是完成态**——全仓无任何按 `token` 键取字段说明的 spec 用例（Yuque 那条已用 `password`）；残留的 `token` 只在 tour 锚点 `[data-syp-tour='token']` 与 Telegraph 真实属性 `accessToken`，均须保留。
  - **新发现需在 F 一并处理**：`tourAnchors.spec.ts` 的「Token 平台必须用 token 锚点」用例把平台硬编码为 6 个 GitHub 站 → 同为 Token 型的 **#21 博客园漏检**，其 tour 仍指向 `password`（死步骤）。修法：改为按 `passwordType` 数据驱动覆盖 `verifiedConfigs` 全部 22 站（尺子④原型已做变异验证）。
- [ ] F.3 V2 表单 placeholder 收敛为示例值（每次改动内保证对应 `fields` 已有说明，不留空窗）；locales 共享串不动，V1 文案零变化。
- [ ] F.4 SOP §3 增补「字段指引必须渲染并可核验」为与五格同等必过项 + 键命名空间规则。
  - **草稿已备**：`tmp/sop-section3-field-guide-draft.md`（含 §3 新增第 5 项、§五 回写补充、checklist 一行格式），全部平台验收通过后再写入 SOP。
- [ ] F.5 checklist 为 22 站回写该点通过记录（不改六格结论）；勾选 change `tasks.md`；`openspec validate --strict`。
- [ ] F.6 全量测试 + build:v2 + 英文 Conventional 提交推送，工作树干净。
- **状态：** pending

## 呈现标准（2026-09-08 用户定稿，后续 21 站统一照此，不再逐站讨论）
1. **全行覆盖**：该平台配置页每一行真实渲染的控件都要有 `fields` 指引（含折叠高级区）；绑的不是配置属性的行（检索关键词、验证/保存按钮）不挂。
2. **同行不换行**：一律用**包裹式**挂载 `<field-guide field="x"><控件/></field-guide>`；开关/单选组加 `inline`，文本域加 `tall`。
3. **安静档**：官方 `InfoFilled` 14px、`--el-text-color-placeholder`、hover 主色、tooltip `show-after 150ms`、`:teleported="false"` 留在 `.syp-panel` 内。
4. 未采用的更强档（默认隐藏、悬停才淡入 / 只给易错字段挂）已明确否决，保持全行 + 安静档。

## GitHub 族 6 站已完成（方法固化，供后续各族照做）
每站动作：读该平台**转换器 + Config 默认值** → 补齐真实渲染行的 `fields` 键（键=配置属性名）→ `pnpm vitest run` + `pnpm build:v2` → 宿主开表单量「基础 ⓘ 数 / 展开高级 ⓘ 数 / `notSameLine`」+ hover 差集复核 tip 文案 → 截图 → **停下等验收**。
族内实测差异（说明为什么不能套模板）：`permalink` 有条件/无条件/硬编码三种（Hexo 读预览规则、Quartz 读预览规则且占位符全、Hugo 与 Vuepress 硬编码、Jekyll 无条件写）；`dynYamlCfg` 留空时 Jekyll 补 `layout`/`published`、Quartz 补 `enableToc`/`enableBackLinks`、其余不补；只有 Vuepress 写 `author: {name, link}`（`site` 即 `author.link`）。
遗留（归步骤 F）：`common-github-hexo.ts` 文件名/`pageId` 大小写孤例；六站 tour `content` 与 `fields` tip 存在整句重复。

## 下一站开工清单：#28 Halo网页版（D 组第 2 站，**先查实再动笔**）
配置文件 `src/helpConfigs/pages/platform-config/custom-haloweb.ts`；账号 key `custom_Haloweb`（另有 `custom_Haloweb-16io5w` 未启用实例）。开工前必须读代码确认（勿凭记忆）：
1. `custom/HalowebSetting.vue`（`web/HalowebSetting.vue`）真实渲染哪些专有行、每行绑的是不是配置属性 → 决定要不要新挂 ⓘ（鉴权行已由 #27 的共用层改造覆盖）。
2. `halowebConfig.ts` 的 `passwordType`（Cookie 型 → 鉴权行仍绑 `password`）、`knowledgeSpaceEnabled`（决定是否有发布目录行，键 `blogid`）、`picbedService` 默认值与可选项（决定图床 tip 怎么写）。
3. 既有 `custom-haloweb.ts` 的 5 键是否含 `cookie`/`knowledgeSpace` 旧名 → 按改名规则校正；该站 2026-08-15 已补过 tour（5 步），只校准不改锚点。
4. 复用 #27 的宿主流程：顶栏「发布工具」→ 设置 → 账号列表 → 该行「管理」→ 量「行数 / ⓘ 数 / `rowsWithoutGuide`」→ hover 差集复核 tip → HelpPanel/TourGuide → 截图 → 停下等验收。

## 下一站开工清单（历史）：#1 语雀（C 组第一站，已完成）
配置文件 `src/helpConfigs/pages/platform-config/common-yuque.ts`；账号 key `common_Yuque`。开工前必须读代码确认（勿凭记忆）：
1. `commonblog/YuqueSetting.vue` 真实渲染哪些专有行、每行绑的是不是配置属性 → 决定要不要新挂 ⓘ（C 组共用 `CommonBlogSetting` 已挂好，专有行还没挂）。
2. `yuqueConfig.ts` 的 `passwordType`（token 型 → 鉴权行仍绑 `password`）、`knowledgeSpaceEnabled`/`blogid` 语义（语雀是知识库 `book_id` 还是 namespace）、`picbedService` 默认值（决定图片两行是否出现）。
3. 改名两项：`token` → `password`、`knowledgeSpace` → `blogid`（`registry.spec.ts` 现有用例按 `'token'` 取 Yuque 的 tip，改名后要同步）。
4. 语雀需专业会员；字段指引核验只看渲染，不依赖会员态。

## 核心资产：行 → 配置属性键映射（来自代码，勿凭记忆改）

`CommonBlogSetting.vue`（`el-form label-width="96px"`，ⓘ 挂**控件列尾部**，不挤标签列）：

| 表单行 | data-syp-tour | v-model 绑定 | `fields` 键 |
|---|---|---|---|
| 平台首页 | home | `cfg.home` | `home` |
| API地址 | apiUrl | `cfg.apiUrl` | `apiUrl` |
| 登录名 | username | `cfg.username` | `username` |
| 密码 / Token / Cookie | password / token / cookie | **三种都绑 `cfg.password`** | `password` |
| Cookie 行（V2 授权面板与手动文本框共存） | cookie | 面板按钮写 `cfg.password`，手动框绑 `cfg.password` | `password`（**整行只挂一条**，面板与文本框共用，勿各挂一个） |
| 预览规则 | previewUrl | `cfg.previewUrl` | `previewUrl` |
| 发布格式 | pageType | `cfg.pageType` | `pageType` |
| 检索关键词 | knowledgeSpaceSearch | `formData.ksKeyword`（非配置属性） | **不挂** |
| 发布目录/知识空间 | knowledgeSpace | `cfg.blogid` | `blogid` |
| 图床服务 | picbedService | `cfg.picbedService` | `picbedService` |
| 跨域代理地址 | — | `cfg.middlewareUrl` | `middlewareUrl` |
| 新CORS代理 / 强制CORS | corsProxy | `cfg.corsAnywhereUrl` | `corsAnywhereUrl` |
| 验证 / 保存 | validate | — | 不挂 |

`impl/CommonGithubSetting.vue`（`#main` 插槽内，绑 `main.cfg`）：

| 表单行 | v-model 绑定 | `fields` 键 |
|---|---|---|
| git仓库名 | `githubRepo` | `githubRepo` |
| YAML永久链接（开关） | `yamlLinkEnabled` | `yamlLinkEnabled`（仅 `yamlLinkSupported` 为真） |
| 默认分支 | `githubBranch` | `githubBranch` |
| 存储目录 | `defaultPath` | `defaultPath` |
| 文件规则 | `mdFilenameRule` | `mdFilenameRule` |
| 文章预览规则 | `previewPostUrl` | `previewPostUrl` |
| 提交信息/作者/邮箱/作者主页（折叠高级） | `defaultMsg`/`author`/`email`/`site` | 同名 |
| YAML预设配置 | `dynYamlCfg` | `dynYamlCfg` |
| 图片存储目录 / 图片访问链接（仅 Bundled） | `imageStorePath` / `imageLinkPath` | 同名 |

## 已做决策
| 决策 | 理由 |
|------|------|
| 分平台推进 + 每站停下验收 | 用户明确要求；共用层先与试点宿主对齐再铺开，避免一次改 22 站后才发现呈现方式不对 |
| ⓘ 挂控件列尾部而非 label 插槽 | 表单 `label-width="96px"`，中文标签已顶格；content 列 flex+gap 且已有 `<a>` 先例 |
| `fields` 键 = 配置属性名，与 tour 锚点两套命名空间 | 三条鉴权分支都绑 `cfg.password`；tour 才用 `token`/`cookie` 锚点 |
| pageId 由 bridge `provide` | 复用同文件 `V2_PLATFORM_CONFIG_ACTION_BRIDGE_KEY` 先例，避免第二套 key 规则 |
| FieldGuide 改 fragment 根 | 无 tip 时不留空 div，避免 content 列 gap 撑出空隙 |
| 回归尺放步骤 F | 改名未全部完成前加全局断言会红；先按站推进再一次性钉死 |

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
| 首次宿主复核 `iconCount=0` | 1 | 页面仍跑旧 bundle，改 `dist-v2` 后必须 reload Electron 页面 |
| **验收不通过：ⓘ 掉到控件下一行** | 1 | 根因 `el-form-item__content` 默认 `flex-wrap:wrap` + 控件宽 100% → FieldGuide 改为**包裹控件**的同行布局（26 处挂载全部改造），并加 `inline`/`tall` 两个变体 |
| **验收不通过：图标看不清** | 1 | 手写 svg path + 浅灰色 → 换官方 `InfoFilled` 16px + `--el-text-color-regular` |

## 已做决策（追加）
| 决策 | 理由 |
|------|------|
| 指引必须与控件同行，禁止换行（用户硬性要求） | 换行后 ⓘ 与控件脱钩，读起来像另一行的东西 |
| FieldGuide 采用包裹式（slot 包住控件）而非兄弟节点 | 只有包住才能保证同行；兄弟节点受 `flex-wrap:wrap` 与控件 100% 宽度支配 |
| 图标用 `@element-plus/icons-vue` 官方组件 | 手写 path 不可靠且不可读；仓库既有 `QuestionFilled` 用法先例 |

## 关键问题
1. （步骤 A.7 定稿）`:teleported="false"` 留在 `.syp-panel` 内 vs 默认传送 body：以宿主复核结论为准。
2. （待确认）条件渲染行（图片存储目录/访问链接仅 Bundled 出现）的 tip 是否跟随行渲染——默认跟随。

## 备注
- 验证战役暂停在 `.planning/v2-platform-verification/`（T1 已 22/35 ✅，下一步 #12 Vitepress，目标仓库已查实 `terwer/siyuan-developer-docs`）。本任务全部验收后回到 #12。
- 宿主：test 工作空间软链 `data/plugins/siyuan-plugin-publisher -> dist-v2`，Electron 9222 直连（MCP pageId 1），顶栏 `plugin_siyuan-plugin-publisher_0` 派发 MouseEvent 打开面板。
- 敏感凭据（PAT、内核 token）不写入 `.planning`、docs 或提交内容。
