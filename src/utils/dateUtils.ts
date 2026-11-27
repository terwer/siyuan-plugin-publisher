/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

const pad2 = (value: number): string => String(value).padStart(2, "0")

/**
 * 按本地时区格式化为 YYYY-MM-DD HH:mm:ss。
 *
 * 用于表单展示与编辑：输入框里的时间就是用户本地时间，不携带时区。
 */
export const formatLocalDateTime = (date: Date): string => {
  return (
    `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ` +
    `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
  )
}

/**
 * 按本地时区格式化为 YYYY-MM-DD。
 */
export const formatLocalDate = (date: Date): string => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

/**
 * 按本地时区格式化为带显式时区偏移的 ISO 8601 字符串，
 * 例如 2025-04-23T20:00:00+02:00。
 *
 * 静态站构建机通常运行在 UTC，不带偏移的日期会被按构建机时区解释；
 * 带偏移后，Front Matter 表达的是同一个绝对时刻，文章日历日仍是作者的本地日期。
 * 偏移按传入日期计算，因此夏令时（DST）切换日也正确。
 */
export const formatDateTimeWithOffset = (date: Date): string => {
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? "+" : "-"
  const absMinutes = Math.abs(offsetMinutes)
  const offset = `${sign}${pad2(Math.floor(absMinutes / 60))}:${pad2(absMinutes % 60)}`
  const localDateTime = formatLocalDateTime(date).replace(" ", "T")
  return `${localDateTime}${offset}`
}

/**
 * 取本地日期的年、月、日部分，供文件名/永久链接占位符使用。
 */
export const getLocalDateParts = (date: Date): { yyyy: string; MM: string; dd: string } => {
  return {
    yyyy: String(date.getFullYear()),
    MM: pad2(date.getMonth() + 1),
    dd: pad2(date.getDate()),
  }
}

const DATE_WITH_OFFSET_PATTERN = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}:\d{2})(?:\.\d+)?\s*(Z|[+-]\d{2}:?\d{2})$/
const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * 严格解析「日期 + 时间 + 显式时区」字符串，得到对应的绝对时间。
 *
 * 同时兼容历史数据里的空格分隔格式（YYYY-MM-DD HH:mm:ss +0800）与
 * ISO 8601 格式（YYYY-MM-DDTHH:mm:ss+08:00）。不匹配时返回 undefined，
 * 由调用方回退到原解析逻辑。
 */
export const parseDateTimeWithOffset = (value: unknown): Date | undefined => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value
  }
  if (typeof value !== "string") {
    return undefined
  }

  const match = DATE_WITH_OFFSET_PATTERN.exec(value.trim())
  if (!match) {
    return undefined
  }

  const [, datePart, timePart, rawOffset] = match
  let offset = rawOffset
  if (offset !== "Z" && !offset.includes(":")) {
    offset = `${offset.slice(0, 3)}:${offset.slice(3)}`
  }
  const parsed = new Date(`${datePart}T${timePart}${offset}`)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

/**
 * 严格解析本地日期字符串（YYYY-MM-DD），得到本地当天零点。
 *
 * 不能用 new Date("YYYY-MM-DD")：它按 UTC 零点解析，在负时区会显示成前一天。
 */
export const parseLocalDate = (value: unknown): Date | undefined => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value
  }
  if (typeof value !== "string") {
    return undefined
  }

  const match = LOCAL_DATE_PATTERN.exec(value.trim())
  if (!match) {
    return undefined
  }

  const [, yyyy, MM, dd] = match
  const parsed = new Date(Number(yyyy), Number(MM) - 1, Number(dd))
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

/**
 * 解析插件写出的日期：优先按显式偏移解析，其次按本地日期解析。
 *
 * 历史数据里的无偏移日期仍返回 undefined，由调用方回退到原有解析逻辑。
 */
export const parsePublishedDate = (value: unknown): Date | undefined => {
  return parseDateTimeWithOffset(value) ?? parseLocalDate(value)
}
