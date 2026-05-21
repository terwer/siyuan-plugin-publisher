## 分层边界（修改必须有理由）

### 层 0：共享基建（禁止为单平台随意改）

| 模块 | 职责 | 谁在用 |
|------|------|--------|
| `proxyFetch` / `siyuanProxyFetch` | 通用 HTTP/forwardProxy | 语雀、Halo、Notion、Confluence、Web、**以及** MetaWeblog |
| `proxyXmlrpc` | **仅** XML-RPC 序列化/反序列化 | **仅** MetaWeblog 系 |

### 层 1：MetaWeblog 专用（博客园等）

**唯一入口**：`MetaweblogBlogApiAdaptor.metaweblogCall` → `proxyXmlrpc`

**受影响平台（全部走同一入口，无单独博客园分支）**：

- 博客园 `CnblogsApiAdaptor`
- WordPress / WordPress.com（.com 另 `forceProxy=true`）
- Typecho、Jvue、通用 Metaweblog

**不受影响**（不经 `proxyXmlrpc`）：

- 语雀、Halo、Notion、Confluence、Telegraph、各 Web 适配器

---

## 已确认事实

### A. 原崩溃 `indexOf`

- 非字符串传入 `XmlrpcUtil.removeXmlHeader`
- 与 BlogAdaptor 无关

### B. 上游 `checkAuth`

- `zhi-blog-api@1.79.0` 已 `return await`

### C. `non-text response object`

- 插件内 middleware 可能把 XML 响应解析成 `{}`
- forwardProxy 包装字段可能是 `Body` / base64

### D. 手测

- 博客园验证通过（用户提供的 halo-picture-test 文档场景）

---

## 修改划分（收窄后）

| # | 位置 | 理由 | 影响面 |
|---|------|------|--------|
| 1 | `proxyXmlrpc` 内：思源宿主走 `siyuanProxyFetch` | middleware 对 XML-RPC 响应形态不兼容；forwardProxy 是思源官方 XML 代理路径 | **仅** MetaWeblog |
| 2 | `proxyXmlrpc` 内：`normalizeXmlrpcResponseText` | 仅在 XML-RPC 反序列化前把代理结果收成 XML 字符串 | **仅** MetaWeblog |
| 3 | `siyuanProxyFetch`：`status`/`Body` 字段兼容 | 错误分支读 body 更稳；**成功出口保持历史返回**（json→对象、xml→字符串、base64→整包 fetchResult） | 错误提示略好；**不改变**语雀等 JSON/base64 成功路径 |
| 4 | ~~`siyuanProxyFetch` 成功路径调用 normalize~~ | **已回退** — 会误伤 `responseEncoding=base64` 的 apiFetch | — |

---

## 风险与验证缺口（诚实）

- 单测只覆盖 `normalizeXmlrpcResponseText` 纯函数，**没有**各平台 E2E
- MetaWeblog 系平台应做「验证配置」冒烟；语雀/Halo 应确认图片上传/发布未回归
- 若要坚持「第一刀只修博客园」：只能加 `CnblogsApiAdaptor` 覆盖 `metaweblogCall` — **违反 DRY，且其它 MetaWeblog 平台仍有 `{}` 风险**，故采用 **proxyXmlrpc 单入口** 而非平台特例
