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
 * 文档工具类
 */
class PageUtil {
  public static getPageId() {
    // 查找包含 protyle 类但不包含 fn__none 的 div 元素
    const protyleElement = document.querySelector("div.protyle:not(.fn__none)")
    // 在该 div 元素下查找包含 protyle-title 类的 div 元素，并查找 data-node-id 属性
    const protyleTitleElement = protyleElement?.querySelector("div.protyle-title")
    // 如果该元素存在 data-node-id 属性，则获取其值并返回，否则返回空字符串
    return protyleTitleElement?.hasAttribute("data-node-id") ? protyleTitleElement.getAttribute("data-node-id") : ""
  }
}

export default PageUtil
