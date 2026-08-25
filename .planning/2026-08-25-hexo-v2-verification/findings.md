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

## 宿主验证结果（2026-08-25，Electron test 工作区）
- **V2C ✅**：`github_Hexo` 配置（username=terwer / repo=hexo-blog / branch=main / 存储目录=source/_posts / 发布目录=source/_posts），验证通过，「配置已保存并验证通过」，账号「运行中/已启用」。
- **Pub ✅**：快速发布 → repo `source/_posts/掘金-V2-验证测试-更新.md`（frontmatter title/permalink + 正文），提交 `bdf5415`。
- **Upd ✅**：点击「更新」→ 新提交（`3b9692e`），更新机制生效。（内容未变因源文档未改；已尝试 API 追加内容，较脆弱，未作主证据。）
- **Img ✅**：图床切「**当前平台**」后重发 → cat 图上传 `source/images/cat-20260822153711-o2ho0mg.jpg`（13246B），.md 引用改写 `![cat](/source/images/cat-...jpg)`。
- **查看 ✅**：`https://github.com/terwer/hexo-blog/blob/main/source/_posts/掘金-V2-验证测试-更新.md` HTTP 200；图片 blob URL 亦 HTTP 200。
- **Del ✅**：删除 → repo 该 .md 移除（请求 404），提交 `3cc1abb`，UI 回「未发布」。

## 验证发现 / 待处理项
1. **checkAuth 残留 `test.md`**：V2C 验证向 repo 根发布 `test.md`（"Hello, World!"），但清理删除未成功，残留 `test.md`（sha b45ef6f，提交 b34e0a1）。属通用 `CommonGithubApiAdaptor.checkAuth` 行为，待确认是否修复。
2. **图床默认「不使用」时 Img 不完整**：Hexo 配置默认图床「不使用」，发布含图文档时图片**不**上传 repo（.md 留相对路径 `assets/...`）。切「当前平台」才上传 `source/images`。Git 平台合理默认应为「当前平台」，待确认是否需调整。
