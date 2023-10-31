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
 * AI 常量
 *
 * https://github.com/transitive-bullshit/chatgpt-api/blob/main/src/chatgpt-api.ts#L443
 *
 * Use up to 4096 tokens (prompt + response), but try to leave 1000 tokens
 * for the response.
 */
enum AiConstants {
  /**
   * 最大输入长度
   */
  MAX_INPUT_TOKEN_LENGTH = 3000,

  /**
   * 最大指令长度
   */
  // MAX_PROMPT_LENGTH = 96,

  /**
   * 标题返回字符限制
   */
  // MAX_RESP_TITLE_LENGTH = 255,
}

export { AiConstants }
