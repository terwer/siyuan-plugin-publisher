# Halo29 (common_Halo) V2 验证计划

> 目标：完成 checklist 第 #3 站 Halo29（`common_Halo` / `Common_Halo`）的 V2 全链路验证（六格 V2C/Pub/Upd/Del/Img/查看 + SOP §3 帮助引导），并回写 checklist SSOT。
> SSOT：`openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`（#3 行，当前全空）。

## 阶段

- [ ] **阶段 0：调研与实例准备** — 确认 Halo API 平台配置口径（token 类型、字段、imageStore）、是否有可用的 Halo 实例（8092 未运行，查 #28 用的 halo2-docker）与真实 PAT；明确 V2C 流程（API token，非 Cookie）。
- [ ] **阶段 1：V2C** — 配置页填 PAT → 验证 → 账号状态「已授权/运行中」。
- [ ] **阶段 2：Pub / Upd / Del** — 快发布带图文档 → 发布/更新/删除，记录 postid 与行为。
- [ ] **阶段 3：Img** — 确认图片上传（Halo API / PicGo / Bundled）并验证发布后图片可访问。
- [ ] **阶段 4：查看** — 点击「查看文章」验证预览链接可打开文章（HTTP 200）。
- [ ] **阶段 5：SOP §3 帮助引导** — 新建 `src/helpConfigs/pages/platform-config/common-halo.ts`（helpUrl+summary+fields+faq+tour）若有缺；`docs/draft/platforms/common-halo.md`；注册/移出 remaining-t1/纳入 verifiedConfigs；build + 宿主 HelpPanel/TourGuide 验证。
- [ ] **阶段 6：回写 SSOT + 修订记录** — #3 行五格+备注、T1 小结、修订记录、进度。

## 关键口径
- `common_Halo` 是 **Halo API** 平台（PAT token，非 Cookie）；与 `custom_Haloweb`（#28，网页 Cookie）是两套适配器，别混。
- Halo 版本 2.x（本地 docker 实例）；`home/apiUrl=localhost:8092`（配置持久化，但实例未运行，需确认/启动）。
- 配置存储：dev/public `data/storage/syp/sy-p-plus-cfg.json` 的 `common_Halo`（home=apiUrl=localhost:8092，blogid=test-classification-2rg8ql，apiStatus=True，password=本地默认口令（不入库））。
