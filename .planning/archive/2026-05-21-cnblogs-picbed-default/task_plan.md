# 博客园默认图床修复

## 目标
博客园（`CnblogsConfig`）新建/合并配置时，平台默认图床为 **当前平台（Bundled）**，与 `YuquewebConfig` 一致。

## 约束
- `PicbedServiceTypeEnum.None` 表示用户明确选择「不使用」，**禁止**在全局 `getPicbedServiceType` 中将 `None` 视为未配置。
- **禁止**在未规划的情况下修改 `usePicgoBridge` 默认推断逻辑。
- 修复仅落在平台配置类 + 单测。

## 阶段
- [x] 阶段 1：在 `CnblogsConfig` 构造函数显式设置 `picbedService = Bundled`
- [x] 阶段 2：移除误加的 `isUnsetPicbedService` 及任何全局 None 覆盖逻辑
- [x] 阶段 3：添加 `cnblogsConfig.spec.ts` 断言默认 Bundled

## 不在本次范围
- 不迁移用户已持久化保存的 `picbedService: None`（用户需手动改选「当前平台」并保存）
- 不修改 WordPress / 其它 Metaweblog 平台（待单独规划）
