/**
 * 预定义的环境变量
 *
 * @public
 * @author terwer
 * @since 1.0.0
 */
declare class EnvConstants {
    /**
     * Node环境
     */
    static NODE_ENV_KEY: string;
    /**
     * 开发环境
     */
    static NODE_ENV_DEVELOPMENT: string;
    /**
     * 生产环境
     */
    static NODE_ENV_PRODUCTION: string;
    /**
     * 测试环境
     */
    static NODE_ENV_TEST: string;
    /**
     * 是否处于调试模式
     */
    static VITE_DEBUG_MODE_KEY: string;
}
export default EnvConstants;
