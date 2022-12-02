import { describe, expect, it } from 'vitest'
import { getEnv } from '../../src/utils/envUtil'

describe('env test', () => {
  it('getEnv', () => {
    const siyuanApiUrl = getEnv('VITE_SIYUAN_API_URL')
    expect(siyuanApiUrl).toBeDefined()
    console.log('siyuanApiUrl=>', siyuanApiUrl)
  })
})
