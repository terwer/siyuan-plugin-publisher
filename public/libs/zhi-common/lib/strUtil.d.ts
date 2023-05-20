/**
 * 字符串工具类
 *
 * @public
 * @author terwer
 * @since 0.0.1
 */
declare class StrUtil {
    /**
     * 格式化字符串
     *
     * @param str - 字符串，可用占位符，例如：test \{0\} str
     * @param args - 按占位符顺序排列的参数
     * @author terwer
     * @since 0.0.1
     */
    f(str: string, ...args: (string | number | boolean | object)[]): string;
    /**
     * 字符串拼接
     *
     * @param str - 字符串数组
     */
    appendStr(...str: string[]): string;
    /**
     * 判断字符串中，是否包含数组中任何一个元素
     *
     * @param str - 字符串
     * @param arr - 字符串数组
     */
    includeInArray(str: string, arr: string[]): boolean;
    /**
     * 截取指定长度的字符串
     *
     * @param str - str
     * @param length - 长度
     * @param ignore - 不要结尾省略号
     */
    getByLength(str: string, length: number, ignore?: boolean): string;
    /**
     * 字符串空值检测
     *
     * @param str - 待检测的字符串
     */
    isEmptyString(str: any): boolean;
    /**
     * 路径组合，解决多出来/的问题
     *
     * @param path1 - 路径1
     * @param path2 - 路径2
     */
    pathJoin(path1: string, path2: string): string;
    /**
     * 强转boolean
     *
     * @param val - val
     */
    parseBoolean(val: any): boolean;
}
export default StrUtil;
