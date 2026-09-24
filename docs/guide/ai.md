# 人工智能

插件集成 AI 能力，用于辅助写作、标题/摘要生成等。需要在「偏好设置」中启用并填写体验码/模型配置。

## 入口

- 入口：设置 → **AI 设置** 启用 AI；面板头部 **AI 图标** 打开 AI 对话。
- 菜单：偏好设置中「显示 AI 菜单」开关控制 AI 入口是否显示。

## 配置项

- **启用 AI**（`experimentalAIEnabled`）：总开关。
- **AI 体验码 / 模型**（`experimentalAICode`、`experimentalAIApiModel`）：接入模型。
- **AI 基础地址**（`experimentalAIBaseUrl`）：API 地址。
- **AI 代理地址**（`experimentalAIProxyUrl`）：有代理时配置。
- **AI token 数目**（`experimentalAIApiMaxTokens`）：单次生成上限。
- **AI 温度**（`experimentalAIApiTemperature`）：采样温度。

## 说明

- AI 配置为实验性能力，具体接入的模型/服务以可用的 API 为准。
- 相关字段与行为变更请以插件发布说明为准。
