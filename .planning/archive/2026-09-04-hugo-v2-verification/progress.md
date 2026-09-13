# 进度日志：Hugo V2 验证

## 2026-09-04（代码层 + 宿主六格全链路 ✅）
- code/hugoConfig.ts：`defaultPath=content/post`、`imageStorePath=static/images`、`imageLinkPath=images`、`previewPostUrl=/post/[postid].html`。
- 图片策略确认：Hugo `static/` 构建去掉前缀复制到站点根，`content/post` 与 `static/images` 兄弟目录 → 无单一相对路径同时满足源码 blob + 构建产物；采用绝对 `/images/<名>`（官方契约）。
- help/doc 注册：`github-hugo.ts`（pageId `github_Hugo`，summary/fields/faq4/tour9）+ `docs/draft/platforms/github-hugo.md`；注册进 `/pages/index.ts`、移出 remaining-t1、纳入 verifiedConfigs；registry.spec 18 绿、build:v2 通过（commit `1769b4fb`）。
- 宿主（Electron test 工作空间 / dist-v2 / 9222）六格手验：
  - V2C ✅ 新增账号 `github_Hugo-z1y7ssd`（terwer/hugo-blog/main/content/post，PAT，「验证」通过，"配置已保存并验证通过"，账号「运行中/已启用」，发布目录自动拉取 content/post）。
  - Pub ✅ `content/post/halo-image-upload-test-1plnjn.md`（frontmatter + YAML 永久链接 + `/images/…png`，提交 `2ab9e55`）。
  - Upd ✅ 新提交 `6016692`。
  - Img ✅ 图床「当前平台」cat 图上传 `static/images/…png`（提交 `03a554d`），引用绝对 `/images/…`。
  - 查看 ✅ blob 预览规则解析到真实存在的仓库文件。
  - Del ✅ repo .md 移除（API 404），提交 `5b3c4fd`，UI 回「未发布」。
- 图片 blob 404 说明：源码仓库 blob 视角 `/images/` 解析为仓库根 `images/`（不存在，图在 static/images/）→ 内联 404，属 Hugo 平台固有限制；**用户实测 `https://hugo.terwer.space/post/halo-image-upload-test-1plnjn.html` 可显示图片**（构建产物可靠显示），确认 Img 通过标准 = 构建产物可显示。
- checklist SSOT #7 六格 ✅ + T1 小结更新为 18 + 修订记录（commit `1571ccd9`）。
