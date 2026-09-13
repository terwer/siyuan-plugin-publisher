## 0. 顶层设计确认

- [x] 0.1 你确认：**V2 break change 可接受**，不为 V1 在主干留垫片/双轨
- [x] 0.2 你确认：**方案 A+** = `publishTransport` 顶层 + `formUploadClient` facade + XML 规则对齐

## 1. 顶层骨架（S1，可单独 PR，但必须删旧 import 路径）

- [x] 1.1 新建 `src/utils/publishTransport/types.ts`：`PublishTransportContext`、`PublishTransportKind`（含 JSON 预留位）、`PublishTransportDiagnostic`
- [x] 1.2 新建 `src/utils/publishTransport/publishTargetUtil.ts`：从 `xmlrpcResponseUtil` 抽出 `isLoopbackOrLocalTargetUrl` 等
- [x] 1.3 新建 `src/utils/publishTransport/resolveRules.ts`：plugin-first、禁止 loopback forwardProxy 等共用函数
- [x] 1.4 改 `xmlrpcTransport` / `xmlrpcResponseUtil` 引用顶层 util；单测绿；#21/#25 快速冒烟

## 2. Form 传输 facade（S2）

- [x] 2.1 `formUploadClient.ts`：`createFormUploadClient().postJson()` 单入口；内部 resolve/execute
- [x] 2.2 `formUploadClient.spec.ts`：plugin-first、loopback→middleware、懒加载 `getFormDataFetch`
- [x] 2.3 通道统一为 `middleware-fetch`（与 XML-RPC 一致）；删除 `useCorsMiddlewarePath`
- [x] 2.4 日志：`[form-upload-transport] transport => …`

## 3. 基类仅调 facade（S3–S4）

- [x] 3.1 `BaseBlogApi.apiFormFetch` → 仅 `formUploadClient.postJson`
- [x] 3.2 `BaseWebApi.webFormFetch` → 仅 `formUploadClient.postJson`；诊断经 options 传入
- [x] 3.3 `baseFormUploadFacade.spec.ts`：基类不拼装 handler/resolve
- [x] 3.4 grep 确认 adaptor 无新增 `forwardProxy`+`FormData` 组合逻辑

## 4. 重命名清零（S5，break，禁止 re-export）

- [x] 4.1 `FormDataUtils.ts` → `FormDataHostUtil.ts`；全库改 import
- [x] 4.2 删除 `FormDataUtils` 文件及任何 `export … from './FormDataUtils'` 垫片
- [x] 4.3 更新 `FormDataHostUtil.spec.ts`（原 FormDataUtils 测试）

## 5. V2 验收（S6）

- [x] 5.1 自动化验证（2026-05-21）：
  `pnpm exec vitest run src/utils/formUploadClient.spec.ts src/utils/FormDataHostUtil.spec.ts src/utils/xmlrpcTransport.spec.ts src/utils/xmlrpcResponseUtil.spec.ts src/utils/viteV2AppBase.spec.ts src/adaptors/base/baseFormUploadFacade.spec.ts src/adaptors/web/yuqueweb/YuquewebWebAdaptor.spec.ts` → **45 tests passed**；
  `pnpm run build:v2` → **passed**；
  `openspec validate refactor-form-upload-transport --strict` → **passed**
- [x] 5.2 复验 checklist **#27 语雀网页版** T1 Img：用户于 2026-05-22 V2 宿主手验通过，带图发布通过；归档不再阻塞
- [x] 5.3 复验 **#28 Haloweb** Img：本次按用户确认暂不测试（Halo 尚未进入远征），继续由 `v2-platform-verification-v1-retirement` #28 后续跟踪；不作为本 change 归档阻塞
- [x] 5.4 架构自检：无 `FormDataUtils.resolve*`、基类无 transport 分支、无 deprecated 导出

## 6. 文档与 OpenSpec

- [x] 6.1 更新 `AGENTS.md`：发布传输顶层、`FormDataHostUtil`、V2 break 策略
- [x] 6.2 `openspec validate refactor-form-upload-transport --strict`
- [x] 6.3 `platform-checklist.md` 备注：Img 行在 S4 后复验

## 7. 收尾

- [x] 7.1 用户确认：#27 语雀网页版带图通过、博客园带图文章通过；允许归档本 change
- [x] 7.2 已新建后续独立 change：`refactor-json-fetch-transport`，跟踪 `jsonFetchTransport` 迁入 `publishTransport`，禁止 `useProxy` 第四套 if 树
