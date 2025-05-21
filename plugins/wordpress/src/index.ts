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
      this.logger.info('Publishing post:', post.title)
      this.logger.debug('Full post content:', post)
      // TODO: 实现发布逻辑

      // === Lodash 测试开始 ===
      const numbers = [1, 2, 3, 4, 5];
      const doubled = this.api.util.Lodash.map(numbers, n => n * 2);
      this.logger.info('Lodash test - Doubled numbers:', doubled);
      // === Lodash 测试结束 ===

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