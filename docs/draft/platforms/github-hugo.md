# Hugo 配置指南（草稿）

> TODO：待替换真实帮助文档链接。

通过 **GitHub API** 将文章发布到 **Hugo** 静态博客仓库。V2 已验证完整链路（配置、发布、更新、删除、带图发布、查看链接）。

## 一、准备

1. 一个可作为 Hugo 博客仓库的 **GitHub 仓库**（如 `hugo-blog`）。
2. 一个对该仓库有 **push 权限** 的 **GitHub Token（PAT）**（GitHub Settings → Developer settings → Personal access tokens，勾选 `repo` 权限）。
3. 该仓库是一个标准 Hugo 项目（含 `hugo.toml`/`hugo.yaml` 与 `content/`、`static/` 目录）。

## 二、配置

| 字段 | 填什么 |
|------|--------|
| 首页地址 | GitHub 首页地址，默认 `https://github.com` |
| API 地址 | GitHub API 地址，默认 `https://api.github.com`，通常无需修改 |
| 用户名 | GitHub 用户名（owner），用于拼出仓库地址 |
| 鉴权 Token | GitHub 个人访问令牌（PAT），需对目标仓库有 push 权限 |
| git 仓库名 | Hugo 博客仓库名，与用户名组成 `<user>/<repo>`，如 `hugo-blog` |
| 默认分支 | 发布到的分支，默认 `main`，需与仓库实际分支一致 |
| 存储目录 | Hugo 文章存储目录，默认 `content/post`。发布后的 `.md` 写入该目录（随 section 决定文章 URL） |
| 文件规则 | 文章文件名规则，默认 `[slug].md` |
| 文章预览规则 | 站点文章预览规则，默认 `/post/[postid].html` |
| 预览规则 | GitHub blob 预览规则，默认 `/[user]/[repo]/blob/[branch]/[docpath]` |
| 图床 | Hugo 支持内置图床，选「当前平台」：图片上传到仓库 `static/images`（默认），文章中引用为绝对路径 `/images/<图片名>` |

## 三、图片与目录约定（Hugo 官方规范）

- Hugo 的 **`static/` 目录**构建时会被**原样复制到站点根目录**。放在 `static/images/` 下的图片，站点根 URL 就是 `/images/<图片名>`。
- 因此在 Markdown 中引用文章图片使用 **绝对路径 `/images/<图片名>`** 即可——构建产物（`public/`）中该路径能正确解析到图片。这也是社区与官方文档推荐的引用方式。
- 文章的最终 URL（permalink）由**所在 section（content 下的目录）+ slug** 决定。默认 `[slug].md` 文件名 + 开启「YAML 永久链接」时，插件会在 front matter 写入 `url` 强制文章地址为 `/post/<slug>.html`（与「文章预览规则」一致），保证查看链接可打开。
- Hugo front matter 中未显式写 `draft` 时文章默认为**发布**状态（`draft` 默认 `false`），构建时会被正常渲染。

## 四、验证与发布

1. 点「验证」→ Token、仓库、分支校验通过（会向仓库发布并清理测试文件）→ 保持「配置已保存并验证通过」。
2. 快速发布 → 选 Hugo → 发布。文章 `.md` 会提交到 `存储目录/文件名.md`。
3. 点「查看文章」能打开站点文章页；带图发布时图片会一并上传到仓库 `static/images` 并在文章中引用 `/images/<图片名>`。

## 常见问题

- **验证通过但发布失败**：确认 Token 对目标仓库有 push 权限，仓库名与分支正确，存储目录已存在。权限不足会收到 401/403。
- **图片要怎么发布**：选「当前平台」图床，图片上传到仓库 `static/images`，文章中引用绝对路径 `/images/<图片名>`。因 Hugo 构建时把 `static/` 原样复制到站点根，构建产物能正常显示。
- **查看链接打不开**：若开启「YAML 永久链接」，确认站点把文章地址设为了 `/post/<slug>.html`（与「文章预览规则」一致）；若关闭，则地址由 content 下目录与 slug 决定，需对应调整预览规则。另外请确认博客使用的主题/发布脚本会对仓库变更执行 `hugo` 构建（如 GitHub Actions），否则新文章不会出现在线上站点。
- **发布后线上没有新文章**：Hugo 是通过构建（`hugo`/`hugo build`）从仓库内容生成站点的。确认仓库配置了自动构建（GitHub Actions / Vercel / Netlify 等）；仅推送 `.md` 不会直接改变已部署站点，需触发一次构建。
- **更新与删除**：点「更新」会重新提交并产生一次新提交；「删除」会从仓库移除对应 `.md`，需重新构建才能从站点移除。
