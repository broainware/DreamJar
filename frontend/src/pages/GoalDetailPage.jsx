import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import { formatRupiah, calcProgress, daysLeft, calcDailyNeeded, getCategoryEmoji, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

const REFLECTION_REASONS = [
  { key: 'too_ambitious', label: () => <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Target terlalu ambisius</> },
  { key: 'inconsistent', label: () => <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.88-5.875-2.29M12 7v.01" /></svg> Tabungan tidak konsisten</> },
  { key: 'unexpected_expense', label: () => <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg> Pengeluaran tidak terduga</> },
  { key: 'lost_motivation', label: () => <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.88-5.875-2.29M12 7v.01" /></svg> Kehilangan motivasi</> },
]

export default function GoalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [goal, setGoal] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [addForm, setAddForm] = useState({ amount: '', date: new Date().toISOString().split('T')[0], note: '' })
  const [adding, setAdding] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showMissedForm, setShowMissedForm] = useState(false)
  const [reflection, setReflection] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({})

  const fetchData = async () => {
    try {
      const [goalRes, txRes] = await Promise.all([
        api.get(`/goals/${id}`),
        api.get('/transactions', { params: { goal_id: id } })
      ])
      setGoal(goalRes.data.goal)
      setTransactions(txRes.data.transactions)
      setEditForm({
        title: goalRes.data.goal.title,
        target_amount: goalRes.data.goal.target_amount,
        deadline: goalRes.data.goal.deadline?.split('T')[0],
        category: goalRes.data.goal.category,
        motivation_note: goalRes.data.goal.motivation_note,
        wishlist_image: goalRes.data.goal.wishlist_image,
      })
    } catch { toast.error('Failed to load goal') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [id])

  const handleAddSaving = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      const res = await api.post('/transactions', { goal_id: id, ...addForm })
      toast.success(`💰 +${formatRupiah(addForm.amount)} saved! +${res.data.coins_earned} coins 🪙`)
      if (res.data.goal_completed) {
        toast.success('🎉 GOAL SELESAI! Selamat!')
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } })
        setShowCelebration(true)
      }
      setAddForm({ amount: '', date: new Date().toISOString().split('T')[0], note: '' })
      setShowAddForm(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add saving')
    } finally { setAdding(false) }
  }

  const handleComplete = async () => {
    try {
      await api.post(`/goals/${id}/complete`)
      confetti({ particleCount: 300, spread: 160, origin: { y: 0.5 } })
      toast.success('🏆 Goal selesai! Luar biasa!')
      setShowCelebration(true)
      fetchData()
    } catch { toast.error('Gagal menyelesaikan goal') }
  }

  const handleMissed = async () => {
    if (!reflection) { toast.error('Please select a reflection reason'); return }
    try {
      await api.post(`/goals/${id}/missed`, { reflection_reason: reflection })
      toast.success('Goal marked as missed. You can do better next time! 💪')
      setShowMissedForm(false)
      fetchData()
    } catch { toast.error('Gagal menandai goal sebagai tertunda') }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/goals/${id}`, editForm)
      toast.success('Goal updated!')
      setEditMode(false)
      fetchData()
    } catch { toast.error('Gagal memperbarui goal') }
  }

  const handleDeleteTx = async (txId) => {
    try {
      await api.delete(`/transactions/${txId}`)
      toast.success('Transaction deleted')
      fetchData()
    } catch { toast.error('Gagal menghapus transaksi') }
  }

  if (loading) return (
    <div className="page-wrapper flex items-center justify-center min-h-[60vh]">
      <div className="text-center"><div className="text-5xl animate-float mb-3">🎯</div><p className="text-gray-400">Memuat...</p></div>
    </div>
  )
  if (!goal) return (
    <div className="page-wrapper text-center py-16">
      <p className="text-gray-400">Goal not found</p>
      <Link to="/goals" className="btn-primary mt-4 inline-flex">Kembali ke Goal</Link>
    </div>
  )

  const pct = calcProgress(goal.saved_amount, goal.target_amount)
  const dl = daysLeft(goal.deadline)
  const dailyNeeded = calcDailyNeeded(goal.target_amount, goal.saved_amount, goal.deadline)

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card max-w-sm w-full text-center animate-slide-up">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="font-display text-3xl text-primary-600 mb-2">Goal Selesai!</h2>
            <p className="text-gray-500 mb-4">Selamat! Kamu telah menyelesaikan goal-mu!</p>
            <div className="text-4xl mb-6">🎉🐾🎉</div>
            <button onClick={() => { setShowCelebration(false); navigate('/goals') }} className="btn-primary w-full">
              Kembali ke Goal 🚀
            </button>
          </div>
        </div>
      )}

      {/* Back */}
      <Link to="/goals" className="inline-flex items-center gap-2 text-primary-500 font-bold mb-5 hover:underline">
        ← Kembali ke Goal
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main */}
        <div className="md:col-span-2 space-y-4">
          {editMode ? (
            <div className="card">
              <h2 className="font-display text-xl text-gray-800 mb-4">✏️ Edit Goal</h2>
              <form onSubmit={handleEdit} className="space-y-4">
                <div><label className="label">Judul</label><input className="input-field" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} required /></div>
                <div><label className="label">Target</label><input type="number" className="input-field" value={editForm.target_amount} onChange={e => setEditForm({...editForm, target_amount: e.target.value})} required /></div>
                <div><label className="label">Deadline</label><input type="date" className="input-field" value={editForm.deadline} onChange={e => setEditForm({...editForm, deadline: e.target.value})} required /></div>
                <div><label className="label">Catatan Motivasi</label><textarea className="input-field resize-none" rows={2} value={editForm.motivation_note || ''} onChange={e => setEditForm({...editForm, motivation_note: e.target.value})} /></div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditMode(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getCategoryEmoji(goal.category)}</span>
                  <div>
                    <h1 className="font-display text-2xl text-gray-800">{goal.title}</h1>
                    <span className={`badge capitalize ${goal.status === 'active' ? 'bg-primary-100 text-primary-600' : goal.status === 'completed' ? 'bg-mint-100 text-mint-600' : 'bg-red-100 text-red-500'}`}>
                      {goal.status}
                    </span>
                  </div>
                </div>
                {goal.status === 'active' && (
                  <button onClick={() => setEditMode(true)} className="text-primary-400 hover:text-primary-600 text-xl">✏️</button>
                )}
              </div>

              {goal.wishlist_image && (
                <img src={goal.wishlist_image} alt={goal.title} className="w-full h-48 object-cover rounded-2xl mb-4" />
              )}

              {goal.motivation_note && (
                <p className="text-gray-500 italic text-sm bg-sky-50 rounded-2xl p-3 mb-4">💭 "{goal.motivation_note}"</p>
              )}

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between font-bold text-lg mb-2">
                  <span className="text-primary-600">{formatRupiah(goal.saved_amount)}</span>
                  <span className="text-gray-400">{formatRupiah(goal.target_amount)}</span>
                </div>
                <div className="progress-bar h-5 mb-2">
                  <div className="progress-fill h-5 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${pct}%`, background: pct >= 100 ? '#10B981' : 'linear-gradient(90deg, #60A5FA, #3B82F6)' }}>
                    {pct > 20 && <span className="text-white text-xs font-bold">{pct}%</span>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-primary-50 rounded-xl p-2">
                    <p className="text-xs text-gray-400 font-medium">Remaining</p>
                    <p className="font-bold text-primary-600 text-sm">{formatRupiah(Math.max(goal.target_amount - goal.saved_amount, 0))}</p>
                  </div>
                  <div className="bg-lemon-100 rounded-xl p-2">
                    <p className="text-xs text-gray-400 font-medium">Days Left</p>
                    <p className={`font-bold text-sm ${dl < 0 ? 'text-red-500' : 'text-lemon-500'}`}>{dl}</p>
                  </div>
                  <div className="bg-mint-100 rounded-xl p-2">
                    <p className="text-xs text-gray-400 font-medium">Daily Need</p>
                    <p className="font-bold text-mint-600 text-sm">{formatRupiah(dailyNeeded)}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400">🗓️ Deadline: {formatDate(goal.deadline)}</p>
            </div>
          )}

          {/* Actions */}
          {goal.status === 'active' && (
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary flex-1">
                💰 Tambahkan Tabungan
              </button>
              {pct >= 100 && (
                <button onClick={handleComplete} className="btn-primary flex-1 bg-mint-500 hover:bg-mint-600">
                  🏆 Tandai Selesai
                </button>
              )}
              {dl < 0 && (
                <button onClick={() => setShowMissedForm(true)} className="btn-danger flex-1">
                  ❌ Tandai Gagal
                </button>
              )}
            </div>
          )}

          {/* Add Saving Form */}
          {showAddForm && (
            <div className="card border-2 border-primary-200 animate-slide-up">
              <h3 className="font-display text-lg text-gray-800 mb-4">💰 Tambahkan Tabungan</h3>
              <form onSubmit={handleAddSaving} className="space-y-3">
                <div>
                  <label className="label">Amount (Rp)</label>
                  <input type="number" min="1000" className="input-field"
                    placeholder="e.g. 50000"
                    value={addForm.amount} onChange={e => setAddForm({...addForm, amount: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Date</label>
                  <input type="date" className="input-field" value={addForm.date}
                    onChange={e => setAddForm({...addForm, date: e.target.value})} />
                </div>
                <div>
                  <label className="label">Note (optional)</label>
                  <input type="text" className="input-field" placeholder="What did you sacrifice?"
                    value={addForm.note} onChange={e => setAddForm({...addForm, note: e.target.value})} />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary flex-1">Batal</button>
                  <button type="submit" disabled={adding} className="btn-primary flex-1">
                    {adding ? '⏳...' : '✅ Simpan!'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Missed Form */}
          {showMissedForm && (
            <div className="card border-2 border-red-200 animate-slide-up">
              <h3 className="font-display text-xl text-red-500 mb-2">😔 Goal Gagal</h3>
              <p className="text-gray-500 text-sm mb-4">Tidak apa-apa! Mari kita refleksi dan bergerak maju 💪</p>
              <div className="grid grid-cols-1 gap-2 mb-4">
                {REFLECTION_REASONS.map(r => (
                  <button key={r.key} type="button" onClick={() => setReflection(r.key)}
                    className={`p-3 rounded-2xl border-2 text-left font-bold text-sm transition-all ${
                      reflection === r.key ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-200'
                    }`}>
                    {r.label()}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowMissedForm(false)} className="btn-secondary flex-1">Batal</button>
                <button onClick={handleMissed} className="btn-danger flex-1">Konfirmasi</button>
              </div>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div>
          <div className="card">
            <h3 className="font-display text-lg text-gray-800 mb-4">💸 Saving History</h3>
            {transactions.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">💸</div>
                <p className="text-gray-400 text-sm">Tidak ada transaksi yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-start justify-between p-3 bg-sky-50 rounded-2xl group">
                    <div>
                      <p className="font-bold text-mint-600 text-sm">+{formatRupiah(tx.amount)}</p>
                      <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
                      {tx.note && <p className="text-xs text-gray-500 italic mt-0.5">"{tx.note}"</p>}
                      <p className="text-xs text-primary-400 font-bold">+{tx.coins_earned}🪙 +{tx.xp_earned}XP</p>
                    </div>
                    <button onClick={() => handleDeleteTx(tx.id)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
