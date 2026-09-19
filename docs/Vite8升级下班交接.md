# Vite 8 升级下班交接

> 日期：2026-05-22  
> 分支：`upgrade/vite-8`  
> OpenSpec：`upgrade-vite8-build-toolchain`  
> planning：`.planning/2026-05-22-upgrade-vite8-build-toolchain/`

## 当前结论

Vite 8 迁移的依赖、配置和自动化验证主线已完成到可继续宿主验证的状态。

最重要的用户决策已经落实：迁移完成后，旧 V1 historical esbuild direct 构建链路直接移除，不保留 fallback。

已移除 direct 依赖/链路：

- `@terwer/esbuild-config-custom`
- direct `esbuild`
- `esbuild-plugin-copy`
- `esbuild-style-plugin`
- `esbuild.config.cjs`
- scripts 中的 `zhi-build` 调用

注意：`pnpm-lock.yaml` 中仍会出现 Vite/Vitest/tsx/vercel 传递或 optional peer resolution 的 `esbuild`，这不是旧 V1 direct build chain，不能强删。

## 改动概览

### Vite 配置边界

删除：

- `vite.config.ts`

新增：

- `vite.v1.app.config.ts`
  - V1 iframe/app、widget、nginx、extension、vercel app 构建。
  - 已把 `rollupOptions` 迁移为 `rolldownOptions`。
  - 已把旧 `manualChunks(id)` function form 迁移为 Rolldown `output.codeSplitting.groups[].name(id)`。
- `vite.v1.siyuan.config.ts`
  - V1 legacy SiYuan plugin CJS entry 构建。
  - 替代旧 `zhi-build` / `@terwer/esbuild-config-custom`。
  - entry：`siyuan/index.ts`
  - external：`["siyuan"]`
  - 输出：`index.js`。
- `vitest.config.ts`
  - 删除默认 `vite.config.ts` 后，给 Vitest 补独立 Vite plugin 栈。
  - 包含 `vue()`、`unplugin-icons`、Element Plus AutoImport/Components、node polyfills。

V2 保持：

- `vite.v2.config.ts`
- `pnpm dev:v2`
- `pnpm build:v2`
- `pnpm makeLink:v2`

### scripts 已更新

以下脚本已显式指定 Vite config：

- `scripts/plugin_build.py` → `vite.v1.siyuan.config.ts`
- `scripts/dev.py` → V1 prebuild 用 `vite.v1.siyuan.config.ts`，V1 watch 用 `vite.v1.app.config.ts`
- `scripts/siyuan_build.py` → `vite.v1.app.config.ts`
- `scripts/widget_build.py` → `vite.v1.app.config.ts`
- `scripts/nginx_build.py` → `vite.v1.app.config.ts`
- `scripts/ext_build.py` → `vite.v1.app.config.ts`
- `scripts/vercel_build.py` → `vite.v1.app.config.ts`

## 当前验证状态

OpenSpec 任务进度：`21/32`。

已通过：

```bash
pnpm lint
pnpm build:v2
pnpm dev:v2
pnpm exec vitest run src/utils/xmlrpcTransport.spec.ts src/utils/formUploadClient.spec.ts src/utils/jsonFetchClient.spec.ts src/utils/xmlrpcResponseUtil.spec.ts
```

结果摘要：

- `pnpm lint` ✅
- `pnpm build:v2` ✅
  - `dist-v2/index.js`：约 `9,534,380 bytes`
  - `dist-v2/index.css`：约 `393,440 bytes`
  - `dist-v2/plugin.json`：`1,004 bytes`
  - `require("siyuan")` external 存在
- `pnpm dev:v2` watch smoke ✅
  - 首次 build 成功
  - 通过无内容重写 `src/composables/v2/v2FloatingUi.ts` 触发 rebuild 成功
- transport 聚焦测试 ✅
  - `4 passed / 39 passed`

已运行但非全绿：

```bash
pnpm test -- --run
```

结果：❌，但只剩 Vite 7 基线已有失败：

- `src/adaptors/api/base/gitlab/commonGitlabApiAdaptor.spec.ts`
- 依赖 `http://localhost:8002` GitLab proxy，本机未启动时失败。
- 当前 Vite 8/Vitest 迁移新增失败已解除。

## 当前阻塞点

`pnpm makeLink:v2` 需要选择 SiYuan workspace。

沙箱外运行时已成功访问 SiYuan API，返回 3 个 workspace：

```text
[0] /Volumes/workspace/mydocs/SiYuanWorkspace/public
[1] /Volumes/workspace/mydocs/SiYuanWorkspace/test
[2] /Volumes/workspace/mydocs/SiYuanWorkspace/poc
```

非交互运行会在这里失败：

```text
Please select a workspace[0-2]: EOFError: EOF when reading a line
```

继续前需要用户确认链接哪个 workspace。建议优先用 `test` workspace，除非用户指定其他。

## 下一步建议

1. 用户确认 workspace 后，继续：

   ```bash
   pnpm makeLink:v2
   ```

2. 在 SiYuan 宿主内验证：

   - 插件能从 `dist-v2` 加载。
   - V2 工作区可打开。
   - 设置导航正常。
   - 账号列表正常。
   - 平台配置验证错误能在 `SypErrorDetailsPanel`/inline summary 展示。
   - 无 blank screen / runtime console blocker。

3. 完成代表性平台验证：

   - `#21 Cnblogs`
   - `#25 本地 WordPress`
   - `Yuque API/web`
   - `本地系统`

4. 宿主/UI 验证后才能勾选：

   - OpenSpec task `3.5`：CSS/UI 输出差异可接受。
   - OpenSpec tasks `5.1`–`5.6`。

5. 最后做：

   - 升级报告
   - rollback path 审计
   - 归档前严格 audit

## 重要记录位置

- OpenSpec tasks：`openspec/changes/upgrade-vite8-build-toolchain/tasks.md`
- 验证日志 SSOT：`openspec/changes/upgrade-vite8-build-toolchain/validation-log.md`
- planning 计划：`.planning/2026-05-22-upgrade-vite8-build-toolchain/task_plan.md`
- planning 过程：`.planning/2026-05-22-upgrade-vite8-build-toolchain/progress.md`
- planning 发现：`.planning/2026-05-22-upgrade-vite8-build-toolchain/findings.md`

## 不要做的事

- 不要重新引入 `@terwer/esbuild-config-custom`。
- 不要重新引入 direct `esbuild` / `esbuild-plugin-copy` / `esbuild-style-plugin`。
- 不要恢复 `zhi-build`。
- 不要用 `pnpm dev -p siyuan` 验证 V2。
- 不要用 mock/skip 来宣称平台验证通过。
- 不要把 V1/package/widget/nginx/ext 全量 release packaging 作为本变更 merge blocker；它们是 release packaging 前 mandatory gate。

