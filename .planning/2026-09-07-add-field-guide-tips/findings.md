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
