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
import { importJSONToLocalStorage } from "~/utils/otherlib/ChromeUtil"
import { getLocalStorageAdaptor } from "~/utils/otherlib/confUtil"
import { ElMessage } from "element-plus"
import { appendStr } from "./strUtil"
import { reloadPage } from "~/utils/browserUtil"

const logger = LogFactory.getLogger()

/**
 * 获取配置：这个是所有数据保存的根方法
 * @param key key
 */
export const getConf = (key: string): string => {
  // logUtil.logInfo("尝试从localStorage获取数据，key=>", key)

  const store = getLocalStorageAdaptor()
  const value = store.getItem(key)
  if (!value) {
    // logUtil.logInfo("未找到对应数据，key=>", key)
    return ""
  }
  // logUtil.logInfo("从localStorage获取数据=>", value)
  return value
}

/**
 * 获取Boolean配置
 * @param key key
 */
export const getBooleanConf = (key: string): boolean => {
  // logUtil.logInfo("------------------------------")
  // logUtil.logInfo("尝试从localStorage获取Boolean数据，key=>", key)

  const value = getConf(key)
  const valueObj: boolean = value.toLowerCase() === "true"

  logger.debug("从localStorage获取Boolean数据=>")
  logger.debug(valueObj)
  // logUtil.logInfo("------------------------------")
  return valueObj
}

/**
 * 获取JSON配置
 * @param key key
 */
export function getJSONConf<T>(key: string): T {
  logger.debug("------------------------------")
  logger.debug("尝试从localStorage获取JSON数据，key=>", key)

  let valueObj = ({} || []) as T
  const value = getConf(key)
  if (value !== "") {
    try {
      valueObj = JSON.parse(value)
    } catch (e) {
      logger.error("JSON格式不正确", e)
      throw e
    }
  }

  logger.debug("从localStorage获取JSON数据=>", valueObj)
  logger.debug("------------------------------")
  return valueObj
}

/**
 * 从字符串解析Object
 * @param objstr Object字符串
 * @author terwer
 * @since 0.6.1
 */
export function parseJSONObj(objstr: string): any {
  logger.debug("------------------------------")
  logger.debug("尝试从JSON字符串解析Object，objstr=>", objstr)

  let valueObj = {}
  const value = objstr
  if (value !== "") {
    try {
      valueObj = JSON.parse(value)
    } catch (e) {
      logger.error("JSON格式不正确，将直接返回{}=>", e)
    }
  }

  logger.debug("从JSON字符串解析Object=>", valueObj)
  logger.debug("------------------------------")
  return valueObj
}

/**
 * 保存配置：这个是所有数据保存的根方法
 * @param key
 * @param value
 */
export const setConf = (key: string, value: string): void => {
  if (!value || value === "") {
    logger.warn("空值，不保存")
    return
  }

  // logUtil.logInfo("尝试保存数据到localStorage里key=>", key)
  // logUtil.logInfo("保存数据到localStorage=>", value)

  const store = getLocalStorageAdaptor()
  store.setItem(key, value)
}

/**
 * 保存Boolean配置
 * @param key
 * @param value
 */
export const setBooleanConf = (key: string, value: boolean): void => {
  // logUtil.logInfo("++++++++++++++++++++++++++++++")
  // logUtil.logInfo("尝试保存Boolean数据到localStorage里key=>", key)
  // logUtil.logInfo("保存Boolean数据到localStorage=>")
  // logUtil.logInfo(value)

  const boolString = value.toString()
  setConf(key, boolString)
  // logUtil.logInfo("++++++++++++++++++++++++++++++")
}

/**
 * 保存JSON配置
 * @param key
 * @param value
 */
export const setJSONConf = <T>(key: string, value: T): void => {
  logger.debug("++++++++++++++++++++++++++++++")
  logger.debug("尝试保存JSON数据到localStorage里key=>", key)
  logger.debug("保存JSON数据到localStorage=>", value)

  const valueString = JSON.stringify(value)
  setConf(key, valueString)
  logger.debug("++++++++++++++++++++++++++++++")
}

/**
 * Object解析为JSON字符串
 * @param value JSON字符串
 */
export const toJSONString = (value: unknown): string => {
  logger.debug("++++++++++++++++++++++++++++++")
  logger.debug("尝试将Object转换为JSON字符串", value)

  const valueString = JSON.stringify(value)
  logger.debug("将Object转换为JSON字符串=>", valueString)
  logger.debug("++++++++++++++++++++++++++++++")
  return valueString
}

/**
 * 检测key是否冲突
 * @param key
 */
export const checkKeyExists = (key: string): boolean => {
  const store = getLocalStorageAdaptor()

  let flag = false

  for (let i = 0; i < store.length; i++) {
    // 获取key 索引从0开始
    const getKey = store.key(i)
    if (key === getKey) {
      flag = true
      break
    }
  }

  return flag
}

/**
 * 获取所有配置数据
 */
export const getAllConf = (): object => {
  const store = getLocalStorageAdaptor()

  // Create an object to store the data from LocalStorage
  const data = {}

  // Iterate over the keys in LocalStorage
  for (let i = 0; i < store.length; i++) {
    // Get the key and value for the current iteration
    const key = store.key(i)
    const value = store.getItem(key)

    // Add the key/value pair to the data object
    data[key] = value
  }

  // Log the data object to the console
  return data
}

/**
 * 下载json文件
 *
 * @param json json字符串
 * @param filename 下载文件名
 */
const downloadFileFromJson = (json: string, filename?: string): void => {
  // Create a new Blob with the JSON string as its contents
  const blob = new Blob([json], { type: "application/json" })

  // Create a download link for the JSON file
  const link = document.createElement("a")
  link.download = filename ?? "data.json"
  link.href = URL.createObjectURL(blob)

  // Add the download link to the page
  document.body.appendChild(link)

  // Click the download link to download the JSON file
  link.click()
}

/**
 * 导出所有配置
 */
export const exportConf = (filename): void => {
  // Get all data from LocalStorage as an object
  const data = getAllConf()

  // Convert the data to a JSON string
  const json = JSON.stringify(data)

  // Download
  downloadFileFromJson(json, filename)
}

/**
 * 导入JSON配置文件到本地
 */
export const importConf = async (): Promise<void> => {
  try {
    await importJSONToLocalStorage()

    ElMessage.success("导入成功")

    reloadPage()
  } catch (e) {
    if (e.toString().indexOf("AbortError") > -1) {
      logger.warn("您取消了导入=>", e)
    } else {
      logger.error("配置文件解析错误=>", e)
      ElMessage.error(appendStr("配置文件解析错误=>", e))
    }
  }
}

/**
 * 清空所有本地存储 <br/>
 * ========================================== <br/>
 * ！！！ 操作之前，请一定做好备份，请谨慎操作！！！<br/>
 * ==========================================
 */
export const clearConf = (): void => {
  const store = getLocalStorageAdaptor()

  // Remove all data from LocalStorage
  store.clear()

  // Check if LocalStorage is empty
  if (store.length === 0) {
    console.log("LocalStorage is empty")
  } else {
    console.log("LocalStorage is not empty")
  }
}

const configUtil = {
  downloadFileFromJson,
}

export default configUtil
