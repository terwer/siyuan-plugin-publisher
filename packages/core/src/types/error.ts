export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export type ErrorCode =
  | 'PLUGIN_INIT_FAILED'
  | 'PLUGIN_DESTROY_FAILED'
  | 'PLATFORM_CONNECT_FAILED'
  | 'PLATFORM_DISCONNECT_FAILED'
  | 'PUBLISH_FAILED'
  | 'INVALID_CONFIG'
  | 'UNKNOWN_ERROR';

export interface ErrorResponse {
  success: false;
  error: ErrorDetails;
} 