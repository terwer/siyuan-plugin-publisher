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

## 待确认
- [ ] `notionApiAdaptor.ts` 的 `uploadFile` 是否实现：Notion 图片上传走 API 附件，还是仅 URL 引用？（决定 Img 格验证口径）
- [ ] `getPreviewUrl` 相对路径 `/[postid]` 是否与 home 拼接为 `https://www.notion.so/<postid>`。
- [ ] help 配置 `common-notion.ts` 是否已存在。
- [ ] Notion API 是否需要额外 headers（Authorization: Bearer <token>、Notion-Version）——适配器已封装。
