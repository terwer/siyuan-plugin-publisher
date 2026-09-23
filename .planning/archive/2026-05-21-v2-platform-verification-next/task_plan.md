# V2 全平台验证 — 下一轮手测

> SSOT：[platform-checklist.md](../../openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md)

## 当前

- T1 全链路 ✅：`#1` `#21` `#27`（3/29）

## 本轮目标（已选定）

**#25 Wordpress** `wordpress_Wordpress` — 本地可启动，用户确认选 A

| 点 | 说明 |
|----|------|
| 适配器 | `WordpressApiAdaptor` → `MetaweblogBlogApiAdaptor` → **`proxyXmlrpc`**（与 #21 同通道） |
| 传输原则 | **Electron**：`proxyXmlrpc` 禁止 forwardProxy，node-fetch 直连（公网+本地） |

## 本地 WP 配置要点

1. 站点地址：如 `http://127.0.0.1:8080`（插件会自动拼 `/xmlrpc.php`）
2. 账号：WP 用户名 + **应用程序密码**（推荐，WP 5.6+）或常规密码（视站点安全插件而定）
3. 确认 **XML-RPC 已启用**（部分安全插件会关；禁用则验证必失败）
4. 图床：按平台配置选 Bundled / 其它（勿把 `None` 当未配置）

## 手测五列（与 #21 相同）

1. `pnpm dev:v2` + `pnpm makeLink:v2`
2. V2 添加 **Wordpress** 账号 → 验证/保存（**V2C**）
3. 快速发布：Pub → Upd → Del
4. 一篇带图笔记（**Img**）
5. 回写 checklist **#25** 五列

## 阶段

- [x] 阶段 1：选定 **#25** 本地 WordPress
- [ ] 阶段 2：T1 五列手测
- [ ] 阶段 3：更新 OpenSpec checklist + tasks.md（1.6）
