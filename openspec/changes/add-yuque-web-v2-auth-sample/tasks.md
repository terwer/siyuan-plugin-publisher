## 1. 证据补齐与实现门禁

- [ ] 1.1 用 Chrome DevTools 在语雀 Markdown 测试文档上抓取真实更新请求，确认更新接口、body 字段和响应结构
- [ ] 1.2 用 Chrome DevTools 抓取语雀图片上传真实请求，确认上传 URL、表单字段、响应 URL 字段和失败响应
- [ ] 1.3 用 Chrome DevTools 或同源 fetch 确认个人知识库与组织知识库列表接口，记录可用字段
- [ ] 1.4 将抓包证据脱敏记录到本变更文档或实现注释中，禁止记录 Cookie、ctoken、Authorization、token

## 2. 平台注册

- [ ] 2.1 在 `src/platforms/PreConstants.ts` 新增 `PRE_CUSTOM_YUQUEWEB`
- [ ] 2.2 在 `src/platforms/dynamicConfig.ts` 新增 `SubPlatformType.Custom_Yuqueweb` 并加入 `PlatformType.Custom` 子类型列表
- [ ] 2.3 在 `src/platforms/pre.ts` 新增语雀网页版预置平台，设置 `AuthMode.WEBSITE`、`authUrl`、`domain`、图标和显示名
- [ ] 2.4 在 `src/adaptors/index.ts` 的配置获取和适配器获取分支中接入 `useYuquewebWeb`

## 3. 配置与设置 UI

- [ ] 3.1 新增 `YuquewebConfig`，继承 `CommonWebConfig` 并设置 Cookie 授权、单选知识库、Markdown 页面类型和预览规则
- [ ] 3.2 新增 `YuquewebWebPlaceholder`，提供用户化 home、Cookie、previewUrl 等提示
- [ ] 3.3 新增 `useYuquewebWeb`，按 Halo Web 模式读取动态配置、补齐 middlewareUrl、posidKey 和强制能力开关
- [ ] 3.4 新增 `YuquewebSetting.vue`，复用 `CustomWebSetting` / `CommonBlogSetting`
- [ ] 3.5 在 `SingleSettingIndex.vue` 注册语雀网页版设置组件
- [ ] 3.6 在 `src/components/v2/settings/bridge/bridgeRegistry.ts` 注册语雀网页版桥接组件

## 4. WebAdaptor 核心能力

- [ ] 4.1 新增 `YuquewebPostMeta`，保存 id、slug、bookId、bookSlug、login、format、url 等字段并使用 JSON 序列化
- [ ] 4.2 新增 `YuquewebWebAdaptor`，继承 `BaseWebApi`
- [ ] 4.3 实现 `yuquewebFetch`，统一 Cookie header、JSON body、响应解析、错误映射和敏感字段脱敏日志
- [ ] 4.4 实现 `getMetaData()`，通过 `/api/mine` 校验登录态并返回用户信息
- [ ] 4.5 实现 `getUsersBlogs()` / `getCategories()`，返回可发布知识库列表
- [ ] 4.6 实现 `newPost()`，用 `POST /api/docs` + `format: "markdown"` 创建文档并返回 `YuquewebPostMeta`
- [ ] 4.7 实现 `editPost()`，按已确认的 Markdown 更新接口更新标题、slug 和正文
- [ ] 4.8 实现 `deletePost()`，用 `DELETE /api/docs/{id}` 删除文档并处理 404/权限失败
- [ ] 4.9 实现 `getPost()`，按 postid 元信息读取语雀文档并映射回 `Post`
- [ ] 4.10 实现 `getPreviewUrl()`，生成 `https://www.yuque.com/{login}/{bookSlug}/{slug}`

## 5. 图片上传

- [ ] 5.1 基于已确认的真实上传接口实现 `newMediaObject()`
- [ ] 5.2 `newMediaObject()` 只负责上传单张图片并返回 `Attachment.url`，不得扫描或替换 Markdown 正文
- [ ] 5.3 验证包含本地图片的发布会复用现有发布主链路完成图片识别、上传和 URL 替换
- [ ] 5.4 验证图片上传失败时给出用户化错误，不泄露 Cookie、ctoken、token 或原始请求头

## 6. 用户化错误与国际化

- [ ] 6.1 在 `src/locales/zh_CN.ts` 和 `src/locales/en_US.ts` 新增语雀网页版设置与错误文案
- [ ] 6.2 在 `siyuan/i18n/zh_CN.json` 和 `siyuan/i18n/en_US.json` 镜像 V2 所需文案
- [ ] 6.3 将 401/403/404/422/429/网络错误映射为用户可执行提示
- [ ] 6.4 检查所有新错误文案，禁止出现“xxx(含警告)”这类内部指令式文案

## 7. 自动化检查

- [ ] 7.1 运行 TypeScript 类型检查或项目现有等价检查
- [ ] 7.2 运行相关单元测试，至少覆盖动态平台注册和桥接注册
- [ ] 7.3 运行 `pnpm build`，确认新增平台不破坏构建
- [ ] 7.4 检查日志输出，确认不打印 Cookie、ctoken、Authorization、token

## 8. 人工全链路验收

- [ ] 8.1 在 V1 设置入口新增语雀网页版账号并保存 Cookie
- [ ] 8.2 在 V2 设置入口新增语雀网页版账号并确认保存后回到快速发布列表
- [ ] 8.3 校验登录态成功和 Cookie 失效两种状态文案
- [ ] 8.4 选择知识库并首次发布一篇 Markdown 文档
- [ ] 8.5 修改标题、别名和正文后再次发布，确认语雀侧同一文档被更新
- [ ] 8.6 发布包含本地图片的文档，确认语雀侧图片可访问且正文 URL 正确替换
- [ ] 8.7 点击预览 URL，确认打开语雀正式文档地址
- [ ] 8.8 从发布工具删除已发布语雀网页版文档，确认语雀侧文档被删除或进入语雀删除状态，并解除本地绑定
- [ ] 8.9 验证现有 `common_Yuque` API 平台配置和行为未被破坏
- [ ] 8.10 记录语雀 429/权限失败/文档不存在等失败路径的人工测试结果
