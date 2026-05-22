## Why

基础设施重构已完成，V2 主机链路已经具备继续升级构建工具链的条件。当前项目已在 Vite 7 上运行，升级到 Vite 8 可以利用 Rolldown、Oxc 与 Lightning CSS 带来的构建性能与长期维护收益，同时提前消化 Vite 8 的迁移差异，避免后续被动升级。

本变更不追求快速合入，而是将 Vite 8 升级纳入 OpenSpec 跟踪，要求按可回滚、可验证、可复现的方式推进。

## What Changes

- 将主构建工具链从 `vite@^7.2.2` 升级到 Vite 8 当前稳定 patch 版本，并同步处理必要的 Vite 生态 peer / plugin 兼容性。
- 以 V2 SiYuan 插件构建链路为第一优先级：`pnpm dev:v2`、`pnpm build:v2`、`pnpm makeLink:v2`。
- 明确 Vite 8 迁移风险点并建立验证矩阵：Rolldown 输出差异、CJS/ESM interop、CSS minify、Node polyfill、`rollupOptions.output.manualChunks` function form、V1/V2 双构建配置差异。
- 保持业务逻辑不变；除构建配置、依赖版本与必要兼容修复外，不混入平台适配器或 UI 功能变更。
- 建立回滚机制：若 V2 插件加载或高价值发布链路失败，应能回退到 Vite 7 依赖与配置。

## Capabilities

### New Capabilities
- `vite8-build-toolchain`: 项目构建工具链 SHALL 支持 Vite 8，并通过静态检查、单元测试、V2 构建、插件加载与关键发布链路验证。

### Modified Capabilities
- `publish-host-fetch`: Vite 8 升级后，V2 插件宿主中的 fetch、XML-RPC、multipart/form-data 与 node polyfill 相关发布传输能力 MUST 保持现有运行时行为与回退顺序。

## Impact

- 依赖与锁文件：`package.json`、`pnpm-lock.yaml` 中的 `vite` 及必要 Vite 生态插件版本。
- 构建配置：`vite.v2.config.ts`、`vite.config.ts`，必要时补充迁移注释或兼容配置。
- 验证命令：`pnpm test`、`pnpm lint`、`pnpm build:v2`、`pnpm dev:v2`、`pnpm makeLink:v2`；必要时补充 V1 `pnpm build`、widget/nginx/ext 构建抽样。
- 宿主验证：SiYuan Electron 中 V2 插件加载、设置页、快速发布、图片上传、XML-RPC 传输与 Web/API 传输抽样。
- 风险区域：V2 `build.lib.formats: ["cjs"]` 输出、`nodePolyfills`、静态资源复制、CSS 单文件输出、external `siyuan`、V1 `manualChunks`、`vite-plugin-html` 与 livereload 插件。

## References

- Vite 8 announcement: https://vite.dev/blog/announcing-vite8
- Vite 7 → 8 migration guide: https://vite.dev/guide/migration
- Vite version support policy: https://vite.dev/releases
