import XMLRPCClient, { XMLRPCClientOptions } from "siyuan-plugin-publisher-common-xmlrpc"
import { PostData } from "@/types"

export interface WordPressConfig {
  options: XMLRPCClientOptions
  username: string
  password: string
}

/**
 * WordPress客户端
 * @see [XML-RPC_WordPress_API](https://codex.wordpress.org/XML-RPC_WordPress_API)
 */
export class WordPressClient {
  private client: XMLRPCClient
  private readonly config: WordPressConfig

  constructor(config: WordPressConfig) {
    this.config = config
    this.client = new XMLRPCClient(config.options)
  }

  getConfig() {
    return this.config
  }

  // Posts API
  // ----------------------------------
  /**
   * 获取文章详情
   * @param {string} postId 文章ID
   * @returns {Promise<any>} 文章数据
   * @throws {Error} 如果调用失败
   * @see [wp.getPost](https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.getPost)
   */
  async getPost(postId: string): Promise<any> {
    return this.client.methodCall("wp.getPost", 1, this.config.username, this.config.password, postId)
  }

  /**
   * 获取文章列表
   * @param {number} numberOfPosts 要获取的文章数量
   * @returns {Promise<any>} 文章列表
   * @throws {Error} 如果调用失败
   * @see [wp.getPosts](https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.getPosts)
   */
  async getPosts(numberOfPosts: number = 10): Promise<any> {
    return this.client.methodCall("wp.getPosts", 1, this.config.username, this.config.password, {
      number: numberOfPosts,
    })
  }

  /**
   * 创建新文章
   * @param {PostData} postData 文章数据
   * @param {boolean} publish 是否立即发布
   * @returns {Promise<string>} 新创建的文章ID
   * @throws {Error} 如果调用失败
   * @see [wp.newPost](https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.newPost)
   */
  async newPost(postData: PostData, publish: boolean = true): Promise<string> {
    const content = {
      post_title: postData.title,
      post_content: postData.content,
      post_categories: postData.categories || [],
      mt_keywords: postData.tags?.join(",") || "",
      post_status: postData.status || (publish ? "publish" : "draft"),
    }

    return this.client.methodCall(
      "wp.newPost",
      1,
      this.config.username,
      this.config.password,
      content,
    ) as Promise<string>
  }

  /**
   * 更新文章
   * @param {string} postId 文章ID
   * @param {PostData} postData 文章数据
   * @param {boolean} publish 是否立即发布
   * @returns {Promise<boolean>} 是否成功
   * @throws {Error} 如果调用失败
   * @see [wp.editPost](https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.editPost)
   */
  async editPost(postId: string, postData: PostData, publish: boolean = true): Promise<boolean> {
    const content = {
      post_title: postData.title,
      post_content: postData.content,
      post_categories: postData.categories || [],
      mt_keywords: postData.tags?.join(",") || "",
      post_status: postData.status || (publish ? "publish" : "draft"),
    }

    return this.client.methodCall(
      "wp.editPost",
      1,
      this.config.username,
      this.config.password,
      postId,
      content,
    ) as Promise<boolean>
  }

  /**
   * 删除文章
   * @param {string} postId 文章ID
   * @returns {Promise<boolean>} 是否成功
   * @throws {Error} 如果调用失败
   * @see [wp.deletePost](https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.deletePost)
   */
  async deletePost(postId: string): Promise<boolean> {
    return this.client.methodCall(
      "wp.deletePost",
      1,
      this.config.username,
      this.config.password,
      postId,
    ) as Promise<boolean>
  }

  /**
   * 获取文章类型
   * @param {string} postType 文章类型（可选）
   * @returns {Promise<any>} 文章类型信息
   * @throws {Error} 如果调用失败
   * @see [wp.getPostType](https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.getPostType)
   */
  async getPostType(postType: string = "post"): Promise<any> {
    return this.client.methodCall("wp.getPostType", 1, this.config.username, this.config.password, postType)
  }

  /**
   * 获取所有文章类型
   * @returns {Promise<any>} 文章类型列表
   * @throws {Error} 如果调用失败
   * @see [wp.getPostTypes](https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.getPostTypes)
   */
  async getPostTypes(): Promise<any> {
    return this.client.methodCall("wp.getPostTypes", 1, this.config.username, this.config.password)
  }

  /**
   * 获取文章格式
   * @returns {Promise<any>} 文章格式列表
   * @throws {Error} 如果调用失败
   * @see [wp.getPostFormats](https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.getPostFormats)
   */
  async getPostFormats(): Promise<any> {
    return this.client.methodCall("wp.getPostFormats", 1, this.config.username, this.config.password)
  }

  /**
   * 获取文章状态列表
   * @returns {Promise<any>} 文章状态列表
   * @throws {Error} 如果调用失败
   * @see [wp.getPostStatusList](https://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.getPostStatusList)
   */
  async getPostStatusList(): Promise<any> {
    return this.client.methodCall("wp.getPostStatusList", 1, this.config.username, this.config.password)
  }

  // Taxonomies API
  // ----------------------------------
  /**
   * 获取分类法信息
   * @param {string} taxonomy 分类法名称
   * @returns {Promise<any>} 分类法信息
   * @throws {Error} 如果调用失败
   * @see [wp.getTaxonomy](https://codex.wordpress.org/XML-RPC_WordPress_API/Taxonomies#wp.getTaxonomy)
   */
  async getTaxonomy(taxonomy: string): Promise<any> {
    return this.client.methodCall("wp.getTaxonomy", 1, this.config.username, this.config.password, taxonomy)
  }

  /**
   * 获取所有分类法
   * @returns {Promise<any>} 分类法列表
   * @throws {Error} 如果调用失败
   * @see [wp.getTaxonomies](https://codex.wordpress.org/XML-RPC_WordPress_API/Taxonomies#wp.getTaxonomies)
   */
  async getTaxonomies(): Promise<any> {
    return this.client.methodCall("wp.getTaxonomies", 1, this.config.username, this.config.password)
  }

  /**
   * 获取分类信息
   * @param {string} taxonomy 分类法名称
   * @param {string} termId 分类ID
   * @returns {Promise<any>} 分类信息
   * @throws {Error} 如果调用失败
   * @see [wp.getTerm](https://codex.wordpress.org/XML-RPC_WordPress_API/Taxonomies#wp.getTerm)
   */
  async getTerm(taxonomy: string, termId: string): Promise<any> {
    return this.client.methodCall("wp.getTerm", 1, this.config.username, this.config.password, taxonomy, termId)
  }

  /**
   * 获取分类列表
   * @param {string} taxonomy 分类法名称
   * @returns {Promise<any>} 分类列表
   * @throws {Error} 如果调用失败
   * @see [wp.getTerms](https://codex.wordpress.org/XML-RPC_WordPress_API/Taxonomies#wp.getTerms)
   */
  async getTerms(taxonomy: string): Promise<any> {
    return this.client.methodCall("wp.getTerms", 1, this.config.username, this.config.password, taxonomy)
  }

  /**
   * 创建新分类
   * @param {string} taxonomy 分类法名称
   * @param {object} termData 分类数据
   * @returns {Promise<string>} 新分类ID
   * @throws {Error} 如果调用失败
   * @see [wp.newTerm](https://codex.wordpress.org/XML-RPC_WordPress_API/Taxonomies#wp.newTerm)
   */
  async newTerm(taxonomy: string, termData: object): Promise<string> {
    return this.client.methodCall(
      "wp.newTerm",
      1,
      this.config.username,
      this.config.password,
      taxonomy,
      termData,
    ) as Promise<string>
  }

  /**
   * 更新分类
   * @param {string} taxonomy 分类法名称
   * @param {string} termId 分类ID
   * @param {object} termData 分类数据
   * @returns {Promise<boolean>} 是否成功
   * @throws {Error} 如果调用失败
   * @see [wp.editTerm](https://codex.wordpress.org/XML-RPC_WordPress_API/Taxonomies#wp.editTerm)
   */
  async editTerm(taxonomy: string, termId: string, termData: object): Promise<boolean> {
    return this.client.methodCall(
      "wp.editTerm",
      1,
      this.config.username,
      this.config.password,
      taxonomy,
      termId,
      termData,
    ) as Promise<boolean>
  }

  /**
   * 删除分类
   * @param {string} taxonomy 分类法名称
   * @param {string} termId 分类ID
   * @returns {Promise<boolean>} 是否成功
   * @throws {Error} 如果调用失败
   * @see [wp.deleteTerm](https://codex.wordpress.org/XML-RPC_WordPress_API/Taxonomies#wp.deleteTerm)
   */
  async deleteTerm(taxonomy: string, termId: string): Promise<boolean> {
    return this.client.methodCall(
      "wp.deleteTerm",
      1,
      this.config.username,
      this.config.password,
      taxonomy,
      termId,
    ) as Promise<boolean>
  }

  // Media API
  // ----------------------------------
  /**
   * 上传媒体文件
   * @param {string} name 文件名
   * @param {string} type MIME类型
   * @param {Buffer | string} bits 文件内容（二进制数据或base64编码字符串）
   * @param {boolean} overwrite 是否覆盖同名文件
   * @returns {Promise<any>} 上传结果
   * @throws {Error} 如果调用失败
   * @see [wp.uploadFile](https://codex.wordpress.org/XML-RPC_WordPress_API/Media#wp.uploadFile)
   */
  async uploadFile(name: string, type: string, bits: Buffer | string, overwrite: boolean = false): Promise<any> {
    return this.client.methodCall("wp.uploadFile", 1, this.config.username, this.config.password, {
      name,
      type,
      bits,
      overwrite,
    })
  }

  // Comments API
  // ----------------------------------
  /**
   * 获取评论计数
   * @param {string} postId 文章ID
   * @returns {Promise<any>} 评论计数信息
   * @throws {Error} 如果调用失败
   * @see [wp.getCommentCount](https://codex.wordpress.org/XML-RPC_WordPress_API/Comments#wp.getCommentCount)
   */
  async getCommentCount(postId: string): Promise<any> {
    return this.client.methodCall("wp.getCommentCount", 1, this.config.username, this.config.password, postId)
  }

  /**
   * 获取评论详情
   * @param {string} commentId 评论ID
   * @returns {Promise<any>} 评论数据
   * @throws {Error} 如果调用失败
   * @see [wp.getComment](https://codex.wordpress.org/XML-RPC_WordPress_API/Comments#wp.getComment)
   */
  async getComment(commentId: string): Promise<any> {
    return this.client.methodCall("wp.getComment", 1, this.config.username, this.config.password, commentId)
  }

  /**
   * 获取评论列表
   * @param {object} filter 过滤条件
   * @returns {Promise<any>} 评论列表
   * @throws {Error} 如果调用失败
   * @see [wp.getComments](https://codex.wordpress.org/XML-RPC_WordPress_API/Comments#wp.getComments)
   */
  async getComments(filter: object = {}): Promise<any> {
    return this.client.methodCall("wp.getComments", 1, this.config.username, this.config.password, filter)
  }

  /**
   * 创建评论
   * @param {string} postId 文章ID
   * @param {object} commentData 评论数据
   * @returns {Promise<string>} 新评论ID
   * @throws {Error} 如果调用失败
   * @see [wp.newComment](https://codex.wordpress.org/XML-RPC_WordPress_API/Comments#wp.newComment)
   */
  async newComment(postId: string, commentData: object): Promise<string> {
    return this.client.methodCall(
      "wp.newComment",
      1,
      this.config.username,
      this.config.password,
      postId,
      commentData,
    ) as Promise<string>
  }

  /**
   * 更新评论
   * @param {string} commentId 评论ID
   * @param {object} commentData 评论数据
   * @returns {Promise<boolean>} 是否成功
   * @throws {Error} 如果调用失败
   * @see [wp.editComment](https://codex.wordpress.org/XML-RPC_WordPress_API/Comments#wp.editComment)
   */
  async editComment(commentId: string, commentData: object): Promise<boolean> {
    return this.client.methodCall(
      "wp.editComment",
      1,
      this.config.username,
      this.config.password,
      commentId,
      commentData,
    ) as Promise<boolean>
  }

  /**
   * 删除评论
   * @param {string} commentId 评论ID
   * @returns {Promise<boolean>} 是否成功
   * @throws {Error} 如果调用失败
   * @see [wp.deleteComment](https://codex.wordpress.org/XML-RPC_WordPress_API/Comments#wp.deleteComment)
   */
  async deleteComment(commentId: string): Promise<boolean> {
    return this.client.methodCall(
      "wp.deleteComment",
      1,
      this.config.username,
      this.config.password,
      commentId,
    ) as Promise<boolean>
  }

  // Options API
  // ----------------------------------
  /**
   * 获取选项设置
   * @param {string[]} optionNames 要获取的选项名称数组
   * @returns {Promise<any>} 选项值
   * @throws {Error} 如果调用失败
   * @see [wp.getOptions](https://codex.wordpress.org/XML-RPC_WordPress_API/Options#wp.getOptions)
   */
  async getOptions(optionNames: string[]): Promise<any> {
    return this.client.methodCall("wp.getOptions", 1, this.config.username, this.config.password, optionNames)
  }

  /**
   * 设置选项
   * @param {object} options 要设置的选项
   * @returns {Promise<any>} 设置结果
   * @throws {Error} 如果调用失败
   * @see [wp.setOptions](https://codex.wordpress.org/XML-RPC_WordPress_API/Options#wp.setOptions)
   */
  async setOptions(options: object): Promise<any> {
    return this.client.methodCall("wp.setOptions", 1, this.config.username, this.config.password, options)
  }

  // Users API
  // ----------------------------------
  /**
   * 获取用户拥有的博客列表
   * @returns {Promise<any>} 博客信息数组
   * @throws {Error} 如果调用失败
   * @see [wp.getUsersBlogs](https://codex.wordpress.org/XML-RPC_WordPress_API/Users#wp.getUsersBlogs)
   */
  async getUsersBlogs(): Promise<any> {
    return this.client.methodCall("wp.getUsersBlogs", this.config.username, this.config.password)
  }

  /**
   * 获取当前用户的个人信息
   * @returns {Promise<any>} 用户信息
   * @throws {Error} 如果调用失败
   * @see [wp.getProfile](https://codex.wordpress.org/XML-RPC_WordPress_API/Users#wp.getProfile)
   */
  async getProfile(): Promise<any> {
    return this.client.methodCall("wp.getProfile", this.config.username, this.config.password)
  }

  /**
   * 获取用户信息
   * @param {string} userId 用户ID
   * @returns {Promise<any>} 用户信息
   * @throws {Error} 如果调用失败
   * @see [wp.getUser](https://codex.wordpress.org/XML-RPC_WordPress_API/Users#wp.getUser)
   */
  async getUser(userId: string): Promise<any> {
    return this.client.methodCall("wp.getUser", this.config.username, this.config.password, userId)
  }

  /**
   * 获取所有用户
   * @returns {Promise<any>} 用户列表
   * @throws {Error} 如果调用失败
   * @see [wp.getUsers](https://codex.wordpress.org/XML-RPC_WordPress_API/Users#wp.getUsers)
   */
  async getUsers(): Promise<any> {
    return this.client.methodCall("wp.getUsers", this.config.username, this.config.password)
  }

  /**
   * 获取作者列表
   * @returns {Promise<any>} 作者列表
   * @throws {Error} 如果调用失败
   * @see [wp.getAuthors](https://codex.wordpress.org/XML-RPC_WordPress_API/Users#wp.getAuthors)
   */
  async getAuthors(): Promise<any> {
    return this.client.methodCall("wp.getAuthors", this.config.username, this.config.password)
  }

  /**
   * 更新用户信息
   * @param {string} userId 用户ID
   * @param {object} userData 用户数据
   * @returns {Promise<boolean>} 是否成功
   * @throws {Error} 如果调用失败
   * @see [wp.editProfile](https://codex.wordpress.org/XML-RPC_WordPress_API/Users#wp.editProfile)
   */
  async editProfile(userId: string, userData: object): Promise<boolean> {
    return this.client.methodCall(
      "wp.editProfile",
      this.config.username,
      this.config.password,
      userId,
      userData,
    ) as Promise<boolean>
  }
}
