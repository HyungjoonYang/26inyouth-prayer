import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrayerCard from '../../components/PrayerCard'

vi.mock('../../firebase', () => ({
  incrementPrayCount: vi.fn(() => Promise.resolve()),
  deletePrayer: vi.fn(() => Promise.resolve()),
}))

vi.mock('../../utils/deviceId', () => ({
  getDeviceId: vi.fn(() => 'my-device'),
  hasPrayed: vi.fn(() => false),
  markPrayed: vi.fn(),
}))

import { incrementPrayCount, deletePrayer } from '../../firebase'
import { getDeviceId, hasPrayed, markPrayed } from '../../utils/deviceId'

const basePrayer = {
  id: 'p1',
  name: '홍길동',
  content: '기도제목 내용입니다',
  color: 'pink',
  prayCount: 3,
  deviceId: 'other-device',
  createdAt: { toDate: () => new Date(2025, 0, 15) },
}

describe('PrayerCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hasPrayed.mockReturnValue(false)
    getDeviceId.mockReturnValue('my-device')
  })

  it('should render name and content', () => {
    render(<PrayerCard prayer={basePrayer} index={0} onEdit={vi.fn()} onClick={vi.fn()} />)
    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('기도제목 내용입니다')).toBeInTheDocument()
  })

  it('should render "익명" when name is empty', () => {
    render(<PrayerCard prayer={{ ...basePrayer, name: '' }} index={0} onEdit={vi.fn()} onClick={vi.fn()} />)
    expect(screen.getByText('익명')).toBeInTheDocument()
  })

  it('should render prayCount', () => {
    render(<PrayerCard prayer={basePrayer} index={0} onEdit={vi.fn()} onClick={vi.fn()} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should render formatted date', () => {
    render(<PrayerCard prayer={basePrayer} index={0} onEdit={vi.fn()} onClick={vi.fn()} />)
    expect(screen.getByText('1/15')).toBeInTheDocument()
  })

  it('should apply correct color class', () => {
    const { container } = render(<PrayerCard prayer={basePrayer} index={0} onEdit={vi.fn()} onClick={vi.fn()} />)
    expect(container.firstChild.className).toContain('bg-pastel-pink')
  })

  it('should show edit/delete buttons when device matches', () => {
    getDeviceId.mockReturnValue('my-device')
    render(<PrayerCard prayer={{ ...basePrayer, deviceId: 'my-device' }} index={0} onEdit={vi.fn()} onClick={vi.fn()} />)
    expect(screen.getByText('수정')).toBeInTheDocument()
    expect(screen.getByText('삭제')).toBeInTheDocument()
  })

  it('should not show edit/delete buttons when device does not match', () => {
    render(<PrayerCard prayer={basePrayer} index={0} onEdit={vi.fn()} onClick={vi.fn()} />)
    expect(screen.queryByText('수정')).not.toBeInTheDocument()
    expect(screen.queryByText('삭제')).not.toBeInTheDocument()
  })

  it('should call markPrayed and incrementPrayCount on pray button click', async () => {
    const user = userEvent.setup()
    render(<PrayerCard prayer={basePrayer} index={0} onEdit={vi.fn()} onClick={vi.fn()} />)
    const prayButton = screen.getByText('🤲').closest('button')
    await user.click(prayButton)
    expect(markPrayed).toHaveBeenCalledWith('p1')
    expect(incrementPrayCount).toHaveBeenCalledWith('p1')
  })

  it('should disable pray button after praying', async () => {
    const user = userEvent.setup()
    render(<PrayerCard prayer={basePrayer} index={0} onEdit={vi.fn()} onClick={vi.fn()} />)
    const prayButton = screen.getByText('🤲').closest('button')
    await user.click(prayButton)
    expect(prayButton).toBeDisabled()
  })

  it('should not call onClick when edit button is clicked', async () => {
    getDeviceId.mockReturnValue('my-device')
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<PrayerCard prayer={{ ...basePrayer, deviceId: 'my-device' }} index={0} onEdit={vi.fn()} onClick={onClick} />)
    await user.click(screen.getByText('수정'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should not call onClick when delete button is clicked', async () => {
    getDeviceId.mockReturnValue('my-device')
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<PrayerCard prayer={{ ...basePrayer, deviceId: 'my-device' }} index={0} onEdit={vi.fn()} onClick={onClick} />)
    await user.click(screen.getByText('삭제'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should not call onClick when pray button is clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<PrayerCard prayer={basePrayer} index={0} onEdit={vi.fn()} onClick={onClick} />)
    await user.click(screen.getByText('🤲').closest('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
