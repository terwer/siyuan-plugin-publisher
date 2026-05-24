## 1. Audit

- [x] 1.1 列出 `pre.customCfg` 中所有已启用网页 Cookie preset，并确认对应 Setting 组件、Config、WebAdaptor、`bridgeRegistry` 映射存在。
- [x] 1.2 审计所有网页 Setting 组件是否透传 `cookie-actions` slot 到 `CustomWebSetting` / `CommonBlogSetting`，记录缺失项。
- [x] 1.3 审计 `useWebCookieAuthorization`、`V2WebCookieAuthPanel`、`V2PlatformConfigBridge` 中是否存在不必要的语雀/CSDN/知乎 UI 层分支。

## 2. Shared Bridge Wiring

- [x] 2.1 为缺失的网页 Setting 组件补齐 `cookie-actions` slot 原样透传，不在平台组件内新增授权逻辑。
- [x] 2.2 修复已启用网页 Setting 组件在 V2 Bridge 挂载下的基础渲染问题，例如缺失 import、事件透传或 props 透传问题。
- [x] 2.3 保持 `CommonBlogSetting` 为 Cookie 字段状态来源，确保 V2 面板可控制手动 Cookie 编辑展开/收起。
- [x] 2.4 确认 `V2WebCookieAuthPanel` 继续只按 `authMode=WEBSITE` + `PasswordType_Cookie` 判定展示，不引入 subtype 白名单。

## 3. Authorization and Logout Semantics

- [x] 3.1 确认 CSDN 自动读取 Cookie 后通过 CSDN WebAdaptor 的 `buildCookie()`、`getMetaData()`、`updateCfg()` 完成校验和写回。
- [x] 3.2 确认知乎自动读取 Cookie 后通过知乎 WebAdaptor 的 `buildCookie()`、`getMetaData()`、`updateCfg()` 完成校验和写回。
- [x] 3.3 确认语雀网页版继续走同一共用授权入口，且既有真实退出请求能力不被破坏。
- [x] 3.4 确认 CSDN/知乎退出/清除授权只调用统一 `logoutWebCookieAuthorization`，不在平台 Setting 或 V2 UI 中实现专属退出流程。
- [x] 3.5 确认授权失败、退出失败、metadata 失败提示均经过脱敏，不输出原始 Cookie、token、ctoken、csrf、ticket 或 Authorization。

## 4. Automated Tests

- [x] 4.1 增加 V2 Bridge/selector 测试：`pre.customCfg` 所有已启用网页平台都可选且都有 bridge component。
- [x] 4.2 增加组件挂载或 slot 透传测试：CSDN、知乎、语雀网页版配置页均渲染 `V2WebCookieAuthPanel` 并保留手动 Cookie 编辑入口。
- [x] 4.3 增加 `useWebCookieAuthorization` 测试：CSDN/知乎使用平台 WebAdaptor mock 完成 `buildCookie` → `getMetaData` → 状态写回。
- [x] 4.4 增加退出测试：CSDN/知乎通过统一 logout fallback/能力探测返回结构化结果，语雀真实退出路径保持原行为。
- [x] 4.5 增加防回归测试：新增 enabled custom web preset 若未透传 `cookie-actions` 或缺 bridge component，应使测试失败。

## 5. Validation

- [x] 5.1 运行聚焦测试：V2 bridge、V2WebCookieAuthPanel、useWebCookieAuthorization、相关 platform registration specs。
- [x] 5.2 运行 `pnpm lint`。
- [x] 5.3 运行 `pnpm build:v2`。
- [ ] 5.4 在 V2 宿主中手验 CSDN、知乎、语雀网页版配置页：可选、可打开、Cookie 授权操作区可见、手动编辑可展开、非 Electron/不可自动读取时 fallback 正常。
- [ ] 5.5 如有真实账号，记录 CSDN/知乎/语雀网页版 metadata 校验结果；如无账号，明确标记为待真实账号验证，不用 mock 冒充通过。

## 6. Documentation and Review

- [ ] 6.1 更新本 change 的验证记录或 planning 进度，写明哪些平台完成自动化、哪些完成宿主手验。
- [ ] 6.2 审计 diff，确认没有修改 `useProxy` 传输分支、没有新增平台专属重复授权 UI、没有改变历史配置结构。
- [ ] 6.3 归档前复核 OpenSpec specs 与实现一致，未完成真实远端验证项不得标记为已完成。


