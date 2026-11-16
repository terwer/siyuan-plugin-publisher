/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import katex from "katex"

/**
 * 公式渲染
 *
 * @author terwer
 * @since 1.18.6
 */
class KatexUtils {

  /**
   * 获得要渲染 KaTeX 表达式的 HTML
   *
   * @param mathExpression katex
   */
  public static renderToString(mathExpression: string) {
    return katex.renderToString(mathExpression)
  }
}

export default KatexUtils
