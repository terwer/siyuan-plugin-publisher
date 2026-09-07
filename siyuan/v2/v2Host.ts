/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { Menu } from "siyuan"
import { App as VueApp, nextTick } from "vue"
import { createSiyuanAppLogger } from "~/siyuan/appLogger.ts"
import PublisherPlugin from "~/siyuan/index.ts"
import { createV2VueApp, type V2InitialView } from "./createV2App.ts"

const V2_MENU_MOUNT_SELECTOR = ".publisher-v2-menu-content"

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
  private themeObserver: MutationObserver | null = null
  /** 本插件因思源暗黑而临时补上的 html.dark，关闭时必须可逆移除 */
  private htmlDarkAddedByHost = false
  /** 取消进行中的 show / 忽略过期挂载 */
  private showSerial = 0
  private closePromise: Promise<void> | null = null
  private showPromise: Promise<void> | null = null

  constructor(private readonly pluginInstance: PublisherPlugin) {
    this.logger = createSiyuanAppLogger("v2-host")
  }

  /** 思源暗黑唯一信号 */
  private static isHostDarkMode(): boolean {
    return document.documentElement.getAttribute("data-theme-mode") === "dark"
  }

  /**
   * Element Plus dark/css-vars.css 挂在 html.dark；
   * 思源仅有 data-theme-mode，面板打开期间按宿主同步 html.dark（不碰其它属性）。
   */
  private syncHtmlDarkFromHostTheme(): void {
    const html = document.documentElement
    const hostDark = V2Host.isHostDarkMode()

    this.mountPoint?.classList.toggle("dark", hostDark)

    if (hostDark) {
      if (!html.classList.contains("dark")) {
        html.classList.add("dark")
        this.htmlDarkAddedByHost = true
      }
      return
    }

    if (this.htmlDarkAddedByHost) {
      html.classList.remove("dark")
      this.htmlDarkAddedByHost = false
    }
  }

  private startHostThemeObserver(): void {
    this.stopHostThemeObserver()
    this.syncHtmlDarkFromHostTheme()

    this.themeObserver = new MutationObserver(() => {
      this.syncHtmlDarkFromHostTheme()
    })
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme-mode", "class"],
    })
  }

  private stopHostThemeObserver(): void {
    if (this.themeObserver) {
      this.themeObserver.disconnect()
      this.themeObserver = null
    }
  }

  private teardownHtmlDarkSync(): void {
    this.stopHostThemeObserver()
    if (this.htmlDarkAddedByHost) {
      document.documentElement.classList.remove("dark")
      this.htmlDarkAddedByHost = false
    }
  }

  public isOpen(): boolean {
    return this.app !== null
  }

  /** 清理异常退出后残留的挂载点，避免同 id Menu 与 Vue 锚点错乱 */
  private purgeOrphanMountNodes(): void {
    document.querySelectorAll(V2_MENU_MOUNT_SELECTOR).forEach(node => {
      if (!(node instanceof HTMLElement)) {
        return
      }
      if (node === this.mountPoint) {
        return
      }
      node.remove()
    })
  }

  public async show(options: ShowV2HostOptions = {}): Promise<void> {
    if (this.showPromise) {
      return this.showPromise
    }

    this.showPromise = this.showInternal(options).finally(() => {
      this.showPromise = null
    })
    return this.showPromise
  }

  private async showInternal(options: ShowV2HostOptions = {}): Promise<void> {
    await this.close()
    this.purgeOrphanMountNodes()
    const serial = ++this.showSerial

    const menu = new Menu(this.menuId)
    menu.element.style.padding = "0"
    menu.element.style.border = "none"
    menu.element.style.background = "transparent"
    menu.element.style.boxShadow = "none"
    menu.element.style.overflow = "visible"
    const mountPoint = Object.assign(document.createElement("div"), {
      className: "publisher-v2-menu-content",
    })
    mountPoint.classList.toggle("dark", V2Host.isHostDarkMode())
    mountPoint.style.maxHeight = "none"
    mountPoint.style.overflow = "visible"
    if (!this.pluginInstance.isMobile) {
      mountPoint.style.paddingLeft = "16px"
      mountPoint.style.paddingBottom = "12px"
    }
    menu.element.appendChild(mountPoint)
    this.mountPoint = mountPoint

    const app = createV2VueApp({
      initialView: options.initialView ?? "quick_publish",
      locale: "plugin",
      messages: {
        plugin: this.pluginInstance.i18n,
      },
      fallbackResolve: (key: string) => this.resolvePluginI18nKey(key),
      onClose: () => {
        this.logger.info("V2 panel closed")
        void this.close()
      },
    })

    try {
      if (serial !== this.showSerial) {
        mountPoint.remove()
        this.mountPoint = null
        menu.close()
        return
      }

      this.startHostThemeObserver()
      app.mount(mountPoint)
      await nextTick()

      if (serial !== this.showSerial) {
        app.unmount()
        mountPoint.remove()
        this.mountPoint = null
        menu.close()
        return
      }

      this.app = app
      this.menu = menu
      this.openMenu(menu, options.anchorElement)
      this.logger.info("V2 panel mounted")
    } catch (e) {
      this.logger.error("Failed to mount V2 panel:", e)
      await this.close()
      throw e
    }
  }

  public async close(): Promise<void> {
    if (this.closePromise) {
      return this.closePromise
    }

    this.showSerial++
    this.closePromise = this.closeInternal().finally(() => {
      this.closePromise = null
    })
    return this.closePromise
  }

  private async closeInternal(): Promise<void> {
    this.teardownHtmlDarkSync()

    const app = this.app
    const mountPoint = this.mountPoint
    const menu = this.menu
    this.app = null
    this.mountPoint = null
    this.menu = null

    if (app) {
      app.unmount()
    }

    await nextTick()

    mountPoint?.remove()

    menu?.close()
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

  private resolvePluginI18nKey(key: string) {
    const messages = this.pluginInstance.i18n as Record<string, any> | undefined
    if (!key) {
      return undefined
    }

    return this.resolveKeyPath(messages, key)
  }

  private resolveKeyPath(source: Record<string, any> | undefined, key: string) {
    if (!source) {
      return undefined
    }

    if (Object.prototype.hasOwnProperty.call(source, key) && typeof source[key] === "string") {
      return source[key]
    }

    if (!key.includes(".")) {
      return undefined
    }

    const nestedValue = key.split(".").reduce<any>((current, part) => {
      if (current && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, part)) {
        return current[part]
      }
      return undefined
    }, source)

    return typeof nestedValue === "string" ? nestedValue : undefined
  }
}
