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

import { describe } from "vitest"
import { ImageParser } from "~/utils/parser/imageParser"

describe("test imageParser", () => {
  it("test1", () => {
    const imageParser = new ImageParser()
    const content =
      '​![远程锚文本](https://img1.terwer.space/202303232307565.png "远程图片标题"){: parent-style="max-width: 714px;"}'
    const images = imageParser.parseImagesToArray(content)
    console.log(images)
  })

  it("test2", () => {
    const imageParser = new ImageParser()
    const content =
      '​![本地锚文本](assets/image-20230325160900-tfvy42x.png "这是个图片标题"){: parent-style="max-width: 714px;"}​'
    const images = imageParser.parseImagesToArray(content)
    console.log(images)
  })

  it("test3", () => {
    const imageParser = new ImageParser()
    const markdownText = `
# 这是一个标题

这是一段普通文本，其中包含了三个图片链接：

![图片1](assets/image1.png)
![图片2](assets/image2.png){: style="width: 50%;"}
![图片3](http://example.com/assets/image3.png)

这是另一段普通文本。
`
    const parsedImages = imageParser.parseImagesToArray(markdownText)
    console.log(parsedImages)
  })
})
