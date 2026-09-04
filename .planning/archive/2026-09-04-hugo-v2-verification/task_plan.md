# 计划：Hugo V2 验证

## 目标
完成 checklist #7 Hugo（`github_Hugo`）的 V2 全链路验证（V2C / Pub / Upd / Del / Img / 查看）与帮助引导文档，并处理验证中发现的问题。

## 背景
Hugo 属 Github 平台族，共享受基类 `commonGithubApiAdaptor` + `CommonGithubConfig`（`src/adaptors/api/base/github/`），仅配置层覆写（`src/adaptors/api/hugo/`）。Hugo 图片链路与 Hexo 结构不同，需实测确认。

## 前置
- GitHub 账号 + 可写 PAT（`PasswordType_Token`），`terwer/hugo-blog` 仓库，分支 `main`。
- 本地 `hugo-blog` clone（`content/post` 文章 + `static/images` 图床）；作者仓库 `hexo-image-processing-zftcmx.md` 用绝对 `/images/…png`。

## 关键决策
- 图片路径：**绝对 `/images/<名>`**（`imageStorePath=static/images` + `imageLinkPath=images`）。Hugo `content/post` 与 `static/images` 为兄弟目录，构建把 `static/` 去掉前缀复制到站点根 → 源码相对路径与构建相对路径数学上不可能相等，无单一相对路径同时满足源码 blob + 构建产物。与 Hexo（同在 `source/` 下）本质不同。
- 通过标准：Img = 构建产物站点 `/images/<名>` 可靠显示；源码仓库 blob 视图 `/images/` 内联不显示为平台固有限制。

## 步骤
1. 代码层核验（config/converter/getImagePath）。
2. help/文档/注册（github-hugo.ts + github-hugo.md + index.ts + registry.spec.ts + remaining-t1.ts）。
3. build:v2 + registry 单测。
4. 宿主六格手验（V2C/Pub/Upd/Del/Img/查看）+ HelpPanel/TourGuide。
5. checklist SSOT 回写 + 修订记录 + 提交。
