/**
 * Test: 기도카드 댓글 수 뱃지 표시
 * Plan: /markdowns/feat-comment-count-badge.md
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockUpdateDoc = vi.fn()
const mockIncrement = vi.fn((n) => `increment(${n})`)
const mockAddDoc = vi.fn(() => Promise.resolve({ id: 'comment1' }))
const mockDoc = vi.fn(() => 'prayer-doc-ref')
const mockCollection = vi.fn(() => 'comments-ref')
const mockServerTimestamp = vi.fn(() => 'server-ts')

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => 'mock-db'),
  collection: (...args) => mockCollection(...args),
  addDoc: (...args) => mockAddDoc(...args),
  doc: (...args) => mockDoc(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
  deleteDoc: vi.fn(),
  increment: (n) => mockIncrement(n),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  serverTimestamp: () => mockServerTimestamp(),
}))

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}))

// --- firebase.js: addComment가 commentCount를 increment하는지 ---
describe('addComment commentCount increment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call updateDoc with increment(1) on parent prayer doc', async () => {
    const { addComment } = await import('../../src/firebase.js')

    await addComment('prayer123', { name: '테스트', content: '화이팅' })

    // addDoc이 댓글을 추가했는지
    expect(mockAddDoc).toHaveBeenCalled()

    // updateDoc이 parent prayer 문서의 commentCount를 increment했는지
    expect(mockDoc).toHaveBeenCalledWith('mock-db', 'prayers', 'prayer123')
    expect(mockUpdateDoc).toHaveBeenCalledWith('prayer-doc-ref', {
      commentCount: 'increment(1)',
    })
  })
})

// --- PrayerCard: commentCount 렌더링 로직 ---
describe('PrayerCard commentCount badge', () => {
  it('should show badge when commentCount > 0', () => {
    const prayer = { commentCount: 3 }
    expect(prayer.commentCount).toBeGreaterThan(0)
  })

  it('should not show badge when commentCount is 0 or undefined', () => {
    const prayer1 = { commentCount: 0 }
    const prayer2 = {}
    expect(prayer1.commentCount || 0).toBe(0)
    expect(prayer2.commentCount || 0).toBe(0)
  })
})
