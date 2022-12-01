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
}