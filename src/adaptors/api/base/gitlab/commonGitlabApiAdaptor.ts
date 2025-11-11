/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { CommonGitlabConfig } from "~/src/adaptors/api/base/gitlab/commonGitlabConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CommonGitlabClient } from "zhi-gitlab-middleware"
import { Attachment, CategoryInfo, MediaObject, Post, UserBlog, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { StrUtil, YamlUtil } from "zhi-common"
import { toRaw } from "vue"
import { Base64 } from "js-base64"
import { isDev } from "~/src/utils/constants.ts"
import sypIdUtil from "~/src/utils/sypIdUtil.ts"
import { GitlabFetchClientProxyAdaptor } from "~/src/adaptors/api/base/gitlab/gitlabFetchClientProxyAdaptor.ts"

/**
 * Gitlab API 适配器
 *
 * @author terwer
 * @version 1.11.0
 * @since 1.11.0
 */
class CommonGitlabApiAdaptor extends BaseBlogApi {
  private gitlabClient: CommonGitlabClient
  private readonly gitlabCfg: CommonGitlabConfig

  constructor(appInstance: PublisherAppInstance, cfg: CommonGitlabConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("common-gitlab-api-adaptor")

    this.gitlabCfg = cfg
    const commonFetchClient = new GitlabFetchClientProxyAdaptor(appInstance, cfg)

    this.gitlabClient = new CommonGitlabClient(
      appInstance,
      cfg.apiUrl,
      cfg.password,
      cfg.username,
      cfg.githubRepo,
      cfg.githubBranch,
      cfg.defaultMsg,
      cfg.email,
      cfg.author,
      commonFetchClient,
      cfg.middlewareUrl,
      isDev
    )
  }

  public async checkAuth(): Promise<boolean> {
    let flag: boolean
    try {
      const testFilePath = `test.md`
      await this.safeDeletePost(testFilePath)
      const res = await this.gitlabClient.createRepositoryFile(testFilePath, "Hello, World!")
      await this.safeDeletePost(testFilePath)
      flag = !StrUtil.isEmptyString(res?.file_path)
    } catch (e) {
      this.logger.info(`checkAuth error =>`, e)
      flag = false
    }

    this.logger.info(`checkAuth finished => ${flag}`)
    return flag
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const nodes = await this.gitlabClient.getRepositoryTree("")
    this.logger.debug("getRepositoryTree =>", nodes)

    // 数据适配
    if (nodes && nodes.length > 0) {
      const userblog: UserBlog = new UserBlog()
      const cfg = this.cfg as CommonGitlabConfig
      userblog.blogid = cfg.defaultPath
      userblog.blogName = cfg.defaultPath
      userblog.url = StrUtil.pathJoin(StrUtil.pathJoin(cfg.home, cfg.username), cfg.githubRepo)
      result.push(userblog)
    }
    this.logger.debug("result result =>", result)

    return result
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    this.logger.debug("start newPost =>", { post: toRaw(post) })
    const cfg = this.cfg as CommonGitlabConfig

    // 路径处理
    const savePath = post.cate_slugs?.[0] ?? cfg.blogid
    const filename = post.mdFilename ?? "auto-" + sypIdUtil.newID() + ".md"
    let docPath = StrUtil.pathJoin(savePath, filename)
    if (docPath.startsWith("/")) {
      docPath = docPath.substring(1)
    }
    if (docPath.startsWith("./")) {
      docPath = docPath.substring(2)
    }
    this.logger.info("Gitlab文章将要最终发送到以下目录 =>", docPath)

    // 开始发布
    let finalRes: any
    try {
      const res = await this.gitlabClient.createRepositoryFile(docPath, post.description)
      this.logger.debug("gitlab newPost finished =>", res)
      if (!res?.file_path) {
        throw new Error("Gitlab 调用API异常 =>" + res?.message)
      }

      finalRes = res
    } catch (e) {
      // 失败之后尝试删除旧数据再发一次
      try {
        await this.deletePost(docPath)
      } catch (e) {
        this.logger.warn("尝试删除失败，忽略", e)
      }
      const res2 = await this.gitlabClient.createRepositoryFile(docPath, post.description)
      if (!res2?.file_path) {
        throw new Error("重发依旧失败，Gitlab 调用API异常 =>" + res2?.message)
      }

      finalRes = res2
    }

    return finalRes.file_path
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    this.logger.debug("start getPost =>", { postid: postid })

    const res = await this.gitlabClient.getRepositoryFile(postid)
    this.logger.debug("gitlab getPost finished =>", res)
    if (!res) {
      throw new Error("Gitlab 调用API异常")
    }

    let commonPost = new Post()
    commonPost.postid = res.file_path
    // 文件标题
    commonPost.mdFilename = res.file_name
    commonPost.markdown = Base64.fromBase64(res.content)
    commonPost.description = commonPost.markdown

    // YAML属性转换
    const yamlAdaptor: YamlConvertAdaptor = this.getYamlAdaptor()
    if (null !== yamlAdaptor) {
      const yamlObj = await YamlUtil.yaml2ObjAsync(commonPost.description)
      const yamlFormatObj = new YamlFormatObj()
      yamlFormatObj.yamlObj = yamlObj
      this.logger.debug("extract frontFormatter, yamlFormatObj =>", yamlFormatObj)
      commonPost = yamlAdaptor.convertToAttr(commonPost, yamlFormatObj, this.cfg)
      this.logger.debug("handled yamlObj using YamlConverterAdaptor =>", yamlObj)
    }

    // 初始化知识空间
    const catSlugs = []
    const extractedPath = res.file_path.replace(res.file_name, "").replace(/\/$/, "")
    catSlugs.push(extractedPath)
    commonPost.cate_slugs = catSlugs

    return commonPost
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    this.logger.debug("start editPost =>", { postid: postid, post: toRaw(post) })
    const res = await this.gitlabClient.updateRepositoryFile(post.postid, post.description)
    this.logger.debug("gitlab editPost finished =>", res)

    if (!res?.file_path) {
      throw new Error("Gitlab 调用API异常")
    }
    return true
  }

  public async deletePost(postid: string): Promise<boolean> {
    try {
      const resJson = await this.gitlabClient.deleteRepositoryFile(postid)
      this.logger.debug("gitlab deletePost finished =>", resJson)
    } catch (e) {
      throw new Error("Gitlab 调用API异常 =>" + e)
    }

    return true
  }

  public async getCategoryTreeNodes(docPath: string): Promise<any[]> {
    const res = await this.gitlabClient.getRepositoryTree(docPath)
    return res
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    const cfg = this.cfg as CommonGitlabConfig
    let previewUrl: string
    previewUrl = cfg.previewUrl
      .replace("[user]", cfg.username)
      .replace("[repo]", cfg.githubRepo)
      .replace("[branch]", cfg.githubBranch)
      .replace("[docpath]", postid)
    // 路径组合
    // previewUrl = StrUtil.pathJoin(this.cfg.home, previewUrl)
    return previewUrl
  }

  public async getPostPreviewUrl(postid: string): Promise<string> {
    let previewUrl: string
    const newPostid = postid.substring(postid.lastIndexOf("/") + 1).replace(".md", "")
    previewUrl = this.cfg.previewPostUrl.replace("[postid]", newPostid)
    // 路径组合
    // previewUrl = StrUtil.pathJoin(this.cfg.postHome, previewUrl)

    return previewUrl
  }

  public async newMediaObject(mediaObject: MediaObject): Promise<Attachment> {
    try {
      const bits = mediaObject.bits
      const base64 = Base64.fromUint8Array(bits)
      let imageFullPath = StrUtil.pathJoin(this.cfg.imageStorePath ?? "images", mediaObject.name)
      if (imageFullPath.startsWith("/")) {
        imageFullPath = imageFullPath.substring(1)
      }
      if (imageFullPath.startsWith("./")) {
        imageFullPath = imageFullPath.substring(2)
      }
      this.logger.info("Gitlab图片将要最终发送到以下目录 =>", imageFullPath)
      const res = await this.gitlabClient.createRepositoryFile(imageFullPath, base64, "base64")
      this.logger.debug("gitlab createRepositoryFile res =>", res)

      const siteImgId = mediaObject.name
      const siteArticleId = mediaObject.name
      // http://localhost:8002/terwer/terwer-github-io/-/raw/test/images/image-20240331110420-v181nvl.png
      let toImagePath = StrUtil.pathJoin(this.cfg.home, this.cfg.username)
      toImagePath = StrUtil.pathJoin(toImagePath, this.gitlabCfg.githubRepo)
      toImagePath = StrUtil.pathJoin(toImagePath, "-/raw")
      toImagePath = StrUtil.pathJoin(toImagePath, this.gitlabCfg.githubBranch)
      if (res?.exist) {
        this.logger.warn("图片已存在，直接返回")
        toImagePath = StrUtil.pathJoin(toImagePath, imageFullPath)
      } else {
        if (StrUtil.isEmptyString(res.file_path)) {
          throw new Error("Gitlab 调用API异常")
        }
        toImagePath = StrUtil.pathJoin(toImagePath, res.file_path)
      }
      const siteImgUrl = toImagePath
      this.logger.info("Gitlab 图片上传成功", siteImgUrl)
      return {
        attachment_id: siteImgId,
        date_created_gmt: new Date(),
        parent: 0,
        link: siteImgUrl,
        title: mediaObject.name,
        caption: "",
        description: "",
        metadata: {
          width: 0,
          height: 0,
          file: "",
          filesize: 0,
          sizes: [],
        },
        type: mediaObject.type,
        thumbnail: "",
        id: siteArticleId,
        file: mediaObject.name,
        url: siteImgUrl,
      }
    } catch (e) {
      this.logger.error("Error uploading image to gitlab:", e)
      throw e
    }
  }

  // ================
  // private methods
  // ================
  private async safeDeletePost(postid: string): Promise<boolean> {
    try {
      await this.gitlabClient.deleteRepositoryFile(postid)
    } catch (e) {}

    return true
  }
}

export { CommonGitlabApiAdaptor }
