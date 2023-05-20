/**
 * 发布 SDK
 *
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
declare class PublishSdk {
    /**
     * BlogApi
     * @private
     */
    private static appInstance;
    private static bApi;
    private static Env;
    private static BlogConstants;
    private static BlogTypeEnum;
    private static SiyuanConstants;
    private static SiyuanConfig;
    private static SiYuanApiAdaptor;
    private static BlogApi;
    static init(options: {
        appInstance: any;
        Env: any;
        BlogConstants: any;
        BlogTypeEnum: any;
        SiyuanConstants: any;
        SiyuanConfig: any;
        SiYuanApiAdaptor: any;
        BlogApi: any;
    }): void;
    /**
     * 获取 siyuan-kernel-api 实例
     *
     * @param type - Env | BlogTypeEnum
     * @param cfg - BlogConfig
     * @return BlogApi
     */
    static blogApi(type: any, cfg: any): any;
}
export default PublishSdk;
