import { ErrorCode } from "../types"

export class PublisherError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: Record<string, any>,
  ) {
    super(message)
    this.name = "PublisherError"
  }
}

export function createError(message: string, code: ErrorCode, details?: Record<string, any>): PublisherError {
  return new PublisherError(message, code, details)
}

export function isPublisherError(error: unknown): error is PublisherError {
  return error instanceof PublisherError
}

export function handleError(error: unknown): PublisherError {
  if (isPublisherError(error)) {
    return error
  }

  if (error instanceof Error) {
    return new PublisherError(error.message, "UNKNOWN_ERROR")
  }

  return new PublisherError("An unknown error occurred", "UNKNOWN_ERROR", { originalError: error })
}
