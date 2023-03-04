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

import { removeTitleNumber } from "~/utils/htmlUtil"
import { isReactive, isRef, toRaw, unref } from "vue"

/**
 * @function unescapeHTML 还原html脚本 < > & " '
 * @param a 字符串
 */
export const unescapeHTML = (a: string): string => {
  a = "" + a
  return a.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
}

/**
 * 截取指定长度的字符串
 * @param str str
 * @param length 长度
 * @param ignore 不要结尾省略号
 * @returns {string} 结果
 */
export const getByLength = (
  str: string,
  length: number,
  ignore?: boolean
): string => {
  const allText = str
  if (allText.length < length) {
    return allText
  }
  if (ignore) {
    return allText.substring(0, length)
  }
  return allText.substring(0, length) + "..."
}

/**
 * 首字母大写
 * @param name
 */
export const upperFirst = (name: string): string => {
  return name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase()
}

/**
 * 字符串拼接
 * @param str
 */
export const appendStr = (...str: string[]): string => {
  return str.join("")
}

/**
 * 文件名转title
 * @param fmtTitle
 */
export const mdFileToTitle = (fmtTitle: string): string => {
  if (fmtTitle.includes(".md")) {
    fmtTitle = fmtTitle.replace(/\.md/g, "")
  }
  if (fmtTitle.includes(".")) {
    fmtTitle = removeTitleNumber(fmtTitle)
  }
  return fmtTitle
}

/**
 * 去除BOM字符
 * @param str  原字符
 */
export const removeBom = (str: string): string => {
  const supportedImages = [".png", ".jpg", ".gif"]
  supportedImages.forEach((ext) => {
    // const ext = ".png"
    if (str.includes(ext)) {
      str = str.substring(0, str.indexOf(ext)) + ext
    }
  })

  // 去除空白
  // str = str.replace(/%.*/g, "").replace(/\s/g, "")

  // 先解码URL编码的字符
  // str = decodeURIComponent(str)

  // 再去除BOM字符
  // str = str.replace(/\uFEFF/g, "")

  return str
}

const trimValues = (obj: IStringKeyMap) => {
  const newObj = {} as IStringKeyMap
  Object.keys(obj).forEach((key) => {
    newObj[key] = typeof obj[key] === "string" ? obj[key].trim() : obj[key]
  })
  return newObj
}

/**
 * get raw data from reactive or ref
 */
const getRawData = (args: any): any => {
  if (Array.isArray(args)) {
    const data = args.map((item: any) => {
      if (isRef(item)) {
        return unref(item)
      }
      if (isReactive(item)) {
        return toRaw(item)
      }
      return getRawData(item)
    })
    return data
  }
  if (typeof args === "object") {
    const data = {} as IStringKeyMap
    Object.keys(args).forEach((key) => {
      const item = args[key]
      if (isRef(item)) {
        data[key] = unref(item)
      } else if (isReactive(item)) {
        data[key] = toRaw(item)
      } else {
        data[key] = getRawData(item)
      }
    })
    return data
  }
  return args
}

/**
 * 判断字符串中，是否包含数组中任何一个元素
 * @param str 字符串
 * @param arr 字符串数组
 */
const includeInArray = (str: string, arr: string[]): boolean => {
  let flag = false
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (str.includes(item)) {
      flag = true
    }
  }

  return flag
}

const strUtil = {
  trimValues,
  getRawData,
  includeInArray,
}

export default strUtil
