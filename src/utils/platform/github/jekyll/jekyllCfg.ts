import {GithubCfg} from "~/utils/platform/github/githubCfg";
import {POSTID_KEY_CONSTANTS} from "~/utils/constants/postidKeyConstants";

/**
 * Jekyll配置
 */
export class JekyllCfg extends GithubCfg{

    constructor() {
        super();

        this.defaultPath = "_posts"
        this.posidKey = POSTID_KEY_CONSTANTS.JEKYLL_POSTID_KEY
        this.previewUrl = "/[cats]/[date]/[postid].html"
    }
}