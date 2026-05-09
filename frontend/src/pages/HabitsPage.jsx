import { useEffect, useState } from 'react'
import api from '../utils/api'
import { formatRupiah } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function HabitsPage() {
  const [habits, setHabits] = useState([])
  const [goals, setGoals] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ habit_name: '', cost: '', frequency: 'daily' })
  const [adding, setAdding] = useState(false)

  const fetchData = async () => {
    try {
      const [habitsRes, goalsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/goals', { params: { status: 'active' } })
      ])
      setHabits(habitsRes.data.habits)
      setGoals(goalsRes.data.goals)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const analyze = async () => {
    try {
      const res = await api.get('/habits/analyze', { params: selectedGoal ? { goal_id: selectedGoal } : {} })
      setAnalysis(res.data)
    } catch { toast.error('Failed to analyze') }
  }

  useEffect(() => { if (habits.length > 0) analyze() }, [habits, selectedGoal])

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await api.post('/habits', form)
      toast.success('Habit added! 📊')
      setForm({ habit_name: '', cost: '', frequency: 'daily' })
      fetchData()
    } catch { toast.error('Failed') }
    finally { setAdding(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/habits/${id}`)
      toast.success('Habit removed')
      fetchData()
    } catch { toast.error('Failed') }
  }

  const FREQ_EMOJI = { 
    daily: () => <svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, 
    weekly: () => <svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>, 
    monthly: () => <svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> 
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-gray-800">📊 Analisis Habits</h1>
        <p className="text-gray-500 text-sm mt-1">Lihat apa yang bisa Anda korbankan untuk mencapai tujuan Anda lebih cepat!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Habit */}
        <div>
          <div className="card mb-4">
            <h2 className="font-display text-xl text-gray-800 mb-4">➕ Tambah Habit</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="label">Habit Name</label>
                <input className="input-field" placeholder="e.g. Morning Coffee, Boba, Snacks"
                  value={form.habit_name} onChange={e => setForm({...form, habit_name: e.target.value})} required />
              </div>
              <div>
                <label className="label">Cost (Rp)</label>
                <input type="number" className="input-field" placeholder="e.g. 20000"
                  value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} required />
              </div>
              <div>
                <label className="label">Frequency</label>
                <select className="input-field" value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})}>
                  <option value="daily">📅 Daily</option>
                  <option value="weekly">📆 Weekly</option>
                  <option value="monthly">🗓️ Monthly</option>
                </select>
              </div>
              <button type="submit" disabled={adding} className="btn-primary w-full">
                {adding ? '⏳...' : '➕ Tambah Habit'}
              </button>
            </form>
          </div>

          {/* Habits list */}
          <div className="card">
            <h2 className="font-display text-xl text-gray-800 mb-4">📋 Habits Kamu</h2>
            {habits.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-400 text-sm">Tidak ada habits yang dilacak</p>
              </div>
            ) : (
              <div className="space-y-2">
                {habits.map(h => (
                  <div key={h.id} className="flex items-center justify-between p-3 bg-sky-50 rounded-2xl group">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{h.habit_name}</p>
                      <p className="text-xs text-gray-500">{FREQ_EMOJI[h.frequency]()} {formatRupiah(h.cost)} / {h.frequency}</p>
                    </div>
                    <button onClick={() => handleDelete(h.id)}
                      className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analysis */}
        <div>
          <div className="card">
            <h2 className="font-display text-xl text-gray-800 mb-4">🔍 Analysis</h2>

            {goals.length > 0 && (
              <div className="mb-4">
                <label className="label">Analisis Goal:</label>
                <select className="input-field" value={selectedGoal} onChange={e => setSelectedGoal(e.target.value)}>
                  <option value="">-- Semua Goal --</option>
                  {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>
            )}

            {analysis && analysis.habits.length > 0 ? (
              <div>
                <div className="bg-gradient-to-br from-primary-50 to-sky-50 rounded-2xl p-4 mb-4">
                  <h3 className="font-bold text-gray-700 text-sm mb-1">💡 Jika Anda memotong semua habits:</h3>
                  <p className="font-display text-2xl text-primary-600">
                    Simpan {formatRupiah(analysis.total_daily_savings_possible)}/hari
                  </p>
                  <p className="text-xs text-gray-500 mt-1">= {formatRupiah(analysis.total_daily_savings_possible * 30)}/bulan</p>
                </div>

                <div className="space-y-3">
                  {analysis.habits.map(h => (
                    <div key={h.id} className="border border-gray-100 rounded-2xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-gray-800">{h.habit_name}</p>
                        <span className="badge bg-peach-100 text-red-500 text-xs">
                          {formatRupiah(h.daily_cost)}/day
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-sky-50 rounded-xl p-2">
                          <p className="text-gray-400">Bulanan</p>
                          <p className="font-bold text-gray-700">{formatRupiah(h.monthly_cost)}</p>
                        </div>
                        <div className="bg-sky-50 rounded-xl p-2">
                          <p className="text-gray-400">Tahunan</p>
                          <p className="font-bold text-gray-700">{formatRupiah(h.yearly_cost)}</p>
                        </div>
                      </div>
                      {h.days_to_achieve_goal && (
                        <p className="mt-2 text-xs font-bold text-mint-600 bg-mint-100 rounded-xl p-2">
                          🎯 Memotong ini akan membantu Anda mencapai goal dalam {h.days_to_achieve_goal} hari!
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">📊</div>
                <p className="text-gray-400 font-medium">Tambahkan habits untuk melihat analisis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
