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

import { LogFactory } from "~/utils/logUtil"
import { XmlRpcValue } from "simple-xmlrpc"
import { fetchMiddleware } from "~/utils/xmlrpc/impl/middlewareXmlrpc"

const logger = LogFactory.getLogger("utils/xmlrpc/impl/chromeXmlrpc.ts")

/**
 * 自定义xmlrpc的请求与解析，通过Chrome发送事件交互
 * @param apiUrl
 * @param reqMethod
 * @param reqParams
 */
async function doChromeFetch(
  apiUrl: string,
  reqMethod: string,
  reqParams: string[]
): Promise<XmlRpcValue> {
  try {
    // const methodBodyXml = serializeMethodCall(reqMethod, reqParams, "utf-8")
    //
    // const fetchCORSParams = {
    //   method: "POST",
    //   headers: {
    //     "content-type": "text/xml",
    //   },
    //   body: methodBodyXml,
    // }
    //
    // let resText = await sendChromeMessage({
    //   // 里面的值应该可以自定义，用于判断哪个请求之类的
    //   type: "fetchChromeXmlrpc",
    //   apiUrl, // 需要请求的url
    //   fetchCORSParams,
    // })
    // // logger.debug("fetchChromeXmlrpc开始，resText=>", resText)
    //
    // let data
    // if (resText) {
    //   resText = XmlrpcUtil.removeXmlHeader(resText)
    //
    //   const deserializer = new Deserializer("utf-8")
    //   data = await deserializer.deserializeMethodResponse(resText)
    //   // logger.debug("fetchChromeXmlrpc结束，data=>", data)
    // }
    return await fetchMiddleware(apiUrl, reqMethod, reqParams)
  } catch (e: any) {
    throw new Error(e)
  }
}

/**
 * 兼容Chrome插件的xmlrpc API
 * @param apiUrl 端点
 * @param reqMethod 方法
 * @param reqParams 参数
 */
export async function fetchChrome(
  apiUrl: string,
  reqMethod: string,
  reqParams: string[]
): Promise<XmlRpcValue> {
  logger.debug("fetchChrome apiUrl=>", apiUrl)

  const fetchCORSParams = {
    reqMethod,
    reqParams,
  }
  logger.debug("fetchChrome fetchCORSParams=>", fetchCORSParams)

  const result = await doChromeFetch(apiUrl, reqMethod, reqParams)
  if (!result || result === "") {
    throw new Error("请求错误或者返回结果为空")
  }
  logger.debug("fetchCustom result=>", result)
  return result
}
