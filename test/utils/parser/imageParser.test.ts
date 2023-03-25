import { describe } from "vitest"
import { ImageParser } from "~/utils/parser/imageParser"

describe("test imageParser", () => {
  it("test local image", function () {
    const imageParser = new ImageParser()
    const content =
      '​![这是个图片锚文本](assets/image-20230325160900-tfvy42x.png "这是个图片标题"){: parent-style="max-width: 714px;"}​'
    const images = imageParser.parseImagesToArray(content)
    console.log(images)
  })
})
