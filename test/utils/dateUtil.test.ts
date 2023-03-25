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
import { covertStringToDate, formatIsoToNumDate, formatIsoToZhDate } from "~/utils/dateUtil"
import { LogFactory } from "~/utils/logUtil"

const logger = LogFactory.getLogger()

describe("dateUtil test", () => {
  it("covertStringToDate test", () => {
    const date = covertStringToDate("20220718142548")
    logger.info("date.toISOString=>")
    logger.info(date.toISOString())

    const timeZone = "Asia/Shanghai"
    const datestr = date.toLocaleString("zh-CN", {
      timeZone,
    })
    logger.info("datestr=>")
    logger.info(datestr)
  })

  it("formatIsoToZhDate test", () => {
    const fmt = formatIsoToZhDate(new Date().toISOString())
    logger.info("fmt=>")
    logger.info(fmt)
  })

  it("formatIsoToNumDate test", () => {
    const fmt2 = formatIsoToNumDate(new Date().toISOString())
    logger.info("fmt2=>")
    logger.info(fmt2)
  })
})
