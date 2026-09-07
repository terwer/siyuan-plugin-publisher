# 发现与决策：V2 全平台验证

## 需求
- 按 checklist SSOT 自上而下验证 T1 全部 35 平台；每站六格 + SOP §3 help/tour/doc。
- 换电脑后可从此计划恢复「到哪了、下一步做啥」。

## 研究发现
### 平台族共享基类
- **GitHub 族**（Hexo/Hugo/Jekyll/Quartz/Vuepress/Vuepress2/Vitepress/Astro）：共用 `commonGithubApiAdaptor` + `CommonGithubConfig`；图片经 `CommonGithubApiAdaptor.getImagePath`/`newMediaObject` 传到仓库，`imageStorePath`（落盘目录）+ `imageLinkPath`（文章引用）。
- **GitLab 族**（Gitlabhexo/.../Gitlabastro）：共用 `CommonGitlabApiAdaptor`（构造 raw URL，不读 imageLinkPath）。
- **Metaweblog**（博客园/Typecho/Jvue）：XML-RPC 传输。
- **Wordpress**（Wordpress/Wordpress.com）。

### 图片路径结构性差异（关键）
- **Hexo**：文章 `source/_posts/x.md` 与图片 `source/images/` 同在 `source/` 下 → 相对 `../images/<名>` 源码+构建产物均成立。
- **Hugo**：文章 `content/post/x.md` 与图片 `static/images/` 是**兄弟目录**，且构建把 `static/` 内容**去掉 `static/` 前缀**复制到站点根 → 源码相对（`../../static/images/…`）与构建相对（`../images/…`）数学上不可能相等 → 无单一相对路径。用绝对 `/images/<名>`（官方契约），构建产物可靠显示；源码 blob 内联不显示为平台限制。

### 宿主交互要点
- 插件 V2 工作台挂载在 `.syp-panel`，需点顶栏「发布工具」图标打开（不是集市详情页）。
- 账号存储在思源数据（前端保存），非插件目录。新增账号流程选平台后自动分配 `platformKey-随机后缀`。
- 验证通过标志："配置已保存并验证通过"，账号「运行中/已启用」，发布目录自动拉取。

## 技术决策
| 决策 | 理由 |
|------|------|
| Hexo 图片相对 `../images` | content 与图片同在 `source/`，双模式均可显示 |
| Hugo 图片绝对 `/images` | 兄弟目录 + 去 static/ 前缀，无单一相对路径；用户实测构建产物可显示 |
| 证据写 checklist SSOT | SSOT 唯一维护位置，避免报告冗余 |

## 遇到的问题
| 问题 | 解决方案 |
|------|---------|
| `window.siyuan.plugins` 为 null | 插件工作台需点顶栏「发布工具」图标挂载 `.syp-panel`，从该容器交互 |
| Hugo blob `/images/…` 404 | 平台固有限制（构建产物可显示），经用户确认 |

## 资源
- checklist SSOT：`openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`
- 发布传输架构：AGENTS.md「发布传输架构（V2，简要）」

## 视觉/浏览器发现
- 宿主顶栏 aria-label「发布工具」= publisher 插件入口；点它才渲染 `.syp-panel`。
- 新增账号流程：账号设置 → 添加账号 → 平台分组（GITHUB/GITLAB/METAWEBLOG/WORDPRESS/网页平台/文件系统）→ 选平台 → 配置表单（含图床「当前平台推荐」默认选中）。
- Hugo 配置表单字段与 `github-hugo.ts` help 完全一致，确认 help 渲染正确。

## 2026-09-07 补充发现（GitHub 族引导锚点与配置解析）

- **引导锚点唯一来源是设置组件的 `data-syp-tour`**：`CommonBlogSetting.vue` 提供 `home/apiUrl/username/previewUrl/pageType/knowledgeSpaceSearch/knowledgeSpace/picbedService/corsProxy/validate`，鉴权行按 `passwordType` 三选一渲染成 `password`/`token`/`cookie`；`LocalSystemSetting.vue` 另有 `storePath/imageStorePath/fsYamlType`。**不存在 `defaultPath` 锚点**（存储目录行是 `knowledgeSpace`，label 取 `knowledgeSpaceTitle`「发布目录」）。GitHub 族全为 `PasswordType_Token` → 引导须指向 `token`。
- **`helpRegistry.get()` 与 `hasConfig()` 必须同一条解析链**：`get()` 会把 `platform-config/<key>-<实例后缀>` 回落到预置 `<key>`，`hasConfig()` 曾只做精确匹配，导致动态实例 key 账号既显示专属内容又误报「暂无专属帮助文档」。
- **不写 permalink 的 GitHub 族**：`vuepress2`/`vitepress`/`astro` 的 YamlConverter 不消费 `cfg.yamlLinkEnabled`，表单「YAML永久链接」开关对它们无效果；help 文案不得照抄 vuepress1/jekyll 的永久链接说法。
- **资源就近图片族（`[docpath]/images`）**：`CommonGithubApiAdaptor.getImagePath` 对 `[docpath]` 前缀取 `post.cate_slugs?.[0] ?? cfg.blogid` 作文章目录，图片落 `<文章目录>/images/<名>`；链接侧 `./` 前缀走相对分支不补站点根斜杠。真实链路 `baseExtendApi` 总会设置 `mediaObject.post`（单测需按此契约构造，否则读 `cate_slugs` 抛错）。
- **`FieldGuide.vue` 无人引用（字段提示的渲染方缺口）**：平台 help 的 `fields`（tip/link）目前**没有任何渲染路径**；表单里用户实际看到的字段说明来自 **placeholder**——各平台 `*Setting.vue` 把 locales 的 `setting.blog.*.tip` 注入 `*Placeholder`（如 `Vuepress2Setting.vue:27-31`），而 placeholder 只在输入框**为空**时可见，配置填好后指引就消失了。第三条路径是 tour 步骤的 `content`（仅引导教程期间可见）。接线成本已确认可控：`V2PlatformConfigBridge.vue:8` 已经算出 `'platform-config/' + platformKey`，把该 pageId 向下 provide，共用表单的 `el-form-item` label 插槽挂 `<field-guide>` 即可。待决策已定（2026-09-07 用户选定）：**接线并统一字段文案来源**，立为独立 change `openspec/changes/add-field-guide-tips/`（不与平台验证批次并行改 UI）。其中两条实现约束已在评估中确认：`fields` 键是**配置属性名**（鉴权行 `password`），与 tour 的 `data-syp-tour` 锚点名（`token`/`password`/`cookie` 三选一）分属两套命名空间，须分别校验；`el-tooltip` 默认传送 popper 到 body，在思源 popup 容器宿主内需复核裁切/定位，必要时留在 `.syp-panel` 内。

## 2026-09-07 补充发现（YAML 永久链接能力位）

- **开关的生效范围**：`yamlLinkEnabled` 只被 5 个 GitHub 族转换器消费——`hexo`/`quartz`（开启才写 `permalink`，并按 `previewPostUrl` 与日期占位符合成）、`vuepress`（开启才写 `permalink`，固定 `/post/[slug].html`）、`hugo`（开启才写 `url`）、`jekyll`。
- **jekyll 的语义差异（未改动，留档）**：`JekyllYamlConverterAdaptor` 无条件写 `permalink`，开关只决定取值；由于 Jekyll 的兜底串与其默认 `previewPostUrl`（`/post/[postid].html`）相同，默认配置下开/关输出一致。改动它会影响已发布站点的路由契约，故本次只统一「是否展示开关」，不动 jekyll 写入策略。
- **四个平台的构建器不读链接字段**：Vuepress2 文章路由由 `vuepress-plugin-blog2` 按文件路径生成（该包发布代码与类型定义无 `permalink`）；Vitepress 为 file-based routing，官方 Front Matter 参考无 `permalink`；Astro 内容集合按文件路径生成路由；Docsify 用文件路径 + 哈希路由。因此「让开关生效」只能写入构建器不读的元数据，选择改为按能力位 `yamlLinkSupported` 撤下开关。
- **回归钉**：`yamlLinkCapability.spec.ts` 以转换器真实输出反查能力位，GitHub 族 9 平台全枚举；新增平台若不写链接字段又忘了置 false，测试即失败。
- **文案口径**：用户可见产物（help 配置 summary/fields/faq/tour、docs 草稿）只写平台功能与配置契约；验证进度、批次结论、插件版本号限定、内部实现名一律留在 checklist。表单内「点『验证』→通过后…」属用户操作流程，保留。

---
*每执行2次查看/浏览器/搜索操作后更新此文件*
*防止视觉信息丢失*
