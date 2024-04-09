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

import { describe, it } from "vitest"
import { MdUtils } from "~/src/utils/mdUtils.ts"

describe("test mdUtils", () => {
  it("test replaceSign", () => {
    const text = `
这是一个==忽略代码块==。里面有==另一个==忽略代码块==。==最里面的==忽略代码块==。
这个是\`\`\`代码块==不应该被匹配==。

\`哈哈哈哈==这个是单行代码不需要匹配==对对对\`

这是一个包含代码块的段落：
\`\`\`
function test() {
    console.log("这个是代码块内容");
} 
==这也也不应该匹配==
\`\`\`
这个是一个包含==内联代码==的例子。
`

    const replacedText = MdUtils.replaceSign(text, "=", "mark", "color: red;")
    console.log(replacedText)
  })
})
