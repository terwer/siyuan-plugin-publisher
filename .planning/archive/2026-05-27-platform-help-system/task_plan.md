# 平台帮助与可视化指引系统 — 任务规划

> 创建日期：2026-05-27
> 关联 OpenSpec：`platform-help-guide-system`

## 背景

当前 `src/platforms/help.ts` 是一个硬编码的静态映射表，仅覆盖 6 个 GitHub 平台，其余平台统一跳转通用帮助索引页。V2 配置页没有任何内联帮助或可视化指引。每新增平台帮助需要改代码。

## 目标

构建**配置驱动的全平台帮助 + 可视化指引系统**：
- 每个平台配置页都有对应文档链接和可视化引导
- 一次定义（配置文件），全链路复用
- 不能只是一堆链接，要提升体验层次（内联提示 → 步骤引导 → 完整文档）

## 分阶段计划

### Phase 1：调研与架构设计

**任务**：
1. 调研第三方产品导览库 vs 自研方案
   - driver.js：4KB gzip，MIT，框架无关，step-by-step overlay
   - shepherd.js：功能丰富，依赖 Popper.js，bundle 较大
   - intro.js：AGPL 商用需授权（排除）
   - 自研方案：基于 Element Plus ElPopover/ElTooltip + 自定义 step 组件
2. 确定最终技术选型（推荐：自研 MVP → driver.js 作为可选升级）
3. 设计配置文件 schema

**产出**：
- `findings.md` — 调研报告及推荐理由
- `design.md`（OpenSpec）— 架构设计

### Phase 2：配置系统实现

**任务**：
1. 定义 `PlatformHelpConfig` 类型系统
   ```ts
   interface PlatformHelpConfig {
     platformKey: string
     helpUrl?: string           // 完整帮助文档链接
     quickStart?: QuickStart    // 快速开始步骤
     fields?: Record<string, FieldHelp>  // 字段级帮助
     tour?: TourStep[]          // 可视化引导步骤
   }
   ```
2. 实现 `PlatformHelpRegistry` — 读取配置、按平台查询
3. 迁移现有 `help.ts` 到配置文件格式
4. 为高频平台（博客园、WordPress、语雀、Halo）编写首批配置

**产出**：
- 类型定义 + Registry 实现
- 首批 5-8 个平台配置文件

### Phase 3：UI 组件实现

**任务**：
1. 重构 `BackPage.vue` 帮助按钮 → 使用新 Registry
2. 实现 `HelpPanel` 组件 — 侧边栏/抽屉式帮助面板
3. 实现 `FieldGuide` 组件 — 字段级内联提示（? 图标 + tooltip）
4. 实现 `TourGuide` 组件 — 步骤式可视化引导（highlight overlay）
5. 集成到 `V2PlatformConfigBridge.vue`
6. 兜底：无配置的平台显示通用帮助索引

**产出**：
- 3 个可复用组件
- V2 配置页全平台覆盖

### Phase 4：全平台配置覆盖

**任务**：
1. 为所有 35 个 T1 平台编写配置
2. 优先高频平台（博客园、WordPress、Halo、语雀）
3. 静态站点类平台共享通用配置 + 差异字段
4. Web Cookie 平台单独配置

**产出**：
- 35 个平台完整覆盖

### Phase 5：验证与文档

**任务**：
1. V2 宿主手验至少 5 个平台的帮助/引导功能
2. 回归验证：不影响现有发布流程
3. 编写配置添加指南（CONTRIBUTING 或 wiki）

**产出**：
- 验证报告
- 配置添加文档