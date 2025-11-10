/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createRouter, createWebHashHistory, Router } from "vue-router"
import { routeConfig } from "~/src/routes/routeConfig.ts"

export const useVueRouter = (): Router => {
  return createRouter({
    history: createWebHashHistory(),
    routes: routeConfig,
  })
}
