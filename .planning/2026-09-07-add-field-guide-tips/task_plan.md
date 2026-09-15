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
| C | #5 Confluence | **挂专有行**：`ConfluenceSetting.vue` 的「父页面」`el-select` 包裹式挂 ⓘ | `knowledgeSpace`→`blogid`；补 `previewUrl`/`pageType`/`picbedService`；`parentPageId` tip 写明「按所选空间按需拉取、切换空间会清空」；文档草稿相关行同步 | test 工作区**无 Confluence 账号** → 走「添加账号 → Confluence 卡片」核验：标题 Confluence、**8 行 = 8 个 ⓘ**、`rowsWithoutGuide=[]`、`notSameLine=[]`；实测「发布格式」Markdown 单选 `display:none`、HTML 选中（与 tip 一致）、图床默认 checked=「当前平台」（与 tip 一致）；5 条 tip `added:1` 均命中且在面板内完整可见；**核验后删除该临时账号**（33→32 复原）；截图 `tmp/field-guide-confluence-parentpage.png` | ✅ 放行（用户回复「继续」，随后开工 #27） |
| D | #27 语雀网页版 | **共用层补挂**：`CommonBlogSetting.vue` 鉴权行改为「整行一条指引」（`field="password"` 包住授权面板 + 手动文本框）；`YuquewebSetting.vue` 查实无专有行 → 零新挂 | `cookie`→`password`、`knowledgeSpace`→`blogid`，补 `home`/`apiUrl`/`pageType`（共 7 键） | 真实账号 `custom_Yuqueweb`：7 行 = 7 个 ⓘ、`rowsWithoutGuide=[]`；鉴权行展开/收起 ⓘ 恒为 1（无重复）；7 条 tip `added` 均命中且弹层在 `.syp-panel` 内完整可见；HelpPanel（新 summary + 完整文档 + FAQ3）+ TourGuide 4/4 命中真实控件；账号数 32→32（未误建）；截图 `tmp/field-guide-yuqueweb-cookie.png`；两条宿主尺 `exit 0`（2026-09-12 复跑） | ✅ 已验收（用户 2026-09-12 选择「放行 #27，现在开做 #28」） |
| D | #28 Halo网页版 | 同 #27（共用层已冻结，零新挂） | `cookie`→`password`（**该键在实例上根本不存在**，属死键）、补 `previewUrl`；文案按宿主实测改准：鉴权键点名真实按钮「1 去登录 / 2 自动读取 Cookie / 手动编辑」、图床点名真实三项并写明默认「当前平台」；文档草稿同步补「预览规则」行 | 真实账号 `custom_Haloweb`：**改前 6 行 = 4 ⓘ**（`平台Cookie`/`预览规则` 无指引，宿主尺直接点名「已挂载但未渲染指引」）→ **改后 6 行 = 6 ⓘ**，键 `home/apiUrl/password/previewUrl/pageType/picbedService`；折叠与展开态鉴权行 ⓘ 恒为 1（文本框 150 字符）；6 条弹层全部面板内未裁切；HelpPanel（summary 72 字 + FAQ 4 条 + 无回退）+ 引导 5/5 命中；账号数 32 不变；截图 `tmp/field-guide-haloweb-password-previewurl.png`；两条宿主尺 `exit 0` | ✅ 已验收（用户回复「继续」后开工下一站） |
| D | #30 知乎 | 同 #27（共用层已冻结，零新挂） | `cookie`→`password`、`knowledgeSpace`→`blogid`（**两个旧键在实例上都不存在**），补 `username`（该行必填，填错取不到专栏）与 `previewUrl`；文案按宿主实测改准：鉴权点名真实按钮、图床点名真实两项并写明默认「当前平台」、`previewUrl` 写明默认 `/p/[postid]`、`blogid` 写明专栏读取与不可换专栏；summary/FAQ3/FAQ4 与文档草稿同步 | 真实账号 `custom_Zhihu`：**改前 8 行 = 4 ⓘ**（用户名/平台Cookie/预览规则/专栏 四行无指引）→ **改后 8 行 = 8 ⓘ**，键 `home/apiUrl/username/password/previewUrl/pageType/blogid/picbedService`；折叠与展开态鉴权行 ⓘ 恒为 1（文本框 434 字符）；8 条弹层全部面板内未裁切；HelpPanel（summary 46 字 + FAQ 4 条 + 无回退）+ 引导 4/4 命中；账号数 32 不变；截图 `tmp/field-guide-zhihu-username-blogid.png`；两条宿主尺 `exit 0` | ✅ 已验收（用户回复「继续」后开工下一站） |
| D | #31 CSDN | 同 #27（共用层已冻结，零新挂） | `cookie`→`password`（**该键在实例上不存在**），补 `previewUrl`；文案按宿主实测改准：鉴权点名真实按钮、图床点名真实两项并写明默认「当前平台」、`previewUrl` 写明默认 `/[userid]/article/details/[postid]`；summary/FAQ2 与文档草稿同步 | 真实账号 **`custom_Csdn-z26fa1o`（动态实例 key，走 registry 回落链解析正确）**：**改前 6 行 = 4 ⓘ**（平台Cookie/预览规则 无指引）→ **改后 6 行 = 6 ⓘ**，键 `home/apiUrl/password/previewUrl/pageType/picbedService`；折叠与展开态鉴权行 ⓘ 恒为 1（文本框 884 字符）；6 条弹层全部面板内未裁切；HelpPanel（summary 51 字 + FAQ 3 条 + 无回退）+ 引导 4/4 命中；账号数 32 不变；截图 `tmp/field-guide-csdn-password-previewurl.png`；两条宿主尺 `exit 0` | ✅ 已验收（用户回复「继续」后开工下一站） |
| D | #32 简书 | 同 #27（共用层已冻结，零新挂） | `cookie`→`password`、`knowledgeSpace`→`blogid`（**两个旧键在实例上都不存在**），补 `previewUrl`；文案按宿主实测改准：鉴权点名真实按钮、图床点名真实两项并写明默认「当前平台」、`previewUrl` 写明默认 `/p/[postid]`、`blogid` 写明笔记本与不可换本；summary/FAQ2 与文档草稿同步 | 真实账号 `custom_Jianshu`：**改前 7 行 = 4 ⓘ**（平台Cookie/预览规则/笔记本 无指引）→ **改后 7 行 = 7 ⓘ**，键 `home/apiUrl/password/previewUrl/pageType/blogid/picbedService`；折叠与展开态鉴权行 ⓘ 恒为 1（文本框 989 字符）；7 条弹层全部面板内未裁切；HelpPanel（summary 43 字 + FAQ 3 条 + 无回退）+ 引导 4/4 命中；账号数 32 不变；截图 `tmp/field-guide-jianshu-password-previewurl.png`；两条宿主尺 `exit 0` | ✅ 已验收（用户回复「继续」后开工下一站） |
| D | #33 掘金 | 同 #27（共用层已冻结，零新挂） | `cookie`→`password`、`knowledgeSpace`→`blogid`（**两个旧键在实例上都不存在**），补 `previewUrl`；文案按宿主实测改准：鉴权点名真实按钮、图床点名**真实三项**（`不使用 / PicGo 强烈推荐 / 当前平台 推荐`）并写明默认「当前平台」、`previewUrl` 写明默认 `/post/[postid]`、`blogid` 写明分类列表与默认「后端」；summary/FAQ3 与文档草稿同步 | 真实账号 `custom_Juejin`：**改前 7 行 = 4 ⓘ**（平台Cookie/预览规则/分类 无指引）→ **改后 7 行 = 7 ⓘ**，键 `home/apiUrl/password/previewUrl/pageType/blogid/picbedService`；折叠与展开态鉴权行 ⓘ 恒为 1（文本框 1391 字符）；7 条弹层全部面板内未裁切；HelpPanel（summary 47 字 + FAQ 4 条 + 无回退）+ 引导 4/4 命中；账号数 32 不变；截图 `tmp/field-guide-juejin-password-blogid.png`；两条宿主尺 `exit 0` | ✅ 已验收（用户回复「继续」后开工下一站） |
| D | #34 微信公众号 | 同 #27（共用层已冻结，零新挂） | `cookie`→`password`（**该键在实例上不存在**；`previewUrl` 键本站本就有，故只需补鉴权）；文案按宿主实测改准：鉴权点名真实按钮与微信扫码登录、图床点名真实两项并写明默认「当前平台」、`pageType` 写明默认 HTML；summary/FAQ2 与文档草稿同步 | 真实账号 `custom_Wechat`：**改前 6 行 = 5 ⓘ**（仅「平台Cookie」无指引）→ **改后 6 行 = 6 ⓘ**，键 `home/apiUrl/password/previewUrl/pageType/picbedService`；折叠与展开态鉴权行 ⓘ 恒为 1（文本框 688 字符）；6 条弹层全部面板内未裁切；HelpPanel（summary 53 字 + FAQ 3 条 + 无回退）+ 引导 4/4 命中；账号数 32 不变；截图 `tmp/field-guide-wechat-password.png`；两条宿主尺 `exit 0` | ✅ 已验收（用户回复「继续」后开工下一站） |
| D | #35 哔哩哔哩 | 同 #27（共用层已冻结，零新挂） | `cookie`→`password`、`knowledgeSpace`→`blogid`（**两个旧键在实例上都不存在**），补 `previewUrl`；**运行时开关以宿主实测为准**（`BilibiliConfig` 构造里置 `false`，`useBilibiliWeb.ts` 又置回 `true`，文集行确实渲染）→ 补 `blogid` 是对的；文案按宿主实测改准：鉴权点名真实按钮、图床真实两项与默认「当前平台」、`previewUrl` 默认 `/[postid]`、文集读取；summary/FAQ2 与文档草稿同步 | 真实账号 `custom_Bilibili`：**改前 7 行 = 4 个指引**（平台Cookie/预览规则/文集 无指引）→ **改后 7 行 = 7 个指引**，键 `home/apiUrl/password/previewUrl/pageType/blogid/picbedService`；折叠与展开态鉴权行指引恒为 1（文本框 1031 字符）；7 条弹层全部面板内未裁切；HelpPanel（summary 58 字 + FAQ 3 条 + 无回退）+ 引导 5/5 命中；账号数 32 不变；截图 `tmp/field-guide-bilibili-password-blogid.png`；两条宿主尺 `exit 0` | ✅ 已验收（用户回复「继续」后开工下一站） |
| E | #21 博客园 | 共用层（无专有行，零新挂） | 补 `previewUrl`/`pageType`/`picbedService`（4 键 → 7 键）；**修 tour 死步骤** `password`→`token`（该站鉴权行渲染的锚点是 `token`）；鉴权/用户名文案对齐宿主；FAQ 图床口径改准（该站实测支持 PicGo） | 真实账号 `metaweblog_Cnblogs`：**改前 7 行 = 4 ⓘ**（预览规则/发布格式/图床服务 无指引）→ **改后 7 行 = 7 ⓘ**；**tour 改前 4/5（第 4 步「API Token」未命中死步骤）→ 改后 5/5 命中**（该步高亮 739.2x66.2）；覆盖诊断 `expected=7 actual=7 missing=[] extra=[]`、`tour=5 dead=[]`；HelpPanel（summary 37 字 + FAQ 2 条 + 无回退）；账号数 32 不变；截图 `tmp/field-guide-cnblogs-previewurl.png`；两条宿主尺 `exit 0` | ✅ 已验收（用户回复「继续」后开工下一站） |
| E | #25 Wordpress | 共用层（`WordpressSetting.vue`/`MetaweblogSetting.vue` 均为直通壳，零新挂） | 键本已齐（7 键），**本站的活儿在文案改准**：`picbedService` 旧文案「图片发布到站点自身的媒体库」把「不使用」说成会传到媒体库 → 改为点名三个真实选项（当前平台/PicGo/不使用）各自行为；`pageType` 补 Markdown/HTML 语义；`previewUrl` 与行标签「预览规则」对齐；`password` 不再把「应用程序密码」写成唯一答案（页内 placeholder 本身是登录密码）；summary/FAQ3/文档草稿同步（草稿补「发布格式」行） | 真实账号 `wordpress_Wordpress`：**7 行 = 7 个指引**，键 `apiUrl/home/pageType/password/picbedService/previewUrl/username`（与覆盖尺 expected=7 actual=7 missing=[] extra=[] 一致）；7 条弹层全部面板内未裁切（最长 283.6x83.6，图床文案 104 字）；**过渡未推进的诊断已当场证伪**：`transitionsFrozen` 记录 7 条 → 用真实指针 hover + 取帧后实测 `opacity=1`、class 去掉 `-enter-from`，截图 `tmp/field-guide-wordpress-picbed.png` 可肉眼看到弹层已绘制；HelpPanel（summary 45 字 + FAQ 3 条 + 无回退）+ 引导 **6/6 命中**（每步高亮 739.2x48）；覆盖诊断 `tour=6 dead=[]`；账号数 32 不变；两条宿主尺 `exit 0` | ⬜ 待验收 |
| E | #29 本地系统 | **组件层挂 3 行指引**：`fs/LocalSystemSetting.vue` 的 `#main` 里 存储路径/媒体存储路径 用包裹式、YAML类型 单选组用 `inline`（E 组唯一的组件改动） | 键已齐（5 键），并按宿主实况改准文案：`storePath` 把含糊的「插件支持的占位符」改成真实机制 `[auto]`→文章分类名；`imageStorePath` 写明图片按该目录写成相对链接；`fsYamlType` 点名全部真实选项（默认/Hexo/Hugo/Jekyll/Vuepress/Vuepress2/Vitepress/Quartz/Astro）并写明选具体框架会走该框架适配链路；`picbedService` 改为三选项口径（当前平台写入媒体目录 / PicGo / 不使用跳过图片处理）；FAQ 补「按分类分文件夹」一问答；文档草稿表格与常见问题同步 | 真实账号 `fs_LocalSystem`：**改前 5 行 = 2 个指引**（宿主尺直接点名「无指引的行：存储路径 / 媒体存储路径 / YAML类型」，exit 1）→ **改后 5 行 = 5 个指引**，键 `fsYamlType/imageStorePath/pageType/picbedService/storePath`；5 行全部有值仍可见指引；5 条弹层全部面板内未裁切（最长 283.6x83.6，YAML 文案 137 字）；真实指针 hover + 取帧实测 `opacity=1`（截图 `tmp/field-guide-localsystem-storepath.png`）；HelpPanel（summary 83 字 + FAQ 4 条 + 无回退）+ 引导 **5/5 命中**（YAML 步高亮 748.8x56，其余 748.8x48）；覆盖诊断 `expected=5 actual=5 missing=[] extra=[]`、`tour=5 dead=[]`、`SKIP(no auth step)`；账号数 32 不变；两条宿主尺 `exit 0` | ⬜ 待验收 |
| F | 收尾 | — | 两把回归尺 + SOP §3 + checklist 回写 + 提交 | 两把尺落地为 `src/helpConfigs/verifiedPlatformRows.ts`（按真实渲染行冻结键集）+ `fieldGuideRulers.spec.ts`（键尺/覆盖尺/守卫尺），并**四组变异验证**：塞死键 → 键尺红并点名 `custom_Csdn.cookie`；删 `previewUrl` → 覆盖尺红并点名 `missing=[previewUrl]`；给未拆分平台塞 `fields` → 守卫尺红并点名 `platform-config/github_Vitepress`；博客园引导改回 `password` → 引导锚点契约两条同时红。`tourAnchors.spec.ts` 改为按 `passwordType` 数据驱动（原来硬编码 6 个 GitHub 站，漏检 Token 站死步骤）。SOP §3 增第 5 条 + 附录 22 站；checklist 新增「字段指引与帮助引导（SOP §3.5）— 22 站回写」表 + 修订记录。**门禁**：`pnpm vitest run` 66 文件 / 313 测试通过、`pnpm build:v2` exit 0、`openspec validate add-field-guide-tips --strict` valid、宿主重载后两条宿主尺复跑 `exit 0`（本地系统 5 行 = 5 指引、弹层全部面板内未裁切、引导 5/5 命中）、账号数 32 不变、工作树干净 |  待验收 |

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
- [x] #27 语雀网页版：共用层鉴权行「整行一条指引」+ 7 键校正 + 宿主复核（**已验收**）。
- [x] 其余 7 站逐站完成（#28 Halo网页版、#30 知乎、#31 CSDN、#32 简书、#33 掘金、#34 微信公众号、#35 哔哩哔哩）：逐站校正 `cookie`→`password`、`knowledgeSpace`→`blogid` 与缺项，宿主复核 + 逐站停下等验收（#28–#34 已验收，#35 待验收）。
- **状态：** complete（8/8 交付；仅 #35 待验收结论）
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
  - **「V1 文案零变化 / locales 不动」已取证（2026-09-12）**：本 change 全部提交的 diff 恰好 21 个文件且全在 V2 帮助层；`src/i18n`/`*.json` 零改动；V1 旧表单 `base/CookieSetting.vue` 与 V1 入口 `Admin.vue` 均不在变更清单；`python scripts/build.py`（V1 打包）仍成功产出 zip。
- [ ] F.4 SOP §3 增补「字段指引必须渲染并可核验」为与五格同等必过项 + 键命名空间规则。
  - **草稿已备**：`tmp/sop-section3-field-guide-draft.md`（含 §3 新增第 5 项、§五 回写补充、checklist 一行格式），全部平台验收通过后再写入 SOP。
- [ ] F.5 checklist 为 22 站回写该点通过记录（不改六格结论）；勾选 change `tasks.md`；`openspec validate --strict`。
  - **逐站片段已备**：`tmp/sop-section3-field-guide-draft.md` 第五节（含宿主实测「N 行 = N ⓘ」与无指引行说明，其余站点留 `<N>` 待实测）。
- [ ] F.6 全量测试 + build:v2 + 英文 Conventional 提交推送，工作树干净。
- **状态：** pending

## 选项 1（4.1 占位符 → 示例值）口径对照表（2026-09-15 预分析，**未开工**，等用户拍板口径）

### 关键硬约束（本次查实，直接决定 4.1 怎么做）
**平台 `*Setting.vue` 是 V1 与 V2 共用的同一批文件**：
`routeConfig.ts:32/131-134`（`setting-platform-single` → `SingleSettingIndex.vue`）是 **V1 app（`src/main.ts` → `index.html`）** 的入口；
**V2 侧**（`V2PlatformConfigBridge.vue` → `bridgeRegistry.ts`）import 的是**同一批** `singleplatform/*/*Setting.vue`。
两边都经过 `CommonBlogSetting.vue` 读取 `props.cfg.placeholder.*Placeholder`（`CommonBlogSetting.vue:382/390/398/415/434/487`）。
→ **结论：不能直接改这些组件里的 placeholder 赋值**，否则 V1 文案跟着变，违反 change 4.2（「locales 的 `setting.blog.*.tip` 保持不动、V1 界面文案零变化」）与 proposal「V1 文本零变化」承诺。
→ **可用的 V2 专属信号已存在**：`CommonBlogSetting.vue:59` 已 `inject(V2_PLATFORM_CONFIG_ACTION_BRIDGE_KEY, null)`——**V2 才有 provider**（`V2PlatformConfigBridge.vue:120`）、V1 取到 `null`。这就是「只在 V2 生效」的现成开关，无需新造机制。

### 现状：占位符里的字段说明（locales 共享串，92 个 `.tip` 键）
| locales 键 | 现值 | 问题 |
|---|---|---|
| `setting.blog.previewUrl.tip` | 「如果不明白原理，请勿修改此选项。MD文件预览规则（占位符：…）通常是：/[user]/[repo]/blob/[branch]/[docpath]」 | 长说明，填值即消失 |
| `setting.blog.mdFilenameRule.tip` | 「Markdown文件名规则(占位符：[yyyy] [MM] [mm] [dd] [category] [cats] [tag] [tags] [slug] [filename])，例如：…」 | 括号占位符清单过长 |
| `setting.blog.previewPostUrl.tip` | 「预览规则（占位符：[yyyy] [MM] [dd] [postid]），例如：/post/[postid].html 或者 …」 | 同上 |
| `setting.blog.type.github.default.path.tip` | 「存储目录例如：docs，部分平台可使用[auto]作为特殊占位符，代表自动映射层级目录，例如：docs/[auto]」 | 说明 + 示例混在一起 |
| `setting.blog.type.github.dyn.yaml.tip` | 「YAML预设配置，如果您不了解是干什么的请不要配置，JSON格式，例如：{"sidebar": false}。这个配置会覆盖…」 | 整段说明塞在 textarea 占位符 |
| `setting.blog.github.url.tip` / `.apiurl.tip` | 「Github首页地址」/「Github 的 REST API 地址，通常是：https://api.github.com」 | 偏说明 |
| `setting.blog.type.github.image.link.path.tip`、`setting.blog.picbedService.tip`、`setting.blog.pageType.tip`、`setting.blog.blogid.tip` | **空值** | 无占位符可读 |
| GitLab 族 `setting.blog.gitlab.*.tip` | 「Gitlab首页，例如：http://localhost:8002」等 | 已是示例值形态（可作口径样板） |

### 三种口径（请选一个，我再逐站推）
| 方案 | 做法 | V1 影响 | 成本/风险 |
|---|---|---|---|
| **A（推荐）** | 不改 locales、不改共用组件赋值；在 `FieldGuide` 体系内新增「示例值」来源（`fields` 增可选 `sample?: string`），由 `CommonBlogSetting.vue` 在 **V2 分支**（`v2ActionBridge != null`）把 `:placeholder` 从 `placeholder.*Placeholder` 切到 `sample` | **零变化**（V1 走 `v2ActionBridge === null` 分支，仍读 locales） | 中：动 `FieldGuide` + 共用表单的 placeholder 绑定；需尺子钉死「V1 分支不变」 |
| **B** | 各平台 `*Setting.vue` 按 V2 信号（inject 到 bridge key）选择性地注入示例值到自己的 `*Placeholder` 实例 | 零变化 | 低侵入，但 34 个组件各写一遍判断 → 重复 |
| **C** | 直接改 locales 共享串为示例值 | **破坏 4.2/提案承诺**（V1 文案变） | 不可接受（除非用户明确同意放弃 4.2） |

### 试点站建议与「示例值」草案（选定方案后先做一站给你看图）
试点站 `fs_LocalSystem`（5 行、无专有行、结构最简）或 `github_Vuepress2`（20 行、已定稿基线的样板站）。
草案（GitHub 族为例，取自 `github-vuepress2.ts` 的 `fields` 与各 config 真实默认值）：

| 字段 | 建议示例值（placeholder） | 已有 `fields.tip`（说明归此） |
|---|---|---|
| `home` | `https://github.com` | 「GitHub 首页地址，默认 https://github.com。」 |
| `apiUrl` | `https://api.github.com` | 「GitHub API 地址，默认 https://api.github.com，通常无需修改。」 |
| `username` | `terwer` | 「GitHub 用户名（owner），用于拼出仓库地址。token 需对该仓库有 push 权限。」 |
| `password` | `ghp_XXXXXXXXXXXXXXXXXXXX` | 「GitHub 个人访问令牌（PAT，Token）…」 |
| `githubRepo` | `vuepress2-blog` | 「Vuepress2 站点仓库名…」 |
| `githubBranch` | `main` | 「发布到的分支，默认 main…」 |
| `defaultPath` | `src/post` | 「Vuepress2 文章存储目录，默认 src/post。…」 |
| `mdFilenameRule` | `[slug].md` | 「文章文件名规则，默认 [slug].md…」 |
| `previewPostUrl` | `/post/[postid].html` | 「站点文章预览规则，默认 /post/[postid].html。…」 |
| `previewUrl` | `/[user]/[repo]/blob/[branch]/[docpath]` | 「GitHub blob 预览规则…」 |
| `imageStorePath` | `[docpath]/images` | 「选「当前平台」图床时图片提交到仓库的位置…」 |
| `imageLinkPath` | `./images` | 「文章内图片引用前缀…」 |
| `dynYamlCfg` | `{"sidebar": false}` | 「YAML 预设配置（JSON 片段）…」（说明已在 fields，占位符只留示例） |

**待用户确认三点**：① 选 A / B / C 哪个口径；② 试点站用 `fs_LocalSystem` 还是 `github_Vuepress2`；③ 示例值是否就用上表草案（或你给更贴近真实使用的值）。

## 选项 3 开工清单：12 个未拆分平台（2026-09-15 预分析，**未开工**，等用户点头）

按 `verifiedPlatformRows.ts` 同一口径预推，**每站开工仍需宿主实测确认**（先查实再动笔）。12 站现状一律为
「命中 `remaining-t1` 占位 → `fields=0` → 配置页零 ⓘ」，动态实例 key 走 registry 回落链可达（已核对 `dynFallback=Y`）。

| # | 平台 | platformKey | 预计行数 | 鉴权键 / 引导锚点 | 与同族已回填站的差异（写文案时必须另查） |
|---|---|---|---|---|---|
| 12 | Vitepress | `github_Vitepress` | **20** | `password` / `token` | `yamlLinkSupported=false` → **无**「YAML永久链接」行；`defaultPath=docs`、`[slug].md`、图片 `[docpath]/images` + `./images` |
| 13 | Astro | `github_Astro` | **20** | `password` / `token` | 同上无开关行；`defaultPath=src/content/blog`、`imageStorePath=public/images`、`imageLinkPath=/images` |
| 14 | Gitlabhexo | `gitlab_Gitlabhexo` | **21** | `password` / `token` | GitLab 族的 `home`/`apiUrl`/`tokenSettingUrl` 是占位串 `[your-gitlab-home]`/`[your-gitlab-api-url]`/`[your-gitlab-host]/-/user_settings/personal_access_tokens`；`defaultPath=source/_posts` |
| 15 | Gitlabhugo | `gitlab_Gitlabhugo` | **21** | `password` / `token` | `defaultPath=content/post` |
| 16 | Gitlabjekyll | `gitlab_Gitlabjekyll` | **21** | `password` / `token` | `defaultPath=_posts` |
| 17 | Gitlabvuepress | `gitlab_Gitlabvuepress` | **21** | `password` / `token` | `defaultPath=docs` |
| 18 | Gitlabvuepress2 | `gitlab_Gitlabvuepress2` | **20** | `password` / `token` | 无开关行；`defaultPath=src/post` |
| 19 | Gitlabvitepress | `gitlab_Gitlabvitepress` | **20** | `password` / `token` | 无开关行；`defaultPath=docs` |
| 20 | Gitlabastro | `gitlab_Gitlabastro` | **20** | `password` / `token` | 无开关行；`defaultPath=src/content/blog`；该站构造里显式置 `picbedService=Bundled` |
| 22 | Typecho | `metaweblog_Typecho` | **7** | `password` / `password` | `passwordType=Password`（**引导锚点不是 `token`**）；`previewUrl=/index.php/archives/[postid]`；`knowledgeSpaceEnabled=false` → 无发布目录行；图床默认 `None` |
| 23 | Jvue | `metaweblog_Jvue` | **7** | `password` / `password` | `previewUrl=/post/[postid].html`、`pageType=Markdown`；无发布目录行 |
| 26 | Wordpress.com | `wordpress_Wordpressdotcom` | **7** | `password` / `password` | `previewUrl=/?p=[postid]`、`pageType=Html`、`apiUrl` 由 `WordpressUtils.parseHomeAndUrl` 推出；无发布目录行 |

**共同动作（12 站一致）**
1. 从 `remaining-t1.ts` 删该行 → 新建 `platform-config/<platform>.ts`（`helpUrl`+`summary`+`fields`+`faq`+`tour`）→ 在 `pages/index.ts` 注册 → 纳入 `registry.spec.ts` 的 `verifiedConfigs`。
2. **在 `verifiedPlatformRows.ts` 补该站一行**（键集取上表行数对应的真实渲染行）——不补则**守卫尺③**当场点名该页（这是设计好的防线）。
3. 补 `docs/draft/platforms/<platform>.md`（顶部标 `TODO：待替换真实帮助文档链接`）。
4. `pnpm vitest run` + `pnpm build:v2` → 宿主重载 → 两条宿主尺（`tmp/host-field-guide-check.ps1`、`tmp/host-help-gate-check.ps1`）`exit 0` → 截图 → **停下等验收**。
5. 用户可见文案不得写验证进度类叙述；GitLab 族复用 `[your-gitlab-*]` 占位串的事实要如实写进字段指引。

**两处需宿主确认（预分析发现，勿凭推断下结论）**
- **GitLab 族查看链接规则**：`commonGitlabApiAdaptor.ts:202-213` 复用 GitHub 族同一套 `previewUrl` 规则
  `/[user]/[repo]/blob/[branch]/[docpath]`，且返回时不前置站点域名。该链接能否打开属「查看」格要点，**须逐站实测**。
- **GitLab 族图床**：仅 `gitlab_Gitlabastro` 在构造里置 `Bundled`，其余 6 站取自 `CommonGithubConfig` 默认；
  图片两行（`imageStorePath`/`imageLinkPath`）按**当前图床值**渲染，故各站行数须以宿主实测为准（上表按默认值预推）。

**工作量提示**：GitHub 族 2 站可大量复用 `github-vuepress2.ts` / 已回填 6 站的 `fields` 文案（仅改平台专属值）；
GitLab 族 7 站彼此高度同构，可先做 `gitlab_Gitlabhexo` 定稿文案再逐站差异化；MetaWeblog/Wordpress 3 站最轻。

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
