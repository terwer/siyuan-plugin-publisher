import { MetaWeblogApiAdaptor } from "../metaweblog/metaWeblogApiAdaptor"
import { IApi } from "../../api"
import { API_TYPE_CONSTANTS } from "../../constants/apiTypeConstants"

export class WordpressApiAdaptor extends MetaWeblogApiAdaptor implements IApi {
  constructor() {
    super(API_TYPE_CONSTANTS.API_TYPE_WORDPRESS)
  }
}
