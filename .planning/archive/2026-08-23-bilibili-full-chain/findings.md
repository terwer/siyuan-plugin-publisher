# Findings：B站（custom_Bilibili）平台事实

> 只记录代码/事实层面的中性结论（不写逆向/观测措辞）。

## 平台注册
- platformKey `custom_Bilibili`，subPlatformType `Custom_Bilibili`，进入 V2 Bridge。
- `src/platforms/pre.ts` L546-559：`authMode=WEBSITE`、`authUrl=https://passport.bilibili.com/login`、
  `domain=bilibili.com`（`uaWhiteList` 含 `https://*.bilibili.com/*`）。

## 配置 `src/adaptors/web/bilibili/bilibiliConfig.ts`
- `home=https://www.bilibili.com/opus`、`logoutUrl=https://passport.bilibili.com/login`、`previewUrl=/[postid]`。
- `pageType=Markdown`、`usernameEnabled=false`、`passwordType=Cookie`、`tagEnabled=false`、`cateEnabled=false`。
- `knowledgeSpaceEnabled=true` → 第 43 行被覆盖为 `false`（文集=专栏/readlist 单选已关闭）。
- `picgoPicbedSupported=false`、`bundledPicbedSupported=true`、`picbedService=Bundled`（默认图床 Bundled，走原生上传）。

## 适配器 `src/adaptors/web/bilibili/bilibiliWebAdaptor.ts`
- `getMetaData`：`https://member.bilibili.com/x/web/elec/user`，`code===0` 即授权；返回 uid/title/home/icon。
- `getUsersBlogs`：`/x/article/creative/list/all` 取专栏列表。
- `getCategories`：`/x/article/creative/list/all` 取 readlists。
- `addPost`：`POST /x/dynamic/feed/create/opus`，`article.list_id=0`、`category_id=15` 硬编码。
- `getPreviewUrl`：`cfg.previewUrl.replace(/\[postid]/g, dynId)` → 相对路径 `/dynId`；使用层
  `usePublish.ts` 用 `StrUtil.pathJoin(cfg.home ?? "", previewUrl)` 拼成 `https://www.bilibili.com/opus/<dynId>`。
- 未覆盖 `previewOpenMode` → 走默认（ExternalUrl/外部打开）。

## 帮助引导/文档实现（本轮完成）
- `src/helpConfigs/pages/platform-config/custom-bilibili.ts`：`pageId=platform-config/custom_Bilibili`，`helpUrl` 占位，
  `summary`（Cookie→专栏 opus、Markdown、Bundled）、`fields`（home/apiUrl/cookie/pageType/picbedService tip）、
  `faq`（Cookie 验证/图床/查看链接）、`tour`（`[data-syp-tour='cookie']`/`pageType`/`picbedService`/`validate`）。
- `src/helpConfigs/pages/index.ts` 已 `import bilibiliHelpConfig` + `helpRegistry.register(bilibiliHelpConfig)`。
- `src/helpConfigs/pages/platform-config/remaining-t1.ts`：`custom_Bilibili` 改为注释“已拆分为独立 help 配置”。
- `src/helpConfigs/registry.spec.ts`：新增 import `bilibiliHelpConfig` 并纳入 `verifiedConfigs`。
- `docs/draft/platforms/custom-bilibili.md`：新增（首页/API/Cookie/格式/图床 + 验证与发布 + FAQ，顶部 `TODO：待替换真实帮助文档链接`）。

## 参照（已完成的 help 配置结构）
- `src/helpConfigs/pages/platform-config/custom-juejin.ts`：`pageId` + `helpUrl` + `summary` + `fields`
  （home/apiUrl/cookie/knowledgeSpace/pageType/picbedService 的 tip）+ `faq`（≥1）+ `tour`
  （`[data-syp-tour='cookie']` 等，含 placement）。
- `src/helpConfigs/pages/index.ts`：每个平台 help 配置 import + `helpRegistry.register`；其余走 `remainingT1HelpConfigs`。
- `src/helpConfigs/registry.spec.ts` `verifiedConfigs`：列入后强制校验 summary/fields/faq/tour 完整 + 从 remaining-t1 移出。

## 验证环境
- 思源 Electron 宿主已带 `--remote-debugging-port=9222`；chrome-devtools MCP 处于 9222 直连模式。
- test 工作区插件软链 `siyuan-plugin-publisher -> dist-v2`。
- V2 面板入口：左上角发布工具顶栏图标（`iconPlane`），点击进 V2 快速发布面板。

## V2C 配置页（宿主实测，2026-08-24 本轮）
- 入口：顶栏「发布工具」→「设置」→「账号设置」→「添加账号」→ 网页平台「哔哩哔哩」。
- 配置页字段：平台首页 `https://www.bilibili.com/opus`、API地址 `https://api.bilibili.com`、预览规则 `/[postid]`、
  发布格式 Markdown（默认选中）、**文集**（combobox，默认「请选择」——这是 V2C 第 5 步需检查/可选的字段）、
  图床服务「当前平台 推荐」Bundled（默认选中）。
- 顶部提示：验证通过后会列出可用的【文集】列表，用户可按需修改默认【文集】并保存。
- Cookie 授权区：状态「待验证」，按钮「1 去登录」/「2 自动读取 Cookie」/「i 手动编辑」。

## V2C 执行结果（宿主实测 ✅，2026-08-24）
- 点「1 去登录」→ 弹出 `passport.bilibili.com/login` B 站登录窗 → 用户登录成功 → 窗口跳转 `www.bilibili.com`。
- **关闭登录窗口**（用 `close_page` close 第 2 页）→ 触发插件窗口关闭回调保存 Cookie。
- 回配置页点「2 自动读取 Cookie」→ Cookie 授权由「待验证」变「已验证」，提示「已读取并验证，授权状态已更新」，
  出现「退出/清除授权」按钮。
- 点「验证」→ 自动返回「账号列表」，哔哩哔哩 **「运行中」**，platformKey `custom_Bilibili`，已启用。
- **V2C 通过 ✅**。

## Pub 结果（宿主实测 ✅，2026-08-24）
- 回到配置页：账号标识「custom_Bilibili 远方的灯塔」，Cookie 授权「已授权」，**文集自动加载并默认选「远方的灯塔」**，
  状态「配置已保存并验证通过」，点「保存」持久化。
- 回快速发布面板：哔哩哔哩「未发布」→ 点「发布」。
- 发布成功：状态「发布成功，已完成 哔哩哔哩 的发布」；哔哩哔哩行「已发布」，预览链接
  **`https://www.bilibili.com/opus/1239781621862760457`**（相对路径 `/[...]` 拼 home 正确）。
- **Pub 通过 ✅**。

## Upd 结果（宿主实测，2026-08-24）
- 点「更新」→ 失败：**「20019 相同标题的专栏短时间内不能重复提交」**。
- 根因：B 站平台侧对**相同标题**的专栏编辑有节流限制（`/x/dynamic/feed/edit/opus` 返回 20019），非插件缺陷；
  `editPost` 用当前文档标题提交。按平台策略，需**略改标题**后重试即可正常更新。
- 平台侧限制记录，待改标题复验 Upd（见 progress）。

### Upd 复验（改标题后 ✅）
- 在思源把文档标题改为「掘金V2验证测试-更新」→ 打开发布面板点「更新」→ **「更新成功，已完成 哔哩哔哩 的更新」**，
  alert「已在「哔哩哔哩」更新文章」；预览链接恢复正常显示 `https://www.bilibili.com/opus/1239781621862760457`。
- 结论：B 站「20019 相同标题短时间不能重复提交」= 平台对相同标题的节流限制，**改标题后即可正常更新**，非插件缺陷。
- **Upd 通过 ✅（改标题后）**。

## Del 结果（宿主实测 ✅，2026-08-24）
- 点「删除」→ 确认弹窗「确认删除这篇已发布内容？删除后需要重新发布。」→ 点「确认删除」。
- 状态「删除成功，已完成 哔哩哔哩 的删除」；哔哩哔哩行回到「未发布」，按钮变「发布」。
- **Del 通过 ✅**。

## Img 结果（宿主实测 ✅，2026-08-24）
- 含 cat 图片文档「掘金V2验证测试-更新」重新「发布」→ **「发布成功，已完成 哔哩哔哩 的发布」**，
  预览链接 `https://www.bilibili.com/opus/1239782240324419607`（新的 dyn id）。
- 默认图床 Bundled（当前平台 推荐）→ 走 B 站原生图片上传链路。发布成功即图片上传链路 OK。
- **Img 通过 ✅**。（待确认文章内图 URL 已换为 B 站地址 —— 见 progress 复核。）

## 查看结果（宿主实测，2026-08-24）
- 点「查看文章」：`previewOpenMode` 默认（ExternalUrl）→ 走外部打开（B 站专栏为公开链接，非会话绑定，系统浏览器打开是合理设计）。
- 链接可正常访问（HTTP 200，标题「掘金V2验证测试-更新 - 哔哩哔哩」）。
- **查看 通过 ✅**（B 站专栏为公开链接，外部打开合理，非会话绑定）。

## ⚠️ Img 复核（2026-08-24 23:44，发现文本段/图段 para_type 问题）
- 用 curl 解析 `https://www.bilibili.com/opus/1239782240324419607` 的 `__INITIAL_STATE__.detail.modules[].module_content.paragraphs`：
  11 段全部 `para_type=1` 纯文本，**IMG count=0** —— 文章图片段落确实空白（此前「已上链」判断不成立）。
- 对比插件日志（console msgid 1283）发给 B 站的 `content.paragraphs`：
  - 文本段：`{"para_type":1,"text":{"nodes":[...]}}`（正常显示）
  - 图片段：`{"para_type":1,"text":{"nodes":[]},"pic":{"pics":[{"url":"http://article.biliimg.com/bfs/new_dyn/...jpg",...}]}}`
- **根因**：`src/adaptors/web/bilibili/bilibiliMdUtil.ts` 的 `processImageNode` 输出 `para_type=2`（图段），
  但 `processParagraphNode`（第 223 行）把容器 `para_type` **写死为 1**，覆盖了图片段的 2。
  B 站正文用 `para_type` 区分（1=文本，2=图片），图段标成 1 后 B 站按文本段解析、`text.nodes` 为空 → 图片渲染空白。
- 图片上传链路本身正常（`https://api.bilibili.com/x/article/creative/article/upcover` 上传返回
  `code:0` + `url: http://article.biliimg.com/...`；markdown 替换正确，`raw_content.ops` 含 `native-image` 段）。

## Img 修复（2026-08-24）
- `bilibiliMdUtil.ts` `processParagraphNode`：新增 `hasPic` 判断，`para_type: hasPic ? 2 : 1`，图段不再标成 1。
- `bilibiliUtils.spec.ts`：新增断言「图片段落使用 para_type=2、图片 URL 正确」，3/3 通过。
- `pnpm build:v2` 通过（2069 modules）；软链 `test\data\plugins\siyuan-plugin-publisher -> dist-v2` 已在。
- 待宿主复验：重启思源加载新 dist-v2 → 带图更新 → 解析正文确认图片段 `para_type=2` 且含图。

## 文集生效（2026-08-24，用户疑问「文集选择有没有必要加引导」）
- 用户问「文集」是否需要在帮助/引导里加一步。调研发现**字段根本不是「要不要引导」而是「没生效」**：
  - `addPost`/`editPost` 里 `article.list_id`、`category_id` 均**硬编码**（`list_id:0`, `category_id:15`），完全不读配置页「文集」。
  - 而配置页显示可选的「文集」：`useBilibiliWeb.ts` 运行时 `knowledgeSpaceEnabled=true`、`allowKnowledgeSpaceChange=true`，
    但 `bilibiliConfig.ts` 构造函数 `knowledgeSpaceEnabled=false`（两处矛盾，最终运行时为 true→配置页显示字段，选了却无效）。
- **修复**：`addPost`/`editPost` 改为 `const listId = post.cate_slugs?.[0] ?? this.cfg.blogid ?? ""`，
  `list_id = StrUtil.isEmptyString(String(listId)) ? 0 : listId`（与掘金 `category_id`、知乎 `column` 的模式一致）；
  该用户选择走「让文集真正生效」。`knowledgeSpace` 字段 tip + tour（`[data-syp-tour='knowledgeSpace']`）与 summary 已补齐。
- **宿主复验**：配置存储 `custom_Bilibili.blogid=898693`（远方的灯塔）；重启思源加载新构建后，对「掘金V2验证测试-更新」执行「发布」（addPost），
  用 cookie curl 查账号专栏列表 `x/article/creative/article/list`：最新文章「掘金V2验证测试-更新」`list.id=898693, list.name=远方的灯塔`（归入文集），
  对照旧文「建造者模式」`list:null`（无文集，即修复前 `list_id:0` 的结果）。**文集字段真正生效 ✅**。
- `pnpm build:v2` + 21 tests 通过；新增 help 配置（knowledgeSpace tip + 5 步 tour）。
