/**
 * 通用平台配置接口
 */
export interface ICommonblogCfg {
    /**
     * 首页
     */
    home?: string,
    /**
     * API 地址
     */
    apiUrl: string,
    /**
     * 鉴权token
     */
    token: string,
    /**
     * 是否发布
     */
    apiStatus?: boolean
    /**
     * 博客名（API获取）
     */
    blogName?: string
    /**
     * 文章别名key
     */
    posidKey?: string
    /**
     * 文章预览链接
     */
    previewUrl?: string
}

/**
 * 通用平台配置类
 */
export class CommonblogCfg implements ICommonblogCfg {
    /**
     * 首页
     */
    home: string

    /**
     * API 地址
     */
    apiUrl: string

    /**
     * 鉴权token
     */
    token: string

    /**
     * 是否发布
     */
    apiStatus: boolean
    /**
     * 博客名（API获取）
     */
    blogName: string
    /**
     * 文章别名key
     */
    posidKey: string
    /**
     * 文章预览链接
     */
    previewUrl: string

    constructor(apiUrl: string, token: string) {
        this.home = "";
        this.apiUrl = apiUrl;
        this.token = token;
        this.apiStatus = false;
        this.blogName = "";
        this.posidKey = "";
        this.previewUrl = "";
    }
}