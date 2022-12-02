/* eslint-disable @typescript-eslint/strict-boolean-expressions,@typescript-eslint/explicit-function-return-type,@typescript-eslint/restrict-plus-operands */
import { isEmptyObject } from "~/utils/util"
import logUtil from "~/utils/logUtil"
import { CommonblogApi } from "~/utils/platform/commonblog/commonblogApi"

/**
 * 语雀API
 *
 * https://www.yuque.com/yuque/developer
 */
export class YuqueApi extends CommonblogApi {
  private readonly baseUrl: string
  private readonly blogid: string
  private readonly username: string
  private readonly token: string

  constructor(
    baseUrl: string,
    blogid: string,
    username: string,
    token: string
  ) {
    super()
    this.baseUrl = baseUrl
    this.blogid = blogid
    this.username = username
    this.token = token
  }

  /**
   * 语雀知识库列表
   */
  public async repos() {
    const url = "/users/" + this.username + "/repos"
    const data = {}
    return await this.yuqueRequest(url, data, "GET")
  }

  /**
   * 向默认知识库添加文档
   * @param title 标题
   * @param slug 别名
   * @param content 内容
   * @param repo 知识库（可选）
   */
  public async addDoc(
    title: string,
    slug: string,
    content: string,
    repo?: string
  ): Promise<string> {
    let url = "/repos/" + this.blogid + "/docs"
    if (repo) {
      url = "/repos/" + repo + "/docs"
      logUtil.logWarn("yuque addDoc with repo", repo)
    }
    const data = {
      title,
      slug,
      format: "markdown",
      body: content,
    }
    const result = await this.yuqueRequest(url, data, "POST")
    logUtil.logInfo("yuqueRequest addDoc=>", result)
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return result.id + ""
  }

  /**
   * 更新语雀文档
   * @param docId 文档ID
   * @param title 标题
   * @param slug 别名
   * @param content 内容
   * @param repo 知识库（可选）
   */
  public async updateDoc(
    docId: string,
    title: string,
    slug: string,
    content: string,
    repo?: string
  ): Promise<boolean> {
    let url = "/repos/" + this.blogid + "/docs/" + docId
    if (repo) {
      url = "/repos/" + repo + "/docs/" + docId
      logUtil.logWarn("yuque updateDoc with repo", repo)
    }
    const data = {
      title,
      slug,
      body: content,
      _force_asl: 1,
    }
    const result = await this.yuqueRequest(url, data, "PUT")
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return true
  }

  /**
   * 删除yuque文档
   * @param docId 文档ID
   * @param repo 知识库（可选）
   */
  public async delDoc(docId: string, repo?: string): Promise<boolean> {
    let url = "/repos/" + this.blogid + "/docs/" + docId
    if (repo) {
      url = "/repos/" + repo + "/docs/" + docId
      logUtil.logWarn("yuque delDoc with repo", repo)
    }
    const data = {}
    const result = await this.yuqueRequest(url, data, "DELETE")
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return true
  }

  /**
   * 获取yuque文档
   * @param docId 文档ID
   * @param repo 知识库（可选）
   */
  public async getDoc(docId: string, repo?: string): Promise<any> {
    let url = "/repos/" + this.blogid + "/docs/" + docId
    if (repo) {
      url = "/repos/" + repo + "/docs/" + docId
      logUtil.logWarn("yuque getDoc with repo", repo)
    }
    const data = {}
    const result = await this.yuqueRequest(url, data, "GET")
    if (!result) {
      throw new Error("请求语雀API异常")
    }

    return result
  }

  // ==========================================================================
  // ==========================================================================
  /**
   * 向语雀请求数据
   * @param url 请求地址
   * @param data 数据
   * @param method 请求方法 GET | POST
   * @private
   */
  private async yuqueRequest(url: string, data?: any, method?: string) {
    // 设置请求参数
    const apiUrl = this.baseUrl + url

    let m = "POST"
    if (method) {
      m = method
    }

    const fetchOps = {
      method: m,
    }

    // 数据不为空才传递
    if (!isEmptyObject(data)) {
      Object.assign(fetchOps, {
        body: JSON.stringify(data),
      })
    }

    Object.assign(fetchOps, {
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.token,
        "User-Agent": "Terwer/0.1.0",
      },
    })

    // 发送请求
    logUtil.logInfo("向语雀请求数据，apiUrl=>", apiUrl)
    logUtil.logInfo("向语雀请求数据，fetchOps=>", fetchOps)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const resJson = await this.doFetch(apiUrl, fetchOps)

    logUtil.logInfo("向语雀请求数据，resJson=>", resJson)
    return resJson.data ? resJson.data : null
  }
}
