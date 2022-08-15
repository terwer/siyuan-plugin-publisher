/**
 * Metaweblog配置接口
 */
export interface IMetaweblogCfg {
    /**
     * 首页
     */
    home: string,
    /**
     * API 地址
     */
    apiUrl: string,
    /**
     * 用户名
     */
    username: string,
    /**
     * 密码
     */
    password: string
    /**
     * 是否发布
     */
    apiStatus: boolean
    /**
     * 博客名（API获取）
     */
    blogName:string
    /**
     * 文章别名key
     */
    posidKey: string
}