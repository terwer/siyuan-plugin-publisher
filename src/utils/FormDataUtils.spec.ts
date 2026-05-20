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

describe("FormDataUtils", () => {
  it("loads bundled form-data dependencies from the plugin APP_BASE path", () => {
    const requireMock = vi.fn((path: string) => {
      if (path.endsWith("node-fetch-cjs/dist/index.js")) {
        return {
          FormData: class TestFormData {},
          Blob: class TestBlob {},
        }
      }
      return {}
    })
    const appInstance = {
      moduleBase: "/Volumes/workspace/mydocs/SiYuanWorkspace/test/data/plugins/siyuan-plugin-publisher/",
      win: {
        FormData: class BrowserFormData {},
        Blob: class BrowserBlob {},
        require: requireMock,
      },
    } as any

    FormDataUtils.getFormData(appInstance)

    expect(requireMock).toHaveBeenCalledWith(
      "/Volumes/workspace/mydocs/SiYuanWorkspace/test/data/plugins/siyuan-plugin-publisher/libs/node-fetch-cjs/dist/index.js"
    )
    expect(requireMock).not.toHaveBeenCalledWith(
      "/Volumes/workspace/mydocs/SiYuanWorkspace/test/data/libs/node-fetch-cjs/dist/index.js"
    )
  })

  it("prefers plugin node-fetch for multipart even when forceProxy is true", () => {
    const appInstance = { win: { require: vi.fn() } } as any
    expect(
      FormDataUtils.resolveFormUploadTransport(appInstance, {
        isInSiyuanOrSiyuanNewWin: true,
        forceProxy: true,
      })
    ).toBe("plugin-node-fetch")
  })

  it("falls back to forwardProxy outside siyuan when forceProxy is true", () => {
    const appInstance = { win: {} } as any
    expect(
      FormDataUtils.resolveFormUploadTransport(appInstance, {
        isInSiyuanOrSiyuanNewWin: false,
        forceProxy: true,
      })
    ).toBe("siyuan-forward-proxy")
  })

  it("uses plugin node-fetch inside siyuan when forceProxy is false", () => {
    const appInstance = { win: { require: vi.fn() } } as any
    expect(
      FormDataUtils.resolveFormUploadTransport(appInstance, {
        isInSiyuanOrSiyuanNewWin: true,
        forceProxy: false,
      })
    ).toBe("plugin-node-fetch")
  })
})
