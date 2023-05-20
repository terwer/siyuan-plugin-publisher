import { Logger } from "loglevel";
/**
 * 默认日志记录器
 *
 * @public
 * @author terwer
 * @since 1.0.7
 */
interface DefaultLogger extends Logger {
    /**
     * 日志颜色
     */
    colors?: string[];
    /**
     * Output trace message to console.
     * This will also include a full stack trace
     *
     * @param msg - unknown data to log to the console
     */
    trace(...msg: unknown[]): void;
    /**
     * Output debug message to console including appropriate icons
     *
     * @param msg - unknown data to log to the console
     */
    debug(...msg: unknown[]): void;
    /**
     * Output debug message to console including appropriate icons
     *
     * @param msg - unknown data to log to the console
     */
    log(...msg: unknown[]): void;
    /**
     * Output info message to console including appropriate icons
     *
     * @param msg - unknown data to log to the console
     */
    info(...msg: unknown[]): void;
    /**
     * Output warn message to console including appropriate icons
     *
     * @param msg - unknown data to log to the console
     */
    warn(...msg: unknown[]): void;
    /**
     * Output error message to console including appropriate icons
     *
     * @param msg - unknown data to log to the console
     */
    error(...msg: unknown[]): void;
}
export default DefaultLogger;
