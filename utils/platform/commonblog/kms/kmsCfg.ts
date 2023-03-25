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

import { CommonblogCfg } from "../commonblogCfg"
import { POSTID_KEY_CONSTANTS } from "~/utils/constants/postidKeyConstants"
import { PageType } from "../../metaweblog/IMetaweblogCfg"

/**
 * Kms配置
 */
export class KmsCfg extends CommonblogCfg {
  constructor() {
    super()

    this.home = "http://localhost:9564/kms16_release/kms/multidoc"
    this.apiUrl = "http://localhost:9564/kms16_release/api/kms-multidoc/kmsMultidocKnowledgeRestService"
    this.tokenSettingUrl = "http://localhost:9564/kms16_release/sys/profile/index.jsp#integrate/RestService/"
    this.posidKey = POSTID_KEY_CONSTANTS.KMS_POSTID_KEY
    this.previewUrl = "/kms_multidoc_knowledge/kmsMultidocKnowledge.do?method=view&fdId=[postid]"
    this.pageType = PageType.Html
  }
}
