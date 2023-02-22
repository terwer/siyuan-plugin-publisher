/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { PluginObject } from "vue"
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { LogFactory } from "~/utils/logUtil"
import {
  faArrowRotateRight,
  faBellSlash,
  faBolt,
  faBookOpenReader,
  faCartShopping,
  faCircleXmark,
  faCreditCard,
  faDownload,
  faFileImport,
  faFileLines,
  faGear,
  faImage,
  faLink,
  faListOl,
  faMagnifyingGlass,
  faPaste,
  faPenToSquare,
  faRectangleList,
  faShareNodes,
  faTrashCan,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { faChrome, faShopify } from "@fortawesome/free-brands-svg-icons"

const logger = LogFactory.getLogger("plugins/font-awesome/font-awesome.ts")

const FontAwesome: PluginObject<any> = {
  install(Vue) {
    library.add(faUpload)
    library.add(faBookOpenReader)
    library.add(faRectangleList)
    library.add(faXmark)
    library.add(faCircleXmark)
    library.add(faBolt)
    library.add(faCreditCard)
    library.add(faImage)
    library.add(faChrome)
    library.add(faShareNodes)
    library.add(faListOl)
    library.add(faFileLines)
    library.add(faDownload)
    library.add(faMagnifyingGlass)
    library.add(faPaste)
    library.add(faFileImport)
    library.add(faGear)
    library.add(faArrowRotateRight)
    library.add(faTrashCan)
    library.add(faPenToSquare)
    library.add(faShopify)
    library.add(faCartShopping)
    library.add(faLink)
    library.add(faBellSlash)

    Vue.component("font-awesome-icon", FontAwesomeIcon)
    logger.debug("FontAwesome inited")
  },
}

export default FontAwesome
