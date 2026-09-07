## ADDED Requirements

### Requirement: Publish source SHALL be scoped to a configurable notebook set

The system SHALL allow the user to restrict the publish source to a configured set of notebooks, so that article management (and publish eligibility) is limited to notes from those notebooks.

The configured set SHALL be a global single collection stored as notebook ids (`publishSourceNotebooks`). An empty or unset collection SHALL mean "no restriction", preserving the legacy behavior of allowing all notebooks.

#### Scenario: Notebook scope is unset

- **WHEN** `publishSourceNotebooks` is empty or unset
- **THEN** the article management list SHALL include notes from all notebooks
- **AND** publishing SHALL NOT be restricted by notebook

#### Scenario: Notebook scope is configured

- **WHEN** `publishSourceNotebooks` contains one or more notebook ids
- **THEN** the article management list SHALL only include notes belonging to those notebooks
- **AND** publishing SHALL be restricted to notes belonging to those notebooks

#### Scenario: User selects notebooks

- **WHEN** the user selects notebooks in the article management page
- **THEN** the selection SHALL be persisted to the shared preference storage
- **AND** the article list SHALL refresh to reflect the selected notebooks

### Requirement: Article management list SHALL filter by notebook at the data layer

The root-document list used by article management SHALL accept a notebook id filter and apply it in the query so that the list is already scoped before pagination, rather than fetching all notebooks' documents and filtering client-side.

#### Scenario: Root documents are fetched with a notebook filter

- **WHEN** the article management queries root documents with a non-empty notebook set
- **THEN** the query SHALL restrict the result to root documents whose `blocks.box` is in the notebook set
- **AND** keyword search, published filter, ordering, pagination, and result shaping SHALL remain unchanged

#### Scenario: Root documents are fetched without a notebook filter

- **WHEN** the article management queries root documents with an empty or unset notebook set
- **THEN** the query SHALL include root documents from all notebooks
- **AND** no additional WHERE condition SHALL be added

#### Scenario: Widget-mode subdocuments are fetched with a notebook filter

- **WHEN** the article management renders in widget mode and queries subdocuments with a non-empty notebook set
- **THEN** the subdocument query SHALL restrict the result to subdocuments whose `blocks.box` is in the notebook set
- **AND** the filtering SHALL be consistently applied for the widget mode just as for the root-document mode

#### Scenario: Widget-mode subdocuments are fetched without a notebook filter

- **WHEN** the article management renders in widget mode and queries subdocuments with an empty or unset notebook set
- **THEN** the subdocument query SHALL include subdocuments from all notebooks
- **AND** no additional WHERE condition SHALL be added

#### Scenario: Notebook ids are supplied to the query

- **WHEN** one or more notebook ids are supplied to the root-document query
- **THEN** each supplied id SHALL be sanitized against an allowed charset before interpolation
- **AND** invalid ids SHALL NOT be interpolated

### Requirement: Publish SHALL be rejected for documents outside the allowed notebook set

When a notebook scope is configured, publishing a source document whose notebook is not in the allowed set SHALL be rejected with a clear, user-facing error, across all publish entry points.

#### Scenario: A document from a non-allowed notebook is published

- **WHEN** the user attempts to publish a source document whose `box` is not in the configured `publishSourceNotebooks`
- **THEN** the publish SHALL be rejected
- **AND** the user SHALL be shown a clear error explaining that the document is outside the allowed source notebooks

#### Scenario: A document's notebook cannot be determined

- **WHEN** the source document lookup does not yield a notebook id (`box`)
- **THEN** the publish SHALL NOT be rejected on notebook grounds
- **AND** the condition SHALL be logged for diagnosis

#### Scenario: No scope is configured

- **WHEN** `publishSourceNotebooks` is empty or unset
- **THEN** publishing SHALL NOT be rejected on notebook grounds for any document

### Requirement: Notebook choices SHALL be derived from the kernel notebook list

The set of selectable notebooks SHALL be derived from the kernel's notebook listing, excluding system/user-guide notebooks that the project already treats as non-publishable.

#### Scenario: Notebook options are loaded

- **WHEN** the notebook selection UI loads its options
- **THEN** the options SHALL be built from `lsNotebooks()`
- **AND** notebooks that are closed or are system/user-guide notebooks SHALL be excluded
