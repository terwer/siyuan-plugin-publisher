import shortHash from "shorthash2"

/**
 * 唯一ID
 */
export function newID(): string {
  const newstr = new Date().toISOString()
  return shortHash(newstr).toLowerCase()
}
