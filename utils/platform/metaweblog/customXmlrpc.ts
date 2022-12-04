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

import { sendChromeMessage } from "~/utils/otherlib/ChromeUtil"
import { LogFactory } from "~/utils/logUtil"

const logger = LogFactory.getLogger("utils/platform/metaweblog/customXmlrpc.ts")

const Serializer = require("xmlrpc/lib/serializer")
const { XMLParser } = require("fast-xml-parser")
const options = {
  ignoreAttributes: false,
}
const xmlParser = new XMLParser(options)

/**
 * 自定义xmlrpc的请求与解析，解决apache xmlrpc的扩展问题
 * @param apiUrl
 * @param reqMethod
 * @param reqParams
 */
export async function fetchCustom(
  apiUrl: string,
  reqMethod: string,
  reqParams: string[]
): Promise<string> {
  try {
    const methodBodyXml = Serializer.serializeMethodCall(
      reqMethod,
      reqParams,
      "utf8"
    )

    // const response = await fetch(apiUrl, {
    //     method: "POST",
    //     headers: {
    //         "content-type": "text/xml"
    //     },
    //     body: methodBodyXml
    // })

    const fetchCORSParams = {
      method: "POST",
      headers: {
        "content-type": "text/xml",
      },
      body: methodBodyXml,
    }

    const resXml = await sendChromeMessage({
      // 里面的值应该可以自定义，用于判断哪个请求之类的
      type: "fetchChromeXmlrpc",
      apiUrl, // 需要请求的url
      fetchCORSParams,
    })
    logger.debug("fetchChromeXmlrpc resXml=>", resXml)

    let resJson
    if (resXml) {
      const parseResult: any = xmlParser.parse(resXml)
      logger.debug("parseResult=>", parseResult)

      resJson = parseResult.methodResponse || {}
      logger.debug("resJson=>", JSON.stringify(resJson))
    } else {
      resJson = {}
    }

    return resJson
  } catch (e: any) {
    throw new Error(e)
  }
}
