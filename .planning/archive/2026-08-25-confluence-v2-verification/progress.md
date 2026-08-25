# 进度：Confluence V2 验证

## 2026-08-25
- 启动 `2026-08-25-confluence-v2-verification`（checklist #5 Confluence）。
- 确认测试 Confluence 实例可用（baseUrl `http://localhost:8090`），鉴权用个人访问令牌。

## 2026-08-25 六格验证
- **V2C ✅**：配置页 home/apiUrl、令牌、空间，「配置已保存并验证通过」，账号「运行中/已启用」。
- **Pub ✅ / Upd ✅**：发布、更新成功。
- **Img ✅**：带本地 asset 图发布，图片以附件挂在页面。
- **Del ✅**：修复 DELETE 204 空响应误报；新增快速发布「强制删除」兜底（含确认框），验证删除失败→强制删除→本地清除。
- **查看 ✅**：预览规则 `/spaces/[spaceKey]/pages/[postid]`，页面可打开。

## 2026-08-25 帮助引导
- 新增 `common-confluence.ts` help 配置 + `docs/draft/platforms/confluence.md` 草稿。
- 宿主验证 HelpPanel（summary+完整帮助+FAQ）+ TourGuide 6 步可达。

## 结论
- Confluence 六格 + 帮助引导全部闭环。
- 敏感调研材料已归档到 `tmp/`，未入库。
