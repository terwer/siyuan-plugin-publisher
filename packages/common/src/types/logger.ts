/**
 * 日志级别
 */
export type LogLevel = "debug" | "info" | "warn" | "error"

/**
 * 日志配置
 */
export interface LoggerConfig {
  /**
   * 日志级别
   */
  level: LogLevel

  /**
   * 是否启用控制台输出
   */
  console?: boolean

  /**
   * 是否启用文件输出
   */
  file?: boolean

  /**
   * 日志文件路径
   */
  filePath?: string

  /**
   * 日志文件最大大小（字节）
   */
  maxFileSize?: number

  /**
   * 日志文件最大数量
   */
  maxFiles?: number
}

/**
 * 日志记录
 */
export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  metadata?: Record<string, any>
  error?: Error
}

/**
 * 日志接口
 */
export interface Logger {
  /**
   * 获取日志配置
   */
  getConfig(): LoggerConfig

  /**
   * 更新日志配置
   */
  updateConfig(config: Partial<LoggerConfig>): void

  /**
   * 记录调试日志
   */
  debug(message: string, metadata?: Record<string, any>): void

  /**
   * 记录信息日志
   */
  info(message: string, metadata?: Record<string, any>): void

  /**
   * 记录警告日志
   */
  warn(message: string, metadata?: Record<string, any>): void

  /**
   * 记录错误日志
   */
  error(message: string, error?: Error, metadata?: Record<string, any>): void

  /**
   * 获取日志历史
   */
  getHistory(): LogEntry[]
}
