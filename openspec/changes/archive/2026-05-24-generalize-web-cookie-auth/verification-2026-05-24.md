# Verification — generalize-web-cookie-auth

## Automated validation

- `pnpm exec vitest run src/components/v2/settings/V2PlatformConfigBridge.spec.ts src/components/v2/settings/V2WebCookieAuthPanel.spec.ts src/composables/useWebCookieAuthorization.spec.ts src/components/set/publish/singleplatform/web/webCookieBridgeSlot.spec.ts src/platforms/yuquewebRegistration.spec.ts src/composables/v2/useV2Settings.spec.ts` → 6 files / 54 tests passed.
- `pnpm lint` → passed (`vue-tsc --noEmit`).
- `pnpm build:v2` → passed.
- `openspec validate v2-web-cookie-authorization --strict` → passed.
- `openspec validate web-cookie-bridge-common --strict` → passed.
- `openspec validate web-cookie-logout --strict` → passed.

## Implementation review

- `V2WebCookieAuthPanel` displays only by capability contract: `dynCfg.authMode === AuthMode.WEBSITE` and `cfg.passwordType === PasswordType_Cookie`.
- CSDN and Zhihu use the shared `useWebCookieAuthorization` path for `buildCookie()` → `getMetaData()` → `updateCfg()` and state persistence.
- CSDN and Zhihu logout use `logoutWebCookieAuthorization`; no CSDN/Zhihu-specific logout UI was added in Setting components or V2 UI.
- Web Setting components forward only the shared `cookie-actions` slot into `CustomWebSetting` / `CommonBlogSetting`.
- No `useProxy` transport branch or publish transport facade was changed by this change.
- Existing config shape is preserved; Cookie and metadata continue to be written into the current platform config and `DYNAMIC_CONFIG_KEY`.

## Host/manual validation evidence

- Existing V2 platform SSOT records user host validation for:
  - `custom_Yuqueweb` (#27): V2 Cookie authorization and full publish/update/delete/image flow passed.
  - `custom_Zhihu` (#30): V2 Bridge full flow passed on 2026-05-24 (user test).
  - `custom_Csdn` (#31): V2 Bridge full flow passed on 2026-05-24 (user test).

## Explicitly not marked complete

- Task 5.4 remains unchecked because the archived change does not contain a dedicated, replayable record for all requested UI smoke details across CSDN, Zhihu, and Yuqueweb, including non-Electron or unavailable-auto-capture fallback.
- Task 5.5 remains unchecked because real-account metadata response details were not explicitly recorded for CSDN/Zhihu/Yuqueweb; automated mocks are not treated as real remote validation.
