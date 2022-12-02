import { describe, expect, it } from 'vitest'
import logUtil from '~/utils/logUtil'
import {
  calcLastSeconds,
  covertStringToDate,
  formatIsoToNumDate,
  formatIsoToZhDate,
  pathJoin,
  zhSlugify
} from '~/utils/util'

describe('util test', () => {
  it('pathJoin', () => {
    const path1 = 'http://localhost:3000/'
    const path2 = '/post/test.html'

    const result = pathJoin(path1, path2)

    logUtil.logInfo('pathJoin test=>', result)
  })

  it('zhSlugify', async () => {
    const str = '在Vite+TypeScript的项目中使用~和@代替src根路径的方法'
    const result = await zhSlugify(str)
    logUtil.logInfo('zhSlugify result=>', result)
    expect(result).toBeTruthy()
  })

  it('date tests', () => {
    const date = covertStringToDate('20220718142548')
    // const timeZone = 'Asia/Shanghai'
    // const datestr = date.toLocaleString('zh-CN', {
    //     timeZone,
    // });
    logUtil.logInfo('date.toISOString=>')
    logUtil.logInfo(date.toISOString())

    // ======================================

    const isoDateStr = '2022-11-22T15:42:12.637Z'
    const fmt = formatIsoToZhDate(isoDateStr)
    logUtil.logInfo('fmt=>')
    logUtil.logInfo(fmt)

    const fmt2 = formatIsoToNumDate(isoDateStr)
    logUtil.logInfo('fmt2=>')
    logUtil.logInfo(fmt2)

    const date3 = covertStringToDate(fmt2)
    logUtil.logInfo('date3=>', date3)
  })

  it('date compare', () => {
    const isoDateStr = '2022-11-22T16:03:12.637Z'
    const s = calcLastSeconds(isoDateStr)
    logUtil.logInfo('s=>', s)
  })
})
