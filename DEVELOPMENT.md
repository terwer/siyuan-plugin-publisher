[中文](DEVELOPMENT_zh_CN.md)

# Development Guide

## Prerequisites

```bash
brew install n
n 22
brew install corepack
corepack enable pnpm
corepack use pnpm@10.22.0

pnpm install
```

## V2 Development (Primary)

V2 outputs to `dist-v2/`, built via `vite.config.v2.ts`.

**Start development server**

```bash
# Terminal 1: Start SiYuan dev server
pnpm serve

# Terminal 2: V2 watch build
pnpm dev:v2

# Create symlink to SiYuan plugin dir (one-time setup, or after dist-v2 path change)
pnpm makeLink:v2
```

**Build**

```bash
pnpm build:v2
```

## Help System

### Architecture Overview

The help system is built around a pageId-driven registry (HelpRegistry). Any page can access help by providing a `pageId`, which yields:

- **HelpPanel** — a popover showing summary, documentation link, FAQ, and guided tour entry
- **TourGuide** — an overlay with element highlighting and step-by-step instruction cards
- **FieldGuide** — inline help hints next to form fields

### Core Files

```
src/
├── types/IPageHelpConfig.ts        # Type definitions
├── helpConfigs/
│   ├── registry.ts                 # HelpRegistry singleton (3-level fallback)
│   └── pages/
│       ├── _default.ts             # Global fallback config
│       ├── quick-publish.ts        # Quick publish page
│       └── platform-config/
│           ├── _default.ts          # Platform config generic default
│           └── metaweblog-cnblogs.ts # Cnblogs config (includes tour example)
└── components/common/help/
    ├── HelpButton.vue              # Help button (? icon), triggers HelpPanel
    ├── HelpPanel.vue               # Help panel popover
    ├── TourGuide.vue               # Step-by-step guided tour overlay
    └── FieldGuide.vue              # Field-level inline hints
```

### Registry Lookup Chain (3-level fallback)

1. **Exact match** — `pageId` matches precisely
2. **Directory-level `_default`** — e.g. `platform-config/_default` applies to `platform-config/xxx`
3. **Global `_default`** — catch-all fallback config

### Adding Help for a New Page / Platform

Just two steps:

**Step 1 — Write a config file**

Create `src/helpConfigs/pages/<namespace>/<pageId>.ts`:

```ts
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const myPageConfig: PageHelpConfig = {
  pageId: "platform-config/my_platform",
  helpUrl: "https://example.com/docs",
  summary: "One-line description of the platform.",
  fields: {
    apiUrl: { tip: "Instruction for the API URL field" },
    username: { tip: "Instruction for the username field" },
  },
  faq: [
    { q: "Common question 1?", a: "Answer 1." },
    { q: "Common question 2?", a: "Answer 2." },
  ],
  tour: [
    {
      target: "[data-syp-tour='field1']",
      title: "Step 1 title",
      content: "Step 1 description.",
      placement: "bottom",
    },
    // ... more steps
  ],
}
```

**Step 2 — Register in the Registry**

In `src/helpConfigs/init.ts`, import and register:

```ts
import { helpRegistry } from "./registry"
import { myPageConfig } from "./pages/platform-config/my_platform"

helpRegistry.register(myPageConfig)
```

### Adding Tour Steps

Tour steps anchor to target elements via `data-syp-tour` attributes. Add them to form components:

```html
<el-form-item data-syp-tour="apiUrl">...</el-form-item>
```

Then reference `"[data-syp-tour='apiUrl']"` in the tour config.

**Note:** Tour queries are scoped to the `.syp-v2` container (no global DOM pollution). All help UI must render within the plugin host container.

### Internationalization

Help system text uses the `v2.help.*` i18n key namespace. See `src/locales/en_US.ts` and `src/locales/zh_CN.ts`.

## V1 Development (Deprecated, maintenance reference only)

V1 outputs to `dist/`, built via legacy `scripts/build.py` / `scripts/dev.py`.

```bash
pnpm dev -p siyuan
pnpm makeLink -p siyuan
pnpm build
```

## Package

```bash
pnpm package
```

Artifacts structure

```
├── build
  ├── package.zip
  ├── package-widget.zip
  ├── siyuan-plugin-publisher-1.23.5.zip
  ├── siyuan-publisher-nginx-1.23.5
  ├── sy-post-publisher-chrome-1.23.5.zip
  ├── sy-post-publisher-firefox-1.23.5.zip
  └── sy-post-publisher-widget-1.23.5.zip
```

## Sync to legacy widget repo

```bash
pnpm syncWidgetRepo
```