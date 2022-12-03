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
 * Please contact Terwer, Shenzhen, Guangdong, 518000 China
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import logUtil from "~/utils/logUtil"
import { isEmptyObject } from "~/utils/util"

/**
 * 获取Boolean配置
 * @param key key
 */
export function getBooleanConf(key: string): boolean {
  // logUtil.logInfo("------------------------------")
  // logUtil.logInfo("尝试从localStorage获取Boolean数据，key=>", key)

  const value = getConf(key)
  const valueObj: boolean = value.toLowerCase() === "true"

  // logUtil.logInfo("从localStorage获取Boolean数据=>")
  logUtil.logInfo(valueObj)
  // logUtil.logInfo("------------------------------")
  return valueObj
}

/**
 * 获取JSON配置，不建议使用，建议包裹一层存储object
 * @deprecated
 * @param key key
 */
export function getArrayJSONConf<T>(key: string): T {
  let conf: T = getJSONConf<T>(key)
  if (isEmptyObject(conf)) {
    conf = [] as T
  }
  return conf
}

/**
 * 获取JSON配置
 * @param key key
 */
export function getJSONConf<T>(key: string): T {
  // logUtil.logInfo("------------------------------")
  // logUtil.logInfo("尝试从localStorage获取JSON数据，key=>", key)

  let valueObj = ({} || []) as T
  const value = getConf(key)
  if (value !== "") {
    try {
      valueObj = JSON.parse(value)
    } catch (e) {
      logUtil.logError("JSON格式不正确", e)
      throw e
    }
  }

  // logUtil.logInfo("从localStorage获取JSON数据=>")
  logUtil.logInfo(valueObj)
  // logUtil.logInfo("------------------------------")
  return valueObj
}

/**
 * 获取配置：这个是所有数据保存的根方法
 * @param key key
 */
export function getConf(key: string): string {
  // logUtil.logInfo("尝试从localStorage获取数据，key=>", key)

  const value = localStorage.getItem(key)
  if (!value) {
    // logUtil.logInfo("未找到对应数据，key=>", key)
    return ""
  }
  // logUtil.logInfo("从localStorage获取数据=>", value)
  return value
}

/**
 * 保存Boolean配置
 * @param key
 * @param value
 */
export function setBooleanConf(key: string, value: boolean): void {
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
export function setJSONConf<T>(key: string, value: T): void {
  // logUtil.logInfo("++++++++++++++++++++++++++++++")
  // logUtil.logInfo("尝试保存JSON数据到localStorage里key=>", key)
  // logUtil.logInfo("保存JSON数据到localStorage=>")
  // logUtil.logInfo(value)

  const valueString = JSON.stringify(value)
  setConf(key, valueString)
  // logUtil.logInfo("++++++++++++++++++++++++++++++")
}

/**
 * 保存配置：这个是所有数据保存的根方法
 * @param key
 * @param value
 */
export function setConf(key: string, value: string): void {
  if (!value || value === "") {
    logUtil.logWarn("空值，不保存")
    return
  }

  // logUtil.logInfo("尝试保存数据到localStorage里key=>", key)
  // logUtil.logInfo("保存数据到localStorage=>", value)

  localStorage.setItem(key, value)
}

/**
 * 检测key是否冲突
 * @param key
 */
export function checkKeyExists(key: string): boolean {
  let flag = false

  for (let i = 0; i < localStorage.length; i++) {
    // 获取key 索引从0开始
    const getKey = localStorage.key(i)
    if (key === getKey) {
      flag = true
      break
    }
  }

  return flag
}
