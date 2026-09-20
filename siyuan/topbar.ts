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
 * V1 的旧菜单（文章管理 / 批量分发 / 常规发布 / 图床 / AI 工具 / 扩展功能 / 关于作者）
 * 已随 V1 退役移除；这些入口在 V2 面板内都有对应视图，点击顶栏直接打开 V2 面板。
 */
export class Topbar {
  private logger
  private pluginInstance
  constructor(pluginInstance: PublisherPlugin) {
    this.logger = createSiyuanAppLogger("topbar")
    this.pluginInstance = pluginInstance
  }

  private get v2Host() {
    return this.pluginInstance.v2Host
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
        await self.showV2QuickPublishPanel(topBarElement)
      } catch (e) {
        self.logger.error("V2 panel failed to open:", e)
        showMessage(self.pluginInstance.i18n.publishTool + "：" + (e instanceof Error ? e.message : String(e)), 5000, "error")
      }
    })
  }

  /**
   * 显示 V2 快速发布面板
   */
  private async showV2QuickPublishPanel(topBarElement: HTMLElement) {
    await this.v2Host.show({
      anchorElement: topBarElement,
      initialView: "quick_publish",
    })
  }
}
