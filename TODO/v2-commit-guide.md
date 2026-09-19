# V2 终极提交文案

> 整理日期：2026-04-03
> 用途：未来正式版提交说明备用

## Commit Title

```text
feat!: migrate V2 UI architecture from iframe SPA to native DOM mounting
```

## Commit Body

```text
BREAKING CHANGE: Introduce the V2 unified workspace and complete the UI architecture migration from iframe-based SPA hosting to native DOM mounting.

This release initiates a comprehensive UI architecture migration that transforms the publisher from an iframe-based SPA system into a natively mounted unified workspace, guided by Feishu/ByteDance-style information architecture principles and Siyuan-native UI prioritization.

Architectural Shift:
- Replace the legacy iframe + SPA dual system with a single unified workspace shell
- Move from page-based navigation to progressive disclosure within the same shell
- Establish real DOM mounting as the sole foundation for all V2 capabilities
- Deprecate iframe-based page hosting for all new V2 features

Unified Workspace Model:
- A single shell that supports both the quick-publish primary view and settings expansion
- A layout composed of a brand zone, navigation zone, and content workspace
- Progressive disclosure flow: main view -> settings navigation -> platform selection -> configuration
- A consistent mental model across all user flows

Migration Strategy:
- Introduce the `useV2UI` feature toggle to enable gradual rollout with full rollback capability
- Keep the legacy UI fully functional as the fallback path during migration
- Preserve the existing configuration format, requiring zero data migration
- Reuse existing business logic and refactor only the presentation layer

Milestone Framework (M0-M6):
- M0: Establish entry governance, unified preference loading, and the V2 Host
- M1: Establish style isolation with Siyuan native UI as the primary styling baseline
- M2-M3: Deliver the quick-publish primary view and the end-to-end publishing flow
- M4: Expand settings with account lists, image-hosting settings, and platform-configuration bridging
- M5: Gradually replace the remaining legacy settings capabilities
- M6: Complete convergence planning and define the iframe retirement roadmap

Design Principles:
- Siyuan native UI first, with custom styling only when necessary
- High determinism for both users and developers
- Progressive disclosure of complexity instead of exposing everything up front
- A single source of truth for configuration and state
- A reliable failure-recovery path at every stage

Impact Scope:
- Entry points, including the topbar and document menu
- The V2 Host mounting layer
- The `UnifiedWorkspaceShell` component architecture
- The quick-publish primary interface
- Settings expansion state management
- Image-hosting and preference settings
- Platform configuration bridging
- The build chain, including `vite.v2.config.ts` for isolated V2 validation

Migration Guide:
- Enable "Use new UI (experimental)" in preference settings to opt in to V2
- All platform adapters remain functional without modification
- Some custom interface-level settings may need to be reconfigured in the new UI
- Rollback remains available at any time through the preference toggle
```
