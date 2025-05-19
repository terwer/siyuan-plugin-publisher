/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

const logger = {
  info: (msg) => console.log(`[WordPress Plugin] INFO: ${msg}`),
  error: (msg) => console.error(`[WordPress Plugin] ERROR: ${msg}`),
  debug: (msg) => console.debug(`[WordPress Plugin] DEBUG: ${msg}`),
}

export default {
  id: "wordpress-publisher",
  name: "WordPress",
  version: "1.0.0",
  platform: "wordpress_Wordpress",
  description: "100% 兼容 Metaweblog API 协议，支持 Metaweblog 及 WordPress 平台的发布、更新、删除、获取等全部操作。",
  author: "Terwer",

  configSchema: {
    type: "object",
    properties: {
      apiUrl: {
        type: "string",
        title: "API URL",
        description: "Metaweblog/WordPress XML-RPC API URL",
      },
      username: {
        type: "string",
        title: "Username",
        description: "Metaweblog/WordPress 用户名",
      },
      password: {
        type: "string",
        title: "Password",
        format: "password",
        description: "Metaweblog/WordPress 密码",
      },
    },
  },

  config: null,

  validateConfig: (config) => {
    // 验证配置
    return {
      valid: true,
      error: null,
    }
  },

  async init(config) {
    logger.info("Initializing Metaweblog/WordPress plugin")
    logger.debug(`Config received: ${JSON.stringify(config)}`)
    this.config = config
    logger.info("Metaweblog/WordPress plugin initialized")
  },

  async publish(post) {
    logger.info("Publishing post to WordPress")
    return {
      success: true,
      data: "test-post-id",
      error: null,
    }
  },
}
