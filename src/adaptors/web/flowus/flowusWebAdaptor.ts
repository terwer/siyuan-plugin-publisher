/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BaseWebApi } from "~/src/adaptors/web/base/baseWebApi.ts"
import { CategoryInfo } from "zhi-blog-api"

/**
 * Flowus网页授权适配器
 *
 * @see [Flowus](https://flowus.cn/)
 * @author terwer
 * @version 0.16.0
 * @since 0.16.0
 */
class FlowusWebAdaptor extends BaseWebApi {
  public async getMetaData(): Promise<any> {
    const res = await this.webFetch("https://flowus.cn/api/users/me")
    const flag = res?.code === 200
    this.logger.info(`get flowus metadata finished, flag => ${flag}`)
    return {
      flag: flag,
      uid: res?.data?.uuid,
      title: res?.data?.nickname,
      avatar: res?.data?.avatar,
      spaceViews: res?.data?.spaceViews,
      supportTypes: ["html"],
      type: "flowus",
      displayName: "Flowus 息流",
      home: "https://flowus.cn",
      icon: "https://cdn.allflow.cn/assets/favicon.png",
    }
  }

  // public async getCategories(keyword?: string): Promise<CategoryInfo[]> {
  //   const cats = [] as CategoryInfo[]
  //
  //   // const pages: any[] = await this.getPages(keyword)
  // }


  // ================
  // private methods
  // ================
}

export { FlowusWebAdaptor }
