import { App as VueApp } from "vue"
import { Menu } from "siyuan"
import { createSiyuanAppLogger } from "~/siyuan/appLogger.ts"
import PublisherPlugin from "~/siyuan/index.ts"
import { createV2VueApp, type V2InitialView } from "~/src/v2/createV2App.ts"

interface ShowV2HostOptions {
  anchorElement?: HTMLElement
  initialView?: V2InitialView
}

/**
 * V2 运行时宿主，基于思源原生 Menu 挂载真实 DOM。
 */
export class V2Host {
  private readonly logger
  private readonly menuId = "publisher-v2-menu"
  private app: VueApp<Element> | null = null
  private menu: Menu | null = null
  private mountPoint: HTMLElement | null = null

  constructor(private readonly pluginInstance: PublisherPlugin) {
    this.logger = createSiyuanAppLogger("v2-host")
  }

  public async show(options: ShowV2HostOptions = {}) {
    this.close()

    const menu = new Menu(this.menuId)
    menu.element.style.padding = "0"
    menu.element.style.border = "none"
    menu.element.style.background = "transparent"
    menu.element.style.boxShadow = "none"
    menu.element.style.overflow = "visible"
    const mountPoint = Object.assign(document.createElement("div"), {
      className: "publisher-v2-menu-content",
    })
    mountPoint.style.maxHeight = "none"
    mountPoint.style.overflow = "visible"
    if (!this.pluginInstance.isMobile) {
      mountPoint.style.paddingLeft = "16px"
      mountPoint.style.paddingBottom = "12px"
    }
    menu.element.appendChild(mountPoint)

    const app = createV2VueApp({
      initialView: options.initialView ?? "quick_publish",
      locale: "plugin",
      messages: {
        plugin: this.pluginInstance.i18n,
      },
      onClose: () => {
        this.logger.info("V2 panel closed")
        this.close()
      },
    })

    try {
      app.mount(mountPoint)
      this.app = app
      this.menu = menu
      this.mountPoint = mountPoint
      this.openMenu(menu, options.anchorElement)
      this.logger.info("V2 panel mounted")
    } catch (e) {
      this.logger.error("Failed to mount V2 panel:", e)
      this.close()
      throw e
    }
  }

  public close() {
    if (this.app) {
      this.app.unmount()
      this.app = null
    }

    if (this.mountPoint) {
      this.mountPoint.remove()
      this.mountPoint = null
    }

    if (this.menu) {
      this.menu.close()
      this.menu = null
    }
  }

  private openMenu(menu: Menu, anchorElement?: HTMLElement) {
    if (this.pluginInstance.isMobile) {
      menu.fullscreen("all")
      return
    }

    const rect = anchorElement?.getBoundingClientRect()
    if (!rect) {
      menu.fullscreen("all")
      return
    }

    menu.open({
      x: rect.left,
      y: rect.bottom,
      isLeft: true,
    })
  }
}
