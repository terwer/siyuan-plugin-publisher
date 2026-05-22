# Tasks: upgrade-vite8-build-toolchain

> Principle: Vite 8 upgrade is infrastructure work. Keep it isolated from platform business logic, avoid mock validation, and record exact evidence for every gate.

## 1. Baseline and Planning

- [ ] 1.1 Record current environment: `node -v`, `pnpm -v`, `pnpm exec vite --version`, `pnpm exec vue-tsc --version`.
- [ ] 1.2 Record current dependency baseline for `vite`, `@vitejs/plugin-vue`, `vitest`, `@vitest/coverage-v8`, `vite-plugin-*`, `unplugin-*`, `typescript`, and `vue-tsc`.
- [ ] 1.3 Run baseline automated checks where feasible: `pnpm test`, `pnpm lint`, `pnpm build:v2`.
- [ ] 1.4 Capture Vite 7 V2 output shape: `dist-v2/index.js`, `dist-v2/index.css`, `dist-v2/plugin.json`, `dist-v2/i18n/*.json`, static assets, and whether `siyuan` remains external.
- [ ] 1.5 Confirm with the user whether V1/package/widget/nginx/ext builds are merge gates or release gates for this change.

## 2. Dependency Upgrade

- [ ] 2.1 Update `vite` to Vite 8 current stable patch version.
- [ ] 2.2 Update `@vitejs/plugin-vue` and other Vite ecosystem packages only if required by peer compatibility or verified Vite 8 issues.
- [ ] 2.3 Run `pnpm install` and commit/update `pnpm-lock.yaml` without unrelated dependency churn.
- [ ] 2.4 Record all peer dependency warnings, install warnings, or lockfile anomalies; resolve or explicitly classify them.

## 3. Config Migration and Build Fixes

- [ ] 3.1 Run `pnpm build:v2` and fix Vite 8 build errors with minimal, reviewable changes.
- [ ] 3.2 Verify `vite.v2.config.ts` preserves CJS library output, `external: ["siyuan"]`, `cssCodeSplit: false`, static asset copy, and `dist-v2/index.css` naming.
- [ ] 3.3 Audit `vite.config.ts` for Vite 8 warnings, especially `manualChunks(id)` function form and plugin compatibility.
- [ ] 3.4 If Vite 8 requires chunking config changes, implement them only after documenting the chosen strategy and expected output differences.
- [ ] 3.5 If CSS output differs due to Lightning CSS, inspect UI rendering impact before accepting the change.

## 4. Automated Validation

- [ ] 4.1 Run `pnpm test` and record pass/fail with decisive failures if any.
- [ ] 4.2 Run `pnpm lint` and record pass/fail with decisive failures if any.
- [ ] 4.3 Run `pnpm build:v2` and record artifact output.
- [ ] 4.4 Run a V2 watch smoke using `pnpm dev:v2`; confirm rebuild occurs after a safe source/config touch or document why it was not run.
- [ ] 4.5 Run focused transport tests for XML-RPC/form upload/json fetch if relevant specs exist or were touched.

## 5. V2 Host Runtime Validation

- [ ] 5.1 Run `pnpm makeLink:v2` and confirm SiYuan loads the V2 plugin from `dist-v2`.
- [ ] 5.2 Verify V2 shell/UI smoke: plugin open, V2 settings navigation, account list, platform config validation error display, and no blank screen/runtime console blocker.
- [ ] 5.3 Verify at least one XML-RPC platform flow such as #21 Cnblogs or #25 local WordPress: validate account, publish, update, delete.
- [ ] 5.4 Verify image publish/upload path on an available platform and record whether it uses Bundled, PicGO, or None configuration.
- [ ] 5.5 Verify one non-XML-RPC path where credentials are available, such as Yuque API/web or Local System, to catch generic fetch/asset/runtime regressions.
- [ ] 5.6 Record exact host evidence: OS, SiYuan version if available, plugin load result, platform(s), commands used, and observed failures.

## 6. Secondary Build Surface

- [ ] 6.1 Run or explicitly defer legacy/V1 `pnpm build` validation according to the user-confirmed gate policy.
- [ ] 6.2 Run or explicitly defer widget/nginx/ext packaging checks according to the user-confirmed gate policy.
- [ ] 6.3 If secondary builds fail for Vite 8-specific reasons, register focused follow-up tasks or fixes; do not hide the risk.

## 7. Review, Rollback, and Closure

- [ ] 7.1 Produce a concise upgrade report: changed dependencies, config changes, warnings resolved/deferred, validation matrix, known risks.
- [ ] 7.2 Verify rollback path by confirming all Vite 8 changes are isolated in dependency/config/source diffs and no unrelated platform verification edits are bundled.
- [ ] 7.3 Update OpenSpec spec/tasks evidence with final command results and manual validation notes.
- [ ] 7.4 Before archive, run strict audit: real fix vs mock, best practice, design integrity, unrelated modes, and OpenSpec completeness.
