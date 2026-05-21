## 2026-05-21 上游就绪
- `zhi-blog-api@1.79.0` / `zhi-siyuan-api@2.35.5`

## 2026-05-21 手测新错：`non-text response object`

- 根因：插件内 XML-RPC 误走 middleware 解析成 `{}`；forwardProxy 包装字段不全
- 已修：
  - `useProxy.proxyXmlrpc`：思源宿主内优先 `siyuanProxyFetch`
  - `siyuanProxyFetch`：`status`/`Body` 兼容 + xml 走 `normalizeXmlrpcResponseText`
  - `xmlrpcResponseUtil`：PascalCase、base64、深度 XML 查找
- 单测 10/10；待用户 V2 博客园再次点「验证」
