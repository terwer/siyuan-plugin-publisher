import PublisherPlugin from "~/src/index"
import { moduleBase } from "~/src/constants"

export const initLibs = async (pluginInstance: PublisherPlugin) => {
  pluginInstance.fs = (await import(`${moduleBase}/polyfills/fs.js`))["default"]
  pluginInstance.path = (await import(`${moduleBase}/polyfills/path.js`))["default"]
  console.log(pluginInstance.fs)
  console.log(pluginInstance.path)
  pluginInstance.importDep = async (moduleName) => {
    return await import(pluginInstance.path.join(moduleBase, moduleName))
  }

  const zhiDevice = (await pluginInstance.importDep("./libs/zhi-device/index.js"))["DeviceDetection"]
  console.log(zhiDevice.getDevice())

  // const zhiEnv = (await import(`/plugins/siyuan-publisher/libs/zhi-env/index.js`))["Env"]
  // console.log(zhiEnv)
  // const zhiEnv2 = await pluginInstance.importDep("./libs/zhi-env/index.js")["Env"]
  // console.log(zhiEnv2)

  // const zhiDeviceModulePath = pluginInstance.path.join("/plugins/siyuan-publisher", "./libs/zhi-device/index.js")
  // const zhiDevice = (await import(zhiDeviceModulePath))["DeviceDetection"]
  // console.log(zhiDevice.getDevice())
}
