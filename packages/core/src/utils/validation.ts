import { PublisherError } from "@siyuan-publisher/common"

/**
 * 验证字符串
 */
export function isValidString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0
}

/**
 * 验证对象
 */
export function isValidObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * 验证数组
 */
export function isValidArray(value: unknown): value is any[] {
  return Array.isArray(value)
}

/**
 * 验证 URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证必需字段
 */
export function validateRequiredFields(obj: Record<string, any>, fields: string[]): string[] {
  const missingFields: string[] = []

  for (const field of fields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
      missingFields.push(field)
    }
  }

  return missingFields
}

/**
 * 验证字符串并抛出错误
 */
export function validateString(value: unknown, fieldName: string): string {
  if (!isValidString(value)) {
    throw new PublisherError("VALIDATION_ERROR", `Field ${fieldName} must be a non-empty string`, {
      field: fieldName,
      value,
    } as any)
  }
  return value
}

/**
 * 验证对象并抛出错误
 */
export function validateObject(value: unknown, fieldName: string): Record<string, any> {
  if (!isValidObject(value)) {
    throw new PublisherError("VALIDATION_ERROR", `Field ${fieldName} must be an object`, {
      field: fieldName,
      value,
    } as any)
  }
  return value
}

/**
 * 验证数组并抛出错误
 */
export function validateArray<T>(value: unknown, fieldName: string): T[] {
  if (!isValidArray(value)) {
    throw new PublisherError("VALIDATION_ERROR", `Field ${fieldName} must be an array`, {
      field: fieldName,
      value,
    } as any)
  }
  return value as T[]
}

/**
 * 验证 URL 并抛出错误
 */
export function validateUrl(value: unknown, fieldName: string): string {
  const str = validateString(value, fieldName)
  if (!isValidUrl(str)) {
    throw new PublisherError("VALIDATION_ERROR", `Field ${fieldName} must be a valid URL`, {
      field: fieldName,
      value: str,
    } as any)
  }
  return str
}

/**
 * 验证数值范围
 */
export function validateNumberRange(value: number, fieldName: string, min?: number, max?: number): void {
  if (typeof value !== "number") {
    throw new PublisherError("VALIDATION_ERROR", `Field ${fieldName} must be a number`, {
      field: fieldName,
      value,
    } as any)
  }

  if (min !== undefined && value < min) {
    throw new PublisherError("VALIDATION_ERROR", `Field ${fieldName} must be greater than or equal to ${min}`, {
      field: fieldName,
      value,
      min,
    } as any)
  }

  if (max !== undefined && value > max) {
    throw new PublisherError("VALIDATION_ERROR", `Field ${fieldName} must be less than or equal to ${max}`, {
      field: fieldName,
      value,
      max,
    } as any)
  }
}

/**
 * 验证字符串长度
 */
export function validateStringLength(value: string, fieldName: string, min?: number, max?: number): void {
  if (typeof value !== "string") {
    throw new PublisherError("VALIDATION_ERROR", `Field ${fieldName} must be a string`, {
      field: fieldName,
      value,
    } as any)
  }

  if (min !== undefined && value.length < min) {
    throw new PublisherError("VALIDATION_ERROR", `Field ${fieldName} must be at least ${min} characters long`, {
      field: fieldName,
      value,
      min,
    } as any)
  }

  if (max !== undefined && value.length > max) {
    throw new PublisherError("VALIDATION_ERROR", `Field ${fieldName} must be at most ${max} characters long`, {
      field: fieldName,
      value,
      max,
    } as any)
  }
}
