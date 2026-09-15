> 推进方式（用户 2026-09-07 要求）：共用层先在试点平台 #11 Vuepress2 与真实表单对齐定稿；此后**每完成一个平台即停下提交宿主证据，等验收通过再做下一个平台**，不一次性铺开 22 站。

## 1. pageId 下发与解析

- [x] 1.1 `V2PlatformConfigBridge.vue` 以单一常量键 `provide()` 已算出的 `'platform-config/' + platformKey`，与 `HelpButton` 使用同一个值（不得出现第二处拼接）。
- [x] 1.2 共用表单侧 `inject` 该值并传给 `FieldGuide`；无 provider 时（V1 路径、组件单测）不渲染指引且不影响布局。
- [x] 1.3 确认动态实例 key（`github_Vuepress2-ig1w6`）经 `registry` 回落链解析到预置平台 `fields`，与 `summary`/`faq`/`tour` 同一条链。

## 2. FieldGuide 挂载（共用组件逐个，覆盖全部平台）

- [x] 2.1 `base/CommonBlogSetting.vue`：平台首页、API 地址、用户名、鉴权行（`password`/`token`/`cookie` 三分支同键 `password`）、预览规则、发布格式、发布目录（`blogid`）、图床服务、跨域代理地址、CORS 代理行。
- [x] 2.2 `base/impl/CommonGithubSetting.vue`：仓库名、分支、存储目录、文件规则、文章预览规则、YAML 预设配置、图片存储目录、图片访问链接、折叠高级四项；「YAML永久链接」行沿用 `yamlLinkSupported` 条件。
- [x] 2.3 `base/impl/MetaweblogSetting.vue` 专有行（待对应族首个平台开工时挂）。查实结论（2026-09-12）：`base/impl/MetaweblogSetting.vue`、`metaweblog/WordpressSetting.vue`、`metaweblog/CnblogsSetting.vue` 都是渲染 `<common-blog-setting>` 的**直通壳**，无自有行 → 文件本身无需改动，MetaWeblog/WordPress 族的行与指引全部继承 2.1 的共用表单。**E 组 #21 博客园（2026-09-13）、#25 Wordpress（2026-09-14）宿主实测各 7 行 = 7 指引，零新挂，本项随之完成**。查实结论（2026-09-12，#27 语雀网页版）：`base/impl/CustomWebSetting.vue` 只是 `CommonBlogSetting` 的透传壳、无自有行；`base/CookieSetting.vue` 是 V1 旧表单（V1 零改动，不挂）；网页 Cookie 族的鉴权行（授权面板 + 手动文本框两个控件）由 `CommonBlogSetting.vue` 以**整行一条 `password` 指引**统一覆盖，已在 #27 定稿。
- [x] 2.4 `commonblog/YuqueSetting.vue`、`NotionSetting.vue`、`ConfluenceSetting.vue`、`HaloSetting.vue`、`TelegraphSetting.vue` 与 `fs/LocalSystemSetting.vue` 的专有行。查实结论（2026-09-12，组件逐文件清点 `field-guide`/`el-form-item` 计数）：`ConfluenceSetting.vue`（1 行 `parentPageId`，2 处指引）与 `TelegraphSetting.vue`（4 行，8 处指引）已随各自平台站点挂好；`YuqueSetting.vue`/`NotionSetting.vue`/`HaloSetting.vue` 均为 0 行外壳，无专有行可挂；**`fs/LocalSystemSetting.vue` 的 3 行已在 #29 本地系统站点挂完**（存储路径 `storePath`、媒体存储路径 `imageStorePath` 包裹式，YAML 类型 `fsYamlType` 单选组 `inline`），宿主实测 **5 行 = 5 指引**、`notSameLine=[]`。
- [x] 2.5 无对应配置属性的行（检索关键词行绑 `formData.ksKeyword`、验证行）不挂指引 —— 用户 2026-09-09 确认「保持现状」：这类行属标准内的显式不挂例外，步骤 F 的键校验不为此开非属性键白名单。
- [x] 2.6 宿主复核弹层定位：`el-tooltip` 设 `:teleported="false"` 后 popper 留在 `.syp-panel` DOM 内（`panel.contains(popper) === true`），逐行滚入视区后弹层完整可见、无裁切与错位；字段已填值时指引仍在。
- [x] 2.7 呈现硬性要求（用户看图定稿）：指引与控件**必须同行**（FieldGuide 包裹控件，`inline` 供开关/单选组紧贴、`tall` 供文本域贴首行）；图标用 `@element-plus/icons-vue` 官方 `InfoFilled`，不手写 path；视觉权重压到安静档——14px + `--el-text-color-placeholder` + hover 主色 + tooltip `show-after 150ms`，不与输入内容争注意力。

## 3. `fields` 键约定与回归

- [x] 3.1 明确并落文档：`fields` 键 = 该行绑定的配置属性名（鉴权行为 `password`，与 tour 锚点 `token`/`cookie` 分属两套命名空间）。
- [x] 3.2 新增校验：每个已验证平台的 `fields` 键必须能在其合并后配置实例上取到同名属性；键写错即失败。**已落地** `src/helpConfigs/fieldGuideRulers.spec.ts` 尺子①（连同覆盖尺② 与守卫尺③），键集 SSOT 为 `src/helpConfigs/verifiedPlatformRows.ts`；22 站全绿，并经变异验证（塞入死键 `cookie` 时尺子① 直接点名 `custom_Csdn.cookie`）。
- [x] 3.3 试点平台 `github-vuepress2.ts` 键与真实渲染行逐行对齐，补齐 `blogid`/`imageStorePath`/`imageLinkPath`/`dynYamlCfg`/`defaultMsg`/`author`/`email`/`site`。
- [x] 3.4 其余 21 站 `fields` 键校准（`token`/`cookie`→`password`、`knowledgeSpace`→`blogid`）与缺项补齐：逐站推进，每站停下验收，**22 站已全部完成并逐站验收**。旧键 `cookie`/`knowledgeSpace`/`token` 在配置实例上根本不存在（属永不可达的死文案），改名后由尺子① 兜住；缺项补齐以宿主实测渲染行为准（平台 hook 会改开关）。逐站证据见 `.planning/2026-09-07-add-field-guide-tips/task_plan.md` 与 checklist「字段指引与帮助引导（SOP §3.5）— 22 站回写」。
- [x] 3.5 保持 `tourAnchors.spec.ts` 的锚点校验独立通过（两把尺子互不代替）。锚点校验与键尺各跑各的：两者在 309 项全量测试中同时通过（2026-09-12）。

## 4. 字段指引单一来源

- [x] 4.1 逐平台把 V2 表单 placeholder 从长说明改为示例值（如 `src/post`、`/post/[postid].html`），同一次改动内确保对应 `fields` 已含说明，不出现说明空窗。**已完成**：新增 `src/composables/useFieldPlaceholder.ts` —— 有 `pageId` 注入时才用 `fields.placeholder`，否则原样返回调用方文案；`pageId` **仅**由 V2 的 `V2PlatformConfigBridge` 提供（V1 走 standalone 路由无 provider），因此 **V1 界面文案零变化**，无需在两个入口间分支。共用表单 `CommonBlogSetting.vue`（5 行）与 `CommonGithubSetting.vue`（12 行，GitHub/GitLab 两族共用）共 **17 行**接入，全部走 `ph('<字段>', 原文案)`。数据侧按各站真实默认值补 `placeholder` 示例值：**34 站 / 343 处**（GitHub 族 8 站与 GitLab 族 7 站各 17、其余按该站实际存在的行），示例值一律取中性样例（`your-github-name`、`ghp_xxxxxxxxxxxxxxxxxxxx`、`you@example.com` 等），**不使用维护者个人信息**。新增**尺子⑤示例尺**把「示例值只能是可照抄的短样例、且必须与该字段的说明同源共存、凭据类不得形似真实值」钉死，并经三次变异验证（真实形态令牌 → 红并点名 `github_Hugo fields.password 的示例值疑似真实凭据`；160 字符长文 → 红并点名 `示例值过长（160 > 60）`；还原后全绿）。新增 `useFieldPlaceholder.spec.ts` 钉住四条边界（V1 无注入回退 / V2 取示例 / 无示例值回退 / 未登记字段回退，不产生空串）。宿主复核 `github_Hexo` 配置页：13 个输入框占位符**全部**变为示例值（平台首页 `https://github.com`、存储目录 `source/_posts`、YAML预设配置 `{"comments": true}`…），同时该行 ⓘ 仍为「GitHub 首页地址，默认 https://github.com。」——说明归 ⓘ、示例归占位符，两处各司其职。**未开工时遗留的「占位符仍是 `setting.blog.*.tip` 共享串」问题已消除**。回归：`pnpm vitest run` **67 文件 / 319 测试**全绿、`pnpm build:v2` 通过、`openspec validate --strict` 通过。
- [x] 4.2 locales 的 `setting.blog.*.tip` 共享串保持不动，确认 V1 界面文案零变化。本 change 全程未触碰 `siyuan/i18n/*.json`（`git log --since=2026-09-07 -- siyuan/i18n` 为空），V1 路径与文案零改动。
- [x] 4.3 去重：tour `content` 只讲操作顺序，字段含义归 `fields`；发现同一句话在三处各写一遍时收敛为一处。**已完成**：对全部 34 站逐条比对（脚本按归一化去空白/标点判定「同一句话」，`EXACT` = 完全相同、`CONTAINED` = 一方包含另一方且长度均 ≥12），审计出 **52 处**重复、集中在 17 站（GitHub 族 8 站各 4 处、GitLab 族 7 站各 2 处、`common_Halo` 4 处、`common_Telegraph` 2 处），其余 17 站为 0。按方案甲把这三类步骤（`home`/`apiUrl`/`username`/`pageType`）的 tour 改为只讲操作顺序，字段含义完整保留在 `fields.tip`（同一次改动内完成，不留说明空窗）；复跑审计 **52 → 0**，只改 `tour.content`、`target`/`title` 与 `fields` 零改动。新增**尺子④分工尺**（`fieldGuideRulers.spec.ts`）把「引导不得重写字段说明」钉死，并经变异验证（把 Hexo 首页引导改回与 `fields.home` 一字不差 → 尺子红并点名 `github_Hexo tour「首页地址」重复了 fields.home`，还原后全绿）。宿主复核：`github_Hexo` 配置页引导 **8/8** 步渲染为新文案，同时 `home` 行 ⓘ 仍为「GitHub 首页地址，默认 https://github.com。」——两条信息各讲一遍、不再重复。

## 5. 验证与记录

- [x] 5.1 试点增量：全量 `pnpm vitest run`（65 文件 / 309 测试）通过、`pnpm build:v2` 通过。
- [x] 5.2 宿主逐族复核：GitHub、Custom Web、Common、MetaWeblog、WordPress、LocalSystem **六族各站全部完成**（GitHub 6 站、Common 5 站、Custom Web 8 站、MetaWeblog #21、WordPress #25、LocalSystem #29），每站均为「改前 → 改后」实测并逐站停下待验收；判定项含每行 ⓘ、已填值仍可见、弹层 `.syp-panel` 内不裁切、HelpPanel 专属内容、引导步骤命中。
- [x] 5.3 SOP §3 增补「字段指引单一来源」条目，供后续平台验证沿用。**已写入** `docs/draft/platform-verification-sop.md` 第三节第 5 条「字段指引必须渲染并可核验」（标准、两套命名空间、四个核验点、组件挂载约定、回归尺入口），并在 §5 回写步骤与附录 22 站清单中同步。
- [x] 5.4 checklist 记录本 change 落地（不改动任何平台六格结论，仅修正字段说明相关表述）。**已写入** SSOT `platform-checklist.md` 新增「字段指引与帮助引导（SOP §3.5）— 22 站回写」表 + 2026-09-14 修订记录一行；**各平台六格状态未变**。
