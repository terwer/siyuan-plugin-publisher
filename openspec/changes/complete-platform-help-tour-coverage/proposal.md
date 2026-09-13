## Why

平台帮助系统和 TourGuide 框架已经上线，但平台配置覆盖仍不均衡：博客园等少数平台有完整的 `summary / fields / faq / tour`，而大多数 T1 平台仍停留在 `remaining-t1.ts` 的 helpUrl 级别。随着 `v2-platform-verification-v1-retirement` 持续推进，每个平台验证中暴露出的配置坑点、授权步骤和发布注意事项需要及时沉淀到帮助与引导中，避免验证完成后经验丢失。

## What Changes

- 建立平台帮助与 TourGuide 覆盖的独立跟踪变更，作为已归档 `platform-help-guide-system` 的后续补全工作。
- 将覆盖策略与 `v2-platform-verification-v1-retirement/platform-checklist.md` 联动：每完成一个平台验证，就同步评估并补齐该平台的帮助配置。
- 以博客园 `metaweblog_Cnblogs` 为完整样板，逐步把已验证平台从 `remaining-t1.ts` 的轻量 helpUrl 配置提升为独立平台配置文件。
- 为每个平台定义最低覆盖标准：`summary`、关键 `fields`、至少一组 `faq`，以及在表单 DOM anchor 可用时提供 `tour`。
- 明确补齐顺序：先补已验证平台，再跟随新验证平台补齐；不提前为未验证平台编造不可靠步骤。
- 不修改 Help/TourGuide 基础组件架构，除非覆盖过程中发现真实缺陷。

## Capabilities

### New Capabilities

- `platform-help-tour-coverage`: 平台配置帮助与 TourGuide 覆盖策略，规定平台验证结果如何沉淀为 `PageHelpConfig`，以及每个平台达到什么覆盖标准才算完成。

### Modified Capabilities

- 无。

## Impact

- 主要影响 `src/helpConfigs/pages/platform-config/*` 与 `src/helpConfigs/pages/index.ts`。
- 可能按需影响平台配置表单的 `data-syp-tour` 锚点，但只允许做最小补充，不改变业务逻辑。
- 与 `openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md` 建立流程联动，但不把帮助覆盖状态写入该 SSOT 主表，避免污染平台验证口径。
- 不影响发布适配器、传输层、平台配置存储格式和 V1/V2 发布契约。
