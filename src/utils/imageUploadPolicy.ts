/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 图片自动上传策略
 *
 * 作用范围：单篇文档 > 目录排除规则 > 平台图床设置。
 * - 文档属性 `custom-syp-image-upload`：`skip` 表示不自动上传，`upload` 表示强制不跳过
 *   （可覆盖命中的目录排除规则），缺省/其他值表示跟随设置。
 * - 目录排除规则保存在发布偏好设置里，按「笔记本 + 文档路径」匹配；
 *   path 为空字符串表示整个笔记本。
 *
 * 该模块只做「是否跳过自动上传」的判断，不决定用哪个图床：
 * 平台图床（PicGo / 平台图床 / 不使用）仍由平台账号配置决定。
 *
 * @author terwer
 * @since 2.4.0
 */

/** 文档级图片上传策略属性名（思源自定义属性只允许小写） */
export const IMAGE_UPLOAD_POLICY_ATTR = "custom-syp-image-upload"

/** 文档级图片上传策略 */
export type ImageUploadPolicyValue = "follow" | "upload" | "skip"

/** 目录排除规则（笔记本 + 文档路径前缀） */
export interface ImageUploadExcludeDirRule {
  /** 思源笔记本 ID */
  notebookId: string
  /** 目录文档的 blocks.path；空字符串表示整个笔记本 */
  path: string
  /** 展示用：笔记本名称 */
  notebookName?: string
  /** 展示用：目录的人类可读路径 */
  hpath?: string
}

/** 目录匹配所需的文档信息 */
export interface ImageUploadDocInfo {
  /** 文档所属笔记本 ID（blocks.box） */
  box?: string
  /** 文档路径（blocks.path） */
  path?: string
}

/** 策略判断来源 */
export type ImageUploadPolicySource = "document" | "directory" | "platform"

/** 策略判断结果 */
export interface ImageUploadPolicyDecision {
  /** 是否跳过自动上传 */
  skip: boolean
  /** 命中的判断层级 */
  source: ImageUploadPolicySource
  /** 文档级原始策略 */
  docPolicy: ImageUploadPolicyValue
  /** 命中的目录规则（source=directory 时存在） */
  matchedRule?: ImageUploadExcludeDirRule
}

/** 策略解析所需的思源内核能力（便于单测注入） */
export interface ImageUploadPolicyKernelApi {
  getBlockAttrs(blockId: string): Promise<Record<string, any> | null | undefined>
  getBlockByID(blockId: string): Promise<any>
}

/**
 * 规范化文档属性值。只接受两种标准值：`skip` / `upload`，其他一律视为跟随设置。
 */
export const normalizeImageUploadPolicyValue = (raw?: string | null): ImageUploadPolicyValue => {
  const value = String(raw ?? "")
    .trim()
    .toLowerCase()
  if (value === "skip") {
    return "skip"
  }
  if (value === "upload") {
    return "upload"
  }
  return "follow"
}

/**
 * 把规则路径规范化为 `/<path>` 且去掉尾部 `/`；空串保留为「整个笔记本」。
 */
export const normalizeImageUploadRulePath = (raw?: string | null): string => {
  const value = String(raw ?? "")
    .trim()
    .replace(/\/+$/, "")
  if (!value) {
    return ""
  }
  return value.startsWith("/") ? value : `/${value}`
}

/**
 * 在目录规则中查找与文档匹配的规则。
 *
 * 规则 path 为空串时匹配该笔记本下的所有文档；否则匹配规则目录自身及其子文档。
 * 多条规则命中时返回第一条（规则都是排除语义，无需最长前缀优先）。
 */
export const matchImageUploadExcludeDir = (
  doc: ImageUploadDocInfo | undefined,
  rules?: readonly ImageUploadExcludeDirRule[]
): ImageUploadExcludeDirRule | undefined => {
  if (!doc?.box || !Array.isArray(rules) || rules.length === 0) {
    return undefined
  }
  // blocks.path 的叶子节点带 `.sy`，但子文档路径里的父级目录不带 `.sy`：
  // 目录文档 `/a.sy` 的子文档路径是 `/a/b.sy`。匹配前统一去掉尾部 `.sy`，
  // 否则「以目录文档为规则」只能命中目录自身，命中不了子文档。
  const docPath = normalizeImageUploadRulePath(doc.path).replace(/\.sy$/, "")
  return rules.find((rule) => {
    if (!rule || rule.notebookId !== doc.box) {
      return false
    }
    const rulePath = normalizeImageUploadRulePath(rule.path).replace(/\.sy$/, "")
    if (rulePath === "") {
      return true
    }
    return docPath === rulePath || docPath.startsWith(`${rulePath}/`)
  })
}

/**
 * 纯函数版本：根据文档属性值、文档信息与目录规则计算出策略。
 */
export const resolveImageUploadPolicyFromInputs = (input: {
  docAttrValue?: string | null
  doc?: ImageUploadDocInfo
  rules?: readonly ImageUploadExcludeDirRule[]
}): ImageUploadPolicyDecision => {
  const docPolicy = normalizeImageUploadPolicyValue(input.docAttrValue)
  if (docPolicy === "skip") {
    return { skip: true, source: "document", docPolicy }
  }
  if (docPolicy === "upload") {
    return { skip: false, source: "document", docPolicy }
  }

  const matchedRule = matchImageUploadExcludeDir(input.doc, input.rules)
  if (matchedRule) {
    return { skip: true, source: "directory", docPolicy, matchedRule }
  }

  return { skip: false, source: "platform", docPolicy }
}

/**
 * 从思源读取文档属性与文档路径，再计算策略。
 *
 * 读取失败时按「跟随设置」处理，不阻断发布。
 */
export const resolveImageUploadPolicy = async (options: {
  kernelApi: ImageUploadPolicyKernelApi
  docId?: string
  rules?: readonly ImageUploadExcludeDirRule[]
}): Promise<ImageUploadPolicyDecision> => {
  const { kernelApi, docId } = options
  if (!docId) {
    return resolveImageUploadPolicyFromInputs({ rules: options.rules })
  }

  const [attrsResult, blockResult] = await Promise.allSettled([
    kernelApi.getBlockAttrs(docId),
    kernelApi.getBlockByID(docId),
  ])

  const attrs = attrsResult.status === "fulfilled" ? attrsResult.value : undefined
  const block = blockResult.status === "fulfilled" ? blockResult.value : undefined

  return resolveImageUploadPolicyFromInputs({
    docAttrValue: attrs?.[IMAGE_UPLOAD_POLICY_ATTR],
    doc: {
      box: block?.box,
      path: block?.path,
    },
    rules: options.rules,
  })
}

/**
 * 统计 Markdown 中需要本地读取的图片数量（用于发布结果提示）。
 *
 * 只统计非 http(s)/协议的本地图片；同一地址只计一次。
 */
export const countLocalMarkdownImages = (markdown?: string | null): number => {
  if (!markdown) {
    return 0
  }
  const matches = String(markdown).matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g)
  const localUrls = new Set<string>()
  for (const match of matches) {
    const url = match[1]
    if (!url || /^(https?:)?\/\//i.test(url) || /^[a-z][a-z0-9+.-]*:/i.test(url)) {
      continue
    }
    localUrls.add(url)
  }
  return localUrls.size
}
