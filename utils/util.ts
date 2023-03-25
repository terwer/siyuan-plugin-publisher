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

import { slugify } from "transliteration"
import { mdToPlainText } from "~/utils/htmlUtil"
import { LogFactory } from "~/utils/logUtil"
import { CONSTANTS } from "~/utils/constants/constants"

const logger = LogFactory.getLogger()

/**
 * 中文翻译成英文别名
 * @param q 中文名
 * @returns {Promise<unknown>}
 */
export const zhSlugify = async (q: string): Promise<string> => {
  // const v = await fetch('https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=en-US&q=' + q);
  const v = await fetch("https://api.terwer.space/api/translate?q=" + q)
  const json = await v.json()
  let res = json[0][0]
  res = res.replaceAll(/-/g, "")
  res = res.replaceAll(/\./g, "")
  res = res.replaceAll(/~/g, "")

  res = slugify(res)

  res = res.replaceAll(/@/g, "")

  return res
}

/**
 * 拼音转别名
 * @param q 中文名
 */
export const pinyinSlugify = (q: string): string => slugify(q)

/**
 * 文本分词
 * @param words 文本
 */
export const cutWords = async (words: string): Promise<any> => {
  // https://github.com/yanyiwu/nodejieba
  words = mdToPlainText(words)
  logger.debug("准备开始分词，原文=>", words)
  // https://github.com/ddsol/speedtest.net/issues/112
  // 浏览器和webpack不支持，只有node能用
  // const result = nodejieba.cut(words);
  // https://api.terwer.space/api/jieba?q=test

  const v = await fetch("https://api.terwer.space/api/jieba?q=" + words)
  const json = await v.json()
  // const result = "浏览器和webpack不支持，只有node能用，作者仓库： https://github.com/yanyiwu/nodejieba ，在线版本：http://cppjieba-webdemo.herokuapp.com 。"
  logger.debug("分词完毕，结果=>", json.result)
  return json.result
}

/**
 * 统计分词并按照次数排序
 * @param words 分词数组
 * @param len 长度
 * @returns {string[]}
 */
function countWords(words: any, len: number): string[] {
  const unUseWords = ["页面"]
  logger.debug("文本清洗，统计，排序，去除无意义的单词unUseWords=>", unUseWords)

  // 统计
  const wordobj = words.reduce(function (count: any, word: any) {
    // 排除无意义的词
    if (word.length === 1 || unUseWords.includes(word)) {
      count[word] = 0
      return count
    }

    // 统计
    count[word] = count.hasOwnProperty(word) ? parseInt(count[word]) + 1 : 1
    return count
  }, {})

  // 排序
  const wordarr = Object.keys(wordobj).sort(function (a, b) {
    return wordobj[b] - wordobj[a]
  })
  logger.debug("文本清洗结束wordarr=>", wordarr)

  if (!len || len === 0) {
    return wordarr
  }
  return wordarr.slice(0, len)
}

/**
 * 从分词中提取热门标签
 */
export function jiebaToHotWords(words: string[], len?: number): string[] {
  let res
  const deflen = CONSTANTS.DEFAULT_JIEBA_WORD_LENGTH
  if (len) {
    res = countWords(words, len)
  } else {
    res = countWords(words, deflen)
  }

  logger.debug("jiebaToHotWords=>", res)
  return res
}

/**
 * 检测是否是空对象
 * @param obj 对象
 */
export const isEmptyObject = (obj: any): boolean => {
  if (!obj) {
    return true
  }
  return (
    Object.getPrototypeOf(obj) === Object.prototype &&
    Object.getOwnPropertyNames(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0
  )
}

/**
 * 字符串空值检测
 * @param str 待检测的字符串
 */
export const isEmptyString = (str: any): boolean => {
  if (!str) {
    return true
  }
  if (!(typeof str === "string")) {
    return true
  }
  return str.trim().length === 0
}

/**
 * 路径组合，解决多出来/的问题
 * @param path1
 * @param path2
 */
export const pathJoin = (path1: string, path2: string): string => {
  let path = path1
  const path1LastIdx = path1.lastIndexOf("/")
  // logUtil.logInfo("path1.length=>", path1.length)
  // logUtil.logInfo("path1LastIdx=>", path1LastIdx)
  if (path1LastIdx + 1 === path1.length) {
    path = path1.substring(0, path1LastIdx)
  }

  const path2Idx = path2.indexOf("/")
  // logUtil.logInfo("path2Idx=>", path2Idx)
  if (path2Idx > 0) {
    path = path + "/" + path2
  } else {
    path = path + path2
  }

  return path
}

/**
 * 强转boolean
 * @param val
 */
export const parseBoolean = (val: any) => {
  if (!val) {
    val = "false"
  }
  return val.toString().toLowerCase() === "true"
}
