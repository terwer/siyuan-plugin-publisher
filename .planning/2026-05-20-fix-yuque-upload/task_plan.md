# 语雀 V2 图片上传 forwardProxy 修复

## 目标

修复 V2 宿主插件中语雀图片经 `siyuan-forward-proxy` 上传返回 400 `Problems parsing JSON` 的问题，保留 forwardProxy 主链路。

## 阶段

| 阶段 | 状态 | 说明 |
|------|------|------|
| 1. 取证与根因 | complete | 用户 1.2 复现 + 诊断 JSON |
| 2. 修复 Content-Type | complete | `Request("https://localhost/")` + `getHeaders()` 回退 |
| 3. 诊断可读性 | complete | `buildProxyResponsePreview` 解码 base64 |
| 4. 测试与构建 | complete | 单测 + `pnpm build:v2` |
| 5. 人工复测 | pending | 用户在思源宿主确认 8.6 |

## 根因（1.5）

- 分支：`webFormFetch` → `forceProxy=true` → `siyuan-forward-proxy`
- 状态码：400
- 响应：`{"message":"Problems parsing JSON"}`
- 原因：V2 插件 `win.require` 使用 node-fetch `FormData`，原生 `Request` 无法为其生成 `multipart/form-data; boundary=...`，`forwardProxy` 仍以默认 `application/json` 发送 base64 请求体，语雀按 JSON 解析失败。

## 遇到的错误

| 错误 | 尝试 | 解决方案 |
|------|------|----------|
| Problems parsing JSON (400) | 1 | 从 `formData.getHeaders()` 解析 multipart Content-Type |
