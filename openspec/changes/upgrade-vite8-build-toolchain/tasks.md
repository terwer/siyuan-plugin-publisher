# Tasks: upgrade-vite8-build-toolchain

> Principle: Vite 8 升级是基础设施工作。必须与平台业务逻辑隔离，避免 mock 验证，并为每个 gate 记录准确证据。
> 验证证据 SSOT：[validation-log.md](./validation-log.md)。后续命令输出、失败原因、产物形状、宿主手测记录都固定写入该 Markdown 文件。

## 1. Baseline and Planning

- [x] 1.1 记录当前环境：`node -v`、`pnpm -v`、`pnpm exec vite --version`、`pnpm exec vue-tsc --version`。
- [x] 1.2 记录当前依赖基线：`vite`、`@vitejs/plugin-vue`、`vitest`、`@vitest/coverage-v8`、`vite-plugin-*`、`unplugin-*`、`typescript`、`vue-tsc`。
- [x] 1.3 在可行时运行基线自动化检查：`pnpm test`、`pnpm lint`、`pnpm build:v2`。
- [x] 1.4 捕获 Vite 7 下的 V2 产物形状：`dist-v2/index.js`、`dist-v2/index.css`、`dist-v2/plugin.json`、`dist-v2/i18n/*.json`、静态 assets，并确认 `siyuan` 是否保持 external。
- [x] 1.5 用户已确认：V1/package/widget/nginx/ext 构建只作为 release packaging 前 mandatory gate，不作为本变更 merge gate。

## 2. Dependency Upgrade

- [x] 2.1 将 `vite` 更新到 Vite 8 当前稳定 patch 版本。
- [x] 2.2 仅在 peer 兼容性或已验证 Vite 8 问题要求时，更新 `@vitejs/plugin-vue` 和其他 Vite 生态包。
- [x] 2.3 运行 `pnpm install` 并更新 `pnpm-lock.yaml`，不得引入无关依赖漂移。
- [x] 2.4 记录所有 peer dependency warning、install warning 或 lockfile 异常；逐项解决或明确分类。

## 3. Config Migration and Build Fixes

- [x] 3.1 运行 `pnpm build:v2`，并用最小、可 review 的变更修复 Vite 8 build error。
- [x] 3.2 验证 `vite.v2.config.ts` 保持 CJS library output、`external: ["siyuan"]`、`cssCodeSplit: false`、静态 asset copy、`dist-v2/index.css` 命名。
- [x] 3.3 审计并迁移 V1/V2 Vite config warning，特别是原 `vite.config.ts` 的 `manualChunks(id)` function form 和 plugin 兼容性。
- [x] 3.4 迁移 Vite 8 deprecated `manualChunks` function form：先记录所选 chunking strategy 与预期输出差异，再实施。
- [ ] 3.5 如果 Lightning CSS 导致 CSS 输出差异，必须检查 UI 渲染影响后才能接受。

## 4. Automated Validation

- [x] 4.1 运行 `pnpm test`，记录 pass/fail；如失败，仅记录决定性失败信息。
- [x] 4.2 运行 `pnpm lint`，记录 pass/fail；如失败，仅记录决定性失败信息。
- [x] 4.3 运行 `pnpm build:v2`，记录 artifact 输出。
- [x] 4.4 使用 `pnpm dev:v2` 做 V2 watch smoke；通过安全 source/config touch 确认 rebuild，或记录未运行原因。
- [x] 4.5 如相关 specs 存在或有改动，运行 XML-RPC/form upload/json fetch 聚焦 transport tests。

## 5. V2 Host Runtime Validation

- [ ] 5.1 运行 `pnpm makeLink:v2`，确认 SiYuan 从 `dist-v2` 加载 V2 插件。
- [ ] 5.2 验证 V2 shell/UI smoke：插件打开、V2 设置导航、账号列表、平台配置验证错误展示、无 blank screen/runtime console blocker。
- [ ] 5.3 验证 #21 Cnblogs XML-RPC 流程：账号验证、发布、更新、删除、图片路径（如该账号/平台可用）。
- [ ] 5.4 验证 #25 本地 WordPress XML-RPC 流程：账号验证、发布、更新、删除、图片路径，并记录使用 Bundled、PicGO 还是 None 配置。
- [ ] 5.5 验证 Yuque API/web 路径与本地系统路径，用于捕获 generic fetch、web/API、asset、runtime、本地写入回归。
- [ ] 5.6 记录准确宿主证据：OS、SiYuan 版本（如可用）、插件加载结果、platform(s)、commands、observed failures。

## 6. Secondary Build Surface

- [x] 6.1 按用户确认的 gate policy：legacy/V1 `pnpm build` 不阻塞本变更 merge，但 release packaging 前 MUST 验证并记录结果。
- [x] 6.2 按用户确认的 gate policy：widget/nginx/ext packaging checks 不阻塞本变更 merge，但 release packaging 前 MUST 验证并记录结果。
- [x] 6.3 如果 secondary builds 因 Vite 8 特有原因失败，登记聚焦 follow-up tasks 或 fixes；不得隐藏风险。

## 7. Review, Rollback, and Closure

- [ ] 7.1 输出简洁升级报告：changed dependencies、config changes、warnings resolved/deferred、validation matrix、known risks。
- [ ] 7.2 验证 rollback path：确认所有 Vite 8 变更都隔离在 dependency/config/source diff 中，且未捆绑无关平台验证 edits。
- [ ] 7.3 用最终 command results 和手动验证 notes 更新 OpenSpec spec/tasks evidence。
- [ ] 7.4 归档前执行严格 audit：real fix vs mock、best practice、design integrity、unrelated modes、OpenSpec completeness。

## Evidence Log

详见 [validation-log.md](./validation-log.md)。
