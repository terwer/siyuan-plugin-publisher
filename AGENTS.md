## Learned User Preferences

- Prefer Simplified Chinese in assistant replies; write Git commit messages in English.
- For V2 host work, use `pnpm dev:v2` and `pnpm makeLink:v2`; do not suggest `pnpm dev -p siyuan` for V2 verification or development.

## Learned Workspace Facts

- V2 host development: `pnpm dev:v2` (watch) and `pnpm makeLink:v2` (symlink to SiYuan); build output in `dist-v2/`.
- V1 development: `pnpm dev -p siyuan` and `pnpm makeLink -p siyuan`; build output in `dist/`. That chain does not start the V2 Vite config.
