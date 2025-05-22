import {
  AuthMode,
  BasePlugin,
  IPublishConfig,
  PlatformType,
  PublishOptions,
  PublishResult,
  SubPlatformType,
} from "siyuan-plugin-publisher-types"
import { BlogConfig, Post } from "zhi-blog-api"
import * as pkg from "../package.json"
import { t } from "./i18n"
import { WordPressClient } from "./wordpressClient"
import { PostData } from "@/types"

export class WordPressPlugin extends BasePlugin {
  readonly id = pkg.id
  readonly name = t("pluginName")
  readonly group = pkg.group || "unknown"
  readonly version = pkg.version
  readonly description = pkg.description
  readonly author = pkg.author
  readonly platformType = PlatformType.Wordpress
  readonly subPlatformType = SubPlatformType.Wordpress_Wordpress
  readonly authMode = AuthMode.API

  private wordpressClient: WordPressClient | null = null

  private getWordPressClient(blogCfg: typeof this.defaultConfig): WordPressClient {
    // 如果 WordPressClient 不存在，或者配置不一致，则创建新的 WordPressClient
    const config = this.wordpressClient?.getConfig()
    if (
      !this.wordpressClient ||
      config?.options?.endpoint !== blogCfg.endpoint ||
      config?.username !== blogCfg.username ||
      config?.password !== blogCfg.password
    ) {
      this.wordpressClient = new WordPressClient({
        options: {
          endpoint: blogCfg.endpoint,
          fetch: this.api.util.fetch as any,
        },
        username: blogCfg.username,
        password: blogCfg.password,
      })
    } else {
      this.logger.info("WordPressClient already exists, using the existing instance")
    }
    return this.wordpressClient
  }

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
        title: t("config.endpoint.title"),
        description: t("config.endpoint.description"),
      },
      username: {
        type: "string",
        title: t("config.username.title"),
        description: t("config.username.description"),
      },
      password: {
        type: "string",
        title: t("config.password.title"),
        description: t("config.password.description"),
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

  async getMetaData(publishCfg: IPublishConfig): Promise<{ flag: boolean; data: any; error?: string }> {
    try {
      const blogCfg = publishCfg.blogConfig as typeof this.defaultConfig
      const wordpressClient = this.getWordPressClient(blogCfg)

      // 尝试获取博客信息来验证平台是否可用
      const usersBlogs = await wordpressClient.getUsersBlogs()
      // this.logger.info("WordPress getUsersBlogs result:", usersBlogs)
      // this.logger.info("WordPress getUsersBlogs result str:", JSON.stringify(usersBlogs))

      return {
        flag: true,
        data: usersBlogs,
        error: t("messages.platformAvailable"),
      }
    } catch (error) {
      this.logger.error("WordPress getMetaData error:", error)
      return {
        flag: false,
        data: {},
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async publish(post: Post, options?: PublishOptions): Promise<PublishResult> {
    try {
      const blogCfg = options!.publishConfig.blogConfig! as typeof this.defaultConfig
      this.logger.info("blogCfg", blogCfg)

      const wordpressClient = this.getWordPressClient(blogCfg)

      // 准备发布数据
      const postData = {
        title: post.title,
        content: post.description,
        categories: post.categories,
        tags: post.mt_keywords.split(","),
        status: post.post_status!.toString() || "draft",
      } as PostData

      // 如果存在 postId，则更新文章，否则创建新文章
      let result
      if (post.postid) {
        result = await wordpressClient.editPost(post.postid, postData)
      } else {
        result = await wordpressClient.newPost(postData)
      }

      return {
        success: true,
        data: result as string,
      }
    } catch (error) {
      this.logger.error("WordPress publish error:", error)
      return {
        success: false,
        data: t("messages.publishFailed"),
        error: {
          name: "WordPressPublishError",
          code: "PUBLISH_ERROR",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        },
      }
    }
  }

  public migrateConfig(legencyBlogConfig: BlogConfig, blogConfig: typeof this.defaultConfig) {
    this.migrateField(blogConfig, legencyBlogConfig, "endpoint", "apiUrl")
    this.migrateField(blogConfig, legencyBlogConfig, "username", "username")
    this.migrateField(blogConfig, legencyBlogConfig, "password", "password")
  }
}

// 创建插件实例并导出
const plugin = new WordPressPlugin(pkg.id)
export default plugin
