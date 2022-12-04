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
import { METAWEBLOG_METHOD_CONSTANTS } from "~/utils/constants/metaweblogMethodConstants"
import { UserBlog } from "~/utils/common/userBlog"

const logger = LogFactory.getLogger(
  "utils/platform/metaweblog/electronXmlrpc.ts"
)

// 序列化
const xmlSerializer = require("xmlrpc/lib/serializer")

// 反序列化
// this.xmlDeserializer = require('xmlrpc/lib/deserializer')
// this.xmlParser = require('xml2json');
// const {XMLParser} = require('fast-xml-parser');
// const options = {
//     ignoreAttributes: true,
//     ignoreDeclaration: true,
//     ignorePiTags: true
// };
// const xmlParser = new XMLParser(options);
const Parser = require("xml2js").Parser
const xmlParser = new Parser({})

/**
 * @deprecated The method should not be used, use `fetchNode` instead which no need to parse xml yourself
 * @param apiUrl
 * @param reqMethod
 * @param reqParams
 */
export async function fetchElectron(
  apiUrl: string,
  reqMethod: string,
  reqParams: string[]
): Promise<string> {
  const methodBody = xmlSerializer.serializeMethodCall(
    reqMethod,
    reqParams,
    "utf8"
  )
  logger.debug("apiUrl=>", apiUrl)
  logger.debug("methodBody=>", methodBody)

  const fetchOption = {
    method: "POST",
    body: methodBody,
    headers: {
      "Content-Type": "text/xml",
    },
  }
  const response: Response = await fetch(apiUrl, fetchOption)
  const reqXml = await response.text()
  logger.debug("reqXml=>", reqXml)

  // 反序列化xml为合法json字符串

  // 这个有问题，xml2json也不够兼容，改成fast-xml-parser
  // const deserializer = new this.xmlDeserializer("utf8")
  // const desData = await new Promise((resolve, reject) => {
  //     deserializer.deserializeMethodResponse(response, function (err: any, result: any) {
  //         if (err) {
  //             reject(err)
  //         }
  //         resolve(result)
  //     })
  // })
  // logger.debug(desData)

  // xml2json也不行
  // const parseResult = JSON.parse(this.xmlParser.toJson(reqXml)) || {}

  // fast-xml-parser
  // xmlParser.parse(reqXml);

  // xml2js
  const parseResult = await xmlParser.parseStringPromise(reqXml)
  logger.debug("尝试获取反序列结果=>", parseResult)

  let jsonResult: any = {}
  switch (reqMethod) {
    // 博客信息
    case METAWEBLOG_METHOD_CONSTANTS.GET_USERS_BLOGS: {
      const usersBlogs = parseGetUsersBlogs(parseResult)
      logger.debug("GetUsersBlogs组装完成准备返回=>", usersBlogs)
      jsonResult = JSON.stringify(usersBlogs)
      break
    }
    default:
      break
  }

  // result = JSON.stringify(jsonResult)
  return jsonResult
}

/**
 * 解析博客信息
 * @param parseResult
 */
function parseGetUsersBlogs(parseResult: any): UserBlog[] {
  const usersBlogs: UserBlog[] = []

  const methodResponse = parseResult.methodResponse
  const resValues =
    methodResponse.params.param.value.array.data.value.struct.member
  logger.debug("解析GetUsersBlogs，resValues=>", resValues)

  const userBlog = new UserBlog()
  for (let i = 0; i < resValues.length; i++) {
    const item = resValues[i]
    const itemKey = item.name
    // cnblogs=>item.value.string
    // jvue || item.value
    const itemValue = item.value.string || item.value

    if (itemKey === "blogid") {
      userBlog.blogid = itemValue
    } else if (itemKey === "url") {
      userBlog.url = itemValue
    } else if (itemKey === "blogName") {
      userBlog.blogName = itemValue
    }
  }
  usersBlogs.push(userBlog)

  return usersBlogs
}
