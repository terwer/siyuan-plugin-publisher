## Learned User Preferences

- Prefer Simplified Chinese in assistant replies; write Git commit messages in English.
- For V2 host work, use `pnpm dev:v2` and `pnpm makeLink:v2`; do not suggest `pnpm dev -p siyuan` for V2 verification or development.
- Do not commit unused or orphan files to clear git diff noise; delete the file and clean references instead.
- Require `.planning/` or OpenSpec planning before non-trivial code changes; do not make unplanned global edits.
- Before OpenSpec archive, run a strict audit (real fix vs mock, best practice, design integrity, unrelated modes); block archive if any criterion fails.

## Learned Workspace Facts

- V2 host development: `pnpm dev:v2` (watch) and `pnpm makeLink:v2` (symlink to SiYuan); build output in `dist-v2/`.
- V1 development: `pnpm dev -p siyuan` and `pnpm makeLink -p siyuan`; build output in `dist/`. That chain does not start the V2 Vite config.
- `PicbedServiceTypeEnum.None` means the user explicitly chose no picbed; never treat `None` as unset in `getPicbedServiceType` or other global picbed logic.
- Metaweblog-style platforms (e.g. Cnblogs) should default picbed to `Bundled` in the platform `*Config` constructor (like `YuquewebConfig`), not via global `usePicgoBridge` overrides.
- Agent skills: project `.cursor/skills/` or `.claude/skills/`; global `~/.cursor/skills/` or `~/.claude/skills/`; repo OpenSpec skills under `.claude/skills/`. Do not put custom skills in `~/.cursor/skills-cursor/`.
- V2 platform config validation failures must surface `errorMessage` via `SypErrorDetailsPanel` (and an inline summary), not only generic alerts or `ElMessage`.
