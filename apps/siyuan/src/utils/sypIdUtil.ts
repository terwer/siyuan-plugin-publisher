/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import shortHash from "shorthash2"
import { v4 as uuidv4 } from "uuid"

/**
 * 唯一ID
 */
const newID = (): string => {
  const newstr = new Date().toISOString()
  return shortHash(newstr).toLowerCase()
}

/**
 * ID生成统一入口
 */
const newUuid = () => {
  return uuidv4()
}

/**
 * 生成随机ID
 */
const randomUuid = (): string => {
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    },
  )
  return uuid
}

const sypIdUtil = {
  newUuid,
  newID,
  randomUuid,
}

export default sypIdUtil
