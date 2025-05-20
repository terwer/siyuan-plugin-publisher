/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 动态平台类型枚举
 *
 * @version 2.0.0
 * @since 0.1.0+
 * @author terwer
 */
export enum PlatformType {
  /**
   * 通用平台(Yuque)
   */
  Common = "Common",

  /**
   * Metaweblog
   */
  Metaweblog = "Metaweblog",

  /**
   * WordPress
   */
  Wordpress = "Wordpress",

  /**
   * GitHub(Hugo、Hexo、Jekyll、Vuepress、Vitepress、Nuxt content、Next.js)
   */
  Github = "Github",

  /**
   * Gitlab
   */
  Gitlab = "Gitlab",

  /**
   * 自定义(zhihu)
   */
  Custom = "Custom",

  /**
   * 内置平台，仅内部使用，用户不能使用也不能更改(Siyuan)
   */
  System = "System",
}

/**
 * 平台子类型
 *
 * @version 2.0.0
 * @since 0.1.0+
 * @author terwer
 */
export enum SubPlatformType {
  // Common
  Common_Yuque = "Yuque",
  Common_Notion = "Notion",
  Common_Halo = "Halo",
  Common_Telegraph = "Telegraph",

  // Github 子平台
  Github_Hexo = "Hexo",
  Github_Hugo = "Hugo",
  Github_Jekyll = "Jekyll",
  Github_Vuepress = "Vuepress",
  Github_Vuepress2 = "Vuepress2",
  Github_Vitepress = "Vitepress",

  // Gitlab 子平台
  Gitlab_Hexo = "Gitlabhexo",
  Gitlab_Hugo = "Gitlabhugo",
  Gitlab_Jekyll = "Gitlabjekyll",
  Gitlab_Vuepress = "Gitlabvuepress",
  Gitlab_Vuepress2 = "Gitlabvuepress2",
  Gitlab_Vitepress = "Gitlabvitepress",

  // Metaweblog
  Metaweblog_Metaweblog = "Metaweblog",
  Metaweblog_Cnblogs = "Cnblogs",
  Metaweblog_Typecho = "Typecho",
  Metaweblog_Jvue = "Jvue",

  // WordPress
  Wordpress_Wordpress = "Wordpress",
  Wordpress_Wordpressdotcom = "Wordpressdotcom",

  // Custom
  Custom_Zhihu = "Zhihu",
  Custom_CSDN = "Csdn",
  Custom_Wechat = "Wechat",
  Custom_Jianshu = "Jianshu",
  Custom_Juejin = "Juejin",
  // Custom_Flowus = "Flowus",
  Custom_Haloweb = "Haloweb",
  Custom_Bilibili = "Bilibili",
  Custom_Xiaohongshu = "Xiaohongshu",

  // System
  System_Siyuan = "Siyuan",

  NONE = "none",
}

/**
 * 授权模式
 */
export enum AuthMode {
  API = "api",
  WEBSITE = "web",
  NONE = "none",
}