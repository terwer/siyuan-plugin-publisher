# Findings: Vite 8 构建工具链升级

## 官方/registry 结论

- Vite 当前 Vite 8 stable patch：`8.0.14`。
- `@vitejs/plugin-vue` 当前版本：`6.0.7`；`6.0.1` peer 只声明到 Vite 7，`6.0.7` peer 包含 `^8.0.0`。
- `vite-plugin-node-polyfills` 当前版本：`0.28.0`；`0.24.0` peer 只声明到 Vite 7，`0.28.0` peer 包含 `^8.0.0`。
- 初步最小升级集合：`vite -> 8.0.14`、`@vitejs/plugin-vue -> ^6.0.7`、`vite-plugin-node-polyfills -> ^0.28.0`。
- `vitest` / `@vitest/coverage-v8` / `unplugin-*` 暂不主动升级，除非 install/build/test 给出明确证据。

## Vite 7 基线发现

- `pnpm lint` ✅。
- `pnpm build:v2` ✅，Vite 7 产物：
  - `dist-v2/index.js`：9,375,394 bytes
  - `dist-v2/index.css`：397,132 bytes
  - `dist-v2/plugin.json`：1,004 bytes
  - `siyuan` 保持 external：`const siyuan=require("siyuan")`
- `pnpm test -- --run` 在 Vite 7 基线已有失败：
  - `commonGitlabApiAdaptor.spec.ts` 依赖 `localhost:8002` 服务。
  - `usePublishConfig.spec.ts` 依赖 `127.0.0.1:6806`，失败后暴露既有 typo：`this.logger.errot is not a function`。
- 上述失败不是 Vite 8 引入，但后续升级后仍必须记录是否变化。

## 风险重点

- V2 `build.lib.formats: ["cjs"]` 与 SiYuan 插件加载。
- `external: ["siyuan"]` 不能被破坏。
- `dist-v2/index.css` 单 CSS 输出契约不能静默改变。
- `manualChunks(id)` function form 必须迁移或明确 Vite 8 下状态。
- `vite-plugin-node-polyfills` 与 XML-RPC/form-data/json fetch transport 行为。

## Vite 8 install 后 peer warning

- Vite 8.0.14 缺少 peer `esbuild@^0.27.0 || ^0.28.0`。
- `esbuild-plugin-copy@2.1.1` 缺少 peer `esbuild >=0.14.0`。
- `@terwer/esbuild-config-custom@2.0.0` 缺少 peer `esbuild ^0.17.17`，与 Vite 8 的 esbuild peer 范围冲突。
- `@terwer/esbuild-config-custom@2.0.0` 对 `stylus ^0.59.0` 的 peer 与当前 `0.64.0` 不匹配。
- 需要先跑 Vite 8 build/lint/test 判断 peer warning 是否实际阻塞；如必须新增 root `esbuild`，大概率只能满足 Vite 8，无法同时满足 `@terwer` 的旧 peer 范围。

## V1 构建链路重命名与 esbuild 历史依赖退场

- `@terwer/esbuild-config-custom` 只在 `package.json`/lockfile 中直接引用；运行时代码未直接 import。
- `zhi-build` bin 来自 `@terwer/esbuild-config-custom`，当前被以下脚本使用：
  - `scripts/plugin_build.py`：`zhi-build --production`
  - `scripts/dev.py` 的 V1 siyuan dev bootstrap：`zhi-build --production -d dist`
- `esbuild.config.cjs` 是 V1 legacy plugin CJS 入口构建配置：entry `siyuan/index.ts`、outfile `dist/index.js`、format `cjs`、external `siyuan`、复制 `plugin.json`/i18n/readme/icon/preview。
- 原 `vite.config.ts` 实际承担 V1 iframe/app 以及 widget/nginx/ext app 构建；它包含 Vite 8 deprecated `build.rollupOptions` 和 `manualChunks(id)` function form。
- Rolldown 1.0.2 类型说明：`manualChunks` 仅为 Rollup 兼容迁移用途，已 deprecated；推荐使用 `output.codeSplitting.groups`。动态 group name 可用函数返回 chunk name 或 `null`。

## Vite config 迁移后发现

- `vite.v1.siyuan.config.ts` 需要包含 `@vitejs/plugin-vue` / unplugin 系列，否则 `siyuan/index.ts` 间接引入 V2 Vue SFC 时 Rolldown 会把 `.vue` 当普通 JS 解析并报 `PARSE_ERROR`。加入同 V2 一致的 Vue/SFC plugin 后 smoke build 通过。
- `siyuan/index.ts` 本身已经显式 import `./index.styl`，因此 V1 legacy CJS build 不需要额外 virtual style entry。
- 删除 direct esbuild 链路后，Vite 8 仍会通过 optional peer resolution 在 lockfile 中解析 `esbuild@0.28.0`；这不是 root direct dependency，也不是旧 V1 `zhi-build` 链路。
- V1 app `manualChunks(id)` 的等价迁移方式是 Rolldown `output.codeSplitting.groups`：动态 `name(id)` 可保留原 `vendor_<dep>` 命名；该配置已通过 V1 app smoke build。

## Vitest 独立配置迁移遗漏

- 删除默认 `vite.config.ts` 后，Vitest 不再继承原 Vite plugin 栈。
- `src/components/set/PublishSetting.vue` 通过 `~icons/material-symbols/format-list-bulleted` 依赖 `unplugin-icons` virtual module；当前 `vitest.config.ts` 只有 `vue()`，所以 full test 解析失败。
- `V2WebCookieAuthPanel.vue` 中 `ElMessage.success` 依赖 Element Plus auto-import；在 Vitest 里缺少 `AutoImport({ resolvers: [ElementPlusResolver()] })` 时，logout success 分支不会调用测试中的 `mockElMessage.success`，表现为断言失败。
- 最小真实修复应让 Vitest 使用与 Vite 运行配置一致的插件能力，而不是 mock 掉图标或跳过测试。
