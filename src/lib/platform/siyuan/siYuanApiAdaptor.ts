import {IApi} from "../../api";
import {
    exportMdContent,
    getBlockAttrs,
    getBlockByID,
    getBlockBySlug,
    getRootBlocks,
    getRootBlocksCount
} from "./siYuanApi";
import {Post} from "../../common/post";
import {UserBlog} from "../../common/userBlog";
import {API_TYPE_CONSTANTS} from "../../constants/apiTypeConstants";
import {render} from "../../markdownUtil";
import {removeWidgetTag} from "../../htmlUtil";
import {POST_STATUS_CONSTANTS} from "../../constants/postStatusConstants";
import {CategoryInfo} from "../../common/categoryInfo";

/**
 * 思源笔记API适配器
 */
export class SiYuanApiAdaptor implements IApi {
    public async getUsersBlogs(): Promise<Array<UserBlog>> {
        let result: Array<UserBlog> = []
        // const data = await this.metaWeblog.getUsersBlogs(this.appkey, this.username, this.password);
        const userBlog = new UserBlog()
        userBlog.blogid = API_TYPE_CONSTANTS.API_TYPE_SIYUAN
        userBlog.blogName = API_TYPE_CONSTANTS.API_TYPE_SIYUAN
        userBlog.url = process.env.SIYUAN_API_URL || ""
        result.push(userBlog)

        return result;
    }

    public async getRecentPostsCount(keyword?: string): Promise<number> {
        return await getRootBlocksCount(keyword || "");
    }

    public async getRecentPosts(numOfPosts: number, page: number, keyword?: string): Promise<Array<Post>> {
        let result: Post[] = []

        let pg = 0
        if (page) {
            pg = page
        }
        let k = keyword || ""
        const siyuanPosts = await getRootBlocks(pg, numOfPosts, k)
        // logUtil.logInfo(siyuanPosts)

        for (let i = 0; i < siyuanPosts.length; i++) {
            const siyuanPost = siyuanPosts[i]

            // 某些属性详情页控制即可
            const attrs = await getBlockAttrs(siyuanPost.root_id)
            const page = await this.getPost(siyuanPost.root_id)

            // // 发布状态
            // let isPublished = true
            // const publishStatus = attrs["custom-publish-status"] || "draft"
            // if (publishStatus == "secret") {
            //     isPublished = false;
            // }
            //
            // // 访问密码
            // const postPassword = attrs["custom-publish-password"] || ""

            // 文章别名
            const customSlug = attrs["custom-slug"] || ""

            // 适配公共属性
            let commonPost = new Post()
            commonPost.postid = siyuanPost.root_id
            commonPost.title = siyuanPost.content
            commonPost.permalink = customSlug == "" ? "/post/" + siyuanPost.root_id : "/post/" + customSlug + ".html"
            // commonPost.isPublished = isPublished
            commonPost.mt_keywords = page.mt_keywords
            commonPost.description = page.description
            result.push(commonPost)
        }

        return Promise.resolve(result);
    }

    public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
        let pid = postid
        if (useSlug) {
            const pidObj = await getBlockBySlug(postid)
            if (pidObj) {
                pid = pidObj.root_id
            }
        }
        const siyuanPost = await getBlockByID(pid)
        if (!siyuanPost) {
            throw new Error("文章不存存在，postid=>" + pid)
        }

        const attrs = await getBlockAttrs(pid)
        const md = await exportMdContent(pid)

        // 发布状态
        let isPublished = true
        const publishStatus = attrs["custom-publish-status"] || "draft"
        if (publishStatus == "secret") {
            isPublished = false;
        }

        // 访问密码
        const postPassword = attrs["custom-post-password"] || ""

        // 访问密码
        const shortDesc = attrs["custom-desc"] || ""

        // 渲染Markdown
        let html = render(md.content)
        // 移除挂件html
        html = removeWidgetTag(html)

        // 适配公共属性
        let commonPost = new Post()
        commonPost.postid = siyuanPost.root_id || ""
        commonPost.title = siyuanPost.content || ""
        commonPost.description = html || ""
        commonPost.shortDesc = shortDesc || ""
        commonPost.mt_keywords = attrs.tags || ""
        commonPost.post_status = isPublished ? POST_STATUS_CONSTANTS.POST_STATUS_PUBLISH : POST_STATUS_CONSTANTS.POST_TYPE_DRAFT
        commonPost.wp_password = postPassword
        // commonPost.dateCreated

        return commonPost
    }

    public async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        return Promise.resolve(false)
    }

    public async newPost(post: Post, publish?: boolean): Promise<string> {
        return Promise.resolve("")
    }

    public async deletePost(postid: string): Promise<boolean> {
        return Promise.resolve(false)
    }

    public async getCategories(): Promise<CategoryInfo[]> {
        return Promise.resolve([]);
    }
}