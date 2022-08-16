import {IMetaweblogCfg} from "./IMetaweblogCfg";
import {getJSONConf} from "../../config";
import {XmlrpcClient} from "./xmlrpc";
import {UserBlog} from "../../common/userBlog";
import {Post} from "../../common/post";
import log from "../../logUtil";
import {METAWEBLOG_METHOD_CONSTANTS} from "../../constants/metaweblogMethodConstants";
import {POST_STATUS_CONSTANTS} from "../../constants/postStatusConstants";

export class MetaWeblogApi {
    private readonly apiType: string
    private readonly cfg: IMetaweblogCfg
    private readonly xmlrpcClient: any

    constructor(apiType: string) {
        this.apiType = apiType
        this.cfg = getJSONConf<IMetaweblogCfg>(apiType)
        this.xmlrpcClient = new XmlrpcClient(this.apiType, this.cfg.apiUrl, this.cfg.username, this.cfg.password)
    }

    public async getUsersBlogs(appkey: string, username: string, password: string): Promise<Array<UserBlog>> {
        const usersBlogs: Array<UserBlog> = []
        const ret = await this.xmlrpcClient.methodCallEntry(METAWEBLOG_METHOD_CONSTANTS.GET_USERS_BLOGS,
            [this.apiType, username, password])
        log.logInfo("ret=>")
        log.logInfo(ret)

        // 错误处理
        const dataObj = JSON.parse(ret) || []
        if (dataObj.faultCode) {
            throw new Error(dataObj.faultString)
        }

        // 数据适配
        const dataArr = JSON.parse(ret) || []
        for (let i = 0; i < dataArr.length; i++) {
            const userBlog = new UserBlog()
            const item = dataArr[i]

            userBlog.blogid = item.blogid || ""
            userBlog.url = item.url
            userBlog.blogName = item.blogName

            usersBlogs.push(userBlog)
        }

        return usersBlogs
    }

    public async getRecentPosts(appkey: string, username: string, password: string, numOfPosts: number): Promise<Array<Post>> {
        return Promise.resolve([])
    }

    public async getPost(postid: string, username: string, password: string): Promise<Post> {
        return Promise.resolve(new Post())
    }

    /**
     * 新建文章
     * @param blogid
     * @param username
     * @param password
     * @param post
     * @param publish
     */
    public async newPost(blogid: string, username: string, password: string, post: Post, publish: boolean): Promise<string> {
        // 草稿
        if (!publish) {
            post.post_status = POST_STATUS_CONSTANTS.POST_TYPE_DRAFT
        }

        let ret = await this.xmlrpcClient.methodCallEntry(METAWEBLOG_METHOD_CONSTANTS.NEW_POST,
            [this.apiType, username, password, post, publish])
        ret = ret.replace(/"/g, "")
        log.logInfo("ret=>")
        log.logInfo(ret)

        return ret;
    }

    public async editPost(postid:string, username:string, password:string, post:Post, publish:boolean):Promise<boolean> {
        // 草稿
        if (!publish) {
            post.post_status = POST_STATUS_CONSTANTS.POST_TYPE_DRAFT
        }

        const ret = await this.xmlrpcClient.methodCallEntry(METAWEBLOG_METHOD_CONSTANTS.EDIT_POST,
            [postid, username, password, post, publish])
        log.logInfo("ret=>")
        log.logInfo(ret)

        return ret;
    }

   public async deletePost (appKey:string, postid:string, username:string, password:string, publish:boolean) {
       const ret = await this.xmlrpcClient.methodCallEntry(METAWEBLOG_METHOD_CONSTANTS.DELETE_POST,
           [appKey, postid, username, password, publish])
       log.logInfo("ret=>")
       log.logInfo(ret)

       return ret;
    };
}