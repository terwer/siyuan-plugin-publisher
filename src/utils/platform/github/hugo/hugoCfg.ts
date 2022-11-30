import {GithubCfg} from "~/utils/platform/github/githubCfg";

/**
 * Hugo配置
 */
export class HugoCfg extends GithubCfg {

    githubUser: string;
    githubRepo: string;
    githubToken: string;

    constructor(githubUser: string, githubRepo: string, githubToken: string) {
        super();
        this.githubUser = githubUser;
        this.githubRepo = githubRepo;
        this.githubToken = githubToken;

        this.defaultPath = "content/post"
    }
}