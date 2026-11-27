/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { Attachment, MediaObject } from "zhi-blog-api"
import FormDataHostUtil from "~/src/utils/FormDataHostUtil.ts"

/**
 * Halo 2.20+ 的「文章附件」上传入口。
 *
 * 该接口由服务端读取站点设置 `post.attachmentPolicyName` / `post.attachmentGroupName`，
 * 与 Halo 编辑器插入图片时的行为一致；插件不再自行猜测存储策略。
 *
 * 不附加 `waitForPermalink`：部分第三方存储插件只实现上传、不实现 getPermalink，
 * 附加该参数会让接口返回空响应；上传响应里的 permalink/annotations 已足够解析地址。
 */
export const HALO_POST_ATTACHMENT_UPLOAD_PATH = "/apis/uc.api.storage.halo.run/v1alpha1/attachments"

/**
 * Halo 2.9 等旧版本的附件上传入口，需要显式传 policyName。
 */
export const HALO_CONSOLE_ATTACHMENT_UPLOAD_PATH = "/apis/api.console.halo.run/v1alpha1/attachments/upload"

/**
 * 旧版 Halo 的默认本地存储策略。
 */
export const HALO_LEGACY_ATTACHMENT_POLICY = "default-policy"

const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i

/**
 * 判断 Halo 是否不具备「文章附件」上传入口（旧版）。
 *
 * 只把明确的旧版路由缺失视为回退条件：401/403 等鉴权问题必须原样暴露，
 * 否则会静默退回本地存储，重新制造 issue #1621 的问题。
 *
 * 注意：站点配置的存储策略不存在时也会返回 404，必须根据 detail 与路由缺失区分，
 * 不能把「策略配置错误」误判成旧版 Halo。
 *
 * @param response - Halo 接口响应
 */
export const isHaloPostAttachmentUnavailable = (response: any): boolean => {
  const status = Number(response?.status)
  if (status === 405) {
    return true
  }
  if (status !== 404) {
    return false
  }

  const detail = String(response?.detail ?? "")
  // Halo 2.20 的「策略不存在」也是 404，但它不是旧版路由缺失；
  // 其余 404（路由不存在、代理返回的空响应等）按旧版处理。
  return !/Policy\//i.test(detail)
}

const isHaloAttachmentPolicyMissing = (response: any): boolean => {
  return Number(response?.status) === 404 && /Policy\//i.test(String(response?.detail ?? ""))
}

const joinHaloUrl = (home: string, value: string): string => {
  if (ABSOLUTE_URL_PATTERN.test(value)) {
    return value
  }

  const base = (home ?? "").trim().replace(/\/+$/, "")
  if (!base) {
    return value.startsWith("/") ? value : `/${value}`
  }
  return value.startsWith("/") ? `${base}${value}` : `${base}/${value}`
}

/**
 * 统一解析 Halo 附件地址。
 *
 * Halo 不同存储策略返回的地址字段不同：
 * - 本地存储：`storage.halo.run/uri`（相对路径）
 * - S3 等外部存储：`storage.halo.run/external-link`（绝对地址）
 * - 新版接口：`status.permalink`（可能是绝对地址，也可能是相对路径）
 *
 * 优先使用 permalink / external-link，最后回退本地 uri；相对地址统一用站点地址补全。
 *
 * @param home - Halo 站点地址
 * @param response - 上传接口返回的 Attachment
 */
export const resolveHaloAttachmentUrl = (home: string, response: any): string => {
  const annotations = response?.metadata?.annotations ?? {}
  const candidates = [
    response?.status?.permalink,
    annotations["storage.halo.run/external-link"],
    annotations["storage.halo.run/uri"],
  ]

  for (const candidate of candidates) {
    if (typeof candidate !== "string") {
      continue
    }
    const value = candidate.trim()
    if (value) {
      return joinHaloUrl(home, value)
    }
  }

  return ""
}

/**
 * 把 Halo 上传响应转换为统一 Attachment。
 *
 * @param home - Halo 站点地址
 * @param mediaObject - 原始媒体对象
 * @param response - 上传接口返回的 Attachment
 */
export const createHaloAttachment = (home: string, mediaObject: MediaObject, response: any): Attachment => {
  const url = resolveHaloAttachmentUrl(home, response)
  if (!url) {
    throw new Error(`Halo 未返回图片地址，无法写入正文 => ${mediaObject.name}`)
  }

  return {
    attachment_id: response?.spec?.displayName,
    date_created_gmt: new Date(),
    parent: 0,
    link: url,
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
    id: response?.metadata?.name,
    file: mediaObject.name,
    url,
  }
}

const createHaloAttachmentFormData = (appInstance: any, mediaObject: MediaObject, legacy: boolean): any => {
  const { FormData, Blob } = FormDataHostUtil.getFormData(appInstance)
  const blob = new Blob([mediaObject.bits], { type: mediaObject.type })
  const formData = new FormData()
  formData.append("file", blob, mediaObject.name)

  if (legacy) {
    formData.append("policyName", HALO_LEGACY_ATTACHMENT_POLICY)
    formData.append("groupName", "")
  }

  return formData
}

/**
 * Halo 附件上传传输层。
 *
 * 两个回调分别对应「文章附件」和「旧版显式策略」入口；
 * 适配器只负责注入自己的鉴权请求方法。
 */
export interface HaloAttachmentUploadTransport {
  uploadToPostAttachments(formData: any): Promise<any>
  uploadToConsoleAttachments(formData: any): Promise<any>
}

/**
 * Halo 附件上传器。
 *
 * 优先走文章附件入口，让存储策略由站点决定；只有旧版 Halo 明确返回 404/405 时
 * 才回退到带 `default-policy` 的旧入口，并缓存能力探测结果，避免每次上传都多打一次请求。
 */
export class HaloAttachmentUploader {
  private postAttachmentSupported = true

  constructor(private readonly transport: HaloAttachmentUploadTransport) {}

  async upload(appInstance: any, mediaObject: MediaObject): Promise<any> {
    if (this.postAttachmentSupported) {
      const response = await this.transport.uploadToPostAttachments(
        createHaloAttachmentFormData(appInstance, mediaObject, false)
      )
      if (isHaloAttachmentPolicyMissing(response)) {
        throw new Error(`Halo 附件存储策略不可用：${response.detail}`)
      }
      if (!isHaloPostAttachmentUnavailable(response)) {
        return response
      }
      this.postAttachmentSupported = false
    }

    return await this.transport.uploadToConsoleAttachments(
      createHaloAttachmentFormData(appInstance, mediaObject, true)
    )
  }
}
