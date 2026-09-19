/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { ComputedRef, InjectionKey } from "vue"

/**
 * 配置页的帮助上下文 pageId（`platform-config/<platformKey>`）。
 *
 * 由 `V2PlatformConfigBridge.vue` 唯一处下发，页面帮助入口与字段级指引共用同一个值，
 * 避免在多个组件里各自拼 key 形成第二套标准。
 */
export const SYP_HELP_PAGE_ID_KEY: InjectionKey<ComputedRef<string>> = Symbol("syp-help-page-id")
