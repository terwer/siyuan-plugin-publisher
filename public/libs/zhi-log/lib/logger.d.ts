import LogLevelEnum from "./logConstants";
import { CallSite } from "callsites";
import { Env } from "zhi-env";
import DefaultLogger from "./defaultLogger";
/**
 * 日志工具类
 *
 * @author terwer
 * @since 1.0.0
 */
declare class Logger {
    private consoleLogger;
    private stackSize;
    /**
     * 设置输出栈的深度，默认1
     *
     * @param stackSize - 栈的深度
     */
    setStackSize(stackSize?: number): void;
    constructor(level?: LogLevelEnum, sign?: string, env?: Env);
    /**
     * 获取调用堆栈，若未获取到直接返回空数组
     *
     * @author terwer
     * @since 1.6.0
     */
    getCallStack(): CallSite[];
    /**
     * 获取日志记录器
     *
     * @param loggerName - 日志记录器，默认为 console
     * @author terwer
     * @since 1.0.0
     */
    getLogger: (loggerName?: string) => DefaultLogger;
}
export default Logger;
