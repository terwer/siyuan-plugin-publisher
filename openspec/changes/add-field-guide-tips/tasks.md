> 推进方式（用户 2026-09-07 要求）：共用层先在试点平台 #11 Vuepress2 与真实表单对齐定稿；此后**每完成一个平台即停下提交宿主证据，等验收通过再做下一个平台**，不一次性铺开 22 站。

## 1. pageId 下发与解析

- [x] 1.1 `V2PlatformConfigBridge.vue` 以单一常量键 `provide()` 已算出的 `'platform-config/' + platformKey`，与 `HelpButton` 使用同一个值（不得出现第二处拼接）。
- [x] 1.2 共用表单侧 `inject` 该值并传给 `FieldGuide`；无 provider 时（V1 路径、组件单测）不渲染指引且不影响布局。
- [x] 1.3 确认动态实例 key（`github_Vuepress2-ig1w6`）经 `registry` 回落链解析到预置平台 `fields`，与 `summary`/`faq`/`tour` 同一条链。

## 2. FieldGuide 挂载（共用组件逐个，覆盖全部平台）

- [x] 2.1 `base/CommonBlogSetting.vue`：平台首页、API 地址、用户名、鉴权行（`password`/`token`/`cookie` 三分支同键 `password`）、预览规则、发布格式、发布目录（`blogid`）、图床服务、跨域代理地址、CORS 代理行。
- [x] 2.2 `base/impl/CommonGithubSetting.vue`：仓库名、分支、存储目录、文件规则、文章预览规则、YAML 预设配置、图片存储目录、图片访问链接、折叠高级四项；「YAML永久链接」行沿用 `yamlLinkSupported` 条件。
- [ ] 2.3 `base/impl/MetaweblogSetting.vue`、`base/impl/CustomWebSetting.vue`、`base/CookieSetting.vue`：各自专有行（待对应族首个平台开工时挂）。
- [ ] 2.4 `commonblog/YuqueSetting.vue`、`NotionSetting.vue`、`ConfluenceSetting.vue`、`HaloSetting.vue`、`TelegraphSetting.vue` 与 `fs/LocalSystemSetting.vue` 的专有行。
- [x] 2.5 无对应配置属性的行（检索关键词行绑 `formData.ksKeyword`、验证行）不挂指引。
- [x] 2.6 宿主复核弹层定位：`el-tooltip` 设 `:teleported="false"` 后 popper 留在 `.syp-panel` DOM 内（`panel.contains(popper) === true`），逐行滚入视区后弹层完整可见、无裁切与错位；字段已填值时指引仍在。
- [x] 2.7 呈现硬性要求（用户看图定稿）：指引与控件**必须同行**（FieldGuide 包裹控件，`inline` 供开关/单选组紧贴、`tall` 供文本域贴首行）；图标用 `@element-plus/icons-vue` 官方 `InfoFilled`，不手写 path；视觉权重压到安静档——14px + `--el-text-color-placeholder` + hover 主色 + tooltip `show-after 150ms`，不与输入内容争注意力。

## 3. `fields` 键约定与回归

- [x] 3.1 明确并落文档：`fields` 键 = 该行绑定的配置属性名（鉴权行为 `password`，与 tour 锚点 `token`/`cookie` 分属两套命名空间）。
- [ ] 3.2 新增校验：每个已验证平台的 `fields` 键必须能在其合并后配置实例上取到同名属性；键写错即失败。（待各站改名完成后一次性加，避免中途红测）
- [x] 3.3 试点平台 `github-vuepress2.ts` 键与真实渲染行逐行对齐，补齐 `blogid`/`imageStorePath`/`imageLinkPath`/`dynYamlCfg`/`defaultMsg`/`author`/`email`/`site`。
- [ ] 3.4 其余 21 站 `fields` 键校准（`token`/`cookie`→`password`、`knowledgeSpace`→`blogid`）与缺项补齐：逐站推进，每站停下验收。
- [ ] 3.5 保持 `tourAnchors.spec.ts` 的锚点校验独立通过（两把尺子互不代替）。

## 4. 字段指引单一来源

- [ ] 4.1 逐平台把 V2 表单 placeholder 从长说明改为示例值（如 `src/post`、`/post/[postid].html`），同一次改动内确保对应 `fields` 已含说明，不出现说明空窗。
- [ ] 4.2 locales 的 `setting.blog.*.tip` 共享串保持不动，确认 V1 界面文案零变化。
- [ ] 4.3 去重：tour `content` 只讲操作顺序，字段含义归 `fields`；发现同一句话在三处各写一遍时收敛为一处。

## 5. 验证与记录

- [x] 5.1 试点增量：全量 `pnpm vitest run`（65 文件 / 309 测试）通过、`pnpm build:v2` 通过。
- [ ] 5.2 宿主逐族复核：GitHub、Custom Web、Common、MetaWeblog、WordPress、LocalSystem 各至少一站（试点 #11 已复核，其余随各站推进并逐站验收）。
- [ ] 5.3 SOP §3 增补「字段指引单一来源」条目，供后续平台验证沿用。
- [ ] 5.4 checklist 记录本 change 落地（不改动任何平台六格结论，仅修正字段说明相关表述）。
