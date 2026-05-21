## 2026-05-21 回退

- 已回退 `CommonBlogSetting.vue` valiConf 直连 adaptor
- 保留层 1：`normalizeXmlrpcResponseText` + `proxyXmlrpc`

## 2026-05-21 上游就绪

- `zhi-blog-api@1.79.0`：`BlogAdaptor.checkAuth` 改为 `return await this.apiAdaptor.checkAuth()`（不再 `throw await`）
- `zhi-siyuan-api@2.35.5`：随 lock 升级
- 本项目 `package.json` / `pnpm-lock.yaml` 已 bump
- 自动化：`vitest` xmlrpcResponseUtil 6/6 通过；`pnpm build:v2` 通过
- **待办**：思源 V2 博客园配置页手点「验证」（`pnpm dev:v2` + `pnpm makeLink:v2`）
