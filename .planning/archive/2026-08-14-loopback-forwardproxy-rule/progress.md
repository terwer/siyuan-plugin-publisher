# 进度日志

## 会话：2026-08-14

### 阶段 1：需求与发现
- **状态：** complete
- **开始时间：** 20:20
- 执行的操作：
  - devtools 复现 Halo 网页版验证失败（浏览器 std 环境）
  - 读内核 3.7.3 源码确认 SSRFSafeDialer 仅 SafeMode 拒绝 loopback
  - 确认当前内核无 --safe-mode、isUseSiyuanProxy=true
  - 定位规则文件与三套单测、OpenSpec spec
  - 用户确认修改方案
- 创建/修改的文件：
  - `.planning/2026-08-14-loopback-forwardproxy-rule/task_plan.md`
  - `.planning/2026-08-14-loopback-forwardproxy-rule/findings.md`

### 阶段 2：规划与结构
- **状态：** complete
- 执行的操作：
  - 确定改动点：resolveRules.ts / resolveTransport.ts / 三套单测 / OpenSpec spec
  - 记录安全边界：内核 SSRFSafeDialer 兜底
- 创建/修改的文件：
  - `.planning/2026-08-14-loopback-forwardproxy-rule/task_plan.md`（已做决策表）

### 阶段 3：实现
- **状态：** complete
- 执行的操作：
  - resolveRules.ts：`shouldUseSiyuanForwardProxy` 移除 loopback 绝对禁止，改为 `canUsePluginFetch=false && (isUseSiyuanProxy || forceProxy)` 即允许
  - resolveTransport.ts：删除 loopback 无条件 middleware 短路，改由 shouldUseSiyuanForwardProxy 统一判定
  - xmlrpcTransport.ts：注释同步（逻辑已委托 resolveRules）
  - 单测：xmlrpcTransport.spec / formUploadClient.spec / jsonFetchClient.spec 更新 loopback 断言（有代理→forwardProxy，无代理→middleware）
  - OpenSpec：json-fetch-transport / form-upload-transport / publish-transport-framework 三处 spec 更新
  - AGENTS.md：发布传输规则描述同步
- 创建/修改的文件：
  - `src/utils/publishTransport/resolveRules.ts`
  - `src/utils/publishTransport/resolveTransport.ts`
  - `src/utils/xmlrpcTransport.ts`
  - `src/utils/xmlrpcTransport.spec.ts`
  - `src/utils/formUploadClient.spec.ts`
  - `src/utils/jsonFetchClient.spec.ts`
  - `openspec/specs/json-fetch-transport/spec.md`
  - `openspec/specs/form-upload-transport/spec.md`
  - `openspec/specs/publish-transport-framework/spec.md`
  - `AGENTS.md`

### 阶段 4：测试与验证
- **状态：** complete
- 执行的操作：
  - 传输相关单测 33 个通过；全量 utils+base 单测 64 个通过
  - `pnpm build:v2` 通过（vue-tsc + vite，7.49s）
  - 刷新思源页面加载新构建
  - **Halo 网页版 #28 五格全链路验证通过（devtools，浏览器 std 环境）**：
    - V2C：配置页填入 localhost:8090 + SESSION cookie → 验证请求走 `/api/network/forwardProxy`（而非 middleware-fetch），返回 Halo 分类数据（200），账号状态"需授权"→"运行中"
    - Pub：发布成功，Halo 服务端 `phase: PUBLISHED`，permalink `/archives/hangtestdoc-1rrgnb`
    - Upd：更新成功（"已在「Halo网页版」更新文章"）
    - Del：删除成功（"已取消在「Halo网页版」的发布"）
    - Img：带图发布成功，图片上传至 Halo（`http://localhost:8090/upload/rId20-...-WLwc.png`），multipart 走 forwardProxy
  - 证据：reqid=121/171/172 均为 `/api/network/forwardProxy` [200]

## 测试结果
| 测试 | 输入 | 预期结果 | 实际结果 | 状态 |
|------|------|---------|---------|------|
| xmlrpcTransport.spec | loopback + isUseSiyuanProxy/forceProxy | siyuan-forward-proxy | siyuan-forward-proxy | ✅ |
| xmlrpcTransport.spec | loopback 无代理条件 | middleware-fetch | middleware-fetch | ✅ |
| formUploadClient.spec | loopback + proxy flags | siyuan-forward-proxy | siyuan-forward-proxy | ✅ |
| formUploadClient.spec | loopback 无代理条件 | middleware-fetch | middleware-fetch | ✅ |
| jsonFetchClient.spec | loopback + forceProxy + isUseSiyuanProxy | siyuan-forward-proxy | siyuan-forward-proxy | ✅ |
| jsonFetchClient.spec | loopback 无代理条件 | middleware-fetch | middleware-fetch | ✅ |
| 全量 utils+base | 64 tests | 全绿 | 64 passed | ✅ |
| build:v2 | - | 通过 | vue-tsc + vite 7.49s ✅ | ✅ |
| V2C 手验 | localhost:8090 + cookie 验证 | siyuan-forward-proxy + 授权 | forwardProxy 200 + 账号"运行中" | ✅ |
| Pub 手验 | 发布 hang-test-doc | 发布成功 | PUBLISHED + permalink | ✅ |
| Upd 手验 | 更新文章 | 更新成功 | 更新成功 | ✅ |
| Del 手验 | 删除文章 | 删除成功 | 删除成功 | ✅ |
| Img 手验 | 带图发布 | 图片上传 + 发布 | uploads 替换 + 发布成功 | ✅ |

## 错误日志
| 时间戳 | 错误 | 尝试次数 | 解决方案 |
|--------|------|---------|---------|
| - | - | - | - |

## 五问重启检查
| 问题 | 答案 |
|------|------|
| 我在哪里？ | 阶段 5 交付 |
| 我要去哪里？ | 回写 checklist（已完成）、归档规划 |
| 目标是什么？ | loopback 目标在有代理条件时走 siyuan-forward-proxy |
| 我学到了什么？ | 内核默认模式 forwardProxy 允许本机访问；middleware-fetch 远端代理无法访问 localhost |
| 我做了什么？ | 改规则、更新单测与 spec、构建、Halo 全链路手验通过、回写 checklist |

---
*每个阶段完成后或遇到错误时更新此文件*
