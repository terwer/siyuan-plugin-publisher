# 让 WordPress.com 的 XML-RPC 继续可用（Chromium 栈传输通道）

## 背景

WordPress.com 的站点域（含 `xmlrpc.php`）对**非浏览器客户端**的请求返回 **403**（平台侧机器人防护，响应体是一个需要执行脚本才能通过的校验页）。

同一代理、同一出口 IP 下，浏览器对**同一端点**请求返回 **200** 且 XML-RPC 正常应答。补齐浏览器请求头、改用官方客户端 UA、带与不带认证，**四种组合全部 403** —— 因此这与认证方式、请求头无关，**问题出在传输通道**。

插件当前的 XML-RPC 走 `plugin-node-fetch`（Node 的 fetch），正是被拦的那一类。

## 已验证的结论

改用 **Electron 的 `session.fetch`（Chromium 网络栈）** 即可通过，且：

1. **无需用户登录**、无需人工点选 —— 只要该 session **先访问过一次站点**，校验页会自动跑完；
2. 通行状态是 **session 级**的：关掉窗口后复测仍为 200，且**不依赖会话 cookie**；
3. 读、写、删全通：`wp.getUsersBlogs` 200、`wp.newPost` 200（返回新 id）、`wp.getPosts` 读回可见、`wp.deletePost` 200（`<boolean>1</boolean>`）。

**因此 xmlrpc 予以保留，不废弃。**

## 目标

为 WordPress.com 增加一条「Chromium 栈」传输通道，使该平台的 XML-RPC 恢复可用，且：

- **不影响其他平台**：其余平台继续走既有通道（`plugin-node-fetch` / `siyuan-forward-proxy` / `middleware-fetch`）；
- **不削弱现有行为**：通道选择仍由 `publishTransport` 规则统一决定，平台适配器不直接依赖具体实现；
- **对用户透明**：预热过程无需用户操作，配置页给出可见状态即可。

## 方案要点

1. **新增传输通道**：在 `publishTransport` 的通道枚举中加入 `electron-session-fetch`，实现放在既有 facade 内（与 `formUploadClient` / `jsonFetchClient` / `xmlrpcTransport` 同一层），不新增对外入口。
2. **平台声明**：`WordpressdotcomConfig` 声明需要使用该通道（类似 `isCorsProxy` 的声明式做法），由 `resolveXmlrpcTransport` 置顶优先。
3. **站点预热**：新增「确保 session 已通过站点校验」的动作，在发布前或用户点「去授权」时执行；实现为访问一次站点根地址，等待校验页跑完。
4. **可用性判定与降级**：非 Electron 宿主（浏览器形态）不具备 `session.fetch`，此时回退既有通道并在诊断中说明，不硬失败。
5. **帮助与文档**：`wordpress-wordpressdotcom` 的 help 配置补充该机制的说明（中性表述，只讲用户可见行为），`docs/draft/platforms/` 同步。

## 非目标

- 不引入 OAuth2 + REST API 适配器（REST 虽无此拦截，但只认 OAuth2，仅作备选，不在本次范围）。
- 不改动 XML-RPC 的认证方式（凭据仍作为方法参数传递）。
- 不模拟或绕开平台的校验机制；本方案复用宿主既有网络栈与 session，与浏览器访问等价。

## 验收

- WordPress.com 六格（V2C / Pub / Upd / Del / Img / 查看）在宿主中全部通过，结果按 SOP 写回 `platform-checklist.md` 的 #26。
- 其余平台的既有传输通道行为不变，`resolveTransport` / `xmlrpcTransport` 相关单测保持绿色并补充新通道的用例。
- 帮助引导（字段指引 / HelpPanel / TourGuide）在该站按 SOP §3 校验通过。
