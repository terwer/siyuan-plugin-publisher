import { IPlugin, PlatformCapabilities, PublishOptions, PublishResult } from "siyuan-plugin-publisher-types"
import { Post } from "zhi-blog-api"
import { AuthMode, PlatformType, SubPlatformType } from "siyuan-plugin-publisher-types"
import * as pkg from "../package.json"

export class WordPressPlugin implements IPlugin {
  readonly id = pkg.id
  readonly name = pkg.displayName || pkg.name
  readonly group = pkg.group || "unknown"
  readonly version = pkg.version
  readonly description = pkg.description
  readonly author = pkg.author

  readonly capabilities: PlatformCapabilities = {
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

  readonly configSchema = {
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

  readonly defaultConfig = {
    endpoint: "",
    username: "",
    password: "",
  }

  private config: Record<string, any> = {}

  async init(config: Record<string, any>): Promise<void> {
    this.config = { ...this.defaultConfig, ...config }
  }

  async destroy(): Promise<void> {
    this.config = {}
  }

  async publish(post: Post, options?: PublishOptions): Promise<PublishResult> {
    try {
      // TODO: 实现发布逻辑
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

  getPlatformType(): PlatformType {
    return PlatformType.Wordpress
  }

  getSubPlatformType(): SubPlatformType {
    return SubPlatformType.Wordpress_Wordpress
  }

  getAuthMode(): AuthMode {
    return AuthMode.API
  }

  validateConfig(config: Record<string, any>): { valid: boolean; error?: string } {
    try {
      // TODO: 实现配置验证逻辑
      return { valid: true }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid configuration",
      }
    }
  }
}

// 创建插件实例并挂载到 window.pt 对象
const plugin = new WordPressPlugin()
window.pt = window.pt || {}
window.pt[plugin.id] = plugin 