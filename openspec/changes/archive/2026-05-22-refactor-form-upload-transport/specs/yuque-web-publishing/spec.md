## MODIFIED Requirements

### Requirement: 语雀网页版 SHALL 支持图片上传并复用发布主链路

系统 SHALL 通过 `newMediaObject` 实现语雀网页版图片上传，使发布主链路能够统一处理 Markdown 图片替换。实现 MUST 复用现有发布链路的图片发现与替换机制。在思源 Electron 插件宿主中，multipart SHALL 经基类 `webFormFetch` → **`formUploadClient.postJson`**，优先 `plugin-node-fetch`；`forwardProxy` 仅为无 `canUsePluginFetch` 时的回退。

#### Scenario: 文章包含本地图片

- **WHEN** 用户发布包含本地图片的文档到语雀网页版
- **THEN** 系统 SHALL 调用 `newMediaObject` 上传图片
- **AND** 语雀网页版适配器 SHALL 返回语雀图片 URL
- **AND** 正文中的图片链接 SHALL 由现有发布主链路替换为返回 URL

#### Scenario: 图片上传接口未完成证据验证

- **WHEN** 语雀网页版图片上传尚未在 V2 宿主插件中完成真实取证
- **THEN** 实施 SHALL NOT 合入声称支持图片上传的代码

#### Scenario: V2 宿主插件图片上传失败需要取证

- **WHEN** V2 宿主插件中语雀图片上传失败
- **THEN** 系统 SHALL 记录可脱敏的诊断信息
- **AND** 诊断 SHALL 能区分 `APP_BASE`、FormData 构造、`formUploadClient` 通道、`plugin-node-fetch` / `forwardProxy` / `middleware-fetch`、语雀业务错误、Cookie/权限错误
- **AND** `transport` SHALL 为 facade 解析后的真实值，不得在 `build-formdata` 阶段预设 `siyuan-forward-proxy`

#### Scenario: Electron 插件宿主优先直连上传

- **WHEN** 语雀图片上传在思源 Electron 插件宿主运行且 `canUsePluginFetch` 为 true
- **THEN** 实现 SHALL 使用 `plugin-node-fetch`
- **AND** 日志 SHALL 出现 `[form-upload-transport] transport => plugin-node-fetch`

#### Scenario: forwardProxy 作为回退路径

- **WHEN** `canUsePluginFetch` 为 false 且满足既有代理谓词
- **THEN** 实现 MAY 使用思源 `forwardProxy`
- **AND** diagnostic 仅在网络阶段由 facade 标记为 `siyuan-forward-proxy`

#### Scenario: 图片上传失败详情可被用户查看

- **WHEN** 图片上传失败导致 V2 发布失败或带警告成功
- **THEN** V2 UI SHALL 提供可查看的脱敏错误详情
- **AND** 详情 SHALL 含文件名或脱敏标识、失败阶段、真实 transport、响应摘要
