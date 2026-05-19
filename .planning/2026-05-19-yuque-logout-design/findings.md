# 发现记录：语雀网页版退出设计

## 2026-05-19 初始发现
- 当前仓库中已有多个 Web 适配器使用 `logoutUrl` 字符串表达退出入口，例如 CSDN、知乎、掘金、简书、微信、Halo、Bilibili。
- 尚未发现仓库内已有 `https://www.yuque.com/api/accounts/logout` 字符串。
- 用户实测语雀网页版退出为 `DELETE https://www.yuque.com/api/accounts/logout`，需要携带会话 cookie、`yuque_ctoken` 对应的 `x-csrf-token`、`x-login` 等请求头；该流程不是单纯打开一个 URL 能完整表达的行为。
- 敏感信息处理：用户粘贴的 cookie/token 不保存到文件、不复用到代码。

## 2026-05-19 当前 `logoutUrl` 调用链
- `DynamicConfig.logoutUrl?: string` 的语义目前只是“取消登录地址/退出地址”，没有 method/header/body/csrf/cookie 等动作参数。
- `PublishPlatformSettingList.vue` 在 Web 授权验证失败时读取 `dynCfg.logoutUrl ?? cfg.logoutUrl`，随后 `_handleClearAuthConfirm` 仅调用 `openBrowserWindow(url)` 打开页面。
- `openBrowserWindow(url)` 没有 `cookieCb` 时只是显示 Electron BrowserWindow 或 `window.open(url)`；它不能表达 `DELETE`、自定义 header、CSRF token 提取和结果处理。
- 语雀网页版当前配置 `YuquewebConfig.logoutUrl = "https://www.yuque.com/logout"`，预置平台 `pre.ts` 只维护 `authUrl/domain`，没有维护 `logoutUrl` 或动作化退出配置。
- V2 的 `V2WebCookieAuthPanel.vue` 当前只有打开登录和自动读取 Cookie，没有找到退出动作入口。

## 2026-05-19 方案分析
- 语雀适配器已有统一请求封装：`YuquewebWebAdaptor.yuquewebFetch()` 会基于 `cfg.password` 作为 Cookie，并支持 `DELETE` 与自定义 headers，因此语雀退出可以复用适配器请求层。
- `yuquewebFetch()` 当前 `DELETE` 请求体为空，符合用户抓包的 `DELETE /api/accounts/logout` 空请求体形态。
- `buildRequestHeaders()` 当前默认包含 `Cookie/Accept/Origin/Referer`，语雀退出需要额外覆盖/补充 `Referer: {home}/logout`、`X-Requested-With`、`x-csrf-token`、`x-login`。
- `x-csrf-token` 可从保存的 Cookie 字符串中的 `yuque_ctoken` 派生；`x-login` 可优先来自保存的 metadata/login，必要时可通过现有 `/api/mine` 读取后再退出。
- 不建议把 method/headers/csrf 派生规则直接塞进可编辑的动态配置；平台专有退出动作放在适配器或受控 composable 更安全、可测试、向后兼容。

## 2026-05-19 用户确认的方案决策
- 退出成功后统一清理本地授权状态：清空保存的 Cookie，并将动态平台 `isAuth` 置为 `false`。
- V1 旧设置列表与 V2 设置面板需要同步修复，避免两个入口行为不一致。
- 语雀网页版不再继续使用失效的 `logoutUrl` 字段；提案按“移除语雀侧 `logoutUrl`，由适配器级退出动作接管”设计。

## 2026-05-19 zhi-blog-api 依赖分析
- 用户指出 `logoutWebAuth` 应进入 `/Volumes/workspace/myproject/zhi-framework/zhi` 的 `zhi-blog-api` 公共 API 契约，否则插件侧无法通过统一类型/包装器稳定调用。
- zhi 仓库中 `libs/zhi-blog-api/src/lib/IWebApi.ts` 定义网页授权 API 接口，当前包含 `updateCfg/buildCookie/getMetaData/preEditPost/addPost/uploadFile/editPost/deletePost`，没有 `logoutWebAuth`。
- `libs/zhi-blog-api/src/lib/webApi.ts` 的 `WebApi` 基类实现 `IWebApi`，当前未提供 `logoutWebAuth` 默认方法。
- `libs/zhi-blog-api/src/lib/webAdaptor.ts` 是 Web 包装器，当前会转发 `updateCfg/buildCookie/getMetaData/addPost/uploadFile/editPost/deletePost`，也需要转发 `logoutWebAuth`。
- zhi 仓库已有类似 SPI 提案 `add-validate-publish-spi`，模式是：接口新增方法、基类默认实现、Adaptor 透传、入口导出类型、测试、changeset/发布准备。
- 当前插件提案 `fix-yuqueweb-logout-action` 应标记为依赖 zhi 仓库新增 `logoutWebAuth` SPI、完成 npm 发布并在插件仓库更新 `zhi-blog-api` 依赖之后才能进入实现。

## 2026-05-19 上游依赖确认
- 当前插件提案 `fix-yuqueweb-logout-action` 已确认依赖 zhi 仓库的 `add-web-auth-logout-spi` 提案。
- 只有在 `zhi-blog-api` 完成该提案、发布新 npm 包并在插件仓库升级依赖后，插件侧才可继续实现语雀退出能力。
