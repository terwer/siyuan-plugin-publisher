/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import {describe, it} from "vitest"
import KatexUtils from "~/src/utils/katexUtils.ts"

describe("test katexUtils", () => {
  it("test renderToString", () => {
    const mathExpression = "./main \\nHello World!\\n^CSignal handler\\nReceived SI…Code/Embeed/ApplicationDevelop/MyImplement/Signal"
    const mathHtml = KatexUtils.renderToString(mathExpression)
    console.log("mathHtml=>", mathHtml)
  })
})