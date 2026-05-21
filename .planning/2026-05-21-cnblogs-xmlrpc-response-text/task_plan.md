# 博客园验证 indexOf 崩溃

## 状态

- [x] 层 1：`normalizeXmlrpcResponseText` + `proxyXmlrpc`
- [x] 回退 valiConf 绕过 BlogAdaptor
- [x] 上游 `zhi-blog-api@1.79.0`（`checkAuth` return）
- [x] 依赖升级 + 单测 + `build:v2`
- [ ] 思源 V2 博客园「验证」手测

## 手测要点

1. `pnpm dev:v2` + `pnpm makeLink:v2`
2. 博客园 MetaWeblog 填正确密钥 → 验证应成功或给出业务错误（非 `indexOf` / 非 boolean 误报）
3. 错误时 V2 桥接应显示 `SypErrorDetailsPanel` 详情
