# Tasks: publisher-help-system

> SSOT：本文件 + [design.md](./design.md)
> Planning 跟踪：[.planning/2026-05-27-platform-help-system/](../../.planning/2026-05-27-platform-help-system/)

## 0. 治理

- [x] 0.1 创建 OpenSpec 变更 `platform-help-guide-system`
- [x] 0.2 完成调研（findings.md）— 确定自研方案（Electron + Web 双兼容）
- [x] 0.3 撰写 proposal / design（已改为 pageId 驱动的通用框架）
- [x] 0.4 创建 `.planning/` 跟踪文件

## 1. 类型与 Registry（核心基础设施）

- [x] 1.1 定义 `IPageHelpConfig` 类型（`src/types/IPageHelpConfig.ts`）
- [x] 1.2 实现 `HelpRegistry`（`src/helpConfigs/registry.ts`）
  - pageId 查询：`get(pageId)` / `getField(pageId, field)` / `getTour(pageId)` / `getHelpUrl(pageId)`
  - pageId 解析：支持 `/` 分隔的命名空间参数化
  - fallback 链：`pageId 专属 → 目录 _default → 全局 _default`
- [x] 1.3 编写全局兜底配置 `src/helpConfigs/pages/_default.ts`
- [x] 1.4 Registry 单元测试

## 2. UI 组件（3 个通用组件，任何页面复用）

- [x] 2.1 `HelpButton.vue` — `?` 按钮，点击触发 HelpPanel
  - Props: `pageId`, `pageTitle`
- [x] 2.2 `HelpPanel.vue` — 抽屉式帮助面板
  - 从 Registry 读取 summary / helpUrl / faq
  - "开始引导教程"按钮（tour 非空才显示）
- [x] 2.3 `FieldGuide.vue` — 字段级内联提示
  - Props: `pageId`, `field`（字段名）
  - Slot: 包裹表单控件
  - 无配置时不渲染
- [x] 2.4 `TourGuide.vue` — 步骤引导 overlay（自研）
  - Teleport 到 body，全屏遮罩 + 元素高亮 + Popover
  - 步骤间切换，自动滚动 + 定位
  - localStorage 记录完成状态
  - 移动端触摸友好（按钮 ≥ 44x44px）
  - 暗色模式自动跟随
- [ ] 2.5 组件单元测试（HelpPanel / FieldGuide / TourGuide）

## 3. 页面配置覆盖（按功能）

- [x] 3.1 全局 `_default.ts`（通用帮助索引链接）
- [x] 3.2 `quick-publish.ts` — 快速发布页
- [x] 3.3 `platform-select.ts` — 平台选择页
- [x] 3.4 `account-list.ts` — 账号管理列表
- [x] 3.5 `preference-general.ts` — 偏好设置-通用
- [x] 3.6 `preference-picbed.ts` — 偏好设置-图床
- [x] 3.7 `preference-ai.ts` — 偏好设置-AI
- [x] 3.8 `ai-chat.ts` — AI 聊天
- [x] 3.9 `about.ts` — 关于页
- [x] 3.10 `platform-config/_default.ts` — 平台配置通用帮助
- [x] 3.11 `platform-config/` 高频平台（博客园、WordPress、语雀、Halo、语雀网页版、HaloWeb）
- [x] 3.12 `platform-config/` 剩余 T1 平台（29 个，已加 helpUrl，field/tour 按需追加）

## 4. 集成接入（不改架构，纯叠加）

- [x] 4.1 `V2PlatformConfigBridge.vue` — 加 `<HelpButton page-id="platform-config/<key>" />`
- [x] 4.2 `BackPage.vue` — `onHelp()` 改用 HelpRegistry
- [x] 4.3 `SinglePublish.vue` — 快速发布页接入
- [x] 4.4 `V2PreferenceSettings.vue` — 偏好设置接入
- [x] 4.5 `V2PicBedSettings.vue` — 图床设置接入
- [x] 4.6 `AiChat.vue` — AI 聊天接入

## 5. 清理

- [x] 5.1 删除 `src/platforms/help.ts`（内容已迁移）
- [x] 5.2 清理 `BackPage.vue` 旧 help 引用

## 6. 验证

- [ ] 6.1 V2 宿主手验：快速发布 + 3 个平台配置页帮助功能
- [ ] 6.2 暗色模式适配检查
- [ ] 6.3 移动端（思源 App）TourGuide 基本可用
- [ ] 6.4 回归：不影响 V1/V2 发布流程