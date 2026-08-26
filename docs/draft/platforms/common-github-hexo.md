# Hexo 配置指南（草稿）

> TODO：待替换真实帮助文档链接。

通过 **GitHub API** 将文章发布到 **Hexo** 静态博客仓库。V2 已验证完整链路（配置、发布、更新、删除、带图发布、查看链接）。

## 一、准备

1. 一个可作为 Hexo 博客仓库的 **GitHub 仓库**（如 `hexo-blog`）。
2. 一个对该仓库有 **push 权限** 的 **GitHub Token（PAT）**（GitHub Settings → Developer settings → Personal access tokens，勾选 `repo` 权限）。

## 二、配置

| 字段 | 填什么 |
|------|--------|
| 首页地址 | GitHub 首页地址，默认 `https://github.com` |
| API 地址 | GitHub API 地址，默认 `https://api.github.com`，通常无需修改 |
| 用户名 | GitHub 用户名（owner），用于拼出仓库地址 |
| 鉴权 Token | GitHub 个人访问令牌（PAT），需对目标仓库有 push 权限 |
| git 仓库名 | Hexo 博客仓库名，与用户名组成 `<user>/<repo>`，如 `hexo-blog` |
| 默认分支 | 发布到的分支，默认 `main`，需与仓库实际分支一致 |
| 存储目录 | Hexo 文章存储目录，默认 `source/_posts` |
| 文件规则 | 文章文件名规则，默认 `[filename].md` |
| 文章预览规则 | 站点文章预览规则，默认 `/post/[postid].html` |
| 预览规则 | GitHub blob 预览规则，默认 `/[user]/[repo]/blob/[branch]/[docpath]` |
| 图床 | Hexo 支持内置图床，选「当前平台」：图片上传到仓库 `source/images`（默认），文章引用为相对路径 `../images/<图片名>`，保证源码与构建产物都能显示 |

## 三、验证与发布

1. 点「验证」→ Token、仓库、分支校验通过（会向仓库发布并清理测试文件）→ 保持「配置已保存并验证通过」。
2. 快速发布 → 选 Hexo → 发布。文章 `.md` 会提交到 `存储目录/文件名.md`。
3. 点「查看文章」能看到该 `.md` 的 GitHub blob 地址；带图发布时图片会一并上传到仓库图床目录。

## 常见问题

- **验证通过但发布失败**：确认 Token 对目标仓库有 push 权限，仓库名与分支正确，存储目录已存在。权限不足会收到 401/403。
- **图片要怎么发布**：选「当前平台」图床，图片上传到仓库 `source/images`，文章中引用相对路径 `../images/<图片名>`（源码编辑器与构建产物均可正常显示）。
- **查看链接打不开**：确认预览规则（默认 `/[user]/[repo]/blob/[branch]/[docpath]`）与文件路径、分支对应。
- **更新与删除**：点「更新」会重新提交并产生一次新提交；「删除」会从仓库移除对应 `.md`，需重新发布才能再次出现在站点。
