import { Dialog, isMobile, Menu, Plugin } from "siyuan"
import "./index.styl"
import { initLibs } from "~/src/loader"
import { initTools } from "~/src/tools"
import iconPublish from "~/src/utils/svg"
import { Utils } from "~/src/utils/utils"
import HtmlUtils from "~/src/utils/htmlUtils"
import PageUtil from "~/src/utils/pageUtil"
import { isDev, Page } from "~/src/constants"

export default class PublisherPlugin extends Plugin {
  public fs
  public path
  public importDep: (moduleName: any) => Promise<any>

  // 基础类库
  public zhiDevice: {
    DeviceDetection
    SiyuanDevice
    DeviceTypeEnum
  }
  public zhiEnv: {
    Env
  }
  public zhiLog: {
    LogFactory
    DefaultLogger
    crossChalk
  }
  public zhiCommon: {
    ZhiCommon
    ZhiUtil
  }
  // public zhiElectron
  public zhiBlogApi: {
    BlogConstants
    BlogTypeEnum
    BlogApi
  }
  public zhiSiyuanApi: {
    SiyuanConstants
    SiyuanConfig
    SiYuanApiAdaptor
    SiyuanKernelApi
  }
  public zhiPublisherSdk: {
    PublishSdk
  }

  // 初始化常用工具类
  // private env
  public logger
  // private common
  public blogApi
  public kernelApi

  // lifecycle
  async onload() {
    // 初始化基础类库
    await initLibs(this)
    // 初始化常用工具类
    await initTools(this)

    // 业务逻辑
    const posts = await this.blogApi.getRecentPosts(10)
    this.logger.info("siyuan recent post=>", posts)

    // 初始化菜单按钮
    this.initTopBar()

    this.logger.info(this.i18n.publisherLoaded)
  }

  async onunload() {
    this.logger.info(this.i18n.publisherUnloaded)
  }

  public openSetting() {
    this.showSettingDialog(this.i18n.setting, Page.Setting)
  }

  // ======================
  // private functions
  // ======================
  private initTopBar() {
    const topBarElement = this.addTopBar({
      icon: iconPublish.iconPlane,
      title: this.i18n.publisher,
      position: "left",
      callback: () => {
        this.initMenu(topBarElement.getBoundingClientRect())
      },
    })
    //添加右键菜单
    topBarElement.addEventListener("contextmenu", () => {
      this.showSettingDialog(this.i18n.setting, Page.Setting)
    })
  }

  private async initMenu(rect: DOMRect) {
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
            // const blogApi = PublishSdk.blogApi(BlogTypeEnum.BlogTypeEnum_Metaweblog)
            // const usersBlogs = blogApi.getUsersBlogs()
            const blogApi = Utils.blogApi(this)
            // const usersBlogs = await blogApi.getUsersBlogs()
            // this.logger.info("发布到博客园", usersBlogs)
            const recentPosts = await blogApi.getRecentPosts(10)
            this.logger.info("发布到博客园", recentPosts)
          },
        },
        {
          iconHTML: iconPublish.iconTypecho,
          label: this.i18n.platformTypecho,
          disabled: true,
          click: () => {
            this.logger.info("发布到Typecho")
          },
        },
        {
          iconHTML: iconPublish.iconWordpress,
          label: this.i18n.platformWordpress,
          click: () => {
            this.showPublisherDialog()
            this.logger.info("发布到WordPress")
          },
        },
        {
          iconHTML: iconPublish.iconYuque,
          label: this.i18n.platformYuque,
          click: () => {
            this.logger.info("发布到语雀")
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
                this.logger.info("发布到Hexo")
              },
            },
            {
              iconHTML: iconPublish.iconHugo,
              label: this.i18n.platformHugo,
              click: () => {
                this.logger.info("发布到Hugo")
              },
            },
            {
              iconHTML: iconPublish.iconVue,
              label: this.i18n.platformVitepress,
              click: () => {
                this.logger.info("发布到Vitepress")
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
        // 使用插件版图床
        // this.showPicbedDialog()

        // 使用挂件版图床
        this.showWidgetPublisherWindow("picgo")
      },
    })

    // 设置
    menu.addSeparator()
    menu.addItem({
      icon: "iconSettings",
      label: this.i18n.setting,
      click: () => {
        this.showSettingDialog(this.i18n.setting, Page.Setting)
      },
      submenu: [
        {
          iconHTML: iconPublish.iconPreference,
          label: this.i18n.settingGeneral,
          click: () => {
            this.showSettingDialog(this.i18n.settingGeneral, Page.GeneralSetting)
          },
        },
        {
          iconHTML: iconPublish.iconPicbed,
          label: this.i18n.settingPicbed,
          click: () => {
            this.showSettingDialog(this.i18n.settingPicbed, Page.PicgoSetting)
          },
        },
        {
          iconHTML: iconPublish.iconPublish,
          label: this.i18n.settingPublish,
          click: () => {
            this.showSettingDialog(this.i18n.settingPublish, Page.PublishSetting)
          },
        },
      ],
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
        this.logger.info("当前文档ID已复制", pageId)
      },
    })

    // slogan
    menu.addSeparator()
    menu.addItem({
      icon: "iconSparkles",
      label: this.i18n.settingMenuTips,
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

  private showSettingDialog(settingTitle: string, settingKey: string) {
    new Dialog({
      title: `${settingTitle} - ${this.i18n.publisher}`,
      content: `<div id="${PageUtil.getElementId(settingKey)}"></div>`,
      // width: isMobile() ? "92vw" : "520px",
      width: isMobile() ? "92vw" : "900px",
      // height: "750px",
    })

    // setting
    PageUtil.createApp(settingKey)
  }

  private showPublisherDialog() {
    new Dialog({
      title: `${this.i18n.setting} - ${this.i18n.publisher}`,
      content: `<div id="${PageUtil.getElementId(Page.Publish)}"></div>`,
      width: isMobile() ? "92vw" : "520px",
    })

    // setting
    PageUtil.createApp(Page.Publish)
  }

  private showPicbedDialog() {
    new Dialog({
      title: `${this.i18n.picbed} - ${this.i18n.publisher}`,
      content: `<div id="${PageUtil.getElementId(Page.Picbed)}"></div>`,
      width: isMobile() ? "92vw" : "520px",
    })

    // setting
    PageUtil.createApp(Page.Picbed)
  }

  // widget functions
  private showWidgetPublisherDialog(publisherIndex: string) {
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

  private showWidgetPublisherWindow(type?: "blog" | "detail" | "picgo") {
    const win = window as any
    const deviceType = this.zhiDevice.DeviceDetection.getDevice()
    this.logger.info(`you are from ${deviceType}`)

    let pageId: string | undefined = PageUtil.getPageId()
    if (pageId == "") {
      pageId = undefined
    }
    this.logger.debug("pageId=>", pageId)

    if (deviceType == this.zhiDevice.DeviceTypeEnum.DeviceType_Siyuan_MainWin) {
      this.importDep("./libs/plugin-publisher-bridge/index.js").then((bridge) => {
        const publisherBridge = new bridge.default()
        publisherBridge.init().then(() => {
          let pageUrl
          switch (type) {
            case "blog":
              // 博客首页
              pageUrl = "blog/index.html"
              break
            case "detail":
              // 详情
              pageUrl = "detail/index.html"
              break
            case "picgo":
              pageUrl = "picgo/index.html"
              break
            default:
              // 发布首页
              pageUrl = "index.html"
              break
          }
          if (!pageId && pageUrl === "index.html") {
            pageUrl = "blog/index.html"
          }

          win.syp.renderPublishHelper(pageId, pageUrl, win, isDev)
          this.logger.debug("publisherHook inited")
        })
      })
    } else {
      const publisherIndex = `/widgets/sy-post-publisher/index.html`
      this.showWidgetPublisherDialog(publisherIndex)
    }
  }
}
