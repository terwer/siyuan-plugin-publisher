import { Env } from "zhi-env";
import { ZhiUtil } from "zhi-common";
/**
 * 工具类统一入口，每个应用自己实现
 *
 * @public
 * @author terwer
 * @since 1.0.0
 */
declare class ZhiSiyuanApiUtil extends ZhiUtil {
    static zhiEnv(): Env;
}
export default ZhiSiyuanApiUtil;
