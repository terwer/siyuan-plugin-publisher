import {IApi} from "../../api";
import {exportMdContent, getBlockAttrs, getBlockByID, getBlockBySlug, getRootBlocks} from "./siYuanApi";
import {Post} from "../../common/post";
import {UserBlog} from "../../common/userBlog";
import {API_TYPE_CONSTANTS} from "../../constants/apiTypeConstants";
import {render} from "../../markdownUtil";
import {removeWidgetTag} from "../../htmlUtil";

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

    public async getRecentPosts(numOfPosts: number, page: number, keyword?: string): Promise<Array<Post>> {
        let result: Post[] = []

        let pg = 0
        if (page) {
            pg = page
        }
        let k = keyword || ""
        const siyuanPosts = await getRootBlocks(pg, numOfPosts, k)
        // log.logInfo(siyuanPosts)

        for (let i = 0; i < siyuanPosts.length; i++) {
            const siyuanPost = siyuanPosts[i]

            // 某些属性详情页控制即可
            const attrs = await getBlockAttrs(siyuanPost.root_id)

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
            // commonPost.mt_keywords = attrs.tags || ""
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
        commonPost.isPublished = isPublished
        commonPost.postPassword = postPassword
        // commonPost.dateCreated

        return commonPost
    }
}