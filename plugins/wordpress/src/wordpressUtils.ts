import XMLRPCClient from "siyuan-plugin-publisher-common-xmlrpc"

export interface WordPressConfig {
  endpoint: string
  username: string
  password: string
}

export interface PostData {
  title: string
  content: string
  categories?: string[]
  tags?: string[]
  status?: "publish" | "draft" | "private"
}

export class WordPressUtils {
  private client: XMLRPCClient
  private config: WordPressConfig

  constructor(config: WordPressConfig) {
    this.config = config
    this.client = new XMLRPCClient({
      endpoint: config.endpoint,
    })
  }

  /**
   * 获取博客信息
   */
  async getBlogInfo(): Promise<any> {
    return this.client.methodCall("wp.getProfile", this.config.username, this.config.password)
  }

  /**
   * 创建新文章
   */
  async createPost(postData: PostData): Promise<any> {
    const content = {
      title: postData.title,
      description: postData.content,
      categories: postData.categories || [],
      mt_keywords: postData.tags?.join(",") || "",
      post_status: postData.status || "draft",
    }

    return this.client.methodCall(
      "metaWeblog.newPost",
      1, // blogId
      this.config.username,
      this.config.password,
      content,
      true, // publish
    )
  }

  /**
   * 更新文章
   */
  async updatePost(postId: string, postData: PostData): Promise<any> {
    const content = {
      title: postData.title,
      description: postData.content,
      categories: postData.categories || [],
      mt_keywords: postData.tags?.join(",") || "",
      post_status: postData.status || "draft",
    }

    return this.client.methodCall(
      "metaWeblog.editPost",
      postId,
      this.config.username,
      this.config.password,
      content,
      true, // publish
    )
  }

  /**
   * 获取文章列表
   */
  async getPosts(numberOfPosts: number = 10): Promise<any> {
    return this.client.methodCall(
      "metaWeblog.getRecentPosts",
      1, // blogId
      this.config.username,
      this.config.password,
      numberOfPosts,
    )
  }

  /**
   * 获取文章详情
   */
  async getPost(postId: string): Promise<any> {
    return this.client.methodCall(
      "metaWeblog.getPost",
      postId,
      this.config.username,
      this.config.password,
    )
  }

  /**
   * 删除文章
   */
  async deletePost(postId: string): Promise<any> {
    return this.client.methodCall(
      "blogger.deletePost",
      "", // appKey
      postId,
      this.config.username,
      this.config.password,
      true, // publish
    )
  }

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<any> {
    return this.client.methodCall(
      "wp.getCategories",
      1, // blogId
      this.config.username,
      this.config.password,
    )
  }

  /**
   * 获取标签列表
   */
  async getTags(): Promise<any> {
    return this.client.methodCall(
      "wp.getTags",
      1, // blogId
      this.config.username,
      this.config.password,
    )
  }
} 