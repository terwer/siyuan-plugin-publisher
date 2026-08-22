# 平台全覆盖验证 SOP（V2）

> 本文是 V2 平台验证的**标准操作流程**。每新指定一个待验证平台，都按本文从上到下全覆盖执行，结果回写
> `openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`（SSOT）。

## 适用范围

- V2 快速发布（单平台发布/更新/删除/带图）+ V2 平台配置页。
- 验证载体：思源 **Electron 宿主**（`pnpm build:v2` + `pnpm makeLink:v2` 后，在思源桌面端操作）。
- 详细发布、批量分发、文章管理仪表盘尚未实现，**不纳入本轮覆盖范围**。

---

## 一、前置准备

1. 构建产物：`pnpm build:v2` 通过（含 `vue-tsc` 类型检查 + vite 打包）。
2. 软链到思源：`pnpm makeLink:v2`。
3. 确认测试账号/站点可用（本地 Docker 或用真实账号），并记录到 `account.txt`（放站点目录或 docker 目录）。
4. 打开思源桌面端 → 左上角发布工具图标 → 进入 V2 面板。

---

## 二、五格验证（每平台必做）

| 代号 | 含义 | 操作 | 通过标准 |
|------|------|------|---------|
| **V2C** | V2 配置 | 设置 → 账号设置 → 添加账号/去授权 → 填配置 → 验证/保存 | `validatePublish` 通过，账号状态「运行中」或「已授权」 |
| **Pub** | 首次发布 | 快速发布 → 选平台 → 发布 | 状态「发布成功」，平台侧可见文章 |
| **Upd** | 更新 | 快速发布 → 已发布平台 → 更新 | 「更新成功」，平台侧内容已变化 |
| **Del** | 删除 | 快速发布 → 已发布平台 → 删除 → 确认 | 「删除成功」，平台侧文章已删除/取消发布 |
| **Img** | 带图发布 | 用含图片的文档发布 | 图片上传成功（`success_with_warnings` 亦可），文章内图片 URL 已替换为平台地址 |

> 顺序：V2C → Pub → Upd → Del → Img。每格通过/失败都记录到 checklist 备注。

---

## 三、帮助引导与文档（每平台必做）

验证五格的同时，检查并补齐该平台的 help 引导与文档：

1. **help 配置**（代码层）：
   - 位置：`src/helpConfigs/pages/platform-config/<platform>.ts`
   - 必须含：`helpUrl` + `summary` + `fields`（关键字段提示）+ `faq`（≥1 条）+ `tour`（引导步骤，target 用 `[data-syp-tour='xxx']` 格式）
   - 缺则补，并在 `src/helpConfigs/registry.spec.ts` 的 `verifiedConfigs` 里加入该平台（强制约束）
2. **文档草稿**：
   - 位置：`docs/draft/platforms/<platform>.md`
   - 内容：用户友好、能落地的配置步骤（字段说明、Token/Cookie 获取、常见问题、图床选择）
   - helpUrl 若还是共享/占位链接，在草稿顶部标注 `TODO：待替换真实帮助文档链接`
3. 后续用户维护文档并给出真实链接后，替换 help 配置里的 `helpUrl`。

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
   - 更新「T1 小结」计数。
   - 在「修订记录」追加一行。
2. 更新 `tasks.md` 对应子任务勾选。
3. 若发现插件 bug，单独开 OpenSpec change 或 `.planning/` 修复，不在本 SOP 内顺手改。

---

## 附：已验证平台清单（10 个，含 help 配置状态）

| # | 平台 | platformKey | help 文件 | 文档草稿 |
|---|------|-------------|-----------|---------|
| 1 | 语雀 API | `common_Yuque` | common-yuque.ts | platforms/common-yuque.md |
| 21 | 博客园 | `metaweblog_Cnblogs` | metaweblog-cnblogs.ts | platforms/metaweblog-cnblogs.md |
| 25 | Wordpress | `wordpress_Wordpress` | wordpress-wordpress.ts | platforms/wordpress-wordpress.md |
| 27 | 语雀网页版 | `custom_Yuqueweb` | custom-yuqueweb.ts | platforms/custom-yuqueweb.md |
| 28 | Halo网页版 | `custom_Haloweb` | custom-haloweb.ts | platforms/custom-haloweb.md |
| 29 | 本地系统 | `fs_LocalSystem` | fs-local-system.ts | platforms/fs-local-system.md |
| 30 | 知乎 | `custom_Zhihu` | custom-zhihu.ts | platforms/custom-zhihu.md |
| 31 | CSDN | `custom_Csdn` | custom-csdn.ts | platforms/custom-csdn.md |
| 32 | 简书 | `custom_Jianshu` | custom-jianshu.ts | platforms/custom-jianshu.md |
| 33 | 掘金 | `custom_Juejin` | custom-juejin.ts | platforms/custom-juejin.md |
