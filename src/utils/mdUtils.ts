/*
 * Copyright (c) 2024, Terwer . All rights reserved.
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
 * Md 处理工具类
 *
 * @author terwer
 * @since 1.21.0
 * @version 1.21.0
 */
class MdUtils {
  // 创建正则表达式，匹配标记符号开头和结尾的内容，假设这个内容为 A，，那么排除行内公式、多行公式、行内代码和多行代码里面的 A
  // 要求：
  // 1、开头前面不是反引号 `
  // 2、开头前面不是三个反引号 + 任意字符（包括换行）
  // 3、开头前面不是 $ + 任意字符
  // 4、开头前面不是 $$ + 任意字符（包括换行）
  // 4、结尾后面不是 任意字符）+反引号 `
  // 4、结尾后面不是 任意字符（包括换行）+三个反引
  // 4、结尾后面不是 任意字符（包括换行）+$$
  // 4、结尾后面不是 任意字符）+$
  /**
   * 该正则表达式用于匹配指定标记符号之间的内容，并且在匹配时考虑了特定的限制条件。在匹配时，会确保标记符号前后不是特定的字符，同时也会避免匹配到特定的字符条件之后。
   *
   * 针对 sign 为 == 和 ** 的情况，我们需要特殊处理 * 字符。由于 * 在正则表达式中有特殊含义，需要进行转义处理。
   *
   * 以下是每个字符的详细解释：
   *
   * (?<!\): 负向后行断言，确保匹配的内容前面不是反引号（`）。
   * (?<!\``[\s\S])`: 负向后行断言，确保匹配的内容前面不是三个反引号后跟任意字符（包括换行）。
   * (?<!\$[\s\S]): 负向后行断言，确保匹配的内容前面不是 $ 后跟任意字符（包括换行）。
   * ${escapedSign}: 匹配转义后的标记符号。
   * (.*?[^${escapedSign}]): 非贪婪匹配任意字符，直到遇到不是标记符号的字符。
   * ${escapedSign}: 匹配转义后的标记符号。
   * (?![\s\S]*?\): 负向前行断言，确保匹配的内容后面不是反引号（`）。
   * (?![\s\S]*?\``)`: 负向前行断言，确保匹配的内容后面不是三个反引号。
   * (?![\s\S]*?\$): 负向前行断言，确保匹配的内容后面不是 $。
   * (?![\s\S]*?\$\$): 负向前行断言，确保匹配的内容后面不是两个 $。
   *
   * @param {string} text - 待处理的文本
   * @param {string} sign - 要替换的标记符号
   * @param {string} open - 替换后的开头内容
   * @param {string} close - 替换后的结尾内容
   * @returns {string} 处理后的文本
   */
  public static replaceSignToAnother(text: string, sign: string, open: string, close: string): string {
    // // 对于 * 字符进行转义处理
    // const escapedSign = sign.replace(/\*/g, "\\*")
    //
    // const regex = new RegExp(
    //   `(?<!\`)(?<!\`\`\`[\s\S])(?<!\$[\s\S])${escapedSign}(.*?[^${escapedSign}])${escapedSign}(?![\s\S]*?\`)(?![\s\S]*?\`\`\`)(?![\s\S]*?\$)(?![\s\S]*?\$\$)`,
    //   "g"
    // )
    //
    // return text.replace(regex, (match, group) => {
    //   return `${open}${group}${close}`
    // })

    const escapedSign = sign.replace(/\*/g, "\\*")

    const codeBlocks = []
    const inlineCodes = []
    const formulas = []
    const inlineFormulas = []

    // 提取代码块、行内代码、公式和行内公式
    const extractedText = text.replace(
      new RegExp("```[\\s\\S]*?```|`.*?`|\\$\\$[\\s\\S]*?\\$\\$|\\$.*?\\$", "g"),
      (match) => {
        if (match.startsWith("```")) {
          codeBlocks.push(match)
          return `__PUBLISHER_PLACEHOLDER_CODEBLOCK${codeBlocks.length - 1}`
        } else if (match.startsWith("`")) {
          inlineCodes.push(match)
          return `__PUBLISHER_PLACEHOLDER_INLINECODE${inlineCodes.length - 1}`
        } else if (match.startsWith("$$")) {
          formulas.push(match)
          return `__PUBLISHER_PLACEHOLDER_FORMULA${formulas.length - 1}`
        } else if (match.startsWith("$")) {
          inlineFormulas.push(match)
          return `__PUBLISHER_PLACEHOLDER_INLINEFORMULA${inlineFormulas.length - 1}`
        }
      }
    )

    const regex = new RegExp(
      `(?<!\`)(?<!\`\`\`[\\s\\S])(?<!\\$[\\s\\S])(?<!\\$\$[\\s\\S])${escapedSign}(.*?[^${escapedSign}])${escapedSign}(?![\\s\\S]*?\`)(?![\\s\\S]*?\`\`\`)(?![\\s\\S]*?\\$)(?![\\s\\S]*?\\$\$)`,
      "g"
    )

    // 在提取后的文本中进行替换操作
    const replacedText = extractedText.replace(regex, (match, group) => {
      return `${open}${group}${close}`
    })

    // 还原代码块、行内代码、公式和行内公式
    const finalText = replacedText.replace(
      /(__PUBLISHER_PLACEHOLDER_CODEBLOCK(\d+))|(__PUBLISHER_PLACEHOLDER_INLINECODE(\d+))|(__PUBLISHER_PLACEHOLDER_FORMULA(\d+))|(__PUBLISHER_PLACEHOLDER_INLINEFORMULA(\d+))/g,
      (
        match,
        codeBlockRef,
        codeBlockIndex,
        inlineCodeRef,
        inlineCodeIndex,
        formulaRef,
        formulaIndex,
        inlineFormulaRef,
        inlineFormulaIndex
      ) => {
        if (codeBlockRef) {
          return codeBlocks[parseInt(codeBlockIndex, 10)]
        } else if (inlineCodeRef) {
          return inlineCodes[parseInt(inlineCodeIndex, 10)]
        } else if (formulaRef) {
          return formulas[parseInt(formulaIndex, 10)]
        } else if (inlineFormulaRef) {
          return inlineFormulas[parseInt(inlineFormulaIndex, 10)]
        }
      }
    )

    return finalText
  }
}

export { MdUtils }
