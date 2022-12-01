import {POSTID_KEY_CONSTANTS} from "~/utils/constants/postidKeyConstants";
import {GithubCfg} from "~/utils/platform/github/githubCfg";

/**
 * Vuepress配置类
 */
export class VuepressCfg extends GithubCfg {
    constructor() {
        super();

        this.defaultPath = "docs"
        this.posidKey = POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY
        this.previewUrl = "/post/[postid].html"
    }
}