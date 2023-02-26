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

import { LogFactory } from "~/utils/logUtil"
import { getSiyuanCfg } from "~/utils/platform/siyuan/siYuanConfig"
import { XmlRpcValue } from "simple-xmlrpc"
import jsonUtil from "~/utils/jsonUtil"

const logger = LogFactory.getLogger("utils/xmlrpc/impl/middlewareXmlrpc.ts")

/**
 * 请求中转支持浏览器跨域
 * @param apiUrl 端点
 * @param reqMethod 方法
 * @param reqParams 参数
 */
export async function fetchMiddleware(
  apiUrl: string,
  reqMethod: string,
  reqParams: string[]
): Promise<XmlRpcValue> {
  const middlewareUrl = getSiyuanCfg().middlewareUrl
  const middleApiUrl = middlewareUrl + "/xmlrpc"
  logger.debug("apiUrl=>", apiUrl)
  const fetchCORSParams = {
    reqMethod,
    reqParams,
  }
  logger.debug("fetchCORSParams=>", fetchCORSParams)

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

  logger.debug("middleApiUrl=>", middleApiUrl)
  logger.debug("middleFetchOption=>", middleFetchOption)

  const response: Response = await fetch(middleApiUrl, middleFetchOption)
  const resText = await response.text()
  logger.debug("fetchMiddleware结束，resText", resText)

  const ret = jsonUtil.safeParse<any>(resText, [])
  logger.debug("fetchMiddleware结束，resJson", ret)
  if (ret.faultCode) {
    logger.error("代理请求异常，错误信息如下：", ret.faultString)
    throw new Error(ret.faultString)
  }
  return ret
}
