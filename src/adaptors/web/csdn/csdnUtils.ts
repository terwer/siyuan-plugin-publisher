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

import Utf8 from "crypto-js/enc-utf8"
import CryptoJS from "crypto-js"
import Base64 from "crypto-js/enc-base64"
import * as cheerio from "cheerio"
import KatexUtils from "~/src/utils/katexUtils.ts"
import { LEGENCY_SHARED_API } from "~/src/utils/constants.ts"
import { CsdnWebAdaptor } from "~/src/adaptors/web/csdn/csdnWebAdaptor.ts"

/**
 * CSDN工具类，用于生成UUID和签名
 */
class CsdnUtils {
  public static X_CA_KEY = "203803574"
  public static X_CA_KEY_MEDIA = "260196572"
  public static APP_SECRET = "9znpamsyl2c7cdrr9sas0le9vbc3r6ba"
  public static APP_SECRET_MEDIA = "t5PaqxVQpWoHgLGt7XPIvd5ipJcwJTU7"

  /**
   * 生成UUID
   *
   * @returns 返回生成的UUID
   */
  public static generateXCaNonce(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
      const t = (16 * Math.random()) | 0,
        n = "x" === e ? t : (3 & t) | 8
      return n.toString(16)
    })
  }

  /**
   * 获取签名
   *
   * @param url - 请求URL
   * @param method - HTTP方法
   * @param accept - Accept头
   * @param uuid - UUID
   * @param content_type - Content-Type
   * @returns 返回签名
   */
  public static generateXCaSignature(
    url: string,
    method: string,
    accept: string,
    uuid: string,
    content_type: string
  ): string {
    // https://github.com/brix/crypto-js/issues/189
    // https://www.npmjs.com/package/crypto-js
    const s = new URL(url)
    const ekey = Utf8.parse(CsdnUtils.APP_SECRET)
    let toEnc: string
    if (method === "GET") {
      const path = s.pathname + s.search
      toEnc = `GET\n${accept}\n\n${content_type}\n\nx-ca-key:${CsdnUtils.X_CA_KEY}\nx-ca-nonce:${uuid}\n${path}`
    } else {
      const path = s.pathname
      toEnc = `POST\n${accept}\n\n${content_type}\n\nx-ca-key:${CsdnUtils.X_CA_KEY}\nx-ca-nonce:${uuid}\n${path}`
    }
    const hmac = CryptoJS.HmacSHA256(toEnc, ekey)
    const sign = Base64.stringify(hmac)
    // console.log(uuid)
    // console.log(sign)
    return sign
  }

  /**
   * 获取签名
   *
   * @param url - 请求URL
   * @param method - HTTP方法
   * @param accept - Accept头
   * @param uuid - UUID
   * @param content_type - Content-Type
   * @param timestamp - 时间戳
   * @returns 返回签名
   */
  public static generateXCaSignatureForMedia(
    url: string,
    method: string,
    accept: string,
    uuid: string,
    content_type: string,
    timestamp: string
  ): string {
    // https://github.com/brix/crypto-js/issues/189
    // https://www.npmjs.com/package/crypto-js
    const s = new URL(url)
    const ekey = Utf8.parse(CsdnUtils.APP_SECRET_MEDIA)
    let toEnc: string
    if (method === "GET") {
      const path = s.pathname + s.search
      toEnc = `GET\n${accept}\n\n${content_type}\n\nx-ca-key:${CsdnUtils.X_CA_KEY_MEDIA}\nx-ca-nonce:${uuid}\nx-ca-timestamp:${timestamp}\n${path}`
    } else {
      const path = s.pathname
      toEnc = `POST\n${accept}\n\n${content_type}\n\nx-ca-key:${CsdnUtils.X_CA_KEY_MEDIA}\nx-ca-nonce:${uuid}\nx-ca-timestamp:${timestamp}\n${path}`
    }
    const hmac = CryptoJS.HmacSHA256(toEnc, ekey)
    const sign = Base64.stringify(hmac)
    // console.log(uuid)
    // console.log(sign)
    return sign
  }

  public static processCsdnMath(html: string): string {
    // 使用Cheerio加载HTML
    const $ = cheerio.load(html, {
      xml: {
        xmlMode: true,
        decodeEntities: false,
      },
    })

    // 处理两个$符号包裹的公式
    const doubleDollarRegex = /\$\$([^$]+)\$\$/g
    $("*:not(pre)").each((index, element) => {
      const content = $(element).html()
      const newContent = content.replace(doubleDollarRegex, (match, mathContent) => {
        const mathHtml = KatexUtils.renderToString(mathContent)
        return `<span class="katex--display">${mathHtml}</span>`
      })
      $(element).html(newContent)
    })

    // 处理一个$符号包裹的公式
    const singleDollarRegex = /\$([^$]+)\$/g
    $("*:not(pre)").each((index, element) => {
      const content = $(element).html()
      const newContent = content.replace(singleDollarRegex, (match, mathContent) => {
        const mathHtml = KatexUtils.renderToString(mathContent)
        return `<span class="katex--inline">${mathHtml}</span>`
      })
      $(element).html(newContent)
    })

    // 输出修改后的HTML
    return $.html()
  }

  /**
   * 处理代码高亮
   * https://spencersnyder.io/blog/prism-js-with-next-js
   *
   * @param adaptorInstance
   * @param html
   */
  public static async processPrismjs(adaptorInstance: CsdnWebAdaptor, html: string): Promise<string> {
    const apiUrl = `${LEGENCY_SHARED_API}/prismjs`
    // const apiUrl = `http://localhost:3000/api/prismjs`
    const contentType = "application/json"
    const headers = {
      "Content-Type": contentType,
    }
    const params = JSON.stringify({
      html: html,
    })
    const res = await adaptorInstance.webFetch(apiUrl, [headers], params, "POST", contentType, false)
    console.log("processPrismjs res=>", res)

    return res.html
  }
}

export default CsdnUtils
