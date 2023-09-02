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

/**
 * CSDN工具类，用于生成UUID和签名
 */
class CsdnUtils {
  public static X_CA_KEY = "203803574"
  public static APP_SECRET = "9znpamsyl2c7cdrr9sas0le9vbc3r6ba"

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
}

export default CsdnUtils
