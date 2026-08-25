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
| 33 | 掘金 | `custom_Juejin` | `Custom_Juejin` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-22 V2 全链路验证。Pub 文章 `https://juejin.cn/post/7676406157015531560`，Upd 更新成功，Del 删除成功。修复两处：① `jsonFetchClient.buildPluginRequestHeaders` / `PluginFetchUtil.postText` / `useProxy` 发送重复 `Content-Type`+`content-type` 头，致掘金建空草稿（category/title/content 全空）→ 发布参数错误；改单一 `Content-Type`。② `juejinWebAdaptor.editPost` 缺标签/摘要默认回退（addPost 有）→ 更新失败 `必须选择一个标签`、空摘要 `参数错误`；与 addPost 一致补齐。Img（2026-08-22 傍晚）：原生 veImageX 直传落地——新增 `vendors/byteimagex/imagexClient.ts`（SigV4+CRC32 五步链）与 `utils/rawHeaderFetch.ts`（大小写保真通道，内置 undici 引擎），`juejinWebAdaptor.uploadFile` 接入，掘金默认图床改 Bundled（对齐知乎/CSDN 先例）。根因：SigV4 的 amzDate 必须剥冒号（`[-:]\|\.\d{3}`）。宿主验证：GUI 发布带两图文档 → 草稿 mark_content 均为裸 `![](tos-cn-i-73owjymdk6/<32hex>)`（官方契约，无签名 URL），文章 `https://juejin.cn/post/7676404118950395938` 审核通过（audit=2）且匿名可访问含图。外链图片原样保留不转存 → 放开 PicGo 双通道 |
| 34 | 微信公众号 | `custom_Wechat` | `Custom_Wechat` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-23 V2 全链路（Electron 宿主）验证：V2C（配置页「去授权」→ mp.weixin.qq.com 扫码登录 → 关窗保存 cookie → 自动读取 Cookie → 验证通过，账号「运行中」）。Pub 草稿 `appmsgid=100000261`；Upd `operate_appmsg?sub=update` 成功；Del 成功；Img 带 cat 图经 `upload_material` 上传素材库。**查看 ✅（SOP 新增第 6 格，2026-08-23 末段复验通过）**：公众号草稿编辑查看链接**会话绑定**且 token 会轮换——过期 token 被判未登录跳「请重新登录」。最终根因：会话绑定查看链接须在**授权会话窗口内**打开（不能落到系统浏览器 / `window.open`）。修复两步：`getPreviewUrl` 打开前用 `getMetaData` 刷新 token；按 `previewOpenMode=AppSession` **强制在 Electron 会话窗口打开**（HEAD `9c07f09c`）。Electron 宿主复验：应用内打开、不跳系统浏览器、不提示登录。另修复 `WechatConfig` 默认图床 Bundled（原 None 不上图）；新增 `custom-wechat.ts` help 配置 + `docs/draft/platforms/custom-wechat.md`；HelpPanel/TourGuide 验证通过 |
| 35 | 哔哩哔哩 | `custom_Bilibili` | `Custom_Bilibili` | ✅ | ✅ | ✅ | ✅ | ✅ | 2026-08-23/24 V2 全链路（Electron 宿主）验证。V2C：Cookie 授权（去登录→扫码→关窗保存→自动读取 Cookie→验证通过，账号「运行中」，文集「远方的灯塔」）。Pub `https://www.bilibili.com/opus/1239781621862760457`；Upd 改标题后成功（B 站对相同标题的编辑有节流 `20019 相同标题的专栏短时间内不能重复提交`，属平台限制，改标题即可，非插件缺陷）；Del 成功。**Img 修复**：带 cat 图发布后正文图片空白——根因 `bilibiliMdUtil.processParagraphNode` 把图片段 `para_type` 写死为 1（B 站图片段应为 2），B 站按文本段解析 `text.nodes` 为空 → 图片渲染空白；修复为 `para_type: hasPic ? 2 : 1`。修复后正文图片段 `para_type=2` 且含 `i0.hdslb.com/bfs/new_dyn/...jpg` 图床 URL（可访问，HTTP 200 / image/jpeg）。**查看 ✅**：`https://www.bilibili.com/opus/<dyn_id>` 为公开链接（非会话绑定），系统浏览器打开合理，HTTP 200 可访问文章正文含图片。**文集生效**：`addPost`/`editPost` 现读取配置页所选文集 `cfg.blogid` 作为 `list_id`（原硬编码 `0`，文集为摆设）；宿主发布「掘金V2验证测试-更新」后查账号专栏列表，文章 `list.id=898693`（远方的灯塔），确认真正归入所选文集。新增 `custom-bilibili.ts` help 配置 + `docs/draft/platforms/custom-bilibili.md`；HelpPanel/TourGuide（5 步，含文集）宿主验证通过 |

### Fs（1）

| # | 平台 | platformKey | subPlatformType | V2C | Pub | Upd | Del | Img | 备注 |
|---|------|-------------|-----------------|-----|-----|-----|-----|-----|------|
| 29 | 本地系统 | `fs_LocalSystem` | `Fs_LocalSystem` | ✅ | ✅ | ✅ | ✅ | ✅ | Electron V2 全链路已验（2026-05-24，用户手测） |

**T1 小结**：35 项 · 全链路 ✅ `14`（#1 #2 #3 #21 #25 #27 #28 #29 #30 #31 #32 #33 #34 #35）· 进行中 `0` · 阻塞 `0` · 未测 `21`

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


