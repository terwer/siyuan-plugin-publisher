export interface ErrorDetails {
  code: string
  message: string
  details?: Record<string, any>
  stack?: string
}

export type ErrorCode =
  | "PLUGIN_LOAD_FAILED"
  | "PLUGIN_INIT_FAILED"
  | "PLUGIN_DESTROY_FAILED"
  | "PLATFORM_CONNECT_FAILED"
  | "PLATFORM_DISCONNECT_FAILED"
  | "PUBLISH_FAILED"
  | "INVALID_CONFIG"
  | "PLATFORM_NOT_FOUND"
  | "PLATFORM_NOT_CONNECTED"
  | "INVALID_POST_DATA"
  | "UNKNOWN_ERROR"

export interface ErrorResponse {
  success: false
  error: ErrorDetails
}

export class PublisherError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, any>,
  ) {
    super(message)
    this.name = "PublisherError"
  }
}
