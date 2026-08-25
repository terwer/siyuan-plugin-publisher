# 研究记录：Github 平台族 + Hexo

> 面向交付的中性结论；不含对平台机制的逆向描述。

## 共享基类（src/adaptors/api/base/github/）
- `CommonGithubConfig`：
  - 字段：`username`(githubUsername)、`password`(PAT, `PasswordType_Token`)、`githubRepo`、`githubBranch`、`middlewareUrl`(可选)。
  - 常量：`home=https://github.com`、`apiUrl=https://api.github.com`、`tokenSettingUrl=https://github.com/settings/tokens`、`previewUrl="/[user]/[repo]/blob/[branch]/[docpath]"`、`previewPostUrl="/post/[postid].html"`、`defaultPath="/"`、`mdFilenameRule="[filename].md"`。
- `CommonGithubApiAdaptor`（依赖 `CommonGithubClient`，来自 `zhi-github-middleware`）：
  - `checkAuth`：发布并删除 `test.md`（"Hello, World!"）→ 可写 repo 即通过。
  - `getUsersBlogs`：blogid/defaultPath；博客为 `github.com/<user>/<repo>`。
  - `newPost`：将 .md 提交到 `post.cate_slugs?.[0] ?? cfg.blogid`（默认 `defaultPath`）；失败先删旧再重发。
  - `editPost`：目录变更 → 删旧建新并提示；否则 update。
  - `deletePost`：删除文件，校验 `commit.sha`。
  - `getPreviewUrl`：用 `[user]/[repo]/[branch]/[docpath]` 替换 `previewUrl` → GitHub blob 链接。
  - `newMediaObject`：图片以 base64 提交到 `imageStorePath`（默认 `source/images`），422=已存在视为成功；`link=imageLinkPath`。

## Hexo 覆写（src/adaptors/api/hexo/hexoConfig.ts）
见 task_plan「背景」节。

## 登记状态
- Github 族在 `src/platforms/pre.ts`（`githubCfg`）注册 8 项（#6-#13）；当前 checklist 表中全部 ⬜。
- 下一篇（后续）可延伸：`src/adaptors/api/{hugo,jekyll,...}` 同构。
