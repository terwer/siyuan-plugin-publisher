import { LogLevel, LoggerConfig, Logger, LogEntry } from "@siyuan-publisher/common"

export class LoggerImpl implements Logger {
  private config: LoggerConfig
  private history: LogEntry[] = []
  private readonly maxHistorySize = 1000

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: config.level || "info",
      console: config.console ?? true,
      file: config.file ?? false,
      filePath: config.filePath,
      maxFileSize: config.maxFileSize || 5 * 1024 * 1024, // 5MB
      maxFiles: config.maxFiles || 5,
    }
  }

  getConfig(): LoggerConfig {
    return { ...this.config }
  }

  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"]
    return levels.indexOf(level) >= levels.indexOf(this.config.level)
  }

  private formatMessage(level: LogLevel, message: string): string {
    return `[${level.toUpperCase()}] ${message}`
  }

  private addToHistory(entry: LogEntry): void {
    this.history.push(entry)
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    }
  }

  debug(message: string, metadata?: Record<string, any>): void {
    if (this.shouldLog("debug")) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: "debug",
        message,
        metadata,
      }
      this.addToHistory(entry)
      if (this.config.console) {
        console.debug(this.formatMessage("debug", message), metadata)
      }
    }
  }

  info(message: string, metadata?: Record<string, any>): void {
    if (this.shouldLog("info")) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: "info",
        message,
        metadata,
      }
      this.addToHistory(entry)
      if (this.config.console) {
        console.info(this.formatMessage("info", message), metadata)
      }
    }
  }

  warn(message: string, metadata?: Record<string, any>): void {
    if (this.shouldLog("warn")) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: "warn",
        message,
        metadata,
      }
      this.addToHistory(entry)
      if (this.config.console) {
        console.warn(this.formatMessage("warn", message), metadata)
      }
    }
  }

  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    if (this.shouldLog("error")) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level: "error",
        message,
        error,
        metadata,
      }
      this.addToHistory(entry)
      if (this.config.console) {
        console.error(this.formatMessage("error", message), error, metadata)
      }
    }
  }

  getHistory(): LogEntry[] {
    return [...this.history]
  }
}

export const defaultLogger = new LoggerImpl()
