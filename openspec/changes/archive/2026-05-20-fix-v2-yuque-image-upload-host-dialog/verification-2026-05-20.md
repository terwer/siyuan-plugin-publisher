# 取证与修复记录（2026-05-20）

## 根因

语雀 `webFormFetch(..., forceProxy=true)` 把 **JSON 请求的代理策略** 误用到 **multipart 表单上传**：

- 旧条件：`!isInSiyuanOrSiyuanNewWin() || forceProxy` → 走 `forwardProxy`
- V2 插件虽有 `win.require`（应走 `zhi-formdata-fetch` / node-fetch 直传），仍被 `forceProxy=true` 压到 `forwardProxy`
- `forwardProxy` 对 FormData 做 base64 二次编码，易出现 400（如 `Problems parsing JSON`）

## 方案（第二版，已采纳）

**不修改 `useProxy`**。在 `FormDataUtils.resolveFormUploadTransport` 集中定义规则：

1. 插件宿主（`win.require`）→ 始终 `plugin-node-fetch`，**不受 `forceProxy` 影响**
2. 非思源或需代理回退 → `siyuan-forward-proxy`
3. `baseWebApi.webFormFetch` 按 transport 分派到三个私有方法

`forceProxy` 继续只约束 JSON `webFetch`；表单上传策略与代理层解耦。

## 验收

- 用户复测通过：https://www.yuque.com/terwer/public/v20-test-only-zebdlv
- 诊断 transport 应为 `zhi-formdata-fetch`
