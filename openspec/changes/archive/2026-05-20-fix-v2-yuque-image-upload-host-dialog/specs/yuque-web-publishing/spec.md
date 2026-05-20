## MODIFIED Requirements

### Requirement: 语雀网页版 SHALL 支持图片上传并复用发布主链路
系统 SHALL 通过 `newMediaObject` 实现语雀网页版图片上传，使发布主链路能够统一处理 Markdown 图片替换。实现 MUST 复用现有发布链路的图片发现与替换机制，不得为语雀网页版另写一套 Markdown 图片解析器。图片上传修复 MUST 基于 V2 宿主插件真实环境证据完成，MUST 保留思源 `forwardProxy` 主链路，MUST NOT 使用 mock、占位响应或绕过代理链路证明成功。

#### Scenario: 文章包含本地图片
- **WHEN** 用户发布包含本地图片的文档到语雀网页版
- **THEN** 发布主链路 SHALL 调用语雀网页版 `newMediaObject`
- **AND** 语雀网页版适配器 SHALL 返回语雀图片 URL
- **AND** 正文中的图片链接 SHALL 由现有发布主链路替换为返回 URL

#### Scenario: 图片上传接口未完成证据验证
- **WHEN** 尚未通过真实语雀网页上传接口验证请求格式
- **THEN** 实施 SHALL NOT 合入声称支持图片上传的代码
- **AND** 任务 SHALL 保持阻塞直到补齐接口证据和人工验证

#### Scenario: V2 宿主插件图片上传失败需要取证
- **WHEN** V2 宿主插件中语雀图片上传失败
- **THEN** 系统 SHALL 记录脱敏诊断证据，至少包含调用阶段、所选请求分支、目标接口、状态码、响应摘要和底层错误类型
- **AND** 诊断 SHALL 能区分 `APP_BASE` 依赖路径错误、FormData/Blob 构造错误、`zhi-formdata-fetch` 调用错误、`forwardProxy` 返回错误、语雀接口业务错误和 Cookie/权限错误
- **AND** 诊断 SHALL NOT 包含原始 Cookie、Authorization、ctoken、token、csrf、ticket 或等价敏感字段

#### Scenario: forwardProxy 是 V2 代理主路径
- **WHEN** 语雀网页版图片上传运行在思源 Electron 插件宿主中
- **THEN** 实现 SHALL 保留思源 `forwardProxy` 作为可验证主路径或明确证明当前分支仍通过项目认可的网页代理封装
- **AND** 修复 SHALL NOT 通过删除 `forwardProxy`、强制改走外部 CORS、mock 响应或跳过代理来让测试通过

#### Scenario: 图片上传失败详情可被用户查看
- **WHEN** 图片上传失败导致 V2 发布失败或带警告成功
- **THEN** 用户 SHALL 看到友好的失败摘要
- **AND** 用户 SHALL 能通过“查看详情”看到脱敏后的真实底层错误详情
- **AND** 详情 SHALL 包含图片文件名或脱敏文件标识、失败阶段和底层响应摘要
