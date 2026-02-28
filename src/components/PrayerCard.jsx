import { useState, useMemo } from 'react'
import { incrementPrayCount, deletePrayer } from '../firebase'
import { getDeviceId, hasPrayed, markPrayed } from '../utils/deviceId'

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

export default function PrayerCard({ prayer, index, onEdit }) {
  const [bouncing, setBouncing] = useState(false)
  const [prayed, setPrayed] = useState(() => hasPrayed(prayer.id))

  const rotation = useMemo(() => {
    const seed = prayer.id.charCodeAt(0) + (prayer.id.charCodeAt(1) || 0)
    return (seed % 7) - 3 // -3 ~ +3 degrees
  }, [prayer.id])

  const bgClass = COLOR_MAP[prayer.color] || 'bg-pastel-yellow'
  const isOwn = prayer.deviceId === getDeviceId()

  async function handlePray() {
    if (prayed) return
    setBouncing(true)
    setPrayed(true)
    markPrayed(prayer.id)
    await incrementPrayCount(prayer.id)
    setTimeout(() => setBouncing(false), 300)
  }

  async function handleDelete() {
    if (!confirm('이 기도제목을 삭제할까요?')) return
    await deletePrayer(prayer.id)
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {formatDate(prayer.createdAt)}
          </span>
          {isOwn && (
            <>
              <button
                onClick={() => onEdit(prayer)}
                className="text-xs text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                삭제
              </button>
            </>
          )}
        </div>
        <button
          onClick={handlePray}
          disabled={prayed}
          className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full transition-all ${
            prayed
              ? 'bg-amber-100 text-amber-600 cursor-default'
              : 'bg-white/50 hover:bg-white/80 active:scale-95 cursor-pointer'
          } ${bouncing ? 'animate-bounce-small' : ''}`}
        >
          <span>{prayed ? '🙏' : '🤲'}</span>
          <span className="font-medium">{prayer.prayCount || 0}</span>
        </button>
      </div>
    </div>
  )
}
