import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { formatRupiah, calcProgress, daysLeft, getCategoryEmoji, getStatusColor } from '../utils/helpers'
import toast from 'react-hot-toast'

const TABS = ['all', 'active', 'completed', 'missed']

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  const fetchGoals = async (status) => {
    setLoading(true)
    try {
      const params = status !== 'all' ? { status } : {}
      const res = await api.get('/goals', { params })
      setGoals(res.data.goals)
    } catch {
      toast.error('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGoals(activeTab) }, [activeTab])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return
    try {
      await api.delete(`/goals/${id}`)
      toast.success('Goal deleted')
      fetchGoals(activeTab)
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-gray-800"><svg className="w-8 h-8 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Goals Saya</h1>
          <p className="text-gray-500 text-sm mt-1">Lacak dan kelola impian tabungan Anda</p>
        </div>
        <Link to="/goals/new" className="btn-primary"><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> New Goal</Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl font-bold text-sm capitalize whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-500 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            {tab === 'all' ? <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> Semua</> : tab === 'active' ? <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Aktif</> : tab === 'completed' ? <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Selesai</> : <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Gagal</>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="text-4xl animate-float mb-3"><svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <p className="text-gray-400">Memuat goals...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4"><svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg></div>
          <h3 className="font-display text-xl text-gray-700 mb-2">Belum ada goals!</h3>
          <p className="text-gray-400 mb-4">Mulai dengan membuat goal tabungan pertama Anda</p>
          <Link to="/goals/new" className="btn-primary inline-flex text-sm"><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Buat Goal</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(goal => {
            const pct = calcProgress(goal.saved_amount, goal.target_amount)
            const dl = daysLeft(goal.deadline)
            return (
              <div key={goal.id} className="card card-hover group">
                {/* Category & Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryEmoji(goal.category)}</span>
                    <span className="text-xs font-bold text-gray-400 capitalize">{goal.category}</span>
                  </div>
                  <span className={`badge ${getStatusColor(goal.status)} capitalize`}>
                    {goal.status}
                  </span>
                </div>

                {/* Wishlist Image */}
                {goal.wishlist_image && (
                  <div className="mb-3 rounded-2xl overflow-hidden h-32">
                    <img src={goal.wishlist_image} alt={goal.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <h3 className="font-bold text-gray-800 text-lg mb-1">{goal.title}</h3>
                {goal.motivation_note && (
                  <p className="text-xs text-gray-400 italic mb-3 line-clamp-2">"{goal.motivation_note}"</p>
                )}

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                    <span>{formatRupiah(goal.saved_amount)}</span>
                    <span>{formatRupiah(goal.target_amount)}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 100 ? '#10B981' : pct >= 60 ? '#3B82F6' : pct >= 30 ? '#60A5FA' : '#BAE6FD'
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs font-bold text-primary-500">{pct}% saved</span>
                    <span className={`text-xs font-bold ${dl < 7 ? 'text-red-400' : 'text-gray-400'}`}>
                      {dl > 0 ? `${dl}d left` : 'Overdue'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/goals/${goal.id}`} className="btn-primary flex-1 text-xs py-2">View</Link>
                  <button onClick={() => handleDelete(goal.id)} className="btn-danger text-xs py-2 px-3"><svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
                <Link to={`/goals/${goal.id}`} className="block text-center text-xs text-primary-500 font-bold mt-2 group-hover:hidden">
                  Tap to view →
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
