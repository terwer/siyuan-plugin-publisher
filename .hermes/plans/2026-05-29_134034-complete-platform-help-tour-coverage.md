# 平台 Help / TourGuide 覆盖补全计划

## 1. 背景与目标

Publisher 的 HelpPanel、FieldGuide、TourGuide 框架已经通过 `platform-help-guide-system` 上线并归档，但平台配置帮助覆盖仍不均衡。博客园 `metaweblog_Cnblogs` 已有完整 `summary / fields / faq / tour`，其余大量 T1 平台仍集中在 `remaining-t1.ts`，只有 `helpUrl` 级别的兜底。

本计划新起 OpenSpec 变更 `complete-platform-help-tour-coverage`，专门跟踪平台帮助覆盖补全。目标是：已验证平台先补齐；后续 `v2-platform-verification-v1-retirement` 每验证一个平台，就同步补该平台的帮助、字段提示和 TourGuide。

## 2. 当前已确认事实

- 当前项目目录：`/Volumes/workspace/mydocs/siyuan-plugins/siyuan-plugin-publisher`
- 当前平台验证主线：`openspec/changes/v2-platform-verification-v1-retirement`
- 平台验证 SSOT：`openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`
- 帮助系统归档变更：`openspec/changes/archive/2026-05-27-platform-help-guide-system/`
- 新建帮助覆盖变更：`openspec/changes/complete-platform-help-tour-coverage/`
- 完整样板：`src/helpConfigs/pages/platform-config/metaweblog-cnblogs.ts`
- 轻量兜底清单：`src/helpConfigs/pages/platform-config/remaining-t1.ts`
- 注册入口：`src/helpConfigs/pages/index.ts`
- 帮助配置类型：`src/types/IPageHelpConfig.ts`

## 3. 关键约束

- 不重做 HelpRegistry / HelpPanel / FieldGuide / TourGuide 基础架构。
- 不提前为未验证平台编造完整 tour 或 FAQ。
- 不把帮助覆盖状态混入 `platform-checklist.md` 的 V2C/Pub/Upd/Del/Img 主表。
- 只允许按需补最小 `data-syp-tour` 锚点，不改变表单业务逻辑。
- 非琐碎代码改动仍需按 OpenSpec tasks 推进，并逐项勾选。

## 4. 目标链路拆解

1. 以博客园为完整样板，定义每个平台最低覆盖标准。
2. 审计已验证平台：#1 语雀 API、#21 博客园、#25 WordPress、#27 语雀网页版、#29 本地系统、#30 知乎、#31 CSDN。
3. #28 HaloWeb 完成手验后，补齐最新 FAQ 和字段说明。
4. 对仍在 `remaining-t1.ts` 的已验证平台，拆出独立 config 文件并注册。
5. 后续平台每验证通过一个，就同步补齐对应帮助覆盖任务。
6. 最后运行 registry 测试、`pnpm build:v2`，并在 V2 宿主手验 HelpPanel / FieldGuide / TourGuide。

## 5. 拟新增/修改文件清单

已新增 OpenSpec 文件：

- `openspec/changes/complete-platform-help-tour-coverage/proposal.md`
- `openspec/changes/complete-platform-help-tour-coverage/design.md`
- `openspec/changes/complete-platform-help-tour-coverage/specs/platform-help-tour-coverage/spec.md`
- `openspec/changes/complete-platform-help-tour-coverage/tasks.md`

后续实施可能修改：

- `src/helpConfigs/pages/platform-config/*.ts`
- `src/helpConfigs/pages/platform-config/remaining-t1.ts`
- `src/helpConfigs/pages/index.ts`
- 相关平台配置表单组件中的 `data-syp-tour` 锚点
- `src/helpConfigs/registry.spec.ts` 或新增 help config 覆盖测试

## 6. 分阶段实施步骤

### Phase 1：已验证平台审计与补齐

- 确认博客园样板是否需要补最新 XML-RPC / 图片复验说明。
- 补齐语雀 API 的会员政策与关键字段说明。
- 补齐 WordPress 自托管配置字段与应用密码/API 口径。
- 补齐语雀网页版 Cookie 授权和图片上传说明。
- 从 `remaining-t1.ts` 拆出本地系统、知乎、CSDN 独立配置。

### Phase 2：#28 HaloWeb 跟进

- 等 `v2-platform-verification-v1-retirement` 中 #28 完成 V2C/Pub/Upd/Del/Img。
- 根据真实手验结果更新 `custom-haloweb.ts` 的 summary/fields/faq/tour。
- 如果出现新失败模式，写入本变更 tasks 或 coverage log。

### Phase 3：后续平台验证联动

- #2–#5 Common 验证通过后补帮助。
- #6–#13 Github 验证通过后补仓库/分支/目录/静态站点字段提示。
- #14–#20 Gitlab 验证通过后补 token/仓库路径/分支/目录提示。
- #22–#24 MetaWeblog 验证通过后补 XML-RPC endpoint 与 Token/密码说明。
- #32–#35 Custom Bridge 验证通过后补 Cookie 授权与平台限制说明。

## 7. 验证策略与命令

计划中的验证命令：

```bash
pnpm test -- src/helpConfigs/registry.spec.ts
pnpm build:v2
```

手验：

- V2 宿主打开平台配置页。
- HelpPanel 可以打开并显示平台专属 summary/FAQ。
- FieldGuide 在关键字段旁可见。
- TourGuide 步骤能定位到表单锚点，且不越出插件容器。

## 8. 风险与回滚

- 风险：帮助内容与平台真实行为不一致。缓解：只把已验证结果写入完整配置，未验证平台继续保留 helpUrl 兜底。
- 风险：Tour selector 找不到元素。缓解：只使用稳定 `data-syp-tour`，缺失时先补最小锚点。
- 风险：覆盖任务和平台验证任务漂移。缓解：每次更新 `platform-checklist.md` 后同步检查 `complete-platform-help-tour-coverage/tasks.md`。
- 回滚：帮助配置是纯叠加，可移回 `remaining-t1.ts` 或删除新增独立配置，不影响发布链路。

## 9. 待确认问题

- 明天第一批是否按“已验证但未完整覆盖”优先，即本地系统、知乎、CSDN、语雀 API、WordPress、语雀网页版？默认如此。
- #28 HaloWeb 是否要等完整全链路验证后再补，还是先补 V2C 配置页帮助？默认等手验结果更完整后补，但 V2C 的已知坑点可以先补 FAQ。
