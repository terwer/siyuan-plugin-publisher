import { Plugin, showMessage, confirm, Dialog, Menu, isMobile, openTab, adaptHotkey } from "siyuan"
import App from "./App.svelte"

const STORAGE_NAME = "menu-config"
const SETTING_CONTAINER = "publish-tool-setting"

// https://github.com/sveltejs/svelte-preprocess/issues/91#issuecomment-548527600
export default class PublishTool extends Plugin {
  // lifecycle
  onload() {
    console.log(`Publish Tool loaded ${new Date().getTime()}`)
  }

  onunload() {
    console.log("Publish Tool unloaded")
  }

  openSetting() {
    this._show_setting_dialog()
  }

  // private functions
  _show_setting_dialog() {
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
