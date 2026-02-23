import { useState, useMemo } from 'react'
import { incrementPrayCount } from '../firebase'

const COLOR_MAP = {
  pink: 'bg-pastel-pink',
  yellow: 'bg-pastel-yellow',
  purple: 'bg-pastel-purple',
  mint: 'bg-pastel-mint',
  blue: 'bg-pastel-blue',
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export default function PrayerCard({ prayer, index }) {
  const [bouncing, setBouncing] = useState(false)

  const rotation = useMemo(() => {
    const seed = prayer.id.charCodeAt(0) + (prayer.id.charCodeAt(1) || 0)
    return (seed % 7) - 3 // -3 ~ +3 degrees
  }, [prayer.id])

  const bgClass = COLOR_MAP[prayer.color] || 'bg-pastel-yellow'

  async function handlePray() {
    setBouncing(true)
    await incrementPrayCount(prayer.id)
    setTimeout(() => setBouncing(false), 300)
  }

  return (
    <div
      className={`${bgClass} rounded-2xl p-4 shadow-md animate-fade-in-up break-inside-avoid`}
      style={{
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <p className="text-sm font-semibold text-gray-700 mb-1">
        {prayer.name || '익명'}
      </p>
      <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap break-words mb-3">
        {prayer.content}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {formatDate(prayer.createdAt)}
        </span>
        <button
          onClick={handlePray}
          className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-white/50 hover:bg-white/80 active:scale-95 transition-all cursor-pointer ${bouncing ? 'animate-bounce-small' : ''}`}
        >
          <span>🙏</span>
          <span className="text-gray-600 font-medium">{prayer.prayCount || 0}</span>
        </button>
      </div>
    </div>
  )
}
