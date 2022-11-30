import {GithubApi} from "~/utils/platform/github/githubApi";
import {HugoCfg} from "~/utils/platform/github/hugo/hugoCfg";

/**
 * Hugo Api
 */
export class HugoApi extends GithubApi{
    hugoCfg:HugoCfg

    constructor(hugoCfg: HugoCfg) {
        super(hugoCfg);
        this.hugoCfg = hugoCfg;
    }

    async getPageData(docPath: string): Promise<any> {
        return super.getPageData(docPath);
    }

    async getGithubPageTreeNode(docPath: string): Promise<Array<any>> {
        return super.getGithubPageTreeNode(docPath);
    }
}