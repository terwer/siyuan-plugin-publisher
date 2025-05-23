/**
 * 错误类型
 */
export type ErrorType =
  | "PLUGIN_LOAD_FAILED"
  | "PLUGIN_INIT_FAILED"
  | "PLUGIN_DESTROY_FAILED"
  | "PLATFORM_CONFIG_INVALID"
  | "PLATFORM_CONNECTION_FAILED"
  | "PUBLISH_FAILED"
  | "NETWORK_ERROR"
  | "VALIDATION_ERROR"
  | "UNKNOWN_ERROR"

/**
 * 错误详情
 */
export interface ErrorDetail {
  type: ErrorType
  message: string
  code?: string
  originalError?: Error
  metadata?: Record<string, any>
}

/**
 * 发布错误
 */
export class PublisherError extends Error {
  type: ErrorType
  code?: string
  originalError?: Error
  metadata?: Record<string, any>

  constructor(type: ErrorType, message: string, options?: Omit<ErrorDetail, "type" | "message">) {
    super(message)
    this.name = "PublisherError"
    this.type = type
    this.code = options?.code
    this.originalError = options?.originalError
    this.metadata = options?.metadata
  }
}
