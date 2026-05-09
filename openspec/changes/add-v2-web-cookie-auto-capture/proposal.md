## Why

V2 已经把网页平台 Cookie 输入改为可编辑，但用户仍需要在“手动粘贴 Cookie”和“旧版列表授权/验证流程”之间来回切换，配置链路割裂且容易失败。网页授权是高频、脆弱、强信任的操作，应该在 V2 配置页内提供一个小而清晰、可自动读取也可手动修正的完整体验。

本变更单独立项，是因为它同时涉及 Electron Cookie 读取、旧授权能力复用、V2 表单体验、授权状态写回、敏感信息保护和网页平台通用能力边界，不能夹在普通 UI 修补中顺手实现。

## What Changes

- 在 V2 网页平台配置页的 Cookie 输入区域提供“自动读取 Cookie”入口，仅在 Electron/思源桌面可用环境显示或启用。
- 自动读取流程复用现有 `openBrowserWindow + buildCookie + getMetaData` 这一条已验证主链路，而不是新造授权框架。
- 自动读取成功后应回填当前配置表单中的 Cookie、保存平台配置、写回 `DynamicConfig.isAuth` 和 metadata，并刷新 V2 账号/快速发布状态。
- 保留并强化手动编辑：用户始终可以手动粘贴、修正 Cookie，再用原有验证/保存能力完成配置。
- 将旧版授权 dialog 的“打开登录页、读取 Cookie、验证登录态、失败提示、清空授权状态”等能力抽为可复用逻辑，V1 继续兼容，V2 使用更轻量的嵌入式操作区，不直接复制大弹窗体验。
- V2 Cookie 操作区需要小而密：适配思源笔记插件面板尺寸，减少大段解释；同时参考 Ant Design 的确定性、即时反馈、主次操作层级，形成精致但不打扰的配置体验。
- 所有新增可见文案必须走现有国际化链路，同时写入 `src/locales/*` 与 `siyuan/i18n/*`，禁止硬编码中文/英文。
- 日志和错误提示不得输出 Cookie、Authorization、ctoken、token、csrf、ticket 等敏感字段。
- 非 Electron 环境不得假装支持自动读取，应显示明确但低干扰的手动 Cookie 路径说明。

## Capabilities

### New Capabilities

- `v2-web-cookie-authorization`: 定义 V2 网页平台在配置页内自动读取 Cookie、手动编辑 Cookie、验证授权状态、写回配置与展示用户反馈的能力。

### Modified Capabilities

- 无。现有 OpenSpec 中没有通用 V2 网页 Cookie 授权能力规格；本次新增独立能力，不修改已有 `astro-yaml`、`github-astro`、`gitlab-astro` 规格。

## Impact

- V2 配置桥接：影响 `src/components/v2/settings/V2PlatformConfigBridge.vue` 及其承载旧表单的交互层。
- 旧表单/授权逻辑：影响 `src/components/set/publish/singleplatform/base/CommonBlogSetting.vue`、`CookieSetting.vue`、`PublishPlatformSettingList.vue` 的逻辑抽取或组合方式。
- 授权工具：复用并必要时扩展 `src/utils/widgetUtils.ts` 的 Electron BrowserWindow Cookie 读取能力，但不得破坏 V1 行为。
- 配置与状态：影响 `usePublishSettingStore`、`DynamicConfig` 写回路径、V2 `useV2Settings` / `useV2QuickPublish` 刷新路径。
- 国际化：新增或调整 `src/locales/zh_CN.ts`、`src/locales/en_US.ts`、`siyuan/i18n/zh_CN.json`、`siyuan/i18n/en_US.json` 中的授权操作文案。
- 测试：需要覆盖 V2 Cookie 操作区渲染、Electron/非 Electron 可用性、自动读取成功写回、读取失败不泄密、手动编辑不受影响。
- 兼容性：不得改变现有平台配置格式；Cookie 仍存储在对应 WebConfig 的 `password` 字段。
