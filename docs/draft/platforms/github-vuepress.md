# Vuepress 配置指南（草稿）

> TODO：待替换真实帮助文档链接。

通过 **GitHub API** 将文章发布到 **Vuepress1** 静态博客仓库。V2 已验证完整链路（配置、发布、更新、删除、带图发布、查看链接）。

## 一、准备

1. 一个可作为 Vuepress1 博客仓库的 **GitHub 仓库**（如 `terwer/terwer.github.io`）。
2. 一个对该仓库有 **push 权限** 的 **GitHub Token（PAT）**（GitHub Settings → Developer settings → Personal access tokens，勾选 `repo` 权限）。
3. 该仓库是一个标准 Vuepress1 项目，文章放在 `docs/` 目录，静态资源放在 `docs/.vuepress/public/`。

## 二、配置

| 字段 | 填什么 |
|------|--------|
| 首页地址 | GitHub 首页地址，默认 `https://github.com` |
| API 地址 | GitHub API 地址，默认 `https://api.github.com`，通常无需修改 |
| 用户名 | GitHub 用户名（owner），用于拼出仓库地址 |
| 鉴权 Token | GitHub 个人访问令牌（PAT），需对目标仓库有 push 权限 |
| git 仓库名 | Vuepress 博客仓库名，与用户名组成 `<user>/<repo>`，如 `terwer/terwer.github.io` |
| 默认分支 | 发布到的分支，默认 `main`，需与仓库实际分支一致 |
| 存储目录 | Vuepress 文章存储目录，默认 `docs`。发布后的 `.md` 写入该目录 |
| 文件规则 | 文章文件名规则，默认 `[filename].md` |
| 文章预览规则 | 站点文章预览规则，默认 `/post/[postid].html` |
| 预览规则 | GitHub blob 预览规则，默认 `/[user]/[repo]/blob/[branch]/[docpath]` |
| 图床 | Vuepress 支持内置图床，选「当前平台」：图片上传到仓库 `docs/.vuepress/public/images`（默认），文章中引用为绝对路径 `/images/<图片名>` |

## 三、图片与目录约定（Vuepress）

- Vuepress1 的文章来源目录是 **`docs/`**，文章 `.md` 写入该目录，文件名默认 `[filename].md`。
- 图片选「当前平台」图床时，会提交到仓库根目录的 **`docs/.vuepress/public/images/`**，文章内引用为 **绝对路径 `/images/<图片名>`**。
- Vuepress 构建时把 `.vuepress/public` 目录映射到站点根，因此 `/images/...` 引用在构建产物中能正确显示。
- 文章 front matter 常用的字段：`title`、`date`、`permalink`（开启「YAML 永久链接」时写入，与「文章预览规则」一致）、`categories`、`article` 等。

## 四、验证与发布

1. 点「验证」→ Token、仓库、分支校验通过 → 保持「配置已保存并验证通过」。
2. 快速发布 → 选 Vuepress → 发布。文章 `.md` 会提交到 `存储目录/[filename].md`。
3. 点「查看文章」能打开仓库中该 `.md` 的 blob 地址；带图发布时图片会一并上传到仓库 `docs/.vuepress/public/images` 并在文章中引用 `/images/<图片名>`。

## 常见问题

- **验证通过但发布失败**：确认 Token 对目标仓库有 push 权限，仓库名与分支正确，存储目录已存在。权限不足会收到 401/403。
- **图片要怎么发布**：选「当前平台」图床，图片上传到仓库 `docs/.vuepress/public/images`，文章中引用绝对路径 `/images/<图片名>`。构建时该目录映射到站点根，因此 `/images/...` 能正确显示。
- **查看链接打不开**：查看链接默认是仓库 blob 地址（`/[user]/[repo]/blob/[branch]/[docpath]`），仓库中存在该 `.md` 即可打开；若改为站点文章预览规则，需站点已部署且地址与规则一致。
- **发布后线上没有新文章**：Vuepress1 是通过构建（`npm run docs:build`）从 `docs/` 生成站点的，仅推送 `.md` 不会直接改变已部署站点；需配置自动构建（GitHub Actions / Pages / Vercel / Netlify 等）并触发一次构建。
- **更新与删除**：点「更新」会重新提交并产生一次新提交；「删除」会从仓库移除对应 `.md`，需重新构建才能从站点移除。
