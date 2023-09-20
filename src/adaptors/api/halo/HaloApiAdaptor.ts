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

import { HaloConfig } from "~/src/adaptors/api/halo/HaloConfig.ts"
import { BaseBlogApi } from "~/src/adaptors/api/base/baseBlogApi.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * Halo API 适配器
 * @see [Halo API](https://github.com/halo-sigs/vscode-extension-halo/blob/main/src/service/index.ts)
 */
class HaloApiAdaptor extends BaseBlogApi {
  constructor(appInstance: any, cfg: HaloConfig) {
    super(appInstance, cfg)
    this.logger = createAppLogger("halo-api-adaptor")
  }
}

export { HaloApiAdaptor }
