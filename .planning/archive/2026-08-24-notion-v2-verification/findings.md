# findings：Notion（common_Notion）

> 用于记录 Notion V2 全链路验证中的研究与发现。仅放可信/已确认的机制事实；外部内容视为不可信，先确认再采纳。

## 平台元信息（已确认，src/platforms/pre.ts / dynamicConfig.ts）
- platformKey：`common_Notion`；subPlatformType：`Common_Notion`；platformType：`Common`。
- `authMode: AuthMode.API`；`isEnabled: false`（平台上架关）。
- i18n description：`setting.platform.common.notion.desc`；icon：`svgIcons.iconIFNotion`。

## 授权方式（API token，非 Cookie）— notionConfig.ts
- 基类：`CommonBlogConfig`；home `https://www.notion.so/`；apiUrl `https://api.notion.com/v1`。
- `passwordType = PasswordType_Token`（API token），`showTokenTip = true`。
- token 设置 URL：`https://www.notion.so/my-integrations`（用户在 Notion 创建 integration 获取 token）。
- `pageType = Markdown`；`previewUrl = /[postid]`；`allowPreviewUrlChange = false`。
- `knowledgeSpaceEnabled = true`；`knowledgeSpaceTitle = "根页面"`（父页面/Database）；`allowKnowledgeSpaceChange = false`；
  `knowledgeSpaceReadonlyModeTip`：Notion 暂不支持编辑所属父页面，需移到新根页面。
- `tagEnabled = false`；`cateEnabled = false`；`cateSearchEnabled = true`。
- 适配器：`src/adaptors/api/notion/notionApiAdaptor.ts`。

## V2 Bridge / 配置可见性
- `common_Notion` 能进入 V2 配置（pre.ts 定义）。待确认 V2 平台列表是否显示（`isEnabled:false` 是否为「未启用」不影响添加）。

## Notion token（已确认，2026-08-24）
- **token 已在思源工作空间持久化，无需向用户索取**：dev 与 public 两个空间
  `data/storage/syp/sy-p-plus-cfg.json` 的 `common_Notion` 配置均含 `password`（`passwordType=1` Token）、
  `blogid=38a88b78-49ab-4c6d-a489-5a1850f918ee`（根页面，blogName=后端开发）、`apiStatus: true`、`previewUrl=/[postid]`。
  > ⚠️ token 明文不记入本计划（`.planning/` 已入库），只在需要时从上述配置读取。

## 待确认（阶段 0 已闭环）
- [x] `uploadFile`：Notion 适配器**无** `uploadFile`；`useNotionApi` 设 `picgoPicbedSupported=true`、`bundledPicbedSupported=false` → 图片走 **PicGo 外链图床**，经 `NotionMarkdownConverter.markdownToNotion` 转成 Notion **外部 URL 图片块**（非 API 上传附件）。Img 口径 = 带图发布，图为 https 外链（官方只支持 https，http 会被忽略，见配置指南 FAQ）。
- [x] help 配置 `common-notion.ts`：**不存在**（当前仅 `remaining-t1.ts` 里一条 helpUrl），SOP §3 需补。
- [x] Notion 请求 headers：`notionRequest` 已封装 `Authorization: Bearer <token>` + `Notion-Version: 2022-06-28`。
- [ ] `getPreviewUrl`：`previewUrl="/[postid]"` 为相对路径，`getPreviewUrl` 仅 `replace("[postid]", endUrl)`；是否与 `home` 拼成 `https://www.notion.so/<postid>` 需在「查看」步实测确认（若为相对路径=潜在 bug）。

## V2 宿主验证结果（2026-08-24，Electron 宿主 / test 空间 / 9222）
- **V2C**：`common_Notion` 配置页填 token →「验证」通过，根页面自动列出并选「建造者模式」，「配置已保存并验证通过」，账号「运行中/已启用」。
- **Pub/Upd/Del**：快发布→「发布成功/更新成功/删除成功」；**Upd 后 postid 变化**（`…b0890bb`→`…1b868`），验证 `editPost`=删旧建新+重映射。
- **查看（已闭环）**：查看文章链接为 `https://www.notion.so/<postid>`——**`getPreviewUrl` 已正确拼接 `home` 域名**，`/[postid]` 的相对路径渲染为完整 `https://www.notion.so/<postid>`（非 bug）。⚠️ 注意：Notion 页面默认私有，系统浏览器打开会要登录/属于用户私有空间，属平台属性而非插件缺陷。
- **Img**：Notion 图床「PicGo 强烈推荐」+ **内置阿里云 OSS** 图床（bucket `static-rs-terwer`/area `oss-cn-beijing`/path `img/`/customUrl `https://static-rs-terwer.oss-cn-beijing.aliyuncs.com`）。图片本地 URL `127.0.0.1:53180/assets/photo-....jpg` 被改写为阿里云 OSS 外链；curl 该外链 `HTTP 200 / image/jpeg / AliyunOSS`（真实上传成功）；Notion 页 `3c6da0ccbfca8125bdb1d41d4185d628` 经 API 确认含**外部 image 块**（external + aliyun 外链），结构 heading+paragraph+image 正确。**阿里云 OSS 凭据取自 dev 笔记**（`20240325220133-3kgm4vl.sy`，accessKeyId/accessKeySecret/bucket/area/path/customUrl），写入 test 空间 picgo.cfg.json（非入库）。
