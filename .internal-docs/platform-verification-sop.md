# 平台全覆盖验证 SOP

> 本文是平台验证的**标准操作流程**。每新指定一个待验证平台，都按本文从上到下全覆盖执行，结果回写
> `openspec/changes/platform-verification/platform-checklist.md`（SSOT）。

## 适用范围

- 快速发布（单平台发布/更新/删除/带图）+ 平台配置页。
- 验证载体：思源 **Electron 宿主**（`pnpm build` + `pnpm makeLink` 后，在思源桌面端操作）。
- 详细发布、批量分发、文章管理仪表盘尚未实现，**不纳入本轮覆盖范围**。

---

## 一、前置准备

1. 构建产物：`pnpm build` 通过（含 `vue-tsc` 类型检查 + vite 打包）。
2. 软链到思源：`pnpm makeLink`。
3. 确认测试账号/站点可用（本地 Docker 或用真实账号），并记录到 `account.txt`（放站点目录或 docker 目录）。
4. 打开思源桌面端 → 左上角发布工具图标 → 进入面板。

---

## 二、五格验证（每平台必做）

| 代号 | 含义 | 操作 | 通过标准 |
|------|------|------|---------|
| **Cfg** | 配置 | 设置 → 账号设置 → 添加账号/去授权 → 填配置 → 验证/保存 | `validatePublish` 通过，账号状态「运行中」或「已授权」 |
| **Pub** | 首次发布 | 快速发布 → 选平台 → 发布 | 状态「发布成功」，平台侧可见文章 |
| **Upd** | 更新 | 快速发布 → 已发布平台 → 更新 | 「更新成功」，平台侧内容已变化 |
| **Del** | 删除 | 快速发布 → 已发布平台 → 删除 → 确认 | 「删除成功」，平台侧文章已删除/取消发布 |
| **Img** | 带图发布 | 用含图片的文档发布 | 图片上传成功（`success_with_warnings` 亦可），文章内图片 URL 已替换为平台地址 |
| **查看** | 查看文章 | 点「查看文章」打开平台侧文章链接 | 链接能正常打开可访问文章内容；**若该平台文章/草稿链接提示登录或失效，视为 bug 需修复**（如公众号 token 轮换致「请重新登录」）。每站必须点一次，不可省略 |

> 顺序：Cfg → Pub → Upd → Del → Img → 查看。每格（含「查看」）通过/失败都记录到 checklist 备注。

---

## 三、帮助引导与文档（每平台必做）

验证五格的同时，检查并补齐该平台的 help 引导与文档：

1. **help 配置**（代码层）：
   - 位置：`src/helpConfigs/pages/platform-config/<platform>.ts`
   - 必须含：`helpUrl` + `summary` + `fields`（关键字段提示）+ `faq`（≥1 条）+ `tour`（引导步骤，target 用 `[data-syp-tour='xxx']` 格式）
   - `tour.target` 必须指向设置组件真实存在的锚点：鉴权行按 `passwordType` 只会渲染 `password`/`token`/`cookie` 之一，发布目录行是 `knowledgeSpace`（`LocalSystemSetting` 另有 `storePath`/`imageStorePath`/`fsYamlType`）；`src/helpConfigs/tourAnchors.spec.ts` 负责校验。注意 **`fields` 键与 tour 锚点不同名**：发布目录行的键是 `blogid`、鉴权行的键恒为 `password`（详见第 5 条）
   - 缺则补，并在 `src/helpConfigs/registry.spec.ts` 的 `verifiedConfigs` 里加入该平台（强制约束）
2. **文档草稿**：
   - 位置：`docs/draft/platforms/<platform>.md`
   - 内容：用户友好、能落地的配置步骤（字段说明、Token/Cookie 获取、常见问题、图床选择）
   - helpUrl 若还是共享/占位链接，在草稿顶部标注 `TODO：待替换真实帮助文档链接`
3. 后续用户维护文档并给出真实链接后，替换 help 配置里的 `helpUrl`。
4. **文案口径（help 配置与文档草稿共用）**：只写平台功能与配置契约——字段含义、存储目录与文件名规则、图片存储/引用路径、平台限制与常见问题解法。验证进度类叙述（哪些环节已通过、批次结论、"V2 已验证配置、发布、更新、删除…"、插件版本号限定、内部传输实现名）属于验证记录，只写本 change 的 checklist SSOT，不得进入用户可见的 `summary`/`fields`/`faq`/`tour` 与文档草稿。
5. **字段指引必须渲染并可核验**（每平台必做，与五格同等计入通过/失败）：
   - **标准**：平台配置页**每一行真实渲染的字段**都要有一个可点的 ⓘ 提示；`fields` 的键 = **该行绑定的配置属性名**（`home`/`apiUrl`/`username`/`password`/`previewUrl`/`pageType`/`blogid`/`picbedService`/平台专有键）。平台 hook 会在运行时改开关（`knowledgeSpaceEnabled` 等），**一行是否存在以宿主实测为准**，不以构造函数默认值推断。
   - **两套命名空间（易错点）**：鉴权行的 `fields` 键**恒为 `password`**，而引导锚点按 `passwordType` 三选一渲染（`password`/`token`/`cookie`）；Token 型平台的 tour 写成 `password` 就是**永远命中不到的死步骤**。`fields` 有 `password` 不等于引导能用 `password` 锚点。
   - **四个可核验点**：① 每行都有 ⓘ（无「有注释器但取不到文案」的空壳）；② 指引在字段**已填值时仍可见**；③ 弹层在 `.syp-panel` 内**不裁切不错位**；④ 动态实例 key（`custom_Csdn-z26fa1o` 这类）走 registry 回落链解析到预置平台配置。
   - **组件层挂载**：指引由 `<field-guide field="…">` 挂在设置组件内；共用表单（`base/CommonBlogSetting.vue`、`base/impl/CommonGithubSetting.vue`）已覆盖共用行，**平台专有行必须在该平台组件里挂**（包裹式用于普通控件、`inline` 用于单选组/开关）；只写 `fields` 而不挂载 = 页面上不会有 ⓘ。
   - **回归校验（自动）**：`src/helpConfigs/fieldGuideRulers.spec.ts` 三把尺——键尺（`fields` 键必须是配置实例真实属性）、覆盖尺（必须覆盖按真实渲染行冻结的键集）、守卫尺（带 `fields` 的平台页必须在冻结表 `verifiedPlatformRows.ts` 里）；引导锚点契约由 `src/helpConfigs/tourAnchors.spec.ts` 按 `passwordType` 数据驱动校验。新增/拆分平台后必须补冻结表，否则守卫尺失败并点名页面。

---

## 四、UI 功能回归（已实现功能抽查）

每验证一个平台时，顺带确认以下已实现功能无回归：

- [ ] 快速发布：单平台发布/更新/删除
- [ ] 账号设置：添加/管理/删除账号、启停开关
- [ ] 图床设置 / 偏好设置：配置可保存并生效
- [ ] help 引导（TourGuide/HelpPanel）在该平台配置页可正常展示

---

## 五、回写与收尾

1. 更新 `platform-checklist.md`：
   - 对应平台行五格更新为 `✅`/`❌`，备注写清验证日期、通道、关键现象。
   - 「字段指引与帮助引导（SOP §3）」表同步该站一行：渲染行 = 指引数、宿主判定（HelpPanel/引导步骤）、日期。
   - 更新「T1 小结」计数。
   - 在「修订记录」追加一行。
2. 更新 `tasks.md` 对应子任务勾选。
3. 若发现插件 bug，单独开 OpenSpec change 或 `.planning/` 修复，不在本 SOP 内顺手改。

---

## 附：已验证平台清单（22 个，含 help 配置状态）

> 键集不在本表重复维护：唯一来源是 `src/helpConfigs/verifiedPlatformRows.ts`（按真实渲染行冻结），
> 由 `fieldGuideRulers.spec.ts` 的两把尺强制校验。本表只登记文件与页面位置。

| # | 平台 | platformKey | help 文件 | 文档草稿 |
|---|------|-------------|-----------|---------|
| 1 | 语雀 API | `common_Yuque` | common-yuque.ts | platforms/common-yuque.md |
| 2 | Notion | `common_Notion` | common-notion.ts | platforms/common-notion.md |
| 3 | Halo | `common_Halo` | common-halo.ts | platforms/common-halo.md |
| 4 | Telegraph | `common_Telegraph` | telegraph.ts | platforms/telegraph.md |
| 5 | Confluence | `common_Confluence` | common-confluence.ts | platforms/confluence.md |
| 6 | Hexo | `github_Hexo` | common-github-hexo.ts | platforms/common-github-hexo.md |
| 7 | Hugo | `github_Hugo` | github-hugo.ts | platforms/github-hugo.md |
| 8 | Jekyll | `github_Jekyll` | github-jekyll.ts | platforms/github-jekyll.md |
| 9 | Quartz | `github_Quartz` | github-quartz.ts | platforms/github-quartz.md |
| 10 | Vuepress | `github_Vuepress` | github-vuepress.ts | platforms/github-vuepress.md |
| 11 | Vuepress2 | `github_Vuepress2` | github-vuepress2.ts | platforms/github-vuepress2.md |
| 21 | 博客园 | `metaweblog_Cnblogs` | metaweblog-cnblogs.ts | platforms/metaweblog-cnblogs.md |
| 25 | Wordpress | `wordpress_Wordpress` | wordpress-wordpress.ts | platforms/wordpress-wordpress.md |
| 27 | 语雀网页版 | `custom_Yuqueweb` | custom-yuqueweb.ts | platforms/custom-yuqueweb.md |
| 28 | Halo网页版 | `custom_Haloweb` | custom-haloweb.ts | platforms/custom-haloweb.md |
| 29 | 本地系统 | `fs_LocalSystem` | fs-local-system.ts | platforms/fs-local-system.md |
| 30 | 知乎 | `custom_Zhihu` | custom-zhihu.ts | platforms/custom-zhihu.md |
| 31 | CSDN | `custom_Csdn` | custom-csdn.ts | platforms/custom-csdn.md |
| 32 | 简书 | `custom_Jianshu` | custom-jianshu.ts | platforms/custom-jianshu.md |
| 33 | 掘金 | `custom_Juejin` | custom-juejin.ts | platforms/custom-juejin.md |
| 34 | 微信公众号 | `custom_Wechat` | custom-wechat.ts | platforms/custom-wechat.md |
| 35 | 哔哩哔哩 | `custom_Bilibili` | custom-bilibili.ts | platforms/custom-bilibili.md |
