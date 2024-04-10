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
    const content = `
    ## 核心要点

daima\`vdvd==sdcdsc==sdcd\`​

\`\`\`js
sdvsdv=sdcdscds==dsvdsvsd==
==sdvdsv==
sdvdsvsv==dsvs==
sdvdsvd**sdvsdv**==
sdfdsfdsf
\`\`\`

这是公式

$aaa==bbb==sdvfdvf**dsvfdv**$​

‍

$$
E=mc2 ==dfd== vfvfvdvdfdfvfdvf**dvf**vdfvdfdv
$$

‍

* 自定义持久层框架的核心要点是什么？

  1. 解析配置文件

     * 数据库配置信息
     * sql **的**封装
  2. 构建 SqlSessionFactory，注==意这里的 openS==ession 方法
  3. 拿到 SqlSesion

     * 定义 SqlSession 基**本方**法，水**电费**。
     * 封装具体的执行**逻辑**，Executor

       Execute 的 query 方法就对应 jdbc 操作
     * 优化，使用 JDK 动态**代理**避免 st**atem**entId 的硬编码
  4. 将 SqlSession 的操作封装到 DAO 层
    `
    let md = content
    md = MdUtils.replaceSignToAnother(md, "==", " **", "** ")
    const result = md
    console.log(result)
  })

  it("test replaceSignToAnother2", () => {
    const text = "这是一个示例文本，包含标记符号 ==标记文字==，需要替换为开头和结尾的内容。$A$ 这里是另一个示例 ==。"
    const processedText = MdUtils.replaceSignToAnother(text, "==", "**", "**")
    console.log(processedText)
  })

  it("test replaceSignToAnother3", () => {
    const text = "这是一个示例文本，包含标记符号**test**，需要替换为开头和结尾的内容。$A$ 这里是另一个示例 **。"
    const processedText = MdUtils.replaceSignToAnother(text, "**", " **", "** ")
    console.log(processedText)
  })
})
