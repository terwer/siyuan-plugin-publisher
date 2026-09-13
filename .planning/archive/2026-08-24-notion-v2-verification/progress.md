# progress：Notion（common_Notion）

## 2026-08-24 会话（建计划）
- 归档 `2026-08-23-bilibili-full-chain`（B站 #35 全链路 → `.planning/archive/`），`.planning/.active_plan` 清空。
- 创建本计划 `2026-08-24-notion-v2-verification`（task_plan/findings/progress），写入 `.planning/.active_plan`。
- 用户：按 checklist 自上而下，下一个验证 **#2 Notion（common_Notion）**；**不着急马上实现，先建计划**。
- 前置调研（findings.md）：Notion 为 **API token** 授权（`PasswordType_Token`，token 设置 URL `https://www.notion.so/my-integrations`），
  非 Cookie；`knowledgeSpace`="根页面"（只读）；`pageType=Markdown`。V2 Bridge 在 pre.ts 已定义（`common_Notion`）。

## 待办（阶段 4 前）
- ~~确认 Notion 图片上传实现（uploadFile / 附件 or URL）~~ → 已确认：无 uploadFile，走 PicGo 外链（`picgoPicbedSupported=true`）。
- ~~确认 help 配置 `common-notion.ts` 是否存在~~ → 已确认：**不存在**，SOP §3 需补（含 `docs/draft/platforms/common-notion.md`）。
- ~~进入阶段 1（V2C）前需用户提供 Notion integration token~~ → **token 已在 dev/public 工作空间 `data/storage/syp/sy-p-plus-cfg.json` 持久化**（`common_Notion`，passwordType=Token，根页面=后端开发，apiStatus=true），无需索取。

## 测试结果（2026-08-24 宿主手验，test 工作空间 / dist-v2 / Electron 9222）
- 环境：`--workspace=/Volumes/workspace/mydocs/SiYuanWorkspace/test`（test 空间软链 dist-v2），chrome-devtools MCP 切 9222 模式驱动 Electron 渲染进程。
- **V2C（common_Notion）✅**：配置页填 token →「验证」→ 状态「运行中/已启用」，根页面自动列出并选「建造者模式」，「配置已保存并验证通过」。`/the-notion-config` 预览规则正确。
- **Pub ✅**：快速发布「被导入文档」→「发布成功 / 已完成 Notion 的发布」，Notion 卡变「已发布 + 更新/查看文章/删除」。
- **Upd ✅**：点「更新」→「更新成功 / 已在「Notion」更新文章」。**postid 变化**：`…3c6da0ccbfca81b1aad0f9d27b0890bb` → `…3c6da0ccbfca813bb293ecba2541b868`，验证 `editPost`=删旧建新+重映射 postid。
- **Del ✅**：确认删除 →「删除成功 / 已完成 Notion 的删除」，Notion 卡回「未发布 + 发布」。
- **查看 ✅**：查看文章链接 `https://www.notion.so/<postid>` —— **预览规则 `/[postid]` 已正确前置 `https://www.notion.so/` 域名**（此前 open question 已解，无需修复）。
- **Img ✅**：Notion 图床切「PicGo 强烈推荐」，内置图床改用**阿里云 OSS**（keyId/secret/bucket=`static-rs-terwer`/area=`oss-cn-beijing`/path=`img/`/customUrl=`https://static-rs-terwer.oss-cn-beijing.aliyuncs.com`，取自 dev 笔记）。发布带图文档「阿里云无法上传图片」→ 图片本地 URL `127.0.0.1:53180/assets/photo-…jpg` 被改写为**阿里云 OSS 外链** `…aliyuncs.com/img/photo-….jpg`；curl 该外链 **HTTP 200/image-jpeg/AliyunOSS**（真实上传成功）；Notion 页 `3c6da0ccbfca8125bdb1d41d4185d628` 经 API 确认含 **外部 image 块（external url=aliyun OSS 外链）**，结构 heading+paragraph+image 正确。
- **SOP §3 help/tour/doc ✅**：新增 `src/helpConfigs/pages/platform-config/common-notion.ts`（summary+fields+faq 4+tour 6）+ `docs/draft/platforms/common-notion.md`；注册进 `/pages/index.ts`、从 `remaining-t1` 移出、纳入 `verifiedConfigs`；registry 18 绿、build:v2 通过；Electron 宿主实测 HelpPanel（summary+查看完整帮助文档+FAQ）与 TourGuide 6 步全部正确可达。**#2 Notion 六格+帮助引导全部闭环**。
- 已回写 checklist SSOT：V2C/Pub/Upd/Del/查看/Img 均通过；T1 全链路 ✅ 13 个。
