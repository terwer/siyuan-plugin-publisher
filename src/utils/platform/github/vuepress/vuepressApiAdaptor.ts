import { IApi } from "~/utils/api"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { VuepressApiV1 } from "~/utils/platform/github/vuepress/vuepressApiV1"
import { VuepressCfg } from "~/utils/platform/github/vuepress/VuepressCfg"
import { GithubApiAdaptor } from "~/utils/platform/github/githubApiAdaptor"

/**
 * Vuepress的API适配器
 */
export class VuepressApiAdaptor extends GithubApiAdaptor implements IApi {
  private readonly vuepressApi: VuepressApiV1

  constructor() {
    super(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS)
    const vuepressCfg = new VuepressCfg()
    this.vuepressApi = new VuepressApiV1(vuepressCfg)
  }
}
