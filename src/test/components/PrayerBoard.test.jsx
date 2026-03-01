import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrayerBoard from '../../components/PrayerBoard'

vi.mock('../../firebase', () => ({
  subscribeToPrayers: vi.fn(),
}))

vi.mock('../../components/PrayerCard', () => ({
  default: ({ prayer }) => <div data-testid={`prayer-${prayer.id}`}>{prayer.content}</div>,
}))

import { subscribeToPrayers } from '../../firebase'

describe('PrayerBoard', () => {
  let mockUnsubscribe

  beforeEach(() => {
    vi.clearAllMocks()
    mockUnsubscribe = vi.fn()
  })

  it('should show loading state initially', () => {
    subscribeToPrayers.mockReturnValue(mockUnsubscribe)
    render(<PrayerBoard onEdit={vi.fn()} onCardClick={vi.fn()} />)
    expect(screen.getByText(/불러오는 중/)).toBeInTheDocument()
  })

  it('should show error state when subscription fails', () => {
    subscribeToPrayers.mockImplementation((callback, onError) => {
      onError(new Error('fail'))
      return mockUnsubscribe
    })
    render(<PrayerBoard onEdit={vi.fn()} onCardClick={vi.fn()} />)
    expect(screen.getByText(/불러오지 못했어요/)).toBeInTheDocument()
  })

  it('should show empty state when no prayers', () => {
    subscribeToPrayers.mockImplementation((callback) => {
      callback([])
      return mockUnsubscribe
    })
    render(<PrayerBoard onEdit={vi.fn()} onCardClick={vi.fn()} />)
    expect(screen.getByText(/아직 기도제목이 없어요/)).toBeInTheDocument()
  })

  it('should render prayer list', () => {
    subscribeToPrayers.mockImplementation((callback) => {
      callback([
        { id: 'p1', content: '기도1' },
        { id: 'p2', content: '기도2' },
      ])
      return mockUnsubscribe
    })
    render(<PrayerBoard onEdit={vi.fn()} onCardClick={vi.fn()} />)
    expect(screen.getByTestId('prayer-p1')).toBeInTheDocument()
    expect(screen.getByTestId('prayer-p2')).toBeInTheDocument()
  })

  it('should retry when retry button is clicked', async () => {
    subscribeToPrayers.mockImplementation((callback, onError) => {
      onError(new Error('fail'))
      return mockUnsubscribe
    })
    const user = userEvent.setup()
    render(<PrayerBoard onEdit={vi.fn()} onCardClick={vi.fn()} />)
    expect(subscribeToPrayers).toHaveBeenCalledTimes(1)

    // On retry, return success
    subscribeToPrayers.mockImplementation((callback) => {
      callback([{ id: 'p1', content: '기도1' }])
      return mockUnsubscribe
    })
    await user.click(screen.getByText('다시 시도'))
    expect(subscribeToPrayers).toHaveBeenCalledTimes(2)
  })

  it('should unsubscribe on unmount', () => {
    subscribeToPrayers.mockImplementation((callback) => {
      callback([])
      return mockUnsubscribe
    })
    const { unmount } = render(<PrayerBoard onEdit={vi.fn()} onCardClick={vi.fn()} />)
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})
