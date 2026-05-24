# Vite 8 构建工具链升级计划

> OpenSpec SSOT：`openspec/changes/upgrade-vite8-build-toolchain/`
> 验证日志 SSOT：`openspec/changes/upgrade-vite8-build-toolchain/validation-log.md`

## 目标

将项目从 Vite 7 升级到 Vite 8，保持 V2 SiYuan 插件输出契约与发布传输行为不变，并通过自动化、产物、watch、宿主、代表性平台验证。

## 当前阶段

- OpenSpec change：`upgrade-vite8-build-toolchain`
- OpenSpec tasks：21/32 已完成
- 当前状态：Vite 8 依赖、配置迁移、direct esbuild 链路移除、V2 build/lint/test 记录、dev:v2 watch smoke、transport 聚焦测试与 V1 smoke 已完成；makeLink:v2 因多 workspace 需要用户确认后继续宿主验证。

## 阶段

- [x] 阶段 1：OpenSpec 提案/设计/spec/tasks 创建并中文化
- [x] 阶段 2：写入用户确认决策（release packaging gate、manualChunks 立即迁移、验证 targets）
- [x] 阶段 3：建立 Vite 7 基线与固定验证日志
- [x] 阶段 4：升级 Vite 8 依赖并处理 peer/install warning
- [x] 阶段 5：修复 Vite 8 build/config/manualChunks/CSS 差异
- [x] 阶段 6：自动化验证（test/lint/build:v2/dev:v2/transport tests）
- [ ] 阶段 7：V2 宿主与代表性平台手测（#21/#25/Yuque API/web/本地系统）
- [ ] 阶段 8：升级报告、回滚审计、归档前严格 audit

## 关键约束

- V2 验证必须使用 `pnpm dev:v2`、`pnpm build:v2`、`pnpm makeLink:v2`。
- 不得使用 `pnpm dev -p siyuan` 作为 V2 验证路径。
- 不得使用 mock/占位验证替代真实证据。
- 业务逻辑不混入；除真实 Vite 8 回归需要的最小修复外，不改平台适配器逻辑。
- transport 修复必须保持 resolver/executor 分层，禁止 `useProxy` ad-hoc if-chain。
- V1/package/widget/nginx/ext 不作为本变更 merge gate，但作为 release packaging 前 mandatory gate。
- `manualChunks` function form 如出现 Vite 8 deprecation warning，本变更内立即迁移。
