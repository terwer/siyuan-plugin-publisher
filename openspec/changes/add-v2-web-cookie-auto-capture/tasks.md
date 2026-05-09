## 1. 运行时审计与共享授权逻辑抽取

- [x] 1.1 重新阅读 `PublishPlatformSettingList.vue`、`CommonBlogSetting.vue`、`CookieSetting.vue`、`widgetUtils.ts` 和当前 V2 bridge 代码，确认真实运行中的授权与 Cookie 读取行为。
- [x] 1.2 验证 `openBrowserWindow` 当前是立即读取已有 Electron 会话 Cookie，还是支持先显示登录窗口、用户登录后再读取。
- [x] 1.3 抽取通用网页 Cookie 授权逻辑为可复用 composable/service，并保证 V1 旧授权行为不变。
- [x] 1.4 确保共享逻辑使用各平台 WebAdaptor 的 `buildCookie()` 和 `getMetaData()`，禁止在 UI 层手动拼接 Cookie。
- [x] 1.5 在共享授权逻辑中接入现有敏感信息脱敏工具，避免日志泄露 Cookie/token。

## 2. V2 Cookie 配置页集成

- [x] 2.1 在 `CommonBlogSetting.vue` 的 Cookie 表单区域增加最小扩展点，默认不在 V1 显示 V2 专用 UI。
- [x] 2.2 新增 `V2WebCookieAuthPanel`，作为 V2 配置页内紧凑的 Cookie 授权操作区。
- [x] 2.3 仅在 V2 bridge 页面中、且平台属于网页登录 Cookie 授权时渲染授权操作区。
- [x] 2.4 保持 Cookie 文本框在所有支持环境中均可手动编辑。
- [x] 2.5 实现 Electron 自动读取可用性判断，并在非 Electron 环境展示低干扰的手动编辑说明。

## 3. 自动读取、验证与持久化

- [x] 3.1 将“自动读取 Cookie”按钮接入共享授权服务，通过 Electron 读取目标平台 Cookie。
- [x] 3.2 自动读取成功后，使用平台适配器构造 Cookie 字符串，并回填当前表单模型。
- [x] 3.3 使用 `getMetaData()` 校验读取到的 Cookie，校验通过后才允许标记平台已授权。
- [x] 3.4 校验成功后保存 `setting[platformKey].password`、metadata、`DynamicConfig.isAuth` 和 `DYNAMIC_CONFIG_KEY`。
- [x] 3.5 自动读取失败或校验失败时，保留手动 Cookie 编辑能力，并且不得把平台标记为已授权。
- [x] 3.6 授权状态变化后刷新 V2 账号与快速发布状态，同时不得把描述或 Cookie 授权说明带回账号列表/快速发布卡片。

## 4. 产品文案与视觉打磨

- [x] 4.1 为所有新增可见文案补齐中英文国际化，同时写入 `src/locales/*` 和 `siyuan/i18n/*`。
- [x] 4.2 文案必须站在用户操作角度表达，避免出现 BrowserWindow、session、header 等工程词。
- [x] 4.3 授权操作区视觉需要符合 V2 小而密布局：间距紧凑、主次清晰、状态 badge 简短，除非 Electron 登录行为必须，否则不使用大弹窗。
- [x] 4.4 复查快速发布卡片和账号列表，确保它们仍然不显示平台描述和 Cookie 授权长说明。

## 5. 测试与验证

- [x] 5.1 为共享网页 Cookie 授权服务增加单测，覆盖读取成功、无 Cookie、校验失败、敏感日志保护。
- [x] 5.2 为 `V2WebCookieAuthPanel` 增加组件测试，覆盖 Electron 可用状态和非 Electron 降级状态。
- [x] 5.3 增加 bridge/form 测试，证明 Cookie 输入保持可编辑，并且 V2 授权操作区只出现在网页登录 Cookie 平台。
- [x] 5.4 增加 V1 回归测试，证明旧版授权入口在组件契约层面保持可用或行为不变。
- [x] 5.5 运行 V2 设置、Cookie 配置、授权服务相关 Vitest 用例。
- [x] 5.6 运行 `pnpm build:v2`。
- [ ] 5.7 手工复查 V2 配置页、账号列表、快速发布、Cookie 自动读取成功、Cookie 自动读取失败、非 Electron 手动路径。
