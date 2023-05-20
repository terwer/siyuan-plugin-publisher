import { Plugin } from "siyuan"
import "./index.styl"
import { initLibs } from "~/src/loader"
import { initTools } from "~/src/tools"

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
  }
  public zhiPublisherSdk: {
    PublishSdk
  }

  // 初始化常用工具类
  // private env
  public logger
  // private common
  public blogApi

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
    // TODO

    this.logger.info(this.i18n.publisherLoaded)
  }

  async onunload() {
    this.logger.info(this.i18n.publisherUnloaded)
  }

  // ======================
  // private functions
  // ======================
}
