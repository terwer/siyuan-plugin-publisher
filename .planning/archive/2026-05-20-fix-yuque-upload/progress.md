# 进度日志

## 2026-05-20

- 读取 `fix-v2-yuque-image-upload-host-dialog` 提案与 tasks
- 用户完成 1.2 复现，提供完整 diagnostic JSON 与截图
- 根因定位：forwardProxy multipart Content-Type 在 node-fetch FormData 下丢失
- 开始修改 `useProxy.ts`
- 修复：`Request("https://localhost/")` + getHeaders 回退 + base64 诊断解码
- 新增 `useProxy.spec.ts`，`pnpm build:v2` 通过
- 待用户：V2 宿主复测图片发布（2.5 / 8.6）
