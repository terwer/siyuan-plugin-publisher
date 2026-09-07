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
