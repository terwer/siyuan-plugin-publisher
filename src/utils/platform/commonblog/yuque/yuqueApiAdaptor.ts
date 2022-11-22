import {IApi} from "~/utils/api";
import {CommonblogApiAdaptor} from "~/utils/platform/commonblog/commonblogApiAdaptor";
import {YuqueApi} from "~/utils/platform/commonblog/yuque/yuqueApi";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {UserBlog} from "~/utils/common/userBlog";
import logUtil from "~/utils/logUtil";
import {Post} from "~/utils/common/post";
import {CategoryInfo} from "~/utils/common/categoryInfo";
import {pathJoin} from "~/utils/util";

/**
 * 语雀的API适配器
 */
export class YuqueApiAdaptor extends CommonblogApiAdaptor implements IApi {
    private readonly yuqueApi: YuqueApi

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_YUQUE);
        this.yuqueApi = new YuqueApi(this.cfg.apiUrl, this.cfg.blogid || "", this.cfg.username || "", this.cfg.token || "")
    }

    public async getUsersBlogs(): Promise<Array<UserBlog>> {
        let result: Array<UserBlog> = []

        const repos = await this.yuqueApi.repos()
        logUtil.logInfo("repos=>", repos)

        // 数据适配
        repos.forEach((item: any) => {
            const userblog: UserBlog = new UserBlog()
            userblog.blogid = item.namespace
            userblog.blogName = item.name
            userblog.url = item.namespace
            result.push(userblog)
        })

        return result
    }

    async deletePost(postid: string): Promise<boolean> {
        const yuquePostidKey = this.getYuquePostKey(postid);
        return await this.yuqueApi.delDoc(yuquePostidKey.docId, yuquePostidKey.docRepo)
    }

    async editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        const yuquePostidKey = this.getYuquePostKey(postid);
        return await this.yuqueApi.updateDoc(yuquePostidKey.docId, post.title, post.wp_slug, post.description, yuquePostidKey.docRepo)
    }

    async newPost(post: Post, publish?: boolean): Promise<string> {
        if (post.cate_slugs && post.cate_slugs.length > 0) {
            const repo = post.cate_slugs[0]
            return await this.yuqueApi.addDoc(post.title, post.wp_slug, post.description, repo)
        } else {
            return await this.yuqueApi.addDoc(post.title, post.wp_slug, post.description)
        }
    }

    async getPost(postid: string, useSlug?: boolean): Promise<Post> {
        const yuquePostidKey = this.getYuquePostKey(postid);

        const yuqueDoc = await this.yuqueApi.getDoc(yuquePostidKey.docId, yuquePostidKey.docRepo)
        logUtil.logInfo("yuqueDoc=>", yuqueDoc);

        const commonPost = new Post();
        commonPost.title = yuqueDoc.title
        commonPost.description = yuqueDoc.body

        const book = yuqueDoc.book
        const cats = []
        const catSlugs = []

        cats.push(book.name)
        commonPost.categories = cats

        catSlugs.push(book.namespace)
        commonPost.cate_slugs = catSlugs

        return commonPost;
    }

    async getCategories(): Promise<CategoryInfo[]> {
        const cats = <CategoryInfo[]>[]

        const repos: any[] = await this.yuqueApi.repos();
        logUtil.logInfo("yuque repos=>", repos)
        if (repos && repos.length > 0) {
            repos.forEach((repo) => {
                // 只获取文档库
                if (repo.type == "Book") {
                    const cat = new CategoryInfo();
                    cat.categoryId = repo.slug
                    cat.categoryName = repo.name
                    cat.description = repo.name
                    cat.categoryDescription = repo.name
                    cats.push(cat)
                }
            })
        }

        return cats;
    }

    async getPrevireUrl(postid: string): Promise<string> {
        let previewUrl

        // 替换文章链接
        const purl = this.cfg.previewUrl || ""
        const yuquePostidKey = this.getYuquePostKey(postid);
        const docId = yuquePostidKey.docId
        const repo = yuquePostidKey.docRepo || this.cfg.blogid || ""
        const postUrl = purl.replace("[postid]", docId)
            .replace("[notebook]", repo)
        // 路径组合
        previewUrl = pathJoin(this.cfg.home || "", postUrl)

        return previewUrl
    }

    /**
     * 获取封装的postid
     * @param postid
     * @private postid
     */
    private getYuquePostKey(postid: string) {
        let docId
        let docRepo
        if (postid.indexOf("_") > 0) {
            const idArr = postid.split("_")
            docId = idArr[0]
            docRepo = idArr[1]
            // docRepo就是book.namespac
        } else {
            docId = postid
        }

        return {
            docId,
            docRepo
        }
    }
}