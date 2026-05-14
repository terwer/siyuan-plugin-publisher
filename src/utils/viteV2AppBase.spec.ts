/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import viteV2ConfigSource from "~/vite.v2.config.ts?raw"

describe("vite.v2.config APP_BASE", () => {
  it("builds V2 as a SiYuan host plugin instead of a site-root app", () => {
    expect(viteV2ConfigSource).toContain('const v2PluginAppBase = "/plugins/siyuan-plugin-publisher/"')
    expect(viteV2ConfigSource).toContain("APP_BASE: v2PluginAppBase")
    expect(viteV2ConfigSource).not.toContain('APP_BASE: "/"')
  })
})
