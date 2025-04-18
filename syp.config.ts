/*
 * Copyright (c) 2023-2024, Terwer . All rights reserved.
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

import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"

interface ISypConfig {
  // version?: ""
  lang?: "zh_CN" | "en_US"
  // 平台总的集合
  [DYNAMIC_CONFIG_KEY]?: any

  // [平台key1]: {平台配置1}
  // [平台key2]: {平台配置2}

  // [siyuan文档ID]: {
  //  [custom-slug]: 初始化生成，初始化可读取siyuan属性，但是之后不能再修改
  //  [动态平台1postid的key]: 对应平台的文章ID
  //  [动态平台2postid的key]: 对应平台的文章ID
  // }

  [key: string]: any
}

export const SypConfig: ISypConfig = {
  lang: "zh_CN",
  [DYNAMIC_CONFIG_KEY]: "{}",
}

export { type ISypConfig }
