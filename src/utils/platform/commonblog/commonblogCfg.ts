import { PageType } from "../metaweblog/IMetaweblogCfg"

/**
 * 通用平台配置接口
 */
export interface ICommonblogCfg {
  /**
   * 首页
   */
  home?: string
  /**
   * API 地址
   */
  apiUrl: string
  /**
   * 用户名
   */
  username?: string
  /**
   * 密码
   */
  password?: string
  /**
   * 鉴权token
   */
  token?: string
  /**
   * 是否发布
   */
  apiStatus?: boolean
  /**
   * 博客名（API获取）
   */
  blogName?: string
  /**
   * 博客标识（API获取，部分平台需要）
   */
  blogid?: string
  /**
   * 文章别名key
   */
  posidKey?: string
  /**
   * 文章预览链接
   */
  previewUrl?: string
  /**
   * 文章类型
   */
  pageType: PageType
  /**
   * token设置地址
   */
  tokenSettingUrl?: string
}

/**
 * 通用平台配置类
 */
export class CommonblogCfg implements ICommonblogCfg {
  /**
   * 首页
   */
  home: string

  /**
   * API 地址
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
   * 鉴权token
   */
  token: string

  /**
   * 是否发布
   */
  apiStatus: boolean
  /**
   * 博客名（API获取）
   */
  blogName: string
  /**
   * 博客标识（API获取，部分平台需要）
   */
  blogid: string
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
  /**
   * token设置地址
   */
  tokenSettingUrl: string

  constructor() {
    this.home = ""
    this.apiUrl = ""
    this.username = ""
    this.password = ""
    this.token = ""
    this.apiStatus = false
    this.blogName = ""
    this.blogid = ""
    this.posidKey = ""
    this.previewUrl = ""
    this.pageType = PageType.Markdown
    this.tokenSettingUrl = ""
  }
}
