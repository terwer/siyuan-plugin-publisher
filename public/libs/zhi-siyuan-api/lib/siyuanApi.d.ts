import { Env } from "zhi-env";
import SiyuanConfig from "./siyuanConfig";
import SiyuanKernelApi from "./siyuanKernelApi";
import SiyuanClientApi from "./siyuanClientApi";
/**
 * 思源笔记API
 *
 * @author terwer
 * @since 1.0.0
 */
declare class SiyuanApi {
    /**
     * 思源笔记内核API
     */
    readonly kernelApi: SiyuanKernelApi;
    /**
     * 思源笔记客户端API
     */
    readonly clientApi: SiyuanClientApi;
    /**
     * 构造思源 API对象
     *
     * @param cfg - 环境变量 或者 配置项
     */
    constructor(cfg: Env | SiyuanConfig);
}
export default SiyuanApi;
