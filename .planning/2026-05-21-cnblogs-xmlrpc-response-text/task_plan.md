# 博客园验证 indexOf 崩溃 — 审计修订版

## 目标
修复 MetaWeblog 验证崩溃；校验必须经 `BlogAdaptor`。

## 状态

- [x] 回退错误变更（valiConf 直连 adaptor）
- [x] 保留层 1：`normalizeXmlrpcResponseText` + `proxyXmlrpc`
- [ ] **等待用户上游修复** `zhi-blog-api` / `BlogAdaptor.checkAuth`
- [ ] 上游就绪后：升级依赖 + V2 手验

## 禁止
- 绕过 `api.checkAuth()` 的 valiConf 改动
