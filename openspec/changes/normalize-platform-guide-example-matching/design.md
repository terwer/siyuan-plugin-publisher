## Context

当前平台帮助系统以 `PageHelpConfig` 为主要载体，已经支持 `summary / fields / faq / tour / helpUrl` 等信息。上一轮 `complete-platform-help-tour-coverage` 把若干已验证平台从 `remaining-t1.ts` 轻量配置提升为独立配置。

用户指出的关键事实是：平台本身已经有 `src/platforms` 目录作为 SSOT，其中 `DynamicConfig.platformKey`、`getNewPlatformKey()`、`getSubPlatformTypeByKey()` 已经定义了动态平台 key 形态。典型实例 key 是 `common_Yuque-z2jom6d` 或 `custom_Zhihu-z2jom6d`，前半段是预置平台 key，后半段是实例 id/hash。

因此本变更不新增帮助系统自己的示例 hash 轮子，而是复用现有平台 key 规则，把带实例 id/hash 的平台配置帮助 pageId 归一化到预置平台帮助配置。

## Goals / Non-Goals

**Goals:**

- 复用 `src/platforms/dynamicConfig.ts` 的现有动态平台 key 规则。
- 让 `platform-config/<platformKey>-<id>` 可以命中已注册的 `platform-config/<platformKey>` help config。
- 保持原有精确匹配、目录 `_default`、全局 `_default` fallback 顺序清晰。
- 确保字段帮助和 tour 查询同样受益于平台 key 归一化。
- 删除此前错误方向的 `exampleMatching.ts` / `PageHelpConfig.examples` 扩展。

**Non-Goals:**

- 不修改发布适配器、认证流程、图床逻辑或平台配置存储。
- 不批量重写 guide 文案。
- 不新增示例级 hash / guide mapping 数据结构。
- 不把平台展示名作为匹配 key 来源。

## Decisions

### Decision 1: `src/platforms` 是平台 key 的 SSOT

平台 key 的拆分、实例 id/hash 的解析必须复用 `src/platforms/dynamicConfig.ts` 已有的 `getSubPlatformTypeByKey()`，而不是落在 `helpConfigs` 下另写一套规则。

现有函数已经能从预置 key 和实例 key 得到相同子平台类型：

```text
common_Yuque-z2jom6d -> SubPlatformType.Common_Yuque
custom_Yuqueweb-z2jom6d -> SubPlatformType.Custom_Yuqueweb
custom_Zhihu -> SubPlatformType.Custom_Zhihu
```

### Decision 2: HelpRegistry fallback 顺序增加平台归一化层

`HelpRegistry.get(pageId)` 的顺序为：

1. 精确匹配原始 `pageId`。
2. 若是 `platform-config/<platformKey>-<id>`，归一化到 `platform-config/<platformKey>`。
3. 目录级 `_default`。
4. 全局 `_default`。

这样已经有专属平台帮助配置的平台实例会命中专属文案；尚未迁移的平台仍能沿用原有 fallback。

### Decision 3: 字段帮助和 tour 复用同一 fallback 链

`getField()` 和 `getTour()` 不应绕过 `get()` 直接查 `pageConfigs`，否则实例 key 下页面级 helpUrl 能命中但字段/tour 不能命中。两者统一调用 `get(pageId)`。

### Decision 4: 回滚自造示例匹配结构

`PageHelpConfig.examples`、`PageHelpExampleMatch` 和 `src/helpConfigs/exampleMatching.ts` 属于重复造轮子，应删除。语雀 API 与语雀网页版不再在 help config 中维护人造 examples 数组。

## Risks / Trade-offs

- **风险：错误剥离包含连字符的未来平台 key** -> 当前 `getNewPlatformKey()` 明确用 `-` 分隔实例 id，本实现与现有规则一致；未来如允许平台 key 自身含 `-`，应先调整 `dynamicConfig` 的统一规则。
- **风险：实例 key 没有专属预置 help config** -> 继续落到目录 `_default`，与旧行为兼容。
- **风险：field/tour 以前返回 undefined，现在返回 fallback 配置字段** -> 这是预期修复；只对已注册预置平台配置生效。

## Migration Plan

1. 补充 `getSubPlatformTypeByKey()` 对实例 key 的单测，确认现有函数已覆盖需求。
2. 更新 HelpRegistry fallback 链及回归测试。
3. 删除自造 `exampleMatching` 文件、类型和语雀 examples 配置。
4. 运行目标测试与 `pnpm build:v2`。
5. 将 `complete-platform-help-tour-coverage` 覆盖日志更新为当前结论。
