# Platform Help / Tour Coverage Log

> Change: `complete-platform-help-tour-coverage`
> Source verification SSOT: `openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md`

## 2026-05-29 Baseline

### Verified platforms to backfill first

| # | platformKey | Verification status | Help status | Notes |
|---|-------------|---------------------|-------------|-------|
| 1 | `common_Yuque` | V2C/Pub/Upd/Del/Img ✅ | Dedicated config exists; needs richer tour/FAQ polish | API mode requires Yuque Professional membership; policy limitation is not plugin blocking. |
| 21 | `metaweblog_Cnblogs` | V2C/Pub/Upd/Del/Img ✅ | Complete sample config exists | Keep as reference shape for `summary / fields / faq / tour`. |
| 25 | `wordpress_Wordpress` | V2C/Pub/Upd/Del/Img ✅ | Dedicated config exists; needs tour and image/fetch notes | Local WordPress V2 full path verified with `plugin-node-fetch`. |
| 27 | `custom_Yuqueweb` | V2C/Pub/Upd/Del/Img ✅ | Dedicated config exists; needs richer Cookie/web notes and tour where anchors exist | Cookie auth, image publish, and error details verified. |
| 29 | `fs_LocalSystem` | V2C/Pub/Upd/Del/Img ✅ | Still in `remaining-t1.ts`; must split out | Electron V2 full path verified by user. |
| 30 | `custom_Zhihu` | V2C/Pub/Upd/Del/Img ✅ | Still in `remaining-t1.ts`; must split out | Platform image hosting verified; OSS SDK explicit loading fix captured. |
| 31 | `custom_Csdn` | V2C/Pub/Upd/Del/Img ✅ | Still in `remaining-t1.ts`; must split out | Platform image hosting verified; default Bundled image hosting fix captured. |

### In-progress platform

| # | platformKey | Verification status | Help action |
|---|-------------|---------------------|-------------|
| 28 | `custom_Haloweb` | V2C 🟡, Pub/Upd/Del/Img ⬜ | Do not mark help coverage complete yet. Capture V2C known `authUrl=/login` relative URL guidance, then complete full help after manual verification. |

### Current implementation constraints

- `V2PlatformConfigBridge.vue` already renders `HelpButton` with `page-id="platform-config/<platformKey>"`.
- `CommonBlogSetting.vue` currently has stable `data-syp-tour` anchors for `home`, `apiUrl`, `username`, `password`, and `validate`.
- `CommonBlogSetting.vue` does not currently mark token/cookie, knowledge-space, preview URL, page type, or image-hosting controls with stable `data-syp-tour` anchors.
- `FieldGuide.vue` exists but platform config form fields do not currently use it. Field text can be registered in `PageHelpConfig.fields`, but visible inline FieldGuide coverage requires a later form integration task.
- This pass should avoid HelpRegistry/HelpPanel/TourGuide architecture changes and focus on platform help configs plus minimal registration changes.

## Coverage standard for this change

A platform help config is considered complete for this change when it has:

- `summary` describing platform type, auth mode, and any verified policy constraint.
- `fields` for high-risk inputs, even if inline FieldGuide rendering is not wired yet.
- `faq` for verification-derived pitfalls.
- `tour` steps only for existing stable anchors, or after a minimal `data-syp-tour` anchor task is completed.

## Review notes

### 2026-05-29 user review

- Score: about 70/100; first batch is basically accepted but still has flaws.
- Known issue: platform config pageIds may include a dynamic instance id/hash, such as `platform-config/common_Yuque-z2jom6d`. Help matching must not create a separate help-only example/hash scheme; it should reuse `src/platforms/dynamicConfig.ts` and normalize dynamic instance keys back to preset platform keys such as `platform-config/common_Yuque`.
- Follow-up: specific platform guide wording/content still needs per-platform polish. The user will discuss those one by one later, so do not pre-emptively rewrite all guide text now.
- Linked change: `normalize-platform-guide-example-matching` now owns the runtime normalization and tests for dynamic platform-config instance keys.
