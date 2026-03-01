import { describe, it, expect, beforeEach } from 'vitest'
import { getDeviceId, hasPrayed, markPrayed } from '../../utils/deviceId'

describe('getDeviceId', () => {
  it('should create and store a new id when none exists', () => {
    const id = getDeviceId()
    expect(id).toBeTruthy()
    expect(localStorage.getItem('inyouth-device-id')).toBe(id)
  })

  it('should return the existing id from localStorage', () => {
    localStorage.setItem('inyouth-device-id', 'existing-id')
    expect(getDeviceId()).toBe('existing-id')
  })

  it('should return the same id on repeated calls', () => {
    const id1 = getDeviceId()
    const id2 = getDeviceId()
    expect(id1).toBe(id2)
  })
})

describe('hasPrayed', () => {
  it('should return false when no prayed list exists', () => {
    expect(hasPrayed('prayer-1')).toBe(false)
  })

  it('should return false when prayer is not in list', () => {
    localStorage.setItem('inyouth-prayed', JSON.stringify(['prayer-2']))
    expect(hasPrayed('prayer-1')).toBe(false)
  })

  it('should return true when prayer is in list', () => {
    localStorage.setItem('inyouth-prayed', JSON.stringify(['prayer-1']))
    expect(hasPrayed('prayer-1')).toBe(true)
  })

  it('should return false for empty list', () => {
    localStorage.setItem('inyouth-prayed', JSON.stringify([]))
    expect(hasPrayed('prayer-1')).toBe(false)
  })
})

describe('markPrayed', () => {
  it('should add prayer id to list', () => {
    markPrayed('prayer-1')
    const list = JSON.parse(localStorage.getItem('inyouth-prayed'))
    expect(list).toContain('prayer-1')
  })

  it('should not duplicate prayer id', () => {
    markPrayed('prayer-1')
    markPrayed('prayer-1')
    const list = JSON.parse(localStorage.getItem('inyouth-prayed'))
    expect(list.filter((id) => id === 'prayer-1')).toHaveLength(1)
  })

  it('should append to existing list', () => {
    markPrayed('prayer-1')
    markPrayed('prayer-2')
    const list = JSON.parse(localStorage.getItem('inyouth-prayed'))
    expect(list).toEqual(['prayer-1', 'prayer-2'])
  })
})
