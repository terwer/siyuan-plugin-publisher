import {describe} from "vitest";
import {GithubApi} from "~/utils/platform/github/githubApi";
import {GithubCfg} from "~/utils/platform/github/githubCfg";
import logUtil from "~/utils/logUtil";

describe("githubAPi test", async () => {
    it("contructor test", async () => {
        const githubCfg = new GithubCfg("terwer",
            "terwer.github.io",
            "",
            "master",
            "docs/_posts/",
            "suto published by sy-post-publisher",
            "terwer",
            "youweics@163.com")
        const githubApi = new GithubApi(githubCfg)
        const meta = await githubApi.getGithubPageTreeNode("")
        logUtil.logInfo("meta=>", meta)
    })
})