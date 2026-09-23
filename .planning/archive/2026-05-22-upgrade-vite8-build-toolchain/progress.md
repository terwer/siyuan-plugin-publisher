# Progress: Vite 8 构建工具链升级

## 2026-05-22

- 使用 `$openspec-apply-change upgrade-vite8-build-toolchain` 开始实施。
- 已读取 OpenSpec proposal/design/specs/tasks。
- 完成 OpenSpec tasks 1.1–1.5：
  - 环境基线：Node `v22.22.0`、pnpm `10.22.0`、Vite `7.2.2`、vue-tsc `5.9.3`。
  - 依赖基线已记录。
  - `pnpm lint` ✅。
  - `pnpm build:v2` ✅。
  - `pnpm test -- --run` ❌，确认是 Vite 7 既有失败，不是 Vite 8 引入。
  - Vite 7 `dist-v2` 产物形状已记录。
- 按用户要求，创建固定验证日志：`openspec/changes/upgrade-vite8-build-toolchain/validation-log.md`。
- 已将 `tasks.md` 的 evidence log 改为指向 `validation-log.md`，避免证据只存在对话中。
- 建立本 planning 目录并切换 `.planning/.active_plan`。

## 当前待办

1. 执行依赖升级：`vite`、`@vitejs/plugin-vue`、`vite-plugin-node-polyfills`。
2. 运行 `pnpm install`，记录所有 install/peer warning 到 `validation-log.md`。
3. 继续 OpenSpec tasks 2.1–2.4。

## 2026-05-22 — 依赖升级推进

- 已将 `package.json` 中三项最小必要依赖升级：
  - `vite`: `^7.2.2` → `^8.0.14`
  - `@vitejs/plugin-vue`: `^6.0.1` → `^6.0.7`
  - `vite-plugin-node-polyfills`: `^0.24.0` → `^0.28.0`
- 初次 `pnpm install` 因沙箱 DNS/非 TTY 失败；按权限流程批准联网后，使用 `CI=true pnpm install --no-frozen-lockfile` 成功更新 lockfile。
- 当前 `pnpm exec vite --version`：`vite/8.0.14 darwin-x64 node-v22.22.0`。
- 已将 install warning 与 peer warning 固定写入 `openspec/changes/upgrade-vite8-build-toolchain/validation-log.md`。
- 待处理：`esbuild` peer 冲突/缺失需要进一步确认处理方式，再标记 2.4 完成。

## 2026-05-22 — 用户新增决策：V1 历史 esbuild 链路退场

- 用户确认：`@terwer/esbuild-config-custom` 是 V1 历史产物，可直接从 `package.json` 移除。
- 用户补充方向：如 V2 表现良好，V1 可能提前退役；本次 Vite 8 变更应让构建命名更清晰。
- 记录的实施理解：
  - 删除 V1 历史 `zhi-build` / `@terwer/esbuild-config-custom` 相关构建链路。
  - 将原含混的 `vite.config.ts` 拆名为 `vite.v1.app.config.ts`，用于 V1 iframe/app、widget、nginx、extension 等 app 构建。
  - 新增 `vite.v1.siyuan.config.ts`，用于 V1 legacy SiYuan plugin CJS 入口构建。
  - V2 继续使用 `vite.v2.config.ts`，`pnpm dev:v2` / `pnpm build:v2` 不变。
- 已开始被动审计：`pluginBuild` 当前依赖 `zhi-build --production`；该 bin 来自 `@terwer/esbuild-config-custom`，因此移除依赖前必须替换 `scripts/plugin_build.py`。

## 2026-05-22 — Vite config 边界迁移与 esbuild 链路清理

- 已按用户要求彻底移除 direct esbuild 历史链路：
  - 删除 `@terwer/esbuild-config-custom`、`esbuild`、`esbuild-plugin-copy`、`esbuild-style-plugin` direct devDependencies。
  - 删除 `esbuild.config.cjs`。
  - `pnpm why esbuild` 显示根依赖已无 direct esbuild；剩余 esbuild 仅来自 Vite/Vitest/Vercel/tsx transitive 或 optional peer resolution。
- 已拆分 Vite 配置边界：
  - 删除含混的 `vite.config.ts`。
  - 新增 `vite.v1.app.config.ts` 作为 V1 iframe/app、widget、nginx、extension、vercel app 构建配置。
  - 新增 `vite.v1.siyuan.config.ts` 作为 V1 legacy SiYuan CJS plugin entry 构建配置，替代 `zhi-build`。
  - V2 保持 `vite.v2.config.ts`。
- 已迁移 Vite 8 deprecated 配置：
  - `rollupOptions` → `rolldownOptions`。
  - V1 app `manualChunks(id)` → `output.codeSplitting.groups[].name(id)`，保留 `vendor_<dep>` 命名策略。
- 已更新 Python build scripts 指向明确 config：`plugin_build.py`、`siyuan_build.py`、`dev.py`、`widget_build.py`、`nginx_build.py`、`ext_build.py`、`vercel_build.py`。
- 验证：
  - `pnpm lint` ✅。
  - `pnpm build:v2` ✅，Vite 8 输出 `dist-v2/index.js` / `index.css` 成功。
  - V1 legacy SiYuan config smoke ✅ 到 `/private/tmp/syp-vite8-v1-siyuan-smoke`。
  - V1 app config smoke ✅ 到 `/private/tmp/syp-vite8-v1-app-smoke`。

## 2026-05-22 — 自动化 test 首轮失败记录

- 运行 `pnpm test -- --run`：❌。
- 结果：`Test Files 3 failed | 41 passed (44)`，`Tests 2 failed | 183 passed (185)`。
- 新发现：删除默认 `vite.config.ts` 后新增 `vitest.config.ts` 未包含 `unplugin-icons`，导致 `~icons/*` virtual import 无法解析。下一步补齐真实 Vite plugin 配置。
- 待诊断：`V2WebCookieAuthPanel.spec.ts` 的 `ElMessage.success` 断言未触发，需看组件/测试确认是否为 Vitest 4.1/Vite 8 配置迁移影响。
- 既有失败：`commonGitlabApiAdaptor.spec.ts` 仍依赖 `localhost:8002`，与 Vite 7 基线一致。

## 2026-05-22 — 继续执行用户确认：迁移完成后移除 esbuild 相关

- 用户再次明确：迁移完后 esbuild 相关直接移除，不保留旧链路兼容层。
- 复核当前状态：`package.json` 已无 direct `@terwer/esbuild-config-custom`、`esbuild`、`esbuild-plugin-copy`、`esbuild-style-plugin`；`esbuild.config.cjs` 已删除；`scripts/plugin_build.py` 与 `scripts/dev.py` 已改走 `vite.v1.siyuan.config.ts`。
- 当前残留的 `esbuild` 仅在 `pnpm-lock.yaml` 中作为 Vite/Vitest/tsx/vercel 的传递或 optional peer resolution 存在，不属于旧 V1 direct esbuild build chain。
- 下一步继续处理 `pnpm test -- --run` 暴露的真实配置问题：新增 `vitest.config.ts` 需要补齐 Vite plugin 栈，尤其是 `unplugin-icons` 以解析 `~icons/*`。

## 2026-05-22 — Vitest 配置补齐与聚焦验证

- 已更新 `vitest.config.ts`，让 Vitest 使用真实 Vite plugin 栈：`vue()`、`unplugin-icons`、Element Plus `AutoImport`、`Components`、`vite-plugin-node-polyfills`。
- 目的：恢复删除默认 `vite.config.ts` 后丢失的 virtual icon、Element Plus auto import、Node polyfill 解析能力；不是 mock 或跳过测试。
- 运行聚焦命令：`pnpm test -- --run src/components/v2/settings/V2WebCookieAuthPanel.spec.ts src/composables/usePublishConfig.spec.ts`。
- 结果：`V2WebCookieAuthPanel.spec.ts` 与 `usePublishConfig.spec.ts` 已随套件通过；当前剩余失败只剩 `src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.spec.ts` 依赖 `http://localhost:8002`，与 Vite 7 基线一致。
- 注意：Vitest CLI 在当前 package 脚本下仍运行了全部 44 个 test files，而不是仅限参数中的两个文件；后续 full test 仍按完整结果记录。

## 2026-05-22 — full test 与 transport 聚焦验证

- 运行 `pnpm test -- --run`：❌，结果 `Test Files 1 failed | 43 passed (44)`、`Tests 1 failed | 186 passed (187)`。
- 剩余唯一失败：`src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.spec.ts` 请求 `http://localhost:8002/...` 失败；与 Vite 7 基线一致，分类为本地 GitLab proxy 服务未启动，不是 Vite 8 回归。
- 运行 `pnpm test -- --run src/utils/...` 时发现 package script 参数传递方式会导致仍执行全套；改用 `pnpm exec vitest run ...` 做聚焦验证。
- 运行 `pnpm exec vitest run src/utils/xmlrpcTransport.spec.ts src/utils/formUploadClient.spec.ts src/utils/jsonFetchClient.spec.ts src/utils/xmlrpcResponseUtil.spec.ts`：✅，`Test Files 4 passed (4)`、`Tests 39 passed (39)`。

## 2026-05-22 — V2 watch smoke 与 makeLink:v2 首次尝试

- `pnpm dev:v2` 首次在沙箱内失败：`rollup-plugin-livereload` 探测端口时因沙箱网络限制递增到非法端口 `65536`，报 `ERR_SOCKET_BAD_PORT`。
- 按权限流程在沙箱外运行 `pnpm dev:v2`：✅。
  - 初始 watch build 成功，输出 `dist-v2/index.css 481.64 kB`、`dist-v2/index.js 13,815.41 kB`，这是 watch/minify=false 模式下预期比 production 大。
  - LiveReload 启动在 `35730`（`35729` 被占用或不可用）。
  - 用无内容重写 `src/composables/v2/v2FloatingUi.ts` 触发 rebuild：✅，再次 `✓ 2261 modules transformed`、`built in 5416ms`。
  - 之后用 Ctrl-C 停止 watch；退出码因手动中断显示 lifecycle failed，但 watch smoke 已完成。
- watch smoke 后重新运行 `pnpm build:v2` 恢复 production `dist-v2`：✅，`index.js 9,534,380 bytes`、`index.css 393,440 bytes`、`plugin.json 1,004 bytes`、`require("siyuan")` external 存在。
- `pnpm makeLink:v2` 首次在沙箱内失败：无法访问 `127.0.0.1:6806`。
- 沙箱外重试 `pnpm makeLink:v2` 能访问 SiYuan API，但检测到 3 个 workspace 并需要人工选择，非交互执行触发 `EOFError`。需要用户确认链接到哪个 workspace（public/test/poc）后继续宿主验证。

## 2026-05-22 — OpenSpec artifact 同步

- 已将用户“迁移后 esbuild 相关直接移除”的最终决策同步到 OpenSpec：`proposal.md`、`design.md`、`specs/vite8-build-toolchain/spec.md`。
- 已在 `tasks.md` 标记完成：
  - 4.1 full test 已运行并记录（剩余 GitLab localhost baseline-known failure）。
  - 4.4 `pnpm dev:v2` watch smoke 已通过。
  - 4.5 XML-RPC/form upload/json fetch 聚焦 transport tests 已通过。
- 已更新 planning `task_plan.md`：阶段 6 自动化验证完成；下一阶段等待用户确认 `pnpm makeLink:v2` 应链接到哪个 SiYuan workspace。

## 2026-05-22 — esbuild 文本残留清理

- 复查 package/scripts/Vite/Vitest 配置中的 esbuild 相关文本残留。
- 删除 `vite.v1.app.config.ts` 中旧注释 `boolean | 'terser' | 'esbuild'`，避免误导为仍支持 direct esbuild minifier 决策。
- 更新 `scripts/parse_changelog.py` docstring 示例中的历史 `esbuild-config-custom` 字样为中性的 release tooling 示例；该文件仅是 changelog parse 示例，但按用户“迁移后 esbuild 相关直接移除”的要求一并清掉。
- 当前 `package.json`、`scripts/`、`vite.v1*.config.ts`、`vite.v2.config.ts`、`vitest.config.ts` 已无 direct esbuild / `zhi-build` / `@terwer/esbuild-config-custom` 文本引用。

## 2026-05-22 — 清理注释后快速回归

- 清理 esbuild 文本残留后运行快速回归：
  - `pnpm lint` ✅。
  - `pnpm exec vitest run src/utils/xmlrpcTransport.spec.ts src/utils/formUploadClient.spec.ts src/utils/jsonFetchClient.spec.ts src/utils/xmlrpcResponseUtil.spec.ts` ✅，`4 passed / 39 passed`。

## 2026-05-22 — 清理注释后 build:v2 回归

- 运行 `pnpm build:v2`：✅。
- 输出保持 production 形态：`dist-v2/index.css 393.44 kB`、`dist-v2/index.js 9,534.38 kB`。
- warnings 仍为已记录的 dependency eval 与 plugin timings，无新增构建错误。

## 2026-05-22 — 下班交接文档

- 按用户要求在 `docs/` 下新增固定交接文档：`docs/Vite8升级下班交接.md`。
- 文档记录了：当前结论、esbuild direct 链路移除范围、Vite 配置拆分、验证结果、当前 makeLink:v2 阻塞点、下一步宿主验证清单和不要做的事。


## 2026-05-22 — Windows host validation continuation

- 已在当前 Windows 工作区同步 `node_modules` 到 Vite 8：`pnpm install --no-frozen-lockfile`。
- 已重新执行 `pnpm build:v2`，确认 `dist-v2` 产物与 `siyuan` external 契约保持不变。
- 已修复 `scripts/make_dev_link.py` 的 Windows `\?\` 路径比较假阴性，使 `pnpm makeLink:v2` 对已存在的正确符号链接变为幂等。
- 已用 SiYuan API + headless Chrome CDP 对 `test` workspace 完成 V2 quick publish / settings / validation error details smoke。
- 当前仍未完成真实远端发布链路（#21 Cnblogs、#25 本地 WordPress、Yuque API/web、本地系统）的端到端状态变更式 smoke；现有 workspace 存储中未发现可直接复用的完整账号凭证，因此未继续盲测。
- 下一步：若用户提供可用账号或允许使用现成 workspace 中已授权目标，再继续 5.3–5.5；否则本变更只能先完成升级收尾与已知风险记录。
