/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { HexoConfig } from "~/src/adaptors/api/hexo/hexoConfig.ts"

describe("Hexo image path contract", () => {
  it("commits images to source/images but links them from the site root /images", () => {
    const cfg = safeMergeConfig<HexoConfig>("{}", HexoConfig, ["", "", "", "", ""])

    // 提交到仓库的目录：source/images（Hexo 源文件目录）
    expect(cfg.imageStorePath).toBe("source/images")
    // 文章里使用的链接：/images/...（Hexo 构建后 source/images 会复制到站点根目录 /images）
    expect(cfg.imageLinkPath).toBe("images")
  })
})
