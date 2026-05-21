# 博客园 XML-RPC 修复 — 边界说明

## 原则

- **共享层**（`siyuanProxyFetch` 成功出口）不因单平台改语义
- **专用层**（`proxyXmlrpc`）承担 MetaWeblog/XML-RPC 全部规范化

## 状态

- [x] 层 1：`proxyXmlrpc` + `normalizeXmlrpcResponseText`（MetaWeblog 专用）
- [x] 收窄：回退 `siyuanProxyFetch` 成功路径上的 normalize
- [x] 上游 `zhi-blog-api@1.79.0`
- [x] 博客园手测通过（用户）
- [ ] MetaWeblog 系其它平台冒烟（WP/Typecho 等）
- [ ] 语雀/Halo forwardProxy 回归（确认未动成功路径）

## 建议冒烟

1. 博客园：验证 + 发布（已测）
2. WordPress MetaWeblog：验证
3. 语雀 V2：图片上传或一篇带图发布（验证 base64 forwardProxy 未回归）
