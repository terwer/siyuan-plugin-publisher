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

  it("test replace", () => {
    const imageParser = new ImageParser()

    const replaceMap = {
      "63bd812969c9458c6be98dff6ba9541b": {
        name: "image-20230326112608-uhk49kj.png",
        hash: "63bd812969c9458c6be98dff6ba9541b",
        originUrl: "assets/image-20230326112608-uhk49kj.png",
        url: "https://img1.terwer.space/api/public/202303261126045.png",
        alt: "image",
        title: "",
        isLocal: false,
      },
      "333a739dd1b6a3ecbcff34d162dd96c6": {
        name: "image-20230326112821-n4e5h1k.png",
        hash: "333a739dd1b6a3ecbcff34d162dd96c6",
        originUrl: "assets/image-20230326112821-n4e5h1k.png",
        url: "https://img1.terwer.space/api/public/202303261137833.png",
        alt: "image2",
        title: "",
        isLocal: false,
      },
      "60d68bcc4ff6a8f1956412efa141e58e": {
        name: "image-20230326112843-fqdp0tm.png",
        hash: "60d68bcc4ff6a8f1956412efa141e58e",
        originUrl: "assets/image-20230326112843-fqdp0tm.png",
        url: "https://img1.terwer.space/api/public/202303261129815.png",
        alt: "image3333",
        title: "哈哈哈哈",
        isLocal: false,
      },
    }
    const content = {
      mdContent:
        '# 图片备注测试\n\n这是测试文字\n\n外链图片\n\n​![](https://www.terwer.space/img/logo.png)​\n\n‍\n\n本地assets图片\n\n​![image](assets/image-20230326112608-uhk49kj.png)​\n\n‍\n\n改备注\n\n​![image2](assets/image-20230326112821-n4e5h1k.png)​\n\n‍\n\n改备注和标题\n\n​![image3333](assets/image-20230326112843-fqdp0tm.png "哈哈哈哈")​\n',
    }.mdContent
    const replacedContent = imageParser.replaceImagesWithImageItemArray(content, replaceMap)
    console.log(replacedContent)
  })
})
