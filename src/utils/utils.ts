import PublisherPlugin from "~/src"

/**
 * 通用工具类
 *
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
export class Utils {
  private static env

  /**
   * 通用环境变量
   *
   * @param pluginInstance - 插件实例
   */
  public static zhiEnv(pluginInstance: PublisherPlugin) {
    if (!this.env) {
      // 环境变量需要在使用的时候显式指定
      this.env = new pluginInstance.zhiEnv.Env(import.meta.env)
    }
    return this.env
  }

  /**
   * 通用日志
   *
   * @param pluginInstance - 插件实例
   * @param loggerName - 日志名称
   */
  public static zhiLog(pluginInstance: PublisherPlugin, loggerName: string) {
    const env = this.zhiEnv(pluginInstance)
    pluginInstance.zhiCommon.ZhiUtil.initEnv(env)

    // 用 common 里面的，这里面我封装了日志缓存
    return pluginInstance.zhiCommon.ZhiUtil.zhiLogWithSign("publisher", loggerName)
  }

  /**
   * 通用工具入口
   *
   * @param pluginInstance - 插件实例
   */
  public static zhiCommon(pluginInstance: PublisherPlugin) {
    return pluginInstance.zhiCommon.ZhiUtil.zhiCommon()
  }

  public static blogApi(appInstance: PublisherPlugin, blogType?: any, blogCfg?: any) {
    const publishSdk = appInstance.zhiPublisherSdk.PublishSdk
    publishSdk.init({
      appInstance: appInstance,
      Env: appInstance.zhiEnv.Env,
      BlogConstants: appInstance.zhiBlogApi.BlogConstants,
      BlogTypeEnum: appInstance.zhiBlogApi.BlogTypeEnum,
      SiyuanConstants: appInstance.zhiSiyuanApi.SiyuanConstants,
      SiyuanConfig: appInstance.zhiSiyuanApi.SiyuanConfig,
      SiYuanApiAdaptor: appInstance.zhiSiyuanApi.SiYuanApiAdaptor,
      BlogApi: appInstance.zhiBlogApi.BlogApi,
    })
    const type = blogType ?? appInstance.zhiBlogApi.BlogTypeEnum.BlogTypeEnum_Siyuan
    const cfg = blogCfg ?? new appInstance.zhiSiyuanApi.SiyuanConfig("", "")
    return publishSdk.blogApi(type, cfg)
  }
}
