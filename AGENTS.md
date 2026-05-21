## Learned User Preferences

- Prefer Simplified Chinese in assistant replies; write Git commit messages in English.
- For V2 host work, use `pnpm dev:v2` and `pnpm makeLink:v2`; do not suggest `pnpm dev -p siyuan` for V2 verification or development.
- Do not commit unused or orphan files to clear git diff noise; delete the file and clean references instead.
- Require `.planning/` or OpenSpec planning before non-trivial code changes; do not make unplanned global edits.
- Before OpenSpec archive, run a strict audit (real fix vs mock, best practice, design integrity, unrelated modes); block archive if any criterion fails.
- Blog/platform config validation must go through `BlogAdaptor` / `api.checkAuth()` — never bypass with direct adaptor calls.
- Reject ad-hoc transport if-chains in `useProxy`; extend MetaWeblog/XML-RPC via `resolveXmlrpcTransport` + `executeXmlrpcTransport` (same layering idea as `FormDataUtils`).
- V2 platform verification: prioritize high-frequency platforms first; still record pass/fail in the OpenSpec checklist SSOT.

## Learned Workspace Facts

- V2 host development: `pnpm dev:v2` (watch) and `pnpm makeLink:v2` (symlink to SiYuan); build output in `dist-v2/`.
- V1 development: `pnpm dev -p siyuan` and `pnpm makeLink -p siyuan`; build output in `dist/`. That chain does not start the V2 Vite config.
- `PicbedServiceTypeEnum.None` means the user explicitly chose no picbed; never treat `None` as unset in `getPicbedServiceType` or other global picbed logic.
- Metaweblog-style platforms (e.g. Cnblogs) should default picbed to `Bundled` in the platform `*Config` constructor (like `YuquewebConfig`), not via global `usePicgoBridge` overrides.
- Agent skills: project `.cursor/skills/` or `.claude/skills/`; global `~/.cursor/skills/` or `~/.claude/skills/`; repo OpenSpec skills under `.claude/skills/`. Do not put custom skills in `~/.cursor/skills-cursor/`.
- V2 platform config validation failures must surface `errorMessage` via `SypErrorDetailsPanel` (and an inline summary), not only generic alerts or `ElMessage`.
- MetaWeblog XML-RPC in plugin/Electron host: when `PluginFetchUtil.canUsePluginFetch`, use bundled `plugin-node-fetch` via `PluginFetchUtil.postText`; do not route through SiYuan `forwardProxy` (local/loopback targets never use forwardProxy).
- V2 platform verification SSOT: `openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`.
- Require `zhi-blog-api@^1.79.0` (or newer) so `BlogAdaptor.checkAuth()` returns instead of throwing adaptor results.
