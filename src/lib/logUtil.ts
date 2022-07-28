// 开发阶段开启所有日志
// 发布阶段只开启WARN和ERROR日志

const LOG_INFO_ENABLED = import.meta.env.DEV || (import.meta.env.VITE_LOG_INFO_ENABLED.toLowerCase() === "true")
const LOG_WARN_ENABLED = true
const LOG_ERROR_ENABLED = true

/**
 * 信息日志
 * @param msg 信息
 * @param param 参数
 */
const logInfo = (msg: any, param?: any) => {
    if (LOG_INFO_ENABLED) {
        if (param) {
            console.log(msg, param)
        } else {
            console.log(msg)
        }
    }
}
/**
 * 警告日志
 * @param msg 警告信息
 * @param param 参数
 */
const logWarn = (msg: any, param?: any) => {
    if (LOG_WARN_ENABLED) {
        if (param) {
            console.warn(msg, param)
        } else {
            console.warn(msg)
        }
    }
}
/**
 * 错误日志
 * @param msg 错误信息
 * @param param 参数
 */
const logError = (msg: any, param?: any) => {
    if (LOG_ERROR_ENABLED) {
        if (param) {
            console.error(msg, param)
        } else {
            console.error(msg)
        }
    }
}

/**
 * 日志记录
 */
const log = {
    logInfo,
    logWarn,
    logError
}

export default log