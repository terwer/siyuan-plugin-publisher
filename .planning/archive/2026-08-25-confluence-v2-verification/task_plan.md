# 任务计划：Confluence V2 验证（checklist #5）

## 目标
完成 checklist #5 Confluence 的 V2 全链路验证（V2C / Pub / Upd / Del / Img / 查看）与帮助引导文档，并修复验证中发现的问题。

> 调研细节（环境、实例、数据库、授权状态等）已归档到仓库 `tmp/`（不提交），本文件只保留面向交付的中性结论。

## 当前阶段
已完成

## 关键步骤
- [x] 确认测试 Confluence 实例 REST 端点可用、鉴权方式可通过（个人访问令牌）
- [x] V2C：配置页校验通过，拉取空间，账号「运行中/已启用」
- [x] Pub：发布成功（页面 1703944）
- [x] Upd：更新成功
- [x] Img：带本地 asset 图发布，图片以附件（ri:attachment）挂在页面
- [x] Del：修复 DELETE 204 空响应误报；新增快速发布「强制删除」兜底（含确认框）
- [x] 查看：预览规则 `/spaces/[spaceKey]/pages/[postid]`，页面可打开
- [x] 帮助引导：新增 Confluence help 配置 + 文档草稿 + 宿主 HelpPanel/TourGuide 验证

## 交付
- checklist SSOT #5 六格 + 帮助引导全 ✅
