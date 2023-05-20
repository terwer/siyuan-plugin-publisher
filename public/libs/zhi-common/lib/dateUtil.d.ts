/**
 * 时间处理工具类
 *
 * @public
 * @author terwer
 * @since 1.0.0
 */
declare class DateUtil {
    private readonly TIME_SPLIT;
    /**
     * 给日期添加小时
     *
     * @param date - Date
     * @param numOfHours - 数字
     * @author terwer
     * @since 1.0.0
     */
    private addHoursToDate;
    /**
     * 转换ISO日期为中文日期的通用转换方法
     *
     * @param str - '2022-07-18T06:25:48.000Z
     * @param isAddTimeZone - 是否增加时区（默认不增加）
     * @param isShort - 是否只返回日期
     * @author terwer
     * @since 1.0.0
     */
    private formatIsoToZhDateFormat;
    /**
     * 转换ISO日期为中文完整时间
     *
     * @param str - '2022-07-18T06:25:48.000Z
     */
    formatIsoToZh(str: string): string;
    /**
     * 转换ISO日期为中文日期
     *
     * @param str - '2022-07-18T06:25:48.000Z
     */
    formatIsoToZhDate(str: string): string;
    /**
     * 转换ISO日期为中文时间
     *
     * @param str - '2022-07-18T06:25:48.000Z
     */
    formatIsoToZhTime(str: string): string;
    /**
     * 当前日期时间完整格式，格式：2023-03-10 02:03:43
     */
    nowZh(): string;
    /**
     * 当前日期，格式：2023-03-10
     */
    nowDateZh(): string;
    /**
     * 当前时间，格式：02:03:43
     */
    nowTimeZh(): string;
}
export default DateUtil;
