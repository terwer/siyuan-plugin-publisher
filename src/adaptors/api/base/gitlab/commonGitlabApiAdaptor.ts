/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { resolvePlatformImagePath } from "~/src/adaptors/api/base/platformImagePath.ts"
import {
  dirnameRepoPath,
  isLeafBundleLayout,
  isLeafBundlePostPath,
  resolveLeafBundleImageLink,
  resolveLeafBundleImagePathForPost,
  usesLeafBundleForPost,
  resolveLeafBundlePostPath,
  resolvePostMdFilename,
  resolvePreviewSlug,
} from "~/src/adaptors/api/base/contentLayout.ts"
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
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"

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
      flag = false
    }

    return flag
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const nodes = await this.gitlabClient.getRepositoryTree("")

    // 数据适配
    if (nodes && nodes.length > 0) {
      const userblog: UserBlog = new UserBlog()
      const cfg = this.cfg as CommonGitlabConfig
      userblog.blogid = cfg.defaultPath
      userblog.blogName = cfg.defaultPath
      userblog.url = StrUtil.pathJoin(StrUtil.pathJoin(cfg.home, cfg.username), cfg.githubRepo)
      result.push(userblog)
    }

    return result
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    const cfg = this.cfg as CommonGitlabConfig

    // 路径处理
    const savePath = post.cate_slugs?.[0] ?? cfg.blogid
    const filename = post.mdFilename ?? "auto-" + sypIdUtil.newID() + ".md"
    let docPath = isLeafBundleLayout(cfg as any)
      ? resolveLeafBundlePostPath(savePath, resolvePostMdFilename(post))
      : StrUtil.pathJoin(savePath, filename)
    if (docPath.startsWith("/")) {
      docPath = docPath.substring(1)
    }
    if (docPath.startsWith("./")) {
      docPath = docPath.substring(2)
    }

    // 开始发布
    let finalRes: any
    try {
      const res = await this.gitlabClient.createRepositoryFile(docPath, post.description)
      if (!res?.file_path) {
        throw new Error("Gitlab 调用API异常 =>" + res?.message)
      }

      finalRes = res
    } catch (e) {
      // 失败之后尝试删除旧数据再发一次。
      // 只删目标 md 文件，避免页面目录模式连带清理已上传的图片。
      try {
        await this.gitlabClient.deleteRepositoryFile(docPath)
      } catch (e) {
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

    const res = await this.gitlabClient.getRepositoryFile(postid)
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
      commonPost = yamlAdaptor.convertToAttr(commonPost, yamlFormatObj, this.cfg)
    }

    // 初始化知识空间
    const catSlugs = []
    const extractedPath = res.file_path.replace(res.file_name, "").replace(/\/$/, "")
    catSlugs.push(extractedPath)
    commonPost.cate_slugs = catSlugs

    return commonPost
  }

  public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
    const res = await this.gitlabClient.updateRepositoryFile(post.postid, post.description)

    if (!res?.file_path) {
      throw new Error("Gitlab 调用API异常")
    }
    return true
  }

  public async deletePost(postid: string, id?: string, publishCfg?: IPublishCfg): Promise<boolean> {
    if (isLeafBundleLayout(this.cfg as any) && isLeafBundlePostPath(postid)) {
      return await this.deleteLeafBundle(postid)
    }

    try {
      await this.gitlabClient.deleteRepositoryFile(postid)
    } catch (e) {
      throw new Error("Gitlab 调用API异常 =>" + e)
    }

    return true
  }

  /**
   * 删除页面目录（Leaf Bundle）
   *
   * GitLab 没有“删除目录”接口，先列目录再逐文件删除。
   * 图片按设计位于 bundle 根目录；子目录条目删除失败不阻断 index.md 的删除。
   */
  private async deleteLeafBundle(postid: string): Promise<boolean> {
    const bundleDir = dirnameRepoPath(postid)
    const paths = new Set<string>([postid])

    try {
      const nodes = await this.gitlabClient.getRepositoryTree(bundleDir)
      nodes.forEach((node: any) => {
        if (node?.value) {
          paths.add(node.value)
        }
      })
    } catch (e) {
      this.logger.warn("list bundle dir failed, fallback to delete index.md only", e)
    }

    let indexDeleted = false
    for (const filePath of paths) {
      try {
        await this.gitlabClient.deleteRepositoryFile(filePath)
        if (filePath === postid) {
          indexDeleted = true
        }
      } catch (e) {
        if (filePath === postid) {
          throw new Error("Gitlab 调用API异常 =>" + e)
        }
        this.logger.warn(`delete bundle asset failed: ${filePath}`, e)
      }
    }

    return indexDeleted
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
    if (!postid) {
      throw new Error("postid 不能为空")
    }
    const newPostid = resolvePreviewSlug(postid)
    previewUrl = this.cfg.previewPostUrl.replace("[postid]", newPostid)
    // 路径组合
    // previewUrl = StrUtil.pathJoin(this.cfg.postHome, previewUrl)

    return previewUrl
  }

  public async newMediaObject(mediaObject: MediaObject): Promise<Attachment> {
    try {
      const bits = mediaObject.bits
      const base64 = Base64.fromUint8Array(bits)
      const isBundle = usesLeafBundleForPost(this.cfg as any, mediaObject.post)
      let imageFullPath: string
      if (isBundle) {
        // 页面目录：图片与 index.md 同目录，正文用相对文件名引用
        const mediaPost = mediaObject.post
        imageFullPath = resolveLeafBundleImagePathForPost(mediaPost, mediaObject.name, this.cfg.blogid)
      } else {
        // 与 GitHub 族共用同一套图片路径规则（见 platformImagePath）：
        // 支持 [docpath]/images 就近目录、./ 与 ../ 相对链接、以及仓库根目录
        const { imagePath } = resolvePlatformImagePath(
          this.cfg.imageStorePath ?? "images",
          mediaObject,
          "images",
          this.cfg.blogid
        )
        imageFullPath = imagePath
      }
      const res = await this.gitlabClient.createRepositoryFile(imageFullPath, base64, "base64")

      const siteImgId = mediaObject.name
      const siteArticleId = mediaObject.name
      let siteImgUrl: string
      if (isBundle) {
        if (!res?.exist && StrUtil.isEmptyString(res?.file_path)) {
          throw new Error("Gitlab 调用API异常")
        }
        siteImgUrl = resolveLeafBundleImageLink(mediaObject.name)
      } else {
        // http://localhost:8002/terwer/terwer-github-io/-/raw/test/images/image-20240331110420-v181nvl.png
        let toImagePath = StrUtil.pathJoin(this.cfg.home, this.cfg.username)
        toImagePath = StrUtil.pathJoin(toImagePath, this.gitlabCfg.githubRepo)
        toImagePath = StrUtil.pathJoin(toImagePath, "-/raw")
        toImagePath = StrUtil.pathJoin(toImagePath, this.gitlabCfg.githubBranch)
        if (res?.exist) {
          toImagePath = StrUtil.pathJoin(toImagePath, imageFullPath)
        } else {
          if (StrUtil.isEmptyString(res.file_path)) {
            throw new Error("Gitlab 调用API异常")
          }
          toImagePath = StrUtil.pathJoin(toImagePath, res.file_path)
        }
        siteImgUrl = toImagePath
      }
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
