/**
 * 跨平台，同时支持Node和浏览器的颜色解决方案
 *
 * @public
 * @author terwer
 * @version 1.9.2
 * @since 1.9.2
 */
declare const crossChalk: {
    white: (str: string) => string;
    gray: (str: string) => string;
    blue: (str: string) => string;
    green: (str: string) => string;
    yellow: (str: string) => string;
    red: (str: string) => string;
    bgWhite: (str: string) => string;
    bgGrey: (str: string) => string;
    bgBlue: (str: string) => string;
    bgGreen: (str: string) => string;
    bgYellow: (str: string) => string;
    bgRed: (str: string) => string;
};
export default crossChalk;
