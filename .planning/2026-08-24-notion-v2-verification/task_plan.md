# 任务计划：Notion（common_Notion）V2 全链路验证

## 目标
推进 `siyuan-plugin-publisher` V2 平台验证：完成 checklist **#2 Notion（`common_Notion`）** 全链路六格
（V2C / Pub / Upd / Del / Img / 查看）+ 帮助引导与文档，并回写 checklist SSOT。
> 用户启动顺序：B站（#35）已归档，按 checklist 自上而下，下一个为 #2 Notion。**不着急马上实现，先建计划。**

## 当前阶段
阶段 0（前置调研）

## 各阶段

### 阶段 0 — 前置调研（必要性和凭证确认）
- [ ] 确认 Notion 授权方式与需用户提供的信息（见 findings.md 已记录：API token + 授权页面/数据库给 integration）。
- [ ] 确认 V2 Bridge 是否存在（`common_Notion` 能进入 V2 配置）+ 平台列表可见性。
- [ ] 核对 help 配置是否已存在：`src/helpConfigs/pages/platform-config/` 下是否有 `common-notion.ts`（SOP 第三节要求）。
- [ ] 记录 findings.md；确认是否无需用户协助的初始化项。
- **状态：** in_progress

### 阶段 1 — V2C：API 授权配置（⭐ 需用户提供 Notion token）
- [ ] 打开 V2 面板 → 设置/账号设置 → Notion → 填 API token（`PasswordType_Token`，token 设置 URL `https://www.notion.so/my-integrations`）。
- [ ] 确认「根页面」knowledgeSpace（`allowKnowledgeSpaceChange=false`，只读）、`pageType=Markdown`、`tagEnabled/cateEnabled=false`。
- [ ] 点「验证」→ `validatePublish` 通过 → 账号「运行中/已授权」。
- **关键：** 需用户提供 Notion integration token + 在 Notion 里把目标页面/数据库 share 给该 integration。
- **状态：** pending

### 阶段 2 — Pub / Upd / Del
- [ ] Pub：快速发布 → 选 Notion → 发布，「发布成功」，平台侧可见。
- [ ] Upd：更新已发布文档，「更新成功」。
- [ ] Del：删除发布记录，平台侧已删除。
- **状态：** pending

### 阶段 3 — Img（带图）
- [ ] 含图文档发布，验证 Notion 图片上传（`uploadFile` / 图床处理），文章内图 URL 已换 Notion 资源地址。
- [ ] 记录图床 URL 作为证据。
- **状态：** pending

### 阶段 4 — 查看
- [ ] 点「查看文章」→ `https://www.notion.so/<postid>` 正常打开内容。
- [ ] 若提示登录/失效/跳系统浏览器 = bug 需修复。
- **状态：** pending

### 阶段 5 — 帮助引导与文档（SOP 第三节）
- [ ] 新增/复用 `common-notion.ts` help 配置（helpUrl + summary + fields + faq + tour；target 用 `[data-syp-tour='xxx']`）。
- [ ] 注册进 `src/helpConfigs/pages/index.ts`；从 `remaining-t1.ts` 移出；纳入 `registry.spec.ts` `verifiedConfigs`。
- [ ] 新增 `docs/draft/platforms/common-notion.md`（占位 helpUrl 顶部标 `TODO：待替换真实帮助文档链接`）。
- [ ] `registry.spec.ts` 通过 + `pnpm build:v2` 通过。
- [ ] Electron 宿主验证该平台配置页 HelpPanel / TourGuide 正常展示。
- **状态：** pending

### 阶段 6 — 回写 SSOT
- [ ] 更新 checklist #2 行六格 + 备注。
- [ ] 更新「T1 小结」计数（全链路 ✅ 12 → 13）。
- [ ] 「修订记录」追加一行。
- [ ] `en` commit（改动需 `build:v2` + 单测通过再提交）。
- **状态：** pending

## 关键问题
1. Notion 是否已有 V2 Bridge 且当前为 API token 授权（非 Cookie，无需扫码登录）？
2. Nition 图片上传走哪条通道：API 上传附件 / 还是仅 URL 引用？`uploadFile` 是否实现（`Bundled` 图床）？
3. Notion 的 `previewUrl=/[postid]` 是否拼接后开启（`getPreviewUrl` 相对路径拼 home）？
4. 帮助配置 `common-notion.ts` 是否存在？

## 已做决策
| 决策 | 理由 |
|------|------|
| 从 #2 Notion 开始 | 用户选择「按 checklist 自上而下」，B站(#35) 已归档 |

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
|      | 1       |         |

## 备注
- 每站六格 + 帮助引导与文档（SOP 第三节），通过/失败均写回 SSOT。
- API 类平台（非 Cookie）不走「去授权→登录→关窗→读 Cookie」流程；直接填 token → 验证。
- 改动要通用并走上游（`zhi-framework/zhi`）；禁写法律风险表述；中文讨论，英文 commit。
- 敏感研究先备份 `tmp/`（gitignored，不提交）。
- 随进度更新阶段状态：pending → in_progress → complete。
