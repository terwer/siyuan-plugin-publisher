/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2024 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "./utils/appLogger"

/**
 * 统一获取 Lute 实例
 *
 * @author terwer
 * @since 1.31.0
 */
class PublisherLuteInstance {
  private static logger = createAppLogger("lute-instance")

  public static getInstance() {
    if (typeof window === "undefined") {
      this.logger.warn("不是浏览器环境，不渲染")
      return null
    }

    const Lute = (window as any).Lute
    if (!Lute) {
      this.logger.warn("未找到Lute，不渲染")
      return null
    }

    this.logger.info("found Lute =>", Lute)
    this.logger.info("使用Lute渲染Markdown")
    const lute = Lute.New()
    return { lute, Lute }
  }
}

export { PublisherLuteInstance }
