# 掘金原生图片上传探测（独立探索）

> 目标：找到掘金(Juejin)文章/图片原生上传接口及其加密/签名机制，通过最小化 API 探测成功上传一张真实图片，产出可复现请求（headers/参数/加密算法）。暂不接入发布链路；成功后评估是否接入 siyuan-plugin-publisher V2。
> 背景：V2 验证 掘金 Img 格。用户确认掘金**具备原生图片上传能力**（此前「无原生上传、需图床」结论有误），掘金有较多加密/签名手段，须持续钻研直至原生上传探测成功。

## 阶段

- [ ] PHASE 1: 定位掘金图片上传接口（前端日志/JS 分析/web 调研）
- [ ] PHASE 2: 分析上传参数 + 加密/签名机制（headers、chunk 策略、x-* token、签名算法）
- [ ] PHASE 3: 最小化 API 探测（curl/requests）成功上传一张真实图片到掘金
- [ ] PHASE 4: 产出可复现请求（完整 headers/参数/算法），评估接入 V2 发布链路

## 关键约束 / 事实（learned）

- 掘金适配器无原生 `uploadFile`/`newMediaObject`；`picgoPicbedSupported=true`、`bundledPicbedSupported=false`。
- 已登录账号 cookie 在 `sy-p-plus-cfg.json` `custom_Juejin.password`；meta uid `3017510713830333`。
- 掘金 API 域：`api.juejin.cn`（已确认 `/content_api/v1/article_draft/create`、`/article/publish` 等可用）。
- 图片上传需绕开「网络为王」——node-fetch/curl 直接探测 `api.juejin.cn` 上传接口，观察响应与所要求的加密字段。

## 决策日志

- 用户明确：先最小化探测，不要立即接入发布链路；允许独立、可追踪的探索 plan。
