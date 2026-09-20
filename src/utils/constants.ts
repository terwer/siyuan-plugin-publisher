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
 * 最后一个提供 V1 界面的发行版本号。
 *
 * V1 已在 `2.0.0` 中彻底移除，本版不再提供回退入口；此处仅用于「确需旧界面」
 * 时的下载指引。该指引计划在 `2.3.0` 移除
 * （见 change `v2-platform-verification-v1-retirement`）。
 */
export const V1_LAST_VERSION = "1.41.1"

/**
 * 最后一个提供 V1 界面的发行版下载地址
 */
export const V1_LAST_RELEASE_URL = `https://github.com/terwer/siyuan-plugin-publisher/releases/tag/siyuan-plugin-publisher-v${V1_LAST_VERSION}`

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
 * 注意：不提供默认共享代理地址（防止滥用共享额度），corsAnywhereUrl 需用户自行配置。
 * 配置指引文档：https://siyuan.wiki/s/20240312153728-paen10j
 *
 * @since 1.20.2
 * @version 1.20.2
 */
export const CORS_PROXY_DOC_URL = "https://siyuan.wiki/s/20240312153728-paen10j"
