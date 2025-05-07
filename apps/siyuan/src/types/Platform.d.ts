/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

interface AbstractPlatformAction {
  type: "button" | "toggle"
  icon?: any
  label: string
  handler?: (event: MouseEvent, platform: AbstractPlatform) => void
  value?: boolean
}

interface AbstractPlatform {
  name: string
  icon: any
  type: "blog" | "doc"
  enabled: boolean
  actions: AbstractPlatformAction[]
}
