# Vuepress2 配置指南（草稿）

> TODO：待替换真实帮助文档链接。

通过 **GitHub API** 将文章发布到 **Vuepress2** 文档站仓库。

## 一、准备

1. 一个可作为 Vuepress2 站点的 **GitHub 仓库**（如 `vuepress2-blog`，源码文章放在 `src/post` 下）。
2. 一个对该仓库有 **push 权限** 的 **GitHub Token（PAT）**（GitHub Settings → Developer settings → Personal access tokens，勾选 `repo` 权限）。
3. 站点仓库已配置构建部署（例如 Vercel / GitHub Actions / Netlify），推送 `.md` 后能触发重新构建上线。

## 二、配置

| 字段 | 填什么 |
|------|--------|
| 首页地址 | GitHub 首页地址，默认 `https://github.com` |
| API 地址 | GitHub API 地址，默认 `https://api.github.com`，通常无需修改 |
| 用户名 | GitHub 用户名（owner），用于拼出仓库地址 |
| 鉴权 Token | GitHub 个人访问令牌（PAT），需对目标仓库有 push 权限 |
| git 仓库名 | 站点仓库名（裸仓库名，不带 `owner/` 前缀），例如 `vuepress2-blog` |
| 默认分支 | 发布到的分支，默认 `main` |
| 存储目录 | 文章存储目录，默认 `src/post`。发布后的 `.md` 会写入该目录 |
| 文件规则 | 文章文件名规则，默认 `[slug].md`（文章别名） |
| 文章预览规则 | 站点文章预览规则，默认 `/post/[postid].html`（实际地址由主题路由决定） |
| 预览规则 | GitHub blob 预览规则，默认 `/[user]/[repo]/blob/[branch]/[docpath]` |
| 图床 | 选「当前平台」：图片上传到**文章所在目录**的 `images` 子目录（规则 `[docpath]/images`，如 `src/post/images/<图片名>`），文章引用相对路径 `./images/<图片名>` |

发布写入的 front matter 含 `title`、`short_title`、`date`、`description`、`tag`、`category`，并默认附 `article: true`、`timeline: false`、`isOriginal: true`（可在「YAML 预设配置」中覆盖）。

## 三、图片约定（Vuepress2 资源就近放置）

- Vuepress2 推荐把图片放在**文章文件旁边**：`imageStorePath = [docpath]/images` 会解析为文章所在目录下的 `images/` 子目录（例如 `src/post/images/<图片名>`）。
- 文章内引用 `imageLinkPath = ./images` 生成**相对路径** `./images/<图片名>`；Vuepress2 构建时把页面目录内的图片随页面一起输出（`assets/img/<图片名>.<hash>.png`），相对引用即可正确显示。
- 因此选「当前平台」图床发布带图文章后，仓库中会同时出现 `.md` 与同目录 `images/<图片名>`。

## 四、验证与发布

1. 点「验证」→ Token、仓库、分支校验通过（会向仓库发布并清理测试文件 `test.md`）→ 保持「配置已保存并验证通过」。
2. 快速发布 → 选 Vuepress2 → 发布。文章 `.md` 提交到 `存储目录/[slug].md`。
3. 「查看文章」打开仓库 blob 地址；站点线上地址由主题路由决定，需站点已构建部署。
4. 带图发布时图片上传到文章所在目录的 `images/`，文章引用 `./images/<图片名>`。

## 常见问题

- **验证通过但发布失败**：确认 Token 对目标仓库有 push 权限、仓库名与分支正确。权限不足会收到 401/403。
- **图片要怎么发布**：选「当前平台」图床，图片上传到文章所在目录的 `images/` 子目录，文章引用相对路径 `./images/<图片名>`（资源就近，构建时随页面输出）。
- **线上没有新文章**：Vuepress2 站点需要构建。确认仓库已绑定 Vercel / Actions 等自动构建；仅推送 `.md` 不会直接改变已部署站点。
- **更新与删除**：点「更新」会重新提交该文章并产生一次新提交；「删除」会移除仓库中对应的 `.md`，站点需重新构建才会同步下线。
- **删除时报 422 sha 不匹配**：GitHub contents 接口在刚发生提交后可能短暂返回旧 sha（与 Quartz 同现象，属平台暂态），稍候点「重试」即可成功。
