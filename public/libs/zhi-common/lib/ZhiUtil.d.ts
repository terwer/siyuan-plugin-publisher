import { DefaultLogger } from "zhi-log";
import { Env } from "zhi-env";
import ZhiCommon from "./zhi-common";
/**
 * 工具类统一入口，每个应用自己实现，可继承 zhi-common 然后扩展
 *
 * ```
 * zhiEnv 方法必须重写，zhiLog 方法可不用
 * ```
 *
 * @public
 * @author terwer
 * @since 1.0.0
 */
declare abstract class ZhiUtil {
    /**
     * zhi-util 的运行时环境
     */
    protected static env: Env | undefined;
    /**
     * zhi-util 的日志器缓存
     */
    protected static loggerMap: {
        [key: string]: DefaultLogger;
    };
    /**
     * zhi-util 的通用工具类
     */
    protected static common: ZhiCommon | undefined;
    /**
     * 某些情况下，可能需要手动 init 之后才能用
     */
    static initEnv(env: Env): void;
    /**
     * 获取 zhi-env 实例 - 必须在使用的时候重写此方法
     *
     * ```
     * if (!this.env) {
     *   this.env = new Env(import.meta.env)
     * }
     * return this.env
     * ```
     *
     * @see {@link https://github.com/terwer/zhi/tree/main/apps/zhi-env#usage docs for zhi-env usage}
     */
    static zhiEnv(): Env;
    /**
     * 获取 zhi-log 实例
     *
     * @param sign - 标志
     * @param loggerName - 日志名称
     */
    static zhiLogWithSign(sign: string, loggerName: string): DefaultLogger;
    /**
     * 获取 zhi-log 实例
     *
     * @param loggerName - 日志名称
     */
    static zhiLog(loggerName: string): DefaultLogger;
    /**
     * 获取 zhi-common 实例
     */
    static zhiCommon(): ZhiCommon;
}
export default ZhiUtil;
