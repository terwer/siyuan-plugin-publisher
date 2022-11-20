/**
 * @function unescapeHTML 还原html脚本 < > & " '
 * @param a -
 *            字符串
 */
export const unescapeHTML = function (a: string) {
    a = "" + a;
    return a.replace(/\&amp;/g, "&").replace(/\&lt;/g, "<")
        .replace(/\&gt;/g, ">")
}

/**
 * 截取指定长度的字符串
 * @param str str
 * @param length 长度
 * @param ignore 不要结尾省略号
 * @returns {string} 结果
 */
export function getByLength(str: string, length: number, ignore?: boolean) {
    let allText = str;
    if (allText.length < length) {
        return allText;
    }
    if (ignore) {
        return allText.substring(0, length);
    }
    return allText.substring(0, length) + "...";
}