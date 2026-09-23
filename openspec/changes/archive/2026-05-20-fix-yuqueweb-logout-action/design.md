## Context

现有网页 Cookie 授权流程把“退出登录”建模为 `logoutUrl` 字符串，并在 V1 验证失败时通过 `openBrowserWindow(url)` 打开该地址。这个模型只适合打开退出页即可完成退出的平台，不能表达语雀网页版当前真实退出协议：`DELETE /api/accounts/logout`，并且需要当前 Cookie、`yuque_ctoken` 派生的 `x-csrf-token`、当前登录名 `x-login` 和 AJAX 请求头。

语雀网页版适配器已经有 `yuquewebFetch()` 请求封装，可复用保存的 Cookie、代理、中间件、响应解析和敏感信息脱敏逻辑。V2 配置页已有 Cookie 自动读取与校验面板，但没有退出/清除授权入口。用户已确认：退出成功后需要统一清空本地 Cookie 和授权状态；V1/V2 同步修复；语雀网页版应移除已不支持的 `logoutUrl` 使用。

## Goals / Non-Goals

**Goals:**

- 为网页 Cookie 平台提供统一的退出/清除授权服务，供 V1 和 V2 共同调用。
- 为语雀网页版实现真实的动作化退出请求，而不是打开 `https://www.yuque.com/logout`。
- 退出成功后清空当前平台保存的 Cookie，并将 `DynamicConfig.isAuth` 持久化为 `false`。
- 对仍使用退出 URL 的其它平台保留 fallback，避免引入不必要的兼容性风险。
- 在实现、日志和测试中持续保护 Cookie、CSRF token、ctoken、ticket、Authorization 等敏感信息。

**Non-Goals:**

- 不设计可由用户编辑的通用 `logoutRequest` DSL。
- 不保存或复用用户抓包中的原始 Cookie/token。
- 不改变历史平台配置 JSON 的整体结构。
- 不重写现有 Cookie 自动读取、metadata 校验或发布流程。

## Decisions

### 1. 使用适配器能力表达平台专有退出

新增受控的可选适配器能力，例如 `logoutWebAuth(): Promise<WebCookieLogoutRemoteResult>`。统一退出服务获取平台配置和 WebAdaptor 后，优先检测并调用该能力。

- 选择原因：语雀退出需要从 Cookie 和 metadata 派生运行时 header，属于平台协议，不适合由动态配置暴露给用户维护。
- 替代方案：把 `logoutUrl` 扩展为 `{ url, method, headers }`。放弃原因是它会让动态配置承载半脚本能力，并且仍无法安全、清晰地表达 CSRF 与 login 派生规则。

### 2. 语雀退出复用 `YuquewebWebAdaptor` 请求层

在 `YuquewebWebAdaptor` 中实现语雀专有退出动作：

- 从 `cfg.password` Cookie 字符串中提取 `yuque_ctoken`。
- 优先从 `cfg.metadata.login` 获取登录名；缺失时调用现有 `getMetaData()` / `/api/mine` 获取。
- 调用 `yuquewebFetch("/api/accounts/logout", {}, "DELETE", headers)`，并覆盖 `Referer` 为 `${home}/logout`，补充 `X-Requested-With: XMLHttpRequest`、`x-csrf-token`、`x-login`。
- 若缺少 Cookie、CSRF token 或 login，返回面向用户的明确错误，不伪造值、不使用占位符。

### 3. 统一服务负责本地状态清理

在 `useWebCookieAuthorization.ts` 或相邻 composable 中增加 `logoutWebCookieAuthorization()` / `clearWebCookieAuthorization()` 级别的共享方法，负责：

1. 加载 setting、dynamic config、stored config 和 WebAdaptor。
2. 执行远端退出动作或 URL fallback。
3. 远端退出成功后清空 `cfg.password`，保留其它必要配置字段。
4. 写回平台配置、`DYNAMIC_CONFIG_KEY` 和 `dynCfg.isAuth = false`。
5. 返回结构化状态给 UI 展示。

这样 V1 和 V2 只处理确认弹窗、按钮状态与用户反馈，不重复写状态持久化逻辑。

### 4. `logoutUrl` 保留为其它平台 fallback，但语雀侧移除

`DynamicConfig.logoutUrl` 和其它平台配置中的 `logoutUrl` 可继续用于旧平台 fallback；语雀网页版 `YuquewebConfig` 不再声明或设置 `logoutUrl`，预置配置也不新增语雀 `logoutUrl`。如果语雀未实现适配器退出动作，统一服务必须返回错误而不是回退到失效 URL。

### 5. V1 与 V2 同步接入

- V1：验证失败后不再直接 `_handleClearAuthConfirm(msg, logoutUrl)`，而是调用统一退出服务；若平台只有 URL fallback，再打开退出地址并按确认后的策略清理本地状态。
- V2：在 Cookie 授权操作区增加退出/清除授权入口；已授权或 Cookie 非空时可展示，点击后调用同一服务。

## Risks / Trade-offs

- [风险] 语雀接口或 header 要求继续变化 → [缓解] 将语雀退出封装在 `YuquewebWebAdaptor.logoutWebAuth()`，后续只需调整平台适配器。
- [风险] URL fallback 平台打开退出页后无法确认远端是否真的退出 → [缓解] fallback 仅用于既有行为兼容；结构化结果区分 `remoteAction` 与 `urlFallback`，UI 文案提示用户重新验证。
- [风险] 清空本地 Cookie 后用户误以为所有浏览器会话都退出 → [缓解] UI 文案区分“远端退出成功并已清除本地授权”和“仅清除本地授权/请重新验证”。
- [风险] 日志或测试泄露 Cookie/CSRF → [缓解] 复用现有脱敏工具，测试只使用合成的非真实 Cookie 值，并断言敏感字段不出现在日志或快照中。

## Migration Plan

1. 添加统一退出服务和类型，不改变现有授权 API 的调用方式。
2. 为语雀网页版实现 `logoutWebAuth()` 并移除 `YuquewebConfig.logoutUrl`。
3. V1 和 V2 UI 接入统一服务。
4. 补充单元测试覆盖语雀 DELETE 请求、状态清理、fallback 和敏感信息脱敏。
5. 如出现回归，可回滚 UI 接入和语雀适配器方法；其它平台 URL fallback 不受影响。

## Open Questions

无。用户已确认三个关键决策：退出后统一清理本地授权状态；V1/V2 同步修复；语雀网页版移除失效 `logoutUrl` 使用。

## Dependency

本变更依赖上游 `/Volumes/workspace/myproject/zhi-framework/zhi` 中的 `add-web-auth-logout-spi` 提案完成、`zhi-blog-api` 发布新 npm 版本并在本仓库完成依赖升级后，才能进入代码实现。
