import {GithubCfg} from "~/utils/platform/github/githubCfg";
import {POSTID_KEY_CONSTANTS} from "~/utils/constants/postidKeyConstants";

/**
 * Hugo配置
 */
export class HugoCfg extends GithubCfg {

    githubUser: string;
    githubRepo: string;
    githubToken: string;

    constructor() {
        super();
        this.githubUser = "";
        this.githubRepo = "";
        this.githubToken = "";

        this.defaultPath = "content/post"
        this.posidKey = POSTID_KEY_CONSTANTS.HUGO_POSTID_KEY
        this.home = ""
        this.previewUrl = "/post/[postid].html"
    }
}