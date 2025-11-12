/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 图片工具类
 */
class ImageUtils {
  /**
   * 生成匹配包含指定图片URL的img标签的正则表达式
   * @param {string} imageUrl - 图片URL
   * @param {Object} options - 配置选项
   * @returns {RegExp} 正则表达式对象
   */
  public static genImageRegex(imageUrl, options = {} as any) {
    const {
      exactMatch = false, // 是否精确匹配URL
      caseSensitive = false, // 是否区分大小写
      allowQueryParams = true, // 是否允许URL包含查询参数
      escapeSpecialChars = true, // 是否转义特殊字符
    } = options

    // 处理URL转义
    let processedUrl = imageUrl
    if (escapeSpecialChars) {
      processedUrl = this.escapeRegExp(processedUrl)
    }

    // 构建正则模式
    let urlPattern
    if (exactMatch) {
      // 精确匹配整个URL
      urlPattern = allowQueryParams
        ? `${processedUrl}(?:\\?[^"'\s<>]*)?` // 允许查询参数
        : processedUrl
    } else {
      // 宽松匹配，URL可以是完整路径的一部分
      urlPattern = allowQueryParams
        ? `[^"'\s<>]*${processedUrl}[^"'\s<>]*(?:\\?[^"'\s<>]*)?`
        : `[^"'\s<>]*${processedUrl}[^"'\s<>]*`
    }

    // 构建完整的img标签正则
    const pattern = `<img\\s[^>]*?src\\s*=\\s*["']?(${urlPattern})["']?[^>]*>`
    return new RegExp(pattern, caseSensitive ? "g" : "gi")
  }

  public static genMdImageRegex(imageUrl: string, options = {} as any) {
    const {
      exactMatch = false, // 是否精确匹配URL
      caseSensitive = false, // 是否区分大小写
      allowQueryParams = true, // 是否允许URL包含查询参数
      escapeSpecialChars = true, // 是否转义特殊字符
    } = options

    // 处理URL转义
    let processedUrl = imageUrl
    if (escapeSpecialChars) {
      processedUrl = this.escapeRegExp(processedUrl)
    }

    // 构建正则模式
    let urlPattern
    if (exactMatch) {
      // 精确匹配整个URL
      urlPattern = allowQueryParams
        ? `${processedUrl}(?:\\?[^\\]\\)\\s]*)?` // 允许查询参数
        : processedUrl
    } else {
      // 宽松匹配，URL可以是完整路径的一部分
      urlPattern = allowQueryParams
        ? `[^\\]\\)\\s]*${processedUrl}[^\\]\\)\\s]*(?:\\?[^\\]\\)\\s]*)?`
        : `[^\\]\\)\\s]*${processedUrl}[^\\]\\)\\s]*`
    }

    // 构建完整的Markdown图片正则
    const pattern = `!\\[[^\\]]*\\]\\(\\s*(${urlPattern})\\s*(?:"[^"]*")?\\s*\\)`

    return new RegExp(pattern, caseSensitive ? "g" : "gi")
  }

  /**
   * 转义正则表达式特殊字符
   * @param {string} string - 原始字符串
   * @returns {string} 转义后的字符串
   */
  private static escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  // /**
  //  * 从HTML中提取包含指定图片URL的img标签
  //  * @param {string} html - HTML内容
  //  * @param {string} imageUrl - 图片URL
  //  * @param {Object} options - 配置选项
  //  * @returns {string[]} 匹配的img标签数组
  //  */
  // private static extractImageTags(html, imageUrl, options = {}) {
  //   const regex = this.genImageRegex(imageUrl, options)
  //   const matches = html.match(regex)
  //   return matches || []
  // }
  //
  // /**
  //  * 检查HTML中是否包含指定图片URL的img标签
  //  * @param {string} html - HTML内容
  //  * @param {string} imageUrl - 图片URL
  //  * @param {Object} options - 配置选项
  //  * @returns {boolean} 是否包含
  //  */
  // // private static hasImageTag(html, imageUrl, options = {}) {
  // //   const regex = this.genImageRegex(imageUrl, options)
  // //   return regex.test(html)
  // // }
  //
  // /**
  //  * 替换HTML中指定图片URL的img标签
  //  * @param {string} html - HTML内容
  //  * @param {string} imageUrl - 原图片URL
  //  * @param {string|Function} replacement - 替换内容或函数
  //  * @param {Object} options - 配置选项
  //  * @returns {string} 替换后的HTML
  //  */
  // private static replaceImageTags(html, imageUrl, replacement, options = {}) {
  //   const regex = this.genImageRegex(imageUrl, options)
  //   return html.replace(regex, replacement)
  // }
  //
  // /**
  //  * 获取图片URL（从img标签中提取src属性）
  //  * @param {string} imgTag - img标签字符串
  //  * @returns {string|null} 图片URL
  //  */
  // private static extractImageUrl(imgTag) {
  //   const srcRegex = /src\s*=\s*["']?([^"'\s>]+)["']?/i
  //   const match = imgTag.match(srcRegex)
  //   return match ? match[1] : null
  // }
  public static hasImageTag(html: string) {
    const imgRegex = /<img\s[^>]*?src\s*=\s*["']?([^"'\s>]+)["']?[^>]*>/i
    return imgRegex.test(html)
  }

  public static extractImageUrls(html: string): string[] {
    const imgRegex = /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi
    return Array.from(html.matchAll(imgRegex))
      .map((match) => match[1])
      .filter((src) => src && src.trim().length > 0)
  }

  public static getNameFromImageUrl(imageUrl: any) {
    const fileName = imageUrl.split("/").pop()
    // 还有去掉后缀
    const fileNameWithoutExt = fileName.split(".")[0]
    return fileNameWithoutExt || ""
  }
}

// // 使用示例
// const testHTML = `
// <div>
//   <img src="https://example.com/image1.jpg" alt="图片1">
//   <img src='https://example.com/image2.jpg' class="thumb">
//   <img src=https://example.com/image3.jpg width="100">
//   <img src="https://example.com/image4.jpg?width=100&height=100" alt="带参数">
//   <img data-src="lazy.jpg" src="https://example.com/actual.jpg">
// </div>
// `
//
// // 1. 生成正则表达式
// const regex = ImageUtils.genImageRegex("https://example.com/image1.jpg")
// console.log("生成的regex:", regex)
//
// // 2. 提取包含特定图片URL的img标签
// const imageTags = ImageUtils.extractImageTags(testHTML, "https://example.com/image1.jpg")
// console.log("提取的img标签:", imageTags)
//
// // 3. 检查是否包含
// const hasImage = ImageUtils.hasImageTag(testHTML, "https://example.com/image2.jpg")
// console.log("是否包含图片:", hasImage)
//
// // 4. 替换图片标签
// const newHTML = ImageUtils.replaceImageTags(
//   testHTML,
//   "https://example.com/image1.jpg",
//   '<img src="https://newdomain.com/new-image.jpg" alt="新图片">'
// )
// console.log("替换后的HTML:", newHTML)
//
// // 5. 从img标签中提取URL
// const imgTag = '<img src="https://example.com/test.jpg" alt="test">'
// const extractedUrl = ImageUtils.extractImageUrl(imgTag)
// console.log("提取的URL:", extractedUrl)
//
// // 高级用法 - 使用选项
// const advancedRegex = ImageUtils.genImageRegex("image.jpg", {
//   exactMatch: false, // 模糊匹配（包含该文件名即可）
//   caseSensitive: false, // 不区分大小写
//   allowQueryParams: true, // 允许URL参数
//   escapeSpecialChars: true, // 转义特殊字符
// })

export default ImageUtils
