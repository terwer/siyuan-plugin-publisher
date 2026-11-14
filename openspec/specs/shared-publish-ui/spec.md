# shared-publish-ui Specification

## Purpose
TBD - created by archiving change publish-loop. Update Purpose after archive.
## Requirements
### Requirement: The shared publish engine SHALL be the single source of truth

The publish flows SHALL reuse the same shared publish engine (`usePublish`) rather than reimplementing publish, update, preview, or post-preparation logic. The engine SHALL be the single source of truth for publish orchestration.

#### Scenario: Single publish performs a publish

- **GIVEN** a single-publish view in the native-DOM app
- **WHEN** the user initiates a publish or update
- **THEN** the view SHALL call into the shared `usePublish` engine (`doSinglePublish`)
- **AND** it SHALL NOT reimplement transport, platform configuration, or publish orchestration

#### Scenario: Batch publish performs a batch loop

- **GIVEN** a batch-publish view
- **WHEN** the user runs a batch publish across platforms
- **THEN** the view SHALL drive the platform loop through the shared `usePublish` engine
- **AND** the per-platform execution SHALL match the shared batch-publish behavior

### Requirement: The publish views SHALL be decoupled from vue-router and host stores

The publish views SHALL not depend on vue-router, and SHALL not import Pinia stores or a router singleton as a hard dependency. User-facing copy SHALL be resolved through the host-backed i18n path.

#### Scenario: A publish view is inspected

- **WHEN** reviewers inspect a publish view or its composable
- **THEN** it SHALL not reference vue-router
- **AND** it SHALL not import Pinia stores directly for navigation
- **AND** translation SHALL be resolved via `useAppI18n`

#### Scenario: A publish view navigates

- **WHEN** a publish view signals a navigation action (back, switch target)
- **THEN** it SHALL emit an event that the host wires to its `currentView` state machine
- **AND** it SHALL NOT call `router.push`

### Requirement: The publish views SHALL use native presentation within the panel

The single-publish and batch-publish views SHALL render with SiYuan-native presentation inside the `.syp-panel` container, and SHALL introduce full-width dialogs only when needed with `:append-to-body="false"`.

#### Scenario: A publish view renders

- **WHEN** a publish view renders
- **THEN** it SHALL render within the `.syp-panel` container using host styling primitives
- **AND** any popover/dialog SHALL be positioned within the panel (not appended to body)

### Requirement: The shared publish engine SHALL preserve existing publish behavior

The publish flows SHALL remain behaviorally equivalent after the shared engine is reused by the views. Platform selection, post preparation, publish/update/preview, and result feedback SHALL match the pre-change behavior.

#### Scenario: Regression guard after the views reuse the engine

- **GIVEN** the publish views reuse the shared `usePublish` engine
- **WHEN** the host continues to use the same engine through its pages
- **THEN** the publish flows SHALL behave identically to before
- **AND** no user-visible behavior SHALL regress

### Requirement: The publish views SHALL reuse the shared batch execution semantics

The batch-publish view SHALL reuse the same per-platform execution semantics as the shared batch publish (per-platform config fetch, post preparation, single publish, result collection).

#### Scenario: The batch view executes

- **WHEN** a batch-publish view executes a batch loop
- **THEN** it SHALL fetch per-platform config and prepare posts the same way the shared batch publish does
- **AND** it SHALL collect per-platform success/failure results for display

