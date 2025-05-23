export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function isValidObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isValidArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateRequiredFields(obj: Record<string, any>, fields: string[]): string[] {
  const missingFields: string[] = [];
  
  for (const field of fields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      missingFields.push(field);
    }
  }
  
  return missingFields;
} 