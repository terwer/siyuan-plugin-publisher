# Halo29 (common_Halo) 进度

## 会话 2026-08-24
- 阶段 0 调研/实例：鉴权=Basic(username:password)，正确用户名 admin、本地默认口令（值不入库）；Halo 2.9 实例经 mirror 拉镜像并 `compose up -d` 启动（8090 ready）；test 空间 common_Halo 尚未配置。
- 待办：宿主 V2C 填 home/apiUrl=8090 + admin + 口令 → 验证 → 已授权；随后 Pub/Upd/Del/Img/查看；SOP §3 help/tour/doc；回写 SSOT。

## 六格宿主验证结果（2026-08-24，Electron 宿主 / test 空间 / 9222）
- **V2C ✅**：填 home/apiUrl=`http://localhost:8090`、username=`admin`、password=默认口令 →「验证」通过 → 账号「运行中/已启用」，blogid 自动取分类 `advanced-zklsxj`。
- **Pub ✅**：`阿里云无法上传图片` →「发布成功」，文章 `http://localhost:8090/archives/alibaba-cloud-cannot-upload-pictures-zbhwvc`（200）。
- **Img ✅**：含本地 asset 图的 `Halo 图片上传测试` 发布后，图片 URL 由 `127.0.0.1:53180/assets/...` 改为 **`http://localhost:8090/upload/image-....png`**（Halo 附件），GET 200/image-png。→ Halo bundled 上传路径可用。
- **Upd ✅**：`Halo 图片上传测试` →「更新成功 / 已完成 Halo29 的更新」。
- **Del ✅**：确认「删除」→「删除成功 / 已完成 Halo29 的删除」；文章公开页 **404**（已取消发布）。
- **查看 ✅**：查看文章链接 `http://localhost:8090/archives/<slug>`，文章 HTTP 200。
- 结论：六格全通过。注：`阿里云无法上传图片`（post `alibaba-cloud-cannot-upload-pictures-zbhwvc`, PUBLISHED）为 Pub 测试产物，暂留 Halo。

## SOP §3 help 现状（2026-08-24）
- `src/helpConfigs/pages/platform-config/common-halo.ts` **已存在**（21 行，pageId `common_Halo`，helpUrl=siyuan.wiki/s/20230908183639-btcnnmj，summary，fields={apiUrl,token}，faq×2），已注册进 `pages/index.ts`，`common_Halo` 已不在 remaining-t1。
- ⚠️ 但**缺 `tour`**（verifiedConfigs 强制要求），且 fields 用 `token`（Halo 实为 username/password，非 token）——需修正/补全。
- **缺** `docs/draft/platforms/common-halo.md`；verifiedConfigs **未含** haloHelpConfig。

## SOP §3 帮助引导完成（2026-08-24）
- **help 配置**：补全 `src/helpConfigs/pages/platform-config/common-halo.ts`——修正 fields（由原 `token` 改为 `username/password` 等真实字段：home/apiUrl/username/password/previewUrl/pageType/picbedService，共 7 项），补 tour 8 步（home/apiUrl/username/password/previewUrl/pageType/picbedService/validate），faq 4 条，summary 说明 Halo API 仅支持 2.9 + 带图发布。已注册进 `/pages/index.ts`、`common_Halo` 已不在 remaining-t1、纳入 `registry.spec.ts` verifiedConfigs。
- **文档草稿**：新增 `docs/draft/platforms/common-halo.md`（顶部 TODO 占位帮助链接）。
- **验证**：registry.spec 18 项绿；`build:v2` 通过（vue-tsc + vite）。Electron 宿主实测 Halo 配置页：HelpPanel（弹层完整渲染 summary + 查看完整帮助文档 + FAQ 4 条 + 开始引导教程）；TourGuide 正常（首页地址、API 地址两步内容正确匹配 tour）。**#3 六格 + 帮助引导全部闭环**。
