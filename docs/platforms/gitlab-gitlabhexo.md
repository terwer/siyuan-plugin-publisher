# GitLab Hexo 配置指南

通过 **GitLab API** 将文章发布到 GitLab 上的 **Hexo** 博客仓库。

## 一、准备

1. 一个可作为 Hexo 博客仓库的 **GitLab 仓库**（如 `hexo-blog`）。
2. 一个对该仓库有 **push 权限** 的 **GitLab 个人访问令牌（Personal Access Token）**（GitLab 右上角头像 → Preferences → Access Tokens，或访问 `/-/user_settings/personal_access_tokens`，勾选 `api` 或 `write_repository` 范围）。
3. 该仓库是一个标准 Hexo 项目（含 `_config.yml` 与 `source/` 目录）；如使用 GitLab Pages，仓库已配置对应的构建流水线。

## 二、配置

| 字段 | 填什么 |
|------|--------|
| 平台首页 | 你的 GitLab 实例地址（自建实例填自己的域名，如 `https://gitlab.example.com`），用于拼出仓库地址 |
| API 地址 | GitLab API 地址，**与平台首页一致**；填写平台首页后会自动同步为该地址，平台首页留空时该地址也会被清空 |
| 用户名 | GitLab 用户名（owner），用于拼出仓库地址 |
| 鉴权 Token | GitLab 个人访问令牌（Personal Access Token），需对目标仓库有 push 权限 |
| git 仓库名 | Hexo 博客仓库名，与用户名组成 `<user>/<repo>`，如 `hexo-blog` |
| 默认分支 | 发布到的分支，默认 `main`，需与仓库实际分支一致 |
| 存储目录 | Hexo 文章存储目录，默认 `source/_posts`。发布后的 `.md` 会写入该目录 |
| 文件规则 | 文章文件名规则，默认 `[slug].md`（文章别名） |
| 文章预览规则 | 站点文章预览规则，默认 `/post/[postid].html`。Hexo 站点地址由构建后的永久链接规则决定，此规则仅作查看参考 |
| 预览规则 | GitLab blob 预览规则，固定 `/[user]/[repo]/blob/[branch]/[docpath]`，查看链接即该 `.md` 在仓库中的地址，**不支持修改** |
| 发布目录 | 默认 `source/_posts`。该平台**不支持修改发布目录**（配置页为只读提示），如需更换请删除账号后重新发布 |
| YAML 永久链接 | 提供该开关；开启后把文章永久链接写入 Front Matter，供站点按自定义链接生成页面 |
| 图床 | 默认「当前平台」：图片提交到仓库 `source/images`，文章引用相对路径 `../images/<图片名>` |

发布写入的 Front Matter 含 `title`、`date`、`updated`、`excerpt`、`tags`、`categories`（可在「YAML 预设配置」中覆盖）。

「YAML 预设配置」留空时，Hexo 平台会写入以下默认值：

```yaml
comments: true
toc: true
```

填入 JSON 片段（例如 `{"toc": false}`）时，改为逐键合并进 Front Matter。

## 三、图片约定（Hexo 静态资源目录）

- `imageStorePath = source/images` 是**仓库根目录**下的固定路径（不随文章目录变化），图片提交到该目录。
- `imageLinkPath = ../images` 生成**相对文章所在目录**的引用 `../images/<图片名>`（文章位于 `source/_posts`，因此解析到 `source/images`）。
- Hexo 构建时会把 `source/images` 复制到站点根目录，文章页面位于站点根下一层，因此 `../images/<图片名>` 在**源码编辑器与构建产物中都能显示**。
- 发布带图文章后，仓库中会同时出现 `source/_posts/<文件名>.md` 与 `source/images/<图片名>`。

## 四、验证与发布

1. 点「验证」→ 令牌、仓库、分支校验通过 → 保持「配置已保存并验证通过」。
2. 快速发布 → 选 GitLab Hexo → 发布。文章 `.md` 提交到 `source/_posts/[slug].md`。
3. 「查看文章」打开仓库 blob 地址；站点线上地址由 Hexo 构建决定，需站点已构建部署。
4. 带图发布时图片提交到 `source/images`，文章引用 `../images/<图片名>`。

## 常见问题

- **验证通过但发布失败**：确认个人访问令牌对目标仓库有 push 权限（`api` 或 `write_repository` 范围），仓库名与分支填写正确。权限不足会收到 401/403。
- **自建 GitLab 该怎么填平台首页**：平台首页填你的实例地址（如 `https://gitlab.example.com`），API 地址会同步为该地址；令牌地址同样由实例地址拼出（`/-/user_settings/personal_access_tokens`），需在你自己实例的偏好设置里生成令牌。
- **图片要怎么发布**：图床默认「当前平台」，图片提交到仓库 `source/images`，文章中引用相对路径 `../images/<图片名>`；Hexo 构建后该目录会复制到站点根目录，源码与构建产物均可正常显示。
- **查看链接打不开**：查看链接为仓库中该 `.md` 的 blob 地址（`/[user]/[repo]/blob/[branch]/[docpath]`），仓库中存在该文件即可打开，需已登录 GitLab 且对该仓库有访问权限；该规则固定，不支持修改。
- **发布目录能不能改**：不能，固定为存储目录（默认 `source/_posts`）；如需更换请删除账号后重新发布。
- **线上没有新文章**：Hexo 是通过构建（`hexo generate`）从 `source/` 生成站点的，仅推送 `.md` 不会直接改变已部署站点；确认仓库已配置自动构建（GitLab CI / Pages 等）并触发一次构建。
- **更新与删除**：点「更新」会重新提交该文章并产生一次新提交；「删除」会移除仓库中对应的 `.md`，站点需重新构建才会同步下线。