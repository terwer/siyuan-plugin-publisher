/**
 * 错误类型
 */
export type ErrorType =
  // 插件相关错误
  | "PLUGIN_LOAD_FAILED"
  | "PLUGIN_INIT_FAILED"
  | "PLUGIN_DESTROY_FAILED"
  | "PLUGIN_NOT_FOUND"
  | "PLUGIN_CONFIG_INVALID"
  | "PLUGIN_DEPENDENCY_NOT_FOUND"
  | "PLUGIN_DEPENDENCY_VERSION_MISMATCH"
  // 平台相关错误
  | "PLATFORM_NOT_FOUND"
  | "PLATFORM_NOT_CONNECTED"
  | "PLATFORM_CONFIG_INVALID"
  | "PLATFORM_CONNECTION_FAILED"
  | "PLATFORM_DISCONNECT_FAILED"
  | "PLATFORM_CONNECT_FAILED"
  // 发布相关错误
  | "PUBLISH_FAILED"
  | "BATCH_PUBLISH_FAILED"
  | "DELETE_POST_FAILED"
  | "GET_POSTS_FAILED"
  | "INVALID_POST"
  // 网络相关错误
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  // 验证相关错误
  | "VALIDATION_ERROR"
  | "INVALID_CONFIG"
  // 其他错误
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
