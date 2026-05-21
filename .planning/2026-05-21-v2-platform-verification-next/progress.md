## 2026-05-21

- #21 博客园 T1 全列 ✅
- 用户选 **#25 WordPress** 本地手测
- 失败：`forwardProxy` 禁止 `[::1]:8090`（本地 WP）
- 原因：#21 博客园为**公网** URL，仍走 forwardProxy；本地 localhost 被内核拦截
- 原则：**Electron 禁止 forwardProxy**，MetaWeblog 用 node-fetch 直连
- 修复 `{}` 空对象：`commonFetchClient` 会把 XML 当 JSON 解析 → 新增 `electronXmlrpcDirectFetch` 绕过 middleware
