import { describe } from 'vitest'
import ImageParser from '~/utils/parser/imageParser'
import logUtil from '~/utils/logUtil'

describe('ImageParser test', async () => {
  it('removeImages', async () => {
    const imageParser = new ImageParser()

    const content = '这是带图片的文章 ![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/project/sy-post-publisher/preview.png) \n 哈哈哈，有一个图片 ![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/project/sy-post-publisher/preview.png)完成'
    // const result = imageParser.removeImages(content)
    // logUtil.logInfo("removeImages result=>", result)

    // const content2 = "![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/project/sy-post-publisher/preview.png)"
    const result2 = await imageParser.replaceImagesWithBase64(content)
    logUtil.logInfo('replaceImagesWithBase64 result=>', result2)
  })
})
