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

import { createVueApp } from "./utils/VueUtils"
import { InjectKeys } from "./utils/injectKeys"
import { createAppLogger } from "./utils/appLogger"

import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"

;(async () => {
  const logger = createAppLogger("main")

  const instance = await createVueApp()
  const app = instance.app

  // 挂载 vue app
  app.mount("#app")

  // 暴露 Vue 实例
  app.provide(InjectKeys.VUE_INSTANCE, app)
  logger.info("vue app created")
})()
