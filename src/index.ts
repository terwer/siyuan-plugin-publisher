import { Plugin } from "siyuan"
import "./index.styl"
import { initLibs } from "~/src/loader"

export default class PublisherPlugin extends Plugin {
  public fs
  public path
  public importDep: (moduleName: any) => Promise<any>

  // 基础类库
  public zhiDevice
  public zhiEnv
  public zhiLog
  public zhiCommon
  public zhiBlogApi
  public zhiSiyuanApi
  public zhiElectron

  // lifecycle
  async onload() {
    // 初始化基础类库
    await initLibs(this)
  }

  // ======================
  // private functions
  // ======================
}
