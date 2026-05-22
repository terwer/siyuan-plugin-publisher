## ADDED Requirements

### Requirement: Vite 8 dependency baseline
项目 SHALL 使用 Vite 8 作为主要 Vite 依赖，并 SHALL 保持相关 Vite 生态包版本与已安装 Vite 8 release 兼容。

#### Scenario: Dependency versions are aligned
- **WHEN** 升级后完成 `pnpm install`
- **THEN** lockfile 将 Vite 解析为 Vite 8 release，且不存在未解决的 Vite peer dependency conflict

#### Scenario: Runtime baseline is documented
- **WHEN** 开发者查看升级说明
- **THEN** Vite 8 支持的 Node.js baseline 已记录，且 incompatible local Node versions 会在 build validation 前被明确指出

### Requirement: V2 build output remains SiYuan plugin compatible
V2 build SHALL 生成与 Vite 7 build 相同 public output contract 的 SiYuan-compatible plugin bundle。

#### Scenario: V2 production build succeeds
- **WHEN** 执行 `pnpm build:v2`
- **THEN** `dist-v2/index.js`、`dist-v2/index.css`、`dist-v2/plugin.json`、i18n files、license/readme files 和 icon assets 会生成在预期位置

#### Scenario: V2 watch build remains usable
- **WHEN** 开发时执行 `pnpm dev:v2`
- **THEN** V2 build watch process 会输出有效 `dist-v2` 产物，且不需要使用已弃用的 V1 命令 `pnpm dev -p siyuan`

#### Scenario: SiYuan external remains external
- **WHEN** build 后检查 `dist-v2/index.js`
- **THEN** SiYuan host API 按 `external: ["siyuan"]` 保持 externalized，且不会被意外 bundle 到 plugin output 中

### Requirement: Vite config migration is explicit
项目 SHALL 明确 Vite 8 迁移选择，覆盖 Rollup/Rolldown、CJS/ESM interop、CSS minification 和 output splitting behavior。

#### Scenario: Deprecated output splitting is addressed
- **WHEN** `vite.config.ts` 或 `vite.v2.config.ts` 使用 output chunking configuration
- **THEN** 任何 Vite 8 deprecated `manualChunks` function usage 都已在本变更中迁移，并记录 chunking strategy 与预期输出差异

#### Scenario: CSS output contract is verified
- **WHEN** 使用 Vite 8 构建 V2
- **THEN** V2 的单 CSS 输出契约仍为 `dist-v2/index.css`，或已记录一个明确批准的替代方案

#### Scenario: CJS library output is verified
- **WHEN** V2 使用 `build.lib.formats: ["cjs"]` 构建
- **THEN** 生成的 entry 能被 SiYuan Electron plugin host 加载，且不会出现 import/export runtime errors

### Requirement: Validation gate for upgrade completion
Vite 8 upgrade SHALL NOT 被视为完成，直到 automated 和 manual validation gates 已通过，或其 exceptions 被明确记录。

#### Scenario: Automated validation gate passes
- **WHEN** 升级准备进入 review
- **THEN** `pnpm test`、`pnpm lint` 和 `pnpm build:v2` 已在 Vite 8 dependency set 下通过

#### Scenario: Manual V2 host validation passes
- **WHEN** 升级准备进入 review
- **THEN** 已使用 `pnpm makeLink:v2` 在 SiYuan 中加载 V2 plugin，并记录 plugin load、settings navigation，以及 #21 Cnblogs、#25 本地 WordPress、Yuque API/web、本地系统的 quick publish、update/delete、image publish 或对应等价验证

#### Scenario: Rollback path exists
- **WHEN** 发现 blocking Vite 8 runtime regression
- **THEN** 本变更可以通过恢复 Vite 7 dependency/configuration changes 来回退，且不会回退无关 platform verification work
