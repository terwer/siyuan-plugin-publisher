## Why

`siyuan-plugin-picgo` 的历史包袱已经明显影响可维护性：包与包之间存在深度耦合、内部职责混杂、实现细节外泄到跨包调用中。现在适合把内部结构重整一次，但必须冻结对外 API，避免把维护成本和破坏风险继续传给后续功能。

## What Changes

- 重新梳理 `picgo-plugin-bootstrap`、`picgo-plugin-app`、`Universal-PicGo-Core`、`Universal-PicGo-Store`、`zhi-siyuan-picgo` 的内部职责边界。
- 用稳定的包级 facade 替换跨包深层 import 和实现细节外泄。
- 收敛重复的状态、存储、上传编排和 SiYuan 适配逻辑，降低模块间耦合。
- 增加公共契约与运行时回归验证，锁定现有插件入口、导出、数据兼容性和用户可见行为。
- **不改变对外 API**：不改公开导出名、不改强制配置字段、不改 manifest 结构、不改既有存储契约，除非后续单独提出新的变更。

## Capabilities

### New Capabilities
- `picgo-public-contract-stability`: 在内部重构期间保持现有公共入口、导出符号、插件清单、存储契约和用户可见行为稳定。

### Modified Capabilities
- 无

## Impact

- 受影响代码主要集中在 `packages/`、`libs/` 和少量 `scripts/` 辅助工具。
- 对外影响面包括插件入口、包级导出、设置页与上传/粘贴/菜单等现有运行时流程。
- 需要补充契约测试、构建验证和宿主 smoke，确保重构不改变外部 API。
