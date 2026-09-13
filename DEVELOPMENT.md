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

## Hermes Agent Project Profile

Goal: this repository should behave like Claude/Codex project isolation: enter the project directory, run `hermes`, and get this project's isolated Hermes state. No global sticky profile switching.

### Active profile

- Profile name: `siyuan-plugin-publisher`
- Profile home: `~/.hermes/profiles/siyuan-plugin-publisher`
- Project environment file: `.envrc`

The committed `.envrc` is:

```bash
export HERMES_PROFILE="siyuan-plugin-publisher"
export HERMES_HOME="$HOME/.hermes/profiles/$HERMES_PROFILE"
```

`HERMES_HOME` is the isolation switch: Hermes reads config, `.env`, skills, memory, sessions, and cron state from this directory. `HERMES_PROFILE` is a readable marker.

### One-time machine setup

Set up direnv once in the shell profile you already use. After this, every project with its own `.envrc` gets the same workflow.

macOS / zsh on this machine:

```bash
# ~/my_profile.sh, which is sourced by ~/.zshrc
if command -v direnv >/dev/null 2>&1; then
  eval "$(direnv hook zsh)"
fi
```

WSL2 or Git Bash on Windows:

```bash
# ~/.bashrc, ~/.zshrc, or your auto-sourced my_profile.sh
if command -v direnv >/dev/null 2>&1; then
  eval "$(direnv hook bash)"   # use zsh instead of bash if that is your shell
fi
```

PowerShell on Windows:

```powershell
# Add once to $PROFILE
Invoke-Expression "$(direnv hook pwsh)"
```

This is intentionally generic. Do not create per-project aliases like `hermes-syp`; those do not scale when switching projects.

### One-time repository setup

```bash
# Create this project's isolated profile if it does not already exist.
# --clone copies the current default config/.env/SOUL.md/skills as a starting point.
hermes profile create siyuan-plugin-publisher --clone

# Trust this repository's .envrc.
cd /Volumes/workspace/mydocs/siyuan-plugins/siyuan-plugin-publisher
direnv allow
```

Use a clean profile instead of cloning default if needed:

```bash
hermes profile create siyuan-plugin-publisher
```

### Daily usage

```bash
cd /Volumes/workspace/mydocs/siyuan-plugins/siyuan-plugin-publisher
hermes
```

Expected behavior: direnv loads `.envrc` automatically, so `hermes` uses `~/.hermes/profiles/siyuan-plugin-publisher` without extra flags.

### Verification

```bash
cd /Volumes/workspace/mydocs/siyuan-plugins/siyuan-plugin-publisher

echo "$HERMES_PROFILE"
echo "$HERMES_HOME"
hermes config path
```

Expected result on macOS/Linux/WSL/Git Bash:

```text
siyuan-plugin-publisher
/Users/terwer/.hermes/profiles/siyuan-plugin-publisher
/Users/terwer/.hermes/profiles/siyuan-plugin-publisher/config.yaml
```

On Windows PowerShell, `$HOME` is a Windows home path, so the exact path differs, but it must still end with:

```text
.hermes\profiles\siyuan-plugin-publisher\config.yaml
```

If the output still points to `~/.hermes/config.yaml`, the shell did not load direnv. Open a new terminal after editing the shell profile, then `cd` back into the repository.

### Usage notes

- Do **not** use `hermes profile use siyuan-plugin-publisher` for this project. It changes the global sticky default profile and leaks into other directories.
- Do **not** rely on running `direnv allow` inside an already-started Hermes session; restart Hermes from a shell where direnv has loaded the project environment.
- The Feishu/Lark gateway is a background service and does not automatically follow a terminal's current directory. This setup affects terminal-launched Hermes commands in this repo.
- Secrets belong in the profile `.env` file at `~/.hermes/profiles/siyuan-plugin-publisher/.env`, not in this repository.

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