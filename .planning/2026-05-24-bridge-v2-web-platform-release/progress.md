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

## 2026-05-24 — CSDN 真实发布链路触达远端但测试标题过短

- 用户提供 CSDN 发布失败日志：`Error: {"code":400,"traceId":"9195dc6c-ed82-4cc0-b1c3-f653e5743b26","data":null,"msg":"标题过短"}`。
- 关键栈：`runPluginJsonFetch` → `runJsonFetchTransport` → `CsdnWebAdaptor.webFetch` → `CsdnWebAdaptor.csdnFetch` → `CsdnWebAdaptor.addPost` → `doSinglePublish`。
- 结论：这证明 CSDN V2 发布已进入真实 CSDN addPost 业务接口，当前失败是平台业务输入校验，不是 Cookie Bridge、授权面板、JSON transport 或适配器路由未接通。
- 决策：不在 CSDN 适配器里专修/自动扩充标题；重跑手验时使用统一的足够长测试标题，避免用平台专属补丁掩盖真实输入约束。

## 2026-05-24 — V2 快速发布失败反馈共用层优化

- 用户进一步确认：CSDN“标题过短”不是 CSDN 单个平台问题，而是 V2 快速发布失败提示共用层问题；toast 重复且详情摘要混乱。
- 已按“大更改先 OpenSpec”新增 change：`improve-v2-quick-publish-error-feedback`，产物：proposal/design/specs/tasks 全部完成。
- 共用层结论：
  - 不做 CSDN 专修，也不自动扩充标题；平台业务校验仍由真实远端决定。
  - V2 快速发布失败不再弹全局失败 toast，失败入口收敛到页面状态卡 + `SypErrorDetailsPanel`。
  - 在 `src/composables/v2/quickPublishErrorText.ts` 统一提取错误摘要：优先 `msg` / `message` / `error.message` / string `error`，例如 CSDN JSON 错误提取为“标题过短”。
  - 原始 JSON、traceId、HTTP 摘要、stack 等保留在详情里，并继续脱敏 Cookie、Authorization、ctoken、csrf、ticket、token。
  - 页面内失败描述改为 `{平台} 发布/更新/删除失败：{短摘要}`，错误卡标题也显示短摘要，按钮仍打开详情。
- 自动化验证：
  - `pnpm exec vitest run src/composables/v2/quickPublishErrorText.spec.ts src/composables/v2/useV2QuickPublish.spec.ts src/composables/v2/useV2QuickPublishToast.spec.ts src/components/v2/v2QuickPublishFailureFeedback.spec.ts` ✅，`4 passed / 18 tests passed`。
  - `pnpm lint` ✅。
  - `pnpm build:v2` ✅。
