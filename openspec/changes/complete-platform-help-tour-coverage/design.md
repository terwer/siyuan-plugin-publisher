## Context

`platform-help-guide-system` 已归档并上线了通用 HelpPanel、FieldGuide、TourGuide 与 HelpRegistry。当前代码状态显示：

- `metaweblog_Cnblogs` 已有完整帮助配置，包含 `summary / fields / faq / tour`。
- WordPress、语雀、Halo、语雀网页版、HaloWeb 已拆为独立配置文件。
- 其余 T1 平台集中在 `remaining-t1.ts`，大多只有 `helpUrl`。
- `v2-platform-verification-v1-retirement` 正在逐平台验证 V2C/Pub/Upd/Del/Img，并已形成唯一主表 `platform-checklist.md`。

本变更是帮助系统的覆盖补全，不重做帮助框架。

## Goals / Non-Goals

**Goals:**

- 将已验证平台的真实配置经验沉淀为平台帮助配置。
- 建立“平台验证完成后同步补帮助”的固定流程。
- 以博客园为样板，为每个平台逐步补齐 `summary`、关键 `fields`、`faq` 与可用的 `tour`。
- 保持帮助覆盖与 V2 平台验证节奏一致，避免过期或猜测型文案。
- 保留 `remaining-t1.ts` 作为未补齐平台的轻量兜底清单。

**Non-Goals:**

- 不重构 HelpRegistry、HelpPanel、FieldGuide、TourGuide 基础架构。
- 不把帮助覆盖状态混入 `v2-platform-verification-v1-retirement/platform-checklist.md` 的 V2C/Pub/Upd/Del/Img 状态。
- 不为未验证平台编写看似完整但未经验证的操作步骤。
- 不修改平台发布适配器、传输层或配置存储格式。

## Decisions

### 1. 覆盖顺序跟随验证顺序

补齐顺序分两层：

1. **先补已验证平台**：#1 语雀 API、#21 博客园、#25 WordPress、#27 语雀网页版、#29 本地系统、#30 知乎、#31 CSDN，以及 #28 HaloWeb 在手验完成后补齐。
2. **后续每验证一个平台就补一个平台**：平台验证任务完成后，必须检查帮助配置是否达到最低覆盖标准。

理由：帮助文案应来自真实验证结果，而不是代码字段猜测。

### 2. 博客园作为完整样板

`src/helpConfigs/pages/platform-config/metaweblog-cnblogs.ts` 是当前完整样板。后续平台应尽量保持相同结构：

- `summary`：一句话说明平台类型、授权方式或关键前提。
- `fields`：覆盖用户最容易填错的字段，如 `home`、`apiUrl`、`username`、`password`、`token`、`repo` 等。
- `faq`：沉淀验证中真实出现的问题，例如会员限制、API Token 与登录密码区别、Cookie 授权入口、图床选择。
- `tour`：仅在目标表单存在稳定 `data-syp-tour` 锚点时添加。

### 3. 独立配置优先，remaining-t1 保持兜底

当某个平台达到完整覆盖标准时，应从 `remaining-t1.ts` 拆出独立文件，并在 `pages/index.ts` 注册。未补齐平台继续留在 `remaining-t1.ts`，仅作为 helpUrl 兜底。

理由：独立文件便于维护真实经验；兜底数组避免一开始就制造大量空壳文件。

### 4. Tour 锚点最小补充

如果平台配置表单已有稳定 `data-syp-tour`，可直接写 tour；如果缺失，允许在对应表单组件上做最小锚点补充。锚点补充不得改变布局、状态、验证或保存逻辑。

### 5. 帮助覆盖不改变平台验证 SSOT

`platform-checklist.md` 继续只记录 V2C/Pub/Upd/Del/Img。帮助覆盖在本变更 `tasks.md` 中跟踪，必要时可写 `coverage-log-YYYY-MM-DD.md`，但不作为平台验证通过条件的替代。

## Risks / Trade-offs

- **风险：帮助文案与真实平台行为不一致** → 只在验证后补完整说明，未验证平台保留轻量 helpUrl。
- **风险：Tour 选择器找不到 DOM** → tour 只引用稳定 `data-syp-tour`，缺锚点时先补锚点并手验。
- **风险：覆盖状态与平台验证状态漂移** → 每次更新 `platform-checklist.md` 后，同步检查本变更 tasks。
- **风险：过度扩大实现范围** → 不改 Help/TourGuide 框架，只补配置与必要锚点。

## Migration Plan

1. 为已验证平台补齐帮助覆盖任务清单。
2. 按优先级逐个平台拆出或完善独立配置文件。
3. 每个平台补齐后运行 registry/help 相关测试和 `pnpm build:v2`。
4. 在 V2 宿主手验对应平台配置页 HelpPanel / FieldGuide / TourGuide。
5. 后续平台验证通过后，在本变更追加或勾选对应帮助覆盖任务。

## Open Questions

- “明天补上”的第一批是否只补已验证但未完整覆盖的平台，还是同时把 #28 HaloWeb 手验结果补入？默认按已验证平台优先，#28 在验证完成后补。
- 是否要把帮助覆盖完成情况在 `platform-checklist.md` 备注中标一句“Help/Tour 已补”？默认不写，避免污染验证 SSOT。
