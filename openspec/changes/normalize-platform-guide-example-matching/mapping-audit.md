# Platform Guide Example Matching Audit

> Change: `normalize-platform-guide-example-matching`
> Status: implementation audit
> Date: 2026-05-29

## Scope

This audit records the current help/guide matching state before adding example-level matching. It intentionally does not modify the V2 platform verification SSOT.

## Current Matching Entry Points

| Entry | Current behavior | Example-level support | Notes |
|---|---|---:|---|
| `PageHelpConfig.pageId` | Exact page config key, e.g. `platform-config/common_Yuque` | No | Main registry identity today. |
| `PageHelpConfig.helpUrl` | Page-level fallback documentation URL | No | Multiple platform configs may share the same wiki URL. |
| `HelpRegistry.get(pageId)` | Exact page, directory `_default`, global default | No | Safe fallback chain already exists. |
| `HelpRegistry.getField(pageId, field)` | Field help by page and field key | No | Field-level, not example/doc-level. |
| `HelpRegistry.getTour(pageId)` | Tour by page | No | Uses DOM anchors only. |
| `HelpPanel` | Displays summary, full-doc link, FAQ and tour for page | No | No per-example UI yet. |
| `FieldGuide` | Displays field tooltip/link by page and field | No | No example key prop. |
| `BackPage.onHelp` | Opens `helpRegistry.getHelpUrl(helpKey)` | No | Legacy direct-help behavior. |

## Platform Help Config Inventory

| Config | pageId | helpUrl | Coverage | Multi-example risk |
|---|---|---|---|---|
| `common-yuque.ts` | `platform-config/common_Yuque` | `20230908183639-btcnnmj` | summary/fields/faq/tour | High: shares platform family with `custom_Yuqueweb`; API vs Cookie examples must not collapse into one doc match. |
| `custom-yuqueweb.ts` | `platform-config/custom_Yuqueweb` | `20230908183639-btcnnmj` | summary/fields/faq/tour | High: same doc URL as API mode today; needs independent examples for cookie auth, knowledge-space, image flow. |
| `wordpress-wordpress.ts` | `platform-config/wordpress_Wordpress` | `20230908183639-btcnnmj` | summary/fields/faq/tour | Medium: shares generic doc URL with several mature configs. |
| `metaweblog-cnblogs.ts` | `platform-config/metaweblog_Cnblogs` | `20230908183639-btcnnmj` | summary/fields/faq/tour | Medium: complete sample, useful baseline. |
| `custom-zhihu.ts` | `platform-config/custom_Zhihu` | `20240330142711-bc3gjg0` | summary/fields/faq/tour | Medium: cookie auth + platform image flow are separate examples. |
| `custom-csdn.ts` | `platform-config/custom_Csdn` | `20240330142711-bc3gjg0` | summary/fields/faq/tour | Medium: cookie auth + title/platform image validation can diverge. |
| `fs-local-system.ts` | `platform-config/fs_LocalSystem` | `20240330142711-bc3gjg0` | summary/fields/faq/tour | Low/medium: multiple file/path examples possible. |
| `remaining-t1.ts` | many T1 page IDs | mixed | helpUrl only | High fallback dependency; must keep page-level fallback unchanged. |

## User-Reported Defect Shape

When a platform has multiple examples/guide entries, matching must not depend on only one harvested full name plus hash. The flawed shape is:

```text
Platform P
  Example A -> full display name + hash -> document hit
  Example B -> sibling example -> no document hit
  Example C -> sibling example -> no document hit
```

The required shape is:

```text
Platform P
  Example A -> platformKey/exampleKey#shortHash -> document hit or explicit fallback
  Example B -> platformKey/exampleKey#shortHash -> document hit or explicit fallback
  Example C -> platformKey/exampleKey#shortHash -> document hit or explicit fallback
```

## Proposed Stable Key Inputs

| Component | Source | Stable? | User-visible? |
|---|---|---:|---:|
| `platformKey` | parsed from `pageId` after `platform-config/` | Yes | No |
| `exampleKey` | explicit config key, e.g. `api-token`, `cookie-auth` | Yes | No |
| `shortHash` | stable hash of `platformKey/exampleKey/docUrlOrAnchor` | Yes | No |
| `title` | explicit example title | No, copy can change | Yes |
| `helpUrl` | existing doc URL | Mostly | Yes via full-doc link |

## Sample Migration Candidates

| Candidate | Reason | Initial examples |
|---|---|---|
| `common_Yuque` | API vs web mode currently share a full-doc URL and are easy to confuse. | `api-token`, `knowledge-space`, `image-flow` |
| `custom_Yuqueweb` | Same platform family, different auth semantics. | `cookie-auth`, `knowledge-space`, `image-flow` |

## Fallback Rules to Preserve

- If no example key is requested, `helpRegistry.getHelpUrl(pageId)` remains unchanged.
- If a page has no `examples`, example lookup falls back to page-level `helpUrl`.
- If a page has examples but one example is missing, lookup returns explicit `missing: true` metadata plus page-level fallback URL instead of throwing.
- Display names must not be used as matching keys.

## Implementation Notes

- Add optional `examples` to `PageHelpConfig`; existing configs remain valid.
- Add a small helper module for key/hash generation and example URL resolution.
- Add registry methods rather than changing existing `get/getHelpUrl` behavior.
- Start with Yuque API and Yuque Web as two sample migrations.
