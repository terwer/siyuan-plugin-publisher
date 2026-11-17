/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2024-2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 统一获取 Lute 实例
 *
 * @author terwer
 * @since 1.31.0
 */
class PublisherLuteInstance {

  public static getInstance() {
    if (typeof window === "undefined") {
      return null
    }

    const Lute = (window as any).Lute
    if (!Lute) {
      return null
    }

    const lute = Lute.New()
    return { lute, Lute }
  }
}

export { PublisherLuteInstance }
