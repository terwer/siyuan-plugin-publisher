# Progress：B站（custom_Bilibili）V2 全链路验证

## 2026-08-23 会话（本会话交接）
- 读取交接文档 `session-a2a56ca8-恢复现场-…微信公众号收官.md`，确认任务：先复验 #34，再做 #35。
- #34：用户在 Electron 宿主复验「查看文章」通过（应用内打开、不跳系统浏览器、不提示登录），无需重复验证。
- checklist #34 备注更新为最终根因（会话绑定查看链接须在授权会话窗口打开，HEAD `9c07f09c` 复验通过），commit `eefe8e2e`。
- `pnpm build:v2` 通过并已软链到思源 test 工作区；加载 HEAD 构建。
- 规划 #35 哔哩哔哩（六格 + 帮助引导与文档），本轮先执行帮助引导与文档 + 构建验证。

## 2026-08-23 续作（立即开始 #35）
- 阶段 5（帮助引导与文档）本轮完成：
  - 新增 `src/helpConfigs/pages/platform-config/custom-bilibili.ts`（summary/fields/faq/tour，target `[data-syp-tour='…']`）。
  - `src/helpConfigs/pages/index.ts` 引入并注册 `bilibiliHelpConfig`。
  - `src/helpConfigs/pages/platform-config/remaining-t1.ts` 移除 `custom_Bilibili` 占位（改为注释）。
  - `src/helpConfigs/registry.spec.ts` 引入 `bilibiliHelpConfig` 并纳入 `verifiedConfigs`。
  - 新增 `docs/draft/platforms/custom-bilibili.md`（占位 helpUrl 顶部标 `TODO`）。
  - 验证：`pnpm test -- src/helpConfigs/registry.spec.ts` 18/18 通过；`pnpm build:v2` 通过（2069 modules）。
  - 工作区状态（`git diff --stat`）：4 files changed + 3 untracked（见 findings）；Electron 宿主 HelpPanel/TourGuide 展示待与六格一并手验。
- 登录方式用户选择：**在弹出的 B 站登录窗里扫码/账号登录**。

### 当前状态
- 阶段 0 ✅、阶段 5（代码/文档/构建单测）✅；阶段 5 的宿主手验 + 阶段 1–4、6 待续。
- 下一步：准备由用户在 Electron 宿主执行 V2C 六格验证（阶段 1→4），同步验证 HelpPanel/TourGuide。

### 待续（简记）
- 阶段 1 V2C（需用户扫码登录 B 站，Cookie 授权五步）→ 阶段 2 Pub/Upd/Del → 阶段 3 Img → 阶段 4 查看 →
  阶段 5 宿主验证 HelpPanel/TourGuide → 阶段 6 回写 SSOT + en commit。

## 2026-08-24 续作（本会话：Img 修复 + 六格收官）
- 修正 MCP 模式：root cause = cordis.patch.yml 未传 `--browser-url`，MCP 处于独立浏览器模式（`list_pages` 见 about:blank）。
  已把 `--browser-url=http://127.0.0.1:9222` 加回并重启 DSH Web，MCP 恢复 9222 直连思源宿主。
- **Img 复核（推翻先前「Img 通过」误判）**：用 curl 解析 `https://www.bilibili.com/opus/1239782240324419607` 的
  `__INITIAL_STATE__.module_content.paragraphs`：11 段全 `para_type=1` 纯文本，IMG=0 → 图片段落空白。
- **根因**：`bilibiliMdUtil.ts` `processParagraphNode`（第 223 行）把容器 `para_type` 写死为 1，
  覆盖了 `processImageNode`（第 334 行）图片段的 `para_type=2`。B 站用 `para_type` 区分段落类型（1=文本，2=图片），
  图段标成 1 → 按文本段解析 `text.nodes` 为空 → 图片渲染空白。
- **修复**：`processParagraphNode` 新增 `hasPic` 判断，`para_type: hasPic ? 2 : 1`；`bilibiliUtils.spec.ts` 新增
  断言（图片段 `para_type=2` + 图片 URL 正确），3/3 通过；`pnpm build:v2` 通过（2069 modules）。
- **宿主复验（重启思源加载新 dist-v2 后）**：带 cat 图「更新」Bilibili →   成功；curl 解析正文：段落 [8] `para_type=2`，
  含 `http://i0.hdslb.com/bfs/new_dyn/8755cca...jpg`（HTTP 200 / image/jpeg / 13246 字节）= 图片不再空白。**Img ✅**。
- **查看 ✅**：`https://www.bilibili.com/opus/<dyn_id>` 公开链接（非会话绑定），系统浏览器打开合理，HTTP 200 可访问文章正文含图。
- **阶段 5 宿主手验 ✅**：进入哔哩哔哩配置页 → 点击标题旁 ⊕ 帮助 → HelpPanel 正常渲染（summary + 查看完整文档 + 3 条 FAQ）；
  点「开始引导教程」→ TourGuide 4/4 步（第 1 步「1 / 4 Cookie 授权」已展示），全部正确定位。
- **回写 SSOT**：checklist #35 五格 ✅ + 备注（含 Img 修复详情）；T1 小结 全链路 ✅ 11→12（加入 #35）；
  修订记录追加 2026-08-24 条目。待 en commit。
