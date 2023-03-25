/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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

import jsYaml from "js-yaml"
import { appendStr } from "~/utils/strUtil"

/**
 * yaml转对象
 * @param yaml yaml格式的字符串
 */
export const yaml2Obj = (yaml: string): any => {
  yaml = yaml.replace("---\n", "")
  yaml = yaml.replace("---", "")
  return jsYaml.load(yaml, {})
}

/**
 * 对象转yaml字符串
 * @param obj
 */
export const obj2Yaml = (obj: any): string => {
  // https://npmmirror.com/package/js-yaml
  let res = jsYaml.dump(obj, {})
  res = appendStr("---\n", res, "---")
  return res
}
