import { Plugin } from "siyuan"
import "./index.styl"
import { initLibs } from "~/src/loader"

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
  public zhiCommon
  public zhiBlogApi
  public zhiSiyuanApi
  public zhiElectron

  // lifecycle
  async onload() {
    // 初始化基础类库
    await initLibs(this)

    // 初始化菜单按钮
    console.log(this.zhiDevice.DeviceDetection.getDevice())
    console.log(this.zhiDevice.DeviceTypeEnum)
    console.log(this.zhiEnv.Env)
    console.log(this.zhiLog.LogFactory)
  }

  // ======================
  // private functions
  // ======================
}
