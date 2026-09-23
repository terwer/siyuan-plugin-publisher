/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { InjectionKey } from "vue"

export interface PlatformConfigValidationResult {
  ok: boolean
  apiStatus?: boolean
  errorMessage?: string
  errorDetails?: string
}

export interface PlatformConfigActionBridge {
  onValidated?: (result: PlatformConfigValidationResult) => void
  onSaved?: (result: any) => void
}

export const PLATFORM_CONFIG_ACTION_BRIDGE_KEY: InjectionKey<PlatformConfigActionBridge> = Symbol(
  "publisher-platform-config-action-bridge"
)
