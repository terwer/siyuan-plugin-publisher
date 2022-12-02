import { describe, it } from 'vitest'
import logUtil from '../../../../src/utils/logUtil'
import { SiYuanApiAdaptor } from '../../../../src/utils/platform/siyuan/siYuanApiAdaptor'

describe('SiyuanApi test', () => {
  it('getUsersBlogs', async () => {
    const api = new SiYuanApiAdaptor()
    const result = await api.getUsersBlogs()
    logUtil.logInfo('getUsersBlogs测试结果=>', result)
  })
})
