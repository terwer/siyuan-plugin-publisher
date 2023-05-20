import { Utils } from "~/src/utils/utils"
import PublisherPlugin from "~/src/index"

/**
 * 初始化工具类
 *
 * @param appInstance - 应用实例
 */
export const initTools = async (appInstance: PublisherPlugin) => {
  // this.env = Utils.zhiEnv(this)
  appInstance.logger = Utils.zhiLog(appInstance, "publisher-index")
  // this.common = Utils.zhiCommon(appInstance)

  // blogApi
  appInstance.blogApi = Utils.blogApi(appInstance)
}
