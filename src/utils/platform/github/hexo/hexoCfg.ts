import {GithubCfg} from "~/utils/platform/github/githubCfg";
import {POSTID_KEY_CONSTANTS} from "~/utils/constants/postidKeyConstants";

/**
 * Hexo配置
 */
export class HexoCfg extends GithubCfg{

    constructor() {
        super();

        this.defaultPath = "hexo"
        this.posidKey = POSTID_KEY_CONSTANTS.HEXO_POSTID_KEY
        this.previewUrl = "/post/[postid].html"
    }
}