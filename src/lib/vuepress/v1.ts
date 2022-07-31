import {IVuepressCfg} from "./IVuepressCfg";
import {Octokit} from "@octokit/core";
import {Base64} from 'js-base64';

/**
 * Vuepress V1 API
 */
class VuepressApiV1 {
    // 读取配置
    vuepressCfg: IVuepressCfg = <IVuepressCfg>{}

    // Octokit.js
    // https://github.com/octokit/core.js#readme
    octokit: Octokit = <Octokit>{}

    constructor(vuepressCfg: IVuepressCfg, octokit: Octokit) {
        this.vuepressCfg = vuepressCfg;
        this.octokit = octokit;
    }

    /**
     * 获取Github文件的sha，如果文件不存在返回undefined，存在返回sha
     * @param docPath 完整文件路径，例如：docs/_posts/测试.md
     */
    async getPage(docPath: string): Promise<string> {
        let sha

        let res
        try {
            const route = 'GET /repos/' + this.vuepressCfg.githubUser + '/' + this.vuepressCfg.githubRepo + '/contents/' + docPath;
            console.log("getPage route=>", route)
            res = await this.octokit.request(route, {
                owner: this.vuepressCfg.githubUser,
                repo: this.vuepressCfg.githubRepo,
                path: docPath
            })
            console.log("getPage res=>", res)
        } catch (e) {
            console.log("getPage error=>", e)
        }

        if (res) {
            sha = res.data.sha
        }
        return sha;
    }

    /**
     * 创建或更新页面
     * @param docPath 页面路径，相对于根仓库的完整路径
     * @param mdContent Markdown文本
     * @param sha 文件的sha，undefined表示新建，更新需要传sha字符串
     */
    async createOrUpdatePage(docPath: string, mdContent: string, sha: any) {
        let res
        try {
            // const base64 = Buffer.from(mdContent).toString('base64');
            const base64 = Base64.toBase64(mdContent)
            const route = 'PUT /repos/' + this.vuepressCfg.githubUser + '/' + this.vuepressCfg.githubRepo + '/contents/' + docPath;
            let options = {
                owner: this.vuepressCfg.githubUser,
                repo: this.vuepressCfg.githubRepo,
                path: docPath,
                message: this.vuepressCfg.defaultMsg,
                committer: {
                    name: this.vuepressCfg.author,
                    email: this.vuepressCfg.email
                },
                content: base64
            }
            if (sha) {
                Object.assign(options, {
                    sha: sha
                })
            }

            res = await this.octokit.request(route, options)
            console.log("createOrUpdatePage res=>", res)
        } catch (e) {
            console.log("createOrUpdatePage error=>", e)
        }
        return res
    }
}

/**
 * 发布文章到Vuepress V1
 * @param vuepressCfg Vuepress发布配置
 * @param docPath 相对于根仓库的完整路径，包括文件名和扩展名
 * @param mdContent Markdown文本
 */
export async function publishPage(vuepressCfg: IVuepressCfg, docPath: string, mdContent: string): Promise<any> {
    const octokit = new Octokit({
        auth: vuepressCfg.githubToken
    })
    const v1 = new VuepressApiV1(vuepressCfg, octokit);
    const sha = await v1.getPage(docPath)

    let res
    res = await v1.createOrUpdatePage(docPath, mdContent, sha)
    console.log("Vuepress V1 publishPage,res=>", res)
    return res;
}