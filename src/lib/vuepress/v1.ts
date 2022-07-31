import {Octokit} from "@octokit/core";
import {getJSONConf} from "../config";
import {IVuepressCfg} from "./IVuepressCfg";
import {API_TYPE_CONSTANTS} from "../constants/apiTypeConstants";

// 读取配置
const vuepressCfg = getJSONConf<IVuepressCfg>(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS)

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
    auth: vuepressCfg.githubToken
})

/**
 * 获取Github文件的sha，如果文件不存在返回undefined，存在返回sha
 * src.terwer.github.io/docs/_posts/测试.md
 * @param docPath
 * @returns {Promise<*>}
 */
export async function getPage(docPath: string) {
    let sha

    let res
    try {
        const route = 'GET /repos/' + vuepressCfg.githubUser + '/' + vuepressCfg.githubRepo + '/contents/' + docPath;
        console.log("getPage route=>", route)
        res = await octokit.request(route, {
            owner: vuepressCfg.githubUser,
            repo: vuepressCfg.githubRepo,
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
 * @param msg 提交信息
 * @param author 作者
 * @param email 作者邮箱
 */
export async function createOrUpdatePage(docPath: string, mdContent: string, sha: any, msg: string, author: string, email: string) {
    let res
    try {
        const base64 = Buffer.from(mdContent).toString('base64');
        const route = 'PUT /repos/' + vuepressCfg.githubUser + '/' + vuepressCfg.githubRepo + '/contents/' + docPath;
        let options = {
            owner: vuepressCfg.githubUser,
            repo: vuepressCfg.githubRepo,
            path: docPath,
            message: msg,
            committer: {
                name: author,
                email: email
            },
            content: base64
        }
        if (sha) {
            Object.assign(options, {
                sha: sha
            })
        }

        res = await octokit.request(route, options)
        console.log("createOrUpdatePage res=>", res)
    } catch (e) {
        console.log("createOrUpdatePage error=>", e)
    }
    return res
}