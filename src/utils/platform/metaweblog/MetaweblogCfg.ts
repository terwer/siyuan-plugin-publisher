import { IMetaweblogCfg, PageType } from "./IMetaweblogCfg"

/**
 * Metaweblog配置类
 */
export class MetaweblogCfg implements IMetaweblogCfg {
  /**
   * 首页
   */
  home: string
  /**
   * API地址
   */
  apiUrl: string
  /**
   * 用户名
   */
  username: string
  /**
   * 密码
   */
  password: string

  /**
   * 是否发布
   */
  apiStatus: boolean

  /**
   * 博客名（API获取）
   */
  blogName: string

  /**
   * 文章别名key
   */
  posidKey: string

  /**
   * 文章预览链接
   */
  previewUrl: string

  /**
   * 文章类型
   */
  pageType: PageType

  constructor(
    home: string,
    apiUrl: string,
    username: string,
    password: string
  ) {
    this.home = home
    this.apiUrl = apiUrl
    this.username = username
    this.password = password
    this.apiStatus = false
    this.blogName = ""
    this.posidKey = ""
    this.previewUrl = ""
    this.pageType = PageType.Markdown
  }
}
