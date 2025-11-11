/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { DateUtil } from "zhi-common"

/**
 * Halo 平台的一些元数据
 *
 * @author terwer
 * @version 1.15.0
 * @since 1.15.0
 */
class HaloPostMeta {
  public slug: string
  public name: string
  public year: string
  public month: string
  public day: string

  constructor(slug: string, name: string, dateCreated: Date) {
    this.slug = slug
    this.name = name

    const created = DateUtil.formatIsoToZhDate(dateCreated.toISOString(), true)
    const datearr = created.split(" ")[0]
    const numarr = datearr.split("-")
    this.year = numarr[0]
    this.month = numarr[1]
    this.day = numarr[2]
  }
}

export { HaloPostMeta }
