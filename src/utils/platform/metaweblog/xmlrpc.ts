/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/strict-boolean-expressions,prefer-const */
import { getWidgetId } from "../siyuan/siyuanUtil"
import logUtil from "../../logUtil"
import { getEnv } from "../../envUtil"
import { fetchNode } from "./nodeXmlrpc"
import { isInChromeExtension } from "../../browser/ChromeUtil"
import { fetchCustom } from "./customXmlrpc"

/**
 * Xmlrpc客户端封装类
 */
export class XmlrpcClient {
  private readonly apiType: string
  private readonly apiUrl: string
  private readonly username: string
  private readonly password: string

  constructor(
    apiType: string,
    apiUrl: string,
    username: string,
    password: string
  ) {
    this.apiType = apiType
    this.apiUrl = apiUrl
    this.username = username
    this.password = password
  }

  /**
   * 请求中转支持浏览器跨域
   * @param apiUrl 端点
   * @param reqMethod 方法
   * @param reqParams 参数
   */
  private async fetchCORS(
    apiUrl: string,
    reqMethod: string,
    reqParams: string[]
  ): Promise<string> {
    const middleWareUrl = getEnv("VITE_MIDDLEWARE_URL") ?? "/api/middleware"
    const middleApiUrl = middleWareUrl + "/xmlrpc"
    logUtil.logInfo("apiUrl=>")
    logUtil.logInfo(apiUrl)
    const fetchCORSParams = {
      reqMethod,
      reqParams,
    }
    logUtil.logInfo("fetchCORSParams=>")
    logUtil.logInfo(fetchCORSParams)

    const data = {
      fetchParams: {
        apiUrl,
        fetchCORSParams,
      },
    }

    const middleFetchOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }

    logUtil.logInfo("middleApiUrl=>")
    logUtil.logInfo(middleApiUrl)
    logUtil.logInfo("middleFetchOption=>")
    logUtil.logInfo(middleFetchOption)

    const response: Response = await fetch(middleApiUrl, middleFetchOption)
    return await response.text()
  }

  /**
   * 兼容Chrome插件的xmlrpc API
   * @param apiUrl 端点
   * @param reqMethod 方法
   * @param reqParams 参数
   */
  private async fetchChromeCORS(
    apiUrl: string,
    reqMethod: string,
    reqParams: string[]
  ): Promise<string> {
    let result
    logUtil.logInfo("fetchChrome apiUrl=>")
    logUtil.logInfo(apiUrl)

    const fetchCORSParams = {
      reqMethod,
      reqParams,
    }
    logUtil.logInfo("fetchChrome fetchCORSParams=>")
    logUtil.logInfo(fetchCORSParams)

    result = await fetchCustom(apiUrl, reqMethod, reqParams)
    if (!result || result === "") {
      throw new Error("请求错误或者返回结果为空")
    }
    logUtil.logInfo("fetchCustom result=>", result)

    // const resText = await chrome.runtime.sendMessage({
    //     // 里面的值应该可以自定义，用于判断哪个请求之类的
    //     type: 'fetchChromeXmlrpc',
    //     apiUrl: apiUrl, // 需要请求的url
    //     fetchCORSParams: fetchCORSParams
    // });
    return result
  }

  /**
   * 同时兼容浏览器和思源宿主环境的xmlrpc API
   * @param apiUrl 端点
   * @param reqMethod 方法
   * @param reqParams 参数数组
   */
  private async fetchXmlrpc(
    apiUrl: string,
    reqMethod: string,
    reqParams: string[]
  ) {
    let result

    const widgetResult = getWidgetId()
    if (widgetResult.isInSiyuan) {
      logUtil.logInfo("当前处于挂件模式，使用electron的fetch获取数据")
      // 不解析了，直接使用Node兼容调用
      // result = await fetchElectron(apiUrl, reqMethod, reqParams)
      result = await fetchNode(apiUrl, reqMethod, reqParams)
    } else if (isInChromeExtension()) {
      logUtil.logInfo("当前处于Chrome插件中，需要模拟fetch解决CORS跨域问题")
      result = await this.fetchChromeCORS(apiUrl, reqMethod, reqParams)
    } else {
      logUtil.logInfo("当前处于非挂件模式，已开启请求代理解决CORS跨域问题")
      result = await this.fetchCORS(apiUrl, reqMethod, reqParams)
    }

    if (result === "") {
      throw new Error("请求错误或者返回结果为空")
    }

    logUtil.logInfo("最终返回给前端的数据=>", result)

    return result
  }

  /**
   * xmlrpc统一调用入口
   * @param reqMethod 方法
   * @param reqMarams 参数
   */
  public async methodCallEntry(reqMethod: string, reqMarams: any[]) {
    const result = await this.fetchXmlrpc(this.apiUrl, reqMethod, reqMarams)
    logUtil.logInfo("请求结果，result=>")
    logUtil.logInfo(result)
    return result
  }
}

/**
 * Xmlrpc服务器封装类
 */
// export class XmlrpcServer {
//
// }
