## Context

项目当前使用 Vite 7（`vite@^7.2.2`），并存在两套主要构建配置：

- `vite.v2.config.ts`：V2 SiYuan 插件宿主构建。`pnpm dev:v2` 使用 `vite build --watch --config vite.v2.config.ts`，`pnpm build:v2` 使用 `vue-tsc --noEmit && vite build --config vite.v2.config.ts`。
- `vite.config.ts`：旧版/V1、widget、nginx、浏览器扩展等构建路径，由 Python 构建脚本间接调用。

V2 是本次升级的优先路径。用户已明确要求 V2 开发与验证必须使用 `pnpm dev:v2` 和 `pnpm makeLink:v2`；不得把 `pnpm dev -p siyuan` 当作 V2 验证路径。

Vite 8 引入默认基于 Rolldown 的构建行为、Oxc 转换、Lightning CSS 压缩、更严格的迁移注意事项，并要求 Node.js 基线为 Node 20.19+ 或 22.12+。评估时本机 Node 版本为 `v22.22.0`，满足该基线。

本升级属于影响面较大的基础设施变更，因此 MUST 独立于 V2 平台验证进行跟踪；不得使用 mock 数据或占位验证，不得夹带无关业务变更。

## Goals / Non-Goals

**Goals:**

- 将项目升级到 Vite 8，并形成可复现的依赖与锁文件变更。
- 保持 V2 SiYuan 插件输出契约不变：CJS 入口、CSS 输出、静态 metadata/i18n/assets、external `siyuan` 依赖。
- 保持 Electron/plugin 宿主中的发布传输行为不变，尤其是依赖 plugin/node fetch 与 loopback 路由规则的 XML-RPC 和 multipart 路径。
- 建立分层验证门禁，覆盖安装、静态/类型检查、单元测试、V2 构建、V2 watch 构建、SiYuan 插件加载以及高价值发布链路。
- 通过隔离依赖/config 变更与无关功能变更，保持回滚简单。

**Non-Goals:**

- 除非真实 Vite 8 回归要求最小兼容修复，否则不迁移平台适配器业务逻辑。
- 不替换 V2 架构、路由、存储或 UI 流程。
- 不在本变更中废弃 V1 或 iframe 路径。
- 不使用 mock 发布目标来声称平台验证通过。手动发布验证 MUST 使用真实已配置的沙箱/本地账号；如仅为 smoke 检查，必须明确标记。
- 不在 `useProxy` 中引入 ad-hoc transport if-chain；任何 transport 修复 MUST 保持 resolver/executor 分层。

## Decisions

### 1. 使用独立 OpenSpec 变更和分支粒度推进升级

Decision: Vite 8 工作由 `upgrade-vite8-build-toolchain` 跟踪，MUST NOT 混入当前活跃的 V2 平台验证变更。

Rationale: 平台验证失败应归因于平台/运行时行为，而不是构建工具变化。独立变更也让回滚和审计更简单。

Alternatives considered:

- 混入当前 V2 验证：拒绝，因为这会引入第二个移动变量。
- 等全部 V2 平台完成后再升级：拒绝，因为基础设施已经稳定，提前迁移可以降低长期风险。

### 2. 优先验证 V2 构建与宿主运行时，再处理 V1 等价性

Decision: 第一验收门禁是 V2：`pnpm build:v2`、`pnpm dev:v2`、`pnpm makeLink:v2` 以及 SiYuan 宿主 smoke/手动发布验证。V1/package/widget/nginx/ext 路径不作为本变更 merge gate，但 MUST 作为 release packaging 前 mandatory gate。

Rationale: V2 是当前战略宿主，且 `build --watch` 开发模式最直接受构建性能和构建行为影响。

Alternatives considered:

- 合入前强制所有 packaging target 全部通过：拒绝，因为对第一轮 Vite 8 落地过宽；但 release packaging 前 MUST 完成定向 V1/package/widget/nginx/ext 检查。

### 3. 将 Vite 8 Rolldown 差异视为真实运行时风险

Decision: 不假设 Rollup 兼容配置在 Rolldown 下行为完全一致。必须检查生成产物，并执行宿主级验证，包括 CJS 入口加载、external 化、CSS 文件命名、静态复制输出、dynamic/chunk 输出。

Rationale: V2 使用 `build.lib.formats: ["cjs"]`、Node polyfills、`closeBundle` 静态复制，以及 external `siyuan`。这些边界很可能出现“构建成功但运行时失败”。

Alternatives considered:

- 只依赖 `pnpm build:v2`：拒绝，因为构建成功不能证明 SiYuan 能加载插件 bundle。

### 4. 保持 transport 架构不回退

Decision: 如果 Vite 8 暴露 transport 回归，修复 MUST 位于既有 resolver/executor 抽象内，例如 `resolveXmlrpcTransport` / `executeXmlrpcTransport` 和 `FormDataUtils` 风格分层。

Rationale: 项目约定明确拒绝在 `useProxy` 中增加 ad-hoc transport if-chain；近期基础设施重构已经形成更清晰的分层。

Alternatives considered:

- 直接 patch 调用点：拒绝，因为会破坏架构，并增加后续平台验证难度。

### 5. 使用验证证据，而不是假设

Decision: 每个完成声明都 MUST 记录命令、环境和观察结果。手动宿主检查 MUST 记录平台、SiYuan 宿主模式、V2 插件加载结果和发布目标类别。

Rationale: Vite 升级可能出现只在运行时暴露的细微问题。证据能保证可复现，避免虚假信心。

Alternatives considered:

- 只更新依赖并依赖现有测试：拒绝，因为当前测试没有覆盖全部宿主运行时行为。

## Risks / Trade-offs

- [Risk] Rolldown 改变 chunk 输出或 CJS interop，导致 SiYuan 无法加载 → Mitigation: 检查 `dist-v2/index.js`，运行 `pnpm makeLink:v2`，并在完成前验证 SiYuan 内插件激活。
- [Risk] `vite.config.ts` 中的 `manualChunks(id)` function form 在 Vite 8 下被 deprecated，可能需要迁移 → Mitigation: 本变更中立即迁移，不创建 release 前 follow-up，也不得静默忽略 warning。
- [Risk] Lightning CSS 改变 CSS 输出或压缩结果 → Mitigation: 验证 `index.css`、V2 设置 UI、深浅色主题、Element Plus 组件渲染和关键页面。
- [Risk] `vite-plugin-node-polyfills` 在 Vite 8 下行为变化 → Mitigation: 运行 transport 单测，并在 Electron/plugin 宿主中手测 XML-RPC/multipart 流程。
- [Risk] Vite plugin 生态 peer 依赖滞后于 Vite 8 → Mitigation: 只升级必要插件，记录 peer warning，避免无关依赖大范围漂移。
- [Risk] V2 通过但 V1/package target 回归 → Mitigation: 将 V1/package/widget/nginx/ext 检查作为 release packaging 前 mandatory gate；记录准确失败，不因为 V2 调查而隐藏风险。
- [Risk] 构建速度提升但行为回归 → Mitigation: 正确性门禁为 mandatory；性能观察只是辅助证据，不作为验收标准。

## Migration Plan

1. 建立当前 Vite 7 基线：
   - 记录 `node -v`、`pnpm -v`、`pnpm exec vite --version`。
   - 在可行时运行并记录 `pnpm test`、`pnpm lint`、`pnpm build:v2`。
   - 可选：捕获 `dist-v2` 产物形状用于对比。
2. 升级依赖集合：
   - 将 `vite` 更新到 Vite 8 当前稳定 patch。
   - 仅在兼容性或 peer 要求需要时调整 `@vitejs/plugin-vue`、Vitest 和 Vite plugins。
   - 使用 `pnpm install` 重新生成 `pnpm-lock.yaml`。
3. 解决 build/config 问题：
   - 用最小变更处理 Vite 8 warning 和 error。
   - 除非用户明确批准输出契约变更，否则保持 V2 输出契约不变。
4. 运行自动化验证：
   - `pnpm test`
   - `pnpm lint`
   - `pnpm build:v2`
   - 使用 `pnpm dev:v2` 做 V2 watch smoke。
5. 运行宿主验证：
   - `pnpm makeLink:v2`
   - 在 SiYuan Electron host 加载插件。
   - 验证 V2 设置、账号验证反馈、快速发布、更新/删除、图片发布。
   - 固定使用已完成 V2 全量验证且具代表性的 targets：#21 Cnblogs、#25 本地 WordPress、Yuque API/web、本地系统。
6. 第二层/release 验证：
   - V1/package/widget/nginx/ext 检查不阻塞本变更 merge，但 release packaging 前 MUST 全部完成并记录结果。
7. 必要时回滚：
   - 回退 Vite 8 dependency/config commits，不回退平台验证或无关 source changes。
   - 暂停前在 `tasks.md` 记录 blocker 与最小复现。

## Resolved Questions

- V1/package/widget/nginx/ext 构建检查只作为 release packaging 前 mandatory gate，不作为本变更 merge gate。
- 如果 Vite 8 对 `manualChunks` function form 发出 deprecation warning，本变更 MUST 立即迁移，不创建专门 follow-up。
- 最终手动发布验证 targets 固定为 #21 Cnblogs、#25 本地 WordPress、Yuque API/web、本地系统；这些平台均已 100% 通过 V2 全量验证，且覆盖 XML-RPC、API/web、图片与本地系统等代表性路径。
