## Context

The project currently uses Vite 7 (`vite@^7.2.2`) with two build configurations:

- `vite.v2.config.ts`: V2 SiYuan plugin host build, using `vite build --watch --config vite.v2.config.ts` for `pnpm dev:v2` and `vue-tsc --noEmit && vite build --config vite.v2.config.ts` for `pnpm build:v2`.
- `vite.config.ts`: legacy/V1, widget, nginx, extension-related build paths through Python build scripts.

V2 is the priority path. The user explicitly requires V2 development and verification to use `pnpm dev:v2` and `pnpm makeLink:v2`; `pnpm dev -p siyuan` must not be used as the V2 verification path.

Vite 8 introduces Rolldown-by-default build behavior, Oxc transforms, Lightning CSS minification, stricter migration considerations, and a supported Node.js baseline of Node 20.19+ or 22.12+. The local Node version observed during assessment is `v22.22.0`, which satisfies that baseline.

The upgrade touches infrastructure with high blast radius. It must therefore be tracked separately from V2 platform verification, with no mock data, no placeholder validation, and no unrelated business changes.

## Goals / Non-Goals

**Goals:**

- Upgrade the project to Vite 8 with a reproducible dependency and lockfile change.
- Preserve V2 SiYuan plugin output contract: CJS entry, CSS output, static metadata/i18n/assets, external `siyuan` dependency.
- Preserve publish transport behavior in the Electron/plugin host, especially XML-RPC and multipart paths that depend on plugin/node fetch and loopback routing rules.
- Establish a layered validation gate that covers install, static/type checks, unit tests, V2 build, V2 watch build, SiYuan plugin loading, and high-value publish flows.
- Keep rollback simple by isolating dependency/config changes from unrelated feature work.

**Non-Goals:**

- Do not migrate platform adapter business logic unless a real Vite 8 regression requires a minimal compatibility fix.
- Do not replace V2 architecture, routing, storage, or UI flows.
- Do not retire V1 or iframe paths in this change.
- Do not use mock publish targets to claim platform verification. Manual publish validation must use real configured sandbox/local accounts or clearly marked smoke-only checks.
- Do not introduce ad-hoc transport if-chains in `useProxy`; any transport fix must keep the resolver/executor layering.

## Decisions

### 1. Upgrade in a dedicated OpenSpec change and branch-sized unit

Decision: Vite 8 work is tracked by `upgrade-vite8-build-toolchain` and must not be mixed into the active V2 platform verification change.

Rationale: Platform verification failures should remain attributable to platform/runtime behavior, not build tooling changes. A separate change also makes rollback and audit simpler.

Alternatives considered:

- Mix upgrade into current V2 verification: rejected because it creates a second moving variable.
- Delay until all V2 platforms are complete: rejected because infrastructure is now stable enough and earlier migration reduces long-term risk.

### 2. Prioritize V2 build and host runtime before V1 parity

Decision: The first acceptance gate is V2: `pnpm build:v2`, `pnpm dev:v2`, `pnpm makeLink:v2`, and SiYuan host smoke/manual publish validation. V1/package/widget/nginx/ext paths are secondary gates or follow-up if they expose significant unrelated debt.

Rationale: V2 is the current strategic host and the one affected most directly by build-watch performance.

Alternatives considered:

- Require every packaging target before any merge: rejected as too broad for first Vite 8 landing, but targeted V1/package checks remain useful before release if time allows.

### 3. Treat Vite 8 Rolldown differences as real runtime risk

Decision: Do not assume Rollup-compatible config behaves identically. Inspect generated artifacts and run host-level checks for CJS entry loading, externalization, CSS file naming, static copy output, and dynamic/chunk output.

Rationale: V2 uses `build.lib.formats: ["cjs"]`, Node polyfills, static copy in `closeBundle`, and external `siyuan`. These are exactly the kinds of boundaries where bundler changes can succeed at build time but fail at runtime.

Alternatives considered:

- Rely only on `pnpm build:v2`: rejected because a successful build does not prove SiYuan can load the plugin bundle.

### 4. Keep transport architecture intact

Decision: If Vite 8 exposes transport regressions, fixes must remain inside existing resolver/executor abstractions such as `resolveXmlrpcTransport` / `executeXmlrpcTransport` and `FormDataUtils`-style layering.

Rationale: Project conventions explicitly reject ad-hoc transport if-chains in `useProxy`; recent infrastructure work established cleaner layering.

Alternatives considered:

- Patch call sites directly: rejected because it would regress architecture and make future platform validation harder.

### 5. Use verification evidence, not assumptions

Decision: Every completion claim must name the command, environment, and observed result. Manual host checks must record platform, SiYuan host mode, V2 plugin load result, and publish target category.

Rationale: Vite upgrades can fail subtly in runtime-only paths. Evidence makes regressions reproducible and avoids false confidence.

Alternatives considered:

- Only update dependency and rely on existing tests: rejected because current tests do not cover all host runtime behaviors.

## Risks / Trade-offs

- [Risk] Rolldown changes output chunking or CJS interop in a way SiYuan cannot load → Mitigation: inspect `dist-v2/index.js`, run `pnpm makeLink:v2`, and verify plugin activation inside SiYuan before completion.
- [Risk] `manualChunks(id)` function in `vite.config.ts` is deprecated under Vite 8 and may need migration → Mitigation: document current use, decide whether to migrate immediately or track a follow-up before release; do not silently ignore warnings.
- [Risk] Lightning CSS changes CSS output or minification → Mitigation: validate `index.css`, V2 settings UI, dark/light theme, Element Plus component rendering, and key pages.
- [Risk] `vite-plugin-node-polyfills` behavior changes under Vite 8 → Mitigation: run transport unit tests and manual XML-RPC/multipart flows in the Electron/plugin host.
- [Risk] plugin ecosystem peer dependencies lag behind Vite 8 → Mitigation: upgrade only necessary plugins, record peer warnings, and avoid broad unrelated dependency churn.
- [Risk] V1/package targets regress while V2 passes → Mitigation: treat V1/package checks as release gate or follow-up decision; record exact failures rather than blocking V2 investigation prematurely.
- [Risk] Build speed improves but behavior regresses → Mitigation: correctness gates are mandatory; performance observations are secondary evidence, not acceptance criteria.

## Migration Plan

1. Baseline current Vite 7 behavior:
   - Record `node -v`, `pnpm -v`, `pnpm exec vite --version`.
   - Run and record `pnpm test`, `pnpm lint`, `pnpm build:v2` if feasible before dependency changes.
   - Optionally capture `dist-v2` artifact shape for comparison.
2. Upgrade dependency set:
   - Update `vite` to Vite 8 current stable patch.
   - Adjust `@vitejs/plugin-vue`, Vitest, and Vite plugins only when compatibility or peer requirements demand it.
   - Regenerate `pnpm-lock.yaml` with `pnpm install`.
3. Resolve build/config issues:
   - Address Vite 8 warnings and errors with minimal changes.
   - Keep V2 output contract unchanged unless the user explicitly approves a contract change.
4. Run automated validation:
   - `pnpm test`
   - `pnpm lint`
   - `pnpm build:v2`
   - V2 watch smoke using `pnpm dev:v2`
5. Run host validation:
   - `pnpm makeLink:v2`
   - Load plugin in SiYuan Electron host.
   - Verify V2 settings, account validation feedback, quick publish, update/delete, and image publish.
   - Include at least one XML-RPC target such as Cnblogs or local WordPress and one web/API or image-upload path where credentials are available.
6. Secondary/release validation:
   - Run V1/package/widget/nginx/ext checks as applicable before release, or explicitly log deferred risk.
7. Rollback if needed:
   - Revert Vite 8 dependency/config commits without reverting platform verification or unrelated source changes.
   - Record the blocker and minimal reproduction in `tasks.md` before pausing.

## Open Questions

- Should V1/package/widget/nginx/ext build checks be mandatory before merging the Vite 8 change, or mandatory only before release packaging?
- If Vite 8 emits only deprecation warnings for `manualChunks` function form, should this change migrate it immediately or create a follow-up change dedicated to chunking strategy?
- Which manual publish targets are available at implementation time for final evidence: #21 Cnblogs, #25 local WordPress, Yuque API/web, local system, or another configured sandbox account?
