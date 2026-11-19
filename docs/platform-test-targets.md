# 平台测试目标

`siyuan-plugin-publisher` 的全部平台来自 `SubPlatformType`（`src/platforms/dynamicConfig.ts`），共 **50 个**。本文记录每个平台在哪里验证，以及目前缺什么。

维护规则：新增平台时在本表追加一行；测试目标变更时同步改这里，不要只写在 issue 里。

## 一、GitHub 类（9 个）—— 全部覆盖

| 生成器 | `platformKey` | 测试仓库 | 分支 | 文章落点 |
|---|---|---|---|---|
| Hexo | `github_Hexo` | [terwer/hexo-blog](https://github.com/terwer/hexo-blog) | `main` | `source/_posts/*.md` |
| Hugo | `github_Hugo` | [terwer/hugo-blog](https://github.com/terwer/hugo-blog) | `main` | `content/posts/*.md` |
| Jekyll | `github_Jekyll` | [terwer/terwer.github.io](https://github.com/terwer/terwer.github.io) | **`gh-pages`** | `_posts/YYYY-MM-DD-*.md` |
| Quartz | `github_Quartz` | [terwer/quartz-blog](https://github.com/terwer/quartz-blog) | `main` | `content/*.md` |
| Vuepress | `github_Vuepress` | [terwer/terwer.github.io](https://github.com/terwer/terwer.github.io) | **`dev`** / **`test`** | `docs/**/*.md` |
| Vuepress2 | `github_Vuepress2` | [terwer/vuepress2-blog](https://github.com/terwer/vuepress2-blog) | `main` | `docs/**/*.md` |
| Vitepress | `github_Vitepress` | [terwer/vitepress-blog](https://github.com/terwer/vitepress-blog) | `main` | `docs/**/*.md` |
| Astro | `github_Astro` | [terwer/astro-blog](https://github.com/terwer/astro-blog) | `main` | `src/content/posts/*.md` |
| Docsify | `github_Docsify` | [terwer/docsify-blog](https://github.com/terwer/docsify-blog) | `main` | `*.md`（无构建） |

### `terwer.github.io` 为什么能顶两个

| 分支 | 内容 | 对应生成器 |
|---|---|---|
| `gh-pages` | Jekyll 站点（`_config.yml`、`_posts`、`_includes`、`_layouts`、`_sass`、`Gemfile`） | **Jekyll** |
| `dev` / `test` | VuePress 项目源（`package.json`、`docs/.vuepress/`） | **Vuepress (v1)** |
| `main` | 构建与部署脚本（`deploy.sh`、`utils/`） | — |

按生成器选分支，不要混用。

### 各仓库最小结构

**Jekyll（`gh-pages`）**

```
_config.yml    # title / description / theme / plugins
Gemfile        # jekyll ~> 4.3, minima, jekyll-feed
index.md       # layout: home
_posts/        # 插件写入 YYYY-MM-DD-title.md
```

**Vuepress 1（`dev` / `test`）**

```
package.json                  # vuepress ^1.9.10, scripts: dev/build
docs/README.md                # home: true
docs/.vuepress/config.js
```

**Docsify**

```
index.html     # 配置写在 window.$docsify
_sidebar.md
*.md           # 插件写入的页面
```

Docsify 无构建步骤，发布 = 提交 `.md` 文件，最适合自动化验证。

## 二、GitLab 类（8 个）—— 全部缺失

`Gitlabhexo`、`Gitlabhugo`、`Gitlabjekyll`、`Gitlabvuepress`、`Gitlabvuepress2`、`Gitlabvitepress`、`Gitlabastro`、`Gitlabdocsify`

目前没有可用的 GitLab 实例，也没有对应仓库。要覆盖需先：建本地 GitLab（或 GitLab.com 账号）→ 按上表同构建 8 个仓库 → 补进本表。

## 三、通用 API 类（5 个）

| 平台 | `platformKey` | 测试目标 | 状态 |
|---|---|---|---|
| Halo | `common_Halo` | 本地 Docker，**8091**（2.20.21） | ✅ 已就绪 |
| Halo | `common_Halo` | 本地 Docker，**8092**（2.9） | ✅ 已就绪 |
| Yuque | `common_Yuque` | 语雀账号知识库 | 需账号 |
| Notion | `common_Notion` | Notion workspace | 需账号 |
| Telegraph | `common_Telegraph` | 公开 API，无需账号 | 可直测 |
| Confluence | `common_Confluence` | Atlassian 实例 | 无 |

Halo 两套实例的账号在 `~/.dsh/secrets/halo2-local-*` / `halo29-local-*`，端口规划见 `D:\Users\Administrator\Documents\docker\halo2-docker\account.txt`。

## 四、Metaweblog 类（4 个）

| 平台 | `platformKey` | 测试目标 | 状态 |
|---|---|---|---|
| Metaweblog | `metaweblog_Metaweblog` | 通用协议 | 需目标站 |
| Cnblogs | `metaweblog_Cnblogs` | 博客园账号 | 需账号 |
| Typecho | `metaweblog_Typecho` | 本地 Typecho | 无 |
| Jvue | `metaweblog_Jvue` | 自有实例 | 无 |

## 五、WordPress 类（2 个）

| 平台 | `platformKey` | 测试目标 | 状态 |
|---|---|---|---|
| WordPress（自托管） | `wordpress_Wordpress` | 本地 Docker，**8090** | ✅ 已就绪 |
| WordPress.com | `wordpress_Wordpressdotcom` | WordPress.com 账号 | 需账号 |

本地 WordPress 账号在 `~/.dsh/secrets/wordpress-local-*`。

## 六、Web / Custom 类（9 个）

`Zhihu`、`Csdn`、`Wechat`、`Jianshu`、`Juejin`、`Haloweb`、`Yuqueweb`、`Bilibili`、`Xiaohongshu`

全部走网页 Cookie 认证，需要真实账号登录态。目前**均无测试目标**。Halo 网页版可复用本地 8091/8092 实例（Cookie 登录）。

## 七、文件系统类（10 个）

`LocalSystem`、`Ftp`、`Sftp`、`BaiduNetDisk`、`AliyunDrive`、`Weiyun`、`Doubao`、`OneDrive`、`GoogleDrive`、`Quark`

只有 `LocalSystem` 可本地验证；其余都需要各自网盘/协议服务，目前无测试目标。

## 八、System（1 个）

`system_Siyuan` —— 发回思源自身，不需要外部目标。

---

## 验证标准

对任何平台，验证「发布 → 回读 → 更新 → 删除」四步，缺一不可：

1. 发布一篇测试文章，回读确认标题、正文、状态与提交一致。
2. 更新标题与正文，回读确认字段都变了，且没有产生第二篇。
3. 插入一张图片，确认资源落盘且地址可访问。
4. 删除该文章，确认目标端消失。
5. 清理：测试产物必须删掉，不要留垃圾提交/文章。

**禁止**用「构建通过」「理论上可用」「建议人工确认」收尾。

## 凭据

所有凭据在 `~/.dsh/secrets/`，按名字读取，不要打印或写进评论。清单见该目录的 `README.md`。

GitHub 类统一使用 `github-agent-token`（terwer 身份）。验证中的提交要么回滚，要么在 PR 里说明。

## 汇总

| 类别 | 总数 | 已就绪 | 缺失 |
|---|---|---|---|
| GitHub 类 | 9 | 9 | 0 |
| GitLab 类 | 8 | 0 | 8 |
| 通用 API | 5 | 3（Halo×2、Telegraph 可直测） | 2 |
| Metaweblog | 4 | 0 | 4 |
| WordPress | 2 | 1（本地自托管） | 1 |
| Web/Custom | 9 | 0 | 9 |
| 文件系统 | 10 | 1（LocalSystem） | 9 |
| System | 1 | 1 | 0 |
| **合计** | **48** | **15** | **33** |

> 注：Halo 计两个实例但一个平台 key，故按平台 key 计 48 个唯一项（50 个枚举含 `NONE` 与重复的 Halo）。
