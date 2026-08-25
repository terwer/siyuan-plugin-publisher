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

## 二点五、阶段 0 环境确认（宿主已启动）
- 用户指示「没有你就启动啊」→ 主动启动思源宿主。
- 启动命令（还原自 app.log）：`/Applications/SiYuan.app/Contents/MacOS/SiYuan --remote-debugging-port=9222 --workspace=/Volumes/workspace/mydocs/SiYuanWorkspace/test`。
- 现状：内核端口 **65172**（思源动态分配，**非**之前验证用的 53180 → 后续「本地资产图 URL」会是 `127.0.0.1:65172/assets/...` 而非 53180）；9222 调试端口 ready；chrome-devtools MCP 连接成功。
- 页面标题：`Halo 图片上传测试 - test - 思源笔记 v3.8.1`（当前打开的是上次 Halo 验证留下的测试文档）。
- 插件软链：`…/test/data/plugins/siyuan-plugin-publisher → …/dist-v2`（已就绪）；`dist-v2` 产物齐全。
- 注意：此前误查了 `~/.config/siyuan/workspace/…`（不存在），正确 test 工作区在 `/Volumes/workspace/mydocs/SiYuanWorkspace/test`。

## 二点六、Telegraph 配置页观察（阶段 0，已进入配置页）
- 进入账号：`common_Telegraph-z2mva1w`（用的是"去授权"→配置页；**注意：账号列表有 3 个 Telegraph**：`z2mva1w`/`z2pyiul`/`z1y48ie`，均未启用/已禁用。Halo 教训：选账号要精确匹配 platformKey，别错点。）
- 配置页字段（与 findings 一致）：
  - 登录模式：匿名发布（默认选中）/登录发布（radio）
  - **平台首页：空**（未填！findings 预期默认 `https://telegra.ph`，此处为空 → 可能影响验证）
  - API地址：`https://edit.telegra.ph`（默认）
  - 作者：空
  - **Uuid（*必填，空）**、**Hash（*必填，空）**
  - 刷新授权（switch）
  - 预览规则：`/[postid]`（disabled，`allowPreviewUrlChange=false`）
  - 发布格式：Markdown（默认）/HTML
  - 图床服务：不使用（默认）/PicGo 强烈推荐
- **状态提示（重要）**：`配置错误或者api不可用，请检查。若修改过配置，请刷新页面` → 当前配置**未通过验证**。pending 决策点 3（V2C 依赖公网 /check）的直接证据来源。
- **提示**：之前点"管理"误进入 `fs_LocalSystem`，后返回；Telegraph 账号项应点"去授权"。

## 二点七、阶段 0 关键实证（验证失败根因）——决策点 3 证据
- **实测**：填平台首页 `https://telegra.ph` 后点「验证」→ 按钮转「验证中...」且状态显示「配置错误或者api不可用」。
- **Console 报错（实锤）**：`[ERROR][commonblog-setting] API验证失败，请检查配置=>FetchError: request to https://edit.telegra.ph/check failed, reason: getaddrinfo ENOTFOUND edit.telegra.ph`
- **宿主机验证**：
  - `edit.telegra.ph` / `telegra.ph`：nslookup SERVFAIL / curl Resolving timed out → **DNS 解析失败**（当前环境**未开代理**，无法访问 telegra.ph；Halo 验证时用的 hiddify 代理在 127.0.0.1:12334，当前未启用）。
  - `api.terwer.space/api/middleware`：可达但 **HTTP 404**（路径疑似失效/需特定参数）。
- **结论**：V2C 失败的直接原因是**宿主机无法解析 telegra.ph 域名（无代理/被墙）**，请求直接打到 `apiUrl`(edit.telegra.ph)，**未走公网 middleware**。→ 判定为**外部网络依赖问题**，非适配器逻辑缺陷（但仍需确认 /check 传输通道为何未走 middleware/proxy，见下一步读代码）。
- **决策点 3 已获实证**：当前环境（无代理）下 Telegraph V2C 无法通过，属环境依赖。

## 二点八、用户产品建议（Telegraph 可用性改进，待办不阻塞验证）
- 用户提出：Telegraph 依赖外网，无代理的用户无法使用。建议两种处理：
  - (a) **配置表单放「科学上网代理 URL」配置项**（让用户自填代理地址，真正可用）。
  - (b) 配置页顶部红字警告「必须科学上网」。
- 用户问哪个更好。**我的判断：(a) 更好**——(b) 只提示不解决，用户仍无法用；(a) 让用户自给自足，且 Telegraph 被墙是长期事实，应提供可操作的代理配置。
- **措辞合规**（用户特别提醒）：用「科学上网 / 网络代理」等中性词，**禁止任何违禁词汇**。
- 待办：此为产品改进，非当前验证必要项；验证时先用 hiddify 代理让宿主访问 telegra.ph。

## 三、设计决策（用户已对齐）——针对 isCorsProxy / corsAnywhereUrl
1. **`isCorsProxy` 放 zhi-blog-api 框架层**：`BlogConfig` 加 `isCorsProxy?: boolean`（类比现有 `corsAnywhereUrl`），插件传输层感知；语义通用，后续其它被墙平台可复用。
2. **优先级：`isCorsProxy=true` 高于 `forceProxy`**：resolvePublishTransport 里 `isCorsProxy` 置顶，即使 `canUsePluginFetch` / `forceProxy` 为真也**强制走 middleware-fetch（corsFetch）**——因为 isCorsProxy 明确表示该平台必须走远端 CORS 代理（被墙外网），不能被直连/forceProxy 覆盖。
3. **界面可配 + 平台 enable 后出现**：`corsAnywhereUrl`（科学上网/网络代理地址）暴露给用户，需平台 `enable isCorsProxy` 后才显示该配置项；UI 提供输入框。用中性命词，禁违禁词。
4. **默认值（用户最新修正：防滥用）**：~~Telegraph 用 `corsAnywhereUrl = https://cors.terwer.space`~~ **已废弃**。用户明确：`cors.terwer.space`（1.20.2 共享代理）**不再免费提供**，**禁止作为默认值写死/暴露**（防止滥用共享额度）。`corsAnywhereUrl` **默认为空**，由用户**自行填写自己的 CORS 代理地址**；UI 提供输入框 + 配置指引文档链接 `https://siyuan.wiki/s/20240312153728-paen10j`。
5. **Telegraph 校验前置**：`isCorsProxy=true` 但 `corsAnywhereUrl` 为空时，在 `getUsersBlogs`（匿名分支）抛清晰提示「请先配置 CORS 代理地址」，避免走 `corsFetch` 拼出坏 URL。
6. 与用户方案 A「科学上网代理 URL 配置项」一致：本质是把 `corsAnywhereUrl` 做成用户自配项（给高阶用户），不预填共享代理。

## 四、未动（勿当已推进）
- 尚未对源码做任何改动（仅探索 + 起宿主 + 实测 + 写方案）；Telegraph checklist #4 行仍为 ⬜（未标记）。
- 已归档：`2026-08-24-halo-v2-verification` 已移入 `.planning/archive/`（提交 `b4447a6d`）。

## 三.五、验证中发现并修复：Telegraph 查看预览也需走 CORS 代理
- **现象**：快速发布「查看文章」生成的链接为 `https://telegra.ph/Halo-图片上传测试-08-25`（直连，被墙打不开）。
- **curl 实测**：
  - 直连 `https://telegra.ph/...` → `Resolving timed out`（被墙）。
  - `https://cors.terwer.space/https://telegra.ph/Halo-图片上传测试-08-25` → `HTTP 200`（可访问）。
- **修复**：`telegraphApiAdaptor.getPreviewUrl` 原 `useProxyPreview=false` 硬编码导致直连；改为 `isCorsProxy && corsAnywhereUrl` 非空时走 CORS 代理前缀拼接（`pathJoin(corsAnywhereUrl, home) + postUrl`）。
- **复现验证**：pathJoin 拼接得到 `https://cors.terwer.space/https://telegra.ph/Halo-图片上传测试-08-25`，fetch → HTTP 200。
- **用户提示**：「查看文章」在浏览器窗口打开（非 Electron 内嵌），CDP list_pages 看不到新 tab，勿纠结打开方式；关注点应是打开的 URL 是否带 CORS 代理前缀。
