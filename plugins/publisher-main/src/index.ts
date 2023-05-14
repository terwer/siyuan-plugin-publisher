import { Dialog, isMobile, Menu, Plugin } from "siyuan"
import App from "./App.svelte"

const STORAGE_NAME = "menu-config"
const SETTING_CONTAINER = "publish-tool-setting"

// https://github.com/sveltejs/svelte-preprocess/issues/91#issuecomment-548527600
export default class PublishTool extends Plugin {
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
      icon: "iconForward",
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
}
