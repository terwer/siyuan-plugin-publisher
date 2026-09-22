/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2023-2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { showMessage } from "siyuan"
import { createSiyuanAppLogger } from "./appLogger"
import PublisherPlugin from "./index"
import { icons } from "./utils/svg"

/**
 * 顶部按钮
 *
 * 点击顶栏直接打开面板；文章管理 / 批量分发 / 常规发布 / 图床 / AI 工具 / 关于作者
 * 这些入口在面板内都有对应视图。
 */
export class Topbar {
  private logger
  private pluginInstance
  constructor(pluginInstance: PublisherPlugin) {
    this.logger = createSiyuanAppLogger("topbar")
    this.pluginInstance = pluginInstance
  }

  private get pluginHost() {
    return this.pluginInstance.pluginHost
  }

  public initTopbar() {
    const self = this
    const topBarElement = this.pluginInstance.addTopBar({
      icon: icons.iconPlane,
      title: this.pluginInstance.i18n.publishTool,
      position: "left",
      callback: () => {},
    })

    topBarElement.addEventListener("click", async () => {
      try {
        await self.showQuickPublishPanel(topBarElement)
      } catch (e) {
        self.logger.error("panel failed to open:", e)
        showMessage(self.pluginInstance.i18n.publishTool + "：" + (e instanceof Error ? e.message : String(e)), 5000, "error")
      }
    })
  }

  /**
   * 显示 快速发布面板
   */
  private async showQuickPublishPanel(topBarElement: HTMLElement) {
    await this.pluginHost.show({
      anchorElement: topBarElement,
      initialView: "quick_publish",
    })
  }
}
