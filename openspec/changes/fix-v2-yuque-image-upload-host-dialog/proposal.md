## Why

语雀网页版 V2 真实验收中仍有两个阻塞问题：包含本地图片的发布失败，且“查看详情”错误弹窗在思源宿主弹窗内遮罩、定位和尺寸失控。它们直接影响 `add-yuque-web-v2-auth-sample` 的 8.6 图片验收和 V2 用户遇到失败时的排障体验，必须作为独立修复变更先取证、再实现，禁止用猜测或 mock 绕过真实链路。

## What Changes

- 建立语雀网页版图片上传失败的证据闭环：在 V2 宿主插件真实环境中记录 `newMediaObject -> yuquewebFormFetch -> BaseWebApi.webFormFetch -> forwardProxy / zhi-formdata-fetch -> 语雀 /api/upload/attach` 的分支、请求摘要、响应状态和脱敏响应体。
- 保留并验证思源 `forwardProxy` 主链路，严禁删除、绕过或 mock `forwardProxy`；若使用 `zhi-formdata-fetch`，必须证明它在宿主插件路径、FormData/Blob、Cookie Header 和语雀响应处理上与 V2 运行环境兼容。
- 修复语雀图片上传失败时的底层诊断保留方式：用户提示保持友好，但“查看详情”必须能看到脱敏后的真实底层错误、状态码、响应摘要和关键调用阶段。
- 将 V2 错误详情从全局 Element Plus MessageBox 默认弹窗改为宿主安全的 V2 局部详情交互；弹层/面板必须挂在 `.syp-v2` 内部视觉体系内，不污染思源宿主弹窗，不出现整屏遮罩错位。
- 补充 V2 宿主插件定位约束下的自动化检查与人工验收步骤；最终验证只使用 `pnpm build:v2` 和必要的聚焦单测。
- 不改变语雀 API 平台，不改变已有 Cookie 自动读取提案，不改变图片发现/替换的发布主链路，不新增 mock 服务。

## Capabilities

### New Capabilities
- `v2-hosted-error-details`: 定义 V2 在思源宿主弹窗内展示错误详情的局部、紧凑、可复制、宿主安全交互能力。

### Modified Capabilities
- `yuque-web-publishing`: 补充语雀网页版图片上传失败取证、诊断详情、宿主 V2 真实验收的要求。

## Impact

- 适配器与代理链路：`src/adaptors/web/yuqueweb/YuquewebWebAdaptor.ts`、`src/adaptors/web/base/baseWebApi.ts`、`src/composables/useProxy.ts`、`src/utils/FormDataUtils.ts`、`src/utils/sensitiveLogSanitizer.ts`。
- V2 发布与错误状态：`src/composables/usePublish.ts`、`src/composables/v2/useV2QuickPublish.ts`、`src/components/v2/V2App.vue`。
- V2 公共 UI：新增或替换 `src/components/v2/common/*ErrorDetails*` / `SypMessageBox.ts` 相关实现；更新 `src/assets/v2/base.styl` 中宿主安全样式。
- 测试：新增/调整语雀图片上传诊断、V2 错误详情容器策略、APP_BASE/FormData 依赖路径、错误脱敏与详情展示测试。
- 人工验收：必须在思源 Electron 插件宿主弹窗中复测图片发布和错误详情，未通过不得勾选 `add-yuque-web-v2-auth-sample` 的 5.3 / 8.6。
