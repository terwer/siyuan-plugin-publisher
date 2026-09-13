## ADDED Requirements

### Requirement: V2 SHALL use a five-view state machine without vue-router

The V2 native-DOM application SHALL navigate the publish loop through a `currentView` state machine with exactly five views: `quick_publish`, `single_publish`, `batch_publish`, `manage`, and `settings`. V2 SHALL NOT introduce vue-router.

#### Scenario: V2 navigation is inspected

- **WHEN** reviewers inspect the V2 navigation model
- **THEN** V2 SHALL route via the `currentView` state machine
- **AND** V2 SHALL NOT depend on vue-router

#### Scenario: User navigates between publish views

- **WHEN** the user moves between `quick_publish`, `single_publish`, `batch_publish`, `manage`, and `settings`
- **THEN** the transition SHALL be driven by the state machine with a centralized push/pop and return-source record

### Requirement: V2 SHALL provide a native detailed single-publish view

The V2 SHALL provide a `single_publish` view that hosts the shared single-publish component, allowing the user to configure detailed fields (title, body, tags, category, slug) and preview before publishing.

#### Scenario: User enters detailed single publish from article management

- **GIVEN** the user is in the article management view
- **WHEN** they trigger the single-publish action on a row
- **THEN** V2 SHALL switch to the `single_publish` view for the selected document
- **AND** the view SHALL show the detailed editing form rather than the one-click quick publish

#### Scenario: User publishes with detailed settings

- **GIVEN** the user is in the `single_publish` view
- **WHEN** they initiate publish or update
- **THEN** V2 SHALL execute the shared `usePublish.doSinglePublish` flow
- **AND** the action SHALL NOT delegate to V1 or use vue-router

### Requirement: V2 SHALL provide a native batch-publish view

The V2 SHALL provide a `batch_publish` view that hosts the shared batch-publish component, supporting platform selection and per-platform progress/results.

#### Scenario: User enters batch publish from article management

- **GIVEN** the user is in the article management view
- **WHEN** they trigger the batch-publish action on a row
- **THEN** V2 SHALL switch to the `batch_publish` view for the selected document
- **AND** the view SHALL show platform selection and per-platform progress/results

#### Scenario: User runs batch publish

- **GIVEN** the user is in the `batch_publish` view
- **WHEN** they select platforms and start batch publish
- **THEN** V2 SHALL execute the shared `batchPublish` flow
- **AND** V2 SHALL display success/failure results per platform

### Requirement: V2 quick-publish card SHALL provide a detailed-publish entry

The V2 quick-publish platform cards SHALL offer a detailed-publish entry as a secondary action, while keeping one-click publish/update as the primary action.

#### Scenario: User opens detailed publish from a quick-publish card

- **WHEN** the user clicks the detailed-publish entry on a quick-publish platform card
- **THEN** V2 SHALL switch to the `single_publish` view for the current document
- **AND** the one-click publish/update SHALL remain the card's primary action

### Requirement: V2 article-management actions SHALL route to the correct view

The article-management actions (flash, single, batch) SHALL route to the corresponding V2 view, not reuse the one-click quick-publish view for single publish.

#### Scenario: Flash publish action

- **WHEN** the user triggers the flash-publish action on a manage row
- **THEN** V2 SHALL open the fast platform grid (per-card publish/update) as the secondary panel
- **AND** the article list SHALL remain visible behind the panel

#### Scenario: Single publish action

- **WHEN** the user triggers the single-publish action on a manage row
- **THEN** V2 SHALL open the detailed editing form as the secondary panel
- **AND** the article list SHALL remain visible behind the panel

#### Scenario: Batch publish action

- **WHEN** the user triggers the batch-publish action on a manage row
- **THEN** V2 SHALL open the batch selection and per-platform progress panel
- **AND** the article list SHALL remain visible behind the panel

### Requirement: V2 article-management secondary panels SHALL preserve the list behind them

The V2 article-management panel SHALL open detailed/flash/batch views as a secondary slide-in panel while keeping the article list visible and dimmed behind the mask, without hiding it.

#### Scenario: User opens a secondary panel

- **WHEN** the user opens any of the single/flash/batch secondary panels
- **THEN** the article list SHALL remain visible behind the mask
- **AND** the panel SHALL be closable via back arrow, mask click, or Escape

#### Scenario: User closes the secondary panel

- **WHEN** the user closes the secondary panel
- **THEN** the mask SHALL be removed and the article list SHALL remain interactive

### Requirement: V2 platform chips SHALL expose hover and click actions

The V2 article-management platform chips SHALL expose a hover preview of "publish/update" and a click action that triggers platform-single publish for the chip's platform.

#### Scenario: User hovers a platform chip

- **WHEN** the user hovers a platform chip in the expanded row
- **THEN** the chip SHALL show a hint indicating whether the action is "publish" or "update"

#### Scenario: User clicks a platform chip

- **WHEN** the user clicks a platform chip
- **THEN** V2 SHALL trigger platform-single publish for that platform
- **AND** the action SHALL use the configuration's real `platformKey` for the publish call

### Requirement: V2 publish actions SHALL reuse the common usePublish layer

The V2 single-publish and batch-publish views SHALL reuse `usePublish` (`doSinglePublish` / `batchPublish`) rather than reimplementing publish logic.

#### Scenario: V2 view performs a publish

- **WHEN** a V2 publish view initiates a publish action
- **THEN** the view SHALL call into the common `usePublish` layer
- **AND** it SHALL NOT reimplement transport, platform configuration, or publish orchestration

### Requirement: V2 publish views SHALL return to their source on close

The V2 single-publish and batch-publish views SHALL return to the view from which they were opened on back or close.

#### Scenario: User returns from single publish

- **GIVEN** the user entered `single_publish` from article management
- **WHEN** they navigate back or close
- **THEN** V2 SHALL return to the article management view

#### Scenario: User returns from batch publish

- **GIVEN** the user entered `batch_publish` from article management
- **WHEN** they navigate back or close
- **THEN** V2 SHALL return to the article management view

#### Scenario: User returns from detailed publish opened from a quick-publish card

- **GIVEN** the user entered `single_publish` from a quick-publish card
- **WHEN** they navigate back or close
- **THEN** V2 SHALL return to the `quick_publish` view
