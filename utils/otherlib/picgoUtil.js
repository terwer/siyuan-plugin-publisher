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

import { PicGoUploadApi } from "~/utils/platform/picgo/picGoUploadApi"
import { isInSiyuanOrSiyuanNewWin } from "~/utils/platform/siyuan/siyuanUtil"
import idUtil from "~/utils/idUtil"
import strUtil from "~/utils/strUtil"
import siyuanBrowserUtil from "~/utils/otherlib/siyuanBrowserUtil"

// Pico上传Api封装
const picGoUploadApi = new PicGoUploadApi()

/**
 * 获取当前可用图床
 *
 * @author terwer
 * @since 0.7.0
 */
const getPicBeds = () => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin.SyPicgo.getPicgoObj()

  const picBedTypes = picgo.helper.uploader.getIdList()
  const picBedFromDB = picgo.getConfig("picBed.list") || []
  const picBeds = picBedTypes
    .map((item) => {
      const visible = picBedFromDB.find((i) => i.type === item) // object or undefined
      return {
        type: item,
        name: picgo.helper.uploader.get(item).name || item,
        visible: visible ? visible.visible : true,
      }
    })
    .sort((a) => {
      if (a.type === "github") {
        return -1
      }
      return 0
    })

  // console.warn("获取支持的图床类型：", picBeds)
  return picBeds
}

/**
 * 获取PicGO配置的通用方法
 * @param key key
 */
const getPicgoConfig = (key = undefined) => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin.SyPicgo.getPicgoObj()

  return picgo.getConfig(key)
}

/**
 * 保存配置到PicGO的通用方法
 *
 * @author terwer
 * @since 0.7.0
 *
 * @param _config IObj | string
 * @param value ?: any
 */
const savePicgoConfig = (_config, value = "") => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin.SyPicgo.getPicgoObj()

  let config
  if (typeof _config === "string") {
    config = {
      [_config]: value,
    }
  } else {
    config = strUtil.getRawData(_config)
  }

  picgo.saveConfig(config)
  console.log("savePicgoConfig finished.")
}

/**
 * 通过PicGO上传图片
 * @returns {Promise<any[]>}
 */
const uploadByPicGO = async (input) => {
  // 通过PicGO上传图片
  if (input) {
    if (isInSiyuanOrSiyuanNewWin()) {
      const syWin = siyuanBrowserUtil.getSiyuanWindow()
      const syPicgo = syWin.SyPicgo
      return syPicgo.upload(input)
    } else {
      // HTTP调用本地客户端上传
      return picGoUploadApi.upload(input)
    }
  } else {
    // 通过PicGO上传剪贴板图片
    if (isInSiyuanOrSiyuanNewWin()) {
      const syWin = siyuanBrowserUtil.getSiyuanWindow()
      const syPicgo = syWin.SyPicgo
      return syPicgo.uploadFormClipboard()
    } else {
      // HTTP调用本地客户端上传
      return picGoUploadApi.upload()
    }
  }
}

/**
 * 配置处理
 * @param config 配置
 */
const handleConfigWithFunction = (config) => {
  for (const i in config) {
    if (typeof config[i].default === "function") {
      config[i].default = config[i].default()
    }
    if (typeof config[i].choices === "function") {
      config[i].choices = config[i].choices()
    }
  }
  return config
}

/**
 * 增加配置元数据
 *
 * @param originData 原始数据
 */
const completeUploaderMetaConfig = (originData) => {
  return Object.assign(
    {
      _configName: "Default",
    },
    strUtil.trimValues(originData),
    {
      _id: idUtil.newUuid(),
      _createdAt: Date.now(),
      _updatedAt: Date.now(),
    }
  )
}

/**
 * get picbed config by type，获取的是表单属性详细信息
 *
 * it will trigger the uploader config function & get the uploader config result
 * & not just read from
 *
 * @author terwer
 * @since 0.7.0
 */
export const getPicBedConfig = (type) => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin.SyPicgo.getPicgoObj()

  const name = picgo.helper.uploader.get(type)?.name || type
  if (picgo.helper.uploader.get(type)?.config) {
    const _config = picgo.helper.uploader.get(type).config(picgo)
    const config = handleConfigWithFunction(_config)
    return {
      config,
      name,
    }
  } else {
    return {
      config: [],
      name,
    }
  }
}

/**
 * upgrade old uploader config to new format
 *
 * @param type type
 * @author terwer
 * @since 0.7.0
 */
const upgradeUploaderConfig = (type) => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin.SyPicgo.getPicgoObj()

  const uploaderConfig = picgo.getConfig(`picBed.${type}`) ?? {}
  if (!uploaderConfig._id) {
    Object.assign(uploaderConfig, completeUploaderMetaConfig(uploaderConfig))
  }

  const uploaderConfigList = [uploaderConfig]
  picgo.saveConfig({
    [`uploader.${type}`]: {
      configList: uploaderConfigList,
      defaultId: uploaderConfig._id,
    },
    [`picBed.${type}`]: uploaderConfig,
  })
  return {
    configList: uploaderConfigList,
    defaultId: uploaderConfig._id,
  }
}

/**
 * 获取上传配置列表
 *
 * @param type 图床类型
 * @author terwer
 * @since 0.7.0
 */
const getUploaderConfigList = (type) => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin.SyPicgo.getPicgoObj()

  if (!type) {
    return {
      configList: [],
      defaultId: "",
    }
  }
  const currentUploaderConfig = picgo.getConfig(`uploader.${type}`) ?? {}
  let configList = currentUploaderConfig.configList
  let defaultId = currentUploaderConfig.defaultId || ""
  if (!configList) {
    const res = upgradeUploaderConfig(type)
    configList = res.configList
    defaultId = res.defaultId
  }

  const configItem = {
    configList,
    defaultId,
  }
  // console.warn("获取当前图床配置列表：", configItem)
  return configItem
}

/**
 * 切换当前上传图床
 *
 * @param type 图床类型
 * @param config 图床配置
 * @param id 配置id
 */
const changeCurrentUploader = (type, config, id) => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin.SyPicgo.getPicgoObj()

  if (!type) {
    return
  }
  if (id) {
    picgo.saveConfig({
      [`uploader.${type}.defaultId`]: id,
    })
  }
  if (config) {
    picgo.saveConfig({
      [`picBed.${type}`]: config,
    })
  }
  picgo.saveConfig({
    "picBed.current": type,
    "picBed.uploader": type,
  })
}

/**
 * 选择当前图床
 *
 * @param type 当前图床类型
 * @param id 当前图床配置ID
 * @author terwer
 * @since 0.7.0
 */
const selectUploaderConfig = (type, id) => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin.SyPicgo.getPicgoObj()

  const { configList } = getUploaderConfigList(type)
  const config = configList.find((item) => item._id === id)
  if (config) {
    picgo.saveConfig({
      [`uploader.${type}.defaultId`]: id,
      [`picBed.${type}`]: config,
    })
  }

  return config
}

/**
 * 更新图床配置
 *
 * @param type 图床类型
 * @param id 图床配置ID
 * @param config 图床配置
 * @author terwer
 * @since 0.7.0
 */
export const updateUploaderConfig = (type, id, config) => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin.SyPicgo.getPicgoObj()

  const { configList, defaultId } = getUploaderConfigList(type)
  const existConfig = configList.find((item) => item._id === id)
  let updatedConfig
  let updatedDefaultId = defaultId
  if (existConfig) {
    updatedConfig = Object.assign(existConfig, strUtil.trimValues(config), {
      _updatedAt: Date.now(),
    })
  } else {
    updatedConfig = completeUploaderMetaConfig(config)
    updatedDefaultId = updatedConfig._id
    configList.push(updatedConfig)
  }
  picgo.saveConfig({
    [`uploader.${type}.configList`]: configList,
    [`uploader.${type}.defaultId`]: updatedDefaultId,
    [`picBed.${type}`]: updatedConfig,
  })
}

/**
 * delete uploader config by type & id
 */
export const deleteUploaderConfig = (type, id) => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin.SyPicgo.getPicgoObj()

  const { configList, defaultId } = getUploaderConfigList(type)
  if (configList.length <= 1) {
    return
  }
  let newDefaultId = defaultId
  const updatedConfigList = configList.filter((item) => item._id !== id)
  if (id === defaultId) {
    newDefaultId = updatedConfigList[0]._id
    changeCurrentUploader(type, updatedConfigList[0], updatedConfigList[0]._id)
  }
  picgo.saveConfig({
    [`uploader.${type}.configList`]: updatedConfigList,
  })
  return {
    configList: updatedConfigList,
    defaultId: newDefaultId,
  }
}

/**
 * PicGO配置根路径
 */
const getPicgoBasedir = () => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin?.SyPicgo?.getPicgoObj()

  if (!picgo) {
    return "[PicGO未挂载]"
  }

  return picgo.baseDir
}

/**
 * PicGO配置文件路径
 */
const getPicgoCfgPath = () => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const picgo = syWin?.SyPicgo?.getPicgoObj()

  if (!picgo) {
    return "[PicGO未挂载]"
  }

  return picgo.configPath
}

/**
 * 获取配置文件
 * @param filename 文件名
 */
const getPicgoCfgFile = (filename) => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const syPicgo = syWin?.SyPicgo
  const picgo = syPicgo?.getPicgoObj()

  if (!picgo) {
    return "[PicGO未挂载]"
  }

  return syPicgo.combinePath(picgo.baseDir, filename)
}

const ipcHandleImportLocalPlugin = () => {
  const syWin = siyuanBrowserUtil.getSiyuanWindow()
  const syPicgo = syWin?.SyPicgo

  syPicgo.ipcMethods.handleImportLocalPlugin()
}

/**
 * PicGO相关操作统一访问入口
 */
const picgoUtil = {
  // config
  getPicgoConfig,
  savePicgoConfig,

  // form
  getPicBedConfig,

  // uploader
  getPicBeds,
  getUploaderConfigList,
  selectUploaderConfig,
  changeCurrentUploader,
  deleteUploaderConfig,
  updateUploaderConfig,

  // upload
  uploadByPicGO,

  // /Users/terwer/Library/Application Support/sy-picgo/
  getPicgoBasedir,
  // /Users/terwer/Library/Application Support/sy-picgo/picgo.cfg.json
  getPicgoCfgPath,
  // /Users/terwer/Library/Application Support/sy-picgo/[filename]
  getPicgoCfgFile,

  // Ipc
  ipcHandleImportLocalPlugin,
}
export default picgoUtil
