## Why

平台帮助/指南覆盖已经开始从轻量 `helpUrl` 升级为独立 `PageHelpConfig`。用户审计指出：平台实例 key 已经存在“完整平台 key + 实例 hash/id”的现有规则，不应该再为帮助系统另造一套示例 hash 匹配轮子。

本变更用于把平台配置帮助入口统一到现有 `src/platforms` 动态平台 key 规则：当 UI 传入 `platform-config/<platformKey>-<id>` 时，帮助系统应归一化到预置平台帮助配置 `platform-config/<platformKey>`；不存在对应预置配置时，再保持原有目录级和全局 fallback。

## What Changes

- 复用 `src/platforms/dynamicConfig.ts` 中既有 `getSubPlatformTypeByKey()` 动态平台 key 语义，不新增帮助系统专属 key 解析函数。
- `HelpRegistry.get()` 在精确匹配失败后，先尝试把 `platform-config/<platformKey>-<id>` 归一化到 `platform-config/<platformKey>`。
- `getField()` 与 `getTour()` 改为走同一套 `get()` fallback 链，确保实例 key 下字段帮助和 tour 也能复用预置平台配置。
- 移除此前错误方向的 `exampleMatching.ts`、`PageHelpConfig.examples` 和语雀 help config 中的人造示例 mapping。
- 增加回归测试覆盖 `common_Yuque-z2jom6d`、`custom_Yuqueweb-z2jom6d` 等实例 key。

## Capabilities

### New Capabilities

- `platform-guide-example-matching`: 定义并验证平台配置帮助入口如何复用现有动态平台 key 规则，将带实例 id/hash 的平台 pageId 归一化到预置平台帮助配置。

### Modified Capabilities

<!-- None in this proposal. The relationship with `complete-platform-help-tour-coverage` is documented in Impact and tasks, but this change does not mutate that active change's spec before user review. -->

## Impact

- 代码：`src/platforms/dynamicConfig.ts`、`src/helpConfigs/registry.ts`、相关测试。
- 清理：删除自造 `src/helpConfigs/exampleMatching.ts`，撤销 `PageHelpConfig.examples` 类型扩展和语雀示例配置。
- 不影响：发布适配器、V2 平台桥接、平台配置存储、远端发布 API。
