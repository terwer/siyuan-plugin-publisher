import {IVuepressCfg} from "./IVuepressCfg";
import {POSTID_KEY_CONSTANTS} from "../../constants/postidKeyConstants";

/**
 * Vuepress配置类
 */
export class VuepressCfg implements IVuepressCfg {
    /**
     * 文章别名key
     */
    posidKey: string = ""

    constructor(public githubUser: string,
                public githubRepo: string,
                public githubToken: string,
                public defaultBranch: string,
                public defaultPath: string,
                public defaultMsg: string,
                public author: string,
                public email: string) {
        this.githubUser = githubUser;
        this.githubRepo = githubRepo;
        this.githubToken = githubToken;
        this.defaultBranch = defaultBranch;
        this.defaultPath = defaultPath;
        this.defaultMsg = defaultMsg;
        this.author = author;
        this.email = email
        this.posidKey = POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY
    }
}