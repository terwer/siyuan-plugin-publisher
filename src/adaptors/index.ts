/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogAdaptor, BlogConfig, WebAdaptor, YamlConvertAdaptor } from "zhi-blog-api"
import { getSubPlatformTypeByKey, SubPlatformType } from "~/src/platforms/dynamicConfig.ts"
import { useCnblogsApi } from "~/src/adaptors/api/cnblogs/useCnblogsApi.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useWordpressApi } from "~/src/adaptors/api/wordpress/useWordpressApi.ts"
import { useTypechoApi } from "~/src/adaptors/api/typecho/useTypechoApi.ts"
import { useYuqueApi } from "~/src/adaptors/api/yuque/useYuqueApi.ts"
import { useZhihuWeb } from "~/src/adaptors/web/zhihu/useZhihuWeb.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { useMetaweblogApi } from "~/src/adaptors/api/metaweblog/useMetaweblogApi.ts"
import { useNotionApi } from "~/src/adaptors/api/notion/useNotionApi.ts"
import { useHexoApi } from "~/src/adaptors/api/hexo/useHexoApi.ts"
import { useGitlabhexoApi } from "~/src/adaptors/api/gitlab-hexo/useGitlabhexoApi.ts"
import { useCsdnWeb } from "~/src/adaptors/web/csdn/useCsdnWeb.ts"
import { useWechatWeb } from "~/src/adaptors/web/wechat/useWechatWeb.ts"
import { useJianshuWeb } from "~/src/adaptors/web/jianshu/useJianshuWeb.ts"
import { useJuejinWeb } from "~/src/adaptors/web/juejin/useJuejinWeb.ts"
import { useHugoApi } from "~/src/adaptors/api/hugo/useHugoApi.ts"
import { useGitlabhugoApi } from "~/src/adaptors/api/gitlab-hugo/useGitlabhugoApi.ts"
import { useJekyllApi } from "~/src/adaptors/api/jekyll/useJekyllApi.ts"
import { useGitlabjekyllApi } from "~/src/adaptors/api/gitlab-jekyll/useGitlabjekyllApi.ts"
import { useQuartzApi } from "~/src/adaptors/api/quartz/useQuartzApi.ts"
import { useVuepressApi } from "~/src/adaptors/api/vuepress/useVuepressApi.ts"
import { useGitlabvuepressApi } from "~/src/adaptors/api/gitlab-vuepress/useGitlabvuepressApi.ts"
import { useVuepress2Api } from "~/src/adaptors/api/vuepress2/useVuepress2Api.ts"
import { useVitepressApi } from "~/src/adaptors/api/vitepress/useVitepressApi.ts"
import { useGitlabvuepress2Api } from "~/src/adaptors/api/gitlab-vuepress2/useGitlabvuepress2Api.ts"
import { useGitlabvitepressApi } from "~/src/adaptors/api/gitlab-vitepress/useGitlabvitepressApi.ts"
import { useHaloApi } from "~/src/adaptors/api/halo/useHaloApi.ts"
import { useTelegraphApi } from "~/src/adaptors/api/telegraph/useTelegraphApi.ts"
import { useJvueApi } from "~/src/adaptors/api/jvue/useJvueApi.ts"
import { useConfluenceApi } from "~/src/adaptors/api/confluence/useConfluenceApi.ts"
import { useWordpressdotcomApi } from "~/src/adaptors/api/wordpress-dot-com/useWordpressdotcomApi.ts"
import { useHalowebWeb } from "~/src/adaptors/web/haloweb/useHalowebWeb.ts"
import { useBilibiliWeb } from "~/src/adaptors/web/bilibili/useBilibiliWeb.ts"
import { useXiaohongshuWeb } from "~/src/adaptors/web/xiaohongshu/useXiaohongshuWeb.ts"
import { useLocalSystemApi } from "~/src/adaptors/fs/LocalSystem/useLocalSystemApi.ts"

/**
 * 适配器统一入口
 *
 * @author terwer
 * @since 0.9.0
 */
class Adaptors {
  private static logger = createAppLogger("adaptors")

  /**
   * 根据平台key查找配置
   *
   * @param key
   * @param newCfg
   */
  public static async getCfg(key: string, newCfg?: any): Promise<BlogConfig> {
    let conf = null
    const type: SubPlatformType = getSubPlatformTypeByKey(key)

    switch (type) {
      case SubPlatformType.Common_Yuque: {
        const { cfg } = await useYuqueApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Common_Notion: {
        const { cfg } = await useNotionApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Common_Halo: {
        const { cfg } = await useHaloApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Common_Telegraph: {
        const { cfg } = await useTelegraphApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Common_Confluence: {
        const { cfg } = await useConfluenceApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Github_Hexo: {
        const { cfg } = await useHexoApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Github_Hugo: {
        const { cfg } = await useHugoApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Github_Jekyll: {
        const { cfg } = await useJekyllApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Github_Quartz: {
        const { cfg } = await useQuartzApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Github_Vuepress: {
        const { cfg } = await useVuepressApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Github_Vuepress2: {
        const { cfg } = await useVuepress2Api(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Github_Vitepress: {
        const { cfg } = await useVitepressApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Gitlab_Hexo: {
        const { cfg } = await useGitlabhexoApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Gitlab_Hugo: {
        const { cfg } = await useGitlabhugoApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Gitlab_Jekyll: {
        const { cfg } = await useGitlabjekyllApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Gitlab_Vuepress: {
        const { cfg } = await useGitlabvuepressApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Gitlab_Vuepress2: {
        const { cfg } = await useGitlabvuepress2Api(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Gitlab_Vitepress: {
        const { cfg } = await useGitlabvitepressApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Metaweblog_Metaweblog: {
        const { cfg } = await useMetaweblogApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Metaweblog_Cnblogs: {
        const { cfg } = await useCnblogsApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Metaweblog_Typecho: {
        const { cfg } = await useTypechoApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Metaweblog_Jvue: {
        const { cfg } = await useJvueApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Wordpress_Wordpress: {
        const { cfg } = await useWordpressApi(key, newCfg)
        conf = cfg
        break
      }
      case SubPlatformType.Wordpress_Wordpressdotcom: {
        const { cfg } = await useWordpressdotcomApi(key, newCfg)
        conf = cfg
        break
      }
      // 注意：web 相关平台不传第二个参数
      case SubPlatformType.Custom_Zhihu: {
        const { cfg } = await useZhihuWeb(key)
        conf = cfg
        break
      }
      case SubPlatformType.Custom_CSDN: {
        const { cfg } = await useCsdnWeb(key)
        conf = cfg
        break
      }
      case SubPlatformType.Custom_Wechat: {
        const { cfg } = await useWechatWeb(key)
        conf = cfg
        break
      }
      case SubPlatformType.Custom_Jianshu: {
        const { cfg } = await useJianshuWeb(key)
        conf = cfg
        break
      }
      case SubPlatformType.Custom_Juejin: {
        const { cfg } = await useJuejinWeb(key)
        conf = cfg
        break
      }
      // case SubPlatformType.Custom_Flowus: {
      //   const { cfg } = await useFlowusWeb(key)
      //   conf = cfg
      //   break
      // }
      case SubPlatformType.Custom_Haloweb: {
        const { cfg } = await useHalowebWeb(key)
        conf = cfg
        break
      }
      case SubPlatformType.Custom_Bilibili: {
        const { cfg } = await useBilibiliWeb(key)
        conf = cfg
        break
      }
      case SubPlatformType.Custom_Xiaohongshu: {
        const { cfg } = await useXiaohongshuWeb(key)
        conf = cfg
        break
      }
      case SubPlatformType.Fs_LocalSystem: {
        const { cfg } = await useLocalSystemApi(key)
        conf = cfg
        break
      }
      case SubPlatformType.System_Siyuan: {
        const { siyuanConfig } = useSiyuanApi()
        conf = siyuanConfig
        break
      }
      default: {
        conf = {}
        break
      }
    }
    this.logger.debug(`get conf from key ${key}=>`, conf)
    return conf
  }

  /**
   * 根据平台key查找适配器
   *
   * @param key
   * @param newCfg
   */
  public static async getAdaptor(key: string, newCfg?: any): Promise<BlogAdaptor | WebAdaptor> {
    let blogAdaptor = null
    const type: SubPlatformType = getSubPlatformTypeByKey(key)

    switch (type) {
      case SubPlatformType.Common_Yuque: {
        const { blogApi } = await useYuqueApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Common_Notion: {
        const { blogApi } = await useNotionApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Common_Halo: {
        const { blogApi } = await useHaloApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Common_Telegraph: {
        const { blogApi } = await useTelegraphApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Common_Confluence: {
        const { blogApi } = await useConfluenceApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Github_Hexo: {
        const { blogApi } = await useHexoApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Github_Hugo: {
        const { blogApi } = await useHugoApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Github_Jekyll: {
        const { blogApi } = await useJekyllApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Github_Quartz: {
        const { blogApi } = await useQuartzApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Github_Vuepress: {
        const { blogApi } = await useVuepressApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Github_Vuepress2: {
        const { blogApi } = await useVuepress2Api(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Github_Vitepress: {
        const { blogApi } = await useVitepressApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Gitlab_Hexo: {
        const { blogApi } = await useGitlabhexoApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Gitlab_Hugo: {
        const { blogApi } = await useGitlabhugoApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Gitlab_Jekyll: {
        const { blogApi } = await useGitlabjekyllApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Gitlab_Vuepress: {
        const { blogApi } = await useGitlabvuepressApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Gitlab_Vuepress2: {
        const { blogApi } = await useGitlabvuepress2Api(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Gitlab_Vitepress: {
        const { blogApi } = await useGitlabvitepressApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Metaweblog_Metaweblog: {
        const { blogApi } = await useMetaweblogApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Metaweblog_Cnblogs: {
        const { blogApi } = await useCnblogsApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Metaweblog_Typecho: {
        const { blogApi } = await useTypechoApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Metaweblog_Jvue: {
        const { blogApi } = await useJvueApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Wordpress_Wordpress: {
        const { blogApi } = await useWordpressApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Wordpress_Wordpressdotcom: {
        const { blogApi } = await useWordpressdotcomApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Custom_Zhihu: {
        const { webApi } = await useZhihuWeb(key, newCfg)
        blogAdaptor = webApi
        break
      }
      case SubPlatformType.Custom_CSDN: {
        const { webApi } = await useCsdnWeb(key, newCfg)
        blogAdaptor = webApi
        break
      }
      case SubPlatformType.Custom_Wechat: {
        const { webApi } = await useWechatWeb(key, newCfg)
        blogAdaptor = webApi
        break
      }
      case SubPlatformType.Custom_Jianshu: {
        const { webApi } = await useJianshuWeb(key, newCfg)
        blogAdaptor = webApi
        break
      }
      case SubPlatformType.Custom_Juejin: {
        const { webApi } = await useJuejinWeb(key, newCfg)
        blogAdaptor = webApi
        break
      }
      // case SubPlatformType.Custom_Flowus: {
      //   const { webApi } = await useFlowusWeb(key, newCfg)
      //   blogAdaptor = webApi
      //   break
      // }
      case SubPlatformType.Custom_Haloweb: {
        const { webApi } = await useHalowebWeb(key, newCfg)
        blogAdaptor = webApi
        break
      }
      case SubPlatformType.Custom_Bilibili: {
        const { webApi } = await useBilibiliWeb(key, newCfg)
        blogAdaptor = webApi
        break
      }
      case SubPlatformType.Custom_Xiaohongshu: {
        const { webApi } = await useXiaohongshuWeb(key, newCfg)
        blogAdaptor = webApi
        break
      }
      case SubPlatformType.Fs_LocalSystem: {
        const { blogApi } = await useLocalSystemApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.System_Siyuan: {
        const { blogApi } = useSiyuanApi()
        blogAdaptor = blogApi
        break
      }
      default: {
        break
      }
    }
    this.logger.debug(`get blogAdaptor from key ${key}`)
    return blogAdaptor
  }

  /**
   * 根据平台key查找YAML适配器
   *
   * @param key
   * @param newCfg
   */
  public static async getYamlAdaptor(key: string, newCfg?: any): Promise<YamlConvertAdaptor> {
    let yamlAdp = null
    const type: SubPlatformType = getSubPlatformTypeByKey(key)

    switch (type) {
      case SubPlatformType.Github_Hexo: {
        const { yamlAdaptor } = await useHexoApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Github_Hugo: {
        const { yamlAdaptor } = await useHugoApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Github_Jekyll: {
        const { yamlAdaptor } = await useJekyllApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Github_Quartz: {
        const { yamlAdaptor } = await useQuartzApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Github_Vuepress: {
        const { yamlAdaptor } = await useVuepressApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Github_Vuepress2: {
        const { yamlAdaptor } = await useVuepress2Api(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Github_Vitepress: {
        const { yamlAdaptor } = await useVitepressApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Gitlab_Hexo: {
        const { yamlAdaptor } = await useGitlabhexoApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Gitlab_Hugo: {
        const { yamlAdaptor } = await useGitlabhugoApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Gitlab_Jekyll: {
        const { yamlAdaptor } = await useGitlabjekyllApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Gitlab_Vuepress: {
        const { yamlAdaptor } = await useGitlabvuepressApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Gitlab_Vuepress2: {
        const { yamlAdaptor } = await useGitlabvuepress2Api(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Gitlab_Vitepress: {
        const { yamlAdaptor } = await useGitlabvitepressApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      case SubPlatformType.Fs_LocalSystem: {
        const { yamlAdaptor } = await useLocalSystemApi(key, newCfg)
        yamlAdp = yamlAdaptor
        break
      }
      default: {
        break
      }
    }
    this.logger.debug(`get yamlAdaptor from key ${key}=>`, yamlAdp)
    return yamlAdp
  }
}

export default Adaptors
