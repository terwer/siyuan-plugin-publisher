/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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

import { CommonblogCfg } from "~/utils/platform/commonblog/commonblogCfg"
import { POSTID_KEY_CONSTANTS } from "~/utils/constants/postidKeyConstants"
import { PageType } from "~/utils/platform/metaweblog/IMetaweblogCfg"

/**
 * 语雀配置
 */
export class YuqueCfg extends CommonblogCfg {
  constructor() {
    super()

    this.home = "https://www.yuque.com/"
    this.apiUrl = "https://www.yuque.com/api/v2"
    this.tokenSettingUrl = "https://www.yuque.com/settings/tokens"
    this.posidKey = POSTID_KEY_CONSTANTS.YUQUE_POSTID_KEY
    this.previewUrl = "/[notebook]/[postid]"
    this.pageType = PageType.Markdown
  }
}
