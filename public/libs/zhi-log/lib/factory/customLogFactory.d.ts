import AbstractLogFactory from "./abstractLogFactory";
import LogLevelEnum from "../logConstants";
import { Env } from "zhi-env";
import DefaultLogger from "../defaultLogger";
/**
 * 自定义日志工厂
 *
 * @public
 * @author terwer
 * @since 1.0.7
 */
declare class CustomLogFactory extends AbstractLogFactory {
    constructor(level?: LogLevelEnum, sign?: string, env?: Env);
    /**
     * 获取默认的日志记录器
     *
     * @param loggerName - 日志记录器名称
     * @param stackSize - 打印栈的深度
     */
    getLogger(loggerName?: string, stackSize?: number): DefaultLogger;
}
export default CustomLogFactory;
