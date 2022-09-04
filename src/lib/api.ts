import {SiYuanApiAdaptor} from "./platform/siyuan/siYuanApiAdaptor";
import {API_TYPE_CONSTANTS} from "./constants/apiTypeConstants";
import {JVueApiAdaptor} from "./platform/metaweblog/adaptor/jvueApiAdaptor";
import {ConfApiAdaptor} from "./platform/metaweblog/adaptor/confApiAdaptor";
import {CnblogsApiAdaptor} from "./platform/metaweblog/adaptor/cnblogsApiAdaptor";
import {Post} from "./common/post";
import {UserBlog} from "./common/userBlog";
import {KmsApiAdaptor} from "./platform/commonblog/kms/kmsApiAdaptor";
import {WordpressApiAdaptor} from "./platform/metaweblog/adaptor/wordpressApiAdaptor";
import {LiandiApiAdaptor} from "./platform/commonblog/liandi/liandiApiAdaptor";
import {YuqueApiAdaptor} from "./platform/commonblog/yuque/yuqueApiAdaptor";
import {PlantformType} from "./dynamicConfig";
import {MetaWeblogApiAdaptor} from "./platform/metaweblog/metaWeblogApiAdaptor";
import {CategoryInfo} from "./common/categoryInfo";

/**
 * 所有平台统一API接口（Vuepress比较特殊，除外）
 */
export interface IApi {
    /**
     * 博客配置列表
     */
    getUsersBlogs(): Promise<Array<UserBlog>>

    /**
     * 最新文章
     * @param numOfPosts 文章数目
     * @param page 页码（可选，部分平台不支持分页）
     * @param keyword 关键字（可选，部分平台不支持搜索）
     */
    getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>>

    /**
     * 文章详情
     * @param postid
     * @param useSlug 是否使用的是别名（可选，部分平台不支持）
     */
    getPost(postid: string, useSlug?: boolean): Promise<Post>


    /**
     *  发布文章
     *  https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newPost
     * @param post 文章
     * @param publish 可选，是否发布
     *
     *    const post = {
     *         description: "自动发布的测试内容",
     *         title: "自动发布测试",
     *         categories: ["标签1","标签2"],
     *         // dateCreated: new Date(),
     *         // link: "",
     *         // permalink: "",
     *         // postid: "",
     *         // source: {
     *         //  name: "",
     *         //  url: ""
     *         // };
     *         // userid: ""
     *     }
     *
     *     const result = newPost(post, false)
     * @returns {Promise<string>}
     */
    newPost(post: Post, publish?: boolean): Promise<string>

    /**
     *  更新文章
     *  https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.editPost
     * @param postid 文章id
     * @param post 文章
     * @param publish 可选，是否发布
     *
     *     // wordpress
     *     // const postid = 4115
     *     // conf
     *     // const postid = 1540103
     *     const postid = "2490384_1"
     *     const post = {
     *         description: "修改过的自动发布的测试内容2",
     *         title: "修改过的自动发布测试2",
     *         categories: ["标签1", "标签2"],
     *         // dateCreated: new Date(),
     *         // link: "",
     *         // permalink: "",
     *         // postid: postid,
     *         // source: {
     *         //  name: "",
     *         //  url: ""
     *         // };
     *         // userid: ""
     *     }
     *
     *     const result = editPost(postid, post, false)
     * @returns {Promise<boolean>}
     */
    editPost(postid: string, post: Post, publish?: boolean): Promise<boolean>

    /**
     * 删除文章
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.deletePost
     * @param postid 文章ID
     */
    deletePost(postid: string): Promise<boolean>

    /**
     * 获取分类列表
     */
    getCategories(): Promise<CategoryInfo[]>
}

/**
 * 统一API入口
 */
export class API implements IApi {
    type: string
    private apiAdaptor: IApi

    constructor(type: string) {
        this.type = type;

        // 动态平台key的规则是-分割第一部分是平台类型
        if (type.indexOf("-") > -1) {
            const typeArr = type.split("-")
            if (typeArr.length > 0) {
                const ptype = typeArr[0]
                if (ptype == PlantformType.Metaweblog.toLowerCase()) {
                    // Metaweblog
                    this.apiAdaptor = new MetaWeblogApiAdaptor(type)
                    return
                } else if (ptype == PlantformType.Wordpress.toLowerCase()) {
                    // Wordpress
                    this.apiAdaptor = new MetaWeblogApiAdaptor(type)
                    return;
                }
            }
        }

        // 下面是固定平台
        switch (this.type) {
            case API_TYPE_CONSTANTS.API_TYPE_SIYUAN:
                this.apiAdaptor = new SiYuanApiAdaptor()
                break;
            case API_TYPE_CONSTANTS.API_TYPE_JVUE:
                this.apiAdaptor = new JVueApiAdaptor()
                break;
            case API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE:
                this.apiAdaptor = new ConfApiAdaptor()
                break;
            case API_TYPE_CONSTANTS.API_TYPE_CNBLOGS:
                this.apiAdaptor = new CnblogsApiAdaptor()
                break;
            case API_TYPE_CONSTANTS.API_TYPE_WORDPRESS:
                this.apiAdaptor = new WordpressApiAdaptor()
                break;
            case API_TYPE_CONSTANTS.API_TYPE_LIANDI:
                this.apiAdaptor = new LiandiApiAdaptor()
                break
            case API_TYPE_CONSTANTS.API_TYPE_YUQUE:
                this.apiAdaptor = new YuqueApiAdaptor()
                break
            case API_TYPE_CONSTANTS.API_TYPE_KMS:
                this.apiAdaptor = new KmsApiAdaptor()
                break
            default:
                throw new Error("未找到接口适配器，请检查参数")
        }
    }

    async getRecentPosts(numOfPosts: number, page?: number, keyword?: string): Promise<Array<Post>> {
        return await this.apiAdaptor.getRecentPosts(numOfPosts, page, keyword);
    }

    async getUsersBlogs(): Promise<Array<UserBlog>> {
        return await this.apiAdaptor.getUsersBlogs();
    }

    async getPost(postid: string, useSlug?: boolean): Promise<Post> {
        return await this.apiAdaptor.getPost(postid, useSlug);
    }

    async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        return await this.apiAdaptor.editPost(postid, post, publish)
    }

    async newPost(post: Post, publish?: boolean): Promise<string> {
        return await this.apiAdaptor.newPost(post, publish)
    }

    async deletePost(postid: string): Promise<boolean> {
        return await this.apiAdaptor.deletePost(postid)
    }

    async getCategories(): Promise<CategoryInfo[]> {
        return await this.apiAdaptor.getCategories()
    }
}

