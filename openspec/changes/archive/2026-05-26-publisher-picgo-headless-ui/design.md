## Context

Publisher 当前依赖 `zhi-siyuan-picgo@^1.12.1`，这是旧版 lib。当前代码里 `usePicgoBridge` 仍包含 `checkPicgoInstalled()`，V2 `V2PicBedSettings.vue` 会根据 `siyuan-plugin-picgo` 插件是否安装来决定 PicGo 选项可用性，`PluginInvoke` 还保留打开 `/plugins/siyuan-plugin-picgo/#/...` 的入口。

这些实现只能说明旧方案的问题，不能作为未来 V2 图床目标。未来目标是：Publisher 升级到 PicGo 仓库 `picgo-headless-publisher-contract` 发布的新 lib 后，自己提供轻量配置 UI，并通过 lib 统一管理 PicGo 配置和上传。

## Goals / Non-Goals

**Goals:**

- Publisher 用户不安装 `siyuan-plugin-picgo` 插件也能配置和使用 PicGo-lib 图床能力。
- V2 图床设置由 Publisher 自己承载，不 iframe 到 PicGo 插件页面。
- Publisher 轻量 UI 能列出新版 PicGo lib 支持的 uploader，展示配置字段，新增/编辑配置，保存并切换当前 uploader。
- Publisher 仍保留平台级 `picbedService`：`None` / `Bundled` / `PicGo`，其中 `PicGo` 表示使用 PicGo lib，不表示安装 PicGo 插件。
- Publisher 不复制 Universal-PicGo 内部配置模型；字段 schema、默认值、保存格式、校验和上传行为来自新版 `zhi-siyuan-picgo`。
- 发布流程使用同一个 PicGo-lib 配置源上传 Markdown 图片。
- 错误展示符合 V2 宿主要求，不能只靠模糊 alert 或静默降级。

**Non-Goals:**

- 不复刻完整 `siyuan-plugin-picgo` 设置页。
- 不实现 PicGo 插件市场、第三方 PicGo plugin 安装管理或完整 PicGo 产品功能。
- 不继续要求用户安装 PicGo 插件。
- 不在 Publisher 中重写 uploader 上传实现。
- 不在 PicGo lib 发布前强行基于旧 `zhi-siyuan-picgo` 写临时方案。

## Decisions

### 1. Publisher 自写轻量 UI，但不自造图床模型

Publisher 只写 UI 外壳和交互：列表、表单、保存按钮、测试上传按钮、平台级选择。字段来源和保存语义来自 PicGo lib：

```text
V2PicBedSettings replacement
  ├─ usePublisherPicgoManager()
  │   └─ wraps zhi-siyuan-picgo headless manager
  ├─ uploader list from lib
  ├─ uploader schema from lib
  ├─ validation from lib
  ├─ save config through lib
  └─ upload/test through lib
```

这样 Publisher 用户得到一体化体验，但底层不会分叉成 Publisher 自己的一套图床实现。

### 2. 当前 V2 图床实现视为错误遗留，不做增量修补

现有 `V2PicBedSettings.vue` 主要是在列平台并为每个平台选择 `None/PicGo/Bundled`，同时显示 PicGo 插件是否安装。这不能满足“新增图床/配置图床/不依赖 PicGo 插件”的目标。实施时应重做结构，而不是继续修补 `checkPicgoInstalled` 分支。

### 3. 两层配置必须分开

Publisher 有两类配置：

```text
Publisher 平台级配置：
  platformKey -> picbedService = None | Bundled | PicGo
  属于 Publisher，用于决定发布到某平台时走哪条图片处理链路。

PicGo-lib 图床配置：
  uploader schemas/current/uploader configs
  属于 PicGo lib，由 zhi-siyuan-picgo 读写和校验。
```

V2 UI 可以在一个页面里展示两类内容，但保存路径和责任边界必须分开。

### 4. PicGo 表示能力来源，不表示插件安装状态

`PicbedServiceTypeEnum.PicGo` 在新版语义下表示“使用 `zhi-siyuan-picgo` headless lib 上传”。UI 文案不得暗示必须安装 `siyuan-plugin-picgo` 插件。

### 5. 实施顺序受上游 release 限制

该 change 的实现必须等待或显式本地链接 PicGo 仓库 `picgo-headless-publisher-contract` 的产物。不能用旧版 `zhi-siyuan-picgo` 的能力缺口倒逼 Publisher 再造一套配置模型。

## Risks / Trade-offs

- [Risk] 新版 PicGo lib schema 不够完整，Publisher UI 无法稳定渲染。→ Mitigation：实施前检查上游 contract，缺口回到 PicGo 仓库补，不在 Publisher 硬编码绕过。
- [Risk] 用户混淆 PicGo 插件和 PicGo-lib 能力。→ Mitigation：文案使用“图床/PicGo 内核能力”，不提示安装 PicGo 插件；独立 PicGo 插件只作为可选产品。
- [Risk] 平台级 `picbedService` 与全局 PicGo 当前 uploader 混淆。→ Mitigation：UI 分区展示“平台使用哪种图片服务”和“PicGo 图床配置”。
- [Risk] 旧代码入口仍打开 PicGo 插件 iframe。→ Mitigation：V2 移除或隐藏这些入口；如 V1 保留，需要标明 legacy scope。
- [Risk] 发布流程与设置页使用不同实例或路径。→ Mitigation：统一封装 `usePublisherPicgoManager`，设置页和发布流程共用同一创建入口。

## Migration Plan

1. 等待 PicGo 仓库 `picgo-headless-publisher-contract` 完成并发布，或按文档使用本地 link/pack 产物。
2. 升级 Publisher 的 `zhi-siyuan-picgo` 依赖到包含 headless contract 的版本。
3. 新增 Publisher PicGo manager composable，封装新版 lib。
4. 重写 V2 图床设置页面：新增 PicGo-lib 配置分区和平台级图床选择分区。
5. 调整发布图片处理：`PicbedServiceTypeEnum.PicGo` 走新版 lib，而不是插件安装检查。
6. 清理 V2 中 PicGo 插件安装提示、iframe 打开入口和错误文案。
7. 执行 V2 构建和 SiYuan `test` 工作空间手验。

## Open Questions

- Publisher 首版展示所有内置 uploader，还是配置白名单？倾向先由 PicGo lib 全量提供，Publisher 可用白名单做产品收敛。
- 是否提供“从独立 PicGo 插件配置导入”的按钮？如果双方共享同一 workspace 配置，可能不需要导入。
- V1 旧 UI 是否同步改语义，还是只保证 V2 正确？本 change 主要面向 V2。
