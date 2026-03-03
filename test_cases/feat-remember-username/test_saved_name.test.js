/**
 * Test: getSavedName / saveName utils
 * Plan: /markdowns/feat-remember-username.md
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { getSavedName, saveName } from '../../src/utils/deviceId'

describe('saveName / getSavedName', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return empty string when no name is saved', () => {
    expect(getSavedName()).toBe('')
  })

  it('should save and retrieve a name', () => {
    saveName('홍길동')
    expect(getSavedName()).toBe('홍길동')
  })

  it('should overwrite previously saved name', () => {
    saveName('홍길동')
    saveName('김철수')
    expect(getSavedName()).toBe('김철수')
  })

  it('should remove the key when saving empty string', () => {
    saveName('홍길동')
    saveName('')
    expect(getSavedName()).toBe('')
    expect(localStorage.getItem('inyouth-username')).toBeNull()
  })
})
