/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "@utils/appLogger.ts"
import { HookContext, HookResult } from "siyuan-plugin-publisher-types"
import { TAG_SPLIT } from "@/plugin/constants/pluginConstants.ts"
import { Post } from "zhi-blog-api"

const logger = createAppLogger("global-hooks")

// 处理 Markdown 内容
const processMarkdown = async (content: string): Promise<string> => {
  try {
    // TODO: 实现 Markdown 处理逻辑
    return content
  } catch (error) {
    logger.error("Failed to process markdown", error)
    throw error
  }
}

// 处理图片
const processImages = async (content: string): Promise<string> => {
  try {
    // TODO: 实现图片处理逻辑
    return content
  } catch (error) {
    logger.error("Failed to process images", error)
    throw error
  }
}

// 处理代码块
const processCodeBlocks = async (content: string): Promise<string> => {
  try {
    // TODO: 实现代码块处理逻辑
    return content
  } catch (error) {
    logger.error("Failed to process code blocks", error)
    throw error
  }
}

// 处理数学公式
const processMath = async (content: string): Promise<string> => {
  try {
    // TODO: 实现数学公式处理逻辑
    return content
  } catch (error) {
    logger.error("Failed to process math", error)
    throw error
  }
}

// 验证文章格式
const validatePostFormat = (post: Post): boolean => {
  try {
    if (!post.title || !post.description) {
      return false
    }
    return true
  } catch (error) {
    logger.error("Failed to validate post format", error)
    return false
  }
}

// 处理标签
const processTags = async (tags: string[]): Promise<string> => {
  try {
    // TODO: 实现标签处理逻辑
    return tags.join(TAG_SPLIT)
  } catch (error) {
    logger.error("Failed to process tags", error)
    throw error
  }
}

// 处理分类
const processCategories = async (categories: string[]): Promise<string[]> => {
  try {
    // TODO: 实现分类处理逻辑
    return categories
  } catch (error) {
    logger.error("Failed to process categories", error)
    throw error
  }
}

// 生成摘要
const generateExcerpt = async (content: string): Promise<string> => {
  try {
    // TODO: 实现摘要生成逻辑
    return content.substring(0, 200) + "..."
  } catch (error) {
    logger.error("Failed to generate excerpt", error)
    throw error
  }
}

// 生成继续阅读内容
const generateTextMore = async (content: string): Promise<string> => {
  try {
    // TODO: 实现继续阅读内容生成逻辑
    return content
  } catch (error) {
    logger.error("Failed to generate text more", error)
    throw error
  }
}

// 内容预处理
export const beforeProcessHook = async (context: HookContext): Promise<HookResult> => {
  try {
    logger.info("Processing content before publish")
    const { post } = context

    // 1. 处理 Markdown 内容
    post.description = await processMarkdown(post.description)

    // 2. 处理图片
    post.description = await processImages(post.description)

    // 3. 处理代码块
    post.description = await processCodeBlocks(post.description)

    // 4. 处理数学公式
    post.description = await processMath(post.description)

    return { success: true, data: context }
  } catch (error) {
    logger.error("Content processing failed", error)
    return { success: false, error: error as Error }
  }
}

// 内容预处理后处理
export const afterProcessHook = async (context: HookContext): Promise<HookResult> => {
  try {
    logger.info("Processing after content process")
    const { post } = context

    // 1. 清理多余的空行
    post.description = post.description.replace(/\n{3,}/g, "\n\n")

    // 2. 清理多余的空格
    post.description = post.description.replace(/[ \t]+/g, " ")

    // 3. 确保内容以换行符结束
    if (!post.description.endsWith("\n")) {
      post.description += "\n"
    }

    // 4. 记录处理后的内容长度
    logger.info(`Processed content length: ${post.description.length}`)

    return { success: true, data: context }
  } catch (error) {
    logger.error("Post-process content failed", error)
    return { success: false, error: error as Error }
  }
}

// 发布前处理
export const beforePublishHook = async (context: HookContext): Promise<HookResult> => {
  try {
    logger.info("Processing before publish")
    const { post } = context

    // 1. 验证文章格式
    if (!validatePostFormat(post)) {
      throw new Error("Invalid post format")
    }

    // 2. 处理标签
    if (post.mt_keywords) {
      post.mt_keywords = await processTags(post.mt_keywords.split(TAG_SPLIT))
    }

    // 3. 处理分类
    if (post.categories) {
      post.categories = await processCategories(post.categories)
    }

    // 4. 生成摘要
    post.mt_excerpt = await generateExcerpt(post.description)

    // 5. 生成继续阅读内容
    post.mt_text_more = await generateTextMore(post.description)

    return { success: true, data: context }
  } catch (error) {
    logger.error("Pre-publish processing failed", error)
    return { success: false, error: error as Error }
  }
}
