# Progress: CSDN / 知乎图片回归调查

## 2026-05-24

- 已建立新的调查计划：`2026-05-24-csdn-zhihu-image-regression-investigation`。
- 已将 `.planning/.active_plan` 切换到本计划。
- 已明确评判基线：`main` 作为未重构对照，当前分支为 `feature/ui-2.0`。
- 已把知乎 DevTools 取证页纳入计划范围。
- 暂未修改任何代码，等待进一步取证。

- 已根据用户澄清修正调查基线：对照目标是 eval 修复前的可用版本，而不是把当前 `main` 误作现状基线。
- 下一步改为检查 `feature/ui-2.0` 中图片与 crypto 相关重构点，优先查 `baseExtendApi`、`baseWebApi`、`cryptoUtils`、CSDN / 知乎适配器。

### 阶段 1 完成 — Diff 分析

- 完成 `origin/main...HEAD` 的图片管线相关 diff 分析，涉及 20+ 文件。
- 识别出 5 个变更点，按风险排序：
  1. **P0 知乎 MD5**：`CryptoJS.MD5(buffer.toString("utf8"))` → `SparkMD5.ArrayBuffer.hash(bytes)`，哈希值必然不同
  2. **P1 CSDN 签名**：CryptoJS → Web Crypto API，需单测验证等价性
  3. **P2 传输层**：formUploadClient 重构，思源桌面端行为应一致
  4. 图片替换正则改进（低风险）
  5. 错误处理改进（无风险）
- 下一步：验证 P0（写一个对比测试）和 P1（运行 csdnUtils.spec.ts）

### 审计记录 — Claude 修复初审

- 当前实际代码 diff 只有一处：`src/adaptors/web/zhihu/zhihuWebAdaptor.ts` 的 `zhihuFormFetch()` 新增 `Content-Type: application/json`。
- 已运行聚焦测试：`pnpm exec vitest run src/utils/cryptoUtils.spec.ts src/adaptors/web/csdn/csdnUtils.spec.ts src/utils/formUploadClient.spec.ts src/utils/jsonFetchClient.spec.ts`，结果 4 files / 29 tests 全部通过。
- 初审结论：这一行对“知乎创建图片记录 POST /images 传 JSON 字符串时 plugin-node-fetch 未自动补 JSON Content-Type”的怀疑是合理的，但它是平台内局部修补，不是最理想的结构性修复。
- 设计风险：`zhihuFormFetch()` 实际发送的是 JSON body，却仍通过 `webFormFetch()` / `formUploadClient`（multipart facade）走链路；按当前项目传输原则，JSON/API 更应走 `webFetch()` / `jsonFetchClient`。
- CSDN 未被本次改动覆盖；若 CSDN 实测仍坏图，需要继续从签名请求、OBS multipart 响应解析、以及图片上传失败被 success_with_warnings 吞掉后继续发布三个方向查。

### 日志目录复核

- 已读取 `logs/zhihu.log` 与 `logs/zhihu.request`。
- 关键证据：图片预处理阶段跳过，发布 body 保留本地 `assets/...png`，且配置中 `custom_Zhihu` / `custom_Csdn-iqo7y` 的 `picbedService` 为 `none`。
- 结论更新：本轮不需要继续向用户索要知乎上传返回值；请求根本没打到知乎图片上传接口。

### 修复默认图床选择

- 已修改 `src/adaptors/web/zhihu/zhihuConfig.ts`：构造函数默认 `picgoPicbedSupported=false`、`bundledPicbedSupported=true`、`picbedService=bundled`。
- 已修改 `src/adaptors/web/csdn/csdnConfig.ts`：构造函数默认 `picgoPicbedSupported=false`、`bundledPicbedSupported=true`、`picbedService=bundled`。
- 已新增 `src/adaptors/web/webPicbedDefaults.spec.ts`，覆盖：知乎新建默认 bundled、CSDN 新建默认 bundled、显式存储 none 不被覆盖。
- 已运行聚焦测试：`pnpm exec vitest run src/adaptors/web/webPicbedDefaults.spec.ts src/utils/cryptoUtils.spec.ts src/adaptors/web/csdn/csdnUtils.spec.ts src/utils/formUploadClient.spec.ts src/utils/jsonFetchClient.spec.ts`，结果 5 files / 32 tests passed。

### 2026-05-24 更新 — CSDN 实测通过，知乎进入 OSS SDK 加载修复

- 用户反馈 CSDN 图片实测通过；CSDN 本轮不再作为阻塞项。
- 知乎默认图床修复后已经进入平台图床上传链路，但失败点变为 `ReferenceError: OSS is not defined`。
- 代码证据：`src/vendors/alioss/s3oss.ts` 直接 `new OSS(...)`，依赖全局 OSS；V2 产物存在 `dist-v2/libs/alioss/aliyun-oss-sdk-6.16.0.min.js`，但当前没有显式加载。
- 下一步：在 OSS vendor 层实现显式 SDK 解析/加载，不在知乎适配器里继续堆临时补丁。

### OSS SDK 加载修复已实施并验证

- 修改 `src/vendors/alioss/s3oss.ts`：不再裸用全局 `OSS`，改为在 vendor 层统一解析 OSS 构造器：
  1. 已存在的 `globalThis/window.OSS`；
  2. V2 插件宿主 `win.require(<moduleBase>/libs/alioss/aliyun-oss-sdk-6.16.0.min.js)`；
  3. 浏览器环境动态插入 `/plugins/siyuan-plugin-publisher/libs/alioss/aliyun-oss-sdk-6.16.0.min.js`。
- 修改 `src/adaptors/web/zhihu/zhihuWebAdaptor.ts`：`await getAliOssClient(..., { appInstance: this.appInstance })`，只传宿主上下文，不把 SDK 加载细节散到知乎适配器。
- 新增 `src/vendors/alioss/s3oss.spec.ts`，覆盖已有全局 OSS、插件 require 加载、script 注入加载、无加载环境明确报错。
- 验证通过：
  - `pnpm exec vitest run src/vendors/alioss/s3oss.spec.ts src/adaptors/web/webPicbedDefaults.spec.ts src/utils/cryptoUtils.spec.ts src/adaptors/web/csdn/csdnUtils.spec.ts src/utils/formUploadClient.spec.ts src/utils/jsonFetchClient.spec.ts` → 6 files / 36 tests passed。
  - `pnpm exec vue-tsc --noEmit` → passed。
  - `pnpm build:v2` → passed。

### OSS SDK 加载修复复测

- 追加稳健性调整：插件 `require` 加载失败时允许降级到浏览器 script 注入；script 注入前移除同标记旧脚本，避免复用已经完成但未产生 `OSS` 的旧节点导致 Promise 悬挂。
- 复测通过：
  - `pnpm exec vitest run src/vendors/alioss/s3oss.spec.ts src/adaptors/web/webPicbedDefaults.spec.ts src/utils/cryptoUtils.spec.ts src/adaptors/web/csdn/csdnUtils.spec.ts src/utils/formUploadClient.spec.ts src/utils/jsonFetchClient.spec.ts` → 6 files / 36 tests passed。
  - `pnpm exec vue-tsc --noEmit` → passed。
  - `pnpm build:v2` → passed。
- 已更新 `task_plan.md`：阶段 2-5 标记完成，当前等待用户用 V2 宿主手验知乎图片发布。

### 2026-05-24 手验闭环

- 用户反馈：CSDN 测试通过。
- 用户反馈：知乎测试通过。
- 至此本轮 CSDN / 知乎图片回归已从实际宿主手验闭环：
  - 默认平台图床配置修复有效。
  - 知乎 OSS SDK 显式加载修复有效，不再触发 `ReferenceError: OSS is not defined`。
