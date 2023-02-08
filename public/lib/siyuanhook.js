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

// 警告1⚠️：请勿在非思源笔记浏览器环境调用此文件中的任何方法
// 警告2⚠️：此文件请勿引用其他任何需要编译的类库
// 提示3⚠️：此文件是挂件唯一的hook入口

console.warn("从0.6.8+开始，siyuanhook.js将作为统一的hook入口。")

/**
 * 是否是Electron环境，等价于isInSiyuanOrSiyuanNewWin
 */
const isElectron = /Electron/.test(navigator.userAgent)

/**
 * 思源笔记或者思源笔记新窗口，等价于Electron环境
 */
const isInSiyuanOrSiyuanNewWin = () => {
  return isElectron
}

/**
 * 思源笔记Iframe挂件环境
 */
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

/**
 * 思源笔记新窗口
 */
const isSiyuanNewWin = () => {
  return typeof window.terwer !== "undefined"
}

/**
 * 获取可操作的Window
 */
const getSiyuanWindow = () => {
  if (!isInSiyuanOrSiyuanNewWin()) {
    return window
  }

  if (isSiyuanWidget()) {
    return parent.window
  } else {
    return window
  }
}

/**
 * 获取新窗口数据目录
 */
const getSiyuanNewWinDataDir = () => {
  return window.terwer.dataDir ?? "/notfound"
}

/**
 * 获取数据目录
 */
export const getSiyuanDataDir = () => {
  const syWin = getSiyuanWindow()

  if (isSiyuanWidget()) {
    return syWin.siyuan.config.system.dataDir
  } else {
    if (isSiyuanNewWin()) {
      return getSiyuanNewWinDataDir()
    } else {
      return syWin.siyuan.config.system.dataDir
    }
  }
}

/**
 * 获取跨平台的配置文件路径
 */
const getCrossPlatformAppDataFolder = () => {
  const syWin = getSiyuanWindow()
  const path = syWin.require("path")

  let configFilePath
  if (process.platform === "darwin") {
    configFilePath = path.join(process.env.HOME, "/Library/Application Support")
  } else if (process.platform === "win32") {
    configFilePath = path.join(process.env.APPDATA, "Roaming")
  } else if (process.platform === "linux") {
    configFilePath = process.env.HOME
  }

  return configFilePath
}

/**
 * 引入依赖
 *
 * @param entryName 运行模式名称
 * @param libpath 依赖全路径
 * @param alias 依赖别名
 * @author terwer
 * @since 0.7.0
 */
const requireLib = (entryName, libpath, alias) => {
  const syWin = getSiyuanWindow()
  console.log(entryName + "将要从以下位置引入" + alias, libpath)
  return syWin.require(libpath)
}

// 初始化方法统一定义
const initMethods = {
  /**
   * 初始化 sy-post-publisher 配置文件存储，适用于【iframe挂件模式】、【新窗口模式】以及【js片段模式】
   */
  initLocalStorageMethod: (entryName) => {
    const syWin = getSiyuanWindow()
    const dataDir = getSiyuanDataDir()

    // 挂载JsonLocalStorage到window
    const LocalStorage = requireLib(
      entryName,
      `${dataDir}/widgets/sy-post-publisher/lib/json-localstorage/json-localstorage.js`,
      "json-localstorage"
    )
    LocalStorage.init("../../../../storage/syp/")
  },

  /**
   * 初始化插槽，仅【iframe挂件模式】、【自定义js片段模式】可用
   * @param entryName 入口名称
   */
  initSlotMethod: (entryName) => {
    const syWin = getSiyuanWindow()

    // 初始化插槽
    const initSlot = requireLib(
      entryName,
      `${syWin.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/siyuan/silot.js`,
      "插槽"
    )
    initSlot()
  },

  /**
   * 初始化主题适配，仅【iframe挂件模式】可用
   * @param entryName 入口名称
   */
  initThemeAdaptor: (entryName) => {
    const syWin = getSiyuanWindow()

    // 初始化主题适配
    const initTheme = requireLib(
      entryName,
      `${syWin.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/siyuan/theme.js`,
      "自定义主题片段"
    )
    setTimeout(initTheme, 1000)
  },
}

// iframe挂件
const initIframeWidaget = () => {
  // 挂载JsonLocalStorage到window
  initMethods.initLocalStorageMethod("iframe挂件")

  // 初始化插槽
  initMethods.initSlotMethod("iframe挂件")

  // 初始化主题适配
  initMethods.initThemeAdaptor("iframe挂件")

  // // 挂载PicGO到window
  // const syPicgoLibPath = `${parent.window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/picgo/picgo.js`
  // console.log("iframe挂件将要从以下位置引入sy-picgo", syPicgoLibPath)
  // const picgoExtension = parent.window.require(syPicgoLibPath).default
  // // PicGO存储到配置目录，便于后面插件
  // const path = parent.window.require("path")
  // const appDataFolder = getCrossPlatformAppDataFolder(path)
  // // const picgo_cfg_070 = `${parent.window.siyuan.config.system.dataDir}/storage/syp/picgo/picgo.cfg.json`
  // const picgo_cfg_067 = `${parent.window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/picgo/picgo.cfg.json`
  // const picgo_cfg_070 = path.join(appDataFolder, "sy-picgo", "picgo.cfg.json")
  // const fs = parent.window.require("fs")
  // if (fs.existsSync(picgo_cfg_067) && !fs.existsSync(picgo_cfg_070)) {
  //   console.warn("检测到旧的PicGO配置文件，启动迁移")
  //   fs.copySync(picgo_cfg_067, picgo_cfg_070)
  // }
  // picgoExtension.initPicgo(picgo_cfg_070)
  //
  // // 初始化发布辅助功能
  // const publishHelperLibPath = `${parent.window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/siyuan/publish-helper.js`
  // console.log("iframe挂件将要从以下位置引入发布辅助功能", publishHelperLibPath)
  // const initPublishHelper = parent.window.require(publishHelperLibPath)
  // initPublishHelper()
  //
}

// 新窗口打开
const initSiyuanNewWin = () => {
  // 挂载JsonLocalStorage到window
  initMethods.initLocalStorageMethod("思源笔记新窗口")

  // // 挂载PicGO到window
  // const syPicgoLibPath = `${window.terwer.dataDir}/widgets/sy-post-publisher/lib/picgo/picgo.js`
  // console.log("思源笔记新窗口将要从以下位置引入sy-picgo", syPicgoLibPath)
  // const picgoExtension = window.require(syPicgoLibPath).default
  // // PicGO存储到配置目录，便于后面插件
  // const path = window.require("path")
  // const appDataFolder = getCrossPlatformAppDataFolder(path)
  // // const picgo_cfg_070 = `${window.terwer.dataDir}/storage/syp/picgo/picgo.cfg.json`
  // const picgo_cfg_067 = `${window.terwer.dataDir}/widgets/sy-post-publisher/lib/picgo/picgo.cfg.json`
  // const picgo_cfg_070 = path.join(appDataFolder, "sy-picgo", "picgo.cfg.json")
  // const fs = window.require("fs")
  // if (fs.existsSync(picgo_cfg_067)) {
  //   fs.copySync(picgo_cfg_067, picgo_cfg_070)
  // }
  // picgoExtension.initPicgo(picgo_cfg_070)
}

// js片段
const initJsCode = () => {
  // 挂载JsonLocalStorage到window
  initMethods.initLocalStorageMethod("自定义js片段")

  // 初始化插槽
  initMethods.initSlotMethod("iframe挂件")

  // // 挂载PicGO到window
  // const syPicgoLibPath = `${window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/picgo/picgo.js`
  // console.log("自定义js片段将要从以下位置引入sy-picgo", syPicgoLibPath)
  // const picgoExtension = window.require(syPicgoLibPath).default
  // // PicGO存储到配置目录，便于后面插件
  // const path = window.require("path")
  // const appDataFolder = getCrossPlatformAppDataFolder(path)
  // // const picgo_cfg_070 = `${window.siyuan.config.system.dataDir}/storage/syp/picgo/picgo.cfg.json`
  // const picgo_cfg_067 = `${window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/picgo/picgo.cfg.json`
  // const picgo_cfg_070 = path.join(appDataFolder, "sy-picgo", "picgo.cfg.json")
  // const fs = window.require("fs")
  // if (fs.existsSync(picgo_cfg_067)) {
  //   fs.copySync(picgo_cfg_067, picgo_cfg_070)
  // }
  // picgoExtension.initPicgo(picgo_cfg_070)
  //
  // // 初始化发布辅助功能
  // const publishHelperLibPath = `${window.siyuan.config.system.dataDir}/widgets/sy-post-publisher/lib/siyuan/publish-helper.js`
  // console.log(
  //   "自定义js片段将要从以下位置引入发布辅助功能",
  //   publishHelperLibPath
  // )
  // const initPublishHelper = window.require(publishHelperLibPath)
  // initPublishHelper()
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

  if (isSiyuanWidget()) {
    // iframe挂件
    initIframeWidaget()
  } else {
    if (isSiyuanNewWin()) {
      // 新窗口打开
      initSiyuanNewWin()
    } else {
      // 自定义js片段
      initJsCode()
    }
  }
}

// 统一的初始化入口
init()
