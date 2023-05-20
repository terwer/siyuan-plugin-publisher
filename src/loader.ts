import PublisherPlugin from "~/src/index"
import { moduleBase } from "~/src/constants"

export const initLibs = async (pluginInstance: PublisherPlugin) => {
  // polyfills
  pluginInstance.fs = (await import(`${moduleBase}/polyfills/fs.js`))["default"]
  pluginInstance.path = (await import(`${moduleBase}/polyfills/path.js`))["default"]
  pluginInstance.importDep = async (moduleName) => {
    return await import(pluginInstance.path.join(moduleBase, moduleName))
  }

  // libs

  // zhi-device
  const zhiDevice = (await pluginInstance.importDep("./libs/zhi-device/index.js")) as any
  pluginInstance.zhiDevice = {
    DeviceDetection: zhiDevice["DeviceDetection"],
    SiyuanDevice: zhiDevice["SiyuanDevice"],
    DeviceTypeEnum: zhiDevice["DeviceTypeEnum"],
  }

  // zhi-env
  const zhiEnv = (await pluginInstance.importDep("./libs/zhi-env/index.js")) as any
  pluginInstance.zhiEnv = {
    Env: zhiEnv["Env"],
  }

  // zhi-log
  const zhiLog = (await pluginInstance.importDep("./libs/zhi-log/index.js")) as any
  pluginInstance.zhiLog = {
    LogFactory: zhiLog["LogFactory"],
    DefaultLogger: zhiLog["DefaultLogger"],
    crossChalk: zhiLog["crossChalk"],
  }

  // zhi-common
  const zhiCommon = (await pluginInstance.importDep("./libs/zhi-common/index.js")) as any
  pluginInstance.zhiCommon = {
    ZhiCommon: zhiCommon["ZhiCommon"],
    ZhiUtil: zhiCommon["ZhiUtil"],
  }
}
