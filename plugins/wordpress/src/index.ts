import { AuthMode, BasePlugin, PlatformType, PublishOptions, PublishResult, SubPlatformType } from "siyuan-plugin-publisher-types"
import { Post } from "zhi-blog-api"
import * as pkg from "../package.json"

export class WordPressPlugin extends BasePlugin {
  readonly id = pkg.id
  readonly name = pkg.displayName || pkg.name
  readonly group = pkg.group || "unknown"
  readonly version = pkg.version
  readonly description = pkg.description
  readonly author = pkg.author
  readonly platformType = PlatformType.Wordpress
  readonly subPlatformType = SubPlatformType.Wordpress_Wordpress
  readonly authMode = AuthMode.API

  public readonly capabilities = {
    supportsCategories: true,
    supportsTags: true,
    supportsCustomFields: true,
    supportsMediaUpload: true,
    supportsDraft: true,
    supportsScheduledPublish: true,
    supportsCustomTemplates: true,
    supportsCustomDomain: true,
    supportsCustomCSS: true,
    supportsCustomJS: true,
  }

  public readonly configSchema = {
    type: "object",
    properties: {
      endpoint: {
        type: "string",
        title: "WordPress REST API Endpoint",
        description: "Your WordPress site's REST API endpoint (e.g., https://your-site.com/wp-json/wp/v2)",
      },
      username: {
        type: "string",
        title: "Username",
        description: "WordPress username",
      },
      password: {
        type: "string",
        title: "Application Password",
        description: "WordPress application password",
        format: "password",
      },
    },
    required: ["endpoint", "username", "password"],
  }

  public readonly defaultConfig = {
    endpoint: "",
    username: "",
    password: "",
  }

  async publish(post: Post, options?: PublishOptions): Promise<PublishResult> {
    try {
      this.logger.info("Publishing post:", post.title)
      this.logger.debug("ull post content:", post)
      // TODO: 实现发布逻辑

      this.logger.info("test siyuan api",this.api.siyuan)
      this.api.siyuan.kernelApi.pushMsg(
          {
            "msg": "test",
            "timeout": 7000
          }
      )

      // === Lodash 测试开始 ===
      const numbers = [1, 2, 3, 4, 5];
      const doubled = this.api.util.Lodash.map(numbers, n => n * 2);
      this.logger.info("Lodash test - Doubled numbers:", doubled);
      // === Lodash 测试结束 ===

      // === fetch 测试开始 ===
      const res = await this.api.util.fetch("https://www.baidu.com", { contentType: "text/html" })
      this.logger.info("fetch test", res)
      // 读取 body
      const resText =  res.body
      this.logger.info("fetch test text", resText)
      // 读取 headers
      const headers = res.headers
      Object.entries(headers).forEach(([key, value]) => {
        this.logger.info(`${key}: ${value}`)
      })
      this.logger.info("res.headers", res.headers)
      // === fetch 测试结束 ===

      return {
        success: true,
        data: "Post published successfully",
      }
    } catch (error) {
      return {
        success: false,
        data: "Failed to publish to WordPress",
        error: {
          name: "WordPressPublishError",
          code: "PUBLISH_ERROR",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        },
      }
    }
  }
}

// 创建插件实例
new WordPressPlugin(pkg.id)