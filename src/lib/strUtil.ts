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