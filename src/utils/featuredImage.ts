/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogConfig, Post } from "zhi-blog-api"
import { StrUtil, YamlUtil } from "zhi-common"

/**
 * 特色图片（平台侧常称特写图）在平台 YAML 属性里使用的字段名。
 *
 * 该字段只保存在思源文档的平台属性中，用于在再次发布时回填发布表单，
 * 不参与任何平台的正文产物。
 */
export const FEATURED_IMAGE_YAML_KEY = "featured_image"

/**
 * 支持特色图片的平台配置形状（能力声明在平台配置类上，默认关闭）。
 */
export interface FeaturedImageCapableConfig {
  /**
   * 平台是否支持发布时设置特色图片，只有确认真实支持该能力的平台才打开。
   */
  featuredImageEnabled?: boolean
}

/**
 * 携带特色图片信息的文章模型。
 *
 * 特色图片是发布时的可选参数，不属于 zhi-blog-api 的通用 Post 契约，
 * 因此以实现方扩展字段的形式挂在文章上，只有声明支持能力的适配器会读取。
 */
export interface FeaturedImagePost extends Post {
  /**
   * 本次发布要设置的特色图片地址。
   *
   * 支持思源资源相对路径（如 `assets/xxx.png`）或完整的 http(s) 链接；
   * 空字符串表示本次发布不设置。
   */
  featuredImage?: string
  /**
   * 本次发布需要清除平台侧已设置的特写图（用户把已保存的特色图片清空后重新发布）。
   */
  featuredImageCleared?: boolean
  /**
   * 发布过程中上传得到的附件 ID，由适配器在调用平台接口前填充。
   */
  featuredImageAttachmentId?: string
  /**
   * 特色图片处理失败原因：失败不阻断正文发布，只做提示。
   */
  featuredImageError?: string
}

/**
 * 平台配置是否声明了特色图片能力。
 *
 * @param cfg - 平台配置
 */
export const isFeaturedImageEnabled = (cfg?: BlogConfig): boolean => {
  return (cfg as FeaturedImageCapableConfig | undefined)?.featuredImageEnabled === true
}

/**
 * 读取文章中待设置的特色图片地址。
 *
 * @param post - 文章
 */
export const getFeaturedImage = (post?: Post): string => {
  const value = (post as FeaturedImagePost | undefined)?.featuredImage
  return typeof value === "string" ? value.trim() : ""
}

/**
 * 从平台 YAML 属性中读取已保存的特色图片地址。
 *
 * @param yaml - 平台 YAML 属性内容
 */
export const readFeaturedImageFromYaml = (yaml?: string): string => {
  if (StrUtil.isEmptyString(yaml)) {
    return ""
  }
  try {
    const yamlObj = YamlUtil.yaml2Obj(yaml) as Record<string, any> | undefined
    const value = yamlObj?.[FEATURED_IMAGE_YAML_KEY]
    return typeof value === "string" ? value.trim() : ""
  } catch {
    return ""
  }
}

/**
 * 把特色图片地址写回平台 YAML 属性。
 *
 * - 地址非空：写入 `featured_image`；
 * - 地址为空且原 YAML 里存在该字段：删除该字段（用户清空了特色图片）；
 * - 地址为空且原 YAML 里没有该字段：原样返回，不动其它字段。
 *
 * @param yaml - 平台 YAML 属性内容
 * @param url - 新的特色图片地址
 */
export const writeFeaturedImageToYaml = (yaml: string | undefined, url: string): string => {
  const target = (url ?? "").trim()
  const source = yaml ?? ""
  const hasYaml = !StrUtil.isEmptyString(source)

  let yamlObj: Record<string, any> = {}
  if (hasYaml) {
    try {
      yamlObj = (YamlUtil.yaml2Obj(source) as Record<string, any>) ?? {}
    } catch {
      // 已有属性无法解析时不做破坏性改写，保持原样
      return source
    }
  }

  const hasSavedKey = Object.prototype.hasOwnProperty.call(yamlObj, FEATURED_IMAGE_YAML_KEY)
  if (target === "") {
    if (!hasSavedKey) {
      return source
    }
    delete yamlObj[FEATURED_IMAGE_YAML_KEY]
  } else {
    yamlObj[FEATURED_IMAGE_YAML_KEY] = target
  }

  return YamlUtil.obj2Yaml(yamlObj)
}

/**
 * 按文章上的特色图片状态同步平台 YAML 属性。
 *
 * 同时把「本次是否需要清除平台已设置的特写图」记到文章上，供适配器在更新时使用。
 * 只有声明了特色图片能力的平台才应该调用本方法，避免影响其它平台的属性内容。
 *
 * `featuredImage` 为 undefined 表示本次发布不由表单接管该字段：此时不动 YAML，
 * 仅把源码模式里可能手写的地址回填到文章上，让平台适配器照常生效。
 *
 * @param post - 文章
 */
export const syncFeaturedImageYaml = (post: Post): Post => {
  const featuredImagePost = post as FeaturedImagePost
  const desired = featuredImagePost.featuredImage
  const saved = readFeaturedImageFromYaml(post?.yaml)

  if (desired === undefined) {
    if (!StrUtil.isEmptyString(saved)) {
      featuredImagePost.featuredImage = saved
    }
    featuredImagePost.featuredImageCleared = false
    return post
  }

  const target = desired.trim()
  featuredImagePost.yaml = writeFeaturedImageToYaml(post.yaml, target)
  featuredImagePost.featuredImageCleared = target === "" && saved !== ""

  return post
}

/**
 * 从平台 YAML 属性回填文章上的特色图片地址。
 *
 * @param post - 文章
 */
export const initFeaturedImageFromYaml = (post: Post): Post => {
  const featuredImagePost = post as FeaturedImagePost
  const saved = readFeaturedImageFromYaml(post?.yaml)
  if (!StrUtil.isEmptyString(saved) && StrUtil.isEmptyString(getFeaturedImage(post))) {
    featuredImagePost.featuredImage = saved
  }
  return post
}

/**
 * 从文章正文中取第一张图片的地址，方便用户直接引用正文配图作为特色图片。
 *
 * @param post - 文章
 */
export const extractFirstImageOfPost = (post?: Post): string => {
  if (!post) {
    return ""
  }
  const html = post.html ?? ""
  const md = post.markdown ?? ""

  const htmlMatch = html.match(/<img\b[^>]*\bsrc\s*=\s*["']?([^"'\s>]+)["']?[^>]*>/i)
  if (htmlMatch?.[1]) {
    return htmlMatch[1].trim()
  }

  const mdMatch = md.match(/!\[[^\]]*]\(\s*([^\s)]+)\s*(?:"[^"]*")?\s*\)/)
  if (mdMatch?.[1]) {
    return mdMatch[1].trim()
  }

  return ""
}

/**
 * 上传特色图片所需的宿主内核能力（只依赖 uploadAsset 这一个入口）。
 */
export interface FeaturedImageAssetKernel {
  uploadAsset(formData: FormData): Promise<any>
}

/**
 * 把本地图片上传到思源资源库，返回可直接填进「特色图片」的相对路径。
 *
 * 上传后得到的是 `assets/<文件名>` 这类思源资源相对路径，发布时再随文章上传到平台，
 * 与本字段既有的取值规则一致。
 *
 * @param kernel - 思源内核 API
 * @param file - 用户选择的本地图片文件
 */
export const uploadFeaturedImageAsset = async (
  kernel: FeaturedImageAssetKernel,
  file: File
): Promise<string> => {
  if (!file) {
    throw new Error("请选择要上传的图片")
  }

  const formData = new FormData()
  formData.append("assetsDirPath", "/assets/")
  formData.append("file[]", file)

  const data = await kernel.uploadAsset(formData)
  const succMap = (data?.succMap ?? {}) as Record<string, string>
  const uploadedPath = Object.values(succMap).find((path) => typeof path === "string" && path !== "")
  if (!uploadedPath) {
    const errFiles = Array.isArray(data?.errFiles) ? data.errFiles.join(", ") : ""
    throw new Error(errFiles ? `图片上传失败：${errFiles}` : "图片上传失败，请重试")
  }

  return uploadedPath
}

