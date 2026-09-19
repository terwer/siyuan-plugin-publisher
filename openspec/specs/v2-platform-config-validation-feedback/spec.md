# v2-platform-config-validation-feedback Specification

## Purpose
定义 V2 平台配置桥接页在 API 或授权验证失败时的事件载荷、内联反馈与宿主内错误详情展示契约，确保真实诊断可见、可复制且经过脱敏处理。
## Requirements
### Requirement: 桥接验证事件 SHALL 携带完整失败信息
V2 平台配置桥接层 SHALL 在平台表单完成 API/授权验证后，向上层传递包含 `ok`、`apiStatus`、`errorMessage` 的结果对象；验证失败时 `errorMessage` MUST 非空（若无底层消息则使用 V2 通用失败文案）。

#### Scenario: MetaWeblog 平台验证失败
- **WHEN** 用户在 V2 发布设置页点击「验证」且底层 adaptor 抛出或返回错误（如 `TypeError`、XML-RPC fault）
- **THEN** 桥接表单 SHALL 通过 `onValidated` 传递 `ok: false` 与可读的 `errorMessage`
- **AND** `V2PlatformConfigBridge` SHALL 将该对象原样转发给 `V2App`
- **AND** 转发过程 MUST NOT 丢弃 `errorMessage` 字段

#### Scenario: 验证成功
- **WHEN** 平台验证成功且 `apiStatus` 为 true
- **THEN** 结果对象 SHALL 包含 `ok: true`
- **AND** `errorMessage` MAY 为空

### Requirement: V2 配置验证失败 SHALL 在桥接区展示可行动摘要
系统 SHALL 在桥接表单区域（`.syp-platform-bridge` 或等价容器）展示 V2 风格的验证失败摘要，使用户无需依赖泛化黄色提示即可知晓「验证未通过」。

#### Scenario: 用户验证失败后立即查看页面
- **WHEN** `onValidated` 收到 `ok: false`
- **THEN** 配置页 SHALL 显示失败摘要（友好一句，可含平台名）
- **AND** 摘要区域 SHALL 提供「查看详情」或等价入口
- **AND** 配置页 SHALL 保持打开，不得因失败而自动完成账号配置流程

#### Scenario: 用户再次点击验证且成功
- **WHEN** 后续验证返回 `ok: true`
- **THEN** 失败摘要区域 SHALL 清除或替换为成功状态
- **AND** 系统 MAY 继续执行 `validatePublish` 门禁（若授权与发布校验均通过）

### Requirement: V2 配置验证失败详情 SHALL 可查看且可复制
系统 SHALL 使用宿主内错误详情交互（`SypErrorDetailsPanel` 或与其等价的 V2 组件）展示脱敏后的完整诊断，供用户复制后反馈问题。

#### Scenario: 用户打开验证失败详情
- **WHEN** 用户点击配置页的「查看详情」
- **THEN** 系统 SHALL 在 `.syp-v2` 内打开错误详情面板
- **AND** 详情内容 SHALL 包含底层 `errorMessage` 的脱敏全文
- **AND** 用户 SHALL 能一键复制详情文本

#### Scenario: 详情包含鉴权 token
- **WHEN** `errorMessage` 或堆栈中包含 token、password、Authorization、Cookie 等敏感片段
- **THEN** 详情面板 SHALL 在展示前脱敏
- **AND** 复制到剪贴板的内容 MUST 为脱敏后的文本

### Requirement: V2 桥接模式下 SHALL NOT 仅以全局 Toast 作为唯一错误反馈
当 V2 平台配置动作桥接已注入时，底层 V1 表单 SHALL NOT 仅依赖挂载到 `document.body` 的 `ElMessage.error` 作为验证失败的唯一用户可见反馈。

#### Scenario: 在 V2 发布设置中验证失败
- **WHEN** `V2_PLATFORM_CONFIG_ACTION_BRIDGE_KEY` 已注入且验证失败
- **THEN** 用户 SHALL 能在 V2 配置页看到内联失败摘要或详情入口
- **AND** 不得仅出现短暂全局 Toast 而无持久、可复制的错误信息
