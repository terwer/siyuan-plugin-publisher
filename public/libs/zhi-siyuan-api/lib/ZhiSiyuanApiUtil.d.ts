/**
 * 工具类统一入口，每个应用自己实现
 *
 * @public
 * @author terwer
 * @since 1.0.0
 */
declare class ZhiSiyuanApiUtil {
    private static env;
    /**
     * 通用环境变量
     *
     * @param appInstance - 插件实例
     */
    static zhiEnv(appInstance: any): any;
    /**
     * 通用日志
     *
     * @param appInstance - 应用实例
     * @param loggerName - 日志名称
     */
    static zhiLog(appInstance: any, loggerName: string): any;
    /**
     * 通用工具入口
     *
     * @param appInstance - 应用实例
     */
    static zhiCommon(appInstance: any): any;
}
export default ZhiSiyuanApiUtil;
