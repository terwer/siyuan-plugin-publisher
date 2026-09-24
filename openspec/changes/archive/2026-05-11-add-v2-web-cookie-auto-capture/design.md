## Context

当前 V2 设置页已经通过 `V2PlatformConfigBridge` 直接挂载旧平台配置表单，网页平台 Cookie 字段也已经允许手动编辑。但旧版网页授权能力仍集中在 `PublishPlatformSettingList.vue` 的列表按钮里，用户在 V2 中要么自己粘贴 Cookie，要么回到旧列表理解“授权/验证”两个动作，路径不连续。

现有可复用能力包括：

- `CommonBlogSetting.vue`：网页平台配置表单，Cookie 存在 `cfg.password`。
- `PublishPlatformSettingList.vue`：旧版授权和验证流程，包含 Electron 读取 Cookie、Chrome 插件验证、手动 Cookie 弹窗等分支。
- `openBrowserWindow(url, dynCfg, cookieCb, extraScriptCb)`：在思源 Electron 环境可读取指定域 Cookie。
- `Adaptors.getCfg()` / `Adaptors.getAdaptor()` / `Utils.webApi()`：可构建平台 Web API，并调用 `buildCookie()`、`getMetaData()`。
- `sanitizeCookieArrayForLog()`：已有敏感 Cookie 日志脱敏工具。

V2 的设计要求不是复制旧页面，而是在配置页内给用户一个自然、确定、可恢复的授权操作区：自动读取是主路径，手动编辑是兜底路径，验证/保存是用户确认路径。视觉上要匹配当前 V2 小面板和思源笔记“信息密度高、空间克制”的特点，同时参考 Ant Design 的主次层级、状态明确和即时反馈。

## Goals / Non-Goals

**Goals:**

- 在 V2 网页平台配置页内完成 Cookie 自动读取、回填、验证、保存和状态写回。
- 保留手动 Cookie 编辑能力，不因为自动读取失败阻断用户。
- 抽取网页授权逻辑，减少 V1/V2 两套流程重复，避免把旧列表大组件继续扩大。
- 自动读取仅在 Electron/思源桌面环境提供；非 Electron 环境给出手动编辑路径。
- 新增 UI 小而精致，适合 V2 设置面板，不在账号列表和快速发布卡片里增加描述或噪音。
- 全部文案国际化；所有日志、错误和测试断言禁止泄露敏感 Cookie/token。
- 不改变现有平台配置格式和发布适配器契约。

**Non-Goals:**

- 不重写所有网页平台配置表单。
- 不新增一套独立 secret 存储；Cookie 仍保存在平台配置的 `password` 字段。
- 不在浏览器端、Docker 浏览器端、Chrome 扩展中模拟 Electron Cookie 读取。
- 不绕过平台登录、验证码、风控或权限模型。
- 不把快速发布卡片或账号列表变成授权说明页；自动授权入口只出现在配置上下文。
- 不在本变更中解决所有网页平台桥接注册缺口；仅支持已接入 V2 bridge 的网页平台。

## Decisions

### 1. 新增可复用授权 composable，而不是继续复制旧列表方法

新增类似 `useWebCookieAuthorization` 的组合式逻辑，负责：

- 判断当前平台是否为 `AuthMode.WEBSITE` 且使用 Cookie 配置。
- 判断当前环境是否支持 Electron 自动读取。
- 读取当前 setting、dynamicConfigArray、dynCfg、storedCfg。
- 调用 `openBrowserWindow(dynCfg.authUrl, dynCfg, cookieCb, extraScriptCb)`。
- 在回调内用 `api.buildCookie(cookies)` 构造 Cookie 字符串。
- 将 Cookie 写入 `cfg.password`，调用 `api.updateCfg(newCfg)` 后执行 `api.getMetaData()`。
- 成功时写回 `setting[platformKey]`、metadata、`dynCfg.isAuth = true`、`DYNAMIC_CONFIG_KEY`。
- 失败时写回 `dynCfg.isAuth = false`，但不得清空用户已手动编辑的 Cookie，除非用户明确操作。

理由：旧流程混在列表组件中，V2 直接复用会把 UI、路由、dialog、授权状态耦合在一起；抽成 composable 后 V1 可以继续调用，V2 可以做更轻的内嵌交互。

替代方案：把 `PublishPlatformSettingList.vue` 的 dialog 整体挂到 V2。否定原因：视觉和交互不适合 V2 配置页，会把“配置页内就地完成”的体验再次拆回旧列表心智。

### 2. V2 使用内嵌 Cookie 操作区，而不是大弹窗

在 Cookie 输入区域附近增加一个紧凑操作区，建议结构：

- 左侧：短标题/状态，例如“Cookie 授权”。
- 中间：一行状态说明，例如“可自动读取当前桌面登录态，也可手动粘贴修正”。
- 右侧：主按钮“自动读取 Cookie”，次按钮或文本“手动编辑已开启”。
- 成功/失败反馈使用短 alert/message，不占用过多高度。

视觉原则：

- 主按钮使用当前 V2 主色或 Element Plus primary，小尺寸。
- 状态 badge 使用成功/警告/中性三态，文字短。
- 操作区高度尽量控制在一到两行，避免大段说明压缩表单。
- 文案面向用户动作，不写“调用 BrowserWindow”“读取 session”等工程词。

理由：Cookie 授权是配置页的一部分，不应打断用户；自动读取只是帮助用户填好字段，手动编辑仍然可见。

替代方案：Cookie textarea 右侧直接放一个孤立按钮。否定原因：上下文不足，用户不清楚按钮读取什么、失败后怎么办，也不利于展示非 Electron 状态。

### 3. 自动读取流程采用“读取并验证”一体化

点击“自动读取 Cookie”后，不只回填 Cookie，还要立即执行 `getMetaData()` 验证登录态。只有验证通过才将 `isAuth` 写为 true。

流程：

1. 用户点击自动读取。
2. 如当前已有授权状态，先将本次操作标记为重新授权，但不立即删除配置。
3. 打开/读取 Electron 会话 Cookie。
4. 构造 Cookie 字符串并临时写入 cfg。
5. 调用平台 metadata 校验。
6. 成功：保存 Cookie + metadata + `isAuth=true`，提示“已读取并验证”。
7. 失败：保留表单内可编辑 Cookie，`isAuth=false`，提示用户可重新登录后再读或手动粘贴。

理由：只读取不验证会造成“看起来成功但发布失败”的假成功；V2 应给用户确定状态。

替代方案：分成“读取”和“验证”两个按钮。否定原因：对普通用户认知负担高；保留底部原有验证按钮作为高级/兜底即可。

### 4. 非 Electron 环境显示低干扰降级说明

非 Electron 或无法使用 `openBrowserWindow` 的环境：

- 自动读取按钮 disabled 或不显示。
- 展示一行短说明：当前环境不支持自动读取，请在浏览器开发者工具复制 Cookie 后粘贴。
- 不弹错误 dialog，不误导用户等待自动读取。

理由：Docker 浏览器端和其他运行形态本来没有 Electron session；应明确给出可执行手动路径。

替代方案：点击后再报错。否定原因：浪费用户动作，也不符合 Ant Design 的确定性原则。

### 5. 与现有 `CommonBlogSetting` 的集成方式采用 slot/事件扩展

优先给 `CommonBlogSetting.vue` 的 Cookie 表单位置增加一个轻量扩展点，例如：

- `cookie-actions` slot，向外暴露 `cfg`、`dynCfg`、`setting`、`dynamicConfigArray`、`saveConf` 或受控回调。
- 或新增 props 控制是否显示 V2 自动读取组件。

V2 bridge 挂载网页平台时注入 `V2WebCookieAuthPanel`；V1 默认不显示该 panel，除非后续主动迁移。

理由：自动读取入口必须贴近 Cookie 字段，但不应该把 V2 专用 UI 直接写死到通用旧表单，避免 V1 受影响。

替代方案：直接在 `CommonBlogSetting` 内对所有环境显示按钮。否定原因：V1/V2 的布局尺度不同，且旧页面已有授权按钮，容易重复。

### 6. 配置写回保持现有 JSON 结构

成功读取后仍然写入：

- `setting[platformKey].password`
- `setting[platformKey].metadata`
- `DynamicConfig.isAuth`
- `setting[DYNAMIC_CONFIG_KEY] = setDynamicJsonCfg(dynamicConfigArray)`

不新增专用 cookie store，不改变 postid、发布配置或适配器接口。

理由：历史配置和发布主链路都依赖 `password` 作为 Cookie 字段；保持兼容风险最低。

### 7. 敏感信息保护作为验收门槛

任何新增日志只能记录：

- 平台 key、平台名称、是否读取到 Cookie、Cookie 数量、验证状态。

禁止记录：

- 原始 Cookie 字符串。
- 原始 Cookie 数组未脱敏内容。
- Authorization、ctoken、token、csrf、ticket。
- 请求头完整内容。

测试中要覆盖失败消息和日志 sanitizer 的使用，不允许为了调试把敏感信息落入 console。

## Risks / Trade-offs

- [Risk] Electron Cookie 读取时机仍可能早于用户完成登录 → Mitigation：按钮文案和流程明确“请先在授权窗口完成登录后再读取/重试”；必要时扩展 `openBrowserWindow` 支持显式“关闭窗口后读取”模式，但必须保持 V1 兼容。
- [Risk] 不同平台 `buildCookie()` 对 Cookie 域和顺序要求不同 → Mitigation：统一复用各平台 WebAdaptor 的 `buildCookie()`，不在 UI 层拼接 Cookie。
- [Risk] 把 V2 panel 写进旧表单可能污染 V1 → Mitigation：通过 slot 或显式 prop 注入，默认旧表单行为不变。
- [Risk] 自动读取成功但 metadata 校验失败，用户误以为已保存 → Mitigation：读取和验证一体化；只有校验通过才显示成功并写 `isAuth=true`。
- [Risk] 小面板中加入太多说明导致拥挤 → Mitigation：正文只保留一行动作说明，复杂说明放 tooltip 或帮助链接，避免账号列表/快速发布出现说明噪音。
- [Risk] OpenBrowserWindow 现有 `cookieCallback` 分支创建隐藏窗口并立即读取，未必符合“先登录再读取” → Mitigation：实施前复核运行时行为；若确认需要，新增兼容参数 `readCookieOnClose` 或 `showForCookieCapture`，不得破坏旧验证流程。

## Migration Plan

1. 提取网页 Cookie 授权 composable/service，先让旧流程可调用，保证 V1 行为不变。
2. 给 `CommonBlogSetting` 增加 Cookie 操作 slot 或受控扩展点，默认不改变旧 UI。
3. 新增 `V2WebCookieAuthPanel`，只在 V2 bridge 的网页 Cookie 平台配置页注入。
4. 实现 Electron 自动读取、验证、写回和状态刷新。
5. 实现非 Electron 降级展示和手动编辑保留。
6. 增加国际化、单测、构建验证。
7. 人工复查 V2 配置页、账号列表和快速发布，确认描述/授权提示没有再次污染非配置场景。

Rollback 策略：保留手动 Cookie 输入和原有验证/保存按钮；如果自动读取出现平台兼容问题，可通过隐藏 V2 自动读取 panel 回退，不影响手动配置和旧 V1 授权流程。

## Open Questions

- 是否需要在本变更中扩展 `openBrowserWindow` 为“显示授权窗口，用户关闭后读取 Cookie”的显式模式？当前代码里 `cookieCallback` 存在时会隐藏窗口并立即读取，可能更像“读取已有 Electron session”而不是完整登录流程。实施阶段必须先复核真实运行行为后决定。
- V2 成功读取后是否立即自动调用现有 `saveConf(true)`，还是只回填表单并提示用户点击保存？本设计倾向“成功读取并验证后自动保存授权相关字段”，但普通配置字段仍由用户保存。
