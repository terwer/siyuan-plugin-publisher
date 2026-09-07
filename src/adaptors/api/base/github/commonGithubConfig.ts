/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PasswordType, PicbedServiceTypeEnum } from "zhi-blog-api"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import { StrUtil } from "zhi-common"

/**
 * CommonGithubConfig 类用于存储 GitHub 相关配置信息
 */
class CommonGithubConfig extends CommonBlogConfig {
  /**
   * Github仓库名称
   */
  public githubRepo: string

  /**
   * 默认分支
   */
  public githubBranch: string

  /**
   * 文章存储的默认目录（相对于仓库根目录的相对路径，例如：docs/_posts/）
   */
  public defaultPath: string

  /**
   * 默认提交信息
   */
  public defaultMsg: string

  /**
   * 作者
   */
  public author: string

  /**
   * 邮箱
   */
  public email: string

  /**
   * 作者主页
   */
  public site: string

  /**
   * Markdown文件名规则（占位符：[yyyy] [MM] [dd] [slug] [filename] ）
   */
  public mdFilenameRule: string

  /**
   * 预览规则（占位符：[yyyy] [MM] [dd] [postid]）
   */
  public override previewPostUrl: string = ""

  /**
   * MD文件预览规则（占位符：[user] [repo] [branch] [docpath]）
   */
  public override previewUrl: string = ""

  /**
   * 平台是否支持把文章永久链接写入 YAML Front Matter。
   *
   * 该能力由平台的构建器决定：只有 YamlConverter 会按 yamlLinkEnabled 写入 permalink/url 的平台才为 true，
   * 配置页才展示「YAML永久链接」开关；构建器不识别该字段时必须置为 false，避免提供无效果的开关。
   *
   * @see src/adaptors/api/base/github/yamlLinkCapability.spec.ts
   */
  public yamlLinkSupported: boolean = true

  /**
   * 构造函数
   *
   * @param {string} githubUsername - GitHub 用户名
   * @param {string} githubAuthToken - GitHub 访问令牌
   * @param {string} githubRepo - GitHub 仓库
   * @param {string} githubBranch - GitHub 分支
   * @param {string} middlewareUrl - 跨域代理 URL
   */
  constructor(
    githubUsername: string,
    githubAuthToken: string,
    githubRepo: string,
    githubBranch: string,
    middlewareUrl?: string
  ) {
    super("https://github.com", "https://api.github.com", githubUsername, githubAuthToken, middlewareUrl)

    this.username = githubUsername
    this.usernameEnabled = true
    this.password = githubAuthToken
    this.passwordType = PasswordType.PasswordType_Token
    this.tokenSettingUrl = "https://github.com/settings/tokens"
    this.showTokenTip = true
    this.tagEnabled = true
    this.cateEnabled = true
    this.knowledgeSpaceEnabled = false

    this.githubRepo = githubRepo
    this.githubBranch = githubBranch
    this.previewUrl = "/[user]/[repo]/blob/[branch]/[docpath]"
    this.previewPostUrl = "/post/[postid].html"
    this.defaultPath = "/"
    this.defaultMsg = "auto published by siyuan-plugin-publisher"
    this.author = "terwer"
    this.email = "youweics@163.com"
    this.site = StrUtil.pathJoin(this.home, "/" + this.username)
    this.mdFilenameRule = "[filename].md"
    // Git 静态博客平台将图片提交到仓库（source/images），默认使用「当前平台」图床
    this.picbedService = PicbedServiceTypeEnum.Bundled

    this.middlewareUrl = middlewareUrl
  }
}

export { CommonGithubConfig }
