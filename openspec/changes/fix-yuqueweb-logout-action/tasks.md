## 0. Upstream dependency

- [x] 0.1 等待上游 `zhi-blog-api` 完成 `add-web-auth-logout-spi` 提案并发布新的 npm 版本。
- [x] 0.2 将本仓库依赖升级到已发布的 `zhi-blog-api` 新版本。

## 1. 统一退出服务与类型

- [x] 1.1 在网页 Cookie 授权共享模块中定义退出结果状态、依赖注入类型和适配器能力检测函数。
- [x] 1.2 实现统一退出/清除授权方法：加载 setting、dynamic config、stored config、WebConfig 和 WebAdaptor。
- [x] 1.3 在统一方法中优先调用适配器 `logoutWebAuth()`，否则对非语雀平台保留 `logoutUrl` fallback。
- [x] 1.4 在远端退出成功后清空当前平台配置 `password`，写回 `DynamicConfig.isAuth = false`，并保存平台配置与 `DYNAMIC_CONFIG_KEY`。
- [x] 1.5 为缺少退出方式、退出失败、状态写回失败返回结构化错误，不使用 mock、占位 URL 或猜测参数。

## 2. 语雀网页版动作化退出

- [x] 2.1 从 `YuquewebConfig` 移除语雀网页版失效的 `logoutUrl` 字段声明和默认值。
- [x] 2.2 在 `YuquewebWebAdaptor` 中实现 `logoutWebAuth()`，调用 `DELETE /api/accounts/logout`。
- [x] 2.3 实现从 Cookie 字符串提取 `yuque_ctoken` 的小型私有工具，并在缺失时返回明确错误。
- [x] 2.4 实现语雀退出登录名解析：优先使用 `cfg.metadata.login`，缺失时复用 metadata 请求获取，仍缺失则失败。
- [x] 2.5 确保语雀退出请求携带 Cookie、`x-csrf-token`、`x-login`、`X-Requested-With` 和 `{home}/logout` Referer。
- [x] 2.6 确保语雀退出日志和错误脱敏，不输出 Cookie、ctoken、csrf、ticket 或 token。

## 3. V1 旧平台设置列表接入

- [x] 3.1 将 V1 验证失败后的退出确认逻辑改为调用统一退出服务，而不是直接打开 `logoutUrl`。
- [x] 3.2 根据统一退出结果展示成功、fallback、失败三类用户反馈。
- [x] 3.3 确保 V1 退出成功后平台列表授权状态和保存配置同步刷新为未授权。

## 4. V2 Cookie 授权面板接入

- [x] 4.1 在 V2 网页 Cookie 授权操作区增加退出/清除授权入口。
- [x] 4.2 为 V2 退出入口增加确认、加载态、成功反馈和失败反馈。
- [x] 4.3 V2 退出成功后同步清空当前表单 Cookie 值，并触发授权状态刷新事件。
- [x] 4.4 补充或更新 V2 国际化文案，区分动作化远端退出、URL fallback 和失败提示。

## 5. 测试与验证

- [x] 5.1 为统一退出服务添加单元测试，覆盖适配器动作化退出成功、本地状态清理、URL fallback、无退出方式失败。
- [x] 5.2 为语雀 `logoutWebAuth()` 添加单元测试，覆盖 DELETE 请求路径、header 派生、缺少 `yuque_ctoken`、缺少 login。
- [x] 5.3 更新 V1 设置列表测试，验证验证失败后的退出确认调用统一服务而不是直接打开语雀失效 URL。
- [x] 5.4 更新 V2 面板测试，验证退出入口展示、触发、成功清空表单 Cookie 和失败提示。
- [x] 5.5 运行相关测试和类型检查，确认没有真实 Cookie/token 出现在测试数据、日志断言或快照中。
