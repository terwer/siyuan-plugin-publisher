## ADDED Requirements

### Requirement: Vite 8 dependency baseline
The project SHALL use Vite 8 as the primary Vite dependency and SHALL keep related Vite ecosystem packages at compatible versions required by the installed Vite 8 release.

#### Scenario: Dependency versions are aligned
- **WHEN** `pnpm install` completes after the upgrade
- **THEN** the lockfile resolves Vite to a Vite 8 release and no Vite peer dependency conflict remains unresolved

#### Scenario: Runtime baseline is documented
- **WHEN** a developer reviews the upgrade notes
- **THEN** the supported Node.js baseline for Vite 8 is documented and incompatible local Node versions are called out before build validation

### Requirement: V2 build output remains SiYuan plugin compatible
The V2 build SHALL produce a SiYuan-compatible plugin bundle with the same public output contract as the Vite 7 build.

#### Scenario: V2 production build succeeds
- **WHEN** `pnpm build:v2` is executed
- **THEN** `dist-v2/index.js`, `dist-v2/index.css`, `dist-v2/plugin.json`, i18n files, license/readme files, and icon assets are generated in their expected locations

#### Scenario: V2 watch build remains usable
- **WHEN** `pnpm dev:v2` is executed during development
- **THEN** the V2 build watch process emits valid `dist-v2` output without requiring the deprecated V1 command `pnpm dev -p siyuan`

#### Scenario: SiYuan external remains external
- **WHEN** `dist-v2/index.js` is inspected after build
- **THEN** the SiYuan host API remains externalized according to `external: ["siyuan"]` and is not accidentally bundled into the plugin output

### Requirement: Vite config migration is explicit
The project SHALL make Vite 8 migration choices explicit for Rollup/Rolldown, CJS/ESM interop, CSS minification, and output splitting behavior.

#### Scenario: Deprecated output splitting is addressed
- **WHEN** `vite.config.ts` or `vite.v2.config.ts` uses output chunking configuration
- **THEN** any Vite 8 deprecated `manualChunks` function usage is either migrated, intentionally retained with rationale, or tracked as a follow-up before release

#### Scenario: CSS output contract is verified
- **WHEN** V2 is built with Vite 8
- **THEN** the single CSS output contract for V2 remains `dist-v2/index.css` or an explicitly approved replacement is documented

#### Scenario: CJS library output is verified
- **WHEN** V2 is built with `build.lib.formats: ["cjs"]`
- **THEN** the generated entry can be loaded by the SiYuan Electron plugin host without import/export runtime errors

### Requirement: Validation gate for upgrade completion
The Vite 8 upgrade SHALL NOT be considered complete until automated and manual validation gates have passed or their exceptions are explicitly recorded.

#### Scenario: Automated validation gate passes
- **WHEN** the upgrade is prepared for review
- **THEN** `pnpm test`, `pnpm lint`, and `pnpm build:v2` have passed under the Vite 8 dependency set

#### Scenario: Manual V2 host validation passes
- **WHEN** the upgrade is prepared for review
- **THEN** `pnpm makeLink:v2` has been used to load the V2 plugin in SiYuan and smoke tests for plugin load, settings navigation, quick publish, update/delete, and image publish have been recorded

#### Scenario: Rollback path exists
- **WHEN** a blocking Vite 8 runtime regression is found
- **THEN** the change can be reverted by restoring Vite 7 dependency/configuration changes without reverting unrelated platform verification work
