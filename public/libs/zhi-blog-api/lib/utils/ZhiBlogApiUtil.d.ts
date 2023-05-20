import { ZhiUtil } from "zhi-common";
import { Env } from "zhi-env";
/**
 * 工具类统一入口，每个应用自己实现
 *
 * @public
 * @author terwer
 * @since 1.0.0
 */
declare class ZhiBlogApiUtil extends ZhiUtil {
    static zhiEnv(): Env;
}
export default ZhiBlogApiUtil;
