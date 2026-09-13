## MODIFIED Requirements

### Requirement: SPA code retirement SHALL follow explicit acceptance criteria

The system SHALL define and enforce explicit criteria for when legacy SPA code may be removed, must be removed, or must be retained as a compatibility layer. No SPA page SHALL be removed without passing the functional-equivalence checklist **and** completing OpenSpec change `v2-platform-verification-v1-retirement` Gate A (all T1 platforms ✅ in `platform-checklist.md`). Gate D (iframe removal) SHALL NOT occur until Gate C (V1 deprecated) plus **three release versions**.

#### Scenario: Contributor proposes removing iframe hosting before T1 complete

- **GIVEN** `platform-checklist.md` shows any T1 platform without full ✅
- **WHEN** a contributor proposes Gate D or deletes iframe routes
- **THEN** the change is rejected until Gate A is satisfied

#### Scenario: Contributor proposes iframe removal after gates

- **GIVEN** Gate A is complete and Gate C has shipped
- **AND** three release versions have passed since Gate C
- **WHEN** maintainers execute Gate D
- **THEN** iframe/SPA paths MAY be removed per `ui-v2-migration` equivalence rules
