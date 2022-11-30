import {IApi} from "~/utils/api";
import {Post} from "~/utils/common/post";
import {CategoryInfo} from "~/utils/common/categoryInfo";
import {UserBlog} from "~/utils/common/userBlog";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {VuepressApiV1} from "~/utils/platform/github/vuepress/vuepressApiV1";
import {VuepressCfg} from "~/utils/platform/github/vuepress/VuepressCfg";
import {GithubApiAdaptor} from "~/utils/platform/github/githubApiAdaptor";

/**
 * Vuepress的API适配器
 */
export class VuepressApiAdaptor extends GithubApiAdaptor implements IApi{
    private readonly vuepressApi: VuepressApiV1

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS);
        const vuepressCfg = new VuepressCfg()
        this.vuepressApi = new VuepressApiV1(vuepressCfg)
    }

    deletePost(postid: string): Promise<boolean> {
        return super.deletePost(postid);
    }

    editPost(postid: string, post: Post, publish?: boolean): Promise<boolean> {
        return super.editPost(postid, post, publish);
    }

    getCategories(): Promise<CategoryInfo[]> {
        return super.getCategories();
    }

    getPost(postid: string, useSlug?: boolean): Promise<Post> {
        return super.getPost(postid, useSlug);
    }

    getPreviewUrl(postid: string): Promise<string> {
        return super.getPreviewUrl(postid);
    }

    getUsersBlogs(): Promise<Array<UserBlog>> {
        return super.getUsersBlogs();
    }

    newPost(post: Post, publish?: boolean): Promise<string> {
        return super.newPost(post, publish);
    }
}