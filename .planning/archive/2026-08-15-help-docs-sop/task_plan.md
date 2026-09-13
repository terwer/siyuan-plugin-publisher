# 任务计划：已验证平台 help 文档补齐 + UI 功能回归 + SOP 沉淀

## 目标
1. 补齐/改进 8 个已验证平台的 help 引导与文档（缺 tour 补 tour，文档烂的写本地草稿到 `docs/draft/`，待用户提供真实链接后替换 helpUrl）
2. 更新 `platform-checklist.md`
3. 回归测试已验证平台的 UI 功能（详细发布、批量分发等非快速发布链路）
4. 沉淀一份「平台全覆盖测试 SOP」，后续每指定新平台都能按此清单执行

## 当前阶段
阶段 2

## 各阶段

### 阶段 1：需求与发现
- [x] 盘点 8 个已验证平台 help 配置（缺 tour 的是 Halo网页版）
- [x] 发现 helpUrl 乱用：多个平台共用 `siyuan.wiki/s/20230908183639-btcnnmj`（疑似博客园链接）或通用兜底 `siyuan.wiki/s/20240330142711-bc3gjg0`
- [x] 用户明确：链接先本地写草稿（docs/draft/），后续用户给真实链接再替换
- **状态：** complete

### 阶段 2：规划与结构
- [ ] 确定 helpUrl 校验方式（哪些是乱用）
- [ ] 确定 docs/draft/ 目录结构与文档模板
- **状态：** in_progress

### 阶段 3：补齐 help 配置（8 平台）
- [x] Halo网页版 custom-haloweb.ts：补 tour（5 步）+ cookie/pageType/picbedService 字段 + 4 条 faq
- [x] registry.spec.ts：verifiedConfigs 补全到 8 平台（加入 cnblogs + haloweb），并强制全 8 平台有 summary/fields/faq/tour
- [ ] 复查其余 7 平台 help 质量（已完成盘点：均完整）
- **状态：** complete

### 阶段 4：写 docs/draft/ 文档草稿（8 平台 + SOP）
- [x] 建立 docs/draft/ 目录结构
- [x] 写「平台全覆盖测试 SOP」文档（docs/draft/platform-verification-sop.md）
- [x] 8 个已验证平台文档草稿（docs/draft/platforms/*.md）
- [x] helpUrl 乱用记入各草稿 TODO（待用户给真实链接）
- **状态：** complete

### 阶段 5：UI 功能回归（仅已实现）
- [x] 快速发布：单平台发布/更新/删除（前序已验）
- [x] 账号设置：添加/管理/删除账号、启停（面板正常，Halo网页版状态"运行中"）
- [x] 图床设置：配置项可正常读取展示（awss3 等图床列表）
- [x] 偏好设置：各开关正常展示（内容处理/菜单入口/实验功能）
- [x] help 引导：Halo网页版 HelpPanel（summary+4 FAQ）+ TourGuide（5 步"1/5 站点首页"）实测正常
- 注：详细发布、批量分发、文章管理仪表盘 **未实现**，不纳入回归
- **状态：** complete

### 阶段 6：更新 checklist + 沉淀 SOP
- [x] 更新 platform-checklist.md：#28 备注补 help 引导；修订记录追加 2 条
- [x] 写「平台全覆盖测试 SOP」文档（docs/draft/platform-verification-sop.md）
- **状态：** complete

## 已做决策
| 决策 | 理由 |
|------|------|
| 文档草稿放 `docs/draft/` | 用户指定；链接维护交给用户，草稿本地可落地 |
| helpUrl 乱用暂不改代码，先记入草稿 TODO | 真实链接由用户后续提供 |
| SOP 落一个独立文档（docs/draft/ 或 docs/） | 后续每平台测试可复用 |

## 关键问题
1. helpUrl 中哪些是"乱用"（错误平台链接）？需逐一核对 siyuan.wiki 短链对应内容
2. 详细发布/批量分发在 V2 是否已桥接？（refactor-ui-v2-foundation M5/M8 未完成，可能是 V1 功能）

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
| 无 | 0 | - |
