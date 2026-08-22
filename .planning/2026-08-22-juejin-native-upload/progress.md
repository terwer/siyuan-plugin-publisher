# 掘金原生图片上传 — 会话日志

## 2026-08-22

- 收到用户指令：掘金具备原生图片上传能力，须探测到原生上传成功；先最小化探测，可独立追踪。
- 创建独立探索 plan `.planning/2026-08-22-juejin-native-upload/`。
- 探索阶段：驱动真实编辑器 UI 捕获五步链路（gen_token→Apply→TOS PUT→Commit→get_img_url），
  全部机制级探针通过，存储契约=裸 StoreUri（详见 findings.md）。
- 实现阶段：byteimagex vendor + rawHeaderFetch + juejinWebAdaptor.uploadFile +
  默认图床 Bundled；spec 5/5 绿；build:v2 通过。
- **真根因**：SigV4 amzDate 带冒号 → 100024。修复一行后宿主全链路绿。
- 宿主验证（GUI 全程）：配置切当前平台 → 贴图 → 更新成功无警告；
  草稿两图均裸 `![](tos-cn-i-73owjymdk6/<32hex>)`；
  文章 7676404118950395938 audit=2 匿名可访问含图。
- Checklist #33 Img ✅，T1 全链路 ✅ 计 10 个；commit `58da58bc`。
- 清理：探针文章 7676436966323683328 已删；草稿 7676405390205222927 已删；
  草稿 7676405390204813327 删除返回 403（孤儿态，留待用户手动）；临时 Chrome 已杀。

## 下一步
- checklist #34 微信公众号、#35 哔哩哔哩。
