/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { BlogAdaptor, BlogConfig, WebAdaptor } from "zhi-blog-api"
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
   */
  public static async getCfg(key: string): Promise<BlogConfig> {
    let conf = null
    const type: SubPlatformType = getSubPlatformTypeByKey(key)

    switch (type) {
      case SubPlatformType.Common_Yuque: {
        const { cfg } = await useYuqueApi(key)
        conf = cfg
        break
      }
      case SubPlatformType.Common_Notion: {
        const { cfg } = await useNotionApi(key)
        conf = cfg
        break
      }
      case SubPlatformType.Github_Hexo: {
        const { cfg } = await useHexoApi(key)
        conf = cfg
        break
      }
      case SubPlatformType.Metaweblog_Metaweblog: {
        const { cfg } = await useMetaweblogApi(key)
        conf = cfg
        break
      }
      case SubPlatformType.Metaweblog_Cnblogs: {
        const { cfg } = await useCnblogsApi(key)
        conf = cfg
        break
      }
      case SubPlatformType.Metaweblog_Typecho: {
        const { cfg } = await useTypechoApi(key)
        conf = cfg
        break
      }
      case SubPlatformType.Wordpress_Wordpress: {
        const { cfg } = await useWordpressApi(key)
        conf = cfg
        break
      }
      case SubPlatformType.Custom_Zhihu: {
        const { cfg } = await useZhihuWeb(key)
        conf = cfg
        break
      }
      // case SubPlatformType.Custom_CSDN: {
      //   const { cfg } = await useCsdnWeb(key)
      //   conf = cfg
      //   break
      // }
      // case SubPlatformType.Custom_Jianshu: {
      //   const { cfg } = await useJianshuWeb(key)
      //   conf = cfg
      //   break
      // }
      // case SubPlatformType.Custom_Juejin: {
      //   const { cfg } = await useJuejinWeb(key)
      //   conf = cfg
      //   break
      // }
      // case SubPlatformType.Custom_Wechat: {
      //   const { cfg } = await useWechatWeb(key)
      //   conf = cfg
      //   break
      // }
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
      case SubPlatformType.Github_Hexo: {
        const { blogApi } = await useHexoApi(key, newCfg)
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
      case SubPlatformType.Wordpress_Wordpress: {
        const { blogApi } = await useWordpressApi(key, newCfg)
        blogAdaptor = blogApi
        break
      }
      case SubPlatformType.Custom_Zhihu: {
        const { webApi } = await useZhihuWeb(key, newCfg)
        blogAdaptor = webApi
        break
      }
      // case SubPlatformType.Custom_CSDN: {
      //   const { webApi } = await useCsdnWeb(key, newCfg)
      //   blogAdaptor = webApi
      //   break
      // }
      // case SubPlatformType.Custom_Jianshu: {
      //   const { webApi } = await useJianshuWeb(key, newCfg)
      //   blogAdaptor = webApi
      //   break
      // }
      // case SubPlatformType.Custom_Juejin: {
      //   const { webApi } = await useJuejinWeb(key, newCfg)
      //   blogAdaptor = webApi
      //   break
      // }
      // case SubPlatformType.Custom_Wechat: {
      //   const { webApi } = await useWechatWeb(key, newCfg)
      //   blogAdaptor = webApi
      //   break
      // }
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

  // 新增 preEditPost ， 此方法不再需要
  // /**
  //  * 根据平台key查找YAML适配器
  //  *
  //  * @param key
  //  * @param newCfg
  //  */
  // public static async getYamlAdaptor(key: string, newCfg?: any): Promise<YamlConvertAdaptor> {
  //   let yamlAdp = null
  //   const type: SubPlatformType = getSubPlatformTypeByKey(key)
  //
  //   switch (type) {
  //     case SubPlatformType.Github_Hexo: {
  //       const { yamlAdaptor } = await useHexoApi(key, newCfg)
  //       yamlAdp = yamlAdaptor
  //       break
  //     }
  //     default: {
  //       break
  //     }
  //   }
  //   this.logger.debug(`get yamlAdaptor from key ${key}=>`, yamlAdp)
  //   return yamlAdp
  // }
}

export default Adaptors
