import { useState } from 'react'
import Header from './components/Header'
import PrayerBoard from './components/PrayerBoard'
import PrayerForm from './components/PrayerForm'
import PrayerDetailModal from './components/PrayerDetailModal'

export default function App() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingPrayer, setEditingPrayer] = useState(null)
  const [selectedPrayer, setSelectedPrayer] = useState(null)

  function handleEdit(prayer) {
    setEditingPrayer(prayer)
    setFormOpen(true)
  }

  function handleClose() {
    setFormOpen(false)
    setEditingPrayer(null)
  }

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-cream">
      <Header />
      <PrayerBoard onEdit={handleEdit} onCardClick={setSelectedPrayer} />

      {/* FAB button */}
      <div className="sticky bottom-0 p-4 flex justify-center pointer-events-none">
        <button
          onClick={() => setFormOpen(true)}
          className="pointer-events-auto px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white font-bold shadow-lg shadow-amber-200/50 transition-all active:scale-95 cursor-pointer"
        >
          ✏️ 기도제목 쓰기
        </button>
      </div>

      <PrayerForm open={formOpen} onClose={handleClose} editingPrayer={editingPrayer} />
      <PrayerDetailModal prayer={selectedPrayer} open={!!selectedPrayer} onClose={() => setSelectedPrayer(null)} />
    </div>
  )
}
