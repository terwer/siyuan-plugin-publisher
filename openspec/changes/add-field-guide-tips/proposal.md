## Why

`src/helpConfigs/pages/platform-config/<platform>.ts` 的 `fields`（字段级 `tip` / `link`）目前**没有任何渲染路径**：唯一消费方 `src/components/common/help/FieldGuide.vue` 未被任何组件引用。用户在配置页能看到的字段说明只剩两条通道，且都不在用户最需要它的时刻出现：

- **placeholder**（各 `*Setting.vue` 把 locales 的 `setting.blog.*.tip` 注入 `*Placeholder`）——只在输入框**为空**时可见，配置填好后指引即消失，而这正是用户要改配置的时刻。
- **tour `content`**——只在引导教程进行中可见。

结果是 18 份 help 配置里的字段说明随包发布却零呈现，同时长段说明文案被塞进 placeholder，既不可读也造成同一份指引在 locales、`fields`、tour 三处各写一遍、必然漂移。

## What Changes

- 把 `FieldGuide.vue` 接入共用配置表单：在渲染字段的 `el-form-item` 上挂常驻 ⓘ 指引（tip + 可选 link），呈现路径与 `summary`/`faq`/`tour` 一致，按平台解析（动态实例 key 沿用 `registry` 的预置回落链）。
- `pageId` 由 `V2PlatformConfigBridge.vue` 统一下发（该组件已算出 `'platform-config/' + platformKey`），共用表单不再各自拼 key。
- **确立 `fields` 的键约定**：`fields` 键 = 该行绑定的**配置属性名**（如 `githubRepo`、`githubBranch`、`defaultPath`、`mdFilenameRule`、`previewPostUrl`、`previewUrl`、`pageType`、`picbedService`，鉴权行按 `password`）。这与 tour 的 `data-syp-tour` **锚点名是两种命名空间**（tour 面向真实渲染锚点，鉴权行是 `token`/`password`/`cookie` 三选一；`fields` 面向配置属性），必须分别校验，不可混用。
- **字段指引单一来源**：V2 表单的 placeholder 收敛为示例值，说明性文字移到 `fields`，由 FieldGuide 呈现。locales 的 `setting.blog.*.tip` 共享串**不改动**，避免影响仍在使用该文案的 V1 界面（V1 文本零变化，V2 指引只增不减）。
- 新增回归约束：每个已验证平台的 `fields` 键必须能在其合并后的配置实例上找到对应属性，拼错键即测试失败。

## Capabilities

### New Capabilities

- `help-field-guidance`: 定义配置页字段级常驻指引的解析与呈现契约（pageId 下发、按平台回落链解析、`fields` 键命名空间、指引文案单一来源、无 tip 的行不渲染图标），以及 V2 表单 placeholder 的职责边界。

### Modified Capabilities

- 无（不改变发布、更新、删除、图片链路等平台行为契约）。

## Impact

- 影响代码：`src/components/v2/settings/V2PlatformConfigBridge.vue`（provide pageId）、`src/components/set/publish/singleplatform/base/CommonBlogSetting.vue`、`base/impl/CommonGithubSetting.vue`、`base/impl/MetaweblogSetting.vue`、`base/impl/CustomWebSetting.vue`、`base/CookieSetting.vue`、`commonblog/*.vue`、`fs/LocalSystemSetting.vue`（挂载 FieldGuide、placeholder 取示例值）、`src/helpConfigs/pages/platform-config/*.ts`（按键约定校准 `fields`）。
- 影响测试：`src/helpConfigs/tourAnchors.spec.ts` 之外新增 `fields` 键与配置属性的一致性校验；`registry.spec.ts` 的实例 key 回落用例保持。
- 宿主风险（必须验证）：思源插件是挂在宿主 popup/面板内的容器，`el-tooltip` 默认把 popper 传送到 body，可能被宿主层级裁切或定位错位。需按 `.syp-panel` 容器约束确认渲染方式（不传送或指定 popper 容器），并在宿主逐族复核：GitHub、Gitlab、MetaWeblog、Custom Web、Common、LocalSystem。
- 不影响：V1 界面文案、平台发布链路、`summary`/`faq`/`tour` 既有呈现。
