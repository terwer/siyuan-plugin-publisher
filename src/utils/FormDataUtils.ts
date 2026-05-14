/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"

/**
 * FormData 工具类
 *
 * @author terwer
 * @version 1.20.2
 * @since 1.20.2
 */
class FormDataUtils {
  private static pluginLibPath(appInstance: PublisherAppInstance, relativePath: string) {
    return `${appInstance.moduleBase}${relativePath}`
  }

  /**
   * 获取 FormData
   */
  public static getFormData(appInstance: PublisherAppInstance) {
    const win = appInstance.win
    let FormData = win.FormData
    let Blob = win.Blob
    if (win.require) {
      const nfc = win.require(this.pluginLibPath(appInstance, "libs/node-fetch-cjs/dist/index.js"))
      FormData = nfc.FormData
      Blob = nfc.Blob
    }

    return {
      FormData,
      Blob,
    }
  }

  /**
   * 获取 FormData fetch
   */
  public static getFormDataFetch(appInstance: PublisherAppInstance) {
    const win = appInstance.win
    const doFetch = win.require(this.pluginLibPath(appInstance, "libs/zhi-formdata-fetch/index.cjs"))
    return doFetch
  }
}

export default FormDataUtils
