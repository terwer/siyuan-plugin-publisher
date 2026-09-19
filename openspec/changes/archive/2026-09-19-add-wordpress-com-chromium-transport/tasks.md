# 任务清单

> 状态：**已完成**（2026-09-19）。宿主机六格 + SOP §3 帮助引导全部通过，结果见 `openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md` 的 #26。

## 1. 传输通道

- [x] 1.1 在 `src/utils/publishTransport/` 的通道枚举与解析中加入 `electron-session-fetch`
- [x] 1.2 实现该通道的实际请求（Electron `session.fetch`，取默认 session），放在既有 facade 内，不新增对外入口
- [x] 1.3 可用性判定：宿主是否具备该能力（非 Electron / 浏览器形态不可用）
- [x] 1.4 回退策略：能力缺失时回退既有通道，并把选择结果写入诊断（供错误详情展示）

## 2. 站点预热

- [x] 2.1 新增「确保 session 已通过站点校验」的动作（访问一次站点根地址并等待校验页跑完）
- [x] 2.2 在发布前自动确保（幂等，已通行则不重复预热）
- [x] 2.3 预热过程无用户交互（无需登录、无需点选）

## 3. 平台接入

- [x] 3.1 `WordpressdotcomConfig` 声明使用该通道（声明式：`MetaweblogConfig.isHostSessionFetch`，默认 false）
- [x] 3.2 `resolveXmlrpcTransport` 对该声明置顶优先，且不影响其他平台
- [x] 3.3 图片上传（`newMediaObject`）同样走该通道——实测图片落到站点媒体库 `wp-content/uploads/2026/09/`

## 4. 测试

- [x] 4.1 `xmlrpcTransport` 单测：新增通道的优先级与回退用例（共 5 个新用例）
- [x] 4.2 断言其余平台的通道选择不因本次改动而变化
- [x] 4.3 能力缺失时的降级用例（不硬失败）

## 5. 帮助与文档

- [x] 5.1 `src/helpConfigs/pages/platform-config/wordpress-wordpressdotcom.ts` 补充网络可达性 FAQ（中性表述）
- [x] 5.2 `docs/draft/platforms/wordpress-wordpressdotcom.md` 同步
- [x] 5.3 冻结行核对：`verifiedPlatformRows.ts` 只约束字段与钩子标志，本次未触及，无需变更

## 6. 宿主端到端验证

- [x] 6.1 V2C：配置页验证通过，账号「运行中/已启用」
- [x] 6.2 Pub：`postid=4217`（`post_status=publish`）
- [x] 6.3 Upd：正文更新生效
- [x] 6.4 Img：图片上传到站点媒体库并改写引用
- [x] 6.5 查看：「查看文章」实际打开该文章（HTTP 200）
- [x] 6.6 Del：`/?p=4217` 返回 404，页面不再含标题
- [x] 6.7 SOP §3 帮助引导三项（help 配置 / 文档草稿 / 宿主展示：字段指引 7 条 + FAQ + TourGuide 8/8）
- [x] 6.8 结果写回 `platform-checklist.md` 的 #26，T1 小结更新为 **35/35**
- [x] 6.9 临时账号按精确 platformKey 删除，账号数复原 **32**

## 7. 收尾

- [x] 7.1 全量测试（69 文件 / 359 用例）与 `build:v2` 通过
- [x] 7.2 `openspec validate --changes --strict` 通过（6/6）
- [x] 7.3 归档本 change（四项审计：根本修复 ✅ 非 mock、最佳实践 ✅ 共用层 + 声明式 + 降级、不破坏底层设计 ✅ 不新增对外入口且既有测试全绿、不影响无关模式 ✅ 仅该平台声明启用）
