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
- **`FieldGuide.vue` 目前无人引用**：平台 help 的 `fields` tip 尚未接入表单渲染，属独立待办，不计入本批验证缺陷。

---
*每执行2次查看/浏览器/搜索操作后更新此文件*
*防止视觉信息丢失*
