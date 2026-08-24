# progress：Notion（common_Notion）

## 2026-08-24 会话（建计划）
- 归档 `2026-08-23-bilibili-full-chain`（B站 #35 全链路 → `.planning/archive/`），`.planning/.active_plan` 清空。
- 创建本计划 `2026-08-24-notion-v2-verification`（task_plan/findings/progress），写入 `.planning/.active_plan`。
- 用户：按 checklist 自上而下，下一个验证 **#2 Notion（common_Notion）**；**不着急马上实现，先建计划**。
- 前置调研（findings.md）：Notion 为 **API token** 授权（`PasswordType_Token`，token 设置 URL `https://www.notion.so/my-integrations`），
  非 Cookie；`knowledgeSpace`="根页面"（只读）；`pageType=Markdown`。V2 Bridge 在 pre.ts 已定义（`common_Notion`）。

## 待办（阶段 4 前）
- 确认 Notion 图片上传实现（uploadFile / 附件 or URL）。
- 确认 help 配置 `common-notion.ts` 是否存在（SOP 第三节）。
- 进入阶段 1（V2C）前：需用户提供 Notion integration token + 在 Notion 把目标页面/数据库 share 给 integration。

## 测试结果
- （暂无，尚未实现）
