/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, it } from "vitest"
import { BilibiliUtils } from "~/src/adaptors/web/bilibili/bilibiliUtils.ts"
import path from "path";

describe("BilibiliUtils", () => {
  it("genUploadId", () => {
    const uploadId = BilibiliUtils.genUploadId()
    console.log("uploadId=>", uploadId)
  })

  it("parseMd", () => {
    const moduleBase = path.resolve(__dirname, "../../../..")
    // lute
    require(path.join(moduleBase, "public/libs/lute/lute-1.7.5-20230410.min.js"))

    const md = "# 标题1"
    const result = BilibiliUtils.parseMd(md)
    console.log("result=>", result)
  })
})
