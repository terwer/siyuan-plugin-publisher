## ADDED Requirements

### Requirement: Verified platforms SHALL accumulate complete help coverage

For every platform that is marked as verified in `v2-platform-verification-v1-retirement/platform-checklist.md`, the system SHALL provide platform-specific help coverage that captures the verified configuration path and common pitfalls.

#### Scenario: Platform has completed V2 verification

- **WHEN** a platform has completed its required V2 verification cells in the platform checklist
- **THEN** the corresponding `platform-config/<platformKey>` help entry SHALL be reviewed for platform-specific coverage
- **AND** verified configuration knowledge SHALL be added to a dedicated platform help config when the generic fallback is insufficient

#### Scenario: Platform is not yet verified

- **WHEN** a platform remains unverified in the platform checklist
- **THEN** the system SHALL NOT require a complete tour or field guide for that platform
- **AND** the platform MAY continue using a lightweight `helpUrl` fallback until verification provides reliable details

### Requirement: Platform help configs SHALL meet a minimum coverage standard

A platform-specific help config SHALL include enough information for a user to configure the platform without relying only on external documentation.

#### Scenario: Complete platform help config is added

- **WHEN** a platform is promoted from `remaining-t1.ts` to a dedicated help config file
- **THEN** the config SHALL include a `summary`
- **AND** it SHALL include `fields` for the platform's high-risk configuration inputs
- **AND** it SHALL include at least one `faq` entry when verification identified a real pitfall, policy limit, or troubleshooting path

#### Scenario: Tour steps are added

- **WHEN** a platform help config defines `tour` steps
- **THEN** every tour step target SHALL point to a stable DOM anchor such as `data-syp-tour`
- **AND** missing anchors SHALL be added with minimal markup-only changes before the tour is considered complete

### Requirement: Help coverage SHALL follow the platform verification sequence

The help coverage workflow SHALL use the same practical priority as V2 platform verification: verified and high-frequency platforms first, then newly verified platforms as they pass.

#### Scenario: Existing verified platforms are audited

- **WHEN** this change is applied
- **THEN** the implementation SHALL first audit already verified T1 platforms for help coverage gaps
- **AND** it SHALL prioritize platforms whose help config is still only represented in `remaining-t1.ts`

#### Scenario: New platform verification completes later

- **WHEN** a new platform verification is marked complete after this change begins
- **THEN** the platform help coverage task list SHALL be updated or checked off in the same work cycle
- **AND** lessons from the verification SHALL be captured in `fields`, `faq`, or `tour` as appropriate

### Requirement: Help coverage SHALL remain separate from verification SSOT

The platform verification checklist SHALL remain the SSOT for V2C/Pub/Upd/Del/Img status, while this change SHALL track help coverage separately.

#### Scenario: Help coverage is updated

- **WHEN** a platform help config is completed or improved
- **THEN** `v2-platform-verification-v1-retirement/platform-checklist.md` SHALL NOT be used as the primary help coverage tracker
- **AND** help coverage progress SHALL be recorded in this change's `tasks.md` or supporting coverage notes

#### Scenario: Verification checklist is updated

- **WHEN** a platform verification status changes in the platform checklist
- **THEN** the maintainer SHALL check whether the help coverage task for that platform also needs to be created, updated, or completed
