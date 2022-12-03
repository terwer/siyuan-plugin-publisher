/*
 * Copyright (c) 2022, Terwer . All rights reserved.
 *  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 *  This code is free software; you can redistribute it and/or modify it
 *  under the terms of the GNU General Public License version 2 only, as
 *  published by the Free Software Foundation.  Terwer designates this
 *  particular file as subject to the "Classpath" exception as provided
 *  by Terwer in the LICENSE file that accompanied this code.
 *
 *  This code is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 *  version 2 for more details (a copy is included in the LICENSE file that
 *  accompanied this code).
 *
 *  You should have received a copy of the GNU General Public License version
 *  2 along with this work; if not, write to the Free Software Foundation,
 *  Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 *  Please contact Terwer, Shenzhen, Guangdong, 518000 China
 *  or visit www.terwer.space if you need additional information or have any
 *  questions.
 */

import { App, Component, createApp, h } from "vue"

// pinia
import { createPinia } from "pinia"

// 国际化
import i18n from "~/locales"

// Element-Plus
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"

// global style
import "~/assets/style.css"
import "~/assets/style.dark.css"

// hljs
// import "./vue-hljs/vue-hljs.js"
// // @ts-expect-error
// import vueHljs from "./vue-hljs/lib/vue-hljs/main.js"

/**
 * 统一的Vue实例创建入口
 * @param rootComponent
 */
const createPage = (rootComponent: Component): App => {
  // Vue初始化
  // const app = createApp(rootComponent)
  const app = createApp({
    render: () => h(rootComponent),
  })

  // pinia
  const pinia = createPinia()
  app.use(pinia)

  // 国际化
  app.use(i18n)

  // vueHljs
  // app.use(vueHljs)

  // Register a global custom directive called `v-focus`
  app.directive("focus", {
    // When the bound element is mounted into the DOM...
    mounted(el) {
      // Focus the element
      el.focus()
    },
  })

  return app
}

const pageUtil = {
  createPage,
}

export default pageUtil
