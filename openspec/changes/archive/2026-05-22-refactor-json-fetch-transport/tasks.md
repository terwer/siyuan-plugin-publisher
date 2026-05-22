## 0. 设计确认

- [x] 0.1 确认 JSON/API 请求统一入口命名与调用形态，目标是使用层只有一个简洁通用用法
- [x] 0.2 明确迁移边界：本 change 只处理 JSON/API fetch，不触碰已归档的 multipart facade 语义

## 1. 顶层 JSON 传输骨架

- [x] 1.1 在 `publishTransport` 下新增 JSON 传输类型、请求/响应与诊断结构
- [x] 1.2 复用 `shouldUseSiyuanForwardProxy`、`isLoopbackOrLocalTargetUrl`、`PluginFetchUtil.canUsePluginFetch`
- [x] 1.3 建立 JSON transport resolver 单测：plugin-first、loopback/private 禁 forwardProxy、无插件 fallback

## 2. JSON facade

- [x] 2.1 实现 JSON 请求 facade 单入口，内部封装 resolve 与 execute
- [x] 2.2 基类仅委托 facade；不得在 `BaseWebApi` / `BaseBlogApi` 中拼装 transport handler
- [x] 2.3 添加 raw-source guard，禁止基类/适配器出现新增 resolver/handler 组合逻辑

## 3. 平台迁移与诊断

- [x] 3.1 优先迁移语雀网页版 JSON 请求，并确保诊断 transport 由 facade 写入真实值
- [x] 3.2 覆盖博客园/MetaWeblog 相关 JSON 辅助请求或配置验证链路的高频路径
- [x] 3.3 更新 V2 平台 checklist，记录每个平台迁移/复验状态

## 4. 验证

- [x] 4.1 `openspec validate refactor-json-fetch-transport --strict`
- [x] 4.2 定向 vitest 覆盖 JSON resolver、facade、基类 guard、语雀诊断
- [x] 4.3 `pnpm run build:v2`
- [x] 4.4 V2 宿主手验通过：用户确认语雀网页版 JSON 链路与博客园相关链路全部测试通过（2026-05-22）；允许归档
