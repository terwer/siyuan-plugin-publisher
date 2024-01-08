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

import * as cheerio from "cheerio"

/**
 * 知乎工具类
 *
 * @author terwer
 * @since 1.6.0
 */
class ZhihuUtils {
  /**
   * 处理HTML中的表格，将表格头部移动到表格体部分
   *
   * @param html - 包含表格的HTML字符串
   * @returns 处理后的HTML字符串
   */
  public static processZHTable(html: string): string {
    // 使用Cheerio加载HTML
    const $ = cheerio.load(html)

    // 获取thead内容
    const theadContent = $("table thead").html()
    // 移除thead
    $("table thead").remove()
    // 将thead内容添加到tbody的第一个位置
    $("table tbody tr:first-child").before(theadContent)

    // 选择表格元素并修改属性
    const table = $("table")
    table
      .attr("data-draft-node", "block")
      .attr("data-draft-type", "table")
      .attr("data-size", "normal")
      .attr("data-row-style", "normal")

    return $.html()
  }

  public static processZHMath(html: string): string {
    // 使用Cheerio加载HTML
    const $ = cheerio.load(html, { xmlMode: true, decodeEntities: false })

    // 处理两个$符号和一个$符号包裹的公式
    const mathRegex = /\$\$([^\$]+)\$\$|\$([^\$]+)\$/g

    const elems = $("*:not(pre)")
    elems.each((_index, element) => {
      const content = $(element).html() ?? ""
      const newContent = content.replace(mathRegex, (_match, doubleDollarContent, singleDollarContent) => {
        const mathContent = doubleDollarContent || singleDollarContent
        return `<img eeimg="1" src="//www.zhihu.com/equation?tex=${encodeURIComponent(mathContent)}" 
            alt="${mathContent}" />`
      })
      $(element).html(newContent)
    })

    // 输出修改后的HTML
    return $.html()

    //   // 使用Cheerio加载HTML
    //   const $ = cheerio.load(html, { xmlMode: true })
    //
    //   // // 选择所有带有类名"language-math"的<span>元素
    //   // $("span.language-math").each((index, element) => {
    //   //   // 获取元素的文本内容
    //   //   const mathContent = $(element).text()
    //   //
    //   //   // 创建替代的<img>标签
    //   //   const imgTag = `<img eeimg="1" src="//www.zhihu.com/equation?tex=${encodeURIComponent(mathContent)}"
    //   //     alt="${mathContent}" />`
    //   //
    //   //   // 用新的<img>标签替换原始元素
    //   //   $(element).replaceWith(imgTag)
    //   // })
    //   //
    //   // // 选择所有带有类名"language-math"的<div>元素
    //   // $("div.language-math").each((index, element) => {
    //   //   // 获取元素的文本内容
    //   //   const mathContent = $(element).text()
    //   //
    //   //   // 创建替代的<img>标签
    //   //   const imgTag = `<p><img eeimg="1" src="//www.zhihu.com/equation?tex=${encodeURIComponent(mathContent)}"
    //   //     alt="${mathContent}"/></p>`
    //   //
    //   //   // 用新的<img>标签替换原始元素
    //   //   $(element).replaceWith(imgTag)
    //   // })
    //
    //   // 处理两个$符号包裹的公式
    //   const doubleDollarRegex = /\$\$([^$]+)\$\$/g
    //   $("*:not(pre)").each((index, element) => {
    //     const content = $(element).html()
    //     const newContent = content.replace(doubleDollarRegex, (match, mathContent) => {
    //       return `<img eeimg="1" src="//www.zhihu.com/equation?tex=${encodeURIComponent(mathContent)}"
    //       alt="${mathContent}" />`
    //     })
    //     $(element).html(newContent)
    //   })
    //
    //   // 处理一个$符号包裹的公式
    //   const singleDollarRegex = /\$([^$]+)\$/g
    //   $("*:not(pre)").each((index, element) => {
    //     const content = $(element).html()
    //     const newContent = content.replace(singleDollarRegex, (match, mathContent) => {
    //       return `<img eeimg="1" src="//www.zhihu.com/equation?tex=${encodeURIComponent(mathContent)}"
    //       alt="${mathContent}" />`
    //     })
    //     $(element).html(newContent)
    //   })
    //
    //   // 输出修改后的HTML
    //   return $.html()
  }
}

export default ZhihuUtils
