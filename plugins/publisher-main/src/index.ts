import { Dialog, isMobile, Menu, Plugin } from "siyuan"
import App from "./App.svelte"
import { DeviceDetection, DeviceTypeEnum } from "zhi-device"
import { Env } from "zhi-env"

const STORAGE_NAME = "menu-config"
const SETTING_CONTAINER = "publish-tool-setting"

// https://github.com/sveltejs/svelte-preprocess/issues/91#issuecomment-548527600
export default class PublishTool extends Plugin {
  private env: Env = new Env(import.meta.env)

  // lifecycle
  public onload() {
    this._addTopBar()
    console.log(`Publish Tool loaded ${new Date().getTime()}`)
  }

  public onunload() {
    console.log("Publish Tool unloaded")
  }

  public openSetting() {
    this._showSettingDialog()
  }

  // private functions
  private _addTopBar() {
    const topBarElement = this.addTopBar({
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"/></svg>`,
      title: this.i18n.publishTool,
      position: "right",
      callback: () => {
        this._addMenu(topBarElement.getBoundingClientRect())
      },
    })
  }

  private async _addMenu(rect: DOMRect) {
    if (!this.data) {
      await this.loadData(STORAGE_NAME)
    }

    const menu = new Menu("topBarSample")
    menu.addItem({
      icon: "iconInfo",
      label: this.i18n.setting,
      click: () => {
        this._showSettingDialog()
      },
    })

    menu.addSeparator()
    menu.addItem({
      icon: "iconInfo",
      label: this.i18n.publisherWidget,
      click: () => {
        this._showPublisherWidget()
      },
    })

    menu.addSeparator()
    menu.addItem({
      icon: "iconSparkles",
      label: this.data[STORAGE_NAME] || this.i18n.settingMenuTips,
      type: "readonly",
    })
    if (isMobile()) {
      menu.fullscreen()
    } else {
      menu.open({
        x: rect.right,
        y: rect.bottom,
        isLeft: true,
      })
    }
  }

  private _showSettingDialog() {
    new Dialog({
      title: `${this.i18n.setting} - ${this.i18n.publishTool}`,
      content: `<div id="${SETTING_CONTAINER}"></div>`,
      width: isMobile() ? "92vw" : "520px",
    })

    // setting
    new App({
      target: document.getElementById(SETTING_CONTAINER) as HTMLElement,
    })

    // const inputElement = dialog.element.querySelector("textarea") as HTMLTextAreaElement
    // const btnsElement = dialog.element.querySelectorAll(".b3-button")
    // dialog.bindInput(inputElement, () => {
    //   ;(btnsElement[1] as HTMLButtonElement).click()
    // })
    // inputElement.focus()
    // btnsElement[0].addEventListener("click", () => {
    //   dialog.destroy()
    // })
    // btnsElement[1].addEventListener("click", () => {
    //   this.saveData(STORAGE_NAME, inputElement.value)
    //   dialog.destroy()
    // })
  }

  private _showPublisherDialog(publisherIndex: string) {
    const contentHtml = `<style>
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        </style>
        <iframe src="${publisherIndex}" width="100%"></iframe>`

    new Dialog({
      title: this.i18n.siyuanBlog,
      transparent: false,
      content: contentHtml,
      width: "90%",
      height: "750px",
    } as any)
  }

  private _showPublisherWidget() {
    const win = window as any
    const deviceType: DeviceTypeEnum = DeviceDetection.getDevice()
    console.log(`you are from ${deviceType}`)

    const publisherIndex = `/widgets/sy-post-publisher/index.html`

    console.log(this.env)
    console.log(this.env.isDev())
    if (deviceType == DeviceTypeEnum.DeviceType_Siyuan_MainWin) {
      import("/plugins/publish-tool/lib/bridge/index.js" as any).then((bridge) => {
        const publisherBridge = new bridge.default()
        publisherBridge.init().then(() => {
          // 发布首页
          // const pageId: any = "111111"
          // const pageUrl = "index.html"

          // 博客首页
          const pageId: any = undefined
          const pageUrl = "blog/index.html"

          // 详情
          // const widgetId = "1111111"
          // const pageUrl = "detail/index.html"

          win.syp.renderPublishHelper(pageId, pageUrl, win, this.env.isDev())
          console.log("publisherHook inited")
        })
      })
    } else {
      this._showPublisherDialog(publisherIndex)
    }
  }
}
