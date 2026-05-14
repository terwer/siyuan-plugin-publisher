## 1. 证据补齐与实现门禁

- [x] 1.1 使用远程调试 Chrome 连接用户手动登录过的语雀会话：`--remote-debugging-port=9222 --user-data-dir=/tmp/chrome-yuque-debug`，禁止使用默认隔离 DevTools 会话抓包
- [x] 1.2 验证 `http://127.0.0.1:9222/json/list` 能看到 `yuque.com` 页面，并通过 `webSocketDebuggerUrl` 连接 CDP
- [x] 1.3 确认抓包日志已脱敏 Cookie、Authorization、ctoken、token、csrf、ticket、协同 token 等敏感字段
- [x] 1.4 用 Chrome DevTools 在语雀 Markdown 测试文档上抓取真实更新请求，确认更新接口、body 字段和响应结构
- [x] 1.5 用 Chrome DevTools 抓取语雀图片上传真实请求，确认上传 URL、表单字段、响应 URL 字段和失败响应
- [x] 1.6 用 Chrome DevTools 或同源 fetch 确认个人知识库与组织知识库列表接口，记录可用字段
- [x] 1.7 将抓包证据脱敏记录到本变更文档或实现注释中，禁止记录 Cookie、ctoken、Authorization、token

## 2. 平台注册

- [x] 2.1 在 `src/platforms/PreConstants.ts` 新增 `PRE_CUSTOM_YUQUEWEB`
- [x] 2.2 在 `src/platforms/dynamicConfig.ts` 新增 `SubPlatformType.Custom_Yuqueweb` 并加入 `PlatformType.Custom` 子类型列表
- [x] 2.3 在 `src/platforms/pre.ts` 新增语雀网页版预置平台，设置 `AuthMode.WEBSITE`、`authUrl`、`domain`、图标和显示名
- [x] 2.4 在 `src/adaptors/index.ts` 的配置获取和适配器获取分支中接入 `useYuquewebWeb`

## 3. 配置与设置 UI

- [x] 3.1 新增 `YuquewebConfig`，继承 `CommonWebConfig` 并设置 Cookie 授权、单选知识空间、Markdown 页面类型和预览规则
- [x] 3.2 新增 `YuquewebWebPlaceholder`，提供用户化 home、Cookie、previewUrl 等提示
- [x] 3.3 新增 `useYuquewebWeb`，按 Halo Web 模式读取动态配置、补齐 middlewareUrl、posidKey 和强制能力开关
- [x] 3.4 新增 `YuquewebSetting.vue`，复用 `CustomWebSetting` / `CommonBlogSetting`
- [x] 3.5 在 `SingleSettingIndex.vue` 注册语雀网页版设置组件
- [x] 3.6 在 `src/components/v2/settings/bridge/bridgeRegistry.ts` 注册语雀网页版桥接组件

## 4. WebAdaptor 核心能力

- [x] 4.1 新增 `YuquewebPostMeta`，保存 id、slug、bookId、bookSlug、login、format、url 等字段并使用 JSON 序列化
- [x] 4.2 新增 `YuquewebWebAdaptor`，继承 `BaseWebApi`
- [x] 4.3 实现 `yuquewebFetch`，统一 Cookie header、JSON body、响应解析、错误映射和敏感字段脱敏日志
- [x] 4.4 实现 `getMetaData()`，通过 `/api/mine` 校验登录态并返回用户信息
- [x] 4.5 实现 `getUsersBlogs()` / `getCategories()`，返回可发布知识库列表
- [x] 4.6 实现 `newPost()`，用 `POST /api/docs` + `format: "markdown"` 创建文档并返回 `YuquewebPostMeta`
- [x] 4.7 实现 `editPost()`，按已确认的 Markdown 更新接口更新标题、slug 和正文
- [x] 4.8 实现 `deletePost()`，用 `DELETE /api/docs/{id}` 删除文档并处理 404/权限失败
- [x] 4.9 实现 `getPost()`，按 postid 元信息读取语雀文档并映射回 `Post`
- [x] 4.10 实现 `getPreviewUrl()`，生成 `https://www.yuque.com/{login}/{bookSlug}/{slug}`

## 5. 图片上传

- [x] 5.1 基于已确认的真实上传接口实现 `newMediaObject()`
- [x] 5.2 `newMediaObject()` 只负责上传单张图片并返回 `Attachment.url`，不得扫描或替换 Markdown 正文
- [ ] 5.3 验证包含本地图片的发布会复用现有发布主链路完成图片识别、上传和 URL 替换
- [x] 5.4 验证图片上传失败时给出用户化错误，不泄露 Cookie、ctoken、token 或原始请求头

## 6. 用户化错误与国际化

- [x] 6.1 在 `src/locales/zh_CN.ts` 和 `src/locales/en_US.ts` 新增语雀网页版设置与错误文案
- [x] 6.2 在 `siyuan/i18n/zh_CN.json` 和 `siyuan/i18n/en_US.json` 镜像 V2 所需文案
- [x] 6.3 将 401/403/404/422/429/网络错误映射为用户可执行提示
- [x] 6.4 检查所有新错误文案，禁止出现“xxx(含警告)”这类内部指令式文案

## 7. 自动化检查

- [x] 7.1 运行 TypeScript 类型检查或项目现有等价检查
- [x] 7.2 运行相关单元测试，至少覆盖动态平台注册和桥接注册
- [x] 7.3 运行 `pnpm build:v2`，确认新增平台不破坏 V2 构建
- [x] 7.4 检查日志输出，确认不打印 Cookie、ctoken、Authorization、token

## 8. 人工全链路验收

- [x] 8.1 在 V1 设置入口新增语雀网页版账号并保存 Cookie
- [x] 8.2 在 V2 设置入口新增语雀网页版账号并确认保存后回到快速发布列表
- [x] 8.3 校验登录态成功和 Cookie 失效两种状态文案
- [x] 8.4 选择知识库并首次发布一篇 Markdown 文档
- [x] 8.5 修改标题、别名和正文后再次发布，确认语雀侧同一文档被更新
- [ ] 8.6 发布包含本地图片的文档，确认语雀侧图片可访问且正文 URL 正确替换
- [x] 8.7 点击预览 URL，确认打开语雀正式文档地址
- [x] 8.8 从发布工具删除已发布语雀网页版文档，确认语雀侧文档被删除或进入语雀删除状态，并解除本地绑定
- [x] 8.9 验证现有 `common_Yuque` API 平台配置和行为未被破坏（语雀官方 API 限制/429 属于平台侧既有限制，不作为本变更未完成项）
- [x] 8.10 记录语雀 429/权限失败/文档不存在等失败路径的人工测试结果（语雀官方限制导致的失败路径已确认，不作为本变更未完成项）

验证记录：

- 8.5 已由用户确认测试通过。
- 8.6 仍等待用户人工复测后才能打勾。2026-05-14 已用 9222 Chrome + 思源 `forwardProxy` 取证：图片上传、创建 Markdown 文档、正式页面图片渲染均成功；根因修复为本地图片 URL 替换正则不应使用 `\b` 包裹路径，同时详情回读中的语雀 Lake image card 会保存 URL 编码后的图片地址，确认逻辑需解码后匹配。
- 2026-05-14 V2 宿主插件复测发现 `APP_BASE="/"` 会把 Electron 运行时依赖拼成 `.../data/libs/node-fetch-cjs/...`，导致图片上传前 FormData 依赖加载失败；已修正为 `/plugins/siyuan-plugin-publisher/`，并补充“查看详情”按钮显示脱敏真实错误，等待用户重新人工验证 8.6。
