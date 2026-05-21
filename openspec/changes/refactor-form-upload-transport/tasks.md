## 0. 顶层设计确认

- [ ] 0.1 你确认：**V2 break change 可接受**，不为 V1 在主干留垫片/双轨
- [ ] 0.2 你确认：**方案 A+** = `publishTransport` 顶层 + `formUploadTransport` + XML 规则对齐（非仅 Form 补丁）

## 1. 顶层骨架（S1，可单独 PR，但必须删旧 import 路径）

- [ ] 1.1 新建 `src/utils/publishTransport/types.ts`：`PublishTransportContext`、`PublishTransportKind`（含 JSON 预留位）、`PublishTransportDiagnostic`
- [ ] 1.2 新建 `src/utils/publishTransport/publishTargetUtil.ts`：从 `xmlrpcResponseUtil` 抽出 `isLoopbackOrLocalTargetUrl` 等
- [ ] 1.3 新建 `src/utils/publishTransport/resolveRules.ts`：plugin-first、禁止 loopback forwardProxy 等共用函数
- [ ] 1.4 改 `xmlrpcTransport` / `xmlrpcResponseUtil` 引用顶层 util；单测绿；#21/#25 快速冒烟

## 2. Form 传输层（S2）

- [ ] 2.1 新建 `src/utils/formUploadTransport.ts`：`resolveFormUploadTransport`、`executeFormUpload`、三通道 handler 类型
- [ ] 2.2 `formUploadTransport.spec.ts`：`forceProxy` 不能压过 plugin-first；loopback 禁 forwardProxy；handler mock
- [ ] 2.3 日志：`[form-upload-transport] transport => …`

## 3. 基类切换并删债（S3–S4，同一变更内不得留死分支）

- [ ] 3.1 `BaseBlogApi.apiFormFetch` → 仅 `executeFormUpload`；**删除**内部 transport if 块
- [ ] 3.2 `BaseWebApi.webFormFetch` → 仅 `executeFormUpload`；**删除**内部 transport if 块；保留 `WebFormFetchOptions` 诊断
- [ ] 3.3 `useProxy`：Form 路由决策迁出；仅保留 handler 实现
- [ ] 3.4 grep 确认 adaptor 无新增 `forwardProxy`+`FormData` 组合逻辑

## 4. 重命名清零（S5，break，禁止 re-export）

- [ ] 4.1 `FormDataUtils.ts` → `FormDataHostUtil.ts`；全库改 import
- [ ] 4.2 删除 `FormDataUtils` 文件及任何 `export … from './FormDataUtils'` 垫片
- [ ] 4.3 更新 `FormDataHostUtil.spec.ts`（原 FormDataUtils 测试）

## 5. V2 验收（S6）

- [ ] 5.1 `pnpm test` + `pnpm build:v2`
- [ ] 5.2 复验 checklist **#27 语雀网页版** T1 Img；日志含 `form-upload-transport => plugin-node-fetch`
- [ ] 5.3 复验 **#28 Haloweb** Img（若待测）
- [ ] 5.4 架构自检：无 `FormDataUtils.resolve*`、基类无 transport 分支、无 deprecated 导出

## 6. 文档与 OpenSpec

- [ ] 6.1 更新 `AGENTS.md`：发布传输顶层、`FormDataHostUtil`、V2 break 策略
- [ ] 6.2 `openspec validate refactor-form-upload-transport --strict`
- [ ] 6.3 `platform-checklist.md` 备注：Img 行在 S4 后复验

## 7. 收尾

- [ ] 7.1 你确认 V2 带图平台无回归后 archive 本 change
- [ ] 7.2 （后续独立 change）`jsonFetchTransport` 迁入 `publishTransport`，禁止 `useProxy` 第四套 if 树
