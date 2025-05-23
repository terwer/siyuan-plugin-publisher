import { LogLevel, LoggerOptions, Logger } from "../types"

export class LoggerImpl implements Logger {
  private level: LogLevel
  private prefix: string
  private format: (level: LogLevel, message: string) => string

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || "info"
    this.prefix = options.prefix || "[Publisher]"
    this.format = options.format || this.defaultFormat
  }

  private defaultFormat(level: LogLevel, message: string): string {
    return `${this.prefix} [${level.toUpperCase()}] ${message}`
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"]
    return levels.indexOf(level) >= levels.indexOf(this.level)
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog("debug")) {
      console.debug(this.format("debug", message), ...args)
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog("info")) {
      console.info(this.format("info", message), ...args)
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.format("warn", message), ...args)
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog("error")) {
      console.error(this.format("error", message), ...args)
    }
  }
}

export const defaultLogger = new LoggerImpl()
