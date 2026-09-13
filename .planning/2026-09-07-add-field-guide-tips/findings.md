# 发现与决策：字段级指引接线（add-field-guide-tips）

## 需求
- 用户 2026-09-07 指令：**不延后**——把 `add-field-guide-tips` 现在实现并回填到所有已验证平台；后续每站验证把「字段指引真实渲染」当作**必须通过**的点。
- 排序原则：最大扩展性 > 可用性 > 维护成本；功能 100% 保留（V1 文案与行为不动）。

## 关键事实（均来自代码与配置，非推测）

### 1. `fields` 是零呈现的载荷
- 唯一消费方 `src/components/common/help/FieldGuide.vue:21` `helpRegistry.getField(pageId, field)`；该组件在全仓 **无任何引用**（`grep fields|getField` 在 `src/components/common/help` 只命中它自己）。
- `HelpPanel.vue` 只渲染 `summary` / 「查看完整帮助文档」 / `faq` / 引导按钮，**不渲染 `fields`**。
- 18 份平台 help 配置都带 `fields`，且 `registry.spec.ts` 的 `verifiedConfigs` 强制其非空 → 数据在维护，呈现为零。

### 2. 字段说明现在挤在 placeholder 里，且填值即消失
- 各平台薄壳 `*Setting.vue` 把 locales 长说明注入 placeholder，例：`Vuepress2Setting.vue:27-31`（`homePlaceholder`/`apiUrlPlaceholder`/`passwordPlaceholder`/`previewUrlPlaceholder` ← `t("setting.blog.*.tip")`）。
- 后果：输入框一旦有值，说明不可见；而「已填好、要复核/改配置」正是最需要说明的时刻。

### 3. 两套命名空间（最易踩的坑）
- tour 面向**真实渲染锚点**：鉴权行按 `passwordType` 只渲染 `password`/`token`/`cookie` 三选一；`knowledgeSpace` 是发布目录行锚点；**不存在 `defaultPath` 锚点**。
- `fields` 应面向**配置属性名**：三条鉴权分支 `v-model` 全部绑 `cfg.password`（`CommonBlogSetting.vue:405/422/451`），所以 token 型、cookie 型平台的鉴权 tip 键都必须是 `password`。
- 现有配置因此不合规：`token` 键（notion、yuque）、`cookie` 键（bilibili/csdn/haloweb/jianshu/juejin/wechat/yuqueweb/zhihu）、`knowledgeSpace` 键（confluence/notion/yuque/bilibili/jianshu/juejin/yuqueweb/zhihu —— 该行实际绑 `cfg.blogid`）。
- `registry.spec.ts:103` 现有用例按 `'token'` 取 Yuque 的字段 tip，改名后要同步。

### 4. 布局约束
- `CommonBlogSetting.vue:366` 是 `label-width="96px"` 的窄标签列，中文标签（如「YAML预设配置」）已顶格 → ⓘ 不能进 label 插槽，改挂控件列尾部（`.el-form-item__content` 已是 flex + `gap 6px`，且鉴权行本就在此放 `<a>` 生成地址链接，`CommonBlogSetting.vue:409/426`）。
- `imageStorePath`/`imageLinkPath` 两行仅在 `picbedService === Bundled` 时渲染（`CommonGithubSetting.vue:125/135`）；「检索关键词」行绑的是 `formData.ksKeyword`，不是配置属性，不该挂字段指引。

### 5. pageId 来源已存在，不必新造规则
- `V2PlatformConfigBridge.vue:8` 已算 `'platform-config/' + platformKey` 给 `HelpButton`；同文件 `:115` 已有 `provide(V2_PLATFORM_CONFIG_ACTION_BRIDGE_KEY, …)` 先例，`CommonBlogSetting.vue:58` 已 `inject(…, null)` 并按空值降级 —— 复用这一模式即可，无 provider 时不渲染图标。

### 6. 宿主弹层风险（必须最早定稿）
- `el-tooltip` 默认把 popper 传送到 `body`；本插件挂在思源 popup/面板容器内（AGENTS.md 容器约束：弹窗用 `.syp-panel` 内 `position: absolute`，`el-dialog` 需 `:append-to-body="false"`）。
- **已定稿（步骤 A.7 宿主结论）**：`FieldGuide` 的 `el-tooltip` 采用 `:teleported="false"`，popper 渲染在 `.syp-panel` DOM 内（`panel.contains(popper)=true`），逐行滚入视区后弹层完整可见、无裁切错位；无需再评估传送 body 的方案。

### 7. 回归可钉死的形式
- 键合法性：`safeMergeConfig("{}", <Platform>Config, […])` 得到的实例上 `key in cfg` 必须成立 → 直接抓出 `token`/`cookie`/`knowledgeSpace` 这类错键。
- 覆盖率：按族定义 `REQUIRED_FIELD_KEYS`（GitHub 族含 `githubRepo`/`defaultPath`/`mdFilenameRule`/`previewPostUrl`/`imageStorePath`/`imageLinkPath`/`dynYamlCfg` 等），新平台漏配即红。
- 已有同族先例：`yamlLinkCapability.spec.ts` 用转换器真实输出反查能力位（9 站全枚举）。

## 改名与补配清单（阶段 2 执行依据）
| 配置 | 改名 | 需补 tip |
|---|---|---|
| common-notion / common-yuque | `token`→`password`；`knowledgeSpace`→`blogid` | `middlewareUrl`/`corsAnywhereUrl` 视该行是否渲染 |
| custom-{bilibili,csdn,haloweb,jianshu,juejin,wechat,yuqueweb,zhihu} | `cookie`→`password`；其中 6 份 `knowledgeSpace`→`blogid` | `home`/`apiUrl` 缺失者补齐（yuqueweb 现无 home/apiUrl） |
| common-confluence | `knowledgeSpace`→`blogid` | 保留 `parentPageId` |
| GitHub 族 6 份 | — | `imageStorePath`、`imageLinkPath`、`dynYamlCfg`、高级四项；hexo/hugo/jekyll/quartz/vuepress 另加 `yamlLinkEnabled` |
| metaweblog-cnblogs | — | 现仅 4 键，按 `MetaweblogSetting.vue` 实际行补齐 |
| telegraph | — | 现缺 `picbedService`；`saveHash`/`corsAnywhereUrl` 保留 |
| fs-local-system | — | 已有 `storePath`/`imageStorePath`/`fsYamlType`，核对 `pageType`/`picbedService` 是否渲染 |

## 呈现方式返工（2026-09-08 用户看图验收不通过，两个缺陷）

### 缺陷 1：图标看不清
- 根因：`FieldGuide` 里手写了 svg `path`，颜色又取 `--el-color-info-light-3`（浅灰）→ 浅色背景上渲染成一团灰点，「i」笔画不可辨。
- 修复：改用 `@element-plus/icons-vue` 官方 `InfoFilled` 组件（该版本无描边版 `Information`，已在 `dist/types/components/index.d.ts` 核对），`font-size:16px`、颜色 `--el-text-color-regular`（#606266）、hover 变主色、`cursor: help`。宿主实测 svg 渲染 16x16、`path` 长度 624（官方字形）、`color=rgb(96,98,102)`。
- 教训：**图标一律用官方组件，不手写 path**。

### 缺陷 2：ⓘ 掉到控件下一行
- 根因：EP `.el-form-item__content` 默认 `flex-wrap: wrap`，而 `el-input`/`el-select` 宽 100% 撑满整行 → 作为**兄弟节点**的 ⓘ 被挤到下一行（截图里每个输入框下方各一个孤立 ⓘ）。
- 修复：`FieldGuide` 由「兄弟节点」改为**包裹控件**：`<field-guide field="x"><el-input/></field-guide>`；内部 `display:flex; align-items:center; gap:4px; width:100%`，控件列 `flex:1 1 auto; min-width:0` → 控件与 ⓘ 恒在同一行，ⓘ 在行尾对齐成一列。
- 两个变体：`inline`（开关、单选组等不撑满行的控件，ⓘ 紧贴控件）、`tall`（文本域，ⓘ 贴第一行不居中）。已用于 `pageType`/`picbedService`/`yamlLinkEnabled`（inline）与 `dynYamlCfg`/Cookie 文本域（tall）。
- 宿主实测：20 行全部 `sameLine=true`、`gap=4px`，无例外。
- 影响：**后续所有平台挂载一律用包裹式写法**（`CommonBlogSetting` + `CommonGithubSetting` 共 26 处已全部改造），步骤 C/D/E 挂专有表单时照此办理。

### 视觉权重（用户第二轮意见：不要喧宾夺主）
- 一屏 16–20 个指引，若按 16px + `--el-text-color-regular`（#606266）会与输入内容争注意力；仓库既有的页面级帮助按钮 `HelpButton.vue` 用 `--el-color-info-light-3` + hover 变主色的弱化处理。
- 定稿：`font-size 14px`、`color var(--el-text-color-placeholder)`（#a8abb2，EP 的「安静图标」语义 token）、hover 提亮为主色、`cursor: help`；tooltip 加 `:show-after="150"` 避免鼠标划过时闪烁。宿主实测 `14x14` / `rgb(168,171,178)`，弹层仍在面板内正常显示。
- 可选更强档（未采用，等用户点头再加）：默认 `opacity 0`，仅 `.el-form-item:hover` 时淡入——更干净但牺牲可发现性。

## #6 Hexo / #7 Hugo 复核出的事实（写文案的依据，勿凭记忆）
- **Hexo**：`hexoYamlConverterAdaptor.ts:66-91` 在 `yamlLinkEnabled` 时写 `permalink`，取值**来自 `previewPostUrl`**（`[postid]`→`wp_slug`，支持 `[yyyy]/[MM]/[mm]/[dd]/[cats]`）；`:95-104` 的 `dynYamlCfg` 最后合并、同名覆盖。
- **Hugo**：`hugoYamlConverterAdaptor.ts:37-38` 写的是 **`url`**，且取值**硬编码** `/post/<wp_slug>.html`，**不读 `previewPostUrl`**。原 help `previewPostUrl` tip 与 faq、以及 `docs/draft/platforms/github-hugo.md` 第 33/46 行都写成「与文章预览规则一致」——只是默认值恰好相同，规则一改就不成立，本次一并纠正。
- **图片路径口径**（`commonGithubApiAdaptor.ts:257/315-343`）：`imageLinkPath` 以 `[docpath]` 开头→按文章目录解析；以 `./`、`../` 开头→保留相对前缀、不加站点根斜杠；否则→去前导斜杠后统一前置 `/`。所以 Hugo 的 `images` 实际引用为 `/images/<名>`，Hexo 的 `../images` 为相对引用——tip 文案按此区分。
- 两站 `picbedService` 均默认 `Bundled`（`commonGithubConfig.ts:117`）→ 图片两行必然渲染；`knowledgeSpaceEnabled=true` + `allowKnowledgeSpaceChange=false` → 发布目录行只读且镜像 `defaultPath`（`syncDefaultPath` 写回 `blogid`）。
- GitHub 族 `fields` 键**本来就是配置属性名**，这两站零改名，只补 9 键。

## 宿主量测口径（已踩平的坑）
- **不要拿「最后一个可见 `.el-popper`」当本行 tip**：EP 的 tooltip 隐藏后仍可能被 `getComputedStyle` 判为可见，弹层会累积（#8 实测 `popperCount` 1→2→3），于是上一行文案被错记到本行（`site` 一度显示成 `blogid` 的文案）。等「可见数为 0」也不可靠，同理。
- **可靠口径**：hover 前先快照所有可见弹层的 `textContent`，hover 后取**差集**里的那个；或干脆不依赖 hover——用 `helpRegistry.getField(pageId, key)` 在 vitest 里逐键核验（数据路径与组件完全一致），渲染路径由已验收的共用层保证。
- 两种口径本次都用了：宿主 hover 差集 + 21 键 registry 全绿。

## #8 Jekyll 复核出的事实（同族三站各不相同）
- `jekyllYamlConverterAdaptor.ts:43-68`：`permalink` **无条件写入**；`yamlLinkEnabled` 且 `previewPostUrl` 非空时取其值并只替换 `[postid]`（日期/分类占位符那段是注释掉的），否则固定 `/post/<文章别名>.html`。→ 原 tip/faq/文档写「关闭时交给 Jekyll 默认 permalink」是错的，已改。
- 同文件 `:87-97`：`dynYamlCfg` **留空**才写 `layout: post` + `published: true`；**一旦填写就只合并用户键**（不再补这两项）→ tip 与文档已明确「需自行包含 layout、published」。
- `jekyllConfig.ts`：`_posts`、`[yyyy]-[mm]-[dd]-[slug].md`、`assets/images`（存储与引用同名，按 `getImagePath` 规则引用为 `/assets/images/<名>`）。

## #9 Quartz 复核出的事实 + 一处跨站修正
- `quartzYamlConverterAdaptor.ts:59-86`：`permalink` **仅在 `yamlLinkEnabled` 时写入**（与 Jekyll 相反），取值来自 `previewPostUrl`，且 `[postid]`、`[yyyy]/[MM]/[mm]/[dd]`、`[cats]` **全部生效**（与 Hexo 同级、比 Jekyll 多）；规则留空时退化为 `/post/<文章别名>.html`。
- 同文件 `:89-98`：`dynYamlCfg` 留空时写的是 `enableToc: true` + `enableBackLinks: true`（**不是** Jekyll 的 `layout`/`published`）；一旦填写则只合并用户键。→ 每站的 `dynYamlCfg` tip 必须按各自转换器实写字段逐站核对，不能套模板。
- `quartzConfig.ts:44-45`：`knowledgeSpaceEnabled=true`、`allowKnowledgeSpaceChange=true`（GitHub 族里唯一可改选发布目录的一站）。
- **跨站修正**：`allowKnowledgeSpaceChange` 全仓只被 `SinglePublishDoPublish.vue:447`（快速发布页 `readonlyMode`）消费，**设置页的发布目录 `el-select` 从不据此禁用**（宿主实测 Jekyll：`select.classList.contains('is-disabled')=false`、`input.disabled=false`）。此前五站 `blogid` 写的「只读，与存储目录保持一致」不准确 → 已统一改为「验证通过后下拉可选；改『存储目录』会同步覆盖；快速发布页里只读（Quartz 为可改选）」。

## 宿主核验操作要点（本轮踩到的）
- **账号行按钮随状态变化**：`未启用/已禁用` 的行上是「去授权」而不是「管理」→ 定位行时必须按 `.syp-account-item` 且校验行内文本，不能只按祖先层数找第一个「管理」（曾误开 `fs_LocalSystem` 表单）。
- **缺可用账号时用「添加账号 → 该平台卡片」**开临时表单核验：不点保存/验证即不落库（Hugo、Quartz 两次都确认列表里仍只有原账号）。
- **弹层可见性判定**：用 `getComputedStyle` 过滤（`opacity>0.1` 等）会把 EP 的 `.el-popper` 全部滤掉（实测 `added:0`）；用 `x.style.display !== 'none'` 才取得到。归属仍靠 hover 前后**文本差集**（本轮 5 条 `visible:1 / added:1`，无累积）。

## 工具事实：chrome-devtools MCP 掉线后的替代通道
- 本次 MCP 的 `mcp__chrome-devtools__*` 从会话工具表里消失（宿主被关闭后掉线），恢复需重启 DSH Web——会打断当前会话，不该自动做。
- 替代：PowerShell + `ClientWebSocket` 直连 9222 的 CDP（`Runtime.evaluate` + `awaitPromise`/`returnByValue`、`Page.captureScreenshot`），脚本已固化在 `tmp/cdp-eval.ps1`、`tmp/cdp-shot.ps1`（`tmp/` 已 gitignore，属研究/调试工具不入库）。注意 `Runtime.evaluate` 响应路径是 `$result.result.result.value`。
- 思源可用 `C:\Program Files\SiYuan\SiYuan.exe --workspace="D:\Users\Administrator\Documents\mydocs\SiyuanWorkspace\test" --remote-debugging-port=9222` 拉起，约 3 秒 9222 就绪；内核端口每次随机（本次 59072）。

## #10 Vuepress 复核出的事实（GitHub 族收尾，六站差异定档）
- `vuepressYamlConverterAdaptor.ts:88-92`：`permalink` **仅当 `yamlLinkEnabled && post.wp_slug`** 时写入，取值**硬编码** `/post/<文章别名>.html`，不读 `previewPostUrl`（同 Hugo 的性质、字段名同 Hexo）。文档草稿 L34 的「与文章预览规则一致」已改准。
- 同文件 `:94-114`：**只有这一站**把 `author` 写进文章头 —— `author: { name: cfg.author ?? "terwer", link: cfg.site }`，`site` 留空时回退 `home + "/" + username`。所以 Vuepress 的 `author`/`site` tip 必须写「影响文章 Front Matter」，其余五站写「仅作 commit/账号信息」。
- 同文件 `:121-131`：`dynYamlCfg` 留空**不补任何字段**（Jekyll 补 `layout`/`published`、Quartz 补 `enableToc`/`enableBackLinks`、Hexo/Hugo/Vuepress2 亦不补），且合并发生在 `author` 之后 → 同名键会覆盖 `author`。
- `vuepressConfig.ts`：`defaultPath=docs`、`mdFilenameRule=[filename].md`、`imageStorePath=docs/.vuepress/public/images`、`imageLinkPath=images`（按 `getImagePath` 规则引用为 `/images/<名>`）、`allowKnowledgeSpaceChange=false`。
- 六站 `permalink`/`dynYamlCfg` 差异汇总已写进 `task_plan.md`「GitHub 族 6 站已完成」，作为后续各族「不许套模板」的依据。

## #1 语雀（C 组首站）事实
- `YuqueSetting.vue` **没有平台专有行**：只有会员提示 alert + `<common-blog-setting>` → 共用层已挂的 ⓘ 已覆盖全部 8 行，本站零挂载。
- `yuqueConfig.ts` + `useYuqueApi.ts:64-69`：`passwordType=Token`（行标签「鉴权token」，但绑的是 `cfg.password` → 键必须是 `password`）、`knowledgeSpaceEnabled=true`、`knowledgeSpaceTitle="知识库"`（行标签是「知识库」，键仍是 `blogid`）、`allowKnowledgeSpaceChange=false`、`allowPreviewUrlChange=false`、`picgoPicbedSupported=true`、`bundledPicbedSupported=false`、`cateSearchEnabled=false`（默认，检索行不出现）。
- 图床选项实测为 `["不使用","PicGo 强烈推荐"]` → 原 tip 与文档草稿「语雀使用内置图片链路」是**错的**（Bundled 根本不提供），已改准。
- `previewUrl` 固定 `/[notebook]/[postid]`；`BlogConfig` 默认 `picbedService=None`。
- `registry.spec.ts:103-104` 原按 `'token'` 取 Yuque 字段 tip，已随改名同步为 `'password'`。

## 操作教训：「添加账号」是否落库按平台不同
- GitHub 族（Hugo、Quartz）走「添加账号 → 卡片」开表单后不保存即不落库；**Common 族（语雀）点卡片就直接创建并持久化**一个空账号（本次多出 `common_Yuque-1ma2ix`，账号数 32→33）。
- 规矩：凡用「添加账号」开临时表单核验，**事后必须回列表比对账号数并删除多余行**（删除是行内二次确认：点「删除」→ 该行出现 `.syp-confirm-bar__btn`「确认」）。本次已删回 32 行、只剩原 `common_Yuque`。
- 更稳的做法：优先用已有账号进配置页；「添加账号」只在必须时用，且事后比对账号数清理。

## #2 Notion 事实 + 一处按钮语义澄清
- **`去授权` 与 `管理` 是同一个按钮**：`V2AccountList.vue:106-108` 里 `@click="$emit('configure', …)"`，文案只是 `item.isAuth ? 管理 : 去授权`。所以未启用/未授权账号也能直接点它进配置页，**不必**为了核验去启用账号或新建账号（修正上一条里「未启用行没有管理就进不去」的判断）。
- `NotionSetting.vue` 无平台专有行（只有 `<common-blog-setting>`）→ 零挂载。
- `notionConfig.ts:24-33` + `useNotionApi.ts:63-69`：`passwordType=Token`（键 `password`）、`usernameEnabled` 未开（**无用户名行**）、`knowledgeSpaceTitle="根页面"`（键 `blogid`）、`allowPreviewUrlChange=false`、`cateSearchEnabled=true`（**「搜索关键词」行会渲染**）、`picgoPicbedSupported=true`、`bundledPicbedSupported=false`。
- **「搜索关键词」行是唯一无 ⓘ 的渲染行**：它绑 `formData.ksKeyword`（临时检索值，不是配置属性），按 change `tasks.md` 2.5 的规则不挂字段指引——这是标准内的显式例外，不是漏配。若你要给它也挂提示，需要另设一个非属性键（会让步骤 F 的「键必须是配置实例真实属性」那把尺子出现例外），需先改标准。
- 实测图床选项 `["不使用","PicGo 强烈推荐"]` → 原「Notion 无内置图片上传，使用 PicGo 外部链接图床」的 tip 已补准（含选「不使用」时的行为）。

## #3 Halo 事实 + 一项标准确认
- `HaloSetting.vue` 无专有行（只有「仅支持 Halo 2.9」提示 + 共用表单）→ 零挂载；现有 7 个 `fields` 键与宿主实测的 7 行**一一对应**（`rowsWithoutGuide=[]`），本站零改名零补键，只补准文案。
- `haloConfig.ts:27-38` + `useHaloApi.ts:60-70`：`usernameEnabled=true`、`passwordType` 未设（BlogConfig 默认 `0` = 密码，宿主行标签即「密码」）、`showTokenTip=false`、`allowPreviewUrlChange=true`、**`knowledgeSpaceEnabled=false`（无发布目录行）**、`picgoPicbedSupported=true` + `bundledPicbedSupported=true`（图床三项）。
- 图床**默认选中「不使用」**（宿主实测 `checked` 在「不使用」上）→ 原 tip/summary 暗示「图片由内置图床上传」不准确，已改为三项 + 默认值 + 各自行为；`password` 的 doc 链接补了 `linkText="Halo 配置说明"`（原来无 linkText 会显示通用「查看详情」）。
- **标准确认（用户 2026-09-09「保持现状」）**：非配置属性的行（搜索关键词、验证/保存按钮）不挂字段指引，步骤 F 的键校验不为此开白名单。

## #4 Telegraph 事实（首个有专有行的站）
- `TelegraphSetting.vue` 专有 4 行，全部是真实配置属性：`postType`（登录模式，header 插槽）、`accessToken`（仅登录模式渲染）、`saveHash`、`forceReAuth`（`telegraphConfig.ts:27-30` 声明）→ 本站首次给专有表单挂 ⓘ。
- `handlePostTypeChange`（`:38-42`）切换模式会清空 `password`/`accessToken`/`saveHash` → tip 里写明，避免用户以为填过的值还在。
- `telegraphApiAdaptor.ts`：登录模式缺 uuid/token/hash 直接抛错（`:34-37`）；匿名验证时从 Cookie 取 `tph_uuid` + `/check` 返回 `save_hash`（`:106-115`），`forceReAuth` 控制是否强制重取；发布走 `content.html` 表单（`:168-174`，`md(post.description)` 转换）；`getPreviewUrl`（`:296-306`）在 `isCorsProxy` 且填了代理时给查看链接加 `<代理>/<home>` 前缀。
- 图床：`picgoPicbedSupported=true`、`bundledPicbedSupported=false`（`useTelegraphApi.ts:58-60`），实测默认 checked 在「不使用」；平台无图片上传接口 → tip 如实写「图片只能外链」。
- **UI 用词一致性**：单选项目实文案是「匿名发布 / 登录发布」（locale `setting.telegraph.login.*`），我初稿写成「匿名用户 / 登录用户」→ 已按界面用词改回。教训：**tip 里引用界面元素名必须抄宿主实测文本**，不能按代码枚举名或语感推断。

## #5 Confluence 事实（C 组收尾）
- `ConfluenceSetting.vue` 有一个专有行：**父页面**（`parentPageId`，`confluenceConfig.ts:18/35` 真实属性）→ 已挂 ⓘ；它的选项来自 `getPagesBySpace(blogid)`，`@focus` 时按需拉取，且 `watch(blogid)` 变化时**清空 parentPageId**（`:51-83`）→ tip 写明这两点。
- `confluenceConfig.ts:23-35` + `useConfluenceApi.ts:53/69-77`：`usernameEnabled=false`（无用户名行）、`passwordType=Token`（键 `password`）、`knowledgeSpaceTitle="空间"`、`allowKnowledgeSpaceChange=true`、`previewUrl=/spaces/[spaceKey]/pages/[postid]` 固定、`pageType=Html`、**`picbedService=Bundled`（默认选「当前平台」）**、picgo+bundled 均支持。
- 发布格式行有平台专属 CSS：`ConfluenceSetting.vue` 的 `:deep(.el-radio-group .el-radio:first-child){display:none}` 隐藏 Markdown 单选 → 宿主实测 `Markdown.visible=false / HTML.checked=true`，tip 按此写「只提供 HTML 一项」。
- **「添加账号」落库行为再确认（Common 族）**：Confluence 与语雀一样，点卡片即创建并持久化（32→33）→ 核验后按「删除 → 行内『确认』」删回 32。规矩不变：临时账号用完必须清理并复核账号数。

## #27 语雀网页版事实（D 组 Cookie 族首站，挂载口径在此定稿）
- **网页族无专有行**：`YuquewebSetting.vue` 只有 `#header` 授权提示 + 透传插槽；全仓 9 个 `web/*Setting.vue` 逐个查 `#main`/`#footer` 均为 False。`CustomWebSetting.vue` 也只是 `CommonBlogSetting` 的透传壳 → **D 组工作量在共用层与各站 `fields` 键，不在逐站挂专有行**。
- **鉴权行「一条指引服务两个控件」**：V2 下该行渲染 `V2WebCookieAuthPanel`（去登录 / 自动读取 Cookie / 退出），手动文本框默认折叠。原实现把 `field-guide` 只包文本框 → 折叠态该行**没有 ⓘ**。定稿改法：`<field-guide field="password" tall>` 包住整行内容（新增 `.cookie-form-item__body` 容器：插槽面板 + 折叠文本框 + 提示），展开/收起 ⓘ 恒为 1。**这是 Cookie 族 8 站共用的挂载口径**，后续 7 站不再重新讨论。
- `YuquewebConfig.ts` + `useYuquewebWeb.ts:75-90`：`usernameEnabled=false`（无用户名行）、`passwordType=Cookie`（行标签由 `passwordLabel="Cookie"` 给定）、`knowledgeSpaceEnabled=true` 且标题「知识库」（键 `blogid`）、`picgoPicbedSupported=false` + `bundledPicbedSupported=true`、`picbedService=Bundled`、`allowPreviewUrlChange=true`；`home`/`apiUrl` 被 hook 固定为 `https://www.yuque.com`（用户改动会被覆盖）→ tip 写「固定、通常无需修改」；`cateSearchEnabled` 未设 → **无「搜索关键词」行** → 该平台渲染 **7 行**。
- `buildDocPayload`（`YuquewebWebAdaptor.ts:524-540`）写死 `format:"markdown"`、`body=post.markdown` → 发布格式 tip 写「按 Markdown 提交正文，保持默认」；`getPreviewUrl`（`:245-256`）按 `previewUrl` 模板替换 `{login}/{bookSlug}/{slug}` → tip 列出三个占位符。
- 宿主渲染事实：发布格式两项都可见（该平台无隐藏 CSS，区别于 Confluence）、Markdown checked；图床 `["不使用","当前平台 推荐"]`、checked=「当前平台」、无 PicGo 项 —— 与 tip 完全一致。
- 宿主路径（本族复用）：顶栏「发布工具」→ 设置 → 账号列表 → 目标账号行「管理」；**本站未用「添加账号」**，账号数 32→32，无落库清理动作。
- HelpPanel/TourGuide 判定口径：HelpPanel 元素是 `.syp-help-panel-popover`（Teleport 到 `.syp-v2`，**不在 `.syp-panel` 内**），查询不要用 `.syp-help-panel`；TourGuide 判「命中」看 `.syp-tour-overlay__highlight` 的 `display !== none` 且尺寸非 0，并注意 `--missing` 兜底弹层不出现。

## 步骤 F 前置审计（2026-09-12，第一把回归尺原型 + 兜底解析查实）
- **键尺原型跑过一遍**：`safeMergeConfig("{}", ConfigClass, ["","","","",""])` 建合并实例，断言每站 `fields` 键都在实例上 → **12 个已回填平台全部 `missing=[]`**（Vuepress2 20 键；Hexo/Hugo/Jekyll/Quartz/Vuepress 各 21；Yuque 8；Notion 7；Halo 7；Telegraph 12；Confluence 8；Yuqueweb 7）。脚本留档 `tmp/field-guide-key-audit.tmp.spec.ts`（vitest 只扫 `src/`，用前复制过去）。
- **平台配置页 fields 解析全景**（`helpRegistry.get()`）：22 个已验证平台命中各自专属文件且有键；**12 个未拆分平台命中 `remaining-t1` 占位配置（只有 helpUrl、无 fields）→ 这些页一个 ⓘ 都没有**（宿主实测 `github_Vitepress`：16 行、`field` 全为 `null`）；只有 `github_Docsify` / `gitlab_Gitlabdocsify` / `system_Siyuan` 真正落到 `platform-config/_default`（4 键），而这三者都不在 V2「添加账号 → 选择平台」列表里 → **兜底 fields 实际不可达**。诊断脚本留档 `tmp/field-guide-fallback-resolution.diag.spec.ts`。
- **`_default.ts` 清理**：原 `fields` 同时有 `password` 和 `token` 两个键，但鉴权行三种分支都绑 `password`，全仓没有任何 `field="token"` → `token` 是永不被解析的死键，违反「键 = 绑定属性名」冻结规则。已删该键，并把 `password` 说明改为「按平台要求填密码、Token 或 Cookie（不是登录密码）」。
- **操作教训修正（重要）**：「添加账号 → 选择平台卡片」**一律会持久化一个新实例**，与族无关。此前「GitHub 族（Hugo/Quartz）点卡片不落库」的结论是误判——那两站当时**已存在同 key 账号**，卡片不会新建；本次选 Vitepress 时账号数 32→33、多出 `github_Vitepress` 行 → 已按「删除 → 行内确认」删回 **32**。规矩不变：凡走「添加账号」，前后必须比对账号数并清理。
- **临时文件会被 `vue-tsc` 检查**：`pnpm build:v2` 先跑 `vue-tsc --noEmit`，`tmp/*.spec.ts` 也在检查范围内 → 放进 `tmp/` 的脚本必须类型正确，否则 `build:v2` 直接失败。

## 第二把回归尺原型（2026-09-12，按渲染行推导覆盖）
- 做法：从 `CommonBlogSetting.vue` 模板抽出**每行的渲染条件**（home/apiUrl/username/password/previewUrl/pageType/blogid/picbedService/corsAnywhereUrl/middlewareUrl），再叠加各族设置组件的专有行，得到「该站应覆盖的键集」，与各站 help 配置现有键做差集。脚本留档 `tmp/field-guide-family-coverage.diag.spec.ts`。
- **12 个已回填平台：全部 `missing=[] extra=[]`**（逐站键数与宿主实测行数一致：Yuque 8、Notion 7、Halo 7、Telegraph 12、Confluence 8、GitHub 六站 20/21、Yuqueweb 7）→ 覆盖尺与站点工作互相印证。
- **两个「推导陷阱」（F 正式尺子必须绕开）**：
  1. **构造函数默认值不够**：平台 hook 会在运行时覆盖开关——`useTelegraphApi.ts:53` 置 `usernameEnabled=true`（所以 `telegraph.ts` 里的 `username` 键是对的，不是死键）、`useBilibiliWeb.ts` 置 `knowledgeSpaceEnabled=true`、`useZhihuWeb.ts`/`useJianshuWeb.ts`/`useJuejinWeb.ts` 同。→ 正式尺子用**按平台显式 REQUIRED_FIELD_KEYS 表**，不用运行时推导。
  2. **行是否渲染依赖「当前值」**：GitHub 族的「图片存储目录/图片访问链接」条件是 `picbedService === Bundled`（`CommonGithubSetting.vue:148/160`），不是「平台是否支持 Bundled」。→ REQUIRED_FIELD_KEYS 需注明「默认图床为 Bundled」这一前提。
- **宿主内不渲染的行**：`middlewareUrl`（跨域代理地址）与非 `isCorsProxy` 平台的 `corsAnywhereUrl` 只在非思源环境出现 → 不纳入宿主门禁的必填集。
- **7 个待办 Cookie 站的工作清单已提前算出**（各站仍需宿主确认）：
  `Zhihu +username +password +previewUrl +blogid -cookie -knowledgeSpace`；`Csdn +password +previewUrl -cookie`；`Jianshu +password +previewUrl +blogid -cookie -knowledgeSpace`；`Juejin +password +previewUrl +blogid -cookie -knowledgeSpace`；`Wechat +password -cookie`；`Bilibili +password +previewUrl +blogid -cookie -knowledgeSpace`；`Haloweb +password +previewUrl -cookie`。
- **临时脚本也会被 `vue-tsc` 全量检查，且文件名大小写必须精确**：脚本放进 `tmp/` 后 `pnpm build:v2` 会一起做类型检查；本次因把 `bilibiliConfig.ts` 写成 `BilibiliConfig.ts`（另有 zhihu/csdn/jianshu/juejin/wechat 同理）触发 TS1149「仅大小写不同」直接让构建失败 → 临时脚本的 import 一律按磁盘真实文件名照抄。

## 第二轮追加（2026-09-12）

## 第三轮追加（2026-09-12）：帮助/文档门禁全量核对
- **22 个已回填平台的文档草稿齐备**：`docs/draft/platforms/` 恰好 22 个 `.md`，与 22 站一一对应，且**每个草稿第 3 行都在** `TODO：待替换真实帮助文档链接`（脚本逐文件核对通过）→ SOP §3 第 2 项（文档草稿）在 22 站无缺口。
- **help 配置契约齐备**：`registry.spec.ts` 的 `verifiedConfigs` 已含 22 站并断言 `summary`/`fields`/`faq`/`tour` 齐备、且不在 `remaining-t1`；tour target 格式由 `tourAnchors.spec.ts` 守。
- **F.2（同步按 `'token'` 取 tip 的用例）实为完成态**：全仓无任何按 `token` 键取字段说明的用例；残留 `token` 只在 tour 锚点（另一套命名空间，按 `passwordType` 用 `password`/`token`/`cookie`）与 Telegraph 真实属性 `accessToken`，都应保留而非删除。
- **F.4 草稿已写**：`tmp/sop-section3-field-guide-draft.md` —— §3 新增第 5 项「字段指引必须渲染并可核验」（键=绑定属性名、鉴权行恒 `password`、全行覆盖、宿主核验步骤、回落链、两把尺子）、§五 回写补充（备注记「N 行 = N ⓘ」）、checklist 一行格式，待全部平台验收后落地。

### 用户可见文案合规核对（第三轮，SOP §3 第 4 项）
- 对 22 个 help 配置文件与 22 个文档草稿扫描禁用词（已验证／V2／插件版本／逆向／实测／观测／抓包／探测／探针／复现／对照／批次）→ **零命中**；命中的「验证通过」全部是平台契约表述（指插件「验证」按钮通过后下拉出目录、测试文件清理等），不是验证进度叙述，属允许内容。仅有的 `v2` 出现在「语雀 v2 API 地址」这一平台事实里。
- `fields[].link` 目标分两类：真实平台页（`github.com/settings/tokens`、`notion.so/my-integrations`、`yuque.com/settings/tokens`）与该平台/共享文档链接。**共享占位链接与文档草稿顶部的 `TODO：待替换真实帮助文档链接` 是同一批**：将来用户给出真实链接时，`helpUrl` 与 `fields[].link` 里的占位链接要一起替换（已并入 F 阶段待办口径，避免只换一处留下死链）。

## 第四轮追加（2026-09-12）：E 组预分析（精确工作清单）
- 覆盖尺扩到 E 组 3 站，结果（`tmp/field-guide-family-coverage.diag.spec.ts` 已含这三条）：
  · `metaweblog_Cnblogs` expected=7 actual=4 → **缺 `previewUrl`、`pageType`、`picbedService`**；`knowledgeSpaceEnabled=false`，鉴权为 Token 型（键仍为 `password`）。
  · `wordpress_Wordpress` expected=7 actual=7 → **已齐**，E 组仅需宿主核验。
  · `fs_LocalSystem` expected=5 actual=5 → 键已齐（`storePath`/`imageStorePath`/`fsYamlType`/`pageType`/`picbedService`），`passwordType=None` 故无鉴权行、不需要 `password` 键。
- **组件层唯一缺口在 `fs/LocalSystemSetting.vue`**：它的 `#main` 三行（存储路径 `storePath`、媒体存储路径 `imageStorePath`、YAML 类型 `fsYamlType` 单选组）都还没挂 `field-guide` → 键在、但页面上不会有 ⓘ。修法：前两行包裹式文本指引，第三行用 `inline`。
- **原计划表述需修正**：`base/impl/MetaweblogSetting.vue`、`metaweblog/WordpressSetting.vue`、`metaweblog/CnblogsSetting.vue` 都是**直通壳**（渲染 `<common-blog-setting>`），行与指引全部继承已改造的共用表单 → 「挂 impl/MetaweblogSetting.vue」这一项不存在，E 组的代码工作量只有本地系统那 3 处。
- 组件清点（`field-guide` 计数）：已挂 `base/CommonBlogSetting.vue`(26)、`base/impl/CommonGithubSetting.vue`(26)、`commonblog/ConfluenceSetting.vue`(2)、`commonblog/TelegraphSetting.vue`(8)；**未挂但含真实行**的仅 `fs/LocalSystemSetting.vue`(3 行)；其余各站组件均为直通壳或 slot 壳（0 行）。

## 第五轮：宿主回归复核（当前构建，2026-09-12）
- **背景**：`f1b67569` 改过共用兜底配置 `platform-config/_default`（删死键 `token`），该改动发生在 #27 定稿之后 → 需要对**当前最新 `dist-v2`** 做一次宿主回归，确认共用层改动没有影响已验证站点的指引渲染。
- **做法**：桌面端渲染进程重载（强制忽略缓存）→ 插件从磁盘重新加载 → 顶栏「发布工具」→ 设置 → 账号列表 → `custom_Yuqueweb` 行「管理」→ 逐项复核。
- **结果（全绿）**：
  · 7 行 = 7 个 ⓘ，键精确为 `home/apiUrl/password/previewUrl/pageType/blogid/picbedService`（无缺、无多）。
  · 鉴权行（Cookie）折叠态与展开「手动编辑」态都**恒为 1 个** ⓘ（不重复、不丢失）；文本框内已有值（长度 1092，仅记长度不记内容）时指引仍在 → 「已填值仍可见」在此构建上复现。
  · 7/7 tip 均在 `.syp-panel` 内、视口内不被裁切（最长 284×84）；文案是语雀网页版专属说明而非兜底文案 → **证明 `_default` 清理未干扰 registry 精确解析**。
  · HelpPanel：`.syp-help-panel-popover` 正常弹出（teleport 到 `.syp-v2`）、显示平台 summary + 3 条 FAQ + 开始引导教程，未出现「暂无专属帮助文档」兜底。
  · TourGuide：4/4 步全部命中真实控件（highlight 739×95 / 739×48 / 739×48 / 739×74，无 `--missing` 兜底），结束后蒙层正常关闭。
  · 账号数 32 → 32（未误建/误删）。
- **留档**：截图 `tmp/regression-yuqueweb-after-fallback-cleanup.png`（本轮）。

## 第六轮：两把回归尺 drop-in 草稿 + checklist SSOT 核对（2026-09-12）
- **drop-in 草稿已写好**：`tmp/field-guide-rulers.spec.ts`（含 22 站 `REQUIRED_FIELD_KEYS` 表 + `ready` 标记 + 三条用例：键尺、覆盖尺、进度尺）。F 阶段直接复制进 `src/helpConfigs/`，把 `ready=false` 清零即完成。
- **试跑结果（重要）**：
  · 覆盖尺对 **14 个 ready 站点全绿** → 按真实渲染行冻结的键表与真实配置一致（含 GitHub 族 21 键、Telegraph 12 键、本地系统 5 键等）。
  · **键尺红**：7 个待办 Cookie 站共 **11 个键不是配置实例属性**——`cookie`（7 站全部）+ `knowledgeSpace`（知乎/简书/掘金/哔哩哔哩）。即这两个旧键**在实例上根本不存在**，不只是命名不合规。
  · 且全仓**没有任何组件**挂 `field="cookie"`/`field="knowledgeSpace"`/`field="token"` → 这些 `tip` 当前是**永不可达的死文案**（即使行上有 ⓘ 也取不到）。→ D 组那 7 站的改名是「让指引真正存在」，不是措辞美化。
  · 进度尺通过：未完成清单 = 7 站 + 博客园，与 campaign 进度一致。
- **checklist SSOT 核对（只读）**：T1 小结「全链路 ✅ 22」与下列 22 行一致（#1–#11、#21、#25、#27–#35、#29）；未测 13 行 = `remaining-t1` 的 12 个未拆分平台 + `metaweblog_*` 通配；四行（#1 语雀 / #21 博客园 / #25 Wordpress / #29 本地系统）备注里没有 SOP §3 帮助记录，属**计划内**——F.5 统一为 22 站回写字段指引记录，不改六格结论。

## 第七轮：tour 锚点有效性全量预核（发现 #21 博客园一处死步骤）
- **做法**：把「该平台真实渲染的 tour 锚点集合」也按行渲染条件推导出来（鉴权行按 `passwordType` 三选一、`knowledgeSpace`/`knowledgeSpaceSearch`/`corsProxy` 按开关、本地系统独有 3 个），再逐站比对每个 tour 步骤的 target。⇒ 22 站里 **21 站 `dead=[]`**。
- **发现（E 组 #21 博客园一处死步骤）**：`metaweblog-cnblogs.ts` 的 tour 有一站 target 是 `password`，但 `CnblogsConfig` 的 `passwordType` 是 **Token** 型、鉴权行渲染的锚点是 `token` → 该步骤定位不到真实控件（会走 `--missing` 兜底）。同时该站 `fields` 还缺 `previewUrl`/`pageType`/`picbedService` → 与 E 组待办一致，归 #21 站点一并处理。
- **为什么现有锚点 spec 没拦住**：`tourAnchors.spec.ts` 的「Token 平台必须用 token 锚点」用例把平台 key **硬编码成 6 个 GitHub 站**（`github_Hexo/Hugo/Jekyll/Quartz/Vuepress/Vuepress2`），博客园同为 Token 型却不在名单里 → 漏检。**F 阶段修法**：把该断言改成按 `passwordType` 数据驱动（覆盖 `verifiedConfigs` 全部 22 站），不再维护手写名单。
- **新增第四把尺并做变异验证**：`tmp/field-guide-rulers.spec.ts` 加「尺子④：每个 tour 步骤必须命中真实渲染锚点」；把博客园临时标为 ready 后**尺子④确实报红**（变异测试通过），说明这把尺能抓到该类缺陷。当前试跑：尺子②（14 站覆盖）、尺子③（进度）、尺子④（14 站锚点）全绿；尺子①按预期红（7 个待办站的 11 个死键）。

## 第八轮：F.5 回写片段与 F.2 改写片段就绪（2026-09-12）
- **F.5 checklist 回写片段已逐站备好**（`tmp/sop-section3-field-guide-draft.md` 第五节）：按验收台账里的宿主实测数字生成每站可粘贴的「字段指引：N 行 = N ⓘ（无指引行说明）」片段——语雀 8、Notion 7（无 ⓘ 行＝搜索关键词）、Halo29 7、Telegraph 匿匿名 11/登录 12、Confluence 8、GitHub 六站 17→21（Vuepress2 17→20）、语雀网页版 7，其余站点留 `<N>` 待实测。六格结论一律不动。
- **F.2 `tourAnchors.spec.ts` 数据驱动改写片段已备**（同文件第六节）：删掉硬编码的 6 站 `TOKEN_PLATFORM_KEYS`，改为按 `passwordType` 推导期望锚点并断言「tour 里出现的鉴权锚点恰好等于期望值（无鉴权步骤则跳过）」。
- **该改写逻辑已对 22 站预校验**：20 站 `OK`、`fs_LocalSystem` 无鉴权步骤 `SKIP`、**仅 `metaweblog_Cnblogs` 报 `expected=token used=[password]`** → 与第七轮锚点预核互相印证；#21 站点改掉该步后即全绿。
- **台账订正**：#5 Confluence 那行的「用户验收」原为「⬜ 待验收」，但按门禁规则（未验收不得开工下一站）与用户回复「继续」的事实，其状态应为「✅ 放行（用户回复「继续」，随后开工 #27）」——已订正，避免 F 阶段汇总时误判还有一站待验收。

## 第九轮：待办站文案合规预审 + 占位链接清单（2026-09-12）
- **10 个待办站（7 个 Cookie + 博客园/Wordpress/本地系统）文案预审**：`summary` 与 tour 标题**均无验证进度叙述**（无「已验证/V2/批次/插件版本」等），与 22 站既有口径一致 ✓。
- **10 个待办站的 tour 步骤与真实渲染锚点逐一比对**：除已知的博客园 `password` 死步骤外，其余全部命中——Halo网页版 `[站点首页/API 地址/Cookie 授权/图片发布/验证并保存]`、知乎/简书/掘金 `[…/专栏或笔记本或分类选择/…]`、CSDN/公众号 `[Cookie 授权/内容格式或发布格式/图片发布/验证并保存]`、哔哩哔哩（含「文集」）、Wordpress `[站点首页/XML-RPC 地址/登录用户名/应用程序密码/预览地址/验证配置]`、本地系统 `[文章输出目录/媒体目录/YAML 类型/图片处理/验证并保存]` → 与各站可渲染锚点集合完全对应 ✓ 即各站开工只需改 `fields` 键与文案，不必动 tour 结构。
- **占位帮助链接清单（F 阶段 handoff 用）**：22 个配置里 **15 个仍是共享/占位链接**——9 个用 T1 通用占位 `…bc3gjg0`（Confluence、Notion、B站、CSDN、简书、掘金、公众号、知乎、本地系统），6 个用 Halo/通用文档 `…btcnnmj`（Halo、语雀、Halo网页版、语雀网页版、博客园、Wordpress）；**7 个已有平台专属文档**（Hexo、Hugo、Jekyll、Quartz、Vuepress、Vuepress2、Telegraph）。文档草稿顶部均已标 `TODO：待替换真实帮助文档链接` ✓ 与 SOP §3 一致；替换时 `helpUrl` 与 `fields[].link` 里的占位链接要一起换。

## 第十轮：F.3 前置核验（V1/locale 零改动证据）+ 单一 pageId 拼接核验（2026-09-12）
- **变更面收敛证明**：`git diff --stat c88f930b^..HEAD`（本 change 的全部提交，排除 planning/openspec/docs/tmp）**恰好 21 个文件**，全部落在 V2 帮助/字段指引层：
  `components/common/help/FieldGuide.vue`、`components/common/help/helpPageIdKey.ts`（新增）、`base/CommonBlogSetting.vue`、`base/impl/CommonGithubSetting.vue`、`commonblog/ConfluenceSetting.vue`、`commonblog/TelegraphSetting.vue`、`v2/settings/V2PlatformConfigBridge.vue`、14 个 `helpConfigs/pages/platform-config/*.ts`、`registry.spec.ts`。
- **locales 零改动**：`git diff --name-only … -- src/i18n src/locales "*.json"` → **空**。即「locales 共享串不动」有 git 证据。
- **V1 零改动**：V1 旧表单 `base/CookieSetting.vue`、V1 入口 `Admin.vue` → **不在变更清单内**（清单仅 21 个文件，已全列）→「V1 文案零变化」有 git 证据。
- **V1 打包链路仍通过**：`python scripts/build.py`（= `pnpm build`）成功产出 `siyuan-plugin-publisher-1.41.1.zip`（exit 0）→ 共用组件挂载字段指引后 V1 构建/打包未受影响（`build/` 已在 `.gitignore:34`，工作树保持干净）。
- **任务 1.1「不得出现第二处拼接」核验通过**：`V2PlatformConfigBridge.vue:117` 是唯一的 `platform-config/${platformKey}` 构造点，第 118 行 `provide(SYP_HELP_PAGE_ID_KEY, helpPageId)` 一次下发，`HelpButton`（第 8 行 `:page-id="helpPageId"`）与字段指引共用同一值；`registry.ts:64` 的 `platformConfigPrefix` 属解析侧常量、spec 里的字面量属测试数据，均非第二套拼接标准。

## 第十一轮：宿主复核脚本化（`tmp/host-field-guide-check.ps1`，退出码即结论）（2026-09-12）
- **产出**：`tmp/host-field-guide-check.js`（页面内量测）+ `tmp/host-field-guide-check.ps1`（跑测与判定），一条命令跑完该 change 的全部宿主渲染契约，**退出码 0/1 即通过/失败**：
  `pwsh -File tmp/host-field-guide-check.ps1 [-AllowNoGuide "搜索关键词"]`
- **量测项**：字段行数 / 指引数 / 键清单 / 无指引的行 / 指引被挤到下一行 / 一行多条指引 / 图标不可见 / 悬停无弹层 / 弹层空文案 / 弹层越出面板 / 弹层被祖先裁切 / 弹层未挂在面板内 / 已填值行指引不可见。
- **字段行口径**：只有带标签的 `.el-form-item` 才算字段行；无标签的「验证 / 保存取消」按钮行单独记为 `actionRows`（不是字段，不应挂指引）——首跑曾把它们误报为「无指引的行」，已修正。
- **滚动口径（重要教训）**：首跑在「鉴权行展开」状态下把「知识库 / 图床服务」误报为 `outsidePanel`+`clippedBy: syp-shell__main`，实为**这两行已被挤到视口下方**（面板高于视口、`.syp-shell__main` 是滚动容器）——量测一个本就在折叠线以下的控件，任何位置判定都无意义。修正为**逐行 `scrollIntoView` 后再 hover 并重新取面板可见区域（面板 ∩ 视口）**，误报消失。
- **语雀网页版（#27）两态实测全绿**：
  · 收起态：字段行 7 = 指引 7，键恰为 `apiUrl,blogid,home,pageType,password,picbedService,previewUrl`（与冻结键表逐字一致）、`actionRows=[验证/保存取消]`；7 行已填值中 5 行（平台首页 21 / API 21 / 预览规则 26 / 发布格式 8 / 图床 4 字符）指引仍可见；7 条弹层全部 `面板内=True 未裁切=True`，文案 25–90 字 → **exit 0**。
  · 展开态（Cookie 手动编辑，文本框 1092 字符，仅报长度不输出内容）：**鉴权行指引数恒为 1（无重复）**、该行已填值仍可见，7 条弹层仍全部 `面板内=True 未裁切=True` → **exit 0**。
- **价值**：此后每站宿主复核不再依赖手工 CDP 查询与目测，一条命令即可复现；F 阶段与后续 7 站 + E 组 3 站可直接串入验收流程。
