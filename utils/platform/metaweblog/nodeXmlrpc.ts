/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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

const logger = LogFactory.getLogger("utils/platform/metaweblog/nodeXmlrpc.ts")

const xmlrpc = require("xmlrpc")

export async function fetchNode(
  apiUrl: string,
  reqMethod: string,
  reqParams: string[]
): Promise<string> {
  let client

  const secure = apiUrl.includes("https:")
  if (secure) {
    client = xmlrpc.createSecureClient(apiUrl)
  } else {
    client = xmlrpc.createClient(apiUrl)
  }

  try {
    logger.debug("methodCallDirectNode开始")
    logger.debug("xmlrpcNodeParams.reqMethod=>", reqMethod)
    logger.debug("xmlrpcNodeParams.reqParams=>", reqParams)
    const data = await methodCallDirectNode(client, reqMethod, reqParams)
    const dataJson = JSON.stringify(data)
    return dataJson
  } catch (e) {
    logger.error(e)
    throw new Error("请求处理异常")
  }
}

// xmlrpc
/*
 * Makes an XML-RPC call to the server and returns a Promise.
 * @param {String} methodName - The method name.
 * @param {Array} params      - Params to send in the call.
 * @return {Promise<Object|Error>}
 */
async function methodCallDirectNode(
  client: any,
  methodName: string,
  params: any
): Promise<any> {
  return await new Promise(function (resolve, reject) {
    client.methodCall(methodName, params, function (error: any, data: any) {
      if (!error) {
        logger.debug("resolve=>", data)
        resolve(data)
      } else {
        reject(error)
      }
    })
  })
}
