## 1. 上游依赖检查

- [ ] 1.1 确认 PicGo 仓库 change `picgo-headless-publisher-contract` 已实现，并可通过 release、pack 文件或 local link 使用。
- [ ] 1.2 将 `zhi-siyuan-picgo` 依赖升级到包含 headless contract 的版本或来源。
- [ ] 1.3 在本 change notes 或 validation log 中记录用于验证的确切 PicGo lib 版本/来源。
- [ ] 1.4 如果升级后的 lib 未暴露必需的 config、schema、validation 和 upload APIs，则快速失败。

## 2. Publisher PicGo Manager Wrapper

- [ ] 2.1 创建 Publisher 侧 composable/service，封装新的 `zhi-siyuan-picgo` headless manager。
- [ ] 2.2 确保设置 UI 和发布流程使用同一个 manager 创建路径和 SiYuan config 来源。
- [ ] 2.3 用 headless lib/runtime readiness 检查替换 `checkPicgoInstalled()` 语义。
- [ ] 2.4 移除 V2 中把 `/data/plugins/siyuan-plugin-picgo/plugin.json` 当作 PicGo 能力开关的逻辑。

## 3. V2 轻量图床设置 UI

- [ ] 3.1 重设计 `V2PicBedSettings` 或替代组件，明确分为两个区域：平台图床偏好、PicGo-lib uploader 配置。
- [ ] 3.2 从 PicGo lib metadata 渲染 uploader 列表；只允许 Publisher 侧做过滤/排序。
- [ ] 3.3 从 PicGo lib schema 渲染 uploader 表单字段，或使用显式映射到 schema 字段的手写控件。
- [ ] 3.4 通过 PicGo lib API 保存 uploader 配置，并展示字段级校验错误。
- [ ] 3.5 通过 PicGo lib API 提供当前 uploader 选择和持久化。
- [ ] 3.6 移除旧 V2 文案：不能再说因为 PicGo 插件产品未安装所以 PicGo 不可用。

## 4. 平台偏好集成

- [ ] 4.1 保留 `PicbedServiceTypeEnum.None`、`PicbedServiceTypeEnum.Bundled`、`PicbedServiceTypeEnum.PicGo` 作为平台级选择。
- [ ] 4.2 在 UI/help text 中把 `PicGo` 重新定义为“使用 PicGo lib/图床内核”，不是“使用已安装 PicGo 插件”。
- [ ] 4.3 确保改变当前 PicGo uploader 不会重写 per-platform preferences。
- [ ] 4.4 确保改变某个平台偏好不会覆盖 PicGo uploader 凭据或当前 uploader，除非用户明确请求。

## 5. 发布流程集成

- [ ] 5.1 用升级后的 PicGo headless 上传/Markdown 替换 API 替代旧 `usePicgoBridge` 发布路径。
- [ ] 5.2 确保 `PicbedServiceTypeEnum.PicGo` 发布路径不再检查已安装 PicGo 插件产品。
- [ ] 5.3 保留现有 `Bundled` 和 `None` 行为：平台上传仍走平台上传，不上传仍不上传。
- [ ] 5.4 通过 V2 兼容的结构化错误/警告 UI 展示 PicGo-lib 上传失败。

## 6. 清理和文档

- [ ] 6.1 移除或标记 legacy-only 的 V2 `PluginInvoke.showPicbedDialog()` / `showPicbedSettingDialog()` 引用。
- [ ] 6.2 移除或更新要求用户安装 PicGo 插件产品才能进行 Publisher 图片上传的 i18n 文案。
- [ ] 6.3 更新 Publisher 文档，说明 Publisher 直接使用 PicGo lib，不需要为了该能力安装 `siyuan-plugin-picgo`。
- [ ] 6.4 交叉引用 PicGo 仓库 change `picgo-headless-publisher-contract`。

## 7. 验证

- [ ] 7.1 使用升级后的 PicGo lib 运行 Publisher V2 typecheck/build。
- [ ] 7.2 在 SiYuan `test` 工作空间验证：未依赖已安装 `siyuan-plugin-picgo` 插件产品时，V2 图床设置仍能打开。
- [ ] 7.3 验证新增/编辑 PicGo-lib uploader 配置会通过 lib 持久化，并在重载后保持。
- [ ] 7.4 验证平台设置为 `PicGo` 时，发布过程中会上传并替换 Markdown 图片。
- [ ] 7.5 验证平台设置为 `Bundled` 时仍使用平台上传，不调用 PicGo-lib 上传。
- [ ] 7.6 验证平台设置为 `None` 时不上传图片。
- [ ] 7.7 验证 V2 流程中不存在旧 PicGo 插件安装提示和 iframe 设置路径。
