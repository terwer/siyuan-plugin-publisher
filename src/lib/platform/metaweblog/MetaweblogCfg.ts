import {IMetaweblogCfg} from "./IMetaweblogCfg";

/**
 * Metaweblog配置类
 */
export class MetaweblogCfg implements IMetaweblogCfg {

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

    constructor(public home: string,
                public apiUrl: string,
                public username: string,
                public password: string) {
        this.home = home
        this.apiUrl = apiUrl
        this.username = username
        this.password = password
        this.apiStatus = false
        this.blogName = ""
        this.posidKey = ""
    }
}