import {GithubCfg} from "~/utils/platform/github/githubCfg";
import {POSTID_KEY_CONSTANTS} from "~/utils/constants/postidKeyConstants";

/**
 * Hexo配置
 */
export class HexoCfg extends GithubCfg {

    constructor() {
        super("", "", "", "");

        this.defaultPath = "source/_posts"
        this.posidKey = POSTID_KEY_CONSTANTS.HEXO_POSTID_KEY
        this.previewUrl = "/[date]/[postid]/"
    }
}