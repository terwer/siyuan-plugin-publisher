import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { getDynamicJsonCfg } from "~/utils/platform/dynamicConfig"
import { getBooleanConf } from "~/utils/configUtil"

/**
 * 根据平台类型获取发布状态
 * @param apiType 平台类型
 * @param meta 元数据
 */
export const getPublishStatus = (apiType: string, meta: any): boolean => {
  // 固定的平台
  const metaweblogTypeArray = [
    API_TYPE_CONSTANTS.API_TYPE_JVUE,
    API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE,
    API_TYPE_CONSTANTS.API_TYPE_CNBLOGS,
    API_TYPE_CONSTANTS.API_TYPE_WORDPRESS,
  ]

  // 通用自定义平台
  // const commonblogTypeArray = [
  //   API_TYPE_CONSTANTS.API_TYPE_LIANDI,
  //   API_TYPE_CONSTANTS.API_TYPE_YUQUE,
  //   API_TYPE_CONSTANTS.API_TYPE_KMS,
  // ]

  // 读取动态类型
  const dynamicJsonCfg = getDynamicJsonCfg()
  // const dynamicConfigArray = dynamicJsonCfg.totalCfg || []
  const metaweblogArray = dynamicJsonCfg.metaweblogCfg || []
  const wordpressArray = dynamicJsonCfg.wordpressCfg || []
  // metaweblog
  metaweblogArray.forEach((item) => {
    const apiType = item.platformKey
    // const postidKey = 'custom-' + item.platformKey + '-post-id'
    const switchKey = "switch-" + item.platformKey
    const switchValue = getBooleanConf(switchKey)
    if (switchValue) {
      metaweblogTypeArray.push(apiType)
    }
  })
  // WordPress
  wordpressArray.forEach((item) => {
    const apiType = item.platformKey
    // const postidKey = 'custom-' + item.platformKey + '-post-id'
    const switchKey = "switch-" + item.platformKey
    const switchValue = getBooleanConf(switchKey)
    if (switchValue) {
      metaweblogTypeArray.push(apiType)
    }
  })

  // if (apiType === API_TYPE_CONSTANTS.API_TYPE_VUEPRESS) {
  //   const postidKey = getApiParams<IGithubCfg>(apiType).posidKey
  //   const postId = meta[postidKey] || ""
  //   logUtil.logInfo("平台=>", apiType)
  //   logUtil.logInfo("meta=>", meta)
  //   logUtil.logInfo("postidKey=>", postidKey)
  //   logUtil.logInfo("postidKey的值=>", postId)
  //   return postId !== ""
  // } else if (metaweblogTypeArray.includes(apiType)) {
  //   const postidKey = getApiParams<IMetaweblogCfg>(apiType).posidKey
  //   const postId = meta[postidKey] || ""
  //   logUtil.logInfo("平台=>", apiType)
  //   logUtil.logInfo("meta=>", meta)
  //   logUtil.logInfo("postidKey=>", postidKey)
  //   logUtil.logInfo("postidKey的值=>", postId)
  //   return postId !== ""
  // } else if (commonblogTypeArray.includes(apiType)) {
  //   const postidKey = getApiParams<ICommonblogCfg>(apiType).posidKey
  //   const postId = meta[postidKey ?? ""] || ""
  //   logUtil.logInfo("平台=>", apiType)
  //   logUtil.logInfo("meta=>", meta)
  //   logUtil.logInfo("postidKey=>", postidKey)
  //   logUtil.logInfo("postidKey的值=>", postId)
  //   return postId !== ""
  // }

  return false
}
