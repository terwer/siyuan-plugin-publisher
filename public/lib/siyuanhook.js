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

// 警告⚠️：请勿在非思源笔记浏览器环境调用此文件中的任何方法

console.warn("从0.6.8+开始，siyuanhook.js将作为统一的hook入口。")

const isSiyuanWidget = () => {
  return (
    window.frameElement != null &&
    window.frameElement.parentElement != null &&
    window.frameElement.parentElement.parentElement != null &&
    window.frameElement.parentElement.parentElement.getAttribute(
      "data-node-id"
    ) !== ""
  )
}

const isSiyuanNewWin = () => {
  return typeof window.terwer !== "undefined"
}

// init
const init = () => {
  // Electron里面有3种情况
  // 1、js片段
  // 2、iframe挂件
  // 3、新窗口打开
  const isElectron = /Electron/.test(navigator.userAgent)
  if (!isElectron) {
    console.warn("不在Electron环境中，插槽菜单、JsonLocalStorage等将不可用")
    return
  }

  // 初始化插槽
  if (isSiyuanWidget()) {
    const slotLibPath = `${parent.window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/siyuan/silot.js`
    console.log("iframe挂件将要从以下位置引入插槽", slotLibPath)
    const initSlot = parent.window.require(slotLibPath)
    initSlot()

    // 初始化发布辅助功能
    const publishHelperLibPath = `${parent.window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/siyuan/publish-helper.js`
    console.log(
      "iframe挂件将要从以下位置引入发布辅助功能",
      publishHelperLibPath
    )
    const initPublishHelper = parent.window.require(publishHelperLibPath)
    initPublishHelper()

    // 挂载JsonLocalStorage到window
    const jsonLocalstorageLibPath = `${parent.window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/json-localstorage/json-localstorage.js`
    console.log(
      "iframe挂件将要从以下位置引入json-localstorage",
      jsonLocalstorageLibPath
    )
    const LocalStorage = parent.window.require(jsonLocalstorageLibPath)
    LocalStorage.init("../../../../storage/syp/")
  } else {
    if (isSiyuanNewWin()) {
      // 挂载JsonLocalStorage到window
      const jsonLocalstorageLibPath = `${window.terwer.dataDir}/widgets/sy-post-publisher/lib/json-localstorage/json-localstorage.js`
      console.log(
        "自定义js片段将要从以下位置引入json-localstorage",
        jsonLocalstorageLibPath
      )
      const LocalStorage = window.require(jsonLocalstorageLibPath)
      // 设置json配置目录
      LocalStorage.init("../../../../storage/syp/")
    } else {
      const slotLibPath = `${window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/siyuan/silot.js`
      console.log("自定义js片段将要从以下位置引入插槽", slotLibPath)
      const initSlot = window.require(slotLibPath)
      initSlot()

      // 初始化发布辅助功能
      const publishHelperLibPath = `${window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/siyuan/publish-helper.js`
      console.log(
        "自定义js片段将要从以下位置引入发布辅助功能",
        publishHelperLibPath
      )
      const initPublishHelper = window.require(publishHelperLibPath)
      initPublishHelper()

      // 挂载JsonLocalStorage到window
      const jsonLocalstorageLibPath = `${parent.window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/json-localstorage/json-localstorage.js`
      console.log(
        "自定义js片段将要从以下位置引入json-localstorage",
        jsonLocalstorageLibPath
      )
      const LocalStorage = window.require(jsonLocalstorageLibPath)
      // 设置json配置目录
      LocalStorage.init("../../../../storage/syp/")
    }
  }
}

// 统一的初始化入口
init()
