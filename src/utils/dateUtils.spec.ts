/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import {
  formatDateTimeWithOffset,
  formatLocalDate,
  formatLocalDateTime,
  getLocalDateParts,
  parseDateTimeWithOffset,
  parseLocalDate,
  parsePublishedDate,
} from "~/src/utils/dateUtils.ts"

const date = new Date("2025-04-23T18:00:00.000Z")

const pad2 = (value: number): string => String(value).padStart(2, "0")
const expectedLocalDateTime = (value: Date): string =>
  `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())} ` +
  `${pad2(value.getHours())}:${pad2(value.getMinutes())}:${pad2(value.getSeconds())}`

describe("dateUtils", () => {
  it("按本地时区输出表单时间，而不是固定 +8", () => {
    expect(formatLocalDateTime(date)).toBe(expectedLocalDateTime(date))
    expect(formatLocalDate(date)).toBe(expectedLocalDateTime(date).split(" ")[0])
  })

  it("输出带显式时区偏移的 ISO 8601 日期，且解析回同一绝对时刻", () => {
    const formatted = formatDateTimeWithOffset(date)
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/)
    expect(new Date(formatted).getTime()).toBe(date.getTime())
  })

  it("文件名/永久链接使用本地日期各部分", () => {
    const parts = getLocalDateParts(date)
    const [localDate] = expectedLocalDateTime(date).split(" ")
    expect(`${parts.yyyy}-${parts.MM}-${parts.dd}`).toBe(localDate)
  })

  it("解析历史空格分隔偏移格式与 ISO 8601 偏移格式", () => {
    expect(parseDateTimeWithOffset("2025-04-23 20:00:00 +0800")?.toISOString()).toBe("2025-04-23T12:00:00.000Z")
    expect(parseDateTimeWithOffset("2025-04-23T20:00:00+02:00")?.toISOString()).toBe("2025-04-23T18:00:00.000Z")
  })

  it("解析本地日期字符串时使用本地零点，不走 UTC", () => {
    const parsed = parseLocalDate("2025-04-23")
    expect(parsed).toBeDefined()
    expect(parsed!.getFullYear()).toBe(2025)
    expect(parsed!.getMonth()).toBe(3)
    expect(parsed!.getDate()).toBe(23)
    expect(parsed!.getHours()).toBe(0)
  })

  it("没有时区偏移的旧字符串不按偏移解析，交给原有回退逻辑", () => {
    expect(parseDateTimeWithOffset("2025-04-24 02:00:00")).toBeUndefined()
  })

  it("插件写出的偏移日期与纯日期都能无损解析", () => {
    expect(parsePublishedDate("2025-04-23T20:00:00+02:00")?.toISOString()).toBe("2025-04-23T18:00:00.000Z")
    const localDate = parsePublishedDate("2025-04-23")
    expect(localDate?.getFullYear()).toBe(2025)
    expect(localDate?.getMonth()).toBe(3)
    expect(localDate?.getDate()).toBe(23)
  })
})
