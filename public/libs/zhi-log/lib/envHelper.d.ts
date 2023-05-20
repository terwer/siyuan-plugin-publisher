import LogLevelEnum from "./logConstants";
import { Env } from "zhi-env";
/**
 * 解析日志级别为枚举
 *
 * @public
 * @author terwer
 * @since 1.4.0
 */
declare class EnvHelper {
    /**
     * 解析日志级别为枚举
     *
     * @param enumObj - 枚举对象
     * @param value - 配置的值
     */
    private static stringToEnumValue;
    /**
     * 获取配置的日志级别
     */
    static getEnvLevel(env?: Env): LogLevelEnum | undefined;
    /**
     * 获取默认日志
     */
    static getEnvLogger(env?: Env): string | undefined;
}
export default EnvHelper;
