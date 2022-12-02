import { IApi } from "../../../api"
import { MetaWeblogApiAdaptor } from "../metaWeblogApiAdaptor"
import { API_TYPE_CONSTANTS } from "../../../constants/apiTypeConstants"

/**
 * JVue的API适配器
 */
export class JVueApiAdaptor extends MetaWeblogApiAdaptor implements IApi {
  constructor() {
    super(API_TYPE_CONSTANTS.API_TYPE_JVUE)
  }
}
