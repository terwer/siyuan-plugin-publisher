import { Plugin } from "siyuan"
import "./index.styl"
import { initLibs } from "~/src/loader"
import { Utils } from "~/src/utils/utils"

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
  public zhiBlogApi
  public zhiSiyuanApi
  public zhiElectron

  // 初始化常用工具类
  private env
  private logger
  private common

  // lifecycle
  async onload() {
    // 初始化基础类库
    await initLibs(this)

    // 初始化常用工具类
    this.env = Utils.zhiEnv(this)
    this.logger = Utils.zhiLog(this, "publisher-index")
    this.common = Utils.zhiCommon(this)

    // 初始化菜单按钮

    this.logger.info(this.i18n.publisherLoaded)
  }

  async onunload() {
    this.logger.info(this.i18n.publisherUnloaded)
  }

  // ======================
  // private functions
  // ======================
}
