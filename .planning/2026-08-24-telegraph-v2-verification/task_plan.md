# Telegraph（common_Telegraph）V2 验证方案

> 结论先行：Telegraph 是**最难测、最易投机取巧**的平台。已通过代码探索确认多个「无法真实通过」的格（Del 无实现、Img 依赖外部 PicGo/公网图床、V2C 依赖公网代理）。本方案优先把这些风险点和决策点列清，**在宿主实测前先与用户对齐**，避免把「投机通关」当成「验证通过」。

## 一、探索结论（已确认，见 findings.md）
- Telegra.ph 是网站非 API，靠「公网 CORS 代理 / siyuan 代理 + 表单 POST」模拟。
- 默认匿名模式无真实账号；会话凭证是本地 `tph_uuid` cookie。
- **Del**：`deletePost` 直接 throw「暂不支持删除」。**无实现。**
- **Img**：`newMediaObject` 注释禁用；`bundledPicbedSupported=false`、`picgoPicbedSupported=true`。`telegraph.md` 把 markdown 图片 URL 原样当 `<img src>`，不处理本地资产生成公网图。→ 图片必须先用 PicGo 传到公网图床；否则文章图片空白。
- **V2C**：`validatePublish` 恒 `{canPublish:true}`；是否算「已授权」取决于配置页「验证」那一步调 `/check`（匿名建会话）能否成功，默认打公网 middleware `https://api.terwer.space/api/middleware`。
- **查看**：`https://telegra.ph/<path>`，需 home 正确。

## 二、需要与用户对齐的决策点（重要，勿擅断）
1. **Del 格如何处理？**
   - 平台无删除能力，`deletePost` 抛错。候选处理：
     - a) 视为「平台能力缺失」→ 标 `N/A`（非 ✅ 非 ❌）；checklist 备注说明。
     - b) 尝试是否 telegra.ph 有其它删除入口（如登入作者后台可删除？）——需进一步确认；若无则回 a。
   - 倾向 **a**，但需用户确认。
2. **Img 格如何算「真通过」？**
   - 前提：有可用 PicGo + 公网图床（如阿里云 OSS，Notion 曾用）。若 config 里图床已配置可复用之。
   - 若**没有**可用公网图床 → Img 只能**"投机"标通过**（图片空白但文章发布成功），这不算真验。需用户提供图床或接受「图片本地 URL 在公网不可访问」作为已知限制。
3. **V2C 依赖公网代理**：若 `/check` 走公网 middleware 不通（被墙/限流），V2C 失败——需判断这是环境问题还是适配器缺陷。可用 siyuan 代理/forceProxy 通道规避（需看传输规则），但也可能被 SSRF 规则限制。

## 三、验证步骤（探索确认后，分阶段）
### 阶段 0：环境与可达性确认
- [x] host 下打开 Telegraph「配置页」，确认字段（登录模式 / API地址/作者/Uuid/Hash / 刷新授权 / 预览规则 / 发布格式 / 图床服务）与实际 label。
- [x] `home`/`apiUrl` 确认：`home`(平台首页)**为空需手填** `https://telegra.ph`；`apiUrl=https://edit.telegra.ph`（默认）。
- [x] 点「验证」（匿名）→ **失败**：`GET https://edit.telegra.ph/check → getaddrinfo ENOTFOUND edit.telegra.ph`（见 progress 二点七）。
- [x] 宿主机验证：`edit.telegra.ph`/`telegra.ph` DNS 解析失败（无代理）；`api.terwer.space/api/middleware` 返回 404。
- [ ] **待定**：是否启用代理（如 hiddify 127.0.0.1:12334）让宿主可访问 telegra.ph，以便继续真实验证（V2C/Pub/查看/Upd）；否则当前环境无法访问 telegra.ph，验证受阻。→ 已向用户确认。

### 阶段 1：V2C
- [ ] 匿名模式点「验证」→ 若成功，账号「运行中/已授权」；`password` 被写为 `tph_uuid`，`saveHash` 记录 `save_hash`。
- [ ] 记录是否真的建了 telegra.ph 会话（可从配置存储看 password→tph_uuid、saveHash）。

### 阶段 2：Pub
- [ ] 发一篇纯文本文档 → 观察「发布成功」+ 记录返回 postid（`{update_cookie,page_id,path,save_hash}`）。
- [ ] **确认 telegra.ph 上真实出现该文章**（不是 mock）。查 `/save` 返回 `path`；用「查看」链接打开验证。

### 阶段 3：查看
- [ ] 点「查看文章」→ 链接应为 `https://telegra.ph/<path>`（拼 home），能正常打开（匿名可访问）。

### 阶段 4：Upd
- [ ] 修改该文档再「更新」→ `editPost` 用 `page_id` 覆盖是否真更新同一篇 telegra.ph 文章。

### 阶段 5：Img（依赖用户提供公网图床，未提供则先记录限制）
- [ ] 配置「PicGo」+ 公网图床；发含本地图文档 → 文章 `<img>` 是否为公网 URL、可访问。
- [ ] 对照：不使用图床（图床=无）发含本地图文档 → 预期 `127.0.0.1:53180/assets/...` 进 `<img src>`，公网打开空白（验证投机风险属实）。

### 阶段 6：Del（对齐后）
- [ ] 按决策（N/A 或确认事实）记录 `deletePost` 抛「暂不支持删除」。

### 阶段 7：SOP §3 帮助引导（若平台可用）
- [ ] 补/建 `src/helpConfigs/pages/platform-config/common-telegraph.ts`（helpUrl+summary+fields+faq+tour）；从 remaining-t1 移出；纳入 verifiedConfigs。
- [ ] `docs/draft/platforms/common-telegraph.md`（占位 helpUrl 标 TODO）。
- [ ] host 验证 HelpPanel/TourGuide。

## 四、成功标准
- 六格中：V2C / Pub / Upd / 查看 若能真实通过即可计 ✅；**Del 按对齐结果记 N/A 或如实记录**；**Img 仅在公网图床可用且文章图片可访问时计 ✅**。任何「图片空白却标通过」「删除失败却标通过」都视为投机，不予接受。

## 五、风险与备注
- Telegraph 无删除 API、无内置上传，六格中有两格天然受限，属于平台能力边界而非缺陷。
- 匿名会话的 cookie 有效期/设备绑定（切设备需重新验证）可能导致后续操作失效。
- 依赖公网 middleware 的可用性，可能随环境波动。
