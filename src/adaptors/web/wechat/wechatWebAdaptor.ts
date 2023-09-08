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
import { HtmlUtil, JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { BlogConfig, PageTypeEnum, Post, UserBlog } from "zhi-blog-api"
import { toRaw } from "vue"
import _ from "lodash"
import { SiyuanDevice } from "zhi-device"
import { fileToBuffer } from "~/src/utils/polyfillUtils.ts"
import { CategoryAIResult } from "~/src/utils/ai/prompt.ts"

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
      throw new Error("微信公众号未登录或者登录过期，请更新cookie")
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

  public async getUsersBlogs(): Promise<Array<UserBlog>> {
    let result: UserBlog[] = []

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
      throw new Error("微信公众号未登录或者登录过期，请更新cookie")
    }
    this.logger.info(`get wechat commonData =>`, commonData)
    const userblog: UserBlog = new UserBlog()
    userblog.blogid = commonData.data.user_name
    userblog.blogName = commonData.data.nick_name
    result.push(userblog)

    this.logger.debug("getUsersBlogs=>", result)
    return result
  }

  public async addPost(post: Post) {
    this.logger.debug("addPost get metadata =>", { cfg: toRaw(this.cfg.metadata) })

    const url =
      "https://mp.weixin.qq.com/cgi-bin/operate_appmsg?t=ajax-response&sub=create&type=77&token=" +
      this.cfg.metadata.token +
      "&lang=zh_CN"
    const shortDesc = HtmlUtil.parseHtml(post.shortDesc ?? "", 119, true)
    const params = {
      token: this.cfg.metadata.token,
      lang: "zh_CN",
      f: "json",
      ajax: "1",
      random: Math.random(),
      AppMsgId: "",
      count: "1",
      data_seq: null,
      operate_from: "Chrome",
      isnew: "0",
      autosave_log: "true",
      articlenum: "1",
      pre_timesend_set: "0",
      is_finder_video0: "0",
      finder_draft_id0: "0",
      applyori0: "0",
      ad_video_transition0: "",
      can_reward0: "0",
      pay_gifts_count0: "0",
      reward_reply_id0: "",
      related_video0: "",
      is_video_recommend0: "-1",
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
      cdn_16_9_url0: "",
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
      cardlimit0: "",
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
      share_voice_id0: "",
      share_finder_audio_username0: "",
      share_finder_audio_exportid0: "",
      mmlistenitem_json_buf0: "",
      insert_ad_mode0: "",
      categories_list0: "[]",
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
      sync_to_finder_cover0: "",
      sync_to_finder_cover_source0: "",
      import_to_finder0: "0",
      import_from_finder_export_id0: "",
      style_type0: "3",
      sticker_info0:
        '{"is_stickers":0,"common_stickers_num":0,"union_stickers_num":0,"sticker_id_list":[],"has_invalid_sticker":0}',
      new_pic_process0: "0",
      disable_recommend0: "0",
      req: '{"idx_infos":[{"save_old":0,"cps_info":{"cps_import":0}}]}',
      is_auto_type_setting: "3",
      save_type: "1",
      isneedsave: "0",
    }
    const resJson = await this.wechatFetch(url, params)

    if (!resJson.appMsgId) {
      const err = resJson.base_resp
      throw new Error("同步到微信公众号失败，错误内容：" + (err && err.errmsg ? err.errmsg : err.ret))
    }

    return {
      status: "success",
      post_id: resJson.appMsgId.toString(),
    }
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    this.logger.debug("editPost get metadata =>", { cfg: toRaw(this.cfg.metadata) })
    let flag = false
    const url =
      "https://mp.weixin.qq.com/cgi-bin/operate_appmsg?t=ajax-response&sub=update&type=77&token=" +
      this.cfg.metadata.token +
      "&lang=zh_CN"
    const shortDesc = HtmlUtil.parseHtml(post.shortDesc ?? "", 119, true)
    const appMsgId = postid
    const params = {
      token: this.cfg.metadata.token,
      lang: "zh_CN",
      f: "json",
      ajax: "1",
      random: Math.random(),
      AppMsgId: appMsgId,
      count: "1",
      data_seq: null,
      operate_from: "Chrome",
      isnew: "0",
      autosave_log: "true",
      articlenum: "1",
      pre_timesend_set: "0",
      is_finder_video0: "0",
      finder_draft_id0: "0",
      applyori0: "0",
      ad_video_transition0: "",
      can_reward0: "0",
      pay_gifts_count0: "0",
      reward_reply_id0: "",
      related_video0: "",
      is_video_recommend0: "-1",
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
      reply_flag0: "5",
      not_pay_can_comment0: "0",
      open_fansmsg0: "0",
      cdn_url0: "",
      cdn_235_1_url0: "",
      cdn_16_9_url0: "",
      cdn_3_4_url0: "",
      cdn_1_1_url0: "",
      cdn_finder_url0: "",
      cdn_video_url0: "",
      cdn_url_back0: "",
      crop_list0: "",
      app_cover_auto0: "0",
      music_id0: "",
      voteid0: "",
      voteismlt0: "",
      supervoteid0: "",
      cardid0: "",
      cardquantity0: "",
      cardlimit0: "",
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
      share_voice_id0: "",
      share_finder_audio_username0: "",
      share_finder_audio_exportid0: "",
      mmlistenitem_json_buf0: "",
      insert_ad_mode0: "",
      categories_list0: "[]",
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
      sync_to_finder_cover0: "",
      sync_to_finder_cover_source0: "",
      import_to_finder0: "0",
      import_from_finder_export_id0: "",
      style_type0: "3",
      sticker_info0:
        '{"is_stickers":0,"common_stickers_num":0,"union_stickers_num":0,"sticker_id_list":[],"has_invalid_sticker":0}',
      new_pic_process0: "0",
      disable_recommend0: "0",
      req: '{"idx_infos":[{"save_old":0,"cps_info":{"cps_import":0}}]}',
      is_auto_type_setting: "3",
      save_type: "1",
      isneedsave: "0",
    }
    const resJson = await this.wechatFetch(url, params)

    if (!resJson.appMsgId) {
      const err = resJson.base_resp
      throw new Error("同步到微信公众号失败，错误内容：" + (err && err.errmsg ? err.errmsg : err.ret))
    }
    flag = true

    return flag
  }

  public async getPost(postid: string): Promise<Post> {
    const token = this.cfg.metadata.token
    const url = `https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77&appmsgid=${postid}&token=${token}&lang=zh_CN`
    const res = await this.webProxyFetch(url, [], {}, "GET", "text/html")
    this.logger.debug("get wechat post finished, res=>", res)

    const post = new Post()

    const $ = cheerio.load(res)
    // 使用正则表达式查找infos = {} 并提取JSON
    const scriptText = $("html").html() || ""

    const match = scriptText.match(/infos\s*=\s*({.*?}},)/)
    if (match && match[1]) {
      const infoJSON = match[1].replace(/,$/, "")
      this.logger.debug(`matched infoJSON ${typeof infoJSON} =>`, infoJSON)
      try {
        const info = JsonUtil.safeParse<any>(infoJSON, {} as any)
        if (!ObjectUtil.isEmptyObject(info)) {
          this.logger.debug("found infos =>", info)
          const curItem = info.item.find((item: any) => item.app_id.toString() === postid)
          this.logger.debug("curItem =>", curItem)

          post.title = curItem.title
          post.shortDesc = curItem.digest
          // post.html = curItem.content
        }
      } catch (e) {
        this.logger.error("微信公众号JSON解析错误", e)
      }
    } else {
      this.logger.error("微信公众号未找到infos = {}},")
    }

    return post
  }

  public async deletePost(postid: string): Promise<boolean> {
    let flag = false

    const url = "https://mp.weixin.qq.com/cgi-bin/operate_appmsg?sub=del&t=ajax-response"
    const params = {
      token: this.cfg.metadata.token,
      lang: "zh_CN",
      f: "json",
      ajax: "1",
      AppMsgId: postid,
    }
    const resJson = await this.wechatFetch(url, params)

    if (!resJson.appMsgId) {
      const err = resJson.base_resp
      throw new Error("微信公众号文章删除失败，错误内容：" + (err && err.errmsg ? err.errmsg : err.ret))
    }
    this.logger.debug("delete wechat article res=>", resJson)
    flag = true

    return flag
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const token = this.cfg.metadata.token
    return `https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77&appmsgid=${postid}&token=${token}&lang=zh_CN`
  }

  public async uploadFile(file: File | Blob, filename?: string): Promise<any> {
    this.logger.debug(`wechat start uploadFile ${filename}=>`, file)
    if (file instanceof Blob) {
      // import
      const win = this.appInstance.win
      if (!win.require) {
        throw new Error("非常抱歉，目前仅思源笔记PC客户端支持上传图片")
      }
      const { FormData, Blob } = win.require(`${this.appInstance.moduleBase}libs/node-fetch-cjs/dist/index.js`)

      // uploadUrl
      const ticket_id = this.cfg.metadata.commonData.data.user_name
      const ticket = this.cfg.metadata.commonData.data.ticket
      const svr_time = this.cfg.metadata.commonData.data.time
      const token = this.cfg.metadata.commonData.data.t
      const seq = new Date().getTime()
      const uploadUrl =
        `https://mp.weixin.qq.com/cgi-bin/filetransfer?action=upload_material&f=json&scene=8&writetype=doublewrite&groupid=1` +
        `&ticket_id=${ticket_id}&ticket=${ticket}&svr_time=${svr_time}&token=${token}&lang=zh_CN&seq=${seq}&t=` +
        Math.random()

      // 获取图片二进制数据
      // const fs = win.require("fs")
      // const fileData = fs.readFileSync("/Users/terwer/Documents/pictures/3259282.jpeg")
      // const blob = new Blob([fileData], { type: "image/jpeg" })
      const bits = await fileToBuffer(file)
      const blob = new Blob([bits], { type: file.type })

      // formData
      const formData: any = new FormData()
      formData.append("type", file.type)
      formData.append("id", new Date().getTime())
      formData.append("name", filename)
      formData.append("lastModifiedDate", new Date().toString())
      formData.append("size", file.size)
      formData.append("file", blob, filename)

      // 发送请求
      const resJson = await this.wechatFormFetch(uploadUrl, formData)
      if (resJson.base_resp.err_msg != "ok") {
        this.logger.error(`微信公众号图片上传失败, ${filename} =>`, resJson.base_resp.err_msg)
        throw new Error("upload failed =>" + resJson.base_resp.err_msg)
      }
      const url = resJson.cdn_url

      return {
        id: resJson.content,
        object_key: resJson.content,
        url: url,
      }
    }

    return {}
  }

  public override async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    // 公共的属性预处理
    const doc = await super.preEditPost(post, id, publishCfg)

    // 微信公众号自定义的处理
    const cfg: BlogConfig = publishCfg?.cfg
    const updatedPost = _.cloneDeep(doc) as Post
    const html = updatedPost.html
    this.logger.info("准备处理微信公众号正文")
    this.logger.debug("html =>", { html: html })
    let updatedHtml = html

    updatedPost.html = updatedHtml
    this.logger.info("微信公众号正文处理完毕")
    this.logger.debug("updatedHtml =>", { updatedHtml: updatedHtml })

    // 发布格式
    if (cfg?.pageType == PageTypeEnum.Markdown) {
      post.description = post.markdown
    } else {
      post.description = post.html
    }

    return updatedPost
  }

  // ================
  // private methods
  // ================
  /**
   * 以异步方式从微信获取数据
   *
   * @param url - 请求的URL
   * @param params - 请求参数
   * @returns 返回包含微信数据的Promise
   */
  private async wechatFetch(url: string, params: Record<string, any>) {
    this.logger.debug("before getFormdataFetch, params =>", params)

    // formData
    const formData: any = new FormData()
    for (const key in params) {
      formData.append(key, params[key] ?? "")
    }

    return this.wechatFormFetch(url, formData)
  }

  private async wechatFormFetch(url: string, formData: FormData) {
    // header
    const header = {
      Cookie: this.cfg.password,
      Referer: "https://mp.weixin.qq.com/cgi-bin/appmsg",
    }

    const resJson = await this.webFormFetch(url, [header], formData)
    return resJson
  }
}

export { WechatWebAdaptor }
