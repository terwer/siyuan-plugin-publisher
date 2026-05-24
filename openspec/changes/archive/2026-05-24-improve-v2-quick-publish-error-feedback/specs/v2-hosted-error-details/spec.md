## ADDED Requirements

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
