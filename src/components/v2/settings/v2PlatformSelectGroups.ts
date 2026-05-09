/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PlatformType } from "~/src/platforms/dynamicConfig.ts"

export const V2_PLATFORM_SELECT_GROUP_DEFS: Array<{ key: PlatformType; labelKey: string }> = [
  { key: PlatformType.Common, labelKey: "setting.platform.universal" },
  { key: PlatformType.Github, labelKey: "setting.platform.github" },
  { key: PlatformType.Gitlab, labelKey: "setting.platform.gitlab" },
  { key: PlatformType.Metaweblog, labelKey: "setting.platform.metaweblog" },
  { key: PlatformType.Wordpress, labelKey: "setting.platform.wordpress" },
  { key: PlatformType.Custom, labelKey: "setting.platform.custom" },
  { key: PlatformType.Fs, labelKey: "setting.platform.fs" },
]
