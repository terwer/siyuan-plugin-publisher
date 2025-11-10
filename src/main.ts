/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createVueApp } from "./bootstrap"

import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"

;(async () => {
  const instance = await createVueApp()
  const app = instance.app

  // 挂载 vue app
  app.mount("#app")
})()
