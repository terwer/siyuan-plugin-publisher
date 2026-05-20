# 取证发现

## 用户复现（2026-05-20）

- 文件：`image-20260520211423-hxt4vky.png`，40603 字节，`image/png`
- URL：`https://www.yuque.com/api/upload/attach?type=image`
- transport：`siyuan-forward-proxy`
- status：400
- responseBodyPreview（base64）：`eyJtZXNzYWdlIjoiUHJvYmxlbXMgcGFyc2luZyBKU09OIn0=`
- 解码：`{"message":"Problems parsing JSON"}`

## 与历史成功证据对比

`add-yuque-web-v2-auth-sample` 7.4 曾在 Chrome+forwardProxy 下上传成功（status 200）。差异在于 V2 宿主插件路径使用 `FormDataUtils.getFormData` → node-fetch FormData，而非浏览器原生 FormData。

## 修复方向

在 `siyuanProxyFetch` 中优先使用 `formData.getHeaders()['content-type']`，保留 `Request` 检测作为回退；错误诊断中对 base64 响应体做解码预览。

## 根因补充（代码验证）

Node 22+ / 现代 Electron 中 `new Request("", { body: FormData })` 抛 `ERR_INVALID_URL`，旧逻辑无法读取 `multipart/form-data; boundary=...`，`forwardProxy` 退回 `application/json`，语雀返回 `Problems parsing JSON`。修复为 `https://localhost/` 后，node-fetch FormData 可正确带出 boundary。
