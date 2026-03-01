import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrayerForm from '../../components/PrayerForm'

vi.mock('../../firebase', () => ({
  addPrayer: vi.fn(() => Promise.resolve()),
  updatePrayer: vi.fn(() => Promise.resolve()),
}))

vi.mock('../../utils/deviceId', () => ({
  getDeviceId: vi.fn(() => 'test-device'),
}))

import { addPrayer, updatePrayer } from '../../firebase'
import { getDeviceId } from '../../utils/deviceId'

describe('PrayerForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should show "기도제목 쓰기" in create mode', () => {
    render(<PrayerForm open={true} onClose={vi.fn()} editingPrayer={null} />)
    expect(screen.getByText('기도제목 쓰기')).toBeInTheDocument()
  })

  it('should show "기도제목 수정" in edit mode', () => {
    render(<PrayerForm open={true} onClose={vi.fn()} editingPrayer={{ id: 'p1', name: '홍', content: '내용', color: 'pink' }} />)
    expect(screen.getByText('기도제목 수정')).toBeInTheDocument()
  })

  it('should prefill form in edit mode', () => {
    render(<PrayerForm open={true} onClose={vi.fn()} editingPrayer={{ id: 'p1', name: '홍길동', content: '기도내용', color: 'pink' }} />)
    expect(screen.getByPlaceholderText('이름을 입력하세요')).toHaveValue('홍길동')
    expect(screen.getByPlaceholderText('기도제목을 적어주세요')).toHaveValue('기도내용')
  })

  it('should disable submit when content is empty', () => {
    render(<PrayerForm open={true} onClose={vi.fn()} editingPrayer={null} />)
    const submitBtn = screen.getByText('올리기 🙏')
    expect(submitBtn).toBeDisabled()
  })

  it('should call addPrayer on submit in create mode', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<PrayerForm open={true} onClose={onClose} editingPrayer={null} />)

    await user.type(screen.getByPlaceholderText('이름을 입력하세요'), '홍길동')
    await user.type(screen.getByPlaceholderText('기도제목을 적어주세요'), '기도합니다')
    await user.click(screen.getByText('올리기 🙏'))

    expect(addPrayer).toHaveBeenCalledWith({
      name: '홍길동',
      content: '기도합니다',
      color: 'yellow',
      deviceId: 'test-device',
    })
    expect(onClose).toHaveBeenCalled()
  })

  it('should call updatePrayer on submit in edit mode', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<PrayerForm open={true} onClose={onClose} editingPrayer={{ id: 'p1', name: '홍', content: '원래내용', color: 'mint' }} />)

    const textarea = screen.getByPlaceholderText('기도제목을 적어주세요')
    await user.clear(textarea)
    await user.type(textarea, '수정내용')
    await user.click(screen.getByText('수정하기'))

    expect(updatePrayer).toHaveBeenCalledWith('p1', {
      name: '홍',
      content: '수정내용',
      color: 'mint',
    })
    expect(onClose).toHaveBeenCalled()
  })

  it('should show alert on timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    addPrayer.mockImplementation(() => new Promise(() => {})) // never resolves
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

    render(<PrayerForm open={true} onClose={vi.fn()} editingPrayer={null} />)

    await user.type(screen.getByPlaceholderText('기도제목을 적어주세요'), '기도')
    await user.click(screen.getByText('올리기 🙏'))

    await vi.advanceTimersByTimeAsync(10000)

    expect(alert).toHaveBeenCalled()
  })
})
