# GitLab Hugo 配置指南（草稿）

> TODO：待替换真实帮助文档链接。

通过 **GitLab API** 将文章发布到 GitLab 上的 **Hugo** 站点仓库。

## 一、准备

1. 一个可作为 Hugo 站点仓库的 **GitLab 仓库**（如 `hugo-blog`）。
2. 一个对该仓库有 **push 权限** 的 **GitLab 个人访问令牌（Personal Access Token）**（GitLab 右上角头像 → Preferences → Access Tokens，或访问 `/-/user_settings/personal_access_tokens`，勾选 `api` 或 `write_repository` 范围）。
3. 该仓库是一个标准 Hugo 项目（含 `hugo.toml` / `hugo.yaml` 与 `content/`、`static/` 目录）。

## 二、配置

| 字段 | 填什么 |
|------|--------|
| 平台首页 | 你的 GitLab 实例地址（自建实例填自己的域名，如 `https://gitlab.example.com`），用于拼出仓库地址 |
| API 地址 | GitLab API 地址，**与平台首页一致**；填写平台首页后会自动同步为该地址，平台首页留空时该地址也会被清空 |
| 用户名 | GitLab 用户名（owner），用于拼出仓库地址 |
| 鉴权 Token | GitLab 个人访问令牌（Personal Access Token），需对目标仓库有 push 权限 |
| git 仓库名 | Hugo 站点仓库名，与用户名组成 `<user>/<repo>`，如 `hugo-blog` |
| 默认分支 | 发布到的分支，默认 `main`，需与仓库实际分支一致 |
| 存储目录 | Hugo 文章存储目录，默认 `content/post`。发布后的 `.md` 会写入该目录 |
| 文件规则 | 文章文件名规则，默认 `[slug].md`（文章别名） |
| 文章预览规则 | 站点文章预览规则，默认 `/post/[postid].html`。Hugo 站点地址由站点配置的永久链接规则决定，此规则仅作查看参考 |
| 预览规则 | GitLab blob 预览规则，固定 `/[user]/[repo]/blob/[branch]/[docpath]`，查看链接即该 `.md` 在仓库中的地址，**不支持修改** |
| 发布目录 | 默认 `content/post`。该平台**不支持修改发布目录**（配置页为只读提示），如需更换请删除账号后重新发布 |
| YAML 永久链接 | 提供该开关；开启后把文章永久链接写入 Front Matter，供站点按自定义链接生成页面 |
| 图床 | 默认「当前平台」：图片提交到仓库 `static/images`，文章引用 `images/<图片名>` |

发布写入的 Front Matter 含 `title`、`slug`、`date`、`lastmod`、`tags`、`categories`、`keywords`、`description`（可在「YAML 预设配置」中覆盖）。

「YAML 预设配置」留空时，Hugo 平台会写入以下默认值：

```yaml
toc: true
isCJKLanguage: true
```

填入 JSON 片段（例如 `{"toc": false}`）时，改为逐键合并进 Front Matter。

## 三、图片约定（Hugo 静态资源目录）

- `imageStorePath = static/images` 是**仓库根目录**下的固定路径（不随文章目录变化），图片提交到该目录。
- Hugo 构建时会把 `static/` 下的资源**原样输出**到站点根目录，因此图片在站点上的地址是 `/images/<图片名>`。
- `imageLinkPath = images` 生成的引用为 `images/<图片名>`，构建产物中能正确解析到图片。
- 发布带图文章后，仓库中会同时出现 `content/post/<文件名>.md` 与 `static/images/<图片名>`。

## 四、验证与发布

1. 点「验证」→ 令牌、仓库、分支校验通过 → 保持「配置已保存并验证通过」。
2. 快速发布 → 选 GitLab Hugo → 发布。文章 `.md` 提交到 `content/post/[slug].md`。
3. 「查看文章」打开仓库 blob 地址；站点线上地址由 Hugo 构建决定，需站点已构建部署。
4. 带图发布时图片提交到 `static/images`，文章引用 `images/<图片名>`。

## 常见问题

- **验证通过但发布失败**：确认个人访问令牌对目标仓库有 push 权限（`api` 或 `write_repository` 范围），仓库名与分支填写正确。权限不足会收到 401/403。
- **自建 GitLab 该怎么填平台首页**：平台首页填你的实例地址（如 `https://gitlab.example.com`），API 地址会同步为该地址；令牌地址同样由实例地址拼出（`/-/user_settings/personal_access_tokens`），需在你自己实例的偏好设置里生成令牌。
- **图片要怎么发布**：图床默认「当前平台」，图片提交到仓库 `static/images`，文章中引用 `images/<图片名>`；Hugo 构建时把 `static/` 原样复制到站点根，构建产物能正常显示。
- **查看链接打不开**：查看链接为仓库中该 `.md` 的 blob 地址（`/[user]/[repo]/blob/[branch]/[docpath]`），仓库中存在该文件即可打开，需已登录 GitLab 且对该仓库有访问权限；该规则固定，不支持修改。
- **发布目录能不能改**：不能，固定为存储目录（默认 `content/post`）；如需更换请删除账号后重新发布。
- **线上没有新文章**：Hugo 是通过构建（`hugo`）从仓库内容生成站点的，仅推送 `.md` 不会直接改变已部署站点；确认仓库已配置自动构建（GitLab CI / Pages 等）并触发一次构建。
- **更新与删除**：点「更新」会重新提交该文章并产生一次新提交；「删除」会移除仓库中对应的 `.md`，站点需重新构建才会同步下线。