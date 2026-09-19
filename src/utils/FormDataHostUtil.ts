/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import PluginFetchUtil from "~/src/utils/PluginFetchUtil.ts"

/**
 * 插件宿主 FormData / Blob 构造（传输见 formUploadClient）。
 */
class FormDataHostUtil {
  public static canUsePluginFormFetch(appInstance: PublisherAppInstance): boolean {
    return PluginFetchUtil.canUsePluginFetch(appInstance)
  }

  public static getFormData(appInstance: PublisherAppInstance) {
    const win = appInstance.win
    let FormData = win.FormData
    let Blob = win.Blob
    if (win.require) {
      const nfc = win.require(PluginFetchUtil.pluginLibPath(appInstance, "libs/node-fetch-cjs/dist/index.js"))
      FormData = nfc.FormData
      Blob = nfc.Blob
    }

    return {
      FormData,
      Blob,
    }
  }

  public static getFormDataFetch(appInstance: PublisherAppInstance) {
    const win = appInstance.win
    return win.require(PluginFetchUtil.pluginLibPath(appInstance, "libs/zhi-formdata-fetch/index.cjs"))
  }
}

export default FormDataHostUtil
