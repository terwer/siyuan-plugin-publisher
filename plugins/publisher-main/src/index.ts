import { Dialog, isMobile, Menu, Plugin } from "siyuan"
import { DeviceDetection, DeviceTypeEnum } from "zhi-device"
import { Env } from "zhi-env"
import { CustomLogFactory, DefaultLogger } from "zhi-log"
import "./index.styl"
import PageUtil from "./utils/pageUtil"
import Constants from "./utils/constants"
import iconPublish from "./utils/svg"
import HtmlUtils from "./utils/htmlUtils"
import { SiyuanKernelApi } from "zhi-siyuan-api"
import { PublishSdk } from "zhi-publisher-sdk"
import { BlogTypeEnum } from "zhi-blog-api"

const STORAGE_NAME = "menu-config"

// https://github.com/siyuan-note/siyuan/pull/8188/
// https://github.com/vitejs/vite/issues/6582#issuecomment-1546954468
// https://github.com/sveltejs/svelte-preprocess/issues/91#issuecomment-548527600
export default class PublishTool extends Plugin {
  private env: Env = new Env(process.env)
  private logger: DefaultLogger = new CustomLogFactory(undefined, "publish-tool", this.env).getLogger("main")

  private kernelApi: SiyuanKernelApi = new SiyuanKernelApi(this.env)

  // lifecycle
  public onload() {
    this._addTopBar()
    this.logger.debug(`Publish Tool loaded ${new Date().getTime()}`)
  }

  public onunload() {
    this.logger.debug("Publish Tool unloaded")
  }

  public openSetting() {
    this._showSettingDialog()
  }

  // private functions
  private _addTopBar() {
    const topBarElement = this.addTopBar({
      icon: iconPublish.iconPlane,
      title: this.i18n.publishTool,
      position: "left",
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

    // 发布到
    menu.addItem({
      icon: `iconRiffCard`,
      label: this.i18n.publishTo,
      submenu: [
        {
          iconHTML: iconPublish.iconCnblogs,
          label: this.i18n.platformCnblogs,
          click: async () => {
            const blogApi = PublishSdk.blogApi(BlogTypeEnum.BlogTypeEnum_Metaweblog)
            const usersBlogs = blogApi.getUsersBlogs()
            this.logger.debug("发布到博客园", usersBlogs)
          },
        },
        {
          iconHTML: iconPublish.iconTypecho,
          label: this.i18n.platformTypecho,
          disabled: true,
          click: () => {
            this.logger.debug("发布到Typecho")
          },
        },
        {
          iconHTML: iconPublish.iconWordpress,
          label: this.i18n.platformWordpress,
          click: () => {
            this.logger.debug("发布到WordPress")
          },
        },
        {
          iconHTML: iconPublish.iconYuque,
          label: this.i18n.platformYuque,
          click: () => {
            this.logger.debug("发布到语雀")
          },
        },
        {
          iconHTML: iconPublish.iconGithub,
          label: this.i18n.platformGithub,
          submenu: [
            {
              iconHTML: iconPublish.iconHexo,
              label: this.i18n.platformHexo,
              click: () => {
                this.logger.debug("发布到Hexo")
              },
            },
            {
              iconHTML: iconPublish.iconHugo,
              label: this.i18n.platformHugo,
              click: () => {
                this.logger.debug("发布到Hugo")
              },
            },
            {
              iconHTML: iconPublish.iconVue,
              label: this.i18n.platformVitepress,
              click: () => {
                this.logger.debug("发布到Vitepress")
              },
            },
          ],
        },
      ],
    })

    // 图床
    menu.addSeparator()
    menu.addItem({
      iconHTML: iconPublish.iconPicture,
      label: this.i18n.picbed,
      click: () => {
        this._showPicbedDialog()
      },
    })

    // 设置
    menu.addSeparator()
    menu.addItem({
      icon: "iconSettings",
      label: this.i18n.setting,
      click: () => {
        this._showSettingDialog()
      },
      submenu: [
        {
          iconHTML: iconPublish.iconPreference,
          label: this.i18n.settingGeneral,
          click: () => {
            console.log(11111)
          },
        },
        {
          iconHTML: iconPublish.iconPicbed,
          label: this.i18n.settingPicbed,
        },
        {
          iconHTML: iconPublish.iconPublish,
          label: this.i18n.settingPublish,
        },
      ],
    })

    // 挂件版
    menu.addSeparator()
    menu.addItem({
      icon: "iconTransform",
      label: this.i18n.publisherWidget,
      click: () => {
        this._showPublisherWidget()
      },
    })

    // 当前文档ID
    const pageId = PageUtil.getPageId()
    menu.addSeparator()
    menu.addItem({
      iconHTML: iconPublish.iconOl,
      label: this.i18n.copyPageId,
      click: async () => {
        await HtmlUtils.copyToClipboard(pageId)
        this.kernelApi.pushMsg({
          msg: `当前文档ID已复制=>${pageId}`,
          timeout: 3000,
        })
        // this.logger.info("当前文档ID已复制", pageId)
      },
    })

    // slogan
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

  private _showPicbedDialog() {
    new Dialog({
      title: `${this.i18n.picbed} - ${this.i18n.publishTool}`,
      content: `<div id="${PageUtil.getElementId(Constants.Page.Picbed)}"></div>`,
      width: isMobile() ? "92vw" : "520px",
    })

    // setting
    PageUtil.createApp(Constants.Page.Picbed)
  }

  private _showSettingDialog() {
    new Dialog({
      title: `${this.i18n.setting} - ${this.i18n.publishTool}`,
      content: `<div id="${PageUtil.getElementId(Constants.Page.Setting)}"></div>`,
      width: isMobile() ? "92vw" : "520px",
    })

    // setting
    PageUtil.createApp(Constants.Page.Setting)
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
    this.logger.info(`you are from ${deviceType}`)

    const publisherIndex = `/widgets/sy-post-publisher/index.html`

    if (deviceType == DeviceTypeEnum.DeviceType_Siyuan_MainWin) {
      import("/plugins/publish-tool/lib/bridge/index.js" as any).then((bridge) => {
        const publisherBridge = new bridge.default()
        publisherBridge.init().then(() => {
          // 发布首页
          const pageId = PageUtil.getPageId()
          const pageUrl = "index.html"

          // 博客首页
          // const pageId: any = undefined
          // const pageUrl = "blog/index.html"

          // 详情
          // const pageId = PageUtil.getPageId()
          // const pageUrl = "detail/index.html"

          win.syp.renderPublishHelper(pageId, pageUrl, win, this.env.isDev())
          this.logger.debug("publisherHook inited")
        })
      })
    } else {
      this._showPublisherDialog(publisherIndex)
    }
  }
}
