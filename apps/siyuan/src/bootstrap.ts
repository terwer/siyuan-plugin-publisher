/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createApp } from "vue"
import Publish from "@pages/publish/Index.vue"

const createBootStrap = (props: any, container: string | HTMLElement) => {
  createApp(Publish, props).mount(container)
}

export { createBootStrap }
