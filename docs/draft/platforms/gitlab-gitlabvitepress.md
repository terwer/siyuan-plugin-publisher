# GitLab Vitepress 配置指南（草稿）

> TODO：待替换真实帮助文档链接。

通过 **GitLab API** 将文章发布到 GitLab 上的 **Vitepress** 文档站仓库。

## 一、准备

1. 一个可作为 Vitepress 文档站的 **GitLab 仓库**（如 `vitepress-blog`，文档文章放在 `docs` 下）。
2. 一个对该仓库有 **push 权限** 的 **GitLab 个人访问令牌（Personal Access Token）**（GitLab 右上角头像 → Preferences → Access Tokens，或访问 `/-/user_settings/personal_access_tokens`，勾选 `api` 或 `write_repository` 范围）。
3. 站点仓库已配置构建部署（例如 GitLab CI / Pages / Vercel / Netlify），推送 `.md` 后能触发重新构建上线。

## 二、配置

| 字段 | 填什么 |
|------|--------|
| 平台首页 | 你的 GitLab 实例地址（自建实例填自己的域名，如 `https://gitlab.example.com`），用于拼出仓库地址 |
| API 地址 | GitLab API 地址，**与平台首页一致**；填写平台首页后会自动同步为该地址，平台首页留空时该地址也会被清空 |
| 用户名 | GitLab 用户名（owner），用于拼出仓库地址 |
| 鉴权 Token | GitLab 个人访问令牌（Personal Access Token），需对目标仓库有 push 权限 |
| git 仓库名 | 站点仓库名（裸仓库名，不带 `owner/` 前缀），例如 `vitepress-blog` |
| 默认分支 | 发布到的分支，默认 `main` |
| 存储目录 | 文章存储目录，默认 `docs`。发布后的 `.md` 会写入该目录 |
| 文件规则 | 文章文件名规则，默认 `[slug].md`（文章别名），与 Vitepress 的文档路径约定一致 |
| 文章预览规则 | 站点文章预览规则，默认 `/post/[postid].html`。Vitepress 采用基于文件路径的路由，实际地址由文件路径决定，此规则仅作查看参考 |
| 预览规则 | GitLab blob 预览规则，固定 `/[user]/[repo]/blob/[branch]/[docpath]`，查看链接即该 `.md` 在仓库中的地址，**不支持修改** |
| 发布目录 | 默认 `docs`。该平台**不支持修改发布目录**（配置页为只读提示），如需更换请删除账号后重新发布 |
| YAML 永久链接 | **不提供该开关**：Vitepress 的路由由文件路径决定，不识别 Front Matter 中的链接字段 |
| 图床 | 默认「当前平台」：图片提交到**文章所在目录**的 `images` 子目录（规则 `[docpath]/images`，如 `docs/images/<图片名>`），文章引用相对路径 `./images/<图片名>` |

发布写入的 Front Matter 含 `title`、`description`、`date`、`categories`，并在 `head` 中按需写入 `keywords` / `description`（可在「YAML 预设配置」中覆盖）。

「YAML 预设配置」留空时，Vitepress 平台会写入以下默认值：

```yaml
outline: deep
sidebar: false
prev: false
next: false
```

填入 JSON 片段（例如 `{"sidebar": true}`）时，改为逐键合并进 Front Matter。

## 三、图片约定（Vitepress 资源就近放置）

- `imageStorePath = [docpath]/images` 会解析为**文章所在目录**下的 `images` 子目录（存储目录为 `docs` 时即 `docs/images/<图片名>`）。
- 文章内引用 `imageLinkPath = ./images` 生成**相对文章所在目录**的路径 `./images/<图片名>`，随页面一起输出。
- 因此选「当前平台」图床发布带图文章后，仓库中会同时出现 `.md` 与同目录 `images/<图片名>`。

## 四、验证与发布

1. 点「验证」→ 令牌、仓库、分支校验通过 → 保持「配置已保存并验证通过」。
2. 快速发布 → 选 GitLab Vitepress → 发布。文章 `.md` 提交到 `docs/[slug].md`。
3. 「查看文章」打开仓库 blob 地址；站点线上地址由文件路径决定，需站点已构建部署。
4. 带图发布时图片提交到文章所在目录的 `images/`，文章引用 `./images/<图片名>`。

## 常见问题

- **验证通过但发布失败**：确认个人访问令牌对目标仓库有 push 权限（`api` 或 `write_repository` 范围），仓库名与分支填写正确。权限不足会收到 401/403。
- **自建 GitLab 该怎么填平台首页**：平台首页填你的实例地址（如 `https://gitlab.example.com`），API 地址会同步为该地址；令牌地址同样由实例地址拼出（`/-/user_settings/personal_access_tokens`），需在你自己实例的偏好设置里生成令牌。
- **图片要怎么发布**：图床默认「当前平台」，图片提交到文章所在目录的 `images/` 子目录，文章引用相对路径 `./images/<图片名>`。
- **查看链接打不开**：查看链接为仓库中该 `.md` 的 blob 地址（`/[user]/[repo]/blob/[branch]/[docpath]`），仓库中存在该文件即可打开，需已登录 GitLab 且对该仓库有访问权限；该规则固定，不支持修改。
- **发布目录能不能改**：不能，固定为存储目录（默认 `docs`）；如需更换请删除账号后重新发布。
- **有没有「YAML 永久链接」开关**：没有。Vitepress 的路由由文件路径决定，不识别 Front Matter 中的链接字段，因此配置页不提供该开关。
- **线上没有新文章**：Vitepress 站点需要构建。确认仓库已绑定 GitLab CI / Pages / Vercel 等自动构建；仅推送 `.md` 不会直接改变已部署站点。
- **更新与删除**：点「更新」会重新提交该文章并产生一次新提交；「删除」会移除仓库中对应的 `.md`，站点需重新构建才会同步下线。