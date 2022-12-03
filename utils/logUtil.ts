// 开发阶段开启所有日志
// 发布阶段只开启WARN和ERROR日志
import { getBooleanEnv } from "./envUtil"
import { inBrowser } from "~/utils/util"
import loglevel, { Logger } from "loglevel"
import prefix from "loglevel-plugin-prefix"
import chalk from "chalk"

if (inBrowser()) {
  console.log("log4js运行在浏览器环境中")
} else {
  console.log("log4js运行在node环境中")
}

const LOG_INFO_ENABLED = getBooleanEnv("VITE_LOG_INFO_ENABLED")
const LOG_LEVEL_INFO = "INFO"
const LOG_LEVEL_WARN = "WARN"
const LOG_LEVEL_ERROR = "ERROR"
const CONSOLE_LOGGER = "console"

prefix.reg(loglevel)
loglevel.setLevel(LOG_INFO_ENABLED ? LOG_LEVEL_INFO : LOG_LEVEL_WARN)

prefix.apply(loglevel, {
  format(level, name, timestamp) {
    const strarr = []
    strarr.push(
      chalk.gray("[") + chalk.green(timestamp).toString() + chalk.gray("]")
    )

    switch (level) {
      case LOG_LEVEL_INFO:
        strarr.push(chalk.green(level.toUpperCase().toString()))
        break
      case LOG_LEVEL_WARN:
        strarr.push(chalk.yellow(level.toUpperCase().toString()))
        break
      case LOG_LEVEL_ERROR:
        strarr.push(chalk.red(level.toUpperCase().toString()))
        break
    }

    strarr.push(chalk.green(name).toString())
    strarr.push(chalk.gray(":"))

    return strarr.join(" ")
  },
})

/**
 * 获取日志记录器
 * @param loggerName 日志记录器，默认为 console
 */
const getLogger = (loggerName?: string): Logger => {
  return loglevel.getLogger(loggerName ?? __filename ?? CONSOLE_LOGGER)
}

/**
 * @description 日志记录工厂
 */
export const LogFactory = {
  getLogger,
}
