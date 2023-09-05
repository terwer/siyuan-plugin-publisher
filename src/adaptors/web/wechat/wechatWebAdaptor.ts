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
import { HtmlUtil, JsonUtil, StrUtil } from "zhi-common"
import { Post } from "zhi-blog-api"
import { toRaw } from "vue"
import { isDev } from "~/src/utils/constants.ts"

/**
 * 微信公众号网页授权适配器
 *
 * 仅支持PC客户端
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

  public async addPost(post: Post) {
    return this.editPost("", post)
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    this.logger.debug("editPost get metadata =>", { cfg: toRaw(this.cfg.metadata) })
    let flag = false

    const headers = {
      Cookie: this.cfg.password,
      Referer: "https://mp.weixin.qq.com/cgi-bin/appmsg",
    }

    // formData
    const shortDesc = HtmlUtil.parseHtml(post.shortDesc ?? "", 119, true)
    const params = {
      token: this.cfg.metadata.token,
      lang: "zh_CN",
      ajax: "1",
      AppMsgId: "100000094",
      count: "1",
      data_seq: null,
      operate_from: "Chrome",
      isnew: "0",
      articlenum: "1",
      pre_timesend_set: "0",
      is_finder_video0: "0",
      applyori0: "0",
      can_reward0: "0",
      pay_gifts_count0: "0",
      reward_reply_id0: "",
      related_video0: "",
      is_video_recommend0: "",
      title0: post.title,
      author0: "",
      writerid0: "0",
      fileid0: "",
      digest0: shortDesc,
      auto_gen_digest0: "1",
      content0: post.html,
      sourceurl0: "",
      last_choose_cover_from0: "0",
      need_open_comment0: "1",
      only_fans_can_comment0: "0",
      only_fans_days_can_comment0: "0",
      reply_flag0: "5",
      not_pay_can_comment0: "0",
      open_fansmsg0: "0",
      cdn_url0: "",
      cdn_235_1_url0: "",
      cdn_3_4_url0: "",
      cdn_1_1_url0: "",
      cdn_finder_url0: "",
      cdn_video_url0: "",
      cdn_url_back0: "",
      crop_list0: "",
      app_cover_auto0: "0",
      music_id0: "",
      video_id0: "",
      voteid0: "",
      voteismlt0: "",
      supervoteid0: "",
      cardid0: "",
      cardquantity0: "",
      vid_type0: "",
      show_cover_pic0: "0",
      shortvideofileid0: "",
      copyright_type0: "0",
      is_cartoon_copyright0: "0",
      copyright_img_list0: '{"max_width":578,"img_list":[]}',
      releasefirst0: "",
      platform0: "",
      reprint_permit_type0: "",
      allow_fast_reprint0: "0",
      allow_reprint0: "",
      allow_reprint_modify0: "",
      original_article_type0: "",
      ori_white_list0: "",
      video_ori_status0: "",
      hit_nickname0: "",
      free_content0: "",
      fee0: "0",
      ad_id0: "",
      guide_words0: "",
      is_share_copyright0: "0",
      share_copyright_url0: "",
      source_article_type0: "",
      reprint_recommend_title0: "",
      reprint_recommend_content0: "",
      share_page_type0: "0",
      share_imageinfo0: '{"list":[]}',
      share_video_id0: "",
      dot0: "{}",
      share_voice_id0: "{}",
      share_finder_audio_username0: "",
      share_finder_audio_exportid0: "",
      mmlistenitem_json_buf0: "",
      insert_ad_mode0: "",
      categories_list0: "[]",
      compose_info0: `[{"list":[{"blockIdx":1,"imgList":[],"text":"${shortDesc}"},{"blockIdx":2,"imgList":[],"text":""}]}]`,
      is_pay_subscribe0: "0",
      pay_fee0: "",
      pay_preview_percent0: "",
      pay_desc0: "",
      pay_album_info0: "",
      appmsg_album_info0: '{"appmsg_album_infos":[]}',
      can_insert_ad0: "1",
      audio_info0: '{"audio_infos":[]}',
      danmu_pub_type0_0: "0",
      is_set_sync_to_finder0: "0",
      sync_to_finder_cover0: "0",
      sync_to_finder_cover_source0: "0",
      import_to_finder0: "0",
      import_from_finder_export_id0: "0",
      style_type0: "3",
      sticker_info0:
        '{"is_stickers":0,"common_stickers_num":0,"union_stickers_num":0,"sticker_id_list":[],"has_invalid_sticker":0}',
      new_pic_process0: "0",
      disable_recommend0: "0",
      req: '{"idx_infos":[{"save_old":0,"cps_info":{"cps_import":0}}]}',
      remind_flag: null,
      is_auto_type_setting: "3",
      save_type: "0",
      isneedsave: "0",
    }
    const formData: any = new FormData()
    for (const key in params) {
      formData.append(key, params[key] ?? "")
    }

    const FormdataFetch = this.appInstance.getFormdataFetch()
    const f = new FormdataFetch(isDev)
    const resText = await f.doFetch(
      "https://mp.weixin.qq.com/cgi-bin/operate_appmsg?t=ajax-response&sub=update&type=77&token=" +
        this.cfg.metadata.token +
        "&lang=zh_CN",
      headers,
      formData
    )
    this.logger.debug("resText =>", resText)
    const resJson = JsonUtil.safeParse<any>(resText, {})
    this.logger.debug("resJson =>", resJson)

    if (!resJson.appMsgId) {
      const err = resJson.base_resp
      throw new Error("同步到微信公众号失败，错误内容：" + (err && err.errmsg ? err.errmsg : err.ret))
    }
    flag = true

    return flag
  }
}

export { WechatWebAdaptor }
