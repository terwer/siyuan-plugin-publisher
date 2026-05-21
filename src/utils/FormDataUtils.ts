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

/** 表单上传传输方式（与 JSON 请求的 forceProxy 策略解耦） */
type FormUploadTransport = "plugin-node-fetch" | "siyuan-forward-proxy"

interface FormUploadTransportContext {
  /** 是否处于思源主窗口/挂件/渲染窗口 */
  isInSiyuanOrSiyuanNewWin: boolean
  /**
   * JSON 类请求是否强制走代理。
   * 对 multipart 仅作「无插件直传能力时」的回退条件，不得覆盖插件内 node-fetch。
   */
  forceProxy: boolean
}

/**
 * FormData 工具类
 *
 * @author terwer
 * @version 1.20.2
 * @since 1.20.2
 */
class FormDataUtils {
  /** 插件宿主是否具备 bundled node-fetch 直传 multipart 的能力 */
  public static canUsePluginFormFetch(appInstance: PublisherAppInstance): boolean {
    return PluginFetchUtil.canUsePluginFetch(appInstance)
  }

  /**
   * 选择表单上传传输方式（各平台 webFormFetch / apiFormFetch 共用）。
   *
   * 插件内 multipart 经 forwardProxy + base64 会破坏请求体，故只要有 win.require 就直传。
   */
  public static resolveFormUploadTransport(
    appInstance: PublisherAppInstance,
    context: FormUploadTransportContext
  ): FormUploadTransport {
    if (FormDataUtils.canUsePluginFormFetch(appInstance)) {
      return "plugin-node-fetch"
    }
    if (!context.isInSiyuanOrSiyuanNewWin || context.forceProxy) {
      return "siyuan-forward-proxy"
    }
    return "plugin-node-fetch"
  }

  /**
   * 获取 FormData
   */
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

  /**
   * 获取 FormData fetch
   */
  public static getFormDataFetch(appInstance: PublisherAppInstance) {
    const win = appInstance.win
    const doFetch = win.require(PluginFetchUtil.pluginLibPath(appInstance, "libs/zhi-formdata-fetch/index.cjs"))
    return doFetch
  }
}

export default FormDataUtils
export type { FormUploadTransport, FormUploadTransportContext }
