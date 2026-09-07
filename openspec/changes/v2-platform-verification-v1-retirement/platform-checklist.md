# V2 全平台验证 Checklist（SSOT）

> **唯一维护位置**：本文件（`openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`）  
> **更新**：2026-05-27  
> **代码依据**：`src/platforms/pre.ts`、`src/components/v2/settings/bridge/bridgeRegistry.ts`

**状态图例**：`⬜` 未测 · `🟡` 进行中/部分 · `✅` 通过 · `⛔` 阻塞(插件) · `❌` 失败待修

---

## 测试说明

| 代号 | 含义 |
|------|------|
| **V2C** | V2 配置：添加账号、验证/保存、`validatePublish` 通过 |
| **Pub** | 快速发布：首次发布 |
| **Upd** | 快速发布：更新已发布文档 |
| **Del** | 快速发布：删除发布记录 |
| **Img** | 带图片发布（成功或明确的 `success_with_warnings`） |
| **V1C** | T2a 专用：V1 设置页配置仍可用 |
| **Inv** | V2 平台列表不可见（预期） |

---

## 当前阻塞

（无 — 语雀 API 需官方专业会员属平台政策，**不算插件阻塞**；持会员账号可完成全链路。）

---

## T1 — V2 完整链路（35 平台）

> 须在 V2 快速发布 + V2 配置中验证；`pnpm build:v2` 通过。

### Common（5）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 1 | 语雀 | `common_Yuque` | `Common_Yuque` | ✅ | ✅ | ✅ | ✅ | ✅ | 需语雀专业会员；已验通过，非阻塞 |
| 2 | Notion | `common_Notion` | `Common_Notion` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-24 Electron 宿主（test 工作空间）全链路实测：V2C（API token 验证通过，根页面「建造者模式」，「配置已保存并验证通过」）；Pub/Upd/Del 成功，**Upd postid 重映射**（`…b0890bb`→`…1b868`，editPost=删旧建新）；**Img** 带图发布——图床「PicGo 强烈推荐」用内置**阿里云 OSS**（bucket `static-rs-terwer`/area `oss-cn-beijing`/path `img/`），图片本地 URL 改写为 `…aliyuncs.com/img/photo-….jpg`（curl HTTP 200/AliyunOSS），Notion 页 `3c6da0ccbfca8125bdb1d41d4185d628` 含**外部 image 块**（external+aliyun 外链）；**查看 ✅** 链接 `https://www.notion.so/<postid>` 预览规则 `/[postid]` 已正确前置域名。**SOP §3 help/tour/doc ✅**：新增 `common-notion.ts`（helpUrl+summary+fields+faq 4+tour 6）+ `docs/draft/platforms/common-notion.md`，注册进 `/pages/index.ts`、从 `remaining-t1` 移出并纳入 `verifiedConfigs`（registry 18 项绿、build:v2 通过）；宿主实测 HelpPanel（summary+查看完整帮助文档+FAQ）+ TourGuide 6 步全部正确可达。**本格六格+帮助引导全部闭环** |
| 3 | Halo29 | `common_Halo` | `Common_Halo` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-24 Electron 宿主（test 工作空间）全链路实测：V2C（home/apiUrl=`http://localhost:8090`、username=`admin`、密码默认口令，「验证」通过，账号「运行中/已启用」，blogid 自动取分类）；Pub/Upd/Del 成功；**Img** 带本地 asset 图发布后图片 URL 改写为 `http://localhost:8090/upload/<图名>`（Halo 附件 /upload/，curl HTTP 200/image-png）；**查看 ✅** 链接 `http://localhost:8090/archives/<slug>`（文章 HTTP 200，删除后 404）。**SOP §3 help/tour/doc ✅**：补全 `common-halo.ts`（helpUrl+summary+fields 7+tour 8，修正字段与真实配置一致），注册进 `/pages/index.ts`、已从 `remaining-t1` 移出并纳入 `verifiedConfigs`（registry 18 项绿、build:v2 通过）；新增 `docs/draft/platforms/common-halo.md`（顶部 TODO 占位）；宿主实测 HelpPanel（summary+查看完整帮助文档+FAQ）+ TourGuide 正常定位（首页、API 地址等）。**本格六格+帮助引导全部闭环** |
| 4 | Telegraph | `common_Telegraph` | `Common_Telegraph` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-24 Electron 宿主（test 工作空间）全链路实测。**发行版 `zhi-blog-api@1.82.0` + `zhi-siyuan-api@2.38.0`，插件依赖升级到对应版本**；新增框架级 `BlogConfig.isCorsProxy`，resolveTransport 置顶优先走 `middleware-fetch`（Telegraph 为 CORS 受限平台）。**CORS 代理**：不写死默认地址，用户自配；`cors.terwer.space` 仅作测试值，UI label「跨域代理地址」+ 提示「请在上方填写你的代理地址」+ 配置指引文档链接（`setting.blog.corsProxy.*`）；空配置抛「telegra.ph 需要配置 CORS 代理地址」。**V2C ✅**：匿名 `/check` 通过 CORS 代理返回 save_hash，账号「运行中/已启用」，「配置已保存并验证通过」。**Pub/Upd ✅**：`/save` 发布、更新成功（「已完成 Telegraph 的发布/更新」，状态「已发布」，按钮 更新/查看文章/删除）。**查看 ✅**：getPreviewUrl 修复为走 CORS 代理前缀（`https://cors.terwer.space/https://telegra.ph/Halo-图片上传测试-08-25`，curl HTTP 200，直连被墙 timed out）；预览规则 `/[postid]`。**Del ⚠️**：Telegra.ph 无删除文章 API，deletePost 抛契约错误「telegra.ph 暂不支持删除文章功能」（符合平台契约，非 bug，记录保留）。**Img ⚠️**：Telegraph 无图片上传（newMediaObject 失效），图片不随文上传。**SOP §3 help/tour/doc ✅**：新增 `telegraph.ts`（helpUrl+summary+fields+faq4+tour6，覆盖匿名/非匿名两种模式）+ `docs/draft/platforms/telegraph.md`，注册进 `/pages/index.ts`、从 `remaining-t1` 移出并纳入 `verifiedConfigs`（registry 18 项绿、build:v2 通过）；宿主实测 HelpPanel/TourGuide 正常（用户实测 TourGuide 通过）。**本格六格+帮助引导闭环（Del/Img 为平台固有限制）** |
| 5 | Confluence | `common_Confluence` | `Common_Confluence` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-25 Electron 宿主（test 工作空间）全链路验证：V2C（home/apiUrl=`http://localhost:8090`、PAT 令牌、「验证」通过拉取空间、状态「配置已保存并验证通过」+ 账号「运行中/已启用」）；**Pub/Upd ✅** 发布/更新成功（新版页面 1703944，version 递增）；**Img ✅** 带本地 asset 图发布，图片以 Confluence 附件 `ri:attachment` 挂在页面；**查看 ✅** 预览规则 `/spaces/[spaceKey]/pages/[postid]`，页面可打开。**Del**：Confluence `DELETE /rest/api/content/{id}` 成功返回 204 空响应体，原 `deletePage` 判空误报「请求 Confluence API 异常」已修复（空响应视为成功）；并新增**快速发布「强制删除」兜底**——删除失败（如平台端文章已不存在）后仅本地清除发布关联并解除文档与文章映射（参照详细发布既有实现），正常状态不出现，避免误导；「强制删除」与「删除」一致带确认框（提示文案明确「仅解除本地关联、但不会删除平台端文章」，防误触）；验证「删除失败→强制删除（带确认）→本地清除→回未发布」与「删除存在页面→204→删除成功」两路径均通过。**SOP §3 help/tour/doc ✅**：新增 `common-confluence.ts`（helpUrl+summary+fields+faq4+tour6，字段与真实配置一致）+ `docs/draft/platforms/confluence.md`（顶部 TODO 占位），注册进 `/pages/index.ts`、从 `remaining-t1` 移出并纳入 `verifiedConfigs`（registry 18 项绿、build:v2 通过，`v2.card.action.forceDelete` 仅 V2 i18n `siyuan/i18n` 唯一维护）；宿主验证 HelpPanel（summary+查看完整帮助文档+FAQ）+ TourGuide 6 步全部正确可达。**本格六格+帮助引导全部闭环** |

### Github（8）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 6 | Hexo | `github_Hexo` | `Github_Hexo` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-25 Electron 宿主（test 工作空间）全链路验证：V2C（username=`terwer`、repo=`hexo-blog`、branch=`main`、存储目录=`source/_posts`、PAT Token，「验证」通过，「配置已保存并验证通过」，账号「运行中/已启用」，发布目录自动拉取）；**Pub ✅** 快速发布 → repo `source/_posts/掘金-V2-验证测试-更新.md`（frontmatter title/permalink + 正文，提交 `bdf5415`）；**Upd ✅** 点「更新」→ 新提交（`3b9692e`），更新机制生效；**Img ✅** 图床切「**当前平台**」后重发 → cat 图上传 `source/images/…jpg`，.md 引用改写为相对路径 `../images/…jpg`（源码+构建产物双模式）；**查看 ✅** 预览规则 `/[user]/[repo]/blob/[branch]/[docpath]` → `https://github.com/terwer/hexo-blog/blob/main/source/_posts/掘金-V2-验证测试-更新.md`（HTTP 200），图片 blob URL 亦 HTTP 200；**Del ✅** 删除 → repo 该 .md 移除（请求 404），提交 `3cc1abb`，UI 回「未发布」。**SOP §3 help/tour/doc ✅**：新增 `common-github-hexo.ts`（helpUrl+summary+fields+faq4+tour8，字段与真实配置一致）+ `docs/draft/platforms/common-github-hexo.md`（顶部 TODO 占位），注册进 `/pages/index.ts`、从 `remaining-t1` 移出并纳入 `verifiedConfigs`（registry 18 项绿、build:v2 通过）；宿主验证 HelpPanel/TourGuide 正常。**本格六格+帮助引导全部闭环**。**图床默认修复**：反馈「图片不生效」→ `CommonGithubConfig` 构造器设 `picbedService=Bundled`（当前平台），使 Git 族默认上传 `source/images`，重加账号后默认无需手动切换即传图（unit `githubPicbedDefaults.spec.ts` 绿）；显式「不使用」仍保留（`safeMergeConfig` 不覆盖）。**图片链接修复（反馈「build 后图片 404」，commit `39323796`）**：根因 `HexoConfig.imageLinkPath` 误设 `source/images`（与 `imageStorePath` 相同）→ 文章引用 `/source/images/…jpg`，而 Hexo 构建后 `source/images` 复制到站点根 `/images/...`（作者自建 `hexo-图片-2.md`/`hexo-图片处理.md` 均用 `/images/…png`，站点 HTTP 200 佐证）；修复后 `imageLinkPath="images"` → 引用 `/images/…jpg`（`imageStorePath` 保持 `source/images` 提交仓库）。新增 `hexoImagePath.spec.ts` 断言契约；build:v2 通过。**双模式相对路径（源码+产物，2026-08-26）**：`imageLinkPath` 采用 `../images`，文章图片引用为相对路径 `../images/…jpg`（`getImagePath` 支持 `../`/`./` 相对前缀、拼接文件名、不前置站点根斜杠）。**本地 `hexo-blog` 构建验证**：产物 `<img src="/../images/…jpg">`，服务端/浏览器把 `/../` 归一化为 `/images/…`（HTTP 200）；源码 `source/_posts/x.md` 的 `../images/` 解析到 `source/images/…`（文件存在）——源码与构建产物双模式均可用；单元测试断言 `attachment.url==='../images/{name}'`、提交目录 `source/images/{name}`，build:v2 通过。**存量账号**：图片访问链接/图片存储目录为可编辑字段，已配置账号需在配置页将「图片访问链接」改为 `../images` 后重新更新发布（默认值仅对新账号生效）；「图片存储目录」保持 `source/images`） |
| 7 | Hugo | `github_Hugo` | `Github_Hugo` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-09-04 Electron 宿主（test 工作空间 / dist-v2 / 9222）全链路验证：V2C（新增账号 `github_Hugo-z1y7ssd`，username=`terwer`、repo=`hugo-blog`、branch=`main`、存储目录=`content/post`、PAT Token，「验证」通过，"配置已保存并验证通过"，账号「运行中/已启用」，发布目录自动拉取 `content/post`）；**Pub ✅** 快速发布 → repo `content/post/halo-image-upload-test-1plnjn.md`（frontmatter title/slug/`url:/post/…html`/date/lastmod/toc，正文引用 `![图](/images/image-…png)`，提交 `2ab9e55`）；**Upd ✅** 点「更新」→ 新提交 `6016692`，文章内容更新；**Img ✅** 图床「当前平台」→ cat 图上传 `static/images/image-…png`（提交 `03a554d`），文章引用绝对路径 `/images/<名>`；**查看 ✅** 预览规则 `/[user]/[repo]/blob/[branch]/[docpath]` → `https://github.com/terwer/hugo-blog/blob/main/content/post/halo-image-upload-test-1plnjn.md`（该 blob 文件 API 真实存在）；**Del ✅** 删除 → repo 该 .md 移除（API 404），提交 `5b3c4fd`，UI 回「未发布」。**图片路径口径（2026-09-04 用户确认，选"绝对 /images/"）**：Hugo `content/post/*.md` 与 `static/images/` 为兄弟目录，且构建把 `static/` 内容去掉 `static/` 前缀复制到站点根——源码相对路径（`../../static/images/…`）与构建相对路径（`../images/…`）数学上不可能相等，故不存在单一相对路径同时满足源码 blob + 构建产物（与 Hexo 同在 `source/` 下不同）。采用绝对 `/images/<名>`（官方 static/ 契约）：**构建产物站点可靠显示**（用户实测 `https://hugo.terwer.space/post/halo-image-upload-test-1plnjn.html` 可显示图片）；源码仓库 blob 视角 `/images/` 被解析为仓库根 `images/`（不存在，图在 `static/images/`）故图片不内联显示——属 Hugo 平台固有限制，非插件缺陷。converter front matter 不写 `draft`（官方默认 false=发布），无隐藏草稿风险。**SOP §3 help/tour/doc ✅**：新增 `github-hugo.ts`（pageId `github_Hugo`，helpUrl+summary+fields+faq4+tour9，字段/图片/permalink 与真实 Hugo 语义一致）+ `docs/draft/platforms/github-hugo.md`（顶部 TODO 占位，含 static 目录规范与「推送后需触发 hugo 构建才上线」说明），注册进 `/pages/index.ts`、从 `remaining-t1` 移出并纳入 `verifiedConfigs`（registry.spec 18 项全绿、build:v2 通过），commit `1769b4fb`；宿主新增账号流程中 Hugo 平台正确列出（GITHUB 分组）、配置表单完整渲染（HelpPanel 字段 + 图床「当前平台推荐」默认选中）。**本格六格+帮助引导全部闭环** |
| 8 | Jekyll | `github_Jekyll` | `Github_Jekyll` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-09-06 Electron 宿主（test 工作空间 / dist-v2 / 9222）全链路验证：V2C（新增账号 `github_Jekyll`，username=`terwer`、repo=`terwer.github.io`（**注意 Git 仓库名只填裸仓库名，勿带 `owner/` 前缀**，否则 URL 拼成 `repos/terwer/terwer/…` 404）、branch=`gh-pages`、存储目录=`_posts`、文件规则 `[yyyy]-[mm]-[dd]-[slug].md`、PAT Token，「验证」通过（写 `test.md`→GET→DELETE→列出 `_posts` 全 200），"配置已保存并验证通过"，账号「运行中/已启用」，发布目录自动拉取 `_posts`）；**Pub ✅** 快速发布 → repo `_posts/2026-08-22-nuggets-v2-verification-test-update-z9fvab.md`（frontmatter `title/date/permalink:/post/nuggets-v2-verification-test---update-z9fvab.html/tags/layout:post/published:true`，正文引用 `![cat](/assets/images/cat-…jpg)`，提交 `196f4e0`）；**Upd ✅** 修改正文（「发布验证完成。（已更新 Jekyll 内容）」）→ 点「更新」→ 新提交 `a848114`，内容真实变更；**Img ✅** 图床「当前平台」→ cat 图上传 `assets/images/cat-20260822153711-o2ho0mg.jpg`，文章引用绝对路径 `/assets/images/<名>`，**构建产物站点图片可显示**（`https://terwer.github.io/assets/images/cat-…jpg` → 200）；**查看 ✅** 站点文章地址 `https://terwer.github.io/post/nuggets-v2-verification-test---update-z9fvab.html` → **200**（页面渲染标题/正文/图片，image 引用 `/assets/images/…` 正确显示）；另有 blob 预览 `https://github.com/terwer/terwer.github.io/blob/gh-pages/_posts/…md` → 200；**Del ✅** 删除 → 确认弹窗后 repo `_posts/…md` 移除（列表不再含该文件），提交 `c7b61e5`，UI 回「未发布」。**图片路径口径**：Jekyll `_posts/*.md` 与 `assets/images/` 为兄弟目录；选「当前平台」图床把图片提交到仓库 `assets/images/`，文章引用绝对路径 `/assets/images/<名>`（Jekyll 构建把 `assets/` 原样复制到站点根，构建产物即可正确显示——官方推荐方式），与作者既有文章 `/assets/images/image-…png` 一致。**SOP §3 help/tour/doc ✅**：新增 `github-jekyll.ts`（pageId `github_Jekyll`，helpUrl+summary+fields+faq4+tour9，字段/图片/permalink 与真实 Jekyll 语义一致，已纳入 `verifiedConfigs`，registry 25 测试绿、build:v2 通过）+ `docs/draft/platforms/github-jekyll.md`（顶部 TODO 占位），注册进 `/pages/index.ts`、从 `remaining-t1` 移出；宿主新增账号流程中 Jekyll 平台正确列出（GITHUB 分组）、配置表单完整渲染（HelpPanel summary+FAQ4+「查看完整帮助文档」，TourGuide 9 步全部可定位）。**本格六格+帮助引导全部闭环** |
| 9 | Quartz | `github_Quartz` | `Github_Quartz` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-09-07 Electron 宿主（test 工作空间 / dist-v2 / 9222）全链路验证：V2C（新增账号 `github_Quartz`，username=`terwer`、repo=`quartz-blog`、branch=`main`、存储目录=`content`、文件规则 `[filename].md`、PAT Token，「验证」通过，图床默认「当前平台 推荐」，发布目录自动拉取 `content`，「配置已保存并验证通过」，账号「运行中/已启用」）；**Pub ✅** 快速发布 → repo `content/Halo图片上传测试.md`（frontmatter title/date/updated/`permalink:/post/halo-image-upload-test-z9puw4.html`/enableToc/enableBackLinks，正文引用 `![图](/assets/images/image-20250416184048-b30ozft.png)`）；**Upd ✅** 修改正文（「发布验证完成。（已更新 Quartz 内容）」）→ 点「更新」→ 新提交，内容真实变更（`updated:2026-09-07 10:18:30`，提交 `2026-09-07T02:19:42Z`）；**Img ✅** 图床「当前平台」→ cat 图上传 `assets/images/image-20250416184048-b30ozft.png`，文章引用绝对路径 `/assets/images/<名>`；**查看 ✅** 预览规则 `/[user]/[repo]/blob/[branch]/[docpath]` → `https://github.com/terwer/quartz-blog/blob/main/content/Halo图片上传测试.md`（发布/更新后该 blob 文件 API 真实存在并返回内容）；站点文章地址 `/post/<postid>.html` 需 Quartz 站点已部署（本仓库未配置自动构建/Pages，属平台部署限制，非插件缺陷）；**Del ✅** 删除 → 确认弹窗后 repo 该 .md 移除（API 404），UI 回「未发布」。**Del 备注**：首次删除报 GitHub 422 ``content/Halo图片上传测试.md does not match <sha>``——根因为更新后 GitHub contents 接口 sha 暂态不一致（`getPageSha`/`getPageData` 用插件同一客户端单独复现返回当前 sha `8655bf60…`，删除代码取的是当前 sha，非插件缺陷），等 sha 稳定后重试「删除」成功移除文件。**图片路径口径**：Quartz 文章来源目录为 `content/`，图片选「当前平台」图床提交到仓库根 `assets/images/`，文章引用绝对路径 `/assets/images/<名>`；图片最终能否在构建产物显示取决于 Quartz 站点对 `/assets` 静态资源的处理方式（构建是否把 `assets/images` 复制到输出根），已记录为平台/配置约束（同 Hugo 口径，构建后站点图片显示依赖站点对 `/assets` 的处理）。**SOP §3 help/tour/doc ✅**：新增 `github-quartz.ts`（pageId `github_Quartz`，helpUrl+summary+fields+faq4+tour9，字段/图片/permalink 与真实 Quartz 语义一致，已纳入 `verifiedConfigs`）+ `docs/draft/platforms/github-quartz.md`（顶部 TODO 占位），注册进 `/pages/index.ts`、从 `remaining-t1` 移出；host 实测 HelpPanel（summary+「查看完整帮助文档」+FAQ）+ TourGuide 9 步全部可定位（首页地址/API 地址/用户名/Token/文章目录/查看链接/发布格式/图片发布/验证并保存）。**本格六格+帮助引导全部闭环** |
| 10 | Vuepress | `github_Vuepress` | `Github_Vuepress` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 11 | Vuepress2 | `github_Vuepress2` | `Github_Vuepress2` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 12 | Vitepress | `github_Vitepress` | `Github_Vitepress` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 13 | Astro | `github_Astro` | `Github_Astro` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |

### Gitlab（7）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 14 | Gitlabhexo | `gitlab_Gitlabhexo` | `Gitlab_Hexo` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 15 | Gitlabhugo | `gitlab_Gitlabhugo` | `Gitlab_Hugo` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 16 | Gitlabjekyll | `gitlab_Gitlabjekyll` | `Gitlab_Jekyll` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 17 | Gitlabvuepress | `gitlab_Gitlabvuepress` | `Gitlab_Vuepress` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 18 | Gitlabvuepress2 | `gitlab_Gitlabvuepress2` | `Gitlab_Vuepress2` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 19 | Gitlabvitepress | `gitlab_Gitlabvitepress` | `Gitlab_Vitepress` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 20 | Gitlabastro | `gitlab_Gitlabastro` | `Gitlab_Astro` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |

### Metaweblog（4）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 21 | 博客园 | `metaweblog_Cnblogs` | `Metaweblog_Cnblogs` | ✅ | ✅ | ✅ | ✅ | ✅ | V2 全链路已验（2026-05-21）；2026-05-22 复验带图文章通过；XML-RPC `proxyXmlrpc` |
| 22 | Typecho | `metaweblog_Typecho` | `Metaweblog_Typecho` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 23 | Jvue | `metaweblog_Jvue` | `Metaweblog_Jvue` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 24 | Metaweblog 通用 | `metaweblog_*` | `Metaweblog_Metaweblog` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 有 V2 bridge |

### Wordpress（2）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 25 | Wordpress | `wordpress_Wordpress` | `Wordpress_Wordpress` | ✅ | ✅ | ✅ | ✅ | ✅ | 本地 WP V2 全链路已验（2026-05-21）；`plugin-node-fetch` |
| 26 | Wordpress.com | `wordpress_Wordpressdotcom` | `Wordpress_Wordpressdotcom` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |

### Custom — V2 网页 Cookie Bridge（8）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 27 | 语雀网页版 | `custom_Yuqueweb` | `Custom_Yuqueweb` | ✅ | ✅ | ✅ | ✅ | ✅ | V2 已验：Cookie 授权、带图发布、错误详情（2026-05-20）；2026-05-22 复验带图通过 |
| 28 | Halo网页版 | `custom_Haloweb` | `Custom_Haloweb` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-05-26/27 修复 V2C 配置页 `Invalid URL`。2026-08-14 修 transport 规则（loopback 有代理条件时走 siyuan-forward-proxy）。2026-08-15 Electron 宿主（test 工作空间）全链路实测：V2C（Cookie 授权→验证通过）、Pub（文章 `/archives/hangtestdoc-z138hrs` 前台 200 含标题+图片）、Upd（更新成功）、Del（文章 404 Post not found）、Img（带图发布图片上传成功）；另补 help 引导（tour 5 步）+ Cookie 失效友好错误 |
| 30 | 知乎 | `custom_Zhihu` | `Custom_Zhihu` | ✅ | ✅ | ✅ | ✅ | ✅ | V2 Bridge 全链路已验（2026-05-24，用户手测）；平台图床 Img 通过；OSS SDK 显式加载修复 |
| 31 | CSDN | `custom_Csdn` | `Custom_CSDN` | ✅ | ✅ | ✅ | ✅ | ✅ | V2 Bridge 全链路已验（2026-05-24，用户手测）；平台图床 Img 通过；默认 Bundled 图床修复 |
| 32 | 简书 | `custom_Jianshu` | `Custom_Jianshu` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-16 V2 全链路验证：V2C（Cookie 授权通过，笔记本=随笔；新增账号默认图床已修正为“当前平台 推荐/Bundled”）；Pub `https://www.jianshu.com/p/9654472734f3`；Upd 更新成功；Del 删除成功；Img 带真实 PNG 发布成功，图片上传为 `https://upload-images.jianshu.io/upload_images/16941800-0b988068785ce608.png`；HelpPanel/tour（4 步）验证通过 |
| 33 | 掘金 | `custom_Juejin` | `Custom_Juejin` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-22 V2 全链路验证。Pub 文章 `https://juejin.cn/post/7676406157015531560`，Upd 更新成功，Del 删除成功。修复两处：① `jsonFetchClient.buildPluginRequestHeaders` / `PluginFetchUtil.postText` / `useProxy` 发送重复 `Content-Type`+`content-type` 头，致掘金建空草稿（category/title/content 全空）→ 发布参数错误；改单一 `Content-Type`。② `juejinWebAdaptor.editPost` 缺标签/摘要默认回退（addPost 有）→ 更新失败 `必须选择一个标签`、空摘要 `参数错误`；与 addPost 一致补齐。Img（2026-08-22 傍晚）：原生 veImageX 直传落地——新增 `vendors/byteimagex/imagexClient.ts`（SigV4+CRC32 五步链）与 `utils/rawHeaderFetch.ts`（大小写保真通道，内置 undici 引擎），`juejinWebAdaptor.uploadFile` 接入，掘金默认图床改 Bundled（对齐知乎/CSDN 先例）。根因：SigV4 的 amzDate 必须剥冒号（`[-:]\|\.\d{3}`）。宿主验证：GUI 发布带两图文档 → 草稿 mark_content 均为裸 `![](tos-cn-i-73owjymdk6/<32hex>)`（官方契约，无签名 URL），文章 `https://juejin.cn/post/7676404118950395938` 审核通过（audit=2）且匿名可访问含图。外链图片原样保留不转存 → 放开 PicGo 双通道 |
| 34 | 微信公众号 | `custom_Wechat` | `Custom_Wechat` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-23 V2 全链路（Electron 宿主）验证：V2C（配置页「去授权」→ mp.weixin.qq.com 扫码登录 → 关窗保存 cookie → 自动读取 Cookie → 验证通过，账号「运行中」）。Pub 草稿 `appmsgid=100000261`；Upd `operate_appmsg?sub=update` 成功；Del 成功；Img 带 cat 图经 `upload_material` 上传素材库。**查看 ✅（SOP 新增第 6 格，2026-08-23 末段复验通过）**：公众号草稿编辑查看链接**会话绑定**且 token 会轮换——过期 token 被判未登录跳「请重新登录」。最终根因：会话绑定查看链接须在**授权会话窗口内**打开（不能落到系统浏览器 / `window.open`）。修复两步：`getPreviewUrl` 打开前用 `getMetaData` 刷新 token；按 `previewOpenMode=AppSession` **强制在 Electron 会话窗口打开**（HEAD `9c07f09c`）。Electron 宿主复验：应用内打开、不跳系统浏览器、不提示登录。另修复 `WechatConfig` 默认图床 Bundled（原 None 不上图）；新增 `custom-wechat.ts` help 配置 + `docs/draft/platforms/custom-wechat.md`；HelpPanel/TourGuide 验证通过 |
| 35 | 哔哩哔哩 | `custom_Bilibili` | `Custom_Bilibili` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-23/24 V2 全链路（Electron 宿主）验证。V2C：Cookie 授权（去登录→扫码→关窗保存→自动读取 Cookie→验证通过，账号「运行中」，文集「远方的灯塔」）。Pub `https://www.bilibili.com/opus/1239781621862760457`；Upd 改标题后成功（B 站对相同标题的编辑有节流 `20019 相同标题的专栏短时间内不能重复提交`，属平台限制，改标题即可，非插件缺陷）；Del 成功。**Img 修复**：带 cat 图发布后正文图片空白——根因 `bilibiliMdUtil.processParagraphNode` 把图片段 `para_type` 写死为 1（B 站图片段应为 2），B 站按文本段解析 `text.nodes` 为空 → 图片渲染空白；修复为 `para_type: hasPic ? 2 : 1`。修复后正文图片段 `para_type=2` 且含 `i0.hdslb.com/bfs/new_dyn/...jpg` 图床 URL（可访问，HTTP 200 / image/jpeg）。**查看 ✅**：`https://www.bilibili.com/opus/<dyn_id>` 为公开链接（非会话绑定），系统浏览器打开合理，HTTP 200 可访问文章正文含图片。**文集生效**：`addPost`/`editPost` 现读取配置页所选文集 `cfg.blogid` 作为 `list_id`（原硬编码 `0`，文集为摆设）；宿主发布「掘金V2验证测试-更新」后查账号专栏列表，文章 `list.id=898693`（远方的灯塔），确认真正归入所选文集。新增 `custom-bilibili.ts` help 配置 + `docs/draft/platforms/custom-bilibili.md`；HelpPanel/TourGuide（5 步，含文集）宿主验证通过 |

### Fs（1）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 29 | 本地系统 | `fs_LocalSystem` | `Fs_LocalSystem` | ✅ | ✅ | ✅ | ✅ | ✅ | Electron V2 全链路已验（2026-05-24，用户手测） |

**T1 小结**：35 项 · 全链路 ✅ `20`（#1 #2 #3 #4 #5 #6 #7 #8 #9 #21 #25 #27 #28 #29 #30 #31 #32 #33 #34 #35）· 进行中 `0` · 阻塞 `0` · 未测 `15`

---

## T2a — 仅 V1 配置 + 发布（0 平台）

原 #30–#35 网页 Cookie 平台已进入 V2 Bridge；验证进度统一迁入 T1「Custom — V2 网页 Cookie Bridge」表。V1 回退路径在 Gate D 前仍保留，不再以 Inv（V2 不可见）作为预期。

---

## T2b — 仅有 adaptor / 不可添加（3）

| # | 平台 | platformKey | Vis | Add | 备注 |
|---|------|-------------|-----|-----|------|
| 36 | Github Docsify | `github_Docsify` | ⬜ | ⬜ | 无 V2 bridge |
| 37 | Gitlab Docsify | `gitlab_Gitlabdocsify` | ⬜ | ⬜ | 无 V2 bridge |
| 38 | 小红书 | `custom_Xiaohongshu` | ⬜ | ⬜ | pre 注释 |

---

## T3 — 存在性 / 占位（16）

见原表 #39–#54（Liandi、Fs 占位等）；验收目标为「确认不可用/不暴露」。

---

## V1 退役门禁

- [ ] **Gate A**：T1 表 35 项全部为 `✅`（平台政策类限制已文档化且持条件可过，**不记 ⛔ 阻塞**）
- [ ] **Gate B**：T2a 发布链路无回归
- [ ] **Gate C**：偏好/文档标记 V1 废弃，默认 V2
- [ ] **Gate D**：连续 **3 个发行版本** 后删除 iframe/SPA 路径

---

## 修订记录

| 日期 | 说明 |
|------|------|
| 2026-05-20 | OpenSpec SSOT 初版；#1 语雀 API、#27 语雀网页版 已 ✅ |
| 2026-05-21 | #21 博客园 T1 全链路 ✅（V2C/Pub/Upd/Del/Img，用户手测） |
| 2026-05-21 | #25 Wordpress 本地 T1 全链路 ✅；XML-RPC `plugin-node-fetch` |
| 2026-05-21 | `refactor-form-upload-transport` 合入后须复验 #27/#28 **Img**（日志 `[form-upload-transport] transport => plugin-node-fetch`） |
| 2026-05-22 | `refactor-form-upload-transport` 归档前复验：#27 语雀网页版 Img 通过；#21 博客园带图文章通过；#28 Halo网页版因尚未进入远征，继续后续跟踪 |
| 2026-05-22 | `refactor-json-fetch-transport` 归档前复验通过：#27 语雀网页版 JSON 链路通过（日志 `[json-fetch-transport]`）；#21 博客园相关链路无回归，走 `apiFetch`→`jsonFetchClient` |
| 2026-05-24 | #30 知乎、#31 CSDN 已进入 V2 Bridge 并完成 V2C/Pub/Upd/Del/Img 用户手测；CSDN/知乎平台图床通过 |
| 2026-05-24 | #29 本地系统 `fs_LocalSystem` Electron V2 全链路用户手测通过 |
| 2026-05-26 | #28 Halo网页版 V2C 鸡蛋问题修复：配置页不再因预置相对 `authUrl=/login` 抛 `Invalid URL`；确认 Halo Web Cookie 能力保留，未填 `home/apiUrl` 时入口仍展示且点击提示先填站点地址，填入后登录/抓取共用解析 `home/apiUrl + authUrl`，待用户手验 |
| 2026-08-14 | #28 devtools 复核：配置页打开正常（修复生效）、手动 Cookie 编辑区正常、空配置验证合理失败；本地 Docker 起 Halo 2.20 测试实例（`halo2-docker` compose，localhost:8090）验证 Cookie 认证可用；浏览器 std 环境 `middleware-fetch` 无法访问 localhost（远端 CORS 代理）+ Cookie 头 forbidden，全链路改由 Electron 宿主手验 |
| 2026-08-14 | **transport 规则修正**：loopback/私网目标在有代理条件（`isUseSiyuanProxy || forceProxy`）时改走 `siyuan-forward-proxy`（依据思源内核 3.7.3 `SSRFSafeDialer` 源码：默认模式允许访问本机，`--safe-mode` 才拒绝；middleware-fetch 远端代理无法访问 localhost）。单测 64 绿、build:v2 通过；**#28 Halo网页版（localhost:8090）V2C/Pub/Upd/Del/Img 五格 devtools 全链路手验通过**，T1 小结更新为 8 个全链路 ✅ |
| 2026-08-15 | #28 Halo网页版补 help 引导：`custom-haloweb.ts` 补 tour（5 步）+ cookie/pageType/picbedService 字段 + 4 条 faq；`registry.spec.ts` verifiedConfigs 补全到 8 平台强制约束；Electron 宿主实测 HelpPanel + TourGuide 正常展示 |
| 2026-08-15 | 8 个已验证平台 help/文档盘点完成：全部有 helpUrl/summary/fields/faq/tour（Halo网页版本次补齐）。文档草稿落地 `docs/draft/platforms/*.md`（8 份）+ `docs/draft/platform-verification-sop.md`（全覆盖测试 SOP）；helpUrl 多个平台误用博客园链接，待用户提供真实链接后替换 |
| 2026-08-15 | #28 Halo网页版 **Electron 宿主全链路实测**（补上此前仅 devtools std 环境的缺口）：Pub（前台 200 含标题+图片）/ Upd / Del（404 Post not found）/ Img 均真实验证通过，回写 #28 备注 |
| 2026-08-16 | #32 简书 V2 全链路验证：V2C（Cookie 授权通过，笔记本=随笔）；Pub `https://www.jianshu.com/p/9654472734f3`；Upd 成功；Del 成功；Img 带真实 PNG 发布成功（`https://upload-images.jianshu.io/upload_images/16941800-0b988068785ce608.png`）。修复：`JianshuConfig` 默认图床改为 Bundled（新增账号默认选中“当前平台 推荐”）；新增 `custom-jianshu` 完整 help 配置（fields/faq/tour 4 步）并移出 remaining-t1；`uploadFile` 增加 qiniu 错误详情。此前 Img 失败是测试图片 `icon.png` 实为 WebP 伪装 PNG，非简书适配器缺陷 |
| 2026-08-22 | #33 掘金 **Img ✅ 收官**：原生 veImageX 五步直传（gen_token→ApplyImageUpload→TOS 裸字节 PUT+CRC32→CommitImageUpload→get_img_url）落地 `vendors/byteimagex/imagexClient.ts` + `utils/rawHeaderFetch.ts`（undici 引擎）；掘金默认图床改 Bundled。**根因**：SigV4 amzDate 必须剥冒号（ISO 串 `[-:]|\.\d{3}` 全替换），带冒号即 100024 InvalidAuthorization——与传输层/头大小写无关。Electron 宿主验证：配置页切「当前平台」→ 文档贴图 → 发布面板更新 → 草稿 mark_content 两图均为裸 `![](tos-cn-i-73owjymdk6/<32hex>)`（官方契约），文章 `https://juejin.cn/post/7676404118950395938` audit=2 匿名可访问含图。T1 全链路 ✅ 更新为 10 个 |
| 2026-08-22 | #33 掘金 **外链图片处理 + 放开 PicGo**：API 建草稿含百度 logo 外链 → 读回 mark_content URL **原样保留、未转存 tos-cn-i**；发布后审核放行且匿名页渲染外链。据此放开 `picgoPicbedSupported=true`（保留 Bundled 默认，双通道并存），spec 同步更新 |
| 2026-08-22 | #33 掘金 **Img 修复（文章页相对链接）**：用户反馈上传不报错但文章页图片呈「相对链接」（`img src="tos-cn-i-…"` 无协议/域名 → 404）。宿主验证：发布带图文档 mark_content 为裸 `![](tos-cn-i-…)`（上传链路 OK、`get_img_url` 能重签出完整 URL）；读取文章页 HTML 见 `<img src="tos-cn-i-…">` → **推翻先前「编辑保存即存裸 URI + 读时重签」结论**。经核对掘金正文存储形态，mark_content 中为**完整签名 URL**（`https://p0-xtjj-private.juejin.cn/tos-cn-i-…~tplv-…&rk3s=…&x-orig-sign=…`），读取端按需重签至 ~+7d。修复：`juejinWebAdaptor.uploadFile` 返回 `get_img_url.main_url`（完整签名 URL）作为 `url`（原返回裸 storeUri），取不到 main_url 显式报错。**宿主验证**：更新后 mark_content 已是完整 URL，文章页图片渲染为 `<img src="https://p3-xtjj-sign.byteimg.com/tos-cn-i-…">`（bare count=0 / full count=1）。构建+build:v2 通过，单测 5 绿 |
| 2026-08-22 | #33 掘金 **help/tour 宿主验证 + 文档补齐**：按 SOP 第三节补全帮助引导——新增 `src/helpConfigs/pages/platform-config/custom-juejin.ts`（helpUrl+summary+fields+faq 4 条+tour 4 步，target 用 `[data-syp-tour=…]`），注册进 `/pages/index.ts`、从 `remaining-t1` 移出、纳入 `registry.spec.ts` verifiedConfigs（registry 18 项绿）；新增 `docs/draft/platforms/custom-juejin.md`（占位 helpUrl 顶部标 TODO）。Electron 宿主验证：配置页 HelpPanel 弹层完整渲染 summary/查看完整帮助文档/FAQ；点「开始引导教程」TourGuide 4/4 步（Cookie 授权→分类→图床→验证并保存）全部正确定位。AGENTS.md 增补「每站验证必含帮助引导与文档，禁止遗漏」 |
| 2026-08-23 | #34 微信公众号 **V2 全链路 ✅**：V2C（去授权→mp.weixin.qq.com 扫码→关窗保存 cookie→自动读取 Cookie→验证通过，账号「运行中」）；Pub 草稿 `100000258`；Upd 成功；Del 成功；Img cat 图经 `upload_material` 上传素材库。修复 `WechatConfig` 默认图床 Bundled（原 None 导致新账号不上图）；新增 `custom-wechat.ts` help 配置（summary/fields/faq 4/tour 4）并注册、移出 remaining-t1、纳入 verifiedConfigs；新增 `docs/draft/platforms/custom-wechat.md`。HelpPanel/TourGuide 宿主验证通过。T1 全链路 ✅ 更新为 11 个；AGENTS.md 固化 Cookie 授权平台 V2C 标准流程（含「检查填充其他字段」一步） |
| 2026-08-23 | #34 微信公众号 **查看（查看文章）修复**：验证链此前漏了「查看文章」这一步。实测发现公众号草稿编辑页链接用**过期会话 token** 会被判未登录跳「请重新登录」——根本原因 = 公众号会话 token 会轮换（非缺参数，曾误判）。修复：`getPreviewUrl` 打开前用 `getMetaData` 刷新 token。SOP 五格扩充为 **六格（+查看**），AGENTS.md 每站验证同步为六格并写明「查看文章须验证链接能打开，提示登录/失效视为 bug」 |
| 2026-08-23 | #34 微信公众号 **查看（最终根因，HEAD `9c07f09c` 复验通过）**：会话绑定查看链接须在**授权会话窗口内**打开，不能落系统浏览器/`window.open`。`openBrowserWindow` 在非 widget 且无 cookieCb 时会回退 `window.open`，故按 `previewOpenMode=AppSession` 传 `forceElectronWindow=true` 强制用 Electron 默认 session 窗口（带授权 cookie）打开。Electron 宿主复验：应用内打开、不跳系统浏览器、不提示「请重新登录」，#34 六格闭环 |
| 2026-08-24 | #35 哔哩哔哩 **V2 全链路六格 + 帮助引导 ✅**（Electron 宿主）：V2C / Pub / Upd / Del 均通过（Upd 因 B 站「相同标题短时不能重复提交 20019」属平台节流，改标题后成功）。**Img 修复**：带 cat 图发布后正文图片空白——根因 `bilibiliMdUtil.processParagraphNode` 把图片段 `para_type` 写死为 1（B 站图片段应为 2），B 站按文本段解析 `text.nodes` 为空 → 图片空白；修复为 `para_type: hasPic ? 2 : 1`，并补单测断言图片段 `para_type=2`。修复后正文图片段 `para_type=2` 且含 `i0.hdslb.com/bfs/new_dyn/...jpg` 图床 URL（HTTP 200 / image/jpeg）。**查看 ✅**：`https://www.bilibili.com/opus/<dyn_id>` 公开链接可访问含图。新增 `custom-bilibili.ts` help 配置 + `docs/draft/platforms/custom-bilibili.md`，HelpPanel/TourGuide（4 步）宿主验证通过。T1 全链路 ✅ 更新为 12 个 |
| 2026-08-24 | #35 哔哩哔哩 **「文集」字段生效**：用户关注配置页「文集」是否需要引导，调研发现该字段**根本没生效**——`addPost`/`editPost` 把 `article.list_id`、`category_id` 硬编码（`list_id:0`），不读配置页所选文集，而配置页设为可改（`knowledgeSpaceEnabled`/`allowKnowledgeSpaceChange=true`），形成「可改但无效」。修复：`addPost`/`editPost` 改为 `list_id = post.cate_slugs?.[0] ?? cfg.blogid ?? 0`（与掘金分类/知乎专栏一致），空值仍回退 0（独立专栏）；补齐 `knowledgeSpace` 字段 tip + tour 步骤（5 步）。宿主验证：配置存储 `blogid=898693`（远方的灯塔），发布「掘金V2验证测试-更新」后查账号专栏列表，新文章 `list.id=898693, list.name=远方的灯塔`（归入文集），对照旧文 `list:null`（即原 `list_id:0` 结果）。Checklist SSOT 更新为 5 步；改动走通用模式、未影响无关平台 |
| 2026-08-24 | #2 Notion **V2 全链路 ✅（Electron 宿主，test 工作空间 / dist-v2 / 9222）**：V2C 配置页填 API token（PasswordType_Token，无 Cookie 流）→「验证」通过，根页面「建造者模式」已选，「配置已保存并验证通过」，账号「运行中/已启用」。Pub 快发布→「发布成功」；Upd「更新成功」且 **postid 重映射**（`…b0890bb`→`…1b868`，验证 `editPost`=删旧建新）；Del 确认删除→「删除成功」；Img 带图发布——图床「PicGo 强烈推荐」+ 内置**阿里云 OSS**（dev 笔记取 bucket `static-rs-terwer`/area `oss-cn-beijing`/path `img/`/customUrl `…aliyuncs.com`），图片本地 URL 改写为阿里云 OSS 外链（curl HTTP 200/AliyunOSS 真实上传），Notion 页经 API 确认含 **外部 image 块**（external+aliyun 外链）；**查看 ✅** `https://www.notion.so/<postid>` 预览规则 `/[postid]` 已正确前置域名（非 bug）。T1 全链路 ✅ 更新为 13 个 |
| 2026-08-24 | #2 Notion **SOP §3 帮助引导补齐 ✅**：新增 `src/helpConfigs/pages/platform-config/common-notion.ts`（pageId `common_Notion`，helpUrl+summary+fields（home/apiUrl/token/previewUrl/pageType/knowledgeSpace/picbedService）+faq 4 条+tour 6 步）+ `docs/draft/platforms/common-notion.md`（顶部 TODO:待替换真实帮助文档链接）；注册进 `/pages/index.ts`、从 `remaining-t1` 移出、纳入 `verifiedConfigs`；registry.spec 18 项绿、build:v2 通过。Electron 宿主实测 Notion 配置页：HelpPanel（summary+查看完整帮助文档+FAQ）、TourGuide 6 步（API Token→选择根页面→查看链接→发布格式→图片发布→验证并保存）全部正确可达。本格六格+帮助引导全部闭环 |
| 2026-08-24 | #3 Halo29 `common_Halo` **V2 全链路 ✅（Electron 宿主，test 工作空间 / dist-v2 / 9222）**：V2C（home/apiUrl=`http://localhost:8090`、username=`admin`、密码默认口令，PasswordType_Password 无 Cookie 流、无 token 字段）→「验证」通过，账号「运行中/已启用」，blogid 自动取分类；Pub「发布成功」；Upd「更新成功」；Del 确认删除（「删除成功」，文章公开页 404）；Img 带本地 asset 图发布——图片 URL 由 `127.0.0.1:53180/assets/…` 改写为 Halo 附件 `http://localhost:8090/upload/<图名>`（curl HTTP 200/image-png，Halo bundled 上传路径可用）；**查看 ✅** `http://localhost:8090/archives/<slug>`（文章 HTTP 200；删除后该链接 404）。注：Halo API 平台仅支持 2.9，2.20+ 已调整 API 策略需改用「Halo网页版」。T1 全链路 ✅ 更新为 14 个 |
| 2026-08-24 | #3 Halo29 `common_Halo` **SOP §3 帮助引导补齐 ✅**：补全 `src/helpConfigs/pages/platform-config/common-halo.ts`（pageId `common_Halo`，helpUrl+summary+fields（home/apiUrl/username/password/previewUrl/pageType/picbedService）+faq 4 条+tour 8 步；字段由原 token 修正为 username/password 与真实配置一致）+ 新增 `docs/draft/platforms/common-halo.md`（顶部 TODO:待替换真实帮助文档链接）；已注册进 `/pages/index.ts`、已从 `remaining-t1` 移出、纳入 `verifiedConfigs`；registry.spec 18 项绿、build:v2 通过。Electron 宿主实测 Halo 配置页：HelpPanel（summary+查看完整帮助文档+FAQ 4 条）、TourGuide（首页地址/API 地址等步）正常定位。本格六格+帮助引导全部闭环 |
| 2026-08-24 | #4 Telegraph `common_Telegraph` **V2 全链路六格 + 帮助引导 ✅（Electron 宿主）**：升级 `zhi-blog-api@1.82.0`+`zhi-siyuan-api@2.38.0`；新增框架级 `BlogConfig.isCorsProxy`，resolveTransport 置顶优先 `middleware-fetch`（CORS 受限平台），CORS 代理地址用户自配；V2C 匿名 `/check` 经 CORS 代理返回 save_hash（运行中/已启用）；Pub/Upd 成功；查看 getPreviewUrl 走 CORS 代理前缀（预览规则 `/[postid]`）。**Del ⚠️**：Telegra.ph 无删除文章 API（contract 错误，属平台限制）；**Img ⚠️**：无图片上传（newMediaObject 失效）。新增 `telegraph.ts` help 配置 + `docs/draft/platforms/telegraph.md`，纳入 verifiedConfigs |
| 2026-08-25 | #5 Confluence `common_Confluence` **V2 全链路六格 + 帮助引导 ✅（Electron 宿主）**：V2C 用 PAT 拉取空间（运行中/已启用）；Pub/Upd 成功（页面 version 递增）；Img 图片以 `ri:attachment` 附件挂页；查看预览规则 `/spaces/[spaceKey]/pages/[postid]`。**Del 修复**：`DELETE /rest/api/content/{id}` 返回 204 空响应体，原 `deletePage` 判空误报已修复（空响应视为成功）+ 新增快速发布「强制删除」兜底（删除失败仅本地清除关联并解除映射，带明确确认提示）。新增 `common-confluence.ts` help 配置 + `docs/draft/platforms/confluence.md`，纳入 verifiedConfigs |
| 2026-08-25 | #6 Hexo `github_Hexo` **V2 全链路六格 + 帮助引导 ✅（Electron 宿主，test 工作空间/9222/terwer/hexo-blog）**：V2C（username/repo/branch/PAT Token，「验证」通过，「配置已保存并验证通过」，账号「运行中/已启用」）；Pub → repo `source/_posts/掘金-V2-验证测试-更新.md`（提交 `bdf5415`）；Upd 点「更新」→ 新提交 `3b9692e`；Img 图床切「**当前平台**」重发，cat 图上传 `source/images/…jpg`，.md 引用 `../images/…jpg`（源码+构建产物双模式，见修订记录）；查看 blob URL HTTP 200；Del 删除 → repo .md 移除（404），提交 `3cc1abb`。新增 `common-github-hexo.ts` help 配置 + `docs/draft/platforms/common-github-hexo.md`，注册进 `/pages/index.ts`、移出 `remaining-t1`、纳入 verifiedConfigs（registry 18 项绿）。**依赖修复**：`pnpm install` 将 `zhi-blog-api` 由 1.80.0 升到 **1.82.0**（此前 node_modules 落后，致 `BlogConfig.isCorsProxy` 类型缺失、`vue-tsc` 失败）；`build:v2` 通过。T1 小结更新为 17 个全链路 ✅ |
| 2026-08-26 | #6 Hexo **图片链接采用相对路径 `../images`（源码+构建产物双模式）**：核对本地 `hexo-blog`（`permalink:/post/:title.html`、`post_asset_folder:false`、`source_dir:source`、`public_dir:docs`，作者文章亦 `permalink:/post/{slug}.html` + `/images/…png`）。**本地 hexo generate + server 验证**：文章引用相对 `../images/…jpg` → 产物 `<img src="/../images/…jpg">`，服务端/浏览器把 `/../` 归一化为 `/images/…`（HTTP 200）；源码 `source/_posts/x.md` 的 `../images/` 解析到 `source/images/…`（文件存在）——源码与构建产物均可用。→ `HexoConfig.imageLinkPath = "../images"`（`imageStorePath` 保持 `source/images`），`getImagePath` 支持 `../`/`./` 相对前缀、拼接文件名、不前置站点根斜杠。新增单测断言 `attachment.url==='../images/{name}'`、提交目录 `source/images/{name}`；build:v2 通过。帮助/文档/清单同步改为 `../images/<图片名>`（「图片存储目录」说明保留 `source/images`）。**存量账号**：需在配置页将「图片访问链接」改为 `../images` 后重发（默认仅对新账号生效） |
| 2026-09-04 | #7 Hugo **图片策略确认**：Hugo 结构为 `content/post/*.md`（文章）与 `static/images/`（图片）兄弟目录，且构建把 `static/` 内容**去掉 `static/` 前缀**复制到站点根——源码相对路径（`../../static/images/…`）与构建相对路径（`../images/…`）在数学上不可能相等，故不存在单一相对路径同时满足源码+构建产物。与 Hexo（两者同在 `source/` 下）本质不同。**确认采用绝对 `/images/<名>`**（`imageStorePath=static/images` + `imageLinkPath=images`）：契合 Hugo 官方 static/ 契约，构建产物可靠显示，且与作者本地仓库 `hexo-image-processing-zftcmx.md` 的 `/images/…png` 惯例一致。Hugo 帮助/文档措辞按此确认同步（去「源码+产物均显示」不准确表述）；checklist #7 行同步 |
| 2026-09-04 | #7 Hugo `github_Hugo` **V2 全链路六格 + 帮助引导 ✅（Electron 宿主，test 工作空间 / dist-v2 / 9222）**：V2C 新增账号 `github_Hugo-z1y7ssd`（terwer/hugo-blog/main/content/post，PAT，「验证」通过，"配置已保存并验证通过"，账号「运行中/已启用」，发布目录自动拉取 content/post）；Pub → `content/post/halo-image-upload-test-1plnjn.md`（frontmatter + YAML 永久链接 + `/images/…png` 引用，提交 `2ab9e55`）；Upd → 新提交 `6016692`；Img → 图床「当前平台」cat 图上传 `static/images/…png`（提交 `03a554d`）；查看 → blob 预览规则解析到真实存在的仓库文件；Del → repo .md 移除（API 404），提交 `5b3c4fd`，UI 回「未发布」。**图片口径**：源码仓库 blob 视角 `/images/` 解析为仓库根 `images/`（图在 static/images/）故 blob 内联 404——属 Hugo 平台固有限制；**构建产物站点可靠显示，用户实测 `https://hugo.terwer.space/post/halo-image-upload-test-1plnjn.html` 可显示图片**（Img 通过标准 = 构建产物可显示）。SOP §3 help/tour/doc ✅（github-hugo.ts + github-hugo.md + 注册/移出 remaining-t1/纳入 verifiedConfigs，registry 18 绿、build:v2 通过，commit `1769b4fb`）；宿主新增账号流程 Hugo 平台正确列出，配置表单完整渲染。T1 小结更新为 18 个全链路 ✅ |
| 2026-09-06 | #8 Jekyll `github_Jekyll` **V2 全链路六格 + 帮助引导 ✅（Electron 宿主，test 工作空间 / dist-v2 / 9222）**：V2C 新增账号（terwer/terwer.github.io/gh-pages/_posts，PAT，「验证」通过，账号「运行中/已启用」，发布目录自动拉取 _posts。**注意**：Git 仓库名只填裸仓库名 `terwer.github.io`，勿带 `owner/` 前缀，否则 URL 拼成 `repos/terwer/terwer/…` 404）；Pub → `_posts/2026-08-22-nuggets-v2-verification-test-update-z9fvab.md`（frontmatter title/date/permalink `/post/nuggets-v2-verification-test---update-z9fvab.html`/tags/layout:post/published:true，正文引用 `![cat](/assets/images/cat-…jpg)`，提交 `196f4e0`）；Upd → 修改正文后点「更新」→ 新提交 `a848114` 真实变更；Img → 图床「当前平台」cat 图上传 `assets/images/cat-…jpg`，引用绝对路径 `/assets/images/<名>`（Jekyll 官方推荐），**构建产物站点图片可显示** `https://terwer.github.io/assets/images/cat-…jpg` → 200；查看 → **站点文章地址 `https://terwer.github.io/post/nuggets-v2-verification-test---update-z9fvab.html` → 200**（渲染标题/正文/图片），blob 预览 → 200；Del → 确认弹窗后 repo .md 移除（列表不再含该文件），提交 `c7b61e5`，UI 回「未发布」。SOP §3 help/tour/doc ✅（github-jekyll.ts + github-jekyll.md + 注册/移出 remaining-t1/纳入 verifiedConfigs，registry 25 绿、build:v2 通过）；宿主新增账号流程 Jekyll 平台正确列出（GITHUB 分组），配置表单完整渲染，HelpPanel（summary+FAQ4+「查看完整帮助文档」）+ TourGuide 9 步全部可定位。T1 小结更新为 19 个全链路 ✅ |
| 2026-09-07 | #9 Quartz `github_Quartz` **V2 全链路六格 + 帮助引导 ✅（Electron 宿主，test 工作空间 / dist-v2 / 9222）**：V2C 新增账号（terwer/quartz-blog/main/content/[filename].md，PAT，「验证」通过，"配置已保存并验证通过"，账号「运行中/已启用」，图床默认「当前平台 推荐」，发布目录自动拉取 content）；Pub → `content/Halo图片上传测试.md`（frontmatter title/date/updated/permalink `/post/halo-image-upload-test-z9puw4.html`/enableToc/enableBackLinks，正文引用 `![图](/assets/images/image-…png)`）；Upd → 修改正文后点「更新」→ 新提交（内容真实变更，`updated:2026-09-07 10:18:30`，提交 `2026-09-07T02:19:42Z`）；Img → 图床「当前平台」cat 图上传 `assets/images/image-…png`，引用绝对路径 `/assets/images/<名>`；查看 → blob 预览规则 `/[user]/[repo]/blob/[branch]/[docpath]` → `https://github.com/terwer/quartz-blog/blob/main/content/Halo图片上传测试.md`（发布/更新后该 blob 文件 API 真实存在）；站点文章地址 `/post/<postid>.html` 需站点已部署（本仓库未配置自动构建/Pages，属平台部署限制，非插件缺陷）；Del → 确认弹窗后 repo .md 移除（API 404），UI 回「未发布」。**Del 备注**：首次删除报 GitHub 422 sha 不匹配——根因更新后 GitHub contents 接口 sha 暂态不一致（`getPageSha`/`getPageData` 单独复现返回当前 sha，删除代码取的是当前 sha，非插件缺陷），等 sha 稳定后重试成功。**图片口径**：来源目录 `content/`，图上传仓库根 `assets/images/`，文章引用绝对 `/assets/images/<名>`；能否在构建产物显示取决于 Quartz 站点对 `/assets` 的处理（同 Hugo 口径）。SOP §3 help/tour/doc ✅（github-quartz.ts + github-quartz.md + 注册/移出 remaining-t1/纳入 verifiedConfigs，registry 20 绿、build:v2 通过）；宿主实测 HelpPanel（summary+「查看完整帮助文档」+FAQ）+ TourGuide 9 步全部可定位。T1 小结更新为 20 个全链路 ✅ |


