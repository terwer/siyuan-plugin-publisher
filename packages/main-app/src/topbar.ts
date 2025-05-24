/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { Menu } from "siyuan"
import { createBootStrap } from "./bootstrap.ts"
import PublisherPlugin from "./index"

/**
 * 顶部按钮
 */
export class Topbar {
  private readonly appInstance: PublisherPlugin

  constructor(appInstance: PublisherPlugin) {
    this.appInstance = appInstance
  }

  public initTopbar() {
    const topBarElement = this.appInstance.addTopBar({
      icon: "iconPublish",
      title: this.appInstance.i18n.publisher,
      position: "left",
      callback: () => {},
    })
    topBarElement.addEventListener("click", async () => {
      const menu = new Menu("publisherApp")
      const el = menu.addItem({
        iconHTML: "",
        label: "",
      })
      // 挂载内容到菜单
      const props = {
        pluginInstance: this.appInstance,
      }
      // @ts-ignore
      this.appInstance.vueApp = createBootStrap(props, el)
      // 显示菜单
      const rect = topBarElement.getBoundingClientRect()
      menu.open({
        x: rect.right,
        y: rect.bottom,
        isLeft: true,
      })
    })
  }
}
