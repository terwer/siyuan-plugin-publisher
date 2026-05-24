## 1. Error Summary Utility

- [x] 1.1 Add a shared V2 quick publish error text utility that returns sanitized `{ summary, details }` for unknown errors and publish result errors.
- [x] 1.2 Support extracting `msg`, `message`, `error.message`, and string `error` from JSON wrapped by `Error:` or `main.opt.failure=>`.
- [x] 1.3 Add focused unit tests for CSDN-style `标题过短`, nested message fields, non-JSON fallback, and sensitive-field redaction.

## 2. Quick Publish State Integration

- [x] 2.1 Replace direct `sanitizeText(result.errMsg)` failure handling in publish/delete flows with the shared summary/detail utility.
- [x] 2.2 Replace caught exception normalization in publish/preview/delete flows with the shared summary/detail utility.
- [x] 2.3 Preserve success-with-warning behavior and diagnostic details for image upload warnings.

## 3. Toast and Page Feedback

- [x] 3.1 Change `buildV2QuickPublishToast` so failed terminal statuses return `null` and no global failure toast is emitted.
- [x] 3.2 Update V2 quick publish page failure descriptions to include the short summary, e.g. `CSDN 发布失败：标题过短`.
- [x] 3.3 Update the failure card to show the short summary beside the “查看详情” action while keeping details in `SypErrorDetailsPanel`.

## 4. Validation

- [x] 4.1 Update quick publish and toast tests to cover no failed toast and friendly summary/detail separation.
- [x] 4.2 Run focused tests for V2 quick publish error feedback.
- [x] 4.3 Run `pnpm lint`.
- [x] 4.4 Run `pnpm build:v2`.

## 5. Review Notes

- [x] 5.1 Update planning/progress notes with the共用层结论：不做 CSDN 专修、不自动扩标题、错误详情保留 traceId/stack。
- [x] 5.2 Audit the diff to confirm no platform adaptor or transport branch was changed for this UX fix.
