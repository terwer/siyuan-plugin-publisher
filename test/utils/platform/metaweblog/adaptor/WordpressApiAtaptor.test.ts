import {describe, it} from "vitest";
import {WordpressCfg} from "../../../../../src/utils/platform/metaweblog/config/wordpressCfg";
import {getEnv} from "../../../../../src/utils/envUtil";
import {setJSONConf} from "../../../../../src/utils/config";
import {API_TYPE_CONSTANTS} from "../../../../../src/utils/constants/apiTypeConstants";
import {WordpressApiAdaptor} from "../../../../../src/utils/platform/metaweblog/adaptor/wordpressApiAdaptor";
import logUtil from "../../../../../src/utils/logUtil";

describe('WordpressApiAtaptor test', () => {
    // 这个执行一次即可，后面就不用了
    // it("init", async () => {
    //     const cfg = new WordpressCfg()
    //     cfg.home = "http://localhost:8000/"
    //     cfg.username = "terwer"
    //     cfg.password = getEnv("VITE_TEST_WORDPRESS_PASSWORD")
    //     cfg.apiUrl = "http://localhost:8000/xmlrpc.php"
    //     cfg.apiStatus = true
    //     cfg.blogName = "Wordpress"
    //
    //     setJSONConf(API_TYPE_CONSTANTS.API_TYPE_WORDPRESS, cfg)
    // })

    it('getUsersBlogs', async () => {
        const api = new WordpressApiAdaptor()
        const result = await api.getUsersBlogs()
        logUtil.logInfo("getUsersBlogs测试结果=>", result)
    })
})