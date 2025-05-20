// src/index.ts
import { AuthMode, PlatformType, SubPlatformType } from "siyuan-plugin-publisher-types";
var WordPressPlugin = class {
  constructor() {
    this.id = "wordpress";
    this.name = "WordPress";
    this.group = "blog";
    this.version = "0.0.1";
    this.description = "WordPress publishing platform";
    this.author = "Terwer";
    this.capabilities = {
      supportsCategories: true,
      supportsTags: true,
      supportsCustomFields: true,
      supportsMediaUpload: true,
      supportsDraft: true,
      supportsScheduledPublish: true,
      supportsCustomTemplates: true,
      supportsCustomDomain: true,
      supportsCustomCSS: true,
      supportsCustomJS: true
    };
    this.configSchema = {
      type: "object",
      properties: {
        endpoint: {
          type: "string",
          title: "WordPress REST API Endpoint",
          description: "Your WordPress site's REST API endpoint (e.g., https://your-site.com/wp-json/wp/v2)"
        },
        username: {
          type: "string",
          title: "Username",
          description: "WordPress username"
        },
        password: {
          type: "string",
          title: "Application Password",
          description: "WordPress application password",
          format: "password"
        }
      },
      required: ["endpoint", "username", "password"]
    };
    this.defaultConfig = {
      endpoint: "",
      username: "",
      password: ""
    };
    this.config = {};
  }
  async init(config) {
    this.config = { ...this.defaultConfig, ...config };
  }
  async destroy() {
    this.config = {};
  }
  async publish(post, options) {
    try {
      return {
        success: true,
        data: "Post published successfully"
      };
    } catch (error) {
      return {
        success: false,
        data: "Failed to publish to WordPress",
        error: {
          name: "WordPressPublishError",
          code: "PUBLISH_ERROR",
          message: error instanceof Error ? error.message : "Unknown error occurred"
        }
      };
    }
  }
  getPlatformType() {
    return PlatformType.Wordpress;
  }
  getSubPlatformType() {
    return SubPlatformType.Wordpress_Wordpress;
  }
  getAuthMode() {
    return AuthMode.API;
  }
  validateConfig(config) {
    try {
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid configuration"
      };
    }
  }
};
var index_default = WordPressPlugin;
export {
  WordPressPlugin,
  index_default as default
};
//# sourceMappingURL=index.js.map