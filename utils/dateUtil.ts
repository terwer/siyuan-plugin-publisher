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

import { LogFactory } from "~/utils/logUtil"

const logger = LogFactory.getLogger()

/**
 * 给日期添加小时
 * @param date
 * @param numOfHours
 * @returns {*}
 */
const addHoursToDate = function (date: Date, numOfHours: number): Date {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000)
  return date
}

/**
 * 转换ISO日期为数字日期
 * @param str '2022-07-18T06:25:48.000Z
 * @param isAddTimeZone 是否增加时区（默认不增加）
 * @returns {string|*}
 */
export const formatIsoToNumDate = (
  str: string,
  isAddTimeZone?: boolean
): string => {
  if (!str) {
    return ""
  }
  let newstr = str

  // https://www.regextester.com/112232
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  const isoDateRegex =
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(.\d{3})Z$/gm
  const matches = newstr.match(isoDateRegex)
  if (matches == null) {
    return ""
  }
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]

    let newmatch = match
    if (isAddTimeZone) {
      logger.debug("修复时区，ISO日期默认晚8小时")
      // ISO日期默认晚8小时
      logger.debug(addHoursToDate(new Date(match), 8))
      newmatch = addHoursToDate(new Date(match), 8).toISOString()
    }

    const dts = newmatch.split("T")
    const d = dts[0].replaceAll(/-/g, "")
    const t = dts[1].split(".")[0].replaceAll(/:/g, "")

    const result = d + t

    newstr = newstr.replace(match, result)
    logger.debug("formatIsoDate match=>", match)
    logger.debug("formatIsoDate result=>", result)
  }

  return newstr
}

/**
 * 转换ISO日期为中文日期
 * @param str '2022-07-18T06:25:48.000Z
 * @param isAddTimeZone 是否增加时区（默认不增加）
 * @param isShort 是否只返回日期
 * @returns {string|*}
 */
export const formatIsoToZhDate = (
  str: string,
  isAddTimeZone?: boolean,
  isShort?: boolean
): string => {
  if (!str) {
    return ""
  }
  let newstr = str

  // https://www.regextester.com/112232
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  const isoDateRegex =
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(.\d{3})Z$/gm
  const matches = newstr.match(isoDateRegex)
  if (matches == null) {
    return str
  }
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]

    let newmatch = match
    if (isAddTimeZone) {
      // ISO日期默认晚8小时
      // logUtil.logInfo(addHoursToDate(new Date(match), 8))
      newmatch = addHoursToDate(new Date(match), 8).toISOString()
    }

    const dts = newmatch.split("T")
    const d = dts[0]
    const t = dts[1].split(".")[0]

    let result = d + " " + t
    if (isShort) {
      result = d
    }

    newstr = newstr.replace(match, result)
    // logUtil.logInfo("formatZhDate match=>", match)
    // logUtil.logInfo("formatZhDate result=>", result)
  }

  // logUtil.logInfo("formatZhDate=>", newstr)
  return newstr
}

/**
 * 转换数字日期为中文日期
 * @param str '20220718142548'
 * @returns {string|*}
 */
export const formatNumToZhDate = (str: string): string => {
  if (!str) {
    return ""
  }
  const newstr = str

  const onlyNumbers = newstr.replace(/\D/g, "")
  // logUtil.logInfo("onlyNumbers=>", onlyNumbers)
  const year = onlyNumbers.slice(0, 4)
  const month = onlyNumbers.slice(4, 6)
  const day = onlyNumbers.slice(6, 8)
  const hour = onlyNumbers.slice(8, 10)
  const min = onlyNumbers.slice(10, 12)
  const sec = onlyNumbers.slice(12, 14)

  let datestr = year
  if (!month) {
    datestr = year
  } else if (!day) {
    datestr = year + "-" + month
  } else if (!hour) {
    datestr = year + "-" + month + "-" + day
  } else if (!min) {
    datestr = year + "-" + month + "-" + day + " " + hour
  } else if (!sec) {
    datestr = year + "-" + month + "-" + day + " " + hour + ":" + min
  } else {
    datestr =
      year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
  }

  logger.debug("formatNumToZhDate str=>", str)
  logger.debug("formatNumToZhDate datestr=>", datestr)
  return datestr
}

// get a Date object with the specified Time zone
const changeTimeZone = (date: any, timeZone: string): Date => {
  if (typeof date === "string") {
    return new Date(
      new Date(date).toLocaleString("zh-CN", {
        timeZone,
      })
    )
  }

  return new Date(
    date.toLocaleString("zh-CN", {
      timeZone,
    })
  )
}

/**
 * 字符转Date
 * @param dateString dateString
 *
 * ```
 * should be in ISO format: "yyyy-mm-dd", "yyyy-mm" or "yyyy" or yyyymmddsss
 * ```
 *
 * @returns {Date}
 */
export const covertStringToDate = (dateString: string): Date => {
  const datestr = formatNumToZhDate(dateString)

  logger.debug("datestr=>", datestr)
  return changeTimeZone(datestr, "Asia/Shanghai")
}

/**
 * 计算所给的时间距离现在的秒数
 * @param isoDateStr 过去的时间
 */
export const calcLastSeconds = function (isoDateStr: string): number {
  const fmt = formatIsoToNumDate(isoDateStr, true)
  const date = covertStringToDate(fmt)

  const now = new Date()

  const s = (now.getTime() - date.getTime()) / 1000
  return parseInt(s.toString())
}

/**
 * 当前年份
 */
export const nowYear = () => {
  return new Date().getFullYear()
}

/**
 * 时间戳转时间
 * @param timestamp 时间戳
 */
const formatTimestampToZhDate = (timestamp) => {
  if (typeof timestamp == "string") {
    timestamp = parseInt(timestamp)
  }
  return formatIsoToZhDate(new Date(timestamp).toISOString(), true)
}

const dateUtil = {
  formatTimestampToZhDate,
}
export default dateUtil
