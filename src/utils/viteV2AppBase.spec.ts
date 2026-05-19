/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import FormDataUtils from "~/src/utils/FormDataUtils.ts"
import viteV2ConfigSource from "~/vite.v2.config.ts?raw"

describe("vite.v2.config APP_BASE", () => {
  it("builds V2 as a SiYuan host plugin instead of a site-root app", () => {
    expect(viteV2ConfigSource).toContain('const v2PluginAppBase = "/plugins/siyuan-plugin-publisher/"')
    expect(viteV2ConfigSource).toContain("APP_BASE: v2PluginAppBase")
    expect(viteV2ConfigSource).not.toContain('APP_BASE: "/"')
  })

  it("keeps FormData dependencies under the plugin APP_BASE directory", () => {
    const requireMock = vi.fn(() => ({
      FormData: class TestFormData {},
      Blob: class TestBlob {},
    }))
    const appInstance = {
      moduleBase: "/data/plugins/siyuan-plugin-publisher/",
      win: {
        FormData: class BrowserFormData {},
        Blob: class BrowserBlob {},
        require: requireMock,
      },
    } as any

    FormDataUtils.getFormData(appInstance)

    expect(requireMock).toHaveBeenCalledWith("/data/plugins/siyuan-plugin-publisher/libs/node-fetch-cjs/dist/index.js")
    expect(requireMock).not.toHaveBeenCalledWith("/data/libs/node-fetch-cjs/dist/index.js")
  })
})
