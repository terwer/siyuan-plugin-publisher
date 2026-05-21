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
- [ ] 1.7b #28 Halo网页版
- [ ] 1.8 #29 本地系统（Electron）

## 2. T2a / T2b / T3

- [ ] 2.1 T2a #30–#35：V1C + Pub/Upd + V2 Inv
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

