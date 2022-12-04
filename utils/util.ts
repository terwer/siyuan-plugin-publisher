/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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
import jsYaml from "js-yaml"

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
  res = res.replaceAll(/~/g, "")

  res = slugify(res)

  res = res.replaceAll(/@/g, "")

  return res
}

/**
 * 拼音转别名
 * @param q 中文名
 */
export const pingyinSlugify = async (q: string): Promise<string> => slugify(q)

/**
 * 给日期添加小时
 * @param date
 * @param numOfHours
 * @returns {*}
 */
const addHoursToDate = function (date: Date, numOfHours: number) {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000)
  return date
}

/**
 * 转换ISO日期为数字日期
 * @param str '2022-07-18T06:25:48.000Z
 * @param isAddTimeZone 是否增加时区（默认不增加）
 * @returns {string|*}
 */
export const formatIsoToNumDate = (str: string, isAddTimeZone?: boolean) => {
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
      logUtil.logInfo("修复时区，ISO日期默认晚8小时")
      // ISO日期默认晚8小时
      logUtil.logInfo(addHoursToDate(new Date(match), 8))
      newmatch = addHoursToDate(new Date(match), 8).toISOString()
    }

    const dts = newmatch.split("T")
    const d = dts[0].replaceAll(/-/g, "")
    const t = dts[1].split(".")[0].replaceAll(/:/g, "")

    const result = d + t

    newstr = newstr.replace(match, result)
    logUtil.logInfo("formatIsoDate match=>", match)
    logUtil.logInfo("formatIsoDate result=>", result)
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
) => {
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

  logUtil.logInfo("formatNumToZhDate str=>", str)
  logUtil.logInfo("formatNumToZhDate datestr=>", datestr)
  return datestr
}

// get a Date object with the specified Time zone
function changeTimeZone(date: any, timeZone: string) {
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
 * @param dateString dateString should be in ISO format: "yyyy-mm-dd", "yyyy-mm" or "yyyy" or yyyymmddsss
 * @returns {Date}
 */
export function covertStringToDate(dateString: string) {
  const datestr = formatNumToZhDate(dateString)

  // logUtil.logInfo("datestr=>", datestr)
  return changeTimeZone(datestr, "Asia/Shanghai")
}

/**
 * 计算所给的时间距离现在的秒数
 * @param isoDateStr 过去的时间
 */
export const calcLastSeconds = function (isoDateStr: string) {
  const fmt = formatIsoToNumDate(isoDateStr, true)
  const date = covertStringToDate(fmt)

  const now = new Date()

  const s = (now.getTime() - date.getTime()) / 1000
  return parseInt(s.toString())
}

// const date = covertStringToDate('20220718142548');
// // const timeZone = 'Asia/Shanghai'
// // const datestr = date.toLocaleString('zh-CN', {
// //     timeZone,
// // });
// logUtil.logInfo("date.toISOString=>")
// logUtil.logInfo(date.toISOString())
//
// const obj = {
//     title: "测试，这里有T，也有.000Z啊",
//     date: date
// }
// const yaml = obj2yaml(obj)
// logUtil.logInfo("yaml=>")
// logUtil.logInfo(yaml)
//
// const fmt = formatIsoToZhDate(yaml)
// logUtil.logInfo("fmt=>")
// logUtil.logInfo(fmt)
//
// const fmt2 = formatIsoToNumDate(yaml)
// logUtil.logInfo("fmt2=>")
// logUtil.logInfo(fmt2)

/**
 * 文本分词
 * @param words 文本
 */
export async function cutWords(words: string) {
  // https://github.com/yanyiwu/nodejieba
  words = mdToPlainText(words)
  logUtil.logInfo("准备开始分词，原文=>", words)
  // https://github.com/ddsol/speedtest.net/issues/112
  // 浏览器和webpack不支持，只有node能用
  // const result = nodejieba.cut(words);
  // https://api.terwer.space/api/jieba?q=test

  const v = await fetch("https://api.terwer.space/api/jieba?q=" + words)
  const json = await v.json()
  // const result = "浏览器和webpack不支持，只有node能用，作者仓库： https://github.com/yanyiwu/nodejieba ，在线版本：http://cppjieba-webdemo.herokuapp.com 。"
  logUtil.logInfo("分词完毕，结果=>", json.result)
  return json.result
}

/**
 * 统计分词并按照次数排序
 * @param words 分词数组
 * @param len 长度
 * @returns {string[]}
 */
function countWords(words: string[], len: number) {
  const unUseWords = ["页面"]
  logUtil.logInfo(
    "文本清洗，统计，排序，去除无意义的单词unUseWords=>",
    unUseWords
  )

  // 统计
  const wordobj = words.reduce(function (count, word) {
    // 排除无意义的词
    if (word.length === 1 || unUseWords.includes(word)) {
      // @ts-expect-error
      count[word] = 0
      return count
    }

    // 统计
    // @ts-expect-error
    // eslint-disable-next-line no-prototype-builtins,@typescript-eslint/restrict-plus-operands
    count[word] = count.hasOwnProperty(word) ? count[word] + 1 : 1
    return count
  }, {})

  // 排序
  const wordarr = Object.keys(wordobj).sort(function (a, b) {
    // @ts-expect-error
    return wordobj[b] - wordobj[a]
  })
  logUtil.logInfo("文本清洗结束wordarr=>", wordarr)

  if (!len || len === 0) {
    return wordarr
  }
  return wordarr.slice(0, len)
}

/**
 * 从分词中提取热门标签
 */
export function jiebaToHotWords(words: string[], len: number) {
  // const words = ["文档", "协同", "开发", "2022/05/25", "需求", "评审", "1", "、", "后台", "配置", "，", "可", "选择", "wps", "或者", "石墨", "文档", "2022/05/31ui", "评审", "2022/06/10", "开发", "遇到", "的", "问题", "1", "、", "未", "开启", "文档", "中台", "时候", "的", "提示", "，", "以及", "其他", "页面", "的", "缺省", "样式", "。", "2022/6/24", "遗留问题", "1", "、", "分享", "发送", "待办", "-", "已", "完成", "2", "、", "团队", "文档", "发送", "待办", "-", "已", "完成", "3", "、", "权限", "-", "已", "完成", "4", "、", "团队", "文档", "传", "fdteamid", "，", "后台", "做", "权限", "判断", "，", "如果", "不是", "这个", "团队", "的人", "，", "提示", "无", "权限", "页面", "-", "已", "完成", "5", "、", "看看", "能", "不能", "隐藏", "默认", "标题", "-todo6", "、", "excel", "和", "ppt", "的", "知识", "助手", "不", "做", "-", "已", "完成", "2022/7/8", "遗留问题", "1", "、", "文档", "和", "模板", "的", "拷贝", "、", "打印", "2", "、", "收藏夹", "重复", "收藏", "2022/7/19", "遗留问题", "1", "、", "文档", "知识", "助手", "太长加", "滚动条", "2", "、", "附件", "的", "显示", "与", "预览", "3", "、", "收起", "4", "、", "自定义", "confirm", "弹窗", "5", "、", "缺省", "页面", "2022/7/19", "待转", "单", "问题", "1", "、", "搜索", "关键字", "去掉", "2", "、", "未", "选中", "的", "时候", "按钮", "变成", "全部", "3", "、", "右侧", "滚动条", "、", "分页", "4", "、", "带", "表格", "收藏", "2022/7/20", "待", "解决问题", "1", "、", "excel", "、", "ppt", "格式", "时", "，", "点", "不", "开", "右侧", "工具栏", "图标", "2", "、", "段落", "收藏", "不能", "用", "3", "、", "详情", "页面", "调整", "4", "、", "筛选", "项", "修复", "5", "、", "git", "无法访问", "1", "、", "摘要", "、", "正文", "（", "正文", "图片", "）", "、", "附件", "2", "、", "搜索", "结果", "，", "状态", "30", "，", "有", "可", "阅读", "权限", "（", "确认", "）", "3", "、", "链接", "只", "展示", "图标", "放在", "标题", "右侧", "1", "、", "插入", "图片", "、", "表格", "2", "、", "维基", "目录", "3", "、", "搜索", "结果", "只", "显示", "文档", "不", "显示", "附件", "4", "、", "知识", "助手", "切换", "tab", "触发", "数据", "更新"]
  // const len = 5

  const res = countWords(words, len)
  // logUtil.logInfo(res)
  return res
}

// jiebaToHotWords()

/**
 * 是否在浏览器
 */
export const inBrowser = (): boolean => typeof window !== "undefined"

/**
 * 获取url参数
 * @param sParam 参数
 */
export function getQueryString(sParam: string) {
  if (!inBrowser()) {
    return ""
  }
  const sPageURL = window.location.search.substring(1)
  const sURLVariables = sPageURL.split("&")

  for (let i = 0; i < sURLVariables.length; i++) {
    const sParameterName = sURLVariables[i].split("=")
    if (sParameterName[0] === sParam) {
      return sParameterName[1]
    }
  }
}

function replaceUrlParam(url: string, paramName: string, paramValue: string) {
  if (paramValue == null) {
    paramValue = ""
  }
  const pattern = new RegExp("\\b(" + paramName + "=).*?(&|#|$)")
  if (url.search(pattern) >= 0) {
    return url.replace(pattern, "$1" + paramValue + "$2")
  }
  url = url.replace(/[?#]$/, "")
  return url + (url.indexOf("?") > 0 ? "&" : "?") + paramName + "=" + paramValue
}

/**
 * 设置url参数
 * @param urlstring
 * @param key
 * @param value
 */
export function setUrlParameter(urlstring: string, key: string, value: string) {
  if (!inBrowser()) {
    return ""
  }
  // 已经有参数了，不重复添加
  if (urlstring.includes(key)) {
    return replaceUrlParam(urlstring, key, value)
  }
  urlstring += (urlstring.match(/[?]/g) != null ? "&" : "?") + key + "=" + value
  return urlstring
}

export function isEmptyObject(obj: any) {
  if (!obj) {
    return true
  }
  return (
    Object.getPrototypeOf(obj) === Object.prototype &&
    Object.getOwnPropertyNames(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0
  )
}

export function isEmptyString(str: any) {
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
export function pathJoin(path1: string, path2: string) {
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
 * 重新加载指定tab
 * @param tabname
 */
export const reloadTabPage = (tabname: string) => {
  setTimeout(function () {
    if (inBrowser()) {
      const url = window.location.href
      window.location.href = setUrlParameter(url, "tab", tabname)
    }
  }, 200)
}

export const reloadPage = (tabname: string) => {
  setTimeout(function () {
    if (inBrowser()) {
      window.location.reload()
    }
  }, 200)
}
