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

import { describe } from "vitest"
import { LinkParser } from "~/utils/parser/LinkParser"
import { API } from "~/utils/api"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { setBooleanConf, setJSONConf } from "~/utils/configUtil"
import SWITCH_CONSTANTS from "~/utils/constants/switchConstants"
import { YuqueCfg } from "~/utils/platform/commonblog/yuque/yuqueCfg"
import { getEnv } from "~/utils/envUtil"
import { SiYuanConfig } from "~/utils/platform/siyuan/siYuanConfig"
import { SIYUAN_CONSTANTS } from "~/utils/constants/siyuanConstants"
import { getPublishCfg } from "~/utils/publishUtil"
import { type PublishPreference } from "~/utils/models/publishPreference"
import { CONSTANTS } from "~/utils/constants/constants"

describe("test linkParser", () => {
  it("init", () => {
    // 偏好设置
    const publishCfg = getPublishCfg()
    publishCfg.fixTitle = true
    publishCfg.removeH1 = true
    publishCfg.newWin = false
    publishCfg.autoTag = true
    publishCfg.showCloseBtn = false
    publishCfg.usePicgo = false

    setJSONConf<PublishPreference>(CONSTANTS.PUBLISH_PREFERENCE_CONFIG_KEY, publishCfg)

    // 思源笔记配置
    const apiUrl = getEnv("VITE_SIYUAN_API_URL")
    const token = getEnv("VITE_SIYUAN_CONFIG_TOKEN")
    const middlewareUrl = getEnv("VITE_MIDDLEWARE_URL")
    const siyuanCfg = new SiYuanConfig(apiUrl, token, middlewareUrl)
    setJSONConf<SiYuanConfig>(SIYUAN_CONSTANTS.SIYUAN_CFG_KEY, siyuanCfg)

    // 开启语雀平台
    setBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY, true)

    // 语雀平台配置
    const cfg = new YuqueCfg()
    cfg.username = getEnv("VITE_TEST_YUQUE_USERNAME")
    cfg.token = getEnv("VITE_TEST_YUQUE_PASSWORD")
    cfg.apiStatus = true
    cfg.blogName = "学习笔记"
    cfg.blogid = "terwer/note"
    setJSONConf(API_TYPE_CONSTANTS.API_TYPE_YUQUE, cfg)
  })

  it("should convert siyuan link to platform link", async () => {
    const parser = new LinkParser()
    const content =
      "This is a siyuan link 参考 [Mybatis基本流程](siyuan://blocks/20220830105327-gafnm5o) in the content"
    const api = new API(API_TYPE_CONSTANTS.API_TYPE_YUQUE)
    const newContent = await parser.convertSiyuanLinkToPlatformLink(content, api)
    const expected =
      "This is a siyuan link 参考 [Mybatis基本流程](https://www.yuque.com/terwer/note/mybatis-basic-process-and-configuration-file-analysis) in the content"
    expect(newContent).toEqual(expected)
  })
})
