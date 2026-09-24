/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { JsonUtil } from "zhi-common"

/**
 * Yuqueweb 平台文章元数据。
 *
 * 使用 JSON 字符串保存，避免只保存数字 docId 后丢失预览、更新和知识库定位信息。
 */
class YuquewebPostMeta {
  public id: string
  public slug: string
  public bookId: string
  public bookSlug: string
  public login: string
  public format: "markdown"
  public url?: string

  constructor(id = "", slug = "", bookId = "", bookSlug = "", login = "", url?: string) {
    this.id = id
    this.slug = slug
    this.bookId = bookId
    this.bookSlug = bookSlug
    this.login = login
    this.format = "markdown"
    this.url = url
  }

  public static fromPostid(postid: string): YuquewebPostMeta {
    const meta = JsonUtil.safeParse<YuquewebPostMeta>(postid, {} as YuquewebPostMeta)
    return Object.assign(new YuquewebPostMeta(), meta)
  }

  public toPostid(): string {
    return JSON.stringify(this)
  }
}

export { YuquewebPostMeta }
