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

  // zhi-blog-api
  const zhiBlogApi = (await pluginInstance.importDep("./libs/zhi-blog-api/index.js")) as any
  pluginInstance.zhiBlogApi = {
    BlogConstants: zhiBlogApi["BlogConstants"],
    BlogTypeEnum: zhiBlogApi["BlogTypeEnum"],
    BlogApi: zhiBlogApi["BlogApi"],
  }

  // zhi-siyuan-api
  const zhiSiyuanApi = (await pluginInstance.importDep("./libs/zhi-siyuan-api/index.js")) as any
  pluginInstance.zhiSiyuanApi = {
    SiyuanConstants: zhiSiyuanApi["SiyuanConstants"],
    SiyuanConfig: zhiSiyuanApi["SiyuanConfig"],
    SiYuanApiAdaptor: zhiSiyuanApi["SiYuanApiAdaptor"],
  }

  // zhi-publisher-sdk
  const zhiPublisherSdk = (await pluginInstance.importDep("./libs/zhi-publisher-sdk/index.js")) as any
  pluginInstance.zhiPublisherSdk = {
    PublishSdk: zhiPublisherSdk["PublishSdk"],
  }
}
