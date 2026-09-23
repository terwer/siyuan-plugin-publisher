# platform-verification Specification

## Purpose

定义思源发布插件全平台验收的分层、检查项、进度维护规则，以及旧界面 iframe 退役门禁；验收主表以变更目录内 `platform-checklist.md` 为唯一真相源。

## ADDED Requirements

### Requirement: Platform verification checklist SHALL be maintained as a single OpenSpec artifact

The project SHALL maintain exactly one authoritative platform verification checklist at `openspec/changes/platform-verification/platform-checklist.md`. Contributors SHALL NOT maintain parallel copies under `.planning/` or `.qoder/plans/` for the same verification matrix.

#### Scenario: Contributor updates verification progress

- **WHEN** a platform passes or fails platform verification
- **THEN** the contributor updates only `platform-checklist.md` in this change directory
- **AND** optional session notes MAY be appended to `verification-log-*.md` in the same directory
- **AND** no duplicate checklist is updated elsewhere

### Requirement: T1 platforms SHALL complete the full-path matrix

For each platform listed in T1 (interface bridge platforms per `bridgeRegistry.ts`), the system SHALL be verified for: Cfg (configure + validate + `canPublish`), Pub, Upd, Del, and Img (success or documented `success_with_warnings`).

#### Scenario: T1 platform passes full verification

- **GIVEN** a T1 platform account with valid credentials
- **WHEN** the verifier completes the quick publish flows in the interface
- **THEN** all five columns Cfg/Pub/Upd/Del/Img are marked ✅ in the checklist
- **AND** `pnpm build` succeeds for the release under test

#### Scenario: T1 platform fails one step

- **GIVEN** any of Cfg/Pub/Upd/Del/Img fails
- **WHEN** the failure is recorded
- **THEN** the checklist marks the failing cells ❌ or 🟡
- **AND** a corresponding task is added to `tasks.md` or a child OpenSpec change is created

### Requirement: Third-party membership limits SHALL NOT count as plugin blockers

When a platform requires a paid tier or quota from the **target service** (e.g. Yuque Open API professional membership), that constraint SHALL be documented in the checklist remarks and product copy, but SHALL NOT be listed under «current plugin blockers» nor prevent Gate A if holders of valid accounts can pass all T1 cells.

#### Scenario: Yuque API with professional membership

- **GIVEN** a Yuque API token on a professional (or equivalent paid) account
- **WHEN** configuration and publish flows are executed
- **THEN** T1 row #1 MAY be marked fully ✅
- **AND** the checklist «current blockers» section remains empty for Yuque API

### Requirement: Legacy interface retirement SHALL follow Gate A through Gate D

The project SHALL NOT mark the legacy interface deprecated until Gate A is satisfied. The project SHALL NOT remove legacy iframe/SPA hosting until Gate D is satisfied after Gate C and three release versions.

#### Scenario: Gate A incomplete

- **GIVEN** any T1 row lacks ✅ for all five cells (and is not an acknowledged plugin blocker)
- **WHEN** a contributor proposes Gate C or Gate D
- **THEN** the proposal is rejected until T1 is complete

#### Scenario: Gate C after full T1 pass

- **GIVEN** all 29 T1 platforms are ✅ per the checklist
- **WHEN** maintainers approve legacy interface deprecation
- **THEN** documentation and preferences state the legacy interface is deprecated and the current interface is default
- **AND** 旧界面开关关闭时 rollback remains available until Gate D

#### Scenario: Gate D iframe removal

- **GIVEN** Gate C has been in effect for three release versions
- **WHEN** maintainers execute iframe retirement
- **THEN** the current interface covers all user-visible functions required by `ui-migration`
- **AND** the checklist change is archived with final verification notes

### Requirement: Web Cookie platforms promoted to the interface bridge SHALL be tracked in the T1 matrix

When a formerly T2a Web Cookie platform is wired into `bridgeRegistry.ts` and becomes selectable in the interface, it SHALL move from the T2a invisibility matrix into the T1 full-path matrix. Its legacy-interface fallback path SHALL remain available until Gate D, but `Inv ✅` is no longer the expected result for that platform.

#### Scenario: Zhihu and CSDN in the account picker

- **WHEN** a user opens «add platform» in the interface
- **THEN** `custom_Zhihu` and `custom_Csdn` are offered via the interface bridge
- **AND** their Cfg/Pub/Upd/Del/Img results are tracked in the T1 checklist
- **AND** legacy interface configuration fallback remains functional until Gate D
