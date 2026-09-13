# v2-hosted-error-details Specification

## Purpose

定义 V2 在思源宿主弹窗内展示错误详情的局部、紧凑、可复制、宿主安全交互能力，覆盖快速发布失败与平台配置验证失败等需要保留真实诊断的场景。
## Requirements
### Requirement: V2 错误详情 SHALL 在宿主插件容器内展示
系统 SHALL 在 V2 思源插件宿主弹窗内部展示错误详情，不得依赖默认挂载到 `document.body` 的全局弹窗造成遮罩、定位或尺寸脱离 `.syp-v2` 容器。

#### Scenario: 用户查看快速发布失败详情
- **WHEN** 用户在 V2 快速发布状态卡片点击“查看详情”
- **THEN** 系统 SHALL 在 `.syp-v2` 容器内部显示错误详情交互
- **AND** 详情交互 SHALL 不创建覆盖整个思源窗口的错位遮罩
- **AND** 详情交互 SHALL 保持在当前插件面板可视区域内

#### Scenario: 用户查看平台配置验证失败详情
- **WHEN** 用户在 V2 账号「发布设置」桥接页点击验证且失败，并点击「查看详情」
- **THEN** 系统 SHALL 在 `.syp-v2` 容器内部显示错误详情交互（与快速发布共用或等价组件）
- **AND** 详情交互 SHALL 不创建覆盖整个思源窗口的错位遮罩
- **AND** 详情交互 SHALL 保持在当前插件面板可视区域内

#### Scenario: V2 运行在思源宿主弹窗中
- **WHEN** V2 面板被思源以插件弹窗或浮层形式承载
- **THEN** 错误详情 SHALL 使用 V2 自身的层级、圆角、阴影、间距和紧凑视觉
- **AND** 错误详情 SHALL NOT 破坏宿主弹窗的滚动、关闭、拖动或焦点行为

### Requirement: V2 错误详情 SHALL 同时支持友好提示和真实诊断
系统 SHALL 在用户界面显示简短、可执行的友好错误，同时提供可查看的脱敏真实诊断详情。详情 MUST 保留关键排障信息，且 MUST NOT 泄露 Cookie、Authorization、ctoken、token、csrf、ticket 或等价敏感字段。

#### Scenario: 错误包含底层诊断
- **WHEN** 发布失败对象包含底层错误、调用阶段、状态码或响应摘要
- **THEN** 状态卡片 SHALL 显示友好错误摘要
- **AND** “查看详情” SHALL 展示脱敏后的真实诊断内容
- **AND** 诊断内容 SHALL 包含足够定位问题的调用阶段或错误来源

#### Scenario: 平台配置验证包含底层诊断
- **WHEN** 桥接表单验证失败且 `errorMessage` 包含异常类型、堆栈或 API 响应摘要
- **THEN** 配置页失败摘要 SHALL 显示友好错误摘要
- **AND** “查看详情” SHALL 展示脱敏后的 `errorMessage` 全文
- **AND** 诊断内容 SHALL 足以支持用户向开发者反馈具体错误（如 `TypeError: ...`）

#### Scenario: 错误包含敏感字段
- **WHEN** 原始错误、响应或请求摘要包含 Cookie、Authorization、ctoken、token、csrf、ticket 或等价敏感字段
- **THEN** 错误详情 SHALL 对敏感值脱敏后再展示
- **AND** 日志与测试快照 SHALL NOT 输出原始敏感值

### Requirement: V2 错误详情 SHALL 适合小而密的笔记软件视觉
系统 SHALL 使用紧凑、可扫读、低打扰的错误详情设计，避免大面积白色默认弹窗和过宽过高的详情容器。

#### Scenario: 错误详情内容较长
- **WHEN** 脱敏错误详情超过当前面板可视高度
- **THEN** 详情内容 SHALL 在内部滚动区域展示
- **AND** 外层 V2 面板 SHALL 保持可控尺寸
- **AND** 用户 SHALL 能复制详情文本用于反馈问题

### Requirement: V2 错误详情组件 SHALL 复用于配置验证与发布失败
系统 SHALL 对快速发布失败与平台配置验证失败使用同一套宿主内错误详情组件与脱敏策略，避免重复实现。

#### Scenario: 配置验证失败后打开详情
- **WHEN** `V2App` 收到配置验证失败且用户请求查看详情
- **THEN** 系统 SHALL 使用与快速发布相同的 `SypErrorDetailsPanel`（或封装它的 composable）
- **AND** 面板标题与摘要文案 MAY 区分场景（配置验证 vs 发布失败）

### Requirement: V2 快速发布失败 SHALL 使用页面内短摘要而不是失败 toast
系统 SHALL 在 V2 快速发布失败时停止弹出全局失败 toast，并在快速发布页面状态卡内展示平台、动作和短错误摘要。失败反馈 MUST 保留在当前 V2 宿主面板内，用户不需要先打开详情面板才能知道主要失败原因。

#### Scenario: 平台发布失败返回业务错误
- **WHEN** 快速发布到任一平台失败且错误摘要为“标题过短”
- **THEN** 系统 SHALL NOT 弹出全局失败 toast
- **AND** 页面状态卡 SHALL 显示类似“CSDN 发布失败：标题过短”的失败描述
- **AND** 页面 SHALL 提供“查看详情”入口

#### Scenario: 平台更新或删除失败
- **WHEN** 快速发布执行更新或删除动作失败并生成短错误摘要
- **THEN** 页面状态卡 SHALL 显示对应动作的失败描述和短错误摘要
- **AND** 系统 SHALL NOT 通过全局失败 toast 重复提示

### Requirement: V2 快速发布错误摘要 SHALL 从共用层提取业务原因
系统 SHALL 在 V2 快速发布共用层从错误文本、错误对象或发布结果中提取面向用户的短错误摘要。提取逻辑 MUST 适用于所有平台，不得为 CSDN、知乎、语雀或其他平台编写专属分支。

#### Scenario: 错误文本包含远端 JSON msg
- **WHEN** 发布结果错误为 `main.opt.failure=>Error: {"code":400,"traceId":"9195dc6c-ed82-4cc0-b1c3-f653e5743b26","data":null,"msg":"标题过短"}`
- **THEN** 快速发布状态 SHALL 将错误摘要设置为“标题过短”
- **AND** 错误详情 SHALL 保留脱敏后的原始 JSON 和调用堆栈（如存在）

#### Scenario: 错误文本包含 message 或 error.message
- **WHEN** 发布失败响应包含 `message` 或嵌套 `error.message` 字段
- **THEN** 快速发布状态 SHALL 优先使用该业务字段作为短摘要
- **AND** 提取失败时 SHALL 回退到脱敏后的简短原文摘要

#### Scenario: 错误包含敏感字段
- **WHEN** 快速发布错误文本或详情包含 Cookie、Authorization、ctoken、csrf、ticket、token 或等价敏感字段
- **THEN** 页面摘要和详情面板 SHALL 对敏感值脱敏
- **AND** 快速发布测试或日志 SHALL NOT 输出原始敏感值

### Requirement: V2 快速发布详情 SHALL 保留真实诊断
系统 SHALL 将 V2 快速发布失败的短摘要与真实诊断详情分离。页面状态卡显示短摘要，错误详情面板显示脱敏后的完整错误、traceId、HTTP 状态、响应摘要和调用堆栈（如存在）。

#### Scenario: 用户查看失败详情
- **WHEN** 用户在快速发布失败状态卡点击“查看详情”
- **THEN** 系统 SHALL 在 `SypErrorDetailsPanel` 中显示短摘要
- **AND** 详情内容 SHALL 包含脱敏后的原始错误详情
- **AND** 详情内容 SHALL 适合复制给开发者排障

