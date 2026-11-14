# Tasks: complete-platform-help-tour-coverage

> 关联主线：`platform-verification`
> 覆盖原则：平台验证完成后补齐帮助，不提前编造未验证平台步骤。

## 0. 治理与基线

- [x] 0.1 创建 OpenSpec 变更 `complete-platform-help-tour-coverage`
- [x] 0.2 明确本变更是 `platform-help-guide-system` 归档后的覆盖补全，不重做帮助框架
- [x] 0.3 确认当前覆盖基线：博客园完整；WordPress/语雀/Halo/语雀网页版/HaloWeb 独立配置；其余 T1 多数仍在 `platform-config/_default.ts`
- [x] 0.4 建立帮助覆盖记录文件 `coverage-log.md`，记录每个平台补齐依据与验证日期

## 1. 已验证平台覆盖审计

- [x] 1.1 审计 #21 博客园 `metaweblog_Cnblogs`：确认为完整样板，必要时补充最新 XML-RPC / API Token / Img 经验
- [x] 1.2 审计 #1 语雀 API `common_Yuque`：补齐 summary/fields/faq/tour，记录专业会员政策口径
- [x] 1.3 审计 #25 WordPress `wordpress_Wordpress`：补齐 XML-RPC/API URL、用户名、应用密码或 Token、图床建议
- [x] 1.4 审计 #27 语雀网页版 `custom_Yuqueweb`：补齐 Cookie 授权、图片上传、错误详情说明
- [x] 1.5 审计 #29 本地系统 `fs_LocalSystem`：从 `platform-config/_default.ts` 拆出独立配置，补齐本地路径/YAML/图片处理说明
- [x] 1.6 审计 #30 知乎 `custom_Zhihu`：从 `platform-config/_default.ts` 拆出独立配置，补齐 Cookie 授权、平台图床、OSS SDK 注意事项
- [x] 1.7 审计 #31 CSDN `custom_Csdn`：从 `platform-config/_default.ts` 拆出独立配置，补齐 Cookie 授权、Bundled 图床、发布限制说明

## 2. 当前进行中平台

- [x] 2.1 等 #28 Halo 网页版 `custom_Haloweb` Cfg/Pub/Upd/Del/Img 手验完成后，补齐 `custom-haloweb.ts` 的最新配置与 FAQ
  - 2026-09-24 收口：#28 已在 `platform-checklist.md` 1.7b 全链路 ✅（Cfg forwardProxy 200 / Pub / Upd / Del / Img）；`custom-haloweb.ts` 含 helpUrl + summary + fields + faq（4 条）+ tour（5 步：站点首页 → API 地址 → Cookie 授权 → 图片发布 → 验证并保存），并纳入 `registry.spec.ts` 的 `verifiedConfigs`。
- [x] 2.2 如果 #28 验证中发现新的失败模式，同步写入 `custom-haloweb.ts` 的 FAQ 或 `coverage-log.md`
  - 已落 FAQ：「提示「Invalid URL」？→ 先填写站点地址（完整 URL），再点击登录或读取 Cookie」（对应 1.7b.1 预置 `authUrl=/login` 缺陷）；「Cookie 验证失败？→ 登录状态失效后接口返回登录页，表现为配置验证异常」。

## 3. 后续平台联动规则

> 2026-09-24 收口：本节的「验证一个平台即补齐该平台帮助」已从逐项待办升级为**固化规则**——`platform-checklist.md` 的「字段指引与帮助引导（SOP §3.5）— 35 站回写」表逐站记录，并由 `registry.spec.ts`（`verifiedConfigs` 35 项冻结）、`fieldGuideRulers.spec.ts`（键尺 / 覆盖尺 / 冻结行守卫尺）、`tourAnchors.spec.ts`（锚点契约）强制。T1 35/35 全链路通过后，各站帮助配置均已补齐，本节 3.1–3.6 逐条闭环。

- [x] 3.1 当 #2–#5 Common 任一平台验证通过时，同步补齐对应平台帮助配置（Notion / Halo / Telegraph / Confluence 四站已补齐并纳入 `verifiedConfigs`）
- [x] 3.2 当 #6–#13 Github 任一平台验证通过时，同步补齐对应平台帮助配置，优先沉淀仓库、分支、目录、静态站点类型字段（8 站已补齐，字段指引按冻结行逐项一致）
- [x] 3.3 当 #14–#20 Gitlab 任一平台验证通过时，同步补齐对应平台帮助配置，优先沉淀 token、仓库路径、分支、目录字段（7 站已补齐）
- [x] 3.4 当 #22–#24 MetaWeblog 任一平台验证通过时，同步补齐 XML-RPC endpoint、用户名、密码/API Token 说明（Typecho / Jvue / MetaWeblog 通用三站已补齐）
- [x] 3.5 当 #26 WordPress.com 验证通过时，同步补齐 WordPress.com 与自托管 WordPress 的差异说明（`wordpress-wordpressdotcom.ts` 与 `wordpress-wordpress.ts` 分立并纳入 `verifiedConfigs`）
- [x] 3.6 当 #32–#35 自定义平台桥接任一平台验证通过时，同步补齐 Cookie 授权、登录入口、图床/媒体限制说明（简书 / 掘金 / 微信公众号 / 哔哩哔哩四站已补齐）

## 4. Tour 锚点与表单接入

- [x] 4.1 盘点已验证平台配置表单是否存在稳定 `data-syp-tour` 锚点
- [x] 4.2 对缺少锚点但需要 tour 的平台，补充最小 `data-syp-tour` 标记，不改变业务逻辑
- [x] 4.3 验证新增 tour step 在宿主容器内定位正确，不越出插件容器
  - 契约层：`tourAnchors.spec.ts` 断言 tour 锚点必须是该平台真实渲染的锚点（鉴权行按 `passwordType` 三选一）；宿主层：`platform-checklist.md` 逐站记录 TourGuide 步数达成（如 9/9、8/8、6 步等），全部在宿主插件容器内定位。

## 5. 测试与验收

- [x] 5.1 为新增/拆分的平台 help config 补充 registry 单测或快照式覆盖检查
- [x] 5.2 运行 `pnpm vitest run src/helpConfigs/registry.spec.ts`
- [x] 5.3 运行 `pnpm build`
- [x] 5.4 宿主手验：HelpPanel 可打开、FieldGuide 可见、TourGuide 可完成
  - `platform-checklist.md` 35 站逐站记录：HelpPanel 专属 summary + FAQ（3–7 条）、字段指引条数与冻结行逐项一致、TourGuide 步数（4–9 步）全达成；口径注记见 checklist「字段级指引的 tip 用 `el-tooltip :teleported="false"` 留在 `.syp-panel` 内，而 `HelpPanel` 经 `Teleport` 挂到 `.syp-app`」。
- [x] 5.5 每次平台验证 checklist 更新后，同步检查本 tasks 是否需要新增/勾选帮助覆盖任务
  - 该联动已升级为**长期规则**：AGENTS.md「每站验证必须同时覆盖「帮助引导与文档」环节，禁止遗漏」（SOP 第三节）+ checklist SOP §3.5 回写表，不再依赖本变更的 tasks 勾选。

## 归档审计结论（2026-09-24）

- **交付版本**：`2.0.0`（2026-09-23 发行）。
- **根本修复（非 mock）**：35 个平台 help 配置（`src/helpConfigs/pages/platform-config/*.ts`）+ `docs/platforms/` 35 篇文档为真实交付；宿主逐站手验记录在 `platform-checklist.md`，未以占位或 mock 冒充通过。
- **最佳实践**：不新造帮助匹配机制——动态实例 key 归一化复用 `src/platforms/dynamicConfig.ts` 的既有 key 规则（见 `normalize-platform-guide-example-matching`）；覆盖度由单测守卫尺冻结（`registry.spec.ts` / `fieldGuideRulers.spec.ts` / `tourAnchors.spec.ts`）。
- **不破坏底层设计**：未改 HelpRegistry / HelpPanel / TourGuide 框架，仅补平台帮助配置与最小 `data-syp-tour` 锚点。
- **不影响无关模式**：2026-09-24 复跑 `pnpm vitest run` = **72 文件 / 394 用例全绿**。
- **归档动作**：本变更 delta 合并至 `openspec/specs/platform-help-tour-coverage/spec.md`；长期联动规则已固化在 AGENTS.md 与 SOP，不随本变更归档而失效。

