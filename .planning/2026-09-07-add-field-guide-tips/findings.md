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
- `jekyllConfig.ts`：`_posts`、`[yyyy]-[mm]-[dd]-[slug].md`、`assets/images`（存储与引用同名，按 `getImagePath` 规则引用为 `/assets/images/<名>`）、发布目录只读。

## 工具事实：chrome-devtools MCP 掉线后的替代通道
- 本次 MCP 的 `mcp__chrome-devtools__*` 从会话工具表里消失（宿主被关闭后掉线），恢复需重启 DSH Web——会打断当前会话，不该自动做。
- 替代：PowerShell + `ClientWebSocket` 直连 9222 的 CDP（`Runtime.evaluate` + `awaitPromise`/`returnByValue`、`Page.captureScreenshot`），脚本已固化在 `tmp/cdp-eval.ps1`、`tmp/cdp-shot.ps1`（`tmp/` 已 gitignore，属研究/调试工具不入库）。注意 `Runtime.evaluate` 响应路径是 `$result.result.result.value`。
- 思源可用 `C:\Program Files\SiYuan\SiYuan.exe --workspace="D:\Users\Administrator\Documents\mydocs\SiyuanWorkspace\test" --remote-debugging-port=9222` 拉起，约 3 秒 9222 就绪；内核端口每次随机（本次 59072）。
