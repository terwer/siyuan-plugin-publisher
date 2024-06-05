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

export const isDev = process.env.DEV_MODE === "true"
export const appBase = process.env.APP_BASE

// 关于我页面
export const aboutUrl = "https://terwer.space/about"

/**
 * 动态配置key，全系统唯一，请勿更改
 */
export const DYNAMIC_CONFIG_KEY = "dynamic-config"

/**
 * 自动映射分类占位符
 */
export const CATE_AUTO_NAME = "[auto]"

/**
 * 标题最大长度
 */
export const MAX_TITLE_LENGTH = 10

/**
 * 旧的通用接口
 *
 * @since 1.21.6
 * @version 1.21.6
 */
export const LEGENCY_SHARED_API = "https://api.terwer.space/api"

/**
 * 旧的通用 HTTP 代理
 *
 * @since 1.0.0
 * @version 1.20.0
 */
export const LEGENCY_SHARED_PROXT_MIDDLEWARE = "https://api.terwer.space/api/middleware"

/**
 * 新版通用 HTTP 代理，不再免费提供
 *
 * @since 1.20.2
 * @version 1.20.2
 */
// export const CORS_PROXT_URL = ""
