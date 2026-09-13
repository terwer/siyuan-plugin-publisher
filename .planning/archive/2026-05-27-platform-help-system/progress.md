# 进度跟踪

> 最后更新：2026-05-27

## 当前状态：Phase 1 — 调研与架构设计

| Phase | 状态 | 开始 | 完成 |
|-------|------|------|------|
| Phase 1 调研与架构设计 | ✅ 完成 | 2026-05-27 | 2026-05-27 |
| Phase 2 配置系统实现 | ⬜ 待开始 | — | — |
| Phase 3 UI 组件实现 | ⬜ 待开始 | — | — |
| Phase 4 全平台配置覆盖 | ⬜ 待开始 | — | — |
| Phase 5 验证与文档 | ⬜ 待开始 | — | — |

## 决策记录

1. **2026-05-27**：调研完成，选择自研方案（复用 Element Plus）
2. **2026-05-27**：配置文件格式确定 —— 每平台一个 TS 文件在 `src/platforms/helpConfigs/`
3. **2026-05-27**：架构分 3 层 —— 配置层 (helpConfigs) → 注册中心 (PlatformHelpRegistry) → UI 组件层 (HelpPanel / FieldGuide / TourGuide)
4. **2026-05-27（重大修订）**：将 `PlatformHelpRegistry` 重构为通用 `HelpRegistry`，按 `pageId` 命名空间驱动，覆盖全部功能页面（快速发布、偏好设置、图床、AI 聊天……），平台配置只是其中一个命名空间 `platform-config/*`。目录从 `src/platforms/helpConfigs/` 迁移到 `src/helpConfigs/pages/`

## 阻塞项

无