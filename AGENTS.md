## 核心设计原则（必须牢记）

### 0. 插件宿主容器约束（最高优先级）

- **V2 插件挂载在思源宿主 DOM 的 popup/面板区域内**，不是独立网页，不是整个浏览器窗口。
- 所有 UI 锚定在 `.syp-panel` 容器内。弹窗用 `position: absolute` 的 popover 卡片而非 `el-drawer`。
- `el-dialog` 必须设置 `:append-to-body="false"`。
- `.syp-panel` 已有 `position: relative`，可作为 `position: absolute` 弹窗的定位容器。

### 1. 大胆重构，小心求证

- **大胆**：以业界当前最佳实践为准，架构上不必保守；宁可一次把抽象立对（如 `formUploadClient.postJson`、`jsonFetchClient.fetch` 单入口），不留双轨和垫片债。
- **小心求证**：每次改动以单测、构建、V2 宿主手验、checklist 为证据链。
- **全局触发**：规则与行为统一在**共用层**落地（`publishTransport`、`formUploadClient`、`xmlrpcTransport`、基类）；改一处，全链路一致。
- **功能 100% 保留**：用户可见行为、平台契约、诊断语义不能悄悄退化；重构的是结构，不是砍能力。
- **优化目标排序**：**最大扩展性** > **可用性/用户体验** > **维护成本**；V2 允许结构性 break change，但不牺牲上述行为保留。

### 2. 高内聚、低耦合

- **对外接口简单**：使用层只认少量入口（如 `webFormFetch`、`postJson`、`getFormData`），不必理解 resolve/handler/`PluginFetchUtil` 组合。
- **对内高内聚**：传输解析、执行、懒加载、`win.require` 检测集中在 facade/transport 模块内部。
- **低耦合**：平台适配器不依赖具体通道实现；XML、multipart、JSON 共用 `publishTransport` 规则、分离实现。

---

## 警示：平台 key 只允许一种标准（issue #2045 归类）

> 2026-08-24 版本 1.41.1：文章管理「平台列」把历史数据误显示为「已删除」（issue #2045 归类），该问题**持续约半个月**。根因是同一个平台 key 出现了**两种形态**却只做字符串全等比较。**今后只允许一种标准，禁止再出现第二种规则。**

### 根因（一句话）
旧版插件写入**全小写**属性 key（`custom-fs-localsystem-yaml` → 推导 `fs_localsystem`），而配置 `DynamicConfig.platformKey` 是**混合大小写**（`fs_LocalSystem`）；原 `getDynCfgByKey` 只做全等 → 返回 `null` → 显示「已删除」、图标回退 `iconOTRemove`。V1（`Admin.vue`）与 V2（`V2ArticleManage.vue`）共用的 `useArticleManage` / `ArticleManageList` 均受影响（仅显示与「点击平台单发」的 key 解析，不碰发布数据）。

### 固化规则（必须遵守）
1. **只允许一种标准**：平台 key 一律为 `type_subtype[-id]`（如 `fs_LocalSystem`、`custom_Yuqueweb-z1awjla`）；写侧只用 `getDynYamlKey(platformKey)` 生成属性 key。**新数据禁止再引入第二种 key 写法/规则。**
2. **历史兼容只走一个入口**：统一用 `normalizePlatformKey()`（`type_subtype`，去尾部实例 id，转小写；`src/platforms/dynamicConfig.ts`）作为**唯一**规范化标准，`getDynCfgByKey` 以它为比较基准（精确/大小写命中只是同一标准下的优先命中，不构成第二种规则）。**不要**为旧数据维护多套并存规则、无限容忍各种形态。
3. 需要把 key 传回发布/单发的动作，用**配置的真实 `platformKey`**（`dynCfgs[key]?.platformKey ?? key`），不要用大小写不一的推导 key。
4. **回归验证**：任何改动 key 的生成/解析/匹配时，必须确认文章管理平台列**不再出现「已删除」**，且点平台能正常进入单发；V1 与 V2 都测。

---

## 用户偏好（已学习）

- 助手回复使用**简体中文**；Git 提交说明使用**英文**。
- V2 宿主开发/验证核心三命令：`pnpm dev:v2`（调试/watch）、`pnpm build:v2`（构建）、`pnpm makeLink:v2`（软链到思源）。
- 清 diff 时直接删除文件并清理引用。
- 非琐碎代码改动前写 `.planning/` 或 OpenSpec 规划。
- OpenSpec archive 前严格审计：**根本修复**（非 mock）、**最佳实践**、**不破坏底层设计**、**不影响无关模式**，四项全部达标才 archive。
- 博客/平台配置校验走 `BlogAdaptor` / `api.checkAuth()`。
- V2 发布 HTTP 通道规范：
  - XML-RPC → `xmlrpcTransport`
  - multipart → `createFormUploadClient(...).postJson(...)`（`formUploadClient.ts`）
  - JSON/API → `createJsonFetchClient(...).fetch(...)`（`jsonFetchClient.ts`）；`BaseWebApi.webFetch` / `BaseBlogApi.apiFetch` 仅委托 facade
  - FormData 构造 → `FormDataHostUtil`
  - V2 允许 break change，直接重构到位
- V2 平台验证：**按 checklist 表从上到下顺序推进**（SSOT：`openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`，AGENTS.md 不另记批次顺序）；每站六格 **V2C / Pub / Upd / Del / Img / 查看**；通过/失败均记入 checklist SSOT。其中「**查看**」= 发布后点「查看文章」，**必须验证链接能正常打开文章**，若提示登录/失效视为 bug 需修复（如公众号会话 token 轮换→「请重新登录」）。
- **每站验证必须同时覆盖「帮助引导与文档」环节，禁止遗漏**（SOP 第三节，`docs/draft/platform-verification-sop.md`）：① 平台拆分/复用 help 配置（`src/helpConfigs/pages/platform-config/<platform>.ts`，须含 `helpUrl`+`summary`+`fields`+`faq`+`tour`，缺则补；已 `verifiedConfigs` 强制约束）并从 `remaining-t1` 移出；② `docs/draft/platforms/<platform>.md` 文档草稿（占位 helpUrl 顶部标 `TODO：待替换真实帮助文档链接`）；③ 宿主验证：该平台配置页 HelpPanel/TourGuide 正常展示。此三项与五格同等计入通过/失败，一并写回 checklist SSOT。
- **禁止在提交内容中描述对平台的逆向/观测方法**：代码注释、文档、提交信息均不得出现「逆向、实测、观测、抓包、探测、探针、编辑器反向/对照、复现」等反向工程/观察平台机制的措辞（版权与合规风险）。**处理方式**：这类"如何获知机制"的内容在写入/提交前，先**备份到 `tmp/`（gitignored，不提交）**——仓库根 `tmp/` 已在 `.gitignore`（行 17），用于后续实现参考但绝不会入库；提交/文档里只保留中性的事实契约与验证结论。重要研究素材不要直接删除，先入 `tmp/` 留档。
- **Cookie 授权平台 → V2C 标准流程（固化规则，与用户对齐，勿颠倒/跳过）**：对 Cookie 授权类网页平台（**微信公众号 / 掘金 / 知乎 / 简书 / CSDN / 语雀网页版 / Halo网页版** 等，配置页含「去授权/去登录 + 自动读取 Cookie」），在 V2 宿主做 V2C 严格按此顺序：
  1. 配置页点「**去授权 / 去登录**」→ 插件打开该平台登录窗口（扫码/账号登录）。
  2. 用户用平台账号登录成功。
  3. **关闭该登录窗口**——此步触发插件把登录态 **Cookie 保存**到本地（关键一步，勿跳过、勿直接关宿主页、勿在未关窗时点别的）。
  4. 点「**2 自动读取 Cookie**」→ 把刚保存的 Cookie 读进该账号配置。
  5. **检查其他需填写的配置字段并填写**（如平台要求的分类/专栏/标签等）；**没有需填的就直接下一步，此项不可忽略**。
  6. 点「**验证**」→ `validatePublish` 通过 → 账号状态「已授权/运行中」。
  > 第 5 步（检查并填写其他必需字段）最易漏；顺序颠倒/跳过任一 步都会导致 Cookie 读不到或账号停留「待验证/配置错误」。此规则由多个平台验证沉淀，必须遵守。

## Hermes / Agent 项目隔离

- 本仓库固定 profile 名称 `siyuan-plugin-publisher`，启动时显式指定：
  ```bash
  hermes -p siyuan-plugin-publisher
  ```

## 工作区事实（已学习）

- **V2 宿主**：`pnpm dev:v2`（调试/watch）、`pnpm build:v2`（构建入口）、`pnpm makeLink:v2`（软链到思源）；产物在 `dist-v2/`。调试由用户自行进行。
- **V1**：`pnpm dev -p siyuan`、`pnpm makeLink -p siyuan`；产物在 `dist/`。该链路**不会**启动 V2 的 Vite 配置。
- `PicbedServiceTypeEnum.None` 是用户明确选择「无图床」，视为有效值，不是未设置。
- MetaWeblog 类平台（如博客园）在平台 `*Config` 构造函数里设图床为 `Bundled`（参考 `YuquewebConfig`）。
- Agent Skills：项目 `.cursor/skills/` 或 `.claude/skills/`；全局 `~/.cursor/skills/` 或 `~/.claude/skills/`。
- V2 平台配置校验失败通过 `SypErrorDetailsPanel`（及行内摘要）展示 `errorMessage`。
- **发布传输**（XML-RPC / multipart / JSON）：插件宿主优先 `plugin-node-fetch`；有代理条件（`isUseSiyuanProxy || forceProxy`）时 loopback/私网目标亦走 forwardProxy（思源内核默认模式允许访问本机，SSRF 由内核 `SSRFSafeDialer` 兜底），无代理条件才回退 middleware-fetch；multipart 经 `formUploadClient`、JSON 经 `jsonFetchClient`；语雀 Web 不在请求前预设 transport（由 facade 解析后写入 diagnostic）；日志：`[form-upload-transport]`、`[json-fetch-transport]`。
- V2 平台验证 SSOT：`openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`。
- **Halo**：`common_Halo`（API）与 `custom_Haloweb`（网页 Cookie）是两套适配器，须分别验收。
- **`refactor-form-upload-transport`**：归档前须在 V2 宿主手验 checklist **#27、#28 的 Img**（见 checklist 修订记录）。
- 依赖 `zhi-blog-api@^1.79.0`（或更新），保证 `BlogAdaptor.checkAuth()` **返回**结果而不是把适配器结果当异常抛出。

## 发布传输架构（V2，简要）

```text
multipart：平台适配器 → FormDataHostUtil → webFormFetch/apiFormFetch → formUploadClient.postJson()
JSON/API：平台适配器 → webFetch/apiFetch → jsonFetchClient.fetch()
XML-RPC：proxyXmlrpc → xmlrpcTransport

三者共用 publishTransport/resolveTransport 规则，实现分离。
```

通道对外命名：`plugin-node-fetch` | `siyuan-forward-proxy` | `middleware-fetch`（无 `cors-middleware` 对外名）。
