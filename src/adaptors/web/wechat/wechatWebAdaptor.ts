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

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import * as cheerio from "cheerio"
import { StrUtil } from "zhi-common"

/**
 * 掘金网页授权适配器
 *
 * @see [wechatsync wechat adaptor](https://github.com/wechatsync/Wechatsync/blob/master/packages/@wechatsync/drivers/src/weixin.js)
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class WechatWebAdaptor extends BaseWebApi {
  public async getMetaData(): Promise<any> {
    const res = await this.webProxyFetch("https://mp.weixin.qq.com/", [], {}, "GET", "text/html")
    this.logger.debug("WechatWebAdaptor res=>", { res: res })
    const $ = cheerio.load(res)
    const scriptElement = $("script")[0]
    // 获取元素的文本内容
    const scriptText = $(scriptElement).text()
    this.logger.debug("scriptElement =>", { scriptText: scriptText })

    const code = scriptText.substring(scriptText.indexOf("window.wx.commonData"))
    const wx = new Function("window.wx = {}; window.handlerNickname = function(){};" + code + "; return window.wx;")()
    this.logger.debug(code, wx)

    const commonData = Object.assign({}, wx.commonData)
    delete (window as any).wx
    if (!commonData.data.t) {
      throw new Error("微信公众号未登录或者等于过期，请更新cookie")
    }

    const metadata = {
      flag: !StrUtil.isEmptyString(commonData.data.t),
      uid: commonData.data.user_name,
      title: commonData.data.nick_name,
      token: commonData.data.t,
      commonData: commonData,
      avatar: $(".weui-desktop-account__thumb").eq(0).attr("src"),
      type: "weixin",
      supportTypes: ["html"],
      home: "https://mp.weixin.qq.com",
      icon: "https://mp.weixin.qq.com/favicon.ico",
    }
    this.logger.info(`get wechat metadata finished, flag => ${metadata}`)
    return metadata
  }
}

export { WechatWebAdaptor }
