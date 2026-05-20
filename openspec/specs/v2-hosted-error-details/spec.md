# v2-hosted-error-details Specification

## Purpose

定义 V2 在思源宿主弹窗内展示错误详情的局部、紧凑、可复制、宿主安全交互能力。

## Requirements

### Requirement: V2 错误详情 SHALL 在宿主插件容器内展示
系统 SHALL 在 V2 思源插件宿主弹窗内部展示错误详情，不得依赖默认挂载到 `document.body` 的全局弹窗造成遮罩、定位或尺寸脱离 `.syp-v2` 容器。

#### Scenario: 用户查看快速发布失败详情
- **WHEN** 用户在 V2 快速发布状态卡片点击“查看详情”
- **THEN** 系统 SHALL 在 `.syp-v2` 容器内部显示错误详情交互
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
