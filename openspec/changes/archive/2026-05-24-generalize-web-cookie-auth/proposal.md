## Why

V2 网页平台已经不再只有语雀网页版；CSDN、知乎等 Cookie 网页平台也需要同一套登录打开、Cookie 自动读取、metadata 校验、手动修正、退出/清除授权与状态写回能力。当前实现虽有共用 composable 雏形，但接入维度仍被语雀网页版/少量已接入平台限制，导致新放出的网页平台在 V2 Bridge 中无法完整完成 Cookie 授权验证，属于发布链路致命断点。

## What Changes

- 将 V2 Web Cookie 授权 UI/行为明确提升为“所有网页 Cookie 平台”的共用能力，而不是语雀网页版专属能力。
- 所有已启用 `pre.customCfg` 网页 Cookie 平台在 V2 Bridge 配置页 SHALL 复用同一个 Cookie 授权操作区和 `useWebCookieAuthorization` 流程。
- CSDN、知乎 SHALL 通过现有 WebAdaptor 的 `buildCookie()`、`getMetaData()`、`updateCfg()`、`checkAuth()`/metadata 语义完成授权校验，不新增平台专用重复授权流程。
- 保留平台差异只在平台配置/适配器内部：`authUrl`、`logoutUrl`、domain/cookie 捕获、metadata 判断、真实发布接口，不在 V2 UI 或 `useProxy` 堆平台 if 链。
- 非 Electron 环境 SHALL 继续降级为手动 Cookie 编辑路径。
- 退出/清除授权 SHALL 继续复用统一网页 Cookie 退出能力；仅允许在统一能力内部处理确有平台契约差异的退出方式。
- 增加 CSDN、知乎、语雀网页版的自动化覆盖，防止后续再次把共用能力误缩成单平台能力。

## Capabilities

### New Capabilities

- `web-cookie-bridge-common`: 定义 V2 Bridge 中所有网页 Cookie 平台共享的授权操作区接入、能力判定、状态写回和防重复实现要求。

### Modified Capabilities

- `v2-web-cookie-authorization`: 将既有 V2 Cookie 授权能力从“已接入 V2 bridge 的网页 Cookie 平台”明确收紧为“所有已启用网页 Cookie preset 必须接入”，并覆盖 CSDN/知乎等非语雀平台。
- `web-cookie-logout`: 明确所有网页 Cookie 平台共享退出/清除授权语义，平台 fallback 只在统一能力内处理，V2 UI 不得按平台分叉。

## Impact

- 影响 V2 Bridge 配置挂载层、网页平台 setting 组件转发 slot、`CommonBlogSetting` Cookie slot、`V2WebCookieAuthPanel`、`useWebCookieAuthorization` 及其测试。
- 影响已启用网页平台：语雀网页版、Halo 网页版、知乎、CSDN、微信公众号、简书、掘金、Bilibili。
- 不改变发布传输架构，不在 `useProxy` 或具体发布适配器中新增授权 UI 分支。
- 不改变历史配置 JSON 结构；继续写入现有平台配置 password/metadata 与 `DYNAMIC_CONFIG_KEY`。
