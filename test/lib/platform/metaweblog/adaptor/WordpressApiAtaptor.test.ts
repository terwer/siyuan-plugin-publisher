import {describe, it} from "vitest";
import {WordpressCfg} from "../../../../../src/lib/platform/metaweblog/config/wordpressCfg";
import {getEnv} from "../../../../../src/lib/envUtil";
import {setJSONConf} from "../../../../../src/lib/config";
import {API_TYPE_CONSTANTS} from "../../../../../src/lib/constants/apiTypeConstants";
import {WordpressApiAdaptor} from "../../../../../src/lib/platform/metaweblog/adaptor/wordpressApiAdaptor";
import logUtil from "../../../../../src/lib/logUtil";

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