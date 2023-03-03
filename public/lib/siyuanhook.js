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
  if (isSiyuanWidget()) {
    return parent.window
  } else {
    if (isSiyuanNewWin()) {
      return window
    }
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

    // 防止重复挂载
    if (syWin.JsonLocalStorage) {
      console.warn("JsonLocalStorage已挂载，忽略", entryName)
      return
    }

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
    const dataDir = getSiyuanDataDir()

    // 初始化插槽
    const initSlot = requireLib(
      entryName,
      `${dataDir}/widgets/sy-post-publisher/lib/siyuan/silot.js`,
      "插槽"
    )
    initSlot()
  },

  /**
   * 初始化主题适配，仅【iframe挂件模式】、【自定义js片段模式】可用
   * @param entryName 入口名称
   */
  initThemeAdaptor: (entryName) => {
    const syWin = getSiyuanWindow()
    const dataDir = getSiyuanDataDir()

    // 防止重复挂载
    if (syWin.customstyle) {
      console.warn("customstyle已挂载，忽略", entryName)
      return
    }

    // 初始化主题适配
    const initTheme = requireLib(
      entryName,
      `${dataDir}/widgets/sy-post-publisher/lib/siyuan/theme.js`,
      "自定义主题片段"
    )
    setTimeout(initTheme, 3000)
  },

  /**
   * 初始化初始化发布辅助功能，仅【iframe挂件模式】、【自定义js片段模式】可用
   * @param entryName 入口名称
   */
  initPublishHelper: (entryName) => {
    const syWin = getSiyuanWindow()
    const dataDir = getSiyuanDataDir()

    // 防止重复挂载
    if (syWin.syp) {
      console.warn("syp已挂载，忽略", entryName)
      return
    }

    // 初始化发布辅助功能
    const initPublishHelper = requireLib(
      entryName,
      `${dataDir}/widgets/sy-post-publisher/lib/siyuan/publish-helper.js`,
      "发布辅助功能"
    )
    initPublishHelper()
  },

  /**
   * 初始化 PicGO 配置，适用于【iframe挂件模式】、【新窗口模式】以及【js片段模式】
   * @param entryName 入口名称
   */
  initPicgoExtension: (entryName) => {
    const syWin = getSiyuanWindow()
    const dataDir = getSiyuanDataDir()
    console.log("initPicgoExtension=>", dataDir)
    console.log("syWin=>", syWin)

    // 防止重复挂载
    if (syWin.SyPicgo) {
      console.warn("SyPicgo已挂载，忽略", entryName)
      return
    }

    // 挂载PicGO到window
    const picgoExtension = requireLib(
      entryName,
      `${dataDir}/widgets/sy-post-publisher/lib/picgo/syPicgo.js`,
      "sy-picgo"
    ).default

    // PicGO存储到配置目录，便于后面插件
    const appDataFolder = picgoExtension.getCrossPlatformAppDataFolder()
    console.log("appDataFolder=>", appDataFolder)

    const picgo_cfg_067 = `${dataDir}/widgets/sy-post-publisher/lib/picgo/picgo.cfg.json`
    const picgo_cfg_folder_070 = picgoExtension.joinPath(
      appDataFolder,
      "sy-picgo"
    )
    const picgo_cfg_070 = "picgo.cfg.json"
    picgoExtension.upgradeCfg(
      picgo_cfg_067,
      picgo_cfg_folder_070,
      picgo_cfg_070
    )
    console.warn("PicGO配置文件初始化为=>", picgo_cfg_070)

    // 初始化
    const syPicgo = picgoExtension.initPicgo(picgo_cfg_070)
    syWin.SyPicgo = syPicgo
    console.log("syPicgo=>", syPicgo)
  },

  /**
   * 初始化 SyCmd 配置，适用于【iframe挂件模式】、【新窗口模式】以及【js片段模式】
   * @param entryName 入口名称
   */
  initCmder: (entryName) => {
    const syWin = getSiyuanWindow()
    const dataDir = getSiyuanDataDir()

    // 防止重复挂载
    if (syWin.SyCmd) {
      console.warn("SyCmd已挂载，忽略", entryName)
      return
    }

    // 挂载SyCmd到window
    const syCmd = requireLib(
      entryName,
      `${dataDir}/widgets/sy-post-publisher/lib/cmd/syCmd.js`,
      "sy-cmd"
    )
    syWin.SyCmd = syCmd
    console.log("syCmd=>", syCmd)
  },
}

// iframe挂件
const initIframeWidaget = () => {
  // 挂载JsonLocalStorage到window
  initMethods.initLocalStorageMethod("iframe挂件")

  // 初始化插槽
  // initMethods.initSlotMethod("iframe挂件")

  // 初始化主题适配
  initMethods.initThemeAdaptor("iframe挂件")

  // 初始化发布辅助功能
  initMethods.initPublishHelper("iframe挂件")

  // 初始化PicGO配置
  initMethods.initPicgoExtension("iframe挂件")

  // 初始化SyCmd配置
  initMethods.initCmder("iframe挂件")
}

// 新窗口打开
const initSiyuanNewWin = () => {
  // 挂载JsonLocalStorage到window
  initMethods.initLocalStorageMethod("思源笔记新窗口")

  // 初始化发布辅助功能
  initMethods.initPublishHelper("思源笔记新窗口")

  // 初始化PicGO配置
  initMethods.initPicgoExtension("思源笔记新窗口")

  // 初始化SyCmd配置
  initMethods.initCmder("思源笔记新窗口")
}

// js片段
const initJsCode = () => {
  // 挂载JsonLocalStorage到window
  initMethods.initLocalStorageMethod("自定义js片段")

  // 初始化插槽
  initMethods.initSlotMethod("自定义js片段")

  // 初始化主题适配
  initMethods.initThemeAdaptor("自定义js片段")

  // 初始化发布辅助功能
  initMethods.initPublishHelper("自定义js片段")

  // 初始化PicGO配置
  initMethods.initPicgoExtension("自定义js片段")

  // 初始化SyCmd配置
  initMethods.initCmder("自定义js片段")
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
try {
  init()
} catch (e) {
  console.warn(
    "初始化siyuanhook失败，可能导致扩展功能无法使用，请知悉。错误信息如下",
    e
  )
}
