/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { YuquewebConfig } from "~/src/adaptors/web/yuqueweb/YuquewebConfig.ts"
import { YuquewebWebAdaptor } from "~/src/adaptors/web/yuqueweb/YuquewebWebAdaptor.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import zhCN from "~/src/locales/zh_CN.ts"

const createAdaptor = (blogid?: any, extra: Record<string, any> = {}) => {
  const cfg = new YuquewebConfig("cookie=value")
  cfg.blogid = blogid
  Object.assign(cfg, extra)
  return new YuquewebWebAdaptor(new PublisherAppInstance(), cfg)
}

describe("YuquewebWebAdaptor.validatePublish", () => {
  it("blocks publishing when no knowledge base is selected", async () => {
    const result = await createAdaptor("").validatePublish()

    expect(result).toEqual({
      canPublish: false,
      reason: zhCN["setting.yuqueweb.publishValidation.selectKnowledgeBase"],
    })
  })

  it("blocks publishing when selected knowledge-base metadata is incomplete", async () => {
    const result = await createAdaptor(JSON.stringify({ bookId: "123", bookSlug: "docs" })).validatePublish()

    expect(result).toEqual({
      canPublish: false,
      reason: zhCN["setting.yuqueweb.publishValidation.selectKnowledgeBase"],
    })
  })

  it("allows publishing when selected knowledge-base metadata is complete", async () => {
    const result = await createAdaptor(JSON.stringify({ bookId: "123", bookSlug: "docs", login: "terwer" })).validatePublish()

    expect(result).toEqual({ canPublish: true })
  })
})
