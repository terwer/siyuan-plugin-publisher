/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
}

export { AiConstants }
