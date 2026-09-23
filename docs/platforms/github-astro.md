# Astro 配置指南

通过 **GitHub API** 将文章发布到 **Astro** 站点仓库。

## 一、准备

1. 一个可作为 Astro 站点的 **GitHub 仓库**（如 `astro-blog`，博客文章放在 `src/content/blog` 下）。
2. 一个对该仓库有 **push 权限** 的 **GitHub Token（PAT）**（GitHub Settings → Developer settings → Personal access tokens，勾选 `repo` 权限）。
3. 站点仓库已配置构建部署（例如 Vercel / GitHub Actions / Netlify），推送 `.md` 后能触发重新构建上线。

## 二、配置

| 字段 | 填什么 |
|------|--------|
| 首页地址 | GitHub 首页地址，默认 `https://github.com` |
| API 地址 | GitHub API 地址，默认 `https://api.github.com`，通常无需修改 |
| 用户名 | GitHub 用户名（owner），用于拼出仓库地址 |
| 鉴权 Token | GitHub 个人访问令牌（PAT），需对目标仓库有 push 权限 |
| git 仓库名 | 站点仓库名（裸仓库名，不带 `owner/` 前缀），例如 `astro-blog` |
| 默认分支 | 发布到的分支，默认 `main` |
| 存储目录 | 文章存储目录，默认 `src/content/blog`（Astro 内容集合目录）。发布后的 `.md` 会写入该目录 |
| 文件规则 | 文章文件名规则，默认 `[slug].md`（文章别名） |
| 文章预览规则 | 站点文章预览规则，默认 `/post/[postid].html`（Astro 按文件路径生成路由，实际地址由文件路径决定，此规则仅作查看参考） |
| 预览规则 | GitHub blob 预览规则，固定 `/[user]/[repo]/blob/[branch]/[docpath]`，不支持修改 |
| 图床 | 默认「当前平台」：图片上传到**仓库根目录**的 `public/images`，文章引用**绝对路径** `/images/<图片名>` |

发布写入的 front matter 含 `title`、`description`、`pubDate`（`yyyy-MM-dd`）、`tags`、`categories`、`keywords`（可在「YAML 预设配置」中覆盖）。

## 三、图片约定（Astro 公共资源目录）

- Astro 把 `public/` 下的资源**原样拷贝**到构建输出根目录，因此图片放 `public/images`，站点上即以 `/images/<图片名>` 访问。
- `imageStorePath = public/images` 是**仓库根目录**下的固定路径（不随文章目录变化）。
- `imageLinkPath = /images` 生成**绝对路径**引用 `/images/<图片名>`（绝对路径，不是相对资源的 `./images`）。
- 发布带图文章后，仓库中会出现 `.md` 与 `public/images/<图片名>`。

## 四、发布目录的限制

Astro 的发布目录固定为内容集合目录（默认 `src/content/blog`），**配置页不提供修改**（「发布目录」为只读提示）。如需更换位置，请在仓库中调整内容集合配置后重新发布。

## 五、验证与发布

1. 点「验证」→ Token、仓库、分支校验通过 → 保持「配置已保存并验证通过」。
2. 快速发布 → 选 Astro → 发布。文章 `.md` 提交到 `存储目录/[slug].md`。
3. 「查看文章」打开仓库 blob 地址；站点线上地址由内容集合的文件路径决定，需站点已构建部署。
4. 带图发布时图片上传到 `public/images`，文章引用 `/images/<图片名>`。

## 常见问题

- **验证通过但发布失败**：确认 Token 对目标仓库有 push 权限、仓库名与分支正确。权限不足会收到 401/403。
- **图片要怎么发布**：图床默认「当前平台」，图片提交到仓库根目录的 `public/images`，文章引用绝对路径 `/images/<图片名>`。
- **线上没有新文章**：Astro 站点需要构建。确认仓库已绑定 Vercel / Actions 等自动构建；仅推送 `.md` 不会直接改变已部署站点。
- **发布目录能不能改**：不能，固定为内容集合目录；如需更换请在仓库中调整后重新发布。
- **更新与删除**：点「更新」会重新提交该文章并产生一次新提交；「删除」会移除仓库中对应的 `.md`，站点需重新构建才会同步下线。