/**
 * 环境变量工具类
 *
 * @public
 * @author terwer
 * @description 跨平台环境变量读取
 * @since 0.0.1
 */
declare class Env {
    private readonly envMeta;
    /**
     * 是否是开发阶段调试
     */
    isNodeDev(): boolean;
    /**
     * 是否是调试阶段
     */
    isDev(): boolean;
    /**
     * 环境初始化
     *
     * @param envMeta - 需要传入 import.meta.env 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
     * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
     */
    constructor(envMeta: any);
    /**
     * 获取环境变量，key不存在返回undefined
     * @param key - key
     */
    getEnv(key: string): string | undefined;
    /**
     * 获取String类型的环境变量，key不存在直接返回空值
     * @param key - key
     */
    getStringEnv(key: string): string;
    /**
     * 获取Boolean类型的环境变量，key不存在返回false
     * @param key - key
     */
    getBooleanEnv(key: string): boolean;
    /**
     * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
     *
     * @param key - key
     * @param defaultValue - 默认值
     * @since 0.1.0
     * @author terwer
     */
    getEnvOrDefault(key: string, defaultValue: string): string;
}
export default Env;
