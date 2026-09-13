## ADDED Requirements

### Requirement: V2 follows Siyuan host dark mode signal

The V2 hosted panel MUST NOT maintain its own theme mode. It MUST derive dark mode solely from the Siyuan host document: `document.documentElement.getAttribute("data-theme-mode") === "dark"`.

The V2 host MUST NOT invoke VueUse `useDark`, MUST NOT render a theme toggle control, and MUST NOT depend on V1 iframe `html.dark` state inside the iframe document.

#### Scenario: Host switches to dark while panel is closed

- **WHEN** the user enables Siyuan dark appearance before opening the V2 panel
- **THEN** the next opened V2 panel MUST render with dark-oriented surfaces and text contrast matching the host

#### Scenario: Host remains in light mode

- **WHEN** `data-theme-mode` is not `dark`
- **THEN** the V2 panel MUST retain the current light appearance (existing `$syp-*` fallbacks) without requiring user action inside the plugin

### Requirement: Element Plus in V2 uses official dark CSS variables

The V2 Vue app bootstrap (`createV2VueApp`) MUST import `element-plus/dist/index.css` and `element-plus/theme-chalk/dark/css-vars.css` (same set as the V1 SPA entry).

When the V2 panel is shown, the menu mount root (`publisher-v2-menu-content`) MUST have class `dark` toggled on iff the host is in dark mode, so Element Plus components inside the panel subtree receive dark CSS variables.

#### Scenario: Settings bridge form in dark mode

- **WHEN** the user opens V2 platform settings (Element Plus inputs, buttons, selects) under host dark mode
- **THEN** those controls MUST NOT appear as bright white controls on a dark Siyuan workspace; backgrounds and borders MUST be consistent with Element Plus dark variables

### Requirement: Custom syp-v2 chrome uses Siyuan b3 theme variables

Within `.syp-v2`, structural colors (page text, card/panel background, borders, secondary surfaces, native `.syp-input` / `.syp-card` / platform list shells) MUST use Siyuan CSS variables with stylus fallback to existing tokens, including at minimum:

- `var(--b3-theme-surface, …)`
- `var(--b3-theme-on-surface, …)` or `var(--b3-theme-on-background, …)`
- `var(--b3-border-color, …)`
- `var(--b3-theme-surface-light, …)` where secondary panels apply

Brand accent colors (`$syp-primary`, primary buttons) MAY remain plugin-defined.

#### Scenario: Card and input readability in dark workspace

- **WHEN** host dark mode is active
- **THEN** `.syp-v2` cards and inputs MUST use host-driven surface colors such that body text remains readable against the Siyuan editor chrome without a large white rectangle effect

### Requirement: Publish status alerts stay semantically distinct in dark mode

The quick-publish status strip (`.syp-publish-status` and modifiers `is-idle`, `is-publishing`, `is-success`, `is-success_with_warnings`, `is-failed`) MUST keep distinct success / warning / error / info meaning in dark mode.

Publish status styling MUST use Siyuan semantic variables (`--b3-theme-primary`, `--b3-theme-success`, `--b3-theme-warning`, `--b3-theme-error`, `--b3-theme-surface`, etc.) with `color-mix` where needed, not a parallel Ant Design hex palette.

The plugin MUST NOT add `html[data-theme-mode="dark"]` override blocks solely to patch hardcoded light colors; host `--b3-*` variables MUST drive both light and dark appearance.

Inner panels (e.g. warning detail buttons) MUST use `--b3-theme-surface` / `--b3-theme-surface-light`, not near-white fills.

#### Scenario: Failed publish in dark mode

- **WHEN** a publish ends in `failed` status under host dark mode
- **THEN** the status strip MUST show error styling that is visibly error-like and readable, without a glaring white card on dark UI

#### Scenario: Success publish in light mode unchanged

- **WHEN** host is in light mode and publish succeeds
- **THEN** the success status strip MUST match pre-change light appearance (regression guard)

### Requirement: V2Host must not mutate Siyuan host documentElement

The V2 host MUST NOT add, remove, or toggle classes or attributes on `document.documentElement` for theming. Only the menu `mountPoint` may receive the `dark` class for Element Plus.

#### Scenario: Panel closed

- **WHEN** the user closes the V2 panel
- **THEN** `document.documentElement` MUST remain unchanged by this plugin

### Requirement: Optional ElMessage anchoring only after failed dark verification

`ElMessage` / `ElMessageBox` `appendTo` pointing at the V2 mount root MUST be introduced only when manual verification shows body-level poppers remain light in host dark mode. This requirement does not mandate `appendTo` in the initial implementation pass.

#### Scenario: Toast visible in dark after publish

- **WHEN** quick publish completes and shows a toast under host dark mode
- **THEN** the toast MUST be readable; if body-level rendering fails verification, `appendTo` MUST be applied for V2 toast entry points
