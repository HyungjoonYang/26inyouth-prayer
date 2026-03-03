import { useState, useEffect } from 'react'
import { addPrayer, updatePrayer } from '../firebase'
import { getDeviceId, getSavedName, saveName } from '../utils/deviceId'

const COLORS = [
  { key: 'pink', bg: 'bg-pastel-pink', label: '🩷' },
  { key: 'yellow', bg: 'bg-pastel-yellow', label: '💛' },
  { key: 'purple', bg: 'bg-pastel-purple', label: '💜' },
  { key: 'mint', bg: 'bg-pastel-mint', label: '💚' },
  { key: 'blue', bg: 'bg-pastel-blue', label: '💙' },
]

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)].key
}

export default function PrayerForm({ open, onClose, editingPrayer }) {
  const [name, setName] = useState(getSavedName)
  const [content, setContent] = useState('')
  const [color, setColor] = useState(randomColor)
  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!editingPrayer

  useEffect(() => {
    if (editingPrayer) {
      setName(editingPrayer.name || '')
      setContent(editingPrayer.content || '')
      setColor(editingPrayer.color || 'yellow')
    }
  }, [editingPrayer])

  function resetForm() {
    setName(getSavedName())
    setContent('')
    setColor(randomColor())
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim() || submitting) return

    setSubmitting(true)
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10000)
      )

      const write = isEditing
        ? updatePrayer(editingPrayer.id, {
            name: name.trim(),
            content: content.trim(),
            color,
          })
        : addPrayer({
            name: name.trim(),
            content: content.trim(),
            color,
            deviceId: getDeviceId(),
          })

      await Promise.race([write, timeout])
      saveName(name.trim())
      resetForm()
      onClose()
    } catch (err) {
      console.error('Failed to save prayer:', err)
      alert('저장에 실패했어요. 네트워크 연결을 확인하고 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="p-5 max-w-lg mx-auto">
          {/* Handle bar */}
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {isEditing ? '기도제목 수정' : '기도제목 쓰기'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                이름 <span className="text-gray-400 font-normal">(비우면 익명)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                maxLength={20}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                기도제목
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="기도제목을 적어주세요"
                rows={4}
                maxLength={500}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition resize-none"
              />
              <p className="text-right text-xs text-gray-400 mt-1">{content.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                카드 색상
              </label>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setColor(c.key)}
                    className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center text-lg transition-all cursor-pointer ${
                      color === c.key
                        ? 'ring-2 ring-offset-2 ring-amber-400 scale-110'
                        : 'hover:scale-105'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting
                ? (isEditing ? '수정하는 중...' : '올리는 중...')
                : (isEditing ? '수정하기' : '올리기 🙏')}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
