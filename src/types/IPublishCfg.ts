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

import { SypConfig } from "~/syp.config.ts"
import { DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { BlogConfig } from "zhi-blog-api"

/**
 * 表示发布配置的接口
 *
 * @interface IPublishCfg
 * @author terwer
 * @since 1.3.2
 */
interface IPublishCfg {
  /**
   * SypConfig 类型的设置值
   *
   * @type {typeof SypConfig}
   */
  setting: typeof SypConfig

  /**
   * 平台配置集合
   */
  dynamicConfigArray: DynamicConfig[]

  /**
   * BlogConfig 类型的配置对象
   *
   * @type {BlogConfig}
   */
  cfg: BlogConfig

  /**
   * DynamicConfig 类型的动态配置对象
   *
   * @type {DynamicConfig}
   */
  dynCfg: DynamicConfig
}

export type { IPublishCfg }
