# 任务计划：放开 loopback 目标对 siyuan-forward-proxy 的禁止

## 目标
修改发布传输解析规则：目标为 loopback/私网地址时，若思源 forwardProxy 可用（`isUseSiyuanProxy || forceProxy`），走 `siyuan-forward-proxy` 而非强制 `middleware-fetch`；仅无代理条件时才回退 middleware。同步更新三条通道共用规则、单测与 OpenSpec spec。

## 当前阶段
阶段 2

## 各阶段

### 阶段 1：需求与发现
- [x] 复现 Halo 网页版验证失败（浏览器 std 环境，localhost:8090 走 middleware-fetch 失败）
- [x] 读思源内核 3.7.3 源码 `kernel/util/net.go`：`SSRFSafeDialer` 仅在 `SafeMode` 时拒绝 loopback/私网，默认模式放行
- [x] 确认当前内核进程无 `--safe-mode` 参数 → forwardProxy 可访问 localhost:8090
- [x] 确认当前浏览器环境 `isUseSiyuanProxy = true`（`isStorageViaSiyuanApi && !isInSiyuanOrSiyuanNewWin`）
- [x] 定位规则所在：`resolveTransport.ts` / `resolveRules.ts` / `xmlrpcTransport.ts` + 三套单测 + OpenSpec spec
- [x] 用户确认修改方案
- **状态：** complete

### 阶段 2：规划与结构
- [x] 确定改动点与安全边界（内核 SSRF 防护兜底，插件不再重复硬禁止）
- [x] 记录决策及理由到 findings.md
- **状态：** complete

### 阶段 3：实现
- [ ] 改 `resolveRules.ts`：`shouldUseSiyuanForwardProxy` 允许 loopback 走 forwardProxy
- [ ] 改 `resolveTransport.ts`：loopback 分支按代理条件分流
- [ ] 更新单测：`xmlrpcTransport.spec.ts` / `formUploadClient.spec.ts` / `jsonFetchClient.spec.ts`
- [ ] 更新 OpenSpec spec：`publish-transport-framework` / `form-upload-transport` / `json-fetch-transport`
- **状态：** pending

### 阶段 4：测试与验证
- [ ] 运行单测（publishTransport 相关 spec 全绿）
- [ ] `pnpm build:v2` 构建通过
- [ ] 浏览器 std 环境复验：Halo 网页版验证应改走 `siyuan-forward-proxy` 并成功
- **状态：** pending

### 阶段 5：交付
- [ ] 检查所有改动文件与 diff
- [ ] 回写 checklist SSOT（#28 备注：transport 规则修正说明）
- [ ] 交付给用户
- **状态：** pending

## 关键问题
1. ~~loopback 禁 forwardProxy 是否仍必要？~~ → 否：内核 3.7.3 默认模式允许，SSRF 由内核 `SSRFSafeDialer` 兜底（SafeMode 拒绝，错误正常返回）
2. loopback 走 forwardProxy 后，`isInSiyuanOrSiyuanNewWin` 分支是否受影响？ → 是：思源窗口内无插件 fetch 时也允许 forwardProxy（此前 loopback 强制 middleware）

## 已做决策
| 决策 | 理由 |
|------|------|
| loopback/私网目标在 `isUseSiyuanProxy || forceProxy` 时允许 `siyuan-forward-proxy` | 内核默认模式（非 SafeMode）forwardProxy 可访问本机服务；middleware-fetch 远端代理无法访问 localhost |
| 无代理条件时 loopback 仍回退 `middleware-fetch` | 保持无代理环境的可用回退路径 |
| `canUsePluginFetch` 优先级不变（plugin-node-fetch 第一） | 插件直传仍是最优路径 |
| 不删除 `isLoopbackOrLocalTargetUrl` 工具，仅调整其使用位置 | 保留目标分类能力，供无代理回退判断 |

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
| 无 | 0 | - |

## 备注
- 改动涉及 XML-RPC / multipart / JSON 三通道，规则在共用层落地（AGENTS.md：全局触发）
- 归档前须 V2 宿主手验：本地 Halo（localhost:8090）在思源窗口内 + 浏览器环境两处验证
