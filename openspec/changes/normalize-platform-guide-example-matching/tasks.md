# Tasks: normalize-platform-guide-example-matching

> 当前实现口径：不再自造 `exampleMatching` / 示例级 hash 轮子；复用 `src/platforms/dynamicConfig.ts` 的动态平台 key 规则，把 `platform-config/<platformKey>-<id>` 归一化到 `platform-config/<platformKey>`。

## 1. 审计与方向纠偏

- [x] 1.1 定位现有平台 key SSOT：`src/platforms/dynamicConfig.ts`、`DynamicConfig.platformKey`、`getNewPlatformKey()`、`getSubPlatformTypeByKey()`。
- [x] 1.2 确认动态平台实例 key 形态为 `<platform>_<SubPlatform>-<id>`，帮助系统应复用前半段预置平台 key。
- [x] 1.3 回滚/删除自造 `src/helpConfigs/exampleMatching.ts`。
- [x] 1.4 回滚/删除 `PageHelpConfig.examples`、`PageHelpExampleMatch` 等帮助专属示例匹配类型。
- [x] 1.5 移除语雀 API / 语雀网页版 help config 中的人造 `examples` 配置。

## 2. 实现

- [x] 2.1 复用 `src/platforms/dynamicConfig.ts` 已有 `getSubPlatformTypeByKey()`，不新增帮助系统专属 key 解析函数。
- [x] 2.2 在 `HelpRegistry.get()` 精确匹配之后、目录 `_default` 之前增加平台实例 key 归一化。
- [x] 2.3 将 `getField()` 改为复用 `get()` fallback 链。
- [x] 2.4 将 `getTour()` 改为复用 `get()` fallback 链。

## 3. 测试

- [x] 3.1 增加 RED 回归测试：`platform-config/common_Yuque-z2jom6d` 原本会落到 `platform-config/_default`。
- [x] 3.2 增加 GREEN 测试：动态语雀 API / 语雀网页版实例 key 命中预置平台 help config。
- [x] 3.3 增加 `getHelpUrl()` 动态实例 key 回归测试。
- [x] 3.4 增加 `getField()` 动态实例 key 回归测试。
- [x] 3.5 增加 `getTour()` 动态实例 key 回归测试。
- [x] 3.6 补充 `getSubPlatformTypeByKey()` 对动态实例 key 的单测。

## 4. 文档与联动

- [x] 4.1 更新 proposal/design/spec，删除旧示例级 hash 方案描述。
- [x] 4.2 更新 `complete-platform-help-tour-coverage/coverage-log.md`，记录用户 review 与本次归一化结论。
- [x] 4.3 运行 `openspec status --change normalize-platform-guide-example-matching`。

## 5. 验证

- [x] 5.1 运行 `pnpm vitest run src/helpConfigs/registry.spec.ts src/platforms/dynamicConfig.spec.ts`。
- [x] 5.2 运行 `pnpm build:v2`。
- [x] 5.3 检查 `exampleMatching` / `PageHelpExample` / `examples` 残留引用为 0。
