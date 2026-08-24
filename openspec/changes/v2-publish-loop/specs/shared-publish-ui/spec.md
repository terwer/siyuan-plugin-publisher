## ADDED Requirements

### Requirement: The shared publish engine SHALL be the single source of truth for V1 and V2

The V1 and V2 publish flows SHALL reuse the same shared publish engine (`usePublish`) rather than reimplementing publish, update, preview, or post-preparation logic. The engine SHALL be the single source of truth for publish orchestration.

#### Scenario: V2 single publish performs a publish

- **GIVEN** a V2 single-publish view in the native-DOM app
- **WHEN** the user initiates a publish or update
- **THEN** the view SHALL call into the shared `usePublish` engine (`doSinglePublish`)
- **AND** it SHALL NOT reimplement transport, platform configuration, or publish orchestration

#### Scenario: V2 batch publish performs a batch loop

- **GIVEN** a V2 batch-publish view
- **WHEN** the user runs a batch publish across platforms
- **THEN** the view SHALL drive the platform loop through the shared `usePublish` engine
- **AND** the per-platform execution SHALL match the V1 batch-publish behavior

### Requirement: The V2 publish views SHALL be decoupled from vue-router and host stores

The V2 publish views SHALL not depend on vue-router, and SHALL not import V1 Pinia stores or a router singleton as a hard dependency. User-facing copy SHALL be resolved through the V2 host-backed i18n path.

#### Scenario: V2 publish view is inspected

- **WHEN** reviewers inspect a V2 publish view or its composable
- **THEN** it SHALL not reference vue-router
- **AND** it SHALL not import V1 Pinia stores directly for navigation
- **AND** translation SHALL be resolved via `useV2I18n`

#### Scenario: V2 publish view navigates

- **WHEN** a V2 publish view signals a navigation action (back, switch target)
- **THEN** it SHALL emit an event that the V2 host wires to its `currentView` state machine
- **AND** it SHALL NOT call `router.push`

### Requirement: V2 publish views SHALL use native presentation within the panel

The V2 single-publish and batch-publish views SHALL render with SiYuan-native presentation inside the `.syp-panel` container, and SHALL introduce full-width dialogs only when needed with `:append-to-body="false"`.

#### Scenario: V2 publish view renders

- **WHEN** a V2 publish view renders
- **THEN** it SHALL render within the `.syp-panel` container using host styling primitives
- **AND** any popover/dialog SHALL be positioned within the panel (not appended to body)

### Requirement: The shared publish engine SHALL preserve V1 behavior when used by V1

The V1 publish flows SHALL remain behaviorally equivalent after the shared engine is reused by V2. Platform selection, post preparation, publish/update/preview, and result feedback SHALL match the pre-change behavior.

#### Scenario: V1 regression after V2 reuses the engine

- **GIVEN** V2 publish views reuse the shared `usePublish` engine
- **WHEN** the V1 host continues to use the same engine through its own pages
- **THEN** the V1 publish flows SHALL behave identically to before
- **AND** no user-visible behavior SHALL regress

### Requirement: V2 publish views SHALL reuse the shared batch execution semantics

The V2 batch-publish view SHALL reuse the same per-platform execution semantics as V1 batch publish (per-platform config fetch, post preparation, single publish, result collection).

#### Scenario: V2 batch view executes

- **WHEN** a V2 batch-publish view executes a batch loop
- **THEN** it SHALL fetch per-platform config and prepare posts the same way V1 batch publish does
- **AND** it SHALL collect per-platform success/failure results for display
