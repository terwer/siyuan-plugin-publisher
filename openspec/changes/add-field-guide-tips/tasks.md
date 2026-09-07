## 1. pageId 下发与解析

- [ ] 1.1 `V2PlatformConfigBridge.vue` 以单一常量键 `provide()` 已算出的 `'platform-config/' + platformKey`，与 `HelpButton` 使用同一个值（不得出现第二处拼接）。
- [ ] 1.2 共用表单侧 `inject` 该值并传给 `FieldGuide`；无 provider 时（V1 路径、组件单测）不渲染指引且不影响布局。
- [ ] 1.3 确认动态实例 key（`github_Vuepress2-ig1w6`）经 `registry` 回落链解析到预置平台 `fields`，与 `summary`/`faq`/`tour` 同一条链。

## 2. FieldGuide 挂载（共用组件逐个，覆盖全部平台）

- [ ] 2.1 `base/CommonBlogSetting.vue`：平台首页、API 地址、用户名、鉴权行、发布格式、图床服务、跨域代理、站点地址、预览规则等行。
- [ ] 2.2 `base/impl/CommonGithubSetting.vue`：仓库名、分支、存储目录、文件规则、文章预览规则、YAML 预设配置、图片存储目录、图片访问链接（「YAML永久链接」行按 `yamlLinkSupported` 渲染，指引跟随同一条件）。
- [ ] 2.3 `base/impl/MetaweblogSetting.vue`、`base/impl/CustomWebSetting.vue`、`base/CookieSetting.vue`：各自专有行。
- [ ] 2.4 `commonblog/YuqueSetting.vue`、`NotionSetting.vue`、`ConfluenceSetting.vue`、`HaloSetting.vue`、`TelegraphSetting.vue` 与 `fs/LocalSystemSetting.vue` 的专有行。
- [ ] 2.5 无 `tip` 且无 `link` 的行不出现图标（由 `hasTip` 保证），不留空占位。
- [ ] 2.6 宿主复核弹层定位：确认 `el-tooltip` popper 在 `.syp-panel` 容器内不裁切、不错位；必要时改为不传送或指定 popper 容器，并记录结论。

## 3. `fields` 键约定与回归

- [ ] 3.1 明确并落文档：`fields` 键 = 该行绑定的配置属性名（鉴权行为 `password`，与 tour 锚点 `token`/`cookie` 分属两套命名空间）。
- [ ] 3.2 新增校验：每个已验证平台的 `fields` 键必须能在其合并后的配置实例上取到同名属性；键写错即失败。
- [ ] 3.3 逐平台校正现存 18 份配置的 `fields` 键（含 `github-vuepress2.ts` 的 `defaultPath`/`mdFilenameRule` 等），使 3.2 通过。
- [ ] 3.4 保持 `tourAnchors.spec.ts` 的锚点校验独立通过（两把尺子互不代替）。

## 4. 字段指引单一来源

- [ ] 4.1 逐平台把 V2 表单 placeholder 从长说明改为示例值（如 `src/post`、`/post/[postid].html`），同一次改动内确保对应 `fields` 已含说明，不出现说明空窗。
- [ ] 4.2 locales 的 `setting.blog.*.tip` 共享串保持不动，确认 V1 界面文案零变化。
- [ ] 4.3 去重：tour `content` 只讲操作顺序，字段含义归 `fields`；发现同一句话在三处各写一遍时收敛为一处。

## 5. 验证与记录

- [ ] 5.1 `pnpm vitest run` 全绿、`pnpm build:v2` 通过。
- [ ] 5.2 宿主逐族复核：GitHub、Gitlab、MetaWeblog、Custom Web、Common、LocalSystem 各至少一站，确认指引按平台正确呈现且实例 key 解析正确。
- [ ] 5.3 SOP §3 增补「字段指引单一来源」条目，供后续平台验证沿用。
- [ ] 5.4 checklist 记录本 change 落地（不改动任何平台六格结论，仅修正字段说明相关表述）。
