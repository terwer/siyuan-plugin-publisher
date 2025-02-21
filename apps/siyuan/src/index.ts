/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2024 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import {App, IObject, Plugin} from "siyuan"
import {Topbar} from "./topbar.ts"
import {icons} from "./icons.ts"

/**
 * SiyuanBlogPlugin 类是 siyuan-note 的插件入口
 *
 * @author terwer
 * @since 5.4.0
 */
export default class SiyuanBlogPlugin extends Plugin {
  // public logger: ILogger = simpleLogger("index", "siyuan-blog", isDev)
  private topbar: Topbar = {} as Topbar

  constructor(options: { app: App; id: string; name: string; i18n: IObject }) {
    super(options)
    // topbar
    this.topbar = new Topbar(this)
  }

  async onload() {
    // 注册图标
    this.addIcons(icons.iconShare)
    // 初始化工具栏
    this.topbar.initTopbar()
  }

  onunload() {
  }

  // ==================
  // private methods
  // ==================
}
