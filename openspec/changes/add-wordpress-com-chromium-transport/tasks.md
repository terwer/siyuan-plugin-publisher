# 任务清单

## 1. 传输通道

- [ ] 1.1 在 `src/utils/publishTransport/` 的通道枚举与解析中加入 `electron-session-fetch`
- [ ] 1.2 实现该通道的实际请求（Electron `session.fetch`，取默认 session），放在既有 facade 内，不新增对外入口
- [ ] 1.3 可用性判定：宿主是否具备该能力（非 Electron / 浏览器形态不可用）
- [ ] 1.4 回退策略：能力缺失时回退既有通道，并把选择结果写入诊断（供错误详情展示）

## 2. 站点预热

- [ ] 2.1 新增「确保 session 已通过站点校验」的动作（访问一次站点根地址并等待校验页跑完）
- [ ] 2.2 在发布前自动确保（幂等，已通行则不重复预热）
- [ ] 2.3 预热过程无用户交互；配置页给出可见状态（如「通行就绪」）

## 3. 平台接入

- [ ] 3.1 `WordpressdotcomConfig` 声明使用该通道（声明式，与 `isCorsProxy` 同一风格）
- [ ] 3.2 `resolveXmlrpcTransport` 对该声明置顶优先，且不影响其他平台
- [ ] 3.3 图片上传（`newMediaObject`）同样走该通道

## 4. 测试

- [ ] 4.1 `resolveTransport` / `xmlrpcTransport` 单测：新增通道的优先级与回退用例
- [ ] 4.2 断言其余平台的通道选择不因本次改动而变化
- [ ] 4.3 能力缺失时的降级用例（不硬失败）

## 5. 帮助与文档

- [ ] 5.1 `src/helpConfigs/pages/platform-config/wordpress-wordpressdotcom.ts` 补充机制说明（中性表述，只写用户可见行为）
- [ ] 5.2 `docs/draft/platforms/wordpress-wordpressdotcom.md` 同步
- [ ] 5.3 字段指引 / HelpPanel / TourGuide 的冻结行若因新增字段而变化，同步更新 `verifiedPlatformRows.ts`

## 6. 宿主端到端验证

- [ ] 6.1 V2C：配置页验证通过，账号「运行中/已启用」
- [ ] 6.2 Pub：文章落到站点（记下 postid）
- [ ] 6.3 Upd：正文更新生效
- [ ] 6.4 Img：图片上传并改写引用
- [ ] 6.5 查看：「查看文章」实际打开该文章
- [ ] 6.6 Del：文章删除，站点端不再存在
- [ ] 6.7 SOP §3 帮助引导三项（help 配置 / 文档草稿 / 宿主展示）
- [ ] 6.8 结果写回 `openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md` 的 #26，T1 小结随之更新
- [ ] 6.9 清理验证产生的临时账号与站点端测试内容，账号数复原基线

## 7. 收尾

- [ ] 7.1 全量测试与 `build:v2` 通过
- [ ] 7.2 `openspec validate --changes --strict` 通过
- [ ] 7.3 归档本 change（archive 前按四项审计：根本修复、最佳实践、不破坏底层设计、不影响无关模式）
