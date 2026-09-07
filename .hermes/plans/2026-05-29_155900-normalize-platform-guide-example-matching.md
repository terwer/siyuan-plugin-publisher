# normalize-platform-guide-example-matching 实施计划

## 背景与目标

用户已审计通过 OpenSpec `normalize-platform-guide-example-matching`，要求开始实现。目标是解决平台帮助/指南中“同一平台多个示例只有一个完整名 + hash 能匹配文档”的结构性问题。

## 当前已确认事实

- 现有 OpenSpec 已完整：`proposal.md`、`design.md`、`specs/platform-guide-example-matching/spec.md`、`tasks.md`。
- 本次允许进入实现阶段。
- 不修改发布适配器、认证流程、平台配置存储和 V2 桥接业务逻辑。
- 文案精修仍按用户后续逐平台反馈推进，不做批量猜测改写。

## 关键约束

- 保留现有 `pageId/helpUrl` fallback。
- 稳定匹配键必须与展示名分离。
- hash 只能用于消歧，不能成为语义主体。
- 多示例平台每个示例都必须能独立映射到文档或明确 fallback。
- 不污染 `v2-platform-verification-v1-retirement/platform-checklist.md`。

## 目标链路拆解

1. 审计现有帮助配置和潜在 guide/doc 入口。
2. 建立 `mapping-audit.md`，记录现状、缺口和样板选择。
3. 扩展帮助配置类型，增加可选的 example-level matching 数据结构。
4. 实现稳定 key/hash 生成与查询工具。
5. 迁移 1-2 个样板平台，优先使用上一轮已补独立配置的平台。
6. 增加测试覆盖：展示名变化、同名示例冲突、缺失 mapping fallback、remaining 平台 fallback。
7. 更新 OpenSpec tasks 与联动记录。

## 拟新增/修改文件清单

- `openspec/changes/normalize-platform-guide-example-matching/mapping-audit.md`
- `src/types/IPageHelpConfig.ts`
- `src/helpConfigs/exampleMatching.ts` 或同等位置
- `src/helpConfigs/exampleMatching.spec.ts`
- 1-2 个 `src/helpConfigs/pages/platform-config/*.ts` 样板平台配置
- `src/helpConfigs/registry.spec.ts` 或新增 targeted spec
- `openspec/changes/normalize-platform-guide-example-matching/tasks.md`
- `openspec/changes/complete-platform-help-tour-coverage/coverage-log.md`

## 分阶段实施步骤

1. 只读审计：定位 helpUrl、PageHelpConfig、registry、文档/guide 入口。
2. 写 `mapping-audit.md`，完成 tasks 1.x/2.x 的事实记录。
3. 实现最小可选字段与工具，不改变现有调用方行为。
4. 迁移样板平台并补测试。
5. 运行 `pnpm vitest run ...` 与 `pnpm build:v2`。
6. 标记 OpenSpec 任务完成。

## 验证策略与命令

- `pnpm vitest run src/helpConfigs/exampleMatching.spec.ts`
- 如修改 registry 测试：`pnpm vitest run src/helpConfigs/registry.spec.ts`
- `pnpm build:v2`
- `openspec status --change normalize-platform-guide-example-matching --json`

## 风险与回滚

- 若新结构影响现有 help fallback，回滚样板平台配置和匹配工具引用，保留审计文档。
- 若 hash 输入发现不稳定，先只保留 `platformKey/exampleKey` 测试，暂停 hash 上线。
- 若发现 guide/doc 真实入口与假设不符，更新 OpenSpec 设计和 `mapping-audit.md` 后再继续。

## 待确认问题

- `gidude/guide` 的具体文案优化后续由用户逐个平台给出口径；本轮只做匹配结构。
