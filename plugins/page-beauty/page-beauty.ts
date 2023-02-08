/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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
import { PluginObject } from "vue"
import { LogFactory } from "~/utils/logUtil"
import { isEmptyString, pathJoin } from "~/utils/util"
import { goToPage } from "~/utils/otherlib/ChromeUtil"
import { getSiyuanCfg } from "~/utils/platform/siyuan/siYuanConfig"

// typedef
declare module "vue" {
  export type PluginFunction<T> = (Vue: any, options?: T) => void

  export interface PluginObject<T> {
    install: PluginFunction<T>

    [key: string]: any
  }
}

const logger = LogFactory.getLogger("plugins/page-beauty/page-beauty.ts")

/**
 * 页面美化插件，使用方法 <div v-beauty></div>
 * @author terwer
 * @since 0.1.0
 */
const PageBeauty: PluginObject<any> = {
  install(Vue) {
    Vue.directive("beauty", (el: HTMLElement) => {
      logger.debug("PageBeauty is rendering ...")

      // links
      const links = el.querySelectorAll("a")
      if (links && links.length > 0) {
        links.forEach((link) => {
          // #264 转换虚拟链接为真实预览链接
          const href = link.getAttribute("href")
          if (href.includes("siyuan://blocks/")) {
            // const baseUrl = getSiyuanCfg().baseUrl
            let newHref = href.replace(/siyuan:\/\/blocks\//g, "")
            newHref = "/detail/index.html?id=" + newHref
            // newHref = pathJoin(baseUrl, newHref)

            link.setAttribute("href", newHref)
          }

          link.addEventListener("click", function (evt) {
            // 阻止默认跳转
            evt.preventDefault()

            // 获取跳转链接
            const href = link.getAttribute("href")
            logger.debug("href=>", href)
            if (!isEmptyString(href)) {
              goToPage(href)
            }
          })
        })
        logger.debug("链接处理完毕，全部新窗口打开.")
      }

      // assets
      const imgs = el.querySelectorAll("img")
      if (imgs && imgs.length > 0) {
        imgs.forEach((img) => {
          const src = img.getAttribute("src")
          if (src.indexOf("assets") > -1) {
            const baseUrl = getSiyuanCfg().baseUrl
            const imgUrl = pathJoin(baseUrl, "/" + src)

            img.setAttribute("src", imgUrl)
          }
        })
        logger.debug("本地图片处理完毕，已修复图片展示.")
      }
    })
  },
}

export default PageBeauty
