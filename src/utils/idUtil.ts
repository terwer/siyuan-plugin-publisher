import shortHash from "shorthash2";

/**
 * 唯一ID
 */
export function newID():string {
    const newstr = (new Date().toISOString())
    const hashstr = shortHash(newstr).toLowerCase()
    return hashstr;
}