/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
    "请为这篇文章生成简洁且完整概括的标题，只处理文本，尽量返回中文标题。" +
    "标题长度不超过100个中文字符或255个英文字符。" +
    "输出为 JSON 格式，键名为 title，结果需放在 {} 内。" +
    "完整结果必须是合法JSON，不得包含非法 JSON 字符。",
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
    "请为这篇文章生成简明扼要的摘要，只处理文本，尽量返回中文摘要。" +
    "摘要长度不超过1024个中文字符或2048个英文字符。" +
    "输出为 JSON 格式，键名为 desc，结果需放在 {} 内。" +
    "完整结果必须是合法JSON，不得包含非法 JSON 字符。",
}
const shortDescPromptStream = <AiPrompt>{
  title: "自动提取摘要",
  description: "从文章内容生成文章摘要",
  key: "desc",
  content:
    "请为这篇文章生成简明扼要的摘要，只处理文本，尽量返回中文摘要。" +
    "摘要长度不超过1024个中文字符或2048个英文字符。" +
    "输出为文本格式，内容为语义化的摘要。" +
    "完整结果必须是文本摘要，不得包含非法字符。",
}
export type ShortDescAIResult = {
  desc: string
}

/**
 * 提取标签的配置信息
 */
const tagPrompt = <AiPrompt>{
  title: "自动提取标签",
  description: "为文章添加标签",
  key: "tags",
  content:
    "请为这篇文章生成标签，只处理文本，尽量返回中文标签。" +
    "单个标签不超过6个字符，多个标签用英文逗号分隔，最多返回5个标签。" +
    "如果单个标签是英文，英文字母必须全部小写并且每个单词之间用-拼接。" +
    "标签名称不能重复，不能包含任何除英文字母、-以及汉字以外的字符。" +
    "输出为 JSON 格式，键名为 tags，指令放在数组内，结果需放在 {} 内。" +
    "完整结果必须是合法JSON，不得包含非法 JSON 字符。",
}
export type TagAIResult = {
  tags: string[]
}

/**
 * 提取分类的配置信息
 */
const categoryPrompt = <AiPrompt>{
  title: "自动提取分类",
  description: "对文章内容进行分类",
  key: "categories",
  content:
    "请为这篇文章文章内容进行分类，只处理文本，尽量返回中文分类。" +
    "每个分类名称不超过6个字符，最多返回3个分类。" +
    "如果分类是英文，需要使用驼峰命名并且首字母大写。" +
    "输出为 JSON 格式，键名为 categories，结果需放在 {} 内。" +
    "完整结果必须是合法JSON，不得包含非法 JSON 字符。",
}
export type CategoryAIResult = {
  categories: string[]
}

/**
 * 自动提取工具的配置集合
 */
const prompt = {
  titlePrompt,
  shortDescPrompt,
  shortDescPromptStream,
  tagPrompt,
  categoryPrompt,
}

export { prompt }
