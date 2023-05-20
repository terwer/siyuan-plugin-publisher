/**
 * @packageDocumentation
 * zhi-log 多平台日志模块
 */
import { Env } from "zhi-env";
import LogLevelEnum, { LogConstants } from "./lib/logConstants";
import AbstractLogFactory from "./lib/factory/abstractLogFactory";
import CustomLogFactory from "./lib/factory/customLogFactory";
import DefaultLogger from "./lib/defaultLogger";
import EnvHelper from "./lib/envHelper";
import crossChalk from "./lib/crossChalk";
/**
 * 日志工具类
 *
 * @public
 * @author terwer
 * @since 1.0.7
 */
declare class LogFactory {
    /**
     * 默认日志记录器
     *
     * @param stackSize - 栈的深度
     * @param env - 环境变量实例
     */
    static defaultLogger(env?: Env, stackSize?: number): DefaultLogger;
    /**
     * 自定义日志工厂
     *
     * @param level - 级别
     * @param sign - 标志
     * @param env - 环境变量
     */
    static customLogFactory(level?: LogLevelEnum, sign?: string, env?: Env): CustomLogFactory;
    /**
     * 自定义日志工厂，自定义前缀
     *
     * @param sign - 标志
     * @param env - 环境变量
     */
    static customSignLogFactory(sign?: string, env?: Env): CustomLogFactory;
}
export { LogFactory };
export { LogLevelEnum, AbstractLogFactory, CustomLogFactory };
export { LogConstants, EnvHelper };
export { crossChalk };
export type { DefaultLogger };
