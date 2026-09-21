/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import FormDataHostUtil from "~/src/utils/FormDataHostUtil.ts"
import viteConfigSource from "~/vite.config.ts?raw"

describe("vite.config APP_BASE", () => {
  it("builds the plugin as a SiYuan host app instead of a site-root app", () => {
    expect(viteConfigSource).toContain('const PluginAppBase = "/plugins/siyuan-plugin-publisher/"')
    expect(viteConfigSource).toContain("APP_BASE: PluginAppBase")
    expect(viteConfigSource).not.toContain('APP_BASE: "/"')
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

    FormDataHostUtil.getFormData(appInstance)

    expect(requireMock).toHaveBeenCalledWith("/data/plugins/siyuan-plugin-publisher/libs/node-fetch-cjs/dist/index.js")
    expect(requireMock).not.toHaveBeenCalledWith("/data/libs/node-fetch-cjs/dist/index.js")
  })
})
