import LogLevelEnum from "../logConstants";
import { Env } from "zhi-env";
import DefaultLogger from "../defaultLogger";
/**
 * 日志记录工厂
 *
 * @public
 * @author terwer
 * @since 1.0.0
 */
declare abstract class AbstractLogFactory {
    private logger;
    /**
     * 默认日志级别
     *
     * @param level - 可选，未设置默认INFO
     * @param sign - 可选前缀，默认zhi
     * @param env - 可选环境变量实例
     */
    protected constructor(level?: LogLevelEnum, sign?: string, env?: Env);
    /**
     * 获取日志记录器
     *
     * @param loggerName - 日志记录器名称
     * @param stackSize - 打印栈的深度
     * @protected
     */
    protected getLogger(loggerName?: string, stackSize?: number): DefaultLogger;
}
export default AbstractLogFactory;
