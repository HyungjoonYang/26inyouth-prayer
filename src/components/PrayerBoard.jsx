import { useState, useEffect } from 'react'
import { subscribeToPrayers, getInitError } from '../firebase'
import PrayerCard from './PrayerCard'

export default function PrayerBoard() {
  const [prayers, setPrayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(getInitError)

  useEffect(() => {
    if (error) return
    const unsubscribe = subscribeToPrayers(
      (data) => {
        setPrayers(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [error])

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400 text-sm px-4 text-center">
        <div>
          <p className="font-semibold mb-1">Firebase 연결 오류</p>
          <p className="text-xs text-red-300">{error.message || String(error)}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        기도제목을 불러오는 중...
      </div>
    )
  }

  if (prayers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm px-4 text-center">
        아직 기도제목이 없어요.<br />첫 번째 기도제목을 올려보세요!
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {prayers.map((prayer, i) => (
          <PrayerCard key={prayer.id} prayer={prayer} index={i} />
        ))}
      </div>
    </div>
  )
}
