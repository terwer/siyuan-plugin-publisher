# 任务计划：字段级指引接线与全平台回填（add-field-guide-tips）

## 目标
实现 OpenSpec change `openspec/changes/add-field-guide-tips/`：让平台 help 的 `fields` 提示在配置页**真实渲染且填值后仍可见**，并回填到已验证的 22 个平台。

## 工作方式（用户 2026-09-07 明确要求，最高优先）
1. **每完成一个平台的字段指引就停下**，给出宿主证据（表单截图 + 弹层定位与内容），**等用户验收通过后才做下一个平台**。
2. **共用层改动必须先在试点平台上与真实表单对齐定稿**，未定稿不得铺开。
3. 不做一次性大批量；每个增量小、可验证、可回退。

## 当前步骤
步骤 A **已完成，停下等用户验收**。验收通过后进入步骤 B（#6 Hexo，每站一停）。

## 验收台账
| 步骤 | 平台 | 共用层挂载 | fields 键改名/补全 | 宿主证据 | 用户验收 |
|---|---|---|---|---|---|
| A | #11 Vuepress2（试点） | CommonBlogSetting + CommonGithubSetting（**包裹式同行**，26 处） | 补 `blogid`/`imageStorePath`/`imageLinkPath`/`dynYamlCfg`/高级四项 | 20 行同行、官方 InfoFilled 16px、弹层在面板内完整可见（两张截图） | ⬜ 第二轮待验收 |
| B | #6 Hexo | 复用 A | 补 `yamlLinkEnabled` tip + 同 A 缺项 | | ⬜ |
| B | #7 Hugo | 复用 A | 同上 | | ⬜ |
| B | #8 Jekyll | 复用 A | 同上 | | ⬜ |
| B | #9 Quartz | 复用 A | 同上 | | ⬜ |
| B | #10 Vuepress | 复用 A | 同上 | | ⬜ |
| C | #1 语雀 | commonblog/YuqueSetting | `token`→`password`、`knowledgeSpace`→`blogid` | | ⬜ |
| C | #2 Notion | commonblog/NotionSetting | `token`→`password`、`knowledgeSpace`→`blogid` | | ⬜ |
| C | #3 Halo | commonblog/HaloSetting | — | | ⬜ |
| C | #4 Telegraph | commonblog/TelegraphSetting | 补 `picbedService` | | ⬜ |
| C | #5 Confluence | commonblog/ConfluenceSetting | `knowledgeSpace`→`blogid`（保留 `parentPageId`） | | ⬜ |
| D | #27 语雀网页版 | CustomWebSetting / CookieSetting | `cookie`→`password`、`knowledgeSpace`→`blogid`、补 `home`/`apiUrl` | | ⬜ |
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
- [ ] 挂 `commonblog/*Setting.vue` 专有行；执行 `token`→`password`、`knowledgeSpace`→`blogid` 改名；逐站宿主复核 + 等验收。
- **状态：** pending

### 步骤 D：Custom Web Cookie 族 8 站（每站一停）
- [ ] 挂 `CustomWebSetting.vue` / `CookieSetting.vue` 专有行；执行 `cookie`→`password`、`knowledgeSpace`→`blogid` 改名；逐站宿主复核 + 等验收。
- **状态：** pending

### 步骤 E：MetaWeblog / Wordpress / 本地系统 3 站（每站一停）
- [ ] 挂 `impl/MetaweblogSetting.vue`、`fs/LocalSystemSetting.vue`；补齐 cnblogs 仅 4 键的缺口；逐站宿主复核 + 等验收。
- **状态：** pending

### 步骤 F：回归尺与标准固化
- [ ] F.1 新增两把尺：① 每站 `fields` 键必须能在合并后配置实例上取到同名属性；② 按族 `REQUIRED_FIELD_KEYS` 全覆盖。
- [ ] F.2 同步 `registry.spec.ts` 中按 `'token'` 取 tip 的用例。
- [ ] F.3 V2 表单 placeholder 收敛为示例值（每次改动内保证对应 `fields` 已有说明，不留空窗）；locales 共享串不动，V1 文案零变化。
- [ ] F.4 SOP §3 增补「字段指引必须渲染并可核验」为与五格同等必过项 + 键命名空间规则。
- [ ] F.5 checklist 为 22 站回写该点通过记录（不改六格结论）；勾选 change `tasks.md`；`openspec validate --strict`。
- [ ] F.6 全量测试 + build:v2 + 英文 Conventional 提交推送，工作树干净。
- **状态：** pending

## 核心资产：行 → 配置属性键映射（来自代码，勿凭记忆改）

`CommonBlogSetting.vue`（`el-form label-width="96px"`，ⓘ 挂**控件列尾部**，不挤标签列）：

| 表单行 | data-syp-tour | v-model 绑定 | `fields` 键 |
|---|---|---|---|
| 平台首页 | home | `cfg.home` | `home` |
| API地址 | apiUrl | `cfg.apiUrl` | `apiUrl` |
| 登录名 | username | `cfg.username` | `username` |
| 密码 / Token / Cookie | password / token / cookie | **三种都绑 `cfg.password`** | `password` |
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
