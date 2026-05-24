# Bridge V2 Web 平台全量放出计划

## 目标

把当前被 Bridge V2 入口隐藏/过滤的网页平台完整放出，确保 CSDN、知乎等网页平台可以在 V2 Bridge 配置中被选择，用于提前验证真实修复触发后的发布链路。

## 当前阶段

- 状态：实现与自动化验证已完成；待用户在 V2 宿主中手验 CSDN、知乎配置/发布链路。
- 约束：只改共用平台注册/过滤层，避免在单个平台适配器或 useProxy 中堆临时 if；不改传输架构。

## 阶段

- [x] 阶段 1：定位 Bridge V2 平台来源与过滤规则
- [x] 阶段 2：识别所有 web 平台 key、配置、适配器可用性
- [x] 阶段 3：在共用层放出所有 web 平台到 Bridge V2 选择列表
- [x] 阶段 4：补充/调整测试或静态断言，覆盖 CSDN、知乎可选
- [x] 阶段 5：运行 lint/build/聚焦测试，并记录结果

## 关键约束

- 回复使用中文；Git 提交说明如需要则使用英文。
- V2 验证使用 `pnpm dev:v2`、`pnpm build:v2`、`pnpm makeLink:v2`，不使用 `pnpm dev -p siyuan`。
- 传输仍遵循：XML-RPC → `xmlrpcTransport`，multipart → `formUploadClient.postJson`，JSON/API → `jsonFetchClient.fetch`。
- 不新增 deprecated 再导出、双轨垫片或临时平台 if 链。
