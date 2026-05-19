## Why

语雀网页版真实退出流程已经从“打开退出 URL”变为 `DELETE /api/accounts/logout` 并依赖 Cookie、CSRF token 与登录名请求头，当前 `logoutUrl` 字符串抽象无法表达该动作。继续保留 `https://www.yuque.com/logout` 会让 V1 验证失败后的退出提示和 V2 Cookie 授权入口产生无效或误导性的行为。

## What Changes

- 为网页 Cookie 授权增加“动作化退出/清除授权”能力，优先调用平台 WebAdaptor 提供的退出动作，而不是只打开 `logoutUrl`。
- 为语雀网页版实现专有退出动作：从已保存 Cookie 中派生 `yuque_ctoken` 作为 `x-csrf-token`，从 metadata 或 `/api/mine` 获取 `x-login`，调用 `DELETE https://www.yuque.com/api/accounts/logout`。
- V1 旧平台设置列表和 V2 Cookie 授权面板同步使用统一退出能力。
- 语雀网页版退出成功后统一清理本地 Cookie 配置和授权状态：清空平台配置 `password`，将对应 `DynamicConfig.isAuth` 写为 `false` 并保存。
- 移除语雀网页版配置中的失效 `logoutUrl` 字段使用，不再把 `https://www.yuque.com/logout` 当作可用退出方式。
- 保留其它已有平台的 URL fallback 行为，避免影响仍可通过打开退出页完成退出的平台。

## Capabilities

### New Capabilities

- `web-cookie-logout`: 定义网页 Cookie 平台的统一退出/清除授权能力，以及平台专有退出动作与 URL fallback 的行为边界。

### Modified Capabilities

- `v2-web-cookie-authorization`: V2 网页 Cookie 授权操作区新增同步的退出/清除授权入口，并与 V1 共享退出状态写回语义。

## Impact

- 上游依赖：本变更依赖 `/Volumes/workspace/myproject/zhi-framework/zhi` 的 `add-web-auth-logout-spi` 提案完成、`zhi-blog-api` 发布新 npm 版本，并在本仓库升级依赖后才能进入实现。
- 影响代码：`src/adaptors/web/yuqueweb/YuquewebWebAdaptor.ts`、`src/adaptors/web/yuqueweb/YuquewebConfig.ts`、`src/composables/useWebCookieAuthorization.ts`、`src/components/v2/settings/V2WebCookieAuthPanel.vue`、`src/components/set/publish/platform/PublishPlatformSettingList.vue` 及相关测试。
- 影响数据：沿用现有平台配置结构，不新增 mock 或占位字段；退出成功会清空当前平台保存的 Cookie。
- 影响安全：不得记录原始 Cookie、CSRF token、ctoken、ticket、Authorization 等敏感信息；用户提供的抓包敏感值不得写入代码或测试快照。
- 兼容性：其它平台继续使用既有 `logoutUrl` fallback；语雀网页版不再依赖失效 URL。
