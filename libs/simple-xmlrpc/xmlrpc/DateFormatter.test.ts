/*
 * Copyright (c) 2023, Terwer . All rights reserved.
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

import { DateFormatter } from "./DateFormatter"

const DATEIN1 = "2019-09-07T-15:50+00"
const DATEIN2 = "2019-09-07T15:50.123+00Z"
const DATEIN3 = "2019-09-07T15:50.000-04:00"

const DATE1 = new Date(Date.UTC(2019, 8, 7, 15, 50, 0, 0))
const DATE2 = new Date(Date.UTC(2019, 8, 7, 15, 50, 0, 123))
const DATE3 = new Date(Date.UTC(2019, 8, 7, 19, 50, 0, 0))

const DATEOUT1 = "2019-09-07T15:50:00.000Z"
const DATEOUT2 = "2019-09-07T15:50:00.123Z"
const DATEOUT3 = "2019-09-07T19:50:00.000Z"

describe("DateFormatter", () => {
  it("decodes timestamps", () => {
    expect(new DateFormatter().decodeIso8601(DATEIN1)).toEqual(DATE1)
    expect(new DateFormatter().decodeIso8601(DATEIN2)).toEqual(DATE2)
    expect(new DateFormatter().decodeIso8601(DATEIN3)).toEqual(DATE3)
  })

  it("encodes timestamps", () => {
    expect(new DateFormatter().encodeIso8601(DATE1)).toEqual(DATEOUT1)
    expect(new DateFormatter().encodeIso8601(DATE2)).toEqual(DATEOUT2)
    expect(new DateFormatter().encodeIso8601(DATE3)).toEqual(DATEOUT3)
  })

  it("round trips timestamps", () => {
    const date1 = new DateFormatter().decodeIso8601(DATEOUT1)
    const date2 = new DateFormatter().decodeIso8601(DATEOUT2)
    const date3 = new DateFormatter().decodeIso8601(DATEOUT3)
    expect(new DateFormatter().encodeIso8601(date1)).toEqual(DATEOUT1)
    expect(new DateFormatter().encodeIso8601(date2)).toEqual(DATEOUT2)
    expect(new DateFormatter().encodeIso8601(date3)).toEqual(DATEOUT3)
  })
})
