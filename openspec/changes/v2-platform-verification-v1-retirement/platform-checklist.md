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
| 28 | Halo网页版 | `custom_Haloweb` | `Custom_Haloweb` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-05-26/27 修复 V2C 配置页 `Invalid URL`。2026-08-14 修 transport 规则（loopback 有代理条件时走 siyuan-forward-proxy）。2026-08-15 Electron 宿主（test 工作空间）全链路实测：V2C（Cookie 授权→验证通过）、Pub（文章 `/archives/hangtestdoc-z138hrs` 前台 200 含标题+图片）、Upd（更新成功）、Del（文章 404 Post not found）、Img（带图发布图片上传成功）；另补 help 引导（tour 5 步）+ Cookie 失效友好错误 |
| 30 | 知乎 | `custom_Zhihu` | `Custom_Zhihu` | ✅ | ✅ | ✅ | ✅ | ✅ | V2 Bridge 全链路已验（2026-05-24，用户手测）；平台图床 Img 通过；OSS SDK 显式加载修复 |
| 31 | CSDN | `custom_Csdn` | `Custom_CSDN` | ✅ | ✅ | ✅ | ✅ | ✅ | V2 Bridge 全链路已验（2026-05-24，用户手测）；平台图床 Img 通过；默认 Bundled 图床修复 |
| 32 | 简书 | `custom_Jianshu` | `Custom_Jianshu` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-16 V2 全链路验证：V2C（Cookie 授权通过，笔记本=随笔；新增账号默认图床已修正为“当前平台 推荐/Bundled”）；Pub `https://www.jianshu.com/p/9654472734f3`；Upd 更新成功；Del 删除成功；Img 带真实 PNG 发布成功，图片上传为 `https://upload-images.jianshu.io/upload_images/16941800-0b988068785ce608.png`；HelpPanel/tour（4 步）验证通过 |
| 33 | 掘金 | `custom_Juejin` | `Custom_Juejin` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-22 V2 全链路验证。Pub 文章 `https://juejin.cn/post/7676406157015531560`，Upd 更新成功，Del 删除成功。修复两处：① `jsonFetchClient.buildPluginRequestHeaders` / `PluginFetchUtil.postText` / `useProxy` 发送重复 `Content-Type`+`content-type` 头，致掘金建空草稿（category/title/content 全空）→ 发布参数错误；改单一 `Content-Type`。② `juejinWebAdaptor.editPost` 缺标签/摘要默认回退（addPost 有）→ 更新失败 `必须选择一个标签`、空摘要 `参数错误`；与 addPost 一致补齐。Img（2026-08-22 傍晚）：原生 veImageX 直传落地——新增 `vendors/byteimagex/imagexClient.ts`（SigV4+CRC32 五步链）与 `utils/rawHeaderFetch.ts`（大小写保真通道，内置 undici 引擎），`juejinWebAdaptor.uploadFile` 接入，掘金默认图床改 Bundled（对齐知乎/CSDN 先例）。根因：SigV4 的 amzDate 必须剥冒号（`[-:]\|\.\d{3}`）。宿主实测：GUI 发布带两图文档 → 草稿 mark_content 均为裸 `![](tos-cn-i-73owjymdk6/<32hex>)`（官方契约，无签名 URL），文章 `https://juejin.cn/post/7676404118950395938` 审核通过（audit=2）且匿名可访问含图。外链图片实测原样保留不转存 → 放开 PicGo 双通道 |
| 34 | 微信公众号 | `custom_Wechat` | `Custom_Wechat` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 已进入 V2 Bridge，待验 |
| 35 | 哔哩哔哩 | `custom_Bilibili` | `Custom_Bilibili` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 已进入 V2 Bridge，待验 |

### Fs（1）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 29 | 本地系统 | `fs_LocalSystem` | `Fs_LocalSystem` | ✅ | ✅ | ✅ | ✅ | ✅ | Electron V2 全链路已验（2026-05-24，用户手测） |

**T1 小结**：35 项 · 全链路 ✅ `10`（#1 #21 #25 #27 #28 #29 #30 #31 #32 #33）· 进行中 `0` · 阻塞 `0` · 未测 `25`

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
| 2026-08-22 | #33 掘金 **Img ✅ 收官**：原生 veImageX 五步直传（gen_token→ApplyImageUpload→TOS 裸字节 PUT+CRC32→CommitImageUpload→get_img_url）落地 `vendors/byteimagex/imagexClient.ts` + `utils/rawHeaderFetch.ts`（undici 引擎）；掘金默认图床改 Bundled。**根因**：SigV4 amzDate 必须剥冒号（ISO 串 `[-:]|\.\d{3}` 全替换），带冒号即 100024 InvalidAuthorization——与传输层/头大小写无关（排查中曾误判）。Electron 宿主 GUI 实测：配置页切「当前平台」→ 文档贴图 → 发布面板更新 → 草稿 mark_content 两图均为裸 `![](tos-cn-i-73owjymdk6/<32hex>)`（官方契约），文章 `https://juejin.cn/post/7676404118950395938` audit=2 匿名可访问含图。T1 全链路 ✅ 更新为 10 个 |
| 2026-08-22 | #33 掘金 **外链图片探测 + 放开 PicGo**：API 建草稿含百度 logo 外链 → 读回 mark_content URL **原样保留、未转存 tos-cn-i**；发布后审核放行且匿名页渲染外链（后台轮询确认）。据此放开 `picgoPicbedSupported=true`（保留 Bundled 默认，双通道并存），spec 同步更新 |
| 2026-08-22 | #33 掘金 **Img 修复（文章页相对链接）**：用户反馈上传不报错但文章页图片呈「相对链接」（`img src="tos-cn-i-…"` 无协议/域名 → 404）。复现：宿主 GUI 发布带图文档 mark_content 为裸 `![](tos-cn-i-…)`（上传链路 OK、`get_img_url` 能重签出完整 URL），抓 `juejin.cn/spost/…` SSR 见 `<img src="tos-cn-i-…">` 未被重签 → **推翻先前「编辑保存即存裸 URI + 读时重签」结论**。官方编辑器对照（独立浏览器实测）：上传后插入 mark_content 的是**完整签名 URL**（`https://p0-xtjj-private.juejin.cn/tos-cn-i-…~tplv-…&rk3s=…&x-orig-sign=…`），读取端动态重签至 ~+7d。修复：`juejinWebAdaptor.uploadFile` 返回 `get_img_url.main_url`（完整签名 URL）作为 `url`（原返回裸 storeUri），取不到 main_url 显式报错。**宿主实测**：更新后 mark_content 已是完整 URL，抓 spost 页 `<img src="https://p3-xtjj-sign.byteimg.com/tos-cn-i-…">` 通过（bare count=0 / full count=1）。构建+build:v2 通过，单测 5 绿 |


