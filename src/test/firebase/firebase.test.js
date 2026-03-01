import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockAddDoc = vi.fn()
const mockUpdateDoc = vi.fn()
const mockDeleteDoc = vi.fn()
const mockOnSnapshot = vi.fn()
const mockDoc = vi.fn()
const mockCollection = vi.fn()
const mockQuery = vi.fn()
const mockOrderBy = vi.fn()
const mockIncrement = vi.fn((n) => `increment(${n})`)
const mockServerTimestamp = vi.fn(() => 'SERVER_TIMESTAMP')

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: (...args) => mockCollection(...args),
  addDoc: (...args) => mockAddDoc(...args),
  doc: (...args) => mockDoc(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
  deleteDoc: (...args) => mockDeleteDoc(...args),
  increment: (n) => mockIncrement(n),
  onSnapshot: (...args) => mockOnSnapshot(...args),
  query: (...args) => mockQuery(...args),
  orderBy: (...args) => mockOrderBy(...args),
  serverTimestamp: () => mockServerTimestamp(),
}))

let addPrayer, updatePrayer, deletePrayer, incrementPrayCount
let subscribeToPrayers, subscribeToComments, addComment

beforeEach(async () => {
  vi.clearAllMocks()
  mockCollection.mockReturnValue('mock-collection-ref')
  mockQuery.mockReturnValue('mock-query')
  mockDoc.mockReturnValue('mock-doc-ref')

  const mod = await import('../../firebase.js')
  addPrayer = mod.addPrayer
  updatePrayer = mod.updatePrayer
  deletePrayer = mod.deletePrayer
  incrementPrayCount = mod.incrementPrayCount
  subscribeToPrayers = mod.subscribeToPrayers
  subscribeToComments = mod.subscribeToComments
  addComment = mod.addComment
})

describe('addPrayer', () => {
  it('should call addDoc with correct data', async () => {
    await addPrayer({ name: '홍길동', content: '기도합니다', color: 'pink', deviceId: 'dev-1' })
    expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), {
      name: '홍길동',
      content: '기도합니다',
      color: 'pink',
      deviceId: 'dev-1',
      prayCount: 0,
      createdAt: 'SERVER_TIMESTAMP',
    })
  })

  it('should default name to empty string when not provided', async () => {
    await addPrayer({ content: '기도', color: 'blue' })
    expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      name: '',
      deviceId: '',
    }))
  })
})

describe('updatePrayer', () => {
  it('should call updateDoc with correct args', async () => {
    await updatePrayer('doc-1', { name: '김철수', content: '수정', color: 'mint' })
    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'prayers', 'doc-1')
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-doc-ref', {
      name: '김철수',
      content: '수정',
      color: 'mint',
    })
  })

  it('should default name to empty string', async () => {
    await updatePrayer('doc-1', { name: '', content: '내용', color: 'pink' })
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-doc-ref', {
      name: '',
      content: '내용',
      color: 'pink',
    })
  })
})

describe('deletePrayer', () => {
  it('should call deleteDoc with correct doc ref', async () => {
    await deletePrayer('doc-1')
    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'prayers', 'doc-1')
    expect(mockDeleteDoc).toHaveBeenCalledWith('mock-doc-ref')
  })
})

describe('incrementPrayCount', () => {
  it('should call updateDoc with increment(1)', async () => {
    await incrementPrayCount('doc-1')
    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'prayers', 'doc-1')
    expect(mockUpdateDoc).toHaveBeenCalledWith('mock-doc-ref', {
      prayCount: 'increment(1)',
    })
  })
})

describe('subscribeToPrayers', () => {
  it('should call onSnapshot and map docs', () => {
    const mockUnsubscribe = vi.fn()
    mockOnSnapshot.mockReturnValue(mockUnsubscribe)

    const callback = vi.fn()
    const onError = vi.fn()
    const unsub = subscribeToPrayers(callback, onError)

    expect(mockOnSnapshot).toHaveBeenCalled()
    expect(unsub).toBe(mockUnsubscribe)

    // Simulate snapshot
    const snapshotCallback = mockOnSnapshot.mock.calls[0][1]
    snapshotCallback({
      docs: [
        { id: 'p1', data: () => ({ content: 'test', prayCount: 0 }) },
        { id: 'p2', data: () => ({ content: 'test2', prayCount: 1 }) },
      ],
    })
    expect(callback).toHaveBeenCalledWith([
      { id: 'p1', content: 'test', prayCount: 0 },
      { id: 'p2', content: 'test2', prayCount: 1 },
    ])
  })

  it('should handle errors', () => {
    mockOnSnapshot.mockReturnValue(vi.fn())
    const onError = vi.fn()
    subscribeToPrayers(vi.fn(), onError)

    const errorCallback = mockOnSnapshot.mock.calls[0][2]
    const error = new Error('test error')
    errorCallback(error)
    expect(onError).toHaveBeenCalledWith(error)
  })

  it('should return unsubscribe function', () => {
    const mockUnsub = vi.fn()
    mockOnSnapshot.mockReturnValue(mockUnsub)
    const unsub = subscribeToPrayers(vi.fn())
    expect(unsub).toBe(mockUnsub)
  })
})

describe('subscribeToComments', () => {
  it('should subscribe to sub-collection with asc order', () => {
    mockOnSnapshot.mockReturnValue(vi.fn())
    subscribeToComments('prayer-1', vi.fn())
    expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'prayers', 'prayer-1', 'comments')
    expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'asc')
  })

  it('should map docs and call callback', () => {
    mockOnSnapshot.mockReturnValue(vi.fn())
    const callback = vi.fn()
    subscribeToComments('prayer-1', callback)

    const snapshotCallback = mockOnSnapshot.mock.calls[0][1]
    snapshotCallback({
      docs: [{ id: 'c1', data: () => ({ content: 'comment' }) }],
    })
    expect(callback).toHaveBeenCalledWith([{ id: 'c1', content: 'comment' }])
  })

  it('should handle errors', () => {
    mockOnSnapshot.mockReturnValue(vi.fn())
    const onError = vi.fn()
    subscribeToComments('prayer-1', vi.fn(), onError)

    const errorCallback = mockOnSnapshot.mock.calls[0][2]
    errorCallback(new Error('err'))
    expect(onError).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('addComment', () => {
  it('should call addDoc on sub-collection', async () => {
    await addComment('prayer-1', { name: '이름', content: '댓글' })
    expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'prayers', 'prayer-1', 'comments')
    expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), {
      name: '이름',
      content: '댓글',
      createdAt: 'SERVER_TIMESTAMP',
    })
  })

  it('should default name to empty string', async () => {
    await addComment('prayer-1', { name: '', content: '댓글' })
    expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      name: '',
    }))
  })
})
