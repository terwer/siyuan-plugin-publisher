# yuque-web-publishing Specification

## Purpose

定义语雀网页版（Cookie）发布能力，以及与语雀 Open API（`common_Yuque`）的边界说明。

**注意：** 语雀 Open API / Personal Access Token 需[专业会员](https://www.yuque.com/about/price#personal)；未续费或免费配额用尽时常见 **429**，并非本插件限流。遇 429 请优先使用「语雀网页版」或开通会员。详见 `openspec/changes/archive/2026-05-20-add-yuque-web-v2-auth-sample/verification-2026-05-20-yuque-api-membership.md`。
## Requirements
### Requirement: 语雀网页版平台 SHALL 独立于语雀 API 平台注册

系统 SHALL 新增一个独立的语雀网页版平台，用于 Cookie 网页授权发布。该平台 MUST 使用独立 platform key、独立 subtype 和独立适配器，不得替换或破坏现有语雀 API 平台。

#### Scenario: 用户选择语雀网页版
- **WHEN** 用户在平台选择中选择“语雀网页版”
- **THEN** 系统 SHALL 创建网页授权平台配置
- **AND** 该配置 SHALL 使用独立于 `common_Yuque` 的 platform key
- **AND** 现有语雀 API 平台配置 SHALL 保持可用

#### Scenario: 用户已有语雀 API 配置
- **WHEN** 用户升级到包含语雀网页版的平台版本
- **THEN** 系统 SHALL 保留原有语雀 API 配置
- **AND** 系统 SHALL NOT 自动迁移或覆盖原有 token 配置

### Requirement: 语雀 Open API 429 SHALL 提示会员/配额而非插件故障

当用户使用 `common_Yuque`（Token）且语雀返回 429 或 403 时，系统 SHALL 提示专业会员/配额限制，并给出定价页链接。

#### Scenario: Token 校验返回 429
- **WHEN** 用户在配置页校验语雀 API Token 且响应 status 为 429
- **THEN** 系统 SHALL 说明多为语雀会员或免费版新建文档配额限制
- **AND** 系统 SHALL 建议开通/续费专业会员或改用语雀网页版
- **AND** 系统 SHALL 提供 https://www.yuque.com/about/price#personal 供用户查看

### Requirement: 语雀网页版 SHALL 使用 Cookie 授权并校验登录态

系统 SHALL 通过网页授权 Cookie 调用语雀 Web 内部接口。系统 MUST 提供登录态校验，并在登录失效或权限不足时返回用户可理解的错误信息。

#### Scenario: Cookie 有效
- **WHEN** 用户保存有效语雀 Cookie 并点击校验或发布
- **THEN** 系统 SHALL 能够请求语雀当前用户信息接口
- **AND** 系统 SHALL 显示授权可用状态

#### Scenario: Cookie 失效
- **WHEN** 用户使用过期或无效 Cookie 访问语雀网页版平台
- **THEN** 系统 SHALL 阻止继续发布
- **AND** 系统 SHALL 提示用户重新登录语雀并重新读取 Cookie
- **AND** 错误信息 SHALL NOT 包含内部调试指令、原始 Cookie 或 token

### Requirement: 语雀网页版 SHALL 支持知识库发现与选择

系统 SHALL 获取当前登录用户可写的语雀知识库，并将知识库映射为发布分类/知识空间供用户选择。

#### Scenario: 成功获取知识库
- **WHEN** 用户进入语雀网页版平台配置或发布详情
- **THEN** 系统 SHALL 展示可发布的知识库列表
- **AND** 每个知识库 SHALL 至少包含展示名称、bookId、bookSlug 或等价发布标识

#### Scenario: 未获取到知识库
- **WHEN** 语雀 Web 接口返回空知识库列表
- **THEN** 系统 SHALL 提示用户确认当前账号是否有知识库写入权限
- **AND** 系统 SHALL NOT 使用 mock 知识库或占位知识库继续发布

### Requirement: 语雀网页版 SHALL 支持 Markdown 文档新建

系统 SHALL 使用语雀 Web 文档接口创建文档。首期主路径 MUST 使用实测可用的 `format: "markdown"` 提交 Markdown 内容。

#### Scenario: 用户首次发布文档
- **WHEN** 用户选择语雀网页版平台并发布一篇未绑定文章
- **THEN** 系统 SHALL 创建语雀文档
- **AND** 请求 SHALL 包含目标知识库、标题、slug、Markdown 正文和文档格式
- **AND** 发布成功后系统 SHALL 保存可用于后续更新、删除和预览的 postid 元信息

#### Scenario: 创建失败
- **WHEN** 语雀 Web 创建文档接口返回失败
- **THEN** 系统 SHALL 显示用户化失败原因
- **AND** 系统 SHALL NOT 写入成功绑定状态

### Requirement: 语雀网页版 SHALL 支持文档更新

系统 SHALL 能够根据已保存的 postid 元信息更新语雀文档标题、slug 和正文内容。

#### Scenario: 用户更新已绑定文档
- **WHEN** 用户对已绑定语雀网页版文档再次发布
- **THEN** 系统 SHALL 定位原语雀文档
- **AND** 系统 SHALL 更新标题、slug 和 Markdown 正文
- **AND** 发布绑定关系 SHALL 保持指向同一语雀文档

#### Scenario: 原文档不存在
- **WHEN** 用户更新的语雀文档已在语雀侧删除或不可访问
- **THEN** 系统 SHALL 提示用户文档不存在或无权限访问
- **AND** 系统 SHALL 提供解除绑定后重新发布的行动建议

### Requirement: 语雀网页版 SHALL 支持文档删除

系统 SHALL 能够根据已保存的 postid 元信息删除语雀网页版文档，并与发布工具解除绑定。

#### Scenario: 用户删除已发布文档
- **WHEN** 用户在发布工具中删除语雀网页版已发布记录
- **THEN** 系统 SHALL 调用语雀 Web 删除文档接口
- **AND** 删除成功后系统 SHALL 返回成功状态给发布主链路

#### Scenario: 删除接口返回文档不存在
- **WHEN** 语雀 Web 删除接口返回文档不存在
- **THEN** 系统 SHALL 将错误解释为“语雀侧文档已不存在或无权限访问”
- **AND** 系统 SHALL 允许用户按现有主链路解除本地绑定

### Requirement: 语雀网页版 SHALL 支持可打开的预览 URL

系统 SHALL 根据 postid 元信息生成语雀文档预览 URL。

#### Scenario: 用户点击预览
- **WHEN** 用户点击语雀网页版发布记录的预览入口
- **THEN** 系统 SHALL 打开 `https://www.yuque.com/{login}/{bookSlug}/{docSlug}` 形式的文档地址
- **AND** 地址 SHALL NOT 使用内部数字 id 作为用户可见路径，除非语雀实际返回的路径要求如此

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

### Requirement: 语雀网页版 SHALL 提供用户化错误信息

系统 SHALL 将语雀 Web 接口错误转换为用户可理解、可行动的提示。错误信息 MUST 避免泄露 Cookie、token、ctoken、Authorization、请求头或内部调试细节。

#### Scenario: 语雀返回 429
- **WHEN** 语雀 Web 接口返回 429 或限流语义错误
- **THEN** 系统 SHALL 提示“语雀请求过于频繁，请稍后重试”或等价用户化文案
- **AND** 系统 SHALL NOT 将原始响应作为唯一提示

#### Scenario: 语雀返回权限错误
- **WHEN** 语雀 Web 接口返回 401 或 403
- **THEN** 系统 SHALL 提示用户重新登录或确认知识库写入权限
- **AND** 系统 SHALL NOT 暴露 Cookie 或内部认证字段

### Requirement: 语雀网页版 SHALL 接入 V2 平台配置桥接

系统 SHALL 允许用户在 V2 设置流程中新增、配置和保存语雀网页版账号。V2 SHALL 通过现有桥接机制复用平台配置组件，不得新增一套孤立配置流程。

#### Scenario: 用户在 V2 新增语雀网页版账号
- **WHEN** 用户在 V2 账号设置中选择语雀网页版
- **THEN** 系统 SHALL 打开语雀网页版配置表单
- **AND** 保存后该账号 SHALL 出现在 V2 快速发布平台列表中

#### Scenario: V1 和 V2 共存
- **WHEN** 用户在 V1 或 V2 中修改语雀网页版配置
- **THEN** 配置 SHALL 使用同一持久化结构
- **AND** 任一入口不应破坏另一入口读取配置

### Requirement: 语雀网页版 SHALL 具备全链路人工验收

语雀网页版合入前 SHALL 通过人工全链路验收，覆盖配置、授权、知识库、新建、更新、删除、图片上传、预览、V2 快速发布和 V2 配置桥接。

#### Scenario: 实施者准备提交语雀网页版
- **WHEN** 实施者准备提交代码
- **THEN** 任务清单 SHALL 包含人工验收记录
- **AND** 未通过的高风险项 SHALL 阻止合入

### Requirement: 语雀网页版 JSON 诊断 SHALL 接入统一 JSON 传输

语雀网页版 JSON 请求在后续迁移后 SHALL 使用统一 JSON 传输 facade 写入真实 transport 与阶段诊断。适配器不得在传输未解析前预设误导性的 transport。

#### Scenario: 语雀 JSON 请求失败并展示诊断

- **WHEN** 语雀网页版 JSON 请求失败并展示错误详情
- **THEN** 诊断 SHALL 展示 JSON facade 解析后的真实 transport
- **AND** MUST NOT 在请求进入 facade 前默认标记为 `siyuan-forward-proxy`

