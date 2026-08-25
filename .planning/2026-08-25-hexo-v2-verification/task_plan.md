# 任务计划：Hexo V2 验证（checklist #6）

## 目标
完成 checklist #6 Hexo（`github_Hexo`）的 V2 全链路验证（V2C / Pub / Upd / Del / Img / 查看）与帮助引导文档，并修复验证中发现的问题。

## 背景
Hexo 属 Github 平台族，全族共用共享基类 `commonGithubApiAdaptor` + `CommonGithubConfig`（`src/adaptors/api/base/github/`）。Hexo 仅覆写少量配置：
- `defaultPath="source/_posts"`、`previewUrl="/[user]/[repo]/blob/[branch]/[docpath]"`、`previewPostUrl="/post/[postid].html"`、`mdFilenameRule="[filename].md"`、`imageStorePath=imageLinkPath="source/images"`。
- `pageType=Markdown`、`categoryType=CategoryType_Multi`、`knowledgeSpaceEnabled=true`（只读，改目录需删除重发）。

验证 Hexo 即验证该共享基类在 V2 的可用性，其余 Github 平台（Hugo/Jekyll/Quartz/Vuepress/Vuepress2/Vitepress/Astro）主要差异在配置层。

## 验证前置（唯一外部依赖）
- GitHub 账号 + **可写 PAT**（`PasswordType_Token`，`tokenSettingUrl=https://github.com/settings/tokens`）
- 测试 repo（含 `source/_posts/` 目录），branch 如 `main`/`master`
- 说明：`验证`(checkAuth) = 在 repo 发布再删除 `test.md`，需 repo 可写；「查看」走 GitHub blob 链接（`github.com/<user>/<repo>/blob/<branch>/<docpath>`），无需部署站点即可打开。

## 当前阶段
未开始（待用户提供测试 repo + PAT）

## 关键步骤
- [ ] PHASE 0：获取测试 repo + PAT（用户提供）
- [ ] V2C：配置页填 username/PAT/repo/branch → 验证通过，账号「运行中/已启用」
- [ ] Pub：快速发布 → repo 内 `source/_posts/` 生成 .md
- [ ] Upd：更新 → repo 内 .md 更新
- [ ] Del：删除 → repo 内 .md 删除
- [ ] Img：带本地 asset 图发布 → 图片提交到 `source/images`
- [ ] 查看：`getPreviewUrl` blob 链接可打开
- [ ] 帮助引导：新增 hexo help 配置 + 文档草稿 + 宿主 HelpPanel/TourGuide 验证

## 交付
- checklist SSOT #6 六格 + 帮助引导全 ✅
