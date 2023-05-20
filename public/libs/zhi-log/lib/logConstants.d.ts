/**
 * 日志常量
 *
 * @public
 * @author terwer
 * @since 1.4.0
 */
declare class LogConstants {
    static readonly LOG_LEVEL_KEY = "VITE_LOG_LEVEL";
    static readonly LOG_PREFIX_KEY = "VITE_LOG_PREFIX";
}
/**
 * 日志级别
 *
 * @author terwer
 * @since 1.0.7
 * @public
 */
declare enum LogLevelEnum {
    /**
     * TRACE
     */
    LOG_LEVEL_TRACE = "TRACE",
    /**
     * DEBUG
     */
    LOG_LEVEL_DEBUG = "DEBUG",
    /**
     * INFO
     */
    LOG_LEVEL_INFO = "INFO",
    /**
     * WARN
     */
    LOG_LEVEL_WARN = "WARN",
    /**
     * ERROR
     */
    LOG_LEVEL_ERROR = "ERROR"
}
export default LogLevelEnum;
export { LogConstants };
