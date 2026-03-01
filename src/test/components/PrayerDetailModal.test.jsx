import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrayerDetailModal from '../../components/PrayerDetailModal'

vi.mock('../../firebase', () => ({
  subscribeToComments: vi.fn(),
  addComment: vi.fn(() => Promise.resolve()),
}))

import { subscribeToComments, addComment } from '../../firebase'

const basePrayer = {
  id: 'p1',
  name: '홍길동',
  content: '기도제목',
  color: 'pink',
  createdAt: { toDate: () => new Date(2025, 0, 15) },
}

describe('PrayerDetailModal', () => {
  let mockUnsubscribe

  beforeEach(() => {
    vi.clearAllMocks()
    mockUnsubscribe = vi.fn()
    subscribeToComments.mockReturnValue(mockUnsubscribe)
  })

  it('should return null when prayer is null', () => {
    const { container } = render(<PrayerDetailModal prayer={null} open={true} onClose={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('should display prayer content', () => {
    render(<PrayerDetailModal prayer={basePrayer} open={true} onClose={vi.fn()} />)
    expect(screen.getByText('기도제목')).toBeInTheDocument()
    expect(screen.getByText('홍길동')).toBeInTheDocument()
  })

  it('should render comments from subscription', () => {
    subscribeToComments.mockImplementation((prayerId, callback) => {
      callback([
        { id: 'c1', name: '댓글러', content: '응원합니다', createdAt: { toDate: () => new Date(2025, 0, 16) } },
      ])
      return mockUnsubscribe
    })
    render(<PrayerDetailModal prayer={basePrayer} open={true} onClose={vi.fn()} />)
    expect(screen.getByText('응원합니다')).toBeInTheDocument()
    expect(screen.getByText('댓글러')).toBeInTheDocument()
  })

  it('should call addComment and clear input on submit', async () => {
    const user = userEvent.setup()
    render(<PrayerDetailModal prayer={basePrayer} open={true} onClose={vi.fn()} />)

    const contentInput = screen.getByPlaceholderText('댓글을 입력하세요')
    await user.type(contentInput, '좋은 기도입니다')
    await user.click(screen.getByText('등록'))

    expect(addComment).toHaveBeenCalledWith('p1', {
      name: '',
      content: '좋은 기도입니다',
    })
    expect(contentInput).toHaveValue('')
  })

  it('should unsubscribe when prayer changes', () => {
    const { rerender } = render(<PrayerDetailModal prayer={basePrayer} open={true} onClose={vi.fn()} />)
    const newPrayer = { ...basePrayer, id: 'p2' }
    rerender(<PrayerDetailModal prayer={newPrayer} open={true} onClose={vi.fn()} />)
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('should unsubscribe on unmount', () => {
    const { unmount } = render(<PrayerDetailModal prayer={basePrayer} open={true} onClose={vi.fn()} />)
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})
