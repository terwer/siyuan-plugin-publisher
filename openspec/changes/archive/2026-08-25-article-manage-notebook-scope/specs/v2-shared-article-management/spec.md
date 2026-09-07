## ADDED Requirements

### Requirement: V2 SHALL reuse the shared article management capability

The V2 native-DOM application SHALL provide an article management view that reuses the shared, router-agnostic article management component, instead of a separate reimplementation ("two skins").

#### Scenario: V2 opens article management

- **WHEN** the user opens article management from the V2 panel
- **THEN** the V2 management view SHALL render the shared article management component
- **AND** the component SHALL be the same source of truth used by the V1 article management page

#### Scenario: The shared component emits a navigation action

- **WHEN** the shared article management component emits a navigation action (quick / single / batch / view / picgo)
- **THEN** the V2 management view SHALL handle the action with a fully native V2 implementation
- **AND** the action SHALL NOT delegate to the V1 flow or instruct the user to use V1
- **AND** every management action SHALL be functional in V2

#### Scenario: Every management action is supported in V2

- **WHEN** the user uses any of the article management actions (quick publish, single publish, batch publish, view, picgo) in V2
- **THEN** the action SHALL run to completion within the V2 native environment
- **AND** there SHALL be no V1-dependent or "not supported, use V1" path for these actions

### Requirement: V2 SHALL expose article management via a home entry in the panel header

The V2 panel header SHALL provide a home (house) entry that opens the article management view, positioned to the left of the settings entry.

#### Scenario: The user clicks the home entry

- **WHEN** the user clicks the home entry in the V2 panel header
- **THEN** the V2 panel SHALL switch to the article management view
- **AND** the settings entry SHALL remain available to its right

#### Scenario: The user leaves article management

- **WHEN** the user navigates back or closes from the article management view
- **THEN** the V2 panel SHALL return to the quick publish view (or the previous non-management state)

### Requirement: The notebook scope setting SHALL be configurable from both V1 and V2

The notebook scope setting SHALL be editable from the V1 preference page and the V2 preference page, reading and writing the same shared preference storage.

#### Scenario: Notebook scope is edited in V1

- **WHEN** the user edits `publishSourceNotebooks` in the V1 preference page
- **THEN** the value SHALL be persisted to the shared preference storage

#### Scenario: Notebook scope is edited in V2

- **WHEN** the user edits `publishSourceNotebooks` in the V2 preference page
- **THEN** the value SHALL be persisted to the same shared preference storage
- **AND** the V1 article management page SHALL observe the same value

### Requirement: The shared article management component SHALL be router-agnostic

The shared article management component SHALL not depend on vue-router, so it can be embedded both in the V1 SPA and in the V2 native-DOM application.

#### Scenario: The component is embedded in V1

- **WHEN** the V1 article management page embeds the shared component
- **THEN** the component SHALL provide navigation via emitted events that the V1 page wires to router navigation and iframe drawers

#### Scenario: The component is embedded in V2

- **WHEN** the V2 management view embeds the shared component
- **THEN** the component SHALL provide navigation via emitted events that the V2 view wires to its native behavior
- **AND** the component SHALL NOT reference vue-router directly
