## 2026-05-21 审计会话

- 用户否决：直连 `commonblogApiAdaptor.checkAuth()`（回避 BlogAdaptor）
- 层 1 `normalizeXmlrpcResponseText`：用户认可为真修，**保留**

## 2026-05-21 回退（用户要求）

- 已回退：`CommonBlogSetting.vue` → HEAD（恢复 `await api.checkAuth()` + `boolean` 分支）
- **保留**：`useProxy.ts`、`src/utils/xmlrpcResponseUtil.ts`、`xmlrpcResponseUtil.spec.ts`
- **暂停**：层 2 由用户自行修上游 `zhi-blog-api`，修好后通知再联调
