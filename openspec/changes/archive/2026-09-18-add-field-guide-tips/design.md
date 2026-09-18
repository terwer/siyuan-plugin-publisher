## Context

`FieldGuide.vue` 是一个已完成的 ⓘ 提示组件：`helpRegistry.getField(pageId, field)` → `tip` + 可选 `link`/`linkText`，`hasTip` 为假时整体不渲染。缺的只有两件事：pageId 的注入，以及挂载位置。

现状盘点（决定改动范围）：真正渲染 `el-form-item` 的是共用组件，各平台 `*Setting.vue` 只是薄壳（设定 `apiType` + 注入 placeholder + 转发插槽）。因此挂载点是有限集合，不需要逐平台改。

## Goals / Non-Goals

**Goals**
- 字段指引在配置页常驻可见，随平台不同而不同，随实例 key 正确解析。
- `fields` 成为 V2 字段说明的唯一来源；placeholder 只承担示例与输入格式。
- 键写错、行不存在都能在测试阶段暴露，不靠人工逐站核对。

**Non-Goals**
- 不改 V1 组件与 locales 共享串。
- 不改任何平台的发布/更新/删除/图片行为契约。
- 不与 T1 平台验证批次并行推进（本 change 独立批次实施与宿主核验）。

## Decisions

### 1. pageId 由 bridge 下发，不在共用表单内推导

`V2PlatformConfigBridge.vue` 已经持有 `platformKey` 并在标题处渲染 `HelpButton :page-id="'platform-config/' + platformKey"`。改为同时 `provide()` 该值，共用表单 `inject` 后传给 `FieldGuide`。

- 备选：表单内从 `apiType`/`cfg` 自行拼 key —— 否决，会在多个组件里重复一份 key 规则，与「平台 key 只允许一种标准」的既有教训相悖。
- 备选：给每个 `*Setting.vue` 加 `pageId` prop 逐层透传 —— 否决，prop 钻透十余个组件，违背高内聚低耦合。
- 无 provider 时（V1 路径、单测挂载）FieldGuide 不渲染，不影响既有布局。

### 2. `fields` 键空间 = 配置属性名，与 tour 锚点分离

同一个「鉴权行」在两套命名空间里的名字不同：tour 必须用真实渲染锚点 `token`（GitHub 族 `passwordType` 为 Token），`fields` 用配置属性 `password`（Token 值存在 `password` 字段）。两者不能互相校验，也不存在 `defaultPath` 这个 tour 锚点，但 `defaultPath` 是合法的配置属性名。

因此新增的校验方向不同：
- tour：锚点 ∈ 组件真实 `data-syp-tour` 集合（`tourAnchors.spec.ts` 已承担）。
- fields：键 ∈ 该平台合并后配置实例的属性集合（新校验承担）。

### 3. placeholder 收敛为示例，说明文字进 `fields`

各平台 `*Setting.vue` 里的 `xxxPlaceholder = t("setting.blog.*.tip")` 把长说明塞进 placeholder。V2 侧改为示例值（如 `/post/[postid].html`、`src/post`），解释性文字由该平台 `fields` 承担。locales 串本身不动，V1 呈现不变。

顺序上先做第 1、2 步（纯增，指引立刻可见），再逐族做收敛，避免任何时刻出现「说明既不在 placeholder 也不在 fields」的空窗。

### 4. 宿主内的 popper 容器

`.syp-panel` 是定位容器，弹层需要留在面板内（与 `HelpPanel` 用 `.syp-help-panel-popover` + `position: absolute` 同一路子）。FieldGuide 现用 `el-tooltip`，其 popper 默认传送到 body，在本宿主下属于必须复核项：确认不裁切、不错位；否则设 `:teleported="false"` 或指定 popper 容器。此风险在实现首步即以宿主复核结论定稿，不留到收尾。

## Risks / Trade-offs

- **文案重复与漂移**：`fields` 与 tour `content` 仍有部分同源表述。取舍：tour 讲「按什么顺序填」，`fields` 讲「这个字段是什么」；SOP §3 已把口径写清，逐平台核对时一并去重。
- **面板宽度压力**：ⓘ 图标逐行增加，窄面板下标签列可能换行。取舍：图标紧贴 label 尾部、仅在 `hasTip` 时出现；宿主复核若出现挤压则回退为 label 尾部图标而非独占列。

## Migration Plan

1. bridge provide + FieldGuide 挂载（共用组件逐个）→ 单测 + `build:v2` → 宿主逐族复核弹层与定位。
2. `fields` 键对齐并补新校验 → 测试绿。
3. 逐平台把 placeholder 改为示例值（同一次提交里确保对应 `fields` 已有 tip）。
4. SOP §3 增补「字段指引单一来源」条目，平台验证批次沿用。
5. 回写 checklist：本 change 不改任何六格结论；仅修正与字段说明相关的表述。
