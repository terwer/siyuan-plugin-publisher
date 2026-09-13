# 博客园 XML-RPC 修复

## 状态

- [x] 层 1：`proxyXmlrpc` + `normalizeXmlrpcResponseText`
- [x] 收窄 `siyuanProxyFetch` 成功出口
- [x] 上游 `zhi-blog-api@1.79.0`
- [x] 思源 V2 博客园验证 + 配置全勾选（用户确认）
- [ ] 可选：其它 MetaWeblog 平台（WP/Typecho）冒烟
- [ ] 可选：语雀/Halo forwardProxy 回归

## 边界

- 改动仅在 `proxyXmlrpc`（MetaWeblog 系）；语雀/Halo 不经此入口
