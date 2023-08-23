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
