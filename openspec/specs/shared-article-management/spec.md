# shared-article-management Specification

## Purpose
为原生 DOM 应用提供文章管理视图：复用无 router 依赖的共享文章管理组件（界面各处共用同一源，不两张皮），经面板头部房子图标进入，全部管理动作（快发/单发/批发/查看/图床）以原生实现，不委托给其他流程。
## Requirements
### Requirement: The native-DOM app SHALL reuse the shared article management capability

The native-DOM application SHALL provide an article management view that reuses the shared, router-agnostic article management component, instead of a separate reimplementation ("two skins").

#### Scenario: The app opens article management

- **WHEN** the user opens article management from the panel
- **THEN** the management view SHALL render the shared article management component
- **AND** the component SHALL be the single source of truth for article management

#### Scenario: The shared component emits a navigation action

- **WHEN** the shared article management component emits a navigation action (quick / single / batch / view / picgo)
- **THEN** the management view SHALL handle the action with a fully native implementation
- **AND** the action SHALL NOT delegate to other flows or instruct the user to use them
- **AND** every management action SHALL be functional in the app

#### Scenario: Every management action is supported

- **WHEN** the user uses any of the article management actions (quick publish, single publish, batch publish, view, picgo)
- **THEN** the action SHALL run to completion within the app's native environment
- **AND** there SHALL be no unsupported or delegated path for these actions

### Requirement: The app SHALL expose article management via a home entry in the panel header

The panel header SHALL provide a home (house) entry that opens the article management view, positioned to the left of the settings entry.

#### Scenario: The user clicks the home entry

- **WHEN** the user clicks the home entry in the panel header
- **THEN** the panel SHALL switch to the article management view
- **AND** the settings entry SHALL remain available to its right

#### Scenario: The user leaves article management

- **WHEN** the user navigates back or closes from the article management view
- **THEN** the panel SHALL return to the quick publish view (or the previous non-management state)

### Requirement: The notebook scope setting SHALL be configurable from the preference page

The notebook scope setting SHALL be editable from the preference page, reading and writing the shared preference storage.

#### Scenario: Notebook scope is edited in the preference page

- **WHEN** the user edits `publishSourceNotebooks` in the preference page
- **THEN** the value SHALL be persisted to the shared preference storage

#### Scenario: Article management observes the persisted scope

- **WHEN** the user edits `publishSourceNotebooks` in the preference page
- **THEN** the value SHALL be persisted to the same shared preference storage
- **AND** article management SHALL observe the same value

### Requirement: The shared article management component SHALL be router-agnostic

The shared article management component SHALL not depend on vue-router, so it can be embedded in the native-DOM application.

#### Scenario: The component is embedded in the app

- **WHEN** the management view embeds the shared component
- **THEN** the component SHALL provide navigation via emitted events that the view wires to its native behavior
- **AND** the component SHALL NOT reference vue-router directly

