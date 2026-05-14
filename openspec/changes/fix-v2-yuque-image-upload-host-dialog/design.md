## Context

当前 `add-yuque-web-v2-auth-sample` 已经通过语雀新增、更新、删除等验收，但 8.6 “包含本地图片发布”仍未通过。用户最新真实截图显示，当前失败详情已经不再是早先 `APP_BASE` 拼错导致的 `Cannot find module .../data/libs/node-fetch-cjs...`，而是被包装成：

```text
YuquewebRequestError: 语雀图片上传失败，请检查网络或稍后重试。
at YuquewebWebAdaptor.yuquewebFormFetch (...)
at async YuquewebWebAdaptor.newMediaObject (...)
at async BaseExtendApi.handlePictures (...)
```

这条证据说明失败发生在图片上传链路中，但当前详情丢失了真实底层状态码、响应体和具体分支，无法判断是 FormData 构造、插件依赖路径、`zhi-formdata-fetch`、`forwardProxy`、语雀接口业务响应，还是 Cookie/权限问题。

同时，新增的 `sypShowErrorDetails()` 直接封装 `ElMessageBox.alert`，Element Plus 默认挂载到全局 body。在 V2 被思源作为插件弹窗承载时，这种全局弹窗会脱离 `.syp-v2` 容器，导致遮罩和弹窗尺寸/定位与宿主冲突。用户截图已经证明该 UI 在宿主弹窗里不合格。

本变更必须先形成取证与设计闭环，再实施；不得继续拍脑袋改代码。

## Goals / Non-Goals

**Goals:**

- 用真实 V2 宿主插件环境取证语雀图片上传失败根因，保留脱敏证据。
- 在不删除、不绕过 `forwardProxy` 的前提下修复图片上传链路。
- 让图片上传失败时的“查看详情”展示真实脱敏诊断，而不是只显示被包装后的友好错误。
- 将 V2 错误详情改成宿主安全的局部交互，视觉上小而密、可复制、不污染思源宿主。
- 保持现有发布主链路负责图片发现与 Markdown URL 替换，语雀适配器只负责单图上传。
- 最终以 `pnpm build:v2` 和用户在思源宿主内人工验收为准，未通过不得勾选 5.3 / 8.6。

**Non-Goals:**

- 不修改或绕过语雀 API 平台。
- 不把图片处理改成语雀专用 Markdown 扫描器。
- 不引入 mock 上传接口、mock 语雀响应或占位 URL。
- 不移除 `forwardProxy`。
- 不把错误详情做成大而全的全屏日志系统。
- 不归档 `add-yuque-web-v2-auth-sample`，直到用户确认 8.6 通过。

## Decisions

### 1. 先加“可脱敏诊断”，再修业务判断

图片上传链路必须在关键阶段产生结构化诊断对象，但只展示/记录脱敏摘要：

```text
stage: build-formdata | web-form-fetch | forward-proxy | zhi-formdata-fetch | unwrap-response | yuque-business
transport: siyuan-forward-proxy | zhi-formdata-fetch | middleware | cors
url: https://www.yuque.com/api/upload/attach?type=image
status: <number if available>
responseBodyPreview: <redacted, length-limited>
errorName/errorMessage: <redacted>
fileName/fileType/fileSize: <safe metadata>
```

这样做的原因：当前错误被二次包装后只剩“语雀图片上传失败”，无法复现根因；继续猜测会导致错误修复方向失真。

替代方案：直接根据截图修改 `unwrapYuquewebResponse` 或改上传接口。否定原因：没有底层响应证据，仍然是猜。

### 2. 保留 `forwardProxy`，明确实际分支

当前代码中 `YuquewebWebAdaptor.yuquewebFormFetch()` 调用 `BaseWebApi.webFormFetch(apiUrl, [headers], formData, true)`。`BaseWebApi.webFormFetch()` 在 `forceProxy=true` 时可能进入 `webFetch(..., forceProxy=true)`，再由 `useProxy` 选择思源 `forwardProxy`；也可能因思源环境判断进入 `zhi-formdata-fetch` 分支。实现时必须记录实际分支，而不是通过移除 `forwardProxy` 规避问题。

关键约束：

- `forwardProxy` 是用户明确要求保留的主链路，禁止删除。
- 如果最终证明 multipart 在某个宿主分支必须使用 `zhi-formdata-fetch`，也要通过项目现有 `webFormFetch` 封装表达，并记录为什么该分支在 V2 中正确。
- 若失败来自 `APP_BASE`，继续保留 `/plugins/siyuan-plugin-publisher/` 的 V2 base 设定并用测试保护。

### 3. 错误包装保留 cause/diagnostic，不能吃掉底层错误

`yuquewebFormFetch()` 当前 catch 非 `YuquewebRequestError` 时会抛出新的 `YuquewebRequestError("语雀图片上传失败，请检查网络或稍后重试。")`，导致底层错误丢失。修复应让包装错误携带：

- `cause`：原始错误对象。
- `diagnosticMessage` 或结构化 `diagnostic`：脱敏后的真实详情。
- `userMessage`：界面摘要。

V2 展示摘要时使用 `userMessage/message`，点击详情时使用 `diagnosticMessage`，没有诊断时退回 stack/message 的脱敏版本。

### 4. 错误详情改为 V2 局部组件，MessageBox 只保留确认用途

`ElMessageBox` 适合 V1/普通页面确认弹窗，但不适合 V2 宿主弹窗里的长错误详情。建议新增 V2 局部错误详情组件，例如：

```text
V2App.vue
└─ .syp-v2
   ├─ 快速发布状态卡片
   └─ SypErrorDetailsPanel / SypLocalDialog
      ├─ 局部半透明层或无遮罩浮层
      ├─ 紧凑标题、摘要、复制按钮、关闭按钮
      └─ 内部滚动 pre/code 区域
```

设计原则：

- 挂载在 `.syp-v2` 内，不 append 到 body。
- 宽度不超过 V2 面板内容区，高度不超过面板可视高度的合理比例。
- 支持复制详情。
- Esc/关闭按钮可退出，不拦截宿主弹窗关闭能力。
- 视觉上使用 V2 token/样式，不使用 Element Plus 默认大白弹窗。

`SypMessageBox.ts` 可以继续服务账号删除、偏好危险确认等短确认；错误详情不再使用全局 MessageBox。

替代方案：继续用 `ElMessageBox.alert` 并加 `appendTo`。否定原因：Element Plus 版本与宿主 shadow/弹窗环境不确定，且长详情天然不适合全局确认弹窗；局部组件更可控。

### 5. 用户友好提示与真实详情分层

所有 V2 发布失败/警告：

- 状态卡片只显示简短可执行文案，避免干扰快速发布直达体验。
- “查看详情”展示真实脱敏错误，方便用户和开发排查。
- 详情必须能复制。
- 详情不能泄露 Cookie、Authorization、ctoken、token、csrf、ticket。

## Risks / Trade-offs

- [Risk] 真实语雀接口响应随账号/权限/频率变化而不同 → Mitigation：只把状态码、响应摘要和分支记录作为诊断，不把单一响应写死成业务判断。
- [Risk] multipart 在 `forwardProxy` 与 `zhi-formdata-fetch` 的兼容性差异导致环境相关失败 → Mitigation：取证时必须记录实际分支、Content-Type/boundary 来源和响应摘要，修复后在思源 Electron 宿主内人工复测。
- [Risk] 错误详情太详细导致敏感信息泄露 → Mitigation：统一走 `sanitizeSensitiveForLog`，限制响应预览长度，测试覆盖敏感字段脱敏。
- [Risk] 局部详情组件增加 V2 状态复杂度 → Mitigation：只在 V2App 管理一个 `errorDetails` 状态，不引入全局 store。
- [Risk] 用户仍需要人工登录语雀才能复测 → Mitigation：任务明确需要用户登录后进行 Chrome/宿主取证，未取证不得标记完成。
