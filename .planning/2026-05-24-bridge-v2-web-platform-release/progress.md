# Progress: Bridge V2 Web 平台全量放出

## 2026-05-24

- 已创建本计划并切换 `.planning/.active_plan`。
- 定位 V2 新增账号列表过滤链路：`useV2Settings.selectablePlatforms` → `SUPPORTED_V2_BRIDGE_SUBTYPES` → `bridgeRegistry.ts`。
- 根因：`BRIDGE_COMPONENTS` 只注册了 `Custom_Haloweb`、`Custom_Yuqueweb`，导致 `pre.customCfg` 中其他已启用 web 平台（知乎、CSDN、微信公众号、简书、掘金、Bilibili）被 V2 selector 过滤。
- 已在 `src/components/v2/settings/bridge/bridgeRegistry.ts` 共用 registry 中注册当前 `pre.customCfg` 已启用且有 setting/adaptor 的全部 web 平台：`Custom_Zhihu`、`Custom_CSDN`、`Custom_Wechat`、`Custom_Jianshu`、`Custom_Juejin`、`Custom_Haloweb`、`Custom_Yuqueweb`、`Custom_Bilibili`。
- 已补测试：
  - `src/composables/v2/useV2Settings.spec.ts`：断言 V2 bridge selector 暴露 `pre.customCfg` 所有 custom web preset，并显式覆盖 `custom_Zhihu`、`custom_Csdn`。
  - `src/platforms/yuquewebRegistration.spec.ts`：断言所有已启用 custom web preset 都有 V2 bridge component，显式覆盖知乎/CSDN。
- 验证结果：
  - `pnpm exec vitest run src/composables/v2/useV2Settings.spec.ts src/platforms/yuquewebRegistration.spec.ts` ✅，`2 passed / 15 tests passed`。
  - `pnpm lint` ✅。
  - `pnpm build:v2` ✅，产物 `dist-v2/index.js` / `index.css` 成功生成。

## 2026-05-24 — 用户要求先建 OpenSpec：Web Cookie 授权共用化

- 用户指出：语雀网页版已有很好的 Cookie 验证体验，但能力维度应是所有网页平台共用，不应语雀专属；CSDN/知乎不能重写一套。
- 已停止继续实现，先按 `$openspec-propose` 创建 OpenSpec change：`generalize-web-cookie-auth`。
- 已生成并验证完成：
  - `openspec/changes/generalize-web-cookie-auth/proposal.md`
  - `openspec/changes/generalize-web-cookie-auth/design.md`
  - `openspec/changes/generalize-web-cookie-auth/specs/web-cookie-bridge-common/spec.md`
  - `openspec/changes/generalize-web-cookie-auth/specs/v2-web-cookie-authorization/spec.md`
  - `openspec/changes/generalize-web-cookie-auth/specs/web-cookie-logout/spec.md`
  - `openspec/changes/generalize-web-cookie-auth/tasks.md`
- `openspec status --change generalize-web-cookie-auth` 显示 `4/4 artifacts complete`，可进入 apply 实施。
