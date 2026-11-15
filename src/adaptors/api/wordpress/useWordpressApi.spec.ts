/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"
import { useWordpressApi } from "~/src/adaptors/api/wordpress/useWordpressApi.ts"

describe("test useWordpressApi capability flags", () => {
  it("declares the featured image capability on the config instance", async () => {
    const cfg = new WordpressConfig("https://demo.example.com", "user", "password")

    const { cfg: merged } = await useWordpressApi("wordpress_Wordpress", cfg)

    expect(merged.featuredImageEnabled).toBe(true)
  })

  it("declares the featured image capability when the config is a plain settings object", async () => {
    // 发布链路拿到的是设置反序列化后的普通对象，不是配置类实例
    const stored = {
      home: "https://demo.example.com",
      apiUrl: "https://demo.example.com/xmlrpc.php",
      username: "user",
      password: "password",
    } as any

    const { cfg } = await useWordpressApi("wordpress_Wordpress", stored)

    expect(cfg.featuredImageEnabled).toBe(true)
  })

  it("keeps the capability off by default for other metaweblog platforms", () => {
    // 能力位默认关闭，其它 MetaWeblog 平台不受影响
    const cfg = new MetaweblogConfig("https://demo.example.com", "https://demo.example.com/xmlrpc", "user", "pass")

    expect(cfg.featuredImageEnabled).toBe(false)
  })
})
