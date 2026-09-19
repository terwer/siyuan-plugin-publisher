# 发现与决策

## 需求
- 本地启动的 Halo（localhost:8090）在思源环境验证时应走 `siyuan-forward-proxy`，而非强制 `middleware-fetch`（远端 CORS 代理访问不了本机服务）。

## 研究发现

### 1. 思源内核 3.7.3 forwardProxy 对 loopback 的约束（源码证据）
- 端点：`kernel/api/network.go` `forwardProxy()` → `getSafeClient()` → `util.SSRFSafeDialer()`
- `kernel/util/net.go` `SSRFSafeDialer` Control 钩子：
  ```go
  if ip := net.ParseIP(host); ip != nil && isPrivateIP(ip) {
      // 记录警告
      if SafeMode {
          return fmt.Errorf("ip address [%s] is prohibited", host)
      }
  }
  return nil
  ```
- **结论：loopback/私网仅在 `SafeMode`（`--safe-mode` 启动）时被内核拒绝；默认模式放行。**
- 当前内核进程：`SiYuan-Kernel.exe serve --port 56907 ...`（无 `--safe-mode`）→ forwardProxy 可访问 localhost。

### 2. 当前环境 isUseSiyuanProxy 判定
- `useSiyuanApi.ts`：`isUseSiyuanProxy = isStorageViaSiyuanApi() && !isInSiyuanOrSiyuanNewWin()`
- 浏览器访问思源（std 容器，非思源主窗口）→ `isInSiyuanOrSiyuanNewWin()=false`；`VITE_DEFAULT_TYPE=siyuan` → `isStorageViaSiyuanApi()=true`
- **当前浏览器环境 isUseSiyuanProxy = true**，但规则将 loopback 无条件短路到 middleware-fetch。

### 3. 插件规则现状（三处）
| 文件 | 现状 |
|------|------|
| `src/utils/publishTransport/resolveTransport.ts` | `if (isLoopbackOrLocalTargetUrl(url)) return "middleware-fetch"`（无条件短路） |
| `src/utils/publishTransport/resolveRules.ts` | `shouldUseSiyuanForwardProxy` 中 loopback → false（绝对禁止） |
| `src/utils/xmlrpcTransport.ts` | 委托 resolveRules（loopback → middleware） |

### 4. 失败现象（已复现）
- 日志：`[json-fetch-transport] transport => middleware-fetch` + `corsFetch header Cookie is not allowed`
- 根因：middleware-fetch 是远端共享 CORS 代理（`https://api.terwer.space/api/middleware`），无法访问用户本机 localhost:8090 → `Cannot convert undefined or null to object`

### 5. SSRF 安全边界
- 内核侧已有 `SSRFSafeDialer` 兜底：`--safe-mode` 时拒绝 loopback/私网，错误正常返回（HTTP 层可见）
- 插件侧不再需要重复硬禁止 loopback → forwardProxy

## 技术决策
| 决策 | 理由 |
|------|------|
| `shouldUseSiyuanForwardProxy`：移除 loopback 绝对禁止，改为 `canUsePluginFetch=false && (isUseSiyuanProxy || forceProxy)` 即允许 | 内核默认模式支持本机访问；forwardProxy 请求先到内核再转发，本机可达 |
| `resolveTransport`：loopback 分支改为「无代理条件才 middleware；有代理条件继续判断 forwardProxy」 | 保持无代理环境回退；有代理时走正确通道 |
| `plugin-node-fetch` 优先级不变 | 插件直传仍最优 |
| 保留 `isLoopbackOrLocalTargetUrl` 工具 | 无代理回退判断仍需要 |

## 遇到的问题
| 问题 | 解决方案 |
|------|---------|
| middleware-fetch 远端代理无法访问 localhost | 改走 siyuan-forward-proxy（本机内核转发） |

## 资源
- 思源内核源码：`D:\Users\Administrator\Documents\myproject\my-note\kernel\util\net.go`（SSRFSafeDialer）、`kernel\api\network.go`（forwardProxy）
- 插件规则：`src/utils/publishTransport/{resolveTransport,resolveRules,publishTargetUtil}.ts`、`src/utils/xmlrpcTransport.ts`
- 单测：`src/utils/{xmlrpcTransport,formUploadClient,jsonFetchClient}.spec.ts`
- OpenSpec：`openspec/specs/{publish-transport-framework,form-upload-transport,json-fetch-transport}/spec.md`

## 视觉/浏览器发现
- Halo 配置页（localhost:8090）：填入 `http://localhost:8090/` + `SESSION` cookie 后验证，日志显示 middleware-fetch，错误 `Cannot convert undefined or null to object`，无崩溃
- Halo 登录用 `SESSION` cookie（httpOnly，`document.cookie` 不可见），CDP 请求头可读到

---
*每执行2次查看/浏览器/搜索操作后更新此文件*
*防止视觉信息丢失*
