# Findings: Bridge V2 Web 平台全量放出

## 初始观察

- 用户截图显示 V2 Bridge “网页平台”当前只展示 Halo 网页版、语雀网页版。
- 用户要求提前验证 CSDN、知乎，因此目标不是单独修某个平台，而是把 web 平台完整放到 Bridge V2 可选列表。

## 代码定位

- V2 新增账号列表来源：`src/composables/v2/useV2Settings.ts` 的 `selectablePlatforms`。
- 关键过滤：`SUPPORTED_V2_BRIDGE_SUBTYPES.has(platform.subPlatformType)`。
- 过滤集合来源：`src/components/v2/settings/bridge/bridgeRegistry.ts` 的 `BRIDGE_COMPONENTS` keys + `Fs_LocalSystem`。
- 当前 `BRIDGE_COMPONENTS` 的 Custom/web 仅包含：`Custom_Haloweb`、`Custom_Yuqueweb`，因此 `pre.customCfg` 中已启用的 `Custom_Zhihu`、`Custom_CSDN`、`Custom_Wechat`、`Custom_Jianshu`、`Custom_Juejin`、`Custom_Bilibili` 在 V2 selector 被隐藏。
- V1/旧配置入口 `src/components/set/publish/singleplatform/SingleSettingIndex.vue` 已有这些 web setting 组件分支，适配器统一入口 `src/adaptors/index.ts` 也已有这些 web adaptor 分支。

## 决策

- 在 `bridgeRegistry.ts` 共用映射一次性注册当前 `pre.customCfg` 中已启用且已有 setting/adaptor 的所有 web 平台：知乎、CSDN、微信公众号、简书、掘金、Bilibili、Halo 网页版、语雀网页版。
- 不放出 `Flowus`、`Xiaohongshu`：它们当前在 `pre.customCfg` 中是注释状态，不属于用户可选预置；不能仅靠 enum/adaptor 残留强行放出。

## Web Cookie 授权共用化 OpenSpec

- 新 change：`generalize-web-cookie-auth`。
- 核心决策：V2 Web Cookie 授权不是语雀网页版专属；所有 `pre.customCfg` 中已启用的网页 Cookie 平台都必须通过 `CommonBlogSetting` 的 `cookie-actions` slot 接入同一 `V2WebCookieAuthPanel` 和 `useWebCookieAuthorization`。
- 平台差异只留在配置与 WebAdaptor：`authUrl`、`logoutUrl`、domain、`buildCookie()`、`getMetaData()`、`logoutWebAuth()`。
- 禁止在 CSDN/知乎 Setting、V2 UI 或 `useProxy` 中新增专属授权流程。
