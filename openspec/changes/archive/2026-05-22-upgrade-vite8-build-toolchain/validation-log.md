# Validation Log: upgrade-vite8-build-toolchain

> 本文件是 `upgrade-vite8-build-toolchain` 的验证证据 SSOT。所有命令结果、失败原因、环境信息、产物形状、宿主手测记录都固定追加到这里；`tasks.md` 只保留任务勾选与简要说明。

## 记录规范

每条记录 MUST 包含：

- 时间
- 阶段 / task id
- 命令或操作
- 环境
- 结果：✅ / ❌ / ⚠️
- 决定性输出摘要
- 后续处理

不得把失败测试、宿主手测、发布链路结果只写在对话里。

## 2026-05-22 — Vite 7 升级前基线

### 1.1 环境基线

| 项 | 结果 |
|----|------|
| `node -v` | `v22.22.0` |
| `pnpm -v` | `10.22.0` |
| `pnpm exec vite --version` | `vite/7.2.2 darwin-x64 node-v22.22.0` |
| `pnpm exec vue-tsc --version` | `Version 5.9.3` |

结论：本机 Node 满足 Vite 8 要求的 Node 20.19+ / 22.12+ baseline。

### 1.2 依赖基线

| package | 当前版本 |
|---------|----------|
| `vite` | `^7.2.2` |
| `@vitejs/plugin-vue` | `^6.0.1` |
| `vitest` | `^4.0.9` |
| `@vitest/coverage-v8` | `^4.0.9` |
| `vite-plugin-html` | `^3.2.2` |
| `vite-plugin-node-polyfills` | `^0.24.0` |
| `unplugin-auto-import` | `^20.2.0` |
| `unplugin-vue-components` | `^30.0.0` |
| `unplugin-icons` | `^22.5.0` |
| `typescript` | `5.9.3` |
| `vue-tsc` | `^3.1.4` |

### 1.3 基线自动化检查

#### `pnpm lint`

- 结果：✅
- 摘要：`vue-tsc --noEmit` 通过，无输出错误。

#### `pnpm build:v2`

- 结果：✅
- Vite：`vite v7.2.2 building client environment for production...`
- 摘要：`✓ 2408 modules transformed.`，`✓ built in 31.01s`
- 既有 warning：
  - `zhi-siyuan-picgo/dist/index.js` 使用 `eval`
  - `vm-browserify/index.js` 使用 `eval`
- 处理：记录为 Vite 7 既有 warning，后续 Vite 8 验证时对比是否新增或变化。

#### `pnpm test -- --run`

- 结果：❌（Vite 7 基线已有失败，非 Vite 8 引入）
- 总结：`Test Files 2 failed | 42 passed (44)`；`Tests 3 failed | 184 passed (187)`。
- 决定性失败：
  1. `src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.spec.ts`
     - 请求 `http://localhost:8002/api/v4/projects/.../repository/tree?...` 失败。
     - 沙箱内曾出现 `connect EPERM`；批准沙箱外重跑后仍失败，说明还依赖本地 GitLab mock/service，而非 Vite 8 变更。
  2. `src/composables/usePublishConfig.spec.ts`
     - 无法访问 `127.0.0.1:6806` 后触发既有 typo：`this.logger.errot is not a function`。
     - 相关位置：`src/stores/common/commonStorageAsync.ts:106`。
- 后续处理：Vite 8 升级后仍需重跑自动化检查；这些基线失败不得被误判为 Vite 8 新回归。若本变更要清理 typo 或本地服务依赖，需保持最小修复并单独记录原因。

### 1.4 Vite 7 V2 产物形状

命令：`pnpm build:v2` 后检查 `dist-v2`。

| artifact | 结果 |
|----------|------|
| `dist-v2/index.js` | 存在，`9,375,394 bytes` |
| `dist-v2/index.css` | 存在，`397,132 bytes` |
| `dist-v2/plugin.json` | 存在，`1,004 bytes` |
| `dist-v2/i18n/en_US.json` | 存在 |
| `dist-v2/i18n/zh_CN.json` | 存在 |
| `dist-v2/icon.png` | 存在 |
| `dist-v2/preview.png` | 存在 |
| `dist-v2/README.md` | 存在 |
| `dist-v2/README_zh_CN.md` | 存在 |
| `dist-v2/LICENSE` | 存在 |

`external: ["siyuan"]` 检查：

```text
dist-v2/index.js: const siyuan=require("siyuan")
```

结论：Vite 7 基线下，`siyuan` 保持 external require，没有被 bundle 进产物。

### 2.x 依赖升级前 registry 查询

命令：`pnpm view ... version` / `pnpm view ... peerDependencies --json`。

| package | registry 当前版本 | 相关结论 |
|---------|-------------------|----------|
| `vite` | `8.0.14` | 当前 Vite 8 stable patch |
| `@vitejs/plugin-vue` | `6.0.7` | `6.0.1` peer 只声明到 Vite 7；`6.0.7` peer 包含 `^8.0.0` |
| `vitest` | `4.1.7` | 暂不自动升级，除非 peer/兼容性要求 |
| `@vitest/coverage-v8` | `4.1.7` | 暂不自动升级，除非 peer/兼容性要求 |
| `vite-plugin-node-polyfills` | `0.28.0` | `0.24.0` peer 只声明到 Vite 7；`0.28.0` peer 包含 `^8.0.0` |
| `vite-plugin-html` | `3.2.2` | 当前已是 registry 版本 |
| `unplugin-auto-import` | `21.0.0` | 暂不自动升级，除非实际兼容性要求 |
| `unplugin-vue-components` | `32.1.0` | 暂不自动升级，除非实际兼容性要求 |
| `unplugin-icons` | `23.0.1` | 暂不自动升级，除非实际兼容性要求 |

初步升级策略：最小必要升级应至少包括 `vite -> 8.0.14`、`@vitejs/plugin-vue -> ^6.0.7`、`vite-plugin-node-polyfills -> ^0.28.0`；其它包先保持，除非 `pnpm install` / build / tests 给出明确兼容性证据。

## 2026-05-22 — Vite 8 dependency upgrade

### 2.1–2.3 最小依赖升级与安装

变更文件：`package.json`、`pnpm-lock.yaml`。

| package | 旧版本 | 新版本 | 原因 |
|---------|--------|--------|------|
| `vite` | `^7.2.2` | `^8.0.14` | 升级到 Vite 8 当前 stable patch |
| `@vitejs/plugin-vue` | `^6.0.1` | `^6.0.7` | `6.0.1` peer 只声明到 Vite 7；`6.0.7` peer 包含 Vite 8 |
| `vite-plugin-node-polyfills` | `^0.24.0` | `^0.28.0` | `0.24.0` peer 只声明到 Vite 7；`0.28.0` peer 包含 Vite 8 |

执行记录：

1. `pnpm install`
   - 结果：❌
   - 原因：沙箱 DNS 无法解析 registry：`ERR_PNPM_META_FETCH_FAIL ... getaddrinfo ENOTFOUND registry.npmjs.org`；同时非 TTY 导致 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`。
2. `CI=true pnpm install`（批准联网后）
   - 结果：❌
   - 原因：CI 默认 frozen lockfile，`ERR_PNPM_OUTDATED_LOCKFILE`，lockfile specifiers 与 package.json 不一致。
3. `CI=true pnpm install --no-frozen-lockfile`（批准联网后）
   - 结果：✅
   - 摘要：`Packages: +21 -10`，完成 lockfile 更新。
   - 当前确认：`pnpm exec vite --version` → `vite/8.0.14 darwin-x64 node-v22.22.0`。

### 2.4 install / peer warnings

安装过程 warning：

- `deprecated eslint@8.57.0`。
- `8 deprecated subdependencies`：`@humanwhocodes/config-array@0.11.14`、`@humanwhocodes/object-schema@2.0.3`、`@types/sass@1.45.0`、`@ungap/structured-clone@1.3.0`、`glob@7.2.3`、`glob@9.3.5`、`inflight@1.0.6`、`rimraf@3.0.2`。
- peer dependency warnings：
  - `esbuild-plugin-copy 2.1.1` missing peer `esbuild@">= 0.14.0"`。
  - `vite 8.0.14` missing peer `esbuild@"^0.27.0 || ^0.28.0"`。
  - `@terwer/esbuild-config-custom 2.0.0` missing peer `esbuild@^0.17.17`。
  - `@terwer/esbuild-config-custom 2.0.0` unmet peer `stylus@^0.59.0`，当前 `0.64.0`。
  - `Conflicting peer dependencies: esbuild`。

处理策略（待验证）：

- Vite 8 的 `esbuild` peer 属于当前升级直接相关，后续应优先确认是否需要新增 root `esbuild` devDependency。
- `@terwer/esbuild-config-custom` 的 `esbuild@^0.17.17` 与 Vite 8 `esbuild@^0.27.0 || ^0.28.0` 存在 peer 范围冲突；若新增单一 root `esbuild`，可能只能满足 Vite 8 与 `esbuild-plugin-copy`，但不能同时满足 `@terwer/esbuild-config-custom`。
- `stylus@^0.59.0` vs `0.64.0` 是升级前已有潜在 peer 问题，当前先记录，后续看 V2/V1 build 是否受影响。

## 2026-05-22 — Scope update: remove V1 historical esbuild chain

### 用户确认的新增决策

- 用户确认 `@terwer/esbuild-config-custom` 是 V1 历史产物，可直接移除。
- 用户说明如果 V2 表现好，V1 可能提前退役；因此本变更将同时整理 V1/V2 Vite config 命名边界。

### 被动审计结果

- `@terwer/esbuild-config-custom` 的直接引用仅存在于 `package.json` / `pnpm-lock.yaml`；业务运行时代码未 import。
- `zhi-build` bin 来自 `@terwer/esbuild-config-custom`，当前使用点：
  - `scripts/plugin_build.py`：`zhi-build --production`
  - `scripts/dev.py`：V1 siyuan dev bootstrap 使用 `zhi-build --production -d dist`
- `esbuild.config.cjs` 是 legacy V1 plugin CJS entry 构建配置，目标为 `siyuan/index.ts` → `dist/index.js`，external `siyuan`。
- 迁移策略：用 Vite 8/Rolldown 新增 `vite.v1.siyuan.config.ts` 替换 `zhi-build`；将旧 `vite.config.ts` 明确改名为 `vite.v1.app.config.ts`；V2 保持 `vite.v2.config.ts`。

## 2026-05-22 — Vite 8 config migration and esbuild-chain removal

### 2.x dependency refinement after user decision

用户追加确认：V1 historical `@terwer/esbuild-config-custom` 及迁移后 esbuild 相关 direct 链路都应直接移除。

实施结果：

- Removed direct devDependencies:
  - `@terwer/esbuild-config-custom`
  - `esbuild`
  - `esbuild-plugin-copy`
  - `esbuild-style-plugin`
- Removed legacy config file:
  - `esbuild.config.cjs`
- Updated Vite/Vitest aligned dependency set:
  - `vite`: `^8.0.14`
  - `@vitejs/plugin-vue`: `^6.0.7`
  - `vite-plugin-node-polyfills`: `^0.28.0`
  - `vitest`: `^4.1.7`
  - `@vitest/coverage-v8`: `^4.1.7`
- Lockfile regenerated by `CI=true pnpm install --no-frozen-lockfile`.

Install result:

- First install after adding temporary root `esbuild` succeeded but was superseded by user decision.
- Final install after removing direct esbuild chain: ✅
- Final install warning summary:
  - `deprecated eslint@8.57.0`
  - `6 deprecated subdependencies`: `@humanwhocodes/config-array@0.11.14`, `@humanwhocodes/object-schema@2.0.3`, `@ungap/structured-clone@1.3.0`, `glob@7.2.3`, `inflight@1.0.6`, `rimraf@3.0.2`
  - No direct `@terwer/esbuild-config-custom` / `esbuild-plugin-copy` / `esbuild-style-plugin` peer conflict remains.

`pnpm why esbuild` after final install:

- Root `package.json` has no direct `esbuild` dependency.
- `esbuild@0.28.0` remains only as optional/peer resolution under Vite 8 and Vite ecosystem packages.
- `esbuild@0.23.1` / `0.14.47` remain transitive under `tsx` / `vercel`; not part of the removed direct V1 esbuild build chain.

### 3.x Vite config naming and migration

Implemented config boundary cleanup:

- Removed ambiguous root `vite.config.ts`.
- Added `vite.v1.app.config.ts` for V1 iframe/app, widget, nginx, extension and vercel app builds.
- Added `vite.v1.siyuan.config.ts` for legacy V1 SiYuan plugin CJS entry build, replacing `zhi-build`.
- Kept `vite.v2.config.ts` for V2 SiYuan plugin host build.

Updated scripts:

- `scripts/plugin_build.py`: `vite build --config vite.v1.siyuan.config.ts`
- `scripts/siyuan_build.py`: `vite build --config vite.v1.app.config.ts`
- `scripts/dev.py`: V1 SiYuan plugin CJS prebuild uses `vite.v1.siyuan.config.ts`; V1 app watch uses `vite.v1.app.config.ts`
- `scripts/widget_build.py`: `vite.v1.app.config.ts`
- `scripts/nginx_build.py`: `vite.v1.app.config.ts`
- `scripts/ext_build.py`: `vite.v1.app.config.ts`
- `scripts/vercel_build.py`: `vite.v1.app.config.ts`

Deprecated Vite 8 config cleanup:

- `vite.v2.config.ts`: `build.rollupOptions` migrated to `build.rolldownOptions`.
- `vite.v1.app.config.ts`: `build.rollupOptions` migrated to `build.rolldownOptions`.
- V1 app `manualChunks(id)` migrated to Rolldown `output.codeSplitting.groups[].name(id)` preserving previous vendor chunk naming strategy:
  - previous: `manualChunks(id)` returned `vendor_<dep>` for `node_modules` / `.pnpm` ids.
  - new: `codeSplitting.groups` dynamic `name(id)` returns the same `vendor_<dep>` / `vendor` names.

### Config smoke checks

#### `pnpm lint`

- 结果：✅
- 命令：`pnpm lint`
- 摘要：`vue-tsc --noEmit` passed.

#### `pnpm build:v2`

- 结果：✅
- 命令：`pnpm build:v2`
- Vite：`vite v8.0.14`
- 摘要：`✓ 2261 modules transformed.`，`✓ built in 40.12s`
- Artifacts:
  - `dist-v2/index.css`: `393.44 kB` gzip `54.91 kB`
  - `dist-v2/index.js`: `9,534.38 kB` gzip `2,737.05 kB`
- Warnings:
  - `[EVAL]` from `vm-browserify/index.js`
  - `[EVAL]` from `zhi-siyuan-picgo/dist/index.js` two locations
  - `[PLUGIN_TIMINGS]`: `unplugin-icons` and `unplugin-vue-components` dominate build time
- 处理：这些 warning 与 Vite 7 基线 eval warning 同源或为 Rolldown timing diagnostics；不阻塞 V2 build，但保留为 host validation 关注项。

#### V1 legacy SiYuan config smoke

- 结果：✅
- 命令：`pnpm exec vite build --config vite.v1.siyuan.config.ts --outDir /private/tmp/syp-vite8-v1-siyuan-smoke`
- 摘要：`✓ 2261 modules transformed.`，`✓ built in 4.31s`
- Artifacts:
  - `/private/tmp/syp-vite8-v1-siyuan-smoke/index.js`: `13,795,041 bytes`
  - `/private/tmp/syp-vite8-v1-siyuan-smoke/assets/index.css`: `481,640 bytes`
  - `/private/tmp/syp-vite8-v1-siyuan-smoke/plugin.json`: `1,004 bytes`
  - static assets / i18n / public libs copied
- External check: `/private/tmp/syp-vite8-v1-siyuan-smoke/index.js` contains `require("siyuan")`.
- Warnings: same `[EVAL]` family as V2 build.
- 处理：V1 remains release-packaging gate only; this smoke proves the removed `zhi-build` path has a Vite-based replacement.

#### V1 app config smoke

- 结果：✅
- 命令：`BUILD_TYPE=siyuan pnpm exec vite build --config vite.v1.app.config.ts --outDir /private/tmp/syp-vite8-v1-app-smoke`
- 摘要：`✓ 2495 modules transformed.`，`✓ built in 9.99s`
- Warnings:
  - non-module script warning for bundled static libs in `index.html` (`lute` / `aliyun-oss`) — legacy app behavior.
  - `[EVAL]` warning from `vm-browserify` / `zhi-siyuan-picgo`.
  - chunk size warning for large V1 app chunks.
- 处理：V1 app remains release-packaging gate only; smoke result recorded for regression awareness.

## 2026-05-22 — Vite 8 automated test run #1

### 4.1 `pnpm test -- --run`

- 结果：❌
- 环境：Vite `8.0.14`，Vitest `4.1.7`，Node `v22.22.0`
- 摘要：`Test Files 3 failed | 41 passed (44)`；`Tests 2 failed | 183 passed (185)`。
- 决定性失败：
  1. `src/composables/usePublishConfig.spec.ts` suite import failure：`Failed to resolve import "~icons/material-symbols/format-list-bulleted"` from `src/components/set/PublishSetting.vue`。
     - 判断：删除默认 `vite.config.ts` 后新增的 `vitest.config.ts` 暂未包含 `unplugin-icons`，属于配置迁移遗漏，需补齐真实 Vite plugin 配置。
  2. `src/components/v2/settings/V2WebCookieAuthPanel.spec.ts` 单测失败：`mockElMessage.success` 未被调用。
     - 判断：需要检查组件与测试，不做 mock/占位处理。
  3. `src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.spec.ts` 仍依赖 `http://localhost:8002`，与 Vite 7 基线同类外部本地服务失败。
     - 判断：沿用基线分类，非 Vite 8 新增回归。
- 后续处理：补齐 `vitest.config.ts` 的 Vite plugin 后重跑失败/聚焦测试；GitLab local service 依赖继续作为已知基线失败记录。

## 2026-05-22 — Vitest config parity fix

命令：

```bash
pnpm test -- --run src/components/v2/settings/V2WebCookieAuthPanel.spec.ts src/composables/usePublishConfig.spec.ts
```

结果：❌（suite 总体仍因既有 GitLab localhost 依赖失败；Vite/Vitest 配置新增问题已解除）

关键输出：

- `Test Files 1 failed | 43 passed (44)`
- `Tests 1 failed | 186 passed (187)`
- remaining failure：`src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.spec.ts > test getUsersBlogs`
- decisive error：`request to http://localhost:8002/api/v4/projects/terwer%2Fterwer-github-io/repository/tree?... failed`

已修复的 Vite 8/Vitest 配置问题：

- `~icons/material-symbols/format-list-bulleted` virtual import 解析失败已消失。
- `V2WebCookieAuthPanel.spec.ts` 中 Cookie auth success/logout feedback 断言已通过；原因是 `vitest.config.ts` 补齐了 Element Plus auto import resolver，和真实 Vite 构建配置保持一致。
- 修复方式：在 `vitest.config.ts` 加入 `unplugin-icons`、`unplugin-auto-import`、`unplugin-vue-components` 和 `vite-plugin-node-polyfills`；未使用 mock/skip/占位。

分类：

- 当前唯一失败为 Vite 7 baseline 已存在的外部本地服务依赖（`localhost:8002` GitLab proxy），不是 Vite 8 新增回归。

## 2026-05-22 — Vite 8 full test gate

命令：

```bash
pnpm test -- --run
```

结果：❌（baseline-known external dependency failure）

关键输出：

- `Test Files 1 failed | 43 passed (44)`
- `Tests 1 failed | 186 passed (187)`
- Failure：`src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.spec.ts > test getUsersBlogs`
- Error：`request to http://localhost:8002/api/v4/projects/terwer%2Fterwer-github-io/repository/tree?... failed`

分类：

- 该失败与 Vite 7 baseline 中 `commonGitlabApiAdaptor.spec.ts` 依赖 `localhost:8002` 的失败一致。
- Vite 8/Vitest 配置新增失败（icons virtual import、Element Plus auto import）已解除。
- 本变更不使用 mock GitLab proxy，也不跳过该测试；作为既有环境依赖记录。

## 2026-05-22 — Focused transport tests

先尝试：

```bash
pnpm test -- --run src/utils/xmlrpcTransport.spec.ts src/utils/formUploadClient.spec.ts src/utils/jsonFetchClient.spec.ts src/utils/xmlrpcResponseUtil.spec.ts
```

观察：package script 的参数传递方式仍执行了全套 44 个 test files，因此该命令同样被 GitLab localhost 依赖阻塞。

最终聚焦命令：

```bash
pnpm exec vitest run src/utils/xmlrpcTransport.spec.ts src/utils/formUploadClient.spec.ts src/utils/jsonFetchClient.spec.ts src/utils/xmlrpcResponseUtil.spec.ts
```

结果：✅

关键输出：

- `Test Files 4 passed (4)`
- `Tests 39 passed (39)`
- Duration：`1.22s`

覆盖：

- XML-RPC transport selection / loopback safety
- form upload client
- json fetch client
- XML-RPC response normalization

## 2026-05-22 — V2 watch smoke

沙箱内命令：

```bash
pnpm dev:v2
```

结果：❌（sandbox port probing issue）

关键错误：

- `RangeError [ERR_SOCKET_BAD_PORT]: options.port should be >= 0 and < 65536. Received type number (65536).`
- 触发点：`rollup-plugin-livereload` 探测本地端口。

沙箱外命令：

```bash
pnpm dev:v2
```

结果：✅

关键观察：

- Vite：`vite v8.0.14 building client environment for production...`
- 初始 watch build：`✓ 2261 modules transformed.` / `built in 4254ms.`
- LiveReload：`LiveReload enabled on port 35730`
- watch 输出（minify=false）：
  - `dist-v2/index.css 481.64 kB │ gzip 67.13 kB`
  - `dist-v2/index.js 13,815.41 kB │ gzip 3,195.91 kB`
- 触发 rebuild：无内容重写 `src/composables/v2/v2FloatingUi.ts`。
- rebuild：`✓ 2261 modules transformed.` / `built in 5416ms.`
- 已用 Ctrl-C 停止 watch；手动中断导致 package lifecycle message，但 smoke 判定通过。

watch 后恢复 production build：

```bash
pnpm build:v2
node - <<'NODE'
const fs = require('fs')
for (const f of ['dist-v2/index.js', 'dist-v2/index.css', 'dist-v2/plugin.json']) {
  console.log(`${f}\t${fs.statSync(f).size}`)
}
const js = fs.readFileSync('dist-v2/index.js', 'utf8')
console.log(`siyuan external require present\t${js.includes('require("siyuan")') || js.includes("require('siyuan')")}`)
NODE
```

结果：✅

- `dist-v2/index.js 9534380`
- `dist-v2/index.css 393440`
- `dist-v2/plugin.json 1004`
- `siyuan external require present true`

## 2026-05-22 — makeLink:v2 initial attempt

沙箱内命令：

```bash
pnpm makeLink:v2
```

结果：❌

- 错误：`<urlopen error [Errno 1] Operation not permitted>`，无法访问 `127.0.0.1:6806`。

沙箱外命令：

```bash
pnpm makeLink:v2
```

结果：❌（需要人工选择 workspace）

脚本成功从 SiYuan 获取 3 个 workspaces：

- `[0] /Volumes/workspace/mydocs/SiYuanWorkspace/public`
- `[1] /Volumes/workspace/mydocs/SiYuanWorkspace/test`
- `[2] /Volumes/workspace/mydocs/SiYuanWorkspace/poc`

非交互运行在 `Please select a workspace[0-2]:` 处触发：

- `EOFError: EOF when reading a line`

处理：暂停 `pnpm makeLink:v2` / host validation，等待用户确认要链接的 workspace。

## 2026-05-22 — Post esbuild-text-cleanup quick regression

清理 package/scripts/Vite/Vitest 配置中的 direct esbuild 文本残留后运行：

```bash
pnpm lint
pnpm exec vitest run src/utils/xmlrpcTransport.spec.ts src/utils/formUploadClient.spec.ts src/utils/jsonFetchClient.spec.ts src/utils/xmlrpcResponseUtil.spec.ts
```

结果：✅

- `pnpm lint` exit 0
- Focused transport tests：`Test Files 4 passed (4)`、`Tests 39 passed (39)`

清理 esbuild 文本残留后补充运行：

```bash
pnpm build:v2
```

结果：✅

- `dist-v2/index.css 393.44 kB │ gzip 54.91 kB`
- `dist-v2/index.js 9,534.38 kB │ gzip 2,737.05 kB`
- warnings 仍为已分类的 dependency `eval` 与 plugin timings。


## 2026-05-22 — Windows host dependency sync and V2 rebuild

### 本机运行态差异修正

继续交接后发现当前 Windows 工作区代码已在 `upgrade/vite-8`（`082184df`），但 `node_modules` 仍解析到 Vite 7，且 `dist-v2` 为旧产物：

- `node -v`: `v24.14.0`
- `pnpm -v`: `10.22.0`
- 修正前 `pnpm exec vite --version`: `vite/7.2.2 win32-x64 node-v24.14.0`
- 修正前 `dist-v2/index.js`: `9,364,161 bytes`，mtime `2026-05-21 00:47:19`

处理：

```bash
pnpm install --no-frozen-lockfile
```

结果：✅

- lockfile 已是最新，仅同步本机 `node_modules`。
- `vite`: `7.2.2` → `8.0.14`
- `@vitejs/plugin-vue`: `6.0.1` → `6.0.7`
- `vite-plugin-node-polyfills`: `0.24.0` → `0.28.0`
- `vitest`: `4.0.9` → `4.1.7`
- `@vitest/coverage-v8`: `4.0.9` → `4.1.7`
- `zhi-blog-api`: `1.78.0` → `1.79.0`
- `zhi-siyuan-api`: `2.35.4` → `2.35.5`

修正后版本：

- `node -v`: `v24.14.0`
- `pnpm -v`: `10.22.0`
- `pnpm exec vite --version`: `vite/8.0.14 win32-x64 node-v24.14.0`
- `pnpm exec vue-tsc --version`: `Version 5.9.3`

`pnpm why esbuild`：root 仍无 direct `esbuild` 依赖；`esbuild@0.28.0` 为 Vite 8 peer/optional resolution，`0.23.1`/`0.14.47` 来自 `tsx`/`vercel` transitive。

### Windows `pnpm build:v2`

命令：

```bash
pnpm build:v2
```

结果：✅

- Vite：`vite v8.0.14 building client environment for production...`
- `✓ 2261 modules transformed.`
- `✓ built in 4.83s`
- Artifacts:
  - `dist-v2/index.css`: `393.44 kB` gzip `54.91 kB` / raw `393,440 bytes`
  - `dist-v2/index.js`: `9,534.38 kB` gzip `2,737.04 kB` / raw `9,534,380 bytes`
  - `dist-v2/plugin.json`: `1,046 bytes`（Windows 当前 checkout）
- `dist-v2/index.js` contains `require("siyuan")`，external 契约保持。
- warnings 与已分类一致：`vm-browserify` / `zhi-siyuan-picgo` direct `eval`，以及 `[PLUGIN_TIMINGS]`。

## 2026-05-22 — makeLink:v2 and host load on Windows test workspace

### makeLink:v2 idempotency fix

继续验证时，`pnpm makeLink:v2` 已能访问 SiYuan，但 Windows 现有正确符号链接被误判为错误：

```text
Error! 符号链接 ...\data\plugins\siyuan-plugin-publisher 已存在
但它链接到了 \\?\D:\Users\Administrator\Documents\mydocs\siyuan-plugins\siyuan-plugin-publisher\dist-v2
```

原因：Windows `os.readlink()` 返回 `\\?\` 前缀路径，而脚本 `_cmp_path()` 只做 slash 与尾部分隔符比较，导致同一路径假阴性。

修复：`scripts/make_dev_link.py` 的 `_cmp_path()` 增加路径规范化：去除 `\\?\` 前缀、`abspath`、`normpath`、统一 `/`、去掉尾部分隔符。

回归：

```bash
python -m py_compile scripts/make_dev_link.py
# stdin 选择 workspace 1: test
echo 1 | pnpm makeLink:v2
```

结果：✅

- 选择 workspace `[1] D:\Users\Administrator\Documents\mydocs\SiyuanWorkspace\test`。
- 输出：`Good! ...\data\plugins\siyuan-plugin-publisher 已经链接到 ...\dist-v2`。
- 链接检查：
  - `LinkType`: `SymbolicLink`
  - `Target/ResolvedTarget`: `D:\Users\Administrator\Documents\mydocs\siyuan-plugins\siyuan-plugin-publisher\dist-v2`
  - linked `index.js` / `index.css` / `plugin.json` all present.

### Host plugin load evidence

注意：当前 Windows 同时有 `public` 与 `test` 两个 workspace kernel；固定端口 `6806` 指向 `public`，Vite 8 验证目标为 `test` workspace kernel port `53494`。

命令/操作：

```text
POST http://127.0.0.1:53494/api/system/getConf
POST http://127.0.0.1:53494/api/petal/loadPetals {"frontend":"desktop"}
```

结果：✅

- SiYuan host：`3.6.5`
- OS：`Microsoft Windows 11 Pro`
- Workspace：`D:\Users\Administrator\Documents\mydocs\SiyuanWorkspace\test`
- `loadPetals` 返回：
  - `siyuan-plugin-devtool` enabled
  - `siyuan-plugin-publisher` enabled
- `siyuan-plugin-publisher` loaded payload:
  - `js_len`: `9,467,414`
  - `css_len`: `393,424`
  - JS SHA-256: `34de63795ad0d19ae2a90b429522fb68f840638236007ec7e1516dc9a3c84e4d`
  - CSS SHA-256: `277b73704dcf19d8ceb0ac7a9cf915b55594c5e4c5ea02e3692d149688008e90`
  - markers present: `require("siyuan")`、`SypErrorDetailsPanel`、`form-upload-transport`、`json-fetch-transport`
- `dist-v2` UTF-8 content hash matches host loaded payload:
  - JS SHA-256: `34de63795ad0d19ae2a90b429522fb68f840638236007ec7e1516dc9a3c84e4d`
  - CSS SHA-256: `277b73704dcf19d8ceb0ac7a9cf915b55594c5e4c5ea02e3692d149688008e90`
- `test/temp/siyuan.log` decisive lines:
  - `workspace directory [D:\Users\Administrator\Documents\mydocs\SiyuanWorkspace\test]`
  - `loaded petals [frontend=desktop, isPublish=false, petals=[siyuan-plugin-devtool,siyuan-plugin-publisher]]`

## 2026-05-22 — V2 host UI smoke via headless Chrome CDP

环境：

- SiYuan host：`3.6.5`
- Workspace：`D:\Users\Administrator\Documents\mydocs\SiyuanWorkspace\test`
- Kernel/UI URL：`http://127.0.0.1:53494/stage/build/desktop/?...`
- Browser：temporary headless Chrome `148.0.7778.168` with CDP port `9333`，profile under `%TEMP%\syp-vite8-cdp-profile`。

### Baseline SiYuan page load

操作：CDP 打开/连接 `http://127.0.0.1:53494/`，读取 DOM 与 console。

结果：✅

- page title：`未命名 - test - 思源笔记 v3.6.5`
- `document.readyState`: `complete`
- body text includes notebook/docs: `test`、`v2.0测试专用`、`特性测试`
- `blank`: `false`
- `badEvents`: none

### Publisher toolbar injection

操作：DOM 查询 publisher toolbar/style injection。

结果：✅

- `style#pluginsStylesiyuan-plugin-publisher` present.
- toolbar item present：`#plugin_siyuan-plugin-publisher_0` with `aria-label="发布工具"`。
- `window.syp` present.

### V2 quick publish shell

操作：CDP click `#plugin_siyuan-plugin-publisher_0`。

结果：✅

- Menu renders `.syp-v2` / `.syp-shell.is-quick-publish` / `.publisher-v2-menu-content`。
- Text includes:
  - `发布工具`
  - `快速发布`
  - `当前文档 特性测试`
  - `本地系统`：`可快速发布 已发布`，actions `更新` / `查看文章` / `删除`
  - `语雀网页版`：one `已发布` and one `未发布` card
  - `语雀` / `Wordpress`：`未授权` / `去配置`
- `blank`: `false`
- CDP observed no runtime exception or console blocker during quick-publish open.

### V2 settings/navigation and config error details

操作：从 quick publish 点击 `去配置`，进入 V2 settings；随后点击 `验证`（当前进入 `common_Yuque`）。

结果：✅（UI/error display smoke）

- Settings shell renders `.syp-shell.is-settings`。
- Text includes:
  - `发布设置`
  - `返回快速发布`
  - `设置导航`
  - nav sections: `账号设置` / `图床设置` / `偏好设置`
  - account form: `语雀`、`平台首页`、`API地址`、`用户名`、`鉴权token`、`知识库`、`图床服务`
- Inline guidance/error display:
  - `语雀 API（Token）需专业会员`
  - `配置错误或者api不可用，请检查。若修改过配置，请刷新页面`
  - after Validate: inline bar `API验证失败...语雀 API 返回 429（Too Many Requests）...`
- `SypErrorDetailsPanel` rendered as `.syp-error-details-panel` with:
  - title `配置验证失败`
  - summary/details include `429（Too Many Requests）` and professional membership copy
  - actions `复制` / `确认`
- `blank`: `false`

Observed console entries:

- Vue warning: `Extraneous non-emits event listeners (validated, saved)` at `YuqueSetting` / `V2PlatformConfigBridge`.
  - 分类：non-blocking warning；settings UI still renders and validation details are visible. 建议后续 cleanup，但不作为 Vite 8 blocker。
- `[commonblog-setting]` error for Yuque API 429.
  - 分类：expected platform-policy validation failure used to verify error surface; not a blank screen/runtime blocker.

### CSS / Lightning CSS impact check

基于本轮 CDP UI smoke，Vite 8 / Lightning CSS 输出可接受：

- `dist-v2/index.css` 单文件输出保持，host loaded CSS hash matches `dist-v2`。
- V2 quick publish shell、settings navigation、Element Plus alerts/forms/buttons、`SypErrorDetailsPanel` all render readable DOM and expected classes.
- No blank screen or runtime exception observed in quick publish/settings smoke.

### Scope note

本轮未点击 `发布` / `更新` / `删除` 以避免未经明确确认改动远端平台状态。#21 Cnblogs、#25 本地 WordPress、Yuque Web/API、本地系统的真实发布链路仍需按任务 5.3–5.5 继续做端到端手验或由用户确认可执行状态变更后再继续。


## 2026-05-22 — User-confirmed follow-up smoke

用户补充手测截图与结论：

- 语雀网页版：通过，更新成功；界面 toast 显示“文章目录已更改，发布信息已更新”“已在 [语雀网页版] 更新文章”。
- 博客园：通过，用户确认已完成测试。
- 构建收益：watch/build 反馈约 4–6 秒级，较此前大幅改善。
- WordPress：当前换机环境暂未测试，用户明确说明不作为本轮可用环境结论。

处理：

- 将 Yuqueweb / Cnblogs 作为已完成手测证据继续保留。
- WordPress 仍按“环境受限待补测”记录，不伪造通过。

## 2026-05-22 — Final approval for archive

- 用户最终确认：对 Vite 8 升级结果“很欣喜”，明确认可已清理大量历史包袱，开发体验提升巨大，后续扩展无压力，可维护性显著提升。
- 用户明确授权：`upgrade-vite8-build-toolchain` 可以归档。
- 归档判定：WordPress 未在当前换机环境实测，但已按环境受限如实记录；博客园、语雀网页版、V2 宿主与构建/验证链路已足以支撑本次升级结论，不再阻塞归档。
