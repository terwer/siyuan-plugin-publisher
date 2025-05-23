export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LoggerOptions {
  level?: LogLevel
  prefix?: string
  format?: (level: LogLevel, message: string) => string
}

export interface Logger {
  debug(message: string, ...args: any[]): void
  info(message: string, ...args: any[]): void
  warn(message: string, ...args: any[]): void
  error(message: string, ...args: any[]): void
}
