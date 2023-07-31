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

import { Dialog, IObject } from "siyuan"
import PublisherPlugin from "./index"

/**
 * 打开 iframe 弹窗
 *
 * @param pluginInstance 插件实例
 * @param pageIndex 地址
 * @param w 宽度
 * @param h 高度
 * @param noscroll 是否允许滚动
 * @param destroyCallback 关闭回调
 */
export const showIframeDialog = (
  pluginInstance: PublisherPlugin,
  pageIndex: string,
  w?: string,
  h?: string,
  noscroll?: boolean,
  destroyCallback?: (options?: IObject) => void
) => {
  const contentHtml = `<style>
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        </style>
        <iframe src="${pageIndex}" width="100%" scrolling="${noscroll ? "no" : "yes"}"></iframe>`

  new Dialog({
    title: pluginInstance.i18n.siyuanBlog,
    transparent: false,
    content: contentHtml,
    width: w ?? "60%",
    height: h ?? "650px",
    destroyCallback: destroyCallback,
  } as any)
}
