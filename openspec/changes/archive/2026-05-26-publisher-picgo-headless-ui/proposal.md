## Why

Publisher 当前 V2 图床设置仍沿用旧思路：检测 `siyuan-plugin-picgo` 是否安装、提示用户安装 PicGo 插件、甚至打开 PicGo 插件页面。这与未来目标相反。Publisher 应该作为独立插件提供发布流程里的轻量图床配置体验，只依赖新版 PicGo lib 的 headless contract，而不要求用户额外安装完整 PicGo 插件产品。

本 change 依赖 PicGo 仓库 `picgo-headless-publisher-contract`。真实实施顺序必须是：先在 `siyuan-plugin-picgo` 发布新版 `zhi-siyuan-picgo` / `universal-picgo` contract，再在 Publisher 升级依赖并重做 V2 图床 UI。

## What Changes

- 重写 Publisher V2 图床设置，不再把当前 `V2PicBedSettings.vue` 的旧实现当目标。
- 移除 V2 图床流程中“必须安装 `siyuan-plugin-picgo` 插件”的前置检查和用户提示。
- 移除打开 `/plugins/siyuan-plugin-picgo/#/...` 的 PicGo 插件 iframe 配置入口，改为 Publisher 自己的轻量 UI。
- 新增 Publisher 轻量图床 UI：列出 PicGo lib 支持的 uploader、选择当前 uploader、新增/编辑 uploader 配置、显示校验错误、保存配置。
- 保留 Publisher 自己的发布偏好：每个平台仍可选择 `None` / `Bundled` / `PicGo`，但 `PicGo` 表示“使用新版 PicGo lib 能力”，不表示“依赖已安装 PicGo 插件”。
- 图床字段定义、保存格式、校验和上传行为必须来自新版 PicGo lib contract，Publisher 不得自造一套图床配置模型。
- 发布时使用新版 `zhi-siyuan-picgo` headless API 上传 Markdown 内图片，替代旧的插件安装检测逻辑。
- **BREAKING**：V2 图床设置语义调整；旧的“PicGo 插件安装状态决定是否可选 PicGo”逻辑废弃。

## Capabilities

### New Capabilities

- `publisher-headless-picgo-ui`：Publisher 自己提供的轻量 PicGo-lib 图床配置 UI 和发布接入。

### Modified Capabilities

- None.

## Impact

- 上游依赖：
  - PicGo 仓库 change `picgo-headless-publisher-contract`
  - 新版正式发布或本地 link 的 `zhi-siyuan-picgo` 包，需要暴露 headless config/upload APIs
- 受影响 Publisher 区域：
  - `src/components/v2/settings/V2PicBedSettings.vue`
  - `src/composables/usePicgoBridge.ts`
  - platform config 中的 `picbedService` 使用语义
  - base adaptor 发布图片上传路径
  - 提及安装 PicGo 插件的 i18n 文案
  - V2 中仍使用的 `PluginInvoke` PicGo dialog 入口
- 用户影响：
  - 用户只安装 Publisher 即可配置 PicGo-lib 图片上传；前提是运行时支持所选 uploader 且用户提供有效凭据。
