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

import { DeviceDetection, DeviceTypeEnum } from "zhi-device"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * 设备检测
 */
export const useSiyuanDevice = () => {
  const logger = createAppLogger("use-siyuan-device")

  const isInSiyuanMainWin = () => {
    const deviceType = DeviceDetection.getDevice()
    const isSiyuanMainWin = deviceType === DeviceTypeEnum.DeviceType_Siyuan_MainWin
    logger.debug("deviceType=>", deviceType)
    logger.debug("isSiyuanMainWin=>", String(isSiyuanMainWin))
    return isSiyuanMainWin
  }

  const isInSiyuanWidget = () => {
    const deviceType = DeviceDetection.getDevice()
    const isSiyuanWidget = deviceType === DeviceTypeEnum.DeviceType_Siyuan_Widget
    logger.debug("deviceType=>", deviceType)
    logger.debug("isSiyuanWidget=>", String(isSiyuanWidget))
    return isSiyuanWidget
  }

  const isInChromeExtension = () => {
    const deviceType = DeviceDetection.getDevice()
    const isChromeExtension = deviceType === DeviceTypeEnum.DeviceType_Chrome_Extension
    logger.debug("deviceType=>", deviceType)
    logger.debug("isChromeExtension=>", String(isChromeExtension))
    return isChromeExtension
  }

  const isInSiyuanOrSiyuanNewWin = () => {
    const deviceType = DeviceDetection.getDevice()
    // 三种情况，主窗口、挂件、新窗口
    const isSiyuanOrSiyuanNewWin =
      deviceType === DeviceTypeEnum.DeviceType_Siyuan_MainWin ||
      deviceType === DeviceTypeEnum.DeviceType_Siyuan_NewWin ||
      deviceType === DeviceTypeEnum.DeviceType_Siyuan_Widget
    logger.debug("deviceType=>", deviceType)
    logger.debug("isSiyuanOrSiyuanNewWin=>", String(isSiyuanOrSiyuanNewWin))
    return isSiyuanOrSiyuanNewWin
  }

  return { isInSiyuanMainWin, isInSiyuanWidget, isInChromeExtension, isInSiyuanOrSiyuanNewWin }
}
