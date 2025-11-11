/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 文件系统YAML类型枚举
 *
 * @author terwer
 * @since 1.38.0
 */
enum FsYamlType {
  /**
   * 默认类型
   */
  Default = "default",

  /**
   * Hexo类型
   */
  Hexo = "hexo",

  /**
   * Hugo类型
   */
  Hugo = "hugo",

  /**
   * Jekyll类型
   */
  Jekyll = "jekyll",

  /**
   * VuePress类型
   */
  Vuepress = "vuepress",

  /**
   * VuePress2类型
   */
  Vuepress2 = "vuepress2",

  /**
   * VitePress类型
   */
  Vitepress = "vitepress",

  /**
   * Quartz类型
   */
  Quartz = "quartz"
}

export { FsYamlType }