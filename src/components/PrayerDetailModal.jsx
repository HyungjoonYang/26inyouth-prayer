import { useState, useEffect, useRef } from 'react'
import { subscribeToComments, addComment } from '../firebase'

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

export default function PrayerDetailModal({ prayer, open, onClose }) {
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const commentsEndRef = useRef(null)

  useEffect(() => {
    if (!prayer) return
    setComments([])
    const unsubscribe = subscribeToComments(prayer.id, setComments)
    return unsubscribe
  }, [prayer?.id])

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [comments.length])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim() || submitting) return

    setSubmitting(true)
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10000)
      )
      await Promise.race([addComment(prayer.id, { name: name.trim(), content: content.trim() }), timeout])
      setContent('')
    } catch (err) {
      console.error('Failed to add comment:', err)
      alert('댓글 저장에 실패했어요. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!prayer) return null

  const bgClass = COLOR_MAP[prayer.color] || 'bg-pastel-yellow'

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="p-5 max-w-lg mx-auto w-full flex flex-col min-h-0 flex-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

          {/* Prayer content */}
          <div className={`${bgClass} rounded-2xl p-4 mb-4 shrink-0`}>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {prayer.name || '익명'}
              <span className="text-xs text-gray-400 font-normal ml-2">
                {formatDate(prayer.createdAt)}
              </span>
            </p>
            <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {prayer.content}
            </p>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto min-h-0 mb-3">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              댓글 {comments.length > 0 && <span className="text-amber-500">{comments.length}</span>}
            </p>
            {comments.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                아직 댓글이 없어요. 첫 댓글을 남겨보세요!
              </p>
            ) : (
              <div className="space-y-2">
                {comments.map((c) => (
                  <div key={c.id} className="bg-gray-50 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-gray-600">
                        {c.name || '익명'}
                      </span>
                      <span className="text-xs text-gray-300">
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                      {c.content}
                    </p>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>
            )}
          </div>

          {/* Comment form */}
          <form onSubmit={handleSubmit} className="flex gap-2 items-end shrink-0 pt-2 border-t border-gray-100">
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름 (비우면 익명)"
                maxLength={20}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-1 focus:ring-amber-200 mb-1.5"
              />
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="댓글을 입력하세요"
                maxLength={200}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
              />
            </div>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              {submitting ? '...' : '등록'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
