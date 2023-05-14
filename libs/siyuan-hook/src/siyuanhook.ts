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

// 警告1⚠️：请勿在非思源笔记浏览器环境调用此文件中的任何方法
// 警告2⚠️：此文件请勿引用其他任何需要编译的类库
// 提示3⚠️：此文件是挂件唯一的hook入口

import { PublishHook, DeviceDetection, BrowserUtil, DeviceTypeEnum } from "@terwer/publisher-hook"

// 统一的初始化入口
;(async () => {
  console.warn(
    "从 0.6.8+ 开始，siyuanhook.js 将作为挂件统一的 hook 入口。" +
      "当前 siyuanhook.js 源码已迁移至：https://github.com/terwer/siyuan-plugin-publisher/tree/main/libs/siyuan-hook 统一管理。"
  )
  try {
    const device = DeviceDetection.getDevice()
    const publisherHook = new PublishHook()

    // init
    const init = async () => {
      // Electron里面有3种情况
      // 1、js片段
      // 2、iframe挂件
      // 3、新窗口打开
      const isElectron = BrowserUtil.isElectron()
      if (!isElectron) {
        console.warn("不在Electron环境中，插槽菜单、JsonLocalStorage等将不可用")
        return
      }

      // iframe挂件
      const initIframeWidget = () => {
        publisherHook.doInit({
          // 挂载JsonLocalStorage到window
          isInitLocalStorage: true,
          // 初始化插槽
          isInitSlot: true,
          // 初始化主题适配
          isInitThemeAdaptor: true,
          // 初始化发布辅助功能
          isInitPublishHelper: true,
          // 初始化PicGO配置
          isInitPicgoExtension: true,
          // 初始化SyCmd配置
          isInitCmder: true,
        })
      }

      // 新窗口打开
      const initSiyuanNewWin = () => {
        publisherHook.doInit({
          // 挂载JsonLocalStorage到window
          isInitLocalStorage: true,
          // 初始化发布辅助功能
          isInitPublishHelper: true,
          // 初始化PicGO配置
          isInitPicgoExtension: true,
          // 初始化SyCmd配置
          isInitCmder: true,
        })
      }

      // js片段
      const initJsCode = () => {
        publisherHook.doInit({
          // 挂载JsonLocalStorage到window
          isInitLocalStorage: true,
          // 初始化插槽
          isInitSlot: true,
          // 初始化主题适配
          isInitThemeAdaptor: true,
          // 初始化发布辅助功能
          isInitPublishHelper: true,
          // 初始化PicGO配置
          isInitPicgoExtension: true,
          // 初始化SyCmd配置
          isInitCmder: true,
        })
      }

      if (device == DeviceTypeEnum.DeviceType_Siyuan_Widget) {
        // iframe挂件
        initIframeWidget()
      } else {
        if (device == DeviceTypeEnum.DeviceType_Siyuan_NewWin) {
          // 新窗口打开
          initSiyuanNewWin()
        } else {
          // 自定义js片段
          initJsCode()
        }
      }
    }

    // 启动入口
    await init()
  } catch (e) {
    console.warn("初始化siyuanhook失败，可能导致扩展功能无法使用，请知悉。错误信息如下", e)
  }
})()
