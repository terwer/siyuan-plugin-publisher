# 进度日志：Hexo V2 验证

## 2026-08-25（规划）
- 对账：checklist 当前实际全链路 ✅ = 16（含 #4 Telegraph、#5 Confluence）；T1 小结陈旧(14)，已同步为 16、未测 19。
- 确定下一步 = #6 Hexo（Github 平台族首项）。
- 完成 Github 平台族调研（共享基类 + Hexo 覆写差异）。
- 归档已完成的 Confluence 计划；active_plan 切到本 Hexo 计划。
- 待用户提供测试 repo + PAT 后进入宿主验证。

## 2026-08-25（宿主验证，Electron test 工作区 / 9222 / dist-v2）
- 账号：`terwer` / `hexo-blog` / `main`；PAT 经思源「通用账号汇总」取「最新可用 GitHub Token」（仅存 tmp/ 记忆，不入库）。
- V2C ✅「配置已保存并验证通过」（username/repo/branch/存储目录 source/_posts，发布目录自动拉取）。
- Pub ✅ `source/_posts/掘金-V2-验证测试-更新.md`（提交 bdf5415）。
- Upd ✅ 点「更新」新提交（3b9692e）；Img ✅ 图床切「当前平台」cat 图上传 `source/images/`，.md 引用 `/source/images/...jpg`；查看 ✅ blob URL HTTP 200；Del ✅ 删除后 repo .md 404，UI 回「未发布」。
- SOP §3 ✅：新增 help 配置 `common-github-hexo.ts`（registered/移出 remaining-t1/纳入 verifiedConfigs，registry 18 绿）+ `docs/draft/platforms/common-github-hexo.md`；宿主 HelpPanel（summary+查看完整帮助文档+FAQ）+ TourGuide（8 步，2/8 可推进）正常。
- 依赖修复：`pnpm install` 将 node_modules 的 `zhi-blog-api` 从 1.80.0 升到 1.82.0（此前落后致 `BlogConfig.isCorsProxy` 类型缺失，`vue-tsc`/build:v2 失败）；build:v2 通过。
- 待确认发现：① `checkAuth` 向 repo 根发布 `test.md` 后未清理；② Git 平台图床默认「不使用」时含图发布不传图（须「当前平台」）。

## 2026-08-25（图片 404 修复）
- 用户反馈「build 之后图片 404」。核对本地 `hexo-blog` 源码（`_config.yml` `post_asset_folder:false`/`source_dir:source`/`public_dir:docs`；作者自建 `hexo-图片-2.md`/`hexo-图片处理.md` 引用 `/images/…png`）与站点实况（`/images/cat-…jpg` 200、`/source/images/cat-…jpg` 404、作者 `/images/…png` 页 200）→ 根因 `HexoConfig.imageLinkPath="source/images"`，文章引用 `/source/images/…jpg`（构建后 404）。
- 修复 commit `39323796`：`HexoConfig.imageLinkPath="images"`（`imageStorePath` 保持 `source/images`）+ `hexoImagePath.spec.ts`；build:v2 通过。宿主把账号配置页「图片访问链接」改 `images` 并重发 → repo 引用 `![cat](/images/cat-…jpg)`。
- 注：图片两字段可编辑，默认仅对新账号生效；存量账号需在配置页把「图片访问链接」改为 `images`。
- 已同步 checklist SSOT（#6 行 Img 引用 + 修订记录）。
