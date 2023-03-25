/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { describe } from "vitest"
import { LogFactory } from "~/utils/logUtil"
import { flushPromises, mount } from "@vue/test-utils"
import TestSlug from "~/test/composables/TestSlug.vue"
import path from "path"
import { readFileSync } from "~/utils/fileUtil"
import { setJSONConf } from "~/utils/configUtil"
import { TEST_CONSTANTS } from "~/test/TEST_CONSTANTS"

describe("makeSlug test", async () => {
  const logger = LogFactory.getLogger()

  it("init", () => {
    const filename = path.resolve("./", "test/data/demo", "siyuanPage.txt")
    const pageStr = readFileSync(filename)
    setJSONConf(TEST_CONSTANTS.CONSTANTS_SIYUAN_PAGE, pageStr)
    logger.info("pageStr=>", pageStr)
  })

  it("useSlug test", async () => {
    const wrapper = mount(TestSlug)
    await flushPromises()

    await wrapper.find("#makeSlugBtn").trigger("click")
    await flushPromises()

    // const result = wrapper.html()
    // logger.info("slugComponent HTML=>", result)
  })
})
