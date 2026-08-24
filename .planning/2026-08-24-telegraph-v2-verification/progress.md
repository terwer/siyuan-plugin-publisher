# Telegraph（common_Telegraph）验证进度

> 状态：**探索完成，暂缓验证（用户要求"深度考虑，先不着急"）。** 本文件集中记录待决策项与探索结论，供深度考虑，不作为已推进的验证记录。

## 一、待用户决策项（3 项，勿擅自定）

### 决策 1：Del 格如何处理？
- **事实**：`telegraphApiAdaptor.deletePost()` 直接 `throw new Error("telegra.ph 暂不支持删除文章功能")`，无实现。Telegra.ph 公开页面无删除 API。
- **候选**：
  - (a) 视为「平台能力缺失」→ 标 **`N/A`**（并非 ✅/❌），checklist 备注如实说明"该平台不支持删除"。
  - (b) 进一步确认 telegra.ph 作者后台是否有删除入口（可能需登录后操作）。
  - 倾向 (a)，待用户确认。

### 决策 2：Img 格如何算「真通过」？
- **事实**：
  - `newMediaObject()` 被整段注释，注「已失效，上传功能无法实现」；`bundledPicbedSupported=false`（无内置上传），`picgoPicbedSupported=true`（只能 PicGo 外部图床）。
  - `telegraph.md` 不处理图片上传：`image` 节点把 markdown 里的图片 URL 原样当 `<img src>`。
  - 若文档图片是本地资产 URL（`127.0.0.1:53180/assets/...`），发布后 Telegra.ph 页面公网打不开 → **图片空白**。
  - 必须先经 PicGo 上传到**公网可达图床**（如阿里云 OSS，Notion 曾用）得到公网 URL，文章 `<img>` 才能正常渲染。
- **候选**：
  - (a) 若用户提供/复用可用 PicGo + 公网图床 → 验证「图片公网 URL 可访问」→ 计 ✅。
  - (b) 若没有公网图床 → 记录「图片需公网图床，否则空白」为已知限制；Img 不做「投机」标记。
  - 也可做**对照验证**：图床=无 时发含本地图文档，确认文章图片空白（印证投机风险属实）。

### 决策 3：V2C 依赖公网代理，如何定性？
- **事实**：基类 `validatePublish()` 恒 `{canPublish:true}`（不打网络），Telegraph 未覆写。`useV2PublishValidation.canPublish = dynCfg.isAuth===true && validation.canPublish===true`。=> 是否「已授权」取决于配置页「验证」那一步调 `getUsersBlogs`→`/check`（匿名建会话）能否成功，默认走公网 middleware `https://api.terwer.space/api/middleware`。
- **候选**：
  - (a) 若公网 middleware 不可达（被墙/限流）→ 属**环境/外部依赖**问题，非适配器缺陷；可尝试 siyuan 代理/forceProxy 通道规避（受传输规则与 SSRF 约束）。
  - (b) 需要探索阶段先确认这条链路是否真能通，再定性。

## 二、探索结论速览（详见 findings.md）
- Telegra.ph = 网站非 API；默认匿名模式无真实账号；会话凭证为本地 `tph_uuid` cookie。
- `TelegraphConfig extends CommonBlogConfig`：`home=telegraphUrl`（默认 `https://telegra.ph`）、`apiUrl=https://edit.telegra.ph`、`previewUrl="/[postid]"`（`allowPreviewUrlChange=false`）、`postType`（anonymous/user）、`accessToken`、`saveHash`、`forceReAuth`。
- `useTelegraphApi`：`usernameEnabled=true`；`cateEnabled=false`；`tagEnabled=false`；`postType=ANONYMOUS`；`picgoPicbedSupported=true`；`bundledPicbedSupported=false`。
- 配置页 `TelegraphSetting.vue`：登录模式（匿名/登录用户）、Access Token（仅登录）、Hash（saveHash）、刷新授权。
- 「查看」=`https://telegra.ph/<path>`（`getPreviewUrl` 返回 `/[postid]` 替换 path，调用方 `usePublish.getPostPreviewUrl` 用 `StrUtil.pathJoin(cfg.home, previewUrl)` 补域名）。
- `newPost` postid = JSON `{update_cookie,page_id,path,save_hash}`；`editPost` 用 `page_id`+`save_hash` 覆盖。

## 三、未动（勿当已推进）
- 未做任何 host 实测；未改任何源码；未对 checklist #4 行做任何标记（仍为 ⬜）。
- 已归档：上一步把 `2026-08-24-halo-v2-verification` 移入 `.planning/archive/`（提交 `b4447a6d`）。
