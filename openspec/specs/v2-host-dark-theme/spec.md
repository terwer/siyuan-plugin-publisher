# v2-host-dark-theme Specification

## Purpose

定义 V2 宿主面板如何跟随思源 `data-theme-mode` 暗黑模式，使 Element Plus 与 `.syp-v2` 自定义层在明暗主题下均可读且与笔记区一体。

## Requirements

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

The V2 Vue app bootstrap (`createV2VueApp`) MUST import `element-plus/dist/index.css`, `element-plus/theme-chalk/dark/css-vars.css`, and V2 base styles (`src/assets/v2/base.styl` including `syp-floating.styl`).

When the host is in dark mode and Siyuan does not provide `html.dark`, the V2 host MAY temporarily add class `dark` to `document.documentElement` while the panel is open, and MUST remove that class on `close()` if the plugin added it. The plugin MUST NOT map `--el-*` to `--b3-*`.

The menu mount root (`publisher-v2-menu-content`) MUST have class `dark` toggled on iff the host is in dark mode, so Element Plus components inside the panel subtree receive dark CSS variables.

#### Scenario: Settings bridge form in dark mode

- **WHEN** the user opens V2 platform settings (Element Plus inputs, buttons, selects) under host dark mode
- **THEN** those controls MUST NOT appear as bright white controls on a dark Siyuan workspace; backgrounds and borders MUST be consistent with Element Plus dark variables

### Requirement: Floating layers readable in host dark mode

Tooltips, toasts (`ElMessage`), and similar teleported UI MUST remain readable under host dark mode via global rules in `syp-floating.styl` keyed on `html.dark`, `html[data-theme-mode="dark"]`, and/or `.publisher-v2-menu-content.dark`.

The implementation MUST NOT attach floating layers to the menu mount root via `appendTo` if that causes mount/unmount DOM races; `appendTo` is optional only when body-level rendering fails verification.

#### Scenario: Header tooltip in dark mode

- **WHEN** the user hovers a V2 header action with a tooltip under host dark mode
- **THEN** the tooltip MUST use dark-oriented background and text (not a light popper on dark chrome)

#### Scenario: Publish toast in dark mode

- **WHEN** quick publish completes and shows a toast under host dark mode
- **THEN** the toast MUST be readable against the Siyuan workspace

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

Inner panels (e.g. warning detail buttons) MUST use `--b3-theme-surface` / `--b3-theme-surface-light`, not near-white fills.

#### Scenario: Failed publish in dark mode

- **WHEN** a publish ends in `failed` status under host dark mode
- **THEN** the status strip MUST show error styling that is visibly error-like and readable, without a glaring white card on dark UI

#### Scenario: Success publish in light mode unchanged

- **WHEN** host is in light mode and publish succeeds
- **THEN** the success status strip MUST match pre-change light appearance (regression guard)

### Requirement: V2Host is a single plugin-scoped instance

The plugin MUST expose exactly one `V2Host` on `PublisherPlugin` (or equivalent singleton). Topbar, settings entry, and other callers MUST share that instance so only one V2 menu lifecycle runs at a time.

`V2Host.show()` MUST serialize concurrent open requests and `close()` MUST unmount the Vue app, await DOM flush, then remove mount nodes before closing the SiYuan `Menu`.

#### Scenario: Rapid topbar clicks in light mode

- **WHEN** the user clicks the publish topbar button multiple times in quick succession while `useV2UI` is enabled
- **THEN** the plugin MUST NOT throw DOM patch errors (e.g. null `nextSibling`) or fall back to the legacy menu

#### Scenario: Panel closed

- **WHEN** the user closes the V2 panel
- **THEN** any temporary `html.dark` added by the plugin MUST be removed if the plugin added it
- **AND** the menu mount node MUST be removed from the document
