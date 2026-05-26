## ADDED Requirements

### Requirement: Publisher V2 不要求安装 PicGo 插件产品

Publisher V2 SHALL 允许用户通过 `zhi-siyuan-picgo` headless lib 配置和使用 PicGo 驱动的图片上传能力，而不要求 `siyuan-plugin-picgo` 作为 SiYuan 插件安装。

#### Scenario: PicGo 插件产品不存在

- **WHEN** 用户打开 Publisher V2 图床设置，且 `/data/plugins/siyuan-plugin-picgo/plugin.json` 不存在
- **THEN** 如果升级后的 npm lib 可用，Publisher SHALL 仍然展示 PicGo-lib 配置能力
- **AND** Publisher SHALL NOT 仅因为 PicGo 插件产品不存在就禁用 PicGo-lib 选项

#### Scenario: Runtime lib 不可用或不兼容

- **WHEN** Publisher 因 npm lib 缺失或不兼容而无法创建 PicGo headless manager
- **THEN** Publisher SHALL 展示结构化 runtime/dependency 错误
- **AND** 错误 SHALL NOT 告诉用户安装 `siyuan-plugin-picgo` 是必需修复方式

### Requirement: Publisher 拥有轻量 PicGo-lib 配置 UI

Publisher V2 SHALL 提供自己的轻量图床配置 UI，用于配置 PicGo-lib uploaders，而不是打开或嵌入 `siyuan-plugin-picgo` 插件 UI。

#### Scenario: 用户打开 V2 图床设置

- **WHEN** 用户打开 Publisher V2 图床设置
- **THEN** UI SHALL 由 Publisher 组件渲染
- **AND** UI SHALL NOT iframe 或跳转到 `/plugins/siyuan-plugin-picgo/#/setting`

#### Scenario: 用户配置 PicGo-lib uploader

- **WHEN** 用户在 Publisher V2 中选择 PicGo-lib uploader
- **THEN** Publisher SHALL 基于 PicGo lib schema 渲染轻量表单
- **AND** Publisher SHALL 通过 PicGo lib contract 保存配置

### Requirement: Publisher 不重定义 PicGo uploader 配置语义

Publisher SHALL 从升级后的 PicGo lib 获取 uploader 列表、字段、校验、默认值和保存格式。Publisher MUST NOT 创建与 `zhi-siyuan-picgo` / `universal-picgo` 分叉的独立 PicGo uploader 配置模型。

#### Scenario: 展示 uploader 列表

- **WHEN** Publisher 展示可用 PicGo-lib uploaders
- **THEN** uploader ids 和 metadata SHALL 来自 PicGo headless manager
- **AND** Publisher MAY 因产品原因过滤或排序列表，但不得改变 uploader id 或配置语义

#### Scenario: 保存 uploader 配置

- **WHEN** 用户从 Publisher UI 保存 uploader 配置
- **THEN** Publisher SHALL 调用 PicGo lib save API
- **AND** 除非使用文档明确说明的 lib escape hatch，否则 Publisher SHALL NOT 直接写 raw PicGo 配置路径

### Requirement: Publisher 分离平台图床选择与 PicGo-lib uploader 配置

Publisher SHALL 将平台级图床选择与 PicGo-lib uploader 配置分开。`PicbedServiceTypeEnum.PicGo` SHALL 表示该平台发布时使用 PicGo-lib 上传，而不是表示 PicGo 插件产品已安装。

#### Scenario: 用户为平台选择 PicGo

- **WHEN** 用户把某个平台的 `picbedService` 设置为 `PicGo`
- **THEN** Publisher SHALL 将该平台偏好保存到 Publisher 设置中
- **AND** 发布到该平台时 SHALL 使用当前 PicGo-lib uploader 配置

#### Scenario: 用户编辑当前 PicGo uploader

- **WHEN** 用户改变当前 PicGo-lib uploader 或其凭据
- **THEN** Publisher SHALL 更新 PicGo-lib 配置
- **AND** Publisher SHALL NOT 重写所有平台的 `picbedService` 偏好

### Requirement: Publisher 发布流程使用 PicGo headless lib

当平台的 `picbedService` 为 `PicGo` 时，Publisher SHALL 通过升级后的 `zhi-siyuan-picgo` headless contract 上传并替换 Markdown 图片，而不是通过已安装的 PicGo 插件产品。

#### Scenario: 使用 PicGo-lib 图片上传发布

- **WHEN** 某个平台配置了 `picbedService = PicGo`，且文档包含本地或 SiYuan 托管图片
- **THEN** Publisher SHALL 调用 PicGo headless 上传/Markdown 替换 API
- **AND** 上传成功时，最终用于发布的 Markdown SHALL 包含上传后的图片 URL

#### Scenario: 发布时上传失败

- **WHEN** 发布过程中 PicGo-lib 上传失败
- **THEN** Publisher SHALL 展示带有足够 V2 排查信息的结构化错误或警告
- **AND** 除非用户明确配置该行为，否则 Publisher SHALL NOT 静默 fallback 到平台上传或不上传

### Requirement: 移除或替换当前错误的 V2 PicGo 插件依赖 UI

Publisher V2 SHALL 移除或替换把已安装 `siyuan-plugin-picgo` 当作 PicGo 图床能力开关的 UI 和逻辑。

#### Scenario: 移除旧 PicGo 插件可用性提示

- **WHEN** Publisher V2 图床设置渲染
- **THEN** 页面 SHALL NOT 显示“因为 PicGo 插件未安装所以 PicGo 不可用”含义的提示
- **AND** 任何可用性状态 SHALL 指向 headless lib/runtime/config 状态

#### Scenario: V2 不使用旧 PicGo 插件 iframe 入口

- **WHEN** V2 用户需要配置 PicGo-lib 图床设置
- **THEN** Publisher SHALL 让用户停留在 Publisher V2 设置内
- **AND** Publisher SHALL NOT 在主配置路径中调用 `PluginInvoke.showPicbedDialog()` 或 `PluginInvoke.showPicbedSettingDialog()` 打开 PicGo 插件页面

### Requirement: Publisher 实现等待或链接新的 PicGo contract

Publisher SHALL 只基于包含 `picgo-headless-publisher-contract` 的 PicGo lib 版本实现本 change；该版本可以来自正式发布，也可以来自有文档记录的 local link/pack workflow。

#### Scenario: 依赖已升级

- **WHEN** 开始实现
- **THEN** `package.json` 和 lockfile SHALL 指向包含 headless contract 的 PicGo lib 版本或本地 link 来源
- **AND** tasks 或 validation 记录 SHALL 记录用于验证的确切来源

#### Scenario: 旧 lib 缺少必需 contract

- **WHEN** 当前 `zhi-siyuan-picgo` 依赖未暴露必需 headless APIs
- **THEN** Publisher SHALL NOT 通过复制 PicGo internals 来实现替代行为
- **AND** 缺失能力 SHALL 先回到 PicGo 仓库解决
