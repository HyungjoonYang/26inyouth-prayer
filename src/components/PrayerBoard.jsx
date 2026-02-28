import { useState, useEffect } from 'react'
import { subscribeToPrayers } from '../firebase'
import PrayerCard from './PrayerCard'

export default function PrayerBoard({ onEdit }) {
  const [prayers, setPrayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToPrayers((data) => {
      setPrayers(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

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
          <PrayerCard key={prayer.id} prayer={prayer} index={i} onEdit={onEdit} />
        ))}
      </div>
    </div>
  )
}
