/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2024-2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { App, IObject, Plugin } from "siyuan"
import { type ILogger } from "zhi-lib-base"
import { Topbar } from "./topbar.ts"
import { icons } from "./icons.ts"
import { createAppLogger } from "@utils/appLogger.ts"

import "./index.styl"

/**
 * SiyuanPublisherPlugin 类是 siyuan-note 的插件入口
 *
 * @author terwer
 * @since 2.0.0
 */
export default class SiyuanPublisherPlugin extends Plugin {
  public logger: ILogger = createAppLogger("index")
  private topbar: Topbar = {} as Topbar

  constructor(options: { app: App; id: string; name: string; i18n: IObject }) {
    super(options)
    // topbar
    this.topbar = new Topbar(this)
  }

  async onload() {
    // 注册图标
    this.addIcons(icons.iconPublish)
    // 初始化工具栏
    this.topbar.initTopbar()
    this.logger.info("Publisher loaded")
  }

  onunload() {}

  // ==================
  // private methods
  // ==================
}
