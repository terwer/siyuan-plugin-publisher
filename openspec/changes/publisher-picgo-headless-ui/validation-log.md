# Validation Log: publisher-picgo-headless-ui

## PicGo headless dependency source

- Change dependency: PicGo repository change `picgo-headless-publisher-contract`.
- Verified npm releases on 2026-05-26:
  - `zhi-siyuan-picgo@2.0.1`
  - `universal-picgo@2.0.1`
  - `universal-picgo-store@2.0.1`
- Publisher dependency updated to `zhi-siyuan-picgo@^2.0.1` in `package.json` and `pnpm-lock.yaml`.
- Public contract evidence from installed `node_modules/zhi-siyuan-picgo/dist/index.d.ts`:
  - `createSiyuanPicGoHeadlessManager`
  - `ISiyuanPicGoHeadlessManager`
  - `listUploaders()`
  - `getUploaderSchema()`
  - `getUploaderConfig()`
  - `validateUploaderConfig()`
  - `saveUploaderConfig()`
  - `getCurrentUploader()` / `setCurrentUploader()`
  - `upload()`
  - `uploadMarkdownImages()`

## Contract gate

Publisher now creates PicGo through `src/composables/usePublisherPicgoManager.ts` and fails fast if the installed lib misses required config/schema/validation/upload APIs.

## Publisher validation

- `pnpm test src/components/v2/settings/V2PicBedSettings.spec.ts`
  - Result: passed, 5 tests.
  - Covers Publisher-owned V2 PicGo headless UI rendering, uploader config save via lib, platform preference save separation, field-level validation errors, and a regression where a platform config load error such as `Cannot read properties of undefined (reading 'lastIndexOf')` must not collapse the whole PicBed settings page.
- `pnpm test src/components/v2/settings/V2PicBedSettings.spec.ts src/components/set/publish/singleplatform/base/CommonBlogSetting.spec.ts src/composables/usePublish.spec.ts src/adaptors/web/webPicbedDefaults.spec.ts src/adaptors/api/cnblogs/cnblogsConfig.spec.ts`
  - Result: passed, 5 files / 15 tests.
  - Covers the new V2 PicBed UI plus related publish warning/default picbed regressions.
- `pnpm build:v2`
  - Result: passed.
  - Includes `vue-tsc --noEmit` and `vite build --config vite.v2.config.ts` against `zhi-siyuan-picgo@^2.0.1`.

## Manual test feedback: PicBed settings load failure

- 2026-05-26 manual V2 host feedback: opening V2 PicBed settings showed `图床配置加载失败` with `Cannot read properties of undefined (reading 'lastIndexOf')`.
- Fix: `V2PicBedSettings` no longer lets one platform preference/adaptor config failure collapse the whole page. It now loads PicGo headless configuration independently, isolates per-platform failures with `Promise.allSettled`, shows a structured partial-load warning/details panel, and keeps the page usable for PicGo core configuration.
- Regression command after the fix:
  - `pnpm test src/components/v2/settings/V2PicBedSettings.spec.ts` — passed, 6 tests.
  - `pnpm test src/components/v2/settings/V2PicBedSettings.spec.ts src/components/set/publish/singleplatform/base/CommonBlogSetting.spec.ts src/composables/usePublish.spec.ts src/adaptors/web/webPicbedDefaults.spec.ts src/adaptors/api/cnblogs/cnblogsConfig.spec.ts` — passed, 5 files / 16 tests.
  - `pnpm build:v2` — passed.

## Manual test feedback: platform preference row alignment and settings switch blocking

- 2026-05-26 manual V2 host feedback: expanded platform PicBed preference rows wrapped the save button into two lines, and switching the left settings navigation felt blocked until PicBed loading finished.
- Fix: platform preference rows now use a fixed two-column grid with a fixed-width save button (`保存` stays on one line). `V2PicBedSettings` also renders the settings shell immediately and loads PicGo runtime in the background, so changing sections is no longer gated by the PicGo runtime load.
- Regression command after the fix:
  - `pnpm test src/components/v2/settings/V2PicBedSettings.spec.ts` — passed, 6 tests.
  - `pnpm test src/components/v2/settings/V2PicBedSettings.spec.ts src/components/set/publish/singleplatform/base/CommonBlogSetting.spec.ts src/composables/usePublish.spec.ts src/adaptors/web/webPicbedDefaults.spec.ts src/adaptors/api/cnblogs/cnblogsConfig.spec.ts` — passed, 5 files / 16 tests.
  - `pnpm build:v2` — passed.

## Manual test feedback: error details overlay and delayed settings switch feedback

- 2026-05-26 manual V2 host feedback: clicking `查看详情` on platform preference load failures showed only the overlay mask without visible diagnostic content; left settings-tab switching could still feel stuck with no feedback.
- Fix: `SypErrorDetailsPanel` now uses a fixed viewport overlay with a higher z-index so its card is not clipped by the settings scroll container. V2 settings section switching now shows a small loading indicator if a section switch takes longer than 2 seconds.
- Regression command after the fix:
  - `pnpm test src/components/v2/common/SypErrorDetailsPanel.spec.ts src/components/v2/settings/V2PicBedSettings.spec.ts` — passed, 2 files / 8 tests.
  - `pnpm test src/components/v2/settings/V2PicBedSettings.spec.ts src/components/set/publish/singleplatform/base/CommonBlogSetting.spec.ts src/composables/usePublish.spec.ts src/adaptors/web/webPicbedDefaults.spec.ts src/adaptors/api/cnblogs/cnblogsConfig.spec.ts src/components/v2/common/SypErrorDetailsPanel.spec.ts` — passed, 6 files / 18 tests.
  - `pnpm build:v2` — passed.

## Manual test feedback: user-facing PicBed copy

- 2026-05-26 manual V2 host feedback: PicBed settings copy exposed implementation terms such as package names, headless, contract, and uploader; the page did not read like user-facing product copy.
- Fix: V2 PicBed settings copy now uses user-facing terms: `默认图床`, `按平台单独设置`, `PicGo`, `图床设置`. User-facing i18n no longer mentions `zhi-siyuan-picgo`, `headless`, `contract`, or standalone PicGo plugin installation details on this page.
- Also changed settings-section loading feedback threshold from 2 seconds to 50ms per manual feedback.
- Regression command after the fix:
  - `pnpm test src/components/v2/settings/V2PicBedSettings.spec.ts src/components/v2/common/SypErrorDetailsPanel.spec.ts` — passed, 2 files / 8 tests.
  - `pnpm build:v2` — passed.

## Manual test feedback: PicBed settings visual/layout regression

- 2026-05-26 manual V2 host feedback: the V2 PicBed settings page had a missing left-nav selected style, visually regressed from the previous light Ant Design-like style, and eagerly rendered every platform PicBed preference row.
- Fix: restored an explicit selected state for the V2 settings nav, lightened the PicBed cards/uploader list/current-uploader area, and changed platform PicBed preferences to collapsed-by-default, on-demand loading. The default page now focuses on PicGo Core configuration; platform preferences load only after clicking `查看平台偏好`.
- Regression command after the fix:
  - `pnpm test src/components/v2/settings/V2PicBedSettings.spec.ts` — passed, 5 tests.
  - `pnpm test src/components/v2/settings/V2PicBedSettings.spec.ts src/components/set/publish/singleplatform/base/CommonBlogSetting.spec.ts src/composables/usePublish.spec.ts src/adaptors/web/webPicbedDefaults.spec.ts src/adaptors/api/cnblogs/cnblogsConfig.spec.ts` — passed, 5 files / 15 tests.
  - `pnpm build:v2` — passed.
