/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { InjectionKey } from "vue"

export interface V2PlatformConfigValidationResult {
  ok: boolean
  apiStatus?: boolean
  errorMessage?: string
  errorDetails?: string
}

export interface V2PlatformConfigActionBridge {
  onValidated?: (result: V2PlatformConfigValidationResult) => void
  onSaved?: (result: any) => void
}

export const V2_PLATFORM_CONFIG_ACTION_BRIDGE_KEY: InjectionKey<V2PlatformConfigActionBridge> = Symbol(
  "publisher-v2-platform-config-action-bridge"
)
