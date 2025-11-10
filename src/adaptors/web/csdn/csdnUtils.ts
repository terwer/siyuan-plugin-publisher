/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
    const $ = cheerio.load(html, {
      xml: {
        xmlMode: true,
        decodeEntities: false,
      },
    });

    // 选择除了代码块及其子元素之外的所有元素
    $('body').find('*').not('pre, code, pre *, code *').each((index, element) => {
      const $element = $(element);
      const originalHtml = $element.html();

      if (!originalHtml) return;

      // 处理数学公式
      let processedHtml = originalHtml;

      // 处理 $$...$$ 显示公式
      processedHtml = processedHtml.replace(/\$\$([^$]+)\$\$/g, (match, mathContent) => {
        const mathHtml = KatexUtils.renderToString(mathContent.trim());
        return `<span class="katex--display">${mathHtml}</span>`;
      });

      // 处理 $...$ 行内公式
      processedHtml = processedHtml.replace(/\$([^$]+)\$/g, (match, mathContent) => {
        const mathHtml = KatexUtils.renderToString(mathContent.trim());
        return `<span class="katex--inline">${mathHtml}</span>`;
      });

      // 只有当内容发生变化时才更新
      if (processedHtml !== originalHtml) {
        $element.html(processedHtml);
      }
    });

    return $.html();
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
