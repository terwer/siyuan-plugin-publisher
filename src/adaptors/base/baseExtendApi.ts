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

import { IBlogApi } from "zhi-blog-api/dist/lib/IBlogApi"
import { IWebApi } from "zhi-blog-api/dist/lib/IWebApi"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import {
  BlogConfig,
  MediaObject,
  PageTypeEnum,
  Post,
  PostUtil,
  WebApi,
  YamlConvertAdaptor,
  YamlFormatObj,
} from "zhi-blog-api"
import { createAppLogger, ILogger } from "~/src/utils/appLogger.ts"
import { LuteUtil } from "~/src/utils/luteUtil.ts"
import { usePicgoBridge } from "~/src/composables/usePicgoBridge.ts"
import { base64ToBuffer, remoteImageToBase64Info, toBase64Info } from "~/src/utils/polyfillUtils.ts"
import { DateUtil, HtmlUtil, StrUtil, YamlUtil } from "zhi-common"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { isFileExists } from "~/src/utils/siyuanUtils.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { SiyuanKernelApi } from "zhi-siyuan-api"
import { DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { MUST_USE_OWN_PLATFORM, MUST_USE_PICBED_PLATFORM } from "~/src/utils/constants.ts"
import { toRaw } from "vue"
import _ from "lodash"
import { usePublishPreferenceSetting } from "~/src/stores/usePublishPreferenceSetting.ts"

/**
 * 各种模式共享的扩展基类
 *
 * @author terwer
 * @since 1.8.0
 */
class BaseExtendApi extends WebApi implements IBlogApi, IWebApi {
  private readonly logger: ILogger
  private readonly api: BaseBlogApi | BaseWebApi
  protected readonly picgoBridge: any
  private readonly isSiyuanOrSiyuanNewWin: boolean
  private readonly kernelApi: SiyuanKernelApi

  /**
   * 构造函数用于创建一个新的实例
   *
   * @param api - 一个 BaseBlogApi 或 BaseWebApi 实例，用于与 API 进行通信
   */
  constructor(api: BaseBlogApi | BaseWebApi) {
    super()
    this.logger = createAppLogger("base-extend-api")
    this.api = api

    this.picgoBridge = usePicgoBridge()
    const { isInSiyuanOrSiyuanNewWin } = useSiyuanDevice()
    this.isSiyuanOrSiyuanNewWin = isInSiyuanOrSiyuanNewWin()
    const { kernelApi } = useSiyuanApi()
    this.kernelApi = kernelApi
  }

  /**
   * 在保存前编辑文章
   *
   * @param post - 要编辑的文章
   * @param id - 文章的可选 ID
   * @param publishCfg - 发布配置的可选参数
   * @returns 一个 Promise，解析为编辑后的文章
   */
  public async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    // 处理MD文件名
    post = await this.handleFilename(post, id, publishCfg)
    // 处理摘要
    post = await this.handleDesc(post, id, publishCfg)
    // 处理路径分类
    post = await this.handleCategories(post, id, publishCfg)
    // 处理图片
    post = await this.handlePictures(post, id, publishCfg)
    // 处理Md
    post = await this.handleMd(post, id, publishCfg)
    // 处理YAML
    post = await this.handleYaml(post, id, publishCfg)
    // 处理其他
    post = await this.handleOther(post, id, publishCfg)
    return post
  }

  // ================
  // private methods
  // ================
  /**
   * 处理MD文件名
   *
   * @param doc - 要处理YAML的 Post 对象
   * @param id - 思源笔记文档 ID
   * @param publishCfg - （可选）发布配置参数
   * @returns 一个 Promise，解析为处理后的 Post 对象
   */
  private async handleFilename(doc: Post, id?: string, publishCfg?: any) {
    const cfg = publishCfg?.cfg as any
    const post = _.cloneDeep(doc) as Post

    if (cfg?.mdFilenameRule) {
      // 处理文件规则
      const created = DateUtil.formatIsoToZhDate(post.dateCreated.toISOString(), true)
      const datearr = created.split(" ")[0]
      const numarr = datearr.split("-")
      const y = numarr[0]
      const m = numarr[1]
      const d = numarr[2]
      this.logger.debug("created numarr=>", numarr)

      let filename = cfg.mdFilenameRule.replace(/\.md/g, "")
      if (cfg.useMdFilename) {
        // 使用真实文件名作为MD文件名
        filename = filename.replace(/\[filename\]/g, post.title)
      } else {
        // 使用别名作为MD文件名
        filename = filename.replace(/\[slug\]/g, post.wp_slug)
      }
      // 年月日
      filename = filename
        .replace(/\[yyyy\]/g, y)
        .replace(/\[MM\]/g, m)
        .replace(/\[mm\]/g, m)
        .replace(/\[dd\]/g, d)
      post.mdFilename = filename
    }

    const { getReadOnlyPublishPreferenceSetting } = usePublishPreferenceSetting()
    const pref = getReadOnlyPublishPreferenceSetting()
    if (pref.value.fixTitle) {
      post.title = HtmlUtil.removeTitleNumber(post.title)
    }

    this.logger.debug("处理MD文件名完成，post", { post: toRaw(post) })
    return post
  }

  /**
   * 处理摘要
   *
   * @param doc - 要处理YAML的 Post 对象
   * @param id - 思源笔记文档 ID
   * @param publishCfg - （可选）发布配置参数
   * @returns 一个 Promise，解析为处理后的 Post 对象
   */
  private async handleDesc(doc: Post, id?: string, publishCfg?: any) {
    const post = _.cloneDeep(doc) as Post

    // 同步摘要
    post.mt_excerpt = post.shortDesc
    post.mt_text_more = post.shortDesc

    return post
  }

  /**
   * 处理路径分类
   *
   * @param doc - 要处理YAML的 Post 对象
   * @param id - 思源笔记文档 ID
   * @param publishCfg - （可选）发布配置参数
   * @returns 一个 Promise，解析为处理后的 Post 对象
   */
  private async handleCategories(doc: Post, id?: string, publishCfg?: any) {
    const cfg: BlogConfig = publishCfg?.cfg
    const post = _.cloneDeep(doc) as Post

    const savePath = post.cate_slugs?.[0] ?? cfg.blogid
    const pathCates = []
    if (cfg.usePathCategory) {
      const docPathArray = savePath.split("/")
      if (docPathArray.length > 1) {
        for (let i = 1; i < docPathArray.length; i++) {
          const docCate = HtmlUtil.removeTitleNumber(docPathArray[i])
          pathCates.push(docCate)
        }
      }
    }

    // 目录分类
    this.logger.info("目录路径转换的分类 =>", pathCates)
    const mergedCategories = [...new Set([...(pathCates ?? []), ...(post?.categories ?? [])])].filter(
      (cate) => cate.trim() !== ""
    )
    post.categories = mergedCategories
    this.logger.info("最终的分类 =>", post.categories)
    this.logger.debug("目录路径转换完成，post", { post: toRaw(post) })
    return post
  }

  /**
   * 处理正文
   *
   * @param doc - 要处理YAML的 Post 对象
   * @param id - 思源笔记文档 ID
   * @param publishCfg - （可选）发布配置参数
   * @returns 一个 Promise，解析为处理后的 Post 对象
   */
  private async handleMd(doc: Post, id?: string, publishCfg?: any) {
    const cfg: BlogConfig = publishCfg?.cfg
    const post = _.cloneDeep(doc) as Post

    // 处理MD
    let md = post.markdown

    // #435 过滤掉思源剪藏插件的引用摘要
    md = YamlUtil.extractMarkdown(md)

    // 处理标记
    // #691 闪卡标记渲染成Markdown之后去除==
    md = md.replace(/==([^=]+)==/g, '<span style="font-weight: bold;" class="mark">$1</span>')

    // 汇总结果
    post.markdown = md
    this.logger.debug("markdown处理完毕，post", { post: toRaw(post) })
    return post
  }

  /**
   * 处理其他属性
   *
   * @param doc - 要处理YAML的 Post 对象
   * @param id - 思源笔记文档 ID
   * @param publishCfg - （可选）发布配置参数
   * @returns 一个 Promise，解析为处理后的 Post 对象
   */
  private async handleOther(doc: Post, id?: string, publishCfg?: any) {
    const cfg: BlogConfig = publishCfg?.cfg
    const post = _.cloneDeep(doc) as Post

    // 发布格式
    const md = YamlUtil.extractMarkdown(post.markdown)
    post.html = LuteUtil.mdToHtml(md)
    if (cfg?.pageType == PageTypeEnum.Markdown) {
      post.description = post.markdown
    } else {
      post.description = post.html
    }
    return post
  }

  /**
   * 处理YAML
   *
   * @param doc - 要处理YAML的 Post 对象
   * @param id - 思源笔记文档 ID
   * @param publishCfg - （可选）发布配置参数
   * @returns 一个 Promise，解析为处理后的 Post 对象
   */
  private async handleYaml(doc: Post, id?: string, publishCfg?: any) {
    const cfg: BlogConfig = publishCfg?.cfg
    const post = _.cloneDeep(doc) as Post

    this.logger.debug("开始处理yaml，post", { post: toRaw(post) })

    // 前面改过属性，需要再生成一次
    const yamlAdaptor: YamlConvertAdaptor = this.api.getYamlAdaptor()
    if (null !== yamlAdaptor) {
      // 先生成对应平台的yaml
      const yamlObj: YamlFormatObj = yamlAdaptor.convertToYaml(post, cfg)
      // 同步发布内容
      post.yaml = yamlObj.formatter
      post.markdown = yamlObj.mdFullContent
      post.html = yamlObj.htmlContent
      this.logger.info("rehandled yaml using YamlConverterAdaptor")
    } else {
      // 同步发布内容
      const yamlObj = PostUtil.toYamlObj(post)
      const yaml = YamlUtil.obj2Yaml(yamlObj)
      const md = YamlUtil.extractMarkdown(post.markdown)
      post.yaml = yaml
      post.markdown = md
      post.html = LuteUtil.mdToHtml(md)
      this.logger.info("yaml adaptor not found, using default")
    }

    // YAML与MD的处理，旧的逻辑，不考虑属性变更的情况
    // if (null !== yamlAdaptor) {
    //   const md = YamlUtil.extractMarkdown(post.markdown)
    //   const yaml = post.yaml
    //   post.markdown = YamlUtil.addYamlToMd(yaml, md)
    //   this.logger.info("检测到该平台已开启YAML适配器，已附加YAML到Markdown正文")
    // } else {
    //   this.logger.info("未找到YAML适配器，不作处理")
    // }

    this.logger.debug("yaml处理之后，post", { post: toRaw(post) })
    return post
  }

  /**
   * 处理图片
   *
   * @param doc - 要处理图片的 Post 对象
   * @param id - 思源笔记文档 ID
   * @param publishCfg - （可选）发布配置参数
   * @returns 一个 Promise，解析为处理后的 Post 对象
   */
  private async handlePictures(doc: Post, id: string, publishCfg?: any): Promise<Post> {
    const cfg: BlogConfig = publishCfg?.cfg
    const dynCfg: DynamicConfig = publishCfg?.dynCfg
    const middlewareUrl = cfg?.middlewareUrl

    const post = _.cloneDeep(doc) as Post
    this.logger.debug("图片处理之前, post =>", { post: toRaw(post) })

    // 判断key包含 custom_Zhihu 或者 /custom_Zhihu-\w+/
    const mustUseOwnPlatform: string[] = MUST_USE_OWN_PLATFORM
    const mustUsePicbedPlatform: string[] = MUST_USE_PICBED_PLATFORM
    const isPicgoInstalled: boolean = await this.checkPicgoInstalled()
    if (!isPicgoInstalled) {
      this.logger.warn("未安装 PicGO 插件，将使用平台上传图片")
    }

    let mustUseOwn: boolean = false
    let mustUsePicbed: boolean = false
    if (dynCfg?.platformKey) {
      // 注意如果 platformKey=custom_Zhihu 或者 custom_Zhihu-xxx custom_Notion-xxx 也算 可以参考 /custom_Zhihu-\w+/
      mustUseOwn = mustUseOwnPlatform.some((platform) => {
        const regex = new RegExp(`${platform}(-\\w+)?`)
        return regex.test(dynCfg.platformKey)
      })
      mustUsePicbed = mustUsePicbedPlatform.some((platform) => {
        const regex = new RegExp(`${platform}(-\\w+)?`)
        return regex.test(dynCfg.platformKey)
      })
    }

    if (mustUseOwn) {
      this.logger.warn("该平台不支持 Picgo 插件，将使用平台上传图片")
    }
    const usePicgo: boolean = isPicgoInstalled && !mustUseOwn

    if (usePicgo) {
      // ==========================
      // 使用 PicGO上传图片
      // ==========================
      // 图片替换
      this.logger.info("使用 PicGO上传图片")
      this.logger.debug("开始图片处理, post =>", { post: toRaw(post) })
      post.markdown = await this.picgoBridge.handlePicgo(id, post.markdown)
      this.logger.debug("图片处理完毕, post.markdown =>", { md: post.markdown })
    } else {
      if (mustUsePicbed) {
        const errMsg = "检测到您未安装Picgo插件，该平台的图片将无法处理，如需使用图床功能，请在集市下载并配置Picgo插件"
        this.logger.error(errMsg)
        await this.kernelApi.pushMsg({
          msg: errMsg,
          timeout: 7000,
        })
      } else {
        // ==========================
        // 使用平台上传图片
        // ==========================
        this.logger.info("使用平台上传图片")
        // 找到所有的图片
        const images = await this.picgoBridge.getImageItemsFromMd(id, post.markdown)
        if (images.length === 0) {
          this.logger.info("未找到图片，不处理")
          return post
        }
        // 批量处理图片上传
        this.logger.info(`找到${images.length}张图片，开始上传`)
        const urlMap = {}
        try {
          for (const image of images) {
            const imageUrl = image.url
            const base64Info = await this.readFileToBase64(imageUrl, middlewareUrl)
            const bits = base64ToBuffer(base64Info.imageBase64)
            const mediaObject = new MediaObject(image.name, base64Info.mimeType, bits)
            this.logger.debug("before upload, mediaObject =>", mediaObject)
            const attachResult = await this.api.newMediaObject(mediaObject)
            this.logger.debug("attachResult =>", attachResult)
            if (attachResult && attachResult.url) {
              urlMap[image.originUrl] = attachResult.url
            }
            const platformImageSuccessMsg = `使用平台自带的图片上传能力，已成功上传图片 ${image.name}`
            await this.kernelApi.pushMsg({
              msg: platformImageSuccessMsg,
              timeout: 3000,
            })
          }
        } catch (e) {
          const errMsg2 = "文章可能已经发布成功，但是平台图片上传失败"
          this.logger.error(errMsg2, e)
          await this.kernelApi.pushMsg({
            msg: errMsg2,
            timeout: 7000,
          })
        }

        // 图片替换
        this.logger.info("平台图片全部上传完成，将开始进行连接替换，urlMap =>", urlMap)
        const pictureReplacePattern = new RegExp(
          Object.keys(urlMap)
            .map((key) => `\\b${key}\\b`)
            .join("|"),
          "g"
        )
        const replaceUrl = (match: string): string => {
          return urlMap[match] || match
        }
        post.markdown = post.markdown.replace(pictureReplacePattern, replaceUrl)
      }
    }

    // 利用 lute 把 md 转换成 html
    post.html = LuteUtil.mdToHtml(post.markdown)

    this.logger.info("图片预处理全部完成")
    this.logger.debug("图片处理之后，post", { post: toRaw(post) })
    return post
  }

  /**
   * 检查 Picgo 是否已安装
   *
   * @returns 一个 Promise，解析为布尔值，表示是否已安装 Picgo
   */
  private async checkPicgoInstalled() {
    // 检测是否安装 picgo 插件
    return await isFileExists(this.kernelApi, "/data/plugins/siyuan-plugin-picgo/plugin.json", "text")
  }

  /**
   * 读取文件并将其转换为 Base64 编码
   *
   * @param url - 要读取的文件的 URL
   * @param middlewareUrl - 代理地址
   * @returns 一个 Promise，解析为文件的 Base64 编码字符串
   */
  private async readFileToBase64(url: string, middlewareUrl?: string): Promise<any> {
    let base64Info: any
    if (this.isSiyuanOrSiyuanNewWin) {
      this.logger.info("Inside Siyuan notes, use the built-in request to obtain base64")
      base64Info = await remoteImageToBase64Info(url)
    } else {
      this.logger.info("Outside the browser, use an image proxy")
      const proxyUrl = StrUtil.isEmptyString(middlewareUrl) ? "https://api.terwer.space/api/middleware" : middlewareUrl
      const response = await this.api.proxyFetch(`${proxyUrl}/image`, [], { url: url }, "POST")
      this.logger.debug("readFileToBase64 proxyFetch response =>", response)
      const resBody = response.body
      const base64String = resBody.base64
      base64Info = toBase64Info(url, base64String)
    }

    this.logger.debug("readFileToBase64 proxyFetch base64Info =>", { base64Info })
    return base64Info
  }
}

export { BaseExtendApi }
