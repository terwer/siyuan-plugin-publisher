## ADDED Requirements

### Requirement: UI V2 SHALL prefer SiYuan native UI and styling primitives

The V2 program SHALL prefer SiYuan native UI capabilities and the host-provided styling system before introducing custom visual components or custom styling layers.

#### Scenario: A contributor implements a V2 UI element

- **GIVEN** a contributor is implementing a V2 UI element
- **WHEN** a SiYuan native UI pattern or host styling primitive is available
- **THEN** the contributor should prefer the SiYuan native capability
- **AND** they should avoid creating a new generic component layer unless the host capability is insufficient

### Requirement: UI V2 migration SHALL be managed as a full lifecycle program

The system SHALL define UI V2 as a full lifecycle migration program rather than an isolated foundation task. The plan SHALL cover the complete sequence from entry foundation to stable release convergence.

#### Scenario: Maintainer reviews the V2 proposal

- **GIVEN** a maintainer reviews the active V2 change proposal
- **WHEN** they inspect the design and tasks
- **THEN** they must find milestone definitions that cover the full V2 lifecycle
- **AND** the plan must not stop at entry foundation alone

### Requirement: UI V2 SHALL migrate away from iframe-based SPA hosting

The V2 program SHALL treat iframe-based SPA hosting as a legacy compatibility path. New V2 capabilities SHALL be implemented through real DOM mounting inside the plugin runtime.

#### Scenario: Contributor proposes a new V2 feature implementation

- **GIVEN** a contributor is implementing a new V2 capability
- **WHEN** they choose its rendering model
- **THEN** the capability must use real DOM mounting inside the plugin runtime
- **AND** it must not introduce a new iframe-based page for V2

### Requirement: UI V2 implementation SHALL proceed sequentially by milestone

The system SHALL define UI V2 work as milestone-gated delivery. Only one milestone may be active at a time, and implementation of the next milestone SHALL NOT begin until the previous milestone has passed acceptance.

#### Scenario: Attempt to start Milestone 1 before Milestone 0 is accepted

- **GIVEN** Milestone 0 acceptance criteria are not fully met
- **WHEN** a contributor proposes implementation work for Milestone 1
- **THEN** that work must be blocked
- **AND** the contributor must return to Milestone 0 remediation

#### Scenario: Attempt to start a later milestone before the current milestone is accepted

- **GIVEN** the active milestone has not passed acceptance
- **WHEN** a contributor starts implementation work from any later milestone
- **THEN** that work must be blocked

### Requirement: Milestone 0 SHALL establish a working V2 entry foundation

Milestone 0 SHALL be limited to the V2 entry foundation, including the V2 toggle, the V2 host bootstrap, a single preference configuration source, and a safe rollback path to the legacy UI.

#### Scenario: V2 toggle is disabled

- **GIVEN** `useV2UI` is `false`
- **WHEN** the user clicks the primary publish entry
- **THEN** the legacy UI path must be used

#### Scenario: V2 toggle is enabled

- **GIVEN** `useV2UI` is `true`
- **WHEN** the user clicks the primary publish entry
- **THEN** the V2 host must be launched
- **AND** the legacy menu must not be shown as the primary path

#### Scenario: V2 host initialization fails

- **GIVEN** `useV2UI` is `true`
- **AND** the V2 host throws an initialization error
- **WHEN** the user invokes the primary publish entry
- **THEN** the system must fall back to the legacy UI path
- **AND** the failure must be logged

#### Scenario: Milestone 0 foundation is reviewed for runtime direction

- **GIVEN** Milestone 0 foundation work is under review
- **WHEN** reviewers inspect the runtime path
- **THEN** the V2 primary path must be based on real DOM mounting
- **AND** the foundation must not depend on introducing a new iframe runtime

### Requirement: UI V2 and legacy entrypoints SHALL share one preference source of truth

All runtime decisions that affect V2 toggling and publish-entry behavior SHALL read from a single preference configuration gateway. Entrypoints SHALL NOT directly read ad hoc browser storage when making those decisions.

#### Scenario: Settings save the V2 toggle

- **GIVEN** the user enables or disables `useV2UI` in settings
- **WHEN** a publish entrypoint reads the toggle value
- **THEN** it must read the persisted value from the shared preference gateway
- **AND** it must not rely on a separate direct browser-storage path

### Requirement: UI V2 SHALL use one unified workspace shell

The system SHALL use one unified workspace shell for V2. Quick publish and full settings workflows SHALL be different display states of the same shell, rather than separate product frames.

#### Scenario: User opens V2 from the primary publish action

- **GIVEN** the user invokes the primary publish entry
- **WHEN** V2 opens in its main task path
- **THEN** the system must render the unified workspace shell in its main view state
- **AND** navigation and detail areas may be hidden or collapsed
- **AND** the user should not be forced into a separate settings frame first

#### Scenario: User enters complete settings mode

- **GIVEN** the user navigates into full settings
- **WHEN** the system renders the settings workflow
- **THEN** it must keep using the same unified workspace shell
- **AND** that shell must expand its settings navigation area and content workspace
- **AND** the workflow must not jump to a disconnected shell model

### Requirement: UI V2 main view SHALL prioritize quick publish

The main V2 view SHALL prioritize the quick publish workflow for the current document.

#### Scenario: Main view is rendered

- **GIVEN** the user opens V2 in its default state
- **WHEN** the main view is rendered
- **THEN** quick publish content must be primary
- **AND** detailed settings regions should be hidden, collapsed, or deemphasized
- **AND** configured publish targets should be visible to the user

### Requirement: UI V2 settings workflows SHALL expand progressively inside the same shell

The unified workspace shell SHALL support progressive disclosure. Settings workflows SHALL expand additional navigation and detailed form regions in the same shell.

#### Scenario: User expands settings from the main view

- **GIVEN** the user is in the V2 main view
- **WHEN** the user enters settings
- **THEN** additional navigation and detail regions may be expanded
- **AND** they must remain within the same workspace shell

### Requirement: UI V2 SHALL support account management workflows

The V2 settings workflow SHALL support account management as part of the unified workspace.

#### Scenario: User manages accounts

- **GIVEN** the user enters account settings
- **WHEN** the account workflow is rendered
- **THEN** the system must support an account list view
- **AND** the system must support platform selection for new accounts
- **AND** the system must support entering platform configuration details

### Requirement: UI V2 SHALL support grouped PicBed settings

The unified workspace settings content SHALL support grouped headings and aligned form rows for PicBed settings.

#### Scenario: User opens PicBed settings

- **GIVEN** the user selects the PicBed category
- **WHEN** the content workspace renders
- **THEN** the workspace must show the category title
- **AND** the workspace must allow grouped configuration sections
- **AND** form fields must remain aligned and scannable

### Requirement: UI V2 SHALL support preference settings within the unified workspace

The V2 settings workflow SHALL support preference settings within the unified workspace without requiring the user to leave the shell.

#### Scenario: User opens preference settings

- **GIVEN** the user selects the preference category
- **WHEN** the preference workflow is rendered
- **THEN** the preference content must be shown within the unified workspace shell
- **AND** the workflow must remain part of the same settings navigation model

### Requirement: UI V2 SHALL preserve compatibility while bridging legacy configuration forms

The V2 migration SHALL preserve configuration compatibility and may bridge legacy platform configuration forms until new abstractions are ready.

#### Scenario: A platform configuration is not yet fully rewritten for V2

- **GIVEN** the user enters platform configuration in V2
- **WHEN** the new V2-native form is not yet available
- **THEN** the system may bridge to compatible legacy configuration logic
- **AND** the existing configuration format must remain unchanged

#### Scenario: A bridge is needed during migration

- **GIVEN** a capability has not yet been fully rewritten for V2
- **WHEN** a temporary bridge is introduced
- **THEN** the bridge should prefer shared logic and shared configuration parsing
- **AND** it should avoid introducing new long-term iframe dependencies

### Requirement: UI V2 SHALL use one host-backed i18n source

The V2-native UI SHALL use `siyuan/i18n/*` as its single i18n source of truth. V2-native components SHALL NOT introduce a second independent locale bundle for the same UI surface.

#### Scenario: Contributor adds new V2-native copy

- **GIVEN** a contributor adds or updates copy in a V2-native publish or settings view
- **WHEN** they register the text
- **THEN** the key must be added to the host-backed `siyuan/i18n/*`
- **AND** the V2 component must read it through the V2 host-backed i18n path

### Requirement: Legacy SPA keys required by V2 SHALL be mirrored before call-site migration

When V2 needs text that previously existed only in the SPA locale bundle, the migration SHALL first mirror the needed key into `siyuan/i18n/*` before converting the V2 call site.

#### Scenario: V2 needs a legacy SPA text key

- **GIVEN** a V2 publish, settings, or bridge workflow still depends on a legacy SPA text key
- **WHEN** that workflow is migrated toward host-backed i18n
- **THEN** the required key must first be mirrored into `siyuan/i18n/*`
- **AND** the migration must not rely on an unmapped key disappearing from `src/locales/*`

### Requirement: Bridge i18n migration SHALL preserve V1 usability during coexistence

While V1 and V2 coexist, shared bridge components SHALL preserve V1 usability. Contributors SHALL use compatibility layers, mirrored keys, or wrappers instead of directly rewriting shared bridge i18n in ways that break V1.

#### Scenario: A bridge component is still used by both V1 and V2

- **GIVEN** a bridge component is shared between the legacy V1 path and the V2 path
- **WHEN** a contributor migrates its text handling
- **THEN** the migration must preserve V1 usability
- **AND** it must not leave the V1 path without valid i18n content
- **AND** it may defer full in-place rewrite until V1 is retired or the bridge is fully split

### Requirement: UI V2 migration SHALL preserve rollback and coexistence until stable release

The migration SHALL preserve rollback and coexistence with the legacy UI until the V2 workflow is stable enough for convergence decisions.

#### Scenario: A later-stage V2 milestone is unstable

- **GIVEN** a later milestone introduces instability in V2
- **WHEN** the issue affects a user-facing publish or settings workflow
- **THEN** the system must still preserve a rollback-capable legacy path
- **AND** the unstable milestone must not force removal of legacy UI prematurely

### Requirement: SPA code retirement SHALL follow explicit acceptance criteria

The system SHALL define and enforce explicit criteria for when legacy SPA code may be removed, must be removed, or must be retained as a compatibility layer. No SPA page SHALL be removed without passing the functional-equivalence checklist.

#### Scenario: Contributor proposes removing a legacy SPA page

- **GIVEN** a contributor proposes removing a legacy SPA page or route
- **WHEN** the proposal is reviewed
- **THEN** the V2 implementation must cover all user-visible functions of the SPA page
- **AND** all entrypoints (`topbar.ts`, `widgetInvoke.ts`, document menus) must have switched to `V2Host.show()`
- **AND** the data format and storage location must remain compatible with the SPA version
- **AND** the V2 path must have been stable for at least one milestone cycle
- **AND** closing `useV2UI` must still offer a viable fallback path

#### Scenario: A SPA page is still required as a compatibility layer

- **GIVEN** a legacy SPA page is under evaluation for removal
- **WHEN** any of the following is true: V2 has no equivalent feature, bridge coverage is incomplete, the page is required for `useV2UI=false` rollback, or another unmigrated SPA page depends on it
- **THEN** the SPA page must be retained
- **AND** it must not be modified in ways that break its existing V1 usage

#### Scenario: A SPA page meets mandatory-removal conditions

- **GIVEN** a legacy SPA page is under evaluation for removal
- **WHEN** any of the following is true: its dependencies are unmaintained and pose security risks, it blocks V2 evolution through technical debt, dual-system maintenance cost exceeds retention value, or the V2 path has been universally available and stable for a full release cycle
- **THEN** the SPA page must be scheduled for removal
- **AND** the removal must be tracked through the page-retirement-rate metric

### Requirement: UI V2 state layer SHALL use local composables instead of global Pinia stores

The V2 UI state layer SHALL use Vue Composables with `reactive` rather than global Pinia stores, because V2 UI state is local to the `V2Host` lifecycle and must not persist after the panel is closed.

#### Scenario: V2 panel is opened and closed

- **GIVEN** the V2 panel is opened
- **WHEN** it is later closed
- **THEN** the UI state from that session must not leak into the next session
- **AND** no global Pinia store must be used to hold V2-specific UI state
- **AND** business configuration may continue to use existing shared stores

### Requirement: V2 build chain SHALL reuse the existing Vite configuration

The V2 program SHALL not introduce a separate build chain (such as `vite.v2.config.ts`). V2 source files SHALL be compiled as ordinary Vue SFCs through the existing `vite.config.ts`.

#### Scenario: Contributor adds a new V2 component

- **GIVEN** a contributor adds a new V2 component under `src/components/v2/`
- **WHEN** the project is built or served
- **THEN** the component must be compiled by the existing `vite.config.ts`
- **AND** no additional build script or config file must be required for V2
