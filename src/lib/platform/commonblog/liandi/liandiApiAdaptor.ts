import {LiandiApi} from "./liandiApi";
import {IApi} from "../../../api";
import {CommonblogApiAdaptor} from "../commonblogApiAdaptor";
import {ICommonblogCfg} from "../commonblogCfg";

/**
 * 链滴的API适配器
 */
export class LiandiApiAdaptor extends CommonblogApiAdaptor implements IApi {

    private readonly liandiApi: LiandiApi

    constructor() {
        super();
        this.liandiApi = new LiandiApi("apiUrl", "token")
    }
}