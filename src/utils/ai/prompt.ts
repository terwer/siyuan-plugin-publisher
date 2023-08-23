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

import { AiPrompt } from "~/src/models/aiPrompt.ts"

/**
 * 智能提取信息的自动化工具
 */

/**
 * 提取标题的配置信息
 */
const titlePrompt = <AiPrompt>{
  title: "自动提取标题",
  description: "从文章内容中生成有意义的标题",
  key: "title",
  content:
    "为文章内容生成简洁且完整概括的标题，长度不超过100个中文字符或255个英文字符。" +
    "输出为 JSON 格式，键名为 title，结果需放在 {} 内，不得包含非法 JSON 字符。",
}
export type TitleAIResult = {
  title: string
}

/**
 * 提取摘要的配置信息
 */
const shortDescPrompt = <AiPrompt>{
  title: "自动提取摘要",
  description: "从文章内容生成文章摘要",
  key: "desc",
  content:
    "为文章内容生成简明扼要的摘要，长度不超过100个中文字符或255个英文字符。" +
    "输出为 JSON 格式，键名为 desc，结果需放在 {} 内，不得包含非法 JSON 字符。",
}
export type ShortDescAIResult = {
  desc: string
}

/**
 * 提取标签的配置信息
 */
const tagPrompt = <AiPrompt>{
  title: "标签指令",
  description: "为文章添加分类标签",
  key: "tags",
  content:
    "为文章添加分类标签，单个标签不超过20个字符，多个标签用逗号分隔，最多返回5个标签。" +
    "输出为 JSON 格式，键名为 tags，指令放在数组内，结果需放在 {} 内，不得包含非法 JSON 字符。",
}

/**
 * 提取分类的配置信息
 */
const categoryPrompt = <AiPrompt>{
  title: "分类指令",
  description: "对文章内容进行分类",
  key: "categories",
  content:
    "对文章内容进行分类，指定分类名称，不超过20个字符，最多返回3个分类。" +
    "输出为 JSON 格式，键名为 categories，结果需放在 {} 内，不得包含非法 JSON 字符。",
}

/**
 * 自动提取工具的配置集合
 */
const prompt = {
  titlePrompt,
  shortDescPrompt,
  tagPrompt,
  categoryPrompt,
}

export { prompt }
