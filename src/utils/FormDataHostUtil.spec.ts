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

describe("FormDataHostUtil", () => {
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

    FormDataHostUtil.getFormData(appInstance)

    expect(requireMock).toHaveBeenCalledWith(
      "/Volumes/workspace/mydocs/SiYuanWorkspace/test/data/plugins/siyuan-plugin-publisher/libs/node-fetch-cjs/dist/index.js"
    )
    expect(requireMock).not.toHaveBeenCalledWith(
      "/Volumes/workspace/mydocs/SiYuanWorkspace/test/data/libs/node-fetch-cjs/dist/index.js"
    )
  })
})
