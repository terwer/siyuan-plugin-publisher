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
| 2 | Notion | `common_Notion` | `Common_Notion` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 3 | Halo29 | `common_Halo` | `Common_Halo` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 4 | Telegraph | `common_Telegraph` | `Common_Telegraph` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 5 | Confluence | `common_Confluence` | `Common_Confluence` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |

### Github（8）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 6 | Hexo | `github_Hexo` | `Github_Hexo` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 7 | Hugo | `github_Hugo` | `Github_Hugo` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 8 | Jekyll | `github_Jekyll` | `Github_Jekyll` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| 9 | Quartz | `github_Quartz` | `Github_Quartz` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
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
| 28 | Halo网页版 | `custom_Haloweb` | `Custom_Haloweb` | 🟡 | ⬜ | ⬜ | ⬜ | ⬜ | 2026-05-26/27 V2C 配置页初始化曾失败：默认 `authUrl=/login` 被直接 `new URL()` 导致 `Invalid URL`；已改为 Web Cookie 共用相对 URL 解析，并保留 Cookie 授权入口，未填站点地址时点击登录/读取给提示，待用户手验配置页 |
| 30 | 知乎 | `custom_Zhihu` | `Custom_Zhihu` | ✅ | ✅ | ✅ | ✅ | ✅ | V2 Bridge 全链路已验（2026-05-24，用户手测）；平台图床 Img 通过；OSS SDK 显式加载修复 |
| 31 | CSDN | `custom_Csdn` | `Custom_CSDN` | ✅ | ✅ | ✅ | ✅ | ✅ | V2 Bridge 全链路已验（2026-05-24，用户手测）；平台图床 Img 通过；默认 Bundled 图床修复 |
| 32 | 简书 | `custom_Jianshu` | `Custom_Jianshu` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 已进入 V2 Bridge，待验 |
| 33 | 掘金 | `custom_Juejin` | `Custom_Juejin` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 已进入 V2 Bridge，待验 |
| 34 | 微信公众号 | `custom_Wechat` | `Custom_Wechat` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 已进入 V2 Bridge，待验 |
| 35 | 哔哩哔哩 | `custom_Bilibili` | `Custom_Bilibili` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 已进入 V2 Bridge，待验 |

### Fs（1）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 29 | 本地系统 | `fs_LocalSystem` | `Fs_LocalSystem` | ✅ | ✅ | ✅ | ✅ | ✅ | Electron V2 全链路已验（2026-05-24，用户手测） |

**T1 小结**：35 项 · 全链路 ✅ `7`（#1 #21 #25 #27 #29 #30 #31）· 进行中 `1`（#28）· 阻塞 `0` · 未测 `27`

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


