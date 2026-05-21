## 1. 契约与类型

- [ ] 1.1 在 `platformConfigActionBridge.ts` 定义 `V2PlatformConfigValidationResult`（`ok`, `apiStatus?`, `errorMessage?`, `errorDetails?`）
- [ ] 1.2 更新 `V2PlatformConfigBridge` / `V2App` 的 emit 与 handler 类型签名

## 2. 事件透传

- [ ] 2.1 确认 `CommonBlogSetting.emitValidated` 已包含 `errorMessage`；缺失时补全稳定字符串
- [ ] 2.2 `V2PlatformConfigBridge` 的 `onValidated` / `handleFormValidated` 完整转发结果对象（不剥离字段）
- [ ] 2.3 审查其他桥接设置组件（Cookie/Web）是否需对齐同一契约

## 3. V2 错误展示

- [ ] 3.1 抽取或复用 composable（如 `useV2ErrorDetails`）封装 `SypErrorDetailsPanel` 的 open/close + 脱敏
- [ ] 3.2 `V2App.handleConfigValidated`：`!ok` 时设置摘要/详情并打开面板；`ok` 时清除内联失败状态
- [ ] 3.3 `V2PlatformConfigBridge` 增加验证失败内联摘要条 +「查看详情」按钮（emit 或 inject 触发 App 面板）
- [ ] 3.4 添加 i18n 键：`v2.platformConfig.validation.failed`、`viewDetails` 等

## 4. V1 桥接模式降噪

- [ ] 4.1 `CommonBlogSetting.valiConf`：当 `v2ActionBridge` 存在时跳过 `ElMessage.error`（保留 logger）
- [ ] 4.2 可选：失败时在内联区显示 `errorMessage` 首行（若 Bridge 未承担）

## 5. 测试与验收

- [ ] 5.1 更新 `V2PlatformConfigBridge.spec.ts`：失败事件携带 `errorMessage`、内联摘要可见
- [ ] 5.2 新增/更新 `V2App` 或 composable 单测：失败触发 `SypErrorDetailsPanel`
- [ ] 5.3 思源 V2 手验：博客园配置页点「验证」失败 → 可见摘要 + 可复制详情（含 `TypeError` 等真实文案）
- [ ] 5.4 验证成功路径回归：`completeConfigIfPublishReady` 仍仅在 `ok && validatePublish` 通过时完成配置
