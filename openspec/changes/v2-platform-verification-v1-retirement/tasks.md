# Tasks: v2-platform-verification-v1-retirement

> 进度主表：**仅更新** [platform-checklist.md](./platform-checklist.md)

## 0. 治理（本提案）

- [x] 0.1 创建 OpenSpec 变更 `v2-platform-verification-v1-retirement`
- [x] 0.2 迁入 `platform-checklist.md` 为 SSOT
- [x] 0.3 删除 `.qoder/plans/全量平台测试Checklist_0578ad66.md`
- [x] 0.4 停用 `.planning/` 平行副本，改为指向本变更
- [x] 0.5 撰写 proposal / design / specs / tasks

## 1. T1 逐平台验证（29）

按 `platform-checklist.md` 顺序；每项失败则在本节下追加子任务或新开 `openspec new change fix-<platform>`。

- [x] 1.1 #1 语雀 API `common_Yuque`（需专业会员，已 ✅）
- [ ] 1.2 #2–#5 Common 其余（Notion、Halo、Telegraph、Confluence）
- [ ] 1.3 #6–#13 Github 八项
- [ ] 1.4 #14–#20 Gitlab 七项
- [ ] 1.5 #21–#24 Metaweblog 四项
  - [x] 1.5a #21 博客园 `metaweblog_Cnblogs` — T1 全链路 ✅（2026-05-21，用户手测）
  - [ ] 1.5b #22–#24 Typecho、Jvue、Metaweblog 通用
- [ ] 1.6 #25–#26 Wordpress 两项
  - [x] 1.6a #25 Wordpress `wordpress_Wordpress` — T1 全链路 ✅（2026-05-21，本地 WP，用户手测）
  - [ ] 1.6b #26 Wordpress.com
- [x] 1.7a #27 语雀网页版 `custom_Yuqueweb`（V2C/Pub/Upd/Del/Img 已验通过）
- [x] 1.7b #28 Halo网页版
  - [x] 1.7b.1 修复 Halo 网页版 V2C 配置页初始化失败：预置 `authUrl=/login` 不能在未配置站点时直接 `new URL()`；保留 Cookie 授权入口，未填 `home/apiUrl` 时点击登录/读取只提示先填站点地址，填入后由 Web Cookie 共用解析生成真实登录 URL
  - [x] 1.7b.2 2026-08-14 修 transport 规则：loopback/私网目标有代理条件时走 `siyuan-forward-proxy`（内核 3.7.3 默认允许本机访问，SSRF 由 `SSRFSafeDialer` 兜底）；单测 64 绿、build:v2 通过
  - [x] 1.7b.3 2026-08-14 本地 Docker Halo 2.20（localhost:8090）devtools 全链路手验：**V2C（forwardProxy 200 + 账号运行中）/ Pub / Upd / Del / Img 五格全部 ✅**
  - [x] 1.7c #30 知乎 `custom_Zhihu` — V2 Bridge 全链路 ✅（2026-05-24，用户手测：V2C/Pub/Upd/Del/Img）
  - [x] 1.7d #31 CSDN `custom_Csdn` — V2 Bridge 全链路 ✅（2026-05-24，用户手测：V2C/Pub/Upd/Del/Img）
  - [ ] 1.7e #32–#35 简书、掘金、微信公众号、哔哩哔哩 V2 Bridge 全链路
- [x] 1.8 #29 本地系统（Electron）— V2 全链路 ✅（2026-05-24，用户手测）

## 2. T2a / T2b / T3

- [x] 2.1 T2a #30–#35：已迁入 T1 V2 Bridge；V1 回退保留至 Gate D，不再要求 V2 Inv
- [ ] 2.2 T2b #36–#38：Vis/Add
- [ ] 2.3 T3 #39–#54：孤儿与 Fs 占位确认

## 3. Gate C — 标记 V1 废弃

- [ ] 3.1 Checklist Gate A 全部满足
- [ ] 3.2 README / 偏好：V1 已废弃，默认 V2
- [ ] 3.3 保留 `useV2UI=false` 回退说明

## 4. Gate D — 三版本后移除 iframe

- [ ] 4.1 记录 Gate C 生效版本号
- [ ] 4.2 第三个发行版后评估 `ui-v2-migration` 等价性
- [ ] 4.3 删除 iframe/SPA 路由与宿主（独立 PR）
- [ ] 4.4 归档本变更；合并 delta 至 `openspec/specs/`

## 修复 backlog（按需追加）

_验收中发现的问题在此登记，完成后勾选并回写 checklist。_

- [x] **#21 博客园 V2C**：MetaWeblog XML-RPC — `indexOf` / `non-text response`；`zhi-blog-api@1.79.0` + `proxyXmlrpc` 专用层（见 `.planning/2026-05-21-cnblogs-xmlrpc-response-text/`）
- [x] **#32 简书 Img/默认图床**：`JianshuConfig` 默认图床已设为 `PicbedServiceTypeEnum.Bundled`（新增账号默认选中“当前平台 推荐”，spec 已覆盖）；`uploadFile` 增加 qiniu 错误详情；完整 help 配置已补齐（fields/faq/tour 4 步）。真实 PNG 带图发布验证通过；此前失败是测试图片 `icon.png` 实为 WebP 伪装 PNG

