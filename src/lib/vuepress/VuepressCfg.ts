import {IVuepressCfg} from "./IVuepressCfg";

/**
 * Vuepress配置类
 */
export class VuepressCfg implements IVuepressCfg {
    constructor(public githubUser: string,
                public githubRepo: string,
                public githubToken: string,
                public defaultPath: string,
                public defaultMsg: string,
                public author: string,
                public email: string) {
        this.githubUser = githubUser;
        this.githubRepo = githubRepo;
        this.githubToken = githubToken;
        this.defaultPath = defaultPath;
        this.defaultMsg = defaultMsg;
        this.author = author;
        this.email = email
    }
}