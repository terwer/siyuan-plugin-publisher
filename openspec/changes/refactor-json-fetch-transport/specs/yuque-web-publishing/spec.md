## ADDED Requirements

### Requirement: 语雀网页版 JSON 诊断 SHALL 接入统一 JSON 传输

语雀网页版 JSON 请求在后续迁移后 SHALL 使用统一 JSON 传输 facade 写入真实 transport 与阶段诊断。适配器不得在传输未解析前预设误导性的 transport。

#### Scenario: 语雀 JSON 请求失败并展示诊断

- **WHEN** 语雀网页版 JSON 请求失败并展示错误详情
- **THEN** 诊断 SHALL 展示 JSON facade 解析后的真实 transport
- **AND** MUST NOT 在请求进入 facade 前默认标记为 `siyuan-forward-proxy`
