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
import { Post } from "zhi-blog-api"
import { toRaw } from "vue"
import fetch from "cross-fetch"
import { SiyuanDevice } from "zhi-device"

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

  private async importDeps() {
    const CdepPath = process.env.APP_BASE + "libs/fetch-blob/index.js"
    this.logger.info("will import lib from =>", CdepPath)
    const C = (await import(CdepPath)).Blob
    this.logger.info("C =>", C)

    const FdepPath = process.env.APP_BASE + "libs/fetch-blob/file.js"
    this.logger.info("will import lib from =>", FdepPath)
    const F = (await import(FdepPath)).File
    this.logger.info("F =>", F)

    var { toStringTag: t, iterator: i, hasInstance: h } = Symbol,
      r = Math.random,
      m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","),
      f = (a, b, c) => (
        (a += ""),
        /^(Blob|File)$/.test(b && b[t])
          ? [
              ((c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob"), a),
              b.name !== c || b[t] == "blob" ? new F([b], c, b) : b,
            ]
          : [a, b + ""]
      ),
      e = (c, f) =>
        (f ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"),
      x = (n, a, e) => {
        if (a.length < e) {
          throw new TypeError(
            `Failed to execute '${n}' on 'FormData': ${e} arguments required, but only ${a.length} present.`
          )
        }
      }

    const FormData = class FormData {
      #d = []
      constructor(...a) {
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`)
      }
      get [t]() {
        return "FormData"
      }
      [i]() {
        return this.entries()
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m) => typeof o[m] != "function")
      }
      append(...a) {
        x("append", arguments, 2)
        // @ts-expect-error
        this.#d.push(f(...a))
      }
      delete(a) {
        x("delete", arguments, 1)
        a += ""
        this.#d = this.#d.filter(([b]) => b !== a)
      }
      get(a) {
        x("get", arguments, 1)
        a += ""
        for (var b = this.#d, l = b.length, c = 0; c < l; c++) if (b[c][0] === a) return b[c][1]
        return null
      }
      getAll(a, b) {
        x("getAll", arguments, 1)
        b = []
        a += ""
        this.#d.forEach((c) => c[0] === a && b.push(c[1]))
        return b
      }
      has(a) {
        x("has", arguments, 1)
        a += ""
        return this.#d.some((b) => b[0] === a)
      }
      forEach(a, b) {
        x("forEach", arguments, 1)
        // @ts-expect-error
        for (var [c, d] of this) a.call(b, d, c, this)
      }
      set(...a) {
        x("set", arguments, 2)
        var b = [],
          c = !0
        // @ts-expect-error
        a = f(...a)
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d)
        })
        c && b.push(a)
        this.#d = b
      }
      *entries() {
        yield* this.#d
      }
      *keys() {
        // @ts-expect-error
        for (var [a] of this) yield a
      }
      *values() {
        // @ts-expect-error
        for (var [, a] of this) yield a
      }
    }

    const escape = (str, filename?: any) =>
      (filename ? str : str.replace(/\r?\n|\r/g, "\r\n"))
        .replace(/\n/g, "%0A")
        .replace(/\r/g, "%0D")
        .replace(/"/g, "%22")

    const formDataToBlob = (formData, B = C) => {
      const boundary = "----formdata-polyfill-" + Math.random()
      const chunks = []
      const prefix = `--${boundary}\r\nContent-Disposition: form-data; name="`

      for (let [name, value] of formData) {
        if (typeof value === "string") {
          chunks.push(prefix + escape(name) + `"\r\n\r\n${value.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r\n`)
        } else {
          chunks.push(
            prefix +
              escape(name) +
              `"; filename="${escape(value.name, 1)}"\r\n` +
              `Content-Type: ${value.type || "application/octet-stream"}\r\n\r\n`,
            value,
            "\r\n"
          )
        }
      }

      chunks.push(`--${boundary}--`)

      return new B(chunks, {
        type: "multipart/form-data; boundary=" + boundary,
      })
    }

    const win = SiyuanDevice.siyuanWindow()
    const { Readable } = win.require("node:stream")
    return {
      FormData,
      formDataToBlob,
      Readable,
    }
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    this.logger.debug("editPost get metadata =>", { cfg: toRaw(this.cfg.metadata) })

    const { FormData, formDataToBlob, Readable } = await this.importDeps()
    const params = {
      token: "308984077",
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
      title0: "发的方法二二个人",
      author0: "",
      writerid0: "0",
      fileid0: "",
      digest0: "二二特瑞特人太热2",
      auto_gen_digest0: "1",
      content0:
        '<p>二二特瑞特人太热2<br></p><p style="display: none;"><mp-style-type data-value="3"></mp-style-type></p>',
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
      compose_info0:
        '[{"list":[{"blockIdx":1,"imgList":[],"text":"二二特瑞特人太热"},{"blockIdx":2,"imgList":[],"text":""}]}]',
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

    const headers = {
      Cookie:
        "appmsglist_action_3268318127=card; tvfe_boss_uuid=5aca0247863ffd7f; pgv_pvid=1230046178; RK=+IPt9hVoUK; ptcz=5d62577d410b74e5dddd7b49138945b3f04ffef2bba9e68b1899f30417490fb8; qq_domain_video_guid_verify=4ce5bceade41a21a; eas_sid=6176U847N6G0u678w3b0U6C8c2; ua_id=Sr9IRZcBjwtRfuIQAAAAAEqe3z164__LemPCGGxz39Q=; wxuin=93718861356390; uuid=f3991a5936dbf4d247f4fddd372751d0; rand_info=CAESICYBdhtIsu9Bh+vse1Eoav2QZInGZ921y1LJlGvuoDL6; slave_bizuin=3268318127; data_bizuin=3244402339; bizuin=3268318127; data_ticket=Ct2GTz9gO3g4Vo9/sq8i0QZWdBoi+MlFbPucSBnUc0Bh5ZErdefLQQrgV00yo/2q; slave_sid=U05reFpxSWNnMXV0SXBmQmliSUd2V3lLdTVjYVEzUGtMaDExcFpWYkRxR1Vpdk9JZWZzOVQ1Y0RBT1g1dnBOWkdRSUZlOFRuYWhuN0hlQkdFRDdJMHdwcUpBZzVrSll4Nm9zSDd5ZXRQenFpNm14am5VRmp1dXJOcGNKUmFTWWN0SW9SM25lTGN0ZVNyYUM3; slave_user=gh_31fc44821625; xid=f3b8ee500e1a9425c1b3369674201d79; mm_lang=zh_CN; sig_login=h019bc926f0995c15e2fbccfb9c1d0c06378f638784d58732399c6273b983b6fafb12d9599f3c071c53; _clck=3268318127|1|feq|0; _clsk=1azv73g|1693796563927|4|1|mp.weixin.qq.com/weheat-agent/payload/record",
      Referer:
        "https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77&appmsgid=100000094&token=308984077&lang=zh_CN",
    }

    try {
      const blob: any = formDataToBlob(formData)
      const stream = Readable.from(blob.stream())
      const h = {
        ...headers,
        ...formData.headers,
        "Content-Length": blob.size,
        "Content-Type": blob.type,
      }

      console.log("h =>", h)

      const response: any = await fetch(
        "https://mp.weixin.qq.com/cgi-bin/operate_appmsg?t=ajax-response&sub=update&type=77&token=",
        {
          method: "POST",
          headers: h,
          body: stream as any,
        }
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.text()
      console.log(data)
    } catch (error) {
      console.error("Error:", error)
    }

    // const url =
    //   "https://mp.weixin.qq.com/cgi-bin/operate_appmsg?t=ajax-response&sub=update&type=77&token=" +
    //   this.cfg.metadata.token +
    //   "&lang=zh_CN"
    // const header = {
    //   "content-type": undefined,
    //   cookie:
    //     "appmsglist_action_3268318127=card; tvfe_boss_uuid=5aca0247863ffd7f; pgv_pvid=1230046178; RK=+IPt9hVoUK; ptcz=5d62577d410b74e5dddd7b49138945b3f04ffef2bba9e68b1899f30417490fb8; qq_domain_video_guid_verify=4ce5bceade41a21a; eas_sid=6176U847N6G0u678w3b0U6C8c2; ua_id=Sr9IRZcBjwtRfuIQAAAAAEqe3z164__LemPCGGxz39Q=; wxuin=93718861356390; uuid=f3991a5936dbf4d247f4fddd372751d0; rand_info=CAESICYBdhtIsu9Bh+vse1Eoav2QZInGZ921y1LJlGvuoDL6; slave_bizuin=3268318127; data_bizuin=3244402339; bizuin=3268318127; data_ticket=Ct2GTz9gO3g4Vo9/sq8i0QZWdBoi+MlFbPucSBnUc0Bh5ZErdefLQQrgV00yo/2q; slave_sid=U05reFpxSWNnMXV0SXBmQmliSUd2V3lLdTVjYVEzUGtMaDExcFpWYkRxR1Vpdk9JZWZzOVQ1Y0RBT1g1dnBOWkdRSUZlOFRuYWhuN0hlQkdFRDdJMHdwcUpBZzVrSll4Nm9zSDd5ZXRQenFpNm14am5VRmp1dXJOcGNKUmFTWWN0SW9SM25lTGN0ZVNyYUM3; slave_user=gh_31fc44821625; xid=f3b8ee500e1a9425c1b3369674201d79; mm_lang=zh_CN; sig_login=h019bc926f0995c15e2fbccfb9c1d0c06378f638784d58732399c6273b983b6fafb12d9599f3c071c53; _clck=3268318127|1|feq|0; _clsk=1azv73g|1693796563927|4|1|mp.weixin.qq.com/weheat-agent/payload/record",
    //   referer:
    //     "https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77&appmsgid=100000094&token=308984077&lang=zh_CN",
    // }
    // const params = {
    //   token: this.cfg.metadata.token,
    //   lang: "zh_CN",
    //   ajax: "1",
    //   AppMsgId: "100000094",
    //   count: "1",
    //   data_seq: null,
    //   operate_from: "Chrome",
    //   isnew: "0",
    //   articlenum: "1",
    //   pre_timesend_set: "0",
    //   is_finder_video0: "0",
    //   applyori0: "0",
    //   can_reward0: "0",
    //   pay_gifts_count0: "0",
    //   reward_reply_id0: "",
    //   related_video0: "",
    //   is_video_recommend0: "",
    //   title0: "发的方法二二个人",
    //   author0: "",
    //   writerid0: "0",
    //   fileid0: "",
    //   digest0: "二二特瑞特人太热2",
    //   auto_gen_digest0: "1",
    //   content0:
    //     '<p>二二特瑞特人太热2<br></p><p style="display: none;"><mp-style-type data-value="3"></mp-style-type></p>',
    //   sourceurl0: "",
    //   last_choose_cover_from0: "0",
    //   need_open_comment0: "1",
    //   only_fans_can_comment0: "0",
    //   only_fans_days_can_comment0: "0",
    //   reply_flag0: "5",
    //   not_pay_can_comment0: "0",
    //   open_fansmsg0: "0",
    //   cdn_url0: "",
    //   cdn_235_1_url0: "",
    //   cdn_3_4_url0: "",
    //   cdn_1_1_url0: "",
    //   cdn_finder_url0: "",
    //   cdn_video_url0: "",
    //   cdn_url_back0: "",
    //   crop_list0: "",
    //   app_cover_auto0: "0",
    //   music_id0: "",
    //   video_id0: "",
    //   voteid0: "",
    //   voteismlt0: "",
    //   supervoteid0: "",
    //   cardid0: "",
    //   cardquantity0: "",
    //   vid_type0: "",
    //   show_cover_pic0: "0",
    //   shortvideofileid0: "",
    //   copyright_type0: "0",
    //   is_cartoon_copyright0: "0",
    //   copyright_img_list0: '{"max_width":578,"img_list":[]}',
    //   releasefirst0: "",
    //   platform0: "",
    //   reprint_permit_type0: "",
    //   allow_fast_reprint0: "0",
    //   allow_reprint0: "",
    //   allow_reprint_modify0: "",
    //   original_article_type0: "",
    //   ori_white_list0: "",
    //   video_ori_status0: "",
    //   hit_nickname0: "",
    //   free_content0: "",
    //   fee0: "0",
    //   ad_id0: "",
    //   guide_words0: "",
    //   is_share_copyright0: "0",
    //   share_copyright_url0: "",
    //   source_article_type0: "",
    //   reprint_recommend_title0: "",
    //   reprint_recommend_content0: "",
    //   share_page_type0: "0",
    //   share_imageinfo0: '{"list":[]}',
    //   share_video_id0: "",
    //   dot0: "{}",
    //   share_voice_id0: "{}",
    //   share_finder_audio_username0: "",
    //   share_finder_audio_exportid0: "",
    //   mmlistenitem_json_buf0: "",
    //   insert_ad_mode0: "",
    //   categories_list0: "[]",
    //   compose_info0:
    //     '[{"list":[{"blockIdx":1,"imgList":[],"text":"二二特瑞特人太热"},{"blockIdx":2,"imgList":[],"text":""}]}]',
    //   is_pay_subscribe0: "0",
    //   pay_fee0: "",
    //   pay_preview_percent0: "",
    //   pay_desc0: "",
    //   pay_album_info0: "",
    //   appmsg_album_info0: '{"appmsg_album_infos":[]}',
    //   can_insert_ad0: "1",
    //   audio_info0: '{"audio_infos":[]}',
    //   danmu_pub_type0_0: "0",
    //   is_set_sync_to_finder0: "0",
    //   sync_to_finder_cover0: "0",
    //   sync_to_finder_cover_source0: "0",
    //   import_to_finder0: "0",
    //   import_from_finder_export_id0: "0",
    //   style_type0: "3",
    //   sticker_info0:
    //     '{"is_stickers":0,"common_stickers_num":0,"union_stickers_num":0,"sticker_id_list":[],"has_invalid_sticker":0}',
    //   new_pic_process0: "0",
    //   disable_recommend0: "0",
    //   req: '{"idx_infos":[{"save_old":0,"cps_info":{"cps_import":0}}]}',
    //   remind_flag: null,
    //   is_auto_type_setting: "3",
    //   save_type: "0",
    //   isneedsave: "0",
    // }
    // const formData = new FormData()
    // for (const key in params) {
    //   formData.append(key, params[key])
    // }
    //
    // const fetchOptions = {
    //   method: "POST",
    //   headers: header,
    //   body: formData,
    // }
    // this.logger.debug("wechat update post...", fetchOptions)
    // const response = await fetch(url, fetchOptions)
    // const resText = await response.text()
    // this.logger.debug("wechat update post success, resText=>", resText)
    // const resJson = JsonUtil.safeParse<any>(resText, {} as any)
    // if (resJson.code !== 200) {
    //   throw new Error("微信公众号文章上传失败失败")
    // }
    // this.logger.debug("wechat update post =>", resJson)

    // this.logger.debug("f =>", f)
    // this.logger.debug("wechat update start...", f.getHeaders())
    // const res = await this.webProxyFetch(url, [f.getHeaders()], f, "POST", f.getHeaders()["content-type"])
    // this.logger.debug("wechat update post =>", res)

    // if (!res.appMsgId) {
    //   var err = formatError(res)
    //   console.log('error', err)
    //   throw new Error(
    //     '同步失败 错误内容：' + (err && err.errmsg ? err.errmsg : res.ret)
    //   )
    // }
    // return {
    //   status: 'success',
    //   post_id: res.appMsgId,
    //   draftLink:
    //     'https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77&appmsgid=' +
    //     res.appMsgId +
    //     '&token=' +
    //     weixinMetaCache.token +
    //     '&lang=zh_CN',
    // }
    throw new Error("开发中")
  }
}

export { WechatWebAdaptor }
