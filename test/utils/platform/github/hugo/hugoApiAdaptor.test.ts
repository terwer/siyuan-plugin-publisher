import {describe} from "vitest";
import {API} from "~/utils/api";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import logUtil from "~/utils/logUtil";
import {HugoCfg} from "~/utils/platform/github/hugo/hugoCfg";
import {setJSONConf} from "~/utils/config";
import {getEnv} from "~/utils/envUtil";

beforeEach(async (context) => {
    logUtil.logInfo("beforeEach start")
    // 设置为true，重新初始化配置，false忽略
    const inited = true
    if (inited) {
        logUtil.logInfo("beforeEach already inited")
        return
    }

    const githubUser = "terwer"
    const githubRepo = "hugo-blog"
    const githubToken = getEnv("VITE_TEST_GITHUB_TOKEN")
    const cfg = new HugoCfg(githubUser, githubRepo, githubToken)

    setJSONConf(API_TYPE_CONSTANTS.API_TYPE_HUGO, cfg)
    logUtil.logInfo("beforeEach end")
})

describe("hugoApiAdaptor test", () => {

    it("getUsersBlogs test", async () => {
        const api = new API(API_TYPE_CONSTANTS.API_TYPE_HUGO)
        const usersBlogs = await api.getUsersBlogs()
        logUtil.logInfo("usersBlogs=>", usersBlogs)
    })
})