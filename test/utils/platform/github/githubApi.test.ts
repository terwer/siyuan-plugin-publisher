import {describe} from "vitest";
import {GithubApi} from "~/utils/platform/github/githubApi";
import {GithubCfg} from "~/utils/platform/github/githubCfg";
import logUtil from "~/utils/logUtil";

describe("githubAPi test", async () => {
    it("contructor test", async () => {
        const githubCfg = new GithubCfg()
        githubCfg.githubUser = "terwer"
        githubCfg.githubRepo = "terwer.github.io"
        githubCfg.defaultBranch = "master"
        githubCfg.defaultPath = "docs/_posts/"
        githubCfg.defaultMsg = "auto published by sy-post-publisher"
        githubCfg.author = "terwer"
        githubCfg.email = "youweics@163.com"

        const githubApi = new GithubApi(githubCfg)
        const meta = await githubApi.getGithubPageTreeNode("")
        logUtil.logInfo("meta=>", meta)
    })
})