/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 表示一个 AI 提示的类，用于存储标题、内容和描述等信息
 *
 * 使用：const prompt = new AiPrompt("Generate Blog Post",
 * "Write a blog post about the benefits of AI.",
 * "Generate a blog post discussing the various advantages of artificial intelligence in different industries.");
 */
class AiPrompt {
  /**
   * 提示的标题
   */
  title: string

  /**
   * 提示的内容
   */
  content: string

  /**
   * 提示的描述
   */
  description: string

  /**
   * 创建一个 AiPrompt 的新实例
   *
   * @param title - 提示的标题
   * @param content - 提示的内容
   * @param description - 提示的描述
   */
  constructor(title: string, content: string, description: string) {
    this.title = title
    this.content = content
    this.description = description
  }
}

export { AiPrompt }
