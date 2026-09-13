# Proposal: publisher-help-system

## 问题

当前帮助系统仅 `src/platforms/help.ts` 一个硬编码 Map，覆盖 6 个 GitHub 平台 URL。没有任何页面有内联帮助或可视化引导。用户面对任何功能都只能靠自己摸索或查在线文档。

更根本的问题：**Publisher 没有一个统一的帮助框架**。未来新增批量发布、仪表盘等功能时，帮助又要从零开始。

## 方案

构建**通用功能级帮助系统**，覆盖 Publisher 全部功能页面，按 `pageId` 命名空间注册，任何页面只需传 `pageId` 即可接入。

### 命名空间设计

```
help/
  quick-publish              → 快速发布页
  platform-config/<key>      → 各平台配置页（动态参数化）
  platform-select            → 平台选择页
  account-list               → 账号列表
  preference-general         → 偏好设置-通用
  preference-picbed          → 偏好设置-图床
  preference-ai              → 偏好设置-AI
  batch-publish              → 批量发布（未来）
  dashboard                  → 仪表盘（未来）
  ai-chat                    → AI 聊天
  about                      → 关于
```

### 三层架构

```
Layer 1: 配置层 (src/helpConfigs/)
  按 pageId 配置，与功能模块解耦。每个功能一份配置文件。
  
Layer 2: 注册中心 (HelpRegistry)
  统一入口，按 pageId 查询，支持参数化（如 platform-config/:key）

Layer 3: 组件层 (3 个通用组件)
  HelpPanel / FieldGuide / TourGuide — 任何页面直接复用
```

### 关键设计决策

- **pageId 驱动**，不是 platformKey 驱动。平台配置只是消费者之一。
- **参数化**：`platform-config/<key>` 运行时解析为具体平台帮助
- **扩展方式**：新功能 = 新增一个配置文件 + 页面传 `pageId`，零代码改动
- **渐进降级**：无配置的 pageId → 显示通用帮助索引链接

## 非目标

- 不替换 `siyuan.wiki` 在线文档
- 不是内嵌 Markdown 渲染器
- 不与 AI Chat 功能重复

## 成功标准

- 所有现有 V2 页面均可接入 HelpPanel（至少显示帮助文档链接）
- 高频页面有 FieldGuide 和 TourGuide
- 新增功能只需加配置文件，不写组件代码