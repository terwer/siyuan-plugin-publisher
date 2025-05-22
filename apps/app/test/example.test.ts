import { describe, it, expect } from 'vitest'

describe('示例测试套件', () => {
  it('应该通过基本测试', () => {
    expect(true).toBe(true)
  })

  it('应该能够进行数学运算', () => {
    expect(1 + 1).toBe(2)
  })
}) 