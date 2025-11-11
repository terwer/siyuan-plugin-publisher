/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
