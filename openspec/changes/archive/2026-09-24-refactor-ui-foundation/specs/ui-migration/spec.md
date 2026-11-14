## ADDED Requirements

### Requirement: The new UI SHALL prefer SiYuan native UI and styling primitives

The new UI program SHALL prefer SiYuan native UI capabilities and the host-provided styling system before introducing custom visual components or custom styling layers.

#### Scenario: A contributor implements a 新界面 element

- **GIVEN** a contributor is implementing a 新界面 element
- **WHEN** a SiYuan native UI pattern or host styling primitive is available
- **THEN** the contributor should prefer the SiYuan native capability
- **AND** they should avoid creating a new generic component layer unless the host capability is insufficient

### Requirement: 新界面 migration SHALL be managed as a full lifecycle program

The system SHALL define 新界面 as a full lifecycle migration program rather than an isolated foundation task. The plan SHALL cover the complete sequence from entry foundation to stable release convergence.

#### Scenario: Maintainer reviews the 新界面 proposal

- **GIVEN** a maintainer reviews the active new UI change proposal
- **WHEN** they inspect the design and tasks
- **THEN** they must find milestone definitions that cover the full new UI lifecycle
- **AND** the plan must not stop at entry foundation alone

### Requirement: 新界面 SHALL migrate away from iframe-based SPA hosting

The new UI program SHALL treat iframe-based SPA hosting as a legacy compatibility path. New capabilities SHALL be implemented through real DOM mounting inside the plugin runtime.

#### Scenario: Contributor proposes a new feature implementation

- **GIVEN** a contributor is implementing a new capability
- **WHEN** they choose its rendering model
- **THEN** the capability must use real DOM mounting inside the plugin runtime
- **AND** it must not introduce a new iframe-based page for the new UI

### Requirement: 新界面 implementation SHALL proceed sequentially by milestone

The system SHALL define 新界面 work as milestone-gated delivery. Only one milestone may be active at a time, and implementation of the next milestone SHALL NOT begin until the previous milestone has passed acceptance.

#### Scenario: Attempt to start Milestone 1 before Milestone 0 is accepted

- **GIVEN** Milestone 0 acceptance criteria are not fully met
- **WHEN** a contributor proposes implementation work for Milestone 1
- **THEN** that work must be blocked
- **AND** the contributor must return to Milestone 0 remediation

#### Scenario: Attempt to start a later milestone before the current milestone is accepted

- **GIVEN** the active milestone has not passed acceptance
- **WHEN** a contributor starts implementation work from any later milestone
- **THEN** that work must be blocked

### Requirement: Milestone 0 SHALL establish a working new UI entry foundation

Milestone 0 SHALL be limited to the new UI entry foundation, including the new UI toggle, the new UI host bootstrap, a single preference configuration source, and a safe rollback path to the legacy UI.

#### Scenario: New UI toggle is disabled

- **GIVEN** 「旧界面开关」is `false`
- **WHEN** the user clicks the primary publish entry
- **THEN** the legacy UI path must be used

#### Scenario: New UI toggle is enabled

- **GIVEN** 「旧界面开关」is `true`
- **WHEN** the user clicks the primary publish entry
- **THEN** the new UI host must be launched
- **AND** the legacy menu must not be shown as the primary path

#### Scenario: new UI host initialization fails

- **GIVEN** 「旧界面开关」is `true`
- **AND** the new UI host throws an initialization error
- **WHEN** the user invokes the primary publish entry
- **THEN** the system must fall back to the legacy UI path
- **AND** the failure must be logged

#### Scenario: Milestone 0 foundation is reviewed for runtime direction

- **GIVEN** Milestone 0 foundation work is under review
- **WHEN** reviewers inspect the runtime path
- **THEN** the new UI primary path must be based on real DOM mounting
- **AND** the foundation must not depend on introducing a new iframe runtime

### Requirement: 新界面 and legacy entrypoints SHALL share one preference source of truth

All runtime decisions that affect 新界面 toggling and publish-entry behavior SHALL read from a single preference configuration gateway. Entrypoints SHALL NOT directly read ad hoc browser storage when making those decisions.

#### Scenario: Settings save the new UI toggle

- **GIVEN** the user enables or disables 「旧界面开关」 in settings
- **WHEN** a publish entrypoint reads the toggle value
- **THEN** it must read the persisted value from the shared preference gateway
- **AND** it must not rely on a separate direct browser-storage path

### Requirement: 新界面 SHALL use one unified workspace shell

The system SHALL use one unified workspace shell for the new UI. Quick publish and full settings workflows SHALL be different display states of the same shell, rather than separate product frames.

#### Scenario: User opens 新界面 from the primary publish action

- **GIVEN** the user invokes the primary publish entry
- **WHEN** the new UI opens in its main task path
- **THEN** the system must render the unified workspace shell in its main view state
- **AND** navigation and detail areas may be hidden or collapsed
- **AND** the user should not be forced into a separate settings frame first

#### Scenario: User enters complete settings mode

- **GIVEN** the user navigates into full settings
- **WHEN** the system renders the settings workflow
- **THEN** it must keep using the same unified workspace shell
- **AND** that shell must expand its settings navigation area and content workspace
- **AND** the workflow must not jump to a disconnected shell model

### Requirement: 新界面 main view SHALL prioritize quick publish

The main view of the new UI SHALL prioritize the quick publish workflow for the current document.

#### Scenario: Main view is rendered

- **GIVEN** the user opens 新界面 in its default state
- **WHEN** the main view is rendered
- **THEN** quick publish content must be primary
- **AND** detailed settings regions should be hidden, collapsed, or deemphasized
- **AND** configured publish targets should be visible to the user

### Requirement: 新界面 settings workflows SHALL expand progressively inside the same shell

The unified workspace shell SHALL support progressive disclosure. Settings workflows SHALL expand additional navigation and detailed form regions in the same shell.

#### Scenario: User expands settings from the main view

- **GIVEN** the user is in the new UI main view
- **WHEN** the user enters settings
- **THEN** additional navigation and detail regions may be expanded
- **AND** they must remain within the same workspace shell

### Requirement: 新界面 SHALL support account management workflows

The new UI settings workflow SHALL support account management as part of the unified workspace.

#### Scenario: User manages accounts

- **GIVEN** the user enters account settings
- **WHEN** the account workflow is rendered
- **THEN** the system must support an account list view
- **AND** the system must support platform selection for new accounts
- **AND** the system must support entering platform configuration details

### Requirement: 新界面 SHALL support grouped PicBed settings

The unified workspace settings content SHALL support grouped headings and aligned form rows for PicBed settings.

#### Scenario: User opens PicBed settings

- **GIVEN** the user selects the PicBed category
- **WHEN** the content workspace renders
- **THEN** the workspace must show the category title
- **AND** the workspace must allow grouped configuration sections
- **AND** form fields must remain aligned and scannable

### Requirement: 新界面 SHALL support preference settings within the unified workspace

The new UI settings workflow SHALL support preference settings within the unified workspace without requiring the user to leave the shell.

#### Scenario: User opens preference settings

- **GIVEN** the user selects the preference category
- **WHEN** the preference workflow is rendered
- **THEN** the preference content must be shown within the unified workspace shell
- **AND** the workflow must remain part of the same settings navigation model

### Requirement: 新界面 SHALL bridge batch distribution functionality

The new UI workflow SHALL bridge the existing batch distribution implementation (`BatchPublishIndex.vue`) to provide multi-platform publishing capability. Native rewrite SHALL be evaluated in M6 based on user feedback, performance, and maintenance cost.

#### Scenario: User accesses batch distribution from the new UI

- **GIVEN** the user has enabled 新界面
- **WHEN** the user accesses batch distribution entry
- **THEN** the system must bridge to the existing `BatchPublishIndex.vue` component
- **AND** the bridged functionality must preserve all existing batch distribution features
- **AND** the bridged implementation must not affect 旧界面 batch distribution behavior

#### Scenario: User performs batch publish via bridge

- **GIVEN** the user has accessed batch distribution through the new UI bridge
- **WHEN** the user selects multiple platforms and initiates batch publish
- **THEN** the system must execute batch publish using the existing logic
- **AND** the system must support both merge and override distribution modes
- **AND** the system must display success/failure results for each platform

#### Scenario: Evaluation of native rewrite in M6

- **GIVEN** batch distribution has been bridged in M5
- **WHEN** M6 convergence phase is reached
- **THEN** the team must evaluate whether native rewrite is necessary
- **AND** the evaluation must consider user feedback, performance metrics, and maintenance cost
- **AND** if native rewrite is not justified, the bridge SHALL remain as the stable implementation

### Requirement: 新界面 SHALL bridge article management dashboard functionality

The new UI workflow SHALL bridge the existing article management dashboard implementation (`Admin.vue`) to provide article listing, search, and filtering capability. Native rewrite SHALL be evaluated in M9 based on user feedback, performance, and maintenance cost.

#### Scenario: User accesses article management dashboard from the new UI

- **GIVEN** the user has enabled 新界面
- **WHEN** the user accesses article management dashboard entry
- **THEN** the system must bridge to the existing `Admin.vue` component
- **AND** the bridged functionality must preserve all existing article management features
- **AND** the bridged implementation must not affect 旧界面 article management behavior

#### Scenario: User manages articles via bridge

- **GIVEN** the user has accessed article management dashboard through the new UI bridge
- **WHEN** the user views article list, searches, or filters by platform
- **THEN** the system must execute article management using the existing logic
- **AND** the system must support pagination and search functionality
- **AND** the system must display article metadata correctly

#### Scenario: Evaluation of native rewrite in M9

- **GIVEN** article management dashboard has been bridged in M7
- **WHEN** M9 convergence phase is reached
- **THEN** the team must evaluate whether native rewrite is necessary
- **AND** the evaluation must consider user feedback, performance metrics, and maintenance cost
- **AND** if native rewrite is not justified, the bridge SHALL remain as the stable implementation

### Requirement: 新界面 SHALL integrate detailed publish mode into quick publish

The new UI quick-publish workflow SHALL integrate detailed publish mode, allowing users to configure advanced fields (alias, description, tags, categories, publish status, publish time) before publishing. The implementation SHALL prioritize bridging existing detailed mode components, and only implement natively if bridging is not feasible.

#### Scenario: User accesses detailed settings from quick publish

- **GIVEN** the user is on new UI quick publish page
- **WHEN** the user clicks the "detailed settings" entry
- **THEN** the system must display a detailed settings panel
- **AND** the panel must support editing alias, description, tags, categories, publish status, and publish time
- **AND** the panel must be dismissible without publishing

#### Scenario: User publishes with detailed settings

- **GIVEN** the user has configured detailed settings
- **WHEN** the user initiates publish
- **THEN** the system must publish with the configured advanced fields
- **AND** the system must preserve the detailed settings for future edits
- **AND** the system must not affect quick publish default behavior when detailed settings are not used

#### Scenario: Bridging evaluation for detailed mode components

- **GIVEN** the team is implementing M8 detailed publish mode integration
- **WHEN** evaluating whether to bridge existing components (PublishDescription, PublishTags, PublishCategories, etc.)
- **THEN** the team must first attempt bridging
- **AND** if bridging fails due to component dependencies, style conflicts, or state management issues, the team must document the reasons
- **AND** if bridging is not feasible, the team must implement a native detailed settings panel
- **AND** the technical decision (bridge or native) must be documented

### Requirement: 新界面 SHALL preserve compatibility while bridging legacy configuration forms

The new UI migration SHALL preserve configuration compatibility and may bridge legacy platform configuration forms until new abstractions are ready.

#### Scenario: A platform configuration is not yet fully rewritten for the new UI

- **GIVEN** the user enters platform configuration in the new UI
- **WHEN** the new native form is not yet available
- **THEN** the system may bridge to compatible legacy configuration logic
- **AND** the existing configuration format must remain unchanged

#### Scenario: A bridge is needed during migration

- **GIVEN** a capability has not yet been fully rewritten for the new UI
- **WHEN** a temporary bridge is introduced
- **THEN** the bridge should prefer shared logic and shared configuration parsing
- **AND** it should avoid introducing new long-term iframe dependencies

### Requirement: 新界面 SHALL use one host-backed i18n source

The native UI SHALL use `siyuan/i18n/*` as its single i18n source of truth. Native components SHALL NOT introduce a second independent locale bundle for the same UI surface.

#### Scenario: Contributor adds new native UI copy

- **GIVEN** a contributor adds or updates copy in a native publish or settings view
- **WHEN** they register the text
- **THEN** the key must be added to the host-backed `siyuan/i18n/*`
- **AND** the new UI component must read it through the new UI host-backed i18n path

### Requirement: Legacy SPA keys required by the new UI SHALL be mirrored before call-site migration

When the new UI needs text that previously existed only in the SPA locale bundle, the migration SHALL first mirror the needed key into `siyuan/i18n/*` before converting the new UI call site.

#### Scenario: New UI needs a legacy SPA text key

- **GIVEN** a 新界面 publish, settings, or bridge workflow still depends on a legacy SPA text key
- **WHEN** that workflow is migrated toward host-backed i18n
- **THEN** the required key must first be mirrored into `siyuan/i18n/*`
- **AND** the migration must not rely on an unmapped key disappearing from `src/locales/*`

### Requirement: Bridge i18n migration SHALL preserve legacy UI usability during coexistence

While the legacy UI and the new UI coexist, shared bridge components SHALL preserve legacy UI usability. Contributors SHALL use compatibility layers, mirrored keys, or wrappers instead of directly rewriting shared bridge i18n in ways that break the legacy UI.

#### Scenario: A bridge component is still used by both the legacy and the new UI

- **GIVEN** a bridge component is shared between the legacy UI and the new UI
- **WHEN** a contributor migrates its text handling
- **THEN** the migration must preserve legacy UI usability
- **AND** it must not leave the 旧界面 path without valid i18n content
- **AND** it may defer full in-place rewrite until 旧界面 is retired or the bridge is fully split

### Requirement: 新界面 migration SHALL preserve rollback and coexistence until stable release

The migration SHALL preserve rollback and coexistence with the legacy UI until the new UI workflow is stable enough for convergence decisions.

#### Scenario: A later-stage 新界面 milestone is unstable

- **GIVEN** a later milestone introduces instability in the new UI
- **WHEN** the issue affects a user-facing publish or settings workflow
- **THEN** the system must still preserve a rollback-capable legacy path
- **AND** the unstable milestone must not force removal of legacy UI prematurely

### Requirement: SPA code retirement SHALL follow explicit acceptance criteria

The system SHALL define and enforce explicit criteria for when legacy SPA code may be removed, must be removed, or must be retained as a compatibility layer. No SPA page SHALL be removed without passing the functional-equivalence checklist.

#### Scenario: Contributor proposes removing a legacy SPA page

- **GIVEN** a contributor proposes removing a legacy SPA page or route
- **WHEN** the proposal is reviewed
- **THEN** the 新界面 implementation must cover all user-visible functions of the SPA page
- **AND** all entrypoints (`topbar.ts`, `widgetInvoke.ts`, document menus) must have switched to `PluginHost.show()`
- **AND** the data format and storage location must remain compatible with the SPA version
- **AND** the 新界面 path must have been stable for at least one milestone cycle
- **AND** closing 「旧界面开关」 must still offer a viable fallback path

#### Scenario: A SPA page is still required as a compatibility layer

- **GIVEN** a legacy SPA page is under evaluation for removal
- **WHEN** any of the following is true: 新界面 has no equivalent feature, bridge coverage is incomplete, the page is required for 旧界面开关关闭时 rollback, or another unmigrated SPA page depends on it
- **THEN** the SPA page must be retained
- **AND** it must not be modified in ways that break its existing 旧界面 usage

#### Scenario: A SPA page meets mandatory-removal conditions

- **GIVEN** a legacy SPA page is under evaluation for removal
- **WHEN** any of the following is true: its dependencies are unmaintained and pose security risks, it blocks 新界面 evolution through technical debt, dual-system maintenance cost exceeds retention value, or the 新界面 path has been universally available and stable for a full release cycle
- **THEN** the SPA page must be scheduled for removal
- **AND** the removal must be tracked through the page-retirement-rate metric

### Requirement: 新界面 state layer SHALL use local composables instead of global Pinia stores

The 新界面 state layer SHALL use Vue Composables with `reactive` rather than global Pinia stores, because 新界面 state is local to the `PluginHost` lifecycle and must not persist after the panel is closed.

#### Scenario: 新界面 panel is opened and closed

- **GIVEN** the 新界面 panel is opened
- **WHEN** it is later closed
- **THEN** the UI state from that session must not leak into the next session
- **AND** no global Pinia store must be used to hold 新界面-specific UI state
- **AND** business configuration may continue to use existing shared stores

### Requirement: 新界面 build chain SHALL reuse the existing Vite configuration

The new UI program SHALL not introduce a separate build chain (such as `vite.config.ts`). New UI source files SHALL be compiled as ordinary Vue SFCs through the existing `vite.config.ts`.

#### Scenario: Contributor adds a new component

- **GIVEN** a contributor adds a new component under `src/ui/components/`
- **WHEN** the project is built or served
- **THEN** the component must be compiled by the existing `vite.config.ts`
- **AND** no additional build script or config file must be required for the new UI

### Requirement: 新界面 SHALL only target the SiYuan plugin runtime

The new UI architecture SHALL only target the SiYuan plugin runtime (PC Electron and Docker browser access). Chrome Extension, Nginx, Vercel, and Widget deployments SHALL continue using the SPA path. New UI components SHALL NOT be expected to function outside the SiYuan plugin runtime.

#### Scenario: 新界面 is used in the SiYuan plugin runtime

- **GIVEN** the plugin is running inside SiYuan (PC Electron or Docker browser access)
- **WHEN** the user enables 「旧界面开关」 and invokes a publish or settings entry
- **THEN** the new UI host must render the unified workspace shell
- **AND** `PluginHost.show()` must work correctly in both PC Electron and Docker browser environments

#### Scenario: A non-plugin build target is compiled

- **GIVEN** the project is built for Chrome Extension, Nginx, Vercel, or Widget
- **WHEN** the build output is deployed
- **THEN** the new UI host and new UI components must not be included in the critical rendering path
- **AND** the SPA routing system (`src/pages/*` + Vue Router) must remain functional

#### Scenario: SPA code retirement is proposed for a page used by non-plugin builds

- **GIVEN** a contributor proposes retiring a SPA page from the plugin runtime path
- **WHEN** the SPA page is still referenced by Chrome Extension, Nginx, or Vercel builds
- **THEN** the retirement must only remove the plugin runtime's dependency on that SPA page
- **AND** the SPA page code must be retained in the codebase for non-plugin builds

### Requirement: New UI components SHALL NOT directly call Node.js APIs

New UI components SHALL NOT directly invoke Node.js APIs (such as `fs`, `path`, `child_process`) or Electron APIs (such as `BrowserWindow`, `@electron/remote`). Environment-specific capabilities SHALL be guarded by `EnvUtil.isSiyuanElectron()` with graceful degradation for non-Electron environments.

#### Scenario: A new UI component uses an Electron-only feature

- **GIVEN** a new component needs to expose a feature that requires Node.js or Electron APIs
- **WHEN** the component is rendered in a Docker browser environment
- **THEN** the feature must be guarded by `EnvUtil.isSiyuanElectron()`
- **AND** the component must gracefully degrade (hide the feature, provide an alternative, or show a descriptive message)
- **AND** the component must not throw an uncaught exception

#### Scenario: A new Electron-only platform subtype is added

- **GIVEN** a contributor adds a new platform subtype that requires Electron APIs
- **WHEN** the platform is registered in the 新界面 selectable platforms list
- **THEN** the contributor must add an `EnvUtil.isSiyuanElectron()` guard in `useSettings.selectablePlatforms`
- **AND** the platform must be filtered out in Docker browser environments
- **AND** the bridge registry must return `null` for the subtype in non-Electron environments
